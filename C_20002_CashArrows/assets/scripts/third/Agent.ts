import { KeyValuePair, ObserverObj } from './commonDefine';
import Line from './Line';
import RVOMath from './RVOMath';
import Simulator from './Simulator';
import Vector2 from './Vector2';

export default class Agent {
    agentNeighbors: KeyValuePair<number, Agent>[] = [];
    obstacleNeighbors: KeyValuePair<number, any>[] = [];
    orcaLines: Line[] = [];
    prefVelocity: Vector2 = new Vector2(0, 0);
    mass = 1;
    calc = true;
    newVelocity: Vector2 = new Vector2(0, 0);

    id: number;
    maxNeighbors: number;
    maxSpeed: number;
    neighborDist: number;
    position: Vector2;
    radius: number;
    timeHorizon: number;
    timeHorizonObst: number;
    velocity: Vector2;

    update(): void {
        this.velocity = this.newVelocity;
        const e = Vector2.addition(this.position, Vector2.multiply2(Simulator.Instance.timeStep, this.velocity));
        this.position = e;
    }

    insertObstacleNeighbor(e: any, t: number): void {
        const i = e.next;
        const a = RVOMath.distSqPointLineSegment(e.point, i.point, this.position);
        if (a < t) {
            this.obstacleNeighbors.push(new KeyValuePair(a, e));
            for (let r = this.obstacleNeighbors.length - 1; 0 != r && a < this.obstacleNeighbors[r - 1].Key;) {
                this.obstacleNeighbors[r] = this.obstacleNeighbors[r - 1];
                --r;
            }
            this.obstacleNeighbors[r] = new KeyValuePair(a, e);
        }
    }

    insertAgentNeighbor(e: Agent, t: ObserverObj<number>): void {
        if (e && this != e) {
            const i = RVOMath.absSq(Vector2.subtract(this.position, e.position));
            if (i < t.value) {
                this.agentNeighbors.length < this.maxNeighbors && this.agentNeighbors.push(new KeyValuePair(i, e));
                for (let a = this.agentNeighbors.length - 1; 0 != a && i < this.agentNeighbors[a - 1].Key;) {
                    this.agentNeighbors[a] = this.agentNeighbors[a - 1];
                    --a;
                }
                this.agentNeighbors[a] = new KeyValuePair(i, e);
                this.agentNeighbors.length == this.maxNeighbors && (t.value = this.agentNeighbors[this.agentNeighbors.length - 1].Key);
            }
        }
    }

    computeNeighbors(): void {
        this.obstacleNeighbors = [];
        const e = RVOMath.sqr(this.timeHorizonObst * this.maxSpeed + this.radius);
        Simulator.Instance.kdTree.computeObstacleNeighbors(this, e);
        this.agentNeighbors = [];
        if (this.maxNeighbors > 0) {
            const t = new ObserverObj<number>();
            t.value = RVOMath.sqr(this.neighborDist);
            Simulator.Instance.kdTree.computeAgentNeighbors(this, t);
        }
    }

