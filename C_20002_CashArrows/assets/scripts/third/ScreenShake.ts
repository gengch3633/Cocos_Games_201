const { ccclass } = cc._decorator;

@ccclass
export default class ScreenShake extends cc.Component {
    originalPos: cc.Vec3 = new cc.Vec3();
    shakeIntensity: number = 10;
    shakeDuration: number = .5;
    shakeCount: number = 12;

    start() {
        this.originalPos.set(this.node.position);
    }

    shake() {
        cc.Tween.stopAllByTarget(this.node);
        this.node.setPosition(this.originalPos);
        for (var e = cc.tween(this.node), t = 0; t < this.shakeCount; t++) {
            var i = t / this.shakeCount,
                n = this.shakeIntensity * (1 - i),
                a = 2 * (Math.random() - .5) * n,
                o = 2 * (Math.random() - .5) * n;
            e = e.to(this.shakeDuration / this.shakeCount, {
                position: new cc.Vec3(this.originalPos.x + a, this.originalPos.y + o, this.originalPos.z)
            });
        }
        e.to(.1, {
            position: this.originalPos
        });
        e.start();
    }
}
