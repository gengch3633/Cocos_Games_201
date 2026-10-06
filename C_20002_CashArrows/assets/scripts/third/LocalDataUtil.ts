import CryptoHelper from "./CryptoHelper";
import { MIDDLE_PROJECT_ADAPTER_CONFIG } from "./MiddleProjectAdapterConfig";

class LocalDataUtilClass {
    private static _instance: LocalDataUtilClass | null = null;

    static getInstance(): LocalDataUtilClass {
        if (LocalDataUtilClass._instance == null) {
            LocalDataUtilClass._instance = new LocalDataUtilClass();
        }
        return LocalDataUtilClass._instance;
    }

    getStorageKey(key: string): string {
        return (MIDDLE_PROJECT_ADAPTER_CONFIG.gameName || "default").replace(/\s+/g, "_") + "_" + key;
    }

    saveLocalStorage(key: string, value: unknown): void {
        cc.sys.localStorage.setItem(
            CryptoHelper.base64Encode(this.getStorageKey(key)),
            CryptoHelper.base64Encode(JSON.stringify(value)),
        );
    }

    getLocalStorage<T = unknown>(key: string): T | null {
        const raw = cc.sys.localStorage.getItem(CryptoHelper.base64Encode(this.getStorageKey(key)));
        if (raw && raw !== "" && raw != null && raw !== "nan") {
            return JSON.parse(CryptoHelper.base64Decode(raw)) as T;
        }
        return null;
    }

    removeLocalStorage(key: string): void {
        cc.sys.localStorage.removeItem(CryptoHelper.base64Encode(this.getStorageKey(key)));
    }
}

export default LocalDataUtilClass.getInstance();
