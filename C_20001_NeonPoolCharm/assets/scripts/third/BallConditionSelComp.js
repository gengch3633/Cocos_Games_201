let e = require;
let t = module;
let o = exports;
"use strict";
cc._RF.push(t, "07774b+WNdP3Lv8xR6eOZaY", "BallConditionSelComp");
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
s = (r.property, function(e) {
  i(t, e);
  function t() {
    var t = null !== e&& e.apply(this, arguments)|| this;
    t.isSel = null;
    t.idx = null;
    return t;
  }
  t.prototype.onLoad = function() {
    this.idx = this.idx|| 0;
    this.isSel = this.isSel|| 0;
    console.log("ball model onLoad", this.isSel);
  }
;
  t.prototype.open = function() {
    var e = this, t = this.node.getChildByName("node_gou");
    this.node.on(cc.Node.EventType.TOUCH_START, function() {
      if(255 == t.opacity) {
        t.opacity = 0;
        e.setIsSel(! 1);
      } else {
        t.opacity = 255;
        e.setIsSel(! 0);
      }
      console.log("ball model click", e.isSel);
    }
);
  }
;
  t.prototype.getIsSel = function() {
    return this.isSel;
  }
;
  t.prototype.setIsSel = function(e) {
    this.isSel = e;
  }
;
  t.prototype.update = function() {
  }
;
  return a([l], t);
}
(cc.Component));
o.default = s;
cc._RF.pop();
