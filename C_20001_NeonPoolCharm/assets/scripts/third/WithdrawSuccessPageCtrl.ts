import PlayerDataSys from "./PlayerDataSys";
import EventMgr from "./EventMgr";
import GameEventType from "./GameEventType";
import { ChannelConfig } from "./SystemConfig";
import BasePageCtrl, { AnimType } from "./BasePageCtrl";
import { UiManager } from "./UiManage";
import WithdrawSuccessPage from "./WithdrawSuccessPage";

declare const i18n: { t(key: string, params?: any): string };

const { ccclass, menu } = cc._decorator;

@ccclass
@menu("UI/pages/WithdrawSuccessPageCtrl")
export default class WithdrawSuccessPageCtrl extends BasePageCtrl {
    ui: WithdrawSuccessPage = null;

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

    start(): void {}

    _init(e: { cash: number; channel: string }): void {
        const cash = e.cash;
        const channel = e.channel;
        const platformInfo = (PlayerDataSys as any).getPlatformInfo(channel);
        this.ui.account.getComponent(cc.Label).string = platformInfo.phone;
        this.ui.cash.getComponent(cc.Label).string = PlayerDataSys.getCashWithUnit(cash);
        UiManager.loadSpriteFrame(this.ui.dana, "pay", "" + ChannelConfig[channel].icon);
        this.ui.danaplat.getComponent(cc.Label).string = "" + ChannelConfig[channel].name;
    }

    static prefabUrl = "WithdrawSuccessPage";
    static className = "WithdrawSuccessPageCtrl";
}
