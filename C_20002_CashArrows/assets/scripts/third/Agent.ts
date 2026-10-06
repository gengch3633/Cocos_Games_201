import commonDefine from "./commonDefine";
import RVOMath from "./RVOMath";
import Simulator from "./Simulator";
import Vector2 from "./Vector2";

const KeyValuePair = (commonDefine as any).KeyValuePair;
const ObserverObj = (commonDefine as any).ObserverObj;

type MutableRef<T> = { value: T };

interface OrcaLine {
    point: Vector2;
    direction: Vector2;
}

export default class Agent {
    agentNeighbors: KeyValuePair<number, Agent>[] = [];
    obstacleNeighbors: KeyValuePair<number, any>[] = [];
    orcaLines: OrcaLine[] = [];
    prefVelocity = new Vector2(0, 0);
    mass = 1;
    calc = true;
    newVelocity = new Vector2(0, 0);

    position!: Vector2;
    velocity!: Vector2;
    radius!: number;
    maxSpeed!: number;
    maxNeighbors!: number;
    neighborDist!: number;
    timeHorizon!: number;
    timeHorizonObst!: number;

    update(): void {
        this.velocity = this.newVelocity;
        this.position = Vector2.addition(this.position, Vector2.multiply2(Simulator.Instance.timeStep, this.velocity));
    }

    insertObstacleNeighbor(obstacle: any, rangeSq: number): void {
        const next = obstacle.next;
        const distSq = RVOMath.distSqPointLineSegment(obstacle.point, next.point, this.position);
        if (distSq < rangeSq) {
            this.obstacleNeighbors.push(new KeyValuePair(distSq, obstacle));
            for (let i = this.obstacleNeighbors.length - 1; i !== 0 && distSq < this.obstacleNeighbors[i - 1].Key; ) {
                this.obstacleNeighbors[i] = this.obstacleNeighbors[i - 1];
                --i;
            }
            this.obstacleNeighbors[i] = new KeyValuePair(distSq, obstacle);
        }
    }

    insertAgentNeighbor(other: Agent, rangeSq: MutableRef<number>): void {
        if (other && this !== other) {
            const distSq = RVOMath.absSq(Vector2.subtract(this.position, other.position));
            if (distSq < rangeSq.value) {
                if (this.agentNeighbors.length < this.maxNeighbors) {
                    this.agentNeighbors.push(new KeyValuePair(distSq, other));
                }
                for (let i = this.agentNeighbors.length - 1; i !== 0 && distSq < this.agentNeighbors[i - 1].Key; ) {
                    this.agentNeighbors[i] = this.agentNeighbors[i - 1];
                    --i;
                }
                this.agentNeighbors[i] = new KeyValuePair(distSq, other);
                if (this.agentNeighbors.length === this.maxNeighbors) {
                    rangeSq.value = this.agentNeighbors[this.agentNeighbors.length - 1].Key;
                }
            }
        }
    }

    computeNeighbors(): void {
        this.obstacleNeighbors = [];
        const obstacleRange = RVOMath.sqr(this.timeHorizonObst * this.maxSpeed + this.radius);
        Simulator.Instance.kdTree.computeObstacleNeighbors(this, obstacleRange);
        this.agentNeighbors = [];
        if (this.maxNeighbors > 0) {
            const rangeSq = new ObserverObj<number>();
            rangeSq.value = RVOMath.sqr(this.neighborDist);
            Simulator.Instance.kdTree.computeAgentNeighbors(this, rangeSq);
        }
    }

