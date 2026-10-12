import CryptoHelper from "./CryptoHelper";
import { MIDDLE_PROJECT_ADAPTER_CONFIG } from "./MiddleProjectAdapterConfig";

function generateUuid(): string {
    const hexChars = "0123456789abcdef";
    const chars: string[] = [];
    for (let i = 0; i < 36; i++) {
        chars[i] = hexChars.substring(Math.floor(16 * Math.random()), Math.floor(16 * Math.random()) + 1);
    }
    chars[14] = "4";
    const index = (3 & Number(chars[19])) | 8;
    chars[19] = hexChars.substring(index, index + 1);
    chars[8] = chars[13] = chars[18] = chars[23] = "-";
    return chars.join("");
}

export class ClientDataStore {
    public version_name: string = "";
    public sdk_version_name: string = "";
    public phone_model: string = "";
    public phone_brand: string = "";
    public os_name: string = "";
    public system_version: string = "";
    public package_name: string = "";
    public oaid: string = "";
    public android_id: string = "";
    public box_pkg_name: string = "";
    public channel_name: string = "";
    public device_id: string = "";
    public local_country: string = "";
    public device_status: any = null;
    public network_type: string = "";
    public extra: string = "";
    public cpu_number: number = 0;
    public yid: string = "yid_read_fail";
    public user_id: string = "";
    public ds: any = null;
    public isInit: boolean = false;
    public commonUrlStr: string = "";
    public middleCommonUrlStr: string = "";

    public init(data: any): void {
        Object.keys(this).forEach((key) => {
            if (typeof (this as any)[key] === "function") {
                return;
            }
            if (data[key] !== null && data[key] !== undefined && data[key] !== "") {
                (this as any)[key] = data[key];
            }
        });
        this.mapAndroidKeys(data);
        this.package_name = MIDDLE_PROJECT_ADAPTER_CONFIG.releasePkgName;
        this.box_pkg_name = MIDDLE_PROJECT_ADAPTER_CONFIG.releasePkgName;
        this.parseDsData();
        this.buildCommonUrlStr();
        this.buildMiddleCommonUrlStr();
        this.isInit = true;
    }

    public mapAndroidKeys(data: any): void {
        if (cc.sys.os !== cc.sys.OS_ANDROID) {
            return;
        }
        const fieldMapping: any = MIDDLE_PROJECT_ADAPTER_CONFIG.fieldMapping;
        const keys = Object.keys(fieldMapping);
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            if (key === "package_name" || key === "box_pkg_name" || !(key in this)) {
                continue;
            }
            const androidKey = fieldMapping[key];
            if (key === "local_country") {
                if (data[androidKey]) {
                    (this as any)[key] = data[androidKey];
                }
                continue;
            }
            (this as any)[key] = data[androidKey] || (typeof (this as any)[key] === "number" ? 0 : "");
        }

        const deviceStatus: any = this.device_status;
        if (deviceStatus) {
            this.device_status = JSON.stringify({
                ir: deviceStatus[fieldMapping.ir] || "0",
                ie: deviceStatus[fieldMapping.ie] || "0",
                irv: deviceStatus[fieldMapping.irv] || "0",
                ix: deviceStatus[fieldMapping.ix] || "0",
                ih: deviceStatus[fieldMapping.ih] || "0",
                io: deviceStatus[fieldMapping.io] || "0",
                iw: deviceStatus[fieldMapping.iw] || "0",
                id: deviceStatus[fieldMapping.id] || "0",
                ids: deviceStatus[fieldMapping.ids] || "0",
                ipp: deviceStatus[fieldMapping.ipp] || false,
                ica: deviceStatus[fieldMapping.ica] || false
            });
        }
    }

    public isProd(): boolean {
        return this.extra !== "0";
    }

    public parseDsData(): void {
        if (this.device_status) {
            this.ds = typeof this.device_status === "string" ? JSON.parse(this.device_status) : this.device_status;
        }
    }

    public buildCommonUrlStr(): void {
        let urlStr = "box_pkg_name=" + this.box_pkg_name;
        urlStr += "&device_id=" + this.device_id;
        urlStr += "&platform=" + this.os_name;
        urlStr += "&ad_version_name=" + this.sdk_version_name;
        urlStr += "&version_name=" + this.version_name;
        urlStr += "&os_version=" + this.system_version;
        urlStr += "&system_version=" + this.system_version;
        urlStr += "&device_model=" + this.phone_model;
        urlStr += "&phone_model=" + this.phone_model;
        urlStr += "&device_brand=" + this.phone_brand;
        urlStr += "&phone_brand=" + this.phone_brand;
        urlStr += "&oaid=" + this.oaid;
        urlStr += "&region=" + this.local_country;
        urlStr += "&channel_name=" + this.channel_name;
        urlStr += "&cpu_number=" + this.cpu_number;
        urlStr += "&is_vpn=" + (this.ds ? this.ds.id : "0");
        this.commonUrlStr = urlStr;
    }

    public buildMiddleCommonUrlStr(): void {
        this.middleCommonUrlStr = this.commonUrlStr;
    }

    public appendGameVersion(gameVersion: string): void {
        this.commonUrlStr += "&game_version=" + gameVersion;
        this.middleCommonUrlStr += "&game_version=" + gameVersion;
    }

    public updateUserInfo(userId: string, yid: string): void {
        this.user_id = userId;
        this.yid = yid;
    }

    public uuid(): string {
        return generateUuid();
    }

    public getVersionData(): { box_pkg_name: string; channel_name: string; device_id: string } {
        return {
            box_pkg_name: MIDDLE_PROJECT_ADAPTER_CONFIG.releasePkgName,
            channel_name: this.channel_name,
            device_id: this.device_id
        };
    }

    public publicYWUrlParser(url: string): string {
        const et = Math.floor(Date.now() / 1000).toString();
        const nonceStr = generateUuid();
        return "nonce_str=" + nonceStr + "&et=" + et + "&ngister=" +
            CryptoHelper.ngister(url, et, nonceStr, this.version_name, this.channel_name, this.device_id, this.box_pkg_name);
    }
}

const clientDataStore = new ClientDataStore();

export default clientDataStore;