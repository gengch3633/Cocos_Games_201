import BallLogicMgr from "./BallLogicMgr";
import CueDataSys from "./CueDataSys";

const { ccclass } = cc._decorator;

@ccclass
export default class game_UI_radPage extends cc.Component {
    pos_value = null;

    nodeCircle = null;

    angle = null;

    cb_yes = null;

    getPosValue() {
        return this.pos_value;
    }

    start() {}

    close() {
        this.node.parent = null;
    }

    updateLabelAngle() {
        cc.find("label_angle", this.node).getComponent(cc.Label).string = this.angle;
    }

    movetoPos(e) {
        const t = cc.find("node_circle", this.node);
        this.nodeCircle = t;
        const o = cc.find("node_red", t);
        e = this.modifyP(e);
        this.pos_value = cc.v2(e.x / 210, e.y / 210);
        const n = e.mag() / 210;
        if (n > 1) {
            e.x = e.x / n;
            e.y = e.y / n;
            this.pos_value.x = this.pos_value.x / n;
            this.pos_value.y = this.pos_value.y / n;
        }
        this.pos_value.x = this.pos_value.x > 1 ? 1 : this.pos_value.x;
        this.pos_value.y = this.pos_value.y > 1 ? 1 : this.pos_value.y;
        o.x = e.x;
        o.y = e.y;
        this.updateLabelValue();
    }

    modifyP(e) {
        e.x += this.nodeCircle.x;
        e.y += this.nodeCircle.y;
        let t = Math.max(0, e.x + 250);
        t = Math.min(t, 499);
        const o = Math.floor(t / 20);
        let n = Math.max(0, e.y + 250);
        n = Math.min(n, 499);
        const i = 20 * (o + .5) - 250;
        const a = 20 * (Math.floor(n / 20) + .5) - 250;
        return cc.v2(i, a);
    }

    updateLabelValue() {
        cc.find("label_value", this.node).getComponent(cc.Label).string = "(" + Math.round(100 * this.pos_value.x) + "," + Math.round(100 * this.pos_value.y) + ")";
    }

    show(e, t) {
        this.node.parent = e;
        this.cb_yes = t || null;
    }

    closeAndDestroy() {
        this.node.parent = null;
        this.node.destroy();
    }

    onLoad() {
        const e = this;
        this.cb_yes = this.cb_yes || null;
        this.pos_value = cc.v2(0, 0);
        this.angle = 0;
        const t = cc.find("node_circle", this.node);
        t.on(cc.Node.EventType.TOUCH_START, function (o) {
            console.log("TOUCH_START");
            const n = cc.v2(o.touch._point.x, o.touch._point.y);
            const i = t.convertToNodeSpaceAR(n);
            e.movetoPos(i);
        });
        t.on(cc.Node.EventType.TOUCH_MOVE, function (o) {
            console.log("TOUCH_MOVE");
            const n = cc.v2(o.touch._point.x, o.touch._point.y);
            const i = t.convertToNodeSpaceAR(n);
            e.movetoPos(i);
        });
        t.on(cc.Node.EventType.TOUCH_END, function () {
            if (e.cb_yes) {
                let t = CueDataSys.getUsedCueRoleAngle();
                BallLogicMgr.useSimCueAttri && BallLogicMgr.simCueSpin && (t = BallLogicMgr.simCueSpin);
                e.cb_yes(e.pos_value, t);
            }
            e.closeAndDestroy();
        });
        t.on(cc.Node.EventType.TOUCH_CANCEL, function () {
            if (e.cb_yes) {
                let t = CueDataSys.getUsedCueRoleAngle();
                BallLogicMgr.useSimCueAttri && BallLogicMgr.simCueSpin && (t = BallLogicMgr.simCueSpin);
                e.cb_yes(e.pos_value, t);
            }
            e.closeAndDestroy();
        });
        cc.find("button_bg", this.node).on("click", function () {
            e.closeAndDestroy();
        });
    }
}
