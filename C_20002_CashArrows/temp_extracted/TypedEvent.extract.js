TypedEvent: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "985d0HOgp1FhJl2rZuRSNJX", "TypedEvent");
var n = __spreadArrays;
Object.defineProperty(i, "__esModule", {
value: !0
});
i.TypedEventTarget = void 0;
var a = function() {
function e() {
this._eventMap = {};
}
e.prototype.on = function(e, t, i, n) {
void 0 === n && (n = !1);
"function" == typeof t ? i ? this.has(e, t, i) || (this._eventMap[e] = this._eventMap[e] || [], 
this._eventMap[e].push({
callback: t,
target: i,
once: n
}), i && Array.isArray(i.__eventTargets) && i.__eventTargets.push(this)) : console.error("Target is null or undefined.") : console.error("Callback for '" + e + "' is not a function.");
};
e.prototype.once = function(e, t, i) {
this.on(e, t, i, !0);
};
e.prototype.off = function(e, t, i) {
var n = this._eventMap[e];
if (n && i) {
var a = n.findIndex(function(e) {
return e.callback === t && e.target === i;
});
a >= 0 && n.splice(a, 1);
if (i && Array.isArray(i.__eventTargets)) {
var o = i.__eventTargets.indexOf(this);
o >= 0 && i.__eventTargets.splice(o, 1);
}
}
};
e.prototype.targetOff = function(e) {
var t = this;
if (e) {
for (var i in this._eventMap) {
var n = this._eventMap[i];
n && (this._eventMap[i] = n.filter(function(t) {
return t.target !== e;
}));
}
e && Array.isArray(e.__eventTargets) && (e.__eventTargets = e.__eventTargets.filter(function(e) {
return e !== t;
}));
} else console.warn("Target is null or undefined.");
};
e.prototype.emit = function(e) {
for (var t = this, i = [], a = 1; a < arguments.length; a++) i[a - 1] = arguments[a];
var o = this._eventMap[e];
if (o) {
var r = n(o);
r.forEach(function(n) {
if ("function" == typeof n.callback) {
n.callback.apply(n.target, i);
n.once && t.off(e, n.callback, n.target);
}
});
}
};
e.prototype.has = function(e, t, i) {
var n = this._eventMap[e];
return !!n && n.some(function(e) {
return e.callback === t && e.target === i;
});
};
e.prototype.clear = function() {
for (var e in this._eventMap) {
var t = this._eventMap[e];
if (t) for (var i = t.length - 1; i >= 0; i--) {
var n = t[i];
this.off(e, n.callback, n.target);
}
}
};
return e;
}();
i.TypedEventTarget = a;
cc._RF.pop();
}