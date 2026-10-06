export default class StringUtils {
    static format(e: string) {
        for (var t = [], i = 1; i < arguments.length; i++) t[i - 1] = arguments[i];
        return e ? e.replace(/{(\d+)}/g, function (e, i) {
            return void 0 !== t[i] ? t[i] : e;
        }) : "";
    }

    static formatObject(e: string, t: any) {
        return "object" != typeof t || null === t ? e : e.replace(/{([^{}]*)}/g, function (e, i) {
            return t.hasOwnProperty(i) ? t[i] : e;
        });
    }
}
