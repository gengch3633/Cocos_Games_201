import EventMgr from "./EventMgr";
import GameEventType from "./GameEventType";
import TouchNode from "./TouchNode";

const { ccclass, menu } = cc._decorator;

@ccclass
@menu("UI/prefabs/TouchNodeCtrl")
export default class TouchNodeCtrl extends cc.Component {
    ui = null;

    static prefabUrl = "assets/resources/prefabs/TouchNode";

    static className = "TouchNodeCtrl";

    initData() {}

    onUILoad() {
        this.ui = this.node.addComponent(TouchNode);
    }

    updateCheckGuide() {
        console.log("静置引导");
        EventMgr.trigger(GameEventType.CHECK_QUIET_GUIDE);
    }

    start() {
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchStart, this);
        this.node._touchListener.setSwallowTouches(false);
    }

    onTouchStart() {
        console.log("onTouchStart 1111");
        this.unscheduleAllCallbacks();
        this.scheduleOnce(this.updateCheckGuide, 3);
    }

    onLoad() {
        this.onUILoad();
        this.addButtonListen();
        this.scheduleOnce(this.updateCheckGuide, 3);
    }

    addButtonListen() {}
}
