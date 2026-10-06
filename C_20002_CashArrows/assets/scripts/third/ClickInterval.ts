const { ccclass, property, menu, requireComponent } = cc._decorator;

@ccclass
@menu("UI/Cocos/Btn/ClickInterval")
@requireComponent(cc.Button)
export default class ClickInterval extends cc.Component {
    @property({
        tooltip: "点击间隔(秒)"
    })
    interval: number = .5;

    isInit: boolean = false;
    lastClickTime: number = 0;
    srcOnTouchEnded: any = null;
    private _btn: cc.Button = null;

    get btn(): cc.Button {
        this._btn || (this._btn = this.getComponent(cc.Button));
        return this._btn;
    }

    onLoad() {
        this.init();
    }

    onEnable() {
        this.init();
    }

    onDisable() {
        this.reset();
    }

    init() {
        if (!this.isInit) {
            this.isInit = true;
            this.srcOnTouchEnded = (this.btn as any)._onTouchEnded.bind(this.btn);
            (this.btn as any)._onTouchEnded = this.onTouchEnded.bind(this);
        }
    }

    reset() {
        this.lastClickTime = 0;
        this.srcOnTouchEnded && ((this.btn as any)._onTouchEnded = this.srcOnTouchEnded);
        this.srcOnTouchEnded = null;
        this.isInit = false;
    }

    onTouchEnded(e: any) {
        if (!(this.lastClickTime + 1e3 * this.interval > Date.now())) {
            this.lastClickTime = Date.now();
            this.srcOnTouchEnded(e);
        }
    }
}
