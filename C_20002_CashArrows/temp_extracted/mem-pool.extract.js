"mem-pool": [ function(e, t) {
"use strict";
cc._RF.push(t, "eb867q6FuVAJZx9bNvhENm2", "mem-pool");
var i = function(e) {
this._unitClass = e;
this._pool = [];
this._findOrder = [];
}, n = i.prototype;
n._initNative = function() {
this._nativeMemPool = new renderer.MemPool();
};
n._buildUnit = function(e) {
return new this._unitClass(e, this);
};
n._destroyUnit = function(e) {
this._pool[e] = null;
for (var t = 0, i = this._findOrder.length; t < i; t++) {
var n = this._findOrder[t];
if (n && n.unitID == e) {
this._findOrder.splice(t, 1);
break;
}
}
};
n._findUnitID = function() {
for (var e = 0, t = this._pool; t[e]; ) e++;
return e;
};
n.pop = function() {
for (var e = null, t = 0, i = this._findOrder, n = this._pool, a = i.length; t < a; t++) {
var o = i[t];
if (o && o.hasSpace()) {
e = o;
break;
}
}
if (!e) {
var r = this._findUnitID();
e = this._buildUnit(r);
n[r] = e;
i.push(e);
t = i.length - 1;
}
var s = i[0];
if (s !== e) {
i[0] = e;
i[t] = s;
}
return e.pop();
};
n.push = function(e) {
var t = this._pool[e.unitID];
t.push(e.index);
this._findOrder.length > 1 && t.isAllFree() && this._destroyUnit(e.unitID);
return t;
};
t.exports = i;
cc._RF.pop();
}