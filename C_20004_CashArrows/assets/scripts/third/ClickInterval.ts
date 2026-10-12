const { ccclass, property, menu, requireComponent } = cc._decorator;

type ButtonInternal = cc.Button & {
	_onTouchEnded: (event: cc.Event.EventTouch) => void;
};

@ccclass
@menu("UI/Cocos/Btn/ClickInterval")
@requireComponent(cc.Button)
export default class ClickInterval extends cc.Component {

	@property({ tooltip: "点击间隔(秒)" })
	public interval: number = 0.5;

	private isInit: boolean = false;

	private lastClickTime: number = 0;

	private srcOnTouchEnded: ((event: cc.Event.EventTouch) => void) | null = null;

	private _btn: cc.Button = null;

	public get btn(): cc.Button {
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

	public init(): void {
		if (this.isInit) {
			return;
		}
		this.isInit = true;
		const btn = this.btn as ButtonInternal;
		this.srcOnTouchEnded = btn._onTouchEnded.bind(btn);
		btn._onTouchEnded = this.onTouchEnded.bind(this);
	}

	public reset(): void {
		this.lastClickTime = 0;
		if (this.srcOnTouchEnded) {
			(this.btn as ButtonInternal)._onTouchEnded = this.srcOnTouchEnded;
		}
		this.srcOnTouchEnded = null;
		this.isInit = false;
	}

	public onTouchEnded(event: cc.Event.EventTouch): void {
		const now = Date.now();
		if (this.lastClickTime + 1000 * this.interval > now) {
			return;
		}
		this.lastClickTime = now;
		if (this.srcOnTouchEnded) {
			this.srcOnTouchEnded(event);
		}
	}
}