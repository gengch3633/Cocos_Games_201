import { KeyValuePair, ObserverObj } from "./commonDefine";
import Line from "./Line";
import RVOMath from "./RVOMath";
import Simulator from "./Simulator";
import Vector2 from "./Vector2";

export default class Agent {
    agentNeighbors: KeyValuePair<number, Agent>[] = [];
    obstacleNeighbors: KeyValuePair<number, any>[] = [];
    orcaLines: Line[] = [];
    prefVelocity: Vector2 = new Vector2(0, 0);
    mass: number = 1;
    calc: boolean = true;
    newVelocity: Vector2 = new Vector2(0, 0);

    id!: number;
    position!: Vector2;
    velocity!: Vector2;
    maxNeighbors!: number;
    radius!: number;
    maxSpeed!: number;
    neighborDist!: number;
    timeHorizon!: number;
    timeHorizonObst!: number;

    update(): void {
        this.velocity = this.newVelocity;
        const newPosition = Vector2.addition(
            this.position,
            Vector2.multiply2(Simulator.Instance.timeStep, this.velocity)
        );
        this.position = newPosition;
    }

    insertObstacleNeighbor(obstacle: any, rangeSq: number): void {
        const nextObstacle = obstacle.next;
        const distSq = RVOMath.distSqPointLineSegment(
            obstacle.point,
            nextObstacle.point,
            this.position
        );
        if (distSq < rangeSq) {
            this.obstacleNeighbors.push(new KeyValuePair(distSq, obstacle));
            let index = this.obstacleNeighbors.length - 1;
            while (
                index !== 0 &&
                distSq < this.obstacleNeighbors[index - 1].Key
            ) {
                this.obstacleNeighbors[index] =
                    this.obstacleNeighbors[index - 1];
                --index;
            }
            this.obstacleNeighbors[index] = new KeyValuePair(distSq, obstacle);
        }
    }

    insertAgentNeighbor(agent: Agent, rangeSq: ObserverObj<number>): void {
        if (agent && this !== agent) {
            const distSq = RVOMath.absSq(
                Vector2.subtract(this.position, agent.position)
            );
            if (distSq < rangeSq.value) {
                if (this.agentNeighbors.length < this.maxNeighbors) {
                    this.agentNeighbors.push(new KeyValuePair(distSq, agent));
                }
                let index = this.agentNeighbors.length - 1;
                while (
                    index !== 0 &&
                    distSq < this.agentNeighbors[index - 1].Key
                ) {
                    this.agentNeighbors[index] =
                        this.agentNeighbors[index - 1];
                    --index;
                }
                this.agentNeighbors[index] = new KeyValuePair(distSq, agent);
                if (this.agentNeighbors.length === this.maxNeighbors) {
                    rangeSq.value =
                        this.agentNeighbors[this.agentNeighbors.length - 1].Key;
                }
            }
        }
    }

    computeNeighbors(): void {
        this.obstacleNeighbors = [];
        const rangeSq = RVOMath.sqr(
            this.timeHorizonObst * this.maxSpeed + this.radius
        );
        Simulator.Instance.kdTree.computeObstacleNeighbors(this, rangeSq);
        this.agentNeighbors = [];
        if (this.maxNeighbors > 0) {
            const observer = new ObserverObj<number>();
            observer.value = RVOMath.sqr(this.neighborDist);
            Simulator.Instance.kdTree.computeAgentNeighbors(this, observer);
        }
    }

