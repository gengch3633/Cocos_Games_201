import BusinessAnalyticsService from "./BusinessAnalyticsService";
import ClientDataStore from "./ClientDataStore";
import MiddleNetwork from "./MiddleNetwork";
import * as MiddleProjectAdapterConfig from "./MiddleProjectAdapterConfig";
import * as MiddleRequestDescriptors from "./MiddleRequestDescriptors";
import PlatformBridge from "./PlatformBridge";

export interface MiddleRegionalState {
    isSupportHot: boolean;
    isFinishRegional: boolean;
    hasServerCountry: boolean;
    banRed: boolean;
    banPay: boolean;
    recogIRE: boolean;
    recogTF: boolean;
    mfi: boolean;
    country: string | null;
}

export class MiddleHelper {
    public readonly kIsUploadIPFirstCall: string = "com.sdk.kIsUploadIPFirstCall";

    public isSupportHot: boolean = false;
    public isFinishRegional: boolean = false;
    public hasServerCountry: boolean = false;
    public banRed: boolean = true;
    public banPay: boolean = false;
    public recogIRE: boolean = false;
    public recogTF: boolean = false;
    public mfi: boolean = true;

    private country: string | null = null;

    public normalizeCountry(country?: string | null): string {
        if (!country) {
            return "";
        }
        const value = String(country).toUpperCase();
        return value === "GB" ? "UK" : value;
    }

    public mapLanguageToCountry(language?: string | null): string {
        const mapping: { [key: string]: string } = {
            zh: "CN",
            en: "US",
            id: "ID",
            pt: "BR",
            ru: "RU",
            de: "DE",
            fr: "FR",
            es: "MX",
            hi: "IN",
            th: "TH",
            ja: "JP",
            ko: "KR",
            fil: "PH",
            tl: "PH"
        };
        return mapping[String(language || "").toLowerCase()] || "IN";
    }

    public resolveDefaultCountry(): string {
        return this.normalizeCountry(ClientDataStore.local_country) || this.mapLanguageToCountry(cc.sys.language);
    }

    public applyCountry(country?: string | null): string {
        let normalized = this.normalizeCountry(country);
        if (!normalized) {
            normalized = this.resolveDefaultCountry();
        }
        this.saveLocalCountry(normalized);
        ClientDataStore.local_country = normalized;
        const store = ClientDataStore as any;
        if (typeof store.buildCommonUrlStr === "function") {
            store.buildCommonUrlStr();
        }
        if (typeof store.buildMiddleCommonUrlStr === "function") {
            store.buildMiddleCommonUrlStr();
        }
        return normalized;
    }

    public localCountry(): string | null {
        if (!this.country) {
            try {
                this.country = cc.sys.localStorage.getItem("com.sdk.country");
            } catch (e) {
            }
        }
        return this.country;
    }

    public saveLocalCountry(country: string): void {
        try {
            cc.sys.localStorage.setItem("com.sdk.country", country);
        } catch (e) {
        }
        this.country = country;
    }

    public getRegionalState(): MiddleRegionalState {
        return {
            isSupportHot: this.isSupportHot,
            isFinishRegional: this.isFinishRegional,
            hasServerCountry: this.hasServerCountry,
            banRed: this.banRed,
            banPay: this.banPay,
            recogIRE: this.recogIRE,
            recogTF: this.recogTF,
            mfi: this.mfi,
            country: this.country || this.localCountry()
        };
    }

    public initAdSdkAfterRegional(data: any, serverCountry?: string | null): void {
        try {
            const ipCountry = serverCountry || ClientDataStore.local_country || "IN";
            const isUMP = !!(data && (data.is_ump === true || data.is_ump_country === true));
            const maxKey = MiddleProjectAdapterConfig.MIDDLE_PROJECT_ADAPTER_CONFIG.maxKey || "";
            PlatformBridge.getNativeBridge().initSdk(maxKey, ipCountry, isUMP);
            console.log("[MiddleHelper.middleCountry] fuelProfitGear called", {
                ipCountry: ipCountry,
                isUMP: isUMP
            });
        } catch (e) {
            console.warn("[MiddleHelper.middleCountry] fuelProfitGear call failed", e);
        }
    }

