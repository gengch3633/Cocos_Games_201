let e = require;
let t = module;
let o = exports;
"use strict";
cc._RF.push(t, "a09a35so7VOsKvspHpPCYUh", "MusicToggleControl");
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
l = e("BallLogicMgr.js"),
s = cc._decorator,
c = s.ccclass,
u = s.property,
p = function(e) {
  i(t, e);
  function t() {
    var t = null !== e&& e.apply(this, arguments)|| this;
    t.toggle = null;
    t.label = null;
    t.reverse = ! 1;
    return t;
  }
  t.prototype.setLabel = function() {
    this.label&& (r.setting.music_effect? this.label.getComponent(cc.Label).string = "音乐开": this.label.getComponent(cc.Label).string = "音乐关");
  }
;
  t.prototype.callback = function(e) {
    console.log("callback", e.isChecked);
    r.music_toggle_set(e.isChecked);
    this.setLabel();
    e.isChecked? l.playBgMusic(): l.stopBgMusic();
  }
;
  t.prototype.onDestroy = function() {
  }
;
  t.prototype.onLoad = function() {
    var e = r.music_toggle_get();
    this.toggle.isChecked = e;
    this.setLabel();
    this.toggle.node.on("toggle", this.callback, this);
  }
;
  t.prototype.reset = function() {
    var e = r.music_toggle_get();
    this.toggle.isChecked = e;
    this.setLabel();
  }
;
  a([u(cc.Toggle)], t.prototype, "toggle", void 0);
  a([u(cc.Label)], t.prototype, "label", void 0);
  a([u], t.prototype, "reverse", void 0);
  return a([c], t);
}
(cc.Component);
o.default = p;
cc._RF.pop();