    computeNewVelocity(): void {
        this.orcaLines = [];
        const invTimeHorizonObst = 1 / this.timeHorizonObst;

        for (let i = 0; i < this.obstacleNeighbors.length; ++i) {
            let obstacle1 = this.obstacleNeighbors[i].Value;
            let obstacle2 = obstacle1.next;
            const relativePoint1 = Vector2.subtract(obstacle1.point, this.position);
            const relativePoint2 = Vector2.subtract(obstacle2.point, this.position);
            let alreadyCovered = false;

            for (let j = 0; j < this.orcaLines.length; ++j) {
                if (
                    RVOMath.det(Vector2.subtract(Vector2.multiply2(invTimeHorizonObst, relativePoint1), this.orcaLines[j].point), this.orcaLines[j].direction) -
                        invTimeHorizonObst * this.radius >=
                        -RVOMath.RVO_EPSILON &&
                    RVOMath.det(Vector2.subtract(Vector2.multiply2(invTimeHorizonObst, relativePoint2), this.orcaLines[j].point), this.orcaLines[j].direction) -
                        invTimeHorizonObst * this.radius >=
                        -RVOMath.RVO_EPSILON
                ) {
                    alreadyCovered = true;
                    break;
                }
            }

            if (!alreadyCovered) {
                const distSq1 = RVOMath.absSq(relativePoint1);
                const distSq2 = RVOMath.absSq(relativePoint2);
                const radiusSq = RVOMath.sqr(this.radius);
                const obstacleVector = Vector2.subtract(obstacle2.point, obstacle1.point);
                const projection = Vector2.multiply(Vector2.multiply2(-1, relativePoint1), obstacleVector) / RVOMath.absSq(obstacleVector);
                const distSqLine = RVOMath.absSq(Vector2.subtract(Vector2.multiply2(-1, relativePoint1), Vector2.multiply2(projection, obstacleVector)));
                const line = {} as OrcaLine;

                if (projection < 0 && distSq1 <= radiusSq) {
                    if (obstacle1.convex) {
                        line.point = new Vector2(0, 0);
                        line.direction = RVOMath.normalize(new Vector2(-relativePoint1.y, relativePoint1.x));
                        this.orcaLines.push(line);
                    }
                } else if (projection > 1 && distSq2 <= radiusSq) {
                    if (obstacle2.convex && RVOMath.det(relativePoint2, obstacle2.direction) >= 0) {
                        line.point = new Vector2(0, 0);
                        line.direction = RVOMath.normalize(new Vector2(-relativePoint2.y, relativePoint2.x));
                        this.orcaLines.push(line);
                    }
                } else if (projection >= 0 && projection < 1 && distSqLine <= radiusSq) {
                    line.point = new Vector2(0, 0);
                    line.direction = Vector2.multiply2(-1, obstacle1.direction);
                    this.orcaLines.push(line);
                } else {
                    let leftLegDirection: Vector2;
                    let rightLegDirection: Vector2;

                    if (projection < 0 && distSqLine <= radiusSq) {
                        if (!obstacle1.convex) {
                            continue;
                        }
                        obstacle2 = obstacle1;
                        const sqrtDist = RVOMath.sqrt(distSq1 - radiusSq);
                        leftLegDirection = Vector2.division(
                            new Vector2(relativePoint1.x * sqrtDist - relativePoint1.y * this.radius, relativePoint1.x * this.radius + relativePoint1.y * sqrtDist),
                            distSq1,
                        );
                        rightLegDirection = Vector2.division(
                            new Vector2(relativePoint1.x * sqrtDist + relativePoint1.y * this.radius, -relativePoint1.x * this.radius + relativePoint1.y * sqrtDist),
                            distSq1,
                        );
                    } else if (projection > 1 && distSqLine <= radiusSq) {
                        if (!obstacle2.convex) {
                            continue;
                        }
                        obstacle1 = obstacle2;
                        const sqrtDist = RVOMath.sqrt(distSq2 - radiusSq);
                        leftLegDirection = Vector2.division(
                            new Vector2(relativePoint2.x * sqrtDist - relativePoint2.y * this.radius, relativePoint2.x * this.radius + relativePoint2.y * sqrtDist),
                            distSq2,
                        );
                        rightLegDirection = Vector2.division(
                            new Vector2(relativePoint2.x * sqrtDist + relativePoint2.y * this.radius, -relativePoint2.x * this.radius + relativePoint2.y * sqrtDist),
                            distSq2,
                        );
                    } else {
                        if (obstacle1.convex) {
                            const sqrtDist = RVOMath.sqrt(distSq1 - radiusSq);
                            leftLegDirection = Vector2.division(
                                new Vector2(relativePoint1.x * sqrtDist - relativePoint1.y * this.radius, relativePoint1.x * this.radius + relativePoint1.y * sqrtDist),
                                distSq1,
                            );
                        } else {
                            leftLegDirection = Vector2.multiply2(-1, obstacle1.direction);
                        }
                        if (obstacle2.convex) {
                            const sqrtDist = RVOMath.sqrt(distSq2 - radiusSq);
                            rightLegDirection = Vector2.division(
                                new Vector2(relativePoint2.x * sqrtDist - relativePoint2.y * this.radius, relativePoint2.x * this.radius + relativePoint2.y * sqrtDist),
                                distSq2,
                            );
                        } else {
                            rightLegDirection = Vector2.multiply2(-1, obstacle2.direction);
                        }
                    }

                    const prevObstacle = obstacle1.previous;
                    let leftNeighborConvex = false;
                    let rightNeighborConvex = false;
                    if (obstacle1.convex && RVOMath.det(leftLegDirection, Vector2.multiply2(-1, prevObstacle.direction)) >= 0) {
                        leftLegDirection = Vector2.multiply2(-1, prevObstacle.direction);
                        leftNeighborConvex = true;
                    }
                    if (obstacle2.convex && RVOMath.det(rightLegDirection, Vector2.multiply2(-1, obstacle2.direction)) <= 0) {
                        rightLegDirection = obstacle2.direction;
                        rightNeighborConvex = true;
                    }

                    const leftCutoff = Vector2.multiply2(invTimeHorizonObst, Vector2.subtract(obstacle1.point, this.position));
                    const rightCutoff = Vector2.multiply2(invTimeHorizonObst, Vector2.subtract(obstacle2.point, this.position));
                    const cutoffVector = Vector2.subtract(rightCutoff, leftCutoff);
                    const projectionOnCutoff =
                        obstacle1 === obstacle2
                            ? 0.5
                            : Vector2.multiply(Vector2.subtract(this.velocity, leftCutoff), cutoffVector) / RVOMath.absSq(cutoffVector);
                    const projectionOnLeft = Vector2.multiply(Vector2.subtract(this.velocity, leftCutoff), leftLegDirection);
                    const projectionOnRight = Vector2.multiply(Vector2.subtract(this.velocity, rightCutoff), rightLegDirection);

                    if ((projectionOnCutoff < 0 && projectionOnLeft < 0) || (obstacle1 === obstacle2 && projectionOnLeft < 0 && projectionOnRight < 0)) {
                        const unitW = RVOMath.normalize(Vector2.subtract(this.velocity, leftCutoff));
                        line.direction = new Vector2(unitW.y, -unitW.x);
                        line.point = Vector2.addition(leftCutoff, Vector2.multiply2(this.radius * invTimeHorizonObst, unitW));
                        this.orcaLines.push(line);
                    } else if (projectionOnCutoff > 1 && projectionOnRight < 0) {
                        const unitW = RVOMath.normalize(Vector2.subtract(this.velocity, rightCutoff));
                        line.direction = new Vector2(unitW.y, -unitW.x);
                        line.point = Vector2.addition(rightCutoff, Vector2.multiply2(this.radius * invTimeHorizonObst, unitW));
                        this.orcaLines.push(line);
                    } else {
                        const distSqCutoff =
                            projectionOnCutoff < 0 || projectionOnCutoff > 1 || obstacle1 === obstacle2
                                ? RVOMath.RVO_POSITIVEINFINITY
                                : RVOMath.absSq(Vector2.subtract(this.velocity, Vector2.addition(leftCutoff, Vector2.multiply2(projectionOnCutoff, cutoffVector))));
                        const distSqLeft =
                            projectionOnLeft < 0
                                ? RVOMath.RVO_POSITIVEINFINITY
                                : RVOMath.absSq(Vector2.subtract(this.velocity, Vector2.addition(leftCutoff, Vector2.multiply2(projectionOnLeft, leftLegDirection))));
                        const distSqRight =
                            projectionOnRight < 0
                                ? RVOMath.RVO_POSITIVEINFINITY
                                : RVOMath.absSq(Vector2.subtract(this.velocity, Vector2.addition(rightCutoff, Vector2.multiply2(projectionOnRight, rightLegDirection))));

                        if (distSqCutoff <= distSqLeft && distSqCutoff <= distSqRight) {
                            line.direction = Vector2.multiply2(-1, obstacle1.direction);
                            line.point = Vector2.addition(
                                leftCutoff,
                                Vector2.multiply2(this.radius * invTimeHorizonObst, new Vector2(-line.direction.y, line.direction.x)),
                            );
                            this.orcaLines.push(line);
                        } else if (distSqLeft <= distSqRight) {
                            if (leftNeighborConvex) {
                                continue;
                            }
                            line.direction = leftLegDirection;
                            line.point = Vector2.addition(
                                leftCutoff,
                                Vector2.multiply2(this.radius * invTimeHorizonObst, new Vector2(-line.direction.y, line.direction.x)),
                            );
                            this.orcaLines.push(line);
                        } else if (!rightNeighborConvex) {
                            line.direction = Vector2.multiply2(-1, rightLegDirection);
                            line.point = Vector2.addition(
                                rightCutoff,
                                Vector2.multiply2(this.radius * invTimeHorizonObst, new Vector2(-line.direction.y, line.direction.x)),
                            );
                            this.orcaLines.push(line);
                        }
                    }
                }
            }
        }

        const numObstacleLines = this.orcaLines.length;
        const invTimeHorizon = 1 / this.timeHorizon;

        for (let i = 0; i < this.agentNeighbors.length; ++i) {
            const other = this.agentNeighbors[i].Value;
            if (other) {
                const massRatio = this.mass / (this.mass + other.mass);
                const otherMassRatio = other.mass / (this.mass + other.mass);
                const velocityOpt =
                    massRatio >= 0.5
                        ? this.velocity.minus(this.velocity.scale(massRatio)).scale(2)
                        : this.prefVelocity.add(this.velocity.minus(this.prefVelocity).scale(2 * massRatio));
                const otherVelocityOpt =
                    otherMassRatio >= 0.5
                        ? other.velocity.scale(2).scale(1 - otherMassRatio)
                        : other.prefVelocity.add(other.velocity.minus(other.prefVelocity).scale(2 * otherMassRatio));
                const relativePosition = Vector2.subtract(other.position, this.position);
                const relativeVelocity = Vector2.subtract(velocityOpt, otherVelocityOpt);
                const distSq = RVOMath.absSq(relativePosition);
                const combinedRadius = this.radius + other.radius;
                const combinedRadiusSq = RVOMath.sqr(combinedRadius);
                const line = {} as OrcaLine;
                let resultOffset = new Vector2();

                if (distSq > combinedRadiusSq) {
                    const w = Vector2.subtract(relativeVelocity, Vector2.multiply2(invTimeHorizon, relativePosition));
                    const wLengthSq = RVOMath.absSq(w);
                    const dotProduct = Vector2.multiply(w, relativePosition);
                    if (dotProduct < 0 && RVOMath.sqr(dotProduct) > combinedRadiusSq * wLengthSq) {
                        const wLength = RVOMath.sqrt(wLengthSq);
                        const unitW = Vector2.division(w, wLength);
                        line.direction = new Vector2(unitW.y, -unitW.x);
                        resultOffset = Vector2.multiply2(combinedRadius * invTimeHorizon - wLength, unitW);
                    } else {
                        const leg = RVOMath.sqrt(distSq - combinedRadiusSq);
                        line.direction =
                            RVOMath.det(relativePosition, w) > 0
                                ? Vector2.division(
                                      new Vector2(relativePosition.x * leg - relativePosition.y * combinedRadius, relativePosition.x * combinedRadius + relativePosition.y * leg),
                                      distSq,
                                  )
                                : Vector2.division(
                                      new Vector2(relativePosition.x * leg + relativePosition.y * combinedRadius, -relativePosition.x * combinedRadius + relativePosition.y * leg),
                                      -distSq,
                                  );
                        const dotProduct2 = Vector2.multiply(relativeVelocity, line.direction);
                        resultOffset = Vector2.subtract(Vector2.multiply2(dotProduct2, line.direction), relativeVelocity);
                    }
                } else {
                    const invTimeStep = 1 / Simulator.Instance.timeStep;
                    const w = Vector2.subtract(relativeVelocity, Vector2.multiply2(invTimeStep, relativePosition));
                    const wLength = RVOMath.abs(w);
                    const unitW = Vector2.division(w, wLength);
                    line.direction = new Vector2(unitW.y, -unitW.x);
                    resultOffset = Vector2.multiply2(combinedRadius * invTimeStep - wLength, unitW);
                }

                line.point = velocityOpt.add(resultOffset.scale(massRatio));
                this.orcaLines[this.orcaLines.length] = line;
            }
        }

        const result = new ObserverObj<Vector2>(new Vector2(this.newVelocity.x, this.newVelocity.y));
        const failedLine = this.linearProgram2(this.orcaLines, this.maxSpeed, this.prefVelocity, false, result);
        if (failedLine < this.orcaLines.length) {
            this.linearProgram3(this.orcaLines, numObstacleLines, failedLine, this.maxSpeed, result);
        }
        this.newVelocity = result.value;
    }

