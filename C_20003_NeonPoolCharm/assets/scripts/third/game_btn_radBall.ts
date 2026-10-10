const { ccclass } = cc._decorator;

@ccclass
export default class game_btn_radBall extends cc.Component {
    pos_value = null;

    angle = null;

    cb_click = null;

    getPosValue() {
        return this.pos_value;
    }

    start() {}

    movetoPos(e) {
        if (e.mag() <= 40) {
            const t = cc.find("node_circle", this.node);
            const o = cc.find("node_red", t);
            o.x = 40 * e.x;
            o.y = 40 * e.y;
        }
    }

    setInfo(e, t) {
        this.pos_value = e;
        this.angle = t;
        this.movetoPos(e);
        this.updateLabel();
    }

    onLoad() {
        const e = this;
        this.cb_click = this.cb_click || null;
        this.pos_value = cc.v2(0, 0);
        this.angle = 0;
        this.node.on(cc.Node.EventType.TOUCH_START, function () {});
        this.node.on(cc.Node.EventType.TOUCH_MOVE, function () {});
        this.node.on(cc.Node.EventType.TOUCH_END, function () {
            e.cb_click && e.cb_click();
        });
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, function () {});
    }

    updateLabel() {
        cc.find("label_angle", this.node).getComponent(cc.Label).string = this.angle;
    }

    setClickCB(e) {
        this.cb_click = e || null;
    }
}
