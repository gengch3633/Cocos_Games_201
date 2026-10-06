import Watch from "./Watch";

export default class UserWatch {
    static _ins: any;

    _$watch: any = null;

    static getInstance<T extends UserWatch>(this: new () => T): any {
        if (!(this as any)._ins) {
            var e = new this();
            e.create();
            (this as any)._ins = e._$watch;
        }
        return (this as any)._ins;
    }

    create() {
        this._$watch = Watch.create(this);
        this.init();
    }

    init() {
    }

    on(e: any, t: any, ...args: any[]) {
        this._$watch.on.apply(this._$watch, [e, t].concat(args));
    }

    once(e: any, t: any, ...args: any[]) {
        this._$watch.once.apply(this._$watch, [e, t].concat(args));
    }

    off(e: any, t: any, ...args: any[]) {
        this._$watch.off.apply(this._$watch, [e, t].concat(args));
    }

    targetOff(e: any) {
        this._$watch.targetOff(e);
    }

    clearAllEvent() {
        this._$watch.clearAllEvent();
    }

    clear() {
        var e;
        this._$watch.clearAllEvent();
        var t = null !== (e = (this as any).constructor) && void 0 !== e ? e : Object.getPrototypeOf(this).constructor;
        t ? t._ins = null : console.error(" clear error ");
    }
}
