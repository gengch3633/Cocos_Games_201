import BusinessAnalyticsService from "./BusinessAnalyticsService";
import ClientDataStore from "./ClientDataStore";
import CryptoHelper from "./CryptoHelper";
import MiddleHandler from "./MiddleHandler";
import MiddleHelper from "./MiddleHelper";
import MiddleNetwork from "./MiddleNetwork";
import { MiddleReqType } from "./MiddleReqType";
import MiddleSdkEventService from "./MiddleSdkEventService";
import MiddleService from "./MiddleService";
import MiddleUploadScheduler from "./MiddleUploadScheduler";

export default class MiddleManager {
    static LOG_TAG = "[MiddleManager.autoUploadEvent]";
    static instance: MiddleManager | null = null;

    banRed = true;
    banPay = false;
    recogIRE = false;
    recogTF = false;
    isSupportHot = false;
    intervalSeconds = 60;
    isFinishReginal = false;
    mfi = true;
    _initMiddleRefer = false;
    _adConfig: any = null;
    autoUploadSeq = 0;
    lastAutoUploadAt = 0;
    sdkEventService: MiddleSdkEventService;
    uploadScheduler: MiddleUploadScheduler;

    constructor() {
        this.sdkEventService = new MiddleSdkEventService();
        this.uploadScheduler = new MiddleUploadScheduler({
            isReady: () => this.isFinishReginal,
            getIntervalSeconds: () => this.intervalSeconds,
            uploadNow: (source: string) => {
                void this.autoUploadEvent(source);
            },
        });
        this.syncRegionalStateFromHelper();
        this.log("scheduler created", {
            intervalSeconds: this.intervalSeconds,
            isFinishReginal: this.isFinishReginal,
        });
    }

    log(message: string, detail?: any): void {
        if (detail !== undefined) {
            let serialized = "";
            try {
                serialized = JSON.stringify(detail);
            } catch (e) {
                serialized = String(detail);
            }
            console.log(MiddleManager.LOG_TAG + " " + message + " " + serialized);
        } else {
            console.log(MiddleManager.LOG_TAG + " " + message);
        }
    }

    static getInstance(): MiddleManager {
        if (!MiddleManager.instance) {
            MiddleManager.instance = new MiddleManager();
        }
        return MiddleManager.instance;
    }

    middleTFRegional(): void {
        this.syncRegionalStateFromHelper();
        BusinessAnalyticsService.reportData("middleTFRegional");
        if (this._initMiddleRefer) {
            BusinessAnalyticsService.reportData("middleTFRegional_init_finish");
        } else {
            this._initMiddleRefer = true;
            BusinessAnalyticsService.reportData("middleTFRegional_middleTF");
            void this.middleTF();
        }
    }

    middleTF(onComplete?: () => void): void {
        void this.middleTFAsync(onComplete);
    }

    async middleTFAsync(onComplete?: () => void): Promise<void> {
        BusinessAnalyticsService.reportData("middle_tf");
        const params = MiddleService.paramData(MiddleReqType.Regional);
        console.log("[MiddleManager.middleTF] request params ->", JSON.stringify(params));
        try {
            const result = await new Promise<any>((resolve, reject) => {
                MiddleNetwork.getMiddleTFRegional(
                    params,
                    MiddleHandler.create(this, resolve),
                    MiddleHandler.create(this, reject)
                );
            });
            console.log("[MiddleManager.middleTF] success result ->", JSON.stringify(result));
            if (result) {
                BusinessAnalyticsService.reportData("middle_tf_result", {
                    is_self_match_tf: result.is_self_match_tf,
                });
                onComplete?.();
            }
        } catch (err) {
            console.error("[MiddleManager.middleTF] fail result ->", JSON.stringify(err));
            BusinessAnalyticsService.reportData("middle_tf_result_error");
        }
    }

