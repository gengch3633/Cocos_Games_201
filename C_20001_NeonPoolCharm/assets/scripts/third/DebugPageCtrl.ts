import * as BallLogicMgr from "./BallLogicMgr";
import GameHelper from "./GameHelper";
import PlayerDataSys from "./PlayerDataSys";
import EngineUtil from "./EngineUtil";
import MainUICtrl from "./MainUICtrl";
import GameServiceMgr from "./GameServiceMgr";
import BasePageCtrl from "./BasePageCtrl";

const { ccclass, menu, property } = cc._decorator;

@ccclass
@menu("UI/pages/DebugPageCtrl")
export default class DebugPageCtrl extends BasePageCtrl {
    static prefabUrl = "DebugPage";
    static className = "DebugPageCtrl";

    @property(cc.EditBox)
    levelAEditBox: cc.EditBox = null;

    @property(cc.EditBox)
    levelBEditBox: cc.EditBox = null;

    @property(cc.EditBox)
    totalRoundEditBox: cc.EditBox = null;

    @property(cc.EditBox)
    deprecatedLevelAEditBox: cc.EditBox = null;

    @property(cc.EditBox)
    deprecatedLevelBEditBox: cc.EditBox = null;

    @property(cc.EditBox)
    deprecatedLevelCEditBox: cc.EditBox = null;

    @property(cc.EditBox)
    deprecatedTotalTurnEditBox: cc.EditBox = null;

    @property(cc.EditBox)
    cueCountEditBox: cc.EditBox = null;

    @property(cc.Toggle)
    skipADToggle: cc.Toggle = null;

    @property(cc.EditBox)
    cashPointEditBox: cc.EditBox = null;

    @property(cc.EditBox)
    charityPointEditBox: cc.EditBox = null;

    @property(cc.EditBox)
    bankPointEditBox: cc.EditBox = null;

    @property(cc.EditBox)
    bankTimeEditBox: cc.EditBox = null;

    onUnlockCueButtonClick(): void {
        const count = parseInt(this.cueCountEditBox.string);
        if (isNaN(count) || count <= 0) {
            EngineUtil.showManageViewToast("invalid cue count");
        } else {
            GameServiceMgr.GmOpenCues({ cueCount: count }, () => {});
        }
    }

    onEnable(): void {
        super.onEnable();
        this.skipADToggle.isChecked = GameHelper.frameData?.SDK_CONF?.NO_VIDEO ?? false;
    }

    _onJumpLevelSuccess(): void {
        const scene = cc.director.getScene();
        const sceneName = scene?.name;
        if (sceneName === "game_tabel") {
            BallLogicMgr.loadTable(PlayerDataSys.turn_pass, PlayerDataSys.table);
        } else if (sceneName === "game_main") {
            const mainUi = scene.getComponentInChildren(cc.Canvas)?.getComponentInChildren(MainUICtrl);
            mainUi && mainUi.updateLevelProgress();
        }
        EngineUtil.showManageViewToast("jump to level " + PlayerDataSys.level_info.level_a + "-" + PlayerDataSys.level_info.level_b);
    }

    onChangeBankTimeButtonClick(): void {
        const time = parseInt(this.bankTimeEditBox.string);
        if (isNaN(time) || time < 0) {
            EngineUtil.showManageViewToast("invalid bank time");
        } else {
            GameHelper.frameSDK?.debugChangeBankTime(time);
        }
    }

    onJumpToLevelButtonClick(): void {
        const levelA = parseInt(this.levelAEditBox.string);
        const levelB = parseInt(this.levelBEditBox.string);
        if (isNaN(levelA) || levelA <= 0 || isNaN(levelB) || levelB <= 0) {
            EngineUtil.showManageViewToast("invalid level");
        } else {
            GameServiceMgr.GmChangeLevel({ levelA, levelB }, () => this._onJumpLevelSuccess());
        }
    }

    onPassButtonClick(): void {
        const gameTable = cc.director.getScene()?.getComponentInChildren("game_table" as any);
        gameTable?.doGameSuccess(true);
        this.hide();
    }

    onJumpToRoundButtonClick(): void {
        const round = parseInt(this.totalRoundEditBox.string);
        if (isNaN(round) || round <= 0) {
            EngineUtil.showManageViewToast("invalid round");
        } else {
            GameServiceMgr.GmChangeRound(round, () => this._onJumpLevelSuccess());
        }
    }

    onAddCharityPointButtonClick(): void {
        const point = parseInt(this.charityPointEditBox.string);
        if (isNaN(point)) {
            EngineUtil.showManageViewToast("invalid charity point");
        } else {
            GameHelper.frameSDK?.debugAddCoin("greenCoin", point);
        }
    }

    onSkipADToggleEvent(): void {
        const frameData = GameHelper.frameData;
        if (frameData) {
            frameData.SDK_CONF.NO_VIDEO = this.skipADToggle.isChecked;
        }
    }

    deprecatedOnJumpToLevelButtonClick(): void {
        const levelA = parseInt(this.deprecatedLevelAEditBox.string);
        const levelB = parseInt(this.deprecatedLevelBEditBox.string);
        const levelC = parseInt(this.deprecatedLevelCEditBox.string);
        if (isNaN(levelA) || levelA <= 0 || isNaN(levelB) || levelB <= 0 || isNaN(levelC) || levelC <= 0) {
            EngineUtil.showManageViewToast("invalid level");
        } else {
            GameServiceMgr.deprecatedGmChangeLevel({ levelA, levelB, levelC }, () => this._onJumpLevelSuccess());
        }
    }

    deprecatedOnJumpToTurnButtonClick(): void {
        const turn = parseInt(this.deprecatedTotalTurnEditBox.string);
        if (isNaN(turn) || turn <= 0) {
            EngineUtil.showManageViewToast("invalid turn");
        } else {
            GameServiceMgr.deprecatedGmChangeTurn(turn, () => this._onJumpLevelSuccess());
        }
    }

    onAddCashPointButtonClick(): void {
        const point = parseInt(this.cashPointEditBox.string);
        if (isNaN(point)) {
            EngineUtil.showManageViewToast("invalid cash point");
        } else {
            GameHelper.frameSDK?.debugAddCoin("yellowCoin", point);
        }
    }

    onAddBankPointButtonClick(): void {
        const point = parseInt(this.bankPointEditBox.string);
        if (isNaN(point)) {
            EngineUtil.showManageViewToast("invalid bank point");
        } else {
            GameHelper.frameSDK?.debugAddBankCoin(point);
        }
    }
}
