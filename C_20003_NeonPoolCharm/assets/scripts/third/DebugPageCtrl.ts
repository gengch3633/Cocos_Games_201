import BallLogicMgr from "./BallLogicMgr";
import BasePageCtrl from "./BasePageCtrl";
import EngineUtil from "./EngineUtil";
import GameHelper from "./GameHelper";
import GameServiceMgr from "./GameServiceMgr";
import MainUICtrl from "./MainUICtrl";
import PlayerDataSys from "./PlayerDataSys";

const { ccclass, menu, property } = cc._decorator;

@ccclass
@menu("UI/pages/DebugPageCtrl")
export default class DebugPageCtrl extends BasePageCtrl {
    @property(cc.EditBox)
    levelAEditBox = null;

    @property(cc.EditBox)
    levelBEditBox = null;

    @property(cc.EditBox)
    totalRoundEditBox = null;

    @property(cc.EditBox)
    deprecatedLevelAEditBox = null;

    @property(cc.EditBox)
    deprecatedLevelBEditBox = null;

    @property(cc.EditBox)
    deprecatedLevelCEditBox = null;

    @property(cc.EditBox)
    deprecatedTotalTurnEditBox = null;

    @property(cc.EditBox)
    cueCountEditBox = null;

    @property(cc.Toggle)
    skipADToggle = null;

    @property(cc.EditBox)
    cashPointEditBox = null;

    @property(cc.EditBox)
    charityPointEditBox = null;

    @property(cc.EditBox)
    bankPointEditBox = null;

    @property(cc.EditBox)
    bankTimeEditBox = null;

    static prefabUrl = "DebugPage";

    static className = "DebugPageCtrl";

    onUnlockCueButtonClick() {
        const e = parseInt(this.cueCountEditBox.string);
        isNaN(e) || e <= 0 ? EngineUtil.showManageViewToast("invalid cue count") : GameServiceMgr.GmOpenCues({
            cueCount: e
        }, function () {});
    }

    onEnable() {
        super.onEnable();
        const frameData = GameHelper.frameData;
        const noVideo = null === frameData || undefined === frameData ? undefined : frameData.SDK_CONF.NO_VIDEO;
        this.skipADToggle.isChecked = null !== noVideo && undefined !== noVideo && noVideo;
    }

    _onJumpLevelSuccess() {
        const scene = cc.director.getScene();
        const sceneName = null == scene ? undefined : scene.name;
        if ("game_tabel" === sceneName) {
            BallLogicMgr.loadTable(PlayerDataSys.turn_pass, PlayerDataSys.table);
        } else if ("game_main" === sceneName) {
            const canvas = scene.getComponentInChildren(cc.Canvas);
            const mainUI = null === canvas || undefined === canvas ? undefined : canvas.getComponentInChildren(MainUICtrl);
            mainUI && mainUI.updateLevelProgress();
        }
        EngineUtil.showManageViewToast("jump to level " + PlayerDataSys.level_info.level_a + "-" + PlayerDataSys.level_info.level_b);
    }

    onChangeBankTimeButtonClick() {
        const t = parseInt(this.bankTimeEditBox.string);
        if (isNaN(t) || t < 0) {
            EngineUtil.showManageViewToast("invalid bank time");
        } else {
            const e = GameHelper.frameSDK;
            null === e || undefined === e || e.debugChangeBankTime(t);
        }
    }

    onJumpToLevelButtonClick() {
        const e = this;
        const t = parseInt(this.levelAEditBox.string);
        const o = parseInt(this.levelBEditBox.string);
        isNaN(t) || t <= 0 || isNaN(o) || o <= 0 ? EngineUtil.showManageViewToast("invalid level") : GameServiceMgr.GmChangeLevel({
            levelA: t,
            levelB: o
        }, function () {
            return e._onJumpLevelSuccess();
        });
    }

    onPassButtonClick() {
        const scene = cc.director.getScene();
        const table = null === scene || undefined === scene ? undefined : scene.getComponentInChildren("game_table");
        null === table || undefined === table || table.doGameSuccess(true);
        this.hide();
    }

    onJumpToRoundButtonClick() {
        const e = this;
        const t = parseInt(this.totalRoundEditBox.string);
        isNaN(t) || t <= 0 ? EngineUtil.showManageViewToast("invalid round") : GameServiceMgr.GmChangeRound(t, function () {
            return e._onJumpLevelSuccess();
        });
    }

    onAddCharityPointButtonClick() {
        const t = parseInt(this.charityPointEditBox.string);
        if (isNaN(t)) {
            EngineUtil.showManageViewToast("invalid charity point");
        } else {
            const e = GameHelper.frameSDK;
            null === e || undefined === e || e.debugAddCoin("greenCoin", t);
        }
    }

    onSkipADToggleEvent() {
        const e = GameHelper.frameData;
        e && (e.SDK_CONF.NO_VIDEO = this.skipADToggle.isChecked);
    }

    deprecatedOnJumpToLevelButtonClick() {
        const e = this;
        const t = parseInt(this.deprecatedLevelAEditBox.string);
        const o = parseInt(this.deprecatedLevelBEditBox.string);
        const n = parseInt(this.deprecatedLevelCEditBox.string);
        isNaN(t) || t <= 0 || isNaN(o) || o <= 0 || isNaN(n) || n <= 0 ? EngineUtil.showManageViewToast("invalid level") : GameServiceMgr.deprecatedGmChangeLevel({
            levelA: t,
            levelB: o,
            levelC: n
        }, function () {
            return e._onJumpLevelSuccess();
        });
    }

    deprecatedOnJumpToTurnButtonClick() {
        const e = this;
        const t = parseInt(this.deprecatedTotalTurnEditBox.string);
        isNaN(t) || t <= 0 ? EngineUtil.showManageViewToast("invalid turn") : GameServiceMgr.deprecatedGmChangeTurn(t, function () {
            return e._onJumpLevelSuccess();
        });
    }

    onAddCashPointButtonClick() {
        const t = parseInt(this.cashPointEditBox.string);
        if (isNaN(t)) {
            EngineUtil.showManageViewToast("invalid cash point");
        } else {
            const e = GameHelper.frameSDK;
            null === e || undefined === e || e.debugAddCoin("yellowCoin", t);
        }
    }

    onAddBankPointButtonClick() {
        const t = parseInt(this.bankPointEditBox.string);
        if (isNaN(t)) {
            EngineUtil.showManageViewToast("invalid bank point");
        } else {
            const e = GameHelper.frameSDK;
            null === e || undefined === e || e.debugAddBankCoin(t);
        }
    }
}
