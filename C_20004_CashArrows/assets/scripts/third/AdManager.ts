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

interface CpmData {
    cpm: number;
    source: string;
    unitId: string;
    isApp?: string;
    isClose?: string;
    activity_date: string;
    activity_num: string;
    slot_id?: number;
    placement_id?: string;
    dsp?: string;
}

export default class AdManager {
    private static _instance: AdManager;
    public static readonly LONG_TAP_TOAST_I18N_KEY = "key_tip_watch_video_claim_big_reward";
    public static readonly LONG_TAP_TOAST_FALLBACK = "观看视频即可领取大额奖励";

    public videoSuccessFun: ((data?: any) => void) | null = null;
    public videoFailFun: ((err?: any) => void) | null = null;
    public splash_timer: number | null = null;
    public splash_finished: boolean = false;
    public video_timer: number | null = null;
    public pre_video_time: number = 0;
    public cpm_data: CpmData = {
        cpm: 0,
        source: "",
        unitId: "",
        isApp: "",
        isClose: "",
        activity_date: "",
        activity_num: ""
    };
    public adCloseEvent: boolean = false;
    public adSwitch: boolean = true;
    public lastTouchDate: number = 0;
    public interval: number = 1.5;
    public insertFailTimer: number | null = null;
    public failDesc: string = "";
    public start_video_time: number = 0;
    public end_video_time: number = 0;
    public play_video_time: number = 0;
    public is_finish: boolean = false;
    public videoData: any = null;
    public insertCloseFun: (() => void) | null = null;

    private constructor() {
        this.addEvent();
    }

