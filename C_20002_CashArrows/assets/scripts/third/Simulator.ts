import { SMap } from "./SMap";
import Agent from "./Agent";
import KdTree from "./KdTree";
import Obstacle from "./Obstacle";
import RVOMath from "./RVOMath";
import Vector2 from "./Vector2";

export default class Simulator {
    static _instance: Simulator;
    static totalID = 0;

    agentMap: any;
    obstacles: any[];
    change: boolean;
    kdTree: any;
    globalTime: number;
    timeStep: number;

    constructor() {
        this.agentMap = new SMap();
        this.obstacles = [];
        this.change = !1;
        this.init();
    }

    static get Instance() {
        Simulator._instance || (Simulator._instance = new Simulator());
        return Simulator._instance;
    }

    init() {
        this.kdTree = new KdTree();
        this.obstacles = [];
        this.globalTime = 0;
        this.timeStep = .1;
    }

    clear() {
        this.agentMap.clear();
        this.change = !1;
        this.kdTree = new KdTree();
        this.obstacles.length = 0;
        this.globalTime = 0;
        this.timeStep = .1;
    }

    doStep() {
        this.kdTree.buildAgentTree(this.change);
        this.change = !1;
        this.agentMap.values().forEach(function (e: any) {
            if (e.calc) {
                e.computeNeighbors();
                e.computeNewVelocity();
                e.update();
            }
        });
        this.globalTime += this.timeStep;
        return this.globalTime;
    }

    addAgent(t: any, i: any) {
        var n = new Agent();
        n.id = Simulator.totalID;
        Simulator.totalID++;
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
    }

    removeAgent(e: any) {
        if (this.agentMap.has(e)) {
            this.agentMap.delete(e);
            this.change = !0;
        }
    }

    getAgent(e: any) {
        return this.agentMap.get(e);
    }

    addObstacle(e: any[]) {
        if (e.length < 2) return -1;
        for (var t = this.obstacles.length, i = 0; i < e.length; ++i) {
            var n = new Obstacle();
            n.point = e[i];
            if (0 != i) {
                n.previous = this.obstacles[this.obstacles.length - 1];
                n.previous.next = n;
            }
            if (i == e.length - 1) {
                n.next = this.obstacles[t];
                n.next.previous = n;
            }
            n.direction = RVOMath.normalize(Vector2.subtract(e[i == e.length - 1 ? 0 : i + 1], e[i]));
            2 == e.length ? n.convex = !0 : n.convex = RVOMath.leftOf(e[0 == i ? e.length - 1 : i - 1], e[i], e[i == e.length - 1 ? 0 : i + 1]) >= 0;
            n.id = this.obstacles.length;
            this.obstacles.push(n);
        }
        return t;
    }

    getAgentPosition(e: any) {
        var t = this.agentMap.get(e);
        return t ? t.position : new Vector2(0, 0);
    }

    getAgentPrefVelocity(e: any) {
        var t = this.agentMap.get(e);
        if (t) return t.prefVelocity;
    }

    setTimeStep(e: number) {
        this.timeStep = e;
    }

    processObstacles() {
        this.kdTree.buildObstacleTree();
    }

    setAgentPrefVelocity(e: any, t: any) {
        var i = this.agentMap.get(e);
        i && (i.prefVelocity = t);
    }
}

export class AgentCfg {
    speedFactor: number;
    neighborDist: any;
    maxNeighbors: any;
    timeHorizon: any;
    timeHorizonObst: any;
    radius: any;
    maxSpeed: any;
    velocity: any;
    mass: any;

    constructor(e?: any, t?: any, i?: any, n?: any, a?: any, o?: any, r?: any, s?: any) {
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

    copyFromAgent(e: any) {
        var t = this;
        t.neighborDist = e.neighborDist;
        t.maxNeighbors = e.maxNeighbors;
        t.timeHorizon = e.timeHorizon;
        t.timeHorizonObst = e.timeHorizonObst;
        t.radius = e.radius;
        t.maxSpeed = e.maxSpeed;
        t.velocity = e.velocity;
        t.mass = e.mass;
    }
}
