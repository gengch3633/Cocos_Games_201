import EventMgr from "./EventMgr";
import GameEventType from "./GameEventType";

const { ccclass, property } = cc._decorator;

@ccclass
export default class RollScrollComp extends cc.Component {
    @property(cc.Prefab)
    item_prefab: cc.Prefab = null;

    @property(cc.Node)
    rolleNode: cc.Node = null;

    callback: ((delta: number, total: number) => void) = null;
    valueY = 0;

    setCallBack(cb: (delta: number, total: number) => void): void {
        this.callback = cb;
    }

    updateLabel(text: string): void {
        cc.find("label_value", this.node.parent).getComponent(cc.Label).string = text;
    }

    clearLabel(): void {
        cc.find("label_value", this.node.parent).getComponent(cc.Label).string = "";
    }

    onLoad(): void {
        this.callback = this.callback || null;
        this.valueY = 0;
        const parent = this.node.parent;
        parent.on(cc.Node.EventType.TOUCH_START, (event: cc.Event.EventTouch) => {
            if (!event.touch || event.touch.getID() == 0) {
                EventMgr.trigger(GameEventType.HIDE_GAMETIP);
                this.valueY = 0;
            }
        });
        parent.on(cc.Node.EventType.TOUCH_MOVE, (event: cc.Event.EventTouch) => {
            if (!event.touch || event.touch.getID() == 0) {
                EventMgr.trigger(GameEventType.HIDE_GAMETIP);
                const point = (event.touch as any)._point;
                const prevPoint = (event.touch as any)._prevPoint;
                const deltaX = point.x - prevPoint.x;
                this.valueY = this.valueY + deltaX;
                let x = (this.rolleNode.x += deltaX);
                const absX = Math.abs(x);
                if (absX > 126) {
                    x = (deltaX < 0 ? -1 : 1) * (absX - 126);
                }
                this.rolleNode.x = x;
                this.callback && this.callback(deltaX, this.valueY);
            }
        });
        parent.on(cc.Node.EventType.TOUCH_END, () => {});
        parent.on(cc.Node.EventType.TOUCH_CANCEL, () => {});
    }
}
