import BallLogicMgr from "./BallLogicMgr";
import CueDataSys from "./CueDataSys";
import GlobalConfig from "./GlobalConfig";
import MyCircleColliderUtility from "./MyCircleColliderUtility";
import PropDataSys from "./PropDataSys";

const { ccclass, property } = cc._decorator;

const DEG_TO_RAD = Math.PI / 180;
const BALL_RADIUS = GlobalConfig.ball_radius;
const BALL_RADIUS_SQR = BALL_RADIUS * BALL_RADIUS * 4;

@ccclass
export default class CircleRayComp extends cc.Component {
    @property(cc.Node)
    virtualball: cc.Node = null;

    mid: cc.Vec2 = null;

    get_distance(angle: number, direction: cc.Vec2): number {
        const mid = this.mid;
        const center = cc.v2(mid.x + 250, mid.y + 500);
        let vertical: cc.Vec2 = null;
        let horizontal: cc.Vec2 = null;
        if (angle >= Math.PI / 2) {
            vertical = cc.v2(0, -center.y);
            horizontal = cc.v2(500 - center.x, 0);
        } else if (angle < Math.PI / 2 && angle >= 0) {
            vertical = cc.v2(0, -center.y);
            horizontal = cc.v2(-center.x, 0);
        } else if (angle > -Math.PI / 2 && angle < 0) {
            vertical = cc.v2(0, 1000 - center.y);
            horizontal = cc.v2(-center.x, 0);
        } else if (angle <= -Math.PI / 2) {
            vertical = cc.v2(0, 1000 - center.y);
            horizontal = cc.v2(500 - center.x, 0);
        }
        const normalized = direction.normalizeSelf().mulSelf(1000);
        const verticalProj = normalized.project(vertical);
        const horizontalProj = normalized.project(horizontal);
        const horizontalRatio = Math.abs(horizontalProj.x) / Math.abs(horizontal.x);
        if (Math.abs(verticalProj.y) / Math.abs(vertical.y) > horizontalRatio) {
            horizontalProj.x = horizontalProj.x * (Math.abs(vertical.y) / Math.abs(verticalProj.y));
            verticalProj.y = vertical.y;
        } else {
            verticalProj.y = verticalProj.y * (Math.abs(horizontal.x) / Math.abs(horizontalProj.x));
            horizontalProj.x = horizontal.x;
        }
        return cc.v2(horizontalProj.x, verticalProj.y).mag();
    }

    getColliderP_Pollygon(node: cc.Node, start: cc.Vec2, direction: cc.Vec2): cc.Vec2 {
        direction = direction.normalize().mulSelf(2000);
        const line = {
            start,
            end: start.add(direction),
        };
        const points = node.getComponent(cc.PolygonCollider).points;
        let closestPoint: cc.Vec2 = null;
        let closestDistance: number = null;
        for (let i = 0; i < points.length; i++) {
            const hit = MyCircleColliderUtility.collideWhitLine(
                {
                    r: GlobalConfig.ball_radius,
                    position: new cc.Vec2(start.x, start.y),
                },
                points[(i + 1) % points.length],
                points[i],
                direction,
                null
            );
            if (hit) {
                const distance = hit.sub(start).len();
                if (closestDistance == null || closestDistance > distance) {
                    closestDistance = distance;
                    closestPoint = hit;
                }
            }
        }
        return closestPoint || line.end;
    }

    onLoad(): void {}

    getLineLen(start: cc.Vec2, direction: cc.Vec2): { is_polygon: boolean; len: number } {
        start = new cc.Vec2(start.x, start.y);
        const collider = this.getColliderP(start, direction);
        const crossPoint = collider.croseP;
        if (crossPoint) {
            return {
                is_polygon: collider.is_polygon,
                len: crossPoint.sub(start).mag(),
            };
        }
        return {
            is_polygon: collider.is_polygon,
            len: 0,
        };
    }

