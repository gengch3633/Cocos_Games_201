const { ccclass, property, menu } = cc._decorator;

export enum Direction {
    UP = 1,
    Down = 2,
    Left = 3,
    Right = 4
}

export enum AnimationType {
    Move = 0,
    Opacity = 1,
    Scale = 2
}

export enum AnimationAppearanceType {
    Both = 0,
    Show = 1,
    Hide = 2
}

@ccclass
@menu("UI/Cocos/UIAnimation")
export default class UIAnimation extends cc.Component {
    static EventType = {
        START: "UIAnimation_Start",
        END: "UIAnimation_End"
    };

    @property({
        tooltip: "出场类型", type: cc.Enum(AnimationAppearanceType)
    })
    appearanceType: AnimationAppearanceType = AnimationAppearanceType.Both;

    @property({
        tooltip: "动画时间"
    })
    duration = .25;

    @property({
        tooltip: "延迟时间"
    })
    delay = 0;

    @property({
        tooltip: "进入缓动曲线"
    })
    inEasing = "backOut";

    @property({
        tooltip: "出去缓动曲线"
    })
    outEasing = "backIn";

    @property({
        type: cc.Node, tooltip: "目标"
    })
    target: cc.Node = null;

    @property({
        type: cc.Enum(AnimationType), tooltip: "动画类型"
    })
    type: AnimationType = AnimationType.Scale;

    @property({
        tooltip: "移动方向", type: cc.Enum(Direction), visible: function (this: UIAnimation) {
            return this.type == AnimationType.Move;
        }
    })
    direction: Direction = Direction.Down;

    @property({
        tooltip: "目标透明度", visible: function (this: UIAnimation) {
            return this.type == AnimationType.Opacity;
        }
    })
    opacity = 255;

    @property({
        tooltip: "初始透明度", visible: function (this: UIAnimation) {
            return this.type == AnimationType.Opacity;
        }
    })
    initOpacity = 0;

    @property({
        tooltip: "目标缩放", visible: function (this: UIAnimation) {
            return this.type == AnimationType.Scale;
        }
    })
    scale = 1;

    @property({
        tooltip: "初始缩放", visible: function (this: UIAnimation) {
            return this.type == AnimationType.Scale;
        }
    })
    initScale = 0;

    tween: any = null;

    get isShowAnim() {
        return this.appearanceType == AnimationAppearanceType.Both || this.appearanceType == AnimationAppearanceType.Show;
    }

    get isHideAnim() {
        return this.appearanceType == AnimationAppearanceType.Both || this.appearanceType == AnimationAppearanceType.Hide;
    }

    get realTarget() {
        var e;
        return null !== (e = this.target) && void 0 !== e ? e : this.node;
    }

    getTween(e: boolean) {
        var t,
            i: any = null;
        if (this.type == AnimationType.Move) {
            var o: cc.Widget,
                r = 0,
                s = 0;
            if (e) {
                (o = this.realTarget.getComponent(cc.Widget)) && (o.updateAlignment(), o.enabled = !1);
                r = this.realTarget.x;
                s = this.realTarget.y;
                this.direction == Direction.UP ? this.realTarget.y = cc.winSize.height : this.direction == Direction.Down ? this.realTarget.y = -cc.winSize.height : this.direction == Direction.Left ? this.realTarget.x = -cc.winSize.width : this.realTarget.x = cc.winSize.width;
            } else {
                (o = this.realTarget.getComponent(cc.Widget)) && (o.enabled = !1);
                r = this.realTarget.x;
                s = this.realTarget.y;
                this.direction == Direction.UP ? s = cc.winSize.height : this.direction == Direction.Down ? s = -cc.winSize.height : r = this.direction == Direction.Left ? -cc.winSize.width : cc.winSize.width;
            }
            i = {
                x: r,
                y: s
            };
        } else if (this.type == AnimationType.Opacity) {
            this.realTarget.opacity = e ? this.initOpacity : this.opacity;
            i = {
                opacity: e ? this.opacity : this.initOpacity
            };
        } else {
            this.realTarget.scale = e ? this.initScale : this.scale;
            i = {
                scale: e ? this.scale : this.initScale
            };
        }
        null === (t = this.tween) || void 0 === t || t.stop();
        var l: any = null,
            c = e ? this.inEasing : this.outEasing;
        c && (l = {
            easing: c
        });
        this.tween = cc.tween(this.realTarget).delay(this.delay).to(this.duration, i, l);
        return this.tween;
    }

    show() {
        var e = this;
        return new Promise<void>(function (t) {
            var n;
            null === (n = e.node) || void 0 === n || n.emit(UIAnimation.EventType.START, !0);
            e.getTween(!0).call(function () {
                var n;
                if (e.type == AnimationType.Move) {
                    var o = e.realTarget.getComponent(cc.Widget);
                    if (o) {
                        o.enabled = !0;
                        o.updateAlignment();
                    }
                }
                null === (n = e.node) || void 0 === n || n.emit(UIAnimation.EventType.END, !0);
                t();
            }).start();
        });
    }

    hide() {
        var e = this;
        return new Promise<void>(function (t) {
            var n;
            null === (n = e.node) || void 0 === n || n.emit(UIAnimation.EventType.START, !1);
            e.getTween(!1).call(function () {
                var n;
                null === (n = e.node) || void 0 === n || n.emit(UIAnimation.EventType.END, !1);
                t();
            }).start();
        });
    }

    stop() {
        var e;
        null === (e = this.tween) || void 0 === e || e.stop();
    }
}
