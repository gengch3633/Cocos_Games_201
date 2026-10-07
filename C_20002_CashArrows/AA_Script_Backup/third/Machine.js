let e = require;
let t = module;
let i = exports;
"use strict";
cc._RF.push(t, "90620oggvxNm5yrpmMGo050", "Machine");
var n = __extends,
a = __decorate;
Object.defineProperty(i, "__esModule", {
  value: ! 0
}
);
var o = e(Random "
} ].js), r = cc._decorator, s = r.ccclass, l = r.property, c = function(e) {
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.item = null;
t.window = null;
t.isRolling = !1;
t.count = 0;
t.itemPool = new cc.NodePool();
return t;
}
n(t, e);
t.prototype.slot = function(e, t, i, n) {
var a = this;
void 0 === n && (n = null);
if (!this.isRolling) {
this.isRolling = !0;
this.count = Math.round(i / .1);
this.setWindowLayoutContent(e, t, n);
var o = this.window.children[0].y + this.window.parent.y;
cc.tween(this.window).to(i, {
y: -o
}, {
easing: " sineInOut "
}).call(function() {
a.isRolling = !1;
}).start();
}
};
t.prototype.scroll = function(e, t, i, n, a) {
var o = this;
void 0 === a && (a = null);
if (!this.isRolling) {
this.isRolling = !0;
this.setScrollLayoutContent(e, t, a);
var r = this.window.children[i].y + this.window.parent.height / 2;
cc.tween(this.window).to(n, {
y: -r
}, {
easing: " sineInOut "
}).call(function() {
o.isRolling = !1;
}).start();
}
};
t.prototype.setScrollLayoutContent = function(e, t, i) {
for (;this.window.children.length > 0; ) this.itemPool.put(this.window.children[this.window.children.length - 1]);
this.window.y = t * this.item.height;
for (var n = 0; n < e.length; n++) this.spawnItem(e[n], this.window, i);
this.window.getComponent(cc.Layout).updateLayout();
};
t.prototype.setWindowLayoutContent = function(e, t, i) {
for (;this.window.children.length > 0; ) this.itemPool.put(this.window.children[this.window.children.length - 1]);
this.window.y = 0;
this.spawnItem(e[t], this.window, i);
for (var n = 0; n < this.count; n++) this.spawnItem(e[o.default.range(0, e.length - 1)], this.window, i);
this.window.getComponent(cc.Layout).updateLayout();
};
t.prototype.spawnItem = function(e, t, i) {
void 0 === i && (i = null);
var n = this.itemPool.size() > 0 ? this.itemPool.get() : cc.instantiate(this.item);
n.getComponent(cc.Label).string = this.renderText(e);
n.getComponent(cc.Label)._forceUpdateRenderData();
t.addChild(n);
i && i(n.getComponent(cc.Label));
};
t.prototype.renderText = function(e) {
var t = null == (e += " ") ? void 0 : e.split("/ n ");
return t.length > 1 ? t[0] + " \ n " + t[1] : e;
};
a([ l(cc.Node) ], t.prototype, " item ", void 0);
a([ l(cc.Node) ], t.prototype, " window ", void 0);
return a([ s ], t);
}(cc.Component);
i.default = c;
cc._RF.pop();
