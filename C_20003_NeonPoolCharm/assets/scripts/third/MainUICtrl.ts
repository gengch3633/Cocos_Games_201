import AudioManager, { DEFAULT_BGM_NAME } from "./AudioManager";
import BallLogicMgr from "./BallLogicMgr";
import CocosHelper from "./CocosHelper";
import ConfigDataSys from "./ConfigDataSys";
import CueDataSys from "./CueDataSys";
import EventMgr from "./EventMgr";
import { GameConfigurations } from "./GameConfigurations";
import GameEventType from "./GameEventType";
import GameHelper from "./GameHelper";
import GuideEvent from "./GuideEvent";
import GuideManager from "./GuideManager";
import LevelTableConfigManager from "./LevelTableConfigManager";
import MainUI from "./MainUI";
import PageMgr from "./PageMgr";
import PlayerDataSys from "./PlayerDataSys";
import { PoolLogger } from "./PoolLogger";
import { PoolNative } from "./PoolNative";
import { PoolWrapper } from "./PoolWrapper";
import PropDataSys from "./PropDataSys";
import { RewardType } from "./RequestData";
import SdkHelper from "./SdkHelper";
import { UiManager } from "./UiManage";

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("UI/pages/MainUICtrl")
export default class MainUICtrl extends cc.Component {
    @property(cc.Node)
    mainui_touch_block: cc.Node = null;

    @property(cc.Prefab)
    cueItemPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    cueUnlockItemPrefab: cc.Prefab = null;

    ui = null;
    _touchBlockHandlers = new Set();

    static isFristOpen = true;
    static prefabUrl = "MainUI";
    static className = "MainUICtrl";

    onEnable() {
        EventMgr.listen(GameEventType.UPDATE_QIANDAO, this.updateRedPoint, this);
        EventMgr.listen(GameEventType.ON_GETTED_CLUBS_CHANGED, this.updateCueRedPoint, this);
        EventMgr.listen(GameEventType.ON_UNLOCKED_CLUBS_GOLD, this.updateCueRedPoint, this);
        PlayerDataSys.turn_pass > 0 && PoolLogger.instance.logGameEvent("thepool_game_new", {
            object_action: "show",
            object_name: "new_17"
        }, true);
    }

    onSettingBtnCliked() {
        PageMgr.showPage("SetPageInGame");
    }

    onUILoad() {
        this.ui = this.node.addComponent(MainUI);
        if (cc.winSize.width / cc.winSize.height < .56) {
            const e = this.ui.top_area.getComponent(cc.Widget);
            e.top = e.top + 65;
        }
        const t = this.ui.star_redpoint.y;
        this.ui.star_redpoint.angle = -20;
        cc.tween(this.ui.star_redpoint).to(.25, {
            y: {
                value: t + 5,
                easing: "sineInOut"
            },
            angle: 0
        }).to(.25, {
            y: {
                value: t,
                easing: "sineInOut"
            },
            angle: 20
        }).to(.25, {
            y: {
                value: t + 5,
                easing: "sineInOut"
            },
            angle: 0
        }).to(.25, {
            y: {
                value: t,
                easing: "sineInOut"
            },
            angle: -20
        }).union().repeatForever().start();
        cc.Tween.stopAllByTarget(this.ui.guideTips);
        cc.Tween.stopAllByTarget(this.ui.bg_qipao_ptb2);
        this.ui.guideTips.active = false;
        if (PlayerDataSys.level_pass <= 0 && GuideManager.Instance.id < 1e3) {
            this.ui.bg_qipao_ptb2.active = false;
            this.ui.light.active = false;
        } else {
            this.ui.bg_qipao_ptb2.active = true;
            this.ui.light.active = true;
            cc.tween(this.ui.bg_qipao_ptb2).by(1, {
                y: 5
            }, {
                easing: "sineInOut"
            }).by(1.5, {
                y: -5
            }, {
                easing: "sineInOut"
            }).union().repeatForever().start();
        }
        AudioManager.getInstance().isMusicPlaying() || AudioManager.getInstance().playMusic(DEFAULT_BGM_NAME, true, true);
        this.ui.idLabel.getComponent(cc.Label).string = PoolWrapper.instance.hardCode ? "ID: " + PoolWrapper.instance.hardCode : "";
        this.ui.versionLabel.getComponent(cc.Label).string = "v" + PoolNative.getVersion();
    }

