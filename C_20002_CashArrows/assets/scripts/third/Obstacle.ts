import Vector2 from "./Vector2";

export default class Obstacle {
    point: Vector2 = new Vector2();
    next: Obstacle | null = null;
    previous: Obstacle | null = null;
    direction = 0;
    convex = false;
    id = 0;
}
