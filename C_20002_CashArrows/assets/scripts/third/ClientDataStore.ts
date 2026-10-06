import { MIDDLE_PROJECT_ADAPTER_CONFIG } from "./MiddleProjectAdapterConfig";
import CryptoHelper from "./CryptoHelper";

function createUuid(): string {
    const chars: string[] = [];
    const hex = "0123456789abcdef";
    for (let i = 0; i < 36; i++) {
        chars[i] = hex.substring(Math.floor(Math.random() * 16), Math.floor(Math.random() * 16) + 1);
    }
    chars[14] = "4";
    chars[19] = hex.substring((3 & parseInt(chars[19], 16)) | 8, 1 + ((3 & parseInt(chars[19], 16)) | 8));
    chars[8] = chars[13] = chars[18] = chars[23] = "-";
    return chars.join("");
}

interface DeviceStatusMap {
    [key: string]: string | boolean;
}

interface ClientInitPayload {
    [key: string]: unknown;
}

const ClientDataStore = new (class {
    version_name = "";
    sdk_version_name = "";
    phone_model = "";
    phone_brand = "";
    os_name = "";
    system_version = "";
    package_name = "";
    oaid = "";
    android_id = "";
    box_pkg_name = "";
    channel_name = "";
    device_id = "";
    local_country = "";
    device_status: string | DeviceStatusMap | null = null;
    network_type = "";
    extra = "";
    cpu_number = 0;
    yid = "yid_read_fail";
    user_id = "";
    ds: DeviceStatusMap | null = null;
    isInit = false;
    commonUrlStr = "";
    middleCommonUrlStr = "";

    init(payload: ClientInitPayload): void {
        Object.keys(this)
            .filter((key) => typeof (this as Record<string, unknown>)[key] !== "function")
            .forEach((key) => {
                const value = payload[key];
                if (value !== null && value !== undefined && value !== "") {
                    (this as Record<string, unknown>)[key] = value;
                }
            });
        this.mapAndroidKeys(payload);
        this.package_name = MIDDLE_PROJECT_ADAPTER_CONFIG.releasePkgName;
        this.box_pkg_name = MIDDLE_PROJECT_ADAPTER_CONFIG.releasePkgName;
        this.parseDsData();
        this.buildCommonUrlStr();
        this.buildMiddleCommonUrlStr();
        this.isInit = true;
    }

    mapAndroidKeys(payload: ClientInitPayload): void {
        if (cc.sys.os !== cc.sys.OS_ANDROID) {
            return;
        }

        const fieldMapping = MIDDLE_PROJECT_ADAPTER_CONFIG.fieldMapping as Record<string, string>;
        for (const [targetKey, sourceKey] of Object.entries(fieldMapping)) {
            if (targetKey === "package_name" || targetKey === "box_pkg_name") {
                continue;
            }
            if (targetKey in this) {
                if (targetKey === "local_country") {
                    if (payload[sourceKey]) {
                        (this as Record<string, unknown>)[targetKey] = payload[sourceKey];
                    }
                    continue;
                }
                (this as Record<string, unknown>)[targetKey] =
                    payload[sourceKey] || (typeof (this as Record<string, unknown>)[targetKey] === "number" ? 0 : "");
            }
        }

        const status = this.device_status as DeviceStatusMap | null;
        if (status) {
            this.device_status = JSON.stringify({
                ir: status[fieldMapping.ir] || "0",
                ie: status[fieldMapping.ie] || "0",
                irv: status[fieldMapping.irv] || "0",
                ix: status[fieldMapping.ix] || "0",
                ih: status[fieldMapping.ih] || "0",
                io: status[fieldMapping.io] || "0",
                iw: status[fieldMapping.iw] || "0",
                id: status[fieldMapping.id] || "0",
                ids: status[fieldMapping.ids] || "0",
                ipp: status[fieldMapping.ipp] || false,
                ica: status[fieldMapping.ica] || false,
            });
        }
    }

    isProd(): boolean {
        return this.extra !== "0";
    }

    parseDsData(): void {
        if (this.device_status) {
            this.ds =
                typeof this.device_status === "string"
                    ? JSON.parse(this.device_status)
                    : (this.device_status as DeviceStatusMap);
        }
    }

    buildCommonUrlStr(): void {
        let query = "box_pkg_name=" + this.box_pkg_name;
        query += "&device_id=" + this.device_id;
        query += "&platform=" + this.os_name;
        query += "&ad_version_name=" + this.sdk_version_name;
        query += "&version_name=" + this.version_name;
        query += "&os_version=" + this.system_version;
        query += "&system_version=" + this.system_version;
        query += "&device_model=" + this.phone_model;
        query += "&phone_model=" + this.phone_model;
        query += "&device_brand=" + this.phone_brand;
        query += "&phone_brand=" + this.phone_brand;
        query += "&oaid=" + this.oaid;
        query += "&region=" + this.local_country;
        query += "&channel_name=" + this.channel_name;
        query += "&cpu_number=" + this.cpu_number;
        query += "&is_vpn=" + (this.ds ? this.ds.id : "0");
        this.commonUrlStr = query;
    }

    buildMiddleCommonUrlStr(): void {
        this.middleCommonUrlStr = this.commonUrlStr;
    }

    appendGameVersion(version: string): void {
        this.commonUrlStr += "&game_version=" + version;
        this.middleCommonUrlStr += "&game_version=" + version;
    }

    updateUserInfo(userId: string, yid: string): void {
        this.user_id = userId;
        this.yid = yid;
    }

    uuid(): string {
        return createUuid();
    }

    getVersionData(): Record<string, string> {
        return {
            box_pkg_name: MIDDLE_PROJECT_ADAPTER_CONFIG.releasePkgName,
            channel_name: this.channel_name,
            device_id: this.device_id,
        };
    }

    publicYWUrlParser(path: string): string {
        const timestamp = Math.floor(Date.now() / 1000).toString();
        const nonce = createUuid();
        return (
            "nonce_str=" +
            nonce +
            "&et=" +
            timestamp +
            "&ngister=" +
            CryptoHelper.ngister(path, timestamp, nonce, this.version_name, this.channel_name, this.device_id, this.box_pkg_name)
        );
    }
})();

export default ClientDataStore;
