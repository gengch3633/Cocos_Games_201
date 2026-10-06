import Obstacle from "./Obstacle";
import RVOMath from "./RVOMath";
import Simulator from "./Simulator";
import Vector2 from "./Vector2";
import Agent from "./Agent";

class ObstacleTreeNode {
    obstacle: Obstacle | null = null;
    left: ObstacleTreeNode | null = null;
    right: ObstacleTreeNode | null = null;
}

class AgentTreeNode {
    begin = 0;
    end = 0;
    left = 0;
    right = 0;
    maxX = 0;
    minX = 0;
    maxY = 0;
    minY = 0;
}

class FloatPair {
    constructor(
        public a: number,
        public b: number
    ) {}

    static lessthan(left: FloatPair, right: FloatPair): boolean {
        return left.a < right.a || (!(right.a < left.a) && left.b < right.b);
    }

    static lessthanOrEqual(left: FloatPair, right: FloatPair): boolean {
        return (left.a === right.a && left.b === right.b) || FloatPair.lessthan(left, right);
    }

    static morethan(left: FloatPair, right: FloatPair): boolean {
        return !FloatPair.lessthanOrEqual(left, right);
    }

    static morethanOrEqual(left: FloatPair, right: FloatPair): boolean {
        return !FloatPair.lessthan(left, right);
    }
}

export default class KdTree {
    agents: Agent[] = [];
    agentTree: AgentTreeNode[] = [];
    obstacleTree_: ObstacleTreeNode | null = null;
    MAX_LEAF_SIZE = 100;

    buildAgentTree(rebuild?: boolean): void {
        if (this.agents == null || rebuild) {
            this.agents = Array.from(Simulator.Instance.agentMap.values());
            this.agentTree = new Array(2 * this.agents.length).fill(null).map(() => new AgentTreeNode());
        }
        if (this.agents.length !== 0) {
            this.buildAgentTreeRecursive(0, this.agents.length, 0);
        }
    }

    buildAgentTreeRecursive(begin: number, end: number, node: number): void {
        this.agentTree[node].begin = begin;
        this.agentTree[node].end = end;
        this.agentTree[node].minX = this.agentTree[node].maxX = this.agents[begin].position.x;
        this.agentTree[node].minY = this.agentTree[node].maxY = this.agents[begin].position.y;
        for (let i = begin + 1; i < end; ++i) {
            this.agentTree[node].maxX = Math.max(this.agentTree[node].maxX, this.agents[i].position.x);
            this.agentTree[node].minX = Math.min(this.agentTree[node].minX, this.agents[i].position.x);
            this.agentTree[node].maxY = Math.max(this.agentTree[node].maxY, this.agents[i].position.y);
            this.agentTree[node].minY = Math.min(this.agentTree[node].minY, this.agents[i].position.y);
        }
        if (end - begin > this.MAX_LEAF_SIZE) {
            const isVertical = this.agentTree[node].maxX - this.agentTree[node].minX > this.agentTree[node].maxY - this.agentTree[node].minY;
            const splitValue = 0.5 * (isVertical ? this.agentTree[node].maxX + this.agentTree[node].minX : this.agentTree[node].maxY + this.agentTree[node].minY);
            let left = begin;
            let right = end;
            while (left < right) {
                while (left < right && (isVertical ? this.agents[left].position.x : this.agents[left].position.y) < splitValue) {
                    ++left;
                }
                while (right > left && (isVertical ? this.agents[right - 1].position.x : this.agents[right - 1].position.y) >= splitValue) {
                    --right;
                }
                if (left < right) {
                    const temp = this.agents[left];
                    this.agents[left] = this.agents[right - 1];
                    this.agents[right - 1] = temp;
                    ++left;
                    --right;
                }
            }
            let leftSize = left - begin;
            if (leftSize === 0) {
                ++leftSize;
                ++left;
                ++right;
            }
            this.agentTree[node].left = node + 1;
            this.agentTree[node].right = node + 2 * leftSize;
            this.buildAgentTreeRecursive(begin, left, this.agentTree[node].left);
            this.buildAgentTreeRecursive(left, end, this.agentTree[node].right);
        }
    }

