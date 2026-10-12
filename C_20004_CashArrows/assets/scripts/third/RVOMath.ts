import Vector2 from "./Vector2";

export default class RVOMath {
    public static readonly RVO_EPSILON: number = 1e-5;
    public static readonly RVO_POSITIVEINFINITY: number = 1e13;

    public static abs(vector: Vector2): number {
        return RVOMath.sqrt(RVOMath.absSq(vector));
    }

    public static absSq(vector: Vector2): number {
        return Vector2.multiply(vector, vector);
    }

    public static normalize(vector: Vector2): Vector2 {
        return Vector2.division(vector, RVOMath.abs(vector));
    }

    public static det(vector1: Vector2, vector2: Vector2): number {
        return vector1.x * vector2.y - vector1.y * vector2.x;
    }

    public static distSqPointLineSegment(vector1: Vector2, vector2: Vector2, point: Vector2): number {
        const t = Vector2.multiply(Vector2.subtract(point, vector1), Vector2.subtract(vector2, vector1)) /
            RVOMath.absSq(Vector2.subtract(vector2, vector1));

        return t < 0
            ? RVOMath.absSq(Vector2.subtract(point, vector1))
            : t > 1
                ? RVOMath.absSq(Vector2.subtract(point, vector2))
                : RVOMath.absSq(Vector2.subtract(point, Vector2.addition(vector1, Vector2.multiply2(t, Vector2.subtract(vector2, vector1)))));
    }

    public static fabs(value: number): number {
        return Math.abs(value);
    }

    public static leftOf(point: Vector2, vector1: Vector2, vector2: Vector2): number {
        return RVOMath.det(Vector2.subtract(point, vector2), Vector2.subtract(vector1, point));
    }

    public static sqr(value: number): number {
        return value * value;
    }

    public static sqrt(value: number): number {
        return Math.sqrt(value);
    }

    public static transfromFloat(value: number): number {
        return Math.floor(10 * value) / 10;
    }
}