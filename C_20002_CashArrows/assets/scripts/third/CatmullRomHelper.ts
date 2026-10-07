export default class CatmullRomHelper {
    static interp(points: cc.Vec2[], t: number): cc.Vec2 {
        const maxIndex = points.length - 3;
        const segment = Math.min(Math.floor(t * maxIndex), maxIndex - 1);
        const localT = t * maxIndex - segment;
        const p0 = points[segment];
        const p1 = points[segment + 1];
        const p2 = points[segment + 2];
        const p3 = points[segment + 3];
        const a = p0.mul(-1).add(p1.mul(3)).sub(p2.mul(3)).add(p3).mul(localT * localT * localT);
        const b = p0.mul(2).sub(p1.mul(5)).add(p2.mul(4)).sub(p3).mul(localT * localT);
        const c = p0.mul(-1).add(p2).mul(localT);
        const d = p1.mul(2);
        return cc.v2(a.add(b).add(c).add(d).mul(0.5));
    }

    static generatePath(points: cc.Vec2[], segments: number = 20): cc.Vec2[] {
        if (!points || points.length < 2) {
            return [];
        }
        const controlPoints = [].concat(points) as cc.Vec2[];
        controlPoints.unshift(controlPoints[0].add(controlPoints[0].sub(controlPoints[1])));
        controlPoints.push(controlPoints[controlPoints.length - 1].add(
            controlPoints[controlPoints.length - 1].sub(controlPoints[controlPoints.length - 2])
        ));
        if (controlPoints[1].equals(controlPoints[controlPoints.length - 2])) {
            controlPoints[0] = controlPoints[controlPoints.length - 3];
            controlPoints[controlPoints.length - 1] = controlPoints[2];
        }
        const result: cc.Vec2[] = [];
        const total = points.length * segments;
        for (let i = 0; i <= total; i++) {
            const t = i / total;
            result.push(this.interp(controlPoints, t));
        }
        return result;
    }
}
