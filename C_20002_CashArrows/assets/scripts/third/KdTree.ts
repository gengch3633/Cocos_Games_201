import Obstacle from "./Obstacle";
import RVOMath from "./RVOMath";
import Simulator from "./Simulator";
import Vector2 from "./Vector2";

class ObstacleTreeNode {
    obstacle: any = null;
    left: ObstacleTreeNode | null = null;
    right: ObstacleTreeNode | null = null;
}

class AgentTreeNode {
    begin = 0;
    end = 0;
    minX = 0;
    maxX = 0;
    minY = 0;
    maxY = 0;
    left = 0;
    right = 0;
}

class FloatPair {
    a: number;
    b: number;

    constructor(a: number, b: number) {
        this.a = a;
        this.b = b;
    }

    static lessthan(left: FloatPair, right: FloatPair): boolean {
        return left.a < right.a || (!(right.a < left.a) && left.b < right.b);
    }

    static lessthanOrEqual(left: FloatPair, right: FloatPair): boolean {
        return left.a === right.a && left.b === right.b || FloatPair.lessthan(left, right);
    }

    static morethan(left: FloatPair, right: FloatPair): boolean {
        return !FloatPair.lessthanOrEqual(left, right);
    }

    static morethanOrEqual(left: FloatPair, right: FloatPair): boolean {
        return !FloatPair.lessthan(left, right);
    }
}

export default class KdTree {
    agents: any[] = [];
    agentTree: AgentTreeNode[] = [];
    MAX_LEAF_SIZE = 100;
    obstacleTree_: ObstacleTreeNode | null = null;

    buildAgentTree(rebuild?: boolean): void {
        if (this.agents == null || rebuild) {
            this.agents = Array.from(Simulator.Instance.agentMap.values());
            this.agentTree = new Array(2 * this.agents.length).fill(null).map(() => new AgentTreeNode());
        }
        if (this.agents.length !== 0) {
            this.buildAgentTreeRecursive(0, this.agents.length, 0);
        }
    }

    buildAgentTreeRecursive(begin: number, end: number, nodeIndex: number): void {
        this.agentTree[nodeIndex].begin = begin;
        this.agentTree[nodeIndex].end = end;
        this.agentTree[nodeIndex].minX = this.agentTree[nodeIndex].maxX = this.agents[begin].position.x;
        this.agentTree[nodeIndex].minY = this.agentTree[nodeIndex].maxY = this.agents[begin].position.y;
        for (let i = begin + 1; i < end; ++i) {
            this.agentTree[nodeIndex].maxX = Math.max(this.agentTree[nodeIndex].maxX, this.agents[i].position.x);
            this.agentTree[nodeIndex].minX = Math.min(this.agentTree[nodeIndex].minX, this.agents[i].position.x);
            this.agentTree[nodeIndex].maxY = Math.max(this.agentTree[nodeIndex].maxY, this.agents[i].position.y);
            this.agentTree[nodeIndex].minY = Math.min(this.agentTree[nodeIndex].minY, this.agents[i].position.y);
        }
        if (end - begin > this.MAX_LEAF_SIZE) {
            const isVertical = this.agentTree[nodeIndex].maxX - this.agentTree[nodeIndex].minX >
                this.agentTree[nodeIndex].maxY - this.agentTree[nodeIndex].minY;
            const splitValue = 0.5 * (isVertical ?
                this.agentTree[nodeIndex].maxX + this.agentTree[nodeIndex].minX :
                this.agentTree[nodeIndex].maxY + this.agentTree[nodeIndex].minY);
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
            this.agentTree[nodeIndex].left = nodeIndex + 1;
            this.agentTree[nodeIndex].right = nodeIndex + 2 * leftSize;
            this.buildAgentTreeRecursive(begin, left, this.agentTree[nodeIndex].left);
            this.buildAgentTreeRecursive(left, end, this.agentTree[nodeIndex].right);
        }
    }

