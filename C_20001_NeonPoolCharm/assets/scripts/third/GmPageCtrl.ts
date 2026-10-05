import * as BallLogicMgr from "./BallLogicMgr";
import * as GlobalConfig from "./GlobalConfig";
import GameServiceMgr from "./GameServiceMgr";
import { UiManager } from "./UiManage";
import { languages, NOT_USE_DEVICE_ID_LS_KEY } from "./SystemConfig";
import BasePageCtrl, { AnimType } from "./BasePageCtrl";
import GmPage from "./GmPage";
import CueDataSys from "./CueDataSys";
import EventMgr from "./EventMgr";
import GameEventType from "./GameEventType";
import Handler from "./Handler";
import AdManager from "./AdManager";
import SdkHelper from "./SdkHelper";
import GameService from "./GameService";
import EngineUtil from "./EngineUtil";
import ConfigDataSys from "./ConfigDataSys";
import PlayerDataSys from "./PlayerDataSys";
import GlobalDataMgr from "./GlobalDataMgr";

const { ccclass, menu } = cc._decorator;

@ccclass
@menu("UI/pages/GmPageCtrl")
export default class GmPageCtrl extends BasePageCtrl {
    static prefabUrl = "gmPage";
    static className = "GmPageCtrl";

    ui: GmPage = null;
    usedLan = [languages.CN, languages.ID];
    _animType: AnimType = null;
    _touchControl = false;
    _hasPeneLock = true;
    _hasBlack = true;
    _hasTouchLock = false;
    _levelIndex = 0;
    _level_config_index = 0;
    _clickLock = false;
    _curModifyAngle: number = null;

    updateLanguage(): void {
        for (let i = 0; i < this.usedLan.length; i++) {
            const item = cc.instantiate(this.ui.language_list_item);
            item.active = true;
            item.setParent(this.ui.language_content);
            (item as any).lan = this.usedLan[i];
            item.getChildByName("Background11")
                .getChildByName("language_li_label")
                .getComponent(cc.Label).string = this.usedLan[i];
            UiManager.addButtonListen(item, this.onLanSelected, this, this.usedLan[i]);
        }
        this.ui.language_list_item.active = false;
        this.updateCurLan();
    }

    getCpm(): void {
        GameServiceMgr.GmGetCpmRecord((data: { records: unknown[] }) => {
            this.ui.lab_cpm.getComponent(cc.Label).string = data.records.join(",");
        });
    }

