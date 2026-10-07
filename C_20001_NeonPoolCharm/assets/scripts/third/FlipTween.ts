const { ccclass, property } = cc._decorator;

@ccclass
export default class FlipTween extends cc.Component {
    @property({ tooltip: "" })
    duration = 0;

    onLoad(): void {}

    start(): void {}

    async flip(node: cc.Node, duration: number, midCallback?: () => void, endCallback?: () => void): Promise<void> {
        return new Promise((resolve) => {
            const tween = cc.tween;
            const half = duration / 2;
            const scale = node.scale;
            const skew = scale > 0 ? 20 : -20;
            tween(node)
                .parallel(
                    tween().to(half, { scaleX: 0 }, { easing: "quadIn" }),
                    tween().to(half, { skewY: -skew }, { easing: "quadOut" })
                )
                .call(() => {
                    midCallback?.();
                })
                .parallel(
                    tween().to(half, { scaleX: -scale }, { easing: "quadOut" }),
                    tween().to(half, { skewY: 0 }, { easing: "quadIn" })
                )
                .call(() => {
                    endCallback?.();
                    resolve();
                })
                .start();
        });
    }
}
