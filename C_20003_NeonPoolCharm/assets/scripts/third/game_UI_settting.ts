import GlobalConfig from "./GlobalConfig";

const { ccclass } = cc._decorator;

@ccclass
export default class game_UI_settting extends cc.Component {
    callback = null;

    callback_ok = null;

    closeAndDestroy() {
        this.node.parent = null;
        this.node.destroy();
    }

    show(e) {
        this.node.parent = e;
    }

    start() {}

    setCallback(e) {
        this.callback = e;
    }

    close() {
        this.node.parent = null;
    }

    onLoad() {
        const e = this;
        this.callback_ok = this.callback_ok || null;
        cc.find("button_close", this.node).on("click", function () {
            e.closeAndDestroy();
        });
        const t = cc.find("node_container", this.node);
        const o = cc.find("toggleContainer_sens", t);
        o.getChildByName("toggle1").on("toggle", function () {
            GlobalConfig.sens_toggle_set(1);
        });
        o.getChildByName("toggle2").on("toggle", function () {
            GlobalConfig.sens_toggle_set(0);
        });
        o.getChildByName("toggle3").on("toggle", function () {
            GlobalConfig.sens_toggle_set(2);
        });
        this.scheduleOnce(function () {
            const e = GlobalConfig.sens_toggle_get();
            console.log("sens", e);
            0 == e ? o.getChildByName("toggle2").getComponent(cc.Toggle).isChecked = true : 1 == e ? o.getChildByName("toggle1").getComponent(cc.Toggle).isChecked = true : 2 == e && (o.getChildByName("toggle3").getComponent(cc.Toggle).isChecked = true);
        }, .03);
    }
}
