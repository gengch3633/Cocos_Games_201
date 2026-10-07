import EngineUtil from "./EngineUtil";
import EventMgr from "./EventMgr";
import GameEventType from "./GameEventType";
import PageMgr from "./PageMgr";
import PlayerDataSys from "./PlayerDataSys";
import SdkHelper from "./SdkHelper";
import { UiManager } from "./UiManage";
import withdrawItem from "./withdrawItem";

const { ccclass, menu } = cc._decorator;

@ccclass
@menu("UI/prefabs/WithdrawItemCtrl")
export default class WithdrawItemCtrl extends cc.Component {
    ui: withdrawItem = null;
    current = false;
    isalone = false;
    cash_balance: number = null;
    difficult: number = null;
    level: number = null;
    status: number = null;

    static prefabUrl = "assets/resources/prefabs/withdrawItem";
    static className = "WithdrawItemCtrl";

    clickClose(): void {
        EventMgr.trigger(GameEventType.CLOSE_WITHDRAWPAGE);
    }

    addButtonListen(): void {
        UiManager.addButtonListen(this.ui.btn_close, this.clickClose, this);
        UiManager.addButtonListen(this.ui.btn, this.clickWithdraw, this);
        UiManager.addButtonListen(this.ui.btn_yellow, this.clickGoWithdraw, this);
    }

    goMain(): void {
    }

    onLoad(): void {
        this.onUILoad();
        this.addButtonListen();
    }

    start(): void {
    }

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

    initData(e: { cash_balance: number; difficult: number; level: number; status: number }): void {
        if (e) {
            const t = e.cash_balance;
            const o = e.difficult;
            const n = e.level;
            const i = e.status;
            this.cash_balance = t;
            this.difficult = o;
            this.level = n;
            this.status = i;
            this.ui.title_label.getComponent(cc.Label).string = "" + n;
            if (this.level == PlayerDataSys.user_level) {
                this.ui.btn_close.active = true;
                this.ui.btn_yellow.active = false;
                this.ui.btn.active = true;
                this.numUp();
            } else {
                SdkHelper.reportData("fee_payment_page", null, true);
            }
            this.ui.lab_cash.getComponent(cc.Label).string = PlayerDataSys.getCashWithUnit(t);
        }
    }

    numUp(): void {
        const e = this.ui.lab_cash.getComponent(cc.Label);
        cc.tween({ a: 0 })
            .to(0.7, { a: this.cash_balance }, {
                progress: (t, o, n, i) => {
                    const a = Math.round(o * i);
                    e.string = String(PlayerDataSys.getCashWithUnit(a));
                    return a;
                },
            })
            .start();
    }
}
