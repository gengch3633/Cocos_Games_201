import BallLogicMgr from "./BallLogicMgr";
import GuideEvent from "./GuideEvent";
import GuideManager from "./GuideManager";
import LevelTableConfigManager from "./LevelTableConfigManager";
import { UiManager } from "./UiManage";
import PageMgr from "./PageMgr";
import MainUI from "./MainUI";
import CueDataSys from "./CueDataSys";
import PropDataSys from "./PropDataSys";
import { GameConfigurations } from "./GameConfigurations";
import GameHelper from "./GameHelper";
import { PoolLogger } from "./PoolLogger";
import AudioManager, { DEFAULT_BGM_NAME } from "./AudioManager";
import EventMgr from "./EventMgr";
import GameEventType from "./GameEventType";
import SdkHelper from "./SdkHelper";
import CocosHelper from "./CocosHelper";
import ConfigDataSys from "./ConfigDataSys";
import PlayerDataSys from "./PlayerDataSys";
import { RewardType } from "./RequestData";
import { PoolNative } from "./PoolNative";
import { PoolWrapper } from "./PoolWrapper";

const { ccclass, menu, property } = cc._decorator;

@ccclass
@menu("UI/pages/MainUICtrl")
export default class MainUICtrl extends cc.Component {
    @property(cc.Node)
    mainui_touch_block: cc.Node = null;

    @property(cc.Prefab)
    cueItemPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    cueUnlockItemPrefab: cc.Prefab = null;

    ui: MainUI = null;
    _touchBlockHandlers = new Set<string>();

    static isFristOpen = true;
    static prefabUrl = "MainUI";
    static className = "MainUICtrl";

    onEnable(): void {
        EventMgr.listen(GameEventType.UPDATE_QIANDAO, this.updateRedPoint, this);
        EventMgr.listen(GameEventType.ON_GETTED_CLUBS_CHANGED, this.updateCueRedPoint, this);
        EventMgr.listen(GameEventType.ON_UNLOCKED_CLUBS_GOLD, this.updateCueRedPoint, this);
        if (PlayerDataSys.turn_pass > 0) {
            PoolLogger.instance.logGameEvent("thepool_game_new", { object_action: "show", object_name: "new_17" }, true);
        }
    }

    onSettingBtnCliked(): void {
        PageMgr.showPage("SetPageInGame");
    }

    onUILoad(): void {
        this.ui = this.node.addComponent(MainUI);
        if (cc.winSize.width / cc.winSize.height < 0.56) {
            const widget = this.ui.top_area.getComponent(cc.Widget);
            widget.top = widget.top + 65;
        }
        const redPointY = this.ui.star_redpoint.y;
        this.ui.star_redpoint.angle = -20;
        cc.tween(this.ui.star_redpoint)
            .to(0.25, { y: { value: redPointY + 5, easing: "sineInOut" }, angle: 0 })
            .to(0.25, { y: { value: redPointY, easing: "sineInOut" }, angle: 20 })
            .to(0.25, { y: { value: redPointY + 5, easing: "sineInOut" }, angle: 0 })
            .to(0.25, { y: { value: redPointY, easing: "sineInOut" }, angle: -20 })
            .union()
            .repeatForever()
            .start();
        cc.Tween.stopAllByTarget(this.ui.guideTips);
        cc.Tween.stopAllByTarget(this.ui.bg_qipao_ptb2);
        this.ui.guideTips.active = false;
        if (PlayerDataSys.level_pass <= 0 && GuideManager.Instance.id < 1000) {
            this.ui.bg_qipao_ptb2.active = false;
            this.ui.light.active = false;
        } else {
            this.ui.bg_qipao_ptb2.active = true;
            this.ui.light.active = true;
            cc.tween(this.ui.bg_qipao_ptb2)
                .by(1, { y: 5 }, { easing: "sineInOut" })
                .by(1.5, { y: -5 }, { easing: "sineInOut" })
                .union()
                .repeatForever()
                .start();
        }
        if (!AudioManager.getInstance().isMusicPlaying()) {
            AudioManager.getInstance().playMusic(DEFAULT_BGM_NAME, true, true);
        }
        this.ui.idLabel.getComponent(cc.Label).string = PoolWrapper.instance.hardCode
            ? "ID: " + PoolWrapper.instance.hardCode
            : "";
        this.ui.versionLabel.getComponent(cc.Label).string = "v" + PoolNative.getVersion();
    }

