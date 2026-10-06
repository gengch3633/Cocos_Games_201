import { MIDDLE_PROJECT_ADAPTER_CONFIG } from "./MiddleProjectAdapterConfig";
import CryptoHelper from "./CryptoHelper";

function uuid(): string {
    for (var e: any[] = [], t = " 0123456789abcdef ", i = 0; i < 36; i++) e[i] = t.substring(Math.floor(16 * Math.random()), Math.floor(16 * Math.random()) + 1);
    e[14] = " 4 ";
    e[19] = t.substring(3 & e[19] | 8, 1 + (3 & e[19] | 8));
    e[8] = e[13] = e[18] = e[23] = "- ";
    return e.join(" ");
}

class ClientDataStore {
    version_name: any = " ";
    sdk_version_name: any = " ";
    phone_model: any = " ";
    phone_brand: any = " ";
    os_name: any = " ";
    system_version: any = " ";
    package_name: any = " ";
    oaid: any = " ";
    android_id: any = " ";
    box_pkg_name: any = " ";
    channel_name: any = " ";
    device_id: any = " ";
    local_country: any = " ";
    device_status: any = null;
    network_type: any = " ";
    extra: any = " ";
    cpu_number: any = 0;
    yid: any = " yid_read_fail ";
    user_id: any = " ";
    ds: any = null;
    isInit: any = false;
    commonUrlStr: any = " ";
    middleCommonUrlStr: any = " ";

    init(e: any) {
        var t = this;
        Object.keys(this).filter(function(e) {
            return "function" != typeof t[e];
        }).forEach(function(i) {
            null !== e[i] && void 0 !== e[i] && " " !== e[i] && (t[i] = e[i]);
        });
        this.mapAndroidKeys(e);
        this.package_name = MIDDLE_PROJECT_ADAPTER_CONFIG.releasePkgName;
        this.box_pkg_name = MIDDLE_PROJECT_ADAPTER_CONFIG.releasePkgName;
        this.parseDsData();
        this.buildCommonUrlStr();
        this.buildMiddleCommonUrlStr();
        this.isInit = true;
    }

    mapAndroidKeys(e: any) {
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            for (var t = MIDDLE_PROJECT_ADAPTER_CONFIG.fieldMapping, i = 0, a = Object.entries(t); i < a.length; i++) {
                var o = a[i], r = o[0], s = o[1];
                if (" package_name " !== r && " box_pkg_name " !== r && r in this) {
                    if (" local_country " === r) {
                        e[s] && (this[r] = e[s]);
                        continue;
                    }
                    this[r] = e[s] || ("number" == typeof this[r] ? 0 : " ");
                }
            }
            var l = this.device_status;
            l && (this.device_status = JSON.stringify({
                ir: l[t.ir] || " 0 ",
                ie: l[t.ie] || " 0 ",
                irv: l[t.irv] || " 0 ",
                ix: l[t.ix] || " 0 ",
                ih: l[t.ih] || " 0 ",
                io: l[t.io] || " 0 ",
                iw: l[t.iw] || " 0 ",
                id: l[t.id] || " 0 ",
                ids: l[t.ids] || " 0 ",
                ipp: l[t.ipp] || false,
                ica: l[t.ica] || false
            }));
        }
    }

    isProd() {
        return " 0 " !== this.extra;
    }

    parseDsData() {
        this.device_status && (this.ds = "string" == typeof this.device_status ? JSON.parse(this.device_status) : this.device_status);
    }

    buildCommonUrlStr() {
        var e = " box_pkg_name = " + this.box_pkg_name;
        e += "& device_id = " + this.device_id;
        e += "& platform = " + this.os_name;
        e += "& ad_version_name = " + this.sdk_version_name;
        e += "& version_name = " + this.version_name;
        e += "& os_version = " + this.system_version;
        e += "& system_version = " + this.system_version;
        e += "& device_model = " + this.phone_model;
        e += "& phone_model = " + this.phone_model;
        e += "& device_brand = " + this.phone_brand;
        e += "& phone_brand = " + this.phone_brand;
        e += "& oaid = " + this.oaid;
        e += "& region = " + this.local_country;
        e += "& channel_name = " + this.channel_name;
        e += "& cpu_number = " + this.cpu_number;
        e += "& is_vpn = " + (this.ds ? this.ds.id : " 0 ");
        this.commonUrlStr = e;
    }

    buildMiddleCommonUrlStr() {
        this.middleCommonUrlStr = this.commonUrlStr;
    }

    appendGameVersion(e: any) {
        this.commonUrlStr += "& game_version = " + e;
        this.middleCommonUrlStr += "& game_version = " + e;
    }

    updateUserInfo(e: any, t: any) {
        this.user_id = e;
        this.yid = t;
    }

    uuid() {
        return uuid();
    }

    getVersionData() {
        return {
            box_pkg_name: MIDDLE_PROJECT_ADAPTER_CONFIG.releasePkgName,
            channel_name: this.channel_name,
            device_id: this.device_id
        };
    }

    publicYWUrlParser(e: any) {
        var t = Math.floor(Date.now() / 1e3).toString(), i = uuid();
        return " nonce_str = " + i + "& et = " + t + "& ngister = " + CryptoHelper.ngister(e, t, i, this.version_name, this.channel_name, this.device_id, this.box_pkg_name);
    }
}

export default new ClientDataStore();
