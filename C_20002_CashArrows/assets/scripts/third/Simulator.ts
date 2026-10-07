import Agent from "./Agent";
import KdTree from "./KdTree";
import Obstacle from "./Obstacle";
import RVOMath from "./RVOMath";
import { SMap } from "./SMap";
import Vector2 from "./Vector2";

export class AgentCfg {
    neighborDist?: number;
    maxNeighbors?: number;
    timeHorizon?: number;
    timeHorizonObst?: number;
    radius?: number;
    maxSpeed?: number;
    velocity?: Vector2;
    mass?: number;
    speedFactor = 1;

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
    static totalID = 0;
    static _instance: Simulator | null = null;

    agentMap = new SMap();
    obstacles: Obstacle[] = [];
    change = false;
    kdTree!: KdTree;
    globalTime = 0;
    timeStep = 0.1;

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

    addAgent(position: Vector2, config: AgentCfg): number {
        const agent = new Agent();
        agent.id = Simulator.totalID;
        Simulator.totalID++;
        agent.maxNeighbors = config.maxNeighbors!;
        agent.maxSpeed = config.maxSpeed!;
        agent.neighborDist = config.neighborDist!;
        agent.position = position;
        agent.radius = config.radius!;
        agent.timeHorizon = config.timeHorizon!;
        agent.timeHorizonObst = config.timeHorizonObst!;
        agent.velocity = config.velocity!;
        agent.mass = config.mass!;
        this.agentMap.set(agent.id, agent);
        this.change = true;
        return agent.id;
    }

    removeAgent(agentId: number): void {
        if (this.agentMap.has(agentId)) {
            this.agentMap.delete(agentId);
            this.change = true;
        }
    }

    getAgent(agentId: number): Agent | undefined {
        return this.agentMap.get(agentId);
    }

    addObstacle(points: Vector2[]): number {
        if (points.length < 2) {
            return -1;
        }
        const startIndex = this.obstacles.length;
        for (let i = 0; i < points.length; ++i) {
            const obstacle = new Obstacle();
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
            obstacle.convex =
                points.length === 2
                    ? true
                    : RVOMath.leftOf(points[i === 0 ? points.length - 1 : i - 1], points[i], points[i === points.length - 1 ? 0 : i + 1]) >= 0;
            obstacle.id = this.obstacles.length;
            this.obstacles.push(obstacle);
        }
        return startIndex;
    }

    getAgentPosition(agentId: number): Vector2 {
        const agent = this.agentMap.get(agentId);
        return agent ? agent.position : new Vector2(0, 0);
    }

    getAgentPrefVelocity(agentId: number): Vector2 | undefined {
        const agent = this.agentMap.get(agentId);
        if (agent) {
            return agent.prefVelocity;
        }
    }

    setTimeStep(timeStep: number): void {
        this.timeStep = timeStep;
    }

    processObstacles(): void {
        this.kdTree.buildObstacleTree();
    }

    setAgentPrefVelocity(agentId: number, velocity: Vector2): void {
        const agent = this.agentMap.get(agentId);
        if (agent) {
            agent.prefVelocity = velocity;
        }
    }
}
