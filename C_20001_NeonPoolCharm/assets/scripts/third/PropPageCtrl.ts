import PlayerDataSys from "./PlayerDataSys";
import EventMgr from "./EventMgr";
import GameEventType from "./GameEventType";
import AdManager from "./AdManager";
import SdkHelper from "./SdkHelper";
import BasePageCtrl, { AnimType } from "./BasePageCtrl";
import AbTestMgr from "./AbTestMgr";
import GameServiceMgr, { AD_TYPE } from "./GameServiceMgr";
import { UiManager } from "./UiManage";
import GameDataMgr from "./GameDataMgr";
import PropPage from "./PropPage";

declare const i18n: { t(key: string, params?: any): string };

export const PROP_TYPE = {
    remove: "remove",
    redo: "redo",
    refresh: "refresh",
};

const { ccclass, menu } = cc._decorator;

@ccclass
@menu("UI/pages/PropPageCtrl")
export default class PropPageCtrl extends BasePageCtrl {
    ui: PropPage = null;
    propType: string = null;
    ad_type: AD_TYPE = null;

    clickClose(): void {
        this.hide();
    }

    start(): void {}

    _init(e: { propType: string }): void {
        const t = e.propType;
        this.propType = t;
        this.ui.prop_remove.active = t == PROP_TYPE.remove;
        this.ui.prop_redo.active = t == PROP_TYPE.redo;
        this.ui.prop_refresh.active = t == PROP_TYPE.refresh;
        const n = GameDataMgr.props_status;
        const props_can_ad_redo = n.props_can_ad_redo;
        const props_can_ad_refresh = n.props_can_ad_refresh;
        const props_can_ad_remove = n.props_can_ad_remove;
        const props_can_diamond_redo = n.props_can_diamond_redo;
        const props_can_diamond_refresh = n.props_can_diamond_refresh;
        const props_can_diamond_remove = n.props_can_diamond_remove;
        if (t == PROP_TYPE.remove) {
            this.ui.btn_blue.active = props_can_diamond_remove != 0;
            this.ui.btn_green.active = props_can_ad_remove != 0;
            this.ad_type = AD_TYPE.props_remove;
            this.ui.des.getComponent(cc.Label).string = i18n.t("prop_1");
            if (props_can_diamond_remove != 0 && AbTestMgr.ab_props_num == "s1") {
                this.ui.diamond_num.getComponent(cc.Label).string = (100 * (6 - props_can_diamond_remove)).toString();
            }
        } else if (t == PROP_TYPE.redo) {
            this.ui.btn_blue.active = props_can_diamond_redo != 0;
            this.ui.btn_green.active = props_can_ad_redo != 0;
            this.ad_type = AD_TYPE.props_redo;
            this.ui.des.getComponent(cc.Label).string = i18n.t("prop_2");
            if (props_can_diamond_redo != 0 && AbTestMgr.ab_props_num == "s1") {
                this.ui.diamond_num.getComponent(cc.Label).string = (100 * (6 - props_can_diamond_redo)).toString();
            }
        } else if (t == PROP_TYPE.refresh) {
            this.ui.btn_blue.active = props_can_diamond_refresh != 0;
            this.ui.btn_green.active = props_can_ad_refresh != 0;
            this.ad_type = AD_TYPE.props_refresh;
            this.ui.des.getComponent(cc.Label).string = i18n.t("prop_3");
            if (props_can_diamond_refresh != 0 && AbTestMgr.ab_props_num == "s1") {
                this.ui.diamond_num.getComponent(cc.Label).string = (100 * (6 - props_can_diamond_refresh)).toString();
            }
        }
    }

    addButtonListen(): void {
        UiManager.addButtonListen(this.ui.btn_blue, this.clickdiamond, this);
        UiManager.addButtonListen(this.ui.btn_green, this.playVideo, this);
        UiManager.addButtonListen(this.ui.prop_close, this.clickClose, this);
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

    playVideo(): void {
        if (this.propType == PROP_TYPE.remove) {
            SdkHelper.showBigToast(i18n.t("ad_toast_2"));
        } else if (this.propType == PROP_TYPE.redo) {
            SdkHelper.showBigToast(i18n.t("ad_toast_3"));
        } else if (this.propType == PROP_TYPE.refresh) {
            SdkHelper.showBigToast(i18n.t("ad_toast_4"));
        }
        AdManager.getInstance().playNormalVideoAd(
            () => {
                GameServiceMgr.report(
                    { ad_type: this.ad_type },
                    (t: any) => {
                        if (t) {
                            const props_status = t.props_status;
                            GameDataMgr.props_status = props_status;
                            EventMgr.trigger(GameEventType.UPDATE_PROP_ICON);
                            EventMgr.trigger(GameEventType.GET_PROP, this.propType);
                            if (this.propType == PROP_TYPE.remove) {
                                SdkHelper.reportData("u_game_event_complete", { act_page: "FunctionCardRemove" });
                                SdkHelper.reportData("play_ad_success", { act_page: "FunctionCardRemove" });
                            } else if (this.propType == PROP_TYPE.redo) {
                                SdkHelper.reportData("u_game_event_complete", { act_page: "FunctionCardRetry" });
                                SdkHelper.reportData("play_ad_success", { act_page: "FunctionCardRetry" });
                            } else if (this.propType == PROP_TYPE.refresh) {
                                SdkHelper.reportData("u_game_event_complete", { act_page: "FunctionCardShuffle" });
                                SdkHelper.reportData("play_ad_success", { act_page: "FunctionCardShuffle" });
                            }
                        }
                        this.hide();
                    },
                    () => {}
                );
            },
            () => {}
        );
    }

    clickdiamond(): void {
        if (PlayerDataSys.diamond_balance >= 100) {
            GameServiceMgr.useDiamond({ props_id: this.propType });
        } else {
            GameServiceMgr.getDiamondList();
        }
        this.hide();
    }

    onUILoad(): void {
        this.ui = this.node.addComponent(PropPage);
    }

    static prefabUrl = "PropPage";
    static className = "PropPageCtrl";
}
