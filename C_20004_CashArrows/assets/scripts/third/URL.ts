export default class URL {
    public static parse(base: string, ...parts: Array<string | null | undefined>): string {
        const combined: Array<string | null | undefined> = [base, ...parts];
        const segments = combined
            .filter((segment): segment is string => segment != null)
            .map((segment) => {
                let part = segment;
                if (part.startsWith("/")) {
                    part = part.substring(1);
                }
                if (part.endsWith("/")) {
                    part = part.substring(0, part.length - 1);
                }
                return part;
            });
        return segments.join("/");
    }

    public static isHttpUrl(url: string): boolean {
        return !!url && (url.indexOf("http://") === 0 || url.indexOf("https://") === 0);
    }
}