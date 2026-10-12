import Obstacle from "./Obstacle";
import RVOMath from "./RVOMath";
import Simulator from "./Simulator";
import Vector2 from "./Vector2";

class Pair {
    public a: number;
    public b: number;

    constructor(a: number, b: number) {
        this.a = a;
        this.b = b;
    }

    public static lessthan(e: Pair, t: Pair): boolean {
        return e.a < t.a || !(t.a < e.a) && e.b < t.b;
    }

    public static lessthanOrEqual(t: Pair, i: Pair): boolean {
        return t.a == i.a && t.b == i.b || Pair.lessthan(t, i);
    }

    public static morethan(t: Pair, i: Pair): boolean {
        return !Pair.lessthanOrEqual(t, i);
    }

    public static morethanOrEqual(t: Pair, i: Pair): boolean {
        return !Pair.lessthan(t, i);
    }
}

class ObstacleTreeNode {
    public obstacle: any = null;
    public left: ObstacleTreeNode | null = null;
    public right: ObstacleTreeNode | null = null;
}

class AgentTreeNode {
    public begin: number = 0;
    public end: number = 0;
    public minX: number = 0;
    public maxX: number = 0;
    public minY: number = 0;
    public maxY: number = 0;
    public left: number = 0;
    public right: number = 0;
}

export default class KdTree {
    public agents: any[] = [];
    public agentTree: AgentTreeNode[] = [];
    public MAX_LEAF_SIZE: number = 100;
    private obstacleTree_: ObstacleTreeNode | null = null;

    public buildAgentTree(forceRebuild: boolean): void {
        if (forceRebuild || this.agents == null) {
            this.agents = Array.from(Simulator.Instance.agentMap.values());
            this.agentTree = new Array(2 * this.agents.length)
                .fill(null)
                .map(() => new AgentTreeNode());
        }
        if (this.agents.length != 0) {
            this.buildAgentTreeRecursive(0, this.agents.length, 0);
        }
    }

    private buildAgentTreeRecursive(begin: number, end: number, nodeIndex: number): void {
        const node = this.agentTree[nodeIndex];
        node.begin = begin;
        node.end = end;
        node.minX = node.maxX = this.agents[begin].position.x;
        node.minY = node.maxY = this.agents[begin].position.y;

        for (let n = begin + 1; n < end; ++n) {
            const agent = this.agents[n];
            node.maxX = Math.max(node.maxX, agent.position.x);
            node.minX = Math.min(node.minX, agent.position.x);
            node.maxY = Math.max(node.maxY, agent.position.y);
            node.minY = Math.min(node.minY, agent.position.y);
        }

        if (end - begin > this.MAX_LEAF_SIZE) {
            const isVertical = node.maxX - node.minX > node.maxY - node.minY;
            const splitValue = 0.5 * (isVertical ? node.maxX + node.minX : node.maxY + node.minY);
            let left = begin;
            let right = end;

            while (left < right) {
                while (left < right && (isVertical ? this.agents[left].position.x : this.agents[left].position.y) < splitValue) ++left;
                while (right > left && (isVertical ? this.agents[right - 1].position.x : this.agents[right - 1].position.y) >= splitValue) --right;
                if (left < right) {
                    const tmp = this.agents[left];
                    this.agents[left] = this.agents[right - 1];
                    this.agents[right - 1] = tmp;
                    ++left;
                    --right;
                }
            }

            let leftSize = left - begin;
            if (leftSize === 0) {
                ++leftSize;
                ++left;
            }

            node.left = nodeIndex + 1;
            node.right = nodeIndex + 2 * leftSize;
            this.buildAgentTreeRecursive(begin, left, node.left);
            this.buildAgentTreeRecursive(left, end, node.right);
        }
    }

    public buildObstacleTree(): void {
        this.obstacleTree_ = new ObstacleTreeNode();
        const obstacleCount = Simulator.Instance.obstacles.length;
        const obstacles: any[] = [];
        for (let i = 0; i < obstacleCount; ++i) {
            obstacles.push(Simulator.Instance.obstacles[i]);
        }
        this.obstacleTree_ = this.buildObstacleTreeRecursive(obstacles);
    }

