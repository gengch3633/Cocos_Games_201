import BallLogicMgr from "./BallLogicMgr";

const { ccclass } = cc._decorator;

@ccclass
export default class game_UI_reward extends cc.Component {
    callback = null;

    hall = null;

    node = null;

    callback_ok = null;

    close() {
        this.node.parent = null;
    }

    setCallback(e) {
        this.callback = e;
    }

    onLoad() {
        const e = this;
        this.callback_ok = this.callback_ok || null;
        this.hall = this.hall || null;
        const t = cc.find("toggle_video", this.node);
        const o = cc.find("button_ok", this.node);
        cc.find("cm_movie", o);
        o.on("click", function () {
            if (BallLogicMgr.checkCanRewardToday()) BallLogicMgr.addCoin(200, function () {
                e.hall.showTip("恭喜获得双倍奖励！+200金币");
                BallLogicMgr.saveOneMoreRewardTime();
                e.hall.updateCoin();
                e.closeAndDestroy();
            });else {
                console.log("max times");
                e.hall.showTip("今日没有更多奖励了！");
            }
        });
        cc.find("button_close", this.node).on("click", function () {
            e.hall.checkTTState();
            e.closeAndDestroy();
        });
        t && t.on("toggle", function (e) {
            console.log("toggle", e.isChecked);
        });
    }

    show(e) {
        this.hall = e;
        this.node.parent = e.node.getChildByName("node_reward");
    }

    closeAndDestroy() {
        if (this.node) {
            this.node.parent = null;
            this.node.destroy();
        }
    }

    start() {}
}
