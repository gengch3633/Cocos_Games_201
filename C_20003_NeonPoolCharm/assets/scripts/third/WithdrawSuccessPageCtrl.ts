import BasePageCtrl, { AnimType } from "./BasePageCtrl";
import EventMgr from "./EventMgr";
import GameEventType from "./GameEventType";
import PlayerDataSys from "./PlayerDataSys";
import { ChannelConfig } from "./SystemConfig";
import { UiManager } from "./UiManage";
import WithdrawSuccessPage from "./WithdrawSuccessPage";

declare const i18n: any;

const { ccclass, menu } = cc._decorator;

@ccclass
@menu("UI/pages/WithdrawSuccessPageCtrl")
export default class WithdrawSuccessPageCtrl extends BasePageCtrl {
    ui = null;
    _animType = null;
    _touchControl = null;
    _hasPeneLock = null;
    _hasBlack = null;
    _hasTouchLock = null;

    static prefabUrl = "WithdrawSuccessPage";
    static className = "WithdrawSuccessPageCtrl";

    addButtonListen() {
        UiManager.addButtonListen(this.ui.btn, this.clickClose, this);
    }

    onUILoad() {
        this.ui = this.node.addComponent(WithdrawSuccessPage);
        this.ui.btn_confirm_label.getComponent(cc.Label).string = i18n.t("common_confirm");
        this.ui.btn_confirm_label.getComponent(cc.Label).string = i18n.t("withdraw_platform");
        this.ui.btn_confirm_label.getComponent(cc.Label).string = i18n.t("withdraw_zhanghu");
        this.ui.title_label.getComponent(cc.Label).string = i18n.t("withdraw_title");
    }

    onLoad() {
        this.onUILoad();
        this._animType = AnimType.SCALE;
        this._touchControl = false;
        this._hasPeneLock = true;
        this._hasBlack = true;
        this._hasTouchLock = false;
        super.onLoad();
        this.addButtonListen();
    }

    clickClose() {
        this.hide();
        EventMgr.trigger(GameEventType.CLOSE_WITHDRAWPAGE);
    }

    start() {}

    _init(data) {
        const cash = data.cash;
        const channel = data.channel;
        const platformInfo = PlayerDataSys.getPlatformInfo(channel);
        this.ui.account.getComponent(cc.Label).string = platformInfo.phone;
        this.ui.cash.getComponent(cc.Label).string = PlayerDataSys.getCashWithUnit(cash);
        UiManager.loadSpriteFrame(this.ui.dana, "pay", "" + ChannelConfig[channel].icon);
        this.ui.danaplat.getComponent(cc.Label).string = "" + ChannelConfig[channel].name;
    }
}
