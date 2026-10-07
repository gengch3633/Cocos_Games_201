import BusinessAnalyticsService from "./BusinessAnalyticsService";
import ClientDataStore from "./ClientDataStore";
import MiddleNetwork from "./MiddleNetwork";
import { MIDDLE_PROJECT_ADAPTER_CONFIG } from "./MiddleProjectAdapterConfig";
import { MIDDLE_REQUEST_DESCRIPTORS } from "./MiddleRequestDescriptors";
import PlatformBridge from "./PlatformBridge";

class MiddleHelperImpl {
    kIsUploadIPFirstCall: string = "com.sdk.kIsUploadIPFirstCall";
    isSupportHot: boolean = false;
    isFinishRegional: boolean = false;
    hasServerCountry: boolean = false;
    banRed: boolean = true;
    banPay: boolean = false;
    recogIRE: boolean = false;
    recogTF: boolean = false;
    mfi: boolean = true;
    country: string = null;

    normalizeCountry(country: string): string {
        if (!country) {
            return "";
        }
        const upper = String(country).toUpperCase();
        return "GB" === upper ? "UK" : upper;
    }

    mapLanguageToCountry(language: string): string {
        const map: { [key: string]: string } = {
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
        return map[String(language || "").toLowerCase()] || "IN";
    }

    resolveDefaultCountry(): string {
        return this.normalizeCountry(ClientDataStore.local_country) || this.mapLanguageToCountry(cc.sys.language);
    }

    applyCountry(country: string): string {
        let normalized = this.normalizeCountry(country);
        if (!normalized) {
            normalized = this.resolveDefaultCountry();
        }
        this.saveLocalCountry(normalized);
        ClientDataStore.local_country = normalized;
        if (typeof ClientDataStore.buildCommonUrlStr === "function") {
            ClientDataStore.buildCommonUrlStr();
        }
        if (typeof ClientDataStore.buildMiddleCommonUrlStr === "function") {
            ClientDataStore.buildMiddleCommonUrlStr();
        }
        return normalized;
    }

    localCountry(): string {
        if (!this.country) {
            try {
                this.country = cc.sys.localStorage.getItem("com.sdk.country");
            } catch (err) { }
        }
        return this.country;
    }

    saveLocalCountry(country: string): void {
        try {
            cc.sys.localStorage.setItem("com.sdk.country", country);
        } catch (err) { }
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
            country: this.country || this.localCountry()
        };
    }

    initAdSdkAfterRegional(result: any, ipCountry: string): void {
        try {
            const country = ipCountry || ClientDataStore.local_country || "IN";
            const isUMP = !!(result && (result.is_ump === true || result.is_ump_country === true));
            const maxKey = MIDDLE_PROJECT_ADAPTER_CONFIG.maxKey || "";
            PlatformBridge.getNativeBridge().initSdk(maxKey, country, isUMP);
            console.log("[MiddleHelper.middleCountry] fuelProfitGear called", {
                ipCountry: country,
                isUMP: isUMP
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
        } catch (err) {
            isFirst = true;
        }
        return isFirst;
    }

    reportIPInfo(value: any, status: number, isFirst: boolean = false): void {
        BusinessAnalyticsService.reportData("ip_config", {
            ip_config_value: value,
            ip_config_status: status,
            ip_first_req: isFirst,
            redirect_type: "0"
        });
    }

    middleCountry(onEnter: (result: any) => void, onBan: (result: any) => void, onBackstop: (err?: any) => void): void {
        const logPrefix = "[MiddleHelper.middleCountry]";
        const isFirstRequest = this.getIpRequestIsFirstFlag();
        this.reportIPInfo("", 0, isFirstRequest);

        const handleBackstop = (err: any, reason: string) => {
            const cached = this.normalizeCountry(this.localCountry());
            const country = this.applyCountry(cached || this.resolveDefaultCountry());
            this.isFinishRegional = true;
            this.hasServerCountry = false;
            this.initAdSdkAfterRegional(null, country);
            this.reportIPInfo(err || reason, -1, isFirstRequest);
            console.warn(logPrefix, "归因失败，使用国家:", country, "source:", cached ? "cache" : "default", "reason:", reason);
            onBackstop == null || onBackstop(err);
        };

        if (MIDDLE_REQUEST_DESCRIPTORS.Regional?.url) {
            MiddleNetwork.getMiddleCountry(null, (response: any) => {
                try {
                    const data = response?.data || response || {};
                    console.log(logPrefix, "解析结果 →", JSON.stringify(data));
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
                    this.reportIPInfo(data, 1, isFirstRequest);
                    const isBanned = data.forbid_used || data.forbid_red_envelope || false;
                    console.log(logPrefix, "country →", country, "  isSupportHot →", this.isSupportHot, "  forbid_used →", isBanned);
                    if (isBanned) {
                        console.warn(logPrefix, "账号封禁，触发 onBan");
                        onBan == null || onBan(data);
                        return;
                    }
                    console.log(logPrefix, "正常进入游戏，触发 onEnterGame，onEnterGame 类型 →", typeof onEnter);
                    onEnter == null || onEnter(data);
                } catch (err) {
                    console.error(logPrefix, "解析响应异常 →", err);
                    handleBackstop(err, "parse_error");
                }
            }, (err: any) => {
                console.warn(logPrefix, "请求失败或无响应，触发 onBackstop  err →", JSON.stringify(err));
                handleBackstop(err, "request_fail");
            });
        } else {
            console.warn(logPrefix, "regionalUrl 为空，直接 onBackstop");
            handleBackstop(undefined, "missing_url");
        }
    }

    initMiddleFundsPlatform(): void {
    }
}

export default new MiddleHelperImpl();
