import { KeyValuePair, ObserverObj } from "./commonDefine";
import Line from "./Line";
import RVOMath from "./RVOMath";
import Simulator from "./Simulator";
import Vector2 from "./Vector2";

export default class Agent {
    agentNeighbors: any[];
    obstacleNeighbors: any[];
    orcaLines: any[];
    prefVelocity: any;
    mass: number;
    calc: boolean;
    newVelocity: any;
    velocity: any;
    position: any;
    maxNeighbors: number;
    timeHorizonObst: number;
    maxSpeed: number;
    radius: number;
    neighborDist: number;
    timeHorizon: number;

    constructor() {
        this.agentNeighbors = [];
        this.obstacleNeighbors = [];
        this.orcaLines = [];
        this.prefVelocity = new Vector2(0, 0);
        this.mass = 1;
        this.calc = true;
        this.newVelocity = new Vector2(0, 0);
    }

    update() {
        this.velocity = this.newVelocity;
        var e = Vector2.addition(this.position, Vector2.multiply2(Simulator.Instance.timeStep, this.velocity));
        this.position = e;
    }

    insertObstacleNeighbor(e: any, t: number) {
        var i = e.next, a = RVOMath.distSqPointLineSegment(e.point, i.point, this.position);
        if (a < t) {
            this.obstacleNeighbors.push(new KeyValuePair(a, e));
            for (var r = this.obstacleNeighbors.length - 1; 0 != r && a < this.obstacleNeighbors[r - 1].Key; ) {
                this.obstacleNeighbors[r] = this.obstacleNeighbors[r - 1];
                --r;
            }
            this.obstacleNeighbors[r] = new KeyValuePair(a, e);
        }
    }

    insertAgentNeighbor(e: any, t: any) {
        if (e && this != e) {
            var i = RVOMath.absSq(Vector2.subtract(this.position, e.position));
            if (i < t.value) {
                this.agentNeighbors.length < this.maxNeighbors && this.agentNeighbors.push(new KeyValuePair(i, e));
                for (var a = this.agentNeighbors.length - 1; 0 != a && i < this.agentNeighbors[a - 1].Key; ) {
                    this.agentNeighbors[a] = this.agentNeighbors[a - 1];
                    --a;
                }
                this.agentNeighbors[a] = new KeyValuePair(i, e);
                this.agentNeighbors.length == this.maxNeighbors && (t.value = this.agentNeighbors[this.agentNeighbors.length - 1].Key);
            }
        }
    }

    computeNeighbors() {
        this.obstacleNeighbors = [];
        var e = RVOMath.sqr(this.timeHorizonObst * this.maxSpeed + this.radius);
        Simulator.Instance.kdTree.computeObstacleNeighbors(this, e);
        this.agentNeighbors = [];
        if (this.maxNeighbors > 0) {
            var t = new ObserverObj();
            t.value = RVOMath.sqr(this.neighborDist);
            Simulator.Instance.kdTree.computeAgentNeighbors(this, t);
        }
    }