    buildObstacleTree(): void {
        this.obstacleTree_ = new ObstacleTreeNode();
        const count = Simulator.Instance.obstacles.length;
        const obstacles: any[] = [];
        for (let i = 0; i < count; ++i) {
            obstacles[obstacles.length] = Simulator.Instance.obstacles[i];
        }
        this.obstacleTree_ = this.buildObstacleTreeRecursive(obstacles);
    }

    buildObstacleTreeRecursive(obstacles: any[]): ObstacleTreeNode | null {
        if (obstacles && obstacles.length !== 0) {
            const node = new ObstacleTreeNode();
            let bestIndex = 0;
            let bestLeft = obstacles.length;
            let bestRight = obstacles.length;
            for (let i = 0; i < obstacles.length; ++i) {
                let leftCount = 0;
                let rightCount = 0;
                const obstacle = obstacles[i];
                const next = obstacle.next;
                for (let j = 0; j < obstacles.length; ++j) {
                    if (i !== j) {
                        const other = obstacles[j];
                        const otherNext = other.next;
                        const leftOfStart = RVOMath.leftOf(obstacle.point, next.point, other.point);
                        const leftOfEnd = RVOMath.leftOf(obstacle.point, next.point, otherNext.point);
                        if (leftOfStart >= -RVOMath.RVO_EPSILON && leftOfEnd >= -RVOMath.RVO_EPSILON) {
                            ++leftCount;
                        } else if (leftOfStart <= RVOMath.RVO_EPSILON && leftOfEnd <= RVOMath.RVO_EPSILON) {
                            ++rightCount;
                        } else {
                            ++leftCount;
                            ++rightCount;
                        }
                        if (FloatPair.morethanOrEqual(
                            new FloatPair(Math.max(leftCount, rightCount), Math.min(leftCount, rightCount)),
                            new FloatPair(Math.max(bestLeft, bestRight), Math.min(bestLeft, bestRight))
                        )) {
                            break;
                        }
                    }
                }
                if (FloatPair.lessthan(
                    new FloatPair(Math.max(leftCount, rightCount), Math.min(leftCount, rightCount)),
                    new FloatPair(Math.max(bestLeft, bestRight), Math.min(bestLeft, bestRight))
                )) {
                    bestLeft = leftCount;
                    bestRight = rightCount;
                    bestIndex = i;
                }
            }
            const leftObstacles = new Array(bestLeft);
            const rightObstacles = new Array(bestRight);
            let leftIndex = 0;
            let rightIndex = 0;
            const splitIndex = bestIndex;
            const splitObstacle = obstacles[splitIndex];
            const splitNext = splitObstacle.next;
            for (let i = 0; i < obstacles.length; ++i) {
                if (splitIndex !== i) {
                    const other = obstacles[i];
                    const otherNext = other.next;
                    const leftOfStart = RVOMath.leftOf(splitObstacle.point, splitNext.point, other.point);
                    const leftOfEnd = RVOMath.leftOf(splitObstacle.point, splitNext.point, otherNext.point);
                    if (leftOfStart >= -RVOMath.RVO_EPSILON && leftOfEnd >= -RVOMath.RVO_EPSILON) {
                        leftObstacles[leftIndex++] = obstacles[i];
                    } else if (leftOfStart <= RVOMath.RVO_EPSILON && leftOfEnd <= RVOMath.RVO_EPSILON) {
                        rightObstacles[rightIndex++] = obstacles[i];
                    } else {
                        const detNumerator = RVOMath.det(
                            Vector2.subtract(splitNext.point, splitObstacle.point),
                            Vector2.subtract(other.point, splitObstacle.point)
                        );
                        const detDenominator = RVOMath.det(
                            Vector2.subtract(splitNext.point, splitObstacle.point),
                            Vector2.subtract(other.point, otherNext.point)
                        );
                        const factor = detNumerator / detDenominator;
                        const splitPoint = Vector2.addition(other.point, Vector2.multiply2(factor, Vector2.subtract(otherNext.point, other.point)));
                        const newObstacle = new Obstacle();
                        newObstacle.point = splitPoint;
                        newObstacle.previous = other;
                        newObstacle.next = otherNext;
                        newObstacle.convex = true;
                        newObstacle.direction = other.direction;
                        newObstacle.id = Simulator.Instance.obstacles.length;
                        Simulator.Instance.obstacles.push(newObstacle);
                        other.next = newObstacle;
                        otherNext.previous = newObstacle;
                        if (leftOfStart > 0) {
                            leftObstacles[leftIndex++] = other;
                            rightObstacles[rightIndex++] = newObstacle;
                        } else {
                            rightObstacles[rightIndex++] = other;
                            leftObstacles[leftIndex++] = newObstacle;
                        }
                    }
                }
            }
            node.obstacle = splitObstacle;
            node.left = this.buildObstacleTreeRecursive(leftObstacles);
            node.right = this.buildObstacleTreeRecursive(rightObstacles);
            return node;
        }
        return null;
    }

