import { KeyValuePair, ObserverObj } from "./commonDefine";
import Line from "./Line";
import RVOMath from "./RVOMath";
import Simulator from "./Simulator";
import Vector2 from "./Vector2";

export default class Agent {
    public agentNeighbors: KeyValuePair[] = [];
    public obstacleNeighbors: KeyValuePair[] = [];
    public orcaLines: Line[] = [];
    public prefVelocity: Vector2 = new Vector2(0, 0);
    public mass: number = 1;
    public calc: boolean = true;
    public newVelocity: Vector2 = new Vector2(0, 0);

    public position: Vector2;
    public velocity: Vector2;
    public maxNeighbors: number;
    public maxSpeed: number;
    public neighborDist: number;
    public radius: number;
    public timeHorizon: number;
    public timeHorizonObst: number;

    public update(): void {
        this.velocity = this.newVelocity;
        const position = Vector2.addition(
            this.position,
            Vector2.multiply2(Simulator.Instance.timeStep, this.velocity)
        );
        this.position = position;
    }

    public insertObstacleNeighbor(obstacle: any, rangeSq: number): void {
        const next = obstacle.next;
        const distSq = RVOMath.distSqPointLineSegment(obstacle.point, next.point, this.position);
        if (distSq < rangeSq) {
            this.obstacleNeighbors.push(new KeyValuePair(distSq, obstacle));
            let i = this.obstacleNeighbors.length - 1;
            while (i != 0 && distSq < this.obstacleNeighbors[i - 1].Key) {
                this.obstacleNeighbors[i] = this.obstacleNeighbors[i - 1];
                --i;
            }
            this.obstacleNeighbors[i] = new KeyValuePair(distSq, obstacle);
        }
    }

    public insertAgentNeighbor(agent: Agent, rangeSq: ObserverObj): void {
        if (agent && this != agent) {
            const distSq = RVOMath.absSq(Vector2.subtract(this.position, agent.position));
            if (distSq < rangeSq.value) {
                if (this.agentNeighbors.length < this.maxNeighbors) {
                    this.agentNeighbors.push(new KeyValuePair(distSq, agent));
                }
                let i = this.agentNeighbors.length - 1;
                while (i != 0 && distSq < this.agentNeighbors[i - 1].Key) {
                    this.agentNeighbors[i] = this.agentNeighbors[i - 1];
                    --i;
                }
                this.agentNeighbors[i] = new KeyValuePair(distSq, agent);
                if (this.agentNeighbors.length == this.maxNeighbors) {
                    rangeSq.value = this.agentNeighbors[this.agentNeighbors.length - 1].Key;
                }
            }
        }
    }

    public computeNeighbors(): void {
        this.obstacleNeighbors = [];
        const rangeSq = RVOMath.sqr(this.timeHorizonObst * this.maxSpeed + this.radius);
        Simulator.Instance.kdTree.computeObstacleNeighbors(this, rangeSq);
        this.agentNeighbors = [];
        if (this.maxNeighbors > 0) {
            const rangeSqAgent = new ObserverObj();
            rangeSqAgent.value = RVOMath.sqr(this.neighborDist);
            Simulator.Instance.kdTree.computeAgentNeighbors(this, rangeSqAgent);
        }
    }

