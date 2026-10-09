import CocosHelper from "./CocosHelper";
import EventMgr from "./EventMgr";
import GameEventType from "./GameEventType";
import GuideManager from "./GuideManager";

const { ccclass } = cc._decorator;

@ccclass
export default class GameTip extends cc.Component {
    time = 0;
    showTime = 8;
    isPlay = null;

    onDisable() {
        EventMgr.ignore(GameEventType.HIDE_GAMETIP, this.hideTIp, this);
    }

    onLoad() {
        this.node.opacity = 0;
    }

    ani() {
        if (!this.isPlay) {
            this.isPlay = true;
            CocosHelper.runRepeatTweenSync(this.node, -1, cc.tween(this.node).to(2, {
                opacity: 255
            }).to(2, {
                opacity: 100
            }));
        }
    }

    hideTIp() {
        this.time = 0;
        this.stop();
    }

    stop() {
        if (this.isPlay) {
            cc.Tween.stopAllByTarget(this.node);
            this.node.opacity = 0;
            this.isPlay = false;
        }
    }

    update(e) {
        if (!(GuideManager.Instance.stepId < 201)) {
            this.time += e;
            if (this.time >= this.showTime) {
                this.ani();
                this.showTime = 5;
            }
        }
    }

    onEnable() {
        EventMgr.listen(GameEventType.HIDE_GAMETIP, this.hideTIp, this);
    }
}
