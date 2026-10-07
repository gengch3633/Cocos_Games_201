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

    static lerp(a: number, b: number, t: number): number {
        return a + (b - a) * Mathf.clamp01(t);
    }

    static inverseLerp(a: number, b: number, value: number): number {
        return (value - a) / (b - a);
    }

    static lerpAngle(a: number, b: number, t: number): number {
        let delta = Mathf.repeat(b - a, 360);
        if (delta > 180) {
            delta -= 360;
        }
        return a + delta * Mathf.clamp01(t);
    }

    static repeat(value: number, length: number): number {
        return value - Math.floor(value / length) * length;
    }

    static pingPong(value: number, length: number): number {
        value = Mathf.repeat(value, 2 * length);
        return length - Math.abs(value - length);
    }

    static deltaAngle(a: number, b: number): number {
        a = Mathf.repeat(a, 360);
        b = Mathf.repeat(b, 360);
        let delta = Mathf.abs(b - a);
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

    static abs(value: number): number {
        return Math.abs(value);
    }

    static acos(value: number): number {
        return Math.acos(value);
    }

    static asin(value: number): number {
        return Math.asin(value);
    }

    static atan(value: number): number {
        return Math.atan(value);
    }

    static atan2(y: number, x: number): number {
        return Math.atan2(y, x);
    }

    static ceil(value: number): number {
        return Math.ceil(value);
    }

    static cos(value: number): number {
        return Math.cos(value);
    }

    static exp(value: number): number {
        return Math.exp(value);
    }

    static floor(value: number): number {
        return Math.floor(value);
    }

    static log(value: number): number {
        return Math.log(value);
    }

    static log10(value: number): number {
        return Math.log10(value);
    }

    static min(...values: number[]): number {
        return Math.min.apply(Math, values);
    }

    static max(...values: number[]): number {
        return Math.max.apply(Math, values);
    }

    static pow(a: number, b: number): number {
        return Math.pow(a, b);
    }

    static random(): number {
        return Math.random();
    }

    static round(value: number): number {
        return Math.round(value);
    }

    static sin(value: number): number {
        return Math.sin(value);
    }

    static sqrt(value: number): number {
        return Math.sqrt(value);
    }

    static sign(value: number): number {
        return Math.sign(value);
    }

    static tan(value: number): number {
        return Math.tan(value);
    }
}
