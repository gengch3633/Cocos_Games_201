Pool: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "000fepgfqpMl4LpYBSTtm5g", "NodePool");
var n = __extends, a = __awaiter, o = __generator;
Object.defineProperty(i, "__esModule", {
value: !0
});
var r = e("ResMgr"), s = function(e) {
function t(t) {
void 0 === t && (t = 0);
var i = e.call(this, t) || this;
i.eventTarget = new cc.EventTarget();
i.isDelayPut = !1;
i.setValidAction(i.isValid);
return i;
}
n(t, e);
t.prototype.setCreateActionByAssetUrl = function(e, t, i) {
void 0 === t && (t = "");
void 0 === i && (i = null);
return a(this, void 0, Promise, function() {
var n;
return o(this, function(a) {
switch (a.label) {
case 0:
return [ 4, r.default.getInstance().loadRes(e, cc.Prefab, null, t) ];

case 1:
return (n = a.sent()) ? (this.setCreateAction(function() {
return r.default.getInstance().instantiate(n, i);
}), [ 2, !0 ]) : [ 2, !1 ];
}
});
});
};
t.prototype.setCloneAsset = function(e, t) {
void 0 === t && (t = null);
if (e) {
e instanceof cc.Node && (e.active = !1);
return this.setCreateAction(function() {
return r.default.getInstance().instantiate(e, t);
});
}
};
t.prototype.setCreateAction = function(t) {
return e.prototype.setCreateAction.call(this, t);
};
t.prototype.setValidAction = function(t) {
return e.prototype.setValidAction.call(this, t);
};
t.prototype.get = function() {
var i = e.prototype.get.call(this);
return i ? (i.active = !1, this.eventTarget.emit(t.EventType.USED, i, this), i.emit(t.EventType.USED, i, this), 
i) : null;
};
t.prototype.setInitSize = function(e, t) {
void 0 === t && (t = null);
for (var i = 0; i < e; i++) {
var n = this.get();
t && t(n);
this.put(n);
}
};
t.prototype.put = function(i) {
var n = this;
if (!i || !i.isValid || !cc.isValid(i, !0)) return !1;
var a = function() {
return !!e.prototype.put.call(n, i) && (cc.isValid(i, !0) && (i.active = !1), n.eventTarget.emit(t.EventType.UNUSE, i, n), 
null == i || i.emit(t.EventType.UNUSE, i, n), !0);
};
return this.isDelayPut ? (setTimeout(a, 0), !0) : a();
};
t.prototype.put2 = function(e) {
if (!this.validAction(e)) {
var i = this.lendArr.indexOf(e);
i >= 0 && (this.lendArr[i] = null);
return !1;
}
if (this.arr.indexOf(e) >= 0) return !1;
var n = this.lendArr.indexOf(e);
n >= 0 && (this.lendArr[n] = null);
this.arr.push(e);
e.active = !1;
this.eventTarget.emit(t.EventType.UNUSE, e, this);
null == e || e.emit(t.EventType.UNUSE, e, this);
return !0;
};
t.prototype.isValid = function(e) {
return e && e.isValid && cc.isValid(e, !0);
};
t.prototype.clear = function() {
for (var e, t, i, n; (null === (e = null == this ? void 0 : this.lendArr) || void 0 === e ? void 0 : e.length) > 0; ) this.put(this.lendArr.pop());
for (;(null === (t = null == this ? void 0 : this.arr) || void 0 === t ? void 0 : t.length) > 0; ) null === (n = null === (i = null == this ? void 0 : this.arr) || void 0 === i ? void 0 : i.pop()) || void 0 === n || n.destroy();
};
t.EventType = {
UNUSE: "NodePool_Event_UNUSE",
USED: "NodePool_Event_USED"
};
return t;
}(e("Pool").default);
i.default = s;
cc._RF.pop();
}