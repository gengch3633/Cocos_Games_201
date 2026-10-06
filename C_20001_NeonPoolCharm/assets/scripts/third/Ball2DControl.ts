import * as GlobalConfig from "./GlobalConfig";
import WSCMD = require("./WSCMD");
import SdkHelper from "./SdkHelper";
import EventMgr from "./EventMgr";
import GameEventType from "./GameEventType";
import { ETaiQiuPropType } from "./ConfigDataMgr";
import * as BallLogicMgr from "./BallLogicMgr";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Ball2DControl extends cc.Component {
    @property()
    ballID = 0;

    @property(cc.Node)
    ball3D: cc.Node = null;

    aimTargetUUID: string = null;
    aimZheXian: cc.Vec2 = null;
    aimZheShe: cc.Vec2 = null;
    accele_power: number = null;
    state: string = null;
    dir = 0;
    isAutoPlaying = false;
    stopCallback: ((ballID: number) => void) = null;
    sensor_value = false;
    accele_dir: cc.Vec3 = null;
    last_vel_angle: number = null;
    tooSmallIdx = 0;
    colliderCount = 0;
    private _defaultLinearDamping: number = null;
    accele_power_div: number = null;
    accele_negOrPos_xx: number = null;
    accele_negOrPos_xy: number = null;
    accele_negOrPos_yx: number = null;
    accele_negOrPos_yy: number = null;
    private _destroyCB: (() => void) = null;
    private _rollTargetNodeWP: cc.Vec2 = null;
    private _onBeginContactZheShe: cc.Vec2 = null;
    private _onBeginContactLinearVelocityOther: cc.Vec2 = null;

    isOnDeapMoving(): boolean {
        return this.state == "moving" || this.state == "on_destroy" || this.state == "on_destroy_roll";
    }

    isTooSmallV(velocity: cc.Vec2): boolean {
        return velocity.len() < 11;
    }

    doModifyMoveDir(dir: cc.Vec2): void {
        if (dir && dir.len() != 0) {
            const body = this.node.getComponent(cc.RigidBody);
            const speed = body.linearVelocity.len();
            dir = dir.normalize();
            body.linearVelocity = dir.mul(speed);
        }
    }

    todoAfterStop(): void {
        if (this.node.parent && this.stopCallback && !this.isOnDestroy()) {
            this.stopCallback(this.ballID);
        }
    }

    onEnable(): void {}

    onPropUsedStateChanged(data: { prop_type: number; state: boolean }): void {
        if (data.prop_type == ETaiQiuPropType.E_BaiQiu) {
            this.showBaiQiuEffect(data.state);
        }
    }

    sendOnePack(cmd?: number, zeroVelocity?: number): any {
        zeroVelocity = zeroVelocity || 0;
        cmd = cmd || WSCMD.BallMove;
        const body = this.node.getComponent(cc.RigidBody);
        if (zeroVelocity != 0) {
            return {
                cmd,
                ballID: this.ballID,
                time: new Date().getTime(),
                x: this.node.x,
                y: this.node.y,
                vx: 0,
                vy: 0,
            };
        }
        return {
            cmd,
            ballID: this.ballID,
            time: new Date().getTime(),
            x: this.node.x,
            y: this.node.y,
            vx: body.linearVelocity.x,
            vy: body.linearVelocity.y,
        };
    }

    doDestroyTween(_unused: unknown, target: cc.Node, callback: () => void): void {
        this.state = "on_destroy";
        this.node.group = "qiudai_ball";
        this.ball3D.group = "qiudai_ball";
        this.node.getComponent(cc.PhysicsCircleCollider).restitution = 0.3;
        this.node.getComponent(cc.PhysicsCircleCollider).apply();
        this.accele_power = 0;
        this.accele_dir = null;
        this.last_vel_angle = null;
        if (target) {
            this._rollTargetNodeWP = target.children[0].convertToWorldSpaceAR(cc.Vec2.ZERO);
            this._destroyCB = callback;
        } else {
            this._destroyCB = null;
        }
        if (target) {
            cc.v2(target.x, target.y);
            this.ball3D;
        } else {
            this.state = "on_destroy_roll";
            cc.tween(this.ball3D)
                .to(0.5, { scale: 0 })
                .call(() => {
                    console.log("All tweens finished.");
                    this.state = "none";
                    this.colliderCount = 0;
                    callback();
                })
                .start();
        }
    }

    isBaiQiuEffectActive(): boolean {
        const effect = this.ball3D.getChildByName("baiqiu_sp_effect");
        return effect && effect.active;
    }

    onDisable(): void {
        this.showBaiQiuEffect(false);
    }

    getVelMag(velocity: cc.Vec2): number {
        return cc.Vec2.mag(velocity);
    }

    isAcceleDirValid(): boolean {
        return (
            this.colliderCount > 0 &&
            this.accele_dir &&
            (this.accele_dir.x != 0 || this.accele_dir.y != 0 || this.accele_dir.z != 0)
        );
    }

    resetWhiteBallPos(): void {
        this.state = "resetWhiteBallPos";
        this.ball3D.scale = 1;
    }

    isOnDestroy(): boolean {
        return this.state == "on_destroy" || this.state == "on_destroy_roll";
    }

    isMoving(): boolean {
        return this.state == "moving";
    }

    ballWillBeDestroy(force?: boolean): void {
        force || (!this.isAutoPlaying && this.isInPVPBattle()) || this.isInMe_Editing();
    }

    onPreSolve(contact: any, selfBody: any, otherCollider: cc.PhysicsCollider): void {
        const otherCtrl = otherCollider.node.getComponent("Ball2DControl") as Ball2DControl;
        if (this.ballID != GlobalConfig.ID_WHITEBALL && otherCtrl) {
            if (contact.disabled) {
                selfBody.body.linearVelocity = cc.Vec2.ZERO;
                contact.disabled = false;
                return;
            }
            if (contact.aimTargetUUID && contact.aimTargetUUID == this.node.uuid) {
                const aimDir = otherCtrl.aimZheXian ? otherCtrl.aimZheXian.normalize() : null;
                const otherVel = cc.v2(this._onBeginContactLinearVelocityOther);
                const normal = cc.v2(contact.getWorldManifold().normal).normalizeSelf().rotateSelf(Math.PI);
                const angle = aimDir ? aimDir.angle(otherVel) : normal.angle(otherVel);
                selfBody.body.linearVelocity.len();
                if (angle > 1.3 && selfBody.body.linearVelocity.len() < 30) {
                    selfBody.body.linearVelocity = aimDir ? aimDir.mul(30) : normal.mul(30);
                    selfBody.body.linearVelocity.len();
                }
            }
        }
    }

    isInPVPBattle(): boolean {
        return false;
    }

    setRadMove(dir: cc.Vec3, power?: number): void {
        this.accele_power = power || 1;
        if (this.accele_power < 1) {
            this.accele_power = 1;
        }
        if (this.accele_power > 100) {
            this.accele_power = 100;
        }
        this.accele_power = 1.1 * this.accele_power;
        this.accele_power_div = BallLogicMgr.getParam("speed_power_reduce");
        this.accele_dir = dir;
        this.accele_negOrPos_xx = null;
        this.accele_negOrPos_xy = null;
        this.accele_negOrPos_yx = null;
        this.accele_negOrPos_yy = null;
        this.last_vel_angle = null;
    }

    isInMe_Editing(): boolean {
        return BallLogicMgr.MODE.ME_Editing == BallLogicMgr.game_mode;
    }

    getBallType(): number {
        return Math.floor(this.ballID / 100);
    }

    rollToQiuDai(): void {
        this.sensor_value = false;
        this.node.getComponent(cc.PhysicsCircleCollider).enabled = this.sensor_value;
        this.node.group = "destroy";
        this.ball3D.group = "destroy";
        this.ball3D.children.forEach((child) => {
            child.group = "destroy";
        });
        this.node.getComponent(cc.PhysicsCircleCollider).restitution = 0;
        this.node.getComponent(cc.PhysicsCircleCollider).apply();
        (this.ball3D.children[0].getComponent("3D_ballRoll") as any).setShowShadow(false);
        const worldPos = this.node.convertToWorldSpaceAR(cc.Vec2.ZERO);
        const targetPos = this._rollTargetNodeWP.sub(worldPos).normalizeSelf().mul(110).add(this.node.getPosition());
        cc.tween(this.node)
            .to(1, { position: targetPos })
            .call(() => {
                this.state = "none";
                this.colliderCount = 0;
                if (this._destroyCB) {
                    this._destroyCB();
                }
                this._destroyCB = null;
            })
            .start();
    }

    onLoad(): void {
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

    update(): void {
        const body = this.node.getComponent(cc.RigidBody);
        if (this.state == "moving") {
            if (body.linearVelocity.len() < 100) {
                if (body.linearDamping == this._defaultLinearDamping) {
                    body.linearDamping = this._defaultLinearDamping * (body.linearVelocity.len() < 80 ? 4 : 3);
                }
            } else if (body.linearDamping != this._defaultLinearDamping) {
                body.linearDamping = this._defaultLinearDamping;
            }
        }
        if (this.state == "resetWhiteBallPos") {
            this.state = "none";
            this.colliderCount = 0;
            this.node.x = -180;
            this.node.y = -180;
        }
        if (this.state != "on_destroy") {
            if (!this.isOnDestroy()) {
                if (body.linearVelocity.x != 0 || body.linearVelocity.y != 0 || this.accele_dir) {
                    if (this.state == "moving" || this.isOnDestroy()) {
                        let slope =
                            body.linearVelocity.x == 0 ? 9999 : body.linearVelocity.y / body.linearVelocity.x;
                        if (slope - this.dir > 0.01 || slope - this.dir < -0.01) {
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
                            const spinY = this.accele_dir.y * this.accele_power;
                            const impulseYx = Math.abs(Math.cos(angle) * spinY) * this.accele_negOrPos_yx;
                            const impulseYy = Math.abs(Math.sin(angle) * spinY) * this.accele_negOrPos_yy;
                            const spinSign = this.accele_dir.x < 0 ? -1 : 1;
                            const sideAngle = angle + (Math.PI / 2) * spinSign;
                            const spinX = this.accele_dir.x * this.accele_power;
                            let impulseXx = Math.cos(sideAngle) * Math.abs(spinX);
                            let impulseXy = Math.sin(sideAngle) * Math.abs(spinX);
                            let dampRatio = this.getVelMag(body.linearVelocity) / 500;
                            dampRatio = dampRatio > 1 ? 1 : dampRatio;
                            const damp = 1 * dampRatio;
                            impulseXx *= damp;
                            impulseXy *= damp;
                            if (this.last_vel_angle) {
                                const angleDelta = Math.abs(this.last_vel_angle - angle);
                                if (angleDelta > 5) {
                                    console.log("angle_delta", angleDelta);
                                    console.log("xx xy", impulseXx, impulseXy, impulseYx, impulseYy);
                                }
                            }
                            this.node.x = this.node.x;
                            this.node.y = this.node.y;
                            this.accele_power = this.accele_power * this.accele_power_div;
                            if (this.accele_power < 0.01) {
                                this.accele_power = 0;
                                this.accele_dir = null;
                                this.last_vel_angle = null;
                            } else {
                                const impulse = cc.v2(impulseYx + impulseXx, impulseYy + impulseXy);
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
                } else if (
                    body.linearVelocity.x == 0 &&
                    body.linearVelocity.y == 0 &&
                    this.state == "moving"
                ) {
                    this.stopMove();
                }
            }
        } else if (body.linearVelocity.len() < 40) {
            this.state = "on_destroy_roll";
            this.rollToQiuDai();
        }
    }

    onEndContact(_contact: any, selfCollider: cc.PhysicsCollider, _other: cc.PhysicsCollider): void {
        if (this.ballID == GlobalConfig.ID_WHITEBALL) {
            (selfCollider.node.getComponent("Ball2DControl") as Ball2DControl).aimZheXian = null;
        }
    }

    stopMove(): void {
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

    modifyMoveToHole(moveDir: cc.Vec2): void {
        if (
            BallLogicMgr.isModifyBallDir &&
            (this.state == "moving" || this.state == "none")
        ) {
            EventMgr.trigger(GameEventType.ModifyBallMoveDir, {
                moveDir,
                ball2DCtrl: this,
                cb: this.doModifyMoveDir.bind(this),
            });
        }
    }

    getNowPos(): cc.Vec2 {
        return cc.v2(this.node.x, this.node.y);
    }

    onPostSolve(contact: any, selfBody: any, otherCollider: cc.PhysicsCollider): void {
        const otherCtrl = otherCollider.node.getComponent("Ball2DControl") as Ball2DControl;
        if (this.ballID == GlobalConfig.ID_WHITEBALL) {
            this.colliderCount++;
        }
        if (this.ballID != GlobalConfig.ID_WHITEBALL) {
            if (otherCtrl) {
                if (contact.disabled) {
                    selfBody.body.linearVelocity = cc.Vec2.ZERO;
                    contact.disabled = false;
                    return;
                }
                if (contact.aimTargetUUID && contact.aimTargetUUID == this.node.uuid && otherCtrl.aimZheXian) {
                    const aimDir = otherCtrl.aimZheXian.normalize();
                    if (aimDir) {
                        const speed = selfBody.body.linearVelocity.len();
                        selfBody.body.linearVelocity = aimDir.mul(speed);
                        console.log("jkd2972 onPostSolve", speed, aimDir);
                    }
                } else {
                    this.modifyMoveToHole(selfBody.body.linearVelocity);
                }
            } else {
                this.modifyMoveToHole(selfBody.body.linearVelocity);
            }
        }
    }

    onBeginContact(contact: any, selfCollider: cc.PhysicsCollider, otherCollider: cc.PhysicsCollider): void {
        const otherCtrl = otherCollider.node.getComponent("Ball2DControl") as Ball2DControl;
        if (
            this.ballID != GlobalConfig.ID_WHITEBALL &&
            otherCtrl &&
            otherCtrl.ballID == GlobalConfig.ID_WHITEBALL
        ) {
            if (otherCtrl.aimTargetUUID && otherCtrl.aimTargetUUID != this.node.uuid) {
                contact.disabled = true;
            } else {
                contact.aimTargetUUID = otherCtrl.aimTargetUUID;
                otherCtrl.aimTargetUUID = null;
            }
            const selfVel = cc.v2(selfCollider.body.linearVelocity);
            this._onBeginContactZheShe = otherCtrl.aimZheShe;
            this._onBeginContactLinearVelocityOther = cc.v2(otherCollider.body.linearVelocity);
            console.log("jkd2972 onBeginContact", selfVel, this._onBeginContactLinearVelocityOther);
        }
        if (this.ballID == GlobalConfig.ID_WHITEBALL && this.aimTargetUUID && !otherCtrl) {
            this.aimTargetUUID = null;
        }
        const otherNode = otherCollider.body.node;
        if (otherNode.getComponent("Ball2DControl")) {
            BallLogicMgr.playBallCollideSound();
            if (this.ballID == GlobalConfig.ID_WHITEBALL && BallLogicMgr.curPowerPercentFlag >= 1) {
                SdkHelper.setVibrator();
                BallLogicMgr.curPowerPercentFlag = 0;
            }
        } else if (otherNode.group == "default") {
            BallLogicMgr.playBoardCollideSound();
        }
        const reduce = BallLogicMgr.getParam("accele_power_reduce");
        this.accele_power = this.accele_power * reduce;
    }

    showBaiQiuEffect(active: boolean): void {
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
                    this.scheduleOnce(() => {
                        tip.active = false;
                    }, 1.5);
                }
            }
        }
    }
}
