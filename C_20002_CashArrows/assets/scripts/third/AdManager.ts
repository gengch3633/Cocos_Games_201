import AdRequestService from "./AdRequestService";
import AdAnalyticsService from "./AdAnalyticsService";
import AdToolbox from "./AdToolbox";
import AdLegacyBridge from "./AdLegacyBridge";
import LanguageService from "./LanguageService";
import NativeSdkBridgeAdapter from "./NativeSdkBridgeAdapter";

export enum AD_TYPE {
    RELIVE = " relive ",
    TURNTABLE = " turntable ",
    LUCKY = " lucky ",
    TASK = " task "
}

export default class AdManager {
    static _instance: AdManager;
    static LONG_TAP_TOAST_I18N_KEY = " key_tip_watch_video_claim_big_reward ";
    static LONG_TAP_TOAST_FALLBACK = " 观看视频即可领取大额奖励 ";

    videoSuccessFun: any;
    videoFailFun: any;
    splash_timer: any;
    splash_finished: boolean;
    video_timer: any;
    pre_video_time: number;
    cpm_data: any;
    adCloseEvent: boolean;
    adSwitch: boolean;
    lastTouchDate: number;
    interval: number;
    insertFailTimer: any;
    failDesc: any;
    start_video_time: number;
    end_video_time: number;
    play_video_time: number;
    is_finish: boolean;
    videoData: any;
    insertCloseFun: any;

    constructor() {
        this.videoSuccessFun = null;
        this.videoFailFun = null;
        this.splash_timer = null;
        this.splash_finished = false;
        this.video_timer = null;
        this.pre_video_time = 0;
        this.cpm_data = {
            cpm: 0,
            source: " ",
            unitId: " ",
            isApp: " ",
            isClose: " ",
            activity_date: " ",
            activity_num: " "
        };
        this.adCloseEvent = false;
        this.adSwitch = true;
        this.lastTouchDate = 0;
        this.interval = 1.5;
        this.insertFailTimer = null;
        this.failDesc = " ";
        this.start_video_time = 0;
        this.end_video_time = 0;
        this.play_video_time = 0;
        this.is_finish = false;
        this.videoData = null;
        this.insertCloseFun = null;
        this.addEvent();
    }

    static getInstance() {
        this._instance || (this._instance = new AdManager());
        return this._instance;
    }

    addEvent() {
        AdLegacyBridge.listen(AdLegacyBridge.events.SPLASH_SHOW, this.clearSplashTimer, this);
        AdLegacyBridge.listen(AdLegacyBridge.events.SPLASH_FINISH, this.splashFinish, this);
        AdLegacyBridge.listen(AdLegacyBridge.events.VIDEO_CLOSE, this.onVideoClose, this);
        AdLegacyBridge.listen(AdLegacyBridge.events.VIDEO_ERROR, this.onVideoError, this);
        AdLegacyBridge.listen(AdLegacyBridge.events.ONGETADINFO, this.onUploadCpm, this);
        AdLegacyBridge.listen(AdLegacyBridge.events.INSERT_SHOW, this.showInsertAd, this);
        AdLegacyBridge.listen(AdLegacyBridge.events.INSERT_CHECK, this.checkInsert, this);
        AdLegacyBridge.listen(AdLegacyBridge.events.VIDEO_OPEN_SUCCESS, this.onVideoOpensuccess, this);
    }

    onUploadCpm(e: any) {
        var t = null;
        e && (t = JSON.parse(e));
        AdAnalyticsService.reportData(" onUploadCpm ");
        AdAnalyticsService.reportData(" onUploadCpmData ", t);
        var i = AdToolbox.formatDate(new Date().getTime());
        this.cpm_data.activity_date = i;
        this.cpm_data.cpm = Number((null == t ? void 0 : t.cpm) || 0);
        this.cpm_data.source = (null == t ? void 0 : t.source) || " ";
        this.cpm_data.unitId = (null == t ? void 0 : t.unit_id) || " ";
        AdAnalyticsService.reportData(" cpm_data ", {
            cpm: this.cpm_data
        });
    }