    autoUploadEvent(source: string = "unknown"): void {
        const wasReady = this.isFinishReginal;
        this.syncRegionalStateFromHelper();
        if (!wasReady && this.isFinishReginal) {
            this.log("ready state changed", {
                from: wasReady,
                to: this.isFinishReginal,
                source,
            });
            this.uploadScheduler.refreshTimerByMode();
        }
        const now = Date.now();
        const elapsedSinceLastMs = this.lastAutoUploadAt > 0 ? now - this.lastAutoUploadAt : -1;
        this.autoUploadSeq += 1;
        this.log("trigger", {
            seq: this.autoUploadSeq,
            source,
            isFinishReginal: this.isFinishReginal,
            intervalSeconds: this.intervalSeconds,
            elapsedSinceLastMs,
        });
        this.lastAutoUploadAt = now;
        this.uploadScheduler.markUploadTriggered();
        this.sdkEventService.uploadOnce((intervalSeconds) => {
            const oldIntervalSeconds = this.intervalSeconds;
            this.intervalSeconds = intervalSeconds;
            this.log("interval update", {
                seq: this.autoUploadSeq,
                source,
                oldIntervalSeconds,
                newIntervalSeconds: this.intervalSeconds,
            });
            this.uploadScheduler.refreshTimerByMode();
        });
    }

    onDestroy(): void {
        this.uploadScheduler?.destroy();
    }

    getAdConfig(onSuccess?: (config: any) => void, onFail?: (err: any) => void): void {
        void this.getAdConfigAsync(onSuccess, onFail);
    }

    async getAdConfigAsync(onSuccess?: (config: any) => void, onFail?: (err: any) => void): Promise<void> {
        this.syncRegionalStateFromHelper();
        if (this.mfi !== true) {
            BusinessAnalyticsService.reportData("wp_mfi_false");
            console.log("[MiddleManager] 开始获取广告配置");
            const params = MiddleService.paramData(MiddleReqType.ADCONFIG);
            try {
                const config = await new Promise<any>((resolve, reject) => {
                    MiddleNetwork.getAdConfig(
                        params,
                        MiddleHandler.create(this, resolve),
                        MiddleHandler.create(this, reject)
                    );
                });
                if (config) {
                    console.log("[MiddleManager] 广告配置获取成功");
                    if (config.urls && Array.isArray(config.urls) && config.urls.length !== 0) {
                        for (let index = 0; index < config.urls.length; index++) {
                            const item = config.urls[index];
                            if (item?.sst) {
                                try {
                                    const decrypted = this.decryptAdConfigSst(item.sst);
                                    if (decrypted) {
                                        item.sst = decrypted;
                                        console.log("[MiddleManager] config.urls[" + index + "].sst 解密成功");
                                    }
                                } catch (err) {
                                    BusinessAnalyticsService.reportData("wp_config_error", {
                                        error: "sst解密异常",
                                    });
                                    console.error("[MiddleManager] config.urls[" + index + "].sst 解密异常:", err);
                                }
                            }
                        }
                        this._adConfig = config;
                        onSuccess?.(config);
                    } else {
                        console.error("[MiddleManager] 广告配置中 urls 不存在或为空数组");
                        onFail?.("广告配置中 urls 不存在或为空数组");
                    }
                } else {
                    onFail?.("广告配置返回数据为空");
                }
            } catch (err) {
                console.error("[MiddleManager] 广告配置获取失败:", err);
                onFail?.(err);
            }
        } else {
            onFail?.("mfi为true，不获取广告配置");
            BusinessAnalyticsService.reportData("wp_mfi_true");
        }
    }

    getAdConfigData(): any {
        return this._adConfig;
    }

    syncRegionalStateFromHelper(): void {
        const state = MiddleHelper.getRegionalState ? MiddleHelper.getRegionalState() : null;
        if (state) {
            this.log("syncRegionalStateFromHelper raw", state);
            this.isSupportHot = !!state.isSupportHot;
            this.isFinishReginal = !!state.isFinishRegional;
            this.banRed = !!state.banRed;
            this.banPay = !!state.banPay;
            this.recogIRE = !!state.recogIRE;
            this.recogTF = !!state.recogTF;
            if (state.mfi !== undefined && state.mfi !== null) {
                this.mfi = !!state.mfi;
            }
            this.log("syncRegionalStateFromHelper applied", {
                isSupportHot: this.isSupportHot,
                isFinishReginal: this.isFinishReginal,
                banRed: this.banRed,
                banPay: this.banPay,
                recogIRE: this.recogIRE,
                recogTF: this.recogTF,
                mfi: this.mfi,
            });
        } else {
            this.log("syncRegionalStateFromHelper no state");
        }
    }

    decryptAdConfigSst(value: string): string {
        if (!value) {
            return value;
        }
        try {
            return CryptoHelper.decrypt(value, ClientDataStore.box_pkg_name);
        } catch (e) {
            return value;
        }
    }
}
