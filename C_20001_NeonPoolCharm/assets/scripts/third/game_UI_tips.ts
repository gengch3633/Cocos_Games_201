const { ccclass } = cc._decorator;

@ccclass("game_UI_tips")
export default class GameUITips extends cc.Component {
    callback: any = null;
    callback_ok: (() => void) | null = null;

    show(content: string, okCallback: (() => void) | null, okLabel?: string): void {
        this.callback_ok = okCallback;
        cc.find("label_content", this.node).getComponent(cc.Label).string = content;
        cc.find("label_title", this.node).getComponent(cc.Label).string = "";
        okLabel && (cc.find("button_ok", this.node).getChildByName("Background").getChildByName("Label_ok").getComponent(cc.Label).string = okLabel);
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

    setCallback(callback: any): void {
        this.callback = callback;
    }

    close(): void {
        this.node.parent = null;
    }

    closeAndDestroy(): void {
        this.node.parent = null;
        this.node.destroy();
    }

    start(): void {
    }
}
