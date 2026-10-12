import { BUSINESS_COMMON_CONFIG } from "./BusinessCommonConfig";
import * as MiddleProjectAdapterConfig from "./MiddleProjectAdapterConfig";
import NativeSdkBridgeAdapter from "./NativeSdkBridgeAdapter";

const defaultLanguage: string = BUSINESS_COMMON_CONFIG.defaultLanguage;

const LANGUAGE_COUNTRY_MAP: { [key: string]: string } = {
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

function normalizeCountry(country: string): string {
    if (!country) return "";
    const upper: string = String(country).toUpperCase();
    return upper === "GB" ? "UK" : upper;
}

function getOrCreateDeviceId(): string {
    let deviceId: string | null = null;
    try {
        deviceId = cc.sys.localStorage.getItem("web_device_id");
    } catch (e) { }
    if (deviceId) return deviceId;

    const generated: string = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (flag: string): string => {
        const value = (16 * Math.random()) | 0;
        return (flag === "x" ? value : (value & 0x3) | 0x8).toString(16);
    });

    try {
        cc.sys.localStorage.setItem("web_device_id", generated);
    } catch (e) { }
    return generated;
}

function safeJsonParse(text: string): any {
    if (!text) return null;
    try {
        return JSON.parse(text);
    } catch (e) {
        return null;
    }
}

function decodeBase64UrlJson(text: string): any {
    if (!text) return null;
    try {
        const base64: string = text.replace(/-/g, "+").replace(/_/g, "/");
        const pad: number = base64.length % 4;
        const padded: string = pad ? base64 + "=".repeat(4 - pad) : base64;
        return safeJsonParse(atob(padded));
    } catch (e) {
        return null;
    }
}

function parseClientInfo(raw: any): Record<string, any> {
    if (raw && typeof raw === "object") return raw;
    if (typeof raw !== "string") return {};

    const text: string = raw.trim();
    if (!text) return {};

    const json = safeJsonParse(text);
    if (json && typeof json === "object") return json;

    const decoded = decodeBase64UrlJson(text);
    if (decoded && typeof decoded === "object") return decoded;

    console.warn("[PlatformBridge] getClientInfo parse failed, fallback to {}", text.slice(0, 120));
    return {};
}

export default class PlatformBridge {
    public static userId: string = "";

    public static getClientInfo(): Record<string, any> {
        if (cc.sys.isNative && cc.sys.os === cc.sys.OS_ANDROID) {
            const info: Record<string, any> = parseClientInfo(NativeSdkBridgeAdapter.getBridge().getClientInfo());
            info.box_pkg_name = MiddleProjectAdapterConfig.MIDDLE_PROJECT_ADAPTER_CONFIG.releasePkgName;

            const localCountryField: string = MiddleProjectAdapterConfig.MIDDLE_PROJECT_ADAPTER_CONFIG.fieldMapping.local_country;
            let country: string = normalizeCountry(info.local_country || (localCountryField ? info[localCountryField] : ""));
            if (!country) {
                const language = cc.sys.language;
                country = LANGUAGE_COUNTRY_MAP[String(language || "").toLowerCase()] || normalizeCountry(defaultLanguage) || "IN";
                console.warn("[PlatformBridge] native local_country 为空，回退 language 映射 ->", country);
            }
            info.local_country = country;
            return info;
        }

        return {
            device_id: getOrCreateDeviceId(),
            version_name: "1.1.1",
            android_id: "fc3ac8e631ea68c2",
            channel_name: "google",
            package_name: MiddleProjectAdapterConfig.MIDDLE_PROJECT_ADAPTER_CONFIG.releasePkgName,
            box_pkg_name: MiddleProjectAdapterConfig.MIDDLE_PROJECT_ADAPTER_CONFIG.releasePkgName,
            oaid: "oaid-test",
            os_version: "11",
            phone_model: "22101317C",
            phone_brand: "Redmi-test",
            os_name: "android",
            device_type: "Xiaomi-test",
            device_serial: "unknown",
            system_version: "14",
            phone_manufacturer: "Xiaomi-test",
            display_hypotenuse: 6.357,
            display_metrics: "1080x2262",
            cpu_number: 1,
            lat: "",
            lg: "zh",
            local_country: defaultLanguage,
            network_operator: "",
            network_type: "wifi",
            sdk_version_name: "4.0.0",
            adjust_id: "adjust_sdk_not_init",
            extra: "0",
            referrer_url: "",
            referrer_timestamp_server: 0,
            install_timestamp_server: 0,
            ds: {
                ir: "0",
                ie: "0",
                irv: "0",
                ix: "0",
                ih: "0",
                io: "0",
                iw: "0",
                id: "0",
                ids: "0"
            }
        };
    }

    public static setUserId(userId: string): void {
        this.userId = userId;
    }

    public static reportData(): void {
    }

    public static bindPilot(): void {
        (window as any).pilot = NativeSdkBridgeAdapter.getBridge();
    }

    public static getNativeBridge(): any {
        return NativeSdkBridgeAdapter.getBridge();
    }
}