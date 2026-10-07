import CryptoHelper from "./CryptoHelper";
import { MIDDLE_PROJECT_ADAPTER_CONFIG } from "./MiddleProjectAdapterConfig";

function generateUuid(): string {
    const chars: string[] = [];
    const hex = " 0123456789abcdef ";
    for (let i = 0; i < 36; i++) {
        chars[i] = hex.substring(Math.floor(16 * Math.random()), Math.floor(16 * Math.random()) + 1);
    }
    chars[14] = " 4 ";
    chars[19] = hex.substring(3 & Number(chars[19]) | 8, 1 + (3 & Number(chars[19]) | 8));
    chars[8] = chars[13] = chars[18] = chars[23] = "- ";
    return chars.join(" ");
}

class ClientDataStoreImpl {
    version_name: string = " ";
    sdk_version_name: string = " ";
    phone_model: string = " ";
    phone_brand: string = " ";
    os_name: string = " ";
    system_version: string = " ";
    package_name: string = " ";
    oaid: string = " ";
    android_id: string = " ";
    box_pkg_name: string = " ";
    channel_name: string = " ";
    device_id: string = " ";
    local_country: string = " ";
    device_status: any = null;
    network_type: string = " ";
    extra: string = " ";
    cpu_number: number = 0;
    yid: string = " yid_read_fail ";
    user_id: string = " ";
    ds: any = null;
    isInit: boolean = false;
    commonUrlStr: string = " ";
    middleCommonUrlStr: string = " ";

    init(data: any): void {
        Object.keys(this).filter((key) => typeof (this as any)[key] !== "function").forEach((key) => {
            if (data[key] !== null && data[key] !== undefined && data[key] !== " ") {
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

    mapAndroidKeys(data: any): void {
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            const mapping = MIDDLE_PROJECT_ADAPTER_CONFIG.fieldMapping;
            for (const [key, mappedKey] of Object.entries(mapping)) {
                if (key !== " package_name " && key !== " box_pkg_name " && key in this) {
                    if (key === " local_country ") {
                        if (data[mappedKey as string]) {
                            (this as any)[key] = data[mappedKey as string];
                        }
                        continue;
                    }
                    (this as any)[key] = data[mappedKey as string] || (typeof (this as any)[key] === "number" ? 0 : " ");
                }
            }
            const status = this.device_status;
            if (status) {
                this.device_status = JSON.stringify({
                    ir: status[mapping.ir] || " 0 ",
                    ie: status[mapping.ie] || " 0 ",
                    irv: status[mapping.irv] || " 0 ",
                    ix: status[mapping.ix] || " 0 ",
                    ih: status[mapping.ih] || " 0 ",
                    io: status[mapping.io] || " 0 ",
                    iw: status[mapping.iw] || " 0 ",
                    id: status[mapping.id] || " 0 ",
                    ids: status[mapping.ids] || " 0 ",
                    ipp: status[mapping.ipp] || false,
                    ica: status[mapping.ica] || false
                });
            }
        }
    }

    isProd(): boolean {
        return this.extra !== " 0 ";
    }

    parseDsData(): void {
        if (this.device_status) {
            this.ds = typeof this.device_status === "string" ? JSON.parse(this.device_status) : this.device_status;
        }
    }

    buildCommonUrlStr(): void {
        let query = " box_pkg_name = " + this.box_pkg_name;
        query += "& device_id = " + this.device_id;
        query += "& platform = " + this.os_name;
        query += "& ad_version_name = " + this.sdk_version_name;
        query += "& version_name = " + this.version_name;
        query += "& os_version = " + this.system_version;
        query += "& system_version = " + this.system_version;
        query += "& device_model = " + this.phone_model;
        query += "& phone_model = " + this.phone_model;
        query += "& device_brand = " + this.phone_brand;
        query += "& phone_brand = " + this.phone_brand;
        query += "& oaid = " + this.oaid;
        query += "& region = " + this.local_country;
        query += "& channel_name = " + this.channel_name;
        query += "& cpu_number = " + this.cpu_number;
        query += "& is_vpn = " + (this.ds ? this.ds.id : " 0 ");
        this.commonUrlStr = query;
    }

    buildMiddleCommonUrlStr(): void {
        this.middleCommonUrlStr = this.commonUrlStr;
    }

    appendGameVersion(version: string): void {
        this.commonUrlStr += "& game_version = " + version;
        this.middleCommonUrlStr += "& game_version = " + version;
    }

    updateUserInfo(userId: string, yid: string): void {
        this.user_id = userId;
        this.yid = yid;
    }

    uuid(): string {
        return generateUuid();
    }

    getVersionData(): any {
        return {
            box_pkg_name: MIDDLE_PROJECT_ADAPTER_CONFIG.releasePkgName,
            channel_name: this.channel_name,
            device_id: this.device_id
        };
    }

    publicYWUrlParser(path: string): string {
        const timestamp = Math.floor(Date.now() / 1000).toString();
        const nonce = generateUuid();
        return " nonce_str = " + nonce + "& et = " + timestamp + "& ngister = " + CryptoHelper.ngister(path, timestamp, nonce, this.version_name, this.channel_name, this.device_id, this.box_pkg_name);
    }
}

export default new ClientDataStoreImpl();
