export default class AdCallbackParser {
    static decode(raw: string, decoder: (value: string) => string): string {
        if (!raw) {
            return "";
        }
        try {
            return decoder(raw) || "";
        } catch {
            return "";
        }
    }

    static parse(raw: string, decoder: (value: string) => string): Record<string, unknown> | null {
        const decoded = this.decode(raw, decoder);
        if (!decoded) {
            return null;
        }
        try {
            return JSON.parse(decoded);
        } catch {
            return null;
        }
    }

    static getStructuredContent(raw: string, decoder: (value: string) => string): Record<string, unknown> | null {
        const parsed = this.parse(raw, decoder);
        if (!parsed) {
            return null;
        }
        return parsed.structuredContentPackage != null ? (parsed.structuredContentPackage as Record<string, unknown>) : parsed;
    }

    static getCpmPayload(raw: string, decoder: (value: string) => string): Record<string, unknown> | null {
        return this.getStructuredContent(raw, decoder);
    }
}
