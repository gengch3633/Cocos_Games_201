import Agent from "./Agent";
import KdTree from "./KdTree";
import Obstacle from "./Obstacle";
import RVOMath from "./RVOMath";
import { SMap } from "./SMap";
import Vector2 from "./Vector2";

export class AgentCfg {
    public neighborDist!: number;
    public maxNeighbors!: number;
    public timeHorizon!: number;
    public timeHorizonObst!: number;
    public radius!: number;
    public maxSpeed!: number;
    public velocity!: Vector2;
    public mass!: number;
    public speedFactor: number = 1;

    public constructor(
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

    public copyFromAgent(agent: Agent): void {
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
    private static _instance: Simulator;

    public static get Instance(): Simulator {
        if (!Simulator._instance) {
            Simulator._instance = new Simulator();
        }
        return Simulator._instance;
    }

    public static totalID = 0;

    private agentMap: SMap<number, Agent>;
    private obstacles: Obstacle[];
    private change: boolean;
    private kdTree!: KdTree;
    private globalTime!: number;
    private timeStep!: number;

    public constructor() {
        this.agentMap = new SMap<number, Agent>();
        this.obstacles = [];
        this.change = false;
        this.init();
    }

    public init(): void {
        this.kdTree = new KdTree();
        this.obstacles = [];
        this.globalTime = 0;
        this.timeStep = 0.1;
    }

    public clear(): void {
        this.agentMap.clear();
        this.change = false;
        this.kdTree = new KdTree();
        this.obstacles.length = 0;
        this.globalTime = 0;
        this.timeStep = 0.1;
    }

    public doStep(): number {
        this.kdTree.buildAgentTree(this.change);
        this.change = false;

        this.agentMap.values().forEach((agent) => {
            if (agent.calc) {
                agent.computeNeighbors();
                agent.computeNewVelocity();
                agent.update();
            }
        });

        this.globalTime += this.timeStep;
        return this.globalTime;
    }

    public addAgent(position: Vector2, cfg: AgentCfg): number {
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

    public removeAgent(agentId: number): void {
        if (this.agentMap.has(agentId)) {
            this.agentMap.delete(agentId);
            this.change = true;
        }
    }

    public getAgent(agentId: number): Agent | undefined {
        return this.agentMap.get(agentId);
    }

    public addObstacle(vertices: Vector2[]): number {
        if (vertices.length < 2) {
            return -1;
        }

        const obstacleStart = this.obstacles.length;

        for (let i = 0; i < vertices.length; ++i) {
            const obstacle = new Obstacle();
            obstacle.point = vertices[i];

            if (i !== 0) {
                obstacle.previous = this.obstacles[this.obstacles.length - 1];
                obstacle.previous.next = obstacle;
            }

            if (i === vertices.length - 1) {
                obstacle.next = this.obstacles[obstacleStart];
                obstacle.next.previous = obstacle;
            }

            obstacle.direction = RVOMath.normalize(
                Vector2.subtract(vertices[i === vertices.length - 1 ? 0 : i + 1], vertices[i])
            );

            if (vertices.length === 2) {
                obstacle.convex = true;
            } else {
                obstacle.convex =
                    RVOMath.leftOf(
                        vertices[i === 0 ? vertices.length - 1 : i - 1],
                        vertices[i],
                        vertices[i === vertices.length - 1 ? 0 : i + 1]
                    ) >= 0;
            }

            obstacle.id = this.obstacles.length;
            this.obstacles.push(obstacle);
        }

        return obstacleStart;
    }

    public getAgentPosition(agentId: number): Vector2 {
        const agent = this.agentMap.get(agentId);
        return agent ? agent.position : new Vector2(0, 0);
    }

    public getAgentPrefVelocity(agentId: number): Vector2 | undefined {
        const agent = this.agentMap.get(agentId);
        if (agent) {
            return agent.prefVelocity;
        }
        return undefined;
    }

    public setTimeStep(timeStep: number): void {
        this.timeStep = timeStep;
    }

    public processObstacles(): void {
        this.kdTree.buildObstacleTree();
    }

    public setAgentPrefVelocity(agentId: number, prefVelocity: Vector2): void {
        const agent = this.agentMap.get(agentId);
        if (agent) {
            agent.prefVelocity = prefVelocity;
        }
    }
}