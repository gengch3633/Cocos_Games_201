let e = require;
let t = module;
let i = exports;
"use strict";
cc._RF.push(t, "aafb3bHPehAL6NLTzQj9qJ3", "Agent");
Object.defineProperty(i, "__esModule", {
  value: ! 0
}
);
var n = e("commonDefine"),
a = e("Line"),
o = e("RVOMath"),
r = e("Simulator"),
s = e("Vector2"),
l = function() {
  function e() {
    this.agentNeighbors = [];
    this.obstacleNeighbors = [];
    this.orcaLines = [];
    this.prefVelocity = new s.default(0, 0);
    this.mass = 1;
    this.calc = ! 0;
    this.newVelocity = new s.default(0, 0);
  }
  e.prototype.update = function() {
    this.velocity = this.newVelocity;
    var e = s.default.addition(this.position, s.default.multiply2(r.default.Instance.timeStep, this.velocity));
    this.position = e;
  }
;
  e.prototype.insertObstacleNeighbor = function(e, t) {
    var i = e.next,
    a = o.default.distSqPointLineSegment(e.point, i.point, this.position);
    if(a < t) {
      this.obstacleNeighbors.push(new n.KeyValuePair(a, e));
      for(var r = this.obstacleNeighbors.length- 1;
      0 != r&& a < this.obstacleNeighbors[r- 1].Key;
) {
        this.obstacleNeighbors[r] = this.obstacleNeighbors[r- 1];
-- r;
      }
      this.obstacleNeighbors[r] = new n.KeyValuePair(a, e);
    }
  }
;
  e.prototype.insertAgentNeighbor = function(e, t) {
    if(e&& this != e) {
      var i = o.default.absSq(s.default.subtract(this.position, e.position));
      if(i < t.value) {
        this.agentNeighbors.length < this.maxNeighbors&& this.agentNeighbors.push(new n.KeyValuePair(i, e));
        for(var a = this.agentNeighbors.length- 1;
        0 != a&& i < this.agentNeighbors[a- 1].Key;
) {
          this.agentNeighbors[a] = this.agentNeighbors[a- 1];
-- a;
        }
        this.agentNeighbors[a] = new n.KeyValuePair(i, e);
        this.agentNeighbors.length == this.maxNeighbors&& (t.value = this.agentNeighbors[this.agentNeighbors.length- 1].Key);
      }
    }
  }
;
  e.prototype.computeNeighbors = function() {
    this.obstacleNeighbors = [];
    var e = o.default.sqr(this.timeHorizonObst* this.maxSpeed+ this.radius);
    r.default.Instance.kdTree.computeObstacleNeighbors(this, e);
    this.agentNeighbors = [];
    if(this.maxNeighbors > 0) {
      var t = new n.ObserverObj();
      t.value = o.default.sqr(this.neighborDist);
      r.default.Instance.kdTree.computeAgentNeighbors(this, t);
    }
  }
;
  e.prototype.computeNewVelocity = function() {
    this.orcaLines = [];
    for(var e = 1/ this.timeHorizonObst, t = 0;
    t < this.obstacleNeighbors.length;
++ t) {
      for(var i = this.obstacleNeighbors[t].Value, l = i.next, c = s.default.subtract(i.point, this.position), u = s.default.subtract(l.point, this.position), d = ! 1, h = 0;
      h < this.orcaLines.length;
++ h) if(o.default.det(s.default.subtract(s.default.multiply2(e, c), this.orcaLines[h].point), this.orcaLines[h].direction)- e* this.radius >= - o.default.RVO_EPSILON&& o.default.det(s.default.subtract(s.default.multiply2(e, u), this.orcaLines[h].point), this.orcaLines[h].direction)- e* this.radius >= - o.default.RVO_EPSILON) {
        d = ! 0;
        break;
      }
      if(! d) {
        var p = o.default.absSq(c),
        _ = o.default.absSq(u),
        f = o.default.sqr(this.radius),
        g = s.default.subtract(l.point, i.point),
        m = s.default.multiply(s.default.multiply2(- 1, c), g)/ o.default.absSq(g),
        y = o.default.absSq(s.default.subtract(s.default.multiply2(- 1, c), s.default.multiply2(m, g))),
        v = new a.default();
        if(m < 0&& p <= f) {
          if(i.convex) {
            v.point = new s.default(0, 0);
            v.direction = o.default.normalize(new s.default(- c.y, c.x));
            this.orcaLines.push(v);
          }
        } else if(m > 1&& _ <= f) {
          if(l.convex&& o.default.det(u, l.direction) >= 0) {
            v.point = new s.default(0, 0);
            v.direction = o.default.normalize(new s.default(- u.y, u.x));
            this.orcaLines.push(v);
          }
        } else if(m >= 0&& m < 1&& y <= f) {
          v.point = new s.default(0, 0);
          v.direction = s.default.multiply2(- 1, i.direction);
          this.orcaLines.push(v);
        } else {
          var b = void 0,
          w = void 0;
          if(m < 0&& y <= f) {
            if(! i.convex) continue;
            l = i;
            var k = o.default.sqrt(p- f);
            b = s.default.division(new s.default(c.x* k- c.y* this.radius, c.x* this.radius+ c.y* k), p);
            w = s.default.division(new s.default(c.x* k+ c.y* this.radius, - c.x* this.radius+ c.y* k), p);
          } else if(m > 1&& y <= f) {
            if(! l.convex) continue;
            i = l;
            var S = o.default.sqrt(_- f);
            b = s.default.division(new s.default(u.x* S- u.y* this.radius, u.x* this.radius+ u.y* S), _);
            w = s.default.division(new s.default(u.x* S+ u.y* this.radius, - u.x* this.radius+ u.y* S), _);
          } else {
            if(i.convex) {
              k = o.default.sqrt(p- f);
              b = s.default.division(new s.default(c.x* k- c.y* this.radius, c.x* this.radius+ c.y* k), p);
            } else b = s.default.multiply2(- 1, i.direction);
            if(l.convex) {
              S = o.default.sqrt(_- f);
              w = s.default.division(new s.default(u.x* S- u.y* this.radius, u.x* this.radius+ u.y* S), _);
            } else w = s.default.multiply2(- 1, i.direction);
          }
          var C = i.previous,
          T = ! 1,
          N = ! 1;
          if(i.convex&& o.default.det(b, s.default.multiply2(- 1, C.direction)) >= 0) {
            b = s.default.multiply2(- 1, C.direction);
            T = ! 0;
          }
          if(l.convex&& o.default.det(w, s.default.multiply2(- 1, l.direction)) <= 0) {
            w = l.direction;
            N = ! 0;
          }
          var I = s.default.multiply2(e, s.default.subtract(i.point, this.position)),
          A = s.default.multiply2(e, s.default.subtract(l.point, this.position)),
          R = s.default.subtract(A, I),
          P = i == l?.5: s.default.multiply(s.default.subtract(this.velocity, I), R)/ o.default.absSq(R),
          E = s.default.multiply(s.default.subtract(this.velocity, I), b),
          M = s.default.multiply(s.default.subtract(this.velocity, A), w);
          if(P < 0&& E < 0|| i == l&& E < 0&& M < 0) {
            var L = o.default.normalize(s.default.subtract(this.velocity, I));
            v.direction = new s.default(L.y, - L.x);
            v.point = s.default.addition(I, s.default.multiply2(this.radius* e, L));
            this.orcaLines.push(v);
          } else if(P > 1&& M < 0) {
            L = o.default.normalize(s.default.subtract(this.velocity, A));
            v.direction = new s.default(L.y, - L.x);
            v.point = s.default.addition(A, s.default.multiply2(this.radius* e, L));
            this.orcaLines.push(v);
          } else {
            var D = P < 0|| P > 1|| i == l? o.default.RVO_POSITIVEINFINITY: o.default.absSq(s.default.subtract(this.velocity, s.default.addition(I, s.default.multiply2(P, R)))),
            x = E < 0? o.default.RVO_POSITIVEINFINITY: o.default.absSq(s.default.subtract(this.velocity, s.default.addition(I, s.default.multiply2(E, b)))),
            O = M < 0? o.default.RVO_POSITIVEINFINITY: o.default.absSq(s.default.subtract(this.velocity, s.default.addition(A, s.default.multiply2(M, w))));
            if(D <= x&& D <= O) {
              v.direction = s.default.multiply2(- 1, i.direction);
              v.point = s.default.addition(I, s.default.multiply2(this.radius* e, new s.default(- v.direction.y, v.direction.x)));
              this.orcaLines.push(v);
            } else if(x <= O) {
              if(T) continue;
              v.direction = b;
              v.point = s.default.addition(I, s.default.multiply2(this.radius* e, new s.default(- v.direction.y, v.direction.x)));
              this.orcaLines.push(v);
            } else if(! N) {
              v.direction = s.default.multiply2(- 1, w);
              v.point = s.default.addition(A, s.default.multiply2(this.radius* e, new s.default(- v.direction.y, v.direction.x)));
              this.orcaLines.push(v);
            }
          }
        }
      }
    }
    var B = this.orcaLines.length,
    F = 1/ this.timeHorizon;
    for(t = 0;
    t < this.agentNeighbors.length;
++ t) {
      var U = this.agentNeighbors[t].Value;
      if(U) {
        var V = this.mass/(this.mass+ U.mass),
        G = U.mass/(this.mass+ U.mass),
        H = V >= .5? this.velocity.minus(this.velocity.scale(V)).scale(2): this.prefVelocity.add(this.velocity.minus(this.prefVelocity).scale(2* V)),
        z = G >= .5? U.velocity.scale(2).scale(1- G): U.prefVelocity.add(U.velocity.minus(U.prefVelocity).scale(2* G)),
        j = s.default.subtract(U.position, this.position),
        q = s.default.subtract(H, z),
        W = o.default.absSq(j),
        J = this.radius+ U.radius,
        K = o.default.sqr(J);
        v = new a.default();
        var Y = new s.default();
        if(W > K) {
          var X = s.default.subtract(q, s.default.multiply2(F, j)),
          Q = o.default.absSq(X),
          $ = s.default.multiply(X, j);
          if($ < 0&& o.default.sqr($) > K* Q) {
            var Z = o.default.sqrt(Q);
            L = s.default.division(X, Z);
            v.direction = new s.default(L.y, - L.x);
            Y = s.default.multiply2(J* F- Z, L);
          } else {
            var ee = o.default.sqrt(W- K);
            o.default.det(j, X) > 0? v.direction = s.default.division(new s.default(j.x* ee- j.y* J, j.x* J+ j.y* ee), W): v.direction = s.default.division(new s.default(j.x* ee+ j.y* J, - j.x* J+ j.y* ee), - W);
            var te = s.default.multiply(q, v.direction);
            Y = s.default.subtract(s.default.multiply2(te, v.direction), q);
          }
        } else {
          var ie = 1/ r.default.Instance.timeStep;
          X = s.default.subtract(q, s.default.multiply2(ie, j));
          Z = o.default.abs(X);
          L = s.default.division(X, Z);
          v.direction = new s.default(L.y, - L.x);
          Y = s.default.multiply2(J* ie- Z, L);
        }
        v.point = H.add(Y.scale(V));
        this.orcaLines[this.orcaLines.length] = v;
      }
    }
    var ne = new n.ObserverObj(new s.default(this.newVelocity.x, this.newVelocity.y)),
    ae = this.linearProgram2(this.orcaLines, this.maxSpeed, this.prefVelocity, ! 1, ne);
    ae < this.orcaLines.length&& this.linearProgram3(this.orcaLines, B, ae, this.maxSpeed, ne);
    this.newVelocity = ne.value;
  }
;
  e.prototype.linearProgram1 = function(e, t, i, n, a, r) {
    var l = s.default.multiply(e[t].point, e[t].direction),
    c = o.default.sqr(l)+ o.default.sqr(i)- o.default.absSq(e[t].point);
    if(c < 0) return ! 1;
    for(var u = o.default.sqrt(c), d = - l- u, h = - l+ u, p = 0;
    p < t;
++ p) {
      var _ = o.default.det(e[t].direction, e[p].direction),
      f = o.default.det(e[p].direction, s.default.subtract(e[t].point, e[p].point));
      if(o.default.fabs(_) <= o.default.RVO_EPSILON) {
        if(f < 0) return ! 1;
      } else {
        var g = f/ _;
        _ > 0? h = Math.min(h, g): d = Math.max(d, g);
        if(d > h) return ! 1;
      }
    }
    if(a) s.default.multiply(n, e[t].direction) > 0? r.value = s.default.addition(e[t].point, s.default.multiply2(h, e[t].direction)): r.value = s.default.addition(e[t].point, s.default.multiply2(d, e[t].direction));
    else {
      g = s.default.multiply(e[t].direction, s.default.subtract(n, e[t].point));
      r.value = g < d? s.default.addition(e[t].point, s.default.multiply2(d, e[t].direction)): g > h? s.default.addition(e[t].point, s.default.multiply2(h, e[t].direction)): s.default.addition(e[t].point, s.default.multiply2(g, e[t].direction));
    }
    return ! 0;
  }
;
  e.prototype.linearProgram2 = function(e, t, i, n, a) {
    n? a.value = s.default.multiply2(t, i): o.default.absSq(i) > o.default.sqr(t)? a.value = s.default.multiply2(t, o.default.normalize(i)): a.value = i;
    for(var r = 0;
    r < e.length;
++ r) if(o.default.det(e[r].direction, s.default.subtract(e[r].point, a.value)) > 0) {
      var l = new s.default(a.value.x, a.value.y);
      if(! this.linearProgram1(e, r, t, i, n, a)) {
        a.value = l;
        return r;
      }
    }
    return e.length;
  }
;
  e.prototype.linearProgram3 = function(e, t, i, n, r) {
    for(var l = 0, c = i;
    c < e.length;
++ c) if(o.default.det(e[c].direction, s.default.subtract(e[c].point, r.value)) > l) {
      for(var u = [], d = 0;
      d < t;
++ d) u[u.length] = e[d];
      for(var h = t;
      h < c;
++ h) {
        var p = new a.default(),
        _ = o.default.det(e[c].direction, e[h].direction);
        if(o.default.fabs(_) <= o.default.RVO_EPSILON) {
          if(s.default.multiply(e[c].direction, e[h].direction) > 0) continue;
          p.point = s.default.multiply2(.5, s.default.addition(e[c].point, e[h].point));
        } else p.point = s.default.addition(e[c].point, s.default.multiply2(o.default.det(e[h].direction, s.default.subtract(e[c].point, e[h].point))/ _, e[c].direction));
        p.direction = o.default.normalize(s.default.subtract(e[h].direction, e[c].direction));
        u[u.length] = p;
      }
      var f = new s.default(r.value.x, r.value.y);
      this.linearProgram2(u, n, new s.default(- e[c].direction.y, e[c].direction.x), ! 0, r) < u.length&& (r.value = f);
      l = o.default.det(e[c].direction, s.default.subtract(e[c].point, r.value));
    }
  }
;
  return e;
}
();
i.default = l;
cc._RF.pop();
