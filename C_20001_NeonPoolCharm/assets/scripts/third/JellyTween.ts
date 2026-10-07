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
    tween: any = null;

    play(repeatCount?: number): void {
        const count = repeatCount != null && repeatCount > 0 ? repeatCount : 1e9;
        const pressDuration = 0.2 * this.totalTime;
        const releaseDuration = 0.15 * this.totalTime;
        const bounceDuration = 0.65 * this.totalTime;
        const rate = this.pressScale / releaseDuration;

        this.tween = cc
            .tween(this.node)
            .repeat(
                count,
                cc
                    .tween()
                    .to(
                        pressDuration,
                        {
                            scaleX: this.originalScale + this.pressScale,
                            scaleY: this.originalScale - this.pressScale,
                        },
                        { easing: "sineOut" }
                    )
                    .to(releaseDuration, {
                        scaleX: this.originalScale,
                        scaleY: this.originalScale,
                    })
                    .to(bounceDuration, {
                        scaleX: {
                            value: this.originalScale,
                            progress: (_start: number, end: number, _current: number, ratio: number) => {
                                return end - this.getDifference(rate, ratio);
                            },
                        },
                        scaleY: {
                            value: this.originalScale,
                            progress: (_start: number, end: number, _current: number, ratio: number) => {
                                return end + this.getDifference(rate, ratio);
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

    getDifference(rate: number, time: number): number {
        const omega = this.frequency * Math.PI * 2;
        return (rate * (Math.sin(time * omega) / Math.exp(this.decay * time))) / omega;
    }
}
