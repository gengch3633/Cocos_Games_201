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

    replace_spec(e: string): string {
        const t = new RegExp("[`~%!@#^''?！@#￥……&——‘”“？*()（），。、]");
        let o = "";
        for (let n = 0; n < e.length; n++) {
            o += e.substr(n, 1).replace(t, "");
        }
        return o;
    },

    array_contains(e: any[], t: any): boolean {
        for (const o in e) {
            if (e[o] == t) {
                return true;
            }
        }
        return false;
    },

    strClamp(e: string, t: number, o?: string): string {
        if (e.length <= 2 * t) {
            return e;
        }
        o = o == null ? "..." : o;
        t *= 2;
        const n = (str: string) => {
            const t: { v: number; pos: number }[] = [];
            let o = 0;
            let n = 0;
            let i = 0;
            while (i < str.length) {
                const a = i;
                if (65039 != (o = str.charCodeAt(i++))) {
                    if (n) {
                        const r = 65536 + ((n - 55296) << 10) + (o - 56320);
                        t.push({ v: r, pos: a });
                        n = 0;
                    } else if (55296 <= o && o <= 56319) {
                        n = o;
                    } else {
                        t.push({ v: o, pos: a });
                    }
                }
            }
            return t;
        };
        let i = 0;
        let a = 0;
        const chars = n(e);
        for (let r = 0; r < chars.length; ++r) {
            let l = 1;
            if (chars[r].v >= 128) {
                l = 2;
            }
            if (i + l > t) {
                break;
            }
            a = r;
            i += l;
        }
        if (chars.length - 1 == a) {
            return e;
        }
        const s = o ? 1 : 0;
        return e.substring(0, chars[a - s].pos + 1) + o;
    },

    formatDateTime(e: Date): string {
        const t = e.getFullYear();
        let o: string | number = e.getMonth() + 1;
        o = o < 10 ? "0" + o : o;
        let n: string | number = e.getDate();
        n = n < 10 ? "0" + n : n;
        let i: string | number = e.getHours();
        i = i < 10 ? "0" + i : i;
        let a: string | number = e.getMinutes();
        a = a < 10 ? "0" + a : a;
        const r = e.getSeconds();
        return t + "-" + o + "-" + n + " " + i + ":" + a + ":" + (r < 10 ? "0" + r : r);
    },

    rotDir(e: cc.Vec2, t: number): cc.Vec2 {
        const o = e.x * Math.cos(t) - Math.pow(e.y, Math.sin(t));
        const n = e.x * Math.sin(t) + Math.pow(e.y, Math.cos(t));
        return cc.v2(o, n);
    },

    ArrayBufferToString2(e: ArrayBuffer): string {
        const t = new Uint8Array(e);
        return String.fromCharCode.apply(null, t as unknown as number[]);
    },

    Uint8ArrayToString(e: Uint8Array): string {
        let t = "";
        for (let o = 0; o < e.length; o++) {
            t += String.fromCharCode(e[o]);
        }
        return t;
    },

    stringToByteArray(e: string): Uint8Array | number[] {
        const n = new (typeof window !== "undefined" && window.Uint8Array ? Uint8Array : Array)(e.length) as Uint8Array | number[];
        for (let t = 0, o = e.length; t < o; ++t) {
            n[t] = 255 & e.charCodeAt(t);
        }
        return n;
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

    save(e: string, t: string): void {
        const o = e;
        const saveEl = document.getElementById("SaveChrome") as HTMLAnchorElement;
        saveEl.download = t + ".txt";
        saveEl.href = "data:text/csv;charset=utf-8," + o;
        saveEl.click();
    },

    save2(e: any, t?: string, o?: string): void {
        if (t === undefined) {
            t = "sprite";
        }
        if (o === undefined) {
            o = "json";
        }
        const n = JSON.stringify(e);
        const i = utils.formatJSON(n);
        const a: { [key: string]: string } = {
            txt: "text/plain",
            png: "image/png",
            jpeg: "image/jpeg",
            jpg: "image/jpeg",
            json: "text/plain",
        };
        if (a[o]) {
            const r = t + "." + o;
            const l = new Blob([i], { type: a[o] });
            if ((window.navigator as any).msSaveOrOpenBlob) {
                (window.navigator as any).msSaveOrOpenBlob(l, r);
            } else {
                const s = document.createElement("a");
                const c = URL.createObjectURL(l);
                s.href = c;
                s.download = r;
                document.body.appendChild(s);
                s.click();
                setTimeout(() => {
                    document.body.removeChild(s);
                    window.URL.revokeObjectURL(c);
                }, 0);
            }
            console.log("File has been saved:", r);
        } else {
            console.log("File not saved. Suffix not exist:", o);
        }
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
};

export default utils;