    buildObstacleTree(): void {
        this.obstacleTree_ = new ObstacleTreeNode();
        const count = Simulator.Instance.obstacles.length;
        const obstacles: Obstacle[] = [];
        for (let i = 0; i < count; ++i) {
            obstacles[i] = Simulator.Instance.obstacles[i];
        }
        this.obstacleTree_ = this.buildObstacleTreeRecursive(obstacles);
    }

    buildObstacleTreeRecursive(obstacles: Obstacle[]): ObstacleTreeNode | null {
        if (!obstacles || obstacles.length === 0) {
            return null;
        }
        const node = new ObstacleTreeNode();
        let bestIndex = 0;
        let bestLeft = obstacles.length;
        let bestRight = obstacles.length;
        for (let i = 0; i < obstacles.length; ++i) {
            let leftCount = 0;
            let rightCount = 0;
            const obstacleI = obstacles[i];
            const nextI = obstacleI.next;
            for (let j = 0; j < obstacles.length; ++j) {
                if (i === j) {
                    continue;
                }
                const obstacleJ = obstacles[j];
                const nextJ = obstacleJ.next;
                const leftJ = RVOMath.leftOf(obstacleI.point, nextI.point, obstacleJ.point);
                const leftNextJ = RVOMath.leftOf(obstacleI.point, nextI.point, nextJ.point);
                if (leftJ >= -RVOMath.RVO_EPSILON && leftNextJ >= -RVOMath.RVO_EPSILON) {
                    ++leftCount;
                } else if (leftJ <= RVOMath.RVO_EPSILON && leftNextJ <= RVOMath.RVO_EPSILON) {
                    ++rightCount;
                } else {
                    ++leftCount;
                    ++rightCount;
                }
                if (FloatPair.morethanOrEqual(new FloatPair(Math.max(leftCount, rightCount), Math.min(leftCount, rightCount)), new FloatPair(Math.max(bestLeft, bestRight), Math.min(bestLeft, bestRight)))) {
                    break;
                }
            }
            if (FloatPair.lessthan(new FloatPair(Math.max(leftCount, rightCount), Math.min(leftCount, rightCount)), new FloatPair(Math.max(bestLeft, bestRight), Math.min(bestLeft, bestRight)))) {
                bestLeft = leftCount;
                bestRight = rightCount;
                bestIndex = i;
            }
        }
        const leftObstacles = new Array<Obstacle>(bestLeft);
        const rightObstacles = new Array<Obstacle>(bestRight);
        let leftIndex = 0;
        let rightIndex = 0;
        const splitIndex = bestIndex;
        const splitObstacle = obstacles[splitIndex];
        const splitNext = splitObstacle.next;
        for (let j = 0; j < obstacles.length; ++j) {
            if (splitIndex === j) {
                continue;
            }
            const obstacleJ = obstacles[j];
            const nextJ = obstacleJ.next;
            const leftJ = RVOMath.leftOf(splitObstacle.point, splitNext.point, obstacleJ.point);
            const leftNextJ = RVOMath.leftOf(splitObstacle.point, splitNext.point, nextJ.point);
            if (leftJ >= -RVOMath.RVO_EPSILON && leftNextJ >= -RVOMath.RVO_EPSILON) {
                leftObstacles[leftIndex++] = obstacles[j];
            } else if (leftJ <= RVOMath.RVO_EPSILON && leftNextJ <= RVOMath.RVO_EPSILON) {
                rightObstacles[rightIndex++] = obstacles[j];
            } else {
                const t =
                    RVOMath.det(Vector2.subtract(splitNext.point, splitObstacle.point), Vector2.subtract(obstacleJ.point, splitObstacle.point)) /
                    RVOMath.det(Vector2.subtract(splitNext.point, splitObstacle.point), Vector2.subtract(obstacleJ.point, nextJ.point));
                const splitPoint = Vector2.addition(obstacleJ.point, Vector2.multiply2(t, Vector2.subtract(nextJ.point, obstacleJ.point)));
                const newObstacle = new Obstacle();
                newObstacle.point = splitPoint;
                newObstacle.previous = obstacleJ;
                newObstacle.next = nextJ;
                newObstacle.convex = true;
                newObstacle.direction = obstacleJ.direction;
                newObstacle.id = Simulator.Instance.obstacles.length;
                Simulator.Instance.obstacles.push(newObstacle);
                obstacleJ.next = newObstacle;
                nextJ.previous = newObstacle;
                if (leftJ > 0) {
                    leftObstacles[leftIndex++] = obstacleJ;
                    rightObstacles[rightIndex++] = newObstacle;
                } else {
                    rightObstacles[rightIndex++] = obstacleJ;
                    leftObstacles[leftIndex++] = newObstacle;
                }
            }
        }
        node.obstacle = splitObstacle;
        node.left = this.buildObstacleTreeRecursive(leftObstacles);
        node.right = this.buildObstacleTreeRecursive(rightObstacles);
        return node;
    }

