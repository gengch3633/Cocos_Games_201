import EventMgr from "./EventMgr";
import GameEventType from "./GameEventType";

const { ccclass, property } = cc._decorator;

@ccclass
export default class RollScrollComp extends cc.Component {
    @property(cc.Prefab)
    item_prefab: cc.Prefab = null;

    @property(cc.Node)
    rolleNode: cc.Node = null;

    callback: (deltaX: number, valueY: number) => void = null;
    valueY: number = null;

    setCallBack(e: (deltaX: number, valueY: number) => void): void {
        this.callback = e;
    }

    updateLabel(e: string): void {
        cc.find("label_value", this.node.parent).getComponent(cc.Label).string = e;
    }

    clearLabel(): void {
        cc.find("label_value", this.node.parent).getComponent(cc.Label).string = "";
    }

    onLoad(): void {
        this.callback = this.callback || null;
        this.valueY = 0;
        const t = this.node.parent;
        t.on(cc.Node.EventType.TOUCH_START, (t: cc.Event.EventTouch) => {
            if (!t.touch || 0 == t.touch.getID()) {
                EventMgr.trigger(GameEventType.HIDE_GAMETIP);
                t.touch._point;
                this.valueY = 0;
            }
        });
        t.on(cc.Node.EventType.TOUCH_MOVE, (t: cc.Event.EventTouch) => {
            if (!t.touch || 0 == t.touch.getID()) {
                EventMgr.trigger(GameEventType.HIDE_GAMETIP);
                const o = t.touch._point;
                const n = t.touch._prevPoint;
                const i = o.x - n.x;
                this.valueY = this.valueY + i;
                let a = (this.rolleNode.x += i);
                const r = Math.abs(a);
                r > 126 && (a = (i < 0 ? -1 : 1) * (r - 126));
                this.rolleNode.x = a;
                this.callback && this.callback(i, this.valueY);
            }
        });
        t.on(cc.Node.EventType.TOUCH_END, () => {
        });
        t.on(cc.Node.EventType.TOUCH_CANCEL, () => {
        });
    }
}
