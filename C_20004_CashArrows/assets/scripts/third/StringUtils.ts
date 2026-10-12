import StringUtils from "./StringUtils";

export default class StringUtils {
    public static format(str: string, ...args: any[]): string {
        if (!str) {
            return "";
        }
        return str.replace(/{(\d+)}/g, (match: string, index: string): string => {
            const value = args[parseInt(index, 10)];
            return value !== undefined ? value : match;
        });
    }

    public static formatObject(str: string, obj: any): string {
        if (typeof obj !== "object" || obj === null) {
            return str;
        }
        return str.replace(/{([^{}]*)}/g, (match: string, key: string): string => {
            return Object.prototype.hasOwnProperty.call(obj, key) ? obj[key] : match;
        });
    }
}