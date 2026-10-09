import AdvertEventType from "./AdvertEventType";
import AudioManager from "./AudioManager";
import CallAndroid from "./CallAndroid";
import CalliOS from "./CalliOS";
import EngineUtil from "./EngineUtil";
import EventMgr from "./EventMgr";
import SdkHelper from "./SdkHelper";
import TimeUtils from "./TimeUtils";

declare const i18n: any;

export default class AdManager {

    videoSuccessFun: any = null;
    videoFailFun: any = null;
    splash_timer: any = null;
    splash_finished = false;
    video_timer: any = null;
    pre_video_time = 0;
    cpm_data: any = null;
    adCloseEvent = false;
    adSwitch = true;
    lastTouchDate = 0;
    interval = 1.5;

    static _instance: AdManager = null;

    constructor() {
        this.addEvent();
    }

    static getInstance() {
        if (!this._instance) {
            this._instance = new AdManager();
        }
        return this._instance;
    }

    addEvent() {
        EventMgr.listen(AdvertEventType.SPLASH_SHOW, this.clearSplashTimer, this);
        EventMgr.listen(AdvertEventType.SPLASH_FINISH, this.splashFinish, this);
        EventMgr.listen(AdvertEventType.VIDEO_CLOSE, this.onVideoClose, this);
        EventMgr.listen(AdvertEventType.ONGETADINFO, this.onGetAdInfo, this);
        EventMgr.listen(AdvertEventType.VIDEO_OPEN_SUCCESS, this.onVideoOpensuccess, this);
    }

    closeHomeAd() {
    }

    onVideoError(data) {
        SdkHelper.reportData("on_vide_error", {
            type: data.type
        });
        this.doVideoFail(data);
    }

    playForceVideoAd(success, fail, music = "", toast = "看完广告可获大额奖励") {
        let now = new Date().getTime() / 1e3;
        if (now < this.lastTouchDate) {
            this.lastTouchDate = now;
        }
        if (this.lastTouchDate && now - this.lastTouchDate < this.interval) {
            console.log("强弹广告点击太频繁");
        } else {
            this.lastTouchDate = now;
            if (toast) {
                if (cc.sys.isNative) {
                    SdkHelper.showForceToast(toast);
                } else {
                    EngineUtil.showManageViewToast(toast);
                }
            }
            if (cc.sys.isNative && this.adSwitch) {
                if (music) {
                    AudioManager.getInstance().playMusic(music);
                }
                this.startVideoTimer();
                if (success) {
                    this.videoSuccessFun = success;
                }
                if (fail) {
                    this.videoFailFun = fail;
                }
                const data = {
                    slotId: 0,
                    is_force: true
                };
                if (cc.sys.os == cc.sys.OS_ANDROID) {
                    CallAndroid.getInstance().showRewardVideoAd(JSON.stringify(data));
                } else if (cc.sys.os == cc.sys.OS_IOS) {
                    data.slotId = 0;
                    CalliOS.getInstance().showRewardVideoAd(data);
                }
            } else {
                EngineUtil.localStorageSetItem("last_vd_time", String(TimeUtils.getTimeinSeconds()));
                success();
            }
        }
    }

    showBannerAd(bottom) {
        const frameSize = cc.view.getFrameSize();
        const winSize = cc.winSize;
        const scaleFix = frameSize.height > 2e3 ? 1.03 : 1;
        const width = .9135802469135802 * frameSize.width * scaleFix;
        const height = .25925925925925924 * frameSize.width * scaleFix;
        const pixelScale = frameSize.width / winSize.width;
        const y = (frameSize.width, (winSize.height - bottom) * pixelScale - height);
        const bannerHeight = bottom * pixelScale;
        CallAndroid.getInstance().showBannerAd(0, y, 0, bannerHeight, width, height);
    }

    doVideoFail(data) {
        const self = this;
        this.stopVideoTimer();
        if (this.videoFailFun) {
            setTimeout(function () {
                if (self.videoFailFun) {
                    self.videoFailFun(data);
                    self.videoFailFun = null;
                }
            }, 300);
        }
    }

    preLoadGraphicAd() {
    }

    stopVideoTimer() {
        if (this.video_timer) {
            clearTimeout(this.video_timer);
        }
    }

    startVideoTimer() {
        const self = this;
        if (this.video_timer) {
            clearTimeout(this.video_timer);
        }
        this.video_timer = setTimeout(function () {
            self.doVideoFail("广告超时5s");
        }, 5e3);
    }

    showSplashAd(bottom) {
        const self = this;
        if (cc.sys.isNative) {
            console.log("js showSplashAd");
            if (this.splash_timer) {
                clearTimeout(this.splash_timer);
            }
            this.splash_timer = setTimeout(function () {
                if (!self.splash_finished) {
                    EventMgr.trigger(AdvertEventType.SPLASH_FINISH);
                    console.log("js showSplashAd finish");
                }
            }, 5e3);
            if (cc.sys.os == cc.sys.OS_ANDROID) {
                CallAndroid.getInstance().showSplashAd(bottom);
            } else if (cc.sys.os == cc.sys.OS_IOS) {
                CalliOS.getInstance().showSplashAd({
                    bottom: bottom
                });
            }
            this.adCloseEvent = true;
        } else {
            EventMgr.trigger(AdvertEventType.SPLASH_FINISH);
        }
    }

