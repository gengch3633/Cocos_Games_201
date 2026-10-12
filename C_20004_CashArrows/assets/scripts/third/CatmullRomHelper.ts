export default class CatmullRomHelper {
    public static interp(points: cc.Vec2[], t: number): cc.Vec2 {
        const i = points.length - 3;
        const n = Math.min(Math.floor(t * i), i - 1);
        const a = t * i - n;
        const o = points[n];
        const r = points[n + 1];
        const s = points[n + 2];
        const l = points[n + 3];
        const c = o.mul(-1).add(r.mul(3)).sub(s.mul(3)).add(l).mul(a * a * a);
        const u = o.mul(2).sub(r.mul(5)).add(s.mul(4)).sub(l).mul(a * a);
        const d = o.mul(-1).add(s).mul(a);
        const h = r.mul(2);
        return cc.v2(c.add(u).add(d).add(h).mul(0.5));
    }

    public static generatePath(points: cc.Vec2[], samples: number = 20): cc.Vec2[] {
        if (!points || points.length < 2) {
            return [];
        }
        const n: cc.Vec2[] = points.slice();
        n.unshift(n[0].add(n[0].sub(n[1])));
        n.push(n[n.length - 1].add(n[n.length - 1].sub(n[n.length - 2])));
        if (n[1].equals(n[n.length - 2])) {
            n[0] = n[n.length - 3];
            n[n.length - 1] = n[2];
        }
        const a: cc.Vec2[] = [];
        const o = points.length * samples;
        for (let r = 0; r <= o; r++) {
            const s = r / o;
            const l = CatmullRomHelper.interp(n, s);
            a.push(l);
        }
        return a;
    }
}