let e = require;
let t = module;
let o = exports;
"use strict";
cc._RF.push(t, "d527e4c9CNPRrqoB8k6su9A", "SoundToggleControl");
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
    t.toggle = null;
    t.label = null;
    t.reverse = ! 1;
    return t;
  }
  t.prototype.callback = function(e) {
    console.log("callback", e.isChecked);
    r.sound_toggle_set(e.isChecked);
    this.setLabel();
  }
;
  t.prototype.onLoad = function() {
    var e = r.sound_toggle_get();
    this.toggle.isChecked = e;
    this.setLabel();
    this.toggle.node.on("toggle", this.callback, this);
  }
;
  t.prototype.onDestroy = function() {
  }
;
  t.prototype.reset = function() {
    var e = r.sound_toggle_get();
    this.toggle.isChecked = e;
    this.setLabel();
  }
;
  t.prototype.setLabel = function() {
    this.label&& (r.setting.sound_effect? this.label.getComponent(cc.Label).string = "音效开": this.label.getComponent(cc.Label).string = "音效关");
  }
;
  a([c(cc.Toggle)], t.prototype, "toggle", void 0);
  a([c(cc.Label)], t.prototype, "label", void 0);
  a([c], t.prototype, "reverse", void 0);
  return a([s], t);
}
(cc.Component);
o.default = u;
cc._RF.pop();
