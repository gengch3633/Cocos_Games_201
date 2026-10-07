import CryptoHelper from "./CryptoHelper";
import { MIDDLE_PROJECT_ADAPTER_CONFIG } from "./MiddleProjectAdapterConfig";

class LocalDataUtilImpl {
    private static _instance: LocalDataUtilImpl | null = null;

    static getInstance(): LocalDataUtilImpl {
        if (LocalDataUtilImpl._instance == null) {
            LocalDataUtilImpl._instance = new LocalDataUtilImpl();
        }
        return LocalDataUtilImpl._instance;
    }

    getStorageKey(key: string): string {
        return (MIDDLE_PROJECT_ADAPTER_CONFIG.gameName || "default").replace(/\s+/g, "_") + "_" + key;
    }

    saveLocalStorage(key: string, value: any): void {
        cc.sys.localStorage.setItem(
            CryptoHelper.base64Encode(this.getStorageKey(key)),
            CryptoHelper.base64Encode(JSON.stringify(value))
        );
    }

    getLocalStorage(key: string): any {
        const stored = cc.sys.localStorage.getItem(CryptoHelper.base64Encode(this.getStorageKey(key)));
        if (stored && stored !== "" && stored != null && stored !== "nan") {
            return JSON.parse(CryptoHelper.base64Decode(stored));
        }
        return null;
    }

    removeLocalStorage(key: string): void {
        cc.sys.localStorage.removeItem(CryptoHelper.base64Encode(this.getStorageKey(key)));
    }
}

export default LocalDataUtilImpl.getInstance();
