export class MathUtils {
    static instance = null;

    static getInstance() {
        if (null == this.instance) {
            this.instance = new MathUtils();
        }
        return this.instance;
    }

    accAdd(a, b) {
        let scale;
        let diff;
        let aLen = 0;
        let bLen = 0;
        try {
            aLen = a.toString().split(".")[1].length;
        } catch (err) {
            aLen = 0;
        }
        try {
            bLen = b.toString().split(".")[1].length;
        } catch (err) {
            bLen = 0;
        }
        diff = Math.abs(aLen - bLen);
        scale = Math.pow(10, Math.max(aLen, bLen));
        if (diff > 0) {
            const factor = Math.pow(10, diff);
            if (aLen > bLen) {
                a = Number(a.toString().replace(".", ""));
                b = Number(b.toString().replace(".", "")) * factor;
            } else {
                a = Number(a.toString().replace(".", "")) * factor;
                b = Number(b.toString().replace(".", ""));
            }
        } else {
            a = Number(a.toString().replace(".", ""));
            b = Number(b.toString().replace(".", ""));
        }
        return (a + b) / scale;
    }

    numbersEqual(a, b) {
        return Math.abs(a - b) < Number.EPSILON;
    }

    accSub(a, b) {
        let scale;
        let aLen = 0;
        let bLen = 0;
        try {
            aLen = a.toString().split(".")[1].length;
        } catch (err) {
            aLen = 0;
        }
        try {
            bLen = b.toString().split(".")[1].length;
        } catch (err) {
            bLen = 0;
        }
        return ((a * (scale = Math.pow(10, Math.max(aLen, bLen))) - b * scale) / scale).toFixed(aLen >= bLen ? aLen : bLen);
    }

    accDiv(a, b) {
        let aLen = 0;
        let bLen = 0;
        try {
            aLen = a.toString().split(".")[1].length;
        } catch (err) {
        }
        try {
            bLen = b.toString().split(".")[1].length;
        } catch (err) {
        }
        return Number(a.toString().replace(".", "")) / Number(b.toString().replace(".", "")) * Math.pow(10, bLen - aLen);
    }

    accMul(a, b) {
        let digits = 0;
        const aText = a.toString();
        const bText = b.toString();
        try {
            digits += aText.split(".")[1].length;
        } catch (err) {
        }
        try {
            digits += bText.split(".")[1].length;
        } catch (err) {
        }
        return Number(aText.replace(".", "")) * Number(bText.replace(".", "")) / Math.pow(10, digits);
    }
}
