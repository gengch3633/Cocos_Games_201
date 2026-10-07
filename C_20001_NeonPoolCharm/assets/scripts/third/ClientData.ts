import FormData from "./FormData";
import HotUpdate from "./HotUpdate";
import PlayerDataSys from "./PlayerDataSys";
import SystemDataSys from "./SystemDataSys";

const attrMap: Record<string, string> = {
    aid: "android_id",
    madr: "mac_addr",
    wmr: "wifi_mac_addr",
    platform: cc.sys.os == cc.sys.OS_ANDROID ? "os_name" : "platform",
};

export default class ClientData {
    static device_id: string = "";
    static version_name: string = "";
    static channel_name: string = "";
    static box_pkg_name: string = "";
    static imei: string = "";
    static android_id: string = "";
    static mac_addr: string = "";
    static wifi_mac_addr: string = "";
    static oaid: string = "";
    static platform: string = "";
    static os_name: string = "";
    static os_version: string = "";
    static phone_model: string = "";
    static phone_brand: string = "";
    static device_type: string = "";
    static mdi: string = "";
    static rii: string = "";
    static ii: string = "";
    static device_serial: string = "";
    static Longitude: string = "";
    static Latitude: string = "";
    static session_id: string = "";
    static network_type: string = "";
    static idfa: string = "";
    static caid: string = "";
    static caid_version: string = "";
    static last_caid: string = "";
    static last_caid_version: string = "";
    static url_common_str: string = "";
    static cookie_str: string = "";
    static form_str: string = "";
    static app_version_name: string = "";
    static yid: string = "yid_read_failed";

    static setCommonData(): void {
        ClientData.genUrlString();
        ClientData.setCookieString();
        ClientData.genFormData();
    }

    static getAttr(key: string): string {
        return ClientData[attrMap[key] ? attrMap[key] : key];
    }

    static clear(): void {
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

    static getVersionData(): string {
        let result = "";
        const keys = ["box_pkg_name", "channel_name", "device_id"];
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            const value = ClientData[attrMap[key] ? attrMap[key] : key];
            if (value != "" && value != null) {
                result += (result == "" ? result : "&") + key + "=" + value;
            }
        }
        return result;
    }

    static isVivo(): boolean {
        return !!(SystemDataSys.is_reviewer && (ClientData.channel_name == "vivo" || ClientData.channel_name == "xiaomi"));
    }

    static init(params: Record<string, string>): void {
        console.log("参数");
        console.log(params);
        ClientData.caid = params.caid || "";
        ClientData.caid_version = params.caid_version || "";
        ClientData.last_caid_version = params.last_caid_version || "";
        ClientData.last_caid = params.last_caid || "";
        ClientData.idfa = params.idfa || "";
        ClientData.platform = params.platform || "";
        ClientData.version_name = params.version_name || "";
        ClientData.device_id = params.device_id || "";
        ClientData.channel_name = params.channel_name || "";
        ClientData.device_serial = params.device_serial || "";
        ClientData.box_pkg_name = params.box_pkg_name || "";
        ClientData.imei = params.imei || "";
        ClientData.oaid = params.oaid || "";
        ClientData.Latitude = params.Latitude || "";
        ClientData.Longitude = params.Longitude || "";
        ClientData.os_version = params.os_version || "";
        ClientData.phone_model = params.phone_model || "";
        ClientData.phone_brand = params.phone_brand || "";
        ClientData.os_name = params.os_name || "";
        ClientData.device_type = params.device_type || "";
        ClientData.session_id = params.session_id || "";
        ClientData.network_type = params.network_type || "";
        ClientData.mdi = params.mdi || "";
        ClientData.ii = params.ii || "";
        ClientData.rii = params.rii || "";
        ClientData.mac_addr = params.madr || "";
        ClientData.wifi_mac_addr = params.wmr || "";
        ClientData.android_id = params.aid || "";
        ClientData.setCommonData();
    }

    static genFormData(yid?: string): FormData {
        ClientData.yid = yid == null ? ClientData.yid : yid;
        const currentYid = ClientData.yid;
        const form = new FormData();
        form.append("yid", currentYid != null ? currentYid : "yid_read_fail");
        const deviceId = ClientData[attrMap.device_id ? attrMap.device_id : "device_id"];
        if (deviceId != "" && deviceId != null) {
            form.append("device_id", deviceId);
        }
        return form;
    }

    static genUrlString(): void {
        const version = HotUpdate.getInstance().getVersion();
        const baseVersion = HotUpdate.getInstance().getBaseVersion();
        console.log("baseVersion:" + baseVersion + ",nowVersion:" + version);
        let result = "";
        const keys = [
            "version_name",
            "channel_name",
            "box_pkg_name",
            "ii",
            "idfa",
            "platform",
            "madr",
            "wmr",
            "oaid",
            "os_version",
            "phone_model",
            "phone_brand",
            "device_id",
        ];
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            const value = encodeURI(ClientData[attrMap[key] ? attrMap[key] : key]);
            if (value != "" && value != null) {
                result += "&" + key + "=" + value;
            }
        }
        result = "user_id=" + PlayerDataSys.user_id + result;
        if (version) {
            result += "&game_version=" + version + "&base_version=" + baseVersion;
        }
        ClientData.url_common_str = result;
    }

    static setCookieString(): void {
        let result = "";
        const keys = ["device_id", "ii", "aid", "madr", "idfa", "wmr", "mdi", "rii"];
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            const value = ClientData[attrMap[key] ? attrMap[key] : key];
            if (value != "" && value != null) {
                result += "; " + key + "=" + value;
            }
        }
        result = "yid=" + PlayerDataSys.yid + result;
        ClientData.cookie_str = result;
        document.cookie = ClientData.cookie_str;
    }

    static isOppo(): boolean {
        return !!(SystemDataSys.is_reviewer && ClientData.channel_name == "oppo");
    }
}
