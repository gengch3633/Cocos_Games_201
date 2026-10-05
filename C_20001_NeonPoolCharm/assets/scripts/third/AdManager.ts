import AdvertEventType from "./AdvertEventType";
import CallAndroid from "./CallAndroid";
import CalliOS from "./CalliOS";
import AudioManager from "./AudioManager";
import EventMgr from "./EventMgr";
import SdkHelper from "./SdkHelper";
import EngineUtil from "./EngineUtil";
import TimeUtils from "./TimeUtils";

export default class AdManager {
    static _instance: AdManager = null;

    videoSuccessFun: (...args: any[]) => void = null;
    videoFailFun: (...args: any[]) => void = null;
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

    static getInstance(): AdManager {
        if (!AdManager._instance) {
            AdManager._instance = new AdManager();
        }
        return AdManager._instance;
    }

    addEvent(): void {
        EventMgr.listen(AdvertEventType.SPLASH_SHOW, this.clearSplashTimer, this);
        EventMgr.listen(AdvertEventType.SPLASH_FINISH, this.splashFinish, this);
        EventMgr.listen(AdvertEventType.VIDEO_CLOSE, this.onVideoClose, this);
        EventMgr.listen(AdvertEventType.ONGETADINFO, this.onGetAdInfo, this);
        EventMgr.listen(AdvertEventType.VIDEO_OPEN_SUCCESS, this.onVideoOpensuccess, this);
    }

    closeHomeAd(): void {}

    onVideoError(e: any): void {
        SdkHelper.reportData("on_vide_error", {
            type: e.type,
        });
        this.doVideoFail(e);
    }

    playForceVideoAd(e?: () => void, t?: (...args: any[]) => void, o: string = "", n: string = "看完广告可获大额奖励"): void {
        const l = new Date().getTime() / 1e3;
        if (l < this.lastTouchDate) {
            this.lastTouchDate = l;
        }
        if (this.lastTouchDate && l - this.lastTouchDate < this.interval) {
            console.log("强弹广告点击太频繁");
        } else {
            this.lastTouchDate = l;
            if (n) {
                cc.sys.isNative ? SdkHelper.showForceToast(n) : EngineUtil.showManageViewToast(n);
            }
            if (cc.sys.isNative && this.adSwitch) {
                if (o) {
                    AudioManager.getInstance().playMusic(o);
                }
                this.startVideoTimer();
                if (e) {
                    this.videoSuccessFun = e;
                }
                if (t) {
                    this.videoFailFun = t;
                }
                const p = {
                    slotId: 0,
                    is_force: true,
                };
                if (cc.sys.os == cc.sys.OS_ANDROID) {
                    CallAndroid.getInstance().showRewardVideoAd(JSON.stringify(p));
                } else if (cc.sys.os == cc.sys.OS_IOS) {
                    p.slotId = 0;
                    CalliOS.getInstance().showRewardVideoAd(p);
                }
            } else {
                EngineUtil.localStorageSetItem("last_vd_time", String(TimeUtils.getTimeinSeconds()));
                e && e();
            }
        }
    }

    showBannerAd(e: number): void {
        const t = cc.view.getFrameSize();
        const o = cc.winSize;
        const n = t.height > 2e3 ? 1.03 : 1;
        const a = 0.9135802469135802 * t.width * n;
        const r = 0.25925925925925924 * t.width * n;
        const l = t.width / o.width;
        const s = (o.height - e) * l - r;
        const c = e * l;
        CallAndroid.getInstance().showBannerAd(0, s, 0, c, a, r);
    }

    doVideoFail(e: any): void {
        this.stopVideoTimer();
        if (this.videoFailFun) {
            setTimeout(() => {
                if (this.videoFailFun) {
                    this.videoFailFun(e);
                    this.videoFailFun = null;
                }
            }, 300);
        }
    }

