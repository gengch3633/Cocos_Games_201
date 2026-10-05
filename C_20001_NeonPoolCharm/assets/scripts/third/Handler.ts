export default class Handler {
    static _pool: Handler[] = [];
    static _gid = 1;

    once = false;
    protected _id = 0;
    caller: unknown = null;
    method: Function = null;
    args: unknown[] = null;

    constructor(caller?: unknown, method?: Function, args?: unknown[], once?: boolean) {
        this.setTo(caller, method, args, once);
    }

    run(): unknown {
        if (this.method == null) {
            return null;
        }
        if (!this.caller || cc.isValid(this.caller as cc.Object)) {
            const id = this._id;
            const result = this.method.apply(this.caller, this.args);
            if (this._id === id && this.once) {
                this.recover();
            }
            return result;
        }
        this.recover();
    }

    setTo(caller?: unknown, method?: Function, args?: unknown[], once = false): this {
        this._id = Handler._gid++;
        this.caller = caller;
        this.method = method;
        this.args = args as unknown[];
        this.once = once;
        return this;
    }

    recover(): void {
        if (this._id > 0) {
            this._id = 0;
            Handler._pool.push(this.clear());
        }
    }

    runWith(data?: unknown): unknown {
        if (this.method == null) {
            return null;
        }
        if (!this.caller || cc.isValid(this.caller as cc.Object)) {
            const id = this._id;
            let result: unknown;
            if (data == null) {
                result = this.method.apply(this.caller, this.args);
            } else if (this.args || Array.isArray(data)) {
                result = this.args
                    ? this.method.apply(this.caller, this.args.concat(data as unknown[]))
                    : this.method.apply(this.caller, data as unknown[]);
            } else {
                result = this.method.call(this.caller, data);
            }
            if (this._id === id && this.once) {
                this.recover();
            }
            return result;
        }
        this.recover();
    }

    static create(
        caller?: unknown,
        method?: Function,
        args?: unknown[],
        once = true
    ): Handler {
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
