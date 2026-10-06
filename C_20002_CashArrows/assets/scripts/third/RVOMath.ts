import Vector2 from "./Vector2";

export default class RVOMath {
    static RVO_EPSILON = 1e-5;
    static RVO_POSITIVEINFINITY = 1e13;

    static abs(e: any) {
        return this.sqrt(this.absSq(e));
    }

    static absSq(e: any) {
        return Vector2.multiply(e, e);
    }

    static normalize(e: any) {
        return Vector2.division(e, this.abs(e));
    }

    static det(e: any, t: any) {
        return e.x * t.y - e.y * t.x;
    }

    static distSqPointLineSegment(e: any, t: any, i: any) {
        var a = Vector2.multiply(Vector2.subtract(i, e), Vector2.subtract(t, e)) / this.absSq(Vector2.subtract(t, e));
        return a < 0 ? this.absSq(Vector2.subtract(i, e)) : a > 1 ? this.absSq(Vector2.subtract(i, t)) : this.absSq(Vector2.subtract(i, Vector2.addition(e, Vector2.multiply2(a, Vector2.subtract(t, e)))));
    }

    static fabs(e: number) {
        return Math.abs(e);
    }

    static leftOf(e: any, t: any, i: any) {
        return this.det(Vector2.subtract(e, i), Vector2.subtract(t, e));
    }

    static sqr(e: number) {
        return e * e;
    }

    static sqrt(e: number) {
        return Math.sqrt(e);
    }

    static transfromFloat(e: number) {
        return Math.floor(10 * e) / 10;
    }
}
