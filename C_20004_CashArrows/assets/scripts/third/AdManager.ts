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
    private static _instance: AdManager = null;
    public static LONG_TAP_TOAST_I18N_KEY = "key_tip_watch_video_claim_big_reward";
    public static LONG_TAP_TOAST_FALLBACK = "观看视频即可领取大额奖励";

    private videoSuccessFun: ((data?: any) => void) = null;
    private videoFailFun: ((err?: any) => void) = null;
    private splash_timer: any = null;
    private splash_finished: boolean = false;
    private video_timer: any = null;
    private pre_video_time: number = 0;
    private cpm_data: { [key: string]: any } = {
        cpm: 0,
        source: "",
        unitId: "",
        isApp: "",
        isClose: "",
        activity_date: "",
        activity_num: ""
    };
    private adCloseEvent: boolean = false;
    private adSwitch: boolean = true;
    private lastTouchDate: number = 0;
    private interval: number = 1.5;
    private insertFailTimer: any = null;
    private failDesc: string = "";
    private start_video_time: number = 0;
    private end_video_time: number = 0;
    private play_video_time: number = 0;
    private is_finish: boolean = false;
    private videoData: any = null;
    private insertCloseFun: (() => void) = null;

    public static getInstance(): AdManager {
        if (!this._instance) {
            this._instance = new AdManager();
        }
        return this._instance;
    }

    public constructor() {
        this.addEvent();
    }

    public addEvent(): void {
        AdLegacyBridge.listen(AdLegacyBridge.events.SPLASH_SHOW, this.clearSplashTimer, this);
        AdLegacyBridge.listen(AdLegacyBridge.events.SPLASH_FINISH, this.splashFinish, this);
        AdLegacyBridge.listen(AdLegacyBridge.events.VIDEO_CLOSE, this.onVideoClose, this);
        AdLegacyBridge.listen(AdLegacyBridge.events.VIDEO_ERROR, this.onVideoError, this);
        AdLegacyBridge.listen(AdLegacyBridge.events.ONGETADINFO, this.onUploadCpm, this);
        AdLegacyBridge.listen(AdLegacyBridge.events.INSERT_SHOW, this.showInsertAd, this);
        AdLegacyBridge.listen(AdLegacyBridge.events.INSERT_CHECK, this.checkInsert, this);
        AdLegacyBridge.listen(AdLegacyBridge.events.VIDEO_OPEN_SUCCESS, this.onVideoOpensuccess, this);
    }

    public onUploadCpm(data: any): void {
        let info: any = null;
        if (data) {
            info = JSON.parse(data);
        }
        AdAnalyticsService.reportData("onUploadCpm");
        AdAnalyticsService.reportData("onUploadCpmData", info);
        const activityDate = AdToolbox.formatDate(new Date().getTime());
        this.cpm_data.activity_date = activityDate;
        this.cpm_data.cpm = Number((info?.cpm) || 0);
        this.cpm_data.source = (info?.source) || "";
        this.cpm_data.unitId = (info?.unit_id) || "";
        AdAnalyticsService.reportData("cpm_data", {
            cpm: this.cpm_data
        });
    }

    public updateVideoTime(): void {
        this.pre_video_time = AdToolbox.nowSeconds();
    }

    public getPreVideoTime(): number {
        return AdToolbox.nowSeconds() - this.pre_video_time;
    }

    public clearSplashTimer(): void {
        if (this.splash_timer) {
            clearTimeout(this.splash_timer);
        }
    }

    public splashFinish(): void {
        this.splash_finished = true;
        AdLegacyBridge.trigger(AdLegacyBridge.events.ON_SPLASH_FINISH);
    }

    public showSplashAd(bottom: any): void {
        if (cc.sys.isNative) {
            if (this.splash_timer) {
                clearTimeout(this.splash_timer);
            }
            this.splash_timer = setTimeout(() => {
                if (!this.splash_finished) {
                    AdLegacyBridge.trigger(AdLegacyBridge.events.SPLASH_FINISH);
                }
            }, 5000);
            if (cc.sys.os == cc.sys.OS_ANDROID || cc.sys.os == cc.sys.OS_IOS) {
                AdLegacyBridge.showSplashAd(0, bottom);
            }
            this.adCloseEvent = true;
        } else {
            AdLegacyBridge.trigger(AdLegacyBridge.events.SPLASH_FINISH);
        }
    }

    public closeSplashAd(): void {
        if (cc.sys.isNative) {
        }
    }

    public startVideoTimer(): void {
        if (this.video_timer) {
            clearTimeout(this.video_timer);
        }
        this.video_timer = setTimeout(() => {
            this.doVideoFail("广告超时5s");
        }, 5000);
    }

    public showLongTapToastBeforeVideoAd(): void {
        if (cc.sys.isNative && cc.sys.os === cc.sys.OS_ANDROID) {
            try {
                const lang: any = LanguageService || null;
                const text = lang && typeof lang.t === "function"
                    ? lang.t(AdManager.LONG_TAP_TOAST_I18N_KEY, null, AdManager.LONG_TAP_TOAST_FALLBACK)
                    : AdManager.LONG_TAP_TOAST_FALLBACK;
                const adapter: any = NativeSdkBridgeAdapter || null;
                const bridge = adapter && typeof adapter.getBridge === "function" ? adapter.getBridge() : null;
                if (bridge && typeof bridge.showAppLongTapToast === "function") {
                    bridge.showAppLongTapToast(text, 1);
                }
            } catch (e) {
                console.warn("[AdManager] showAppLongTapToast failed", e);
            }
        }
    }

    public stopVideoTimer(): void {
        if (this.video_timer) {
            clearTimeout(this.video_timer);
        }
    }

    public playForceVideoAd(videoData: any, success?: (data?: any) => void, fail?: (err?: any) => void): void {
        this.videoData = videoData;
        if (cc.sys.isNative && this.adSwitch) {
            this.showLongTapToastBeforeVideoAd();
            this.start_video_time = AdToolbox.nowSeconds();
            this.startVideoTimer();
            if (success) {
                this.videoSuccessFun = success;
            }
            if (fail) {
                this.videoFailFun = fail;
            }
            const request = AdRequestService.buildRewardVideoRequest(true, 13356100);
            console.log("[AdManager] requestRewardVideo force adData ->", request);
            AdRequestService.requestRewardVideo(request);
        } else {
            success();
            this.onVideoOpensuccess(videoData);
        }
    }

    public playNormalVideoAd(videoData: any, success?: (data?: any) => void, fail?: (err?: any) => void, failDesc: string = ""): void {
        this.videoData = videoData;
        let json = "";
        try {
            json = JSON.stringify(this.videoData || {});
        } catch (e) {
            json = "[unserializable videoData]";
        }
        console.log("[AdManager] playNormalVideoAd videoData ->", this.videoData, "json=", json);
        const now = new Date().getTime() / 1000;
        if (now < this.lastTouchDate) {
            this.lastTouchDate = now;
        }
        if (this.lastTouchDate && now - this.lastTouchDate < this.interval) {
            AdToolbox.log("广告点击太频繁");
            if (fail) {
                fail({
                    type: "too_frequent"
                });
            }
        } else {
            this.lastTouchDate = now;
            if (cc.sys.isNative && this.adSwitch) {
                this.failDesc = failDesc || null;
                this.showLongTapToastBeforeVideoAd();
                this.start_video_time = AdToolbox.nowSeconds();
                this.startVideoTimer();
                if (success) {
                    this.videoSuccessFun = success;
                }
                if (fail) {
                    this.videoFailFun = fail;
                }
                const isForce = !!(this.videoData && this.videoData.force_video);
                const slotId = isForce ? 13356100 : 13352100;
                const request = AdRequestService.buildRewardVideoRequest(isForce, slotId);
                console.log("[AdManager] requestRewardVideo normal adData ->", request, "force_video=", isForce, "slotId=", slotId);
                AdRequestService.requestRewardVideo(request);
            } else {
                AdToolbox.localStorageSetItem("last_vd_time", String(AdToolbox.nowSeconds()));
                if (success) {
                    success();
                }
                AdLegacyBridge.setInsertShowTime();
            }
        }
    }

    public onVideoOpensuccess(data: any): void {
        this.stopVideoTimer();
        AdToolbox.destroyAdManageToast();
        let info: any = data;
        if (typeof info === "string") {
            try {
                info = JSON.parse(info);
            } catch (e) {
                info = {};
            }
        }
        if (!info || typeof info !== "object") {
            info = {};
        }
        const extra = (info?.ferryBulkTierAgate) && typeof info.ferryBulkTierAgate === "object" ? info.ferryBulkTierAgate : {};
        const merged = Object.assign(Object.assign({}, extra), info);
        const activityDate = AdToolbox.formatDate(new Date().getTime());
        this.cpm_data.activity_date = activityDate;
        if (merged.cpm !== undefined) {
            this.cpm_data.cpm = Number(merged.cpm || 0);
        }
        if (!(merged.source === undefined && merged.dsp === undefined)) {
            this.cpm_data.source = merged.source || merged.dsp || "";
        }
        if (!(merged.unit_id === undefined && merged.unitId === undefined)) {
            this.cpm_data.unitId = merged.unit_id || merged.unitId || "";
        }
        if (!(merged.slot_id === undefined && merged.slotId === undefined)) {
            this.cpm_data.slot_id = Number(merged.slot_id || merged.slotId || 0);
        }
        if (!(merged.placement_id === undefined && merged.placementId === undefined)) {
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

    public onVideoClose(data: any): void {
        this.updateVideoTime();
        const compensationQualifyMark = data.compensationQualifyMark;
        this.end_video_time = AdToolbox.nowSeconds();
        this.play_video_time = this.end_video_time - this.start_video_time;
        this.is_finish = false;
        if (compensationQualifyMark) {
            this.is_finish = true;
            AdAnalyticsService.reportData("on_video_finish", {
                ad_type: data,
                is_reward: compensationQualifyMark
            });
        }
        this.stopVideoTimer();
        setTimeout(() => {
            if (this.videoSuccessFun) {
                console.log("有视频观看成功回调");
                this.videoSuccessFun(data);
                this.videoSuccessFun = null;
            }
            AdToolbox.localStorageSetItem("last_vd_time", String(AdToolbox.nowSeconds()));
        }, 300);
        AdLegacyBridge.setInsertShowTime();
        this.adCloseEvent = true;
    }

    public onVideoError(err: any): void {
        AdAnalyticsService.reportData("on_vide_error", {
            type: err.type
        });
        this.doVideoFail(err);
    }

    public doVideoFail(err: any): void {
        this.stopVideoTimer();
        if (this.videoFailFun) {
            setTimeout(() => {
                try {
                    console.log("videoFailFun==", this.videoFailFun, JSON.stringify(this.videoFailFun));
                    this.videoFailFun(err);
                } catch (e) {
                    console.log("videoFailFun==", e);
                }
                this.videoFailFun = null;
            }, 300);
        }
    }

    public showInsertAd(closeFun: any): void {
        AdToolbox.log("播放插屏android");
        if (cc.sys.isNative) {
            if (cc.sys.os == cc.sys.OS_ANDROID) {
                this.insertCloseFun = closeFun || null;
                if ("s0" != AdLegacyBridge.getInsertScreenFlag()) {
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
            if (closeFun) {
                closeFun();
            }
            console.log("web 播放插屏");
            if ("s0" != AdLegacyBridge.getInsertScreenFlag()) {
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

    public onInsertAdClick(): void {
        console.log("onInsertAdClick");
    }

    public onInsertAdClose(): void {
        console.log("onInsertAdClose");
        if (this.insertCloseFun) {
            this.insertCloseFun();
        }
        AdLegacyBridge.resumeInsertTimer();
    }

    public onInsertAdShow(): void {
        console.log("onInsertAdShow");
        AdLegacyBridge.pauseInsertTimer();
        if (this.insertFailTimer) {
            clearTimeout(this.insertFailTimer);
            this.insertFailTimer = null;
        }
        AdAnalyticsService.reportData("on_insertVideo_show");
    }

    public preLoadGraphicAd(): void {}

    public checkSpecialResume(consume?: boolean): boolean {
        if (!this.adCloseEvent) {
            return false;
        }
        if (consume) {
            this.adCloseEvent = false;
        }
        console.log("TEST NEW: CLOSE EVENT reset!!!");
        return true;
    }

    public showGraphicAd(): void {
        const frameSize = cc.view.getFrameSize();
        const winSize = cc.winSize;
        console.log("frameSize", frameSize.width, frameSize.height);
        console.log("winSize", winSize.width, winSize.height);
    }

    public preLoadHomeAd(): void {}

    public showHomeAd(): void {}

    public closeHomeAd(): void {}

    public preLoadBannerAd(): void {}

    public showBannerAd(): void {
        const frameSize = cc.view.getFrameSize();
        const winSize = cc.winSize;
        const ratio = frameSize.height > 2000 ? 1.03 : 1;
        console.log("banner", frameSize.width, winSize.width, winSize.height, ratio);
    }

    public checkAdDelay(): boolean {
        let delayed = false;
        if (!cc.sys.isNative) {
            return false;
        }
        const lastTime = Number(AdToolbox.localStorageGetItem("last_vd_time", "0"));
        const diff = AdToolbox.nowSeconds() - lastTime;
        if (diff < 10) {
            const message = "视频准备中，" + (10 - diff) + "秒后再试";
            AdToolbox.showManageViewToast(message);
            delayed = true;
        }
        return delayed;
    }

    public clear(): void {
        AdLegacyBridge.ignore(AdLegacyBridge.events.SPLASH_SHOW, this.clearSplashTimer, this);
        AdLegacyBridge.ignore(AdLegacyBridge.events.SPLASH_FINISH, this.clearSplashTimer, this);
    }

    public loadNewSplashAd(slotId: number = 1, bottom: number = 0): void {
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
            if (cc.sys.os == cc.sys.OS_IOS) {
                AdLegacyBridge.trigger(AdLegacyBridge.events.SPLASH_FINISH);
                return;
            }
            this.adCloseEvent = true;
        } else {
            AdLegacyBridge.trigger(AdLegacyBridge.events.SPLASH_FINISH);
        }
    }

    public checkInsert(): void {}
}