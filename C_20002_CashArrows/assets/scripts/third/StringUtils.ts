export default class StringUtils {
    static format(template: string, ...args: any[]): string {
        if (!template) {
            return "";
        }
        return template.replace(/\{(\d+)\}/g, (match, index) => {
            return args[index] !== undefined ? args[index] : match;
        });
    }

    static formatObject(template: string, data: any): string {
        if (typeof data !== "object" || data === null) {
            return template;
        }
        return template.replace(/\{([^{}]*)\}/g, (match, key) => {
            return data.hasOwnProperty(key) ? data[key] : match;
        });
    }
}
