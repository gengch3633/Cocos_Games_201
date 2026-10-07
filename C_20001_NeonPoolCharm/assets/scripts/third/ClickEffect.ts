import AudioManager from "./AudioManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ClickEffect extends cc.Component {
    @property(cc.Node)
    templateNode: cc.Node = null;

    private _nodePool: cc.NodePool = new cc.NodePool();

    onLoad(): void {
        cc.game.addPersistRootNode(this.node);
        this.node.on(cc.Node.EventType.TOUCH_START, this._onTouchStart, this);
        this.node._touchListener.setSwallowTouches(false);
    }

    private _onTouchStart(event: cc.Event.EventTouch): void {
        const node = this._nodePool.get() ?? cc.instantiate(this.templateNode);
        node.scale = 0;
        node.opacity = 255;
        node.setPosition(this.node.convertToNodeSpaceAR(event.getLocation()));
        node.setParent(this.node);
        cc.Tween.stopAllByTarget(node);
        cc.tween(node)
            .to(0.5, { scale: 1, opacity: 0 })
            .call(() => this._nodePool.put(node))
            .start();
        AudioManager.getInstance().playUIClick();
    }
}
