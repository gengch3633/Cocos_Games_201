import Watch from "./Watch";

const { ccclass } = cc._decorator;

@ccclass
export default class UserWatch {
    private static _ins: Watch = null;

    private _$watch: Watch = null;

    public static getInstance(): Watch {
        if (!this._ins) {
            const ins = new this();
            ins.create();
            this._ins = ins._$watch;
        }
        return this._ins;
    }

    public create(): void {
        this._$watch = Watch.create(this);
        this.init();
    }

    protected init(): void {}

    public on(event: string, callback: Function, target?: any, ...args: any[]): void {
        this._$watch.on(event, callback, target, ...args);
    }

    public once(event: string, callback: Function, target?: any, ...args: any[]): void {
        this._$watch.once(event, callback, target, ...args);
    }

    public off(event: string, callback: Function, target?: any, ...args: any[]): void {
        this._$watch.off(event, callback, target, ...args);
    }

    public targetOff(target: any): void {
        this._$watch.targetOff(target);
    }

    public clearAllEvent(): void {
        this._$watch.clearAllEvent();
    }

    public clear(): void {
        this._$watch.clearAllEvent();
        let ctor: typeof UserWatch = this.constructor as typeof UserWatch;
        if (!ctor) {
            ctor = Object.getPrototypeOf(this).constructor as typeof UserWatch;
        }
        if (ctor) {
            ctor._ins = null;
        } else {
            console.error("clear error");
        }
    }
}