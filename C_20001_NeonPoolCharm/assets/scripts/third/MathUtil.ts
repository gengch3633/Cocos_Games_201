export class MathUtils {
    static instance: MathUtils = null;

    static getInstance(): MathUtils {
        if (MathUtils.instance == null) {
            MathUtils.instance = new MathUtils();
        }
        return MathUtils.instance;
    }

    accAdd(e: number, t: number): number {
        let o: number;
        let n: number;
        let i = 0;
        let a = 0;
        try {
            i = e.toString().split(".")[1].length;
        } catch (err) {
            i = 0;
        }
        try {
            a = t.toString().split(".")[1].length;
        } catch (err) {
            a = 0;
        }
        n = Math.abs(i - a);
        o = Math.pow(10, Math.max(i, a));
        if (n > 0) {
            const r = Math.pow(10, n);
            if (i > a) {
                e = Number(e.toString().replace(".", ""));
                t = Number(t.toString().replace(".", "")) * r;
            } else {
                e = Number(e.toString().replace(".", "")) * r;
                t = Number(t.toString().replace(".", ""));
            }
        } else {
            e = Number(e.toString().replace(".", ""));
            t = Number(t.toString().replace(".", ""));
        }
        return (e + t) / o;
    }

    numbersEqual(e: number, t: number): boolean {
        return Math.abs(e - t) < Number.EPSILON;
    }

    accSub(e: number, t: number): string {
        let o: number;
        let n = 0;
        let i = 0;
        try {
            n = e.toString().split(".")[1].length;
        } catch (err) {
            n = 0;
        }
        try {
            i = t.toString().split(".")[1].length;
        } catch (err) {
            i = 0;
        }
        return ((e * (o = Math.pow(10, Math.max(n, i))) - t * o) / o).toFixed(n >= i ? n : i);
    }

    accDiv(e: number, t: number): number {
        let o = 0;
        let n = 0;
        try {
            o = e.toString().split(".")[1].length;
        } catch (err) {}
        try {
            n = t.toString().split(".")[1].length;
        } catch (err) {}
        return (Number(e.toString().replace(".", "")) / Number(t.toString().replace(".", ""))) * Math.pow(10, n - o);
    }

    accMul(e: number, t: number): number {
        let o = 0;
        const n = e.toString();
        const i = t.toString();
        try {
            o += n.split(".")[1].length;
        } catch (err) {}
        try {
            o += i.split(".")[1].length;
        } catch (err) {}
        return (Number(n.replace(".", "")) * Number(i.replace(".", ""))) / Math.pow(10, o);
    }
}
