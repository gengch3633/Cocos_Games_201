export default class Vector2 {
    public x: number = 0;
    public y: number = 0;

    constructor(x?: number, y?: number) {
        if (x != null) {
            this.x = x;
        }
        if (y != null) {
            this.y = y;
        }
    }

    public add(other: Vector2): Vector2 {
        return new Vector2(this.x + other.x, this.y + other.y);
    }

    public minus(other: Vector2): Vector2 {
        return new Vector2(this.x - other.x, this.y - other.y);
    }

    public multiply(other: Vector2): number {
        return this.x * other.x + this.y * other.y;
    }

    public scale(value: number): Vector2 {
        return new Vector2(this.x * value, this.y * value);
    }

    public static multiply(a: Vector2, b: Vector2): number {
        return a.x * b.x + a.y * b.y;
    }

    public static multiply2(value: number, vec: Vector2): Vector2 {
        return new Vector2(vec.x * value, vec.y * value);
    }

    public static division(vec: Vector2, value: number): Vector2 {
        return new Vector2(vec.x / value, vec.y / value);
    }

    public static subtract(a: Vector2, b: Vector2): Vector2 {
        return new Vector2(a.x - b.x, a.y - b.y);
    }

    public static addition(a: Vector2, b: Vector2): Vector2 {
        return new Vector2(a.x + b.x, a.y + b.y);
    }
}