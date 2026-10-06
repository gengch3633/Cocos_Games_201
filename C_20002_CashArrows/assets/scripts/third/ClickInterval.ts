const { ccclass, property, menu, requireComponent } = cc._decorator;

type ButtonWithTouch = cc.Button & {
    _onTouchEnded: (event: cc.Event.EventTouch) => void;
};

@ccclass
@menu("UI/Cocos/Btn/ClickInterval")
@requireComponent(cc.Button)
export default class ClickInterval extends cc.Component {
    @property({
        tooltip: "点击间隔(秒)",
    })
    interval = 0.5;

    isInit = false;
    lastClickTime = 0;
    srcOnTouchEnded: ((event: cc.Event.EventTouch) => void) | null = null;
    _btn: ButtonWithTouch | null = null;

    get btn(): ButtonWithTouch {
        if (!this._btn) {
            this._btn = this.getComponent(cc.Button) as ButtonWithTouch;
        }
        return this._btn;
    }

    onLoad(): void {
        this.init();
    }

    onEnable(): void {
        this.init();
    }

    onDisable(): void {
        this.reset();
    }

    init(): void {
        if (this.isInit) {
            return;
        }
        this.isInit = true;
        this.srcOnTouchEnded = this.btn._onTouchEnded.bind(this.btn);
        this.btn._onTouchEnded = this.onTouchEnded.bind(this);
    }

    reset(): void {
        this.lastClickTime = 0;
        if (this.srcOnTouchEnded) {
            this.btn._onTouchEnded = this.srcOnTouchEnded;
        }
        this.srcOnTouchEnded = null;
        this.isInit = false;
    }

    onTouchEnded(event: cc.Event.EventTouch): void {
        if (this.lastClickTime + 1000 * this.interval > Date.now()) {
            return;
        }
        this.lastClickTime = Date.now();
        this.srcOnTouchEnded?.(event);
    }
}