    public computeNewVelocity(): void {
        this.orcaLines = [];
        const invTimeHorizonObst = 1 / this.timeHorizonObst;
        for (let i = 0; i < this.obstacleNeighbors.length; ++i) {
            let obstacle = this.obstacleNeighbors[i].Value;
            const obstacleNext = obstacle.next;
            const relativePosition1 = Vector2.subtract(obstacle.point, this.position);
            let relativePosition2 = Vector2.subtract(obstacleNext.point, this.position);
            let alreadyCovered = false;
            for (let j = 0; j < this.orcaLines.length; ++j) {
                if (
                    RVOMath.det(
                        Vector2.subtract(Vector2.multiply2(invTimeHorizonObst, relativePosition1), this.orcaLines[j].point),
                        this.orcaLines[j].direction
                    ) -
                        invTimeHorizonObst * this.radius >=
                        -RVOMath.RVO_EPSILON &&
                    RVOMath.det(
                        Vector2.subtract(Vector2.multiply2(invTimeHorizonObst, relativePosition2), this.orcaLines[j].point),
                        this.orcaLines[j].direction
                    ) -
                        invTimeHorizonObst * this.radius >=
                        -RVOMath.RVO_EPSILON
                ) {
                    alreadyCovered = true;
                    break;
                }
            }
            if (!alreadyCovered) {
                const distSq1 = RVOMath.absSq(relativePosition1);
                const distSq2 = RVOMath.absSq(relativePosition2);
                const radiusSq = RVOMath.sqr(this.radius);
                const obstacleVector = Vector2.subtract(obstacleNext.point, obstacle.point);
                const s = Vector2.multiply(Vector2.multiply2(-1, relativePosition1), obstacleVector) / RVOMath.absSq(obstacleVector);
                const distSqLine = RVOMath.absSq(Vector2.subtract(Vector2.multiply2(-1, relativePosition1), Vector2.multiply2(s, obstacleVector)));
                const line = new Line();
                if (s < 0 && distSq1 <= radiusSq) {
                    if (obstacle.convex) {
                        line.point = new Vector2(0, 0);
                        line.direction = RVOMath.normalize(new Vector2(-relativePosition1.y, relativePosition1.x));
                        this.orcaLines.push(line);
                    }
                } else if (s > 1 && distSq2 <= radiusSq) {
                    if (obstacleNext.convex && RVOMath.det(relativePosition2, obstacleNext.direction) >= 0) {
                        line.point = new Vector2(0, 0);
                        line.direction = RVOMath.normalize(new Vector2(-relativePosition2.y, relativePosition2.x));
                        this.orcaLines.push(line);
                    }
                } else if (s >= 0 && s < 1 && distSqLine <= radiusSq) {
                    line.point = new Vector2(0, 0);
                    line.direction = Vector2.multiply2(-1, obstacle.direction);
                    this.orcaLines.push(line);
                } else {
                    let leftLegDirection: Vector2;
                    let rightLegDirection: Vector2;
                    if (s < 0 && distSqLine <= radiusSq) {
                        if (!obstacle.convex) {
                            continue;
                        }
                        obstacleNext = obstacle;
                        const leg = RVOMath.sqrt(distSq1 - radiusSq);
                        leftLegDirection = Vector2.division(
                            new Vector2(relativePosition1.x * leg - relativePosition1.y * this.radius, relativePosition1.x * this.radius + relativePosition1.y * leg),
                            distSq1
                        );
                        rightLegDirection = Vector2.division(
                            new Vector2(relativePosition1.x * leg + relativePosition1.y * this.radius, -relativePosition1.x * this.radius + relativePosition1.y * leg),
                            distSq1
                        );
                    } else if (s > 1 && distSqLine <= radiusSq) {
                        if (!obstacleNext.convex) {
                            continue;
                        }
                        obstacle = obstacleNext;
                        const leg = RVOMath.sqrt(distSq2 - radiusSq);
                        leftLegDirection = Vector2.division(
                            new Vector2(relativePosition2.x * leg - relativePosition2.y * this.radius, relativePosition2.x * this.radius + relativePosition2.y * leg),
                            distSq2
                        );
                        rightLegDirection = Vector2.division(
                            new Vector2(relativePosition2.x * leg + relativePosition2.y * this.radius, -relativePosition2.x * this.radius + relativePosition2.y * leg),
                            distSq2
                        );
                    } else {
                        if (obstacle.convex) {
                            const leg = RVOMath.sqrt(distSq1 - radiusSq);
                            leftLegDirection = Vector2.division(
                                new Vector2(relativePosition1.x * leg - relativePosition1.y * this.radius, relativePosition1.x * this.radius + relativePosition1.y * leg),
                                distSq1
                            );
                        } else {
                            leftLegDirection = Vector2.multiply2(-1, obstacle.direction);
                        }
                        if (obstacleNext.convex) {
                            const leg = RVOMath.sqrt(distSq2 - radiusSq);
                            rightLegDirection = Vector2.division(
                                new Vector2(relativePosition2.x * leg - relativePosition2.y * this.radius, relativePosition2.x * this.radius + relativePosition2.y * leg),
                                distSq2
                            );
                        } else {
                            rightLegDirection = Vector2.multiply2(-1, obstacle.direction);
                        }
                    }
                    const previous = obstacle.previous;
                    let isLeftLegForeign = false;
                    let isRightLegForeign = false;
                    if (obstacle.convex && RVOMath.det(leftLegDirection, Vector2.multiply2(-1, previous.direction)) >= 0) {
                        leftLegDirection = Vector2.multiply2(-1, previous.direction);
                        isLeftLegForeign = true;
                    }
                    if (obstacleNext.convex && RVOMath.det(rightLegDirection, Vector2.multiply2(-1, obstacleNext.direction)) <= 0) {
                        rightLegDirection = obstacleNext.direction;
                        isRightLegForeign = true;
                    }
                    const leftCutoff = Vector2.multiply2(invTimeHorizonObst, Vector2.subtract(obstacle.point, this.position));
                    const rightCutoff = Vector2.multiply2(invTimeHorizonObst, Vector2.subtract(obstacleNext.point, this.position));
                    const cutoffVec = Vector2.subtract(rightCutoff, leftCutoff);
                    const t = obstacle == obstacleNext ? 0.5 : Vector2.multiply(Vector2.subtract(this.velocity, leftCutoff), cutoffVec) / RVOMath.absSq(cutoffVec);
                    const tLeft = Vector2.multiply(Vector2.subtract(this.velocity, leftCutoff), leftLegDirection);
                    const tRight = Vector2.multiply(Vector2.subtract(this.velocity, rightCutoff), rightLegDirection);
                    if ((t < 0 && tLeft < 0) || (obstacle == obstacleNext && tLeft < 0 && tRight < 0)) {
                        const w = RVOMath.normalize(Vector2.subtract(this.velocity, leftCutoff));
                        line.direction = new Vector2(w.y, -w.x);
                        line.point = Vector2.addition(leftCutoff, Vector2.multiply2(this.radius * invTimeHorizonObst, w));
                        this.orcaLines.push(line);
                    } else if (t > 1 && tRight < 0) {
                        const w = RVOMath.normalize(Vector2.subtract(this.velocity, rightCutoff));
                        line.direction = new Vector2(w.y, -w.x);
                        line.point = Vector2.addition(rightCutoff, Vector2.multiply2(this.radius * invTimeHorizonObst, w));
                        this.orcaLines.push(line);
                    } else {
                        const distSqCutoff =
                            t < 0 || t > 1 || obstacle == obstacleNext
                                ? RVOMath.RVO_POSITIVEINFINITY
                                : RVOMath.absSq(Vector2.subtract(this.velocity, Vector2.addition(leftCutoff, Vector2.multiply2(t, cutoffVec))));
                        const distSqLeft =
                            tLeft < 0
                                ? RVOMath.RVO_POSITIVEINFINITY
                                : RVOMath.absSq(Vector2.subtract(this.velocity, Vector2.addition(leftCutoff, Vector2.multiply2(tLeft, leftLegDirection))));
                        const distSqRight =
                            tRight < 0
                                ? RVOMath.RVO_POSITIVEINFINITY
                                : RVOMath.absSq(Vector2.subtract(this.velocity, Vector2.addition(rightCutoff, Vector2.multiply2(tRight, rightLegDirection))));
                        if (distSqCutoff <= distSqLeft && distSqCutoff <= distSqRight) {
                            line.direction = Vector2.multiply2(-1, obstacle.direction);
                            line.point = Vector2.addition(
                                leftCutoff,
                                Vector2.multiply2(this.radius * invTimeHorizonObst, new Vector2(-line.direction.y, line.direction.x))
                            );
                            this.orcaLines.push(line);
                        } else if (distSqLeft <= distSqRight) {
                            if (isLeftLegForeign) {
                                continue;
                            }
                            line.direction = leftLegDirection;
                            line.point = Vector2.addition(
                                leftCutoff,
                                Vector2.multiply2(this.radius * invTimeHorizonObst, new Vector2(-line.direction.y, line.direction.x))
                            );
                            this.orcaLines.push(line);
                        } else if (!isRightLegForeign) {
                            line.direction = Vector2.multiply2(-1, rightLegDirection);
                            line.point = Vector2.addition(
                                rightCutoff,
                                Vector2.multiply2(this.radius * invTimeHorizonObst, new Vector2(-line.direction.y, line.direction.x))
                            );
                            this.orcaLines.push(line);
                        }
                    }
                }
            }
        }
        const numObstLines = this.orcaLines.length;
        const invTimeHorizon = 1 / this.timeHorizon;
        for (let i = 0; i < this.agentNeighbors.length; ++i) {
            const other = this.agentNeighbors[i].Value;
            if (other) {
                const invMass = this.mass / (this.mass + other.mass);
                const invMass2 = other.mass / (this.mass + other.mass);
                const thisVelocity =
                    invMass >= 0.5
                        ? this.velocity.minus(this.velocity.scale(invMass)).scale(2)
                        : this.prefVelocity.add(this.velocity.minus(this.prefVelocity).scale(2 * invMass));
                const otherVelocity =
                    invMass2 >= 0.5
                        ? other.velocity.scale(2).scale(1 - invMass2)
                        : other.prefVelocity.add(other.velocity.minus(other.prefVelocity).scale(2 * invMass2));
                const relativePosition = Vector2.subtract(other.position, this.position);
                const relativeVelocity = Vector2.subtract(thisVelocity, otherVelocity);
                const distSq = RVOMath.absSq(relativePosition);
                const combinedRadius = this.radius + other.radius;
                const combinedRadiusSq = RVOMath.sqr(combinedRadius);
                const line = new Line();
                let u = new Vector2();
                if (distSq > combinedRadiusSq) {
                    const w = Vector2.subtract(relativeVelocity, Vector2.multiply2(invTimeHorizon, relativePosition));
                    const wLengthSq = RVOMath.absSq(w);
                    const dotProduct1 = Vector2.multiply(w, relativePosition);
                    if (dotProduct1 < 0 && RVOMath.sqr(dotProduct1) > combinedRadiusSq * wLengthSq) {
                        const wLength = RVOMath.sqrt(wLengthSq);
                        const unitW = Vector2.division(w, wLength);
                        line.direction = new Vector2(unitW.y, -unitW.x);
                        u = Vector2.multiply2(combinedRadius * invTimeHorizon - wLength, unitW);
                    } else {
                        const leg = RVOMath.sqrt(distSq - combinedRadiusSq);
                        if (RVOMath.det(relativePosition, w) > 0) {
                            line.direction = Vector2.division(
                                new Vector2(relativePosition.x * leg - relativePosition.y * combinedRadius, relativePosition.x * combinedRadius + relativePosition.y * leg),
                                distSq
                            );
                        } else {
                            line.direction = Vector2.division(
                                new Vector2(relativePosition.x * leg + relativePosition.y * combinedRadius, -relativePosition.x * combinedRadius + relativePosition.y * leg),
                                -distSq
                            );
                        }
                        const dotProduct2 = Vector2.multiply(relativeVelocity, line.direction);
                        u = Vector2.subtract(Vector2.multiply2(dotProduct2, line.direction), relativeVelocity);
                    }
                } else {
                    const invTimeStep = 1 / Simulator.Instance.timeStep;
                    const w = Vector2.subtract(relativeVelocity, Vector2.multiply2(invTimeStep, relativePosition));
                    const wLength = RVOMath.abs(w);
                    const unitW = Vector2.division(w, wLength);
                    line.direction = new Vector2(unitW.y, -unitW.x);
                    u = Vector2.multiply2(combinedRadius * invTimeStep - wLength, unitW);
                }
                line.point = thisVelocity.add(u.scale(invMass));
                this.orcaLines[this.orcaLines.length] = line;
            }
        }
        const newVelocity = new ObserverObj(new Vector2(this.newVelocity.x, this.newVelocity.y));
        const lineFail = this.linearProgram2(this.orcaLines, this.maxSpeed, this.prefVelocity, false, newVelocity);
        if (lineFail < this.orcaLines.length) {
            this.linearProgram3(this.orcaLines, numObstLines, lineFail, this.maxSpeed, newVelocity);
        }
        this.newVelocity = newVelocity.value;
    }

