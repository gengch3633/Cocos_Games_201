import BallLogicMgr from "./BallLogicMgr";
import AudioManager from "./AudioManager";
import BasePageCtrl, { AnimType } from "./BasePageCtrl";
import ConfigDataSys from "./ConfigDataSys";
import CueDataSys from "./CueDataSys";
import CueUnlockItem from "./CueUnlockItem";
import GameEndPage from "./GameEndPage";
import GameHelper from "./GameHelper";
import GameServiceMgr from "./GameServiceMgr";
import NewCueListLitemCtr from "./NewCueListLitemCtr";
import PlayerDataSys from "./PlayerDataSys";

const { ccclass, menu } = cc._decorator;

@ccclass
@menu("UI/pages/GameEndPageCtrl")
export default class GameEndPageCtrl extends BasePageCtrl {
    ui: GameEndPage = null;
    _isSuccess = false;
    _timeoutCB: (success: boolean) => void = null;
    ballCount: number = null;

    static prefabUrl = "GameEndPage";
    static className = "GameEndPageCtrl";

    addButtonListen(): void {
    }

    onDisable(): void {
        super.onDisable();
        setTimeout(() => {
            this._isSuccess = false;
            this._timeoutCB = null;
        }, 20);
    }

    _onHide(): void {
        super._onHide();
        if (this._timeoutCB) {
            this._timeoutCB(this._isSuccess);
        }
    }

    _init(e: { isSuccess: boolean; timeoutCB?: (success: boolean) => void; ballCount: number }): void {
        const isSuccess = e.isSuccess;
        const timeoutCB = e.timeoutCB;
        const ballCount = e.ballCount;
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
                { success: true, ball_count: this.ballCount },
                () => {
                    const t = (e: string) => {
                        if (e === "continue") {
                            BallLogicMgr.isModifyBallDir = ConfigDataSys.global_ConfigMap.get("easyball_on") == "1";
                            const threshold = Number(ConfigDataSys.global_ConfigMap.get("easyball_num")) || 20;
                            BallLogicMgr.ballDirModifyThreshold = (threshold / 180) * Math.PI;
                            console.log(
                                "isModifyBallDir",
                                BallLogicMgr.isModifyBallDir,
                                "ballDirModifyThreshold",
                                threshold
                            );
                            BallLogicMgr.loadTable(PlayerDataSys.turn_pass, PlayerDataSys.table);
                        } else {
                            BallLogicMgr.gotoHall();
                        }
                    };
                    cc.resources.load(["Prefab/CueListItem", "Prefab/CueUnlockItem"], cc.Prefab, (err, prefabs) => {
                        if (err) {
                            console.error("failed to load cue item prefab");
                        }
                        if (CueDataSys.nextCueID != null && prefabs.length >= 2) {
                            const cueListNode = cc.instantiate(prefabs[0]);
                            const cueListCtrl = cueListNode.getComponent(NewCueListLitemCtr);
                            cueListCtrl.initData(CueDataSys.nextCueID, null);
                            const unlockNode = cc.instantiate(prefabs[1]);
                            unlockNode.getComponent(CueUnlockItem).cueID = CueDataSys.nextCueID;
                            GameHelper.frameSDK?.openLevelAward(
                                cueListNode,
                                (count: number) => {
                                    if (cueListCtrl?.isValid) {
                                        cueListCtrl.unlockCount = count;
                                    }
                                },
                                unlockNode,
                                CueDataSys.nextCueID,
                                t
                            );
                        } else {
                            GameHelper.frameSDK?.openLevelAward(void 0, void 0, void 0, void 0, t);
                        }
                        this.clickClose();
                    });
                }
            );
        } else {
            this.clickClose();
        }
    }

    start(): void {
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

    onUILoad(): void {
        this.ui = this.node.addComponent(GameEndPage);
    }
}
