import RedDotMgr from "./RedDotMgr";
import RedDotNode from "./RedDotNode";

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("RedDot/RedDotCompoent")
export default class RedDotCompoent extends cc.Component {
    @property
    id: string = "";

    @property(cc.Node)
    target: cc.Node = null;

    @property(cc.Label)
    countLab: cc.Label = null;

    redDot: RedDotNode = null;

    onEnable(): void {
        this.redDot = RedDotMgr.getInstance().getRedDot(this.id);
        if (this.redDot) {
            this.redDot.addAttachedNode(this.node);
            this.node.on(RedDotNode.EventType.COUNT_CHANGED, this.updateUI, this);
            this.updateUI();
        }
    }

    onDisable(): void {
        if (this.redDot) {
            this.redDot.removeAttachedNode(this.node);
            this.node.off(RedDotNode.EventType.COUNT_CHANGED, this.updateUI, this);
        }
    }

    updateUI(): void {
        (this.target ?? this.node).active = this.redDot.getCount() > 0;
        if (this.countLab) {
            this.countLab.string = "" + this.redDot.getCount();
        }
    }
}
