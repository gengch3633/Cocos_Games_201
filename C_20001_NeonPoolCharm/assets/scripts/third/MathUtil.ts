export class MathUtils {
    private static instance: MathUtils = null;

    static getInstance(): MathUtils {
        if (MathUtils.instance == null) {
            MathUtils.instance = new MathUtils();
        }
        return MathUtils.instance;
    }

    accAdd(arg1: number, arg2: number): number {
        let r1: number;
        let r2: number;
        let m = 0;
        let c = 0;
        try {
            m = arg1.toString().split(".")[1].length;
        } catch (e) {
            m = 0;
        }
        try {
            c = arg2.toString().split(".")[1].length;
        } catch (e) {
            c = 0;
        }
        r2 = Math.abs(m - c);
        r1 = Math.pow(10, Math.max(m, c));
        if (r2 > 0) {
            const cm = Math.pow(10, r2);
            if (m > c) {
                arg1 = Number(arg1.toString().replace(".", ""));
                arg2 = Number(arg2.toString().replace(".", "")) * cm;
            } else {
                arg1 = Number(arg1.toString().replace(".", "")) * cm;
                arg2 = Number(arg2.toString().replace(".", ""));
            }
        } else {
            arg1 = Number(arg1.toString().replace(".", ""));
            arg2 = Number(arg2.toString().replace(".", ""));
        }
        return (arg1 + arg2) / r1;
    }

    numbersEqual(a: number, b: number): boolean {
        return Math.abs(a - b) < Number.EPSILON;
    }

    accSub(arg1: number, arg2: number): string {
        let r = 0;
        let m = 0;
        let n = 0;
        try {
            m = arg1.toString().split(".")[1].length;
        } catch (e) {
            m = 0;
        }
        try {
            n = arg2.toString().split(".")[1].length;
        } catch (e) {
            n = 0;
        }
        r = Math.pow(10, Math.max(m, n));
        return ((arg1 * r - arg2 * r) / r).toFixed(m >= n ? m : n);
    }

    accDiv(arg1: number, arg2: number): number {
        let t1 = 0;
        let t2 = 0;
        try {
            t1 = arg1.toString().split(".")[1].length;
        } catch (e) {}
        try {
            t2 = arg2.toString().split(".")[1].length;
        } catch (e) {}
        return (
            Number(arg1.toString().replace(".", "")) /
            Number(arg2.toString().replace(".", "")) *
            Math.pow(10, t2 - t1)
        );
    }

    accMul(arg1: number, arg2: number): number {
        let m = 0;
        const s1 = arg1.toString();
        const s2 = arg2.toString();
        try {
            m += s1.split(".")[1].length;
        } catch (e) {}
        try {
            m += s2.split(".")[1].length;
        } catch (e) {}
        return (Number(s1.replace(".", "")) * Number(s2.replace(".", ""))) / Math.pow(10, m);
    }
}
