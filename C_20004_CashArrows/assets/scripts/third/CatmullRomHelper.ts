export default class CatmullRomHelper {
    public static interp(points: cc.Vec2[], t: number): cc.Vec2 {
        const len = points.length - 3;
        const idx = Math.min(Math.floor(t * len), len - 1);
        const localT = t * len - idx;
        const p0 = points[idx];
        const p1 = points[idx + 1];
        const p2 = points[idx + 2];
        const p3 = points[idx + 3];
        const c = p0
            .mul(-1)
            .add(p1.mul(3))
            .sub(p2.mul(3))
            .add(p3)
            .mul(localT * localT * localT);
        const u = p0
            .mul(2)
            .sub(p1.mul(5))
            .add(p2.mul(4))
            .sub(p3)
            .mul(localT * localT);
        const d = p0.mul(-1).add(p2).mul(localT);
        const h = p1.mul(2);
        return cc.v2(c.add(u).add(d).add(h).mul(0.5));
    }

    public static generatePath(points: cc.Vec2[], samplesPerSegment: number = 20): cc.Vec2[] {
        if (!points || points.length < 2) {
            return [];
        }
        const ctrl: cc.Vec2[] = ([] as cc.Vec2[]).concat(points);
        ctrl.unshift(ctrl[0].add(ctrl[0].sub(ctrl[1])));
        ctrl.push(ctrl[ctrl.length - 1].add(ctrl[ctrl.length - 1].sub(ctrl[ctrl.length - 2])));
        if (ctrl[1].equals(ctrl[ctrl.length - 2])) {
            ctrl[0] = ctrl[ctrl.length - 3];
            ctrl[ctrl.length - 1] = ctrl[2];
        }
        const result: cc.Vec2[] = [];
        const total = points.length * samplesPerSegment;
        for (let i = 0; i <= total; i++) {
            const t = i / total;
            const p = CatmullRomHelper.interp(ctrl, t);
            result.push(p);
        }
        return result;
    }
}