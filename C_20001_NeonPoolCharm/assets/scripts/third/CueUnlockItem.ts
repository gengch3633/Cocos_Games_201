import { ECueAttriType } from "./ConfigDataMgr";
import ConfigDataSys from "./ConfigDataSys";
import CueDataSys from "./CueDataSys";

const { ccclass, property } = cc._decorator;

@ccclass
export default class CueUnlockItem extends cc.Component {
    @property(cc.Node)
    cueNode: cc.Node = null;

    @property(cc.Node)
    powerNode: cc.Node = null;

    @property(cc.Node)
    spinNode: cc.Node = null;

    @property(cc.Node)
    aimNode: cc.Node = null;

    configData: any = null;

    onLoad(): void {
        cc.Tween.stopAllByTarget(this.cueNode.parent);
        cc.tween(this.cueNode.parent).by(1.5, {
            y: -10
        }, {
            easing: "sineInOut"
        }).by(1, {
            y: 10
        }, {
            easing: "sineInOut"
        }).union().repeatForever().start();
    }

    set cueID(e: number) {
        this.configData = ConfigDataSys.cue_configMap.get(e);
        CueDataSys.setCueSpine(this.cueNode, e);
        this._updateState();
    }

    _updateChangeIcon(e: cc.Node, t: boolean): void {
        e.active = t;
        e.scale = 1;
        cc.Tween.stopAllByTarget(e);
        t && cc.tween(e).to(0.4, {
            scale: 1.2
        }, {
            easing: "sineInOut"
        }).to(0.4, {
            scale: 1
        }, {
            easing: "sineInOut"
        }).union().repeatForever().start();
    }

    _updateState(): void {
        cc.find("progressBar", this.powerNode).getComponent(cc.ProgressBar).progress = this._getCueAttriPercenter(ECueAttriType.E_POWER);
        cc.find("progressBar", this.spinNode).getComponent(cc.ProgressBar).progress = this._getCueAttriPercenter(ECueAttriType.E_SPIN);
        cc.find("progressBar", this.aimNode).getComponent(cc.ProgressBar).progress = this._getCueAttriPercenter(ECueAttriType.E_AMIING);
        const e = this.configData.force - CueDataSys.getUsedCuePower();
        const t = this.configData.spin - CueDataSys.getUsedCueRoleAngle();
        const o = this.configData.aiming - CueDataSys.getUsedCueAimLineLen();
        this._updateChangeIcon(cc.find("changeNode/downSprite", this.powerNode), e < 0);
        this._updateChangeIcon(cc.find("changeNode/upSprite", this.powerNode), e > 0);
        this._updateChangeIcon(cc.find("changeNode/downSprite", this.spinNode), t < 0);
        this._updateChangeIcon(cc.find("changeNode/upSprite", this.spinNode), t > 0);
        this._updateChangeIcon(cc.find("changeNode/downSprite", this.aimNode), o < 0);
        this._updateChangeIcon(cc.find("changeNode/upSprite", this.aimNode), o > 0);
    }

    _getCueAttriPercenter(e: number): number {
        switch (e) {
            case ECueAttriType.E_POWER:
                return (this.configData.force - CueDataSys.min_power) / (CueDataSys.max_power - CueDataSys.min_power) * 0.6 + 0.4;
            case ECueAttriType.E_SPIN:
                return (this.configData.spin - CueDataSys.min_spin) / (CueDataSys.max_spin - CueDataSys.min_spin) * 0.8 + 0.2;
            case ECueAttriType.E_AMIING:
                return Number(this.configData.aiming) / CueDataSys.max_line_len;
        }
    }
}