    getColliderP_rect(start: cc.Vec2, direction: cc.Vec2): cc.Vec2 {
        direction = direction.normalizeSelf().mulSelf(2000);
        const line = {
            start,
            end: start.add(direction),
        };
        const topLine = {
            start: new cc.Vec2(-242.5, 491.5),
            end: new cc.Vec2(242.5, 491.5),
        };
        let intersection = this.getLineIntersection(line, topLine);
        if (intersection) {
            return intersection;
        }
        let bottomLine = {
            start: new cc.Vec2(-242.5, -491.5),
            end: new cc.Vec2(242.5, -491.5),
        };
        intersection = this.getLineIntersection(line, bottomLine);
        if (intersection) {
            return intersection;
        }
        bottomLine = {
            start: new cc.Vec2(-242.5, 491.5),
            end: new cc.Vec2(-242.5, -491.5),
        };
        intersection = this.getLineIntersection(line, bottomLine);
        if (intersection) {
            return intersection;
        }
        const rightLine = {
            start: new cc.Vec2(242.5, 491.5),
            end: new cc.Vec2(242.5, -491.5),
        };
        return this.getLineIntersection(line, rightLine) || undefined;
    }

    getLineIntersection(
        lineA: { start: cc.Vec2; end: cc.Vec2 },
        lineB: { start: cc.Vec2; end: cc.Vec2 }
    ): cc.Vec2 | null {
        const startA = lineA.start;
        const endA = lineA.end;
        const startB = lineB.start;
        const endB = lineB.end;
        const deltaAX = endA.x - startA.x;
        const deltaAY = endA.y - startA.y;
        const deltaBX = endB.x - startB.x;
        const deltaBY = endB.y - startB.y;
        const t =
            (-deltaAY * (startA.x - startB.x) + deltaAX * (startA.y - startB.y)) /
            (-deltaBX * deltaAY + deltaAX * deltaBY);
        const u =
            (deltaBX * (startA.y - startB.y) - deltaBY * (startA.x - startB.x)) /
            (-deltaBX * deltaAY + deltaAX * deltaBY);
        if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
            const x = startA.x + u * deltaAX;
            const y = startA.y + u * deltaAY;
            return new cc.Vec2(x, y);
        }
        return null;
    }

    check_line(
        center: cc.Vec2,
        balls: Map<any, cc.Node>,
        isLinePropUsed: boolean,
        direction: cc.Vec2
    ): { tar_node: cc.Node; zhexian: cc.Vec2 } {
        const linePropUsed = PropDataSys.isLinePropUsed;
        this.mid = center;
        let reflectDirection: cc.Vec2 = null;
        let closestBall: cc.Node = null;
        let targetBall: cc.Node = null;
        let closestHit: cc.Vec2 = null;
        let closestDistance = -1;
        const drawComp = this.node.getChildByName("plane_table").getChildByName("node_graphics").getComponent("DrawComp");
        for (const [, ballNode] of balls.entries()) {
            if (100 * BallLogicMgr.BallIDType_White == ballNode.getComponent("Ball2DControl").ballID) {
                continue;
            }
            let hitPoint: cc.Vec2 = null;
            let candidateBall: cc.Node = null;
            const ballPos = ballNode;
            if (ballPos) {
                const offset = cc.v2(ballPos.x - center.x, ballPos.y - center.y);
                const angle = cc.Vec2.angle(direction, offset);
                if (angle > 1) {
                    continue;
                }
                const foundPoint = this.foundCirclePoint(center, ballPos, direction);
                if (foundPoint) {
                    drawComp && drawComp.clear();
                    const distance = foundPoint.mag();
                    if (closestDistance == -1) {
                        closestDistance = distance;
                        candidateBall = ballPos;
                        drawComp && drawComp.drawcircle(cc.v2(foundPoint.x + center.x, foundPoint.y + center.y), ballPos, "#ff0000");
                        hitPoint = foundPoint;
                    } else if (distance < closestDistance) {
                        closestDistance = distance;
                        candidateBall = ballPos;
                        drawComp && drawComp.drawcircle(cc.v2(foundPoint.x + center.x, foundPoint.y + center.y), ballPos, "#ffff00");
                        hitPoint = foundPoint;
                    } else {
                        drawComp && drawComp.drawcircle(cc.v2(foundPoint.x + center.x, foundPoint.y + center.y), ballPos, "#0000ff");
                    }
                    if (hitPoint) {
                        const hitAngle = hitPoint.angle(direction);
                        if (
                            !(
                                (hitPoint.len() < 0.5 && hitAngle > 3) ||
                                (Math.sign(direction.x) == Math.sign(hitPoint.x) && Math.sign(direction.y) == Math.sign(hitPoint.y))
                            )
                        ) {
                            hitPoint = null;
                        }
                        if (hitPoint) {
                            const hitWorld = cc.v2(hitPoint.x + center.x, hitPoint.y + center.y);
                            const ballOffset = cc.v2(candidateBall.x - hitWorld.x, candidateBall.y - hitWorld.y);
                            const collisionAngle = cc.v2(hitPoint.x, hitPoint.y).angle(ballOffset);
                            if (collisionAngle > 1.4 && collisionAngle < 3) {
                                hitPoint = null;
                                closestDistance = -1;
                            }
                        }
                    }
                }
            }
            if (hitPoint) {
                closestHit = hitPoint;
                closestBall = candidateBall;
                targetBall = candidateBall;
            }
        }
        this.virtualball.active = false;
        const greenRay = cc.find("plane_table", this.node).getChildByName("sprite_dir_green");
        if (closestHit) {
            const hitWorld = cc.v2(closestHit.x + center.x, closestHit.y + center.y);
            const ballOffset = cc.v2(closestBall.x - hitWorld.x, closestBall.y - hitWorld.y);
            const aimAngle = Math.atan2(closestHit.y, closestHit.x);
            const hitVector = cc.v2(hitWorld.x - center.x, hitWorld.y - center.y);
            hitVector.angle(ballOffset);
            const collisionCheck = 0;
            if (collisionCheck < 1.36) {
                this.virtualball.x = hitWorld.x;
                this.virtualball.y = hitWorld.y;
                this.virtualball.active = true;
                const hitLength = hitVector.mag();
                const ballDistance = cc.v2(center.x, center.y).subSelf(cc.v2(targetBall.x, targetBall.y)).len();
                const lineLen = this.getLineLen(this.mid, hitVector);
                const isPolygon = lineLen.is_polygon;
                if (ballDistance >= lineLen.len) {
                    closestHit = null;
                } else {
                    drawComp && drawComp.drawcircle(cc.v2(closestHit.x + center.x, closestHit.y + center.y), null, "#ffff00");
                    greenRay.getComponent("SpriteRayComp").reset(
                        aimAngle / DEG_TO_RAD,
                        hitLength + (linePropUsed ? GlobalConfig.ball_radius - 4 : -GlobalConfig.ball_radius),
                        isLinePropUsed,
                        linePropUsed
                    );
                    greenRay.x = center.x;
                    greenRay.y = center.y;
                    greenRay.active = true;
                    reflectDirection = ballOffset;
                    const moveAngle = Math.atan2(ballOffset.y, ballOffset.x);
                    let aimLength = linePropUsed
                        ? this.getLineLen(closestBall, ballOffset).len + 25
                        : CueDataSys.getUsedCueAimLineLen();
                    if (!linePropUsed && (BallLogicMgr as any).useSimCueAttri && (BallLogicMgr as any).simAimming) {
                        aimLength = (BallLogicMgr as any).simAimming;
                    }
                    const yellowRay = cc.find("plane_table", this.node).getChildByName("sprite_dir_yellow");
                    yellowRay.x = closestBall.x;
                    yellowRay.y = closestBall.y;
                    yellowRay.getComponent("SpriteRayComp").resetWillGo(moveAngle / DEG_TO_RAD, aimLength, isLinePropUsed, linePropUsed, targetBall);
                    yellowRay.active = true;
                }
            } else {
                closestHit = null;
            }
        }
        if (closestHit == null) {
            reflectDirection = null;
            drawComp && drawComp.clear();
            const yellowRay = cc.find("plane_table", this.node).getChildByName("sprite_dir_yellow");
            yellowRay.active = false;
            greenRay.x = center.x;
            greenRay.y = center.y;
            greenRay.active = true;
            const aimAngle = Math.atan2(direction.y, direction.x);
            let rayLength = 1000;
            const lineLen = this.getLineLen(this.mid, direction);
            const isPolygon = lineLen.is_polygon;
            rayLength = lineLen.len;
            const displayLength = linePropUsed ? rayLength + 4 : rayLength;
            const virtualPos = direction.normalize().mulSelf(isPolygon ? displayLength : rayLength - GlobalConfig.ball_radius).addSelf(this.mid);
            this.virtualball.x = virtualPos.x;
            this.virtualball.y = virtualPos.y;
            this.virtualball.active = true;
            const offsetNear = isPolygon ? -GlobalConfig.ball_radius : -2 * GlobalConfig.ball_radius;
            const offsetFar = isPolygon ? GlobalConfig.ball_radius : -4;
            greenRay.getComponent("SpriteRayComp").reset(
                aimAngle / DEG_TO_RAD,
                rayLength + (linePropUsed ? offsetFar : offsetNear),
                isLinePropUsed,
                linePropUsed
            );
        }
        return {
            tar_node: targetBall,
            zhexian: reflectDirection,
        };
    }

    clear(): void {
        const drawComp = this.node.getChildByName("node_graphics").getComponent("DrawComp");
        cc.find("plane_table", this.node).getChildByName("sprite_dir_green").active = false;
        drawComp && drawComp.clear();
        cc.find("plane_table", this.node).getChildByName("sprite_dir_yellow").active = false;
        this.virtualball.active = false;
    }

    foundCirclePoint(center: cc.Vec2, ball: cc.Vec2, direction: cc.Vec2): cc.Vec2 | null {
        if (direction.y == 0) {
            direction.y = 1e-10;
        }
        if (direction.x == 0) {
            direction.x = 1e-10;
        }
        const offset = cc.v2(ball.x - center.x, ball.y - center.y);
        const slope = direction.y / direction.x;
        const radiusSqr = BALL_RADIUS_SQR;
        const denominator = 1 + slope * slope;
        const linear = -(2 * offset.x + 2 * offset.y * slope);
        const discriminant = linear * linear - 4 * denominator * (offset.x * offset.x + offset.y * offset.y - radiusSqr);
        const sqrtDiscriminant = Math.sqrt(discriminant);
        const t1 = (-linear + sqrtDiscriminant) / (2 * denominator);
        const t2 = (-linear - sqrtDiscriminant) / (2 * denominator);
        const y1 = t1 * slope;
        const y2 = t2 * slope;
        if (t1 && t2 && y1 && y2) {
            const pointA = cc.v2(t1, y1);
            const pointB = cc.v2(t2, y2);
            return pointA.mag() < pointB.mag() ? pointA : pointB;
        }
        return null;
    }

    getColliderP(start: cc.Vec2, direction: cc.Vec2): { is_polygon: boolean; croseP: cc.Vec2 } {
        const borderNode = cc.find("zhuo_pengzhuang", this.node).getChildByName("pengzhuang_root").getChildByName("zhuo_bian");
        if (borderNode && borderNode.getComponent(cc.PolygonCollider)) {
            return {
                is_polygon: true,
                croseP: this.getColliderP_Pollygon(borderNode, start, direction),
            };
        }
        return {
            is_polygon: false,
            croseP: this.getColliderP_rect(start, direction),
        };
    }

    getColliderP_Pollygon_old(node: cc.Node, start: cc.Vec2, direction: cc.Vec2): cc.Vec2 {
        direction = direction.normalizeSelf().mulSelf(2000);
        const line = {
            start,
            end: start.add(direction),
        };
        const points = node.getComponent(cc.PolygonCollider).points;
        let closestPoint: cc.Vec2 = null;
        let closestDistance: number = null;
        for (let i = 0; i < points.length; i++) {
            const edge = {
                start: points[i],
                end: points[(i + 1) % points.length],
            };
            const intersection = this.getLineIntersection(line, edge);
            if (intersection) {
                const distance = intersection.sub(start).len();
                if (closestDistance == null || closestDistance > distance) {
                    closestDistance = distance;
                    closestPoint = intersection;
                }
            }
        }
        return closestPoint || line.end;
    }
}
