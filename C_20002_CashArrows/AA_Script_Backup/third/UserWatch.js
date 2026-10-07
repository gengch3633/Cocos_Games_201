let e = require;
let t = module;
let i = exports;
"use strict";
cc._RF.push(t, "daedaJZYtdNqrvryCyOfY1r", "UserWatch");
var n = __spreadArrays;
Object.defineProperty(i, "__esModule", {
  value: ! 0
}
);
var a = e(Watch "
} ].js), o = function() {
function e() {
this._$watch = null;
}
e.getInstance = function() {
if (!this._ins) {
var e = new this();
e.create();
this._ins = e._$watch;
}
return this._ins;
};
e.prototype.create = function() {
this._$watch = a.default.create(this);
this.init();
};
e.prototype.on = function(e, t) {
for (var i, a = [], o = 2; o < arguments.length; o++) a[o - 2] = arguments[o];
(i = this._$watch).on.apply(i, n([ e, t ], a));
};
e.prototype.once = function(e, t) {
for (var i, a = [], o = 2; o < arguments.length; o++) a[o - 2] = arguments[o];
(i = this._$watch).once.apply(i, n([ e, t ], a));
};
e.prototype.off = function(e, t) {
for (var i, a = [], o = 2; o < arguments.length; o++) a[o - 2] = arguments[o];
(i = this._$watch).off.apply(i, n([ e, t ], a));
};
e.prototype.targetOff = function(e) {
this._$watch.targetOff(e);
};
e.prototype.clearAllEvent = function() {
this._$watch.clearAllEvent();
};
e.prototype.clear = function() {
var e;
this._$watch.clearAllEvent();
var t = null !== (e = this.constructor) && void 0 !== e ? e : Object.getPrototypeOf(this).constructor;
t ? t._ins = null : console.error(" clear error ");
};
return e;
}();
i.default = o;
cc._RF.pop();
