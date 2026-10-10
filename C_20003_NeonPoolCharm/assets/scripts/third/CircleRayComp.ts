import BallLogicMgr from "./BallLogicMgr";
import CueDataSys from "./CueDataSys";
import EngineUtil from "./EngineUtil";
import GlobalConfig from "./GlobalConfig";
import MyCircleColliderUtility from "./MyCircleColliderUtility";
import PropDataSys from "./PropDataSys";

EngineUtil;

const v = Math.PI / 180;
const P = GlobalConfig.ball_radius;
const S = P * P * 4;

const { ccclass, property } = cc._decorator;

@ccclass
export default class CircleRayComp extends cc.Component {

    @property(cc.Node)
    virtualball = null;

    mid = null;

    get_distance(e, t) {
        const o = this.mid;
        const n = cc.v2(o.x + 250, o.y + 500);
        let i = null;
        let a = null;
        if (e >= Math.PI / 2) {
            i = cc.v2(0, -n.y);
            a = cc.v2(500 - n.x, 0);
        } else if (e < Math.PI / 2 && e >= 0) {
            i = cc.v2(0, -n.y);
            a = cc.v2(-n.x, 0);
        } else if (e > -Math.PI / 2 && e < 0) {
            i = cc.v2(0, 1e3 - n.y);
            a = cc.v2(-n.x, 0);
        } else if (e <= -Math.PI / 2) {
            i = cc.v2(0, 1e3 - n.y);
            a = cc.v2(500 - n.x, 0);
        }
        t = t.normalizeSelf().mulSelf(1e3);
        const r = t.project(i);
        const l = t.project(a);
        const s = Math.abs(l.x) / Math.abs(a.x);
        if (Math.abs(r.y) / Math.abs(i.y) > s) {
            l.x = l.x * (Math.abs(i.y) / Math.abs(r.y));
            r.y = i.y;
        } else {
            r.y = r.y * (Math.abs(a.x) / Math.abs(l.x));
            l.x = a.x;
        }
        return cc.v2(l.x, r.y).mag();
    }

    getColliderP_Pollygon(e, t, o) {
        o = o.normalize().mulSelf(2e3);
        const n = {
            start: t,
            end: t.add(o)
        };
        const i = e.getComponent(cc.PolygonCollider).points;
        let a = null;
        let l = null;
        for (let s = (i[0], 0); s < i.length; s++) {
            i[s], i[(s + 1) % i.length];
            const c = MyCircleColliderUtility.collideWhitLine({
                r: GlobalConfig.ball_radius,
                position: new cc.v2(t.x, t.y)
            }, i[(s + 1) % i.length], i[s], o, null);
            if (c) {
                const u = c.sub(t).len();
                if (null == l || l > u) {
                    l = u;
                    a = c;
                }
            }
        }
        return a || n.end;
    }

    onLoad() {
    }

    getLineLen(e, t) {
        e = new cc.Vec2(e.x, e.y);
        const o = this.getColliderP(e, t);
        const n = o.is_polygon;
        const i = o.croseP;
        return i ? {
            is_polygon: n,
            len: i.sub(e).mag()
        } : {
            is_polygon: n,
            len: 0
        };
    }

    getColliderP_rect(e, t) {
        t = t.normalizeSelf().mulSelf(2e3);
        const o = {
            start: e,
            end: e.add(t)
        };
        const n = {
            start: new cc.Vec2(-242.5, 491.5),
            end: new cc.Vec2(242.5, 491.5)
        };
        let a = this.getLineIntersection(o, n);
        if (a) return a;
        let i = {
            start: new cc.Vec2(-242.5, -491.5),
            end: new cc.Vec2(242.5, -491.5)
        };
        a = this.getLineIntersection(o, i);
        if (a) return a;
        i = {
            start: new cc.Vec2(-242.5, 491.5),
            end: new cc.Vec2(-242.5, -491.5)
        };
        a = this.getLineIntersection(o, i);
        if (a) return a;
        const r = {
            start: new cc.Vec2(242.5, 491.5),
            end: new cc.Vec2(242.5, -491.5)
        };
        return (a = this.getLineIntersection(o, r)) || undefined;
    }

