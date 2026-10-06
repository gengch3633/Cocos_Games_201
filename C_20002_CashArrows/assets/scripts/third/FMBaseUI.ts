export default class FMBaseUI {
    _btnNames: string[] = [];
    _buttons: any[] = [];
    _clickFastMap: Map<any, boolean> = new Map();
    _clickInterval = 500;
    _clickTimeMap: Map<any, number> = new Map();
    _callfunc: any;
    _target: any;

    addClickListener(callback: any, target: any) {
        const self = this;
        this._callfunc = callback;
        this._target = target;
        this._buttons = [];
        this._btnNames.forEach(function (name) {
            const button = (self as any)[name];
            button && button instanceof cc.Button && self._buttons.push((self as any)[name]);
        });
        for (let i = 0; i < this._buttons.length; i++) {
            const button = this._buttons[i];
            button && this._addClickListener(button);
        }
    }

    setClickFast(button: any) {
        this._buttons.includes(button) && this._clickFastMap.set(button, true);
    }

    _addClickListener(button: any) {
        const node = button.node;
        node.off("click");
        node.on("click", this._clickListener, this);
    }

    _clickListener(event: any) {
        const lastTime = this._clickTimeMap.get(event);
        const now = new Date().getTime();
        let interval = 0;
        this._clickFastMap.has(event) || (interval = this._clickInterval);
        if (!lastTime || now - lastTime >= interval) {
            this._clickTimeMap.set(event, now);
            this._callfunc.apply(this._target, [event]);
        }
    }
}
