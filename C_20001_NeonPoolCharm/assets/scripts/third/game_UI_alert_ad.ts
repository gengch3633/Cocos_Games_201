import * as BallLogicMgr from "./BallLogicMgr";

const { ccclass } = cc._decorator;

@ccclass
export default class game_UI_alert_ad extends cc.Component {
    callback: (() => void) = null;
    callback_ok: (() => void) = null;
    callback_no: (() => void) = null;
    stay_ok: boolean = null;

    setOKStay(): void {
        this.stay_ok = true;
    }

    closeAndDestroy(): void {
        this.node.parent = null;
        this.node.destroy();
        BallLogicMgr.destroyAD();
    }

    onLoad(): void {
        this.callback_ok = this.callback_ok || null;
        this.stay_ok = this.stay_ok || null;
        cc.find("button_close", this.node).on("click", () => {
            this.closeAndDestroy();
        });
        const buttonOk = cc.find("button_ok", this.node);
        buttonOk.on("click", () => {
            this.callback_ok && this.callback_ok();
            this.stay_ok || this.closeAndDestroy();
        });
        const buttonNo = cc.find("button_no", this.node);
        buttonNo.on("click", () => {
            this.callback_no && this.callback_no();
            this.closeAndDestroy();
        });
        const winSize = cc.winSize;
        console.log("getWinSize size", winSize);
        const offset = winSize.height - 1280;
        buttonOk.y = buttonOk.y - offset / 2;
        buttonNo.y = buttonNo.y - offset / 2;
        console.log("button_ok y", buttonOk.y);
    }

    setCallback(callback: () => void): void {
        this.callback = callback;
    }

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
            cc.find("button_ok", this.node)
                .getChildByName("Background")
                .getChildByName("Label_ok")
                .getComponent(cc.Label).string = labelOk;
        }
        if (labelNo) {
            cc.find("button_no", this.node)
                .getChildByName("Background")
                .getChildByName("Label_no")
                .getComponent(cc.Label).string = labelNo;
        }
        if (title) {
            cc.find("label_title", this.node).getComponent(cc.Label).string = title;
        }
        BallLogicMgr.showAD();
    }

    start(): void {}

    close(): void {
        this.node.parent = null;
    }
}
