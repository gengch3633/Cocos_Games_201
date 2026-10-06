const { ccclass } = cc._decorator;

@ccclass
export default class game_UI_alert extends cc.Component {
    callback: (() => void) = null;
    callback_ok: (() => void) = null;
    callback_no: (() => void) = null;

    closeAndDestroy(): void {
        this.node.parent = null;
        this.node.destroy();
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
        cc.find("button_no", this.node).on("click", () => {
            this.callback_no && this.callback_no();
            this.closeAndDestroy();
        });
    }

    close(): void {
        this.node.parent = null;
    }

    start(): void {}

    show(
        content: string,
        callbackOk?: () => void,
        callbackNo?: () => void,
        labelOk?: string,
        labelNo?: string,
        title?: string
    ): void {
        this.callback_ok = callbackOk;
        this.callback_no = callbackNo;
        cc.find("label_content", this.node).getComponent(cc.Label).string = content;
        if (labelOk) {
            cc.find("button_ok", this.node).getChildByName("Label_ok").getComponent(cc.Label).string = labelOk;
        }
        if (labelNo) {
            cc.find("button_no", this.node).getChildByName("Label_no").getComponent(cc.Label).string = labelNo;
        }
        if (title) {
            cc.find("label_title", this.node).getComponent(cc.Label).string = title;
        }
    }

    setCallback(callback: () => void): void {
        this.callback = callback;
    }
}