    updateVideoTime() {
        this.pre_video_time = EngineUtil.getTimeStamp();
    }

    loadNewSplashAd(slot = 1, timeout = 0) {
        const self = this;
        console.log("js loadNewSplashAd: ");
        if (cc.sys.isNative) {
            if (this.splash_timer) {
                clearTimeout(this.splash_timer);
            }
            this.splash_timer = setTimeout(function () {
                if (!self.splash_finished) {
                    EventMgr.trigger(AdvertEventType.SPLASH_FINISH);
                }
            }, 5e3);
            if (cc.sys.os == cc.sys.OS_ANDROID) {
                CallAndroid.getInstance().loadNewSplashAd(slot, timeout);
            } else if (cc.sys.os == cc.sys.OS_IOS) {
                EventMgr.trigger(AdvertEventType.SPLASH_FINISH);
                return;
            }
            this.adCloseEvent = true;
        } else {
            EventMgr.trigger(AdvertEventType.SPLASH_FINISH);
        }
    }

    checkAdDelay() {
        let blocked = false;
        const last = Number(EngineUtil.localStorageGetItem("last_vd_time", 0));
        const passed = TimeUtils.getTimeinSeconds() - last;
        if (passed < 5) {
            const text = i18n.t("ad_toast_6", {
                0: 5 - passed
            });
            if (cc.sys.isNative) {
                SdkHelper.showToast(text);
            } else {
                EngineUtil.showManageViewToast(text);
            }
            blocked = true;
        }
        return blocked;
    }

    checkSpecialResume(reset) {
        if (!this.adCloseEvent) {
            return false;
        }
        if (reset) {
            this.adCloseEvent = false;
        }
        console.log("TEST NEW: CLOSE EVENT reset!!!");
        return true;
    }

    showGraphicAd(bottom) {
        const frameSize = cc.view.getFrameSize();
        const winSize = cc.winSize;
        console.log("frameSize", frameSize.width, frameSize.height);
        console.log("winSize", winSize.width, winSize.height);
        frameSize.height, frameSize.width;
        const width = frameSize.width - 40;
        const pixelScale = frameSize.width / winSize.width;
        const y = (frameSize.width, (winSize.height - bottom) * pixelScale);
        CallAndroid.getInstance().showImgAd(0, y, 0, 0, width, 0);
    }

    clearSplashTimer() {
        if (this.splash_timer) {
            clearTimeout(this.splash_timer);
        }
    }

    preLoadBannerAd() {
    }

    onGetAdInfo(data) {
        const date = EngineUtil.formatDate(new Date().getTime());
        data.activity_date = date;
        data.activity_num = SdkHelper.getActivityNumByDate(date);
        this.cpm_data = data;
    }

    preLoadHomeAd() {
    }

    playNormalVideoAd(success, fail, music = "", toast = "看完广告可获大额奖励") {
        let now = new Date().getTime() / 1e3;
        if (now < this.lastTouchDate) {
            this.lastTouchDate = now;
        }
        if (this.lastTouchDate && now - this.lastTouchDate < this.interval) {
            console.log("广告点击太频繁");
            if (fail) {
                fail();
            }
        } else {
            if (music) {
                AudioManager.getInstance().playMusic(music);
            }
            if (toast) {
                if (cc.sys.isNative) {
                    SdkHelper.showForceToast(toast);
                } else {
                    EngineUtil.showManageViewToast(toast);
                }
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
                const data = {
                    slotId: 0,
                    is_force: false
                };
                if (cc.sys.os == cc.sys.OS_ANDROID) {
                    SdkHelper.reportData("play_normal_ad");
                    CallAndroid.getInstance().showRewardVideoAd(JSON.stringify(data));
                } else if (cc.sys.os == cc.sys.OS_IOS) {
                    data.slotId = 0;
                    CalliOS.getInstance().showRewardVideoAd(data);
                }
            } else {
                EngineUtil.localStorageSetItem("last_vd_time", String(TimeUtils.getTimeinSeconds()));
                success();
            }
        }
    }

    onVideoClose(data) {
        const self = this;
        this.updateVideoTime();
        if (data.isReward) {
            this.stopVideoTimer();
            setTimeout(function () {
                if (self.videoSuccessFun) {
                    self.videoSuccessFun(data);
                    self.videoSuccessFun = null;
                }
                EngineUtil.localStorageSetItem("last_vd_time", String(TimeUtils.getTimeinSeconds()));
            }, 300);
        } else {
            EngineUtil.showManageViewToast("完整观看视频才能获得奖励");
            this.doVideoFail(data);
        }
        this.adCloseEvent = true;
    }

    showHomeAd() {
    }

    splashFinish() {
        this.splash_finished = true;
        EventMgr.trigger(AdvertEventType.ON_SPLASH_FINISH);
    }

    clear() {
        EventMgr.ignore(AdvertEventType.SPLASH_SHOW, this.clearSplashTimer, this);
        EventMgr.ignore(AdvertEventType.SPLASH_FINISH, this.clearSplashTimer, this);
    }

    getPreVideoTime() {
        return EngineUtil.getTimeStamp() - this.pre_video_time;
    }

    closeSplashAd() {
        if (cc.sys.isNative && cc.sys.os == cc.sys.OS_ANDROID) {
            CallAndroid.getInstance().closeSplashAd();
        }
    }

    onVideoOpensuccess() {
        this.stopVideoTimer();
    }
}