    getLineIntersection(e, t) {
        const o = e.start;
        const n = e.end;
        const i = t.start;
        const a = t.end;
        const r = n.x - o.x;
        const l = n.y - o.y;
        const s = a.x - i.x;
        const c = a.y - i.y;
        const u = (-l * (o.x - i.x) + r * (o.y - i.y)) / (-s * l + r * c);
        const p = (s * (o.y - i.y) - c * (o.x - i.x)) / (-s * l + r * c);
        if (u >= 0 && u <= 1 && p >= 0 && p <= 1) {
            const d = o.x + p * r;
            const _ = o.y + p * l;
            return new cc.Vec2(d, _);
        }
        return null;
    }

    check_line(e, t, o, n) {
        const i = PropDataSys.isLinePropUsed;
        this.mid = e;
        let a;
        let c = -1;
        let u = null;
        let p = null;
        let d = null;
        const _ = this.node.getChildByName("plane_table").getChildByName("node_graphics").getComponent("DrawComp");
        for (const g of t.entries()) {
            const y = g[0];
            const C = g[1];
            if (100 * BallLogicMgr.BallIDType_White != C.getComponent("Ball2DControl").ballID) {
                let P = null;
                let S = null;
                const I = C;
                if (I) {
                    const D = cc.v2(I.x - e.x, I.y - e.y);
                    let w = cc.Vec2.angle(n, D);
                    if (w > 1) continue;
                    const E = this.foundCirclePoint(e, I, n, y);
                    if (E) {
                        _ && _.clear();
                        const T = E.mag();
                        if (-1 == c) {
                            c = T;
                            S = I;
                            _ && _.drawcircle(cc.v2(E.x + e.x, E.y + e.y), I, "#ff0000");
                            P = E;
                        } else if (T < c) {
                            c = T;
                            S = I;
                            _ && _.drawcircle(cc.v2(E.x + e.x, E.y + e.y), I, "#ffff00");
                            P = E;
                        } else _ && _.drawcircle(cc.v2(E.x + e.x, E.y + e.y), I, "#0000ff");
                        if (P) {
                            P.len();
                            w = P.angle(n);
                            P.len() < .5 && w > 3 || Math.sign(n.x) == Math.sign(P.x) && Math.sign(n.y) == Math.sign(P.y) || (P = null);
                            if (P) {
                                const O = cc.v2(P.x + e.x, P.y + e.y);
                                const M = cc.v2(S.x - O.x, S.y - O.y);
                                let L;
                                let B;
                                if ((B = (L = cc.v2(O.x - e.x, O.y - e.y)).angle(M)) > 1.4 && B < 3) {
                                    P = null;
                                    c = -1;
                                }
                            }
                        }
                    }
                }
                if (P) {
                    p = P;
                    u = S;
                    d = S;
                }
            }
        }
        this.virtualball.active = false;
        const N = cc.find("plane_table", this.node).getChildByName("sprite_dir_green");
        let R;
        let x;
        let U;
        let j;
        if (p) {
            R = Math.atan2(p.y, p.x);
            let O;
            let M;
            let L;
            const B = (O = cc.v2(p.x + e.x, p.y + e.y), M = cc.v2(u.x - O.x, u.y - O.y), 0);
            (L = cc.v2(O.x - e.x, O.y - e.y)).angle(M);
            if (B < 1.36) {
                this.virtualball.x = O.x;
                this.virtualball.y = O.y;
                this.virtualball.active = true;
                x = L.mag();
                const A = cc.v2(e.x, e.y).subSelf(cc.v2(d.x, d.y)).len();
                const k = this.getLineLen(this.mid, L);
                U = k.is_polygon;
                if (A >= k.len) p = null; else {
                    _ && _.drawcircle(cc.v2(p.x + e.x, p.y + e.y), null, "#ffff00");
                    N.getComponent("SpriteRayComp").reset(R / v, x + (i ? GlobalConfig.ball_radius - 4 : -GlobalConfig.ball_radius), o, i);
                    N.x = e.x;
                    N.y = e.y;
                    N.active = true;
                    a = M;
                    const G = Math.atan2(M.y, M.x);
                    let F = i ? this.getLineLen(u, M).len + 25 : CueDataSys.getUsedCueAimLineLen();
                    !i && BallLogicMgr.useSimCueAttri && BallLogicMgr.simAimming && (F = BallLogicMgr.simAimming);
                    j = cc.find("plane_table", this.node).getChildByName("sprite_dir_yellow");
                    j.x = u.x;
                    j.y = u.y;
                    j.getComponent("SpriteRayComp").resetWillGo(G / v, F, o, i, d);
                    j.active = true;
                }
            } else p = null;
        }
        if (null == p) {
            a = null;
            _ && _.clear();
            j = cc.find("plane_table", this.node).getChildByName("sprite_dir_yellow");
            j.active = false;
            N.x = e.x;
            N.y = e.y;
            N.active = true;
            R = Math.atan2(n.y, n.x);
            x = 1e3;
            const H = this.getLineLen(this.mid, n);
            U = H.is_polygon;
            x = H.len;
            const V = i ? x + 4 : x;
            const Y = n.normalize().mulSelf(U ? V : x - GlobalConfig.ball_radius).addSelf(this.mid);
            this.virtualball.x = Y.x;
            this.virtualball.y = Y.y;
            this.virtualball.active = true;
            const W = U ? -GlobalConfig.ball_radius : -2 * GlobalConfig.ball_radius;
            const J = U ? GlobalConfig.ball_radius : -4;
            N.getComponent("SpriteRayComp").reset(R / v, x + (i ? J : W), o, i);
        }
        return {
            tar_node: d,
            zhexian: a
        };
    }

