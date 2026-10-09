import EventHandler from "./EventHandler";

export default class EventDispatcher {
    _events = null;

    off(e, t, o, n?) {
        if (undefined === n) {
            n = false;
        }
        if (!this._events || !this._events[e]) return this;
        const i = this._events[e];
        if (null != i) if (i.run) {
            if ((!t || i.caller === t) && (null == o || i.method === o) && (!n || i.once)) {
                delete this._events[e];
                i.recover();
            }
        } else {
            let a = 0;
            const r = i.length;
            for (let l = 0; l < r; l++) {
                const s = i[l];
                if (s) {
                    if (s && (!t || s.caller === t) && (null == o || s.method === o) && (!n || s.once)) {
                        a++;
                        i[l] = "NULL";
                        s.recover();
                    }
                } else {
                    i[l] = "NULL";
                    a++;
                }
            }
            if (a === r) delete this._events[e]; else if (a > 0) {
                let c = 0;
                for (let u = 0; u < r; ++u) {
                    const p = i[u];
                    if (null == p) {
                        i.splice(u);
                        break;
                    }
                    if ("NULL" == p) i[u] = null; else {
                        if (u != c) {
                            i[c] = p;
                            i[u] = null;
                        }
                        ++c;
                    }
                }
                i.length = r - a;
            }
        }
        return this;
    }

    _createListener(e, t, o, i, a, r?) {
        if (undefined === r) {
            r = true;
        }
        r && this.off(e, t, o, a);
        const l = EventHandler.create(t || this, o, i, a);
        l.register(this, e);
        this._events || (this._events = {});
        const s = this._events;
        s[e] ? s[e].run ? s[e] = [s[e], l] : s[e].push(l) : s[e] = l;
        return this;
    }

    event(e, t?) {
        if (undefined === t) {
            t = null;
        }
        if (!this._events || !this._events[e]) return false;
        const o = this._events[e];
        if (o.run) {
            o.once && delete this._events[e];
            o.check(this, e) && (null != t ? o.runWith(t) : o.run());
        } else {
            for (let n = 0, i = o.length; n < i; n++) {
                const a = o[n];
                a && a.check(this, e) && (null != t ? a.runWith(t) : a.run());
                if (!a || a.once) {
                    o.splice(n, 1);
                    n--;
                    i--;
                }
            }
            0 === o.length && this._events && delete this._events[e];
        }
        return true;
    }

    _recoverHandlers(e) {
        if (e) if (e.run) e.recover(); else for (let t = e.length - 1; t > -1; t--) if (e[t]) {
            e[t].recover();
            e[t] = null;
        }
    }

    once(e, t, o, n?) {
        if (undefined === n) {
            n = null;
        }
        return this._createListener(e, t, o, n, true);
    }

    offAllCaller(e) {
        if (e && this._events) for (const t in this._events) this.off(t, e, null);
        return this;
    }

    hasListener(e) {
        return !(!this._events || !this._events[e]);
    }

    offAll(e?) {
        if (undefined === e) {
            e = null;
        }
        const t = this._events;
        if (!t) return this;
        if (e) {
            this._recoverHandlers(t[e]);
            delete t[e];
        } else {
            for (const o in t) this._recoverHandlers(t[o]);
            this._events = null;
        }
        return this;
    }

    on(e, t, o, n?) {
        if (undefined === n) {
            n = null;
        }
        return this._createListener(e, t, o, n, false);
    }
}
