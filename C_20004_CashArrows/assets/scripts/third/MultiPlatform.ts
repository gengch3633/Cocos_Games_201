import AdLegacyBridge from "./AdLegacyBridge";
import AdManager from "./AdManager";
import ConfigMgr from "./ConfigMgr";
import GEMgr from "./GEMgr";
import LanguageService from "./LanguageService";
import Platform from "./Platform";
import Singleton from "./Singleton";
import Tips from "./Tips";
import UIMgr from "./UIMgr";
import UMengManger from "./UMengManger";
import UserAudioData from "./UserAudioData";
import UserData from "./UserData";

declare const ZYSDK: any;

export enum PlatformType {
    ByteDance = 0,
    WeChat = 1,
    Unknown = 2
}

class MultiPlatformInterface {
    public event: any = null;
    public adConfig: any = null;
    private _interface: any = null;

    public get interface(): any {
        return this._interface;
    }

    public get byteDancePlatform(): any {
        return this._interface;
    }

    public get weChatPlatform(): any {
        return this._interface;
    }

    public init(adConfig: any, event: any): void {
        this.adConfig = adConfig;
        this.event = event;
        this._interface = null;
    }

    public get platformType(): PlatformType {
        const sys: any = cc.sys;
        if (sys.platform === sys.BYTEDANCE_GAME) {
            return PlatformType.ByteDance;
        }
        if (sys.platform === sys.WECHAT_GAME || sys.platform === sys.WECHAT_GAME_SUB) {
            return PlatformType.WeChat;
        }
        return PlatformType.Unknown;
    }
}

export default class MultiPlatform extends Singleton {
    public static EventType = {
        REWARED_VIDEO_SHOW: "MultiPlatform_Event_Before_Show",
        REWARED_VIDEO_HIDE: "MultiPlatform_Event_Hide",
        BEFORE_LOGIN: "MultiPlatform_Event_BEFORE_LOGIN",
        LOGIN: "MultiPlatform_Event_LOGIN",
        INIT_COMPLETE: "MultiPlatform_Event_INIT_COMPLETE",
        OnShow: "MultiPlatform_Event_OnShow",
        OnHide: "MultiPlatform_Event_OnHide"
    };

    public event: cc.EventTarget = new cc.EventTarget();

    private adConfig: any = null;
    private _multiPlatformInterface: MultiPlatformInterface = null;
    private _userData: any = null;
    private skipShare: boolean = false;
    private videoIndex: number = 1;

    public get multiPlatformInterface(): MultiPlatformInterface {
        return this._multiPlatformInterface;
    }

    public get platformType(): PlatformType {
        return this.multiPlatformInterface.platformType;
    }

    public get appId(): string {
        const platform = this._multiPlatformInterface && this._multiPlatformInterface.interface;
        return platform && platform.appId != null ? platform.appId : "";
    }

    public get userData(): any {
        return this._userData;
    }

    public get userId(): number {
        const data = this._userData;
        return data && data.id != null ? data.id : 0;
    }

    public get openId(): string {
        const data = this._userData;
        return data && data.openId != null ? data.openId : null;
    }

    public get vibrateEnabled(): boolean {
        return UserAudioData.getInstance().vibrate;
    }

    public init(adConfig: any): void {
        const config = Object.assign({}, adConfig);
        this.adConfig = config;
        this._multiPlatformInterface = new MultiPlatformInterface();
        this._multiPlatformInterface.init(config, this.event);
        this.event.emit(MultiPlatform.EventType.INIT_COMPLETE);
    }

