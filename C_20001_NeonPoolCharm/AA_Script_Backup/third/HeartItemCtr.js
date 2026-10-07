let e = require;
let t = module;
let o = exports;
"use strict";
cc._RF.push(t, "45ec4H7UnJHyb3lexiL0PJH", "HeartItemCtr");
var n,
i = this&& this.__extends|| (n = function(e, t) {
  return(n = Object.setPrototypeOf|| {
    __proto__:[]
  }
  instanceof Array&& function(e, t) {
    e.__proto__ = t;
  }
|| function(e, t) {
    for(var o in t) Object.prototype.hasOwnProperty.call(t, o)&& (e[o] = t[o]);
  }
)(e, t);
}
, function(e, t) {
  n(e, t);
  function o() {
    this.constructor = e;
  }
  e.prototype = null === t? Object.create(t):(o.prototype = t.prototype, new o());
}
),
a = this&& this.__decorate|| function(e, t, o, n) {
  var i,
  a = arguments.length,
  r = a < 3? t: null === n? n = Object.getOwnPropertyDescriptor(t, o): n;
  if("object" == typeof Reflect&& "function" == typeof Reflect.decorate) r = Reflect.decorate(e, t, o, n);
  else for(var l = e.length- 1;
  l >= 0;
  l--)(i = e[l])&& (r = (a < 3? i(r): a > 3? i(t, o, r): i(t, o))|| r);
  return a > 3&& r&& Object.defineProperty(t, o, r),
  r;
}
;
Object.defineProperty(o, "__esModule", {
  value: ! 0
}
);
var r = cc._decorator,
l = r.ccclass,
s = r.menu,
c = r.property,
u = (cc._decorator, function(e) {
  i(t, e);
  function t() {
    var t = null !== e&& e.apply(this, arguments)|| this;
    t.heart_sk = null;
    t._aniState = null;
    return t;
  }
  t.prototype.onEnable = function() {
  }
;
  t.prototype.onAniComplete = function(e) {
    if("xiaochu" == e.animation.name) this.heart_sk.node.active = ! 1;
    else if("zengjia" == e.animation.name) {
      this._aniState;
      this.heart_sk.setAnimation(0, "diaji", ! 1);
    }
  }
;
  t.prototype.playXiaoChu = function() {
    if("xiaochu" != this._aniState) {
      this._aniState = "xiaochu";
      this.playCurAni();
    }
  }
;
  t.prototype.playDaiJi = function() {
    if("diaji" != this._aniState) {
      this._aniState = "diaji";
      this.playCurAni();
    }
  }
;
  t.prototype.playCurAni = function() {
    this.heart_sk.node.active = ! 0;
    this.heart_sk.setAnimation(0, this._aniState|| "diaji", ! 1);
  }
;
  t.prototype.playZengJia = function() {
    if("zengjia" != this._aniState&& "diaji" != this._aniState) {
      this._aniState = "zengjia";
      this.playCurAni();
    }
  }
;
  t.prototype.onDisable = function() {
  }
;
  t.prototype.onLoad = function() {
    this.heart_sk.setCompleteListener(this.onAniComplete.bind(this));
    this._aniState = this.heart_sk.defaultAnimation;
  }
;
  a([c(sp.Skeleton)], t.prototype, "heart_sk", void 0);
  return a([l, s("UI/pages/items/HeartItemCtr")], t);
}
(cc.Component));
o.default = u;
cc._RF.pop();
