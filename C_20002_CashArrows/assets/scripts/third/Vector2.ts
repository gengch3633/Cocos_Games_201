export default class Vector2 {
    x = 0;
    y = 0;

    constructor(x?: number, y?: number) {
        if (x != null) this.x = x;
        if (y != null) this.y = y;
    }

    add(other: Vector2): Vector2 {
        return new Vector2(this.x + other.x, this.y + other.y);
    }

    minus(other: Vector2): Vector2 {
        return new Vector2(this.x - other.x, this.y - other.y);
    }

    multiply(other: Vector2): number {
        return this.x * other.x + this.y * other.y;
    }

    scale(factor: number): Vector2 {
        return new Vector2(this.x * factor, this.y * factor);
    }

    static multiply(a: Vector2, b: Vector2): number {
        return a.x * b.x + a.y * b.y;
    }

    static multiply2(factor: number, vector: Vector2): Vector2 {
        return new Vector2(vector.x * factor, vector.y * factor);
    }

    static division(vector: Vector2, divisor: number): Vector2 {
        return new Vector2(vector.x / divisor, vector.y / divisor);
    }

    static subtract(a: Vector2, b: Vector2): Vector2 {
        return new Vector2(a.x - b.x, a.y - b.y);
    }

    static addition(a: Vector2, b: Vector2): Vector2 {
        return new Vector2(a.x + b.x, a.y + b.y);
    }
}
