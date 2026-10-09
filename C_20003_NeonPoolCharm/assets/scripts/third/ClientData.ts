import FormData from "./FormData";
import HotUpdate from "./HotUpdate";
import PlayerDataSys from "./PlayerDataSys";
import SystemDataSys from "./SystemDataSys";

const attrMap = {
    aid: "android_id",
    madr: "mac_addr",
    wmr: "wifi_mac_addr",
    platform: cc.sys.os == cc.sys.OS_ANDROID ? "os_name" : "platform"
};

export default class ClientData {
    static device_id = "";
    static version_name = "";
    static channel_name = "";
    static box_pkg_name = "";
    static imei = "";
    static android_id = "";
    static mac_addr = "";
    static wifi_mac_addr = "";
    static oaid = "";
    static platform = "";
    static os_name = "";
    static os_version = "";
    static phone_model = "";
    static phone_brand = "";
    static device_type = "";
    static mdi = "";
    static rii = "";
    static ii = "";
    static device_serial = "";
    static Longitude = "";
    static Latitude = "";
    static session_id = "";
    static network_type = "";
    static idfa = "";
    static caid = "";
    static caid_version = "";
    static last_caid = "";
    static last_caid_version = "";
    static url_common_str = "";
    static cookie_str = "";
    static form_str = "";
    static app_version_name = "";
    static yid = "yid_read_failed";

    static setCommonData() {
        ClientData.genUrlString();
        ClientData.setCookieString();
        ClientData.genFormData();
    }

    static getAttr(key) {
        return ClientData[attrMap[key] ? attrMap[key] : key];
    }

    static clear() {
        ClientData.idfa = "";
        ClientData.platform = "";
        ClientData.version_name = "";
        ClientData.device_id = "";
        ClientData.channel_name = "";
        ClientData.device_serial = "";
        ClientData.box_pkg_name = "";
        ClientData.imei = "";
        ClientData.oaid = "";
        ClientData.Latitude = "";
        ClientData.Longitude = "";
        ClientData.os_version = "";
        ClientData.phone_model = "";
        ClientData.phone_brand = "";
        ClientData.os_name = "";
        ClientData.device_type = "";
        ClientData.session_id = "";
        ClientData.network_type = "";
        ClientData.mdi = "";
        ClientData.ii = "";
        ClientData.rii = "";
        ClientData.mac_addr = "";
        ClientData.wifi_mac_addr = "";
        ClientData.android_id = "";
    }

    static getVersionData() {
        let result = "";
        const keys = ["box_pkg_name", "channel_name", "device_id"];
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            const value = ClientData[attrMap[key] ? attrMap[key] : key];
            if ("" != value && null != value) {
                result += ("" == result ? result : "&") + key + "=" + value;
            }
        }
        return result;
    }

    static isVivo() {
        return !(!SystemDataSys.is_reviewer || "vivo" != ClientData.channel_name && "xiaomi" != ClientData.channel_name);
    }

    static init(data) {
        console.log("参数");
        console.log(data);
        ClientData.caid = data.caid || "";
        ClientData.caid_version = data.caid_version || "";
        ClientData.last_caid_version = data.last_caid_version || "";
        ClientData.last_caid = data.last_caid || "";
        ClientData.idfa = data.idfa || "";
        ClientData.platform = data.platform || "";
        ClientData.version_name = data.version_name || "";
        ClientData.device_id = data.device_id || "";
        ClientData.channel_name = data.channel_name || "";
        ClientData.device_serial = data.device_serial || "";
        ClientData.box_pkg_name = data.box_pkg_name || "";
        ClientData.imei = data.imei || "";
        ClientData.oaid = data.oaid || "";
        ClientData.Latitude = data.Latitude || "";
        ClientData.Longitude = data.Longitude || "";
        ClientData.os_version = data.os_version || "";
        ClientData.phone_model = data.phone_model || "";
        ClientData.phone_brand = data.phone_brand || "";
        ClientData.os_name = data.os_name || "";
        ClientData.device_type = data.device_type || "";
        ClientData.session_id = data.session_id || "";
        ClientData.network_type = data.network_type || "";
        ClientData.mdi = data.mdi || "";
        ClientData.ii = data.ii || "";
        ClientData.rii = data.rii || "";
        ClientData.mac_addr = data.madr || "";
        ClientData.wifi_mac_addr = data.wmr || "";
        ClientData.android_id = data.aid || "";
        ClientData.setCommonData();
    }

    static genFormData(yid?) {
        ClientData.yid = null == yid ? ClientData.yid : yid;
        const currentYid = ClientData.yid;
        const form = new FormData();
        form.append("yid", null != currentYid ? currentYid : "yid_read_fail");
        const deviceKey = (attrMap as any).device_id ? (attrMap as any).device_id : "device_id";
        const deviceId = ClientData[deviceKey];
        if ("" != deviceId && null != deviceId) {
            form.append("device_id", deviceId);
        }
        return form;
    }

    static genUrlString() {
        const version = HotUpdate.getInstance().getVersion();
        const baseVersion = HotUpdate.getInstance().getBaseVersion();
        console.log("baseVersion:" + baseVersion + ",nowVersion:" + version);
        let query = "";
        const keys = ["version_name", "channel_name", "box_pkg_name", "ii", "idfa", "platform", "madr", "wmr", "oaid", "os_version", "phone_model", "phone_brand", "device_id"];
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            const value = encodeURI(ClientData[attrMap[key] ? attrMap[key] : key]);
            if ("" != value && null != value) {
                query += "&" + key + "=" + value;
            }
        }
        query = "user_id=" + PlayerDataSys.user_id + query;
        if (version) {
            query += "&game_version=" + version + "&base_version=" + baseVersion;
        }
        ClientData.url_common_str = query;
    }

    static setCookieString() {
        let cookie = "";
        const keys = ["device_id", "ii", "aid", "madr", "idfa", "wmr", "mdi", "rii"];
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            const value = ClientData[attrMap[key] ? attrMap[key] : key];
            if ("" != value && null != value) {
                cookie += "; " + key + "=" + value;
            }
        }
        cookie = "yid=" + PlayerDataSys.yid + cookie;
        ClientData.cookie_str = cookie;
        document.cookie = ClientData.cookie_str;
    }

    static isOppo() {
        return !(!SystemDataSys.is_reviewer || "oppo" != ClientData.channel_name);
    }
}
