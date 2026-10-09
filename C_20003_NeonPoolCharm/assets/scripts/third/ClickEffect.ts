import AudioManager from "./AudioManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ClickEffect extends cc.Component {
    @property(cc.Node)
    templateNode = null;

    _nodePool = new cc.NodePool();

    onLoad() {
        cc.game.addPersistRootNode(this.node);
        this.node.on(cc.Node.EventType.TOUCH_START, this._onTouchStart, this);
        this.node._touchListener.setSwallowTouches(false);
    }

    _onTouchStart(event) {
        const self = this;
        const pooled = this._nodePool.get();
        const node = null !== pooled && undefined !== pooled ? pooled : cc.instantiate(this.templateNode);
        node.scale = 0;
        node.opacity = 255;
        node.setPosition(this.node.convertToNodeSpaceAR(event.getLocation()));
        node.setParent(this.node);
        cc.Tween.stopAllByTarget(node);
        cc.tween(node).to(.5, {
            scale: 1,
            opacity: 0
        }).call(function () {
            return self._nodePool.put(node);
        }).start();
        AudioManager.getInstance().playUIClick();
    }
}
