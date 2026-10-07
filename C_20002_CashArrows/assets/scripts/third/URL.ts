export default class URL {
    static parse(first: string, ...rest: string[]): string {
        const parts = [first].concat(rest)
            .filter((part) => part != null)
            .map((part) => {
                let segment = part;
                if (segment.startsWith("/")) {
                    segment = segment.substring(1);
                }
                if (segment.endsWith("/")) {
                    segment = segment.substring(0, segment.length - 1);
                }
                return segment;
            });
        return parts.join("/");
    }

    static isHttpUrl(url: string): boolean {
        return !!url && (url.indexOf("http://") === 0 || url.indexOf("https://") === 0);
    }
}
