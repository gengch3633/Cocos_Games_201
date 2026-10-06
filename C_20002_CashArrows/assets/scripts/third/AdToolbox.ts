export default class AdToolbox {
    static log(...args: unknown[]): void {
        console.log.apply(console, args);
    }

    static nowSeconds(): number {
        return Math.floor(Date.now() / 1e3);
    }

    static formatDate(timestamp: number, separator = "-"): string {
        const date = new Date(timestamp);
        return "" + date.getFullYear() + separator + (date.getMonth() + 1) + separator + date.getDate();
    }

    static localStorageSetItem(key: string, value: string): void {
        try {
            cc.sys.localStorage.setItem(key, value);
        } catch {
            // ignore
        }
    }

    static localStorageGetItem(key: string, defaultValue: string | number): string | number {
        try {
            const value = cc.sys.localStorage.getItem(key);
            if (value == null || value === "" || value === "nan") {
                return defaultValue;
            }
            return value;
        } catch {
            return defaultValue;
        }
    }

    static destroyAdManageToast(): void {
        // no-op
    }

    static showManageViewToast(message: string): void {
        console.warn("[AdToast]", message);
    }
}
