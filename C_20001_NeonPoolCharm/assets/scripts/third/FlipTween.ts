const { ccclass, property } = cc._decorator;

@ccclass
export default class FlipTween extends cc.Component {
    @property({ tooltip: "" })
    duration = 0;

    onLoad(): void {}

    start(): void {}

    flip(
        node: cc.Node,
        totalDuration: number,
        midCallback?: () => void,
        endCallback?: () => void
    ): Promise<void> {
        return new Promise((resolve) => {
            const tween = cc.tween;
            const halfDuration = totalDuration / 2;
            const scale = node.scale;
            const skew = scale > 0 ? 20 : -20;
            tween(node)
                .parallel(
                    tween().to(halfDuration, { scaleX: 0 }, { easing: "quadIn" }),
                    tween().to(halfDuration, { skewY: -skew }, { easing: "quadOut" })
                )
                .call(() => {
                    midCallback && midCallback();
                })
                .parallel(
                    tween().to(halfDuration, { scaleX: -scale }, { easing: "quadOut" }),
                    tween().to(halfDuration, { skewY: 0 }, { easing: "quadIn" })
                )
                .call(() => {
                    endCallback && endCallback();
                    resolve();
                })
                .start();
        });
    }
}
