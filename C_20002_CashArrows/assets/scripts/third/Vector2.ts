export default class Vector2 {
    x: number = 0;
    y: number = 0;

    constructor(e?: number, t?: number) {
        null != e && (this.x = e);
        null != t && (this.y = t);
    }

    add(t: Vector2) {
        return new Vector2(this.x + t.x, this.y + t.y);
    }

    minus(t: Vector2) {
        return new Vector2(this.x - t.x, this.y - t.y);
    }

    multiply(e: Vector2) {
        return this.x * e.x + this.y * e.y;
    }

    scale(t: number) {
        return new Vector2(this.x * t, this.y * t);
    }

    static multiply(e: Vector2, t: Vector2) {
        return e.x * t.x + e.y * t.y;
    }

    static multiply2(t: number, i: Vector2) {
        return new Vector2(i.x * t, i.y * t);
    }

    static division(t: Vector2, i: number) {
        return new Vector2(t.x / i, t.y / i);
    }

    static subtract(t: Vector2, i: Vector2) {
        return new Vector2(t.x - i.x, t.y - i.y);
    }

    static addition(t: Vector2, i: Vector2) {
        return new Vector2(t.x + i.x, t.y + i.y);
    }
}
