let e = require;
let t = module;
let o = exports;
"use strict";
cc._RF.push(t, "4a0bbhjDVpM5o7sdebO2PxN", "velocity");
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
s = r.property,
c = function(e) {
  i(t, e);
  function t() {
    var t = null !== e&& e.apply(this, arguments)|| this;
    t.tmpNode = null;
    t.label = null;
    t.autoAllocTime = .5;
    t.allocedNodes = null;
    t.time = null;
    t.node = null;
    t.stop = null;
    return t;
  }
  t.prototype.allocNode = function() {
    if(this.node) {
      var e = cc.instantiate(this.tmpNode);
      e.parent = this.node;
      e.active = ! 0;
      e.getComponent(cc.RigidBody);
      this.allocedNodes++;
      this.label&& (this.label.string = "Nodes : "+ this.allocedNodes);
    }
  }
;
  t.prototype.update = function(e) {
    if(! this.stop) {
      this.time+= e;
      if(!(this.time < this.autoAllocTime)) {
        this.time = 0;
        this.allocNode();
      }
    }
  }
;
  t.prototype.onTouchStart = function() {
    this.stop = ! this.stop;
  }
;
  t.prototype.onLoad = function() {
    this.allocedNodes = 0;
    this.time = 0;
    cc.find("Canvas").on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
  }
;
  a([s({
    type: cc.Node
  }
)], t.prototype, "tmpNode", void 0);
  a([s({
    type: cc.Label
  }
)], t.prototype, "label", void 0);
  a([s], t.prototype, "autoAllocTime", void 0);
  return a([l], t);
}
(cc.Component);
o.default = c;
cc._RF.pop();
