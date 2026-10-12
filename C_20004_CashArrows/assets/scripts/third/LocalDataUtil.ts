import CryptoHelper from "./CryptoHelper";
import { MIDDLE_PROJECT_ADAPTER_CONFIG } from "./MiddleProjectAdapterConfig";

class LocalDataUtil {

    private static _instance: LocalDataUtil = null;

    public static getInstance(): LocalDataUtil {
        if (null == LocalDataUtil._instance) {
            LocalDataUtil._instance = new LocalDataUtil();
        }
        return LocalDataUtil._instance;
    }

    public getStorageKey(key: string): string {
        return (MIDDLE_PROJECT_ADAPTER_CONFIG.gameName || "default").replace(/\s+/g, "_") + "_" + key;
    }

    public saveLocalStorage(key: string, data: any): void {
        cc.sys.localStorage.setItem(
            CryptoHelper.base64Encode(this.getStorageKey(key)),
            CryptoHelper.base64Encode(JSON.stringify(data))
        );
    }

    public getLocalStorage(key: string): any {
        var value = cc.sys.localStorage.getItem(CryptoHelper.base64Encode(this.getStorageKey(key)));
        return value && "" != value && null != value && "nan" != value
            ? JSON.parse(CryptoHelper.base64Decode(value))
            : null;
    }

    public removeLocalStorage(key: string): void {
        cc.sys.localStorage.removeItem(CryptoHelper.base64Encode(this.getStorageKey(key)));
    }
}

export default LocalDataUtil.getInstance();