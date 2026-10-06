import MiddleNetwork from "./MiddleNetwork";
import MiddleService from "./MiddleService";
import { MiddleReqType } from "./MiddleReqType";
import MiddleHandler from "./MiddleHandler";
import BusinessAnalyticsService from "./BusinessAnalyticsService";
import CryptoHelper from "./CryptoHelper";
import ClientDataStore from "./ClientDataStore";
import MiddleHelper from "./MiddleHelper";
import MiddleSdkEventService from "./MiddleSdkEventService";
import MiddleUploadScheduler from "./MiddleUploadScheduler";

interface AdConfigData {
    urls?: Array<{ sst?: string }>;
}

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
    _adConfig: AdConfigData | null = null;
    autoUploadSeq = 0;
    lastAutoUploadAt = 0;
    sdkEventService = new MiddleSdkEventService();
    uploadScheduler: MiddleUploadScheduler;

    constructor() {
        this.uploadScheduler = new MiddleUploadScheduler({
            isReady: () => this.isFinishReginal,
            getIntervalSeconds: () => this.intervalSeconds,
            uploadNow: (source) => this.autoUploadEvent(source),
        });
        this.syncRegionalStateFromHelper();
        this.log("scheduler created", {
            intervalSeconds: this.intervalSeconds,
            isFinishReginal: this.isFinishReginal,
        });
    }

    log(message: string, detail?: unknown): void {
        if (detail !== undefined) {
            let text = "";
            try {
                text = JSON.stringify(detail);
            } catch {
                text = String(detail);
            }
            console.log(MiddleManager.LOG_TAG + " " + message + " " + text);
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
            this.middleTF();
        }
    }

    middleTF(onSuccess?: () => void): void {
        BusinessAnalyticsService.reportData("middle_tf");
        const params = MiddleService.paramData(MiddleReqType.Regional);
        console.log("[MiddleManager.middleTF] request params ->", JSON.stringify(params));
        MiddleNetwork.getMiddleTFRegional(
            params,
            MiddleHandler.create(this, (result: unknown) => {
                console.log("[MiddleManager.middleTF] success result ->", JSON.stringify(result));
                if (result) {
                    BusinessAnalyticsService.reportData("middle_tf_result", {
                        is_self_match_tf: (result as { is_self_match_tf?: boolean }).is_self_match_tf,
                    });
                    onSuccess?.();
                }
            }),
            MiddleHandler.create(this, (error: unknown) => {
                console.error("[MiddleManager.middleTF] fail result ->", JSON.stringify(error));
                BusinessAnalyticsService.reportData("middle_tf_result_error");
            }),
        );
    }

    autoUploadEvent(source = "unknown"): void {
        const previousReady = this.isFinishReginal;
        this.syncRegionalStateFromHelper();
        if (!previousReady && this.isFinishReginal) {
            this.log("ready state changed", { from: previousReady, to: this.isFinishReginal, source });
            this.uploadScheduler.refreshTimerByMode();
        }
        const now = Date.now();
        const elapsed = this.lastAutoUploadAt > 0 ? now - this.lastAutoUploadAt : -1;
        this.autoUploadSeq += 1;
        this.log("trigger", {
            seq: this.autoUploadSeq,
            source,
            isFinishReginal: this.isFinishReginal,
            intervalSeconds: this.intervalSeconds,
            elapsedSinceLastMs: elapsed,
        });
        this.lastAutoUploadAt = now;
        this.uploadScheduler.markUploadTriggered();
        this.sdkEventService.uploadOnce((intervalSeconds) => {
            const oldInterval = this.intervalSeconds;
            this.intervalSeconds = intervalSeconds;
            this.log("interval update", {
                seq: this.autoUploadSeq,
                source,
                oldIntervalSeconds: oldInterval,
                newIntervalSeconds: this.intervalSeconds,
            });
            this.uploadScheduler.refreshTimerByMode();
        });
    }

    onDestroy(): void {
        this.uploadScheduler?.destroy();
    }

    getAdConfig(onSuccess?: (config: AdConfigData) => void, onFail?: (error: unknown) => void): void {
        this.syncRegionalStateFromHelper();
        if (this.mfi !== true) {
            BusinessAnalyticsService.reportData("wp_mfi_false");
            console.log("[MiddleManager] 开始获取广告配置");
            const params = MiddleService.paramData(MiddleReqType.ADCONFIG);
            MiddleNetwork.getAdConfig(
                params,
                MiddleHandler.create(this, (config: AdConfigData) => {
                    if (!config) {
                        onFail?.("广告配置返回数据为空");
                        return;
                    }
                    console.log("[MiddleManager] 广告配置获取成功");
                    if (config.urls && Array.isArray(config.urls) && config.urls.length !== 0) {
                        for (let i = 0; i < config.urls.length; i++) {
                            const item = config.urls[i];
                            if (item?.sst) {
                                try {
                                    const decrypted = this.decryptAdConfigSst(item.sst);
                                    if (decrypted) {
                                        item.sst = decrypted;
                                        console.log("[MiddleManager] config.urls[" + i + "].sst 解密成功");
                                    }
                                } catch (error) {
                                    BusinessAnalyticsService.reportData("wp_config_error", { error: "sst解密异常" });
                                    console.error("[MiddleManager] config.urls[" + i + "].sst 解密异常:", error);
                                }
                            }
                        }
                        this._adConfig = config;
                        onSuccess?.(config);
                    } else {
                        console.error("[MiddleManager] 广告配置中 urls 不存在或为空数组");
                        onFail?.("广告配置中 urls 不存在或为空数组");
                    }
                }),
                MiddleHandler.create(this, (error: unknown) => {
                    console.error("[MiddleManager] 广告配置获取失败:", error);
                    onFail?.(error);
                }),
            );
        } else {
            onFail?.("mfi为true，不获取广告配置");
            BusinessAnalyticsService.reportData("wp_mfi_true");
        }
    }

    getAdConfigData(): AdConfigData | null {
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
        } catch {
            return value;
        }
    }
}
