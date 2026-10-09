import AudioManager from "./AudioManager";
import BallLogicMgr from "./BallLogicMgr";
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

    ui = null;
    _animType = null;
    _touchControl = null;
    _hasPeneLock = null;
    _hasBlack = null;
    _hasTouchLock = null;
    _isSuccess = null;
    _timeoutCB = null;
    ballCount = null;

    static prefabUrl = "GameEndPage";
    static className = "GameEndPageCtrl";

    addButtonListen() {
    }

    onDisable() {
        const self = this;
        super.onDisable();
        setTimeout(function () {
            self._isSuccess = false;
            self._timeoutCB = null;
        }, 20);
    }

    _onHide() {
        super._onHide();
        if (this._timeoutCB) {
            this._timeoutCB(this._isSuccess);
        }
    }

    _init(data) {
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

    showSuccessAni() {
        this.ui.victory.active = true;
        this.ui.victory.getComponent(sp.Skeleton).setAnimation(0, "animation", false);
    }

    showFailAni() {
        this.ui.defeat.active = true;
        this.ui.defeat.getComponent(sp.Skeleton).setAnimation(0, "animation", false);
    }

    clickClose() {
        this.hide();
    }

    onTimeout() {
        const self = this;
        if (this._isSuccess) {
            GameServiceMgr.submitLevel({
                success: true,
                ball_count: this.ballCount
            }, function () {
                const done = function (action) {
                    if ("continue" === action) {
                        BallLogicMgr.isModifyBallDir = "1" == ConfigDataSys.global_ConfigMap.get("easyball_on");
                        const angle = Number(ConfigDataSys.global_ConfigMap.get("easyball_num")) || 20;
                        BallLogicMgr.ballDirModifyThreshold = angle / 180 * Math.PI;
                        console.log("isModifyBallDir", BallLogicMgr.isModifyBallDir, "ballDirModifyThreshold", angle);
                        BallLogicMgr.loadTable(PlayerDataSys.turn_pass, PlayerDataSys.table);
                    } else {
                        BallLogicMgr.gotoHall();
                    }
                };
                cc.resources.load(["Prefab/CueListItem", "Prefab/CueUnlockItem"], cc.Prefab, function (err, prefabs) {
                    if (err) {
                        console.error("failed to load cue item prefab");
                    }
                    if (CueDataSys.nextCueID != null && prefabs.length >= 2) {
                        const listNode = cc.instantiate(prefabs[0]);
                        const listItem = listNode.getComponent(NewCueListLitemCtr);
                        listItem.initData(CueDataSys.nextCueID, null);
                        const unlockNode = cc.instantiate(prefabs[1]);
                        unlockNode.getComponent(CueUnlockItem).cueID = CueDataSys.nextCueID;
                        const frameSDK = GameHelper.frameSDK;
                        if (frameSDK != null) {
                            frameSDK.openLevelAward(listNode, function (count) {
                                if (listItem != null && listItem.isValid) {
                                    listItem.unlockCount = count;
                                }
                            }, unlockNode, CueDataSys.nextCueID, done);
                        }
                    } else {
                        const frameSDK = GameHelper.frameSDK;
                        if (frameSDK != null) {
                            frameSDK.openLevelAward(undefined, undefined, undefined, undefined, done);
                        }
                    }
                    self.clickClose();
                });
            });
        } else {
            this.clickClose();
        }
    }

    start() {
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

    onUILoad() {
        this.ui = this.node.addComponent(GameEndPage);
    }
}
