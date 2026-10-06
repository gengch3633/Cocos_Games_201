let e = require;
let t = module;
let o = exports;
"use strict";
cc._RF.push(t, "e4687Uo/wtEf5RXRUkXN8r2", "MainUI");
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
    t.MainUI = null;
    t.bg = null;
    t.top_area = null;
    t.btn_setting = null;
    t.holeSprite = null;
    t.tableSprite = null;
    t.bottom_area = null;
    t.idLabel = null;
    t.versionLabel = null;
    t.btn_star = null;
    t.cue_label = null;
    t.star_redpoint = null;
    t.btn_paly = null;
    t.ptb_size_container = null;
    t.guideTips = null;
    t.bg_qipao_ptb2 = null;
    t.withdrawRichText = null;
    t.layoutNode = null;
    t.btn_play_label = null;
    t.roundRichText = null;
    t.turnProgressBar = null;
    t.progressLabel = null;
    t.light = null;
    return t;
  }
  t.prototype.onLoad = function() {
    this.MainUI = this.node;
    this.bg = this.MainUI.getChildByName("bg");
    this.top_area = this.MainUI.getChildByName("top_area");
    this.btn_setting = this.top_area.getChildByName("btn_setting");
    this.holeSprite = this.MainUI.getChildByName("holeSprite");
    this.tableSprite = this.MainUI.getChildByName("tableSprite");
    this.bottom_area = this.MainUI.getChildByName("bottom_area");
    this.idLabel = this.bottom_area.getChildByName("idLabel");
    this.versionLabel = this.bottom_area.getChildByName("versionLabel");
    this.btn_star = this.bottom_area.getChildByName("btn_star");
    this.cue_label = this.btn_star.getChildByName("cue_label");
    this.star_redpoint = this.btn_star.getChildByName("star_redpoint");
    this.btn_paly = this.bottom_area.getChildByName("btn_paly");
    this.ptb_size_container = this.btn_paly.getChildByName("ptb_size_container");
    this.guideTips = this.ptb_size_container.getChildByName("guideTips");
    this.bg_qipao_ptb2 = this.ptb_size_container.getChildByName("bg_qipao_ptb2");
    this.withdrawRichText = this.bg_qipao_ptb2.getChildByName("withdrawRichText");
    this.layoutNode = this.btn_paly.getChildByName("layoutNode");
    this.btn_play_label = this.layoutNode.getChildByName("btn_play_label");
    this.roundRichText = this.layoutNode.getChildByName("roundRichText");
    this.turnProgressBar = this.layoutNode.getChildByName("progressNode").getChildByName("turnProgressBar");
    this.progressLabel = this.turnProgressBar.getChildByName("progressLabel");
    this.light = this.btn_paly.getChildByName("light");
  }
;
  t.URL = "db://assets/resources/pages/MainUI.prefab";
  return a([r], t);
}
(cc.Component);
o.default = l;
cc._RF.pop();
