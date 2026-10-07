export default class URL {
    static parse(base: string, ...parts: string[]): string {
        const segments = [base].concat(parts)
            .filter((item) => item != null)
            .map((item) => {
                if (item.startsWith("/")) {
                    item = item.substring(1);
                }
                if (item.endsWith("/")) {
                    item = item.substring(0, item.length - 1);
                }
                return item;
            });
        return segments.join("/");
    }

    static isHttpUrl(url: string): boolean {
        return url && (url.indexOf("http://") === 0 || url.indexOf("https://") === 0);
    }
}
