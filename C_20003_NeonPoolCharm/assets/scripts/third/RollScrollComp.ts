import EventMgr from "./EventMgr";
import GameEventType from "./GameEventType";

const { ccclass, property } = cc._decorator;

@ccclass
export default class RollScrollComp extends cc.Component {
    @property(cc.Prefab)
    item_prefab = null;

    @property(cc.Node)
    rolleNode = null;

    callback = null;
    valueY = null;

    setCallBack(e) {
        this.callback = e;
    }

    updateLabel(e) {
        cc.find("label_value", this.node.parent).getComponent(cc.Label).string = e;
    }

    clearLabel() {
        cc.find("label_value", this.node.parent).getComponent(cc.Label).string = "";
    }

    onLoad() {
        const e = this;
        this.callback = this.callback || null;
        this.valueY = 0;
        const t = this.node.parent;
        t.on(cc.Node.EventType.TOUCH_START, function (t) {
            if (!t.touch || 0 == t.touch.getID()) {
                EventMgr.trigger(GameEventType.HIDE_GAMETIP);
                t.touch._point;
                e.valueY = 0;
            }
        });
        t.on(cc.Node.EventType.TOUCH_MOVE, function (t) {
            if (!t.touch || 0 == t.touch.getID()) {
                EventMgr.trigger(GameEventType.HIDE_GAMETIP);
                const o = t.touch._point;
                const n = t.touch._prevPoint;
                const i = o.x - n.x;
                e.valueY = e.valueY + i;
                let a = e.rolleNode.x += i;
                const r = Math.abs(a);
                r > 126 && (a = (i < 0 ? -1 : 1) * (r - 126));
                e.rolleNode.x = a;
                e.callback && e.callback(i, e.valueY);
            }
        });
        t.on(cc.Node.EventType.TOUCH_END, function () {});
        t.on(cc.Node.EventType.TOUCH_CANCEL, function () {});
    }
}
