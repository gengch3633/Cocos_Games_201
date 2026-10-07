const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("自定义组件/TweenScale")
export default class TweenScale extends cc.Component {
    @property()
    maxScale = 1.2;

    @property()
    minScale = 0.8;

    onLoad(): void {
        const sequence = cc.tween(this.node).to(0.5, {
            scale: this.minScale,
        }).to(1, {
            scale: this.maxScale,
        }).to(0.5, {
            scale: 1,
        });
        cc.tween(this.node).then(sequence).repeatForever().start();
    }
}
