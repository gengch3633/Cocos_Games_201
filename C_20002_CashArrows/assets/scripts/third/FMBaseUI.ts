export default class FMBaseUI {
    _btnNames: string[] = [];
    _buttons: cc.Button[] = [];
    _clickFastMap = new Map<cc.Button, boolean>();
    _clickInterval = 500;
    _clickTimeMap = new Map<cc.Button, number>();
    _callfunc: ((button: cc.Button) => void) | null = null;
    _target: unknown = null;

    addClickListener(callback: (button: cc.Button) => void, target: unknown): void {
        this._callfunc = callback;
        this._target = target;
        this._buttons = [];
        this._btnNames.forEach((name) => {
            const button = (this as Record<string, unknown>)[name] as cc.Button | undefined;
            if (button && button instanceof cc.Button) {
                this._buttons.push(button);
            }
        });
        for (let i = 0; i < this._buttons.length; i++) {
            const button = this._buttons[i];
            if (button) {
                this._addClickListener(button);
            }
        }
    }

    setClickFast(button: cc.Button): void {
        if (this._buttons.includes(button)) {
            this._clickFastMap.set(button, true);
        }
    }

    _addClickListener(button: cc.Button): void {
        const node = button.node;
        node.off("click");
        node.on("click", this._clickListener, this);
    }

    _clickListener(button: cc.Button): void {
        const lastClickTime = this._clickTimeMap.get(button);
        const now = new Date().getTime();
        let interval = 0;
        if (!this._clickFastMap.has(button)) {
            interval = this._clickInterval;
        }
        if (!lastClickTime || now - lastClickTime >= interval) {
            this._clickTimeMap.set(button, now);
            this._callfunc?.apply(this._target, [button]);
        }
    }
}
