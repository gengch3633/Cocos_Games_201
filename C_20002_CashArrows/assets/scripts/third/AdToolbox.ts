export default class AdToolbox {
    static log(...args: any[]) {
        console.log.apply(console, args);
    }

    static nowSeconds() {
        return Math.floor(Date.now() / 1e3);
    }

    static formatDate(time: any, separator: string = "-") {
        const date = new Date(time);
        return "" + date.getFullYear() + separator + (date.getMonth() + 1) + separator + date.getDate();
    }

    static localStorageSetItem(key: string, value: any) {
        try {
            cc.sys.localStorage.setItem(key, value);
        } catch (e) {
        }
    }

    static localStorageGetItem(key: string, fallback: any) {
        try {
            const value = cc.sys.localStorage.getItem(key);
            return null == value || "" === value || "nan" === value ? fallback : value;
        } catch (e) {
            return fallback;
        }
    }

    static destroyAdManageToast() {
    }

    static showManageViewToast(message: any) {
        console.warn("[AdToast]", message);
    }
}
