import Vector2 from "./Vector2";

export default class RVOMath {
    static RVO_EPSILON: number = 1e-5;
    static RVO_POSITIVEINFINITY: number = 1e13;

    static abs(vector: cc.Vec2): number {
        return this.sqrt(this.absSq(vector));
    }

    static absSq(vector: cc.Vec2): number {
        return Vector2.multiply(vector, vector);
    }

    static normalize(vector: cc.Vec2): cc.Vec2 {
        return Vector2.division(vector, this.abs(vector));
    }

    static det(a: cc.Vec2, b: cc.Vec2): number {
        return a.x * b.y - a.y * b.x;
    }

    static distSqPointLineSegment(a: cc.Vec2, b: cc.Vec2, c: cc.Vec2): number {
        const ratio = Vector2.multiply(Vector2.subtract(c, a), Vector2.subtract(b, a)) / this.absSq(Vector2.subtract(b, a));
        if (ratio < 0) {
            return this.absSq(Vector2.subtract(c, a));
        }
        if (ratio > 1) {
            return this.absSq(Vector2.subtract(c, b));
        }
        return this.absSq(Vector2.subtract(c, Vector2.addition(a, Vector2.multiply2(ratio, Vector2.subtract(b, a)))));
    }

    static fabs(value: number): number {
        return Math.abs(value);
    }

    static leftOf(a: cc.Vec2, b: cc.Vec2, c: cc.Vec2): number {
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
