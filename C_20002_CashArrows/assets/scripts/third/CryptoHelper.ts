import { MIDDLE_CRYPTO_POLICY } from "./MiddleCryptoPolicy";

declare function require(id: string): any;
declare const CryptoJS: any;

var fixedKey = MIDDLE_CRYPTO_POLICY.legacy.fixedKey,
    dateString = MIDDLE_CRYPTO_POLICY.legacy.dateString,
    iv = MIDDLE_CRYPTO_POLICY.iv,
    tag = "[CryptoHelper]",
    warned = false;

function getCryptoJS(): any {
    var t: any = "undefined" != typeof globalThis ? globalThis : "undefined" != typeof window ? window : {};
    try {
        if ("undefined" != typeof CryptoJS && CryptoJS) return CryptoJS;
    } catch (e) {}
    if (t && t.CryptoJS) return t.CryptoJS;
    try {
        var i = require("crypto-js"),
            n = i && (i.default || i.CryptoJS || i);
        if (n) {
            t.CryptoJS = n;
            return n;
        }
    } catch (e) {}
    try {
        var a = require("1.js"),
            o = t && t.CryptoJS || a && (a.default || a.CryptoJS || a);
        if (o) {
            t.CryptoJS = o;
            return o;
        }
    } catch (e) {}
    var r = t && t.CryptoJS;
    if (!r && !warned) {
        warned = true;
        console.warn(tag + " CryptoJS is undefined, fallback mode enabled.");
    }
    return r || null;
}

function encodeBase64(e: any): any {
    try {
        if ("function" == typeof btoa) return btoa(e);
    } catch (e) {}
    try {
        var t: any = "undefined" != typeof globalThis ? globalThis : {};
        if (t.Buffer) return t.Buffer.from(e, "utf8").toString("base64");
    } catch (e) {}
    return e;
}

function decodeBase64(e: any): any {
    try {
        if ("function" == typeof atob) return atob(e);
    } catch (e) {}
    try {
        var t: any = "undefined" != typeof globalThis ? globalThis : {};
        if (t.Buffer) return t.Buffer.from(e, "base64").toString("utf8");
    } catch (e) {}
    return e;
}

function aesEncrypt(e: any, t: any, i: any): any {
    var n = getCryptoJS();
    if (!n) return e;
    var a = n.enc.Utf8.parse(t),
        o = n.enc.Utf8.parse(i);
    return n.AES.encrypt(n.enc.Utf8.parse(e), a, {
        mode: n.mode.CBC,
        padding: n.pad.Pkcs7,
        iv: o
    }).toString();
}

function aesDecrypt(e: any, t: any, i: any): any {
    var n = getCryptoJS();
    if (!n) return e;
    var a = n.enc.Utf8.parse(t),
        o = n.enc.Utf8.parse(i);
    return n.AES.decrypt(e, a, {
        mode: n.mode.CBC,
        padding: n.pad.Pkcs7,
        iv: o
    }).toString(n.enc.Utf8);
}

function tailKey(e: any): string {
    return encodeBase64(e.slice(-16)).slice(0, 14) + "hx";
}

function deriveKey(e: any): any {
    var t = getCryptoJS();
    if (!t) return fixedKey;
    var i = aesEncrypt(e + "_" + fixedKey + "_" + dateString, fixedKey, iv);
    return t.MD5(tailKey(i) + i.substring(0, 16)).toString();
}

export default class CryptoHelper {
    static encrypt(e: any, t: any) {
        return aesEncrypt(e, deriveKey(t), iv);
    }

    static decrypt(e: any, t: any) {
        return aesDecrypt(e, deriveKey(t), iv);
    }

    static ngister(e: any, t: any, i: any, n: any, a: any, o: any, r: any) {
        var s = e + " " + n + " " + a + " " + o + " " + t + " " + i + " " + deriveKey(r),
            l = getCryptoJS();
        return (l ? l.MD5(l.enc.Utf8.parse(s)).toString(l.enc.Base64) : encodeBase64(s)).replace(/ \+/g, "-").replace(/ \//g, "_").replace(/= + $/, "");
    }

    static base64Decode(e: any) {
        var t = getCryptoJS(),
            i = e.replace(/-/g, "+").replace(/ _/g, "/");
        return t ? t.enc.Base64.parse(i).toString(t.enc.Utf8) : decodeBase64(i);
    }

    static base64Encode(e: any) {
        var t = getCryptoJS();
        if (!t) return encodeBase64(e).replace(/-/g, "+").replace(/ _/g, "/");
        var i = t.enc.Utf8.parse(e);
        return t.enc.Base64.stringify(i).replace(/-/g, "+").replace(/ _/g, "/");
    }
}