    public linearProgram1(lines: Line[], lineNo: number, radius: number, optVelocity: Vector2, directionOpt: boolean, result: ObserverObj): boolean {
        const dotProduct = Vector2.multiply(lines[lineNo].point, lines[lineNo].direction);
        const discriminant = RVOMath.sqr(dotProduct) + RVOMath.sqr(radius) - RVOMath.absSq(lines[lineNo].point);
        if (discriminant < 0) {
            return false;
        }
        const sqrtDiscriminant = RVOMath.sqrt(discriminant);
        let tLeft = -dotProduct - sqrtDiscriminant;
        let tRight = -dotProduct + sqrtDiscriminant;
        for (let i = 0; i < lineNo; ++i) {
            const denominator = RVOMath.det(lines[lineNo].direction, lines[i].direction);
            const numerator = RVOMath.det(lines[i].direction, Vector2.subtract(lines[lineNo].point, lines[i].point));
            if (RVOMath.fabs(denominator) <= RVOMath.RVO_EPSILON) {
                if (numerator < 0) {
                    return false;
                }
            } else {
                const t = numerator / denominator;
                if (denominator > 0) {
                    tRight = Math.min(tRight, t);
                } else {
                    tLeft = Math.max(tLeft, t);
                }
                if (tLeft > tRight) {
                    return false;
                }
            }
        }
        if (directionOpt) {
            if (Vector2.multiply(optVelocity, lines[lineNo].direction) > 0) {
                result.value = Vector2.addition(lines[lineNo].point, Vector2.multiply2(tRight, lines[lineNo].direction));
            } else {
                result.value = Vector2.addition(lines[lineNo].point, Vector2.multiply2(tLeft, lines[lineNo].direction));
            }
        } else {
            const t = Vector2.multiply(lines[lineNo].direction, Vector2.subtract(optVelocity, lines[lineNo].point));
            if (t < tLeft) {
                result.value = Vector2.addition(lines[lineNo].point, Vector2.multiply2(tLeft, lines[lineNo].direction));
            } else if (t > tRight) {
                result.value = Vector2.addition(lines[lineNo].point, Vector2.multiply2(tRight, lines[lineNo].direction));
            } else {
                result.value = Vector2.addition(lines[lineNo].point, Vector2.multiply2(t, lines[lineNo].direction));
            }
        }
        return true;
    }