    public async showRewardedVideoAd(mode: any, param?: any): Promise<boolean> {
        if (await ConfigMgr.getInstance().checkMac()) {
            return true;
        }
        return new Promise<boolean>((resolve) => {
            const rewardVideo = this.adConfig.rewardVideo;
            if (!rewardVideo || rewardVideo.length <= 0) {
                resolve(true);
                return;
            }
            UIMgr.getInstance().showWatingUI();
            this.event.emit(MultiPlatform.EventType.REWARED_VIDEO_SHOW, mode, param);
            this.reportVideo(mode, 0);
            const videoId = rewardVideo[this.videoIndex % rewardVideo.length];
            this.videoIndex++;
            const platform = this._multiPlatformInterface && this._multiPlatformInterface.interface;
            if (!platform) {
                return;
            }
            platform.play(videoId, (state: number) => {
                UIMgr.getInstance().hideWatingUI();
                this.event.emit(MultiPlatform.EventType.REWARED_VIDEO_HIDE, mode, param, state);
                if (state === Platform.RewardVideoState.PlaySuccess || state === Platform.RewardVideoState.CloseReward) {
                    this.reportVideo(mode, state === Platform.RewardVideoState.PlaySuccess ? 1 : 2);
                }
                if (state === Platform.RewardVideoState.CloseReward ||
                    state === Platform.RewardVideoState.Close ||
                    state === Platform.RewardVideoState.PlayErr) {
                    cc.audioEngine.resumeMusic();
                    cc.audioEngine.resumeAllEffects();
                    cc.game.resume();
                    ZYSDK.ZYSDK.reportVideo(state === Platform.RewardVideoState.CloseReward);
                    resolve(state === Platform.RewardVideoState.CloseReward);
                    GEMgr.trackEvent("adNode", {
                        adtype: mode,
                        adlevel: UserData.getInstance().level
                    });
                    if (!cc.sys.isBrowser) {
                        GEMgr.ge.track("userAction", {
                            action: "AD_" + mode,
                            module: "关卡" + UserData.getInstance().level,
                            isAD: 1
                        }, new Date());
                    }
                    (this as any).zyReportUserAction("关卡" + UserData.getInstance().level, mode, true);
                    if (state === Platform.RewardVideoState.PlayErr) {
                        Tips.show(LanguageService.t("key_tip_reward_video_play_fail"));
                    }
                } else if (state === Platform.RewardVideoState.PlaySuccess) {
                    cc.audioEngine.pauseMusic();
                    cc.audioEngine.pauseAllEffects();
                    cc.game.pause();
                }
            });
        });
    }

