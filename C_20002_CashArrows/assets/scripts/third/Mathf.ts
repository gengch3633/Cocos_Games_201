export default class Mathf {
    static PI = Math.PI;
    static Infinity = Infinity;
    static Deg2Rad = Math.PI / 180;
    static Rad2Deg = 180 / Math.PI;
    static Epsilon = Number.EPSILON;

    static clamp(value: number, min: number, max: number): number {
        return Math.min(Math.max(value, min), max);
    }

    static clamp01(value: number): number {
        return Mathf.clamp(value, 0, 1);
    }

    static lerp(from: number, to: number, t: number): number {
        return from + (to - from) * Mathf.clamp01(t);
    }

    static inverseLerp(from: number, to: number, value: number): number {
        return (value - from) / (to - from);
    }

    static lerpAngle(from: number, to: number, t: number): number {
        let delta = Mathf.repeat(to - from, 360);
        if (delta > 180) {
            delta -= 360;
        }
        return from + delta * Mathf.clamp01(t);
    }

    static repeat(value: number, length: number): number {
        return value - Math.floor(value / length) * length;
    }

    static pingPong(value: number, length: number): number {
        value = Mathf.repeat(value, 2 * length);
        return length - Math.abs(value - length);
    }

    static deltaAngle(from: number, to: number): number {
        from = Mathf.repeat(from, 360);
        to = Mathf.repeat(to, 360);
        let delta = Mathf.abs(to - from);
        if (delta > 180) {
            delta = 360 - delta;
        }
        return delta;
    }

    static isPowerOfTwo(value: number): boolean {
        return (value & (value - 1)) === 0 && value !== 0;
    }

    static nextPowerOfTwo(value: number): number {
        return Math.pow(2, Math.ceil(Math.log2(value)));
    }

    static approximate(a: number, b: number): boolean {
        return Math.abs(a - b) < Mathf.Epsilon;
    }

    static abs = Math.abs;
    static acos = Math.acos;
    static asin = Math.asin;
    static atan = Math.atan;
    static atan2 = Math.atan2;
    static ceil = Math.ceil;
    static cos = Math.cos;
    static exp = Math.exp;
    static floor = Math.floor;
    static log = Math.log;
    static log10 = Math.log10;
    static min = Math.min;
    static max = Math.max;
    static pow = Math.pow;
    static random = Math.random;
    static round = Math.round;
    static sin = Math.sin;
    static sqrt = Math.sqrt;
    static sign = Math.sign;
    static tan = Math.tan;
}
