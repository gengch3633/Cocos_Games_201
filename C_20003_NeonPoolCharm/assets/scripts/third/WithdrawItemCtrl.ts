import EngineUtil from "./EngineUtil";
import EventMgr from "./EventMgr";
import GameEventType from "./GameEventType";
import PageMgr from "./PageMgr";
import PlayerDataSys from "./PlayerDataSys";
import SdkHelper from "./SdkHelper";
import { UiManager } from "./UiManage";
import withdrawItem from "./withdrawItem";

declare const i18n: any;

const { ccclass, menu } = cc._decorator;

@ccclass
@menu("UI/prefabs/WithdrawItemCtrl")
export default class WithdrawItemCtrl extends cc.Component {
    ui = null;
    current = false;
    isalone = false;
    cash_balance;
    difficult;
    level;
    status;

    static prefabUrl = "assets/resources/prefabs/withdrawItem";
    static className = "WithdrawItemCtrl";

    clickClose() {
        EventMgr.trigger(GameEventType.CLOSE_WITHDRAWPAGE);
    }

    addButtonListen() {
        UiManager.addButtonListen(this.ui.btn_close, this.clickClose, this);
        UiManager.addButtonListen(this.ui.btn, this.clickWithdraw, this);
        UiManager.addButtonListen(this.ui.btn_yellow, this.clickGoWithdraw, this);
    }

    goMain() {}

    onLoad() {
        this.onUILoad();
        this.addButtonListen();
    }

    start() {}

    onUILoad() {
        this.ui = this.node.addComponent(withdrawItem);
        this.ui.yellow_btn_label.getComponent(cc.Label).string = i18n.t("common_extract");
        this.ui.gray_btn_label.getComponent(cc.Label).string = i18n.t("common_extract");
        this.ui.des2.getComponent(cc.Label).string = i18n.t("tixian_ui_desc");
    }

    clickWithdraw() {
        EngineUtil.showManageViewToast(i18n.t("challenge_6"));
    }

    clickGoWithdraw() {
        PageMgr.showPage("InformationPage", {
            level: this.level,
            cash: this.cash_balance
        });
    }

    initData(data) {
        if (data) {
            const cashBalance = data.cash_balance;
            const difficult = data.difficult;
            const level = data.level;
            const status = data.status;
            this.cash_balance = cashBalance;
            this.difficult = difficult;
            this.level = level;
            this.status = status;
            this.ui.title_label.getComponent(cc.Label).string = "" + level;
            if (this.level == PlayerDataSys.user_level) {
                this.ui.btn_close.active = true;
                this.ui.btn_yellow.active = false;
                this.ui.btn.active = true;
                this.numUp();
            } else {
                SdkHelper.reportData("fee_payment_page", null, true);
            }
            this.ui.lab_cash.getComponent(cc.Label).string = PlayerDataSys.getCashWithUnit(cashBalance);
        }
    }

    numUp() {
        const label = this.ui.lab_cash.getComponent(cc.Label);
        cc.tween({
            a: 0
        }).to(0.7, {
            a: this.cash_balance
        }, {
            progress: function (start, end, current, ratio) {
                const value = Math.round(end * ratio);
                label.string = String(PlayerDataSys.getCashWithUnit(value));
                return value;
            }
        }).start();
    }
}
