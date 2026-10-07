import ClientData from "./ClientData";
import HttpUtil from "./HttpUtil";
import SdkHelper from "./SdkHelper";
import SystemDataSys from "./SystemDataSys";
import TimeUtils from "./TimeUtils";
import UrlMgr from "./UrlMgr";

export default class Service {
    static genSign(requestType: any, time: string, secret: string): string {
        const signKeys = ["version_name", "channel_name", "device_id", "time"];
        let signStr = "/" + UrlMgr.getInstance().getUri(requestType);
        for (let index = 0; index < signKeys.length; index++) {
            const key = signKeys[index];
            if (key == "time") {
                signStr += " " + time;
            } else {
                const value = ClientData.getAttr(key);
                signStr += value != "" && value != null ? " " + value : " null";
            }
        }
        signStr += " " + secret;
        signStr += " gohell";
        return CryptoJS.enc.Base64.stringify(CryptoJS.MD5(signStr))
            .replace(new RegExp("\\+", "g"), "-")
            .replace(new RegExp("/", "g"), "_")
            .replace(new RegExp("=", "g"), "");
    }

    static uuid(): string {
        const chars: string[] = [];
        for (let index = 0; index < 36; index++) {
            chars[index] = "0123456789abcdef".substr(Math.floor(16 * Math.random()), 1);
        }
        chars[14] = "4";
        chars[19] = "0123456789abcdef".substr((3 & parseInt(chars[19], 16)) | 8, 1);
        chars[8] = chars[13] = chars[18] = chars[23] = "-";
        return chars.join("");
    }

    static getCommonUrlData(requestType: any): string {
        let urlData = SdkHelper.getUrlSplicingString();
        const uri = "/" + UrlMgr.getInstance().getUri(requestType);
        if (urlData != null) {
            const utcTime = TimeUtils.getUTCTime();
            const nonceStr = Service.uuid();
            urlData += "&nonce_str=" + nonceStr + "&et=" + utcTime + "&ngister=" + SdkHelper.getNgister(uri, utcTime, nonceStr);
        }
        return urlData;
    }

    static genCommonRequestData(): FormData {
        return ClientData.genFormData();
    }

    static genRequestUrl(requestType: any): string {
        const baseUrl = UrlMgr.getInstance().getUrl(requestType);
        const commonUrlData = Service.getCommonUrlData(requestType);
        return commonUrlData ? baseUrl + "?" + commonUrlData : baseUrl;
    }

    static getRequestData(requestData: any): FormData {
        SdkHelper.bd_did || SdkHelper.initBD(SdkHelper.getBD_did() || "");
        requestData = Object.assign({}, requestData);
        requestData.dev_token = SdkHelper.bd_did;
        const formData = Service.genCommonRequestData();
        if (requestData) {
            requestData = SystemDataSys.encrypt
                ? SdkHelper.getAesEncrypData(JSON.stringify(requestData))
                : JSON.stringify(requestData);
            formData.append("business_data", requestData);
        }
        return formData;
    }

    static getRegionalData(requestType: any): string {
        const confmeUrl = UrlMgr.getInstance().getConfmeUrl(requestType);
        let commonUrlData = Service.getCommonUrlData(requestType);
        const region = SdkHelper.getRealCountry();
        const deviceStatus = SdkHelper.getDeviceStatus() || {};
        console.log("获取中台IP策略参数==", deviceStatus);
        const deviceStatusData = {
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
        commonUrlData += "&region=" + region + "&ds=" + JSON.stringify(deviceStatusData);
        return commonUrlData ? confmeUrl + "?" + commonUrlData : confmeUrl;
    }

    static request(handler: any): void {
        HttpUtil.queuePost(Service.genRequestUrl(handler.getRequestType()), Service.getRequestData(handler.getRequestData()), handler);
    }
}
