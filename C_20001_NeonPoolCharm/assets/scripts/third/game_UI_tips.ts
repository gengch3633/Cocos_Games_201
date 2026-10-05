const { ccclass } = cc._decorator;

@ccclass
export default class game_UI_tips extends cc.Component {
    callback: () => void = null;
    callback_ok: () => void = null;

    show(content: string, callbackOk?: () => void, labelOk?: string): void {
        this.callback_ok = callbackOk;
        cc.find("label_content", this.node).getComponent(cc.Label).string = content;
        cc.find("label_title", this.node).getComponent(cc.Label).string = "";
        if (labelOk) {
            cc.find("button_ok", this.node)
                .getChildByName("Background")
                .getChildByName("Label_ok")
                .getComponent(cc.Label).string = labelOk;
        }
    }

    onLoad(): void {
        this.callback_ok = this.callback_ok || null;
        cc.find("button_close", this.node).on("click", () => {
            this.closeAndDestroy();
        });
        cc.find("button_ok", this.node).on("click", () => {
            this.callback_ok && this.callback_ok();
            this.closeAndDestroy();
        });
    }

    setCallback(callback: () => void): void {
        this.callback = callback;
    }

    close(): void {
        this.node.parent = null;
    }

    closeAndDestroy(): void {
        this.node.parent = null;
        this.node.destroy();
    }

    start(): void {}
}
