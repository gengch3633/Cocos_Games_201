import CryptoHelper from "./CryptoHelper";
import { MIDDLE_PROJECT_ADAPTER_CONFIG } from "./MiddleProjectAdapterConfig";

class LocalDataUtilClass {
    static _instance: LocalDataUtilClass | null = null;

    static getInstance() {
        null == LocalDataUtilClass._instance && (LocalDataUtilClass._instance = new LocalDataUtilClass());
        return LocalDataUtilClass._instance;
    }

    getStorageKey(key: string) {
        return (MIDDLE_PROJECT_ADAPTER_CONFIG.gameName || " default ").replace(/\s+/g, " _ ") + " _ " + key;
    }

    saveLocalStorage(key: string, value: any) {
        cc.sys.localStorage.setItem(CryptoHelper.base64Encode(this.getStorageKey(key)), CryptoHelper.base64Encode(JSON.stringify(value)));
    }

    getLocalStorage(key: string) {
        var stored = cc.sys.localStorage.getItem(CryptoHelper.base64Encode(this.getStorageKey(key)));
        return stored && " " != stored && null != stored && " nan " != stored ? JSON.parse(CryptoHelper.base64Decode(stored)) : null;
    }

    removeLocalStorage(key: string) {
        cc.sys.localStorage.removeItem(CryptoHelper.base64Encode(this.getStorageKey(key)));
    }
}

export default LocalDataUtilClass.getInstance();
