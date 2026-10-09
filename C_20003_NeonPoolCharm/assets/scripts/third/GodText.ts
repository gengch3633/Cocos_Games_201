const { ccclass, property } = cc._decorator;

@ccclass
export default class GodText extends cc.Component {

    @property(cc.RichText)
    label: cc.RichText = null;

    @property(cc.Node)
    group: cc.Node = null;

    callback = null;
    canClick = false;

    setText(text, callback) {
        const self = this;
        this.node.active = "" != text;
        if (text) {
            this.callback = callback;
            this.label || (this.label = this.node.getComponentInChildren(cc.RichText));
            this.label.string = text;
            this.label.node.scale = .8;
            this.canClick = false;
            cc.Tween.stopAllByTarget(this.label.node);
            cc.tween(this.label.node).to(.3, {
                scale: 1
            }, {
                easing: "backOut"
            }).call(function () {
                return self.canClick = true;
            }).start();
        }
    }

    setPos(pos) {
        this.group.position = pos;
    }

    start() {
        const self = this;
        this.node.on(cc.Node.EventType.TOUCH_START, function () {
            (self.node as any)._touchListener.setSwallowTouches(false);
            if (self.node.active) {
                self.node.active = false;
                self.node.emit("click");
            }
        });
    }
}
