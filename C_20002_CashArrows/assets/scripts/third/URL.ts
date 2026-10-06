export default class URL {
    static parse(e: string, ...args: string[]) {
        var t, i = args, a = (t = [e]).concat.apply(t, i),
            o = a.filter(function(e) {
                return null != e;
            }).map(function(e) {
                e.startsWith("/") && (e = e.substring(1));
                e.endsWith("/") && (e = e.substring(0, e.length - 1));
                return e;
            });
        return o.join("/");
    }

    static isHttpUrl(e: string) {
        return e && (0 == e.indexOf("http://") || 0 == e.indexOf("https://"));
    }
}
