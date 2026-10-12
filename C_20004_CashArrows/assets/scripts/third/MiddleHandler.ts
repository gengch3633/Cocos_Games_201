export default class MiddleHandler {
    public caller: any = null;
    public method: Function = null;
    public args: any[] = null;
    public once: boolean = false;

    private _id: number = 0;

    private static _pool: MiddleHandler[] = [];
    private static _gid: number = 1;

    constructor(caller: any = null, method: Function = null, args: any[] = null, once: boolean = false) {
        this.once = false;
        this._id = 0;
        this.setTo(caller, method, args, once);
    }

    public setTo(caller: any, method: Function, args: any[] = null, once: boolean = false): MiddleHandler {
        this._id = MiddleHandler._gid++;
        this.caller = caller;
        this.method = method;
        this.args = args;
        this.once = once;
        return this;
    }

    public run(): any {
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
        return null;
    }

    public runWith(arg: any = null): any {
        if (this.method == null) {
            return null;
        }
        if (!this.caller || cc.isValid(this.caller)) {
            const id = this._id;
            let result: any;
            if (arg == null) {
                result = this.method.apply(this.caller, this.args);
            } else if (this.args || arg.unshift) {
                result = this.args
                    ? this.method.apply(this.caller, this.args.concat(arg))
                    : this.method.apply(this.caller, arg);
            } else {
                result = this.method.call(this.caller, arg);
            }
            if (this._id === id && this.once) {
                this.recover();
            }
            return result;
        }
        this.recover();
        return null;
    }

    public clear(): MiddleHandler {
        this.caller = null;
        this.method = null;
        this.args = null;
        return this;
    }

    public recover(): void {
        if (this._id > 0) {
            this._id = 0;
            MiddleHandler._pool.push(this.clear());
        }
    }

    public static create(caller: any = null, method: Function = null, args: any[] = null, once: boolean = true): MiddleHandler {
        const pool = MiddleHandler._pool;
        if (pool.length > 0) {
            return pool.pop().setTo(caller, method, args, once);
        }
        return new MiddleHandler(caller, method, args, once);
    }
}