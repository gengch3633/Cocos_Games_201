import { MIDDLE_CRYPTO_POLICY } from "./MiddleCryptoPolicy";

const FIXED_KEY = MIDDLE_CRYPTO_POLICY.legacy.fixedKey;
const DATE_STRING = MIDDLE_CRYPTO_POLICY.legacy.dateString;
const IV = MIDDLE_CRYPTO_POLICY.iv;
const LOG_PREFIX = "[CryptoHelper]";
let warnedMissing = false;

function getGlobalObject(): any {
    return "undefined" != typeof globalThis ? globalThis : "undefined" != typeof window ? window : {};
}

function getCryptoJS(): any {
    const globalObj = getGlobalObject();
    try {
        if ("undefined" != typeof CryptoJS && CryptoJS) {
            return CryptoJS;
        }
    } catch (e) { }
    if (globalObj && globalObj.CryptoJS) {
        return globalObj.CryptoJS;
    }
    try {
        const mod = require("crypto-js");
        const lib = mod && (mod.default || mod.CryptoJS || mod);
        if (lib) {
            globalObj.CryptoJS = lib;
            return lib;
        }
    } catch (e) { }
    try {
        const mod = require("1.js");
        const lib = (globalObj && globalObj.CryptoJS) || (mod && (mod.default || mod.CryptoJS || mod));
        if (lib) {
            globalObj.CryptoJS = lib;
            return lib;
        }
    } catch (e) { }
    const existing = globalObj && globalObj.CryptoJS;
    if (!existing && !warnedMissing) {
        warnedMissing = true;
        console.warn(LOG_PREFIX + " CryptoJS is undefined, fallback mode enabled.");
    }
    return existing || null;
}

function base64Encode(input: string): string {
    try {
        if ("function" == typeof btoa) {
            return btoa(input);
        }
    } catch (e) { }
    try {
        const globalObj = getGlobalObject();
        if (globalObj.Buffer) {
            return globalObj.Buffer.from(input, "utf8").toString("base64");
        }
    } catch (e) { }
    return input;
}

function base64Decode(input: string): string {
    try {
        if ("function" == typeof atob) {
            return atob(input);
        }
    } catch (e) { }
    try {
        const globalObj = getGlobalObject();
        if (globalObj.Buffer) {
            return globalObj.Buffer.from(input, "base64").toString("utf8");
        }
    } catch (e) { }
    return input;
}

function aesEncrypt(text: string, key: string, iv: string): string {
    const CryptoJS = getCryptoJS();
    if (!CryptoJS) {
        return text;
    }
    const keyWord = CryptoJS.enc.Utf8.parse(key);
    const ivWord = CryptoJS.enc.Utf8.parse(iv);
    return CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(text), keyWord, {
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
        iv: ivWord
    }).toString();
}

function aesDecrypt(text: string, key: string, iv: string): string {
    const CryptoJS = getCryptoJS();
    if (!CryptoJS) {
        return text;
    }
    const keyWord = CryptoJS.enc.Utf8.parse(key);
    const ivWord = CryptoJS.enc.Utf8.parse(iv);
    return CryptoJS.AES.decrypt(text, keyWord, {
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
        iv: ivWord
    }).toString(CryptoJS.enc.Utf8);
}

function buildSalt(text: string): string {
    return base64Encode(text.slice(-16)).slice(0, 14) + "hx";
}

function getKey(seed: string): string {
    const CryptoJS = getCryptoJS();
    if (!CryptoJS) {
        return FIXED_KEY;
    }
    const cipher = aesEncrypt(seed + "_" + FIXED_KEY + "_" + DATE_STRING, FIXED_KEY, IV);
    return CryptoJS.MD5(buildSalt(cipher) + cipher.substring(0, 16)).toString();
}

class CryptoHelper {
    public static encrypt(text: string, seed: string): string {
        return aesEncrypt(text, getKey(seed), IV);
    }

    public static decrypt(text: string, seed: string): string {
        return aesDecrypt(text, getKey(seed), IV);
    }

    public static ngister(url: string, et: string, nonceStr: string, versionName: string, channelName: string, deviceId: string, boxPkgName: string): string {
        const raw = url + " " + versionName + " " + channelName + " " + deviceId + " " + et + " " + nonceStr + " " + getKey(boxPkgName);
        const CryptoJS = getCryptoJS();
        const encoded = CryptoJS ? CryptoJS.MD5(CryptoJS.enc.Utf8.parse(raw)).toString(CryptoJS.enc.Base64) : base64Encode(raw);
        return encoded.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
    }

    public static base64Decode(text: string): string {
        const CryptoJS = getCryptoJS();
        const normalized = text.replace(/-/g, "+").replace(/_/g, "/");
        return CryptoJS ? CryptoJS.enc.Base64.parse(normalized).toString(CryptoJS.enc.Utf8) : base64Decode(normalized);
    }

    public static base64Encode(text: string): string {
        const CryptoJS = getCryptoJS();
        if (!CryptoJS) {
            return base64Encode(text).replace(/-/g, "+").replace(/_/g, "/");
        }
        const word = CryptoJS.enc.Utf8.parse(text);
        return CryptoJS.enc.Base64.stringify(word).replace(/-/g, "+").replace(/_/g, "/");
    }
}

export default CryptoHelper;