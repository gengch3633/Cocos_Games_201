export default class StringUtils {
    static format(template: string, ...args: unknown[]): string {
        if (!template) {
            return "";
        }
        return template.replace(/{(\d+)}/g, (match, index) =>
            args[index] !== undefined ? String(args[index]) : match,
        );
    }

    static formatObject(template: string, values: Record<string, unknown> | null): string {
        if (typeof values !== "object" || values === null) {
            return template;
        }
        return template.replace(/{([^{}]*)}/g, (match, key) =>
            Object.prototype.hasOwnProperty.call(values, key) ? String(values[key]) : match,
        );
    }
}
