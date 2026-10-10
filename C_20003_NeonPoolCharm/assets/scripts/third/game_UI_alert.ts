const { ccclass } = cc._decorator;

@ccclass
export default class game_UI_alert extends cc.Component {
    callback = null;

    callback_ok = null;

    callback_no = null;

    closeAndDestroy() {
        this.node.parent = null;
        this.node.destroy();
    }

    onLoad() {
        const e = this;
        this.callback_ok = this.callback_ok || null;
        cc.find("button_close", this.node).on("click", function () {
            e.closeAndDestroy();
        });
        cc.find("button_ok", this.node).on("click", function () {
            e.callback_ok && e.callback_ok();
            e.closeAndDestroy();
        });
        cc.find("button_no", this.node).on("click", function () {
            e.callback_no && e.callback_no();
            e.closeAndDestroy();
        });
    }

    close() {
        this.node.parent = null;
    }

    start() {}

    show(e, t, o, n, i, a) {
        this.callback_ok = t;
        this.callback_no = o;
        cc.find("label_content", this.node).getComponent(cc.Label).string = e;
        n && (cc.find("button_ok", this.node).getChildByName("Label_ok").getComponent(cc.Label).string = n);
        i && (cc.find("button_no", this.node).getChildByName("Label_no").getComponent(cc.Label).string = i);
        a && (cc.find("label_title", this.node).getComponent(cc.Label).string = a);
    }

    setCallback(e) {
        this.callback = e;
    }
}
