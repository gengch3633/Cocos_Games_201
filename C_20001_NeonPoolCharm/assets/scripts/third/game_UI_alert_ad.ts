import BallLogicMgr from "./BallLogicMgr";

const { ccclass } = cc._decorator;

@ccclass("game_UI_alert_ad")
export default class GameUIAlertAd extends cc.Component {
    callback: Function = null;
    callback_ok: Function = null;
    callback_no: Function = null;
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
        const t = cc.find("button_ok", this.node);
        t.on("click", () => {
            this.callback_ok && this.callback_ok();
            this.stay_ok || this.closeAndDestroy();
        });
        const o = cc.find("button_no", this.node);
        o.on("click", () => {
            this.callback_no && this.callback_no();
            this.closeAndDestroy();
        });
        const n = cc.winSize;
        console.log("getWinSize size", n);
        const i = n.height - 1280;
        t.y = t.y - i / 2;
        o.y = o.y - i / 2;
        console.log("button_ok y", t.y);
    }

    setCallback(e: Function): void {
        this.callback = e;
    }

    show(e: string, t: Function, o: Function, n?: string, i?: string, a?: string): void {
        this.callback_ok = t;
        this.callback_no = o;
        cc.find("label_content", this.node).getComponent(cc.Label).string = e;
        n &&
            (cc.find("button_ok", this.node)
                .getChildByName("Background")
                .getChildByName("Label_ok")
                .getComponent(cc.Label).string = n);
        i &&
            (cc.find("button_no", this.node)
                .getChildByName("Background")
                .getChildByName("Label_no")
                .getComponent(cc.Label).string = i);
        a && (cc.find("label_title", this.node).getComponent(cc.Label).string = a);
        BallLogicMgr.showAD();
    }

    start(): void {
    }

    close(): void {
        this.node.parent = null;
    }
}