    preLoadGraphicAd(): void {}

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
        }, 5e3);
    }

    showSplashAd(e: any): void {
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
            }, 5e3);
            if (cc.sys.os == cc.sys.OS_ANDROID) {
                CallAndroid.getInstance().showSplashAd(e);
            } else if (cc.sys.os == cc.sys.OS_IOS) {
                CalliOS.getInstance().showSplashAd({
                    bottom: e,
                });
            }
            this.adCloseEvent = true;
        } else {
            EventMgr.trigger(AdvertEventType.SPLASH_FINISH);
        }
    }

    updateVideoTime(): void {
        this.pre_video_time = EngineUtil.getTimeStamp();
    }

    loadNewSplashAd(e: number = 1, t: number = 0): void {
        console.log("js loadNewSplashAd: ");
        if (cc.sys.isNative) {
            if (this.splash_timer) {
                clearTimeout(this.splash_timer);
            }
            this.splash_timer = setTimeout(() => {
                if (!this.splash_finished) {
                    EventMgr.trigger(AdvertEventType.SPLASH_FINISH);
                }
            }, 5e3);
            if (cc.sys.os == cc.sys.OS_ANDROID) {
                CallAndroid.getInstance().loadNewSplashAd(e, t);
            } else if (cc.sys.os == cc.sys.OS_IOS) {
                EventMgr.trigger(AdvertEventType.SPLASH_FINISH);
                return;
            }
            this.adCloseEvent = true;
        } else {
            EventMgr.trigger(AdvertEventType.SPLASH_FINISH);
        }
    }

    checkAdDelay(): boolean {
        let e = false;
        const t = Number(EngineUtil.localStorageGetItem("last_vd_time", 0));
        const o = TimeUtils.getTimeinSeconds() - t;
        if (o < 5) {
            const n = (i18n as any).t("ad_toast_6", {
                0: 5 - o,
            });
            cc.sys.isNative ? SdkHelper.showToast(n) : EngineUtil.showManageViewToast(n);
            e = true;
        }
        return e;
    }

    checkSpecialResume(e: boolean): boolean {
        if (!this.adCloseEvent) {
            return false;
        }
        if (e) {
            this.adCloseEvent = false;
        }
        console.log("TEST NEW: CLOSE EVENT reset!!!");
        return true;
    }

    showGraphicAd(e: number): void {
        const t = cc.view.getFrameSize();
        const o = cc.winSize;
        console.log("frameSize", t.width, t.height);
        console.log("winSize", o.width, o.height);
        const n = t.width - 40;
        const a = t.width / o.width;
        const r = (o.height - e) * a;
        CallAndroid.getInstance().showImgAd(0, r, 0, 0, n, 0);
    }

    clearSplashTimer(): void {
        if (this.splash_timer) {
            clearTimeout(this.splash_timer);
        }
    }

    preLoadBannerAd(): void {}

    onGetAdInfo(e: any): void {
        const t = EngineUtil.formatDate(new Date().getTime());
        e.activity_date = t;
        e.activity_num = SdkHelper.getActivityNumByDate(t);
        this.cpm_data = e;
    }

    preLoadHomeAd(): void {}

    playNormalVideoAd(e?: () => void, t?: (...args: any[]) => void, o: string = "", n: string = "看完广告可获大额奖励"): void {
        const l = new Date().getTime() / 1e3;
        if (l < this.lastTouchDate) {
            this.lastTouchDate = l;
        }
        if (this.lastTouchDate && l - this.lastTouchDate < this.interval) {
            console.log("广告点击太频繁");
            t && t();
        } else {
            if (o) {
                AudioManager.getInstance().playMusic(o);
            }
            if (n) {
                cc.sys.isNative ? SdkHelper.showForceToast(n) : EngineUtil.showManageViewToast(n);
            }
            this.lastTouchDate = l;
            if (cc.sys.isNative && this.adSwitch) {
                this.startVideoTimer();
                if (e) {
                    this.videoSuccessFun = e;
                }
                if (t) {
                    this.videoFailFun = t;
                }
                const p = {
                    slotId: 0,
                    is_force: false,
                };
                if (cc.sys.os == cc.sys.OS_ANDROID) {
                    SdkHelper.reportData("play_normal_ad");
                    CallAndroid.getInstance().showRewardVideoAd(JSON.stringify(p));
                } else if (cc.sys.os == cc.sys.OS_IOS) {
                    p.slotId = 0;
                    CalliOS.getInstance().showRewardVideoAd(p);
                }
            } else {
                EngineUtil.localStorageSetItem("last_vd_time", String(TimeUtils.getTimeinSeconds()));
                e && e();
            }
        }
    }

    onVideoClose(e: any): void {
        this.updateVideoTime();
        if (e.isReward) {
            this.stopVideoTimer();
            setTimeout(() => {
                if (this.videoSuccessFun) {
                    this.videoSuccessFun(e);
                    this.videoSuccessFun = null;
                }
                EngineUtil.localStorageSetItem("last_vd_time", String(TimeUtils.getTimeinSeconds()));
            }, 300);
        } else {
            EngineUtil.showManageViewToast("完整观看视频才能获得奖励");
            this.doVideoFail(e);
        }
        this.adCloseEvent = true;
    }

    showHomeAd(): void {}

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
        if (cc.sys.isNative && cc.sys.os == cc.sys.OS_ANDROID) {
            CallAndroid.getInstance().closeSplashAd();
        }
    }

    onVideoOpensuccess(): void {
        this.stopVideoTimer();
    }
}