    addButtonListen() {
        UiManager.addButtonListen(this.ui.btn_paly, this.onPlayBtnCliked, this);
        UiManager.addButtonListen(this.ui.btn_setting, this.onSettingBtnCliked, this);
        UiManager.addButtonListen(this.ui.btn_star, this.onStarBtnClicked, this);
    }

    showLight() {
        AudioManager.getInstance().playMusic("pool_map");
        this.updateLevelProgress();
    }

    onClickPropLine() {
        PropDataSys.isLinePropUseable && PageMgr.showPage("UsePropPage");
    }

    onPlayBtnCliked() {
        BallLogicMgr.isModifyBallDir = "1" == ConfigDataSys.global_ConfigMap.get("easyball_on");
        const e = Number(ConfigDataSys.global_ConfigMap.get("easyball_num")) || 20;
        BallLogicMgr.ballDirModifyThreshold = e / 180 * Math.PI;
        console.log("isModifyBallDir", BallLogicMgr.isModifyBallDir, "ballDirModifyThreshold", e);
        BallLogicMgr.loadTable(PlayerDataSys.turn_pass, PlayerDataSys.table);
    }

    _onGuideToPlay() {
        PoolLogger.instance.logGameEvent("thepool_game_new", {
            object_action: "show",
            object_name: "new_10"
        }, true);
        this.ui.guideTips.active = true;
        this.ui.guideTips.scale = .2;
        cc.tween(this.ui.guideTips).to(.4, {
            scale: 1
        }, {
            easing: "backOut"
        }).start();
    }

    public async checkPop(): Promise<void> {
        this.showTouchBlock("checkPop");
        this.showLight();
        await new Promise(function (e) {
            GameHelper.frameSDK.checkPopUp(cc.director.getScene().name, PlayerDataSys.show_level_reward, e);
            PlayerDataSys.show_level_reward = false;
        });
        await CocosHelper.sleepSync(.3);
        this.hideTouchBlock("checkPop");
    }

    hideTouchBlock(e) {
        this._touchBlockHandlers.has(e) && this._touchBlockHandlers.delete(e);
        this.mainui_touch_block.active = this._touchBlockHandlers.size > 0;
    }

    updateCueRedPoint() {
        let e = false;
        ConfigDataSys.cue_configMap.forEach(function (t) {
            e || CueDataSys.isCueUnlocked(t.id) || CueDataSys.isCueNotOpened(t.id) || (e = true);
        });
        this.ui.cue_label.getComponent(cc.Label).string = CueDataSys.unlockedCueCount + "/" + ConfigDataSys.cue_configMap.size;
        this.ui.star_redpoint.opacity = CueDataSys.unlockedCueCount < CueDataSys.openedCueCount ? 255 : 0;
    }

    onLoad() {
        this.onUILoad();
        this.addButtonListen();
        cc.game.on(GuideEvent.GuideToPlay, this._onGuideToPlay, this);
        cc.director.on(PoolWrapper.EventName.HARD_CODE_CHANGED, this._onInviteCodeChange, this);
    }

    start() {
        this.initData();
        const e = new Map();
        e.set(RewardType.CueSuiPian, this.ui.btn_star);
        EventMgr.trigger(GameEventType.PUSH_EFFECT_TARGETS, e);
        const t = Number(ConfigDataSys.global_ConfigMap.get("vibration"));
        SdkHelper.vibratorDuration = t;
    }

    onStarBtnClicked() {
        PageMgr.showPage("CuePage");
    }

