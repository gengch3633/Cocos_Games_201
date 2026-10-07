export default class Mathf {
    static PI: number = Math.PI;
    static Infinity: number = Infinity;
    static Deg2Rad: number = Math.PI / 180;
    static Rad2Deg: number = 180 / Math.PI;
    static Epsilon: number = Number.EPSILON;

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
        return (value & value - 1) == 0 && value != 0;
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

    static pow(base: number, exponent: number): number {
        return Math.pow(base, exponent);
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
