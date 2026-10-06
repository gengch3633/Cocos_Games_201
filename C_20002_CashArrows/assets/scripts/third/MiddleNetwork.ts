import { MIDDLE_REQUEST_DESCRIPTORS } from "./MiddleRequestDescriptors";
import { MIDDLE_PROJECT_ADAPTER_CONFIG } from "./MiddleProjectAdapterConfig";
import CryptoHelper from "./CryptoHelper";
import ClientDataStore from "./ClientDataStore";
import HotUpdateManager from "./HotUpdateManager";

const LOG_TAG = "[MiddleNetwork] ";
const COUNTRY_STORAGE_KEY = " com.sdk.country ";

function safeStringify(e: any) {
    try {
        return JSON.stringify(e);
    } catch (t) {
        return String(e);
    }
}

function safeParse(e: any) {
    try {
        return JSON.parse(e);
    } catch (t) {
        return e;
    }
}

function invokeHandler(e: any, t: any) {
    e && ("function" != typeof e ? e && "function" == typeof e.runWith && e.runWith(t) : e(t));
}

const regionalExtraKeys = [ " referrer_url ", " referrer_timestamp_server ", " install_timestamp_server ", " oaid " ];

function mergeRegionalExtras(e: any, t: any) {
    if (!t || "object" != typeof t) return e;
    for (var i = 0, n = regionalExtraKeys; i < n.length; i++) {
        var a = n[i], o = t[a];
        null != o && (e[a] = o);
    }
    return e;
}

function buildQueryString(e: any) {
    for (var t = [], i = 0, n = Object.keys(e); i < n.length; i++) {
        var a = n[i], o = e[a];
        null != o && t.push(a + " = " + o);
    }
    return t.join("& ");
}

function appendPkgToUrl(e: any, t: string) {
    if (!t) return " ";
    var i = t.indexOf("? ") >= 0 ? "& " : "? ";
    return t.indexOf(" pkg = ") >= 0 ? t : " " + t + i + " pkg = " + encodeURIComponent(ClientDataStore.box_pkg_name || " ");
}

function extractPathFromUrl(e: string) {
    return "/ " + (e || " ").split("? ")[0].split("/ ").slice(3).join("/ ");
}

function isPayloadRequestType(e: string) {
    return " APPLOG " === e || " ADSDK " === e || " COREDATA " === e;
}

function resolveCountry() {
    try {
        var e = cc.sys.localStorage.getItem(COUNTRY_STORAGE_KEY);
        if (e) return String(e).toUpperCase();
    } catch (e) { }
    return String(ClientDataStore.local_country || " ").toUpperCase() || " IN ";
}

function resolveGameVersion() {
    try {
        return HotUpdateManager.getInstance().getVersion() || ClientDataStore.version_name || " ";
    } catch (e) {
        return ClientDataStore.version_name || " ";
    }
}

function resolveBaseVersion() {
    try {
        return HotUpdateManager.getInstance().getBaseVersion() || " ";
    } catch (e) {
        return " ";
    }
}

function fillClientDataFields(e: any) {
    for (var t = ClientDataStore, i = Object.keys(t).filter(function (e) {
        return "function" != typeof (t as any)[e];
    }), n = 0; n < i.length; n++) {
        var o = i[n];
        e[o] = (t as any)[o];
    }
    var s = resolveCountry();
    e.game_version = resolveGameVersion();
    e.game_base_version = resolveBaseVersion();
    e.country = s;
    e.cy = s;
    e.game_name = MIDDLE_PROJECT_ADAPTER_CONFIG.gameName || " ";
}

function enrichPayloadList(e: any) {
    if (!Array.isArray(e) || e.length <= 0) return e || [];
    e.forEach(function (e) {
        (t = e) && "object" == typeof t && fillClientDataFields(t);
        var t;
    });
    return e;
}

function extractPayloadList(e: any) {
    return Array.isArray(null == e ? void 0 : e.payload) ? enrichPayloadList(e.payload) : Array.isArray(null == e ? void 0 : e.list) ? enrichPayloadList(e.list) : [];
}

