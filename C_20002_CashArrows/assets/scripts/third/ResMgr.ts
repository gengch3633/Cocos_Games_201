// @ts-nocheck
import ResKeeper from "./ResKeeper";
import ResLoader from "./ResLoader";
import Singleton from "./Singleton";

const { __extends, __awaiter, __generator } = cc;
const n = __extends;
const a = __awaiter;
const o = __generator;
var r = Singleton, s = ResKeeper, l = ResLoader, c = function(e) {
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.resLoader = l.default.getInstance();
return t;
}
n(t, e);
Object.defineProperty(t.prototype, "remoteUrl", {
get: function() {
return this.resLoader.remoteUrl;
},
set: function(e) {
this.resLoader.remoteUrl = e;
},
enumerable: !1,
configurable: !0
});
t.prototype.getBundle = function(e) {
return this.resLoader.getBundle(e);
};
t.prototype.loadRes = function(e, t, i, n, a) {
void 0 === i && (i = null);
var o = i ? this.getKeeper(i) : this.resLoader;
return null == o ? void 0 : o.loadRes(e, t, n, a);
};
t.prototype.setSpriteFrame = function(e, t, i, n) {
void 0 === n && (n = null);
var a = n ? this.getKeeper(n) : this.getKeeper(e, !0);
return null == a ? void 0 : a.setSpriteFrame(e, t, i);
};
t.prototype.setSkeleton = function(e, t, i, n, r) {
void 0 === r && (r = null);
return a(this, void 0, Promise, function() {
var a;
return o(this, function() {
return [ 2, null == (a = r ? this.getKeeper(r) : this.getKeeper(e, !0)) ? void 0 : a.setSkeleton(e, t, i, n) ];
});
});
};
t.prototype.instantiate = function(e, t) {
var i = cc.instantiate(e);
return i ? (t && t.isValid && i.parent !== t && (i.parent = t), i) : null;
};
t.prototype.instantiateByUrl = function(e, t, i, n) {
return a(this, void 0, Promise, function() {
var a;
return o(this, function(o) {
switch (o.label) {
case 0:
return [ 4, this.resLoader.loadRes(e, cc.Prefab, i, n) ];

case 1:
return (a = o.sent()) ? [ 2, this.instantiate(a, t) ] : [ 2, null ];
}
});
});
};
t.prototype.getKeeper = function(e, t) {
void 0 === t && (t = !1);
if (!e || !e.isValid) return null;
var i = e.getComponent(s.default);
if (i) return i;
if (t) return e.addComponent(s.default);
var n = e instanceof cc.Node ? e : e.node;
return this.getKeeper(n.parent, t);
};
return t;
}(r.default);
export default  c;
