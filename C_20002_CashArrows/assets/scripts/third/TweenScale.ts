const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("自定义组件/TweenScale")
export default class TweenScale extends cc.Component {
    @property
    maxScale: number = 1.2;

    @property
    minScale: number = 0.8;

    onLoad(): void {
        const action = cc.tween(this.node)
            .to(0.5, { scale: this.minScale })
            .to(1, { scale: this.maxScale })
            .to(0.5, { scale: 1 });
        cc.tween(this.node).then(action).repeatForever().start();
    }
}
