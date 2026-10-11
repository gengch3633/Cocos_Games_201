const { ccclass, property, menu, requireComponent } = cc._decorator;

@ccclass
@menu("UI/Cocos/Btn/ClickInterval")
@requireComponent(cc.Button)
export default class ClickInterval extends cc.Component {
    @property({
        tooltip: "点击间隔(秒)"
    })
    public interval: number = 0.5;

    private isInit: boolean = false;
    private lastClickTime: number = 0;
    private srcOnTouchEnded: Function = null;
    private _btn: cc.Button = null;

    private get btn(): cc.Button {
        if (!this._btn) {
            this._btn = this.getComponent(cc.Button);
        }
        return this._btn;
    }

    protected onLoad(): void {
        this.init();
    }

    protected onEnable(): void {
        this.init();
    }

    protected onDisable(): void {
        this.reset();
    }

    private init(): void {
        if (!this.isInit) {
            this.isInit = true;
            this.srcOnTouchEnded = this.btn._onTouchEnded.bind(this.btn);
            this.btn._onTouchEnded = this.onTouchEnded.bind(this);
        }
    }

    private reset(): void {
        this.lastClickTime = 0;
        if (this.srcOnTouchEnded) {
            this.btn._onTouchEnded = this.srcOnTouchEnded;
        }
        this.srcOnTouchEnded = null;
        this.isInit = false;
    }

    private onTouchEnded(event: cc.Event): void {
        if (!(this.lastClickTime + 1000 * this.interval > Date.now())) {
            this.lastClickTime = Date.now();
            this.srcOnTouchEnded(event);
        }
    }
}