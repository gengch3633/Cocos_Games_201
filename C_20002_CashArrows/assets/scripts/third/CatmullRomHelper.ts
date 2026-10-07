export default class CatmullRomHelper {
    static interp(points: cc.Vec2[], t: number): cc.Vec2 {
        const maxIndex = points.length - 3;
        const index = Math.min(Math.floor(t * maxIndex), maxIndex - 1);
        const localT = t * maxIndex - index;
        const p0 = points[index];
        const p1 = points[index + 1];
        const p2 = points[index + 2];
        const p3 = points[index + 3];
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
        const extended = [].concat(points);
        extended.unshift(extended[0].add(extended[0].sub(extended[1])));
        extended.push(extended[extended.length - 1].add(extended[extended.length - 1].sub(extended[extended.length - 2])));
        if (extended[1].equals(extended[extended.length - 2])) {
            extended[0] = extended[extended.length - 3];
            extended[extended.length - 1] = extended[2];
        }
        const result: cc.Vec2[] = [];
        const total = points.length * segments;
        for (let i = 0; i <= total; i++) {
            const t = i / total;
            result.push(this.interp(extended, t));
        }
        return result;
    }
}