    updateLevelProgress() {
        this.ui.btn_play_label.getComponent(cc.Label).string = "LV. " + PlayerDataSys.level_info.level_a;
        this.ui.roundRichText.getComponent(cc.RichText).string = "pkey_001??&value1==<color= #A8EEFF>" + PlayerDataSys.level_info.level_b + "</c>&value2==" + PlayerDataSys.level_info.roundCount;
        this.ui.turnProgressBar.getComponent(cc.ProgressBar).progress = PlayerDataSys.level_info.turnCount <= 0 ? 1 : PlayerDataSys.level_info.level_c / PlayerDataSys.level_info.turnCount;
        this.ui.progressLabel.getComponent(cc.Label).string = PlayerDataSys.level_info.level_c + "/" + PlayerDataSys.level_info.turnCount;
        this.ui.roundRichText.active = PlayerDataSys.level_info.roundCount > 1;
        this.ui.turnProgressBar.parent.active = PlayerDataSys.level_info.turnCount > 1;
        const frameSDK = GameHelper.frameSDK;
        const o = (frameSDK === null || frameSDK === undefined) ? undefined : frameSDK.getFirstRedeemRequirement();
        const rdm1 = (o === null || o === undefined) ? undefined : o.rdm_1;
        const n = Math.max(0, ((rdm1 !== null && rdm1 !== undefined) ? rdm1 : 0) - PlayerDataSys.level_info.level_a + 1);
        this.ui.withdrawRichText.getComponent(cc.RichText).string = "pkey_002??&value1==<color= #8F35FF>" + n + "</c>";
        this.ui.bg_qipao_ptb2.scale = n > 0 ? 1 : 0;
    }

    updateRedPoint() {
        const e = PlayerDataSys.sign_in_count % 10 + 1;
        const t = ConfigDataSys.sign_in_configMap.get(e);
        const o = t.day_lv ? t.day_lv : Number(ConfigDataSys.global_ConfigMap.get("check_lv_num"));
        PlayerDataSys.sign_level_count >= o && PlayerDataSys.sign_today;
    }

    onDisable() {
        EventMgr.ignore(GameEventType.UPDATE_QIANDAO, this.updateRedPoint, this);
        EventMgr.ignore(GameEventType.ON_GETTED_CLUBS_CHANGED, this.updateCueRedPoint, this);
        EventMgr.ignore(GameEventType.ON_UNLOCKED_CLUBS_GOLD, this.updateCueRedPoint, this);
    }

    _onInviteCodeChange() {
        this.ui.idLabel.getComponent(cc.Label).string = PoolWrapper.instance.hardCode ? "ID: " + PoolWrapper.instance.hardCode : "";
    }

    showTouchBlock(e) {
        this._touchBlockHandlers.add(e);
        this.mainui_touch_block.active = true;
    }

    initData() {
        this.showTouchBlock("initData");
        BallLogicMgr.isWin, PlayerDataSys.user_level;
        const e = PlayerDataSys.show_scene ? PlayerDataSys.curSceneID - 1 : PlayerDataSys.curSceneID;
        this.updateSceneInfo(e);
        this.updateLevelProgress();
        this.checkPop();
        this.updateRedPoint();
        this.updateCueRedPoint();
        this.hideTouchBlock("initData");
    }

    updateSceneInfo() {
        const e = this.ui.holeSprite.getComponent(cc.Sprite);
        const t = this.ui.tableSprite.getComponent(cc.Sprite);
        e.spriteFrame = null;
        t.spriteFrame = null;
        LevelTableConfigManager.getLevelTableConfigByFileName(PlayerDataSys.table).then(function (o) {
            const tableKey = (o === null || o === undefined) ? undefined : o.table_key;
            const i = (tableKey !== null && tableKey !== undefined) ? tableKey : "";
            if (i) {
                const a = GameConfigurations.customConfig.tableThumbnailRecord[i];
                if (a) {
                    cc.resources.load("" + a.holeImage, cc.SpriteFrame, function (o, n) {
                        if (o || !n) console.error("failed to load hole sprite: " + a.holeImage); else {
                            e.spriteFrame = n;
                            e.node.angle = a.holeAngle;
                            const holeOffsetX = a.holeOffsetX;
                            e.node.x = t.node.x + ((holeOffsetX !== null && holeOffsetX !== undefined) ? holeOffsetX : 0);
                            const holeOffsetY = a.holeOffsetY;
                            e.node.y = t.node.y + ((holeOffsetY !== null && holeOffsetY !== undefined) ? holeOffsetY : 0);
                            const holeScale = a.holeScale;
                            e.node.scale = t.node.scale * ((holeScale !== null && holeScale !== undefined) ? holeScale : 1);
                        }
                    });
                    cc.resources.load("Image/" + a.image, cc.SpriteFrame, function (e, o) {
                        if (e || !o) console.error("failed to load table sprite: " + a.image); else {
                            t.spriteFrame = o;
                            t.node.angle = a.angle;
                        }
                    });
                } else console.error("failed to find table thumbnail info: " + i);
            } else console.error("failed to find table id: " + PlayerDataSys.table);
        });
    }
}
