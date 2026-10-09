const { ccclass, property } = cc._decorator;

@ccclass
export default class JellyTween extends cc.Component {

    @property({
        tooltip: ""
    })
    frequency = 4;

    @property({
        tooltip: ""
    })
    decay = 2;

    @property({
        tooltip: ""
    })
    pressScale = .2;

    @property({
        tooltip: ""
    })
    totalTime = 1;

    @property({
        tooltip: ""
    })
    interval = 1;

    @property({
        tooltip: ""
    })
    playOnLoad = false;

    originalScale = 1;
    tween = null;

    play(times?) {
        const self = this;
        const count = null != times && times > 0 ? times : 1e9;
        const pressTime = .2 * this.totalTime;
        const releaseTime = .15 * this.totalTime;
        const shakeTime = .65 * this.totalTime;
        const amplitude = this.pressScale / releaseTime;
        this.tween = cc.tween(this.node).repeat(count, cc.tween().to(pressTime, {
            scaleX: this.originalScale + this.pressScale,
            scaleY: this.originalScale - this.pressScale
        }, {
            easing: "sineOut"
        }).to(releaseTime, {
            scaleX: this.originalScale,
            scaleY: this.originalScale
        }).to(shakeTime, {
            scaleX: {
                value: this.originalScale,
                progress: function (start, end, current, ratio) {
                    return end - self.getDifference(amplitude, ratio);
                }
            },
            scaleY: {
                value: this.originalScale,
                progress: function (start, end, current, ratio) {
                    return end + self.getDifference(amplitude, ratio);
                }
            }
        }).delay(this.interval)).start();
    }

    stop() {
        this.tween && this.tween.stop();
        this.node.setScale(this.originalScale);
    }

    start() {
        this.originalScale = this.node.scale;
        this.playOnLoad && this.play();
    }

    onLoad() {
    }

    getDifference(amplitude, ratio) {
        const omega = this.frequency * Math.PI * 2;
        return amplitude * (Math.sin(ratio * omega) / Math.exp(this.decay * ratio) / omega);
    }
}
