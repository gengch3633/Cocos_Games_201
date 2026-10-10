const utils = {
    isInteger: function (e) {
        return "number" == typeof e && e % 1 == 0;
    },
    randomNum: function (e, t) {
        switch (arguments.length) {
            case 1:
                return parseInt(Math.random() * e + 1, 10);
            case 2:
                return parseInt(Math.random() * (t - e + 1) + e, 10);
            default:
                return 0;
        }
    },
    randomSameNum: function (e, t) {
        const o = new Array();
        for (let n = 0; n < e; n++) {
            o.push(n);
        }
        const i = new Array();
        for (let n = 0; n < t; n++) {
            const a = utils.randomNum(0, o.length - 1);
            const r = o.splice(a, 1);
            i.push(r);
        }
        return i;
    },
    randomSameNum2: function (e, t, o) {
        const n = new Array();
        for (let i = e; i < t; i++) {
            n.push(i);
        }
        const a = new Array();
        for (let i = 0; i < o; i++) {
            const r = utils.randomNum(0, n.length - 1);
            const l = n.splice(r, 1);
            a.push(l);
        }
        return a;
    },
    randomSameNumExclude: function (e, t, o, n) {
        const i = new Array();
        for (let a = e; a < t; a++) {
            if (a.toString() != n) {
                i.push(a);
            }
        }
        const r = new Array();
        for (let a = 0; a < o; a++) {
            const l = utils.randomNum(0, i.length - 1);
            const s = i.splice(l, 1);
            r.push(s);
        }
        return r;
    },
    replace_spec: function (e) {
        const t = new RegExp("[`~%!@#^''?！@#￥……&——‘”“？*()（），。、]");
        let o = "";
        for (let n = 0; n < e.length; n++) {
            o += e.substr(n, 1).replace(t, "");
        }
        return o;
    },
    array_contains: function (e, t) {
        for (const o in e) {
            if (e[o] == t) {
                return true;
            }
        }
        return false;
    },
    strClamp: function (e, t, o) {
        if (e.length <= 2 * t) {
            return e;
        }
        o = null == o ? "..." : o;
        t *= 2;
        const n = function (text) {
            const chars = [];
            let code = 0;
            let lead = 0;
            for (let i = 0; i < text.length;) {
                const a = i;
                code = text.charCodeAt(i++);
                if (65039 != code) {
                    if (lead) {
                        const r = 65536 + (lead - 55296 << 10) + (code - 56320);
                        chars.push({
                            v: r,
                            pos: a
                        });
                        lead = 0;
                    } else if (55296 <= code && code <= 56319) {
                        lead = code;
                    } else {
                        chars.push({
                            v: code,
                            pos: a
                        });
                    }
                }
            }
            return chars;
        }(e);
        let i = 0;
        let a = 0;
        for (let r = 0; r < n.length; ++r) {
            let l = 1;
            if (n[r].v >= 128) {
                l = 2;
            }
            if (i + l > t) {
                break;
            }
            a = r;
            i += l;
        }
        if (n.length - 1 == a) {
            return e;
        }
        const s = o ? 1 : 0;
        return e.substring(0, n[a - s].pos + 1) + o;
    },
    formatDateTime: function (e) {
        const t = e.getFullYear();
        let o: any = e.getMonth() + 1;
        o = o < 10 ? "0" + o : o;
        let n: any = e.getDate();
        n = n < 10 ? "0" + n : n;
        let i: any = e.getHours();
        i = i < 10 ? "0" + i : i;
        let a: any = e.getMinutes();
        a = a < 10 ? "0" + a : a;
        const r = e.getSeconds();
        return t + "-" + o + "-" + n + " " + i + ":" + a + ":" + (r < 10 ? "0" + r : r);
    },
    rotDir: function (e, t) {
        const o = e.x * Math.cos(t) - Math.pow(e.y, Math.sin(t));
        const n = e.x * Math.sin(t) + Math.pow(e.y, Math.cos(t));
        return cc.v2(o, n);
    },
    ArrayBufferToString2: function (e) {
        const t = new Uint8Array(e);
        return String.fromCharCode.apply(null, t);
    },
    Uint8ArrayToString: function (e) {
        let t = "";
        for (let o = 0; o < e.length; o++) {
            t += String.fromCharCode(e[o]);
        }
        return t;
    },
    stringToByteArray: function (e) {
        let t;
        let o;
        const Ctor: any = undefined !== window.Uint8Array ? Uint8Array : Array;
        const n = new Ctor(e.length);
        for (t = 0, o = e.length; t < o; ++t) {
            n[t] = 255 & e.charCodeAt(t);
        }
        return n;
    },
    formatJSON: function (json, indent, leftBracesInSameLine) {
        function getIndentStr(e) {
            let t = "";
            for (let o = 0; o < e; o++) {
                t += indent || "  ";
            }
            return t;
        }
        function format(e, t) {
            t = null == t ? 0 : t;
            let o = "";
            if ("object" == typeof e && null != e) {
                const n = e instanceof Array;
                let i = 0;
                o += (n ? "[" : "{") + "\n";
                for (const a in e) {
                    o += i++ > 0 ? ",\n" : "";
                    const r = "object" == typeof e[a] && null != e[a];
                    const l = getIndentStr(t + 1);
                    o += n && r ? "" : l;
                    o += n ? "" : '"' + a + '": ' + (r && !leftBracesInSameLine ? "\n" : "");
                    o += !r || r && leftBracesInSameLine && !n ? "" : l;
                    o += format(e[a], t + 1);
                }
                o += "\n" + getIndentStr(t) + (n ? "]" : "}");
            } else {
                const s = "string" == typeof e ? '"' : "";
                o += s + e + s + "";
            }
            return o;
        }
        return format(eval("(" + json + ")"));
    },
    save: function (e, t) {
        const o = e;
        const n: any = document.getElementById("SaveChrome");
        n.download = t + ".txt";
        n.href = "data:text/csv;charset=utf-8," + o;
        n.click();
    },
    save2: function (e, t, o) {
        if (undefined === t) {
            t = "sprite";
        }
        if (undefined === o) {
            o = "json";
        }
        const n = JSON.stringify(e);
        const i = utils.formatJSON(n);
        const a = {
            txt: "text/plain",
            png: "image/png",
            jpeg: "image/jpeg",
            jpg: "image/jpeg",
            json: "text/plain"
        };
        if (a[o]) {
            const r = t + "." + o;
            const l = new Blob([i], {
                type: a[o]
            });
            if ((window.navigator as any).msSaveOrOpenBlob) {
                (window.navigator as any).msSaveOrOpenBlob(l, r);
            } else {
                const s = document.createElement("a");
                const c = URL.createObjectURL(l);
                s.href = c;
                s.download = r;
                document.body.appendChild(s);
                s.click();
                setTimeout(function () {
                    document.body.removeChild(s);
                    window.URL.revokeObjectURL(c);
                }, 0);
            }
            console.log("File has been saved:", r);
        } else {
            console.log("File not saved. Suffix not exist:", o);
        }
    },
    clone: function (e) {
        let t;
        if ("object" == typeof e) {
            if (null === e) {
                t = null;
            } else if (e instanceof Array) {
                t = [];
                for (let o = 0, n = e.length; o < n; o++) {
                    t.push(utils.clone(e[o]));
                }
            } else {
                t = {};
                for (const i in e) {
                    t[i] = utils.clone(e[i]);
                }
            }
        } else {
            t = e;
        }
        return t;
    }
};

export default utils;