    public static getInstance(): AdManager {
        if (!this._instance) {
            this._instance = new AdManager();
        }
        return this._instance;
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

    public onUploadCpm(e: string): void {
        let t: any = null;
        if (e) {
            t = JSON.parse(e);
        }
        AdAnalyticsService.reportData("onUploadCpm");
        AdAnalyticsService.reportData("onUploadCpmData", t);
        const i = AdToolbox.formatDate(new Date().getTime());
        this.cpm_data.activity_date = i;
        this.cpm_data.cpm = Number(t?.cpm || 0);
        this.cpm_data.source = t?.source || "";
        this.cpm_data.unitId = t?.unit_id || "";
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

    public showSplashAd(e: any): void {
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
                AdLegacyBridge.showSplashAd(0, e);
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
                const t: any = LanguageService;
                const i = t && typeof t.t === "function" ? t.t(AdManager.LONG_TAP_TOAST_I18N_KEY, null, AdManager.LONG_TAP_TOAST_FALLBACK) : AdManager.LONG_TAP_TOAST_FALLBACK;
                const n: any = NativeSdkBridgeAdapter;
                const a = n && typeof n.getBridge === "function" ? n.getBridge() : null;
                if (a && typeof a.showAppLongTapToast === "function") {
                    a.showAppLongTapToast(i, 1);
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

    public playForceVideoAd(e: any, t: () => void, i?: (err: any) => void): void {
        this.videoData = e;
        if (cc.sys.isNative && this.adSwitch) {
            this.showLongTapToastBeforeVideoAd();
            this.start_video_time = AdToolbox.nowSeconds();
            this.startVideoTimer();
            if (t) {
                this.videoSuccessFun = t;
            }
            if (i) {
                this.videoFailFun = i;
            }
            const a = AdRequestService.buildRewardVideoRequest(true, 13356100);
            console.log("[AdManager] requestRewardVideo force adData ->", a);
            AdRequestService.requestRewardVideo(a);
        } else {
            if (t) {
                t();
            }
            this.onVideoOpensuccess(e);
        }
    }

    public playNormalVideoAd(e: any, t?: () => void, i?: (err: any) => void, a: string = ""): void {
        this.videoData = e;
        let s = "";
        try {
            s = JSON.stringify(this.videoData || {});
        } catch (e) {
            s = "[unserializable videoData]";
        }
        console.log("[AdManager] playNormalVideoAd videoData ->", this.videoData, "json=", s);
        const l = new Date().getTime() / 1000;
        if (l < this.lastTouchDate) {
            this.lastTouchDate = l;
        }
        if (this.lastTouchDate && l - this.lastTouchDate < this.interval) {
            AdToolbox.log("广告点击太频繁");
            if (i) {
                i({ type: "too_frequent" });
            }
        } else {
            this.lastTouchDate = l;
            if (cc.sys.isNative && this.adSwitch) {
                this.failDesc = a || "";
                this.showLongTapToastBeforeVideoAd();
                this.start_video_time = AdToolbox.nowSeconds();
                this.startVideoTimer();
                if (t) {
                    this.videoSuccessFun = t;
                }
                if (i) {
                    this.videoFailFun = i;
                }
                const c = !!(this.videoData && this.videoData.force_video);
                const u = c ? 13356100 : 13352100;
                const d = AdRequestService.buildRewardVideoRequest(c, u);
                console.log("[AdManager] requestRewardVideo normal adData ->", d, "force_video=", c, "slotId=", u);
                AdRequestService.requestRewardVideo(d);
            } else {
                AdToolbox.localStorageSetItem("last_vd_time", String(AdToolbox.nowSeconds()));
                if (t) {
                    t();
                }
                AdLegacyBridge.setInsertShowTime();
            }
        }
    }

    public onVideoOpensuccess(e: any): void {
        this.stopVideoTimer();
        AdToolbox.destroyAdManageToast();
        let t = e;
        if (typeof t === "string") {
            try {
                t = JSON.parse(t);
            } catch (e) {
                t = {};
            }
        }
        if (!t || typeof t !== "object") {
            t = {};
        }
        const i = (t?.ferryBulkTierAgate && typeof t.ferryBulkTierAgate === "object") ? t.ferryBulkTierAgate : {};
        const n = { ...i, ...t };
        const r = AdToolbox.formatDate(new Date().getTime());
        this.cpm_data.activity_date = r;
        if (n.cpm !== undefined) {
            this.cpm_data.cpm = Number(n.cpm || 0);
        }
        if (n.source !== undefined || n.dsp !== undefined) {
            this.cpm_data.source = n.source || n.dsp || "";
        }
        if (n.unit_id !== undefined || n.unitId !== undefined) {
            this.cpm_data.unitId = n.unit_id || n.unitId || "";
        }
        if (n.slot_id !== undefined || n.slotId !== undefined) {
            this.cpm_data.slot_id = Number(n.slot_id || n.slotId || 0);
        }
        if (n.placement_id !== undefined || n.placementId !== undefined) {
            this.cpm_data.placement_id = n.placement_id || n.placementId || "";
        }
        if (n.dsp !== undefined) {
            this.cpm_data.dsp = n.dsp || "";
        }
        AdAnalyticsService.reportData("cpm_data", {
            cpm: this.cpm_data
        });
        if (this.videoData) {
            const s = this.videoData;
            const l = s.ad_type;
            const c = s.force_video;
            AdAnalyticsService.reportData("" + l, {
                ad_type: l,
                force_video: !!c
            });
        }
    }

    public onVideoClose(e: any): void {
        this.updateVideoTime();
        const i = e.compensationQualifyMark;
        this.end_video_time = AdToolbox.nowSeconds();
        this.play_video_time = this.end_video_time - this.start_video_time;
        this.is_finish = false;
        if (i) {
            this.is_finish = true;
            AdAnalyticsService.reportData("on_video_finish", {
                ad_type: e,
                is_reward: i
            });
        }
        this.stopVideoTimer();
        setTimeout(() => {
            if (this.videoSuccessFun) {
                console.log("有视频观看成功回调");
                this.videoSuccessFun(e);
                this.videoSuccessFun = null;
            }
            AdToolbox.localStorageSetItem("last_vd_time", String(AdToolbox.nowSeconds()));
        }, 300);
        AdLegacyBridge.setInsertShowTime();
        this.adCloseEvent = true;
    }

    public onVideoError(e: any): void {
        AdAnalyticsService.reportData("on_vide_error", {
            type: e.type
        });
        this.doVideoFail(e);
    }

    public doVideoFail(e: any): void {
        this.stopVideoTimer();
        if (this.videoFailFun) {
            setTimeout(() => {
                try {
                    console.log("videoFailFun==", this.videoFailFun, JSON.stringify(this.videoFailFun));
                    this.videoFailFun(e);
                } catch (e) {
                    console.log("videoFailFun==", e);
                }
                this.videoFailFun = null;
            }, 300);
        }
    }

    public showInsertAd(e?: () => void): void {
        AdToolbox.log("播放插屏android");
        if (cc.sys.isNative) {
            if (cc.sys.os == cc.sys.OS_ANDROID) {
                this.insertCloseFun = e || null;
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
            if (e) {
                e();
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

    public checkSpecialResume(e?: boolean): boolean {
        if (!this.adCloseEvent) {
            return false;
        }
        if (e) {
            this.adCloseEvent = false;
        }
        console.log("TEST NEW: CLOSE EVENT reset!!!");
        return true;
    }

    public showGraphicAd(): void {
        const e = cc.view.getFrameSize();
        const t = cc.winSize;
        console.log("frameSize", e.width, e.height);
        console.log("winSize", t.width, t.height);
    }

    public preLoadHomeAd(): void {}

    public showHomeAd(): void {}

    public closeHomeAd(): void {}

    public preLoadBannerAd(): void {}

    public showBannerAd(): void {}

    public checkAdDelay(): boolean {
        let e = false;
        if (!cc.sys.isNative) {
            return false;
        }
        const t = Number(AdToolbox.localStorageGetItem("last_vd_time", 0));
        const i = AdToolbox.nowSeconds() - t;
        if (i < 10) {
            const n = "视频准备中，" + (10 - i) + "秒后再试";
            if (!cc.sys.isNative) {
                AdToolbox.showManageViewToast(n);
            }
            e = true;
        }
        return e;
    }

    public clear(): void {
        AdLegacyBridge.ignore(AdLegacyBridge.events.SPLASH_SHOW, this.clearSplashTimer, this);
        AdLegacyBridge.ignore(AdLegacyBridge.events.SPLASH_FINISH, this.clearSplashTimer, this);
    }

    public loadNewSplashAd(e: number = 1, t: number = 0): void {
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