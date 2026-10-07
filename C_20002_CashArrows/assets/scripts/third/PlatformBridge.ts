import { BUSINESS_COMMON_CONFIG } from "./BusinessCommonConfig";
import { MIDDLE_PROJECT_ADAPTER_CONFIG } from "./MiddleProjectAdapterConfig";
import NativeSdkBridgeAdapter from "./NativeSdkBridgeAdapter";

const defaultLanguage = BUSINESS_COMMON_CONFIG.defaultLanguage;

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
    tl: "PH",
};

function normalizeCountryCode(code: any): string {
    if (!code) {
        return "";
    }
    const upper = String(code).toUpperCase();
    return upper === "GB" ? "UK" : upper;
}

function getOrCreateWebDeviceId(): string {
    let stored: string | null = null;
    try {
        stored = cc.sys.localStorage.getItem("web_device_id");
    } catch (err) {
    }
    if (stored) {
        return stored;
    }
    const generated = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (char) => {
        const random = Math.random() * 16 | 0;
        return (char === "x" ? random : (random & 0x3) | 0x8).toString(16);
    });
    try {
        cc.sys.localStorage.setItem("web_device_id", generated);
    } catch (err) {
    }
    return generated;
}

function parseJson(text: string): any {
    if (!text) {
        return null;
    }
    try {
        return JSON.parse(text);
    } catch (err) {
        return null;
    }
}

function parseBase64Json(text: string): any {
    if (!text) {
        return null;
    }
    try {
        let normalized = text.replace(/-/g, "+").replace(/_/g, "/");
        const padding = normalized.length % 4;
        if (padding) {
            normalized += "=".repeat(4 - padding);
        }
        return parseJson(atob(normalized));
    } catch (err) {
        return null;
    }
}

function parseClientInfo(raw: any): any {
    if (raw && typeof raw === "object") {
        return raw;
    }
    if (typeof raw !== "string") {
        return {};
    }
    const trimmed = raw.trim();
    if (!trimmed) {
        return {};
    }
    const json = parseJson(trimmed);
    if (json && typeof json === "object") {
        return json;
    }
    const base64Json = parseBase64Json(trimmed);
    if (base64Json && typeof base64Json === "object") {
        return base64Json;
    }
    console.warn("[PlatformBridge] getClientInfo parse failed, fallback to {}", trimmed.slice(0, 120));
    return {};
}

export default class PlatformBridge {
    static userId = "";

    static getClientInfo(): any {
        if (cc.sys.isNative && cc.sys.os === cc.sys.OS_ANDROID) {
            const info = parseClientInfo(NativeSdkBridgeAdapter.getBridge().getClientInfo());
            info.box_pkg_name = MIDDLE_PROJECT_ADAPTER_CONFIG.releasePkgName;
            const localCountryField = MIDDLE_PROJECT_ADAPTER_CONFIG.fieldMapping.local_country;
            let localCountry = normalizeCountryCode(
                info?.local_country || (localCountryField ? info?.[localCountryField] : "")
            );
            if (!localCountry) {
                localCountry = LANGUAGE_COUNTRY_MAP[String(cc.sys.language || "").toLowerCase()]
                    || normalizeCountryCode(defaultLanguage)
                    || "IN";
                console.warn("[PlatformBridge] native local_country 为空，回退 language 映射 ->", localCountry);
            }
            info.local_country = localCountry;
            return info;
        }
        return {
            device_id: getOrCreateWebDeviceId(),
            version_name: "1.1.1",
            android_id: "fc3ac8e631ea68c2",
            channel_name: "google",
            package_name: MIDDLE_PROJECT_ADAPTER_CONFIG.releasePkgName,
            box_pkg_name: MIDDLE_PROJECT_ADAPTER_CONFIG.releasePkgName,
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
                ids: "0",
            },
        };
    }

    static setUserId(userId: string): void {
        this.userId = userId;
    }

    static reportData(): void {
    }

    static bindPilot(): void {
        window.pilot = NativeSdkBridgeAdapter.getBridge();
    }

    static getNativeBridge() {
        return NativeSdkBridgeAdapter.getBridge();
    }
}