    computeNewVelocity() {
        this.orcaLines = [];
        for (var e = 1 / this.timeHorizonObst, t = 0; t < this.obstacleNeighbors.length; ++t) {
            for (var i = this.obstacleNeighbors[t].Value, l = i.next, c = Vector2.subtract(i.point, this.position), u = Vector2.subtract(l.point, this.position), d = false, h = 0; h < this.orcaLines.length; ++h) if (RVOMath.det(Vector2.subtract(Vector2.multiply2(e, c), this.orcaLines[h].point), this.orcaLines[h].direction) - e * this.radius >= -RVOMath.RVO_EPSILON && RVOMath.det(Vector2.subtract(Vector2.multiply2(e, u), this.orcaLines[h].point), this.orcaLines[h].direction) - e * this.radius >= -RVOMath.RVO_EPSILON) {
                d = true;
                break;
            }
            if (!d) {
                var p = RVOMath.absSq(c), _ = RVOMath.absSq(u), f = RVOMath.sqr(this.radius), g = Vector2.subtract(l.point, i.point), m = Vector2.multiply(Vector2.multiply2(-1, c), g) / RVOMath.absSq(g), y = RVOMath.absSq(Vector2.subtract(Vector2.multiply2(-1, c), Vector2.multiply2(m, g))), v = new Line();
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
                    var b: any = void 0, w: any = void 0;
                    if (m < 0 && y <= f) {
                        if (!i.convex) continue;
                        l = i;
                        var k = RVOMath.sqrt(p - f);
                        b = Vector2.division(new Vector2(c.x * k - c.y * this.radius, c.x * this.radius + c.y * k), p);
                        w = Vector2.division(new Vector2(c.x * k + c.y * this.radius, -c.x * this.radius + c.y * k), p);
                    } else if (m > 1 && y <= f) {
                        if (!l.convex) continue;
                        i = l;
                        var S = RVOMath.sqrt(_ - f);
                        b = Vector2.division(new Vector2(u.x * S - u.y * this.radius, u.x * this.radius + u.y * S), _);
                        w = Vector2.division(new Vector2(u.x * S + u.y * this.radius, -u.x * this.radius + u.y * S), _);
                    } else {
                        if (i.convex) {
                            k = RVOMath.sqrt(p - f);
                            b = Vector2.division(new Vector2(c.x * k - c.y * this.radius, c.x * this.radius + c.y * k), p);
                        } else b = Vector2.multiply2(-1, i.direction);
                        if (l.convex) {
                            S = RVOMath.sqrt(_ - f);
                            w = Vector2.division(new Vector2(u.x * S - u.y * this.radius, u.x * this.radius + u.y * S), _);
                        } else w = Vector2.multiply2(-1, i.direction);
                    }
                    var C = i.previous, T = false, N = false;
                    if (i.convex && RVOMath.det(b, Vector2.multiply2(-1, C.direction)) >= 0) {
                        b = Vector2.multiply2(-1, C.direction);
                        T = true;
                    }
                    if (l.convex && RVOMath.det(w, Vector2.multiply2(-1, l.direction)) <= 0) {
                        w = l.direction;
                        N = true;
                    }
                    var I = Vector2.multiply2(e, Vector2.subtract(i.point, this.position)), A = Vector2.multiply2(e, Vector2.subtract(l.point, this.position)), R = Vector2.subtract(A, I), P = i == l ? .5 : Vector2.multiply(Vector2.subtract(this.velocity, I), R) / RVOMath.absSq(R), E = Vector2.multiply(Vector2.subtract(this.velocity, I), b), M = Vector2.multiply(Vector2.subtract(this.velocity, A), w);
                    if (P < 0 && E < 0 || i == l && E < 0 && M < 0) {
                        var L = RVOMath.normalize(Vector2.subtract(this.velocity, I));
                        v.direction = new Vector2(L.y, -L.x);
                        v.point = Vector2.addition(I, Vector2.multiply2(this.radius * e, L));
                        this.orcaLines.push(v);
                    } else if (P > 1 && M < 0) {
                        L = RVOMath.normalize(Vector2.subtract(this.velocity, A));
                        v.direction = new Vector2(L.y, -L.x);
                        v.point = Vector2.addition(A, Vector2.multiply2(this.radius * e, L));
                        this.orcaLines.push(v);
                    } else {
                        var D = P < 0 || P > 1 || i == l ? RVOMath.RVO_POSITIVEINFINITY : RVOMath.absSq(Vector2.subtract(this.velocity, Vector2.addition(I, Vector2.multiply2(P, R)))), x = E < 0 ? RVOMath.RVO_POSITIVEINFINITY : RVOMath.absSq(Vector2.subtract(this.velocity, Vector2.addition(I, Vector2.multiply2(E, b)))), O = M < 0 ? RVOMath.RVO_POSITIVEINFINITY : RVOMath.absSq(Vector2.subtract(this.velocity, Vector2.addition(A, Vector2.multiply2(M, w))));
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
        var B = this.orcaLines.length, F = 1 / this.timeHorizon;
        for (t = 0; t < this.agentNeighbors.length; ++t) {
            var U = this.agentNeighbors[t].Value;
            if (U) {
                var V = this.mass / (this.mass + U.mass), G = U.mass / (this.mass + U.mass), H = V >= .5 ? this.velocity.minus(this.velocity.scale(V)).scale(2) : this.prefVelocity.add(this.velocity.minus(this.prefVelocity).scale(2 * V)), z = G >= .5 ? U.velocity.scale(2).scale(1 - G) : U.prefVelocity.add(U.velocity.minus(U.prefVelocity).scale(2 * G)), j = Vector2.subtract(U.position, this.position), q = Vector2.subtract(H, z), W = RVOMath.absSq(j), J = this.radius + U.radius, K = RVOMath.sqr(J);
                v = new Line();
                var Y = new Vector2();
                if (W > K) {
                    var X = Vector2.subtract(q, Vector2.multiply2(F, j)), Q = RVOMath.absSq(X), $ = Vector2.multiply(X, j);
                    if ($ < 0 && RVOMath.sqr($) > K * Q) {
                        var Z = RVOMath.sqrt(Q);
                        L = Vector2.division(X, Z);
                        v.direction = new Vector2(L.y, -L.x);
                        Y = Vector2.multiply2(J * F - Z, L);
                    } else {
                        var ee = RVOMath.sqrt(W - K);
                        RVOMath.det(j, X) > 0 ? v.direction = Vector2.division(new Vector2(j.x * ee - j.y * J, j.x * J + j.y * ee), W) : v.direction = Vector2.division(new Vector2(j.x * ee + j.y * J, -j.x * J + j.y * ee), -W);
                        var te = Vector2.multiply(q, v.direction);
                        Y = Vector2.subtract(Vector2.multiply2(te, v.direction), q);
                    }
                } else {
                    var ie = 1 / Simulator.Instance.timeStep;
                    X = Vector2.subtract(q, Vector2.multiply2(ie, j));
                    Z = RVOMath.abs(X);
                    L = Vector2.division(X, Z);
                    v.direction = new Vector2(L.y, -L.x);
                    Y = Vector2.multiply2(J * ie - Z, L);
                }
                v.point = H.add(Y.scale(V));
                this.orcaLines[this.orcaLines.length] = v;
            }
        }
        var ne = new ObserverObj(new Vector2(this.newVelocity.x, this.newVelocity.y)), ae = this.linearProgram2(this.orcaLines, this.maxSpeed, this.prefVelocity, false, ne);
        ae < this.orcaLines.length && this.linearProgram3(this.orcaLines, B, ae, this.maxSpeed, ne);
        this.newVelocity = ne.value;
    }

    linearProgram1(e: any, t: number, i: number, n: any, a: boolean, r: any) {
        var l = Vector2.multiply(e[t].point, e[t].direction), c = RVOMath.sqr(l) + RVOMath.sqr(i) - RVOMath.absSq(e[t].point);
        if (c < 0) return false;
        for (var u = RVOMath.sqrt(c), d = -l - u, h = -l + u, p = 0; p < t; ++p) {
            var _ = RVOMath.det(e[t].direction, e[p].direction), f = RVOMath.det(e[p].direction, Vector2.subtract(e[t].point, e[p].point));
            if (RVOMath.fabs(_) <= RVOMath.RVO_EPSILON) {
                if (f < 0) return false;
            } else {
                var g = f / _;
                _ > 0 ? h = Math.min(h, g) : d = Math.max(d, g);
                if (d > h) return false;
            }
        }
        if (a) Vector2.multiply(n, e[t].direction) > 0 ? r.value = Vector2.addition(e[t].point, Vector2.multiply2(h, e[t].direction)) : r.value = Vector2.addition(e[t].point, Vector2.multiply2(d, e[t].direction)); else {
            g = Vector2.multiply(e[t].direction, Vector2.subtract(n, e[t].point));
            r.value = g < d ? Vector2.addition(e[t].point, Vector2.multiply2(d, e[t].direction)) : g > h ? Vector2.addition(e[t].point, Vector2.multiply2(h, e[t].direction)) : Vector2.addition(e[t].point, Vector2.multiply2(g, e[t].direction));
        }
        return true;
    }

    linearProgram2(e: any, t: number, i: any, n: boolean, a: any) {
        n ? a.value = Vector2.multiply2(t, i) : RVOMath.absSq(i) > RVOMath.sqr(t) ? a.value = Vector2.multiply2(t, RVOMath.normalize(i)) : a.value = i;
        for (var r = 0; r < e.length; ++r) if (RVOMath.det(e[r].direction, Vector2.subtract(e[r].point, a.value)) > 0) {
            var l = new Vector2(a.value.x, a.value.y);
            if (!this.linearProgram1(e, r, t, i, n, a)) {
                a.value = l;
                return r;
            }
        }
        return e.length;
    }

    linearProgram3(e: any, t: number, i: number, n: number, r: any) {
        for (var l = 0, c = i; c < e.length; ++c) if (RVOMath.det(e[c].direction, Vector2.subtract(e[c].point, r.value)) > l) {
            for (var u = [], d = 0; d < t; ++d) u[u.length] = e[d];
            for (var h = t; h < c; ++h) {
                var p = new Line(), _ = RVOMath.det(e[c].direction, e[h].direction);
                if (RVOMath.fabs(_) <= RVOMath.RVO_EPSILON) {
                    if (Vector2.multiply(e[c].direction, e[h].direction) > 0) continue;
                    p.point = Vector2.multiply2(.5, Vector2.addition(e[c].point, e[h].point));
                } else p.point = Vector2.addition(e[c].point, Vector2.multiply2(RVOMath.det(e[h].direction, Vector2.subtract(e[c].point, e[h].point)) / _, e[c].direction));
                p.direction = RVOMath.normalize(Vector2.subtract(e[h].direction, e[c].direction));
                u[u.length] = p;
            }
            var f = new Vector2(r.value.x, r.value.y);
            this.linearProgram2(u, n, new Vector2(-e[c].direction.y, e[c].direction.x), true, r) < u.length && (r.value = f);
            l = RVOMath.det(e[c].direction, Vector2.subtract(e[c].point, r.value));
        }
    }
}
