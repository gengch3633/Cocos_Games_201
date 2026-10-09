import BallLogicMgr from "./BallLogicMgr";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BallControlInEditor extends cc.Component {
    @property
    ballID = 0;

    matIdx = null;
    deleteOne = null;
    startx = null;
    starty = null;
    ballType = null;
    posx = null;
    posy = null;
    node_editor = null;

    setMatIdx(e) {
        this.matIdx = e;
        const t = this.node.getChildByName("New Sphere").getComponent(cc.MeshRenderer);
        const o = t.getMaterials();
        this.matIdx >= o.length && (this.matIdx = 0);
        const n = o[this.matIdx];
        t.setMaterial(0, n);
    }

    getMatIdx() {
        return this.matIdx;
    }

    onEnd() {
        console.log("TOUCH_END");
        const e = this.node;
        if (!this.checkAvailable(e)) {
            e.x = this.startx;
            e.y = this.starty;
            this.deleteOne(e);
            e.parent = null;
            e.destroy();
        }
    }

    checkAvailable(e) {
        const t = this.node.parent.getChildByName("node_checkRect");
        if (!cc.rect(-t.width / 2, -t.height / 2, t.width, t.height).contains(cc.v2(e.x, e.y))) {
            console.log("not contains");
            return false;
        }
        return true;
    }

    onStart() {
        console.log("TOUCH_START");
        const e = this.node;
        this.startx = Math.floor(e.x);
        this.starty = Math.floor(e.y);
    }

    onEnable() {}

    onCancel() {
        console.log("TOUCH_CANCEL");
        const e = this.node;
        if (!this.checkAvailable(e)) {
            e.x = this.startx;
            e.y = this.starty;
        }
    }

    onLoad() {
        this.ballID = this.ballID || 0;
        this.ballType = BallLogicMgr.BallIDType_Normal;
        this.matIdx = this.matIdx || 0;
        this.deleteOne = this.deleteOne || null;
        this.posx = 0;
        this.posy = 0;
        this.node_editor = null;
        this.node;
        this.startx = 0;
        this.starty = 0;
    }

    onMove(e) {
        const t = this.node;
        const o = cc.v2(e.touch._point.x, e.touch._point.y);
        const n = t.parent.convertToNodeSpaceAR(o);
        t.x = Math.floor(n.x);
        t.y = Math.floor(n.y);
    }

    deleteFun(e) {
        this.deleteOne = e;
    }

    update() {}
}
