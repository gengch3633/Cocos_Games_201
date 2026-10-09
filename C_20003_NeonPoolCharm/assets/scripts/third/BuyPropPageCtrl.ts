import BasePageCtrl, { AnimType } from "./BasePageCtrl";
import BuyPropPage from "./BuyPropPage";
import { PropIconMap } from "./ConfigDataMgr";
import GameServiceMgr from "./GameServiceMgr";
import PageMgr from "./PageMgr";
import PlayerDataSys from "./PlayerDataSys";
import { UiManager } from "./UiManage";

const { ccclass, menu } = cc._decorator;

@ccclass
@menu("UI/pages/BuyPropPageCtrl")
export default class BuyPropPageCtrl extends BasePageCtrl {

    ui = null;

    _animType = null;

    _touchControl = null;

    _hasPeneLock = null;

    _hasBlack = null;

    _hasTouchLock = null;

    _clickBuyBlock = null;

    _prop_id = null;

    static prefabUrl = "BuyPropPage";

    static className = "BuyPropPageCtrl";

    start() {
    }

    onClickBuy() {
        const e = this;
        if (!this._clickBuyBlock) {
            this._clickBuyBlock = true;
            this.scheduleOnce(function () {
                e._clickBuyBlock = false;
            }, .5);
            PlayerDataSys.getPropDiamondCoast(this._prop_id) > PlayerDataSys.diamond_balance ? PageMgr.showPage("DiamondPage") : GameServiceMgr.useDiamond({
                props_id: "" + this._prop_id
            }, function () {
                e._clickBuyBlock = false;
                e.clickClose();
            });
        }
    }

    _init(e) {
        this._prop_id = e.prop_id;
        UiManager.loadSpriteFrame(this.ui.prop_icon, "prop", PropIconMap[this._prop_id]);
        const t = PlayerDataSys.getPropDiamondCoast(this._prop_id);
        this.ui.btn_label.getComponent(cc.Label).string = "" + t;
        this.ui.title_label.getComponent(cc.Label).string = i18n.t("prop_name_" + this._prop_id);
        this.ui.desc_label.getComponent(cc.Label).string = i18n.t("prop_desc_" + this._prop_id);
    }

    onEnable() {
        super.onEnable();
        this._clickBuyBlock = false;
    }

    clickClose() {
        this.hide();
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

    onUILoad() {
        this.ui = this.node.addComponent(BuyPropPage);
        this.ui.btn_buy_label.getComponent(cc.Label).string = i18n.t("common_cost_diamond");
    }

    addButtonListen() {
        UiManager.addButtonListen(this.ui.btn_green, this.onClickBuy, this);
        UiManager.addButtonListen(this.ui.pop_close, this.clickClose, this);
    }
}
