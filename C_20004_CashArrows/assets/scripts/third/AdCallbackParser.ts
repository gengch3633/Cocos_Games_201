export default class AdCallbackParser {
    public static decode(raw: string, decoder: (raw: string) => string): string {
        if (!raw) {
            return "";
        }
        try {
            return decoder(raw) || "";
        } catch (e) {
            return "";
        }
    }

    public static parse(raw: string, decoder: (raw: string) => string): any {
        const decoded = this.decode(raw, decoder);
        if (!decoded) {
            return null;
        }
        try {
            return JSON.parse(decoded);
        } catch (e) {
            return null;
        }
    }

    public static getStructuredContent(raw: string, decoder: (raw: string) => string): any {
        const parsed = this.parse(raw, decoder);
        return parsed ? parsed.structuredContentPackage ?? parsed : null;
    }

    public static getCpmPayload(raw: string, decoder: (raw: string) => string): any {
        return this.getStructuredContent(raw, decoder);
    }
}