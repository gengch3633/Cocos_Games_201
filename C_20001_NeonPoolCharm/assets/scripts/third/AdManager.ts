import { AdvertEventType } from "./AdvertEventType";
import { AudioManager } from "./AudioManager";
import CallAndroid from "./CallAndroid";
import CalliOS from "./CalliOS";
import EngineUtil from "./EngineUtil";
import EventMgr from "./EventMgr";
import SdkHelper from "./SdkHelper";
import TimeUtils from "./TimeUtils";

export class AdManager {
    videoSuccessFun: (data?: any) => void = null;
    videoFailFun: (data?: any) => void = null;
    splash_timer: any = null;
    splash_finished: boolean = false;
    video_timer: any = null;
    pre_video_time: number = 0;
    cpm_data: any = null;
    adCloseEvent: boolean = false;
    adSwitch: boolean = true;
    lastTouchDate: number = 0;
    interval: number = 1.5;

    constructor() {
        this.addEvent();
    }

    static _instance: AdManager = null;

    static getInstance(): AdManager {
        if (!this._instance) {
            this._instance = new AdManager();
        }
        return this._instance;
    }

    addEvent(): void {
        EventMgr.listen(AdvertEventType.SPLASH_SHOW, this.clearSplashTimer, this);
        EventMgr.listen(AdvertEventType.SPLASH_FINISH, this.splashFinish, this);
        EventMgr.listen(AdvertEventType.VIDEO_CLOSE, this.onVideoClose, this);
        EventMgr.listen(AdvertEventType.ONGETADINFO, this.onGetAdInfo, this);
        EventMgr.listen(AdvertEventType.VIDEO_OPEN_SUCCESS, this.onVideoOpensuccess, this);
    }

    closeHomeAd(): void {
    }

    onVideoError(data: any): void {
        SdkHelper.reportData("on_vide_error", { type: data.type });
        this.doVideoFail(data);
    }

    playForceVideoAd(
        success?: (data?: any) => void,
        fail?: (data?: any) => void,
        musicName: string = "",
        toastMsg: string = "看完广告可获大额奖励"
    ): void {
        const now = new Date().getTime() / 1e3;
        if (now < this.lastTouchDate) {
            this.lastTouchDate = now;
        }
        if (this.lastTouchDate && now - this.lastTouchDate < this.interval) {
            console.log("强弹广告点击太频繁");
        } else {
            this.lastTouchDate = now;
            if (toastMsg) {
                cc.sys.isNative
                    ? SdkHelper.showForceToast(toastMsg)
                    : EngineUtil.showManageViewToast(toastMsg);
            }
            if (cc.sys.isNative && this.adSwitch) {
                if (musicName) {
                    AudioManager.getInstance().playMusic(musicName);
                }
                this.startVideoTimer();
                if (success) {
                    this.videoSuccessFun = success;
                }
                if (fail) {
                    this.videoFailFun = fail;
                }
                const params = { slotId: 0, is_force: true };
                if (cc.sys.os === cc.sys.OS_ANDROID) {
                    CallAndroid.getInstance().showRewardVideoAd(JSON.stringify(params));
                } else if (cc.sys.os === cc.sys.OS_IOS) {
                    params.slotId = 0;
                    CalliOS.getInstance().showRewardVideoAd(params);
                }
            } else {
                EngineUtil.localStorageSetItem("last_vd_time", String(TimeUtils.getTimeinSeconds()));
                success();
            }
        }
    }

    showBannerAd(bottom: number): void {
        const frameSize = cc.view.getFrameSize();
        const winSize = cc.winSize;
        const scale = frameSize.height > 2000 ? 1.03 : 1;
        const width = 0.9135802469135802 * frameSize.width * scale;
        const height = 0.25925925925925924 * frameSize.width * scale;
        const ratio = frameSize.width / winSize.width;
        const top = (winSize.height - bottom) * ratio - height;
        const y = bottom * ratio;
        CallAndroid.getInstance().showBannerAd(0, top, 0, y, width, height);
    }

    doVideoFail(data: any): void {
        this.stopVideoTimer();
        if (this.videoFailFun) {
            setTimeout(() => {
                if (this.videoFailFun) {
                    this.videoFailFun(data);
                    this.videoFailFun = null;
                }
            }, 300);
        }
    }

    preLoadGraphicAd(): void {
    }

    stopVideoTimer(): void {
        if (this.video_timer) {
            clearTimeout(this.video_timer);
        }
    }

    startVideoTimer(): void {
        if (this.video_timer) {
            clearTimeout(this.video_timer);
        }
        this.video_timer = setTimeout(() => {
            this.doVideoFail("广告超时5s");
        }, 5000);
    }

    showSplashAd(bottom: number): void {
        if (cc.sys.isNative) {
            console.log("js showSplashAd");
            if (this.splash_timer) {
                clearTimeout(this.splash_timer);
            }
            this.splash_timer = setTimeout(() => {
                if (!this.splash_finished) {
                    EventMgr.trigger(AdvertEventType.SPLASH_FINISH);
                    console.log("js showSplashAd finish");
                }
            }, 5000);
            if (cc.sys.os === cc.sys.OS_ANDROID) {
                CallAndroid.getInstance().showSplashAd(bottom);
            } else if (cc.sys.os === cc.sys.OS_IOS) {
                CalliOS.getInstance().showSplashAd({ bottom });
            }
            this.adCloseEvent = true;
        } else {
            EventMgr.trigger(AdvertEventType.SPLASH_FINISH);
        }
    }

    updateVideoTime(): void {
        this.pre_video_time = EngineUtil.getTimeStamp();
    }

