import BasePageCtrl, { AnimType } from "./BasePageCtrl";
import EventMgr from "./EventMgr";
import GameEventType from "./GameEventType";
import PlayerDataSys from "./PlayerDataSys";
import { ChannelConfig } from "./SystemConfig";
import { UiManager } from "./UiManage";
import WithdrawSuccessPage from "./WithdrawSuccessPage";

const { ccclass, menu } = cc._decorator;

@ccclass
@menu("UI/pages/WithdrawSuccessPageCtrl")
export default class WithdrawSuccessPageCtrl extends BasePageCtrl {
    ui: WithdrawSuccessPage = null;

    static prefabUrl = "WithdrawSuccessPage";
    static className = "WithdrawSuccessPageCtrl";

    addButtonListen(): void {
        UiManager.addButtonListen(this.ui.btn, this.clickClose, this);
    }

    onUILoad(): void {
        this.ui = this.node.addComponent(WithdrawSuccessPage);
        this.ui.btn_confirm_label.getComponent(cc.Label).string = i18n.t("common_confirm");
        this.ui.btn_confirm_label.getComponent(cc.Label).string = i18n.t("withdraw_platform");
        this.ui.btn_confirm_label.getComponent(cc.Label).string = i18n.t("withdraw_zhanghu");
        this.ui.title_label.getComponent(cc.Label).string = i18n.t("withdraw_title");
    }

    onLoad(): void {
        this.onUILoad();
        this._animType = AnimType.SCALE;
        this._touchControl = false;
        this._hasPeneLock = true;
        this._hasBlack = true;
        this._hasTouchLock = false;
        super.onLoad();
        this.addButtonListen();
    }

    clickClose(): void {
        this.hide();
        EventMgr.trigger(GameEventType.CLOSE_WITHDRAWPAGE);
    }

    start(): void {
    }

    _init(e: { cash: number; channel: number }): void {
        const t = e.cash;
        const o = e.channel;
        const n = PlayerDataSys.getPlatformInfo(o);
        this.ui.account.getComponent(cc.Label).string = n.phone;
        this.ui.cash.getComponent(cc.Label).string = PlayerDataSys.getCashWithUnit(t);
        UiManager.loadSpriteFrame(this.ui.dana, "pay", "" + ChannelConfig[o].icon);
        this.ui.danaplat.getComponent(cc.Label).string = "" + ChannelConfig[o].name;
    }
}
