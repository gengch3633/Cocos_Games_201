const { ccclass, property } = cc._decorator;

@ccclass
export default class BadgeEff extends cc.Component {

    @property
    cycleTime: number = 1;

    @property
    angle: number = 20;

    @property
    offsetY: number = 5;

    tween: cc.Tween = null;

    onLoad() {
        if (this.tween) {
            this.tween.stop();
        }
        const originY = this.node.y;
        const step = this.cycleTime / 4;
        this.node.angle = -this.angle;
        this.tween = cc.tween(this.node).to(step, {
            y: {
                value: originY + 5,
                easing: "sineInOut"
            },
            angle: 0
        }).to(step, {
            y: {
                value: originY,
                easing: "sineInOut"
            },
            angle: this.angle
        }).to(step, {
            y: {
                value: originY + 5,
                easing: "sineInOut"
            },
            angle: 0
        }).to(step, {
            y: {
                value: originY,
                easing: "sineInOut"
            },
            angle: -this.angle
        }).union().repeatForever().start();
    }
}
