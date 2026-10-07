const { ccclass } = cc._decorator;

@ccclass("game_UI_alert")
export default class GameUIAlert extends cc.Component {
    callback: Function = null;
    callback_ok: Function = null;
    callback_no: Function = null;

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

    start(): void {
    }

    show(e: string, t: Function, o: Function, n?: string, i?: string, a?: string): void {
        this.callback_ok = t;
        this.callback_no = o;
        cc.find("label_content", this.node).getComponent(cc.Label).string = e;
        n && (cc.find("button_ok", this.node).getChildByName("Label_ok").getComponent(cc.Label).string = n);
        i && (cc.find("button_no", this.node).getChildByName("Label_no").getComponent(cc.Label).string = i);
        a && (cc.find("label_title", this.node).getComponent(cc.Label).string = a);
    }

    setCallback(e: Function): void {
        this.callback = e;
    }
}
