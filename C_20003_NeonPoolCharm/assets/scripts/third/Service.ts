import ClientData from "./ClientData";
import HttpUtil from "./HttpUtil";
import SdkHelper from "./SdkHelper";
import SystemDataSys from "./SystemDataSys";
import TimeUtils from "./TimeUtils";
import UrlMgr from "./UrlMgr";

declare function require(name: string): any;

const CryptoJS = require("crypto-js");

export default class Service {
    static genSign(e, t, o) {
        let a = "/" + UrlMgr.getInstance().getUri(e);
        const n = ["version_name", "channel_name", "device_id", "time"];
        for (let r = 0; r < n.length; r++) {
            const l = n[r];
            if ("time" == l) a += " " + t;else {
                const c = ClientData.getAttr(l);
                a += "" != c && null != c ? " " + c : " null";
            }
        }
        a += " " + o;
        a += " gohell";
        return CryptoJS.enc.Base64.stringify(CryptoJS.MD5(a)).replace(new RegExp("\\+", "g"), "-").replace(new RegExp("/", "g"), "_").replace(new RegExp("=", "g"), "");
    }

    static uuid() {
        const e = [];
        for (let t = 0; t < 36; t++) e[t] = "0123456789abcdef".substr(Math.floor(16 * Math.random()), 1);
        e[14] = "4";
        e[19] = "0123456789abcdef".substr(3 & e[19] | 8, 1);
        e[8] = e[13] = e[18] = e[23] = "-";
        return e.join("");
    }

    static getCommonUrlData(t) {
        let o = SdkHelper.getUrlSplicingString();
        const n = "/" + UrlMgr.getInstance().getUri(t);
        if (null != o) {
            const i = TimeUtils.getUTCTime();
            const l = Service.uuid();
            o += "&nonce_str=" + l + "&et=" + i + "&ngister=" + SdkHelper.getNgister(n, i, l);
        }
        return o;
    }

    static genCommonRequestData() {
        return ClientData.genFormData();
    }

    static genRequestUrl(t) {
        const o = UrlMgr.getInstance().getUrl(t);
        const n = Service.getCommonUrlData(t);
        return n ? o + "?" + n : o;
    }

    static getRequestData(e) {
        SdkHelper.bd_did || SdkHelper.initBD(SdkHelper.getBD_did() || "");
        (e = Object.assign({}, e)).dev_token = SdkHelper.bd_did;
        const t = this.genCommonRequestData();
        if (e) {
            e = SystemDataSys.encrypt ? SdkHelper.getAesEncrypData(JSON.stringify(e)) : JSON.stringify(e);
            t.append("business_data", e);
        }
        return t;
    }

    static getRegionalData(t) {
        const o = UrlMgr.getInstance().getConfmeUrl(t);
        let n = Service.getCommonUrlData(t);
        const i = SdkHelper.getRealCountry();
        const r = SdkHelper.getDeviceStatus() || {};
        console.log("获取中台IP策略参数==", r);
        const l = {
            ir: r.ir || "0",
            ie: r.ie || "0",
            irv: r.irv || "0",
            ix: r.ix || "0",
            ih: r.ih || "0",
            io: r.io || "0",
            iw: r.iw || "0",
            id: r.id || "0",
            ids: r.ids || "0"
        };
        return (n += "&region=" + i + "&ds=" + JSON.stringify(l)) ? o + "?" + n : o;
    }

    static request(t) {
        HttpUtil.queuePost(Service.genRequestUrl(t.getRequestType()), Service.getRequestData(t.getRequestData()), t);
    }
}