    computeNewVelocity(): void {
        this.orcaLines = [];
        const invTimeHorizonObst = 1 / this.timeHorizonObst;
        for (
            let obstacleIndex = 0;
            obstacleIndex < this.obstacleNeighbors.length;
            ++obstacleIndex
        ) {
            let obstacle = this.obstacleNeighbors[obstacleIndex].Value;
            let nextObstacle = obstacle.next;
            let relativePoint1 = Vector2.subtract(
                obstacle.point,
                this.position
            );
            let relativePoint2 = Vector2.subtract(
                nextObstacle.point,
                this.position
            );
            let alreadyCovered = false;
            for (
                let lineIndex = 0;
                lineIndex < this.orcaLines.length;
                ++lineIndex
            ) {
                if (
                    RVOMath.det(
                        Vector2.subtract(
                            Vector2.multiply2(invTimeHorizonObst, relativePoint1),
                            this.orcaLines[lineIndex].point
                        ),
                        this.orcaLines[lineIndex].direction
                    ) -
                        invTimeHorizonObst * this.radius >=
                        -RVOMath.RVO_EPSILON &&
                    RVOMath.det(
                        Vector2.subtract(
                            Vector2.multiply2(invTimeHorizonObst, relativePoint2),
                            this.orcaLines[lineIndex].point
                        ),
                        this.orcaLines[lineIndex].direction
                    ) -
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
                const obstacleVector = Vector2.subtract(
                    nextObstacle.point,
                    obstacle.point
                );
                const projection =
                    Vector2.multiply(
                        Vector2.multiply2(-1, relativePoint1),
                        obstacleVector
                    ) / RVOMath.absSq(obstacleVector);
                const distSqLine = RVOMath.absSq(
                    Vector2.subtract(
                        Vector2.multiply2(-1, relativePoint1),
                        Vector2.multiply2(projection, obstacleVector)
                    )
                );
                let line = new Line();
                if (projection < 0 && distSq1 <= radiusSq) {
                    if (obstacle.convex) {
                        line.point = new Vector2(0, 0);
                        line.direction = RVOMath.normalize(
                            new Vector2(-relativePoint1.y, relativePoint1.x)
                        );
                        this.orcaLines.push(line);
                    }
                } else if (projection > 1 && distSq2 <= radiusSq) {
                    if (
                        nextObstacle.convex &&
                        RVOMath.det(relativePoint2, nextObstacle.direction) >= 0
                    ) {
                        line.point = new Vector2(0, 0);
                        line.direction = RVOMath.normalize(
                            new Vector2(-relativePoint2.y, relativePoint2.x)
                        );
                        this.orcaLines.push(line);
                    }
                } else if (
                    projection >= 0 &&
                    projection < 1 &&
                    distSqLine <= radiusSq
                ) {
                    line.point = new Vector2(0, 0);
                    line.direction = Vector2.multiply2(-1, obstacle.direction);
                    this.orcaLines.push(line);
                } else {
                    let leftLeg: Vector2;
                    let rightLeg: Vector2;
                    if (projection < 0 && distSqLine <= radiusSq) {
                        if (!obstacle.convex) {
                            continue;
                        }
                        nextObstacle = obstacle;
                        const sqrtDist = RVOMath.sqrt(distSq1 - radiusSq);
                        leftLeg = Vector2.division(
                            new Vector2(
                                relativePoint1.x * sqrtDist -
                                    relativePoint1.y * this.radius,
                                relativePoint1.x * this.radius +
                                    relativePoint1.y * sqrtDist
                            ),
                            distSq1
                        );
                        rightLeg = Vector2.division(
                            new Vector2(
                                relativePoint1.x * sqrtDist +
                                    relativePoint1.y * this.radius,
                                -relativePoint1.x * this.radius +
                                    relativePoint1.y * sqrtDist
                            ),
                            distSq1
                        );
                    } else if (projection > 1 && distSqLine <= radiusSq) {
                        if (!nextObstacle.convex) {
                            continue;
                        }
                        obstacle = nextObstacle;
                        const sqrtDist = RVOMath.sqrt(distSq2 - radiusSq);
                        leftLeg = Vector2.division(
                            new Vector2(
                                relativePoint2.x * sqrtDist -
                                    relativePoint2.y * this.radius,
                                relativePoint2.x * this.radius +
                                    relativePoint2.y * sqrtDist
                            ),
                            distSq2
                        );
                        rightLeg = Vector2.division(
                            new Vector2(
                                relativePoint2.x * sqrtDist +
                                    relativePoint2.y * this.radius,
                                -relativePoint2.x * this.radius +
                                    relativePoint2.y * sqrtDist
                            ),
                            distSq2
                        );
                    } else {
                        if (obstacle.convex) {
                            const sqrtDist = RVOMath.sqrt(distSq1 - radiusSq);
                            leftLeg = Vector2.division(
                                new Vector2(
                                    relativePoint1.x * sqrtDist -
                                        relativePoint1.y * this.radius,
                                    relativePoint1.x * this.radius +
                                        relativePoint1.y * sqrtDist
                                ),
                                distSq1
                            );
                        } else {
                            leftLeg = Vector2.multiply2(-1, obstacle.direction);
                        }
                        if (nextObstacle.convex) {
                            const sqrtDist = RVOMath.sqrt(distSq2 - radiusSq);
                            rightLeg = Vector2.division(
                                new Vector2(
                                    relativePoint2.x * sqrtDist -
                                        relativePoint2.y * this.radius,
                                    relativePoint2.x * this.radius +
                                        relativePoint2.y * sqrtDist
                                ),
                                distSq2
                            );
                        } else {
                            rightLeg = Vector2.multiply2(
                                -1,
                                nextObstacle.direction
                            );
                        }
                    }
                    const prevObstacle = obstacle.previous;
                    let isLeftLegForeign = false;
                    let isRightLegForeign = false;
                    if (
                        obstacle.convex &&
                        RVOMath.det(
                            leftLeg,
                            Vector2.multiply2(-1, prevObstacle.direction)
                        ) >= 0
                    ) {
                        leftLeg = Vector2.multiply2(-1, prevObstacle.direction);
                        isLeftLegForeign = true;
                    }
                    if (
                        nextObstacle.convex &&
                        RVOMath.det(
                            rightLeg,
                            Vector2.multiply2(-1, nextObstacle.direction)
                        ) <= 0
                    ) {
                        rightLeg = nextObstacle.direction;
                        isRightLegForeign = true;
                    }
                    const leftCutoff = Vector2.multiply2(
                        invTimeHorizonObst,
                        Vector2.subtract(obstacle.point, this.position)
                    );
                    const rightCutoff = Vector2.multiply2(
                        invTimeHorizonObst,
                        Vector2.subtract(nextObstacle.point, this.position)
                    );
                    const cutoffVector = Vector2.subtract(
                        rightCutoff,
                        leftCutoff
                    );
                    const projectionParam =
                        obstacle === nextObstacle
                            ? 0.5
                            : Vector2.multiply(
                                  Vector2.subtract(this.velocity, leftCutoff),
                                  cutoffVector
                              ) / RVOMath.absSq(cutoffVector);
                    const leftParam = Vector2.multiply(
                        Vector2.subtract(this.velocity, leftCutoff),
                        leftLeg
                    );
                    const rightParam = Vector2.multiply(
                        Vector2.subtract(this.velocity, rightCutoff),
                        rightLeg
                    );
                    if (
                        (projectionParam < 0 && leftParam < 0) ||
                        (obstacle === nextObstacle &&
                            leftParam < 0 &&
                            rightParam < 0)
                    ) {
                        let unitW = RVOMath.normalize(
                            Vector2.subtract(this.velocity, leftCutoff)
                        );
                        line.direction = new Vector2(unitW.y, -unitW.x);
                        line.point = Vector2.addition(
                            leftCutoff,
                            Vector2.multiply2(
                                this.radius * invTimeHorizonObst,
                                unitW
                            )
                        );
                        this.orcaLines.push(line);
                    } else if (projectionParam > 1 && rightParam < 0) {
                        let unitW = RVOMath.normalize(
                            Vector2.subtract(this.velocity, rightCutoff)
                        );
                        line.direction = new Vector2(unitW.y, -unitW.x);
                        line.point = Vector2.addition(
                            rightCutoff,
                            Vector2.multiply2(
                                this.radius * invTimeHorizonObst,
                                unitW
                            )
                        );
                        this.orcaLines.push(line);
                    } else {
                        const distSqCutoff =
                            projectionParam < 0 ||
                            projectionParam > 1 ||
                            obstacle === nextObstacle
                                ? RVOMath.RVO_POSITIVEINFINITY
                                : RVOMath.absSq(
                                      Vector2.subtract(
                                          this.velocity,
                                          Vector2.addition(
                                              leftCutoff,
                                              Vector2.multiply2(
                                                  projectionParam,
                                                  cutoffVector
                                              )
                                          )
                                      )
                                  );
                        const distSqLeft =
                            leftParam < 0
                                ? RVOMath.RVO_POSITIVEINFINITY
                                : RVOMath.absSq(
                                      Vector2.subtract(
                                          this.velocity,
                                          Vector2.addition(
                                              leftCutoff,
                                              Vector2.multiply2(
                                                  leftParam,
                                                  leftLeg
                                              )
                                          )
                                      )
                                  );
                        const distSqRight =
                            rightParam < 0
                                ? RVOMath.RVO_POSITIVEINFINITY
                                : RVOMath.absSq(
                                      Vector2.subtract(
                                          this.velocity,
                                          Vector2.addition(
                                              rightCutoff,
                                              Vector2.multiply2(
                                                  rightParam,
                                                  rightLeg
                                              )
                                          )
                                      )
                                  );
                        if (distSqCutoff <= distSqLeft && distSqCutoff <= distSqRight) {
                            line.direction = Vector2.multiply2(
                                -1,
                                obstacle.direction
                            );
                            line.point = Vector2.addition(
                                leftCutoff,
                                Vector2.multiply2(
                                    this.radius * invTimeHorizonObst,
                                    new Vector2(
                                        -line.direction.y,
                                        line.direction.x
                                    )
                                )
                            );
                            this.orcaLines.push(line);
                        } else if (distSqLeft <= distSqRight) {
                            if (isLeftLegForeign) {
                                continue;
                            }
                            line.direction = leftLeg;
                            line.point = Vector2.addition(
                                leftCutoff,
                                Vector2.multiply2(
                                    this.radius * invTimeHorizonObst,
                                    new Vector2(
                                        -line.direction.y,
                                        line.direction.x
                                    )
                                )
                            );
                            this.orcaLines.push(line);
                        } else if (!isRightLegForeign) {
                            line.direction = Vector2.multiply2(-1, rightLeg);
                            line.point = Vector2.addition(
                                rightCutoff,
                                Vector2.multiply2(
                                    this.radius * invTimeHorizonObst,
                                    new Vector2(
                                        -line.direction.y,
                                        line.direction.x
                                    )
                                )
                            );
                            this.orcaLines.push(line);
                        }
                    }
                }
            }
        }
        const numObstacleLines = this.orcaLines.length;
        const invTimeHorizon = 1 / this.timeHorizon;
        for (
            let agentIndex = 0;
            agentIndex < this.agentNeighbors.length;
            ++agentIndex
        ) {
            const other = this.agentNeighbors[agentIndex].Value;
            if (other) {
                const massRatio =
                    this.mass / (this.mass + other.mass);
                const otherMassRatio =
                    other.mass / (this.mass + other.mass);
                const velocityOpt =
                    massRatio >= 0.5
                        ? this.velocity
                              .minus(this.velocity.scale(massRatio))
                              .scale(2)
                        : this.prefVelocity.add(
                              this.velocity
                                  .minus(this.prefVelocity)
                                  .scale(2 * massRatio)
                          );
                const otherVelocityOpt =
                    otherMassRatio >= 0.5
                        ? other.velocity.scale(2).scale(1 - otherMassRatio)
                        : other.prefVelocity.add(
                              other.velocity
                                  .minus(other.prefVelocity)
                                  .scale(2 * otherMassRatio)
                          );
                const relativePosition = Vector2.subtract(
                    other.position,
                    this.position
                );
                const relativeVelocity = Vector2.subtract(
                    velocityOpt,
                    otherVelocityOpt
                );
                const distSq = RVOMath.absSq(relativePosition);
                const combinedRadius = this.radius + other.radius;
                const combinedRadiusSq = RVOMath.sqr(combinedRadius);
                const line = new Line();
                let linePoint = new Vector2();
                if (distSq > combinedRadiusSq) {
                    const w = Vector2.subtract(
                        relativeVelocity,
                        Vector2.multiply2(invTimeHorizon, relativePosition)
                    );
                    const wLengthSq = RVOMath.absSq(w);
                    const dotProduct = Vector2.multiply(w, relativePosition);
                    if (
                        dotProduct < 0 &&
                        RVOMath.sqr(dotProduct) >
                            combinedRadiusSq * wLengthSq
                    ) {
                        const wLength = RVOMath.sqrt(wLengthSq);
                        const unitW = Vector2.division(w, wLength);
                        line.direction = new Vector2(unitW.y, -unitW.x);
                        linePoint = Vector2.multiply2(
                            combinedRadius * invTimeHorizon - wLength,
                            unitW
                        );
                    } else {
                        const leg = RVOMath.sqrt(distSq - combinedRadiusSq);
                        line.direction =
                            RVOMath.det(relativePosition, w) > 0
                                ? Vector2.division(
                                      new Vector2(
                                          relativePosition.x * leg -
                                              relativePosition.y *
                                                  combinedRadius,
                                          relativePosition.x * combinedRadius +
                                              relativePosition.y * leg
                                      ),
                                      distSq
                                  )
                                : Vector2.division(
                                      new Vector2(
                                          relativePosition.x * leg +
                                              relativePosition.y *
                                                  combinedRadius,
                                          -relativePosition.x *
                                              combinedRadius +
                                              relativePosition.y * leg
                                      ),
                                      -distSq
                                  );
                        const dotProduct2 = Vector2.multiply(
                            relativeVelocity,
                            line.direction
                        );
                        linePoint = Vector2.subtract(
                            Vector2.multiply2(dotProduct2, line.direction),
                            relativeVelocity
                        );
                    }
                } else {
                    const invTimeStep = 1 / Simulator.Instance.timeStep;
                    const w = Vector2.subtract(
                        relativeVelocity,
                        Vector2.multiply2(invTimeStep, relativePosition)
                    );
                    const wLength = RVOMath.abs(w);
                    const unitW = Vector2.division(w, wLength);
                    line.direction = new Vector2(unitW.y, -unitW.x);
                    linePoint = Vector2.multiply2(
                        combinedRadius * invTimeStep - wLength,
                        unitW
                    );
                }
                line.point = velocityOpt.add(linePoint.scale(massRatio));
                this.orcaLines[this.orcaLines.length] = line;
            }
        }
        const result = new ObserverObj<Vector2>(
            new Vector2(this.newVelocity.x, this.newVelocity.y)
        );
        const lineFail = this.linearProgram2(
            this.orcaLines,
            this.maxSpeed,
            this.prefVelocity,
            false,
            result
        );
        if (lineFail < this.orcaLines.length) {
            this.linearProgram3(
                this.orcaLines,
                numObstacleLines,
                lineFail,
                this.maxSpeed,
                result
            );
        }
        this.newVelocity = result.value;
    }

    linearProgram1(
        lines: Line[],
        lineNo: number,
        radius: number,
        optVelocity: Vector2,
        directionOpt: boolean,
        result: ObserverObj<Vector2>
    ): boolean {
        const dotProduct = Vector2.multiply(
            lines[lineNo].point,
            lines[lineNo].direction
        );
        const discriminant =
            RVOMath.sqr(dotProduct) +
            RVOMath.sqr(radius) -
            RVOMath.absSq(lines[lineNo].point);
        if (discriminant < 0) {
            return false;
        }
        const sqrtDiscriminant = RVOMath.sqrt(discriminant);
        let tLeft = -dotProduct - sqrtDiscriminant;
        let tRight = -dotProduct + sqrtDiscriminant;
        for (let index = 0; index < lineNo; ++index) {
            const denominator = RVOMath.det(
                lines[lineNo].direction,
                lines[index].direction
            );
            const numerator = RVOMath.det(
                lines[index].direction,
                Vector2.subtract(lines[lineNo].point, lines[index].point)
            );
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
                result.value = Vector2.addition(
                    lines[lineNo].point,
                    Vector2.multiply2(tRight, lines[lineNo].direction)
                );
            } else {
                result.value = Vector2.addition(
                    lines[lineNo].point,
                    Vector2.multiply2(tLeft, lines[lineNo].direction)
                );
            }
        } else {
            const t = Vector2.multiply(
                lines[lineNo].direction,
                Vector2.subtract(optVelocity, lines[lineNo].point)
            );
            if (t < tLeft) {
                result.value = Vector2.addition(
                    lines[lineNo].point,
                    Vector2.multiply2(tLeft, lines[lineNo].direction)
                );
            } else if (t > tRight) {
                result.value = Vector2.addition(
                    lines[lineNo].point,
                    Vector2.multiply2(tRight, lines[lineNo].direction)
                );
            } else {
                result.value = Vector2.addition(
                    lines[lineNo].point,
                    Vector2.multiply2(t, lines[lineNo].direction)
                );
            }
        }
        return true;
    }

