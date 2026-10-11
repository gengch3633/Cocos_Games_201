export default class FMBaseUI {
    protected _btnNames: string[] = [];
    protected _buttons: cc.Button[] = [];
    protected _clickFastMap: Map<cc.Button, boolean> = new Map();
    protected _clickInterval: number = 500;
    protected _clickTimeMap: Map<cc.Button, number> = new Map();

    protected _callfunc: Function = null;
    protected _target: any = null;

    public addClickListener(callfunc: Function, target: any): void {
        this._callfunc = callfunc;
        this._target = target;
        this._buttons = [];
        this._btnNames.forEach((name) => {
            const button = (this as any)[name];
            if (button && button instanceof cc.Button) {
                this._buttons.push((this as any)[name]);
            }
        });
        for (let i = 0; i < this._buttons.length; i++) {
            const button = this._buttons[i];
            if (button) {
                this._addClickListener(button);
            }
        }
    }

    public setClickFast(button: cc.Button): void {
        if (this._buttons.indexOf(button) >= 0) {
            this._clickFastMap.set(button, true);
        }
    }

    private _addClickListener(button: cc.Button): void {
        const node = button.node;
        node.off("click");
        node.on("click", this._clickListener, this);
    }

    private _clickListener(event: cc.Event.EventTouch): void {
        const lastTime = this._clickTimeMap.get(event);
        const now = new Date().getTime();
        let interval = 0;
        if (!this._clickFastMap.has(event)) {
            interval = this._clickInterval;
        }
        if (!lastTime || now - lastTime >= interval) {
            this._clickTimeMap.set(event, now);
            this._callfunc.apply(this._target, [event]);
        }
    }
}