    public getIpRequestIsFirstFlag(): boolean {
        let isFirst = false;
        try {
            isFirst = cc.sys.localStorage.getItem(this.kIsUploadIPFirstCall) === null;
            if (isFirst) {
                cc.sys.localStorage.setItem(this.kIsUploadIPFirstCall, "1");
            }
        } catch (e) {
            isFirst = true;
        }
        return isFirst;
    }

    public reportIPInfo(ipConfigValue: any, ipConfigStatus: number, ipFirstReq: boolean = false): void {
        BusinessAnalyticsService.reportData("ip_config", {
            ip_config_value: ipConfigValue,
            ip_config_status: ipConfigStatus,
            ip_first_req: ipFirstReq,
            redirect_type: "0"
        });
    }

    public middleCountry(
        onEnterGame?: ((data: any) => void) | null,
        onBan?: ((data: any) => void) | null,
        onBackstop?: ((data: any) => void) | null
    ): void {
        const TAG = "[MiddleHelper.middleCountry]";
        const ipFirstReq = this.getIpRequestIsFirstFlag();
        this.reportIPInfo("", 0, ipFirstReq);

        const backstop = (data: any, reason: string): void => {
            const cached = this.normalizeCountry(this.localCountry());
            const country = this.applyCountry(cached || this.resolveDefaultCountry());
            this.isFinishRegional = true;
            this.hasServerCountry = false;
            this.initAdSdkAfterRegional(null, country);
            this.reportIPInfo(data || reason, -1, ipFirstReq);
            console.warn(TAG, "归因失败，使用国家:", country, "source:", cached ? "cache" : "default", "reason:", reason);
            if (onBackstop) {
                onBackstop(data);
            }
        };

        const regional = MiddleRequestDescriptors.MIDDLE_REQUEST_DESCRIPTORS.Regional;
        if (regional && regional.url) {
            MiddleNetwork.getMiddleCountry(null, (response: any) => {
                try {
                    const data = (response && response.data) || response || {};
                    console.log(TAG, "解析结果 →", JSON.stringify(data));
                    data.region = "US"; // for_test
                    const region = this.normalizeCountry(data && data.region);
                    const country = this.applyCountry(region || this.localCountry() || this.resolveDefaultCountry());
                    this.isFinishRegional = true;
                    this.hasServerCountry = !!region;
                    this.isSupportHot = data.up_h || false;
                    this.banRed = !!data.forbid_red_envelope;
                    this.banPay = false;
                    this.recogIRE = !!data.recog_ire;
                    this.recogTF = !!data.recog_tf;
                    if (data.mfi !== undefined && data.mfi !== null) {
                        this.mfi = !!data.mfi;
                    }
                    this.initAdSdkAfterRegional(data, country);
                    this.reportIPInfo(data, 1, ipFirstReq);
                    const banned = data.forbid_used || data.forbid_red_envelope || false;
                    console.log(TAG, "country →", country, "  isSupportHot →", this.isSupportHot, "  forbid_used →", banned);
                    if (banned) {
                        console.warn(TAG, "账号封禁，触发 onBan");
                        if (onBan) {
                            onBan(data);
                        }
                        return;
                    }
                    console.log(TAG, "正常进入游戏，触发 onEnterGame，onEnterGame 类型 →", typeof onEnterGame);
                    if (onEnterGame) {
                        onEnterGame(data);
                    }
                } catch (e) {
                    console.error(TAG, "解析响应异常 →", e);
                    backstop(e, "parse_error");
                }
            }, (err: any) => {
                console.warn(TAG, "请求失败或无响应，触发 onBackstop  err →", JSON.stringify(err));
                backstop(err, "request_fail");
            });
        } else {
            console.warn(TAG, "regionalUrl 为空，直接 onBackstop");
            backstop(undefined, "missing_url");
        }
    }

    public initMiddleFundsPlatform(): void {
    }
}

export default new MiddleHelper();