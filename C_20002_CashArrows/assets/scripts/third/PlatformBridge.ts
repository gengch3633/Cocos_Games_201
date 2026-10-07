import { BUSINESS_COMMON_CONFIG } from "./BusinessCommonConfig";
import NativeSdkBridgeAdapter from "./NativeSdkBridgeAdapter";
import { MIDDLE_PROJECT_ADAPTER_CONFIG } from "./MiddleProjectAdapterConfig";

const DEFAULT_LANGUAGE = BUSINESS_COMMON_CONFIG.defaultLanguage;

function normalizeCountry(country: string): string {
    if (!country) {
        return "";
    }
    const upper = String(country).toUpperCase();
    return "GB" === upper ? "UK" : upper;
}

function getOrCreateWebDeviceId(): string {
    let deviceId: string = null;
    try {
        deviceId = cc.sys.localStorage.getItem("web_device_id");
    } catch (err) { }
    if (deviceId) {
        return deviceId;
    }
    const generated = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (char) => {
        const random = 16 * Math.random() | 0;
        return ("x" === char ? random : 3 & random | 8).toString(16);
    });
    try {
        cc.sys.localStorage.setItem("web_device_id", generated);
    } catch (err) { }
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
        const normalized = text.replace(/-/g, "+").replace(/_/g, "/");
        const padding = normalized.length % 4;
        const base64 = padding ? normalized + "=".repeat(4 - padding) : normalized;
        return parseJson(atob(base64));
    } catch (err) {
        return null;
    }
}

function parseClientInfo(raw: string): any {
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
    console.warn("[PlatformBridge] getClientInfo parse failed, fallback to {\n}", trimmed.slice(0, 120));
    return {};
}

export default class PlatformBridge {
    static userId: string = "";

    static getClientInfo(): any {
        if (cc.sys.isNative && cc.sys.os === cc.sys.OS_ANDROID) {
            const clientInfo = parseClientInfo(NativeSdkBridgeAdapter.getBridge().getClientInfo());
            clientInfo.box_pkg_name = MIDDLE_PROJECT_ADAPTER_CONFIG.releasePkgName;
            const countryField = MIDDLE_PROJECT_ADAPTER_CONFIG.fieldMapping.local_country;
            let country = normalizeCountry(clientInfo?.local_country || (countryField ? clientInfo?.[countryField] : ""));
            if (!country) {
                const languageMap: { [key: string]: string } = {
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
                country = languageMap[String(cc.sys.language || "").toLowerCase()] || normalizeCountry(DEFAULT_LANGUAGE) || "IN";
                console.warn("[PlatformBridge] native local_country 为空，回退 language 映射 ->", country);
            }
            clientInfo.local_country = country;
            return clientInfo;
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
            local_country: DEFAULT_LANGUAGE,
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

    static setUserId(userId: string): void {
        this.userId = userId;
    }

    static reportData(): void {
    }

    static bindPilot(): void {
        (window as any).pilot = NativeSdkBridgeAdapter.getBridge();
    }

    static getNativeBridge(): any {
        return NativeSdkBridgeAdapter.getBridge();
    }
}
