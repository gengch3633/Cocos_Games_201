import { MIDDLE_REQUEST_DESCRIPTORS } from "./MiddleRequestDescriptors";
import { MIDDLE_PROJECT_ADAPTER_CONFIG } from "./MiddleProjectAdapterConfig";
import ClientDataStore from "./ClientDataStore";
import BusinessAnalyticsService from "./BusinessAnalyticsService";
import MiddleNetwork from "./MiddleNetwork";
import PlatformBridge from "./PlatformBridge";

interface RegionalResponse {
    region?: string;
    up_h?: boolean;
    forbid_red_envelope?: boolean;
    forbid_used?: boolean;
    recog_ire?: boolean;
    recog_tf?: boolean;
    mfi?: boolean;
    is_ump?: boolean;
    is_ump_country?: boolean;
}

interface RegionalState {
    isSupportHot: boolean;
    isFinishRegional: boolean;
    hasServerCountry: boolean;
    banRed: boolean;
    banPay: boolean;
    recogIRE: boolean;
    recogTF: boolean;
    mfi: boolean;
    country: string;
}

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

    normalizeCountry(country?: string | null): string {
        if (!country) {
            return "";
        }
        const value = String(country).toUpperCase();
        return value === "GB" ? "UK" : value;
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

    applyCountry(country?: string | null): string {
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

    localCountry(): string | null {
        if (!this.country) {
            try {
                this.country = cc.sys.localStorage.getItem("com.sdk.country");
            } catch {
                // ignore
            }
        }
        return this.country;
    }

    saveLocalCountry(country: string): void {
        try {
            cc.sys.localStorage.setItem("com.sdk.country", country);
        } catch {
            // ignore
        }
        this.country = country;
    }

    getRegionalState(): RegionalState {
        return {
            isSupportHot: this.isSupportHot,
            isFinishRegional: this.isFinishRegional,
            hasServerCountry: this.hasServerCountry,
            banRed: this.banRed,
            banPay: this.banPay,
            recogIRE: this.recogIRE,
            recogTF: this.recogTF,
            mfi: this.mfi,
            country: this.country || this.localCountry() || "",
        };
    }

    initAdSdkAfterRegional(response: RegionalResponse | null, country?: string): void {
        try {
            const ipCountry = country || ClientDataStore.local_country || "IN";
            const isUmp = !!(response && (response.is_ump === true || response.is_ump_country === true));
            const maxKey = MIDDLE_PROJECT_ADAPTER_CONFIG.maxKey || "";
            PlatformBridge.getNativeBridge().initSdk(maxKey, ipCountry, isUmp);
            console.log("[MiddleHelper.middleCountry] fuelProfitGear called", { ipCountry, isUMP: isUmp });
        } catch (error) {
            console.warn("[MiddleHelper.middleCountry] fuelProfitGear call failed", error);
        }
    }

    getIpRequestIsFirstFlag(): boolean {
        let isFirst = false;
        try {
            isFirst = cc.sys.localStorage.getItem(this.kIsUploadIPFirstCall) === null;
            if (isFirst) {
                cc.sys.localStorage.setItem(this.kIsUploadIPFirstCall, "1");
            }
        } catch {
            isFirst = true;
        }
        return isFirst;
    }

    reportIPInfo(value: unknown, status: number, isFirst = false): void {
        BusinessAnalyticsService.reportData("ip_config", {
            ip_config_value: value,
            ip_config_status: status,
            ip_first_req: isFirst,
            redirect_type: "0",
        });
    }

    middleCountry(onEnterGame?: (data: RegionalResponse) => void, onBan?: (data: RegionalResponse) => void, onBackstop?: (error?: unknown) => void): void {
        const logTag = "[MiddleHelper.middleCountry]";
        const isFirst = this.getIpRequestIsFirstFlag();
        this.reportIPInfo("", 0, isFirst);

        const handleFailure = (error: unknown, reason: string) => {
            const cached = this.normalizeCountry(this.localCountry());
            const country = this.applyCountry(cached || this.resolveDefaultCountry());
            this.isFinishRegional = true;
            this.hasServerCountry = false;
            this.initAdSdkAfterRegional(null, country);
            this.reportIPInfo(error || reason, -1, isFirst);
            console.warn(logTag, "归因失败，使用国家:", country, "source:", cached ? "cache" : "default", "reason:", reason);
            onBackstop?.(error);
        };

        if (!MIDDLE_REQUEST_DESCRIPTORS.Regional?.url) {
            console.warn(logTag, "regionalUrl 为空，直接 onBackstop");
            handleFailure(undefined, "missing_url");
            return;
        }

        MiddleNetwork.getMiddleCountry(
            null as unknown as Record<string, unknown>,
            (response) => {
                try {
                    const payload = ((response as { data?: RegionalResponse })?.data || response || {}) as RegionalResponse;
                    console.log(logTag, "解析结果 →", JSON.stringify(payload));
                    const region = this.normalizeCountry(payload?.region);
                    const country = this.applyCountry(region || this.localCountry() || this.resolveDefaultCountry());
                    this.isFinishRegional = true;
                    this.hasServerCountry = !!region;
                    this.isSupportHot = !!payload.up_h;
                    this.banRed = !!payload.forbid_red_envelope;
                    this.banPay = false;
                    this.recogIRE = !!payload.recog_ire;
                    this.recogTF = !!payload.recog_tf;
                    if (payload.mfi !== undefined && payload.mfi !== null) {
                        this.mfi = !!payload.mfi;
                    }
                    this.initAdSdkAfterRegional(payload, country);
                    this.reportIPInfo(payload, 1, isFirst);
                    const forbidden = !!(payload.forbid_used || payload.forbid_red_envelope);
                    console.log(logTag, "country →", country, " isSupportHot →", this.isSupportHot, " forbid_used →", forbidden);
                    if (forbidden) {
                        console.warn(logTag, "账号封禁，触发 onBan");
                        onBan?.(payload);
                        return;
                    }
                    console.log(logTag, "正常进入游戏，触发 onEnterGame，onEnterGame 类型 →", typeof onEnterGame);
                    onEnterGame?.(payload);
                } catch (error) {
                    console.error(logTag, "解析响应异常 →", error);
                    handleFailure(error, "parse_error");
                }
            },
            (error) => {
                console.warn(logTag, "请求失败或无响应，触发 onBackstop  err →", JSON.stringify(error));
                handleFailure(error, "request_fail");
            },
        );
    }

    initMiddleFundsPlatform(): void {}
}

const MiddleHelper = new MiddleHelperImpl();
export default MiddleHelper;