    addButtonListen(): void {
        UiManager.addButtonListen(this.ui.btn_paly, this.onPlayBtnCliked, this);
        UiManager.addButtonListen(this.ui.btn_setting, this.onSettingBtnCliked, this);
        UiManager.addButtonListen(this.ui.btn_star, this.onStarBtnClicked, this);
    }

    showLight(): void {
        AudioManager.getInstance().playMusic("pool_map");
        this.updateLevelProgress();
    }

    onClickPropLine(): void {
        if (PropDataSys.isLinePropUseable) {
            PageMgr.showPage("UsePropPage");
        }
    }

    onPlayBtnCliked(): void {
        BallLogicMgr.isModifyBallDir = ConfigDataSys.global_ConfigMap.get("easyball_on") == "1";
        const angle = Number(ConfigDataSys.global_ConfigMap.get("easyball_num")) || 20;
        BallLogicMgr.ballDirModifyThreshold = (angle / 180) * Math.PI;
        console.log("isModifyBallDir", BallLogicMgr.isModifyBallDir, "ballDirModifyThreshold", angle);
        BallLogicMgr.loadTable(PlayerDataSys.turn_pass, PlayerDataSys.table);
    }

    _onGuideToPlay(): void {
        PoolLogger.instance.logGameEvent("thepool_game_new", { object_action: "show", object_name: "new_10" }, true);
        this.ui.guideTips.active = true;
        this.ui.guideTips.scale = 0.2;
        cc.tween(this.ui.guideTips).to(0.4, { scale: 1 }, { easing: "backOut" }).start();
    }

    async checkPop(): Promise<void> {
        this.showTouchBlock("checkPop");
        this.showLight();
        await new Promise<void>((resolve) => {
            GameHelper.frameSDK.checkPopUp(cc.director.getScene().name, PlayerDataSys.show_level_reward, resolve);
            PlayerDataSys.show_level_reward = false;
        });
        await CocosHelper.sleepSync(0.3);
        this.hideTouchBlock("checkPop");
    }

    hideTouchBlock(key: string): void {
        if (this._touchBlockHandlers.has(key)) {
            this._touchBlockHandlers.delete(key);
        }
        this.mainui_touch_block.active = this._touchBlockHandlers.size > 0;
    }

    updateCueRedPoint(): void {
        let hasRedPoint = false;
        ConfigDataSys.cue_configMap.forEach((config) => {
            if (!hasRedPoint && !CueDataSys.isCueUnlocked(config.id) && !CueDataSys.isCueNotOpened(config.id)) {
                hasRedPoint = true;
            }
        });
        this.ui.cue_label.getComponent(cc.Label).string =
            CueDataSys.unlockedCueCount + "/" + ConfigDataSys.cue_configMap.size;
        this.ui.star_redpoint.opacity = CueDataSys.unlockedCueCount < CueDataSys.openedCueCount ? 255 : 0;
    }

    onLoad(): void {
        this.onUILoad();
        this.addButtonListen();
        cc.game.on(GuideEvent.GuideToPlay, this._onGuideToPlay, this);
        cc.director.on(PoolWrapper.EventName.HARD_CODE_CHANGED, this._onInviteCodeChange, this);
    }

    start(): void {
        this.initData();
        const effectTargets = new Map();
        effectTargets.set(RewardType.CueSuiPian, this.ui.btn_star);
        EventMgr.trigger(GameEventType.PUSH_EFFECT_TARGETS, effectTargets);
        const vibration = Number(ConfigDataSys.global_ConfigMap.get("vibration"));
        SdkHelper.vibratorDuration = vibration;
    }

    onStarBtnClicked(): void {
        PageMgr.showPage("CuePage");
    }