    public showRewardedVideoAdByAdManager(mode: any, param?: any): Promise<boolean> {
        return new Promise<boolean>((resolve) => {
            const adManager: any = (AdManager && typeof (AdManager as any).getInstance === "function")
                ? (AdManager as any).getInstance()
                : null;
            if (!adManager || typeof adManager.playNormalVideoAd !== "function") {
                console.warn("[MultiPlatform] AdManager unavailable, fallback reward success");
                resolve(true);
                return;
            }

            const now = new Date().getTime() / 1000;
            const interval = Number(adManager.interval || 1.5);
            if (adManager.lastTouchDate && now - adManager.lastTouchDate < interval) {
                Tips.show("广告点击太频繁");
                resolve(false);
                return;
            }

            let finished: boolean = false;
            let legacyBridge: any = null;
            let openCallback: any = null;

            const removeOpenListener = (): void => {
                if (legacyBridge && openCallback) {
                    legacyBridge.ignore(legacyBridge.events.VIDEO_OPEN_SUCCESS, openCallback, this);
                    openCallback = null;
                }
            };

            const onResult = (state: number, compensation: boolean, data?: any): void => {
                const isPlaySuccess = state === Platform.RewardVideoState.PlaySuccess;
                if (finished && !isPlaySuccess) {
                    return;
                }
                if (!isPlaySuccess) {
                    finished = true;
                    removeOpenListener();
                    UIMgr.getInstance().hideWatingUI();
                }
                this.event.emit(MultiPlatform.EventType.REWARED_VIDEO_HIDE, mode, param, state, data);
                if (isPlaySuccess || state === Platform.RewardVideoState.CloseReward) {
                    this.reportVideo(mode, isPlaySuccess ? 1 : 2);
                }
                if (isPlaySuccess) {
                    cc.audioEngine.pauseMusic();
                    cc.audioEngine.pauseAllEffects();
                    cc.game.pause();
                } else {
                    cc.audioEngine.resumeMusic();
                    cc.audioEngine.resumeAllEffects();
                    cc.game.resume();
                    resolve(!!compensation);
                    GEMgr.trackEvent("adNode", {
                        adtype: mode,
                        adlevel: UserData.getInstance().level
                    });
                    if (!cc.sys.isBrowser) {
                        GEMgr.ge.track("userAction", {
                            action: "AD_" + mode,
                            module: "关卡" + UserData.getInstance().level,
                            isAD: 1
                        }, new Date());
                    }
                    if (state === Platform.RewardVideoState.PlayErr) {
                        Tips.show("激励视频播放失败,请重试");
                    }
                }
            };

            UIMgr.getInstance().showWatingUI();
            this.event.emit(MultiPlatform.EventType.REWARED_VIDEO_SHOW, mode, param);
            this.reportVideo(mode, 0);

            legacyBridge = AdLegacyBridge ? (AdLegacyBridge as any) : null;
            if (legacyBridge && legacyBridge.events && typeof legacyBridge.listen === "function") {
                openCallback = (data: any): void => {
                    onResult(Platform.RewardVideoState.PlaySuccess, false, data);
                };
                legacyBridge.listen(legacyBridge.events.VIDEO_OPEN_SUCCESS, openCallback, this);
            }

            try {
                adManager.playNormalVideoAd({
                    ad_type: mode || "reward_video",
                    force_video: false
                }, (result: any) => {
                    const compensation = !!(result && result.compensationQualifyMark);
                    onResult(compensation ? Platform.RewardVideoState.CloseReward : Platform.RewardVideoState.Close, compensation, result);
                }, (err: any) => {
                    onResult(Platform.RewardVideoState.PlayErr, false, err);
                }, "激励视频播放失败,请重试");
            } catch (err) {
                console.error("[MultiPlatform] playNormalVideoAd failed", err);
                onResult(Platform.RewardVideoState.PlayErr, false, err);
            }
        });
    }

    public reportVideo(scene: any, state: number): void {
        const data = {
            scene: scene,
            state: state
        };
        console.log("video", data);
        UMengManger.getInstance().trackEvent("video", data);
        if (this.platformType === PlatformType.ByteDance) {
            const platform = this.multiPlatformInterface && this.multiPlatformInterface.byteDancePlatform;
            if (platform) {
                platform.reportAnalytics("video", data);
            }
        }
    }

    public reportFightStart(level: number): void {
        const data = {
            level: level
        };
        console.log("fightStart", data);
        UMengManger.getInstance().trackEvent("fightStart", data);
        if (this.platformType === PlatformType.ByteDance) {
            const platform = this.multiPlatformInterface && this.multiPlatformInterface.byteDancePlatform;
            if (platform) {
                platform.reportAnalytics("fightStart", data);
            }
        }
    }

    public reportFightEnd(level: number, iswin: boolean): void {
        const data = {
            level: level,
            iswin: iswin
        };
        console.log("fightEnd", data);
        UMengManger.getInstance().trackEvent("fightEnd", data);
        if (this.platformType === PlatformType.ByteDance) {
            const platform = this.multiPlatformInterface && this.multiPlatformInterface.byteDancePlatform;
            if (platform) {
                platform.reportAnalytics("fightEnd", data);
            }
        }
    }

    public reportTask(taskID: any): void {
        const data = {
            taskID: taskID
        };
        console.log("task", data);
        UMengManger.getInstance().trackEvent("task", data);
        if (this.platformType === PlatformType.ByteDance) {
            const platform = this.multiPlatformInterface && this.multiPlatformInterface.byteDancePlatform;
            if (platform) {
                platform.reportAnalytics("task", data);
            }
        }
    }