    public linearProgram2(lines: Line[], radius: number, optVelocity: Vector2, directionOpt: boolean, result: ObserverObj): number {
        if (directionOpt) {
            result.value = Vector2.multiply2(radius, optVelocity);
        } else if (RVOMath.absSq(optVelocity) > RVOMath.sqr(radius)) {
            result.value = Vector2.multiply2(radius, RVOMath.normalize(optVelocity));
        } else {
            result.value = optVelocity;
        }
        for (let i = 0; i < lines.length; ++i) {
            if (RVOMath.det(lines[i].direction, Vector2.subtract(lines[i].point, result.value)) > 0) {
                const tempResult = new Vector2(result.value.x, result.value.y);
                if (!this.linearProgram1(lines, i, radius, optVelocity, directionOpt, result)) {
                    result.value = tempResult;
                    return i;
                }
            }
        }
        return lines.length;
    }

    public linearProgram3(lines: Line[], numObstLines: number, beginLine: number, radius: number, result: ObserverObj): void {
        let distance = 0;
        for (let i = beginLine; i < lines.length; ++i) {
            if (RVOMath.det(lines[i].direction, Vector2.subtract(lines[i].point, result.value)) > distance) {
                const projLines: Line[] = [];
                for (let j = 0; j < numObstLines; ++j) {
                    projLines[projLines.length] = lines[j];
                }
                for (let j = numObstLines; j < i; ++j) {
                    const line = new Line();
                    const determinant = RVOMath.det(lines[i].direction, lines[j].direction);
                    if (RVOMath.fabs(determinant) <= RVOMath.RVO_EPSILON) {
                        if (Vector2.multiply(lines[i].direction, lines[j].direction) > 0) {
                            continue;
                        }
                        line.point = Vector2.multiply2(0.5, Vector2.addition(lines[i].point, lines[j].point));
                    } else {
                        line.point = Vector2.addition(
                            lines[i].point,
                            Vector2.multiply2(
                                RVOMath.det(lines[j].direction, Vector2.subtract(lines[i].point, lines[j].point)) / determinant,
                                lines[i].direction
                            )
                        );
                    }
                    line.direction = RVOMath.normalize(Vector2.subtract(lines[j].direction, lines[i].direction));
                    projLines[projLines.length] = line;
                }
                const tempResult = new Vector2(result.value.x, result.value.y);
                if (this.linearProgram2(projLines, radius, new Vector2(-lines[i].direction.y, lines[i].direction.x), true, result) < projLines.length) {
                    result.value = tempResult;
                }
                distance = RVOMath.det(lines[i].direction, Vector2.subtract(lines[i].point, result.value));
            }
        }
    }
}