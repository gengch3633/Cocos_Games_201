import PlayerDataSys from "./PlayerDataSys";
import EventMgr from "./EventMgr";
import GameEventType from "./GameEventType";
import SdkHelper from "./SdkHelper";
import MessageNoticeToast from "./MessageNoticeToast";

declare const i18n: { t(key: string, params?: Record<string, unknown>): string };

const { ccclass, menu } = cc._decorator;

@ccclass
@menu("UI/prefabs/MessageNoticeToastCtrl")
export default class MessageNoticeToastCtrl extends cc.Component {
    static prefabUrl = "assets/resources/prefabs/MessageNoticeToast";
    static className = "MessageNoticeToastCtrl";

    ui: MessageNoticeToast = null;
    btn_goto: cc.Button = null;

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

    pushAction(data: {
        amount: number;
        status: number;
        channel: string;
        order_code: string;
        callback?: () => void;
    }): void {
        if (data) {
            const amount = data.amount;
            let status = data.status;
            let channel = data.channel;
            const orderCode = data.order_code;
            this.btn_goto.interactable = true;
            this.ui.icon_tips_fail.active = false;
            this.ui.icon_tips_success.active = false;
            if (channel == "shopee") {
                channel = "shopeepay";
            }
            if (status == 0) {
                // no-op
            } else if (status == 1) {
                this.ui.icon_tips_fail.active = true;
                this.ui.label_tips_top.getComponent(cc.Label).string = i18n.t("feedback_dialog_word_1");
                const cashStr = "" + PlayerDataSys.getCashUnit() + PlayerDataSys.getCashBalance(amount);
                this.ui.label_tips_content.getComponent(cc.Label).string = i18n.t("feedback_push_word_4", {
                    0: cashStr,
                });
                SdkHelper.reportData("withdraw_push_popup_fail");
                SdkHelper.reportData("withdraw_result_fail", {
                    channel,
                    order_code: orderCode,
                });
            } else if (status == 2) {
                this.ui.icon_tips_success.active = true;
                this.ui.label_tips_top.getComponent(cc.Label).string = i18n.t("status_brief_1");
                const cashStr = "" + PlayerDataSys.getCashUnit() + PlayerDataSys.getCashBalance(amount);
                const channelUpper = channel.toUpperCase();
                this.ui.label_tips_content.getComponent(cc.Label).string = i18n.t("feedback_push_word_2", {
                    0: cashStr,
                    1: channelUpper,
                });
                SdkHelper.reportData("withdraw_push_popup_success");
                SdkHelper.reportData("withdraw_result_success", { channel });
            }
            this.ui.content.active = true;
            cc.tween(this.ui.content)
                .to(
                    0.3,
                    { position: cc.v3(0, cc.winSize.height / 2 - this.ui.content.height, 0) },
                    { easing: "backOut" }
                )
                .call(() => {})
                .delay(2)
                .to(
                    0.5,
                    { position: cc.v3(0, cc.winSize.height / 2 + this.ui.content.height, 0) },
                    { easing: "backIn" }
                )
                .start();
        }
    }

    addButtonListen(): void {}

    initData(): void {}
}