    updateLevelProgress(): void {
        this.ui.btn_play_label.getComponent(cc.Label).string = "LV. " + PlayerDataSys.level_info.level_a;
        this.ui.roundRichText.getComponent(cc.RichText).string =
            "pkey_001??&value1==<color=#A8EEFF>" +
            PlayerDataSys.level_info.level_b +
            "</c>&value2==" +
            PlayerDataSys.level_info.roundCount;
        this.ui.turnProgressBar.getComponent(cc.ProgressBar).progress =
            PlayerDataSys.level_info.turnCount <= 0
                ? 1
                : PlayerDataSys.level_info.level_c / PlayerDataSys.level_info.turnCount;
        this.ui.progressLabel.getComponent(cc.Label).string =
            PlayerDataSys.level_info.level_c + "/" + PlayerDataSys.level_info.turnCount;
        this.ui.roundRichText.active = PlayerDataSys.level_info.roundCount > 1;
        this.ui.turnProgressBar.parent.active = PlayerDataSys.level_info.turnCount > 1;
        const redeemReq = GameHelper.frameSDK?.getFirstRedeemRequirement();
        const remaining = Math.max(0, (redeemReq?.rdm_1 ?? 0) - PlayerDataSys.level_info.level_a + 1);
        this.ui.withdrawRichText.getComponent(cc.RichText).string =
            "pkey_002??&value1==<color=#8F35FF>" + remaining + "</c>";
        this.ui.bg_qipao_ptb2.scale = remaining > 0 ? 1 : 0;
    }

    updateRedPoint(): void {
        const dayIndex = (PlayerDataSys.sign_in_count % 10) + 1;
        const signConfig = ConfigDataSys.sign_in_configMap.get(dayIndex);
        const requiredLevel = signConfig.day_lv
            ? signConfig.day_lv
            : Number(ConfigDataSys.global_ConfigMap.get("check_lv_num"));
        if (PlayerDataSys.sign_level_count >= requiredLevel && PlayerDataSys.sign_today) {
            // red point logic placeholder
        }
    }

    onDisable(): void {
        EventMgr.ignore(GameEventType.UPDATE_QIANDAO, this.updateRedPoint, this);
        EventMgr.ignore(GameEventType.ON_GETTED_CLUBS_CHANGED, this.updateCueRedPoint, this);
        EventMgr.ignore(GameEventType.ON_UNLOCKED_CLUBS_GOLD, this.updateCueRedPoint, this);
    }

    _onInviteCodeChange(): void {
        this.ui.idLabel.getComponent(cc.Label).string = PoolWrapper.instance.hardCode
            ? "ID: " + PoolWrapper.instance.hardCode
            : "";
    }

    showTouchBlock(key: string): void {
        this._touchBlockHandlers.add(key);
        this.mainui_touch_block.active = true;
    }

    initData(): void {
        this.showTouchBlock("initData");
        const sceneIndex = PlayerDataSys.show_scene ? PlayerDataSys.curSceneID - 1 : PlayerDataSys.curSceneID;
        this.updateSceneInfo(sceneIndex);
        this.updateLevelProgress();
        this.checkPop();
        this.updateRedPoint();
        this.updateCueRedPoint();
        this.hideTouchBlock("initData");
    }

    updateSceneInfo(_sceneIndex?: number): void {
        const holeSprite = this.ui.holeSprite.getComponent(cc.Sprite);
        const tableSprite = this.ui.tableSprite.getComponent(cc.Sprite);
        holeSprite.spriteFrame = null;
        tableSprite.spriteFrame = null;
        LevelTableConfigManager.getLevelTableConfigByFileName(PlayerDataSys.table).then((config) => {
            const tableKey = config?.table_key ?? "";
            if (tableKey) {
                const thumbnail = GameConfigurations.customConfig.tableThumbnailRecord[tableKey];
                if (thumbnail) {
                    cc.resources.load("" + thumbnail.holeImage, cc.SpriteFrame, (err, frame) => {
                        if (err || !frame) {
                            console.error("failed to load hole sprite: " + thumbnail.holeImage);
                        } else {
                            holeSprite.spriteFrame = frame;
                            holeSprite.node.angle = thumbnail.holeAngle;
                            holeSprite.node.x = tableSprite.node.x + (thumbnail.holeOffsetX ?? 0);
                            holeSprite.node.y = tableSprite.node.y + (thumbnail.holeOffsetY ?? 0);
                            holeSprite.node.scale = tableSprite.node.scale * (thumbnail.holeScale ?? 1);
                        }
                    });
                    cc.resources.load("Image/" + thumbnail.image, cc.SpriteFrame, (err, frame) => {
                        if (err || !frame) {
                            console.error("failed to load table sprite: " + thumbnail.image);
                        } else {
                            tableSprite.spriteFrame = frame;
                            tableSprite.node.angle = thumbnail.angle;
                        }
                    });
                } else {
                    console.error("failed to find table thumbnail info: " + tableKey);
                }
            } else {
                console.error("failed to find table id: " + PlayerDataSys.table);
            }
        });
    }
}
