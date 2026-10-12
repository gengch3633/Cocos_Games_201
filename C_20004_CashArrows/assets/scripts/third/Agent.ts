import * as commonDefine from "./commonDefine";
import Line from "./Line";
import RVOMath from "./RVOMath";
import Simulator from "./Simulator";
import Vector2 from "./Vector2";

const { ccclass } = cc._decorator;

@ccclass
export default class Agent {
    public agentNeighbors: commonDefine.KeyValuePair[] = [];
    public obstacleNeighbors: commonDefine.KeyValuePair[] = [];
    public orcaLines: Line[] = [];
    public prefVelocity: Vector2 = new Vector2(0, 0);
    public mass: number = 1;
    public calc: boolean = true;
    public newVelocity: Vector2 = new Vector2(0, 0);

    public position!: Vector2;
    public velocity!: Vector2;
    public maxNeighbors!: number;
    public maxSpeed!: number;
    public neighborDist!: number;
    public radius!: number;
    public timeHorizon!: number;
    public timeHorizonObst!: number;

    public update(): void {
        this.velocity = this.newVelocity;
        const position: Vector2 = Vector2.addition(this.position, Vector2.multiply2(Simulator.Instance.timeStep, this.velocity));
        this.position = position;
    }

    public insertObstacleNeighbor(obstacle: any, rangeSq: number): void {
        const next = obstacle.next;
        const distSq: number = RVOMath.distSqPointLineSegment(obstacle.point, next.point, this.position);
        if (distSq < rangeSq) {
            this.obstacleNeighbors.push(new commonDefine.KeyValuePair(distSq, obstacle));
            let index: number = this.obstacleNeighbors.length - 1;
            while (0 != index && distSq < this.obstacleNeighbors[index - 1].Key) {
                this.obstacleNeighbors[index] = this.obstacleNeighbors[index - 1];
                --index;
            }
            this.obstacleNeighbors[index] = new commonDefine.KeyValuePair(distSq, obstacle);
        }
    }

    public insertAgentNeighbor(agent: Agent, rangeSq: commonDefine.ObserverObj): void {
        if (agent && this != agent) {
            const distSq: number = RVOMath.absSq(Vector2.subtract(this.position, agent.position));
            if (distSq < rangeSq.value) {
                if (this.agentNeighbors.length < this.maxNeighbors) {
                    this.agentNeighbors.push(new commonDefine.KeyValuePair(distSq, agent));
                }
                let index: number = this.agentNeighbors.length - 1;
                while (0 != index && distSq < this.agentNeighbors[index - 1].Key) {
                    this.agentNeighbors[index] = this.agentNeighbors[index - 1];
                    --index;
                }
                this.agentNeighbors[index] = new commonDefine.KeyValuePair(distSq, agent);
                if (this.agentNeighbors.length == this.maxNeighbors) {
                    rangeSq.value = this.agentNeighbors[this.agentNeighbors.length - 1].Key;
                }
            }
        }
    }

    public computeNeighbors(): void {
        this.obstacleNeighbors = [];
        const rangeSqObst: number = RVOMath.sqr(this.timeHorizonObst * this.maxSpeed + this.radius);
        Simulator.Instance.kdTree.computeObstacleNeighbors(this, rangeSqObst);
        this.agentNeighbors = [];
        if (this.maxNeighbors > 0) {
            const rangeSq: commonDefine.ObserverObj = new commonDefine.ObserverObj();
            rangeSq.value = RVOMath.sqr(this.neighborDist);
            Simulator.Instance.kdTree.computeAgentNeighbors(this, rangeSq);
        }
    }

