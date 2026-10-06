let e = require;
let t = module;
let o = exports;
"use strict";
cc._RF.push(t, "10715abLzhKoYBjs1r8Jh0G", "CuePage");
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
var r = cc._decorator.ccclass,
l = function(e) {
  i(t, e);
  function t() {
    var t = null !== e&& e.apply(this, arguments)|| this;
    t.CuePage = null;
    t.node = null;
    t.page_bg = null;
    t.bg_ditu = null;
    t.top = null;
    t.btn_back = null;
    t.progressBar = null;
    t.progressLabel = null;
    t.cue_item_scv = null;
    t.cue_item_scv_view = null;
    t.cue_item_content = null;
    return t;
  }
  t.prototype.onLoad = function() {
    this.CuePage = this.node;
    this.page_bg = this.CuePage.getChildByName("page_bg");
    this.bg_ditu = this.page_bg.getChildByName("bg_ditu");
    this.top = this.page_bg.getChildByName("top");
    this.btn_back = this.top.getChildByName("btn_back");
    this.progressBar = this.top.getChildByName("progressBar");
    this.progressLabel = this.progressBar.getChildByName("progressLabel");
    this.cue_item_scv = this.top.getChildByName("cue_item_scv");
    this.cue_item_scv_view = this.cue_item_scv.getChildByName("cue_item_scv_view");
    this.cue_item_content = this.cue_item_scv_view.getChildByName("cue_item_content");
  }
;
  t.URL = "db://assets/resources/pages/CuePage.prefab";
  return a([r], t);
}
(cc.Component);
o.default = l;
cc._RF.pop();
