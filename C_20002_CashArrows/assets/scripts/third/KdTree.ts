import Obstacle from "./Obstacle";
import RVOMath from "./RVOMath";
import Simulator from "./Simulator";
import Vector2 from "./Vector2";

class ObstacleTreeNode {
    obstacle: any;
    left: any;
    right: any;
}

class AgentTreeNode {
    begin: number;
    end: number;
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
    left: number;
    right: number;
}

class FloatPair {
    a: number;
    b: number;

    constructor(e: number, t: number) {
        this.a = e;
        this.b = t;
    }

    static lessthan(e: FloatPair, t: FloatPair) {
        return e.a < t.a || !(t.a < e.a) && e.b < t.b;
    }

    static lessthanOrEqual(t: FloatPair, i: FloatPair) {
        return t.a == i.a && t.b == i.b || FloatPair.lessthan(t, i);
    }

    static morethan(t: FloatPair, i: FloatPair) {
        return !FloatPair.lessthanOrEqual(t, i);
    }

    static morethanOrEqual(t: FloatPair, i: FloatPair) {
        return !FloatPair.lessthan(t, i);
    }
}

export default class KdTree {
    agents: any[];
    agentTree: AgentTreeNode[];
    obstacleTree_: ObstacleTreeNode;
    MAX_LEAF_SIZE: number;

    constructor() {
        this.agents = [];
        this.agentTree = [];
        this.MAX_LEAF_SIZE = 100;
    }

    buildAgentTree(e: boolean) {
        if (null == this.agents || e) {
            this.agents = Array.from(Simulator.Instance.agentMap.values());
            this.agentTree = new Array(2 * this.agents.length).fill(null).map(function () {
                return new AgentTreeNode();
            });
        }
        0 != this.agents.length && this.buildAgentTreeRecursive(0, this.agents.length, 0);
    }

    buildAgentTreeRecursive(e: number, t: number, i: number) {
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
                for (; r < s && (a ? this.agents[r].position.x : this.agents[r].position.y) < o; ) ++r;
                for (; s > r && (a ? this.agents[s - 1].position.x : this.agents[s - 1].position.y) >= o; ) --s;
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
    }

    buildObstacleTree() {
        this.obstacleTree_ = new ObstacleTreeNode();
        for (var e = Simulator.Instance.obstacles.length, t = [], i = 0; i < e; ++i) t[t.length] = Simulator.Instance.obstacles[i];
        this.obstacleTree_ = this.buildObstacleTreeRecursive(t);
    }

    buildObstacleTreeRecursive(e: any[]) {
        if (e && 0 != e.length) {
            var I: any, m: any, y: any, v: any;
            for (var t = new ObstacleTreeNode(), i = 0, l = e.length, u = e.length, d = 0, g = 0; d < e.length; ++d) {
                for (var h = 0, p = 0, _ = e[d], f = _.next, g = 0; g < e.length; ++g) if (d != g) {
                    m = (I = e[g]).next, y = RVOMath.leftOf(_.point, f.point, I.point), v = RVOMath.leftOf(_.point, f.point, m.point);
                    if (y >= -RVOMath.RVO_EPSILON && v >= -RVOMath.RVO_EPSILON) ++h; else if (y <= RVOMath.RVO_EPSILON && v <= RVOMath.RVO_EPSILON) ++p; else {
                        ++h;
                        ++p;
                    }
                    if (FloatPair.morethanOrEqual(new FloatPair(Math.max(h, p), Math.min(h, p)), new FloatPair(Math.max(l, u), Math.min(l, u)))) break;
                }
                if (FloatPair.lessthan(new FloatPair(Math.max(h, p), Math.min(h, p)), new FloatPair(Math.max(l, u), Math.min(l, u)))) {
                    l = h;
                    u = p;
                    i = d;
                }
            }
            var b = new Array(l), w = new Array(u), k = 0, S = 0, C = i, T = e[C], N = T.next;
            for (g = 0; g < e.length; ++g) if (C != g) {
                m = (I = e[g]).next;
                y = RVOMath.leftOf(T.point, N.point, I.point);
                v = RVOMath.leftOf(T.point, N.point, m.point);
                if (y >= -RVOMath.RVO_EPSILON && v >= -RVOMath.RVO_EPSILON) b[k++] = e[g]; else if (y <= RVOMath.RVO_EPSILON && v <= RVOMath.RVO_EPSILON) w[S++] = e[g]; else {
                    var A = RVOMath.det(Vector2.subtract(N.point, T.point), Vector2.subtract(I.point, T.point)) / RVOMath.det(Vector2.subtract(N.point, T.point), Vector2.subtract(I.point, m.point)), R = Vector2.addition(I.point, Vector2.multiply2(A, Vector2.subtract(m.point, I.point))), P = new Obstacle();
                    P.point = R;
                    P.previous = I;
                    P.next = m;
                    P.convex = true;
                    P.direction = I.direction;
                    P.id = Simulator.Instance.obstacles.length;
                    Simulator.Instance.obstacles.push(P);
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
    }

    computeObstacleNeighbors(e: any, t: number) {
        this.queryObstacleTreeRecursive(e, t, this.obstacleTree_);
    }

    queryObstacleTreeRecursive(e: any, t: number, i: ObstacleTreeNode) {
        if (e && i) {
            var n = i.obstacle, o = n.next, s = RVOMath.leftOf(n.point, o.point, e.position);
            this.queryObstacleTreeRecursive(e, t, s >= 0 ? i.left : i.right);
            if (RVOMath.sqr(s) / RVOMath.absSq(Vector2.subtract(o.point, n.point)) < t) {
                s < 0 && e.insertObstacleNeighbor(i.obstacle, t);
                this.queryObstacleTreeRecursive(e, t, s >= 0 ? i.right : i.left);
            }
        }
    }

    computeAgentNeighbors(e: any, t: any) {
        this.queryAgentTreeRecursive(e, t, 0);
    }

    queryAgentTreeRecursive(e: any, t: any, i: number) {
        var n = this.agentTree[i];
        if (n.end - n.begin <= this.MAX_LEAF_SIZE) for (var a = n.begin; a < n.end; ++a) e.insertAgentNeighbor(this.agents[a], t); else {
            var o = this.calculateDistanceSquared(this.agentTree[n.left], e), r = this.calculateDistanceSquared(this.agentTree[n.right], e);
            o < r ? o < t.value && (this.queryAgentTreeRecursive(e, t, n.left), r < t.value && this.queryAgentTreeRecursive(e, t, n.right)) : r < t.value && (this.queryAgentTreeRecursive(e, t, n.right),
                o < t.value && this.queryAgentTreeRecursive(e, t, n.left));
        }
    }

    calculateDistanceSquared(e: AgentTreeNode, t: any) {
        var i = Math.max(0, e.minX - t.position.x) + Math.max(0, t.position.x - e.maxX), n = Math.max(0, e.minY - t.position.y) + Math.max(0, t.position.y - e.maxY);
        return RVOMath.sqr(i) + RVOMath.sqr(n);
    }
}
