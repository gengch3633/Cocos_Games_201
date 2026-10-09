const { ccclass, property } = cc._decorator;

@ccclass
export default class AinanEff extends cc.Component {

    @property
    dtime: number = 0.2;

    @property
    stime: number = 0.2;

    @property
    isHuXI: boolean = false;

    @property
    showScale: number = 0.2;

    tween: cc.Tween = null;

    onEnable() {
        const self = this;
        if (this.tween) {
            this.tween.stop();
        }
        this.tween = cc.tween(this.node).hide().set({
            scaleX: this.showScale,
            scaleY: this.showScale
        }).delay(this.dtime).show().to(this.stime, {
            scaleX: 1,
            scaleY: 1
        }, {
            easing: "backOut"
        }).call(function () {
            if (self.isHuXI) {
                cc.tween(self.node).to(0.5, {
                    scale: 1.1
                }, {
                    easing: "sineInOut"
                }).to(0.5, {
                    scale: 1
                }, {
                    easing: "sineInOut"
                }).union().repeatForever().start();
            } else {
                self.tween = null;
            }
        }).start();
    }
}
