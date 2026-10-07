import EventMgr from "./EventMgr";
import GameEventType from "./GameEventType";
import MessageNoticeToast from "./MessageNoticeToast";
import PlayerDataSys from "./PlayerDataSys";
import SdkHelper from "./SdkHelper";

const { ccclass, menu } = cc._decorator;

@ccclass
@menu("UI/prefabs/MessageNoticeToastCtrl")
export default class MessageNoticeToastCtrl extends cc.Component {
    ui: MessageNoticeToast = null;
    btn_goto: cc.Button = null;

    static prefabUrl = "assets/resources/prefabs/MessageNoticeToast";
    static className = "MessageNoticeToastCtrl";

    addEvent(): void {
        EventMgr.listen(GameEventType.HIDE_MESSAGE, this.hideMessage, this);
        EventMgr.listen(GameEventType.PUSH_MESSAGE, this.pushAction, this);
    }

    onUILoad(): void {
        this.ui = this.node.addComponent(MessageNoticeToast);
    }

    onDestroy(): void {
        this.removeEvent();
    }

    hideMessage(): void {
        cc.Tween.stopAllByTarget(this.ui.content);
        this.ui.content.active = false;
        this.ui.content.y = cc.winSize.height / 2 + this.ui.content.height;
    }

    start(): void {
        this.hideMessage();
    }

    removeEvent(): void {
        EventMgr.ignore(GameEventType.HIDE_MESSAGE, this.hideMessage, this);
        EventMgr.ignore(GameEventType.PUSH_MESSAGE, this.pushAction, this);
    }

    onLoad(): void {
        this.onUILoad();
        this.addButtonListen();
        this.addEvent();
        this.btn_goto = this.ui.content.getComponent(cc.Button);
    }

    pushAction(e: { amount: number; status: number; channel: string; order_code: string; callback?: Function }): void {
        if (e) {
            const t = e.amount;
            const o = e.status;
            let n = e.channel;
            const i = e.order_code;
            e.callback;
            this.btn_goto.interactable = true;
            this.ui.icon_tips_fail.active = false;
            this.ui.icon_tips_success.active = false;
            if ("shopee" == n) {
                n = "shopeepay";
            }
            if (0 == o) {
            } else if (1 == o) {
                this.ui.icon_tips_fail.active = true;
                this.ui.label_tips_top.getComponent(cc.Label).string = i18n.t("feedback_dialog_word_1");
                let a = "" + PlayerDataSys.getCashUnit() + PlayerDataSys.getCashBalance(t);
                this.ui.label_tips_content.getComponent(cc.Label).string = i18n.t("feedback_push_word_4", {
                    0: a,
                });
                SdkHelper.reportData("withdraw_push_popup_fail");
                SdkHelper.reportData("withdraw_result_fail", {
                    channel: n,
                    order_code: i,
                });
            } else if (2 == o) {
                this.ui.icon_tips_success.active = true;
                this.ui.label_tips_top.getComponent(cc.Label).string = i18n.t("status_brief_1");
                let a = "" + PlayerDataSys.getCashUnit() + PlayerDataSys.getCashBalance(t);
                const l = n.toUpperCase();
                this.ui.label_tips_content.getComponent(cc.Label).string = i18n.t("feedback_push_word_2", {
                    0: a,
                    1: l,
                });
                SdkHelper.reportData("withdraw_push_popup_success");
                SdkHelper.reportData("withdraw_result_success", {
                    channel: n,
                });
            }
            this.ui.content.active = true;
            cc.tween(this.ui.content)
                .to(0.3, {
                    position: cc.v3(0, cc.winSize.height / 2 - this.ui.content.height, 0),
                }, {
                    easing: "backOut",
                })
                .call(function () {})
                .delay(2)
                .to(0.5, {
                    position: cc.v3(0, cc.winSize.height / 2 + this.ui.content.height, 0),
                }, {
                    easing: "backIn",
                })
                .start();
        }
    }

    addButtonListen(): void {}

    initData(): void {}
}
