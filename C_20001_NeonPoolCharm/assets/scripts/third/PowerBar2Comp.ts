import CueDataSys from "./CueDataSys";
import EventMgr from "./EventMgr";
import GameEventType from "./GameEventType";
import { UiManager } from "./UiManage";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PowerBar2Comp extends cc.Component {
    @property(cc.Label)
    percenterLabel: cc.Label = null;

    @property(cc.Node)
    maskNode: cc.Node = null;

    @property(cc.Node)
    huakuai: cc.Node = null;

    @property(cc.Node)
    cueNode: cc.Node = null;

    percent: number = null;
    callback: (percent: number) => void = null;
    callback_update: (percent: number) => void = null;
    _indicatorToCueDiffY = 0;

    applyByPower(e: number): void {
        this.percenterLabel.string = e + "%";
    }

    start(): void {
        this.percenterLabel.string = "0%";
    }

    hideAllBars(): void {
    }

    clearLabel(): void {
        this.percenterLabel.string = "0%";
        this.maskNode.height = 0;
        this.huakuai.y = -22.5;
        this.cueNode.y = this.huakuai.y - this._indicatorToCueDiffY;
    }

    setCallBack_update(e: (percent: number) => void): void {
        this.callback_update = e;
    }

    getPercent(): number {
        return this.percent;
    }

    setCallBack(e: (percent: number) => void): void {
        this.callback = e;
    }

    onLoad(): void {
        this.callback = this.callback || null;
        this.callback_update = this.callback_update || null;
        this.node.on(cc.Node.EventType.TOUCH_START, (t: cc.Event.EventTouch) => {
            if (!t.touch || 0 == t.touch.getID()) {
                EventMgr.trigger(GameEventType.HIDE_GAMETIP);
                const n = this.node.convertToNodeSpaceAR(t.touch.getLocation());
                this._updateUI(n.y);
                this.callback_update?.(this.getPercent());
            }
        });
        this.node.on(cc.Node.EventType.TOUCH_MOVE, (t: cc.Event.EventTouch) => {
            if (!t.touch || 0 == t.touch.getID()) {
                EventMgr.trigger(GameEventType.HIDE_GAMETIP);
                const n = this.node.convertToNodeSpaceAR(t.touch.getLocation());
                this._updateUI(n.y);
                this.callback_update?.(this.getPercent());
            }
        });
        this.node.on(cc.Node.EventType.TOUCH_END, (t: cc.Event.EventTouch) => {
            if (!t.touch || 0 == t.touch.getID()) {
                EventMgr.trigger(GameEventType.HIDE_GAMETIP);
                this.hideAllBars();
                this.callback?.(this.getPercent());
                this.clearLabel();
            }
        });
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, (t: cc.Event.EventTouch) => {
            if (!t.touch || 0 == t.touch.getID()) {
                EventMgr.trigger(GameEventType.HIDE_GAMETIP);
                this.hideAllBars();
                this.callback?.(this.getPercent());
                this.clearLabel();
            }
        });
        this.hideAllBars();
        this._indicatorToCueDiffY = this.huakuai.y - this.cueNode.y;
        const t = this.cueNode.getChildByName("10522_Pool_Cue_v1_SG");
        UiManager.loadSpine(t, "cue_spine", CueDataSys.getCurCueSourceName(), () => {
            t.isValid && t.getComponent(sp.Skeleton).setAnimation(0, "animation", true);
        });
    }

    _updateUI(e: number): void {
        const t = -Math.max(20 - this.node.height, Math.min(e, -20));
        this.percent = (t - 20) / (this.node.height - 40);
        this.percenterLabel.string = Math.floor(100 * this.percent) + "%";
        this.maskNode.height = t;
        this.huakuai.y = -t - 2.5;
        this.cueNode.y = this.huakuai.y - this._indicatorToCueDiffY;
    }
}
