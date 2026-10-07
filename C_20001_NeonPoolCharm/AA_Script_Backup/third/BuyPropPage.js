let e = require;
let t = module;
let o = exports;
"use strict";
cc._RF.push(t, "5be7c+gN2JIbo8vvxxdRRx5", "BuyPropPage");
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
    t.BuyPropPage = null;
    t.node = null;
    t.page_bg = null;
    t.pop_close = null;
    t.bg04 = null;
    t.bg05 = null;
    t.bg07 = null;
    t.title_bg = null;
    t.prop_icon = null;
    t.title_label = null;
    t.desc_label = null;
    t.btn_green = null;
    t.btn_content = null;
    t.btn_buy_label = null;
    t.diamond_0 = null;
    t.btn_label = null;
    return t;
  }
  t.prototype.onLoad = function() {
    this.BuyPropPage = this.node;
    this.page_bg = this.BuyPropPage.getChildByName("page_bg");
    this.pop_close = this.page_bg.getChildByName("pop_close");
    this.bg04 = this.page_bg.getChildByName("bg04");
    this.bg05 = this.bg04.getChildByName("bg05");
    this.bg07 = this.bg04.getChildByName("bg07");
    this.title_bg = this.page_bg.getChildByName("title_bg");
    this.prop_icon = this.page_bg.getChildByName("prop_icon");
    this.title_label = this.page_bg.getChildByName("title_label");
    this.desc_label = this.page_bg.getChildByName("desc_label");
    this.btn_green = this.page_bg.getChildByName("btn_green");
    this.btn_content = this.btn_green.getChildByName("btn_content");
    this.btn_buy_label = this.btn_content.getChildByName("btn_buy_label");
    this.diamond_0 = this.btn_content.getChildByName("diamond_0");
    this.btn_label = this.btn_content.getChildByName("btn_label");
  }
;
  t.URL = "db://assets/resources/pages/BuyPropPage.prefab";
  return a([r], t);
}
(cc.Component);
o.default = l;
cc._RF.pop();
