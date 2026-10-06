import GlobalEventMgr from "./GlobalEventMgr";
import UIMgr from "./UIMgr";
import { gameEvent } from "./InterfaceMgr";
import GEMgr from "./GEMgr";
import UserData from "./UserData";

const { ccclass } = cc._decorator;

@ccclass
export default class cashArrowFailView extends cc.Component {
    onLoad() {
        this._bindEvents();
        try {
            GEMgr.trackEvent(" lvNode ", {
                level: UserData.getInstance().level,
                lose: 1
            });
        } catch (e) { }
        try {
            GlobalEventMgr.getInstance().emit(gameEvent.levelFailReport);
        } catch (e) { }
    }

    start() {
        this.showAni();
    }

    _bindEvents() {
        var e = this, t = this.node.getChildByName(" bg ");
        if (t) {
            var i = t.getChildByName(" btn_retry ");
            i && i.on(cc.Node.EventType.TOUCH_END, function () {
                e.OnClickRestart();
            }, e);
            var n = t.getChildByName(" close_btn ");
            n && n.on(cc.Node.EventType.TOUCH_END, function () {
                e.OnClickRestart();
            }, e);
        }
    }

    OnClickRestart() {
        GlobalEventMgr.getInstance().emit(gameEvent.gameRestart);
        UIMgr.getInstance().hide(this.node);
    }

    showAni() {
        var e = this.node.getChildByName(" bg ");
        if (e) {
            e.y += 2e3;
            e.opacity = 0;
            cc.tween(e).by(.3, {
                y: -2100
            }).by(.3, {
                y: 100
            }, {
                easing: " backOut "
            }).union().start();
            cc.tween(e).delay(.15).to(.2, {
                opacity: 255
            }).start();
        }
    }
}
