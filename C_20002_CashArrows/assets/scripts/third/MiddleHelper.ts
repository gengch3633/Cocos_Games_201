import { MIDDLE_REQUEST_DESCRIPTORS } from "./MiddleRequestDescriptors";
import { MIDDLE_PROJECT_ADAPTER_CONFIG } from "./MiddleProjectAdapterConfig";
import ClientDataStore from "./ClientDataStore";
import BusinessAnalyticsService from "./BusinessAnalyticsService";
import MiddleNetwork from "./MiddleNetwork";
import PlatformBridge from "./PlatformBridge";

class MiddleHelperImpl {
    kIsUploadIPFirstCall: string;
    isSupportHot: boolean;
    isFinishRegional: boolean;
    hasServerCountry: boolean;
    banRed: boolean;
    banPay: boolean;
    recogIRE: boolean;
    recogTF: boolean;
    mfi: boolean;
    country: any;

    constructor() {
        this.kIsUploadIPFirstCall = " com.sdk.kIsUploadIPFirstCall ";
        this.isSupportHot = false;
        this.isFinishRegional = false;
        this.hasServerCountry = false;
        this.banRed = true;
        this.banPay = false;
        this.recogIRE = false;
        this.recogTF = false;
        this.mfi = true;
        this.country = null;
    }

    normalizeCountry(e: any) {
        if (!e) return " ";
        var t = String(e).toUpperCase();
        return " GB " === t ? " UK " : t;
    }

    mapLanguageToCountry(e: any) {
        return {
            zh: " CN ",
            en: " US ",
            id: " ID ",
            pt: " BR ",
            ru: " RU ",
            de: " DE ",
            fr: " FR ",
            es: " MX ",
            hi: " IN ",
            th: " TH ",
            ja: " JP ",
            ko: " KR ",
            fil: " PH ",
            tl: " PH "
        }[String(e || " ").toLowerCase()] || " IN ";
    }

    resolveDefaultCountry() {
        return this.normalizeCountry(ClientDataStore.local_country) || this.mapLanguageToCountry(cc.sys.language);
    }

    applyCountry(e: any) {
        var t = this.normalizeCountry(e);
        t || (t = this.resolveDefaultCountry());
        this.saveLocalCountry(t);
        ClientDataStore.local_country = t;
        "function" == typeof ClientDataStore.buildCommonUrlStr && ClientDataStore.buildCommonUrlStr();
        "function" == typeof ClientDataStore.buildMiddleCommonUrlStr && ClientDataStore.buildMiddleCommonUrlStr();
        return t;
    }

    localCountry() {
        if (!this.country) try {
            this.country = cc.sys.localStorage.getItem(" com.sdk.country ");
        } catch (e) { }
        return this.country;
    }

    saveLocalCountry(e: any) {
        try {
            cc.sys.localStorage.setItem(" com.sdk.country ", e);
        } catch (e) { }
        this.country = e;
    }

    getRegionalState() {
        return {
            isSupportHot: this.isSupportHot,
            isFinishRegional: this.isFinishRegional,
            hasServerCountry: this.hasServerCountry,
            banRed: this.banRed,
            banPay: this.banPay,
            recogIRE: this.recogIRE,
            recogTF: this.recogTF,
            mfi: this.mfi,
            country: this.country || this.localCountry()
        };
    }

    initAdSdkAfterRegional(e: any, t: any) {
        try {
            var i = t || ClientDataStore.local_country || " IN ", n = !(!e || true !== e.is_ump && true !== e.is_ump_country), r = MIDDLE_PROJECT_ADAPTER_CONFIG.maxKey || " ";
            PlatformBridge.getNativeBridge().initSdk(r, i, n);
            console.log("[MiddleHelper.middleCountry] fuelProfitGear called ", {
                ipCountry: i,
                isUMP: n
            });
        } catch (e) {
            console.warn("[MiddleHelper.middleCountry] fuelProfitGear call failed ", e);
        }
    }

    getIpRequestIsFirstFlag() {
        var e = false;
        try {
            (e = null === cc.sys.localStorage.getItem(this.kIsUploadIPFirstCall)) && cc.sys.localStorage.setItem(this.kIsUploadIPFirstCall, " 1 ");
        } catch (t) {
            e = true;
        }
        return e;
    }

    reportIPInfo(e: any, t: any, i: boolean = false) {
        var n = {
            ip_config_value: e,
            ip_config_status: t,
            ip_first_req: i,
            redirect_type: " 0 "
        };
        BusinessAnalyticsService.reportData(" ip_config ", n);
    }

    middleCountry(e: any, t: any, i: any) {
        var a, o = this, r = "[MiddleHelper.middleCountry] ", l = this.getIpRequestIsFirstFlag();
        this.reportIPInfo(" ", 0, l);
        var c = function (e: any, t: any) {
            var n = o.normalizeCountry(o.localCountry()), a = o.applyCountry(n || o.resolveDefaultCountry());
            o.isFinishRegional = true;
            o.hasServerCountry = false;
            o.initAdSdkAfterRegional(null, a);
            o.reportIPInfo(e || t, -1, l);
            console.warn(r, " 归因失败 ， 使用国家: ", a, " source: ", n ? " cache " : " default ", " reason: ", t);
            null == i || i(e);
        };
        if (null === (a = MIDDLE_REQUEST_DESCRIPTORS.Regional) || void 0 === a ? void 0 : a.url) MiddleNetwork.getMiddleCountry(null, function (i: any) {
            try {
                var n = (null == i ? void 0 : i.data) || i || {};
                console.log(r, " 解析结果 → ", JSON.stringify(n));
                var a = o.normalizeCountry(n && n.region), s = o.applyCountry(a || o.localCountry() || o.resolveDefaultCountry());
                o.isFinishRegional = true;
                o.hasServerCountry = !!a;
                o.isSupportHot = n.up_h || false;
                o.banRed = !!n.forbid_red_envelope;
                o.banPay = false;
                o.recogIRE = !!n.recog_ire;
                o.recogTF = !!n.recog_tf;
                void 0 !== n.mfi && null !== n.mfi && (o.mfi = !!n.mfi);
                o.initAdSdkAfterRegional(n, s);
                o.reportIPInfo(n, 1, l);
                var u = n.forbid_used || n.forbid_red_envelope || false;
                console.log(r, " country → ", s, " isSupportHot → ", o.isSupportHot, " forbid_used → ", u);
                if (u) {
                    console.warn(r, " 账号封禁 ， 触发 onBan ");
                    null == t || t(n);
                    return;
                }
                console.log(r, " 正常进入游戏 ， 触发 onEnterGame ， onEnterGame 类型 → ", typeof e);
                null == e || e(n);
            } catch (e) {
                console.error(r, " 解析响应异常 → ", e);
                c(e, " parse_error ");
            }
        }, function (e: any) {
            console.warn(r, " 请求失败或无响应 ， 触发 onBackstop err → ", JSON.stringify(e));
            c(e, " request_fail ");
        }); else {
            console.warn(r, " regionalUrl 为空 ， 直接 onBackstop ");
            c(void 0, " missing_url ");
        }
    }

    initMiddleFundsPlatform() { }
}

const MiddleHelper = new MiddleHelperImpl();
export default MiddleHelper;
