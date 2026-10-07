let e = require;
let t = module;
let o = exports;
"use strict";
cc._RF.push(t, "c050fAEd41AwYRgBIpkZDgS", "game-table-physics-check");
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
    return null !== e&& e.apply(this, arguments)|| this;
  }
  t.prototype.onCollisionEnter = function() {
    console.log("on collision enter");
  }
;
  t.prototype.onPreSolve = function() {
    console.log("on collision onPreSolve");
  }
;
  t.prototype.onPostSolve = function() {
    console.log("on collision onPostSolve");
  }
;
  t.prototype.onEndContact = function() {
    console.log("on collision onEndContact");
  }
;
  t.prototype.onBeginContact = function(e, t, o) {
    var n, i, a = o.body.node, r = t.body.node;
    null === (i = null === (n = a.parent)|| void 0 === n? void 0: n.getComponent("game_table"))|| void 0 === i|| i.ballEnterHole(a, r);
  }
;
  t.prototype.onLoad = function() {
    cc.director.getCollisionManager().enabled = ! 0;
  }
;
  return a([l("game-table-physics-check")], t);
}
(cc.Component));
o.default = s;
cc._RF.pop();
