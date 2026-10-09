declare const define: any;
declare const module: any;
declare const exports: any;

export let saveAs: any;

saveAs = saveAs || function (e) {
    if (!("undefined" == typeof e || "undefined" != typeof navigator && /MSIE [1-9]\./.test(navigator.userAgent))) {
        const t = e.document;
        const o = function () {
            return e.URL || e.webkitURL || e;
        };
        const n = t.createElementNS("http://www.w3.org/1999/xhtml", "a");
        const i = "download" in n;
        const a = /constructor/i.test(e.HTMLElement) || e.safari;
        const r = /CriOS\/[\d]+/.test(navigator.userAgent);
        const l = function (t) {
            (e.setImmediate || e.setTimeout)(function () {
                throw t;
            }, 0);
        };
        const s = function (e) {
            setTimeout(function () {
                "string" == typeof e ? o().revokeObjectURL(e) : e.remove();
            }, 4e4);
        };
        const c = function (e, t, o?) {
            for (let n = (t = [].concat(t)).length; n--;) {
                const i = e["on" + t[n]];
                if ("function" == typeof i) try {
                    i.call(e, o || e);
                } catch (e) {
                    l(e);
                }
            }
        };
        const u = function (e) {
            return /^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(e.type) ? new Blob([String.fromCharCode(65279), e], {
                type: e.type
            }) : e;
        };
        const p: any = function (t, l, p) {
            p || (t = u(t));
            let d;
            const _ = this;
            const f = "application/octet-stream" === t.type;
            const h = function () {
                c(_, "writestart progress write writeend".split(" "));
            };
            _.readyState = _.INIT;
            if (i) {
                d = o().createObjectURL(t);
                setTimeout(function () {
                    var e, t;
                    n.href = d;
                    n.download = l;
                    e = n, t = new MouseEvent("click"), e.dispatchEvent(t);
                    h();
                    s(d);
                    _.readyState = _.DONE;
                });
            } else (function () {
                if ((r || f && a) && e.FileReader) {
                    const n: any = new FileReader();
                    n.onloadend = function () {
                        let t = r ? n.result : n.result.replace(/^data:[^;]*;/, "data:attachment/file;");
                        e.open(t, "_blank") || (e.location.href = t);
                        t = undefined;
                        _.readyState = _.DONE;
                        h();
                    };
                    n.readAsDataURL(t);
                    _.readyState = _.INIT;
                } else {
                    d || (d = o().createObjectURL(t));
                    f ? e.location.href = d : e.open(d, "_blank") || (e.location.href = d);
                    _.readyState = _.DONE;
                    h();
                    s(d);
                }
            })();
        };
        const d = p.prototype;
        if ("undefined" != typeof navigator && (navigator as any).msSaveOrOpenBlob) return function (e, t, o) {
            t = t || e.name || "download";
            o || (e = u(e));
            return (navigator as any).msSaveOrOpenBlob(e, t);
        };
        d.abort = function () {};
        d.readyState = d.INIT = 0;
        d.WRITING = 1;
        d.DONE = 2;
        d.error = d.onwritestart = d.onprogress = d.onwrite = d.onabort = d.onerror = d.onwriteend = null;
        return function (blob, name, noAutoBom) {
            return new p(blob, name || blob.name || "download", noAutoBom);
        };
    }
}("undefined" != typeof self && self || "undefined" != typeof window && window || (undefined as any).content);

"undefined" != typeof module && exports ? saveAs = saveAs : "undefined" != typeof define && null !== define && null !== define.amd && define("FileSaver.js", function () {
    return saveAs;
});
