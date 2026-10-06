let e = require;
let t = module;
let i = exports;
"use strict";
cc._RF.push(t, "4ba49CATs1Hrpfrfw38zfAD", "SortingGroup");
var n = __extends,
a = __decorate;
Object.defineProperty(i, "__esModule", {
  value: ! 0
}
);
i.SortingGroup = void 0;
var o = e(sortingDefine "
} ].js), r = cc._decorator, s = r.ccclass, l = r.property, c = r.disallowMultiple, u = r.executeInEditMode, d = r.menu, h = function(e) {
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._sortingLayer = o.SortingLayer.DEFAULT;
t._orderInLayer = 0;
return t;
}
n(t, e);
Object.defineProperty(t.prototype, " sortingLayer ", {
get: function() {
return this._sortingLayer;
},
set: function(e) {
this._sortingLayer = e;
this.node.sortingPriority = Math.sign(this._sortingLayer) * (Math.abs(this._sortingLayer) * o.ORDER_IN_LAYER_MAX + this._orderInLayer);
},
enumerable: !1,
configurable: !0
});
Object.defineProperty(t.prototype, " orderInLayer ", {
get: function() {
return this._orderInLayer;
},
set: function(e) {
this._orderInLayer = e;
this.node.sortingPriority = Math.sign(this._sortingLayer) * (Math.abs(this._sortingLayer) * o.ORDER_IN_LAYER_MAX + this._orderInLayer);
},
enumerable: !1,
configurable: !0
});
t.prototype.onEnable = function() {
this.node.sortingPriority = Math.sign(this._sortingLayer) * (Math.abs(this._sortingLayer) * o.ORDER_IN_LAYER_MAX + this._orderInLayer);
this.node.sortingEnabled = !0;
};
t.prototype.onDisable = function() {
this.node.sortingPriority = 0;
this.node.sortingEnabled = !1;
};
a([ l({
type: cc.Enum(o.SortingLayer)
}) ], t.prototype, " _sortingLayer ", void 0);
a([ l({
type: cc.Enum(o.SortingLayer)
}) ], t.prototype, " sortingLayer ", null);
a([ l({
type: cc.Float,
min: 0,
max: o.ORDER_IN_LAYER_MAX
}) ], t.prototype, " _orderInLayer ", void 0);
a([ l({
type: cc.Float,
min: 0,
max: o.ORDER_IN_LAYER_MAX
}) ], t.prototype, " orderInLayer ", null);
return a([ s, d(" UI/ Cocos/ SortingGroup "), c(), u() ], t);
}(cc.Component);
i.SortingGroup = h;
cc._RF.pop();