    computeNewVelocity(): void {
        this.orcaLines = [];
        const e = 1 / this.timeHorizonObst;
        let t = 0;
        for (; t < this.obstacleNeighbors.length; ++t) {
            for (let i = this.obstacleNeighbors[t].Value, l = i.next, c = Vector2.subtract(i.point, this.position), u = Vector2.subtract(l.point, this.position), d = !1, h = 0; h < this.orcaLines.length; ++h) {
                if (RVOMath.det(Vector2.subtract(Vector2.multiply2(e, c), this.orcaLines[h].point), this.orcaLines[h].direction) - e * this.radius >= -RVOMath.RVO_EPSILON && RVOMath.det(Vector2.subtract(Vector2.multiply2(e, u), this.orcaLines[h].point), this.orcaLines[h].direction) - e * this.radius >= -RVOMath.RVO_EPSILON) {
                    d = !0;
                    break;
                }
            }
            if (!d) {
                const p = RVOMath.absSq(c);
                const _ = RVOMath.absSq(u);
                const f = RVOMath.sqr(this.radius);
                const g = Vector2.subtract(l.point, i.point);
                const m = Vector2.multiply(Vector2.multiply2(-1, c), g) / RVOMath.absSq(g);
                const y = RVOMath.absSq(Vector2.subtract(Vector2.multiply2(-1, c), Vector2.multiply2(m, g)));
                let v = new Line();
                if (m < 0 && p <= f) {
                    if (i.convex) {
                        v.point = new Vector2(0, 0);
                        v.direction = RVOMath.normalize(new Vector2(-c.y, c.x));
                        this.orcaLines.push(v);
                    }
                } else if (m > 1 && _ <= f) {
                    if (l.convex && RVOMath.det(u, l.direction) >= 0) {
                        v.point = new Vector2(0, 0);
                        v.direction = RVOMath.normalize(new Vector2(-u.y, u.x));
                        this.orcaLines.push(v);
                    }
                } else if (m >= 0 && m < 1 && y <= f) {
                    v.point = new Vector2(0, 0);
                    v.direction = Vector2.multiply2(-1, i.direction);
                    this.orcaLines.push(v);
                } else {
                    let b: Vector2;
                    let w: Vector2;
                    if (m < 0 && y <= f) {
                        if (!i.convex) continue;
                        l = i;
                        const k = RVOMath.sqrt(p - f);
                        b = Vector2.division(new Vector2(c.x * k - c.y * this.radius, c.x * this.radius + c.y * k), p);
                        w = Vector2.division(new Vector2(c.x * k + c.y * this.radius, -c.x * this.radius + c.y * k), p);
                    } else if (m > 1 && y <= f) {
                        if (!l.convex) continue;
                        i = l;
                        const S = RVOMath.sqrt(_ - f);
                        b = Vector2.division(new Vector2(u.x * S - u.y * this.radius, u.x * this.radius + u.y * S), _);
                        w = Vector2.division(new Vector2(u.x * S + u.y * this.radius, -u.x * this.radius + u.y * S), _);
                    } else {
                        if (i.convex) {
                            const k = RVOMath.sqrt(p - f);
                            b = Vector2.division(new Vector2(c.x * k - c.y * this.radius, c.x * this.radius + c.y * k), p);
                        } else {
                            b = Vector2.multiply2(-1, i.direction);
                        }
                        if (l.convex) {
                            const S = RVOMath.sqrt(_ - f);
                            w = Vector2.division(new Vector2(u.x * S - u.y * this.radius, u.x * this.radius + u.y * S), _);
                        } else {
                            w = Vector2.multiply2(-1, l.direction);
                        }
                    }
                    const C = i.previous;
                    let T = !1;
                    let N = !1;
                    if (i.convex && RVOMath.det(b, Vector2.multiply2(-1, C.direction)) >= 0) {
                        b = Vector2.multiply2(-1, C.direction);
                        T = !0;
                    }
                    if (l.convex && RVOMath.det(w, Vector2.multiply2(-1, l.direction)) <= 0) {
                        w = l.direction;
                        N = !0;
                    }
                    const I = Vector2.multiply2(e, Vector2.subtract(i.point, this.position));
                    const A = Vector2.multiply2(e, Vector2.subtract(l.point, this.position));
                    const R = Vector2.subtract(A, I);
                    const P = i == l ? .5 : Vector2.multiply(Vector2.subtract(this.velocity, I), R) / RVOMath.absSq(R);
                    const E = Vector2.multiply(Vector2.subtract(this.velocity, I), b);
                    const M = Vector2.multiply(Vector2.subtract(this.velocity, A), w);
                    if (P < 0 && E < 0 || i == l && E < 0 && M < 0) {
                        let L = RVOMath.normalize(Vector2.subtract(this.velocity, I));
                        v.direction = new Vector2(L.y, -L.x);
                        v.point = Vector2.addition(I, Vector2.multiply2(this.radius * e, L));
                        this.orcaLines.push(v);
                    } else if (P > 1 && M < 0) {
                        let L = RVOMath.normalize(Vector2.subtract(this.velocity, A));
                        v.direction = new Vector2(L.y, -L.x);
                        v.point = Vector2.addition(A, Vector2.multiply2(this.radius * e, L));
                        this.orcaLines.push(v);
                    } else {
                        const D = P < 0 || P > 1 || i == l ? RVOMath.RVO_POSITIVEINFINITY : RVOMath.absSq(Vector2.subtract(this.velocity, Vector2.addition(I, Vector2.multiply2(P, R))));
                        const x = E < 0 ? RVOMath.RVO_POSITIVEINFINITY : RVOMath.absSq(Vector2.subtract(this.velocity, Vector2.addition(I, Vector2.multiply2(E, b))));
                        const O = M < 0 ? RVOMath.RVO_POSITIVEINFINITY : RVOMath.absSq(Vector2.subtract(this.velocity, Vector2.addition(A, Vector2.multiply2(M, w))));
                        if (D <= x && D <= O) {
                            v.direction = Vector2.multiply2(-1, i.direction);
                            v.point = Vector2.addition(I, Vector2.multiply2(this.radius * e, new Vector2(-v.direction.y, v.direction.x)));
                            this.orcaLines.push(v);
                        } else if (x <= O) {
                            if (T) continue;
                            v.direction = b;
                            v.point = Vector2.addition(I, Vector2.multiply2(this.radius * e, new Vector2(-v.direction.y, v.direction.x)));
                            this.orcaLines.push(v);
                        } else if (!N) {
                            v.direction = Vector2.multiply2(-1, w);
                            v.point = Vector2.addition(A, Vector2.multiply2(this.radius * e, new Vector2(-v.direction.y, v.direction.x)));
                            this.orcaLines.push(v);
                        }
                    }
                }
            }
        }
        const B = this.orcaLines.length;
        const F = 1 / this.timeHorizon;
        for (t = 0; t < this.agentNeighbors.length; ++t) {
            const U = this.agentNeighbors[t].Value;
            if (U) {
                const V = this.mass / (this.mass + U.mass);
                const G = U.mass / (this.mass + U.mass);
                const H = V >= .5 ? this.velocity.minus(this.velocity.scale(V)).scale(2) : this.prefVelocity.add(this.velocity.minus(this.prefVelocity).scale(2 * V));
                const z = G >= .5 ? U.velocity.scale(2).scale(1 - G) : U.prefVelocity.add(U.velocity.minus(U.prefVelocity).scale(2 * G));
                const j = Vector2.subtract(U.position, this.position);
                const q = Vector2.subtract(H, z);
                const W = RVOMath.absSq(j);
                const J = this.radius + U.radius;
                const K = RVOMath.sqr(J);
                let v = new Line();
                let Y = new Vector2();
                if (W > K) {
                    let X = Vector2.subtract(q, Vector2.multiply2(F, j));
                    const Q = RVOMath.absSq(X);
                    const $ = Vector2.multiply(X, j);
                    if ($ < 0 && RVOMath.sqr($) > K * Q) {
                        const Z = RVOMath.sqrt(Q);
                        let L = Vector2.division(X, Z);
                        v.direction = new Vector2(L.y, -L.x);
                        Y = Vector2.multiply2(J * F - Z, L);
                    } else {
                        const ee = RVOMath.sqrt(W - K);
                        RVOMath.det(j, X) > 0 ? v.direction = Vector2.division(new Vector2(j.x * ee - j.y * J, j.x * J + j.y * ee), W) : v.direction = Vector2.division(new Vector2(j.x * ee + j.y * J, -j.x * J + j.y * ee), -W);
                        const te = Vector2.multiply(q, v.direction);
                        Y = Vector2.subtract(Vector2.multiply2(te, v.direction), q);
                    }
                } else {
                    const ie = 1 / Simulator.Instance.timeStep;
                    const X = Vector2.subtract(q, Vector2.multiply2(ie, j));
                    const Z = RVOMath.abs(X);
                    let L = Vector2.division(X, Z);
                    v.direction = new Vector2(L.y, -L.x);
                    Y = Vector2.multiply2(J * ie - Z, L);
                }
                v.point = H.add(Y.scale(V));
                this.orcaLines[this.orcaLines.length] = v;
            }
        }
        const ne = new ObserverObj<Vector2>(new Vector2(this.newVelocity.x, this.newVelocity.y));
        const ae = this.linearProgram2(this.orcaLines, this.maxSpeed, this.prefVelocity, !1, ne);
        ae < this.orcaLines.length && this.linearProgram3(this.orcaLines, B, ae, this.maxSpeed, ne);
        this.newVelocity = ne.value;
    }