    computeObstacleNeighbors(agent: any, rangeSq: number): void {
        this.queryObstacleTreeRecursive(agent, rangeSq, this.obstacleTree_);
    }

    queryObstacleTreeRecursive(agent: any, rangeSq: number, node: ObstacleTreeNode | null): void {
        if (agent && node) {
            const obstacle = node.obstacle;
            const next = obstacle.next;
            const leftOf = RVOMath.leftOf(obstacle.point, next.point, agent.position);
            this.queryObstacleTreeRecursive(agent, rangeSq, leftOf >= 0 ? node.left : node.right);
            if (RVOMath.sqr(leftOf) / RVOMath.absSq(Vector2.subtract(next.point, obstacle.point)) < rangeSq) {
                if (leftOf < 0) {
                    agent.insertObstacleNeighbor(node.obstacle, rangeSq);
                }
                this.queryObstacleTreeRecursive(agent, rangeSq, leftOf >= 0 ? node.right : node.left);
            }
        }
    }

    computeAgentNeighbors(agent: any, rangeSq: { value: number }): void {
        this.queryAgentTreeRecursive(agent, rangeSq, 0);
    }

    queryAgentTreeRecursive(agent: any, rangeSq: { value: number }, nodeIndex: number): void {
        const node = this.agentTree[nodeIndex];
        if (node.end - node.begin <= this.MAX_LEAF_SIZE) {
            for (let i = node.begin; i < node.end; ++i) {
                agent.insertAgentNeighbor(this.agents[i], rangeSq);
            }
        } else {
            const leftDistSq = this.calculateDistanceSquared(this.agentTree[node.left], agent);
            const rightDistSq = this.calculateDistanceSquared(this.agentTree[node.right], agent);
            if (leftDistSq < rightDistSq) {
                if (leftDistSq < rangeSq.value) {
                    this.queryAgentTreeRecursive(agent, rangeSq, node.left);
                    if (rightDistSq < rangeSq.value) {
                        this.queryAgentTreeRecursive(agent, rangeSq, node.right);
                    }
                }
            } else if (rightDistSq < rangeSq.value) {
                this.queryAgentTreeRecursive(agent, rangeSq, node.right);
                if (leftDistSq < rangeSq.value) {
                    this.queryAgentTreeRecursive(agent, rangeSq, node.left);
                }
            }
        }
    }

    calculateDistanceSquared(node: AgentTreeNode, agent: any): number {
        const dx = Math.max(0, node.minX - agent.position.x) + Math.max(0, agent.position.x - node.maxX);
        const dy = Math.max(0, node.minY - agent.position.y) + Math.max(0, agent.position.y - node.maxY);
        return RVOMath.sqr(dx) + RVOMath.sqr(dy);
    }
}
