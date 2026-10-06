export default class Handler {
    once: boolean;
    _id: number;
    caller: any;
    method: any;
    args: any;
    static _pool: Handler[] = [];
    static _gid = 1;

    constructor(caller: any = null, method: any = null, args: any = null, once: boolean = false) {
        this.once = false;
        this._id = 0;
        this.setTo(caller, method, args, once);
    }

    setTo(caller: any, method: any, args: any, once: boolean = false) {
        this._id = Handler._gid++;
        this.caller = caller;
        this.method = method;
        this.args = args;
        this.once = once;
        return this;
    }

    run() {
        if (null == this.method) return null;
        if (!this.caller || cc.isValid(this.caller)) {
            const id = this._id;
            const result = this.method.apply(this.caller, this.args);
            this._id === id && this.once && this.recover();
            return result;
        }
        this.recover();
    }

    runWith(data: any) {
        if (null == this.method) return null;
        if (!this.caller || cc.isValid(this.caller)) {
            const id = this._id;
            const result = null == data ? this.method.apply(this.caller, this.args) : this.args || data.unshift ? this.args ? this.method.apply(this.caller, this.args.concat(data)) : this.method.apply(this.caller, data) : this.method.call(this.caller, data);
            this._id === id && this.once && this.recover();
            return result;
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
            Handler._pool.push(this.clear());
        }
    }

    static create(caller: any, method: any, args: any = null, once: boolean = true) {
        return Handler._pool.length ? Handler._pool.pop().setTo(caller, method, args, once) : new Handler(caller, method, args, once);
    }
}