    refrashLevelConfigLists(): void {
        const children = this.ui.level_config_content.children;
        const stageId = this._levelIndex + 1;
        const configNames = ConfigDataSys.stage_configMap.get(stageId).item_config_name.split("#");
        if (this._level_config_index > configNames.length - 1) {
            this._level_config_index = 0;
        }
        let index = 0;
        for (index = 0; index < configNames.length; index++) {
            let item: cc.Node;
            if (index < children.length) {
                item = children[index];
            } else {
                item = cc.instantiate(this.ui.level_name_list_item);
                item.setParent(this.ui.level_config_content);
                (item.getComponent("GMLevelListItem") as any).onClickCB = this.onLevelConfigItemSelected.bind(this);
            }
            item.active = true;
            (item.getComponent("GMLevelListItem") as any).setLabel(configNames[index]);
        }
        for (; index < children.length; index++) {
            children[index].active = false;
        }
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

    updateAccountInfo(): void {
        const flag = Number(EngineUtil.localStorageGetItem(NOT_USE_DEVICE_ID_LS_KEY, "0"));
        this.ui.Label_switch_account.getComponent(cc.Label).string =
            "使用device_id作帐号：" + (flag == 1 ? "否" : "是");
    }

    onLevelNameBtnClicked(): void {
        this.refrashLevelNameList();
        this.resetLevelNameLabel();
    }

    _init(inGame: number): void {
        this.ui.in_game_area.active = inGame == 1;
        this.ui.main_ui_area.active = !inGame;
        this.refrashLevelNameList();
        this.refrashLevelConfigList();
        this.resetLevelConfigName();
        if (this._curModifyAngle == null) {
            this._curModifyAngle = (BallLogicMgr.ballDirModifyThreshold / Math.PI) * 180;
        }
        this.updateBallDirModify();
    }

    onLevelConfigBtnClicked(): void {
        this.refrashLevelConfigList();
    }

    static getLSLanguage(): string {
        const value = EngineUtil.localStorageGetItem("ls_lan", "null");
        return value == "null" ? null : value;
    }

    static setLSLanguage(language: string): void {
        EngineUtil.localStorageSetItem("ls_lan", language);
    }

    refrashLevelConfigList(): void {}

    onStartLevelClicked(): void {
        if (!this._clickLock) {
            this._clickLock = true;
            setTimeout(() => {
                this._clickLock = false;
            }, 200);
            const level = this._levelIndex + 1;
            GameService.gmToLevel(
                { level },
                Handler.create(this, (response: { code?: number }) => {
                    response && response.code;
                }),
                Handler.create(this, () => {
                    EngineUtil.showManageViewToast("设置关卡失败");
                })
            );
        }
    }

    static clearLSLanguage(): void {
        cc.sys.localStorage.removeItem("ls_lan");
    }

    resetLevelNameLabel(): void {}

    onLanSelected(language: string): void {
        GmPageCtrl.setLSLanguage(language);
        this.updateCurLan();
    }

    onEnable(): void {
        super.onEnable();
        this.getCpm();
    }

    updateCurLan(): void {
        const language = GmPageCtrl.getLSLanguage();
        this.ui.cur_lan_label.getComponent(cc.Label).string = "当前:" + (language || GlobalDataMgr.curLanguage);
    }

    addSignInCount(): void {
        const text = this.ui.add_cash.getComponent(cc.EditBox).string;
        const count = text == "" ? 1 : Number(text);
        GameServiceMgr.GMAddSignInCount(count, () => {
            EngineUtil.showManageViewToast("添加成功");
        });
    }

    onUILoad(): void {
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

    updateAdSimRet(): void {
        this.ui.Label_ad_sim_ret.getComponent(cc.Label).string =
            "广告结果：" + (AdManager.getInstance().adSwitch ? "成功" : "失败");
    }

    onLevelNameItemSelected(item: { node: cc.Node }): void {
        this._levelIndex = this.ui.level_name_content.children.indexOf(item.node);
        this.refrashLevelNameList();
        this.resetLevelNameLabel();
        this.refrashLevelConfigList();
        this.resetLevelConfigName();
    }

    refrashLevelNameList(): void {}

    updateBallDirModify(): void {
        this.ui.ball_modify_state_Label.getComponent(cc.Label).string =
            "修正球滚动方向：" + (BallLogicMgr.isModifyBallDir ? "开" : "关");
        this.ui.set_ball_modify_angle.getComponent(cc.EditBox).string = "" + this._curModifyAngle;
    }

    resetLevelConfigName(): void {}

    clickClose(): void {
        this.hide();
    }

    onLevelConfigItemSelected(item: { node: cc.Node }): void {
        this._level_config_index = this.ui.level_config_content.children.indexOf(item.node);
        this.resetLevelConfigName();
    }

    addButtonListen(): void {
        const self = this;
        UiManager.addButtonListen(this.ui.add_cash_btn, () => {
            const value = self.ui.add_cash.getComponent(cc.EditBox).string;
            GameServiceMgr.GmChangeCash("cash", Number(value));
        }, this);
        UiManager.addButtonListen(this.ui.add_gold_btn, () => {
            const value = self.ui.add_cash.getComponent(cc.EditBox).string;
            GameServiceMgr.GmChangeCash("gold", Number(value));
        }, this);
        UiManager.addButtonListen(this.ui.add_club_shard, () => {
            GameServiceMgr.GmGetClubShard();
        }, this);
        UiManager.addButtonListen(this.ui.add_zhendong, () => {
            const value = self.ui.add_cash.getComponent(cc.EditBox).string;
            SdkHelper.vibratorDuration = Number(value);
        }, this);
        UiManager.addButtonListen(this.ui.edit_btn, () => {}, this);
        UiManager.addButtonListen(this.ui.fps_show, () => {
            cc.debug.setDisplayStats(!cc.debug.isDisplayStats());
            EngineUtil.setStatsColor(cc.Color.BLACK, cc.color(255, 255, 255, 180));
            self.ui.fps_show.getComponentInChildren(cc.Label).string =
                "显示帧数 " + (cc.debug.isDisplayStats() ? "关" : "开");
        }, this);
        UiManager.addButtonListen(this.ui.fps_60, () => {
            cc.director.getPhysicsManager().enabledAccumulator = true;
            cc.PhysicsManager.FIXED_TIME_STEP = 0.016666666666666666;
        }, this);
        UiManager.addButtonListen(this.ui.fps_90, () => {
            cc.director.getPhysicsManager().enabledAccumulator = true;
            cc.PhysicsManager.FIXED_TIME_STEP = 0.011111111111111112;
        }, this);
        UiManager.addButtonListen(this.ui.btn_choujiang, () => {}, this);
        UiManager.addButtonListen(this.ui.fps_auto, () => {
            const manager = cc.director.getPhysicsManager();
            manager.enabledAccumulator = !manager.enabledAccumulator;
            self.ui.fps_auto.getComponentInChildren(cc.Label).string =
                "用屏幕帧 " + (manager.enabledAccumulator ? "关" : "开");
        }, this);
        UiManager.addButtonListen(this.ui.fps_limit, () => {
            const frameRate = cc.game.getFrameRate();
            cc.game.setFrameRate(frameRate == 60 ? 59 : 60);
            self.ui.fps_limit.getComponentInChildren(cc.Label).string =
                "帧数锁定 " + (frameRate != 60 ? "开" : "关");
        }, this);
        UiManager.addButtonListen(this.ui.add_sign_in_count, this.addSignInCount, this);
        UiManager.addButtonListen(this.ui.close_btn, this.clickClose, this);
        UiManager.addButtonListen(this.ui.level_start_btn, this.onStartLevelClicked, this);
        UiManager.addButtonListen(this.ui.level_btn, this.onLevelNameBtnClicked, this);
        UiManager.addButtonListen(this.ui.level_config_btn, this.onLevelConfigBtnClicked, this);
        UiManager.addButtonListen(this.ui.add_ad_switch, () => {
            AdManager.getInstance().adSwitch = !AdManager.getInstance().adSwitch;
            self.updateAdBtn();
        }, this);
        UiManager.addButtonListen(this.ui.add_ad_sim_ret, () => {
            AdManager.getInstance().adSwitch = !AdManager.getInstance().adSwitch;
            self.updateAdSimRet();
        }, this);
        UiManager.addButtonListen(this.ui.btn_switch_account, () => {
            const flag = Number(EngineUtil.localStorageGetItem(NOT_USE_DEVICE_ID_LS_KEY, "0"));
            EngineUtil.localStorageSetItem(NOT_USE_DEVICE_ID_LS_KEY, flag ? "0" : "1");
            self.updateAccountInfo();
        }, this);
        UiManager.addButtonListen(this.ui.btn_clear_account, () => {
            const flag = EngineUtil.localStorageGetItem(NOT_USE_DEVICE_ID_LS_KEY, "0");
            cc.sys.localStorage.clear();
            EngineUtil.localStorageSetItem(NOT_USE_DEVICE_ID_LS_KEY, flag);
        }, this);
        UiManager.addButtonListen(this.ui.btn_language, () => {
            GmPageCtrl.clearLSLanguage();
            self.updateCurLan();
        }, this);
        UiManager.addButtonListen(this.ui.level_success, () => {
            EventMgr.trigger(GameEventType.GM_LEVEL_SUCCESS);
            self.hide();
        }, this);
        UiManager.addButtonListen(this.ui.changelevel_btn, () => {
            const level = Number(self.ui.level_changed_eb.getComponent(cc.EditBox).string);
            (isNaN(level), 1) ||
                GameServiceMgr.deprecatedGmChangeLevel(
                    level,
                    (data: { level: number; level_loop: number }) => {
                        PlayerDataSys.user_level = data.level;
                        PlayerDataSys.level_loop = data.level_loop;
                        EngineUtil.showManageViewToast("切换到关卡：" + data.level);
                        BallLogicMgr.loadTable_freeMode_useIdx(PlayerDataSys.validConfigLevelID - 1);
                    },
                    () => {
                        EngineUtil.showManageViewToast("切换关卡失败");
                    }
                );
        }, this);

        const refreshCueAttributes = () => {
            self.ui.attri_power_editbox.getComponent(cc.EditBox).string = "" + CueDataSys.getUsedCuePower();
            self.ui.attri_spin_editbox.getComponent(cc.EditBox).string = "" + CueDataSys.getUsedCueRoleAngle();
            self.ui.attri_aimming_editbox.getComponent(cc.EditBox).string = "" + CueDataSys.getUsedCueAimLineLen();
        };
        refreshCueAttributes();
        UiManager.addButtonListen(this.ui.use_attri_btn, () => {
            BallLogicMgr.useSimCueAttri = true;
            BallLogicMgr.simCuePower = Number(self.ui.attri_power_editbox.getComponent(cc.EditBox).string);
            BallLogicMgr.simCueSpin = Number(self.ui.attri_spin_editbox.getComponent(cc.EditBox).string);
            BallLogicMgr.simAimming = Number(self.ui.attri_aimming_editbox.getComponent(cc.EditBox).string);
        }, this);
        UiManager.addButtonListen(this.ui.recover_attri_btn, () => {
            BallLogicMgr.useSimCueAttri = false;
            refreshCueAttributes();
        }, this);

        const ganMoveNormalEdit = this.ui.attri_gan_move_editbox.getComponent(cc.EditBox);
        const ganMoveAimEdit = this.ui.attri_gan_move_aimming_editbox.getComponent(cc.EditBox);
        const resetGanMove = () => {
            GlobalConfig.gan_move_rad_multy_normal = GlobalConfig.gan_move_rad_multy_normal_base;
            GlobalConfig.gan_move_rad_multy_aim = GlobalConfig.gan_move_rad_multy_aim_base;
            ganMoveNormalEdit.string = "" + GlobalConfig.gan_move_rad_multy_normal_base;
            ganMoveAimEdit.string = "" + GlobalConfig.gan_move_rad_multy_aim_base;
        };
        resetGanMove();
        UiManager.addButtonListen(this.ui.use_gan_move_btn, () => {
            GlobalConfig.gan_move_rad_multy_normal = Number(ganMoveNormalEdit.string);
            GlobalConfig.gan_move_rad_multy_aim = Number(ganMoveAimEdit.string);
            EngineUtil.showManageViewToast("球杆移动参数设置成功");
        }, this);
        UiManager.addButtonListen(this.ui.recover_gan_move_btn, () => {
            resetGanMove();
            EngineUtil.showManageViewToast("球杆移动参数回复默认");
        }, this);

        const ganRollEdit = this.ui.gan_roll_editbox.getComponent(cc.EditBox);
        const ganRollAimEdit = this.ui.gan_roll_aimming_editbox.getComponent(cc.EditBox);
        const resetGanRoll = () => {
            GlobalConfig.gan_move_roll_multy = GlobalConfig.gan_move_roll_multy_base;
            GlobalConfig.gan_move_roll_multy_aim = GlobalConfig.gan_move_roll_multy_aim_base;
            ganRollEdit.string = "" + GlobalConfig.gan_move_roll_multy_base;
            ganRollAimEdit.string = "" + GlobalConfig.gan_move_roll_multy_aim_base;
        };
        resetGanRoll();
        UiManager.addButtonListen(this.ui.use_gan_roll_move_btn, () => {
            GlobalConfig.gan_move_roll_multy = Number(ganRollEdit.string);
            GlobalConfig.gan_move_roll_multy_aim = Number(ganRollAimEdit.string);
            EngineUtil.showManageViewToast("滚轮参数设置成功");
        }, this);
        UiManager.addButtonListen(this.ui.recover_gan_roll_move_btn, () => {
            resetGanRoll();
            EngineUtil.showManageViewToast("滚轮参数回复默认");
        }, this);
        UiManager.addButtonListen(this.ui.btn_set_ball_modify_angle, () => {
            const angle = Number(self.ui.set_ball_modify_angle.getComponent(cc.EditBox).string);
            if (isNaN(angle)) {
                EngineUtil.showManageViewToast("角度输入错误");
            } else {
                self._curModifyAngle = angle;
                BallLogicMgr.ballDirModifyThreshold = (angle / 180) * Math.PI;
                self.updateBallDirModify();
                EngineUtil.showManageViewToast("角度设置成功");
            }
        }, this);
        UiManager.addButtonListen(this.ui.btn_switch_ball_modify, () => {
            BallLogicMgr.isModifyBallDir = !BallLogicMgr.isModifyBallDir;
            self.updateBallDirModify();
        }, this);
    }

    updateAdBtn(): void {
        this.ui.Label_ad_switch.getComponent(cc.Label).string =
            "广告播放：" + (AdManager.getInstance().adSwitch ? "开" : "关");
        this.ui.add_ad_sim_ret.active = false;
    }

    start(): void {
        this.resetLevelNameLabel();
    }
}
