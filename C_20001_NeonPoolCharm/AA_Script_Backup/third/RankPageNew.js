let e = require;
let t = module;
let o = exports;
"use strict";
cc._RF.push(t, "b96d7hwHO1BDbqySqGpTyBG", "RankPageNew");
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
    t.RankPageNew = null;
    t.node = null;
    t.bg = null;
    t.title_bg = null;
    t.title_label = null;
    t.top_desc_label = null;
    t.pop_close = null;
    t.rank_title_bg = null;
    t.rank_title_zhanghao = null;
    t.rank_title_defen = null;
    t.rank_title_xianjin = null;
    t.ScrollView = null;
    t.view = null;
    t.content = null;
    t.bottom_desc_richtext = null;
    return t;
  }
  t.prototype.onLoad = function() {
    this.RankPageNew = this.node;
    this.bg = this.RankPageNew.getChildByName("bg");
    this.title_bg = this.RankPageNew.getChildByName("title_bg");
    this.title_label = this.RankPageNew.getChildByName("title_label");
    this.top_desc_label = this.RankPageNew.getChildByName("top_desc_label");
    this.pop_close = this.RankPageNew.getChildByName("pop_close");
    this.rank_title_bg = this.RankPageNew.getChildByName("rank_title_bg");
    this.rank_title_zhanghao = this.rank_title_bg.getChildByName("rank_title_zhanghao");
    this.rank_title_defen = this.rank_title_bg.getChildByName("rank_title_defen");
    this.rank_title_xianjin = this.rank_title_bg.getChildByName("rank_title_xianjin");
    this.ScrollView = this.RankPageNew.getChildByName("ScrollView");
    this.view = this.ScrollView.getChildByName("view");
    this.content = this.view.getChildByName("content");
    this.bottom_desc_richtext = this.RankPageNew.getChildByName("bottom_desc_richtext");
  }
;
  t.URL = "db://assets/resources/pages/RankPageNew.prefab";
  return a([r], t);
}
(cc.Component);
o.default = l;
cc._RF.pop();