    public computeNewVelocity(): void {
        this.orcaLines = [];
        const invTimeHorizonObst: number = 1 / this.timeHorizonObst;

        for (let i = 0; i < this.obstacleNeighbors.length; ++i) {
            let obstacle1: any = this.obstacleNeighbors[i].Value;
            let obstacle2: any = obstacle1.next;
            const relativePosition1: Vector2 = Vector2.subtract(obstacle1.point, this.position);
            const relativePosition2: Vector2 = Vector2.subtract(obstacle2.point, this.position);

            let alreadyCovered: boolean = false;
            for (let j = 0; j < this.orcaLines.length; ++j) {
                if (RVOMath.det(Vector2.subtract(Vector2.multiply2(invTimeHorizonObst, relativePosition1), this.orcaLines[j].point), this.orcaLines[j].direction) - invTimeHorizonObst * this.radius >= -RVOMath.RVO_EPSILON &&
                    RVOMath.det(Vector2.subtract(Vector2.multiply2(invTimeHorizonObst, relativePosition2), this.orcaLines[j].point), this.orcaLines[j].direction) - invTimeHorizonObst * this.radius >= -RVOMath.RVO_EPSILON) {
                    alreadyCovered = true;
                    break;
                }
            }

            if (!alreadyCovered) {
                const distSq1: number = RVOMath.absSq(relativePosition1);
                const distSq2: number = RVOMath.absSq(relativePosition2);
                const radiusSq: number = RVOMath.sqr(this.radius);
                const obstacleVector: Vector2 = Vector2.subtract(obstacle2.point, obstacle1.point);
                const s: number = Vector2.multiply(Vector2.multiply2(-1, relativePosition1), obstacleVector) / RVOMath.absSq(obstacleVector);
                const distSqLine: number = RVOMath.absSq(Vector2.subtract(Vector2.multiply2(-1, relativePosition1), Vector2.multiply2(s, obstacleVector)));

                const line: Line = new Line();

                if (s < 0 && distSq1 <= radiusSq) {
                    if (obstacle1.convex) {
                        line.point = new Vector2(0, 0);
                        line.direction = RVOMath.normalize(new Vector2(-relativePosition1.y, relativePosition1.x));
                        this.orcaLines.push(line);
                    }
                } else if (s > 1 && distSq2 <= radiusSq) {
                    if (obstacle2.convex && RVOMath.det(relativePosition2, obstacle2.direction) >= 0) {
                        line.point = new Vector2(0, 0);
                        line.direction = RVOMath.normalize(new Vector2(-relativePosition2.y, relativePosition2.x));
                        this.orcaLines.push(line);
                    }
                } else if (s >= 0 && s < 1 && distSqLine <= radiusSq) {
                    line.point = new Vector2(0, 0);
                    line.direction = Vector2.multiply2(-1, obstacle1.direction);
                    this.orcaLines.push(line);
                } else {
                    let leftLegDirection: Vector2;
                    let rightLegDirection: Vector2;

                    if (s < 0 && distSqLine <= radiusSq) {
                        if (!obstacle1.convex) continue;
                        obstacle2 = obstacle1;
                        const leg: number = RVOMath.sqrt(distSq1 - radiusSq);
                        leftLegDirection = Vector2.division(new Vector2(relativePosition1.x * leg - relativePosition1.y * this.radius, relativePosition1.x * this.radius + relativePosition1.y * leg), distSq1);
                        rightLegDirection = Vector2.division(new Vector2(relativePosition1.x * leg + relativePosition1.y * this.radius, -relativePosition1.x * this.radius + relativePosition1.y * leg), distSq1);
                    } else if (s > 1 && distSqLine <= radiusSq) {
                        if (!obstacle2.convex) continue;
                        obstacle1 = obstacle2;
                        const leg: number = RVOMath.sqrt(distSq2 - radiusSq);
                        leftLegDirection = Vector2.division(new Vector2(relativePosition2.x * leg - relativePosition2.y * this.radius, relativePosition2.x * this.radius + relativePosition2.y * leg), distSq2);
                        rightLegDirection = Vector2.division(new Vector2(relativePosition2.x * leg + relativePosition2.y * this.radius, -relativePosition2.x * this.radius + relativePosition2.y * leg), distSq2);
                    } else {
                        if (obstacle1.convex) {
                            const leg: number = RVOMath.sqrt(distSq1 - radiusSq);
                            leftLegDirection = Vector2.division(new Vector2(relativePosition1.x * leg - relativePosition1.y * this.radius, relativePosition1.x * this.radius + relativePosition1.y * leg), distSq1);
                        } else {
                            leftLegDirection = Vector2.multiply2(-1, obstacle1.direction);
                        }
                        if (obstacle2.convex) {
                            const leg: number = RVOMath.sqrt(distSq2 - radiusSq);
                            rightLegDirection = Vector2.division(new Vector2(relativePosition2.x * leg - relativePosition2.y * this.radius, relativePosition2.x * this.radius + relativePosition2.y * leg), distSq2);
                        } else {
                            rightLegDirection = Vector2.multiply2(-1, obstacle1.direction);
                        }
                    }

                    const previous: any = obstacle1.previous;
                    let isLeftLegForeign: boolean = false;
                    let isRightLegForeign: boolean = false;

                    if (obstacle1.convex && RVOMath.det(leftLegDirection, Vector2.multiply2(-1, previous.direction)) >= 0) {
                        leftLegDirection = Vector2.multiply2(-1, previous.direction);
                        isLeftLegForeign = true;
                    }
                    if (obstacle2.convex && RVOMath.det(rightLegDirection, Vector2.multiply2(-1, obstacle2.direction)) <= 0) {
                        rightLegDirection = obstacle2.direction;
                        isRightLegForeign = true;
                    }

                    const leftCutoff: Vector2 = Vector2.multiply2(invTimeHorizonObst, Vector2.subtract(obstacle1.point, this.position));
                    const rightCutoff: Vector2 = Vector2.multiply2(invTimeHorizonObst, Vector2.subtract(obstacle2.point, this.position));
                    const cutoffVec: Vector2 = Vector2.subtract(rightCutoff, leftCutoff);
                    const t: number = obstacle1 == obstacle2 ? 0.5 : Vector2.multiply(Vector2.subtract(this.velocity, leftCutoff), cutoffVec) / RVOMath.absSq(cutoffVec);
                    const tLeft: number = Vector2.multiply(Vector2.subtract(this.velocity, leftCutoff), leftLegDirection);
                    const tRight: number = Vector2.multiply(Vector2.subtract(this.velocity, rightCutoff), rightLegDirection);

                    if ((t < 0 && tLeft < 0) || (obstacle1 == obstacle2 && tLeft < 0 && tRight < 0)) {
                        const temp: Vector2 = RVOMath.normalize(Vector2.subtract(this.velocity, leftCutoff));
                        line.direction = new Vector2(temp.y, -temp.x);
                        line.point = Vector2.addition(leftCutoff, Vector2.multiply2(this.radius * invTimeHorizonObst, temp));
                        this.orcaLines.push(line);
                    } else if (t > 1 && tRight < 0) {
                        const temp: Vector2 = RVOMath.normalize(Vector2.subtract(this.velocity, rightCutoff));
                        line.direction = new Vector2(temp.y, -temp.x);
                        line.point = Vector2.addition(rightCutoff, Vector2.multiply2(this.radius * invTimeHorizonObst, temp));
                        this.orcaLines.push(line);
                    } else {
                        const distSqCutoff: number = t < 0 || t > 1 || obstacle1 == obstacle2
                            ? RVOMath.RVO_POSITIVEINFINITY
                            : RVOMath.absSq(Vector2.subtract(this.velocity, Vector2.addition(leftCutoff, Vector2.multiply2(t, cutoffVec))));
                        const distSqLeft: number = tLeft < 0
                            ? RVOMath.RVO_POSITIVEINFINITY
                            : RVOMath.absSq(Vector2.subtract(this.velocity, Vector2.addition(leftCutoff, Vector2.multiply2(tLeft, leftLegDirection))));
                        const distSqRight: number = tRight < 0
                            ? RVOMath.RVO_POSITIVEINFINITY
                            : RVOMath.absSq(Vector2.subtract(this.velocity, Vector2.addition(rightCutoff, Vector2.multiply2(tRight, rightLegDirection))));

                        if (distSqCutoff <= distSqLeft && distSqCutoff <= distSqRight) {
                            line.direction = Vector2.multiply2(-1, obstacle1.direction);
                            line.point = Vector2.addition(leftCutoff, Vector2.multiply2(this.radius * invTimeHorizonObst, new Vector2(-line.direction.y, line.direction.x)));
                            this.orcaLines.push(line);
                        } else if (distSqLeft <= distSqRight) {
                            if (isLeftLegForeign) continue;
                            line.direction = leftLegDirection;
                            line.point = Vector2.addition(leftCutoff, Vector2.multiply2(this.radius * invTimeHorizonObst, new Vector2(-line.direction.y, line.direction.x)));
                            this.orcaLines.push(line);
                        } else if (!isRightLegForeign) {
                            line.direction = Vector2.multiply2(-1, rightLegDirection);
                            line.point = Vector2.addition(rightCutoff, Vector2.multiply2(this.radius * invTimeHorizonObst, new Vector2(-line.direction.y, line.direction.x)));
                            this.orcaLines.push(line);
                        }
                    }
                }
            }
        }

        const numObstLines: number = this.orcaLines.length;
        const invTimeHorizon: number = 1 / this.timeHorizon;

        for (let i = 0; i < this.agentNeighbors.length; ++i) {
            const other: Agent = this.agentNeighbors[i].Value;
            if (other) {
                const invMass: number = this.mass / (this.mass + other.mass);
                const invMassOther: number = other.mass / (this.mass + other.mass);
                const newVelocityThis: Vector2 = invMass >= 0.5
                    ? this.velocity.minus(this.velocity.scale(invMass)).scale(2)
                    : this.prefVelocity.add(this.velocity.minus(this.prefVelocity).scale(2 * invMass));
                const newVelocityOther: Vector2 = invMassOther >= 0.5
                    ? other.velocity.scale(2).scale(1 - invMassOther)
                    : other.prefVelocity.add(other.velocity.minus(other.prefVelocity).scale(2 * invMassOther));

                const relativePosition: Vector2 = Vector2.subtract(other.position, this.position);
                const relativeVelocity: Vector2 = Vector2.subtract(newVelocityThis, newVelocityOther);
                const distSq: number = RVOMath.absSq(relativePosition);
                const combinedRadius: number = this.radius + other.radius;
                const combinedRadiusSq: number = RVOMath.sqr(combinedRadius);

                const line: Line = new Line();
                let u: Vector2;

                if (distSq > combinedRadiusSq) {
                    const w: Vector2 = Vector2.subtract(relativeVelocity, Vector2.multiply2(invTimeHorizon, relativePosition));
                    const wLengthSq: number = RVOMath.absSq(w);
                    const dotProduct1: number = Vector2.multiply(w, relativePosition);

                    if (dotProduct1 < 0 && RVOMath.sqr(dotProduct1) > combinedRadiusSq * wLengthSq) {
                        const wLength: number = RVOMath.sqrt(wLengthSq);
                        const unitW: Vector2 = Vector2.division(w, wLength);
                        line.direction = new Vector2(unitW.y, -unitW.x);
                        u = Vector2.multiply2(combinedRadius * invTimeHorizon - wLength, unitW);
                    } else {
                        const leg: number = RVOMath.sqrt(distSq - combinedRadiusSq);
                        if (RVOMath.det(relativePosition, w) > 0) {
                            line.direction = Vector2.division(new Vector2(relativePosition.x * leg - relativePosition.y * combinedRadius, relativePosition.x * combinedRadius + relativePosition.y * leg), distSq);
                        } else {
                            line.direction = Vector2.division(new Vector2(relativePosition.x * leg + relativePosition.y * combinedRadius, -relativePosition.x * combinedRadius + relativePosition.y * leg), -distSq);
                        }
                        const dotProduct2: number = Vector2.multiply(relativeVelocity, line.direction);
                        u = Vector2.subtract(Vector2.multiply2(dotProduct2, line.direction), relativeVelocity);
                    }
                } else {
                    const invTimeStep: number = 1 / Simulator.Instance.timeStep;
                    const w: Vector2 = Vector2.subtract(relativeVelocity, Vector2.multiply2(invTimeStep, relativePosition));
                    const wLength: number = RVOMath.abs(w);
                    const unitW: Vector2 = Vector2.division(w, wLength);
                    line.direction = new Vector2(unitW.y, -unitW.x);
                    u = Vector2.multiply2(combinedRadius * invTimeStep - wLength, unitW);
                }

                line.point = newVelocityThis.add(u.scale(invMass));
                this.orcaLines[this.orcaLines.length] = line;
            }
        }

        const result: commonDefine.ObserverObj = new commonDefine.ObserverObj(new Vector2(this.newVelocity.x, this.newVelocity.y));
        const lineFail: number = this.linearProgram2(this.orcaLines, this.maxSpeed, this.prefVelocity, false, result);
        if (lineFail < this.orcaLines.length) {
            this.linearProgram3(this.orcaLines, numObstLines, lineFail, this.maxSpeed, result);
        }
        this.newVelocity = result.value;
    }

