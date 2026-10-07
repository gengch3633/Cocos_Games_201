let e = require;
let t = module;
let o = exports;
"use strict";
cc._RF.push(t, "aa716J0ygtNU4jJK3691NMB", "PropPage");
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
    t.PropPage = null;
    t.node = null;
    t.page_bg = null;
    t.prop_remove = null;
    t.prop_redo = null;
    t.prop_refresh = null;
    t.des = null;
    t.btn_blue = null;
    t.Dapatkan = null;
    t.prop_diamond = null;
    t.bracket = null;
    t.diamond_num = null;
    t.btn_green = null;
    t.prop_video = null;
    t.prop_close = null;
    return t;
  }
  t.prototype.onLoad = function() {
    this.PropPage = this.node;
    this.page_bg = this.PropPage.getChildByName("page_bg");
    this.prop_remove = this.page_bg.getChildByName("prop_remove");
    this.prop_redo = this.page_bg.getChildByName("prop_redo");
    this.prop_refresh = this.page_bg.getChildByName("prop_refresh");
    this.des = this.page_bg.getChildByName("des");
    this.btn_blue = this.page_bg.getChildByName("btn_blue");
    this.Dapatkan = this.btn_blue.getChildByName("Dapatkan");
    this.prop_diamond = this.btn_blue.getChildByName("prop_diamond");
    this.bracket = this.btn_blue.getChildByName("bracket");
    this.diamond_num = this.btn_blue.getChildByName("diamond_num");
    this.btn_green = this.page_bg.getChildByName("btn_green");
    this.prop_video = this.btn_green.getChildByName("prop_video");
    this.prop_close = this.PropPage.getChildByName("prop_close");
  }
;
  t.URL = "db://assets/resources/pages/PropPage.prefab";
  return a([r], t);
}
(cc.Component);
o.default = l;
cc._RF.pop();
