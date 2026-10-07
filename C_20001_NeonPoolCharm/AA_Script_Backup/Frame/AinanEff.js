let e = require;
let t = module;
let a = exports;
"use strict";
cc._RF.push(t, "0ac3bXudTBINq8G8snhFTCO", "AinanEff");
var o,
n = this&& this.__extends|| (o = function(e, t) {
  return(o = Object.setPrototypeOf|| {
    __proto__:[]
  }
  instanceof Array&& function(e, t) {
    e.__proto__ = t;
  }
|| function(e, t) {
    for(var a in t) Object.prototype.hasOwnProperty.call(t, a)&& (e[a] = t[a]);
  }
)(e, t);
}
, function(e, t) {
  o(e, t);
  function a() {
    this.constructor = e;
  }
  e.prototype = null === t? Object.create(t):(a.prototype = t.prototype, new a());
}
),
i = this&& this.__decorate|| function(e, t, a, o) {
  var n,
  i = arguments.length,
  r = i < 3? t: null === o? o = Object.getOwnPropertyDescriptor(t, a): o;
  if("object" == typeof Reflect&& "function" == typeof Reflect.decorate) r = Reflect.decorate(e, t, a, o);
  else for(var c = e.length- 1;
  c >= 0;
  c--)(n = e[c])&& (r = (i < 3? n(r): i > 3? n(t, a, r): n(t, a))|| r);
  return i > 3&& r&& Object.defineProperty(t, a, r),
  r;
}
;
Object.defineProperty(a, "__esModule", {
  value: ! 0
}
);
var r = cc._decorator,
c = r.ccclass,
s = r.property,
l = function(e) {
  n(t, e);
  function t() {
    var t = null !== e&& e.apply(this, arguments)|| this;
    t.dtime = .2;
    t.stime = .2;
    t.isHuXI = ! 1;
    t.showScale = .2;
    t.tween = null;
    return t;
  }
  t.prototype.onEnable = function() {
    var e = this;
    this.tween&& this.tween.stop();
    this.tween = cc.tween(this.node).hide().set({
      scaleX: this.showScale, scaleY: this.showScale
    }
).delay(this.dtime).show().to(this.stime, {
      scaleX: 1, scaleY: 1
    }
, {
      easing: "backOut"
    }
).call(function() {
      e.isHuXI? cc.tween(e.node).to(.5, {
        scale: 1.1
      }
, {
        easing: "sineInOut"
      }
).to(.5, {
        scale: 1
      }
, {
        easing: "sineInOut"
      }
).union().repeatForever().start(): e.tween = null;
    }
).start();
  }
;
  i([s], t.prototype, "dtime", void 0);
  i([s], t.prototype, "stime", void 0);
  i([s], t.prototype, "isHuXI", void 0);
  i([s], t.prototype, "showScale", void 0);
  return i([c], t);
}
(cc.Component);
a.default = l;
cc._RF.pop();
