interface CircleData {
    r: number;
    position: cc.Vec2;
}

export default class MyCircleColliderUtility {
    static collide(e: CircleData, t: CircleData, o: cc.Vec2, n?: cc.Graphics): cc.Vec2 | null {
        o.normalizeSelf();
        const i = e.position;
        const a = t.position;
        const r = e.r + t.r;
        const l = a.clone().subSelf(i);
        if (o.angle(l) >= Math.PI / 2) {
            return null;
        }
        const s = o.clone().mulSelf(l.len() + 100);
        const c = l.project(s);
        const u = i.clone().addSelf(c);
        if (n) {
            n.strokeColor = cc.Color.CYAN;
            n.moveTo(i.x, i.y);
            n.lineTo(u.x, u.y);
            n.stroke();
        }
        const p = c.clone().subSelf(l);
        const d = p.len();
        if (d < r) {
            if (n) {
                const _ = p.clone().addSelf(a);
                n.strokeColor = cc.Color.CYAN;
                n.moveTo(a.x, a.y);
                n.lineTo(_.x, _.y);
                n.stroke();
            }
            const f = Math.sin(Math.acos(d / r)) * r;
            const h = c.len() - f;
            const g = c.normalizeSelf().mulSelf(h).clone().addSelf(i);
            if (n) {
                n.strokeColor = cc.Color.RED;
                n.moveTo(i.x, i.y);
                n.lineTo(g.x, g.y);
                n.circle(g.x, g.y, e.r);
                n.stroke();
            }
            return g;
        }
        return null;
    }

    static collideWhitLine(e: CircleData, t: cc.Vec2, o: cc.Vec2, n: cc.Vec2, i?: cc.Graphics): cc.Vec2 | null {
        n = n.normalize();
        t = t.clone();
        o = o.clone();
        const a = e.position;
        const r = o.clone().subSelf(t);
        const l = cc.v2(r).signAngle(n);
        if (l <= 0 || l >= Math.PI) {
            return null;
        }
        const s = a.add(n.mul(2e5));
        const c = r.len();
        const u = a.clone().subSelf(t);
        if (i) {
            const p = u.clone().addSelf(t);
            this.drawLine(t, p, i, cc.Color.WHITE);
        }
        const d = u.project(r);
        const _ = d.clone().subSelf(u);
        const f = s.clone().subSelf(t);
        const h = f.project(r);
        const g = h.clone().subSelf(f);
        h.angle(g);
        if (h.angle(g) < 1 && g.len() > _.len()) {
            return null;
        }
        if (i) {
            const y = d.clone().addSelf(t);
            this.drawLine(t, y, i, cc.Color.WHITE);
        }
        if (i) {
            const v = _.clone().addSelf(a);
            this.drawLine(a, v, i, cc.Color.WHITE);
        }
        const m = _.len();
        const b = n.angle(r);
        const C = Math.sin(b);
        let P = m / C;
        P -= e.r / C;
        const S = n.clone().mulSelf(P).clone().add(a);
        const I = S.clone().sub(t).project(r).clone().add(t);
        I.clone();
        const D = I.sub(t).len();
        const E = I.sub(o).len();
        if ((D > e.r && D >= c) || (E > e.r && E >= c)) {
            return null;
        }
        i && this.drawLine(t, I, i, cc.Color.BLUE);
        if (S.sub(a).angle(n) > Math.PI / 2) {
            return null;
        }
        if (i) {
            this.drawLine(a, S, i, cc.Color.RED);
            this.drawCircle(S, e.r, i, cc.Color.RED);
        }
        return S;
    }

    static collideCheck(e: CircleData, t: CircleData, o: cc.Vec2): boolean {
        const n = e.position;
        const i = t.position.clone().subSelf(n);
        return i.angle(o) < Math.asin((e.r + t.r) / i.len());
    }

    static drawCircle(e: cc.Vec2, t: number, o: cc.Graphics, n: cc.Color): void {
        o.strokeColor = n;
        o.circle(e.x, e.y, t);
        o.stroke();
    }

    static collidePoint(e: CircleData, t: cc.Vec2, o: cc.Vec2, n?: cc.Graphics): cc.Vec2 | null {
        const i: CircleData = {
            r: 0,
            position: t,
        };
        return this.collide(e, i, o, n);
    }

    static drawLine(e: cc.Vec2, t: cc.Vec2, o: cc.Graphics, n: cc.Color): void {
        o.strokeColor = n;
        o.moveTo(e.x, e.y);
        o.lineTo(t.x, t.y);
        o.stroke();
    }
}
