import AdManager from "./AdManager";
import BallLogicMgr from "./BallLogicMgr";
import BasePageCtrl, { AnimType } from "./BasePageCtrl";
import ConfigDataSys from "./ConfigDataSys";
import CueDataSys from "./CueDataSys";
import EngineUtil from "./EngineUtil";
import EventMgr from "./EventMgr";
import GameEventType from "./GameEventType";
import GameService from "./GameService";
import GameServiceMgr from "./GameServiceMgr";
import GlobalConfig from "./GlobalConfig";
import GlobalDataMgr from "./GlobalDataMgr";
import GmPage from "./GmPage";
import Handler from "./Handler";
import PlayerDataSys from "./PlayerDataSys";
import SdkHelper from "./SdkHelper";
import { NOT_USE_DEVICE_ID_LS_KEY, languages } from "./SystemConfig";
import { UiManager } from "./UiManage";

const { ccclass, menu } = cc._decorator;

@ccclass
@menu("UI/pages/GmPageCtrl")
export default class GmPageCtrl extends BasePageCtrl {
    ui = null;
    usedLan = [languages.CN, languages.ID];
    _animType = null;
    _touchControl = null;
    _hasPeneLock = null;
    _hasBlack = null;
    _hasTouchLock = null;
    _levelIndex = null;
    _level_config_index = null;
    _clickLock = null;
    _curModifyAngle;

    static prefabUrl = "gmPage";
    static className = "GmPageCtrl";

    updateLanguage() {
        for (let e = 0; e < this.usedLan.length; e++) {
            const t: any = cc.instantiate(this.ui.language_list_item);
            t.active = true;
            t.setParent(this.ui.language_content);
            t.lan = this.usedLan[e];
            t.getChildByName("Background11").getChildByName("language_li_label").getComponent(cc.Label).string = this.usedLan[e];
            UiManager.addButtonListen(t, this.onLanSelected, this, this.usedLan[e]);
        }
        this.ui.language_list_item.active = false;
        this.updateCurLan();
    }

    getCpm() {
        const e = this;
        GameServiceMgr.GmGetCpmRecord(function (t) {
            e.ui.lab_cpm.getComponent(cc.Label).string = t.records.join(",");
        });
    }

