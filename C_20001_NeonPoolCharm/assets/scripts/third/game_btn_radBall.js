let e = require;
let t = module;
let o = exports;
"use strict";
cc._RF.push(t, "aad55x71opGSKPUZ7AjM6mK", "game_btn_radBall");
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
    t.pos_value = null;
    t.angle = null;
    t.cb_click = null;
    return t;
  }
  t.prototype.getPosValue = function() {
    return this.pos_value;
  }
;
  t.prototype.start = function() {
  }
;
  t.prototype.movetoPos = function(e) {
    if(e.mag() <= 40) {
      var t = cc.find("node_circle", this.node), o = cc.find("node_red", t);
      o.x = 40* e.x;
      o.y = 40* e.y;
    }
  }
;
  t.prototype.setInfo = function(e, t) {
    this.pos_value = e;
    this.angle = t;
    this.movetoPos(e);
    this.updateLabel();
  }
;
  t.prototype.onLoad = function() {
    var e = this;
    this.cb_click = this.cb_click|| null;
    this.pos_value = cc.v2(0, 0);
    this.angle = 0;
    this.node.on(cc.Node.EventType.TOUCH_START, function() {
    }
);
    this.node.on(cc.Node.EventType.TOUCH_MOVE, function() {
    }
);
    this.node.on(cc.Node.EventType.TOUCH_END, function() {
      e.cb_click&& e.cb_click();
    }
);
    this.node.on(cc.Node.EventType.TOUCH_CANCEL, function() {
    }
);
  }
;
  t.prototype.updateLabel = function() {
    cc.find("label_angle", this.node).getComponent(cc.Label).string = this.angle;
  }
;
  t.prototype.setClickCB = function(e) {
    this.cb_click = e|| null;
  }
;
  return a([l], t);
}
(cc.Component));
o.default = s;
cc._RF.pop();
