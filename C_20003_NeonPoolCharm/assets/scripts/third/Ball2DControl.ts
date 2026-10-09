import * as BallLogicMgr from "./BallLogicMgr";
import { ETaiQiuPropType } from "./ConfigDataMgr";
import EventMgr from "./EventMgr";
import GameEventType from "./GameEventType";
import { ID_WHITEBALL } from "./GlobalConfig";
import SdkHelper from "./SdkHelper";
import { BallMove } from "./WSCMD";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Ball2DControl extends cc.Component {

    @property
    ballID = 0;

    @property(cc.Node)
    ball3D: cc.Node = null;

    aimTargetUUID: any = null;
    accele_power: any = null;
    state: any = null;
    dir: any = null;
    isAutoPlaying: any = null;
    stopCallback: any = null;
    sensor_value: any = null;
    accele_dir: any = null;
    last_vel_angle: any = null;
    tooSmallIdx: any = null;
    colliderCount: any = null;
    _defaultLinearDamping: any = null;
    accele_power_div: any = null;
    accele_negOrPos_xx: any = null;
    accele_negOrPos_xy: any = null;
    accele_negOrPos_yx: any = null;
    accele_negOrPos_yy: any = null;
    _destroyCB: any = null;
    _rollTargetNodeWP: any;
    _onBeginContactZheShe: any;
    _onBeginContactLinearVelocityOther: any;

    isOnDeapMoving() {
        return "moving" == this.state || "on_destroy" == this.state || "on_destroy_roll" == this.state;
    }

    isTooSmallV(velocity) {
        return velocity.len() < 11;
    }

    doModifyMoveDir(dir) {
        if (dir && 0 != dir.len()) {
            const body = this.node.getComponent(cc.RigidBody);
            const speed = body.linearVelocity.len();
            dir = dir.normalize();
            body.linearVelocity = dir.mul(speed);
        }
    }

    todoAfterStop() {
        if (this.node.parent && this.stopCallback && !this.isOnDestroy()) {
            this.stopCallback(this.ballID);
        }
    }

    onEnable() {
    }

    onPropUsedStateChanged(data) {
        if (data.prop_type == ETaiQiuPropType.E_BaiQiu) {
            this.showBaiQiuEffect(data.state);
        }
    }

    sendOnePack(cmd, stopped) {
        stopped = stopped || 0;
        cmd = cmd || BallMove;
        const body = this.node.getComponent(cc.RigidBody);
        if (0 != stopped) {
            return {
                cmd: cmd,
                ballID: this.ballID,
                time: new Date().getTime(),
                x: this.node.x,
                y: this.node.y,
                vx: 0,
                vy: 0
            };
        }
        return {
            cmd: cmd,
            ballID: this.ballID,
            time: new Date().getTime(),
            x: this.node.x,
            y: this.node.y,
            vx: body.linearVelocity.x,
            vy: body.linearVelocity.y
        };
    }

    doDestroyTween(e, target, callback) {
        const self = this;
        this.state = "on_destroy";
        this.node.group = "qiudai_ball";
        this.ball3D.group = "qiudai_ball";
        this.node.getComponent(cc.PhysicsCircleCollider).restitution = .3;
        this.node.getComponent(cc.PhysicsCircleCollider).apply();
        this.accele_power = 0;
        this.accele_dir = null;
        this.last_vel_angle = null;
        if (target) {
            const world = target.children[0].convertToWorldSpaceAR(cc.Vec2.ZERO);
            this._rollTargetNodeWP = world;
            this._destroyCB = callback;
        } else {
            this._destroyCB = null;
        }
        if (target) {
            cc.v2(target.x, target.y), this.ball3D;
        } else {
            this.state = "on_destroy_roll";
            cc.tween(this.ball3D).to(.5, {
                scale: 0
            }).call(function () {
                console.log("All tweens finished.");
                self.state = "none";
                self.colliderCount = 0;
                callback();
            }).start();
        }
    }

    isBaiQiuEffectActive() {
        const effect = this.ball3D.getChildByName("baiqiu_sp_effect");
        return effect && effect.active;
    }

    onDisable() {
        this.showBaiQiuEffect(false);
    }

    getVelMag(velocity) {
        return cc.Vec2.mag(velocity);
    }

    isAcceleDirValid() {
        return this.colliderCount > 0 && this.accele_dir && (0 != this.accele_dir.x || 0 != this.accele_dir.y || 0 != this.accele_dir.z);
    }

    resetWhiteBallPos() {
        this.state = "resetWhiteBallPos";
        this.ball3D.scale = 1;
    }

    isOnDestroy() {
        return "on_destroy" == this.state || "on_destroy_roll" == this.state;
    }

    isMoving() {
        return "moving" == this.state;
    }

    ballWillBeDestroy(flag) {
        flag || !this.isAutoPlaying && this.isInPVPBattle() || this.isInMe_Editing();
    }

    onPreSolve(contact, selfCollider, otherCollider) {
        const other = otherCollider.node.getComponent("Ball2DControl") as any;
        if (this.ballID != ID_WHITEBALL && other) {
            if (contact.disabled) {
                selfCollider.body.linearVelocity = cc.Vec2.ZERO;
                contact.disabled = false;
                return;
            }
            if (contact.aimTargetUUID && contact.aimTargetUUID == this.node.uuid) {
                const aim = other.aimZheXian ? other.aimZheXian.normalize() : null;
                const otherVelocity = cc.v2(this._onBeginContactLinearVelocityOther);
                const normal = cc.v2(contact.getWorldManifold().normal).normalizeSelf().rotateSelf(Math.PI);
                const angle = aim ? aim.angle(otherVelocity) : normal.angle(otherVelocity);
                selfCollider.body.linearVelocity.len();
                if (angle > 1.3 && selfCollider.body.linearVelocity.len() < 30) {
                    selfCollider.body.linearVelocity = aim ? aim.mul(30) : normal.mul(30);
                    selfCollider.body.linearVelocity.len();
                }
            }
        }
    }

    isInPVPBattle() {
        return false;
    }

    setRadMove(dir, power) {
        this.accele_power = power || 1;
        if (this.accele_power < 1) {
            this.accele_power = 1;
        }
        if (this.accele_power > 100) {
            this.accele_power = 100;
        }
        this.accele_power = 1.1 * this.accele_power;
        const reduce = BallLogicMgr.getParam("speed_power_reduce");
        this.accele_power_div = reduce;
        this.accele_dir = dir;
        this.accele_negOrPos_xx = null;
        this.accele_negOrPos_xy = null;
        this.accele_negOrPos_yx = null;
        this.accele_negOrPos_yy = null;
        this.last_vel_angle = null;
    }

    isInMe_Editing() {
        return BallLogicMgr.MODE.ME_Editing == BallLogicMgr.game_mode;
    }

    getBallType() {
        return Math.floor(this.ballID / 100);
    }

    rollToQiuDai() {
        const self = this;
        this.sensor_value = false;
        this.node.getComponent(cc.PhysicsCircleCollider).enabled = this.sensor_value;
        this.node.group = "destroy";
        this.ball3D.group = "destroy";
        this.ball3D.children.forEach(function (child) {
            child.group = "destroy";
        });
        this.node.getComponent(cc.PhysicsCircleCollider).restitution = 0;
        this.node.getComponent(cc.PhysicsCircleCollider).apply();
        (this.ball3D.children[0].getComponent("3D_ballRoll") as any).setShowShadow(false);
        const worldPos = this.node.convertToWorldSpaceAR(cc.Vec2.ZERO);
        const targetPos = this._rollTargetNodeWP.sub(worldPos).normalizeSelf().mul(110).add(this.node.getPosition());
        cc.tween(this.node).to(1, {
            position: targetPos
        }).call(function () {
            self.state = "none";
            self.colliderCount = 0;
            if (self._destroyCB) {
                self._destroyCB();
            }
            self._destroyCB = null;
        }).start();
    }

    onLoad() {
        this.state = "none";
        this.dir = 0;
        this.isAutoPlaying = false;
        this.stopCallback = this.stopCallback || null;
        this.sensor_value = false;
        this.accele_dir = null;
        this.last_vel_angle = null;
        this.tooSmallIdx = 0;
        this.colliderCount = 0;
        this._defaultLinearDamping = this.node.getComponent(cc.RigidBody).linearDamping;
    }

    update() {
        const body = this.node.getComponent(cc.RigidBody);
        if ("moving" == this.state) {
            if (body.linearVelocity.len() < 100) {
                if (body.linearDamping == this._defaultLinearDamping) {
                    body.linearDamping = this._defaultLinearDamping * (body.linearVelocity.len() < 80 ? 4 : 3);
                }
            } else if (body.linearDamping != this._defaultLinearDamping) {
                body.linearDamping = this._defaultLinearDamping;
            }
        }
        if ("resetWhiteBallPos" == this.state) {
            this.state = "none";
            this.colliderCount = 0;
            this.node.x = -180;
            this.node.y = -180;
        }
        if ("on_destroy" != this.state) {
            if (!this.isOnDestroy()) {
                if (0 != body.linearVelocity.x || 0 != body.linearVelocity.y || this.accele_dir) {
                    if ("moving" == this.state || this.isOnDestroy()) {
                        let slope;
                        slope = 0 == body.linearVelocity.x ? 9999 : body.linearVelocity.y / body.linearVelocity.x;
                        if (slope - this.dir > .01 || slope - this.dir < -.01) {
                            this.dir = slope;
                        }
                        if (this.isAcceleDirValid()) {
                            const angle = Math.atan2(body.linearVelocity.y, body.linearVelocity.x);
                            if (!this.accele_negOrPos_yx) {
                                this.accele_negOrPos_yx = body.linearVelocity.x > 0 ? 1 : -1;
                                if (this.accele_dir.y < 0) {
                                    this.accele_negOrPos_yx = -this.accele_negOrPos_yx;
                                }
                            }
                            if (!this.accele_negOrPos_yy) {
                                this.accele_negOrPos_yy = body.linearVelocity.y > 0 ? 1 : -1;
                                if (this.accele_dir.y < 0) {
                                    this.accele_negOrPos_yy = -this.accele_negOrPos_yy;
                                }
                            }
                            const accelY = this.accele_dir.y * this.accele_power;
                            const impulseYx = Math.abs(Math.cos(angle) * accelY) * this.accele_negOrPos_yx;
                            const impulseYy = Math.abs(Math.sin(angle) * accelY) * this.accele_negOrPos_yy;
                            const sign = (cc.v2(1 * body.linearVelocity.x, 1 * body.linearVelocity.y), this.accele_dir.x < 0 ? -1 : 1);
                            const sideAngle = angle + Math.PI / 2 * sign;
                            const accelX = this.accele_dir.x * this.accele_power;
                            let impulseX = Math.cos(sideAngle) * Math.abs(accelX);
                            let impulseY = Math.sin(sideAngle) * Math.abs(accelX);
                            let ratio = this.getVelMag(body.linearVelocity) / 500;
                            ratio = ratio > 1 ? 1 : ratio;
                            const scaled = 1 * ratio;
                            impulseX *= scaled;
                            impulseY *= scaled;
                            if (this.last_vel_angle) {
                                const delta = Math.abs(this.last_vel_angle - angle);
                                if (delta > 5) {
                                    console.log("angle_delta", delta);
                                    console.log("xx xy", impulseX, impulseY, impulseYx, impulseYy);
                                }
                            }
                            this.node.x = this.node.x;
                            this.node.y = this.node.y;
                            this.accele_power = this.accele_power * this.accele_power_div;
                            if (this.accele_power < .01) {
                                this.accele_power = 0;
                                this.accele_dir = null;
                                this.last_vel_angle = null;
                            } else {
                                const impulse = cc.v2(impulseYx + impulseX, impulseYy + impulseY);
                                impulse.x = 1 * impulse.x;
                                impulse.y = 1 * impulse.y;
                                this.node.getComponent(cc.RigidBody).applyLinearImpulse(impulse, cc.v2(0, 0), true);
                            }
                            this.last_vel_angle = angle;
                        }
                        if (this.isTooSmallV(body.linearVelocity)) {
                            if (!this.isAcceleDirValid()) {
                                this.tooSmallIdx = 0;
                                this.stopMove();
                            }
                            console.log("stop by manual");
                        }
                    } else {
                        this.state = "moving";
                    }
                } else if (0 == body.linearVelocity.x && 0 == body.linearVelocity.y && "moving" == this.state) {
                    this.stopMove();
                }
            }
        } else if (body.linearVelocity.len() < 40) {
            this.state = "on_destroy_roll";
            this.rollToQiuDai();
        }
    }

    onEndContact(contact, selfCollider, otherCollider) {
        if (this.ballID == ID_WHITEBALL) {
            (selfCollider.node.getComponent("Ball2DControl") as any).aimZheXian = null;
        }
        otherCollider.body.node;
    }

    stopMove() {
        this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 0);
        this.accele_power = 0;
        this.accele_dir = null;
        this.last_vel_angle = null;
        if (!this.isOnDestroy()) {
            this.state = "none";
            this.colliderCount = 0;
        }
        this.todoAfterStop();
    }

    modifyMoveToHole(moveDir) {
        !BallLogicMgr.isModifyBallDir || "moving" != this.state && "none" != this.state || EventMgr.trigger(GameEventType.ModifyBallMoveDir, {
            moveDir: moveDir,
            ball2DCtrl: this,
            cb: this.doModifyMoveDir.bind(this)
        });
    }

    getNowPos() {
        return cc.v2(this.node.x, this.node.y);
    }

    onPostSolve(contact, selfCollider, otherCollider) {
        const other = otherCollider.node.getComponent("Ball2DControl") as any;
        if (this.ballID == ID_WHITEBALL) {
            this.colliderCount++;
        }
        if (this.ballID != ID_WHITEBALL) {
            if (other) {
                if (contact.disabled) {
                    selfCollider.body.linearVelocity = cc.Vec2.ZERO;
                    contact.disabled = false;
                    return;
                }
                if (contact.aimTargetUUID && contact.aimTargetUUID == this.node.uuid && other.aimZheXian) {
                    const aim = other.aimZheXian.normalize();
                    if (aim) {
                        const speed = selfCollider.body.linearVelocity.len();
                        selfCollider.body.linearVelocity = aim.mul(speed);
                        console.log("jkd2972 onPostSolve", speed, aim);
                    }
                } else {
                    this.modifyMoveToHole(selfCollider.body.linearVelocity);
                }
            } else {
                this.modifyMoveToHole(selfCollider.body.linearVelocity);
            }
        }
    }

    onBeginContact(contact, selfCollider, otherCollider) {
        const other = otherCollider.node.getComponent("Ball2DControl") as any;
        if (this.ballID != ID_WHITEBALL && other && other.ballID == ID_WHITEBALL) {
            if (other.aimTargetUUID && other.aimTargetUUID != this.node.uuid) {
                contact.disabled = true;
            } else {
                contact.aimTargetUUID = other.aimTargetUUID;
                other.aimTargetUUID = null;
            }
            const selfVelocity = cc.v2(selfCollider.body.linearVelocity);
            this._onBeginContactZheShe = other.aimZheShe;
            this._onBeginContactLinearVelocityOther = cc.v2(otherCollider.body.linearVelocity);
            console.log("jkd2972 onBeginContact", selfVelocity, this._onBeginContactLinearVelocityOther);
        }
        if (this.ballID == ID_WHITEBALL && this.aimTargetUUID && !other) {
            this.aimTargetUUID = null;
        }
        const node = otherCollider.body.node;
        if (node.getComponent("Ball2DControl")) {
            BallLogicMgr.playBallCollideSound();
            if (this.ballID == ID_WHITEBALL && BallLogicMgr.curPowerPercentFlag >= 1) {
                SdkHelper.setVibrator();
                BallLogicMgr.curPowerPercentFlag = 0;
            }
        } else if ("default" == node.group) {
            BallLogicMgr.playBoardCollideSound();
        }
        const reduce = BallLogicMgr.getParam("accele_power_reduce");
        this.accele_power = this.accele_power * reduce;
    }

    showBaiQiuEffect(active) {
        if (this.ball3D) {
            this.ball3D.zIndex = 999;
            const effect = this.ball3D.getChildByName("baiqiu_sp_effect");
            if (effect) {
                effect.active = active;
            }
            const tip = this.ball3D.getChildByName("baiqiu_tip");
            if (tip) {
                tip.active = active;
                if (active) {
                    this.scheduleOnce(function () {
                        tip.active = false;
                    }, 1.5);
                }
            }
        }
    }
}