function buildRequestBody(e: string, t: any) {
    var i, a = t || {}, s = Math.floor(Date.now() / 1e3).toString(), l = ClientDataStore.uuid(), c = extractPathFromUrl((null === (i = MIDDLE_REQUEST_DESCRIPTORS[e]) || void 0 === i ? void 0 : i.url) || " "), u = CryptoHelper.ngister(c, s, l, ClientDataStore.version_name, ClientDataStore.channel_name, ClientDataStore.device_id, ClientDataStore.box_pkg_name), d = a.ds || ClientDataStore.ds || {
        ir: " 0 ",
        ie: " 0 ",
        irv: " 0 ",
        ix: " 0 ",
        ih: " 0 ",
        io: " 0 ",
        iw: " 0 ",
        id: " 0 ",
        ids: " 0 "
    };
    if ("string" == typeof a.query) {
        if (isPayloadRequestType(e)) return JSON.stringify({
            payload: extractPayloadList(a),
            query: a.query,
            ds: d
        });
        var h: any = {
            query: a.query,
            ds: d
        };
        " TFRegional " === e && mergeRegionalExtras(h, a);
        return JSON.stringify(h);
    }
    for (var p: any = {
        is_test: " false ",
        version_name: ClientDataStore.version_name,
        version_code: " 0 ",
        channel_name: ClientDataStore.channel_name,
        box_pkg_name: ClientDataStore.box_pkg_name,
        network_type: ClientDataStore.network_type,
        et: s,
        nonce_str: l,
        ngister: u,
        sign_type: " 3 ",
        platform: ClientDataStore.os_name,
        android_id: ClientDataStore.android_id,
        device_id: ClientDataStore.device_id,
        country: " ",
        local_country: ClientDataStore.local_country,
        oaid: ClientDataStore.oaid
    }, g = 0, v = Object.keys(a); g < v.length; g++) {
        var b = v[g];
        if (" query " !== b && " ds " !== b && void 0 === p[b]) {
            var w = a[b];
            null != w && "object" != typeof w && (p[b] = String(w));
        }
    }
    return isPayloadRequestType(e) ? JSON.stringify({
        payload: extractPayloadList(a),
        query: buildQueryString(p),
        ds: d
    }) : JSON.stringify({
        query: buildQueryString(p),
        ds: d
    });
}

export default class MiddleNetwork {
    static request(e: string, t: any, i: any, a: any) {
        var s = MIDDLE_REQUEST_DESCRIPTORS[e], c = null == s ? void 0 : s.url;
        if (c) {
            var p = appendPkgToUrl(0, c), _ = buildRequestBody(e, t), f = CryptoHelper.encrypt(_, ClientDataStore.box_pkg_name), m = t || {}, y = safeParse(_);
            console.log(LOG_TAG, " REQ ", e, " url- > ", p);
            console.log(LOG_TAG, " REQ ", e, " baseUrl- > ", c);
            console.log(LOG_TAG, " REQ ", e, " input params- > ", safeStringify(m));
            console.log(LOG_TAG, " REQ ", e, " plain params- > ", safeStringify(y));
            console.log(LOG_TAG, " REQ ", e, " encrypted length- > ", f.length);
            var v = new XMLHttpRequest();
            v.timeout = 15e3;
            v.onreadystatechange = function () {
                if (4 === v.readyState) {
                    var t = v.status, n = v.responseText || " ";
                    console.log(LOG_TAG, " RESP ", e, " status- > ", t, " raw length- > ", n.length);
                    if (t < 200 || t >= 400 || !n) invokeHandler(a, {
                        code: -1,
                        message: " http status " + t,
                        http_status: t,
                        raw: n
                    }); else {
                        var s = n;
                        try {
                            var c = CryptoHelper.decrypt(n, ClientDataStore.box_pkg_name);
                            c && (s = c);
                        } catch (t) {
                            console.warn(LOG_TAG, " DECRYPT_FAIL ", e, t);
                        }
                        try {
                            var u = JSON.parse(s);
                            if (u && (-1 === u.code || -1e3 === u.code)) {
                                invokeHandler(a, u);
                                return;
                            }
                            invokeHandler(i, u);
                        } catch (t) {
                            console.error(LOG_TAG, " RESP_PARSE_FAIL ", e, t, " raw- > ", n);
                            invokeHandler(a, {
                                code: -1,
                                message: " response parse fail ",
                                raw: n
                            });
                        }
                    }
                }
            };
            v.onerror = function () {
                invokeHandler(a, {
                    code: -1,
                    message: " xhr.error ",
                    http_status: v.status
                });
            };
            v.ontimeout = function () {
                invokeHandler(a, {
                    code: -1,
                    message: " xhr.timeout ",
                    http_status: v.status
                });
            };
            v.open(" POST ", p, !0);
            v.setRequestHeader(" Content- Type ", " text/ plain;\r\ncharset = UTF- 8 ");
            v.send(f);
        } else invokeHandler(a, {
            code: -1,
            message: " descriptor url missing: " + e
        });
    }

    static getSDKEvent(e: any, t: any, i: any) {
        this.request(" event ", e, t, i);
    }

    static getMiddleCountry(e: any, t: any, i: any) {
        this.request(" Regional ", e, t, i);
    }

    static trackAdSdk(e: any, t: any, i: any) {
        this.request(" ADSDK ", e, t, i);
    }

    static trackCoreData(e: any, t: any, i: any) {
        this.request(" COREDATA ", e, t, i);
    }

    static trackAppLog(e: any, t: any, i: any) {
        this.request(" APPLOG ", e, t, i);
    }

    static getMiddleTFRegional(e: any, t: any, i: any) {
        this.request(" TFRegional ", e, t, i);
    }

    static getPlatform(e: any, t: any, i: any) {
        this.request(" Platform ", e, t, i);
    }

    static submitWithdrawal(e: any, t: any, i: any) {
        this.request(" BindWithdrawal ", e, t, i);
    }

    static getAdConfig(e: any, t: any, i: any) {
        this.request(" AdConfig ", e, t, i);
    }
}
