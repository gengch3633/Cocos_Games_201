import HotUpdate from "./HotUpdate";
import FormData from "./FormData";
import PlayerDataSys from "./PlayerDataSys";
import SystemDataSys from "./SystemDataSys";

const attrAlias: Record<string, string> = {
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
        const mapped = attrAlias[key] ? attrAlias[key] : key;
        return (ClientData as any)[mapped];
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
            const val = ClientData.getAttr(key);
            if (val != "" && val != null) {
                result += (result == "" ? result : "&") + key + "=" + val;
            }
        }
        return result;
    }

    static isVivo(): boolean {
        return !!(
            SystemDataSys.is_reviewer &&
            (ClientData.channel_name == "vivo" || ClientData.channel_name == "xiaomi")
        );
    }

    static init(data: any): void {
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

    static genFormData(yid?: string): FormData {
        ClientData.yid = yid == null ? ClientData.yid : yid;
        const form = new FormData();
        form.append("yid", ClientData.yid != null ? ClientData.yid : "yid_read_fail");
        const deviceId = ClientData.getAttr("device_id");
        if (deviceId != "" && deviceId != null) {
            form.append("device_id", deviceId);
        }
        return form;
    }

    static genUrlString(): void {
        const version = HotUpdate.getInstance().getVersion();
        const baseVersion = HotUpdate.getInstance().getBaseVersion();
        console.log("baseVersion:" + baseVersion + ",nowVersion:" + version);
        let query = "";
        const keys = [
            "version_name", "channel_name", "box_pkg_name", "ii", "idfa", "platform",
            "madr", "wmr", "oaid", "os_version", "phone_model", "phone_brand", "device_id",
        ];
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            const val = encodeURI(ClientData.getAttr(key));
            if (val != "" && val != null) {
                query += "&" + key + "=" + val;
            }
        }
        query = "user_id=" + PlayerDataSys.user_id + query;
        if (version) {
            query += "&game_version=" + version + "&base_version=" + baseVersion;
        }
        ClientData.url_common_str = query;
    }

    static setCookieString(): void {
        let cookie = "";
        const keys = ["device_id", "ii", "aid", "madr", "idfa", "wmr", "mdi", "rii"];
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            const val = ClientData.getAttr(key);
            if (val != "" && val != null) {
                cookie += "; " + key + "=" + val;
            }
        }
        cookie = "yid=" + PlayerDataSys.yid + cookie;
        ClientData.cookie_str = cookie;
        document.cookie = ClientData.cookie_str;
    }

    static isOppo(): boolean {
        return !!(SystemDataSys.is_reviewer && ClientData.channel_name == "oppo");
    }
}