    public async share(param?: any): Promise<any> {
        const platform = this._multiPlatformInterface && this._multiPlatformInterface.interface;
        if (!platform) {
            return true;
        }
        if (this.skipShare) {
            return true;
        }
        const options = param || {};
        if (this.platformType === PlatformType.ByteDance) {
            if (!this.adConfig.templateId) {
                console.error("未配置抖音平台分享模板");
            }
            options.templateId = this.adConfig.templateId;
        }
        return platform.share(options);
    }

    public vibrateLong(): void {
        if (!this.vibrateEnabled) {
            return;
        }
        const platform = this._multiPlatformInterface && this._multiPlatformInterface.interface;
        if (platform) {
            platform.vibrateLong();
        }
    }

    public vibrateShort(): void {
        if (!this.vibrateEnabled) {
            return;
        }
        const platform = this._multiPlatformInterface && this._multiPlatformInterface.interface;
        if (platform) {
            platform.vibrateShort();
        }
    }

    public setClipboardData(data: string): void {
        const platform = this._multiPlatformInterface && this._multiPlatformInterface.interface;
        if (platform) {
            platform.setClipboardData(data);
        }
    }

    public getClipboardData(): any {
        const platform = this._multiPlatformInterface && this._multiPlatformInterface.interface;
        return platform ? platform.getClipboardData() : undefined;
    }

    public login(): Promise<boolean> {
        return new Promise<boolean>((resolve) => {
            this.event.emit(MultiPlatform.EventType.BEFORE_LOGIN);
            const platform = this._multiPlatformInterface && this._multiPlatformInterface.interface;
            if (!platform) {
                resolve(false);
                this.event.emit(MultiPlatform.EventType.LOGIN, null);
                return;
            }
            platform.login().then((userData: any) => {
                if (userData) {
                    this._userData = userData;
                    resolve(true);
                    this.event.emit(MultiPlatform.EventType.LOGIN, userData);
                } else {
                    resolve(false);
                    this.event.emit(MultiPlatform.EventType.LOGIN, null);
                }
            });
        });
    }

    public quit(): void {
        const platform = this._multiPlatformInterface && this._multiPlatformInterface.interface;
        if (platform) {
            platform.quit();
        }
    }

    public get uma(): any {
        const platform = this._multiPlatformInterface && this._multiPlatformInterface.interface;
        return platform && platform.uma != null ? platform.uma : null;
    }

    public getStyleByNode(node: cc.Node): { left: number; top: number; width: number; height: number } {
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
        console.log("style", left, top, width, height);
        return {
            left: left,
            top: top,
            width: width,
            height: height
        };
    }

    public async showInterstitialAd(): Promise<boolean | void> {
        console.log("showInterstitialAd");
        console.log(this.adConfig.inters);
        const platform = this._multiPlatformInterface && this._multiPlatformInterface.interface;
        if (!platform) {
            return false;
        }
        const result = await platform.showInterstitialAd(this.adConfig.inters);
        if (!result) {
            return false;
        }
        GEMgr.trackEvent("adNode", {
            adtype: "插屏广告",
            adlevel: UserData.getInstance().level
        });
        if (!cc.sys.isBrowser) {
            GEMgr.ge.track("userAction", {
                action: "AD_插屏广告",
                module: "关卡" + UserData.getInstance().level,
                isAD: 1
            }, new Date());
        }
        return;
    }

    public showCustomAd(param: any): void {
        const platform = this._multiPlatformInterface && this._multiPlatformInterface.interface;
        if (platform) {
            platform.showCustomAd(this.adConfig.custom, param);
        }
    }

    public hideCustomAd(): void {
        const platform = this._multiPlatformInterface && this._multiPlatformInterface.interface;
        if (platform) {
            platform.hideCustomAd();
        }
    }

    public on(type: string, callback: (...args: any[]) => void, target?: any): void {
        this.event.on(type, callback, target);
    }

    public once(type: string, callback: (...args: any[]) => void, target?: any): void {
        this.event.once(type, callback, target);
    }

    public off(type: string, callback?: (...args: any[]) => void, target?: any): void {
        this.event.off(type, callback, target);
    }

    public targetOff(target: any): void {
        this.event.targetOff(target);
    }
}