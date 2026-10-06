// @ts-nocheck
import Agent from "./Agent";
import KdTree from "./KdTree";
import Obstacle from "./Obstacle";
import RVOMath from "./RVOMath";
import { SMap } from "./SMap";
import Vector2 from "./Vector2";

var n = SMap, a = Agent, o = KdTree, r = Obstacle, s = RVOMath, l = Vector2, c = function() {
function e() {
this.agentMap = new n();
this.obstacles = [];
this.change = !1;
this.init();
}
Object.defineProperty(e, "Instance", {
get: function() {
e._instance || (e._instance = new e());
return e._instance;
},
enumerable: !1,
configurable: !0
});
e.prototype.init = function() {
this.kdTree = new o.default();
this.obstacles = [];
this.globalTime = 0;
this.timeStep = .1;
};
e.prototype.clear = function() {
this.agentMap.clear();
this.change = !1;
this.kdTree = new o.default();
this.obstacles.length = 0;
this.globalTime = 0;
this.timeStep = .1;
};
e.prototype.doStep = function() {
this.kdTree.buildAgentTree(this.change);
this.change = !1;
this.agentMap.values().forEach(function(e) {
if (e.calc) {
e.computeNeighbors();
e.computeNewVelocity();
e.update();
}
});
this.globalTime += this.timeStep;
return this.globalTime;
};
e.prototype.addAgent = function(t, i) {
var n = new a.default();
n.id = e.totalID;
e.totalID++;
n.maxNeighbors = i.maxNeighbors;
n.maxSpeed = i.maxSpeed;
n.neighborDist = i.neighborDist;
n.position = t;
n.radius = i.radius;
n.timeHorizon = i.timeHorizon;
n.timeHorizonObst = i.timeHorizonObst;
n.velocity = i.velocity;
n.mass = i.mass;
this.agentMap.set(n.id, n);
this.change = !0;
return n.id;
};
e.prototype.removeAgent = function(e) {
if (this.agentMap.has(e)) {
this.agentMap.delete(e);
this.change = !0;
}
};
e.prototype.getAgent = function(e) {
return this.agentMap.get(e);
};
e.prototype.addObstacle = function(e) {
if (e.length < 2) return -1;
for (var t = this.obstacles.length, i = 0; i < e.length; ++i) {
var n = new r.default();
n.point = e[i];
if (0 != i) {
n.previous = this.obstacles[this.obstacles.length - 1];
n.previous.next = n;
}
if (i == e.length - 1) {
n.next = this.obstacles[t];
n.next.previous = n;
}
n.direction = s.default.normalize(l.default.subtract(e[i == e.length - 1 ? 0 : i + 1], e[i]));
2 == e.length ? n.convex = !0 : n.convex = s.default.leftOf(e[0 == i ? e.length - 1 : i - 1], e[i], e[i == e.length - 1 ? 0 : i + 1]) >= 0;
n.id = this.obstacles.length;
this.obstacles.push(n);
}
return t;
};
e.prototype.getAgentPosition = function(e) {
var t = this.agentMap.get(e);
return t ? t.position : new l.default(0, 0);
};
e.prototype.getAgentPrefVelocity = function(e) {
var t = this.agentMap.get(e);
if (t) return t.prefVelocity;
};
e.prototype.setTimeStep = function(e) {
this.timeStep = e;
};
e.prototype.processObstacles = function() {
this.kdTree.buildObstacleTree();
};
e.prototype.setAgentPrefVelocity = function(e, t) {
var i = this.agentMap.get(e);
i && (i.prefVelocity = t);
};
e.totalID = 0;
return e;
}();
export default  c;
var u = function() {
function e(e, t, i, n, a, o, r, s) {
this.speedFactor = 1;
null != e && (this.neighborDist = e);
null != t && (this.maxNeighbors = t);
null != i && (this.timeHorizon = i);
null != n && (this.timeHorizonObst = n);
null != a && (this.radius = a);
null != o && (this.maxSpeed = o);
null != r && (this.velocity = r);
null != s && (this.mass = s);
}
e.prototype.copyFromAgent = function(e) {
var t = this;
t.neighborDist = e.neighborDist;
t.maxNeighbors = e.maxNeighbors;
t.timeHorizon = e.timeHorizon;
t.timeHorizonObst = e.timeHorizonObst;
t.radius = e.radius;
t.maxSpeed = e.maxSpeed;
t.velocity = e.velocity;
t.mass = e.mass;
};
return e;
}();
export const AgentCfg = u;
