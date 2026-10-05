import BasePageCtrl, { AnimType } from "./BasePageCtrl";
import PageMgr from "./PageMgr";
import PlayerDataSys from "./PlayerDataSys";
import { PropIconMap } from "./ConfigDataMgr";
import GameServiceMgr from "./GameServiceMgr";
import { UiManager } from "./UiManage";
import BuyPropPage from "./BuyPropPage";

declare const i18n: { t(key: string, params?: any): string };

const { ccclass, menu } = cc._decorator;

@ccclass
@menu("UI/pages/BuyPropPageCtrl")
export default class BuyPropPageCtrl extends BasePageCtrl {
    ui: BuyPropPage = null;
    _clickBuyBlock: boolean = false;
    _prop_id: number = null;

    start(): void {}

    onClickBuy(): void {
        if (!this._clickBuyBlock) {
            this._clickBuyBlock = true;
            this.scheduleOnce(() => {
                this._clickBuyBlock = false;
            }, 0.5);
            if (PlayerDataSys.getPropDiamondCoast(this._prop_id) > PlayerDataSys.diamond_balance) {
                PageMgr.showPage("DiamondPage");
            } else {
                GameServiceMgr.useDiamond(
                    { props_id: "" + this._prop_id },
                    () => {
                        this._clickBuyBlock = false;
                        this.clickClose();
                    }
                );
            }
        }
    }

    _init(e: { prop_id: number }): void {
        this._prop_id = e.prop_id;
        UiManager.loadSpriteFrame(this.ui.prop_icon, "prop", PropIconMap[this._prop_id]);
        const cost = PlayerDataSys.getPropDiamondCoast(this._prop_id);
        this.ui.btn_label.getComponent(cc.Label).string = "" + cost;
        this.ui.title_label.getComponent(cc.Label).string = i18n.t("prop_name_" + this._prop_id);
        this.ui.desc_label.getComponent(cc.Label).string = i18n.t("prop_desc_" + this._prop_id);
    }

    onEnable(): void {
        super.onEnable();
        this._clickBuyBlock = false;
    }

    clickClose(): void {
        this.hide();
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

    onUILoad(): void {
        this.ui = this.node.addComponent(BuyPropPage);
        this.ui.btn_buy_label.getComponent(cc.Label).string = i18n.t("common_cost_diamond");
    }

    addButtonListen(): void {
        UiManager.addButtonListen(this.ui.btn_green, this.onClickBuy, this);
        UiManager.addButtonListen(this.ui.pop_close, this.clickClose, this);
    }

    static prefabUrl = "BuyPropPage";
    static className = "BuyPropPageCtrl";
}
