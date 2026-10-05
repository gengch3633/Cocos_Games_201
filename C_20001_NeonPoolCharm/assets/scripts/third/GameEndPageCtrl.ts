import * as BallLogicMgr from "./BallLogicMgr";
import GameServiceMgr from "./GameServiceMgr";
import BasePageCtrl, { AnimType } from "./BasePageCtrl";
import GameEndPage from "./GameEndPage";
import CueDataSys from "./CueDataSys";
import CueUnlockItem from "./CueUnlockItem";
import GameHelper from "./GameHelper";
import AudioManager from "./AudioManager";
import ConfigDataSys from "./ConfigDataSys";
import PlayerDataSys from "./PlayerDataSys";
import NewCueListLitemCtr from "./NewCueListLitemCtr";

const { ccclass, menu } = cc._decorator;

@ccclass
@menu("UI/pages/GameEndPageCtrl")
export default class GameEndPageCtrl extends BasePageCtrl {
    static prefabUrl = "GameEndPage";
    static className = "GameEndPageCtrl";

    ui: GameEndPage = null;
    private _isSuccess = false;
    private _timeoutCB: (success: boolean) => void = null;
    ballCount: number = null;

    addButtonListen(): void {}

    onDisable(): void {
        super.onDisable();
        setTimeout(() => {
            this._isSuccess = false;
            this._timeoutCB = null;
        }, 20);
    }

    _onHide(): void {
        super._onHide();
        this._timeoutCB && this._timeoutCB(this._isSuccess);
    }

    _init(data: { isSuccess: boolean; timeoutCB: (success: boolean) => void; ballCount: number }): void {
        const isSuccess = data.isSuccess;
        const timeoutCB = data.timeoutCB;
        const ballCount = data.ballCount;
        AudioManager.getInstance().playMusic(isSuccess ? "pool_ui_win" : "pool_ui_fail");
        this._isSuccess = isSuccess;
        this._timeoutCB = timeoutCB;
        this.ballCount = ballCount;
        if (isSuccess) {
            this.ui.failed.active = false;
            this.ui.success.active = true;
            this.showSuccessAni();
        } else {
            this.ui.failed.active = true;
            this.ui.success.active = false;
            this.showFailAni();
        }
        this.scheduleOnce(this.onTimeout, 1.5);
    }

    showSuccessAni(): void {
        this.ui.victory.active = true;
        this.ui.victory.getComponent(sp.Skeleton).setAnimation(0, "animation", false);
    }

    showFailAni(): void {
        this.ui.defeat.active = true;
        this.ui.defeat.getComponent(sp.Skeleton).setAnimation(0, "animation", false);
    }

    clickClose(): void {
        this.hide();
    }

    onTimeout(): void {
        if (this._isSuccess) {
            GameServiceMgr.submitLevel(
                {
                    success: true,
                    ball_count: this.ballCount,
                },
                () => {
                    const continueGame = (action: string) => {
                        if (action === "continue") {
                            BallLogicMgr.isModifyBallDir = ConfigDataSys.global_ConfigMap.get("easyball_on") == "1";
                            const threshold = Number(ConfigDataSys.global_ConfigMap.get("easyball_num")) || 20;
                            BallLogicMgr.ballDirModifyThreshold = (threshold / 180) * Math.PI;
                            console.log("isModifyBallDir", BallLogicMgr.isModifyBallDir, "ballDirModifyThreshold", threshold);
                            BallLogicMgr.loadTable(PlayerDataSys.turn_pass, PlayerDataSys.table);
                        } else {
                            BallLogicMgr.gotoHall();
                        }
                    };
                    cc.resources.load(["Prefab/CueListItem", "Prefab/CueUnlockItem"], cc.Prefab, (err, prefabs: cc.Prefab[]) => {
                        err && console.error("failed to load cue item prefab");
                        if (CueDataSys.nextCueID != null && prefabs.length >= 2) {
                            const listNode = cc.instantiate(prefabs[0]);
                            const listItem = listNode.getComponent(NewCueListLitemCtr);
                            listItem.initData(CueDataSys.nextCueID, null);
                            const unlockNode = cc.instantiate(prefabs[1]);
                            unlockNode.getComponent(CueUnlockItem).cueID = CueDataSys.nextCueID;
                            GameHelper.frameSDK?.openLevelAward(
                                listNode,
                                (count: number) => {
                                    listItem?.isValid && (listItem.unlockCount = count);
                                },
                                unlockNode,
                                CueDataSys.nextCueID,
                                continueGame,
                            );
                        } else {
                            GameHelper.frameSDK?.openLevelAward(undefined, undefined, undefined, undefined, continueGame);
                        }
                        this.clickClose();
                    });
                },
            );
        } else {
            this.clickClose();
        }
    }

    start(): void {}

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
        this.ui = this.node.addComponent(GameEndPage);
    }
}