    public linearProgram1(lines: Line[], lineNo: number, radius: number, optVelocity: Vector2, directionOpt: boolean, result: commonDefine.ObserverObj): boolean {
        const dotProduct: number = Vector2.multiply(lines[lineNo].point, lines[lineNo].direction);
        const discriminant: number = RVOMath.sqr(dotProduct) + RVOMath.sqr(radius) - RVOMath.absSq(lines[lineNo].point);

        if (discriminant < 0) {
            return false;
        }

        const sqrtDiscriminant: number = RVOMath.sqrt(discriminant);
        let tLeft: number = -dotProduct - sqrtDiscriminant;
        let tRight: number = -dotProduct + sqrtDiscriminant;

        for (let i = 0; i < lineNo; ++i) {
            const denominator: number = RVOMath.det(lines[lineNo].direction, lines[i].direction);
            const numerator: number = RVOMath.det(lines[i].direction, Vector2.subtract(lines[lineNo].point, lines[i].point));

            if (RVOMath.fabs(denominator) <= RVOMath.RVO_EPSILON) {
                if (numerator < 0) {
                    return false;
                }
            } else {
                const t: number = numerator / denominator;
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
            const t: number = Vector2.multiply(lines[lineNo].direction, Vector2.subtract(optVelocity, lines[lineNo].point));
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

    public linearProgram2(lines: Line[], radius: number, optVelocity: Vector2, directionOpt: boolean, result: commonDefine.ObserverObj): number {
        if (directionOpt) {
            result.value = Vector2.multiply2(radius, optVelocity);
        } else if (RVOMath.absSq(optVelocity) > RVOMath.sqr(radius)) {
            result.value = Vector2.multiply2(radius, RVOMath.normalize(optVelocity));
        } else {
            result.value = optVelocity;
        }

        for (let i = 0; i < lines.length; ++i) {
            if (RVOMath.det(lines[i].direction, Vector2.subtract(lines[i].point, result.value)) > 0) {
                const temp: Vector2 = new Vector2(result.value.x, result.value.y);
                if (!this.linearProgram1(lines, i, radius, optVelocity, directionOpt, result)) {
                    result.value = temp;
                    return i;
                }
            }
        }

        return lines.length;
    }

    public linearProgram3(lines: Line[], numObstLines: number, beginLine: number, radius: number, result: commonDefine.ObserverObj): void {
        let distance: number = 0;

        for (let i = beginLine; i < lines.length; ++i) {
            if (RVOMath.det(lines[i].direction, Vector2.subtract(lines[i].point, result.value)) > distance) {
                const projLines: Line[] = [];

                for (let j = 0; j < numObstLines; ++j) {
                    projLines[projLines.length] = lines[j];
                }

                for (let j = numObstLines; j < i; ++j) {
                    const line: Line = new Line();
                    const determinant: number = RVOMath.det(lines[i].direction, lines[j].direction);

                    if (RVOMath.fabs(determinant) <= RVOMath.RVO_EPSILON) {
                        if (Vector2.multiply(lines[i].direction, lines[j].direction) > 0) {
                            continue;
                        }
                        line.point = Vector2.multiply2(0.5, Vector2.addition(lines[i].point, lines[j].point));
                    } else {
                        line.point = Vector2.addition(lines[i].point, Vector2.multiply2(RVOMath.det(lines[j].direction, Vector2.subtract(lines[i].point, lines[j].point)) / determinant, lines[i].direction));
                    }

                    line.direction = RVOMath.normalize(Vector2.subtract(lines[j].direction, lines[i].direction));
                    projLines[projLines.length] = line;
                }

                const temp: Vector2 = new Vector2(result.value.x, result.value.y);
                if (this.linearProgram2(projLines, radius, new Vector2(-lines[i].direction.y, lines[i].direction.x), true, result) < projLines.length) {
                    result.value = temp;
                }

                distance = RVOMath.det(lines[i].direction, Vector2.subtract(lines[i].point, result.value));
            }
        }
    }
}