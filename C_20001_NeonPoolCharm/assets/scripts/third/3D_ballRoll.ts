import * as GlobalConfig from "./GlobalConfig";

const { ccclass, property } = cc._decorator;

const ballRadius = GlobalConfig.ball_radius;
const DEG_TO_RAD = Math.PI / 180;

@ccclass("3D_ballRoll")
export default class D3DBallRoll extends cc.Component {
    @property(cc.Node)
    pos_node: cc.Node = null;

    @property(cc.Node)
    shadow_node: cc.Node = null;

    @property
    bind_node_ps: boolean = false;

    @property
    isShowShadow: boolean = true;

    lastx: number = null;
    lasty: number = null;
    quat: cc.Quat = null;

    onLoad(): void {
        this.lastx = 0;
        this.lasty = 0;
        if (this.pos_node) {
            this.lastx = this.pos_node.x;
            this.lasty = this.pos_node.y;
        }
        this.quat = cc.quat();
        cc.Quat.rotateY(this.quat, this.quat, 150 * DEG_TO_RAD);
        this.node.setRotation(this.quat);
    }

    setShowShadow(show: boolean): void {
        this.isShowShadow = show;
        this.shadow_node.active = show;
    }

    oneStep(): void {
        const x = this.pos_node.x;
        const y = this.pos_node.y;
        const dist = cc.Vec2.distance(cc.v2(x, y), cc.v2(this.lastx, this.lasty));
        if (dist > 0) {
            const delta = cc.v2(x - this.lastx, y - this.lasty);
            const axis = cc.v2(0, 0);
            delta.rotate(90 * DEG_TO_RAD, axis);
            let angle = dist / (2 * ballRadius);
            angle %= Math.PI;
            let rotAxis = cc.v3(axis.x, axis.y, 0);
            rotAxis = rotAxis.normalizeSelf();
            cc.Quat.rotateAround(this.quat, this.quat, rotAxis, angle);
            this.node.setRotation(this.quat);
            this.lastx = this.pos_node.x;
            this.lasty = this.pos_node.y;
        }
        if (this.bind_node_ps) {
            this.node.parent.x = this.pos_node.x;
            this.node.parent.y = this.pos_node.y;
            const offsetX = this.node.parent.x / 1500 * 20;
            const offsetY = this.node.parent.y / 1500 * 20;
            this.shadow_node.x = this.node.parent.x + offsetX;
            this.shadow_node.y = this.node.parent.y + offsetY;
        }
    }

    update(_dt: number): void {
        this.oneStep();
    }
}
