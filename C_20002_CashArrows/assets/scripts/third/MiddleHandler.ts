export default class MiddleHandler {
    once: boolean;
    _id: number;
    caller: any;
    method: any;
    args: any;
    static _pool: MiddleHandler[] = [];
    static _gid = 1;

    constructor(caller: any = null, method: any = null, args: any = null, once: boolean = false) {
        this.once = false;
        this._id = 0;
        this.setTo(caller, method, args, once);
    }

    setTo(caller: any, method: any, args: any, once: boolean = false) {
        this._id = MiddleHandler._gid++;
        this.caller = caller;
        this.method = method;
        this.args = args;
        this.once = once;
        return this;
    }

    run() {
        if (null == this.method) return null;
        if (!this.caller || cc.isValid(this.caller)) {
            var e = this._id,
                t = this.method.apply(this.caller, this.args);
            this._id === e && this.once && this.recover();
            return t;
        }
        this.recover();
    }

    runWith(e: any) {
        if (null == this.method) return null;
        if (!this.caller || cc.isValid(this.caller)) {
            var t = this._id, i: any;
            if (null == e) i = this.method.apply(this.caller, this.args);
            else i = this.args || e.unshift ? this.args ? this.method.apply(this.caller, this.args.concat(e)) : this.method.apply(this.caller, e) : this.method.call(this.caller, e);
            this._id === t && this.once && this.recover();
            return i;
        }
        this.recover();
    }

    clear() {
        this.caller = null;
        this.method = null;
        this.args = null;
        return this;
    }

    recover() {
        if (this._id > 0) {
            this._id = 0;
            MiddleHandler._pool.push(this.clear());
        }
    }

    static create(caller: any, method: any, args: any = null, once: boolean = true) {
        return MiddleHandler._pool.length ? MiddleHandler._pool.pop().setTo(caller, method, args, once) : new MiddleHandler(caller, method, args, once);
    }
}
