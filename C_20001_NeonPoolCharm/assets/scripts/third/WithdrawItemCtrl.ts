import PlayerDataSys from "./PlayerDataSys";
import EventMgr from "./EventMgr";
import GameEventType from "./GameEventType";
import SdkHelper from "./SdkHelper";
import EngineUtil from "./EngineUtil";
import PageMgr from "./PageMgr";
import { UiManager } from "./UiManage";
import withdrawItem from "./withdrawItem";

declare const i18n: { t(key: string, params?: any): string };

const { ccclass, menu } = cc._decorator;

@ccclass
@menu("UI/prefabs/WithdrawItemCtrl")
export default class WithdrawItemCtrl extends cc.Component {
    static prefabUrl = "assets/resources/prefabs/withdrawItem";
    static className = "WithdrawItemCtrl";

    ui: withdrawItem = null;
    current: boolean = false;
    isalone: boolean = false;
    cash_balance: number = null;
    difficult: number = null;
    level: number = null;
    status: number = null;

    clickClose(): void {
        EventMgr.trigger(GameEventType.CLOSE_WITHDRAWPAGE);
    }

    addButtonListen(): void {
        UiManager.addButtonListen(this.ui.btn_close, this.clickClose, this);
        UiManager.addButtonListen(this.ui.btn, this.clickWithdraw, this);
        UiManager.addButtonListen(this.ui.btn_yellow, this.clickGoWithdraw, this);
    }

    goMain(): void {}

    onLoad(): void {
        this.onUILoad();
        this.addButtonListen();
    }

    start(): void {}

    onUILoad(): void {
        this.ui = this.node.addComponent(withdrawItem);
        this.ui.yellow_btn_label.getComponent(cc.Label).string = i18n.t("common_extract");
        this.ui.gray_btn_label.getComponent(cc.Label).string = i18n.t("common_extract");
        this.ui.des2.getComponent(cc.Label).string = i18n.t("tixian_ui_desc");
    }

    clickWithdraw(): void {
        EngineUtil.showManageViewToast(i18n.t("challenge_6"));
    }

    clickGoWithdraw(): void {
        PageMgr.showPage("InformationPage", {
            level: this.level,
            cash: this.cash_balance,
        });
    }

    initData(e: {
        cash_balance: number;
        difficult: number;
        level: number;
        status: number;
    }): void {
        if (e) {
            const cash_balance = e.cash_balance;
            const difficult = e.difficult;
            const level = e.level;
            const status = e.status;
            this.cash_balance = cash_balance;
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
            this.ui.lab_cash.getComponent(cc.Label).string = PlayerDataSys.getCashWithUnit(cash_balance);
        }
    }

    numUp(): void {
        const label = this.ui.lab_cash.getComponent(cc.Label);
        cc.tween({ a: 0 })
            .to(
                0.7,
                { a: this.cash_balance },
                {
                    progress: (_start: number, end: number, _current: number, ratio: number) => {
                        const value = Math.round(end * ratio);
                        label.string = String(PlayerDataSys.getCashWithUnit(value));
                        return value;
                    },
                }
            )
            .start();
    }
}
