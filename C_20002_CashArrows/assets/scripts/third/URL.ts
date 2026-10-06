export default class URL {
    static parse(base: string, ...parts: Array<string | null | undefined>): string {
        const segments = [base, ...parts]
            .filter((part) => part != null)
            .map((part) => {
                let value = String(part);
                if (value.startsWith("/")) {
                    value = value.substring(1);
                }
                if (value.endsWith("/")) {
                    value = value.substring(0, value.length - 1);
                }
                return value;
            });
        return segments.join("/");
    }

    static isHttpUrl(value: string): boolean {
        return !!value && (value.indexOf("http://") === 0 || value.indexOf("https://") === 0);
    }
}
