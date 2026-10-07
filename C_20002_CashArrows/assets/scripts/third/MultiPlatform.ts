import AdLegacyBridge from "./AdLegacyBridge";
import AdManager from "./AdManager";
import ConfigMgr from "./ConfigMgr";
import GEMgr from "./GEMgr";
import LanguageService from "./LanguageService";
import { RewardVideoState } from "./Platform";
import Singleton from "./Singleton";
import Tips from "./Tips";
import UIMgr from "./UIMgr";
import UMengManger from "./UMengManger";
// Lazy-loaded to avoid circular dependency: UserData/UserAudioData -> UserArchive -> ArchiveMgr -> MultiPlatform
function getUserAudioData(): typeof import("./UserAudioData").default {
    return require("./UserAudioData").default;
}
function getUserData(): typeof import("./UserData").default {
    return require("./UserData").default;
}

export enum PlatformType {
    ByteDance = 0,
    WeChat = 1,
    Unknown = 2
}

class MultiPlatformInterface {
    event: cc.EventTarget = null;
    adConfig: any = null;
    _interface: any = null;

    get interface(): any {
        return this._interface;
    }

    get byteDancePlatform(): any {
        return this._interface;
    }

    get weChatPlatform(): any {
        return this._interface;
    }

    init(adConfig: any, event: cc.EventTarget): void {
        this.adConfig = adConfig;
        this.event = event;
        this._interface = null;
    }

    get platformType(): PlatformType {
        return cc.sys.platform == cc.sys.BYTEDANCE_GAME ? PlatformType.ByteDance : cc.sys.platform == cc.sys.WECHAT_GAME || cc.sys.platform == cc.sys.WECHAT_GAME_SUB ? PlatformType.WeChat : PlatformType.Unknown;
    }
}

export default class MultiPlatform extends Singleton {
    static EventType = {
        REWARED_VIDEO_SHOW: " MultiPlatform_Event_Before_Show ",
        REWARED_VIDEO_HIDE: " MultiPlatform_Event_Hide ",
        BEFORE_LOGIN: " MultiPlatform_Event_BEFORE_LOGIN ",
        LOGIN: " MultiPlatform_Event_LOGIN ",
        INIT_COMPLETE: " MultiPlatform_Event_INIT_COMPLETE ",
        OnShow: " MultiPlatform_Event_OnShow ",
        OnHide: " MultiPlatform_Event_OnHide "
    };

    adConfig: any = null;
    _multiPlatformInterface: MultiPlatformInterface = null;
    _userData: any = null;
    event: cc.EventTarget = new cc.EventTarget();
    skipShare: boolean = false;
    videoIndex: number = 1;

    get multiPlatformInterface(): MultiPlatformInterface {
        return this._multiPlatformInterface;
    }

    get platformType(): PlatformType {
        return this.multiPlatformInterface.platformType;
    }

    get appId(): string {
        return this._multiPlatformInterface?.interface?.appId ?? " ";
    }

    get userData(): any {
        return this._userData;
    }

    get userId(): number {
        return this._userData?.id ?? 0;
    }

    get openId(): string {
        return this._userData?.openId ?? null;
    }

    get vibrateEnabled(): boolean {
        return getUserAudioData().getInstance().vibrate;
    }

    init(config: any): void {
        config = Object.assign({}, config);
        this.adConfig = config;
        this._multiPlatformInterface = new MultiPlatformInterface();
        this._multiPlatformInterface.init(config, this.event);
        this.event.emit(MultiPlatform.EventType.INIT_COMPLETE);
    }

