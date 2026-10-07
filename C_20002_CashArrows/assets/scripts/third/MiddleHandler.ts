export default class MiddleHandler {
    static _pool: MiddleHandler[] = [];
    static _gid = 1;

    once = false;
    _id = 0;
    caller: any = null;
    method: Function | null = null;
    args: any[] | null = null;

    constructor(caller: any = null, method: Function | null = null, args: any[] | null = null, once: boolean = false) {
        this.setTo(caller, method, args, once);
    }

    setTo(caller: any, method: Function | null, args: any[] | null, once: boolean = false): MiddleHandler {
        this._id = MiddleHandler._gid++;
        this.caller = caller;
        this.method = method;
        this.args = args;
        this.once = once;
        return this;
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

    runWith(data: any): any {
        if (this.method == null) {
            return null;
        }
        if (!this.caller || cc.isValid(this.caller)) {
            const id = this._id;
            let result: any;
            if (data == null) {
                result = this.method.apply(this.caller, this.args);
            } else if (this.args || data.unshift) {
                result = this.args
                    ? this.method.apply(this.caller, this.args.concat(data))
                    : this.method.apply(this.caller, data);
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

    clear(): MiddleHandler {
        this.caller = null;
        this.method = null;
        this.args = null;
        return this;
    }

    recover(): void {
        if (this._id > 0) {
            this._id = 0;
            MiddleHandler._pool.push(this.clear());
        }
    }

    static create(caller: any, method: Function | null, args: any[] | null = null, once: boolean = true): MiddleHandler {
        return MiddleHandler._pool.length
            ? MiddleHandler._pool.pop().setTo(caller, method, args, once)
            : new MiddleHandler(caller, method, args, once);
    }
}
