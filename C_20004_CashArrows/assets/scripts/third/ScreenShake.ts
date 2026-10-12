const { ccclass } = cc._decorator;

@ccclass
export default class ScreenShake extends cc.Component {
    public originalPos: cc.Vec3 = new cc.Vec3();
    public shakeIntensity: number = 10;
    public shakeDuration: number = 0.5;
    public shakeCount: number = 12;

    protected start(): void {
        this.originalPos.set(this.node.position);
    }

    public shake(): void {
        cc.Tween.stopAllByTarget(this.node);
        this.node.setPosition(this.originalPos);

        let tween = cc.tween(this.node);

        for (let i = 0; i < this.shakeCount; i++) {
            const ratio = i / this.shakeCount;
            const intensity = this.shakeIntensity * (1 - ratio);
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