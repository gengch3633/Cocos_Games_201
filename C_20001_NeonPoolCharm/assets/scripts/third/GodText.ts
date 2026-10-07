const { ccclass, property } = cc._decorator;

@ccclass
export default class GodText extends cc.Component {
    @property(cc.RichText)
    label: cc.RichText = null;

    @property(cc.Node)
    group: cc.Node = null;

    callback: () => void = null;
    canClick = false;

    setText(text: string, _unused?: any, callback?: () => void): void {
        this.node.active = text != "";
        if (text) {
            this.callback = callback;
            if (!this.label) {
                this.label = this.node.getComponentInChildren(cc.RichText);
            }
            this.label.string = text;
            this.label.node.scale = 0.8;
            this.canClick = false;
            cc.Tween.stopAllByTarget(this.label.node);
            cc.tween(this.label.node)
                .to(0.3, { scale: 1 }, { easing: "backOut" })
                .call(() => {
                    this.canClick = true;
                })
                .start();
        }
    }

    setPos(pos: cc.Vec3): void {
        this.group.position = pos;
    }

    start(): void {
        this.node.on(cc.Node.EventType.TOUCH_START, () => {
            this.node._touchListener.setSwallowTouches(false);
            if (this.node.active) {
                this.node.active = false;
                this.node.emit("click");
            }
        });
    }
}
