import GlobalConfig from "./GlobalConfig";

const { ccclass, property } = cc._decorator;

const degToRad = Math.PI / 180;

@ccclass("3D_ballRoll")
export default class _3D_ballRoll extends cc.Component {

    @property(cc.Node)
    pos_node: cc.Node = null;

    @property(cc.Node)
    shadow_node: cc.Node = null;

    @property
    bind_node_ps = false;

    @property
    isShowShadow = true;

    lastx: any = null;
    lasty: any = null;
    quat: any = null;

    onLoad() {
        this.lastx = 0;
        this.lasty = 0;
        if (this.pos_node) {
            this.lastx = this.pos_node.x;
            this.lasty = this.pos_node.y;
        }
        this.quat = cc.quat();
        cc.Quat.rotateY(this.quat, this.quat, 150 * degToRad);
        this.node.setRotation(this.quat);
    }

    setShowShadow(show) {
        this.isShowShadow = show;
        this.shadow_node.active = show;
    }

    oneStep(dt) {
        const x = this.pos_node.x;
        const y = this.pos_node.y;
        const distance = cc.Vec2.distance(cc.v2(x, y), cc.v2(this.lastx, this.lasty));
        if (distance > 0) {
            const delta = cc.v2(x - this.lastx, y - this.lasty);
            const rotated = cc.v2(0, 0);
            delta.rotate(90 * degToRad, rotated);
            let angle = distance / (2 * GlobalConfig.ball_radius);
            angle %= Math.PI;
            let axis = cc.v3(rotated.x, rotated.y, 0);
            axis = axis.normalizeSelf();
            cc.Quat.rotateAround(this.quat, this.quat, axis, angle);
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

    update(dt) {
        this.oneStep(dt);
    }
}
