export default class Vector2 {
    x = 0;
    y = 0;

    constructor(x?: number, y?: number) {
        if (x != null) {
            this.x = x;
        }
        if (y != null) {
            this.y = y;
        }
    }

    add(v: Vector2): Vector2 {
        return new Vector2(this.x + v.x, this.y + v.y);
    }

    minus(v: Vector2): Vector2 {
        return new Vector2(this.x - v.x, this.y - v.y);
    }

    multiply(v: Vector2): number {
        return this.x * v.x + this.y * v.y;
    }

    scale(s: number): Vector2 {
        return new Vector2(this.x * s, this.y * s);
    }

    static multiply(a: Vector2, b: Vector2): number {
        return a.x * b.x + a.y * b.y;
    }

    static multiply2(scalar: number, v: Vector2): Vector2 {
        return new Vector2(v.x * scalar, v.y * scalar);
    }

    static division(v: Vector2, divisor: number): Vector2 {
        return new Vector2(v.x / divisor, v.y / divisor);
    }

    static subtract(a: Vector2, b: Vector2): Vector2 {
        return new Vector2(a.x - b.x, a.y - b.y);
    }

    static addition(a: Vector2, b: Vector2): Vector2 {
        return new Vector2(a.x + b.x, a.y + b.y);
    }
}
