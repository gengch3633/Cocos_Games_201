import CryptoHelper from "./CryptoHelper";
import { MIDDLE_PROJECT_ADAPTER_CONFIG } from "./MiddleProjectAdapterConfig";

function generateUuid(): string {
    const chars = "0123456789abcdef";
    const uuid: string[] = [];
    for (let i = 0; i < 36; i++) {
        uuid[i] = chars.substring(Math.floor(16 * Math.random()), Math.floor(16 * Math.random()) + 1);
    }
    uuid[14] = "4";
    uuid[19] = chars.substring(3 & Number(uuid[19]) | 8, 1 + (3 & Number(uuid[19]) | 8));
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = "-";
    return uuid.join("");
}

class ClientDataStore {
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
        const self = this;
        Object.keys(this).filter(function (key: string): boolean {
            return "function" != typeof (self as any)[key];
        }).forEach(function (key: string): void {
            if (null !== data[key] && void 0 !== data[key] && "" !== data[key]) {
                (self as any)[key] = data[key];
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

    private mapAndroidKeys(data: any): void {
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            const fieldMapping = MIDDLE_PROJECT_ADAPTER_CONFIG.fieldMapping;
            const entries = Object.entries(fieldMapping);
            for (let i = 0; i < entries.length; i++) {
                const entry = entries[i];
                const key = entry[0];
                const mapped = entry[1];
                if ("package_name" !== key && "box_pkg_name" !== key && key in this) {
                    if ("local_country" === key) {
                        if (data[mapped]) {
                            (this as any)[key] = data[mapped];
                        }
                        continue;
                    }
                    (this as any)[key] = data[mapped] || ("number" == typeof (this as any)[key] ? 0 : "");
                }
            }
            const status = this.device_status;
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
                    ica: status[fieldMapping.ica] || false
                });
            }
        }
    }

    public isProd(): boolean {
        return "0" !== this.extra;
    }

    private parseDsData(): void {
        if (this.device_status) {
            this.ds = "string" == typeof this.device_status ? JSON.parse(this.device_status) : this.device_status;
        }
    }

    private buildCommonUrlStr(): void {
        let url = "box_pkg_name=" + this.box_pkg_name;
        url += "&device_id=" + this.device_id;
        url += "&platform=" + this.os_name;
        url += "&ad_version_name=" + this.sdk_version_name;
        url += "&version_name=" + this.version_name;
        url += "&os_version=" + this.system_version;
        url += "&system_version=" + this.system_version;
        url += "&device_model=" + this.phone_model;
        url += "&phone_model=" + this.phone_model;
        url += "&device_brand=" + this.phone_brand;
        url += "&phone_brand=" + this.phone_brand;
        url += "&oaid=" + this.oaid;
        url += "&region=" + this.local_country;
        url += "&channel_name=" + this.channel_name;
        url += "&cpu_number=" + this.cpu_number;
        url += "&is_vpn=" + (this.ds ? this.ds.id : "0");
        this.commonUrlStr = url;
    }

    private buildMiddleCommonUrlStr(): void {
        this.middleCommonUrlStr = this.commonUrlStr;
    }

    public appendGameVersion(version: string): void {
        this.commonUrlStr += "&game_version=" + version;
        this.middleCommonUrlStr += "&game_version=" + version;
    }

    public updateUserInfo(userId: string, yid: string): void {
        this.user_id = userId;
        this.yid = yid;
    }

    public uuid(): string {
        return generateUuid();
    }

    public getVersionData(): any {
        return {
            box_pkg_name: MIDDLE_PROJECT_ADAPTER_CONFIG.releasePkgName,
            channel_name: this.channel_name,
            device_id: this.device_id
        };
    }

    public publicYWUrlParser(url: string): string {
        const timestamp = Math.floor(Date.now() / 1000).toString();
        const nonceStr = generateUuid();
        return "nonce_str=" + nonceStr + "&et=" + timestamp + "&ngister=" + CryptoHelper.ngister(url, timestamp, nonceStr, this.version_name, this.channel_name, this.device_id, this.box_pkg_name);
    }
}

const clientDataStore = new ClientDataStore();

export default clientDataStore;