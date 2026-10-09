import AbTestMgr from "./AbTestMgr";
import AdManager from "./AdManager";
import BasePageCtrl, { AnimType } from "./BasePageCtrl";
import EventMgr from "./EventMgr";
import GameDataMgr from "./GameDataMgr";
import GameEventType from "./GameEventType";
import GameServiceMgr, { AD_TYPE } from "./GameServiceMgr";
import PlayerDataSys from "./PlayerDataSys";
import PropPage from "./PropPage";
import SdkHelper from "./SdkHelper";
import { UiManager } from "./UiManage";

declare const i18n: any;

export const PROP_TYPE = {
    remove: "remove",
    redo: "redo",
    refresh: "refresh"
};

const { ccclass, menu } = cc._decorator;

@ccclass
@menu("UI/pages/PropPageCtrl")
export default class PropPageCtrl extends BasePageCtrl {
    ui = null;
    _animType = null;
    _touchControl = null;
    _hasPeneLock = null;
    _hasBlack = null;
    _hasTouchLock = null;
    propType = null;
    ad_type;

    static prefabUrl = "PropPage";
    static className = "PropPageCtrl";

    clickClose() {
        this.hide();
    }

    start() {}

    _init(e) {
        var t = e.propType;
        this.propType = t;
        this.ui.prop_remove.active = t == PROP_TYPE.remove;
        this.ui.prop_redo.active = t == PROP_TYPE.redo;
        this.ui.prop_refresh.active = t == PROP_TYPE.refresh;
        var n = GameDataMgr.props_status,
            i = n.props_can_ad_redo,
            a = n.props_can_ad_refresh,
            r = n.props_can_ad_remove,
            l = n.props_can_diamond_redo,
            s = n.props_can_diamond_refresh,
            c = n.props_can_diamond_remove;
        n.props_count_redo, n.props_count_refresh, n.props_count_remove, n.relive_can_ad, n.relive_can_diamond;
        if (t == PROP_TYPE.remove) {
            this.ui.btn_blue.active = 0 != c;
            this.ui.btn_green.active = 0 != r;
            this.ad_type = AD_TYPE.props_remove;
            this.ui.des.getComponent(cc.Label).string = i18n.t("prop_1");
            0 != c && "s1" == AbTestMgr.ab_props_num && (this.ui.diamond_num.getComponent(cc.Label).string = (100 * (6 - c)).toString());
        } else if (t == PROP_TYPE.redo) {
            this.ui.btn_blue.active = 0 != l;
            this.ui.btn_green.active = 0 != i;
            this.ad_type = AD_TYPE.props_redo;
            this.ui.des.getComponent(cc.Label).string = i18n.t("prop_2");
            0 != l && "s1" == AbTestMgr.ab_props_num && (this.ui.diamond_num.getComponent(cc.Label).string = (100 * (6 - l)).toString());
        } else if (t == PROP_TYPE.refresh) {
            this.ui.btn_blue.active = 0 != s;
            this.ui.btn_green.active = 0 != a;
            this.ad_type = AD_TYPE.props_refresh;
            this.ui.des.getComponent(cc.Label).string = i18n.t("prop_3");
            0 != s && "s1" == AbTestMgr.ab_props_num && (this.ui.diamond_num.getComponent(cc.Label).string = (100 * (6 - s)).toString());
        }
    }

    addButtonListen() {
        UiManager.addButtonListen(this.ui.btn_blue, this.clickdiamond, this);
        UiManager.addButtonListen(this.ui.btn_green, this.playVideo, this);
        UiManager.addButtonListen(this.ui.prop_close, this.clickClose, this);
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

    playVideo() {
        var e = this;
        this.propType == PROP_TYPE.remove ? SdkHelper.showBigToast(i18n.t("ad_toast_2")) : this.propType == PROP_TYPE.redo ? SdkHelper.showBigToast(i18n.t("ad_toast_3")) : this.propType == PROP_TYPE.refresh && SdkHelper.showBigToast(i18n.t("ad_toast_4"));
        AdManager.getInstance().playNormalVideoAd(function () {
            GameServiceMgr.report({
                ad_type: e.ad_type
            }, function (t) {
                if (t) {
                    t.cash, t.diamond;
                    var n = t.props_status;
                    t.user_info;
                    GameDataMgr.props_status = n;
                    EventMgr.trigger(GameEventType.UPDATE_PROP_ICON);
                    EventMgr.trigger(GameEventType.GET_PROP, e.propType);
                    if (e.propType == PROP_TYPE.remove) {
                        SdkHelper.reportData("u_game_event_complete", {
                            act_page: "FunctionCardRemove"
                        });
                        SdkHelper.reportData("play_ad_success", {
                            act_page: "FunctionCardRemove"
                        });
                    } else if (e.propType == PROP_TYPE.redo) {
                        SdkHelper.reportData("u_game_event_complete", {
                            act_page: "FunctionCardRetry"
                        });
                        SdkHelper.reportData("play_ad_success", {
                            act_page: "FunctionCardRetry"
                        });
                    } else if (e.propType == PROP_TYPE.refresh) {
                        SdkHelper.reportData("u_game_event_complete", {
                            act_page: "FunctionCardShuffle"
                        });
                        SdkHelper.reportData("play_ad_success", {
                            act_page: "FunctionCardShuffle"
                        });
                    }
                }
                e.hide();
            }, function () {});
        }, function () {});
    }

    clickdiamond() {
        PlayerDataSys.diamond_balance >= 100 ? GameServiceMgr.useDiamond({
            props_id: this.propType
        }) : GameServiceMgr.getDiamondList();
        this.hide();
    }

    onUILoad() {
        this.ui = this.node.addComponent(PropPage);
    }
}
