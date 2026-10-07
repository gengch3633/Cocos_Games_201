const utils = {
    isInteger(e: number): boolean {
        return typeof e === "number" && e % 1 === 0;
    },

    randomNum(e?: number, t?: number): number {
        switch (arguments.length) {
            case 1:
                return parseInt(String(Math.random() * e + 1), 10);
            case 2:
                return parseInt(String(Math.random() * (t - e + 1) + e), 10);
            default:
                return 0;
        }
    },

    randomSameNum(e: number, t: number): number[][] {
        const o: number[] = [];
        for (let n = 0; n < e; n++) {
            o.push(n);
        }
        const i: number[][] = [];
        for (let n = 0; n < t; n++) {
            const a = utils.randomNum(0, o.length - 1);
            const r = o.splice(a, 1);
            i.push(r);
        }
        return i;
    },

    randomSameNum2(e: number, t: number, o: number): number[][] {
        const n: number[] = [];
        for (let i = e; i < t; i++) {
            n.push(i);
        }
        const a: number[][] = [];
        for (let i = 0; i < o; i++) {
            const r = utils.randomNum(0, n.length - 1);
            const l = n.splice(r, 1);
            a.push(l);
        }
        return a;
    },

    randomSameNumExclude(e: number, t: number, o: number, n: string): number[][] {
        const i: number[] = [];
        for (let a = e; a < t; a++) {
            if (a.toString() != n) {
                i.push(a);
            }
        }
        const r: number[][] = [];
        for (let a = 0; a < o; a++) {
            const l = utils.randomNum(0, i.length - 1);
            const s = i.splice(l, 1);
            r.push(s);
        }
        return r;
    },

    array_contains(e: any[], t: any): boolean {
        for (const o in e) {
            if (e[o] == t) {
                return true;
            }
        }
        return false;
    },

    clone(e: any): any {
        let t: any;
        if (typeof e === "object") {
            if (e === null) {
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

    formatJSON(json: string, indent?: string, leftBracesInSameLine?: boolean): string {
        function getIndentStr(e: number): string {
            let t = "";
            for (let o = 0; o < e; o++) {
                t += indent || "  ";
            }
            return t;
        }
        function format(e: any, t?: number): string {
            t = t == null ? 0 : t;
            let o = "";
            if (typeof e === "object" && e != null) {
                const n = e instanceof Array;
                let i = 0;
                o += (n ? "[" : "{") + "\n";
                for (const a in e) {
                    o += i++ > 0 ? ",\n" : "";
                    const r = typeof e[a] === "object" && e[a] != null;
                    const l = getIndentStr(t + 1);
                    o += n && r ? "" : l;
                    o += n ? "" : '"' + a + '": ' + (r && !leftBracesInSameLine ? "\n" : "");
                    o += !r || (r && leftBracesInSameLine && !n) ? "" : l;
                    o += format(e[a], t + 1);
                }
                o += "\n" + getIndentStr(t) + (n ? "]" : "}");
            } else {
                const s = typeof e === "string" ? '"' : "";
                o += s + e + s + "";
            }
            return o;
        }
        return format(eval("(" + json + ")"));
    },
};

export default utils;
