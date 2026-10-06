import { MIDDLE_CRYPTO_POLICY } from "./MiddleCryptoPolicy";

const LEGACY_FIXED_KEY = MIDDLE_CRYPTO_POLICY.legacy.fixedKey;
const LEGACY_DATE_STRING = MIDDLE_CRYPTO_POLICY.legacy.dateString;
const IV = MIDDLE_CRYPTO_POLICY.iv;
const LOG_TAG = "[CryptoHelper]";

let warnedMissingCrypto = false;

declare const CryptoJS: any;

function getCryptoJs(): any {
    const globalRef: any = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : {};
    try {
        if (typeof CryptoJS !== "undefined" && CryptoJS) {
            return CryptoJS;
        }
    } catch {
        // ignore
    }
    if (globalRef && globalRef.CryptoJS) {
        return globalRef.CryptoJS;
    }
    try {
        const cryptoModule = require("./vendor/crypto-js");
        const crypto = cryptoModule && (cryptoModule.default || cryptoModule.CryptoJS || cryptoModule);
        if (crypto) {
            globalRef.CryptoJS = crypto;
            return crypto;
        }
    } catch {
        // ignore
    }
    try {
        const gameCrypto = require("./vendor/BPR_Game_Crypto");
        const crypto = (globalRef && globalRef.CryptoJS) || (gameCrypto && (gameCrypto.default || gameCrypto.CryptoJS || gameCrypto));
        if (crypto) {
            globalRef.CryptoJS = crypto;
            return crypto;
        }
    } catch {
        // ignore
    }
    if (!warnedMissingCrypto) {
        warnedMissingCrypto = true;
        console.warn(LOG_TAG + " CryptoJS is undefined, fallback mode enabled.");
    }
    return globalRef.CryptoJS || null;
}

function base64EncodeFallback(text: string): string {
    try {
        if (typeof btoa === "function") {
            return btoa(text);
        }
    } catch {
        // ignore
    }
    try {
        const globalRef: any = typeof globalThis !== "undefined" ? globalThis : {};
        if (globalRef.Buffer) {
            return globalRef.Buffer.from(text, "utf8").toString("base64");
        }
    } catch {
        // ignore
    }
    return text;
}

function base64DecodeFallback(text: string): string {
    try {
        if (typeof atob === "function") {
            return atob(text);
        }
    } catch {
        // ignore
    }
    try {
        const globalRef: any = typeof globalThis !== "undefined" ? globalThis : {};
        if (globalRef.Buffer) {
            return globalRef.Buffer.from(text, "base64").toString("utf8");
        }
    } catch {
        // ignore
    }
    return text;
}

function aesEncrypt(text: string, key: string, ivValue: string): string {
    const crypto = getCryptoJs();
    if (!crypto) {
        return text;
    }
    const parsedKey = crypto.enc.Utf8.parse(key);
    const parsedIv = crypto.enc.Utf8.parse(ivValue);
    return crypto.AES.encrypt(crypto.enc.Utf8.parse(text), parsedKey, {
        mode: crypto.mode.CBC,
        padding: crypto.pad.Pkcs7,
        iv: parsedIv,
    }).toString();
}

function aesDecrypt(text: string, key: string, ivValue: string): string {
    const crypto = getCryptoJs();
    if (!crypto) {
        return text;
    }
    const parsedKey = crypto.enc.Utf8.parse(key);
    const parsedIv = crypto.enc.Utf8.parse(ivValue);
    return crypto.AES.decrypt(text, parsedKey, {
        mode: crypto.mode.CBC,
        padding: crypto.pad.Pkcs7,
        iv: parsedIv,
    }).toString(crypto.enc.Utf8);
}

function buildKeySuffix(value: string): string {
    return base64EncodeFallback(value.slice(-16)).slice(0, 14) + "hx";
}

function deriveKey(path: string): string {
    const crypto = getCryptoJs();
    if (!crypto) {
        return LEGACY_FIXED_KEY;
    }
    const encrypted = aesEncrypt(path + "_" + LEGACY_FIXED_KEY + "_" + LEGACY_DATE_STRING, LEGACY_FIXED_KEY, IV);
    return crypto.MD5(buildKeySuffix(encrypted) + encrypted.substring(0, 16)).toString();
}

export default class CryptoHelper {
    static encrypt(text: string, path: string): string {
        return aesEncrypt(text, deriveKey(path), IV);
    }

    static decrypt(text: string, path: string): string {
        return aesDecrypt(text, deriveKey(path), IV);
    }

    static ngister(
        path: string,
        timestamp: string,
        nonce: string,
        versionName: string,
        channelName: string,
        deviceId: string,
        boxPkgName: string,
    ): string {
        const source = path + " " + versionName + " " + channelName + " " + deviceId + " " + timestamp + " " + nonce + " " + deriveKey(boxPkgName);
        const crypto = getCryptoJs();
        return (crypto ? crypto.MD5(crypto.enc.Utf8.parse(source)).toString(crypto.enc.Base64) : base64EncodeFallback(source))
            .replace(/\+/g, "-")
            .replace(/\//g, "_")
            .replace(/=+$/, "");
    }

    static base64Decode(text: string): string {
        const crypto = getCryptoJs();
        const normalized = text.replace(/-/g, "+").replace(/_/g, "/");
        return crypto ? crypto.enc.Base64.parse(normalized).toString(crypto.enc.Utf8) : base64DecodeFallback(normalized);
    }

    static base64Encode(text: string): string {
        const crypto = getCryptoJs();
        if (!crypto) {
            return base64EncodeFallback(text).replace(/-/g, "+").replace(/_/g, "/");
        }
        const parsed = crypto.enc.Utf8.parse(text);
        return crypto.enc.Base64.stringify(parsed).replace(/-/g, "+").replace(/_/g, "/");
    }
}
