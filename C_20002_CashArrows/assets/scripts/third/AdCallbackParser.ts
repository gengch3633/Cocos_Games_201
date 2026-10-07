export default class AdCallbackParser {
    static decode(raw: string, decoder: (value: string) => string): string {
        if (!raw) {
            return "";
        }
        try {
            return decoder(raw) || "";
        } catch (e) {
            return "";
        }
    }

    static parse(raw: string, decoder: (value: string) => string): any {
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

    static getStructuredContent(raw: string, decoder: (value: string) => string): any {
        const parsed = this.parse(raw, decoder);
        return parsed ? (parsed.structuredContentPackage != null ? parsed.structuredContentPackage : parsed) : null;
    }

    static getCpmPayload(raw: string, decoder: (value: string) => string): any {
        return this.getStructuredContent(raw, decoder);
    }
}
