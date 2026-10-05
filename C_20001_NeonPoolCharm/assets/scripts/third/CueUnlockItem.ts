import CueDataSys from "./CueDataSys";
import ConfigDataSys from "./ConfigDataSys";
import { ECueAttriType } from "./ConfigDataMgr";

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
        cc.tween(this.cueNode.parent)
            .by(1.5, { y: -10 }, { easing: "sineInOut" })
            .by(1, { y: 10 }, { easing: "sineInOut" })
            .union()
            .repeatForever()
            .start();
    }

    set cueID(id: number) {
        this.configData = ConfigDataSys.cue_configMap.get(id);
        CueDataSys.setCueSpine(this.cueNode, id);
        this._updateState();
    }

    private _updateChangeIcon(node: cc.Node, active: boolean): void {
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

    private _updateState(): void {
        cc.find("progressBar", this.powerNode).getComponent(cc.ProgressBar).progress =
            this._getCueAttriPercenter(ECueAttriType.E_POWER);
        cc.find("progressBar", this.spinNode).getComponent(cc.ProgressBar).progress =
            this._getCueAttriPercenter(ECueAttriType.E_SPIN);
        cc.find("progressBar", this.aimNode).getComponent(cc.ProgressBar).progress =
            this._getCueAttriPercenter(ECueAttriType.E_AMIING);
        const powerDiff = this.configData.force - CueDataSys.getUsedCuePower();
        const spinDiff = this.configData.spin - CueDataSys.getUsedCueRoleAngle();
        const aimDiff = this.configData.aiming - CueDataSys.getUsedCueAimLineLen();
        this._updateChangeIcon(cc.find("changeNode/downSprite", this.powerNode), powerDiff < 0);
        this._updateChangeIcon(cc.find("changeNode/upSprite", this.powerNode), powerDiff > 0);
        this._updateChangeIcon(cc.find("changeNode/downSprite", this.spinNode), spinDiff < 0);
        this._updateChangeIcon(cc.find("changeNode/upSprite", this.spinNode), spinDiff > 0);
        this._updateChangeIcon(cc.find("changeNode/downSprite", this.aimNode), aimDiff < 0);
        this._updateChangeIcon(cc.find("changeNode/upSprite", this.aimNode), aimDiff > 0);
    }

    private _getCueAttriPercenter(type: number): number {
        switch (type) {
            case ECueAttriType.E_POWER:
                return (
                    ((this.configData.force - CueDataSys.min_power) /
                        (CueDataSys.max_power - CueDataSys.min_power)) *
                        0.6 +
                    0.4
                );
            case ECueAttriType.E_SPIN:
                return (
                    ((this.configData.spin - CueDataSys.min_spin) /
                        (CueDataSys.max_spin - CueDataSys.min_spin)) *
                        0.8 +
                    0.2
                );
            case ECueAttriType.E_AMIING:
                return Number(this.configData.aiming) / CueDataSys.max_line_len;
        }
        return 0;
    }
}
