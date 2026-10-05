import CueDataSys from "./CueDataSys";
import GameHelper from "./GameHelper";
import { PoolLogger } from "./PoolLogger";
import ConfigDataSys from "./ConfigDataSys";
import { ECueAttriType } from "./ConfigDataMgr";
import EventMgr from "./EventMgr";
import GameEventType from "./GameEventType";
import ListItem from "./ListItem";
import GameServiceMgr from "./GameServiceMgr";
import { UiManager } from "./UiManage";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewCueListLitemCtr extends ListItem {
    @property(cc.Label)
    nameLabel: cc.Label = null;

    @property(cc.Node)
    cue_spine: cc.Node = null;

    @property(cc.Node)
    cue_spine_shadow: cc.Node = null;

    @property(cc.Node)
    usingNode: cc.Node = null;

    @property(cc.Node)
    useNode: cc.Node = null;

    @property(cc.Node)
    getNode: cc.Node = null;

    @property(cc.Node)
    adNode: cc.Node = null;

    @property(cc.ProgressBar)
    lockProgressBar: cc.ProgressBar = null;

    @property(cc.Label)
    progressLabel: cc.Label = null;

    @property(cc.Node)
    powerNode: cc.Node = null;

    @property(cc.Node)
    spinNode: cc.Node = null;

    @property(cc.Node)
    aimNode: cc.Node = null;

    private _curTouchLock = false;
    cb: () => void = null;
    private _cueID: number = null;
    configData: any = null;

    onUnlockClubsChanged(): void {
        this._updateState();
    }

    initData(cueId: number, callback?: () => void): void {
        this.cb = callback;
        this._curTouchLock = false;
        this._cueID = cueId;
        this.configData = ConfigDataSys.cue_configMap.get(this._cueID);
        this.lockProgressBar.progress = 0;
        this.progressLabel.string = "(0/3)";
        if (this.configData) {
            this._updateCue();
            this._updateState();
            if (this.getNode.active) {
                PoolLogger.instance.logEvent("c_ad_event", {
                    action: "exposure",
                    type: "video",
                    placement: "unlock_cue",
                });
            }
        }
    }

    onClickUseBtn(): void {
        if (!this._curTouchLock) {
            this._curTouchLock = true;
            GameServiceMgr.changeClub(
                this._cueID,
                () => {
                    this._curTouchLock = false;
                },
                () => {
                    this._curTouchLock = false;
                }
            );
        }
    }

    onClickGetBtn(): void {
        if (!this._curTouchLock) {
            this._curTouchLock = true;
            PoolLogger.instance.logEvent("c_ad_event", {
                action: "touch",
                type: "video",
                placement: "unlock_cue",
            });
            GameHelper.instance.showVideo(
                "unlock_cue",
                false,
                (adType) => {
                    PoolLogger.instance.logGameEvent("thepool_game_ad", {
                        object_action: "show",
                        object_name: "new_cue",
                        object_notes: adType === "video" ? "video" : adType === "web" ? "web" : "inter",
                    });
                },
                (watched) => {
                    GameServiceMgr.getClub(
                        this._cueID,
                        () => {
                            this._curTouchLock = false;
                            if (GameHelper.pocketed && watched) {
                                const charityAmount = GameHelper.getClassByName("FrameData").getCharityOutNum();
                                GameHelper.frameSDK?.addCoin(0, charityAmount, 1, () => {
                                    if (this.isValid) {
                                        this.cb?.call(this);
                                    }
                                });
                            } else {
                                this.cb?.call(this);
                            }
                        },
                        () => {
                            this._curTouchLock = false;
                        }
                    );
                },
                () => {
                    this._curTouchLock = false;
                }
            );
        }
    }

    onLoad(): void {
        super.onLoad();
        UiManager.addButtonListen(this.useNode, this.onClickUseBtn, this, null, 0);
        UiManager.addButtonListen(this.getNode, this.onClickGetBtn, this, null, 0);
    }

    onUsedClubChanged(): void {
        this._updateState();
    }

    set unlockCount(count: number) {
        if (count >= 3) {
            this.lockProgressBar.progress = 1;
            this.progressLabel.string = "(3/3)";
        } else {
            count = Math.max(0, Math.floor(count));
            this.lockProgressBar.progress = 0.1 + 0.2 * count;
            this.progressLabel.string = "(" + count + "/3)";
        }
    }

    _updateState(): void {
        const powerDiff = this.configData.force - CueDataSys.getUsedCuePower();
        const spinDiff = this.configData.spin - CueDataSys.getUsedCueRoleAngle();
        const aimDiff = this.configData.aiming - CueDataSys.getUsedCueAimLineLen();
        this._updateChangeIcon(cc.find("changeNode/downSprite", this.powerNode), powerDiff < 0);
        this._updateChangeIcon(cc.find("changeNode/upSprite", this.powerNode), powerDiff > 0);
        this._updateChangeIcon(cc.find("changeNode/downSprite", this.spinNode), spinDiff < 0);
        this._updateChangeIcon(cc.find("changeNode/upSprite", this.spinNode), spinDiff > 0);
        this._updateChangeIcon(cc.find("changeNode/downSprite", this.aimNode), aimDiff < 0);
        this._updateChangeIcon(cc.find("changeNode/upSprite", this.aimNode), aimDiff > 0);
        if (CueDataSys.isCueNotOpened(this._cueID)) {
            this.usingNode.active = false;
            this.useNode.active = false;
            this.getNode.active = false;
            this.lockProgressBar.node.active = true;
        } else if (CueDataSys.isCueUnlocked(this._cueID)) {
            if (this._cueID !== CueDataSys.usedCueId) {
                this.usingNode.active = false;
                this.useNode.active = true;
                this.getNode.active = false;
                this.lockProgressBar.node.active = false;
            } else {
                this.usingNode.active = true;
                this.useNode.active = false;
                this.getNode.active = false;
                this.lockProgressBar.node.active = false;
            }
        } else {
            this.usingNode.active = false;
            this.useNode.active = false;
            this.getNode.active = true;
            this.lockProgressBar.node.active = false;
        }
    }

    getCueAttriPercenter(type: number): number {
        switch (type) {
            case ECueAttriType.E_POWER:
                return (
                    ((this.configData.force - CueDataSys.min_power) / (CueDataSys.max_power - CueDataSys.min_power)) *
                        0.6 +
                    0.4
                );
            case ECueAttriType.E_SPIN:
                return (
                    ((this.configData.spin - CueDataSys.min_spin) / (CueDataSys.max_spin - CueDataSys.min_spin)) *
                        0.8 +
                    0.2
                );
            case ECueAttriType.E_AMIING:
                return Number(this.configData.aiming) / CueDataSys.max_line_len;
        }
    }

    _updateCue(): void {
        UiManager.loadSpine(this.cue_spine, "cue_spine", CueDataSys.getCueSourceName(this._cueID), (data) => {
            this.cue_spine.getComponent(sp.Skeleton).setAnimation(0, "animation", true);
            this.cue_spine_shadow.getComponent(sp.Skeleton).skeletonData = data;
            this.cue_spine_shadow.getComponent(sp.Skeleton).setAnimation(0, "animation", true);
        });
        cc.find("progressBar", this.powerNode).getComponent(cc.ProgressBar).progress = this.getCueAttriPercenter(
            ECueAttriType.E_POWER
        );
        cc.find("progressBar", this.spinNode).getComponent(cc.ProgressBar).progress = this.getCueAttriPercenter(
            ECueAttriType.E_SPIN
        );
        cc.find("progressBar", this.aimNode).getComponent(cc.ProgressBar).progress = this.getCueAttriPercenter(
            ECueAttriType.E_AMIING
        );
        this.nameLabel.string = "" + (this.configData.name ?? "");
    }

    onEnable(): void {
        super.onEnable?.();
        this._curTouchLock = false;
        EventMgr.listen(GameEventType.ON_UNLOCKED_CLUBS_CHANGED, this.onUnlockClubsChanged, this);
        EventMgr.listen(GameEventType.ON_USED_CLUB_CHANGED, this.onUsedClubChanged, this);
    }

    onDisable(): void {
        EventMgr.ignore(GameEventType.ON_UNLOCKED_CLUBS_CHANGED, this.onUnlockClubsChanged, this);
        EventMgr.ignore(GameEventType.ON_USED_CLUB_CHANGED, this.onUsedClubChanged, this);
    }

    _updateChangeIcon(node: cc.Node, active: boolean): void {
        node.active = active;
        node.scale = 1;
        cc.Tween.stopAllByTarget(node);
        if (active) {
            cc.tween(node)
                .to(0.4, { scale: 1.2 }, { easing: "sineInOut" })
                .to(0.4, { scale: 1 }, { easing: "sineInOut" })
                .union()
                .repeatForever()
                .start();
        }
    }
}