    private buildObstacleTreeRecursive(obstacles: any[]): ObstacleTreeNode | null {
        if (!obstacles || obstacles.length === 0) {
            return null;
        }

        const node = new ObstacleTreeNode();
        let bestLeftCount = obstacles.length;
        let bestRightCount = obstacles.length;
        let bestIndex = 0;

        for (let i = 0; i < obstacles.length; ++i) {
            let leftCount = 0;
            let rightCount = 0;
            const obstacle = obstacles[i];
            const obstacleNext = obstacle.next;
            for (let j = 0; j < obstacles.length; ++j) {
                if (i === j) continue;
                const other = obstacles[j];
                const otherNext = other.next;
                const leftOf1 = RVOMath.leftOf(obstacle.point, obstacleNext.point, other.point);
                const leftOf2 = RVOMath.leftOf(obstacle.point, obstacleNext.point, otherNext.point);

                if (leftOf1 >= -RVOMath.RVO_EPSILON && leftOf2 >= -RVOMath.RVO_EPSILON) {
                    ++leftCount;
                } else if (leftOf1 <= RVOMath.RVO_EPSILON && leftOf2 <= RVOMath.RVO_EPSILON) {
                    ++rightCount;
                } else {
                    ++leftCount;
                    ++rightCount;
                }

                if (Pair.morethanOrEqual(
                    new Pair(Math.max(leftCount, rightCount), Math.min(leftCount, rightCount)),
                    new Pair(Math.max(bestLeftCount, bestRightCount), Math.min(bestLeftCount, bestRightCount))
                )) {
                    break;
                }
            }

            if (Pair.lessthan(
                new Pair(Math.max(leftCount, rightCount), Math.min(leftCount, rightCount)),
                new Pair(Math.max(bestLeftCount, bestRightCount), Math.min(bestLeftCount, bestRightCount))
            )) {
                bestLeftCount = leftCount;
                bestRightCount = rightCount;
                bestIndex = i;
            }
        }

        const leftObstacles: any[] = new Array(bestLeftCount);
        const rightObstacles: any[] = new Array(bestRightCount);
        let leftSize = 0;
        let rightSize = 0;
        const splitterIndex = bestIndex;
        const splitter = obstacles[splitterIndex];
        const splitterNext = splitter.next;

        for (let j = 0; j < obstacles.length; ++j) {
            if (splitterIndex === j) continue;
            const other = obstacles[j];
            const otherNext = other.next;
            const leftOf1 = RVOMath.leftOf(splitter.point, splitterNext.point, other.point);
            const leftOf2 = RVOMath.leftOf(splitter.point, splitterNext.point, otherNext.point);

            if (leftOf1 >= -RVOMath.RVO_EPSILON && leftOf2 >= -RVOMath.RVO_EPSILON) {
                leftObstacles[leftSize++] = other;
            } else if (leftOf1 <= RVOMath.RVO_EPSILON && leftOf2 <= RVOMath.RVO_EPSILON) {
                rightObstacles[rightSize++] = other;
            } else {
                const t = RVOMath.det(
                    Vector2.subtract(splitterNext.point, splitter.point),
                    Vector2.subtract(other.point, splitter.point)
                ) / RVOMath.det(
                    Vector2.subtract(splitterNext.point, splitter.point),
                    Vector2.subtract(other.point, otherNext.point)
                );
                const intersection = Vector2.addition(
                    other.point,
                    Vector2.multiply2(t, Vector2.subtract(otherNext.point, other.point))
                );
                const newObstacle: any = new Obstacle();
                newObstacle.point = intersection;
                newObstacle.previous = other;
                newObstacle.next = otherNext;
                newObstacle.convex = true;
                newObstacle.direction = other.direction;
                newObstacle.id = Simulator.Instance.obstacles.length;
                Simulator.Instance.obstacles.push(newObstacle);
                other.next = newObstacle;
                otherNext.previous = newObstacle;

                if (leftOf1 > 0) {
                    leftObstacles[leftSize++] = other;
                    rightObstacles[rightSize++] = newObstacle;
                } else {
                    rightObstacles[rightSize++] = other;
                    leftObstacles[leftSize++] = newObstacle;
                }
            }
        }

        node.obstacle = splitter;
        node.left = this.buildObstacleTreeRecursive(leftObstacles);
        node.right = this.buildObstacleTreeRecursive(rightObstacles);
        return node;
    }

    public computeObstacleNeighbors(agent: any, rangeSq: number): void {
        this.queryObstacleTreeRecursive(agent, rangeSq, this.obstacleTree_);
    }

    private queryObstacleTreeRecursive(agent: any, rangeSq: number, node: ObstacleTreeNode | null): void {
        if (agent && node) {
            const obstacle = node.obstacle;
            const obstacleNext = obstacle.next;
            const leftOf = RVOMath.leftOf(obstacle.point, obstacleNext.point, agent.position);

            this.queryObstacleTreeRecursive(agent, rangeSq, leftOf >= 0 ? node.left : node.right);

            if (RVOMath.sqr(leftOf) / RVOMath.absSq(Vector2.subtract(obstacleNext.point, obstacle.point)) < rangeSq) {
                if (leftOf < 0) {
                    agent.insertObstacleNeighbor(node.obstacle, rangeSq);
                }
                this.queryObstacleTreeRecursive(agent, rangeSq, leftOf >= 0 ? node.right : node.left);
            }
        }
    }

    public computeAgentNeighbors(agent: any, rangeSq: { value: number }): void {
        this.queryAgentTreeRecursive(agent, rangeSq, 0);
    }

    private queryAgentTreeRecursive(agent: any, rangeSq: { value: number }, nodeIndex: number): void {
        const node = this.agentTree[nodeIndex];
        if (node.end - node.begin <= this.MAX_LEAF_SIZE) {
            for (let i = node.begin; i < node.end; ++i) {
                agent.insertAgentNeighbor(this.agents[i], rangeSq);
            }
        } else {
            const distLeft = this.calculateDistanceSquared(this.agentTree[node.left], agent);
            const distRight = this.calculateDistanceSquared(this.agentTree[node.right], agent);

            if (distLeft < distRight) {
                if (distLeft < rangeSq.value) {
                    this.queryAgentTreeRecursive(agent, rangeSq, node.left);
                    if (distRight < rangeSq.value) {
                        this.queryAgentTreeRecursive(agent, rangeSq, node.right);
                    }
                }
            } else {
                if (distRight < rangeSq.value) {
                    this.queryAgentTreeRecursive(agent, rangeSq, node.right);
                    if (distLeft < rangeSq.value) {
                        this.queryAgentTreeRecursive(agent, rangeSq, node.left);
                    }
                }
            }
        }
    }

    private calculateDistanceSquared(node: AgentTreeNode, agent: any): number {
        const dx = Math.max(0, node.minX - agent.position.x) + Math.max(0, agent.position.x - node.maxX);
        const dy = Math.max(0, node.minY - agent.position.y) + Math.max(0, agent.position.y - node.maxY);
        return RVOMath.sqr(dx) + RVOMath.sqr(dy);
    }
}