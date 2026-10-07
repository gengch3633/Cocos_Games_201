import AdAnalyticsService from "./AdAnalyticsService";
import AdLegacyBridge from "./AdLegacyBridge";
import AdRequestService from "./AdRequestService";
import AdToolbox from "./AdToolbox";
import LanguageService from "./LanguageService";
import NativeSdkBridgeAdapter from "./NativeSdkBridgeAdapter";

export enum AD_TYPE {
    RELIVE = "relive",
    TURNTABLE = "turntable",
    LUCKY = "lucky",
    TASK = "task"
}

export default class AdManager {
    static LONG_TAP_TOAST_I18N_KEY = "key_tip_watch_video_claim_big_reward";
    static LONG_TAP_TOAST_FALLBACK = "观看视频即可领取大额奖励";
    private static _instance: AdManager = null;

    videoSuccessFun: Function = null;
    videoFailFun: Function = null;
    splash_timer: any = null;
    splash_finished: boolean = false;
    video_timer: any = null;
    pre_video_time: number = 0;
    cpm_data: any = {
        cpm: 0,
        source: "",
        unitId: "",
        isApp: "",
        isClose: "",
        activity_date: "",
        activity_num: ""
    };
    adCloseEvent: boolean = false;
    adSwitch: boolean = true;
    lastTouchDate: number = 0;
    interval: number = 1.5;
    insertFailTimer: any = null;
    failDesc: string = "";
    start_video_time: number = 0;
    end_video_time: number = 0;
    play_video_time: number = 0;
    is_finish: boolean = false;
    videoData: any = null;
    insertCloseFun: Function = null;

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
        AdLegacyBridge.listen(AdLegacyBridge.events.SPLASH_SHOW, this.clearSplashTimer, this);
        AdLegacyBridge.listen(AdLegacyBridge.events.SPLASH_FINISH, this.splashFinish, this);
        AdLegacyBridge.listen(AdLegacyBridge.events.VIDEO_CLOSE, this.onVideoClose, this);
        AdLegacyBridge.listen(AdLegacyBridge.events.VIDEO_ERROR, this.onVideoError, this);
        AdLegacyBridge.listen(AdLegacyBridge.events.ONGETADINFO, this.onUploadCpm, this);
        AdLegacyBridge.listen(AdLegacyBridge.events.INSERT_SHOW, this.showInsertAd, this);
        AdLegacyBridge.listen(AdLegacyBridge.events.INSERT_CHECK, this.checkInsert, this);
        AdLegacyBridge.listen(AdLegacyBridge.events.VIDEO_OPEN_SUCCESS, this.onVideoOpensuccess, this);
    }

    onUploadCpm(raw: string): void {
        let payload = null;
        if (raw) {
            payload = JSON.parse(raw);
        }
        AdAnalyticsService.reportData("onUploadCpm");
        AdAnalyticsService.reportData("onUploadCpmData", payload);
        const date = AdToolbox.formatDate(new Date().getTime());
        this.cpm_data.activity_date = date;
        this.cpm_data.cpm = Number(payload?.cpm || 0);
        this.cpm_data.source = payload?.source || "";
        this.cpm_data.unitId = payload?.unit_id || "";
        AdAnalyticsService.reportData("cpm_data", {
            cpm: this.cpm_data
        });
    }

    updateVideoTime(): void {
        this.pre_video_time = AdToolbox.nowSeconds();
    }

    getPreVideoTime(): number {
        return AdToolbox.nowSeconds() - this.pre_video_time;
    }

    clearSplashTimer(): void {
        if (this.splash_timer) {
            clearTimeout(this.splash_timer);
        }
    }

    splashFinish(): void {
        this.splash_finished = true;
        AdLegacyBridge.trigger(AdLegacyBridge.events.ON_SPLASH_FINISH);
    }

    showSplashAd(bottom: number): void {
        if (cc.sys.isNative) {
            if (this.splash_timer) {
                clearTimeout(this.splash_timer);
            }
            this.splash_timer = setTimeout(() => {
                if (!this.splash_finished) {
                    AdLegacyBridge.trigger(AdLegacyBridge.events.SPLASH_FINISH);
                }
            }, 5000);
            cc.sys.os == cc.sys.OS_ANDROID || cc.sys.os == cc.sys.OS_IOS && AdLegacyBridge.showSplashAd(0, bottom);
            this.adCloseEvent = true;
        } else {
            AdLegacyBridge.trigger(AdLegacyBridge.events.SPLASH_FINISH);
        }
    }

    closeSplashAd(): void {
        if (cc.sys.isNative) {
            cc.sys.os;
            cc.sys.OS_ANDROID;
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

    showLongTapToastBeforeVideoAd(): void {
        if (cc.sys.isNative && cc.sys.os === cc.sys.OS_ANDROID) {
            try {
                const message = LanguageService && typeof LanguageService.t === "function"
                    ? LanguageService.t(AdManager.LONG_TAP_TOAST_I18N_KEY, null, AdManager.LONG_TAP_TOAST_FALLBACK)
                    : AdManager.LONG_TAP_TOAST_FALLBACK;
                const bridge = NativeSdkBridgeAdapter && typeof NativeSdkBridgeAdapter.getBridge === "function"
                    ? NativeSdkBridgeAdapter.getBridge()
                    : null;
                if (bridge && typeof bridge.showAppLongTapToast === "function") {
                    bridge.showAppLongTapToast(message, 1);
                }
            } catch (e) {
                console.warn("[AdManager] showAppLongTapToast failed", e);
            }
        }
    }

    stopVideoTimer(): void {
        if (this.video_timer) {
            clearTimeout(this.video_timer);
        }
    }

    playForceVideoAd(videoData: any, onSuccess?: Function, onFail?: Function): void {
        this.videoData = videoData;
        if (cc.sys.isNative && this.adSwitch) {
            this.showLongTapToastBeforeVideoAd();
            this.start_video_time = AdToolbox.nowSeconds();
            this.startVideoTimer();
            if (onSuccess) {
                this.videoSuccessFun = onSuccess;
            }
            if (onFail) {
                this.videoFailFun = onFail;
            }
            const request = AdRequestService.buildRewardVideoRequest(true, 13356100);
            console.log("[AdManager] requestRewardVideo force adData->", request);
            AdRequestService.requestRewardVideo(request);
        } else {
            onSuccess && onSuccess();
            this.onVideoOpensuccess(videoData);
        }
    }

    playNormalVideoAd(videoData: any, onSuccess?: Function, onFail?: Function, failDesc: string = ""): void {
        this.videoData = videoData;
        let serialized = "";
        try {
            serialized = JSON.stringify(this.videoData || {});
        } catch (e) {
            serialized = "[unserializable videoData]";
        }
        console.log("[AdManager] playNormalVideoAd videoData->", this.videoData, "json=", serialized);
        const now = new Date().getTime() / 1000;
        if (now < this.lastTouchDate) {
            this.lastTouchDate = now;
        }
        if (this.lastTouchDate && now - this.lastTouchDate < this.interval) {
            AdToolbox.log("广告点击太频繁");
            onFail && onFail({
                type: "too_frequent"
            });
        } else {
            this.lastTouchDate = now;
            if (cc.sys.isNative && this.adSwitch) {
                this.failDesc = failDesc || null;
                this.showLongTapToastBeforeVideoAd();
                this.start_video_time = AdToolbox.nowSeconds();
                this.startVideoTimer();
                if (onSuccess) {
                    this.videoSuccessFun = onSuccess;
                }
                if (onFail) {
                    this.videoFailFun = onFail;
                }
                const forceVideo = !!(this.videoData && this.videoData.force_video);
                const slotId = forceVideo ? 13356100 : 13352100;
                const request = AdRequestService.buildRewardVideoRequest(forceVideo, slotId);
                console.log("[AdManager] requestRewardVideo normal adData->", request, "force_video=", forceVideo, "slotId=", slotId);
                AdRequestService.requestRewardVideo(request);
            } else {
                AdToolbox.localStorageSetItem("last_vd_time", String(AdToolbox.nowSeconds()));
                onSuccess && onSuccess();
                AdLegacyBridge.setInsertShowTime();
            }
        }
    }

    onVideoOpensuccess(raw: any): void {
        this.stopVideoTimer();
        AdToolbox.destroyAdManageToast();
        let payload = raw;
        if (typeof payload === "string") {
            try {
                payload = JSON.parse(payload);
            } catch (e) {
                payload = {};
            }
        }
        if (!payload || typeof payload !== "object") {
            payload = {};
        }
        const nested = payload?.ferryBulkTierAgate && typeof payload.ferryBulkTierAgate === "object"? payload.ferryBulkTierAgate : {}; const merged = Object.assign({}, nested, payload); this.cpm_data.activity_date = AdToolbox.formatDate(new Date().getTime()); if (merged.cpm !== undefined) { this.cpm_data.cpm = Number(merged.cpm || 0); } if (merged.source !== undefined || merged.dsp !== undefined) { this.cpm_data.source = merged.source || merged.dsp ||"";
        }
        if (merged.unit_id !== undefined || merged.unitId !== undefined) {
            this.cpm_data.unitId = merged.unit_id || merged.unitId || "";
        }
        if (merged.slot_id !== undefined || merged.slotId !== undefined) {
            this.cpm_data.slot_id = Number(merged.slot_id || merged.slotId || 0);
        }
        if (merged.placement_id !== undefined || merged.placementId !== undefined) {
            this.cpm_data.placement_id = merged.placement_id || merged.placementId || "";
        }
        if (merged.dsp !== undefined) {
            this.cpm_data.dsp = merged.dsp || "";
        }
        AdAnalyticsService.reportData("cpm_data", {
            cpm: this.cpm_data
        });
        if (this.videoData) {
            const adType = this.videoData.ad_type;
            const forceVideo = this.videoData.force_video;
            AdAnalyticsService.reportData("" + adType, {
                ad_type: adType,
                force_video: !!forceVideo
            });
        }
    }

    onVideoClose(event: any): void {
        this.updateVideoTime();
        const rewarded = event.compensationQualifyMark;
        this.end_video_time = AdToolbox.nowSeconds();
        this.play_video_time = this.end_video_time - this.start_video_time;
        this.is_finish = false;
        if (rewarded) {
            this.is_finish = true;
            AdAnalyticsService.reportData("on_video_finish", {
                ad_type: event,
                is_reward: rewarded
            });
        }
        this.stopVideoTimer();
        setTimeout(() => {
            if (this.videoSuccessFun) {
                console.log("有视频观看成功回调");
                this.videoSuccessFun(event);
                this.videoSuccessFun = null;
            }
            AdToolbox.localStorageSetItem("last_vd_time", String(AdToolbox.nowSeconds()));
        }, 300);
        AdLegacyBridge.setInsertShowTime();
        this.adCloseEvent = true;
    }

    onVideoError(error: any): void {
        AdAnalyticsService.reportData("on_vide_error", {
            type: error.type
        });
        this.doVideoFail(error);
    }

    doVideoFail(error: any): void {
        this.stopVideoTimer();
        if (this.videoFailFun) {
            setTimeout(() => {
                try {
                    console.log("videoFailFun==", this.videoFailFun, JSON.stringify(this.videoFailFun));
                    this.videoFailFun(error);
                } catch (e) {
                    console.log("videoFailFun==", e);
                }
                this.videoFailFun = null;
            }, 300);
        }
    }

    showInsertAd(onClose?: Function): void {
        AdToolbox.log("播放插屏android");
        if (cc.sys.isNative) {
            if (cc.sys.os == cc.sys.OS_ANDROID) {
                this.insertCloseFun = onClose || null;
                if (AdLegacyBridge.getInsertScreenFlag() != "s0") {
                    if (this.insertFailTimer) {
                        clearTimeout(this.insertFailTimer);
                        this.insertFailTimer = null;
                    }
                    this.insertFailTimer = setTimeout(() => {
                        AdLegacyBridge.resumeInsertTimer();
                    }, 4000);
                }
            }
        } else {
            onClose && onClose();
            console.log("web 播放插屏");
            if (AdLegacyBridge.getInsertScreenFlag() != "s0") {
                if (this.insertFailTimer) {
                    clearTimeout(this.insertFailTimer);
                    this.insertFailTimer = null;
                }
                this.insertFailTimer = setTimeout(() => {
                    AdLegacyBridge.resumeInsertTimer();
                }, 4000);
            }
        }
    }

    onInsertAdClick(): void {
        console.log("onInsertAdClick");
    }

    onInsertAdClose(): void {
        console.log("onInsertAdClose");
        this.insertCloseFun && this.insertCloseFun();
        AdLegacyBridge.resumeInsertTimer();
    }

    onInsertAdShow(): void {
        console.log("onInsertAdShow");
        AdLegacyBridge.pauseInsertTimer();
        if (this.insertFailTimer) {
            clearTimeout(this.insertFailTimer);
            this.insertFailTimer = null;
        }
        AdAnalyticsService.reportData("on_insertVideo_show");
    }

    preLoadGraphicAd(): void {
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

    showGraphicAd(): void {
        const frameSize = cc.view.getFrameSize();
        const winSize = cc.winSize;
        console.log("frameSize", frameSize.width, frameSize.height);
        console.log("winSize", winSize.width, winSize.height);
        frameSize.height;
        frameSize.width;
        frameSize.width;
        frameSize.width;
        winSize.width;
        frameSize.width;
        winSize.height;
    }

    preLoadHomeAd(): void {
    }

    showHomeAd(): void {
    }

    closeHomeAd(): void {
    }

    preLoadBannerAd(): void {
    }

    showBannerAd(): void {
        const frameSize = cc.view.getFrameSize();
        const winSize = cc.winSize;
        const scale = frameSize.height > 2000 ? 1.03 : 1;
        frameSize.width;
        frameSize.width;
        frameSize.width;
        winSize.width;
        frameSize.width;
        winSize.height;
        scale;
    }

    checkAdDelay(): boolean {
        let delayed = false;
        if (!cc.sys.isNative) {
            return false;
        }
        const lastTime = Number(AdToolbox.localStorageGetItem("last_vd_time", 0));
        const elapsed = AdToolbox.nowSeconds() - lastTime;
        if (elapsed < 10) {
            const message = "视频准备中，" + (10 - elapsed) + "秒后再试";
            if (!cc.sys.isNative) {
                AdToolbox.showManageViewToast(message);
            }
            delayed = true;
        }
        return delayed;
    }

    clear(): void {
        AdLegacyBridge.ignore(AdLegacyBridge.events.SPLASH_SHOW, this.clearSplashTimer, this);
        AdLegacyBridge.ignore(AdLegacyBridge.events.SPLASH_FINISH, this.clearSplashTimer, this);
    }

    loadNewSplashAd(retry: number = 1, bottom: number = 0): void {
        AdToolbox.log("js loadNewSplashAd: ");
        if (cc.sys.isNative) {
            if (this.splash_timer) {
                clearTimeout(this.splash_timer);
            }
            this.splash_timer = setTimeout(() => {
                if (!this.splash_finished) {
                    AdLegacyBridge.trigger(AdLegacyBridge.events.SPLASH_FINISH);
                }
            }, 5000);
            if (cc.sys.os == cc.sys.OS_ANDROID) {
            } else if (cc.sys.os == cc.sys.OS_IOS) {
                AdLegacyBridge.trigger(AdLegacyBridge.events.SPLASH_FINISH);
                return;
            }
            this.adCloseEvent = true;
        } else {
            AdLegacyBridge.trigger(AdLegacyBridge.events.SPLASH_FINISH);
        }
        retry;
        bottom;
    }

    checkInsert(): void {
    }
}
