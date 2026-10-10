import DB from "./DB";

const { ccclass } = cc._decorator;

@ccclass
export default class game_UI_author extends cc.Component {
    callback = null;

    close() {
        this.node.parent = null;
    }

    show(e, t) {
        this.node.parent = e.node;
        this.callback = t;
    }

    start() {}

    onLoad() {
        const e = this;
        this.callback = this.callback || null;
        cc.find("button_close", this.node).on("click", function () {
            e.closeAndDestroy();
        });
        DB.get_userInfo(function (t, o) {
            e.closeAndDestroy();
            e.callback(t, o);
        });
    }

    closeAndDestroy() {
        this.node.parent = null;
        this.node.destroy();
        DB.closeAuthor();
    }
}
