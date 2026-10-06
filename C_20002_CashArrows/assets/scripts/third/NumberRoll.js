let e = require;
let t = module;
let i = exports;
"use strict";
cc._RF.push(t, "7af9aKQXMNJAIv2x7PbRZqi", "NumberRoll");
var n = __extends,
a = __decorate;
Object.defineProperty(i, "__esModule", {
  value: ! 0
}
);
var o = e(NumberUtils "
} ].js), r = cc._decorator, s = r.ccclass, l = r.property, c = r.requireComponent, u = r.menu, d = function(e) {
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._lab = null;
t.duration = .2;
t.isInteger = !0;
t.unit = " ";
t._value = null;
t._curValue = 0;
return t;
}
n(t, e);
Object.defineProperty(t.prototype, " lab ", {
get: function() {
this._lab || (this._lab = this.getComponent(cc.Label));
return this._lab;
},
enumerable: !1,
configurable: !0
});
Object.defineProperty(t.prototype, " value ", {
get: function() {
return this._value;
},
set: function(e) {
if (e != this._value) if (this.isInteger && Math.abs(e - this._value) <= 1) this.curValue = e; else {
this._value = e;
cc.Tween.stopAllByTarget(this);
cc.tween(this).to(this.duration, {
curValue: e
}).start();
}
},
enumerable: !1,
configurable: !0
});
t.prototype.change = function(e) {
var t = this;
return new Promise(function(i) {
if (e == t._value) return i();
if (t.isInteger && Math.abs(e - t._value) <= 1) {
t.curValue = e;
i();
} else {
t._value = e;
cc.Tween.stopAllByTarget(t);
cc.tween(t).to(t.duration, {
curValue: e
}).call(function() {
i();
}).start();
}
});
};
t.prototype.set = function(e) {
cc.Tween.stopAllByTarget(this);
this.curValue = e;
};
Object.defineProperty(t.prototype, " curValue ", {
get: function() {
return this._curValue;
},
set: function(e) {
e = this.isInteger ? Math.floor(e) : o.default.decimalPlaces(e) > 2 ? Number(e.toFixed(2)) : e;
this._curValue = e;
this.lab.string = this.curValue + this.unit;
},
enumerable: !1,
configurable: !0
});
a([ l({
tooltip: " 动画时长 "
}) ], t.prototype, " duration ", void 0);
a([ l({
tooltip: " 是否为整型 "
}) ], t.prototype, " isInteger ", void 0);
a([ l({
tooltip: " 单位 "
}) ], t.prototype, " unit ", void 0);
return a([ s, c(cc.Label), u(" UI/ Cocos/ NumberRoll ") ], t);
}(cc.Component);
i.default = d;
cc._RF.pop();