    updateVideoTime() {
        this.pre_video_time = AdToolbox.nowSeconds();
    }

    getPreVideoTime() {
        return AdToolbox.nowSeconds() - this.pre_video_time;
    }

    clearSplashTimer() {
        this.splash_timer && clearTimeout(this.splash_timer);
    }

    splashFinish() {
        this.splash_finished = true;
        AdLegacyBridge.trigger(AdLegacyBridge.events.ON_SPLASH_FINISH);
    }

    showSplashAd(e: any) {
        var t = this;
        if (cc.sys.isNative) {
            this.splash_timer && clearTimeout(this.splash_timer);
            this.splash_timer = setTimeout(function () {
                t.splash_finished || AdLegacyBridge.trigger(AdLegacyBridge.events.SPLASH_FINISH);
            }, 5e3);
            cc.sys.os == cc.sys.OS_ANDROID || cc.sys.os == cc.sys.OS_IOS && AdLegacyBridge.showSplashAd(0, e);
            this.adCloseEvent = true;
        } else AdLegacyBridge.trigger(AdLegacyBridge.events.SPLASH_FINISH);
    }

    closeSplashAd() {
        cc.sys.isNative && (cc.sys.os, cc.sys.OS_ANDROID);
    }

    startVideoTimer() {
        var e = this;
        this.video_timer && clearTimeout(this.video_timer);
        this.video_timer = setTimeout(function () {
            e.doVideoFail(" 广告超时5s ");
        }, 5e3);
    }

    showLongTapToastBeforeVideoAd() {
        if (cc.sys.isNative && cc.sys.os === cc.sys.OS_ANDROID) try {
            var t: any = LanguageService || null, i = t && "function" == typeof t.t ? t.t(AdManager.LONG_TAP_TOAST_I18N_KEY, null, AdManager.LONG_TAP_TOAST_FALLBACK) : AdManager.LONG_TAP_TOAST_FALLBACK, bridge: any = NativeSdkBridgeAdapter || null, a = bridge && "function" == typeof bridge.getBridge ? bridge.getBridge() : null;
            a && "function" == typeof a.showAppLongTapToast && a.showAppLongTapToast(i, 1);
        } catch (e) {
            console.warn("[AdManager] showAppLongTapToast failed ", e);
        }
    }

    stopVideoTimer() {
        this.video_timer && clearTimeout(this.video_timer);
    }

    playForceVideoAd(e: any, t: any, i: any) {
        this.videoData = e;
        if (cc.sys.isNative && this.adSwitch) {
            this.showLongTapToastBeforeVideoAd();
            this.start_video_time = AdToolbox.nowSeconds();
            this.startVideoTimer();
            t && (this.videoSuccessFun = t);
            i && (this.videoFailFun = i);
            var a = AdRequestService.buildRewardVideoRequest(true, 13356100);
            console.log("[AdManager] requestRewardVideo force adData- > ", a);
            AdRequestService.requestRewardVideo(a);
        } else {
            t();
            this.onVideoOpensuccess(e);
        }
    }

    playNormalVideoAd(e: any, t: any, i: any, a: any = " ") {
        this.videoData = e;
        var s = " ";
        try {
            s = JSON.stringify(this.videoData || {});
        } catch (e) {
            s = "[unserializable videoData] ";
        }
        console.log("[AdManager] playNormalVideoAd videoData- > ", this.videoData, " json = ", s);
        var l = new Date().getTime() / 1e3;
        l < this.lastTouchDate && (this.lastTouchDate = l);
        if (this.lastTouchDate && l - this.lastTouchDate < this.interval) {
            AdToolbox.log(" 广告点击太频繁 ");
            i && i({
                type: " too_frequent "
            });
        } else {
            this.lastTouchDate = l;
            if (cc.sys.isNative && this.adSwitch) {
                this.failDesc = a || null;
                this.showLongTapToastBeforeVideoAd();
                this.start_video_time = AdToolbox.nowSeconds();
                this.startVideoTimer();
                t && (this.videoSuccessFun = t);
                i && (this.videoFailFun = i);
                var c = !(!this.videoData || !this.videoData.force_video), u = c ? 13356100 : 13352100, d = AdRequestService.buildRewardVideoRequest(c, u);
                console.log("[AdManager] requestRewardVideo normal adData- > ", d, " force_video = ", c, " slotId = ", u);
                AdRequestService.requestRewardVideo(d);
            } else {
                AdToolbox.localStorageSetItem(" last_vd_time ", String(AdToolbox.nowSeconds()));
                t && t();
                AdLegacyBridge.setInsertShowTime();
            }
        }
    }