    async showRewardedVideoAd(adType: string, level: any): Promise<boolean> {
        if (await ConfigMgr.getInstance().checkMac()) {
            return true;
        }
        return new Promise((resolve) => {
            const rewardVideos = this.adConfig.rewardVideo;
            if (!rewardVideos || rewardVideos.length <= 0) {
                resolve(true);
            } else {
                UIMgr.getInstance().showWatingUI();
                this.event.emit(MultiPlatform.EventType.REWARED_VIDEO_SHOW, adType, level);
                this.reportVideo(adType, 0);
                const videoId = rewardVideos[this.videoIndex % rewardVideos.length];
                this.videoIndex++;
                this._multiPlatformInterface?.interface?.play(videoId, (state: RewardVideoState, ...args: any[]) => {
                    UIMgr.getInstance().hideWatingUI();
                    this.event.emit(MultiPlatform.EventType.REWARED_VIDEO_HIDE, adType, level, state);
                    if (state != RewardVideoState.PlaySuccess && state != RewardVideoState.CloseReward) {
                        // no report
                    } else {
                        this.reportVideo(adType, state == RewardVideoState.PlaySuccess ? 1 : 2);
                    }
                    if (state == RewardVideoState.CloseReward || state == RewardVideoState.Close || state == RewardVideoState.PlayErr) {
                        cc.audioEngine.resumeMusic();
                        cc.audioEngine.resumeAllEffects();
                        cc.game.resume();
                        if ((window as any).ZYSDK?.ZYSDK?.reportVideo) {
                            (window as any).ZYSDK.ZYSDK.reportVideo(state == RewardVideoState.CloseReward);
                        }
                        resolve(state == RewardVideoState.CloseReward);
                        GEMgr.trackEvent(" adNode ", {
                            adtype: adType,
                            adlevel: getUserData().getInstance().level
                        });
                        if (!cc.sys.isBrowser) {
                            GEMgr.ge.track(" userAction ", {
                                action: " AD_ " + adType,
                                module: " 关卡 " + getUserData().getInstance().level,
                                isAD: 1
                            }, new Date());
                        }
                        this.zyReportUserAction(" 关卡 " + getUserData().getInstance().level, adType, true);
                        if (state == RewardVideoState.PlayErr) {
                            Tips.show(LanguageService.t(" key_tip_reward_video_play_fail "));
                        }
                    } else if (state == RewardVideoState.PlaySuccess) {
                        cc.audioEngine.pauseMusic();
                        cc.audioEngine.pauseAllEffects();
                        cc.game.pause();
                    }
                });
            }
        });
    }

