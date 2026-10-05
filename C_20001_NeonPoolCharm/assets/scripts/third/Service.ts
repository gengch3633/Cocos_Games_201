declare const CryptoJS: any;

import SystemDataSys from "./SystemDataSys";
import ClientData from "./ClientData";
import SdkHelper from "./SdkHelper";
import TimeUtils from "./TimeUtils";
import HttpUtil from "./HttpUtil";
import UrlMgr from "./UrlMgr";

interface RequestHandler {
    getRequestType(): string;
    getRequestData(): unknown;
}

export default class Service {
    static genSign(requestType: string, time: number, signKey: string): string {
        const keys = ["version_name", "channel_name", "device_id", "time"];
        let signStr = "/" + UrlMgr.getInstance().getUri(requestType);
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            if (key == "time") {
                signStr += " " + time;
            } else {
                const val = ClientData.getAttr(key);
                signStr += val != "" && val != null ? " " + val : " null";
            }
        }
        signStr += " " + signKey;
        signStr += " gohell";
        return CryptoJS.enc.Base64.stringify(CryptoJS.MD5(signStr))
            .replace(new RegExp("\\+", "g"), "-")
            .replace(new RegExp("/", "g"), "_")
            .replace(new RegExp("=", "g"), "");
    }

    static uuid(): string {
        const chars: string[] = [];
        for (let i = 0; i < 36; i++) {
            chars[i] = "0123456789abcdef".substr(Math.floor(16 * Math.random()), 1);
        }
        chars[14] = "4";
        chars[19] = "0123456789abcdef".substr((3 & Number(chars[19])) | 8, 1);
        chars[8] = chars[13] = chars[18] = chars[23] = "-";
        return chars.join("");
    }

    static getCommonUrlData(requestType: string): string {
        let query = SdkHelper.getUrlSplicingString();
        const uri = "/" + UrlMgr.getInstance().getUri(requestType);
        if (query != null) {
            const utcTime = TimeUtils.getUTCTime();
            const nonce = Service.uuid();
            query += "&nonce_str=" + nonce + "&et=" + utcTime + "&ngister=" + (SdkHelper as any).getNgister(uri, utcTime, nonce);
        }
        return query;
    }

    static genCommonRequestData(): FormData {
        return ClientData.genFormData();
    }

    static genRequestUrl(requestType: string): string {
        const url = UrlMgr.getInstance().getUrl(requestType);
        const query = Service.getCommonUrlData(requestType);
        return query ? url + "?" + query : url;
    }

    static getRequestData(data: Record<string, unknown>): FormData {
        SdkHelper.bd_did || SdkHelper.initBD(SdkHelper.getBD_did() || "");
        const payload = Object.assign({}, data);
        payload.dev_token = SdkHelper.bd_did;
        const formData = Service.genCommonRequestData();
        if (payload) {
            const body = SystemDataSys.encrypt
                ? SdkHelper.getAesEncrypData(JSON.stringify(payload))
                : JSON.stringify(payload);
            formData.append("business_data", body);
        }
        return formData;
    }

    static getRegionalData(requestType: string): string {
        const url = UrlMgr.getInstance().getConfmeUrl(requestType);
        let query = Service.getCommonUrlData(requestType);
        const region = SdkHelper.getRealCountry();
        const deviceStatus = SdkHelper.getDeviceStatus() || {};
        console.log("获取中台IP策略参数==", deviceStatus);
        const ds = {
            ir: deviceStatus.ir || "0",
            ie: deviceStatus.ie || "0",
            irv: deviceStatus.irv || "0",
            ix: deviceStatus.ix || "0",
            ih: deviceStatus.ih || "0",
            io: deviceStatus.io || "0",
            iw: deviceStatus.iw || "0",
            id: deviceStatus.id || "0",
            ids: deviceStatus.ids || "0",
        };
        query += "&region=" + region + "&ds=" + JSON.stringify(ds);
        return query ? url + "?" + query : url;
    }

    static request(handler: RequestHandler): void {
        HttpUtil.queuePost(
            Service.genRequestUrl(handler.getRequestType()),
            Service.getRequestData(handler.getRequestData() as Record<string, unknown>),
            handler,
        );
    }
}
