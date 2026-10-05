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

    percent = 0;
    callback: (percent: number) => void = null;
    callback_update: (percent: number) => void = null;
    private _indicatorToCueDiffY = 0;

    applyByPower(power: string | number): void {
        this.percenterLabel.string = power + "%";
    }

    start(): void {
        this.percenterLabel.string = "0%";
    }

    hideAllBars(): void {}

    clearLabel(): void {
        this.percenterLabel.string = "0%";
        this.maskNode.height = 0;
        this.huakuai.y = -22.5;
        this.cueNode.y = this.huakuai.y - this._indicatorToCueDiffY;
    }

    setCallBack_update(callback: (percent: number) => void): void {
        this.callback_update = callback;
    }

    getPercent(): number {
        return this.percent;
    }

    setCallBack(callback: (percent: number) => void): void {
        this.callback = callback;
    }

    onLoad(): void {
        this.callback = this.callback || null;
        this.callback_update = this.callback_update || null;

        this.node.on(cc.Node.EventType.TOUCH_START, (event: cc.Event.EventTouch) => {
            if (!event.touch || event.touch.getID() == 0) {
                EventMgr.trigger(GameEventType.HIDE_GAMETIP);
                const localPos = this.node.convertToNodeSpaceAR(event.touch.getLocation());
                this._updateUI(localPos.y);
                this.callback_update?.call(this, this.getPercent());
            }
        });
        this.node.on(cc.Node.EventType.TOUCH_MOVE, (event: cc.Event.EventTouch) => {
            if (!event.touch || event.touch.getID() == 0) {
                EventMgr.trigger(GameEventType.HIDE_GAMETIP);
                const localPos = this.node.convertToNodeSpaceAR(event.touch.getLocation());
                this._updateUI(localPos.y);
                this.callback_update?.call(this, this.getPercent());
            }
        });
        this.node.on(cc.Node.EventType.TOUCH_END, (event: cc.Event.EventTouch) => {
            if (!event.touch || event.touch.getID() == 0) {
                EventMgr.trigger(GameEventType.HIDE_GAMETIP);
                this.hideAllBars();
                this.callback?.call(this, this.getPercent());
                this.clearLabel();
            }
        });
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, (event: cc.Event.EventTouch) => {
            if (!event.touch || event.touch.getID() == 0) {
                EventMgr.trigger(GameEventType.HIDE_GAMETIP);
                this.hideAllBars();
                this.callback?.call(this, this.getPercent());
                this.clearLabel();
            }
        });

        this.hideAllBars();
        this._indicatorToCueDiffY = this.huakuai.y - this.cueNode.y;
        const cueSpine = this.cueNode.getChildByName("10522_Pool_Cue_v1_SG");
        UiManager.loadSpine(cueSpine, "cue_spine", CueDataSys.getCurCueSourceName(), () => {
            if (cueSpine.isValid) {
                cueSpine.getComponent(sp.Skeleton).setAnimation(0, "animation", true);
            }
        });
    }

    private _updateUI(y: number): void {
        const clampedY = -Math.max(20 - this.node.height, Math.min(y, -20));
        this.percent = (clampedY - 20) / (this.node.height - 40);
        this.percenterLabel.string = Math.floor(100 * this.percent) + "%";
        this.maskNode.height = clampedY;
        this.huakuai.y = -clampedY - 2.5;
        this.cueNode.y = this.huakuai.y - this._indicatorToCueDiffY;
    }
}
