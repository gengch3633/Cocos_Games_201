const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("自定义组件/TweenScale")
export default class TweenScale extends cc.Component {
    @property
    maxScale: number = 1.2;

    @property
    minScale: number = .8;

    onLoad() {
        var e = cc.tween(this.node).to(.5, {
            scale: this.minScale
        }).to(1, {
            scale: this.maxScale
        }).to(.5, {
            scale: 1
        });
        cc.tween(this.node).then(e).repeatForever().start();
    }
}
