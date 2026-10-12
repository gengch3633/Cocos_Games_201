export default class Mathf {
    public static readonly PI: number = Math.PI;
    public static readonly Infinity: number = Number.POSITIVE_INFINITY;
    public static readonly Deg2Rad: number = Math.PI / 180;
    public static readonly Rad2Deg: number = 180 / Math.PI;
    public static readonly Epsilon: number = Number.EPSILON;

    public static clamp(value: number, min: number, max: number): number {
        return Math.min(Math.max(value, min), max);
    }

    public static clamp01(value: number): number {
        return Mathf.clamp(value, 0, 1);
    }

    public static lerp(a: number, b: number, t: number): number {
        return a + (b - a) * Mathf.clamp01(t);
    }

    public static inverseLerp(a: number, b: number, value: number): number {
        return (value - a) / (b - a);
    }

    public static lerpAngle(a: number, b: number, t: number): number {
        let delta = Mathf.repeat(b - a, 360);
        if (delta > 180) {
            delta -= 360;
        }
        return a + delta * Mathf.clamp01(t);
    }

    public static repeat(t: number, length: number): number {
        return t - Math.floor(t / length) * length;
    }

    public static pingPong(t: number, length: number): number {
        t = Mathf.repeat(t, length * 2);
        return length - Math.abs(t - length);
    }

    public static deltaAngle(current: number, target: number): number {
        current = Mathf.repeat(current, 360);
        target = Mathf.repeat(target, 360);
        let delta = Mathf.abs(target - current);
        if (delta > 180) {
            delta = 360 - delta;
        }
        return delta;
    }

    public static isPowerOfTwo(value: number): boolean {
        return (value & (value - 1)) === 0 && value !== 0;
    }

    public static nextPowerOfTwo(value: number): number {
        return Math.pow(2, Math.ceil(Math.log2(value)));
    }

    public static approximate(a: number, b: number): boolean {
        return Math.abs(a - b) < Mathf.Epsilon;
    }

    public static abs(f: number): number {
        return Math.abs(f);
    }

    public static acos(f: number): number {
        return Math.acos(f);
    }

    public static asin(f: number): number {
        return Math.asin(f);
    }

    public static atan(f: number): number {
        return Math.atan(f);
    }

    public static atan2(y: number, x: number): number {
        return Math.atan2(y, x);
    }

    public static ceil(f: number): number {
        return Math.ceil(f);
    }

    public static cos(f: number): number {
        return Math.cos(f);
    }

    public static exp(power: number): number {
        return Math.exp(power);
    }

    public static floor(f: number): number {
        return Math.floor(f);
    }

    public static log(f: number): number {
        return Math.log(f);
    }

    public static log10(f: number): number {
        return Math.log10(f);
    }

    public static min(...values: number[]): number {
        return Math.min(...values);
    }

    public static max(...values: number[]): number {
        return Math.max(...values);
    }

    public static pow(f: number, p: number): number {
        return Math.pow(f, p);
    }

    public static random(): number {
        return Math.random();
    }

    public static round(f: number): number {
        return Math.round(f);
    }

    public static sin(f: number): number {
        return Math.sin(f);
    }

    public static sqrt(f: number): number {
        return Math.sqrt(f);
    }

    public static sign(f: number): number {
        return Math.sign(f);
    }

    public static tan(f: number): number {
        return Math.tan(f);
    }
}