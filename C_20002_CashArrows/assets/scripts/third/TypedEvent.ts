export class TypedEventTarget {
    _eventMap: any = {};

    on(e: string, t: (...args: any[]) => void, i: any, n: boolean = !1) {
        "function" == typeof t ? i ? this.has(e, t, i) || (this._eventMap[e] = this._eventMap[e] || [], this._eventMap[e].push({
            callback: t, target: i, once: n
        }), i && Array.isArray(i.__eventTargets) && i.__eventTargets.push(this)) : console.error("Target is null or undefined.") : console.error("Callback for '" + e + "' is not a function.");
    }

    once(e: string, t: (...args: any[]) => void, i: any) {
        this.on(e, t, i, !0);
    }

    off(e: string, t: (...args: any[]) => void, i: any) {
        var n = this._eventMap[e];
        if (n && i) {
            var a = n.findIndex(function (e) {
                return e.callback === t && e.target === i;
            });
            a >= 0 && n.splice(a, 1);
            if (i && Array.isArray(i.__eventTargets)) {
                var o = i.__eventTargets.indexOf(this);
                o >= 0 && i.__eventTargets.splice(o, 1);
            }
        }
    }

    targetOff(e: any) {
        var t = this;
        if (e) {
            for (var i in this._eventMap) {
                var n = this._eventMap[i];
                n && (this._eventMap[i] = n.filter(function (t) {
                    return t.target !== e;
                }));
            }
            e && Array.isArray(e.__eventTargets) && (e.__eventTargets = e.__eventTargets.filter(function (e) {
                return e !== t;
            }));
        } else console.warn("Target is null or undefined.");
    }

    emit(e: string, ...args: any[]) {
        var t = this, i = args, o = this._eventMap[e];
        if (o) {
            var r = o.slice();
            r.forEach(function (n) {
                if ("function" == typeof n.callback) {
                    n.callback.apply(n.target, i);
                    n.once && t.off(e, n.callback, n.target);
                }
            });
        }
    }

    has(e: string, t: (...args: any[]) => void, i: any) {
        var n = this._eventMap[e];
        return !!n && n.some(function (e) {
            return e.callback === t && e.target === i;
        });
    }

    clear() {
        for (var e in this._eventMap) {
            var t = this._eventMap[e];
            if (t) for (var i = t.length - 1; i >= 0; i--) {
                var n = t[i];
                this.off(e, n.callback, n.target);
            }
        }
    }
}
