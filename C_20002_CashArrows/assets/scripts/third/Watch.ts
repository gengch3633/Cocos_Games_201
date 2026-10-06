// @ts-nocheck

const { __spreadArrays } = cc;
let n;
const a = __spreadArrays;
export const nameof = function() {
return new Proxy({}, {
get: function(e, t) {
return t;
}
});
};
var o = Symbol("__$ignore$"), r = Symbol("isProxy"), s = Symbol("raw");
n = {};
[ "includes", "indexOf", "lastIndexOf" ].forEach(function(e) {
n[e] = function() {
for (var t = [], i = 0; i < arguments.length; i++) t[i] = arguments[i];
var n = c.toRaw(this), a = n[e].apply(n, t);
return -1 === a || !1 === a ? n[e].apply(n, t.map(function(e) {
return c.toRaw(e);
})) : a;
};
});
var l = n, c = function() {
function e(e) {
this._$eventTarget = new cc.EventTarget();
this._$srcTarget = null;
this._$dict = new WeakMap();
this._$hackKeys = [ "on", "once", "off", "targetOff", "emit", "clearAllEvent", "_$eventTarget", "_$srcTarget", "_$dict", o ];
this._$srcTarget = e;
}
e.isProxy = function(e) {
var t;
return null !== (t = e[r]) && void 0 !== t && t;
};
e.toRaw = function(t) {
var i = t && t[s];
return i ? e.toRaw(i) : t;
};
e.create = function(t) {
return e.isProxy(t) ? t : new Proxy(t, new e(t));
};
e.isObject = function(e) {
return null != e && "object" == typeof e;
};
e.hasChanged = function(e, t) {
return e !== t && (e == e || t == t);
};
e.prototype.get = function(t, i, n) {
if (i === r) return !0;
if (i === s) return t;
if (t === this._$srcTarget && this._$hackKeys.includes(i)) return Reflect.get(this, i);
if (Array.isArray(t)) {
if (l[i]) return Reflect.get(l, i, n);
if ("splice" === i) return this.customSplice.bind(this, t);
}
var a = Reflect.get(t, i, n);
if (!e.isObject(a)) return a;
if (e.isProxy(a)) return a;
var c = t[o];
if (null == c ? void 0 : c.includes(i)) return a;
var u = this._$dict.get(a);
if (!u) {
var d = new Proxy(a, this), h = i;
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
};
e.prototype.set = function(t, i, n, a) {
var o = Reflect.get(t, i, a), r = Reflect.set(t, i, n, a);
if (e.hasChanged(n, o)) {
var s = i;
if (t != this._$srcTarget) {
var l = this._$dict.get(t);
l && (s = l.fieldName);
}
this.emit(e.EventType.CHANGE, s, i, n, o);
}
return r;
};
e.prototype.customSplice = function(t, i, n) {
for (var o = [], r = 3; r < arguments.length; r++) o[r - 3] = arguments[r];
var s = this._$dict.get(t), l = t.length, c = t.splice.apply(t, a([ i, n ], o));
return l === t.length ? c : (this.emit(e.EventType.CHANGE, null == s ? void 0 : s.fieldName, "length", t.length, l), 
c);
};
e.prototype.on = function(t, i) {
for (var n = this, a = [], o = 2; o < arguments.length; o++) a[o - 2] = arguments[o];
null == a || a.forEach(function(a) {
return n._$eventTarget.on(e.EventType.CHANGE + "_" + String(a), t, i);
});
(!a || a.length <= 0) && this._$eventTarget.on(e.EventType.CHANGE, t, i);
};
e.prototype.once = function(t, i) {
for (var n = this, a = [], o = 2; o < arguments.length; o++) a[o - 2] = arguments[o];
null == a || a.forEach(function(a) {
return n._$eventTarget.once(e.EventType.CHANGE + "_" + String(a), t, i);
});
(!a || a.length <= 0) && this._$eventTarget.once(e.EventType.CHANGE, t, i);
};
e.prototype.off = function(t, i) {
for (var n = this, a = [], o = 2; o < arguments.length; o++) a[o - 2] = arguments[o];
null == a || a.forEach(function(a) {
return n._$eventTarget.off(e.EventType.CHANGE + "_" + String(a), t, i);
});
(!a || a.length <= 0) && this._$eventTarget.off(e.EventType.CHANGE, t, i);
};
e.prototype.targetOff = function(e) {
this._$eventTarget.targetOff(e);
};
e.prototype.emit = function(t, i, n, a, r) {
var s = null == this ? void 0 : this._$srcTarget[o];
if (!s || !s.includes(i)) {
t || (t = e.EventType.CHANGE);
null != i && this._$eventTarget.emit(t + "_" + String(i), i, n, a, r);
this._$eventTarget.emit(t, i, n, a, r);
}
};
e.prototype.clearAllEvent = function() {
this._$eventTarget.clear();
};
e.EventType = {
CHANGE: "Watch_Event_Change"
};
return e;
}();
export default  c;
export const ignoreWatch = function() {
return function(e, t) {
var i = e[o];
if (!i) {
i = [];
e[o] = i;
}
i.push(t);
};
};
