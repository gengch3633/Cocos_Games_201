import Handler from "./Handler";

export default class EventHandler extends Handler {
    static _pool = [];

    _dispatcher = null;

    _type = null;

    _id: any;

    constructor(t, o, n, i) {
        super(t, o, n, i);
    }

    static create(e, o, n, i) {
        if (undefined === n) {
            n = null;
        }
        if (undefined === i) {
            i = true;
        }
        return EventHandler._pool.length ? EventHandler._pool.pop().setTo(e, o, n, i) : new EventHandler(e, o, n, i);
    }

    recover() {
        if (this._id > 0) {
            this._id = 0;
            EventHandler._pool.push((this as any).clear());
        }
    }

    register(e, t) {
        this._dispatcher = e;
        this._type = t;
    }

    check(e, t) {
        return !(this._dispatcher && this._dispatcher != e || this._type && this._type != t);
    }
}
