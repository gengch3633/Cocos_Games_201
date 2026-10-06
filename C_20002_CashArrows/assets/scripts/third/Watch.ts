const arrayHackMethods: any = {};

["includes", "indexOf", "lastIndexOf"].forEach(function(e) {
    arrayHackMethods[e] = function(this: any) {
        for (var t = [], i = 0; i < arguments.length; i++) t[i] = arguments[i];
        var n = Watch.toRaw(this), a = n[e].apply(n, t);
        return -1 === a || false === a ? n[e].apply(n, t.map(function(e) {
            return Watch.toRaw(e);
        })) : a;
    };
});

const arrayHack = arrayHackMethods;
const ignoreSymbol = Symbol("__$ignore$");
const isProxySymbol = Symbol("isProxy");
const rawSymbol = Symbol("raw");

export function nameof() {
    return new Proxy({}, {
        get: function(e, t) {
            return t;
        }
    });
}

export default class Watch {
    static EventType = {
        CHANGE: "Watch_Event_Change"
    };

    _$eventTarget: cc.EventTarget;
    _$srcTarget: any;
    _$dict: WeakMap<any, any>;
    _$hackKeys: string[];

    constructor(e: any) {
        this._$eventTarget = new cc.EventTarget();
        this._$srcTarget = null;
        this._$dict = new WeakMap();
        this._$hackKeys = ["on", "once", "off", "targetOff", "emit", "clearAllEvent", "_$eventTarget", "_$srcTarget", "_$dict", String(ignoreSymbol)];
        this._$srcTarget = e;
    }

    static isProxy(e: any) {
        var t;
        return null !== (t = e[isProxySymbol]) && void 0 !== t && t;
    }

    static toRaw(t: any) {
        var i = t && t[rawSymbol];
        return i ? Watch.toRaw(i) : t;
    }

    static create(t: any) {
        return Watch.isProxy(t) ? t : new Proxy(t, new Watch(t));
    }

    static isObject(e: any) {
        return null != e && "object" == typeof e;
    }

    static hasChanged(e: any, t: any) {
        return e !== t && (e == e || t == t);
    }

    get(t: any, i: string | symbol, n: any) {
        if (i === isProxySymbol) return true;
        if (i === rawSymbol) return t;
        if (t === this._$srcTarget && this._$hackKeys.includes(i as string)) return Reflect.get(this, i);
        if (Array.isArray(t)) {
            if (arrayHack[i as string]) return Reflect.get(arrayHack, i as string, n);
            if ("splice" === i) return this.customSplice.bind(this, t);
        }
        var a = Reflect.get(t, i, n);
        if (!Watch.isObject(a)) return a;
        if (Watch.isProxy(a)) return a;
        var c = t[ignoreSymbol];
        if (null == c ? void 0 : c.includes(i)) return a;
        var u = this._$dict.get(a);
        if (!u) {
            var d = new Proxy(a, this),
                h = i;
            if (t != this._$srcTarget) {
                var p = this._$dict.get(t);
                p && (h = p.fieldName);
            }
            u = {
                proxy: d,
                fieldName: h
            };
            this._$dict.set(a, u);
        }
        return u.proxy;
    }

    set(t: any, i: string | symbol, n: any, a: any) {
        var o = Reflect.get(t, i, a),
            r = Reflect.set(t, i, n, a);
        if (Watch.hasChanged(n, o)) {
            var s = i;
            if (t != this._$srcTarget) {
                var l = this._$dict.get(t);
                l && (s = l.fieldName);
            }
            this.emit(Watch.EventType.CHANGE, s, i, n, o);
        }
        return r;
    }

    customSplice(t: any, i: number, n: number, ...o: any[]) {
        var s = this._$dict.get(t),
            l = t.length,
            c = t.splice.apply(t, [i, n].concat(o));
        return l === t.length ? c : (this.emit(Watch.EventType.CHANGE, null == s ? void 0 : s.fieldName, "length", t.length, l), c);
    }

    on(t: any, i: any, ...a: any[]) {
        var n = this;
        null == a || a.forEach(function(a) {
            return n._$eventTarget.on(Watch.EventType.CHANGE + "_" + String(a), t, i);
        });
        (!a || a.length <= 0) && this._$eventTarget.on(Watch.EventType.CHANGE, t, i);
    }

    once(t: any, i: any, ...a: any[]) {
        var n = this;
        null == a || a.forEach(function(a) {
            return n._$eventTarget.once(Watch.EventType.CHANGE + "_" + String(a), t, i);
        });
        (!a || a.length <= 0) && this._$eventTarget.once(Watch.EventType.CHANGE, t, i);
    }

    off(t: any, i: any, ...a: any[]) {
        var n = this;
        null == a || a.forEach(function(a) {
            return n._$eventTarget.off(Watch.EventType.CHANGE + "_" + String(a), t, i);
        });
        (!a || a.length <= 0) && this._$eventTarget.off(Watch.EventType.CHANGE, t, i);
    }

    targetOff(e: any) {
        this._$eventTarget.targetOff(e);
    }

    emit(t: any, i: any, n: any, a: any, r: any) {
        var s = null == this ? void 0 : this._$srcTarget[ignoreSymbol];
        if (!s || !s.includes(i)) {
            t || (t = Watch.EventType.CHANGE);
            null != i && this._$eventTarget.emit(t + "_" + String(i), i, n, a, r);
            this._$eventTarget.emit(t, i, n, a, r);
        }
    }

    clearAllEvent() {
        this._$eventTarget.clear();
    }
}

export function ignoreWatch() {
    return function(e: any, t: string) {
        var i = e[ignoreSymbol];
        if (!i) {
            i = [];
            e[ignoreSymbol] = i;
        }
        i.push(t);
    };
}
