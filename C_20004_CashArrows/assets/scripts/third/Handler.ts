export default class Handler {
    public static _pool: Handler[] = [];
    public static _gid: number = 1;

    public once: boolean = false;
    public _id: number = 0;
    public caller: any = null;
    public method: Function = null;
    public args: any[] = null;

    constructor(caller: any = null, method: Function = null, args: any[] = null, once: boolean = false) {
        this.once = false;
        this._id = 0;
        this.setTo(caller, method, args, once);
    }

    public setTo(caller: any, method: Function, args: any[], once: boolean = false): Handler {
        this._id = Handler._gid++;
        this.caller = caller;
        this.method = method;
        this.args = args;
        this.once = once;
        return this;
    }

    public run(): any {
        if (null == this.method) {
            return null;
        }
        if (!this.caller || cc.isValid(this.caller)) {
            const id = this._id;
            const ret = this.method.apply(this.caller, this.args);
            if (this._id === id && this.once) {
                this.recover();
            }
            return ret;
        }
        this.recover();
    }

    public runWith(data: any): any {
        if (null == this.method) {
            return null;
        }
        if (!this.caller || cc.isValid(this.caller)) {
            let ret: any;
            const id = this._id;
            if (null == data) {
                ret = this.method.apply(this.caller, this.args);
            } else if (this.args || data.unshift) {
                ret = this.args ? this.method.apply(this.caller, this.args.concat(data)) : this.method.apply(this.caller, data);
            } else {
                ret = this.method.call(this.caller, data);
            }
            if (this._id === id && this.once) {
                this.recover();
            }
            return ret;
        }
        this.recover();
    }

    public clear(): Handler {
        this.caller = null;
        this.method = null;
        this.args = null;
        return this;
    }

    public recover(): void {
        if (this._id > 0) {
            this._id = 0;
            Handler._pool.push(this.clear());
        }
    }

    public static create(caller: any, method: Function, args: any[] = null, once: boolean = true): Handler {
        if (Handler._pool.length) {
            return Handler._pool.pop().setTo(caller, method, args, once);
        }
        return new Handler(caller, method, args, once);
    }
}