import CueDataSys from "./CueDataSys";
import EventMgr from "./EventMgr";
import GameEventType from "./GameEventType";
import { UiManager } from "./UiManage";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PowerBar2Comp extends cc.Component {
    @property(cc.Label)
    percenterLabel = null;

    @property(cc.Node)
    maskNode = null;

    @property(cc.Node)
    huakuai = null;

    @property(cc.Node)
    cueNode = null;

    percent = null;
    callback = null;
    callback_update = null;
    _indicatorToCueDiffY = 0;

    applyByPower(e) {
        this.percenterLabel.string = e + "%";
    }

    start() {
        this.percenterLabel.string = "0%";
    }

    hideAllBars() {}

    clearLabel() {
        this.percenterLabel.string = "0%";
        this.maskNode.height = 0;
        this.huakuai.y = -22.5;
        this.cueNode.y = this.huakuai.y - this._indicatorToCueDiffY;
    }

    setCallBack_update(e) {
        this.callback_update = e;
    }

    getPercent() {
        return this.percent;
    }

    setCallBack(e) {
        this.callback = e;
    }

    onLoad() {
        var e = this;
        this.callback = this.callback || null;
        this.callback_update = this.callback_update || null;
        this.node.on(cc.Node.EventType.TOUCH_START, function (t) {
            if (!t.touch || 0 == t.touch.getID()) {
                EventMgr.trigger(GameEventType.HIDE_GAMETIP);
                var n = e.node.convertToNodeSpaceAR(t.touch.getLocation());
                e._updateUI(n.y);
                var o = e.callback_update;
                if (null !== o && undefined !== o) {
                    o.call(e, e.getPercent());
                }
            }
        });
        this.node.on(cc.Node.EventType.TOUCH_MOVE, function (t) {
            if (!t.touch || 0 == t.touch.getID()) {
                EventMgr.trigger(GameEventType.HIDE_GAMETIP);
                var n = e.node.convertToNodeSpaceAR(t.touch.getLocation());
                e._updateUI(n.y);
                var o = e.callback_update;
                if (null !== o && undefined !== o) {
                    o.call(e, e.getPercent());
                }
            }
        });
        this.node.on(cc.Node.EventType.TOUCH_END, function (t) {
            if (!t.touch || 0 == t.touch.getID()) {
                EventMgr.trigger(GameEventType.HIDE_GAMETIP);
                e.hideAllBars();
                var o = e.callback;
                if (null !== o && undefined !== o) {
                    o.call(e, e.getPercent());
                }
                e.clearLabel();
            }
        });
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, function (t) {
            if (!t.touch || 0 == t.touch.getID()) {
                EventMgr.trigger(GameEventType.HIDE_GAMETIP);
                e.hideAllBars();
                var o = e.callback;
                if (null !== o && undefined !== o) {
                    o.call(e, e.getPercent());
                }
                e.clearLabel();
            }
        });
        this.hideAllBars();
        this._indicatorToCueDiffY = this.huakuai.y - this.cueNode.y;
        var t = this.cueNode.getChildByName("10522_Pool_Cue_v1_SG");
        UiManager.loadSpine(t, "cue_spine", CueDataSys.getCurCueSourceName(), function () {
            t.isValid && t.getComponent(sp.Skeleton).setAnimation(0, "animation", true);
        });
    }

    _updateUI(e) {
        var t = -Math.max(20 - this.node.height, Math.min(e, -20));
        this.percent = (t - 20) / (this.node.height - 40);
        this.percenterLabel.string = Math.floor(100 * this.percent) + "%";
        this.maskNode.height = t;
        this.huakuai.y = -t - 2.5;
        this.cueNode.y = this.huakuai.y - this._indicatorToCueDiffY;
    }
}
