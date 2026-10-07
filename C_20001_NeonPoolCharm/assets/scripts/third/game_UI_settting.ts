import GlobalConfig from "./GlobalConfig";

const { ccclass } = cc._decorator;

@ccclass("game_UI_settting")
export default class GameUISettting extends cc.Component {
    callback: any = null;
    callback_ok: any = null;

    closeAndDestroy(): void {
        this.node.parent = null;
        this.node.destroy();
    }

    show(parent: cc.Node): void {
        this.node.parent = parent;
    }

    start(): void {
    }

    setCallback(callback: any): void {
        this.callback = callback;
    }

    close(): void {
        this.node.parent = null;
    }

    onLoad(): void {
        this.callback_ok = this.callback_ok || null;
        cc.find("button_close", this.node).on("click", () => {
            this.closeAndDestroy();
        });
        const container = cc.find("node_container", this.node);
        const toggleContainer = cc.find("toggleContainer_sens", container);
        toggleContainer.getChildByName("toggle1").on("toggle", () => {
            GlobalConfig.sens_toggle_set(1);
        });
        toggleContainer.getChildByName("toggle2").on("toggle", () => {
            GlobalConfig.sens_toggle_set(0);
        });
        toggleContainer.getChildByName("toggle3").on("toggle", () => {
            GlobalConfig.sens_toggle_set(2);
        });
        this.scheduleOnce(() => {
            const sens = GlobalConfig.sens_toggle_get();
            console.log("sens", sens);
            if (sens == 0) {
                toggleContainer.getChildByName("toggle2").getComponent(cc.Toggle).isChecked = true;
            } else if (sens == 1) {
                toggleContainer.getChildByName("toggle1").getComponent(cc.Toggle).isChecked = true;
            } else if (sens == 2) {
                toggleContainer.getChildByName("toggle3").getComponent(cc.Toggle).isChecked = true;
            }
        }, 0.03);
    }
}
