const { ccclass, property } = cc._decorator;

@ccclass
export default class BadgeEff extends cc.Component {
    @property
    cycleTime: number = 1;

    @property
    angle: number = 20;

    @property
    offsetY: number = 5;

    tween: cc.Tween | null = null;

    onLoad(): void {
        if (this.tween) {
            this.tween.stop();
        }
        const y = this.node.y;
        const t = this.cycleTime / 4;
        this.node.angle = -this.angle;
        this.tween = cc.tween(this.node)
            .to(t, {
                y: { value: y + 5, easing: "sineInOut" },
                angle: 0
            })
            .to(t, {
                y: { value: y, easing: "sineInOut" },
                angle: this.angle
            })
            .to(t, {
                y: { value: y + 5, easing: "sineInOut" },
                angle: 0
            })
            .to(t, {
                y: { value: y, easing: "sineInOut" },
                angle: -this.angle
            })
            .union()
            .repeatForever()
            .start();
    }
}
