let e = require;
let t = module;
let o = exports;
"use strict";
cc._RF.push(t, "e4a5f69rKBBSZupsYIZVLJs", "GuideFinger");
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
var r = e("GodGuide.js"),
l = cc._decorator,
s = l.ccclass,
c = l.property,
u = (cc._decorator, function(e) {
  i(t, e);
  function t() {
    var t = null !== e&& e.apply(this, arguments)|| this;
    t.light = null;
    t.finger = null;
    return t;
  }
  t.prototype.play = function(e) {
    if(e == r.TouchType.Click) {
      this.light.node.active = ! 1;
      this.finger.setAnimation(0, "dian", ! 0);
    } else if(e == r.TouchType.DragHorizontal) {
      this.light.node.active = ! 0;
      this.finger.setAnimation(0, "you", ! 0);
      this.light.setAnimation(0, "heng", ! 0);
    } else if(e == r.TouchType.DragVertical) {
      this.light.node.active = ! 0;
      this.finger.setAnimation(0, "xia", ! 0);
      this.light.setAnimation(0, "shu", ! 0);
    }
  }
;
  t.prototype.start = function() {
  }
;
  a([c(sp.Skeleton)], t.prototype, "light", void 0);
  a([c(sp.Skeleton)], t.prototype, "finger", void 0);
  return a([s], t);
}
(cc.Component));
o.default = u;
cc._RF.pop();
