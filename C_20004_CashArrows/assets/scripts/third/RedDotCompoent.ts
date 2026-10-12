import RedDotMgr from "./RedDotMgr";
import RedDotNode from "./RedDotNode";

const { ccclass, menu, property } = cc._decorator;

@ccclass
@menu("RedDot/RedDotCompoent")
export default class RedDotCompoent extends cc.Component {
    @property
    public id: string = "";

    @property(cc.Node)
    public target: cc.Node = null;

    @property(cc.Label)
    public countLab: cc.Label = null;

    private redDot: RedDotNode = null;

    protected onEnable(): void {
        this.redDot = RedDotMgr.getInstance().getRedDot(this.id);
        if (this.redDot) {
            this.redDot.addAttachedNode(this.node);
            this.node.on(RedDotNode.EventType.COUNT_CHANGED, this.updateUI, this);
            this.updateUI();
        }
    }

    protected onDisable(): void {
        if (this.redDot) {
            this.redDot.removeAttachedNode(this.node);
            this.node.off(RedDotNode.EventType.COUNT_CHANGED, this.updateUI, this);
        }
    }

    private updateUI(): void {
        const target = this.target !== null && this.target !== undefined ? this.target : this.node;
        target.active = this.redDot.getCount() > 0;
        if (this.countLab) {
            this.countLab.string = "" + this.redDot.getCount();
        }
    }
}