    onVideoOpensuccess(e: any) {
        this.stopVideoTimer();
        AdToolbox.destroyAdManageToast();
        var t = e;
        if ("string" == typeof t) try {
            t = JSON.parse(t);
        } catch (e) {
            t = {};
        }
        t && "object" == typeof t || (t = {});
        var i = (null == t ? void 0 : t.ferryBulkTierAgate) && "object" == typeof t.ferryBulkTierAgate ? t.ferryBulkTierAgate : {}, merged = Object.assign(Object.assign({}, i), t), dateText = AdToolbox.formatDate(new Date().getTime());
        this.cpm_data.activity_date = dateText;
        void 0 !== merged.cpm && (this.cpm_data.cpm = Number(merged.cpm || 0));
        void 0 === merged.source && void 0 === merged.dsp || (this.cpm_data.source = merged.source || merged.dsp || " ");
        void 0 === merged.unit_id && void 0 === merged.unitId || (this.cpm_data.unitId = merged.unit_id || merged.unitId || " ");
        void 0 === merged.slot_id && void 0 === merged.slotId || (this.cpm_data.slot_id = Number(merged.slot_id || merged.slotId || 0));
        void 0 === merged.placement_id && void 0 === merged.placementId || (this.cpm_data.placement_id = merged.placement_id || merged.placementId || " ");
        void 0 !== merged.dsp && (this.cpm_data.dsp = merged.dsp || " ");
        AdAnalyticsService.reportData(" cpm_data ", {
            cpm: this.cpm_data
        });
        if (this.videoData) {
            var video = this.videoData, l = video.ad_type, c = video.force_video;
            AdAnalyticsService.reportData(" " + l, {
                ad_type: l,
                force_video: !!c
            });
        }
    }

    onVideoClose(e: any) {
        var t = this;
        this.updateVideoTime();
        var i = e.compensationQualifyMark;
        this.end_video_time = AdToolbox.nowSeconds();
        this.play_video_time = this.end_video_time - this.start_video_time;
        this.is_finish = false;
        if (i) {
            this.is_finish = true;
            AdAnalyticsService.reportData(" on_video_finish ", {
                ad_type: e,
                is_reward: i
            });
        }
        this.stopVideoTimer();
        setTimeout(function () {
            if (t.videoSuccessFun) {
                console.log(" 有视频观看成功回调 ");
                t.videoSuccessFun(e);
                t.videoSuccessFun = null;
            }
            AdToolbox.localStorageSetItem(" last_vd_time ", String(AdToolbox.nowSeconds()));
        }, 300);
        AdLegacyBridge.setInsertShowTime();
        this.adCloseEvent = true;
    }

    onVideoError(e: any) {
        AdAnalyticsService.reportData(" on_vide_error ", {
            type: e.type
        });
        this.doVideoFail(e);
    }

    doVideoFail(e: any) {
        var t = this;
        this.stopVideoTimer();
        this.videoFailFun && setTimeout(function () {
            try {
                console.log(" videoFailFun == ", t.videoFailFun, JSON.stringify(t.videoFailFun));
                t.videoFailFun(e);
            } catch (e) {
                console.log(" videoFailFun == ", e);
            }
            t.videoFailFun = null;
        }, 300);
    }

