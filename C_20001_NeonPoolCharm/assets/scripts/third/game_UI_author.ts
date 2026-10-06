import DB from "./DB";

const { ccclass } = cc._decorator;

@ccclass
export default class game_UI_author extends cc.Component {
    callback: ((ok: boolean, msg?: string) => void) = null;

    close(): void {
        this.node.parent = null;
    }

    show(parent: cc.Component, callback: (ok: boolean, msg?: string) => void): void {
        this.node.parent = parent.node;
        this.callback = callback;
    }

    start(): void {}

    onLoad(): void {
        this.callback = this.callback || null;
        cc.find("button_close", this.node).on("click", () => {
            this.closeAndDestroy();
        });
        DB.get_userInfo((ok: boolean, msg: string) => {
            this.closeAndDestroy();
            this.callback(ok, msg);
        });
    }

    closeAndDestroy(): void {
        this.node.parent = null;
        this.node.destroy();
        DB.closeAuthor();
    }
}