    linearProgram1(e: Line[], t: number, i: number, n: Vector2, a: boolean, r: ObserverObj<Vector2>): boolean {
        const l = Vector2.multiply(e[t].point, e[t].direction);
        const c = RVOMath.sqr(l) + RVOMath.sqr(i) - RVOMath.absSq(e[t].point);
        if (c < 0) return !1;
        for (let u = RVOMath.sqrt(c), d = -l - u, h = -l + u, p = 0; p < t; ++p) {
            const _ = RVOMath.det(e[t].direction, e[p].direction);
            const f = RVOMath.det(e[p].direction, Vector2.subtract(e[t].point, e[p].point));
            if (RVOMath.fabs(_) <= RVOMath.RVO_EPSILON) {
                if (f < 0) return !1;
            } else {
                let g = f / _;
                _ > 0 ? h = Math.min(h, g) : d = Math.max(d, g);
                if (d > h) return !1;
            }
        }
        if (a) {
            Vector2.multiply(n, e[t].direction) > 0 ? r.value = Vector2.addition(e[t].point, Vector2.multiply2(h, e[t].direction)) : r.value = Vector2.addition(e[t].point, Vector2.multiply2(d, e[t].direction));
        } else {
            const g = Vector2.multiply(e[t].direction, Vector2.subtract(n, e[t].point));
            r.value = g < d ? Vector2.addition(e[t].point, Vector2.multiply2(d, e[t].direction)) : g > h ? Vector2.addition(e[t].point, Vector2.multiply2(h, e[t].direction)) : Vector2.addition(e[t].point, Vector2.multiply2(g, e[t].direction));
        }
        return !0;
    }