    showInsertAd(e: any) {
        AdToolbox.log(" 播放插屏android ");
        if (cc.sys.isNative) {
            if (cc.sys.os == cc.sys.OS_ANDROID) {
                this.insertCloseFun = e || null;
                if (" s0 " != AdLegacyBridge.getInsertScreenFlag()) {
                    if (this.insertFailTimer) {
                        clearTimeout(this.insertFailTimer);
                        this.insertFailTimer = null;
                    }
                    this.insertFailTimer = setTimeout(function () {
                        AdLegacyBridge.resumeInsertTimer();
                    }, 4e3);
                }
            }
        } else {
            e && e();
            console.log(" web 播放插屏 ");
            if (" s0 " != AdLegacyBridge.getInsertScreenFlag()) {
                if (this.insertFailTimer) {
                    clearTimeout(this.insertFailTimer);
                    this.insertFailTimer = null;
                }
                this.insertFailTimer = setTimeout(function () {
                    AdLegacyBridge.resumeInsertTimer();
                }, 4e3);
            }
        }
    }

    onInsertAdClick() {
        console.log(" onInsertAdClick ");
    }

    onInsertAdClose() {
        console.log(" onInsertAdClose ");
        this.insertCloseFun && this.insertCloseFun();
        AdLegacyBridge.resumeInsertTimer();
    }

    onInsertAdShow() {
        console.log(" onInsertAdShow ");
        AdLegacyBridge.pauseInsertTimer();
        if (this.insertFailTimer) {
            clearTimeout(this.insertFailTimer);
            this.insertFailTimer = null;
        }
        AdAnalyticsService.reportData(" on_insertVideo_show ");
    }

    preLoadGraphicAd() {}

    checkSpecialResume(e: any) {
        if (!this.adCloseEvent) return false;
        e && (this.adCloseEvent = false);
        console.log(" TEST NEW: CLOSE EVENT reset ! ! ! ");
        return true;
    }

    showGraphicAd() {
        var e = cc.view.getFrameSize(), t = cc.winSize;
        console.log(" frameSize ", e.width, e.height);
        console.log(" winSize ", t.width, t.height);
        e.height, e.width;
        e.width, e.width, t.width;
        e.width, t.height;
    }

    preLoadHomeAd() {}

    showHomeAd() {}

    closeHomeAd() {}

    preLoadBannerAd() {}

    showBannerAd() {
        var e = cc.view.getFrameSize(), t = cc.winSize, i = e.height > 2e3 ? 1.03 : 1;
        e.width, e.width, e.width, t.width;
        e.width, t.height;
    }

    checkAdDelay() {
        var e = false;
        if (!cc.sys.isNative) return false;
        var t = Number(AdToolbox.localStorageGetItem(" last_vd_time ", 0)), i = AdToolbox.nowSeconds() - t;
        if (i < 10) {
            var msg = " 视频准备中 ， " + (10 - i) + " 秒后再试 ";
            cc.sys.isNative || AdToolbox.showManageViewToast(msg);
            e = true;
        }
        return e;
    }

    clear() {
        AdLegacyBridge.ignore(AdLegacyBridge.events.SPLASH_SHOW, this.clearSplashTimer, this);
        AdLegacyBridge.ignore(AdLegacyBridge.events.SPLASH_FINISH, this.clearSplashTimer, this);
    }

    loadNewSplashAd(e: any = 1, t: any = 0) {
        var i = this;
        AdToolbox.log(" js loadNewSplashAd: ");
        if (cc.sys.isNative) {
            this.splash_timer && clearTimeout(this.splash_timer);
            this.splash_timer = setTimeout(function () {
                i.splash_finished || AdLegacyBridge.trigger(AdLegacyBridge.events.SPLASH_FINISH);
            }, 5e3);
            if (cc.sys.os == cc.sys.OS_ANDROID) ; else if (cc.sys.os == cc.sys.OS_IOS) {
                AdLegacyBridge.trigger(AdLegacyBridge.events.SPLASH_FINISH);
                return;
            }
            this.adCloseEvent = true;
        } else AdLegacyBridge.trigger(AdLegacyBridge.events.SPLASH_FINISH);
    }

    checkInsert() {}
}
