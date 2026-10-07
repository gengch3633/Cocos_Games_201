export default class AdToolbox {
    static log(...args: any[]): void {
        console.log.apply(console, args);
    }

    static nowSeconds(): number {
        return Math.floor(Date.now() / 1e3);
    }

    static formatDate(timestamp: number, separator: string = "-"): string {
        const date = new Date(timestamp);
        return ""+ date.getFullYear() + separator + (date.getMonth() + 1) + separator + date.getDate(); } static localStorageSetItem(key: string, value: string): void { try { cc.sys.localStorage.setItem(key, value); } catch (e) { } } static localStorageGetItem(key: string, defaultValue: any): any { try { const value = cc.sys.localStorage.getItem(key); return value == null || value ==="" || value === "nan" ? defaultValue : value;
        } catch (e) {
            return defaultValue;
        }
    }

    static destroyAdManageToast(): void {
    }

    static showManageViewToast(message: string): void {
        console.warn("[AdToast]", message);
    }
}
