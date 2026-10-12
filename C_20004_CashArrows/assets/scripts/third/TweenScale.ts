const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("自定义组件/TweenScale")
export default class TweenScale extends cc.Component {
    @property
    public maxScale: number = 1.2;

    @property
    public minScale: number = 0.8;

    public onLoad(): void {
        const tw: cc.Tween<cc.Node> = cc.tween(this.node)
            .to(0.5, { scale: this.minScale })
            .to(1, { scale: this.maxScale })
            .to(0.5, { scale: 1 });
        cc.tween(this.node).then(tw).repeatForever().start();
    }
}