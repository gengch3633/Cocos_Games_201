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
    array_contains: function (e, t) {
        for (const o in e) {
            if (e[o] == t) {
                return true;
            }
        }
        return false;
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
    }
};

export default utils;
