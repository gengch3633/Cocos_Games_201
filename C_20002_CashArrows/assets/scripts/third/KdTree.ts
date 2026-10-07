import Obstacle from "./Obstacle";
import RVOMath from "./RVOMath";
import Simulator from "./Simulator";
import Vector2 from "./Vector2";

class ObstacleTreeNode {
    obstacle: any = null;
    left: ObstacleTreeNode = null;
    right: ObstacleTreeNode = null;
}

class AgentTreeNode {
    begin: number = 0;
    end: number = 0;
    left: number = 0;
    right: number = 0;
    maxX: number = 0;
    minX: number = 0;
    maxY: number = 0;
    minY: number = 0;
}

class FloatPair {
    constructor(public a: number, public b: number) {}

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
    agents: any[] = [];
    agentTree: AgentTreeNode[] = [];
    MAX_LEAF_SIZE: number = 100;
    obstacleTree_: ObstacleTreeNode = null;

    buildAgentTree(force?: boolean): void {
        if (this.agents == null || force) {
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
        for (let index = begin + 1; index < end; ++index) {
            this.agentTree[node].maxX = Math.max(this.agentTree[node].maxX, this.agents[index].position.x);
            this.agentTree[node].minX = Math.min(this.agentTree[node].minX, this.agents[index].position.x);
            this.agentTree[node].maxY = Math.max(this.agentTree[node].maxY, this.agents[index].position.y);
            this.agentTree[node].minY = Math.min(this.agentTree[node].minY, this.agents[index].position.y);
        }
        if (end - begin > this.MAX_LEAF_SIZE) {
            const isVerticalSplit = this.agentTree[node].maxX - this.agentTree[node].minX > this.agentTree[node].maxY - this.agentTree[node].minY;
            const splitValue = 0.5 * (isVerticalSplit
                ? this.agentTree[node].maxX + this.agentTree[node].minX
                : this.agentTree[node].maxY + this.agentTree[node].minY);
            let leftIndex = begin;
            let rightIndex = end;
            while (leftIndex < rightIndex) {
                while (leftIndex < rightIndex && (isVerticalSplit ? this.agents[leftIndex].position.x : this.agents[leftIndex].position.y) < splitValue) {
                    ++leftIndex;
                }
                while (rightIndex > leftIndex && (isVerticalSplit ? this.agents[rightIndex - 1].position.x : this.agents[rightIndex - 1].position.y) >= splitValue) {
                    --rightIndex;
                }
                if (leftIndex < rightIndex) {
                    const temp = this.agents[leftIndex];
                    this.agents[leftIndex] = this.agents[rightIndex - 1];
                    this.agents[rightIndex - 1] = temp;
                    ++leftIndex;
                    --rightIndex;
                }
            }
            let leftSize = leftIndex - begin;
            if (leftSize === 0) {
                ++leftSize;
                ++leftIndex;
                ++rightIndex;
            }
            this.agentTree[node].left = node + 1;
            this.agentTree[node].right = node + 2 * leftSize;
            this.buildAgentTreeRecursive(begin, leftIndex, this.agentTree[node].left);
            this.buildAgentTreeRecursive(leftIndex, end, this.agentTree[node].right);
        }
    }

    buildObstacleTree(): void {
        this.obstacleTree_ = new ObstacleTreeNode();
        const obstacleCount = Simulator.Instance.obstacles.length;
        const obstacles: any[] = [];
        for (let index = 0; index < obstacleCount; ++index) {
            obstacles[obstacles.length] = Simulator.Instance.obstacles[index];
        }
        this.obstacleTree_ = this.buildObstacleTreeRecursive(obstacles);
    }

    buildObstacleTreeRecursive(obstacles: any[]): ObstacleTreeNode {
        if (obstacles && obstacles.length !== 0) {
            const node = new ObstacleTreeNode();
            let bestIndex = 0;
            let minLeft = obstacles.length;
            let minRight = obstacles.length;
            for (let obstacleIndex = 0; obstacleIndex < obstacles.length; ++obstacleIndex) {
                let leftCount = 0;
                let rightCount = 0;
                const obstacle = obstacles[obstacleIndex];
                const nextObstacle = obstacle.next;
                for (let otherIndex = 0; otherIndex < obstacles.length; ++otherIndex) {
                    if (obstacleIndex !== otherIndex) {
                        const other = obstacles[otherIndex];
                        const otherNext = other.next;
                        const leftOfStart = RVOMath.leftOf(obstacle.point, nextObstacle.point, other.point);
                        const leftOfEnd = RVOMath.leftOf(obstacle.point, nextObstacle.point, otherNext.point);
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
                            new FloatPair(Math.max(minLeft, minRight), Math.min(minLeft, minRight))
                        )) {
                            break;
                        }
                    }
                }
                if (FloatPair.lessthan(
                    new FloatPair(Math.max(leftCount, rightCount), Math.min(leftCount, rightCount)),
                    new FloatPair(Math.max(minLeft, minRight), Math.min(minLeft, minRight))
                )) {
                    minLeft = leftCount;
                    minRight = rightCount;
                    bestIndex = obstacleIndex;
                }
            }
            const leftObstacles = new Array(minLeft);
            const rightObstacles = new Array(minRight);
            let leftIndex = 0;
            let rightIndex = 0;
            const splitIndex = bestIndex;
            const splitObstacle = obstacles[splitIndex];
            const splitNext = splitObstacle.next;
            for (let obstacleIndex = 0; obstacleIndex < obstacles.length; ++obstacleIndex) {
                if (splitIndex !== obstacleIndex) {
                    let other = obstacles[obstacleIndex];
                    const otherNext = other.next;
                    const leftOfStart = RVOMath.leftOf(splitObstacle.point, splitNext.point, other.point);
                    const leftOfEnd = RVOMath.leftOf(splitObstacle.point, splitNext.point, otherNext.point);
                    if (leftOfStart >= -RVOMath.RVO_EPSILON && leftOfEnd >= -RVOMath.RVO_EPSILON) {
                        leftObstacles[leftIndex++] = obstacles[obstacleIndex];
                    } else if (leftOfStart <= RVOMath.RVO_EPSILON && leftOfEnd <= RVOMath.RVO_EPSILON) {
                        rightObstacles[rightIndex++] = obstacles[obstacleIndex];
                    } else {
                        const factor = RVOMath.det(
                            Vector2.subtract(splitNext.point, splitObstacle.point),
                            Vector2.subtract(other.point, splitObstacle.point)
                        ) / RVOMath.det(
                            Vector2.subtract(splitNext.point, splitObstacle.point),
                            Vector2.subtract(other.point, otherNext.point)
                        );
                        const splitPoint = Vector2.addition(
                            other.point,
                            Vector2.multiply2(factor, Vector2.subtract(otherNext.point, other.point))
                        );
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

    queryObstacleTreeRecursive(agent: any, rangeSq: number, node: ObstacleTreeNode): void {
        if (agent && node) {
            const obstacle = node.obstacle;
            const nextObstacle = obstacle.next;
            const leftOfAgent = RVOMath.leftOf(obstacle.point, nextObstacle.point, agent.position);
            this.queryObstacleTreeRecursive(agent, rangeSq, leftOfAgent >= 0 ? node.left : node.right);
            if (RVOMath.sqr(leftOfAgent) / RVOMath.absSq(Vector2.subtract(nextObstacle.point, obstacle.point)) < rangeSq) {
                if (leftOfAgent < 0) {
                    agent.insertObstacleNeighbor(node.obstacle, rangeSq);
                }
                this.queryObstacleTreeRecursive(agent, rangeSq, leftOfAgent >= 0 ? node.right : node.left);
            }
        }
    }

    computeAgentNeighbors(agent: any, rangeObserver: { value: number }): void {
        this.queryAgentTreeRecursive(agent, rangeObserver, 0);
    }

    queryAgentTreeRecursive(agent: any, rangeObserver: { value: number }, nodeIndex: number): void {
        const node = this.agentTree[nodeIndex];
        if (node.end - node.begin <= this.MAX_LEAF_SIZE) {
            for (let index = node.begin; index < node.end; ++index) {
                agent.insertAgentNeighbor(this.agents[index], rangeObserver);
            }
        } else {
            const leftDistanceSq = this.calculateDistanceSquared(this.agentTree[node.left], agent);
            const rightDistanceSq = this.calculateDistanceSquared(this.agentTree[node.right], agent);
            if (leftDistanceSq < rightDistanceSq) {
                if (leftDistanceSq < rangeObserver.value) {
                    this.queryAgentTreeRecursive(agent, rangeObserver, node.left);
                    if (rightDistanceSq < rangeObserver.value) {
                        this.queryAgentTreeRecursive(agent, rangeObserver, node.right);
                    }
                }
            } else if (rightDistanceSq < rangeObserver.value) {
                this.queryAgentTreeRecursive(agent, rangeObserver, node.right);
                if (leftDistanceSq < rangeObserver.value) {
                    this.queryAgentTreeRecursive(agent, rangeObserver, node.left);
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