    linearProgram1(lines: OrcaLine[], lineNo: number, radius: number, optVelocity: Vector2, directionOpt: boolean, result: MutableRef<Vector2>): boolean {
        const dotProduct = Vector2.multiply(lines[lineNo].point, lines[lineNo].direction);
        const discriminant = RVOMath.sqr(dotProduct) + RVOMath.sqr(radius) - RVOMath.absSq(lines[lineNo].point);
        if (discriminant < 0) {
            return false;
        }

        const sqrtDiscriminant = RVOMath.sqrt(discriminant);
        let tLeft = -dotProduct - sqrtDiscriminant;
        let tRight = -dotProduct + sqrtDiscriminant;

        for (let i = 0; i < lineNo; ++i) {
            const determinant = RVOMath.det(lines[lineNo].direction, lines[i].direction);
            const numerator = RVOMath.det(lines[i].direction, Vector2.subtract(lines[lineNo].point, lines[i].point));
            if (RVOMath.fabs(determinant) <= RVOMath.RVO_EPSILON) {
                if (numerator < 0) {
                    return false;
                }
            } else {
                const t = numerator / determinant;
                if (determinant > 0) {
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

    linearProgram2(lines: OrcaLine[], radius: number, optVelocity: Vector2, directionOpt: boolean, result: MutableRef<Vector2>): number {
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

    linearProgram3(lines: OrcaLine[], numObstacleLines: number, beginLine: number, radius: number, result: MutableRef<Vector2>): void {
        let distance = 0;
        for (let i = beginLine; i < lines.length; ++i) {
            if (RVOMath.det(lines[i].direction, Vector2.subtract(lines[i].point, result.value)) > distance) {
                const projectedLines: OrcaLine[] = [];
                for (let j = 0; j < numObstacleLines; ++j) {
                    projectedLines.push(lines[j]);
                }
                for (let j = numObstacleLines; j < i; ++j) {
                    const line = {} as OrcaLine;
                    const determinant = RVOMath.det(lines[i].direction, lines[j].direction);
                    if (RVOMath.fabs(determinant) <= RVOMath.RVO_EPSILON) {
                        if (Vector2.multiply(lines[i].direction, lines[j].direction) > 0) {
                            continue;
                        }
                        line.point = Vector2.multiply2(0.5, Vector2.addition(lines[i].point, lines[j].point));
                    } else {
                        line.point = Vector2.addition(
                            lines[i].point,
                            Vector2.multiply2(RVOMath.det(lines[j].direction, Vector2.subtract(lines[i].point, lines[j].point)) / determinant, lines[i].direction),
                        );
                    }
                    line.direction = RVOMath.normalize(Vector2.subtract(lines[j].direction, lines[i].direction));
                    projectedLines.push(line);
                }

                const tempResult = new Vector2(result.value.x, result.value.y);
                if (this.linearProgram2(projectedLines, radius, new Vector2(-lines[i].direction.y, lines[i].direction.x), true, result) < projectedLines.length) {
                    result.value = tempResult;
                }
                distance = RVOMath.det(lines[i].direction, Vector2.subtract(lines[i].point, result.value));
            }
        }
    }
}
