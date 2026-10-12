import GEMgr from "./GEMgr";
import GlobalEventMgr from "./GlobalEventMgr";
import InterfaceMgr from "./InterfaceMgr";
import UIMgr from "./UIMgr";
import UserData from "./UserData";

const { ccclass, property } = cc._decorator;

@ccclass
export default class cashArrowFailView extends cc.Component {
    onLoad(): void {
        this._bindEvents();
        try {
            GEMgr.trackEvent("lvNode", {
                level: UserData.getInstance().level,
                lose: 1
            });
        } catch (e) {}
        try {
            GlobalEventMgr.getInstance().emit(InterfaceMgr.gameEvent.levelFailReport);
        } catch (e) {}
    }

    start(): void {
        this.showAni();
    }

    _bindEvents(): void {
        const bg = this.node.getChildByName("bg");
        if (bg) {
            const btnRetry = bg.getChildByName("btn_retry");
            if (btnRetry) {
                btnRetry.on(cc.Node.EventType.TOUCH_END, () => {
                    this.OnClickRestart();
                }, this);
            }
            const closeBtn = bg.getChildByName("close_btn");
            if (closeBtn) {
                closeBtn.on(cc.Node.EventType.TOUCH_END, () => {
                    this.OnClickRestart();
                }, this);
            }
        }
    }

    OnClickRestart(): void {
        GlobalEventMgr.getInstance().emit(InterfaceMgr.gameEvent.gameRestart);
        UIMgr.getInstance().hide(this.node);
    }

    showAni(): void {
        const bg = this.node.getChildByName("bg");
        if (bg) {
            bg.y += 2000;
            bg.opacity = 0;
            cc.tween(bg)
                .by(0.3, { y: -2100 })
                .by(0.3, { y: 100 }, { easing: "backOut" })
                .union()
                .start();
            cc.tween(bg)
                .delay(0.15)
                .to(0.2, { opacity: 255 })
                .start();
        }
    }
}