    showRewardedVideoAdByAdManager(adType: string, level: any): Promise<boolean> {
        return new Promise((resolve) => {
            const adManager = AdManager && AdManager.getInstance ? AdManager.getInstance() : null;
            let legacyBridge: any = null;
            let openSuccessHandler: any = null;
            if (adManager && typeof adManager.playNormalVideoAd === "function") {
                const now = new Date().getTime() / 1000;
                const interval = Number(adManager.interval || 1.5);
                if (adManager.lastTouchDate && now - adManager.lastTouchDate < interval) {
                    Tips.show(" 广告点击太频繁 ");
                    resolve(false);
                } else {
                    let handled = false;
                    const detachOpenSuccess = () => {
                        if (legacyBridge && openSuccessHandler) {
                            legacyBridge.ignore(legacyBridge.events.VIDEO_OPEN_SUCCESS, openSuccessHandler, this);
                            openSuccessHandler = null;
                        }
                    };
                    const handleState = (state: RewardVideoState, rewarded: boolean, payload?: any) => {
                        const isSuccess = state == RewardVideoState.PlaySuccess;
                        if (!handled || isSuccess) {
                            if (!isSuccess) {
                                handled = true;
                                detachOpenSuccess();
                                UIMgr.getInstance().hideWatingUI();
                            }
                            this.event.emit(MultiPlatform.EventType.REWARED_VIDEO_HIDE, adType, level, state, payload);
                            if (state != RewardVideoState.PlaySuccess && state != RewardVideoState.CloseReward) {
                                // no report
                            } else {
                                this.reportVideo(adType, state == RewardVideoState.PlaySuccess ? 1 : 2);
                            }
                            if (isSuccess) {
                                cc.audioEngine.pauseMusic();
                                cc.audioEngine.pauseAllEffects();
                                cc.game.pause();
                            } else {
                                cc.audioEngine.resumeMusic();
                                cc.audioEngine.resumeAllEffects();
                                cc.game.resume();
                                resolve(!!rewarded);
                                GEMgr.trackEvent(" adNode ", {
                                    adtype: adType,
                                    adlevel: getUserData().getInstance().level
                                });
                                if (!cc.sys.isBrowser) {
                                    GEMgr.ge.track(" userAction ", {
                                        action: " AD_ " + adType,
                                        module: " 关卡 " + getUserData().getInstance().level,
                                        isAD: 1
                                    }, new Date());
                                }
                                if (state == RewardVideoState.PlayErr) {
                                    Tips.show(" 激励视频播放失败, 请重试 ");
                                }
                            }
                        }
                    };
                    UIMgr.getInstance().showWatingUI();
                    this.event.emit(MultiPlatform.EventType.REWARED_VIDEO_SHOW, adType, level);
                    this.reportVideo(adType, 0);
                    legacyBridge = AdLegacyBridge || null;
                    if (legacyBridge && legacyBridge.events && typeof legacyBridge.listen === "function") {
                        openSuccessHandler = (payload: any) => {
                            handleState(RewardVideoState.PlaySuccess, false, payload);
                        };
                        legacyBridge.listen(legacyBridge.events.VIDEO_OPEN_SUCCESS, openSuccessHandler, this);
                    }
                    try {
                        adManager.playNormalVideoAd({
                            ad_type: adType || " reward_video ",
                            force_video: false
                        }, (result: any) => {
                            const rewarded = !!(result && result.compensationQualifyMark);
                            handleState(rewarded ? RewardVideoState.CloseReward : RewardVideoState.Close, rewarded, result);
                        }, (err: any) => {
                            handleState(RewardVideoState.PlayErr, false, err);
                        }, " 激励视频播放失败, 请重试 ");
                    } catch (err) {
                        console.error("[MultiPlatform] playNormalVideoAd failed ", err);
                        handleState(RewardVideoState.PlayErr, false, err);
                    }
                }
            } else {
                console.warn("[MultiPlatform] AdManager unavailable, fallback reward success ");
                resolve(true);
            }
        });
    }

    reportVideo(scene: string, state: number): void {
        const payload = {
            scene: scene,
            state: state
        };
        console.log(" video ", payload);
        UMengManger.getInstance().trackEvent(" video ", payload);
        if (this.platformType == PlatformType.ByteDance) {
            this.multiPlatformInterface?.byteDancePlatform?.reportAnalytics(" video ", payload);
        }
    }

    reportFightStart(level: number): void {
        const payload = { level: level };
        console.log(" fightStart ", payload);
        UMengManger.getInstance().trackEvent(" fightStart ", payload);
        if (this.platformType == PlatformType.ByteDance) {
            this.multiPlatformInterface?.byteDancePlatform?.reportAnalytics(" fightStart ", payload);
        }
    }

    reportFightEnd(level: number, isWin: boolean): void {
        const payload = {
            level: level,
            iswin: isWin
        };
        console.log(" fightEnd ", payload);
        UMengManger.getInstance().trackEvent(" fightEnd ", payload);
        if (this.platformType == PlatformType.ByteDance) {
            this.multiPlatformInterface?.byteDancePlatform?.reportAnalytics(" fightEnd ", payload);
        }
    }

    reportTask(taskId: any): void {
        const payload = { taskID: taskId };
        console.log(" task ", payload);
        UMengManger.getInstance().trackEvent(" task ", payload);
        if (this.platformType == PlatformType.ByteDance) {
            this.multiPlatformInterface?.byteDancePlatform?.reportAnalytics(" task ", payload);
        }
    }

