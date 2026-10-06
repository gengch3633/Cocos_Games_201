ResKeeper: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "b757aHJlNdI+r1CBiLedpkP", "ResKeeper");
var n = __extends, a = __decorate, o = __awaiter, r = __generator;
Object.defineProperty(i, "__esModule", {
value: !0
});
var s = e("ResLoader"), l = cc._decorator, c = l.ccclass;
l.property;
var u = function(e) {
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.caches = new Set();
return t;
}
n(t, e);
t.prototype.onLoad = function() {
this.bindSelfAsset();
};
Object.defineProperty(t.prototype, "selfAsset", {
get: function() {
var e;
return null === (e = this.node._prefab) || void 0 === e ? void 0 : e.asset;
},
enumerable: !1,
configurable: !0
});
t.prototype.bindSelfAsset = function() {
this.addAsset(this.selfAsset);
};
t.prototype.removeSelfAsset = function() {
this.caches.delete(this.selfAsset);
};
t.prototype.addAsset = function(e) {
if (!e || !this.isValid || this.caches.has(e)) return e;
e.addRef();
this.caches.add(e);
};
t.prototype.getBundle = function(e) {
return s.default.getInstance().getBundle(e);
};
t.prototype.loadRes = function(e, t, i, n) {
return o(this, void 0, Promise, function() {
var a;
return r(this, function(o) {
switch (o.label) {
case 0:
return [ 4, s.default.getInstance().loadRes(e, t, i, n) ];

case 1:
(a = o.sent()) && this.addAsset(a);
return [ 2, a ];
}
});
});
};
t.prototype.setSpriteFrame = function(e, t, i) {
return o(this, void 0, Promise, function() {
var n, a;
return r(this, function(o) {
switch (o.label) {
case 0:
return [ 4, this.loadRes(t, cc.SpriteFrame, i) ];

case 1:
n = o.sent();
a = null;
e instanceof cc.Sprite ? a = e : e.isValid && (a = null == e ? void 0 : e.getComponent(cc.Sprite));
(null == a ? void 0 : a.isValid) && (a.spriteFrame = n);
return [ 2 ];
}
});
});
};
t.prototype.setSkeleton = function(e, t, i, n) {
return o(this, void 0, Promise, function() {
var a, o;
return r(this, function(r) {
switch (r.label) {
case 0:
return [ 4, this.loadRes(t, sp.SkeletonData, i) ];

case 1:
a = r.sent();
o = null;
e instanceof sp.Skeleton ? o = e : e.isValid && (o = null == e ? void 0 : e.getComponent(sp.Skeleton));
if (null == o ? void 0 : o.isValid) {
o.skeletonData = a;
n && (o.animation = n);
}
return [ 2 ];
}
});
});
};
t.prototype.removeAsset = function(e) {
return e && this.caches.delete(e) ? (e.decRef(), e) : e;
};
t.prototype.releaseAll = function(e) {
var t = this;
void 0 === e && (e = !0);
this.caches.forEach(function(e) {
t.selfAsset;
t.removeAsset(e);
});
};
t.prototype.clearAll = function() {
this.caches.clear();
};
t.prototype.instantiate = function(e, t) {
var i = cc.instantiate(e);
return i ? (e instanceof cc.Prefab && this.addAsset(e), t && (i.parent = t), i) : null;
};
t.prototype.instantiateByUrl = function(e, t, i, n) {
return o(this, void 0, Promise, function() {
var a;
return r(this, function(o) {
switch (o.label) {
case 0:
return [ 4, this.loadRes(e, cc.Prefab, i, n) ];

case 1:
return (a = o.sent()) ? [ 2, this.instantiate(a, t) ] : [ 2, null ];
}
});
});
};
t.prototype.onDestroy = function() {
this.releaseAll();
};
return a([ c ], t);
}(cc.Component);
i.default = u;
cc._RF.pop();
}