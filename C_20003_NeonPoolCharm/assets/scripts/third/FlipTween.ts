const { ccclass, property } = cc._decorator;

@ccclass
export default class FlipTween extends cc.Component {
    @property({
        tooltip: ""
    })
    duration = 0;

    onLoad() {
    }

    start() {
    }

    flip(e, t, o, n) {
        return new Promise<void>(function (i) {
            const a = cc.tween;
            const r = t / 2;
            const l = e.scale;
            const s = l > 0 ? 20 : -20;
            a(e).parallel(a().to(r, {
                scaleX: 0
            }, {
                easing: "quadIn"
            }), a().to(r, {
                skewY: -s
            }, {
                easing: "quadOut"
            })).call(function () {
                o && o();
            }).parallel(a().to(r, {
                scaleX: -l
            }, {
                easing: "quadOut"
            }), a().to(r, {
                skewY: 0
            }, {
                easing: "quadIn"
            })).call(function () {
                n && n();
                i();
            }).start();
        });
    }
}
