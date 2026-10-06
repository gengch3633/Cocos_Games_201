export default class Random {
    static _defaultRandom: Random;
    seed: number;

    constructor(e?: number) {
        this.seed = e || Date.now();
    }

    static get defaultRandom() {
        Random._defaultRandom || (Random._defaultRandom = new Random());
        return Random._defaultRandom;
    }

    static get insideUnitCircle() {
        return Random.defaultRandom.insideUnitCircle;
    }

    static get onUnitCircle() {
        return Random.defaultRandom.onUnitCircle;
    }

    static get value() {
        return Random.defaultRandom.value;
    }

    static range(t: number, i: number) {
        return Random.defaultRandom.range(t, i);
    }

    static floatRange(t: number, i: number) {
        return Random.defaultRandom.floatRange(t, i);
    }

    static rangeArray(t: any[], i: number = 1, n: boolean = !0) {
        return Random.defaultRandom.rangeArray(t, i, n);
    }

    static isHit(t: number) {
        return Random.defaultRandom.isHit(t);
    }

    static weightIndex(t: number[]) {
        return Random.defaultRandom.weightIndex(t);
    }

    static weightObject(t: any[], i: string) {
        return Random.defaultRandom.weightObject(t, i);
    }

    rangeArray(e: any[], t: number = 1, i: boolean = !0) {
        var n = [];
        if (!e || e.length <= 0 || t <= 0) return n;
        for (var a = e.concat(); ;) {
            var o = this.range(0, a.length - 1);
            n.push(a[o]);
            i || a.splice(o, 1);
            if (n.length >= t || a.length <= 0) break;
        }
        return n;
    }

    weightIndex(t: number[]) {
        var i = 0;
        t.forEach(function (e) {
            return i += e;
        });
        for (var n = 0, a = Random.range(1, i), o = 0; o < t.length; o++) {
            if (a > n && a <= n + t[o]) return o;
            n += t[o];
        }
        return -1;
    }

    weightObject(e: any[], t: string) {
        var i = [];
        e.forEach(function (e) {
            var n = e[t];
            "number" == typeof n ? i.push(n) : console.warn("Random.weightObject: " + String(t) + " is not a number");
        });
        return e[this.weightIndex(i)];
    }

    isHit(e: number) {
        return this.range(1, 100) <= e;
    }

    floatRange(e: number, t: number) {
        var i = Math.max(t, e), n = Math.min(t, e);
        this.seed = (9301 * this.seed + 49297) % 233280;
        return n + this.seed / 233280 * (i - n);
    }

    range(e: number, t: number) {
        return Math.round(this.floatRange(e, t));
    }

    get insideUnitCircle() {
        var e = this.floatRange(0, 360), t = this.floatRange(0, 1);
        return cc.v2(t * Math.cos(e * Math.PI / 180), t * Math.sin(e * Math.PI / 180));
    }

    get onUnitCircle() {
        var e = this.floatRange(0, 360);
        return cc.v2(Math.cos(e * Math.PI / 180), Math.sin(e * Math.PI / 180));
    }

    get value() {
        return this.floatRange(0, 1);
    }
}
