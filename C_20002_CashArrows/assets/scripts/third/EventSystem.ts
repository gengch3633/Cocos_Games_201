import Handler from "./Handler";

class EventHandler extends Handler {
    static _pool: any[] = [];

    constructor(t: any, i: any, n: any, a: any) {
        super(t, i, n, a);
    }

    recover() {
        if (this._id > 0) {
            this._id = 0;
            EventHandler._pool.push(this.clear());
        }
    }

    register(e: any, t: any) {
        this._dispatcher = e;
        this._type = t;
    }

    check(e: any, t: any) {
        return !(this._dispatcher && this._dispatcher != e || this._type && this._type != t);
    }

    static create(e: any, i: any, n: any = null, a: any = true) {
        return EventHandler._pool.length ? EventHandler._pool.pop().setTo(e, i, n, a) : new EventHandler(e, i, n, a);
    }
}

class EventDispatcher {
    _events: any;

    event(e: any, t: any = null) {
        if (!this._events || !this._events[e]) return false;
        var i = this._events[e];
        if (i.run) {
            i.once && delete this._events[e];
            i.check(this, e) && (null != t ? i.runWith(t) : i.run());
        } else {
            for (var n = 0, a = i.length; n < a; n++) {
                var o = i[n];
                o && o.check(this, e) && (null != t ? o.runWith(t) : o.run());
                if (!o || o.once) {
                    i.splice(n, 1);
                    n--;
                    a--;
                }
            }
            0 === i.length && this._events && delete this._events[e];
        }
        return true;
    }

    on(e: any, t: any, i: any, n: any = null) {
        return this._createListener(e, t, i, n, false);
    }

    _createListener(e: any, t: any, i: any, a: any, o: any, r: any = true) {
        r && this.off(e, t, i, o);
        var s = EventHandler.create(t || this, i, a, o);
        s.register(this, e);
        this._events || (this._events = {});
        var l = this._events;
        l[e] ? l[e].run ? l[e] = [l[e], s] : l[e].push(s) : l[e] = s;
        return this;
    }

    off(e: any, t: any, i: any, n: any = false) {
        if (!this._events || !this._events[e]) return this;
        var a = this._events[e];
        if (null != a) if (a.run) {
            if ((!t || a.caller === t) && (null == i || a.method === i) && (!n || a.once)) {
                delete this._events[e];
                a.recover();
            }
        } else {
            for (var o = 0; o < a.length; o++) {
                var r = a[o];
                if (r && (!t || r.caller === t) && (null == i || r.method === i) && (!n || r.once)) {
                    a.splice(o, 1);
                    o--;
                    r.recover();
                }
            }
            0 === a.length && delete this._events[e];
        }
        return this;
    }

    offAllCaller(e: any) {
        if (e && this._events) for (var t in this._events) this.off(t, e, null);
        return this;
    }
}

export default class EventSystem {
    static listen(e: any, t: any, i: any, n: any = null) {
        this.dispatcher.off(e, i, t);
        this.dispatcher.on(e, i, t, n);
    }

    static ignore(e: any, t: any, i: any) {
        this.dispatcher.off(e, i, t, false);
    }

    static trigger(e: any, t: any) {
        this.dispatcher.event(e, t);
    }

    static ignoreAll(e: any) {
        this.dispatcher.offAllCaller(e);
    }

    static dispatcher = new EventDispatcher();
}

export const CLOSE_RECONNECT = " CLOSE_RECONNECT ";
