import * as GlobalConfig from "./GlobalConfig";
import * as BallLogicMgr from "./BallLogicMgr";
import CueDataSys from "./CueDataSys";
import PropDataSys from "./PropDataSys";
import MyCircleColliderUtility from "./MyCircleColliderUtility";

const { ccclass, property } = cc._decorator;

const DEG_TO_RAD = Math.PI / 180;
const BALL_RADIUS = GlobalConfig.ball_radius;
const BALL_RADIUS_SQUARE_X4 = BALL_RADIUS * BALL_RADIUS * 4;

interface Ball2DControlLike {
    ballID: number;
}

@ccclass
export default class CircleRayComp extends cc.Component {
    @property(cc.Node)
    virtualball: cc.Node = null;

    mid: cc.Vec2 = null;

    get_distance(angle: number, direction: cc.Vec2): number {
        const mid = this.mid;
        const n = cc.v2(mid.x + 250, mid.y + 500);
        let edgeA: cc.Vec2 = null;
        let edgeB: cc.Vec2 = null;
        if (angle >= Math.PI / 2) {
            edgeA = cc.v2(0, -n.y);
            edgeB = cc.v2(500 - n.x, 0);
        } else if (angle < Math.PI / 2 && angle >= 0) {
            edgeA = cc.v2(0, -n.y);
            edgeB = cc.v2(-n.x, 0);
        } else if (angle > -Math.PI / 2 && angle < 0) {
            edgeA = cc.v2(0, 1000 - n.y);
            edgeB = cc.v2(-n.x, 0);
        } else if (angle <= -Math.PI / 2) {
            edgeA = cc.v2(0, 1000 - n.y);
            edgeB = cc.v2(500 - n.x, 0);
        }
        const projected = direction.normalizeSelf().mulSelf(1000);
        let projA = projected.project(edgeA);
        let projB = projected.project(edgeB);
        const ratioB = Math.abs(projB.x) / Math.abs(edgeB.x);
        if (Math.abs(projA.y) / Math.abs(edgeA.y) > ratioB) {
            projB.x = projB.x * (Math.abs(edgeA.y) / Math.abs(projA.y));
            projA.y = edgeA.y;
        } else {
            projA.y = projA.y * (Math.abs(edgeB.x) / Math.abs(projB.x));
            projB.x = edgeB.x;
        }
        return cc.v2(projB.x, projA.y).mag();
    }

