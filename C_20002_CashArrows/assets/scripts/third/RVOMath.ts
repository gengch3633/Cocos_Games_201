import Vector2 from "./Vector2";

export default class RVOMath {
    static RVO_EPSILON = 1e-5;
    static RVO_POSITIVEINFINITY = 1e13;

    static abs(v: any): number {
        return this.sqrt(this.absSq(v));
    }

    static absSq(v: any): number {
        return Vector2.multiply(v, v);
    }

    static normalize(v: any): any {
        return Vector2.division(v, this.abs(v));
    }

    static det(a: any, b: any): number {
        return a.x * b.y - a.y * b.x;
    }

    static distSqPointLineSegment(a: any, b: any, c: any): number {
        const t = Vector2.multiply(Vector2.subtract(c, a), Vector2.subtract(b, a)) / this.absSq(Vector2.subtract(b, a));
        if (t < 0) {
            return this.absSq(Vector2.subtract(c, a));
        }
        if (t > 1) {
            return this.absSq(Vector2.subtract(c, b));
        }
        return this.absSq(Vector2.subtract(c, Vector2.addition(a, Vector2.multiply2(t, Vector2.subtract(b, a)))));
    }

    static fabs(value: number): number {
        return Math.abs(value);
    }

    static leftOf(a: any, b: any, c: any): number {
        return this.det(Vector2.subtract(a, c), Vector2.subtract(b, a));
    }

    static sqr(value: number): number {
        return value * value;
    }

    static sqrt(value: number): number {
        return Math.sqrt(value);
    }

    static transfromFloat(value: number): number {
        return Math.floor(10 * value) / 10;
    }
}
