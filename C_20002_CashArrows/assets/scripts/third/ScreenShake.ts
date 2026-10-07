const { ccclass } = cc._decorator;

@ccclass
export default class ScreenShake extends cc.Component {
    originalPos: cc.Vec3 = new cc.Vec3();
    shakeIntensity: number = 10;
    shakeDuration: number = 0.5;
    shakeCount: number = 12;

    start(): void {
        this.originalPos.set(this.node.position);
    }

    shake(): void {
        cc.Tween.stopAllByTarget(this.node);
        this.node.setPosition(this.originalPos);
        let tween = cc.tween(this.node);
        for (let i = 0; i < this.shakeCount; i++) {
            const progress = i / this.shakeCount;
            const intensity = this.shakeIntensity * (1 - progress);
            const offsetX = 2 * (Math.random() - 0.5) * intensity;
            const offsetY = 2 * (Math.random() - 0.5) * intensity;
            tween = tween.to(this.shakeDuration / this.shakeCount, {
                position: new cc.Vec3(
                    this.originalPos.x + offsetX,
                    this.originalPos.y + offsetY,
                    this.originalPos.z
                )
            });
        }
        tween.to(0.1, { position: this.originalPos });
        tween.start();
    }
}
