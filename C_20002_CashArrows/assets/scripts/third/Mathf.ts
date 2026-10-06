export default class Mathf {
    static clamp(e: number, t: number, i: number) {
        return Math.min(Math.max(e, t), i);
    }

    static clamp01(t: number) {
        return Mathf.clamp(t, 0, 1);
    }

    static lerp(t: number, i: number, n: number) {
        return t + (i - t) * Mathf.clamp01(n);
    }

    static inverseLerp(e: number, t: number, i: number) {
        return (i - e) / (t - e);
    }

    static lerpAngle(t: number, i: number, n: number) {
        var a = Mathf.repeat(i - t, 360);
        a > 180 && (a -= 360);
        return t + a * Mathf.clamp01(n);
    }

    static repeat(e: number, t: number) {
        return e - Math.floor(e / t) * t;
    }

    static pingPong(t: number, i: number) {
        t = Mathf.repeat(t, 2 * i);
        return i - Math.abs(t - i);
    }

    static deltaAngle(t: number, i: number) {
        t = Mathf.repeat(t, 360);
        i = Mathf.repeat(i, 360);
        var n = Mathf.abs(i - t);
        n > 180 && (n = 360 - n);
        return n;
    }

    static isPowerOfTwo(e: number) {
        return 0 == (e & e - 1) && 0 != e;
    }

    static nextPowerOfTwo(e: number) {
        return Math.pow(2, Math.ceil(Math.log2(e)));
    }

    static approximate(t: number, i: number) {
        return Math.abs(t - i) < Mathf.Epsilon;
    }

    static abs(e: number) {
        return Math.abs(e);
    }

    static acos(e: number) {
        return Math.acos(e);
    }

    static asin(e: number) {
        return Math.asin(e);
    }

    static atan(e: number) {
        return Math.atan(e);
    }

    static atan2(e: number, t: number) {
        return Math.atan2(e, t);
    }

    static ceil(e: number) {
        return Math.ceil(e);
    }

    static cos(e: number) {
        return Math.cos(e);
    }

    static exp(e: number) {
        return Math.exp(e);
    }

    static floor(e: number) {
        return Math.floor(e);
    }

    static log(e: number) {
        return Math.log(e);
    }

    static log10(e: number) {
        return Math.log10(e);
    }

    static min(...args: number[]) {
        return Math.min.apply(Math, args);
    }

    static max(...args: number[]) {
        return Math.max.apply(Math, args);
    }

    static pow(e: number, t: number) {
        return Math.pow(e, t);
    }

    static random() {
        return Math.random();
    }

    static round(e: number) {
        return Math.round(e);
    }

    static sin(e: number) {
        return Math.sin(e);
    }

    static sqrt(e: number) {
        return Math.sqrt(e);
    }

    static sign(e: number) {
        return Math.sign(e);
    }

    static tan(e: number) {
        return Math.tan(e);
    }

    static PI = Math.PI;
    static Infinity = Infinity;
    static Deg2Rad = Math.PI / 180;
    static Rad2Deg = 180 / Math.PI;
    static Epsilon = Number.EPSILON;
}
