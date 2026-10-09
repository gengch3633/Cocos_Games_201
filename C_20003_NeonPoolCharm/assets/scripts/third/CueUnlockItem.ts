import { ECueAttriType } from "./ConfigDataMgr";
import ConfigDataSys from "./ConfigDataSys";
import CueDataSys from "./CueDataSys";

const { ccclass, property } = cc._decorator;

@ccclass
export default class CueUnlockItem extends cc.Component {
    @property(cc.Node)
    cueNode = null;

    @property(cc.Node)
    powerNode = null;

    @property(cc.Node)
    spinNode = null;

    @property(cc.Node)
    aimNode = null;

    configData = null;

    onLoad() {
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

    set cueID(cueId) {
        this.configData = ConfigDataSys.cue_configMap.get(cueId);
        CueDataSys.setCueSpine(this.cueNode, cueId);
        this._updateState();
    }

    _updateChangeIcon(node, show) {
        node.active = show;
        node.scale = 1;
        cc.Tween.stopAllByTarget(node);
        if (show) {
            cc.tween(node).to(.4, {
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

    _updateState() {
        cc.find("progressBar", this.powerNode).getComponent(cc.ProgressBar).progress = this._getCueAttriPercenter(ECueAttriType.E_POWER);
        cc.find("progressBar", this.spinNode).getComponent(cc.ProgressBar).progress = this._getCueAttriPercenter(ECueAttriType.E_SPIN);
        cc.find("progressBar", this.aimNode).getComponent(cc.ProgressBar).progress = this._getCueAttriPercenter(ECueAttriType.E_AMIING);
        const powerDelta = this.configData.force - CueDataSys.getUsedCuePower();
        const spinDelta = this.configData.spin - CueDataSys.getUsedCueRoleAngle();
        const aimDelta = this.configData.aiming - CueDataSys.getUsedCueAimLineLen();
        this._updateChangeIcon(cc.find("changeNode/downSprite", this.powerNode), powerDelta < 0);
        this._updateChangeIcon(cc.find("changeNode/upSprite", this.powerNode), powerDelta > 0);
        this._updateChangeIcon(cc.find("changeNode/downSprite", this.spinNode), spinDelta < 0);
        this._updateChangeIcon(cc.find("changeNode/upSprite", this.spinNode), spinDelta > 0);
        this._updateChangeIcon(cc.find("changeNode/downSprite", this.aimNode), aimDelta < 0);
        this._updateChangeIcon(cc.find("changeNode/upSprite", this.aimNode), aimDelta > 0);
    }

    _getCueAttriPercenter(type) {
        switch (type) {
            case ECueAttriType.E_POWER:
                return (this.configData.force - CueDataSys.min_power) / (CueDataSys.max_power - CueDataSys.min_power) * .6 + .4;
            case ECueAttriType.E_SPIN:
                return (this.configData.spin - CueDataSys.min_spin) / (CueDataSys.max_spin - CueDataSys.min_spin) * .8 + .2;
            case ECueAttriType.E_AMIING:
                return Number(this.configData.aiming) / CueDataSys.max_line_len;
        }
    }
}
