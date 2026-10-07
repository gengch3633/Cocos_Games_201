const { ccclass, property, menu } = cc._decorator;

export enum Direction {
    UP = 1,
    Down = 2,
    Left = 3,
    Right = 4,
}

export enum AnimationType {
    Move = 0,
    Opacity = 1,
    Scale = 2,
}

export enum AnimationAppearanceType {
    Both = 0,
    Show = 1,
    Hide = 2,
}

@ccclass
@menu("UI/Cocos/UIAnimation")
export default class UIAnimation extends cc.Component {
    static EventType = {
        START: "UIAnimation_Start",
        END: "UIAnimation_End",
    };

    @property({
        tooltip: "出场类型",
        type: cc.Enum(AnimationAppearanceType),
    })
    appearanceType = AnimationAppearanceType.Both;

    @property({
        tooltip: "动画时间",
    })
    duration = 0.25;

    @property({
        tooltip: "延迟时间",
    })
    delay = 0;

    @property({
        tooltip: "进入缓动曲线",
    })
    inEasing = "backOut";

    @property({
        tooltip: "出去缓动曲线",
    })
    outEasing = "backIn";

    @property({
        type: cc.Node,
        tooltip: "目标",
    })
    target: cc.Node | null = null;

    @property({
        type: cc.Enum(AnimationType),
        tooltip: "动画类型",
    })
    type = AnimationType.Scale;

    @property({
        tooltip: "移动方向",
        type: cc.Enum(Direction),
        visible(this: UIAnimation) {
            return this.type === AnimationType.Move;
        },
    })
    direction = Direction.Down;

    @property({
        tooltip: "目标透明度",
        visible(this: UIAnimation) {
            return this.type === AnimationType.Opacity;
        },
    })
    opacity = 255;

    @property({
        tooltip: "初始透明度",
        visible(this: UIAnimation) {
            return this.type === AnimationType.Opacity;
        },
    })
    initOpacity = 0;

    @property({
        tooltip: "目标缩放",
        visible(this: UIAnimation) {
            return this.type === AnimationType.Scale;
        },
    })
    scale = 1;

    @property({
        tooltip: "初始缩放",
        visible(this: UIAnimation) {
            return this.type === AnimationType.Scale;
        },
    })
    initScale = 0;

    tween: cc.Tween | null = null;

    get isShowAnim(): boolean {
        return this.appearanceType === AnimationAppearanceType.Both || this.appearanceType === AnimationAppearanceType.Show;
    }

    get isHideAnim(): boolean {
        return this.appearanceType === AnimationAppearanceType.Both || this.appearanceType === AnimationAppearanceType.Hide;
    }

    get realTarget(): cc.Node {
        return this.target ?? this.node;
    }

    getTween(isShow: boolean): cc.Tween {
        let props: any = null;
        if (this.type === AnimationType.Move) {
            let widget: cc.Widget | null = null;
            let x = 0;
            let y = 0;
            if (isShow) {
                widget = this.realTarget.getComponent(cc.Widget);
                if (widget) {
                    widget.updateAlignment();
                    widget.enabled = false;
                }
                x = this.realTarget.x;
                y = this.realTarget.y;
                if (this.direction === Direction.UP) {
                    this.realTarget.y = cc.winSize.height;
                } else if (this.direction === Direction.Down) {
                    this.realTarget.y = -cc.winSize.height;
                } else if (this.direction === Direction.Left) {
                    this.realTarget.x = -cc.winSize.width;
                } else {
                    this.realTarget.x = cc.winSize.width;
                }
            } else {
                widget = this.realTarget.getComponent(cc.Widget);
                if (widget) {
                    widget.enabled = false;
                }
                x = this.realTarget.x;
                y = this.realTarget.y;
                if (this.direction === Direction.UP) {
                    y = cc.winSize.height;
                } else if (this.direction === Direction.Down) {
                    y = -cc.winSize.height;
                } else if (this.direction === Direction.Left) {
                    x = -cc.winSize.width;
                } else {
                    x = cc.winSize.width;
                }
            }
            props = { x, y };
        } else if (this.type === AnimationType.Opacity) {
            this.realTarget.opacity = isShow ? this.initOpacity : this.opacity;
            props = {
                opacity: isShow ? this.opacity : this.initOpacity,
            };
        } else {
            this.realTarget.scale = isShow ? this.initScale : this.scale;
            props = {
                scale: isShow ? this.scale : this.initScale,
            };
        }
        this.tween?.stop();
        const easingName = isShow ? this.inEasing : this.outEasing;
        const tweenProps = easingName ? { easing: easingName } : null;
        this.tween = cc.tween(this.realTarget).delay(this.delay).to(this.duration, props, tweenProps);
        return this.tween;
    }

    show(): Promise<void> {
        return new Promise((resolve) => {
            this.node?.emit(UIAnimation.EventType.START, true);
            this.getTween(true).call(() => {
                if (this.type === AnimationType.Move) {
                    const widget = this.realTarget.getComponent(cc.Widget);
                    if (widget) {
                        widget.enabled = true;
                        widget.updateAlignment();
                    }
                }
                this.node?.emit(UIAnimation.EventType.END, true);
                resolve();
            }).start();
        });
    }

    hide(): Promise<void> {
        return new Promise((resolve) => {
            this.node?.emit(UIAnimation.EventType.START, false);
            this.getTween(false).call(() => {
                this.node?.emit(UIAnimation.EventType.END, false);
                resolve();
            }).start();
        });
    }

    stop(): void {
        this.tween?.stop();
    }
}
