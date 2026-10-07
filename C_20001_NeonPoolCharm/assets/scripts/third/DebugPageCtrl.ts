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

    static prefabUrl = "DebugPage";
    static className = "DebugPageCtrl";

    onUnlockCueButtonClick(): void {
        const cueCount = parseInt(this.cueCountEditBox.string);
        if (isNaN(cueCount) || cueCount <= 0) {
            EngineUtil.showManageViewToast("invalid cue count");
        } else {
            GameServiceMgr.GmOpenCues({ cueCount }, () => {});
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
            const mainUI = scene.getComponentInChildren(cc.Canvas)?.getComponentInChildren(MainUICtrl);
            if (mainUI) {
                mainUI.updateLevelProgress();
            }
        }
        EngineUtil.showManageViewToast(
            "jump to level " + PlayerDataSys.level_info.level_a + "-" + PlayerDataSys.level_info.level_b
        );
    }

    onChangeBankTimeButtonClick(): void {
        const bankTime = parseInt(this.bankTimeEditBox.string);
        if (isNaN(bankTime) || bankTime < 0) {
            EngineUtil.showManageViewToast("invalid bank time");
        } else {
            GameHelper.frameSDK?.debugChangeBankTime(bankTime);
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
        cc.director.getScene()?.getComponentInChildren("game_table")?.doGameSuccess(true);
        this.hide();
    }

    onJumpToRoundButtonClick(): void {
        const totalRound = parseInt(this.totalRoundEditBox.string);
        if (isNaN(totalRound) || totalRound <= 0) {
            EngineUtil.showManageViewToast("invalid round");
        } else {
            GameServiceMgr.GmChangeRound(totalRound, () => this._onJumpLevelSuccess());
        }
    }

    onAddCharityPointButtonClick(): void {
        const charityPoint = parseInt(this.charityPointEditBox.string);
        if (isNaN(charityPoint)) {
            EngineUtil.showManageViewToast("invalid charity point");
        } else {
            GameHelper.frameSDK?.debugAddCoin("greenCoin", charityPoint);
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
        const totalTurn = parseInt(this.deprecatedTotalTurnEditBox.string);
        if (isNaN(totalTurn) || totalTurn <= 0) {
            EngineUtil.showManageViewToast("invalid turn");
        } else {
            GameServiceMgr.deprecatedGmChangeTurn(totalTurn, () => this._onJumpLevelSuccess());
        }
    }

    onAddCashPointButtonClick(): void {
        const cashPoint = parseInt(this.cashPointEditBox.string);
        if (isNaN(cashPoint)) {
            EngineUtil.showManageViewToast("invalid cash point");
        } else {
            GameHelper.frameSDK?.debugAddCoin("yellowCoin", cashPoint);
        }
    }

    onAddBankPointButtonClick(): void {
        const bankPoint = parseInt(this.bankPointEditBox.string);
        if (isNaN(bankPoint)) {
            EngineUtil.showManageViewToast("invalid bank point");
        } else {
            GameHelper.frameSDK?.debugAddBankCoin(bankPoint);
        }
    }
}
