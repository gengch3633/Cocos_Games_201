const { ccclass } = cc._decorator;

@ccclass
export default class BallConditionSelComp extends cc.Component {
    isSel = null;
    idx = null;

    onLoad() {
        this.idx = this.idx || 0;
        this.isSel = this.isSel || 0;
        console.log("ball model onLoad", this.isSel);
    }

    open() {
        const e = this;
        const t = this.node.getChildByName("node_gou");
        this.node.on(cc.Node.EventType.TOUCH_START, function () {
            if (255 == t.opacity) {
                t.opacity = 0;
                e.setIsSel(false);
            } else {
                t.opacity = 255;
                e.setIsSel(true);
            }
            console.log("ball model click", e.isSel);
        });
    }

    getIsSel() {
        return this.isSel;
    }

    setIsSel(e) {
        this.isSel = e;
    }

    update() {}
}
