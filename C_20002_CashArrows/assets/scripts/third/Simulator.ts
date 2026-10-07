import Agent from "./Agent";
import KdTree from "./KdTree";
import Obstacle from "./Obstacle";
import RVOMath from "./RVOMath";
import { SMap } from "./SMap";
import Vector2 from "./Vector2";

export class AgentCfg {
    speedFactor: number = 1;
    neighborDist: number;
    maxNeighbors: number;
    timeHorizon: number;
    timeHorizonObst: number;
    radius: number;
    maxSpeed: number;
    velocity: Vector2;
    mass: number;

    constructor(
        neighborDist?: number,
        maxNeighbors?: number,
        timeHorizon?: number,
        timeHorizonObst?: number,
        radius?: number,
        maxSpeed?: number,
        velocity?: Vector2,
        mass?: number
    ) {
        if (neighborDist != null) {
            this.neighborDist = neighborDist;
        }
        if (maxNeighbors != null) {
            this.maxNeighbors = maxNeighbors;
        }
        if (timeHorizon != null) {
            this.timeHorizon = timeHorizon;
        }
        if (timeHorizonObst != null) {
            this.timeHorizonObst = timeHorizonObst;
        }
        if (radius != null) {
            this.radius = radius;
        }
        if (maxSpeed != null) {
            this.maxSpeed = maxSpeed;
        }
        if (velocity != null) {
            this.velocity = velocity;
        }
        if (mass != null) {
            this.mass = mass;
        }
    }

    copyFromAgent(agent: Agent): void {
        this.neighborDist = agent.neighborDist;
        this.maxNeighbors = agent.maxNeighbors;
        this.timeHorizon = agent.timeHorizon;
        this.timeHorizonObst = agent.timeHorizonObst;
        this.radius = agent.radius;
        this.maxSpeed = agent.maxSpeed;
        this.velocity = agent.velocity;
        this.mass = agent.mass;
    }
}

export default class Simulator {
    static totalID: number = 0;
    static _instance: Simulator = null;

    agentMap: SMap = new SMap();
    obstacles: any[] = [];
    change: boolean = false;
    kdTree: KdTree = null;
    globalTime: number = 0;
    timeStep: number = 0.1;

    static get Instance(): Simulator {
        if (!Simulator._instance) {
            Simulator._instance = new Simulator();
        }
        return Simulator._instance;
    }

    constructor() {
        this.init();
    }

    init(): void {
        this.kdTree = new KdTree();
        this.obstacles = [];
        this.globalTime = 0;
        this.timeStep = 0.1;
    }

    clear(): void {
        this.agentMap.clear();
        this.change = false;
        this.kdTree = new KdTree();
        this.obstacles.length = 0;
        this.globalTime = 0;
        this.timeStep = 0.1;
    }

    doStep(): number {
        this.kdTree.buildAgentTree(this.change);
        this.change = false;
        this.agentMap.values().forEach((agent: Agent) => {
            if (agent.calc) {
                agent.computeNeighbors();
                agent.computeNewVelocity();
                agent.update();
            }
        });
        this.globalTime += this.timeStep;
        return this.globalTime;
    }

    addAgent(position: Vector2, cfg: AgentCfg): number {
        const agent = new Agent();
        agent.id = Simulator.totalID;
        Simulator.totalID++;
        agent.maxNeighbors = cfg.maxNeighbors;
        agent.maxSpeed = cfg.maxSpeed;
        agent.neighborDist = cfg.neighborDist;
        agent.position = position;
        agent.radius = cfg.radius;
        agent.timeHorizon = cfg.timeHorizon;
        agent.timeHorizonObst = cfg.timeHorizonObst;
        agent.velocity = cfg.velocity;
        agent.mass = cfg.mass;
        this.agentMap.set(agent.id, agent);
        this.change = true;
        return agent.id;
    }

    removeAgent(id: number): void {
        if (this.agentMap.has(id)) {
            this.agentMap.delete(id);
            this.change = true;
        }
    }

    getAgent(id: number): Agent {
        return this.agentMap.get(id);
    }

    addObstacle(points: Vector2[]): number {
        if (points.length < 2) {
            return -1;
        }
        const startIndex = this.obstacles.length;
        for (let i = 0; i < points.length; ++i) {
            const obstacle: any = new Obstacle();
            obstacle.point = points[i];
            if (i !== 0) {
                obstacle.previous = this.obstacles[this.obstacles.length - 1];
                obstacle.previous.next = obstacle;
            }
            if (i === points.length - 1) {
                obstacle.next = this.obstacles[startIndex];
                obstacle.next.previous = obstacle;
            }
            obstacle.direction = RVOMath.normalize(
                Vector2.subtract(points[i === points.length - 1 ? 0 : i + 1], points[i])
            );
            if (points.length === 2) {
                obstacle.convex = true;
            } else {
                obstacle.convex = RVOMath.leftOf(
                    points[i === 0 ? points.length - 1 : i - 1],
                    points[i],
                    points[i === points.length - 1 ? 0 : i + 1]
                ) >= 0;
            }
            obstacle.id = this.obstacles.length;
            this.obstacles.push(obstacle);
        }
        return startIndex;
    }

    getAgentPosition(id: number): Vector2 {
        const agent = this.agentMap.get(id);
        return agent ? agent.position : new Vector2(0, 0);
    }

    getAgentPrefVelocity(id: number): Vector2 {
        const agent = this.agentMap.get(id);
        if (agent) {
            return agent.prefVelocity;
        }
        return undefined;
    }

    setTimeStep(timeStep: number): void {
        this.timeStep = timeStep;
    }

    processObstacles(): void {
        this.kdTree.buildObstacleTree();
    }

    setAgentPrefVelocity(id: number, velocity: Vector2): void {
        const agent = this.agentMap.get(id);
        if (agent) {
            agent.prefVelocity = velocity;
        }
    }
}
