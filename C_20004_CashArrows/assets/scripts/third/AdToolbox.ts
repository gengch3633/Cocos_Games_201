export default class AdToolbox {
    public static log(...args: any[]): void {
        console.log.apply(console, args);
    }

    public static nowSeconds(): number {
        return Math.floor(Date.now() / 1000);
    }

    public static formatDate(timestamp: number | string, separator: string = "-"): string {
        const date = new Date(timestamp);
        return `${date.getFullYear()}${separator}${date.getMonth() + 1}${separator}${date.getDate()}`;
    }

    public static localStorageSetItem(key: string, value: string): void {
        try {
            cc.sys.localStorage.setItem(key, value);
        } catch (e) {}
    }

    public static localStorageGetItem(key: string, defaultValue: string = ""): string {
        try {
            const value = cc.sys.localStorage.getItem(key);
            return value == null || value === "" || value === "nan" ? defaultValue : value;
        } catch (e) {
            return defaultValue;
        }
    }

    public static destroyAdManageToast(): void {}

    public static showManageViewToast(message: string): void {
        console.warn("[AdToast]", message);
    }
}