    getColliderP_Pollygon(node: cc.Node, start: cc.Vec2, direction: cc.Vec2): cc.Vec2 {
        direction = direction.normalize().mulSelf(2000);
        const line = {
            start,
            end: start.add(direction),
        };
        const points = node.getComponent(cc.PolygonCollider).points;
        let closestPoint: cc.Vec2 = null;
        let closestDist: number = null;
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
                const dist = hit.sub(start).len();
                if (closestDist == null || closestDist > dist) {
                    closestDist = dist;
                    closestPoint = hit;
                }
            }
        }
        return closestPoint || line.end;
    }

    onLoad(): void {}

    getLineLen(start: cc.Vec2, direction: cc.Vec2): { is_polygon: boolean; len: number } {
        start = new cc.Vec2(start.x, start.y);
        const result = this.getColliderP(start, direction);
        const crossPoint = result.croseP;
        return crossPoint
            ? {
                  is_polygon: result.is_polygon,
                  len: crossPoint.sub(start).mag(),
              }
            : {
                  is_polygon: result.is_polygon,
                  len: 0,
              };
    }

    getColliderP_rect(start: cc.Vec2, direction: cc.Vec2): cc.Vec2 {
        direction = direction.normalizeSelf().mulSelf(2000);
        const line = {
            start,
            end: start.add(direction),
        };
        let edge = {
            start: new cc.Vec2(-242.5, 491.5),
            end: new cc.Vec2(242.5, 491.5),
        };
        let hit = this.getLineIntersection(line, edge);
        if (hit) {
            return hit;
        }
        edge = {
            start: new cc.Vec2(-242.5, -491.5),
            end: new cc.Vec2(242.5, -491.5),
        };
        if ((hit = this.getLineIntersection(line, edge))) {
            return hit;
        }
        edge = {
            start: new cc.Vec2(-242.5, 491.5),
            end: new cc.Vec2(-242.5, -491.5),
        };
        if ((hit = this.getLineIntersection(line, edge))) {
            return hit;
        }
        edge = {
            start: new cc.Vec2(242.5, 491.5),
            end: new cc.Vec2(242.5, -491.5),
        };
        return this.getLineIntersection(line, edge) || undefined;
    }

    getLineIntersection(
        lineA: { start: cc.Vec2; end: cc.Vec2 },
        lineB: { start: cc.Vec2; end: cc.Vec2 }
    ): cc.Vec2 {
        const startA = lineA.start;
        const endA = lineA.end;
        const startB = lineB.start;
        const endB = lineB.end;
        const dxA = endA.x - startA.x;
        const dyA = endA.y - startA.y;
        const dxB = endB.x - startB.x;
        const dyB = endB.y - startB.y;
        const u =
            (-dyA * (startA.x - startB.x) + dxA * (startA.y - startB.y)) / (-dxB * dyA + dxA * dyB);
        const t =
            (dxB * (startA.y - startB.y) - dyB * (startA.x - startB.x)) / (-dxB * dyA + dxA * dyB);
        if (u >= 0 && u <= 1 && t >= 0 && t <= 1) {
            return new cc.Vec2(startA.x + t * dxA, startA.y + t * dyA);
        }
        return null;
    }

    check_line(
        origin: cc.Vec2,
        balls: Map<number, cc.Node>,
        powerPercent: number,
        direction: cc.Vec2
    ): { tar_node: cc.Node; zhexian: cc.Vec2 } {
        const isLinePropUsed = PropDataSys.isLinePropUsed;
        this.mid = origin;
        let minDist = -1;
        let hitOffset: cc.Vec2 = null;
        let hitBallNode: cc.Node = null;
        let targetBallNode: cc.Node = null;
        const drawComp = this.node
            .getChildByName("plane_table")
            .getChildByName("node_graphics")
            .getComponent("DrawComp") as any;
        for (const [, ballNode] of balls.entries()) {
            const ballCtrl = ballNode.getComponent("Ball2DControl") as Ball2DControlLike;
            if (100 * BallLogicMgr.BallIDType_White != ballCtrl.ballID) {
                let circleHit: cc.Vec2 = null;
                let candidateBall: cc.Node = null;
                const ball = ballNode;
                if (ball) {
                    const delta = cc.v2(ball.x - origin.x, ball.y - origin.y);
                    if (cc.Vec2.angle(direction, delta) > 1) {
                        continue;
                    }
                    const found = this.foundCirclePoint(origin, ball, direction);
                    if (found) {
                        drawComp && drawComp.clear();
                        const dist = found.mag();
                        if (minDist == -1) {
                            minDist = dist;
                            candidateBall = ball;
                            drawComp && drawComp.drawcircle(cc.v2(found.x + origin.x, found.y + origin.y), ball, "#ff0000");
                            circleHit = found;
                        } else if (dist < minDist) {
                            minDist = dist;
                            candidateBall = ball;
                            drawComp && drawComp.drawcircle(cc.v2(found.x + origin.x, found.y + origin.y), ball, "#ffff00");
                            circleHit = found;
                        } else {
                            drawComp && drawComp.drawcircle(cc.v2(found.x + origin.x, found.y + origin.y), ball, "#0000ff");
                        }
                        if (circleHit) {
                            circleHit.len();
                            const angle = circleHit.angle(direction);
                            if (
                                (circleHit.len() < 0.5 && angle > 3) ||
                                (Math.sign(direction.x) == Math.sign(circleHit.x) &&
                                    Math.sign(direction.y) == Math.sign(circleHit.y))
                            ) {
                                circleHit = null;
                            }
                            if (circleHit) {
                                const hitWorld = cc.v2(circleHit.x + origin.x, circleHit.y + origin.y);
                                const reflectDir = cc.v2(candidateBall.x - hitWorld.x, candidateBall.y - hitWorld.y);
                                const approachDir = cc.v2(hitWorld.x - origin.x, hitWorld.y - origin.y);
                                const contactAngle = approachDir.angle(reflectDir);
                                if (contactAngle > 1.4 && contactAngle < 3) {
                                    circleHit = null;
                                    minDist = -1;
                                }
                            }
                        }
                    }
                }
                if (circleHit) {
                    hitOffset = circleHit;
                    hitBallNode = candidateBall;
                    targetBallNode = candidateBall;
                }
            }
        }
        this.virtualball.active = false;
        const greenSprite = cc.find("plane_table", this.node).getChildByName("sprite_dir_green");
        let zhexian: cc.Vec2 = null;
        if (hitOffset) {
            const hitAngle = Math.atan2(hitOffset.y, hitOffset.x);
            const hitWorld = cc.v2(hitOffset.x + origin.x, hitOffset.y + origin.y);
            const reflectDir = cc.v2(hitBallNode.x - hitWorld.x, hitBallNode.y - hitWorld.y);
            let approachDir = cc.v2(hitWorld.x - origin.x, hitWorld.y - origin.y);
            approachDir.angle(reflectDir);
            this.virtualball.x = hitWorld.x;
            this.virtualball.y = hitWorld.y;
            this.virtualball.active = true;
            const approachLen = approachDir.mag();
            const ballDist = cc.v2(origin.x, origin.y).subSelf(cc.v2(targetBallNode.x, targetBallNode.y)).len();
            const lineLen = this.getLineLen(this.mid, approachDir);
            const isPolygon = lineLen.is_polygon;
            if (ballDist >= lineLen.len) {
                hitOffset = null;
            } else {
                drawComp && drawComp.drawcircle(cc.v2(hitOffset.x + origin.x, hitOffset.y + origin.y), null, "#ffff00");
                greenSprite
                    .getComponent("SpriteRayComp")
                    .reset(
                        hitAngle / DEG_TO_RAD,
                        approachLen + (isLinePropUsed ? GlobalConfig.ball_radius - 4 : -GlobalConfig.ball_radius),
                        powerPercent,
                        isLinePropUsed
                    );
                greenSprite.x = origin.x;
                greenSprite.y = origin.y;
                greenSprite.active = true;
                zhexian = reflectDir;
                const reflectAngle = Math.atan2(reflectDir.y, reflectDir.x);
                let yellowLen = isLinePropUsed
                    ? this.getLineLen(hitBallNode, reflectDir).len + 25
                    : CueDataSys.getUsedCueAimLineLen();
                if (!isLinePropUsed && BallLogicMgr.useSimCueAttri && BallLogicMgr.simAimming) {
                    yellowLen = BallLogicMgr.simAimming;
                }
                const yellowSprite = cc.find("plane_table", this.node).getChildByName("sprite_dir_yellow");
                yellowSprite.x = hitBallNode.x;
                yellowSprite.y = hitBallNode.y;
                yellowSprite.getComponent("SpriteRayComp").resetWillGo(
                    reflectAngle / DEG_TO_RAD,
                    yellowLen,
                    powerPercent,
                    isLinePropUsed,
                    targetBallNode
                );
                yellowSprite.active = true;
            }
        }
        if (hitOffset == null) {
            zhexian = null;
            drawComp && drawComp.clear();
            const yellowSprite = cc.find("plane_table", this.node).getChildByName("sprite_dir_yellow");
            yellowSprite.active = false;
            greenSprite.x = origin.x;
            greenSprite.y = origin.y;
            greenSprite.active = true;
            const wallAngle = Math.atan2(direction.y, direction.x);
            let lineLen = 1000;
            const wallHit = this.getLineLen(this.mid, direction);
            const isPolygon = wallHit.is_polygon;
            lineLen = wallHit.len;
            const virtualLen = isLinePropUsed ? lineLen + 4 : lineLen;
            const virtualPos = direction.normalize().mulSelf(isPolygon ? virtualLen : lineLen - GlobalConfig.ball_radius).addSelf(this.mid);
            this.virtualball.x = virtualPos.x;
            this.virtualball.y = virtualPos.y;
            this.virtualball.active = true;
            const greenOffset = isPolygon ? -GlobalConfig.ball_radius : -2 * GlobalConfig.ball_radius;
            const lineOffset = isPolygon ? GlobalConfig.ball_radius : -4;
            greenSprite.getComponent("SpriteRayComp").reset(
                wallAngle / DEG_TO_RAD,
                lineLen + (isLinePropUsed ? lineOffset : greenOffset),
                powerPercent,
                isLinePropUsed
            );
        }
        return {
            tar_node: targetBallNode,
            zhexian,
        };
    }

    clear(): void {
        const drawComp = this.node.getChildByName("node_graphics").getComponent("DrawComp") as any;
        cc.find("plane_table", this.node).getChildByName("sprite_dir_green").active = false;
        drawComp && drawComp.clear();
        cc.find("plane_table", this.node).getChildByName("sprite_dir_yellow").active = false;
        this.virtualball.active = false;
    }

    foundCirclePoint(origin: cc.Vec2, ball: cc.Node, direction: cc.Vec2): cc.Vec2 {
        if (direction.y == 0) {
            direction.y = 1e-10;
        }
        if (direction.x == 0) {
            direction.x = 1e-10;
        }
        const delta = cc.v2(ball.x - origin.x, ball.y - origin.y);
        const slope = direction.y / direction.x;
        const radiusSq = BALL_RADIUS_SQUARE_X4;
        const coeffA = 1 + slope * slope;
        const coeffB = -(2 * delta.x + 2 * delta.y * slope);
        const discriminant = coeffB * coeffB - 4 * coeffA * (delta.x * delta.x + delta.y * delta.y - radiusSq);
        const sqrtDisc = Math.sqrt(discriminant);
        const hitX1 = (-coeffB + sqrtDisc) / (2 * coeffA);
        const hitX2 = (-coeffB - sqrtDisc) / (2 * coeffA);
        const hitY1 = hitX1 * slope;
        const hitY2 = hitX2 * slope;
        if (hitX1 && hitX2 && hitY1 && hitY2) {
            const hitA = cc.v2(hitX1, hitY1);
            const hitB = cc.v2(hitX2, hitY2);
            return hitA.mag() < hitB.mag() ? hitA : hitB;
        }
        return null;
    }

    getColliderP(start: cc.Vec2, direction: cc.Vec2): { is_polygon: boolean; croseP: cc.Vec2 } {
        const borderNode = cc
            .find("zhuo_pengzhuang", this.node)
            .getChildByName("pengzhuang_root")
            .getChildByName("zhuo_bian");
        return borderNode && borderNode.getComponent(cc.PolygonCollider)
            ? {
                  is_polygon: true,
                  croseP: this.getColliderP_Pollygon(borderNode, start, direction),
              }
            : {
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
        let closestDist: number = null;
        for (let i = 0; i < points.length; i++) {
            const edge = {
                start: points[i],
                end: points[(i + 1) % points.length],
            };
            const hit = this.getLineIntersection(line, edge);
            if (hit) {
                const dist = hit.sub(start).len();
                if (closestDist == null || closestDist > dist) {
                    closestDist = dist;
                    closestPoint = hit;
                }
            }
        }
        return closestPoint || line.end;
    }
}