    linearProgram2(
        lines: Line[],
        radius: number,
        optVelocity: Vector2,
        directionOpt: boolean,
        result: ObserverObj<Vector2>
    ): number {
        if (directionOpt) {
            result.value = Vector2.multiply2(radius, optVelocity);
        } else if (RVOMath.absSq(optVelocity) > RVOMath.sqr(radius)) {
            result.value = Vector2.multiply2(
                radius,
                RVOMath.normalize(optVelocity)
            );
        } else {
            result.value = optVelocity;
        }
        for (let index = 0; index < lines.length; ++index) {
            if (
                RVOMath.det(
                    lines[index].direction,
                    Vector2.subtract(lines[index].point, result.value)
                ) > 0
            ) {
                const tempResult = new Vector2(
                    result.value.x,
                    result.value.y
                );
                if (
                    !this.linearProgram1(
                        lines,
                        index,
                        radius,
                        optVelocity,
                        directionOpt,
                        result
                    )
                ) {
                    result.value = tempResult;
                    return index;
                }
            }
        }
        return lines.length;
    }

    linearProgram3(
        lines: Line[],
        numObstacleLines: number,
        beginLine: number,
        radius: number,
        result: ObserverObj<Vector2>
    ): void {
        let distance = 0;
        for (let index = beginLine; index < lines.length; ++index) {
            if (
                RVOMath.det(
                    lines[index].direction,
                    Vector2.subtract(lines[index].point, result.value)
                ) > distance
            ) {
                const projectedLines: Line[] = [];
                for (let lineIndex = 0; lineIndex < numObstacleLines; ++lineIndex) {
                    projectedLines[projectedLines.length] = lines[lineIndex];
                }
                for (
                    let lineIndex = numObstacleLines;
                    lineIndex < index;
                    ++lineIndex
                ) {
                    const line = new Line();
                    const determinant = RVOMath.det(
                        lines[index].direction,
                        lines[lineIndex].direction
                    );
                    if (RVOMath.fabs(determinant) <= RVOMath.RVO_EPSILON) {
                        if (
                            Vector2.multiply(
                                lines[index].direction,
                                lines[lineIndex].direction
                            ) > 0
                        ) {
                            continue;
                        }
                        line.point = Vector2.multiply2(
                            0.5,
                            Vector2.addition(
                                lines[index].point,
                                lines[lineIndex].point
                            )
                        );
                    } else {
                        line.point = Vector2.addition(
                            lines[index].point,
                            Vector2.multiply2(
                                RVOMath.det(
                                    lines[lineIndex].direction,
                                    Vector2.subtract(
                                        lines[index].point,
                                        lines[lineIndex].point
                                    )
                                ) / determinant,
                                lines[index].direction
                            )
                        );
                    }
                    line.direction = RVOMath.normalize(
                        Vector2.subtract(
                            lines[lineIndex].direction,
                            lines[index].direction
                        )
                    );
                    projectedLines[projectedLines.length] = line;
                }
                const tempResult = new Vector2(
                    result.value.x,
                    result.value.y
                );
                if (
                    this.linearProgram2(
                        projectedLines,
                        radius,
                        new Vector2(
                            -lines[index].direction.y,
                            lines[index].direction.x
                        ),
                        true,
                        result
                    ) < projectedLines.length
                ) {
                    result.value = tempResult;
                }
                distance = RVOMath.det(
                    lines[index].direction,
                    Vector2.subtract(lines[index].point, result.value)
                );
            }
        }
    }
}
