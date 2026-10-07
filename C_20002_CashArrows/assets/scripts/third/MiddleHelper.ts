import BusinessAnalyticsService from "./BusinessAnalyticsService";
import ClientDataStore from "./ClientDataStore";
import MiddleNetwork from "./MiddleNetwork";
import { MIDDLE_PROJECT_ADAPTER_CONFIG } from "./MiddleProjectAdapterConfig";
import { MIDDLE_REQUEST_DESCRIPTORS } from "./MiddleRequestDescriptors";
import PlatformBridge from "./PlatformBridge";

class MiddleHelperImpl {
    kIsUploadIPFirstCall = "com.sdk.kIsUploadIPFirstCall";
    isSupportHot = false;
    isFinishRegional = false;
    hasServerCountry = false;
    banRed = true;
    banPay = false;
    recogIRE = false;
    recogTF = false;
    mfi = true;
    country: string | null = null;

    normalizeCountry(value: any): string {
        if (!value) {
            return "";
        }
        const normalized = String(value).toUpperCase();
        return normalized === "GB" ? "UK" : normalized;
    }

    mapLanguageToCountry(language: string): string {
        const map: Record<string, string> = {
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
            tl: "PH",
        };
        return map[String(language || "").toLowerCase()] || "IN";
    }

    resolveDefaultCountry(): string {
        return this.normalizeCountry(ClientDataStore.local_country) || this.mapLanguageToCountry(cc.sys.language);
    }

    applyCountry(value: any): string {
        let country = this.normalizeCountry(value);
        if (!country) {
            country = this.resolveDefaultCountry();
        }
        this.saveLocalCountry(country);
        ClientDataStore.local_country = country;
        if (typeof ClientDataStore.buildCommonUrlStr === "function") {
            ClientDataStore.buildCommonUrlStr();
        }
        if (typeof ClientDataStore.buildMiddleCommonUrlStr === "function") {
            ClientDataStore.buildMiddleCommonUrlStr();
        }
        return country;
    }

    localCountry(): string | null {
        if (!this.country) {
            try {
                this.country = cc.sys.localStorage.getItem("com.sdk.country");
            } catch (e) {
            }
        }
        return this.country;
    }

    saveLocalCountry(country: string): void {
        try {
            cc.sys.localStorage.setItem("com.sdk.country", country);
        } catch (e) {
        }
        this.country = country;
    }

    getRegionalState(): any {
        return {
            isSupportHot: this.isSupportHot,
            isFinishRegional: this.isFinishRegional,
            hasServerCountry: this.hasServerCountry,
            banRed: this.banRed,
            banPay: this.banPay,
            recogIRE: this.recogIRE,
            recogTF: this.recogTF,
            mfi: this.mfi,
            country: this.country || this.localCountry(),
        };
    }

    initAdSdkAfterRegional(data: any, ipCountry: string): void {
        try {
            const country = ipCountry || ClientDataStore.local_country || "IN";
            const isUMP = !!(data && (data.is_ump === true || data.is_ump_country === true));
            const maxKey = MIDDLE_PROJECT_ADAPTER_CONFIG.maxKey || "";
            PlatformBridge.getNativeBridge().initSdk(maxKey, country, isUMP);
            console.log("[MiddleHelper.middleCountry] fuelProfitGear called", {
                ipCountry: country,
                isUMP,
            });
        } catch (err) {
            console.warn("[MiddleHelper.middleCountry] fuelProfitGear call failed", err);
        }
    }

    getIpRequestIsFirstFlag(): boolean {
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

    reportIPInfo(value: any, status: number, isFirst: boolean = false): void {
        BusinessAnalyticsService.reportData("ip_config", {
            ip_config_value: value,
            ip_config_status: status,
            ip_first_req: isFirst,
            redirect_type: "0",
        });
    }

    middleCountry(onEnterGame?: (data: any) => void, onBan?: (data: any) => void, onBackstop?: (err: any) => void): void {
        void this.middleCountryAsync(onEnterGame, onBan, onBackstop);
    }

    async middleCountryAsync(
        onEnterGame?: (data: any) => void,
        onBan?: (data: any) => void,
        onBackstop?: (err: any) => void
    ): Promise<void> {
        const tag = "[MiddleHelper.middleCountry]";
        const isFirst = this.getIpRequestIsFirstFlag();
        this.reportIPInfo("", 0, isFirst);

        const handleBackstop = (err: any, reason: string) => {
            const cached = this.normalizeCountry(this.localCountry());
            const country = this.applyCountry(cached || this.resolveDefaultCountry());
            this.isFinishRegional = true;
            this.hasServerCountry = false;
            this.initAdSdkAfterRegional(null, country);
            this.reportIPInfo(err || reason, -1, isFirst);
            console.warn(tag, "归因失败，使用国家:", country, "source:", cached ? "cache" : "default", "reason:", reason);
            onBackstop?.(err);
        };

        if (!MIDDLE_REQUEST_DESCRIPTORS.Regional?.url) {
            console.warn(tag, "regionalUrl 为空，直接 onBackstop");
            handleBackstop(undefined, "missing_url");
            return;
        }

        try {
            const response = await MiddleNetwork.requestAsync("Regional", null);
            try {
                const parsed = (response?.data ?? response) || {};
                console.log(tag, "解析结果 →", JSON.stringify(parsed));
                const region = this.normalizeCountry(parsed?.region);
                const country = this.applyCountry(region || this.localCountry() || this.resolveDefaultCountry());
                this.isFinishRegional = true;
                this.hasServerCountry = !!region;
                this.isSupportHot = parsed.up_h || false;
                this.banRed = !!parsed.forbid_red_envelope;
                this.banPay = false;
                this.recogIRE = !!parsed.recog_ire;
                this.recogTF = !!parsed.recog_tf;
                if (parsed.mfi !== undefined && parsed.mfi !== null) {
                    this.mfi = !!parsed.mfi;
                }
                this.initAdSdkAfterRegional(parsed, country);
                this.reportIPInfo(parsed, 1, isFirst);
                const forbidUsed = parsed.forbid_used || parsed.forbid_red_envelope || false;
                console.log(tag, "country →", country, "  isSupportHot →", this.isSupportHot, "  forbid_used →", forbidUsed);
                if (forbidUsed) {
                    console.warn(tag, "账号封禁，触发 onBan");
                    onBan?.(parsed);
                    return;
                }
                console.log(tag, "正常进入游戏，触发 onEnterGame，onEnterGame 类型 →", typeof onEnterGame);
                onEnterGame?.(parsed);
            } catch (err) {
                console.error(tag, "解析响应异常 →", err);
                handleBackstop(err, "parse_error");
            }
        } catch (err) {
            console.warn(tag, "请求失败或无响应，触发 onBackstop  err →", JSON.stringify(err));
            handleBackstop(err, "request_fail");
        }
    }

    initMiddleFundsPlatform(): void {
    }
}

export default new MiddleHelperImpl();
