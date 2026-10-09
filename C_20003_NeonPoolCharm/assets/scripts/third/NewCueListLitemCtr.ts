import { ECueAttriType } from "./ConfigDataMgr";
import ConfigDataSys from "./ConfigDataSys";
import CueDataSys from "./CueDataSys";
import EventMgr from "./EventMgr";
import GameEventType from "./GameEventType";
import GameHelper from "./GameHelper";
import GameServiceMgr from "./GameServiceMgr";
import ListItem from "./ListItem";
import { PoolLogger } from "./PoolLogger";
import { UiManager } from "./UiManage";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewCueListLitemCtr extends ListItem {
    @property(cc.Label)
    nameLabel = null;

    @property(cc.Node)
    cue_spine = null;

    @property(cc.Node)
    cue_spine_shadow = null;

    @property(cc.Node)
    usingNode = null;

    @property(cc.Node)
    useNode = null;

    @property(cc.Node)
    getNode = null;

    @property(cc.Node)
    adNode = null;

    @property(cc.ProgressBar)
    lockProgressBar = null;

    @property(cc.Label)
    progressLabel = null;

    @property(cc.Node)
    powerNode = null;

    @property(cc.Node)
    spinNode = null;

    @property(cc.Node)
    aimNode = null;

    _curTouchLock = null;
    cb = null;
    _cueID = null;
    configData = null;

    onUnlockClubsChanged() {
        this._updateState();
    }

    initData(e, t) {
        this.cb = t;
        this._curTouchLock = false;
        this._cueID = e;
        this.configData = ConfigDataSys.cue_configMap.get(this._cueID);
        this.lockProgressBar.progress = 0;
        this.progressLabel.string = "(0/3)";
        if (this.configData) {
            this._updateCue();
            this._updateState();
            this.getNode.active && PoolLogger.instance.logEvent("c_ad_event", {
                action: "exposure",
                type: "video",
                placement: "unlock_cue"
            });
        }
    }

    onClickUseBtn() {
        const e = this;
        if (!this._curTouchLock) {
            this._curTouchLock = true;
            GameServiceMgr.changeClub(this._cueID, function () {
                e._curTouchLock = false;
            }, function () {
                e._curTouchLock = false;
            });
        }
    }

    onClickGetBtn() {
        const e = this;
        if (!this._curTouchLock) {
            this._curTouchLock = true;
            PoolLogger.instance.logEvent("c_ad_event", {
                action: "touch",
                type: "video",
                placement: "unlock_cue"
            });
            GameHelper.instance.showVideo("unlock_cue", false, function (e) {
                PoolLogger.instance.logGameEvent("thepool_game_ad", {
                    object_action: "show",
                    object_name: "new_cue",
                    object_notes: "video" === e ? "video" : "web" === e ? "web" : "inter"
                });
            }, function (t) {
                GameServiceMgr.getClub(e._cueID, function () {
                    e._curTouchLock = false;
                    if (GameHelper.pocketed && t) {
                        const i = GameHelper.getClassByName("FrameData").getCharityOutNum();
                        const o = GameHelper.frameSDK;
                        if (o != null) o.addCoin(0, i, 1, function () {
                            if (e.isValid && e.cb != null) e.cb.call(e);
                        });
                    } else if (e.cb != null) e.cb.call(e);
                }, function () {
                    e._curTouchLock = false;
                });
            }, function () {
                return e._curTouchLock = false;
            });
        }
    }

    onLoad() {
        super.onLoad();
        UiManager.addButtonListen(this.useNode, this.onClickUseBtn, this, null, 0);
        UiManager.addButtonListen(this.getNode, this.onClickGetBtn, this, null, 0);
    }

    onUsedClubChanged() {
        this._updateState();
    }

    set unlockCount(e) {
        if (e >= 3) {
            this.lockProgressBar.progress = 1;
            this.progressLabel.string = "(3/3)";
        } else {
            e = Math.max(0, Math.floor(e));
            this.lockProgressBar.progress = .1 + .2 * e;
            this.progressLabel.string = "(" + e + "/3)";
        }
    }

    _updateState() {
        const e = this.configData.force - CueDataSys.getUsedCuePower();
        const t = this.configData.spin - CueDataSys.getUsedCueRoleAngle();
        const o = this.configData.aiming - CueDataSys.getUsedCueAimLineLen();
        this._updateChangeIcon(cc.find("changeNode/downSprite", this.powerNode), e < 0);
        this._updateChangeIcon(cc.find("changeNode/upSprite", this.powerNode), e > 0);
        this._updateChangeIcon(cc.find("changeNode/downSprite", this.spinNode), t < 0);
        this._updateChangeIcon(cc.find("changeNode/upSprite", this.spinNode), t > 0);
        this._updateChangeIcon(cc.find("changeNode/downSprite", this.aimNode), o < 0);
        this._updateChangeIcon(cc.find("changeNode/upSprite", this.aimNode), o > 0);
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

    getCueAttriPercenter(e) {
        switch (e) {
            case ECueAttriType.E_POWER:
                return (this.configData.force - CueDataSys.min_power) / (CueDataSys.max_power - CueDataSys.min_power) * .6 + .4;
            case ECueAttriType.E_SPIN:
                return (this.configData.spin - CueDataSys.min_spin) / (CueDataSys.max_spin - CueDataSys.min_spin) * .8 + .2;
            case ECueAttriType.E_AMIING:
                return Number(this.configData.aiming) / CueDataSys.max_line_len;
        }
    }

    _updateCue() {
        const t = this;
        UiManager.loadSpine(this.cue_spine, "cue_spine", CueDataSys.getCueSourceName(this._cueID), function (e) {
            t.cue_spine.getComponent(sp.Skeleton).setAnimation(0, "animation", true);
            t.cue_spine_shadow.getComponent(sp.Skeleton).skeletonData = e;
            t.cue_spine_shadow.getComponent(sp.Skeleton).setAnimation(0, "animation", true);
        });
        cc.find("progressBar", this.powerNode).getComponent(cc.ProgressBar).progress = this.getCueAttriPercenter(ECueAttriType.E_POWER);
        cc.find("progressBar", this.spinNode).getComponent(cc.ProgressBar).progress = this.getCueAttriPercenter(ECueAttriType.E_SPIN);
        cc.find("progressBar", this.aimNode).getComponent(cc.ProgressBar).progress = this.getCueAttriPercenter(ECueAttriType.E_AMIING);
        const name = this.configData.name;
        this.nameLabel.string = "" + (name != null ? name : "");
    }

    onEnable() {
        if (super.onEnable != null) super.onEnable();
        this._curTouchLock = false;
        EventMgr.listen(GameEventType.ON_UNLOCKED_CLUBS_CHANGED, this.onUnlockClubsChanged, this);
        EventMgr.listen(GameEventType.ON_USED_CLUB_CHANGED, this.onUsedClubChanged, this);
    }

    onDisable() {
        EventMgr.ignore(GameEventType.ON_UNLOCKED_CLUBS_CHANGED, this.onUnlockClubsChanged, this);
        EventMgr.ignore(GameEventType.ON_USED_CLUB_CHANGED, this.onUsedClubChanged, this);
    }

    _updateChangeIcon(e, t) {
        e.active = t;
        e.scale = 1;
        cc.Tween.stopAllByTarget(e);
        t && cc.tween(e).to(.4, {
            scale: 1.2
        }, {
            easing: "sineInOut"
        }).to(.4, {
            scale: 1
        }, {
            easing: "sineInOut"
        }).union().repeatForever().start();
    }
}
