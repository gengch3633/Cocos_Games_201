export default class AdCallbackParser {
    static decode(raw: any, decoder: any) {
        if (!raw) return "";
        try {
            return decoder(raw) || "";
        } catch (e) {
            return "";
        }
    }

    static parse(raw: any, decoder: any) {
        const decoded = this.decode(raw, decoder);
        if (!decoded) return null;
        try {
            return JSON.parse(decoded);
        } catch (e) {
            return null;
        }
    }

    static getStructuredContent(raw: any, decoder: any) {
        const parsed = this.parse(raw, decoder);
        if (!parsed) return null;
        const structured = parsed.structuredContentPackage;
        return null !== structured && undefined !== structured ? structured : parsed;
    }

    static getCpmPayload(raw: any, decoder: any) {
        return this.getStructuredContent(raw, decoder);
    }
}
