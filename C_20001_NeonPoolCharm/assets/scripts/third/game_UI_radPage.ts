import * as BallLogicMgr from "./BallLogicMgr";
import CueDataSys from "./CueDataSys";

const { ccclass } = cc._decorator;

@ccclass
export default class game_UI_radPage extends cc.Component {
    pos_value: cc.Vec2 = null;
    nodeCircle: cc.Node = null;
    angle: number = null;
    cb_yes: (pos: cc.Vec2, angle: number) => void = null;

    getPosValue(): cc.Vec2 {
        return this.pos_value;
    }

    start(): void {}

    close(): void {
        this.node.parent = null;
    }

    updateLabelAngle(): void {
        cc.find("label_angle", this.node).getComponent(cc.Label).string = "" + this.angle;
    }

    movetoPos(pos: cc.Vec2): void {
        const circle = cc.find("node_circle", this.node);
        this.nodeCircle = circle;
        const red = cc.find("node_red", circle);
        pos = this.modifyP(pos);
        this.pos_value = cc.v2(pos.x / 210, pos.y / 210);
        const mag = pos.mag() / 210;
        if (mag > 1) {
            pos.x = pos.x / mag;
            pos.y = pos.y / mag;
            this.pos_value.x = this.pos_value.x / mag;
            this.pos_value.y = this.pos_value.y / mag;
        }
        this.pos_value.x = this.pos_value.x > 1 ? 1 : this.pos_value.x;
        this.pos_value.y = this.pos_value.y > 1 ? 1 : this.pos_value.y;
        red.x = pos.x;
        red.y = pos.y;
        this.updateLabelValue();
    }

    modifyP(pos: cc.Vec2): cc.Vec2 {
        pos.x += this.nodeCircle.x;
        pos.y += this.nodeCircle.y;
        let x = Math.max(0, pos.x + 250);
        x = Math.min(x, 499);
        const col = Math.floor(x / 20);
        let y = Math.max(0, pos.y + 250);
        y = Math.min(y, 499);
        const snapX = 20 * (col + 0.5) - 250;
        const snapY = 20 * (Math.floor(y / 20) + 0.5) - 250;
        return cc.v2(snapX, snapY);
    }

    updateLabelValue(): void {
        cc.find("label_value", this.node).getComponent(cc.Label).string =
            "(" + Math.round(100 * this.pos_value.x) + "," + Math.round(100 * this.pos_value.y) + ")";
    }

    show(parent: cc.Node, callback?: (pos: cc.Vec2, angle: number) => void): void {
        this.node.parent = parent;
        this.cb_yes = callback || null;
    }

    closeAndDestroy(): void {
        this.node.parent = null;
        this.node.destroy();
    }

    onLoad(): void {
        this.cb_yes = this.cb_yes || null;
        this.pos_value = cc.v2(0, 0);
        this.angle = 0;
        const circle = cc.find("node_circle", this.node);
        circle.on(cc.Node.EventType.TOUCH_START, (event: cc.Event.EventTouch) => {
            console.log("TOUCH_START");
            const touchPoint = cc.v2((event.touch as any)._point.x, (event.touch as any)._point.y);
            const localPos = circle.convertToNodeSpaceAR(touchPoint);
            this.movetoPos(localPos);
        });
        circle.on(cc.Node.EventType.TOUCH_MOVE, (event: cc.Event.EventTouch) => {
            console.log("TOUCH_MOVE");
            const touchPoint = cc.v2((event.touch as any)._point.x, (event.touch as any)._point.y);
            const localPos = circle.convertToNodeSpaceAR(touchPoint);
            this.movetoPos(localPos);
        });
        const finish = () => {
            if (this.cb_yes) {
                let angle = CueDataSys.getUsedCueRoleAngle();
                if ((BallLogicMgr as any).useSimCueAttri && (BallLogicMgr as any).simCueSpin) {
                    angle = (BallLogicMgr as any).simCueSpin;
                }
                this.cb_yes(this.pos_value, angle);
            }
            this.closeAndDestroy();
        };
        circle.on(cc.Node.EventType.TOUCH_END, finish);
        circle.on(cc.Node.EventType.TOUCH_CANCEL, finish);
        cc.find("button_bg", this.node).on("click", () => {
            this.closeAndDestroy();
        });
    }
}