    loadNewSplashAd(slotId: number = 1, param: number = 0): void {
        console.log("js loadNewSplashAd: ");
        if (cc.sys.isNative) {
            if (this.splash_timer) {
                clearTimeout(this.splash_timer);
            }
            this.splash_timer = setTimeout(() => {
                if (!this.splash_finished) {
                    EventMgr.trigger(AdvertEventType.SPLASH_FINISH);
                }
            }, 5000);
            if (cc.sys.os === cc.sys.OS_ANDROID) {
                CallAndroid.getInstance().loadNewSplashAd(slotId, param);
            } else if (cc.sys.os === cc.sys.OS_IOS) {
                EventMgr.trigger(AdvertEventType.SPLASH_FINISH);
                return;
            }
            this.adCloseEvent = true;
        } else {
            EventMgr.trigger(AdvertEventType.SPLASH_FINISH);
        }
    }

    checkAdDelay(): boolean {
        let blocked = false;
        const lastTime = Number(EngineUtil.localStorageGetItem("last_vd_time", 0));
        const elapsed = TimeUtils.getTimeinSeconds() - lastTime;
        if (elapsed < 5) {
            const msg = i18n.t("ad_toast_6", { 0: 5 - elapsed });
            cc.sys.isNative
                ? SdkHelper.showToast(msg)
                : EngineUtil.showManageViewToast(msg);
            blocked = true;
        }
        return blocked;
    }

    checkSpecialResume(reset: boolean): boolean {
        if (!this.adCloseEvent) {
            return false;
        }
        if (reset) {
            this.adCloseEvent = false;
        }
        console.log("TEST NEW: CLOSE EVENT reset!!!");
        return true;
    }

    showGraphicAd(bottom: number): void {
        const frameSize = cc.view.getFrameSize();
        const winSize = cc.winSize;
        console.log("frameSize", frameSize.width, frameSize.height);
        console.log("winSize", winSize.width, winSize.height);
        const width = frameSize.width - 40;
        const ratio = frameSize.width / winSize.width;
        const top = (winSize.height - bottom) * ratio;
        CallAndroid.getInstance().showImgAd(0, top, 0, 0, width, 0);
    }

    clearSplashTimer(): void {
        if (this.splash_timer) {
            clearTimeout(this.splash_timer);
        }
    }

    preLoadBannerAd(): void {
    }

    onGetAdInfo(data: any): void {
        const dateStr = EngineUtil.formatDate(new Date().getTime());
        data.activity_date = dateStr;
        data.activity_num = SdkHelper.getActivityNumByDate(dateStr);
        this.cpm_data = data;
    }

    preLoadHomeAd(): void {
    }

    playNormalVideoAd(
        success?: (data?: any) => void,
        fail?: (data?: any) => void,
        musicName: string = "",
        toastMsg: string = "看完广告可获大额奖励"
    ): void {
        const now = new Date().getTime() / 1e3;
        if (now < this.lastTouchDate) {
            this.lastTouchDate = now;
        }
        if (this.lastTouchDate && now - this.lastTouchDate < this.interval) {
            console.log("广告点击太频繁");
            if (fail) {
                fail();
            }
        } else {
            if (musicName) {
                AudioManager.getInstance().playMusic(musicName);
            }
            if (toastMsg) {
                cc.sys.isNative
                    ? SdkHelper.showForceToast(toastMsg)
                    : EngineUtil.showManageViewToast(toastMsg);
            }
            this.lastTouchDate = now;
            if (cc.sys.isNative && this.adSwitch) {
                this.startVideoTimer();
                if (success) {
                    this.videoSuccessFun = success;
                }
                if (fail) {
                    this.videoFailFun = fail;
                }
                const params = { slotId: 0, is_force: false };
                if (cc.sys.os === cc.sys.OS_ANDROID) {
                    SdkHelper.reportData("play_normal_ad");
                    CallAndroid.getInstance().showRewardVideoAd(JSON.stringify(params));
                } else if (cc.sys.os === cc.sys.OS_IOS) {
                    params.slotId = 0;
                    CalliOS.getInstance().showRewardVideoAd(params);
                }
            } else {
                EngineUtil.localStorageSetItem("last_vd_time", String(TimeUtils.getTimeinSeconds()));
                success();
            }
        }
    }

    onVideoClose(data: any): void {
        this.updateVideoTime();
        if (data.isReward) {
            this.stopVideoTimer();
            setTimeout(() => {
                if (this.videoSuccessFun) {
                    this.videoSuccessFun(data);
                    this.videoSuccessFun = null;
                }
                EngineUtil.localStorageSetItem("last_vd_time", String(TimeUtils.getTimeinSeconds()));
            }, 300);
        } else {
            EngineUtil.showManageViewToast("完整观看视频才能获得奖励");
            this.doVideoFail(data);
        }
        this.adCloseEvent = true;
    }

    showHomeAd(): void {
    }

    splashFinish(): void {
        this.splash_finished = true;
        EventMgr.trigger(AdvertEventType.ON_SPLASH_FINISH);
    }

    clear(): void {
        EventMgr.ignore(AdvertEventType.SPLASH_SHOW, this.clearSplashTimer, this);
        EventMgr.ignore(AdvertEventType.SPLASH_FINISH, this.clearSplashTimer, this);
    }

    getPreVideoTime(): number {
        return EngineUtil.getTimeStamp() - this.pre_video_time;
    }

    closeSplashAd(): void {
        if (cc.sys.isNative && cc.sys.os === cc.sys.OS_ANDROID) {
            CallAndroid.getInstance().closeSplashAd();
        }
    }

    onVideoOpensuccess(): void {
        this.stopVideoTimer();
    }
}

export default AdManager;
