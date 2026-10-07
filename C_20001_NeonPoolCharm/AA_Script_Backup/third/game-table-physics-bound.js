let e = require;
let t = module;
let o = exports;
"use strict";
cc._RF.push(t, "a5787PzfylE/7VBsIA7RvdI", "game-table-physics-bound");
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
var r = e("GlobalConfig.js"),
l = cc._decorator,
s = l.ccclass,
c = l.property,
u = function(e) {
  i(t, e);
  function t() {
    var t = null !== e&& e.apply(this, arguments)|| this;
    t.size = cc.size(0, 0);
    t.mouseJoint = ! 0;
    t.target = null;
    return t;
  }
  t.prototype._addBound = function(e, t, o, n, i) {
    var a = e.addComponent(cc.PhysicsBoxCollider);
    a.offset.x = t;
    a.offset.y = o;
    a.size.width = n;
    a.size.height = i;
  }
;
  t.prototype.onLoad = function() {
    var e = cc.director.getPhysicsManager(),
    t = r.debug_physicDraw;
    e.debugDrawFlags = t? cc.PhysicsManager.DrawBits.e_aabbBit| cc.PhysicsManager.DrawBits.e_jointBit| cc.PhysicsManager.DrawBits.e_shapeBit: 0;
  }
;
  a([c], t.prototype, "size", void 0);
  a([c], t.prototype, "mouseJoint", void 0);
  a([c(cc.Node)], t.prototype, "target", void 0);
  return a([s], t);
}
(cc.Component);
o.default = u;
cc._RF.pop();
