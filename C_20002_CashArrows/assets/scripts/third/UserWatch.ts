import Watch from "./Watch";

export default class UserWatch {
    static _ins: any;
    _$watch: any = null;

    static getInstance<T extends UserWatch>(this: new () => T): any {
        const ctor = this as typeof UserWatch & { _ins?: any };
        if (!ctor._ins) {
            const instance = new this();
            instance.create();
            ctor._ins = instance._$watch;
        }
        return ctor._ins;
    }

    create(): void {
        this._$watch = Watch.create(this);
        this.init();
    }

    init(): void {
    }

    on(event: string, callback: Function, target?: any, useCapture?: boolean): void {
        this._$watch.on(event, callback, target, useCapture);
    }

    once(event: string, callback: Function, target?: any, useCapture?: boolean): void {
        this._$watch.once(event, callback, target, useCapture);
    }

    off(event: string, callback?: Function, target?: any, useCapture?: boolean): void {
        this._$watch.off(event, callback, target, useCapture);
    }

    targetOff(target: any): void {
        this._$watch.targetOff(target);
    }

    clearAllEvent(): void {
        this._$watch.clearAllEvent();
    }

    clear(): void {
        this._$watch.clearAllEvent();
        const ctor = (this.constructor || Object.getPrototypeOf(this).constructor) as typeof UserWatch & { _ins?: any };
        if (ctor) {
            ctor._ins = null;
        } else {
            console.error("clear error");
        }
    }
}
