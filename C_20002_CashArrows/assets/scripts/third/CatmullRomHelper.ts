export default class CatmullRomHelper {
    static interp(points: any[], t: number) {
        const segmentCount = points.length - 3;
        const index = Math.min(Math.floor(t * segmentCount), segmentCount - 1);
        const localT = t * segmentCount - index;
        const p0 = points[index];
        const p1 = points[index + 1];
        const p2 = points[index + 2];
        const p3 = points[index + 3];
        const c = p0.mul(-1).add(p1.mul(3)).sub(p2.mul(3)).add(p3).mul(localT * localT * localT);
        const u = p0.mul(2).sub(p1.mul(5)).add(p2.mul(4)).sub(p3).mul(localT * localT);
        const d = p0.mul(-1).add(p2).mul(localT);
        const h = p1.mul(2);
        return cc.v2(c.add(u).add(d).add(h).mul(.5));
    }

    static generatePath(points: any[], samples: number = 20) {
        if (!points || points.length < 2) return [];
        const extended: any[] = [].concat(points);
        extended.unshift(extended[0].add(extended[0].sub(extended[1])));
        extended.push(extended[extended.length - 1].add(extended[extended.length - 1].sub(extended[extended.length - 2])));
        if (extended[1].equals(extended[extended.length - 2])) {
            extended[0] = extended[extended.length - 3];
            extended[extended.length - 1] = extended[2];
        }
        const path = [];
        const steps = points.length * samples;
        for (let i = 0; i <= steps; i++) {
            const ratio = i / steps;
            const point = CatmullRomHelper.interp(extended, ratio);
            path.push(point);
        }
        return path;
    }
}