    async share(options?: any): Promise<boolean> {
        if (!this._multiPlatformInterface?.interface) {
            return true;
        }
        if (this.skipShare) {
            return true;
        }
        options = options || {};
        if (this.platformType == PlatformType.ByteDance) {
            if (!this.adConfig.templateId) {
                console.error(" 未配置抖音平台分享模板 ");
            }
            options.templateId = this.adConfig.templateId;
        }
        return this._multiPlatformInterface?.interface?.share(options);
    }

    vibrateLong(): void {
        if (this.vibrateEnabled) {
            this._multiPlatformInterface?.interface?.vibrateLong();
        }
    }

    vibrateShort(): void {
        if (this.vibrateEnabled) {
            this._multiPlatformInterface?.interface?.vibrateShort();
        }
    }

    setClipboardData(data: string): any {
        return this._multiPlatformInterface?.interface?.setClipboardData(data);
    }

    getClipboardData(): any {
        return this._multiPlatformInterface?.interface?.getClipboardData();
    }

    login(): Promise<boolean> {
        return new Promise((resolve) => {
            this.event.emit(MultiPlatform.EventType.BEFORE_LOGIN);
            if (this._multiPlatformInterface?.interface) {
                this._multiPlatformInterface.interface.login().then((userData: any) => {
                    if (userData) {
                        this._userData = userData;
                        resolve(true);
                        this.event.emit(MultiPlatform.EventType.LOGIN, userData);
                    } else {
                        resolve(false);
                        this.event.emit(MultiPlatform.EventType.LOGIN, null);
                    }
                });
            } else {
                resolve(false);
                this.event.emit(MultiPlatform.EventType.LOGIN, null);
            }
        });
    }

    quit(): void {
        this._multiPlatformInterface?.interface?.quit();
    }

    get uma(): any {
        return this._multiPlatformInterface?.interface?.uma ?? null;
    }

    getStyleByNode(node: cc.Node): any {
        const worldPos = node.convertToWorldSpaceAR(cc.v2(0, 0));
        console.log(worldPos);
        const pixelRatio = cc.view.getDevicePixelRatio();
        const scaleX = cc.view.getScaleX();
        const scaleY = cc.view.getScaleY();
        const visibleHeight = cc.view.getVisibleSize().height;
        const left = (worldPos.x - node.height / 2) * scaleX / pixelRatio;
        const top = (visibleHeight - worldPos.y) * scaleY / pixelRatio - node.height;
        const width = node.width;
        const height = node.height;
        console.log(" style ", left, top, width, height);
        return {
            left: left,
            top: top,
            width: width,
            height: height
        };
    }

    async showInterstitialAd(): Promise<boolean> {
        console.log(" showInterstitialAd ");
        console.log(this.adConfig.inters);
        if (!this._multiPlatformInterface?.interface) {
            return false;
        }
        const shown = await this._multiPlatformInterface.interface.showInterstitialAd(this.adConfig.inters);
        if (shown) {
            GEMgr.trackEvent(" adNode ", {
                adtype: " 插屏广告 ",
                adlevel: getUserData().getInstance().level
            });
            if (!cc.sys.isBrowser) {
                GEMgr.ge.track(" userAction ", {
                    action: " AD_插屏广告 ",
                    module: " 关卡 " + getUserData().getInstance().level,
                    isAD: 1
                }, new Date());
            }
            return true;
        }
        return false;
    }

    showCustomAd(style: any): void {
        this._multiPlatformInterface?.interface?.showCustomAd(this.adConfig.custom, style);
    }

    hideCustomAd(): void {
        this._multiPlatformInterface?.interface?.hideCustomAd();
    }

    on(event: string, callback: Function, target?: any): void {
        this.event.on(event, callback, target);
    }

    once(event: string, callback: Function, target?: any): void {
        this.event.once(event, callback, target);
    }

    off(event: string, callback: Function, target?: any): void {
        this.event.off(event, callback, target);
    }

    targetOff(target: any): void {
        this.event.targetOff(target);
    }

    zyReportUserAction(module: string, action: string, isAd: boolean): void {
    }
}
