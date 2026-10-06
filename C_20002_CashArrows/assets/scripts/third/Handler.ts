export default class Handler {
    static _pool: Handler[] = [];
    static _gid = 1;

    once = false;
    _id = 0;
    caller: unknown = null;
    method: ((...args: unknown[]) => unknown) | null = null;
    args: unknown[] | null = null;

    constructor(caller: unknown = null, method: ((...args: unknown[]) => unknown) | null = null, args: unknown[] | null = null, once = false) {
        this.setTo(caller, method, args, once);
    }

    setTo(caller: unknown, method: ((...args: unknown[]) => unknown) | null, args: unknown[] | null, once = false): this {
        this._id = Handler._gid++;
        this.caller = caller;
        this.method = method;
        this.args = args;
        this.once = once;
        return this;
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
        return null;
    }

    runWith(data: unknown): unknown {
        if (this.method == null) {
            return null;
        }
        if (!this.caller || cc.isValid(this.caller as cc.Object)) {
            const id = this._id;
            let result: unknown;
            if (data == null) {
                result = this.method.apply(this.caller, this.args);
            } else if (this.args || (data as unknown[]).unshift) {
                result = this.args ? this.method.apply(this.caller, this.args.concat(data as unknown[])) : this.method.apply(this.caller, data as unknown[]);
            } else {
                result = this.method.call(this.caller, data);
            }
            if (this._id === id && this.once) {
                this.recover();
            }
            return result;
        }
        this.recover();
        return null;
    }

    clear(): this {
        this.caller = null;
        this.method = null;
        this.args = null;
        return this;
    }

    recover(): void {
        if (this._id > 0) {
            this._id = 0;
            Handler._pool.push(this.clear());
        }
    }

    static create(
        caller: unknown,
        method: (...args: unknown[]) => unknown,
        args: unknown[] | null = null,
        once = true,
    ): Handler {
        return Handler._pool.length ? Handler._pool.pop()!.setTo(caller, method, args, once) : new Handler(caller, method, args, once);
    }
}
