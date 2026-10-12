import * as MiddleCryptoPolicy from "./MiddleCryptoPolicy";

declare const require: (path: string) => any;

const LEGACY_FIXED_KEY: string = MiddleCryptoPolicy.MIDDLE_CRYPTO_POLICY.legacy.fixedKey;
const LEGACY_DATE_STRING: string = MiddleCryptoPolicy.MIDDLE_CRYPTO_POLICY.legacy.dateString;
const CRYPTO_IV: string = MiddleCryptoPolicy.MIDDLE_CRYPTO_POLICY.iv;
const LOG_TAG: string = "[CryptoHelper]";
const GLOBAL_SCOPE: any = typeof window !== "undefined" ? window : {};

let cryptoJsWarningShown: boolean = false;

function getCryptoJS(): any {
    if (GLOBAL_SCOPE && GLOBAL_SCOPE.CryptoJS) {
        return GLOBAL_SCOPE.CryptoJS;
    }

    try {
        const cryptoJsModule: any = require("crypto-js");
        const resolved: any = cryptoJsModule && (cryptoJsModule.default || cryptoJsModule.CryptoJS || cryptoJsModule);
        if (resolved) {
            GLOBAL_SCOPE.CryptoJS = resolved;
            return resolved;
        }
    } catch (e) {}

    try {
        const fallbackModule: any = require("1.js");
        const resolved: any =
            (GLOBAL_SCOPE && GLOBAL_SCOPE.CryptoJS) ||
            (fallbackModule && (fallbackModule.default || fallbackModule.CryptoJS || fallbackModule));
        if (resolved) {
            GLOBAL_SCOPE.CryptoJS = resolved;
            return resolved;
        }
    } catch (e) {}

    const cached: any = GLOBAL_SCOPE && GLOBAL_SCOPE.CryptoJS;
    if (!cached && !cryptoJsWarningShown) {
        cryptoJsWarningShown = true;
        console.warn(LOG_TAG + " CryptoJS is undefined, fallback mode enabled.");
    }
    return cached || null;
}

function encodeBase64(text: string): string {
    try {
        if (typeof GLOBAL_SCOPE.btoa === "function") {
            return GLOBAL_SCOPE.btoa(text);
        }
    } catch (e) {}

    try {
        if (GLOBAL_SCOPE.Buffer) {
            return GLOBAL_SCOPE.Buffer.from(text, "utf8").toString("base64");
        }
    } catch (e) {}

    return text;
}

function decodeBase64(text: string): string {
    try {
        if (typeof GLOBAL_SCOPE.atob === "function") {
            return GLOBAL_SCOPE.atob(text);
        }
    } catch (e) {}

    try {
        if (GLOBAL_SCOPE.Buffer) {
            return GLOBAL_SCOPE.Buffer.from(text, "base64").toString("utf8");
        }
    } catch (e) {}

    return text;
}

function aesEncrypt(plainText: string, key: string, iv: string): string {
    const crypto: any = getCryptoJS();
    if (!crypto) {
        return plainText;
    }
    const parsedKey: any = crypto.enc.Utf8.parse(key);
    const parsedIv: any = crypto.enc.Utf8.parse(iv);
    return String(
        crypto.AES.encrypt(crypto.enc.Utf8.parse(plainText), parsedKey, {
            mode: crypto.mode.CBC,
            padding: crypto.pad.Pkcs7,
            iv: parsedIv
        }).toString()
    );
}

function aesDecrypt(cipherText: string, key: string, iv: string): string {
    const crypto: any = getCryptoJS();
    if (!crypto) {
        return cipherText;
    }
    const parsedKey: any = crypto.enc.Utf8.parse(key);
    const parsedIv: any = crypto.enc.Utf8.parse(iv);
    return String(
        crypto.AES.decrypt(cipherText, parsedKey, {
            mode: crypto.mode.CBC,
            padding: crypto.pad.Pkcs7,
            iv: parsedIv
        }).toString(crypto.enc.Utf8)
    );
}

function buildDigestSeed(value: string): string {
    return encodeBase64(value.slice(-16)).slice(0, 14) + "hx";
}

function buildSecretKey(seed: string): string {
    const crypto: any = getCryptoJS();
    if (!crypto) {
        return LEGACY_FIXED_KEY;
    }
    const encrypted: string = aesEncrypt(
        seed + "_" + LEGACY_FIXED_KEY + "_" + LEGACY_DATE_STRING,
        LEGACY_FIXED_KEY,
        CRYPTO_IV
    );
    return String(crypto.MD5(buildDigestSeed(encrypted) + encrypted.substring(0, 16)).toString());
}

export default class CryptoHelper {
    public static encrypt(plainText: string, seed: string): string {
        return aesEncrypt(plainText, buildSecretKey(seed), CRYPTO_IV);
    }

    public static decrypt(cipherText: string, seed: string): string {
        return aesDecrypt(cipherText, buildSecretKey(seed), CRYPTO_IV);
    }

    public static ngister(
        e: string,
        t: string,
        i: string,
        n: string,
        a: string,
        o: string,
        seed: string
    ): string {
        const raw: string = e + " " + n + " " + a + " " + o + " " + t + " " + i + " " + buildSecretKey(seed);
        const crypto: any = getCryptoJS();
        const encoded: string = crypto
            ? String(crypto.MD5(crypto.enc.Utf8.parse(raw)).toString(crypto.enc.Base64))
            : encodeBase64(raw);
        return encoded.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
    }

    public static base64Decode(value: string): string {
        const crypto: any = getCryptoJS();
        const normalized: string = value.replace(/-/g, "+").replace(/_/g, "/");
        return crypto
            ? String(crypto.enc.Base64.parse(normalized).toString(crypto.enc.Utf8))
            : decodeBase64(normalized);
    }

    public static base64Encode(value: string): string {
        const crypto: any = getCryptoJS();
        if (!crypto) {
            return encodeBase64(value).replace(/-/g, "+").replace(/_/g, "/");
        }
        const parsed: any = crypto.enc.Utf8.parse(value);
        return String(crypto.enc.Base64.stringify(parsed)).replace(/-/g, "+").replace(/_/g, "/");
    }
}