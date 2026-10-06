let e = require;
let t = module;
let o = exports;
"use strict";
cc._RF.push(t, "88f54qM31RPtJb8f9RBT042", "UsePropPage");
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
    t.UsePropPage = null;
    t.node = null;
    t.page_bg = null;
    t.btn_close = null;
    t.bg_8 = null;
    t.sp_icon_line = null;
    t.sp_icon_prop = null;
    t.richText = null;
    t.btn_get = null;
    t.icon_ad2 = null;
    t.adTipItem = null;
    t.hongbao_label = null;
    return t;
  }
  t.prototype.onLoad = function() {
    this.UsePropPage = this.node;
    this.page_bg = this.UsePropPage.getChildByName("page_bg");
    this.btn_close = this.page_bg.getChildByName("btn_close");
    this.bg_8 = this.page_bg.getChildByName("bg_8");
    this.sp_icon_line = this.bg_8.getChildByName("sp_icon_line");
    this.sp_icon_prop = this.bg_8.getChildByName("sp_icon_prop");
    this.richText = this.page_bg.getChildByName("richText");
    this.btn_get = this.page_bg.getChildByName("btn_get");
    this.icon_ad2 = this.btn_get.getChildByName("icon_ad2");
    this.adTipItem = this.page_bg.getChildByName("adTipItem");
    this.hongbao_label = this.adTipItem.getChildByName("layoutNode").getChildByName("hongbao_label");
  }
;
  t.URL = "db://assets/resources/pages/UsePropPage.prefab";
  return a([r], t);
}
(cc.Component);
o.default = l;
cc._RF.pop();
