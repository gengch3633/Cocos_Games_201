import EventMgr from "./EventMgr";
import GameEventType from "./GameEventType";
import MessageNoticeToast from "./MessageNoticeToast";
import PlayerDataSys from "./PlayerDataSys";
import SdkHelper from "./SdkHelper";

const { ccclass, menu } = cc._decorator;

@ccclass
@menu("UI/prefabs/MessageNoticeToastCtrl")
export default class MessageNoticeToastCtrl extends cc.Component {
    ui = null;
    btn_goto = null;

    static prefabUrl = "assets/resources/prefabs/MessageNoticeToast";
    static className = "MessageNoticeToastCtrl";

    addEvent() {
        EventMgr.listen(GameEventType.HIDE_MESSAGE, this.hideMessage, this);
        EventMgr.listen(GameEventType.PUSH_MESSAGE, this.pushAction, this);
    }

    onUILoad() {
        this.ui = this.node.addComponent(MessageNoticeToast);
    }

    onDestroy() {
        this.removeEvent();
    }

    hideMessage() {
        cc.Tween.stopAllByTarget(this.ui.content);
        this.ui.content.active = false;
        this.ui.content.y = cc.winSize.height / 2 + this.ui.content.height;
    }

    start() {
        this.hideMessage();
    }

    removeEvent() {
        EventMgr.ignore(GameEventType.HIDE_MESSAGE, this.hideMessage, this);
        EventMgr.ignore(GameEventType.PUSH_MESSAGE, this.pushAction, this);
    }

    onLoad() {
        this.onUILoad();
        this.addButtonListen();
        this.addEvent();
        this.btn_goto = this.ui.content.getComponent(cc.Button);
    }

    pushAction(data) {
        if (data) {
            const amount = data.amount;
            const status = data.status;
            let channel = data.channel;
            const orderCode = data.order_code;
            data.callback;
            this.btn_goto.interactable = true;
            this.ui.icon_tips_fail.active = false;
            this.ui.icon_tips_success.active = false;
            if ("shopee" == channel) {
                channel = "shopeepay";
            }
            if (0 == status) {
            } else if (1 == status) {
                this.ui.icon_tips_fail.active = true;
                this.ui.label_tips_top.getComponent(cc.Label).string = i18n.t("feedback_dialog_word_1");
                const cashText = "" + PlayerDataSys.getCashUnit() + PlayerDataSys.getCashBalance(amount);
                this.ui.label_tips_content.getComponent(cc.Label).string = i18n.t("feedback_push_word_4", {
                    0: cashText
                });
                SdkHelper.reportData("withdraw_push_popup_fail");
                SdkHelper.reportData("withdraw_result_fail", {
                    channel: channel,
                    order_code: orderCode
                });
            } else if (2 == status) {
                this.ui.icon_tips_success.active = true;
                this.ui.label_tips_top.getComponent(cc.Label).string = i18n.t("status_brief_1");
                const cashText = "" + PlayerDataSys.getCashUnit() + PlayerDataSys.getCashBalance(amount);
                const channelUpper = channel.toUpperCase();
                this.ui.label_tips_content.getComponent(cc.Label).string = i18n.t("feedback_push_word_2", {
                    0: cashText,
                    1: channelUpper
                });
                SdkHelper.reportData("withdraw_push_popup_success");
                SdkHelper.reportData("withdraw_result_success", {
                    channel: channel
                });
            }
            this.ui.content.active = true;
            cc.tween(this.ui.content).to(0.3, {
                position: cc.v3(0, cc.winSize.height / 2 - this.ui.content.height, 0)
            }, {
                easing: "backOut"
            }).call(function () {
            }).delay(2).to(0.5, {
                position: cc.v3(0, cc.winSize.height / 2 + this.ui.content.height, 0)
            }, {
                easing: "backIn"
            }).start();
        }
    }

    addButtonListen() {
    }

    initData() {
    }
}
