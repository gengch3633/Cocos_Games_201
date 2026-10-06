const { ccclass } = cc._decorator;

@ccclass
export default class game_btn_radBall extends cc.Component {
    pos_value: cc.Vec2 = null;
    angle: number = null;
    cb_click: (() => void) = null;

    getPosValue(): cc.Vec2 {
        return this.pos_value;
    }

    start(): void {}

    movetoPos(pos: cc.Vec2): void {
        if (pos.mag() <= 40) {
            const circle = cc.find("node_circle", this.node);
            const red = cc.find("node_red", circle);
            red.x = 40 * pos.x;
            red.y = 40 * pos.y;
        }
    }

    setInfo(pos: cc.Vec2, angle: number): void {
        this.pos_value = pos;
        this.angle = angle;
        this.movetoPos(pos);
        this.updateLabel();
    }

    onLoad(): void {
        this.cb_click = this.cb_click || null;
        this.pos_value = cc.v2(0, 0);
        this.angle = 0;
        this.node.on(cc.Node.EventType.TOUCH_START, () => {});
        this.node.on(cc.Node.EventType.TOUCH_MOVE, () => {});
        this.node.on(cc.Node.EventType.TOUCH_END, () => {
            this.cb_click && this.cb_click();
        });
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, () => {});
    }

    updateLabel(): void {
        cc.find("label_angle", this.node).getComponent(cc.Label).string = "" + this.angle;
    }

    setClickCB(callback: () => void): void {
        this.cb_click = callback || null;
    }
}
