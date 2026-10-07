import EventMgr from "./EventMgr";
import GameEventType from "./GameEventType";
import TouchNode from "./TouchNode";

const { ccclass, menu } = cc._decorator;

@ccclass
@menu("UI/prefabs/TouchNodeCtrl")
export default class TouchNodeCtrl extends cc.Component {
    ui: TouchNode = null;

    static prefabUrl = "assets/resources/prefabs/TouchNode";
    static className = "TouchNodeCtrl";

    initData(): void {
    }

    onUILoad(): void {
        this.ui = this.node.addComponent(TouchNode);
    }

    updateCheckGuide(): void {
        console.log("静置引导");
        EventMgr.trigger(GameEventType.CHECK_QUIET_GUIDE);
    }

    start(): void {
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchStart, this);
        (this.node as any)._touchListener.setSwallowTouches(false);
    }

    onTouchStart(): void {
        console.log("onTouchStart 1111");
        this.unscheduleAllCallbacks();
        this.scheduleOnce(this.updateCheckGuide, 3);
    }

    onLoad(): void {
        this.onUILoad();
        this.addButtonListen();
        this.scheduleOnce(this.updateCheckGuide, 3);
    }

    addButtonListen(): void {
    }
}
