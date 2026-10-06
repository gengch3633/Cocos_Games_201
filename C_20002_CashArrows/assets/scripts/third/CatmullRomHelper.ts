export default class CatmullRomHelper {
    static interp(points: cc.Vec2[], t: number): cc.Vec2 {
        const segmentCount = points.length - 3;
        const segmentIndex = Math.min(Math.floor(t * segmentCount), segmentCount - 1);
        const localT = t * segmentCount - segmentIndex;
        const p0 = points[segmentIndex];
        const p1 = points[segmentIndex + 1];
        const p2 = points[segmentIndex + 2];
        const p3 = points[segmentIndex + 3];
        const cubic =
            p0.mul(-1).add(p1.mul(3)).sub(p2.mul(3)).add(p3).mul(localT * localT * localT);
        const quadratic = p0.mul(2).sub(p1.mul(5)).add(p2.mul(4)).sub(p3).mul(localT * localT);
        const linear = p0.mul(-1).add(p2).mul(localT);
        const constant = p1.mul(2);
        return cc.v2(cubic.add(quadratic).add(linear).add(constant).mul(0.5));
    }

    static generatePath(points: cc.Vec2[], samplesPerSegment = 20): cc.Vec2[] {
        if (!points || points.length < 2) {
            return [];
        }

        const extended = [...points];
        extended.unshift(extended[0].add(extended[0].sub(extended[1])));
        extended.push(extended[extended.length - 1].add(extended[extended.length - 1].sub(extended[extended.length - 2])));

        if (extended[1].equals(extended[extended.length - 2])) {
            extended[0] = extended[extended.length - 3];
            extended[extended.length - 1] = extended[2];
        }

        const path: cc.Vec2[] = [];
        const totalSamples = points.length * samplesPerSegment;
        for (let i = 0; i <= totalSamples; i++) {
            const t = i / totalSamples;
            path.push(this.interp(extended, t));
        }
        return path;
    }
}
