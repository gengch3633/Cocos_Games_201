// @ts-nocheck
import NativeSdkBridgeAdapter from "./NativeSdkBridgeAdapter";
import { MIDDLE_PROJECT_ADAPTER_CONFIG } from "./MiddleProjectAdapterConfig";
import { BUSINESS_COMMON_CONFIG } from "./BusinessCommonConfig";

function normalizeCountry(code) {
    if (!code) {
        return "";
    }
    const value = String(code).toUpperCase();
    return value === "GB" ? "UK" : value;
}

function getWebDeviceId() {
    let deviceId = null;
    try {
        deviceId = cc.sys.localStorage.getItem("web_device_id");
    } catch (e) {}
    if (deviceId) {
        return deviceId;
    }
    const generated = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (char) => {
        const rand = (Math.random() * 16) | 0;
        return (char === "x" ? rand : (rand & 0x3) | 0x8).toString(16);
    });
    try {
        cc.sys.localStorage.setItem("web_device_id", generated);
    } catch (e) {}
    return generated;
}

function parseJson(value) {
    if (!value) {
        return null;
    }
    try {
        return JSON.parse(value);
    } catch (e) {
        return null;
    }
}

function parseBase64Json(value) {
    if (!value) {
        return null;
    }
    try {
        const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
        const padding = normalized.length % 4;
        const padded = padding ? normalized + "=".repeat(4 - padding) : normalized;
        return parseJson(atob(padded));
    } catch (e) {
        return null;
    }
}

function parseClientInfo(value) {
    if (value && typeof value === "object") {
        return value;
    }
    if (typeof value !== "string") {
        return {};
    }
    const trimmed = value.trim();
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

const languageCountryMap = {
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

export default class PlatformBridge {
    static userId = "";

    static getClientInfo() {
        if (cc.sys.isNative && cc.sys.os === cc.sys.OS_ANDROID) {
            const info = parseClientInfo(NativeSdkBridgeAdapter.default.getBridge().getClientInfo());
            info.box_pkg_name = MIDDLE_PROJECT_ADAPTER_CONFIG.releasePkgName;
            const countryField = MIDDLE_PROJECT_ADAPTER_CONFIG.fieldMapping.local_country;
            let country = normalizeCountry(
                info?.local_country || (countryField ? info?.[countryField] : ""),
            );
            if (!country) {
                country =
                    languageCountryMap[String(cc.sys.language || "").toLowerCase()] ||
                    normalizeCountry(BUSINESS_COMMON_CONFIG.defaultLanguage) ||
                    "IN";
                console.warn("[PlatformBridge] native local_country 为空，回退 language 映射 ->", country);
            }
            info.local_country = country;
            return info;
        }
        return {
            device_id: getWebDeviceId(),
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
            local_country: BUSINESS_COMMON_CONFIG.defaultLanguage,
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

    static setUserId(userId) {
        this.userId = userId;
    }

    static reportData() {}

    static bindPilot() {
        window.pilot = NativeSdkBridgeAdapter.default.getBridge();
    }

    static getNativeBridge() {
        return NativeSdkBridgeAdapter.default.getBridge();
    }
}