    clear() {
        const e = this.node.getChildByName("node_graphics").getComponent("DrawComp");
        cc.find("plane_table", this.node).getChildByName("sprite_dir_green").active = false;
        e && e.clear();
        cc.find("plane_table", this.node).getChildByName("sprite_dir_yellow").active = false;
        this.virtualball.active = false;
    }

    foundCirclePoint(e, t, o) {
        if (0 == o.y) {
            o.y = 1e-10;
        }
        if (0 == o.x) {
            o.x = 1e-10;
        }
        const n = cc.v2(t.x - e.x, t.y - e.y);
        const i = o.y / o.x;
        const a = S;
        const r = 1 + i * i;
        const l = -(2 * n.x + 2 * n.y * i);
        const s = l * l - 4 * r * (n.x * n.x + n.y * n.y - a);
        const c = Math.sqrt(s);
        const u = (-l + c) / (2 * r);
        const p = (-l - c) / (2 * r);
        const d = u * i;
        const _ = p * i;
        if (u && p && d && _) {
            o = cc.v2(u, d);
            const f = cc.v2(p, _);
            return o.mag() < f.mag() ? o : f;
        }
        return null;
    }

    getColliderP(e, t) {
        const o = cc.find("zhuo_pengzhuang", this.node).getChildByName("pengzhuang_root").getChildByName("zhuo_bian");
        return o && o.getComponent(cc.PolygonCollider) ? {
            is_polygon: true,
            croseP: this.getColliderP_Pollygon(o, e, t)
        } : {
            is_polygon: false,
            croseP: this.getColliderP_rect(e, t)
        };
    }

    getColliderP_Pollygon_old(e, t, o) {
        o = o.normalizeSelf().mulSelf(2e3);
        const n = {
            start: t,
            end: t.add(o)
        };
        const i = e.getComponent(cc.PolygonCollider).points;
        let a = null;
        let r = null;
        for (let l = (i[0], 0); l < i.length; l++) {
            const s = {
                start: i[l],
                end: i[(l + 1) % i.length]
            };
            const c = this.getLineIntersection(n, s);
            if (c) {
                const u = c.sub(t).len();
                if (null == r || r > u) {
                    r = u;
                    a = c;
                }
            }
        }
        return a || n.end;
    }
}
