import * as BallLogicMgr from "./BallLogicMgr";

const { ccclass } = cc._decorator;

@ccclass
export default class game_UI_reward extends cc.Component {
    callback: (() => void) = null;
    hall: any = null;
    callback_ok: (() => void) = null;

    close(): void {
        this.node.parent = null;
    }

    setCallback(callback: () => void): void {
        this.callback = callback;
    }

    onLoad(): void {
        this.callback_ok = this.callback_ok || null;
        this.hall = this.hall || null;
        const toggleVideo = cc.find("toggle_video", this.node);
        const buttonOk = cc.find("button_ok", this.node);
        cc.find("cm_movie", buttonOk);
        buttonOk.on("click", () => {
            if (BallLogicMgr.checkCanRewardToday()) {
                BallLogicMgr.addCoin(200, () => {
                    this.hall.showTip("恭喜获得双倍奖励！+200金币");
                    BallLogicMgr.saveOneMoreRewardTime();
                    this.hall.updateCoin();
                    this.closeAndDestroy();
                });
            } else {
                console.log("max times");
                this.hall.showTip("今日没有更多奖励了！");
            }
        });
        cc.find("button_close", this.node).on("click", () => {
            this.hall.checkTTState();
            this.closeAndDestroy();
        });
        toggleVideo &&
            toggleVideo.on("toggle", (toggle: cc.Toggle) => {
                console.log("toggle", toggle.isChecked);
            });
    }

    show(hall: any): void {
        this.hall = hall;
        this.node.parent = hall.node.getChildByName("node_reward");
    }

    closeAndDestroy(): void {
        if (this.node) {
            this.node.parent = null;
            this.node.destroy();
        }
    }

    start(): void {}
}