    refrashLevelConfigLists() {
        const e = this.ui.level_config_content.children,
            t = this._levelIndex + 1,
            o = ConfigDataSys.stage_configMap.get(t).item_config_name.split("#");
        this._level_config_index > o.length - 1 && (this._level_config_index = 0);
        let n = 0;
        for (n = 0; n < o.length; n++) {
            let i;
            if (n < e.length) i = e[n]; else {
                (i = cc.instantiate(this.ui.level_name_list_item)).setParent(this.ui.level_config_content);
                i.getComponent("GMLevelListItem").onClickCB = this.onLevelConfigItemSelected.bind(this);
            }
            i.active = true;
            i.getComponent("GMLevelListItem").setLabel(o[n]);
        }
        for (; n < e.length; n++) e[n].active = false;
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

    updateAccountInfo() {
        const e = Number(EngineUtil.localStorageGetItem(NOT_USE_DEVICE_ID_LS_KEY, "0"));
        this.ui.Label_switch_account.getComponent(cc.Label).string = "使用device_id作帐号：" + (1 == e ? "否" : "是");
    }

    onLevelNameBtnClicked() {
        this.refrashLevelNameList();
        this.resetLevelNameLabel();
    }

    onLevelConfigBtnClicked() {
        this.refrashLevelConfigList();
    }

    _init(t) {
        this.ui.in_game_area.active = 1 == t;
        this.ui.main_ui_area.active = !t;
        this.refrashLevelNameList();
        this.refrashLevelConfigList();
        this.resetLevelConfigName();
        if (null == this._curModifyAngle) {
            this._curModifyAngle = BallLogicMgr.ballDirModifyThreshold / Math.PI * 180;
        }
        this.updateBallDirModify();
    }

    static getLSLanguage() {
        const e = EngineUtil.localStorageGetItem("ls_lan", "null");
        return "null" == e ? null : e;
    }

    static setLSLanguage(e) {
        EngineUtil.localStorageSetItem("ls_lan", e);
    }

    refrashLevelConfigList() {}

    onStartLevelClicked() {
        const e = this;
        if (!this._clickLock) {
            this._clickLock = true;
            setTimeout(function () {
                e._clickLock = false;
            }, 200);
            const t = this._levelIndex + 1;
            this._level_config_index;
            GameService.gmToLevel({
                level: t
            }, Handler.create(this, function (e) {
                e && e.code;
            }), Handler.create(this, function () {
                EngineUtil.showManageViewToast("设置关卡失败");
            }));
        }
    }

    static clearLSLanguage() {
        cc.sys.localStorage.removeItem("ls_lan");
    }

    resetLevelNameLabel() {}

    onLanSelected(e) {
        GmPageCtrl.setLSLanguage(e);
        this.updateCurLan();
    }

    onEnable() {
        super.onEnable();
        this.getCpm();
    }

    updateCurLan() {
        const e = GmPageCtrl.getLSLanguage();
        this.ui.cur_lan_label.getComponent(cc.Label).string = "当前:" + (e || GlobalDataMgr.curLanguage);
    }

    addSignInCount() {
        const e = this.ui.add_cash.getComponent(cc.EditBox).string,
            t = "" == e ? 1 : Number(e);
        GameServiceMgr.GMAddSignInCount(t, function () {
            EngineUtil.showManageViewToast("添加成功");
        });
    }

    onUILoad() {
        this.ui = this.node.addComponent(GmPage);
        this._levelIndex = PlayerDataSys.user_level - 1;
        this._level_config_index = PlayerDataSys.level_config_index;
        this.ui.level_config_list_item.active = false;
        this.ui.level_name_list_item.active = false;
        this.updateAccountInfo();
        this.updateAdBtn();
        this.updateAdSimRet();
        this.updateLanguage();
    }

    updateAdSimRet() {
        this.ui.Label_ad_sim_ret.getComponent(cc.Label).string = "广告结果：" + (AdManager.getInstance().adSwitch ? "成功" : "失败");
    }

    onLevelNameItemSelected(e) {
        this._levelIndex = this.ui.level_name_content.children.indexOf(e.node);
        this.refrashLevelNameList();
        this.resetLevelNameLabel();
        this.refrashLevelConfigList();
        this.resetLevelConfigName();
    }

    refrashLevelNameList() {}

    updateBallDirModify() {
        this.ui.ball_modify_state_Label.getComponent(cc.Label).string = "修正球滚动方向：" + (BallLogicMgr.isModifyBallDir ? "开" : "关");
        this.ui.set_ball_modify_angle.getComponent(cc.EditBox).string = "" + this._curModifyAngle;
    }

    resetLevelConfigName() {}

    clickClose() {
        this.hide();
    }

    onLevelConfigItemSelected(e) {
        this._level_config_index = this.ui.level_config_content.children.indexOf(e.node);
        this.resetLevelConfigName();
    }

    addButtonListen() {
        const t = this;
        UiManager.addButtonListen(this.ui.add_cash_btn, function () {
            const e = t.ui.add_cash.getComponent(cc.EditBox).string;
            GameServiceMgr.GmChangeCash("cash", Number(e));
        }, this);
        UiManager.addButtonListen(this.ui.add_gold_btn, function () {
            const e = t.ui.add_cash.getComponent(cc.EditBox).string;
            GameServiceMgr.GmChangeCash("gold", Number(e));
        }, this);
        UiManager.addButtonListen(this.ui.add_club_shard, function () {
            GameServiceMgr.GmGetClubShard();
        }, this);
        UiManager.addButtonListen(this.ui.add_zhendong, function () {
            const e = t.ui.add_cash.getComponent(cc.EditBox).string;
            SdkHelper.vibratorDuration = Number(e);
        }, this);
        UiManager.addButtonListen(this.ui.edit_btn, function () {}, this);
        UiManager.addButtonListen(this.ui.fps_show, function () {
            cc.debug.setDisplayStats(!cc.debug.isDisplayStats());
            EngineUtil.setStatsColor(cc.Color.BLACK, cc.color(255, 255, 255, 180));
            t.ui.fps_show.getComponentInChildren(cc.Label).string = "显示帧数 " + (cc.debug.isDisplayStats() ? "关" : "开");
        }, this);
        UiManager.addButtonListen(this.ui.fps_60, function () {
            cc.director.getPhysicsManager().enabledAccumulator = true;
            cc.PhysicsManager.FIXED_TIME_STEP = .016666666666666666;
        }, this);
        UiManager.addButtonListen(this.ui.fps_90, function () {
            cc.director.getPhysicsManager().enabledAccumulator = true;
            cc.PhysicsManager.FIXED_TIME_STEP = .011111111111111112;
        }, this);
        UiManager.addButtonListen(this.ui.btn_choujiang, function () {}, this);
        UiManager.addButtonListen(this.ui.fps_auto, function () {
            const e = cc.director.getPhysicsManager();
            e.enabledAccumulator = !e.enabledAccumulator;
            t.ui.fps_auto.getComponentInChildren(cc.Label).string = "用屏幕帧 " + (e.enabledAccumulator ? "关" : "开");
        }, this);
        UiManager.addButtonListen(this.ui.fps_limit, function () {
            const e = cc.game.getFrameRate();
            cc.game.setFrameRate(60 == e ? 59 : 60);
            t.ui.fps_limit.getComponentInChildren(cc.Label).string = "帧数锁定 " + (60 != e ? "开" : "关");
        }, this);
        UiManager.addButtonListen(this.ui.add_sign_in_count, this.addSignInCount, this);
        UiManager.addButtonListen(this.ui.close_btn, this.clickClose, this);
        UiManager.addButtonListen(this.ui.level_start_btn, this.onStartLevelClicked, this);
        UiManager.addButtonListen(this.ui.level_btn, this.onLevelNameBtnClicked, this);
        UiManager.addButtonListen(this.ui.level_config_btn, this.onLevelConfigBtnClicked, this);
        UiManager.addButtonListen(this.ui.add_ad_switch, function () {
            AdManager.getInstance().adSwitch = !AdManager.getInstance().adSwitch;
            t.updateAdBtn();
        }, this);
        UiManager.addButtonListen(this.ui.add_ad_sim_ret, function () {
            AdManager.getInstance().adSwitch = !AdManager.getInstance().adSwitch;
            t.updateAdSimRet();
        }, this);
        UiManager.addButtonListen(this.ui.btn_switch_account, function () {
            const e = Number(EngineUtil.localStorageGetItem(NOT_USE_DEVICE_ID_LS_KEY, "0"));
            EngineUtil.localStorageSetItem(NOT_USE_DEVICE_ID_LS_KEY, e ? "0" : "1");
            t.updateAccountInfo();
        }, this);
        UiManager.addButtonListen(this.ui.btn_clear_account, function () {
            const e = EngineUtil.localStorageGetItem(NOT_USE_DEVICE_ID_LS_KEY, "0");
            cc.sys.localStorage.clear();
            EngineUtil.localStorageSetItem(NOT_USE_DEVICE_ID_LS_KEY, e);
        }, this);
        UiManager.addButtonListen(this.ui.btn_language, function () {
            GmPageCtrl.clearLSLanguage();
            t.updateCurLan();
        }, this);
        UiManager.addButtonListen(this.ui.level_success, function () {
            EventMgr.trigger(GameEventType.GM_LEVEL_SUCCESS);
            t.hide();
        }, this);
        UiManager.addButtonListen(this.ui.changelevel_btn, function () {
            const e = Number(t.ui.level_changed_eb.getComponent(cc.EditBox).string);
            (isNaN(e), 1) || GameServiceMgr.deprecatedGmChangeLevel(e, function (e) {
                const t = e.level,
                    o = e.level_loop;
                PlayerDataSys.user_level = t;
                PlayerDataSys.level_loop = o;
                EngineUtil.showManageViewToast("切换到关卡：" + t);
                BallLogicMgr.loadTable_freeMode_useIdx(PlayerDataSys.validConfigLevelID - 1);
            }, function () {
                EngineUtil.showManageViewToast("切换关卡失败");
            });
        }, this);
        const o = function () {
            t.ui.attri_power_editbox.getComponent(cc.EditBox).string = "" + CueDataSys.getUsedCuePower();
            t.ui.attri_spin_editbox.getComponent(cc.EditBox).string = "" + CueDataSys.getUsedCueRoleAngle();
            t.ui.attri_aimming_editbox.getComponent(cc.EditBox).string = "" + CueDataSys.getUsedCueAimLineLen();
        };
        o();
        UiManager.addButtonListen(this.ui.use_attri_btn, function () {
            const e = Number(t.ui.attri_power_editbox.getComponent(cc.EditBox).string),
                o = Number(t.ui.attri_spin_editbox.getComponent(cc.EditBox).string),
                n = Number(t.ui.attri_aimming_editbox.getComponent(cc.EditBox).string);
            BallLogicMgr.useSimCueAttri = true;
            BallLogicMgr.simCuePower = e;
            BallLogicMgr.simCueSpin = o;
            BallLogicMgr.simAimming = n;
        }, this);
        UiManager.addButtonListen(this.ui.recover_attri_btn, function () {
            BallLogicMgr.useSimCueAttri = false;
            o();
        }, this);
        const i = this.ui.attri_gan_move_editbox.getComponent(cc.EditBox),
            a = this.ui.attri_gan_move_aimming_editbox.getComponent(cc.EditBox),
            p = function () {
                GlobalConfig.gan_move_rad_multy_normal = GlobalConfig.gan_move_rad_multy_normal_base;
                GlobalConfig.gan_move_rad_multy_aim = GlobalConfig.gan_move_rad_multy_aim_base;
                i.string = "" + GlobalConfig.gan_move_rad_multy_normal_base;
                a.string = "" + GlobalConfig.gan_move_rad_multy_aim_base;
            };
        p();
        UiManager.addButtonListen(this.ui.use_gan_move_btn, function () {
            GlobalConfig.gan_move_rad_multy_normal = Number(i.string);
            GlobalConfig.gan_move_rad_multy_aim = Number(a.string);
            EngineUtil.showManageViewToast("球杆移动参数设置成功");
        }, this);
        UiManager.addButtonListen(this.ui.recover_gan_move_btn, function () {
            p();
            EngineUtil.showManageViewToast("球杆移动参数回复默认");
        }, this);
        const d = this.ui.gan_roll_editbox.getComponent(cc.EditBox),
            g = this.ui.gan_roll_aimming_editbox.getComponent(cc.EditBox);
        (function () {
            GlobalConfig.gan_move_roll_multy = GlobalConfig.gan_move_roll_multy_base;
            GlobalConfig.gan_move_roll_multy_aim = GlobalConfig.gan_move_roll_multy_aim_base;
            d.string = "" + GlobalConfig.gan_move_roll_multy_base;
            g.string = "" + GlobalConfig.gan_move_roll_multy_aim_base;
        })();
        UiManager.addButtonListen(this.ui.use_gan_roll_move_btn, function () {
            GlobalConfig.gan_move_roll_multy = Number(d.string);
            GlobalConfig.gan_move_roll_multy_aim = Number(g.string);
            EngineUtil.showManageViewToast("滚轮参数设置成功");
        }, this);
        UiManager.addButtonListen(this.ui.recover_gan_roll_move_btn, function () {
            p();
            EngineUtil.showManageViewToast("滚轮参数回复默认");
        }, this);
        UiManager.addButtonListen(this.ui.btn_set_ball_modify_angle, function () {
            const o = Number(t.ui.set_ball_modify_angle.getComponent(cc.EditBox).string);
            if (isNaN(o)) EngineUtil.showManageViewToast("角度输入错误"); else {
                t._curModifyAngle = o;
                BallLogicMgr.ballDirModifyThreshold = o / 180 * Math.PI;
                t.updateBallDirModify();
                EngineUtil.showManageViewToast("角度设置成功");
            }
        }, this);
        UiManager.addButtonListen(this.ui.btn_switch_ball_modify, function () {
            BallLogicMgr.isModifyBallDir = !BallLogicMgr.isModifyBallDir;
            t.updateBallDirModify();
        }, this);
    }

    updateAdBtn() {
        this.ui.Label_ad_switch.getComponent(cc.Label).string = "广告播放：" + (AdManager.getInstance().adSwitch ? "开" : "关");
        this.ui.add_ad_sim_ret.active = false;
    }

    start() {
        this.resetLevelNameLabel();
    }
}
