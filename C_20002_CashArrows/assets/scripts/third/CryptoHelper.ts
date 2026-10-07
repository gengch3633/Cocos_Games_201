import { MIDDLE_CRYPTO_POLICY } from "./MiddleCryptoPolicy";

const LEGACY_FIXED_KEY = MIDDLE_CRYPTO_POLICY.legacy.fixedKey;
const LEGACY_DATE_STRING = MIDDLE_CRYPTO_POLICY.legacy.dateString;
const IV = MIDDLE_CRYPTO_POLICY.iv;
const LOG_TAG = "[CryptoHelper]";
let warnedMissingCrypto = false;

function getGlobalScope(): any {
    return typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : {};
}

function getCryptoJS(): any {
    const scope = getGlobalScope();
    try {
        if (typeof CryptoJS !== "undefined" && CryptoJS) {
            return CryptoJS;
        }
    } catch (e) {
    }
    if (scope && scope.CryptoJS) {
        return scope.CryptoJS;
    }
    try {
        const cryptoModule = require("crypto-js");
        const crypto = cryptoModule && (cryptoModule.default || cryptoModule.CryptoJS || cryptoModule);
        if (crypto) {
            scope.CryptoJS = crypto;
            return crypto;
        }
    } catch (e) {
    }
    try {
        const legacyModule = require("1.js");
        const crypto = scope && scope.CryptoJS || legacyModule && (legacyModule.default || legacyModule.CryptoJS || legacyModule);
        if (crypto) {
            scope.CryptoJS = crypto;
            return crypto;
        }
    } catch (e) {
    }
    const fallback = scope && scope.CryptoJS;
    if (!fallback && !warnedMissingCrypto) {
        warnedMissingCrypto = true;
        console.warn(LOG_TAG + " CryptoJS is undefined, fallback mode enabled.");
    }
    return fallback || null;
}

function base64Encode(text: string): string {
    try {
        if (typeof btoa === "function") {
            return btoa(text);
        }
    } catch (e) {
    }
    try {
        const scope = getGlobalScope();
        if (scope.Buffer) {
            return scope.Buffer.from(text, "utf8").toString("base64");
        }
    } catch (e) {
    }
    return text;
}

function base64Decode(text: string): string {
    try {
        if (typeof atob === "function") {
            return atob(text);
        }
    } catch (e) {
    }
    try {
        const scope = getGlobalScope();
        if (scope.Buffer) {
            return scope.Buffer.from(text, "base64").toString("utf8");
        }
    } catch (e) {
    }
    return text;
}

function aesEncrypt(text: string, key: string, iv: string): string {
    const crypto = getCryptoJS();
    if (!crypto) {
        return text;
    }
    const parsedKey = crypto.enc.Utf8.parse(key);
    const parsedIv = crypto.enc.Utf8.parse(iv);
    return crypto.AES.encrypt(crypto.enc.Utf8.parse(text), parsedKey, {
        mode: crypto.mode.CBC,
        padding: crypto.pad.Pkcs7,
        iv: parsedIv
    }).toString();
}

function aesDecrypt(text: string, key: string, iv: string): string {
    const crypto = getCryptoJS();
    if (!crypto) {
        return text;
    }
    const parsedKey = crypto.enc.Utf8.parse(key);
    const parsedIv = crypto.enc.Utf8.parse(iv);
    return crypto.AES.decrypt(text, parsedKey, {
        mode: crypto.mode.CBC,
        padding: crypto.pad.Pkcs7,
        iv: parsedIv
    }).toString(crypto.enc.Utf8);
}

function buildDynamicKey(seed: string): string {
    return base64Encode(seed.slice(-16)).slice(0, 14) + "hx";
}

function deriveKey(path: string): string {
    const crypto = getCryptoJS();
    if (!crypto) {
        return LEGACY_FIXED_KEY;
    }
    const encrypted = aesEncrypt(path + "_" + LEGACY_FIXED_KEY + "_" + LEGACY_DATE_STRING, LEGACY_FIXED_KEY, IV);
    return crypto.MD5(buildDynamicKey(encrypted) + encrypted.substring(0, 16)).toString();
}

export default class CryptoHelper {
    static encrypt(text: string, path: string): string {
        return aesEncrypt(text, deriveKey(path), IV);
    }

    static decrypt(text: string, path: string): string {
        return aesDecrypt(text, deriveKey(path), IV);
    }

    static ngister(path: string, timestamp: string, nonce: string, versionName: string, channelName: string, deviceId: string, boxPkgName: string): string {
        const source = path + " " + versionName + " " + channelName + " " + deviceId + " " + timestamp + " " + nonce + " " + deriveKey(boxPkgName);
        const crypto = getCryptoJS();
        return (crypto ? crypto.MD5(crypto.enc.Utf8.parse(source)).toString(crypto.enc.Base64) : base64Encode(source)).replace(/ \+/g, "-").replace(/ \//g, "_").replace(/= +$/, "");
    }

    static base64Decode(text: string): string {
        const crypto = getCryptoJS();
        const normalized = text.replace(/-/g, "+").replace(/ _/g, "/");
        return crypto ? crypto.enc.Base64.parse(normalized).toString(crypto.enc.Utf8) : base64Decode(normalized);
    }

    static base64Encode(text: string): string {
        const crypto = getCryptoJS();
        if (!crypto) {
            return base64Encode(text).replace(/-/g, "+").replace(/ _/g, "/");
        }
        const parsed = crypto.enc.Utf8.parse(text);
        return crypto.enc.Base64.stringify(parsed).replace(/-/g, "+").replace(/ _/g, "/");
    }
}
