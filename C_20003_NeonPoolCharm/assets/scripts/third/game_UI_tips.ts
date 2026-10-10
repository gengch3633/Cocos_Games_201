const { ccclass } = cc._decorator;

@ccclass
export default class game_UI_tips extends cc.Component {
    callback = null;

    callback_ok = null;

    show(e, t, o) {
        this.callback_ok = t;
        cc.find("label_content", this.node).getComponent(cc.Label).string = e;
        cc.find("label_title", this.node).getComponent(cc.Label).string = "";
        o && (cc.find("button_ok", this.node).getChildByName("Background").getChildByName("Label_ok").getComponent(cc.Label).string = o);
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
    }

    setCallback(e) {
        this.callback = e;
    }

    close() {
        this.node.parent = null;
    }

    closeAndDestroy() {
        this.node.parent = null;
        this.node.destroy();
    }

    start() {}
}
