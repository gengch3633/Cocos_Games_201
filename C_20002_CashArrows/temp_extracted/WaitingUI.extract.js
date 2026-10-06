WaitingUI: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "2502d9pF1JITYibRA06XHuL", "WaitingUI");
var n = __extends, a = __decorate;
Object.defineProperty(i, "__esModule", {
value: !0
});
var o = cc._decorator, r = o.ccclass;
o.property;
var s = function(e) {
function t() {
return null !== e && e.apply(this, arguments) || this;
}
n(t, e);
t.prototype._hideLoadingText = function() {
var e = [];
"function" == typeof this.getComponentsInChildren && (e = this.getComponentsInChildren(sp.Skeleton) || []);
(!e || e.length <= 0) && this.node && "function" == typeof this.node.getComponentsInChildren && (e = this.node.getComponentsInChildren(sp.Skeleton) || []);
if ((!e || e.length <= 0) && "function" == typeof this.getComponent) {
var t = this.getComponent(sp.Skeleton);
t && (e = [ t ]);
}
if (e && !(e.length <= 0)) for (var i = [ "jiazai", "jiazai1", "jiazai2", "jiazai3", "jiazai4", "jiazai5", "jiazai6" ], n = [ "img/加", "jiazai", "jiazai2", "jiazai3", "jiazai4", "jiazai5" ], a = 0; a < e.length; a++) {
var o = e[a];
if (o && o.isValid) {
for (var r = 0; r < i.length; r++) {
var s = i[r], l = "function" == typeof o.findBone ? o.findBone(s) : null;
if (l) {
l.scaleX = 0;
l.scaleY = 0;
}
}
for (var c = 0; c < n.length; c++) {
var u = n[c], d = "function" == typeof o.findSlot ? o.findSlot(u) : null;
d && d.color && (d.color.a = 0);
}
"function" == typeof o.invalidAnimationCache && o.invalidAnimationCache();
}
}
};
t.prototype.hide = function() {
this.node.active = !1;
};
t.prototype.show = function() {
var e, t;
this.node.active = !0;
this._hideLoadingText();
null === (e = this.scheduleOnce) || void 0 === e || e.call(this, this._hideLoadingText.bind(this), 0);
null === (t = this.getComponent(cc.Widget)) || void 0 === t || t.updateAlignment();
};
t.prototype.progress = function() {};
return a([ r ], t);
}(cc.Component);
i.default = s;
cc._RF.pop();
}