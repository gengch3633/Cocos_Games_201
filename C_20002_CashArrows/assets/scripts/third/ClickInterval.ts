const { ccclass, property, menu, requireComponent } = cc._decorator;

@ccclass
@menu("UI/Cocos/Btn/ClickInterval")
@requireComponent(cc.Button)
export default class ClickInterval extends cc.Component {
    @property({ tooltip: "点击间隔(秒)" })
    interval = 0.5;

    isInit = false;
    lastClickTime = 0;
    srcOnTouchEnded: Function | null = null;
    _btn: cc.Button | null = null;

    get btn(): cc.Button {
        if (!this._btn) {
            this._btn = this.getComponent(cc.Button);
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
        if (!this.isInit) {
            this.isInit = true;
            this.srcOnTouchEnded = (this.btn as any)._onTouchEnded.bind(this.btn);
            (this.btn as any)._onTouchEnded = this.onTouchEnded.bind(this);
        }
    }

    reset(): void {
        this.lastClickTime = 0;
        if (this.srcOnTouchEnded) {
            (this.btn as any)._onTouchEnded = this.srcOnTouchEnded;
        }
        this.srcOnTouchEnded = null;
        this.isInit = false;
    }

    onTouchEnded(event: cc.Event.EventTouch): void {
        if (this.lastClickTime + 1000 * this.interval <= Date.now()) {
            this.lastClickTime = Date.now();
            this.srcOnTouchEnded(event);
        }
    }
}