    computeObstacleNeighbors(agent: Agent, rangeSq: number): void {
        this.queryObstacleTreeRecursive(agent, rangeSq, this.obstacleTree_);
    }

    queryObstacleTreeRecursive(agent: Agent, rangeSq: number, node: ObstacleTreeNode | null): void {
        if (agent && node) {
            const obstacle = node.obstacle!;
            const next = obstacle.next;
            const distLeftOf = RVOMath.leftOf(obstacle.point, next.point, agent.position);
            this.queryObstacleTreeRecursive(agent, rangeSq, distLeftOf >= 0 ? node.left : node.right);
            if (RVOMath.sqr(distLeftOf) / RVOMath.absSq(Vector2.subtract(next.point, obstacle.point)) < rangeSq) {
                if (distLeftOf < 0) {
                    agent.insertObstacleNeighbor(node.obstacle!, rangeSq);
                }
                this.queryObstacleTreeRecursive(agent, rangeSq, distLeftOf >= 0 ? node.right : node.left);
            }
        }
    }

    computeAgentNeighbors(agent: Agent, rangeSq: { value: number }): void {
        this.queryAgentTreeRecursive(agent, rangeSq, 0);
    }

    queryAgentTreeRecursive(agent: Agent, rangeSq: { value: number }, nodeIndex: number): void {
        const node = this.agentTree[nodeIndex];
        if (node.end - node.begin <= this.MAX_LEAF_SIZE) {
            for (let i = node.begin; i < node.end; ++i) {
                agent.insertAgentNeighbor(this.agents[i], rangeSq);
            }
        } else {
            const leftDist = this.calculateDistanceSquared(this.agentTree[node.left], agent);
            const rightDist = this.calculateDistanceSquared(this.agentTree[node.right], agent);
            if (leftDist < rightDist) {
                if (leftDist < rangeSq.value) {
                    this.queryAgentTreeRecursive(agent, rangeSq, node.left);
                }
                if (rightDist < rangeSq.value) {
                    this.queryAgentTreeRecursive(agent, rangeSq, node.right);
                }
            } else {
                if (rightDist < rangeSq.value) {
                    this.queryAgentTreeRecursive(agent, rangeSq, node.right);
                }
                if (leftDist < rangeSq.value) {
                    this.queryAgentTreeRecursive(agent, rangeSq, node.left);
                }
            }
        }
    }

    calculateDistanceSquared(node: AgentTreeNode, agent: Agent): number {
        const dx = Math.max(0, node.minX - agent.position.x) + Math.max(0, agent.position.x - node.maxX);
        const dy = Math.max(0, node.minY - agent.position.y) + Math.max(0, agent.position.y - node.maxY);
        return RVOMath.sqr(dx) + RVOMath.sqr(dy);
    }
}
