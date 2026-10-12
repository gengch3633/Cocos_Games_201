export default class AdCallbackParser {
    public static decode(data: string, decoder: (raw: string) => string): string {
        if (!data) return "";
        try {
            return decoder(data) || "";
        } catch (e) {
            return "";
        }
    }

    public static parse(data: string, decoder: (raw: string) => string): any {
        const decoded = this.decode(data, decoder);
        if (!decoded) return null;
        try {
            return JSON.parse(decoded);
        } catch (e) {
            return null;
        }
    }

    public static getStructuredContent(data: string, decoder: (raw: string) => string): any {
        const parsed = this.parse(data, decoder);
        if (!parsed) return null;
        const structured = parsed.structuredContentPackage;
        return structured !== null && structured !== void 0 ? structured : parsed;
    }

    public static getCpmPayload(data: string, decoder: (raw: string) => string): any {
        return this.getStructuredContent(data, decoder);
    }
}