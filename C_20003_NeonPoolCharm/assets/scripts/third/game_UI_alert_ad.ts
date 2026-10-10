import BallLogicMgr from "./BallLogicMgr";

const { ccclass } = cc._decorator;

@ccclass
export default class game_UI_alert_ad extends cc.Component {
    callback = null;

    callback_ok = null;

    callback_no = null;

    stay_ok = null;

    setOKStay() {
        this.stay_ok = true;
    }

    closeAndDestroy() {
        this.node.parent = null;
        this.node.destroy();
        BallLogicMgr.destroyAD();
    }

    onLoad() {
        const e = this;
        this.callback_ok = this.callback_ok || null;
        this.stay_ok = this.stay_ok || null;
        cc.find("button_close", this.node).on("click", function () {
            e.closeAndDestroy();
        });
        const t = cc.find("button_ok", this.node);
        t.on("click", function () {
            e.callback_ok && e.callback_ok();
            e.stay_ok || e.closeAndDestroy();
        });
        const o = cc.find("button_no", this.node);
        o.on("click", function () {
            e.callback_no && e.callback_no();
            e.closeAndDestroy();
        });
        const n = cc.winSize;
        console.log("getWinSize size", n);
        const i = n.height - 1280;
        t.y = t.y - i / 2;
        o.y = o.y - i / 2;
        console.log("button_ok y", t.y);
    }

    setCallback(e) {
        this.callback = e;
    }

    show(e, t, o, n, i, a) {
        this.callback_ok = t;
        this.callback_no = o;
        cc.find("label_content", this.node).getComponent(cc.Label).string = e;
        n && (cc.find("button_ok", this.node).getChildByName("Background").getChildByName("Label_ok").getComponent(cc.Label).string = n);
        i && (cc.find("button_no", this.node).getChildByName("Background").getChildByName("Label_no").getComponent(cc.Label).string = i);
        a && (cc.find("label_title", this.node).getComponent(cc.Label).string = a);
        BallLogicMgr.showAD();
    }

    start() {}

    close() {
        this.node.parent = null;
    }
}
