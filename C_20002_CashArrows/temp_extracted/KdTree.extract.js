KdTree: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "1e0a9Lq+KdGvZLxeLkBpzOB", "KdTree");
Object.defineProperty(i, "__esModule", {
value: !0
});
var n = e("Obstacle"), a = e("RVOMath"), o = e("Simulator"), r = e("Vector2"), s = function() {}, l = function() {}, c = function() {
function e(e, t) {
this.a = e;
this.b = t;
}
e.lessthan = function(e, t) {
return e.a < t.a || !(t.a < e.a) && e.b < t.b;
};
e.lessthanOrEqual = function(t, i) {
return t.a == i.a && t.b == i.b || e.lessthan(t, i);
};
e.morethan = function(t, i) {
return !e.lessthanOrEqual(t, i);
};
e.morethanOrEqual = function(t, i) {
return !e.lessthan(t, i);
};
return e;
}(), u = function() {
function e() {
this.agents = [];
this.agentTree = [];
this.MAX_LEAF_SIZE = 100;
}
e.prototype.buildAgentTree = function(e) {
if (null == this.agents || e) {
this.agents = Array.from(o.default.Instance.agentMap.values());
this.agentTree = new Array(2 * this.agents.length).fill(null).map(function() {
return new l();
});
}
0 != this.agents.length && this.buildAgentTreeRecursive(0, this.agents.length, 0);
};
e.prototype.buildAgentTreeRecursive = function(e, t, i) {
this.agentTree[i].begin = e;
this.agentTree[i].end = t;
this.agentTree[i].minX = this.agentTree[i].maxX = this.agents[e].position.x;
this.agentTree[i].minY = this.agentTree[i].maxY = this.agents[e].position.y;
for (var n = e + 1; n < t; ++n) {
this.agentTree[i].maxX = Math.max(this.agentTree[i].maxX, this.agents[n].position.x);
this.agentTree[i].minX = Math.min(this.agentTree[i].minX, this.agents[n].position.x);
this.agentTree[i].maxY = Math.max(this.agentTree[i].maxY, this.agents[n].position.y);
this.agentTree[i].minY = Math.min(this.agentTree[i].minY, this.agents[n].position.y);
}
if (t - e > this.MAX_LEAF_SIZE) {
for (var a = this.agentTree[i].maxX - this.agentTree[i].minX > this.agentTree[i].maxY - this.agentTree[i].minY, o = .5 * (a ? this.agentTree[i].maxX + this.agentTree[i].minX : this.agentTree[i].maxY + this.agentTree[i].minY), r = e, s = t; r < s; ) {
for (;r < s && (a ? this.agents[r].position.x : this.agents[r].position.y) < o; ) ++r;
for (;s > r && (a ? this.agents[s - 1].position.x : this.agents[s - 1].position.y) >= o; ) --s;
if (r < s) {
var l = this.agents[r];
this.agents[r] = this.agents[s - 1];
this.agents[s - 1] = l;
++r;
--s;
}
}
var c = r - e;
if (0 == c) {
++c;
++r;
++s;
}
this.agentTree[i].left = i + 1;
this.agentTree[i].right = i + 2 * c;
this.buildAgentTreeRecursive(e, r, this.agentTree[i].left);
this.buildAgentTreeRecursive(r, t, this.agentTree[i].right);
}
};
e.prototype.buildObstacleTree = function() {
this.obstacleTree_ = new s();
for (var e = o.default.Instance.obstacles.length, t = [], i = 0; i < e; ++i) t[t.length] = o.default.Instance.obstacles[i];
this.obstacleTree_ = this.buildObstacleTreeRecursive(t);
};
e.prototype.buildObstacleTreeRecursive = function(e) {
if (e && 0 != e.length) {
for (var t = new s(), i = 0, l = e.length, u = e.length, d = 0; d < e.length; ++d) {
for (var h = 0, p = 0, _ = e[d], f = _.next, g = 0; g < e.length; ++g) if (d != g) {
var m = (I = e[g]).next, y = a.default.leftOf(_.point, f.point, I.point), v = a.default.leftOf(_.point, f.point, m.point);
if (y >= -a.default.RVO_EPSILON && v >= -a.default.RVO_EPSILON) ++h; else if (y <= a.default.RVO_EPSILON && v <= a.default.RVO_EPSILON) ++p; else {
++h;
++p;
}
if (c.morethanOrEqual(new c(Math.max(h, p), Math.min(h, p)), new c(Math.max(l, u), Math.min(l, u)))) break;
}
if (c.lessthan(new c(Math.max(h, p), Math.min(h, p)), new c(Math.max(l, u), Math.min(l, u)))) {
l = h;
u = p;
i = d;
}
}
var b = new Array(l), w = new Array(u), k = 0, S = 0, C = i, T = e[C], N = T.next;
for (g = 0; g < e.length; ++g) if (C != g) {
var I;
m = (I = e[g]).next;
y = a.default.leftOf(T.point, N.point, I.point);
v = a.default.leftOf(T.point, N.point, m.point);
if (y >= -a.default.RVO_EPSILON && v >= -a.default.RVO_EPSILON) b[k++] = e[g]; else if (y <= a.default.RVO_EPSILON && v <= a.default.RVO_EPSILON) w[S++] = e[g]; else {
var A = a.default.det(r.default.subtract(N.point, T.point), r.default.subtract(I.point, T.point)) / a.default.det(r.default.subtract(N.point, T.point), r.default.subtract(I.point, m.point)), R = r.default.addition(I.point, r.default.multiply2(A, r.default.subtract(m.point, I.point))), P = new n.default();
P.point = R;
P.previous = I;
P.next = m;
P.convex = !0;
P.direction = I.direction;
P.id = o.default.Instance.obstacles.length;
o.default.Instance.obstacles.push(P);
I.next = P;
m.previous = P;
if (y > 0) {
b[k++] = I;
w[S++] = P;
} else {
w[S++] = I;
b[k++] = P;
}
}
}
t.obstacle = T;
t.left = this.buildObstacleTreeRecursive(b);
t.right = this.buildObstacleTreeRecursive(w);
return t;
}
};
e.prototype.computeObstacleNeighbors = function(e, t) {
this.queryObstacleTreeRecursive(e, t, this.obstacleTree_);
};
e.prototype.queryObstacleTreeRecursive = function(e, t, i) {
if (e && i) {
var n = i.obstacle, o = n.next, s = a.default.leftOf(n.point, o.point, e.position);
this.queryObstacleTreeRecursive(e, t, s >= 0 ? i.left : i.right);
if (a.default.sqr(s) / a.default.absSq(r.default.subtract(o.point, n.point)) < t) {
s < 0 && e.insertObstacleNeighbor(i.obstacle, t);
this.queryObstacleTreeRecursive(e, t, s >= 0 ? i.right : i.left);
}
}
};
e.prototype.computeAgentNeighbors = function(e, t) {
this.queryAgentTreeRecursive(e, t, 0);
};
e.prototype.queryAgentTreeRecursive = function(e, t, i) {
var n = this.agentTree[i];
if (n.end - n.begin <= this.MAX_LEAF_SIZE) for (var a = n.begin; a < n.end; ++a) e.insertAgentNeighbor(this.agents[a], t); else {
var o = this.calculateDistanceSquared(this.agentTree[n.left], e), r = this.calculateDistanceSquared(this.agentTree[n.right], e);
o < r ? o < t.value && (this.queryAgentTreeRecursive(e, t, n.left), r < t.value && this.queryAgentTreeRecursive(e, t, n.right)) : r < t.value && (this.queryAgentTreeRecursive(e, t, n.right), 
o < t.value && this.queryAgentTreeRecursive(e, t, n.left));
}
};
e.prototype.calculateDistanceSquared = function(e, t) {
var i = Math.max(0, e.minX - t.position.x) + Math.max(0, t.position.x - e.maxX), n = Math.max(0, e.minY - t.position.y) + Math.max(0, t.position.y - e.maxY);
return a.default.sqr(i) + a.default.sqr(n);
};
return e;
}();
i.default = u;
cc._RF.pop();
}