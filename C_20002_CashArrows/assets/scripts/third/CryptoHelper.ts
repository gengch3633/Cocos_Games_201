import { MIDDLE_CRYPTO_POLICY } from "./MiddleCryptoPolicy";

const LOG_TAG = "[CryptoHelper]";
const LEGACY_FIXED_KEY = MIDDLE_CRYPTO_POLICY.legacy.fixedKey;
const LEGACY_DATE_STRING = MIDDLE_CRYPTO_POLICY.legacy.dateString;
const IV = MIDDLE_CRYPTO_POLICY.iv;
let warned = false;

declare const CryptoJS: any;

function resolveCryptoJS(): any {
    const globalScope: any = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : {};
    try {
        if (typeof CryptoJS !== "undefined" && CryptoJS) {
            return CryptoJS;
        }
    } catch (e) {
    }
    if (globalScope && globalScope.CryptoJS) {
        return globalScope.CryptoJS;
    }
    try {
        const cryptoModule = require("crypto-js");
        const resolved = cryptoModule && (cryptoModule.default || cryptoModule.CryptoJS || cryptoModule);
        if (resolved) {
            globalScope.CryptoJS = resolved;
            return resolved;
        }
    } catch (e) {
    }
    try {
        const bundled = require("./1");
        const resolved = globalScope.CryptoJS || (bundled && (bundled.default || bundled.CryptoJS || bundled));
        if (resolved) {
            globalScope.CryptoJS = resolved;
            return resolved;
        }
    } catch (e) {
    }
    const fallback = globalScope && globalScope.CryptoJS;
    if (!fallback && !warned) {
        warned = true;
        console.warn(LOG_TAG + " CryptoJS is undefined, fallback mode enabled.");
    }
    return fallback || null;
}

function base64EncodeUtf8(text: string): string {
    try {
        if (typeof btoa === "function") {
            return btoa(text);
        }
    } catch (e) {
    }
    try {
        const globalScope: any = typeof globalThis !== "undefined" ? globalThis : {};
        if (globalScope.Buffer) {
            return globalScope.Buffer.from(text, "utf8").toString("base64");
        }
    } catch (e) {
    }
    return text;
}

function base64DecodeUtf8(text: string): string {
    try {
        if (typeof atob === "function") {
            return atob(text);
        }
    } catch (e) {
    }
    try {
        const globalScope: any = typeof globalThis !== "undefined" ? globalThis : {};
        if (globalScope.Buffer) {
            return globalScope.Buffer.from(text, "base64").toString("utf8");
        }
    } catch (e) {
    }
    return text;
}

function aesEncrypt(text: string, key: string, iv: string): string {
    const crypto = resolveCryptoJS();
    if (!crypto) {
        return text;
    }
    const parsedKey = crypto.enc.Utf8.parse(key);
    const parsedIv = crypto.enc.Utf8.parse(iv);
    return crypto.AES.encrypt(crypto.enc.Utf8.parse(text), parsedKey, {
        mode: crypto.mode.CBC,
        padding: crypto.pad.Pkcs7,
        iv: parsedIv,
    }).toString();
}

function aesDecrypt(text: string, key: string, iv: string): string {
    const crypto = resolveCryptoJS();
    if (!crypto) {
        return text;
    }
    const parsedKey = crypto.enc.Utf8.parse(key);
    const parsedIv = crypto.enc.Utf8.parse(iv);
    return crypto.AES.decrypt(text, parsedKey, {
        mode: crypto.mode.CBC,
        padding: crypto.pad.Pkcs7,
        iv: parsedIv,
    }).toString(crypto.enc.Utf8);
}

function deriveSuffix(value: string): string {
    return base64EncodeUtf8(value.slice(-16)).slice(0, 14) + "hx";
}

function deriveKey(path: string): string {
    const crypto = resolveCryptoJS();
    if (!crypto) {
        return LEGACY_FIXED_KEY;
    }
    const encrypted = aesEncrypt(path + "_" + LEGACY_FIXED_KEY + "_" + LEGACY_DATE_STRING, LEGACY_FIXED_KEY, IV);
    return crypto.MD5(deriveSuffix(encrypted) + encrypted.substring(0, 16)).toString();
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
        packageName: string
    ): string {
        const source = path + " " + versionName + " " + channelName + " " + deviceId + " " + timestamp + " " + nonce + " " + deriveKey(packageName);
        const crypto = resolveCryptoJS();
        const encoded = crypto
            ? crypto.MD5(crypto.enc.Utf8.parse(source)).toString(crypto.enc.Base64)
            : base64EncodeUtf8(source);
        return encoded.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
    }

    static base64Decode(text: string): string {
        const crypto = resolveCryptoJS();
        const normalized = text.replace(/-/g, "+").replace(/_/g, "/");
        return crypto
            ? crypto.enc.Base64.parse(normalized).toString(crypto.enc.Utf8)
            : base64DecodeUtf8(normalized);
    }

    static base64Encode(text: string): string {
        const crypto = resolveCryptoJS();
        if (!crypto) {
            return base64EncodeUtf8(text).replace(/-/g, "+").replace(/_/g, "/");
        }
        const parsed = crypto.enc.Utf8.parse(text);
        return crypto.enc.Base64.stringify(parsed).replace(/-/g, "+").replace(/_/g, "/");
    }
}
