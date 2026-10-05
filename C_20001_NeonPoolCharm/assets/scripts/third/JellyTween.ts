const { ccclass, property } = cc._decorator;

@ccclass
export default class JellyTween extends cc.Component {
    @property({ tooltip: "" })
    frequency = 4;

    @property({ tooltip: "" })
    decay = 2;

    @property({ tooltip: "" })
    pressScale = 0.2;

    @property({ tooltip: "" })
    totalTime = 1;

    @property({ tooltip: "" })
    interval = 1;

    @property({ tooltip: "" })
    playOnLoad = false;

    originalScale = 1;
    tween: cc.Tween = null;

    play(repeat?: number): void {
        const count = repeat != null && repeat > 0 ? repeat : 1e9;
        const phase1 = 0.2 * this.totalTime;
        const phase2 = 0.15 * this.totalTime;
        const phase3 = 0.65 * this.totalTime;
        const rate = this.pressScale / phase2;
        this.tween = cc
            .tween(this.node)
            .repeat(
                count,
                cc
                    .tween()
                    .to(phase1, {
                        scaleX: this.originalScale + this.pressScale,
                        scaleY: this.originalScale - this.pressScale,
                    }, { easing: "sineOut" })
                    .to(phase2, {
                        scaleX: this.originalScale,
                        scaleY: this.originalScale,
                    })
                    .to(phase3, {
                        scaleX: {
                            value: this.originalScale,
                            progress: (_start, current, _end, ratio) => {
                                return current - this.getDifference(rate, ratio);
                            },
                        },
                        scaleY: {
                            value: this.originalScale,
                            progress: (_start, current, _end, ratio) => {
                                return current + this.getDifference(rate, ratio);
                            },
                        },
                    })
                    .delay(this.interval)
            )
            .start();
    }

    stop(): void {
        if (this.tween) {
            this.tween.stop();
        }
        this.node.setScale(this.originalScale);
    }

    start(): void {
        this.originalScale = this.node.scale;
        if (this.playOnLoad) {
            this.play();
        }
    }

    onLoad(): void {}

    getDifference(rate: number, ratio: number): number {
        const omega = this.frequency * Math.PI * 2;
        return (rate * (Math.sin(ratio * omega) / Math.exp(this.decay * ratio))) / omega;
    }
}
