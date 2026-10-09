export default class Handler {

    once = false;
    _id = 0;
    caller = null;
    method = null;
    args = null;

    static _pool: Handler[] = [];
    static _gid = 1;

    constructor(caller?, method?, args?, once?) {
        if (undefined === caller) {
            caller = null;
        }
        if (undefined === method) {
            method = null;
        }
        if (undefined === args) {
            args = null;
        }
        if (undefined === once) {
            once = false;
        }
        this.setTo(caller, method, args, once);
    }

    run() {
        if (null == this.method) {
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

    setTo(caller, method, args, once?) {
        if (undefined === once) {
            once = false;
        }
        this._id = Handler._gid++;
        this.caller = caller;
        this.method = method;
        this.args = args;
        this.once = once;
        return this;
    }

    recover() {
        if (this._id > 0) {
            this._id = 0;
            Handler._pool.push(this.clear());
        }
    }

    runWith(data) {
        if (null == this.method) {
            return null;
        }
        if (!this.caller || cc.isValid(this.caller)) {
            const id = this._id;
            let result;
            if (null == data) {
                result = this.method.apply(this.caller, this.args);
            } else {
                result = this.args || data.unshift ? this.args ? this.method.apply(this.caller, this.args.concat(data)) : this.method.apply(this.caller, data) : this.method.call(this.caller, data);
            }
            if (this._id === id && this.once) {
                this.recover();
            }
            return result;
        }
        this.recover();
    }

    static create(caller, method, args?, once?) {
        if (undefined === args) {
            args = null;
        }
        if (undefined === once) {
            once = true;
        }
        return Handler._pool.length ? Handler._pool.pop().setTo(caller, method, args, once) : new Handler(caller, method, args, once);
    }

    clear() {
        this.caller = null;
        this.method = null;
        this.args = null;
        return this;
    }
}