    linearProgram2(e: Line[], t: number, i: Vector2, n: boolean, a: ObserverObj<Vector2>): number {
        n ? a.value = Vector2.multiply2(t, i) : RVOMath.absSq(i) > RVOMath.sqr(t) ? a.value = Vector2.multiply2(t, RVOMath.normalize(i)) : a.value = i;
        for (let r = 0; r < e.length; ++r) {
            if (RVOMath.det(e[r].direction, Vector2.subtract(e[r].point, a.value)) > 0) {
                const l = new Vector2(a.value.x, a.value.y);
                if (!this.linearProgram1(e, r, t, i, n, a)) {
                    a.value = l;
                    return r;
                }
            }
        }
        return e.length;
    }

    linearProgram3(e: Line[], t: number, i: number, n: number, r: ObserverObj<Vector2>): void {
        for (let l = 0, c = i; c < e.length; ++c) {
            if (RVOMath.det(e[c].direction, Vector2.subtract(e[c].point, r.value)) > l) {
                const u: Line[] = [];
                for (let d = 0; d < t; ++d) {
                    u[u.length] = e[d];
                }
                for (let h = t; h < c; ++h) {
                    const p = new Line();
                    const _ = RVOMath.det(e[c].direction, e[h].direction);
                    if (RVOMath.fabs(_) <= RVOMath.RVO_EPSILON) {
                        if (Vector2.multiply(e[c].direction, e[h].direction) > 0) continue;
                        p.point = Vector2.multiply2(.5, Vector2.addition(e[c].point, e[h].point));
                    } else {
                        p.point = Vector2.addition(e[c].point, Vector2.multiply2(RVOMath.det(e[h].direction, Vector2.subtract(e[c].point, e[h].point)) / _, e[c].direction));
                    }
                    p.direction = RVOMath.normalize(Vector2.subtract(e[h].direction, e[c].direction));
                    u[u.length] = p;
                }
                const f = new Vector2(r.value.x, r.value.y);
                this.linearProgram2(u, n, new Vector2(-e[c].direction.y, e[c].direction.x), !0, r) < u.length && (r.value = f);
                l = RVOMath.det(e[c].direction, Vector2.subtract(e[c].point, r.value));
            }
        }
    }
}
