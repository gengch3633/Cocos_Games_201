import Watch from "./Watch";

export default class UserWatch {
    static _ins: any = null;
    _$watch: any = null;

    static getInstance<T extends typeof UserWatch>(this: T): InstanceType<T> {
        if (!this._ins) {
            const instance = new this();
            instance.create();
            this._ins = instance._$watch;
        }
        return this._ins;
    }

    create(): void {
        this._$watch = Watch.create(this);
        this.init();
    }

    init(): void {}

    on(event: string, callback: (...args: any[]) => void, ...args: any[]): void {
        this._$watch.on(event, callback, ...args);
    }

    once(event: string, callback: (...args: any[]) => void, ...args: any[]): void {
        this._$watch.once(event, callback, ...args);
    }

    off(event: string, callback: (...args: any[]) => void, ...args: any[]): void {
        this._$watch.off(event, callback, ...args);
    }

    targetOff(target: any): void {
        this._$watch.targetOff(target);
    }

    clearAllEvent(): void {
        this._$watch.clearAllEvent();
    }

    clear(): void {
        this._$watch.clearAllEvent();
        const ctor = this.constructor as typeof UserWatch;
        if (ctor) {
            ctor._ins = null;
        } else {
            console.error("clear error");
        }
    }
}
