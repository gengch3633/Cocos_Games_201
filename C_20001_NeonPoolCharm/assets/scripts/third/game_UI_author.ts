import DB from "./DB";

const { ccclass } = cc._decorator;

@ccclass("game_UI_author")
export default class GameUIAuthor extends cc.Component {
    callback: Function = null;

    close(): void {
        this.node.parent = null;
    }

    show(e: any, t: Function): void {
        this.node.parent = e.node;
        this.callback = t;
    }

    start(): void {
    }

    onLoad(): void {
        this.callback = this.callback || null;
        cc.find("button_close", this.node).on("click", () => {
            this.closeAndDestroy();
        });
        DB.get_userInfo((t, o) => {
            this.closeAndDestroy();
            this.callback(t, o);
        });
    }

    closeAndDestroy(): void {
        this.node.parent = null;
        this.node.destroy();
        DB.closeAuthor();
    }
}
