const { ccclass, property } = cc._decorator;

@ccclass
export default class FMBaseUI {
    protected _btnNames: string[] = [];
    protected _buttons: cc.Button[] = [];
    protected _clickFastMap: Map<cc.Button, boolean> = new Map();
    protected _clickInterval: number = 500;
    protected _clickTimeMap: Map<cc.Button, number> = new Map();

    protected _callfunc: (btn: cc.Button) => void = null;
    protected _target: any = null;

    public addClickListener(callfunc: (btn: cc.Button) => void, target: any): void {
        this._callfunc = callfunc;
        this._target = target;
        this._buttons = [];
        this._btnNames.forEach((name: string): void => {
            const btn = (this as any)[name];
            if (btn && btn instanceof cc.Button) {
                this._buttons.push(btn);
            }
        });
        for (let i = 0; i < this._buttons.length; i++) {
            const btn = this._buttons[i];
            if (btn) {
                this._addClickListener(btn);
            }
        }
    }

    public setClickFast(btn: cc.Button): void {
        if (this._buttons.indexOf(btn) !== -1) {
            this._clickFastMap.set(btn, true);
        }
    }

    private _addClickListener(btn: cc.Button): void {
        const node = btn.node;
        node.off("click");
        node.on("click", this._clickListener, this);
    }

    private _clickListener(btn: cc.Button): void {
        const lastTime = this._clickTimeMap.get(btn);
        const now = new Date().getTime();
        let interval = 0;
        if (!this._clickFastMap.has(btn)) {
            interval = this._clickInterval;
        }
        if (!lastTime || now - lastTime >= interval) {
            this._clickTimeMap.set(btn, now);
            this._callfunc.apply(this._target, [btn]);
        }
    }
}