export default class Handler {
    once = false;
    _id = 0;
    caller: any = null;
    method: Function = null;
    args: any = null;

    static _pool: Handler[] = [];
    static _gid = 1;

    constructor(caller: any = null, method: Function = null, args: any = null, once: boolean = false) {
        this.setTo(caller, method, args, once);
    }

    run(): any {
        if (this.method == null) {
            return null;
        }
        if (!this.caller || cc.isValid(this.caller)) {
            const id = this._id;
            const result = this.method.apply(this.caller, this.args);
            if (this._id === id && this.once) {
                this.recover();
            }
            return result;
        }
        this.recover();
    }

    setTo(caller: any, method: Function, args: any, once: boolean = false): this {
        this._id = Handler._gid++;
        this.caller = caller;
        this.method = method;
        this.args = args;
        this.once = once;
        return this;
    }

    recover(): void {
        if (this._id > 0) {
            this._id = 0;
            Handler._pool.push(this.clear());
        }
    }

    runWith(data: any): any {
        if (this.method == null) {
            return null;
        }
        if (!this.caller || cc.isValid(this.caller)) {
            const id = this._id;
            let result: any;
            if (data == null) {
                result = this.method.apply(this.caller, this.args);
            } else {
                result = this.args || data.unshift
                    ? this.args
                        ? this.method.apply(this.caller, this.args.concat(data))
                        : this.method.apply(this.caller, data)
                    : this.method.call(this.caller, data);
            }
            if (this._id === id && this.once) {
                this.recover();
            }
            return result;
        }
        this.recover();
    }

    static create(caller: any, method: Function, args: any = null, once: boolean = true): Handler {
        if (Handler._pool.length) {
            return Handler._pool.pop().setTo(caller, method, args, once);
        }
        return new Handler(caller, method, args, once);
    }

    clear(): this {
        this.caller = null;
        this.method = null;
        this.args = null;
        return this;
    }
}
