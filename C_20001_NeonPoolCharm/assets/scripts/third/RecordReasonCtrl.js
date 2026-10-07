let e = require;
let t = module;
let o = exports;
"use strict";
cc._RF.push(t, "3810dxczzxDvZ8kvUYXzpBJ", "RecordReasonCtrl");
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
var r = e("GameDataMgr.js"),
l = e("RecordReason.js"),
s = cc._decorator,
c = s.ccclass,
u = s.menu;
cc._decorator.property;
var p = function(e) {
  i(t, e);
  function t() {
    var t = null !== e&& e.apply(this, arguments)|| this;
    t.ui = null;
    return t;
  }
  t.prototype.addButtonListen = function() {
  }
;
  t.prototype.onUILoad = function() {
    this.ui = this.node.addComponent(l.default);
  }
;
  t.prototype.initData = function(e) {
    if(e&& 1 != e) {
      var t = "";
      switch(e) {
        case r.failReason.account_error: t = i18n.t("status_brief_2");
        break;
        case r.failReason.account_abnormal: t = i18n.t("status_brief_3");
        break;
        case r.failReason.merchat_exception: t = i18n.t("status_brief_4");
        break;
        case r.failReason.system_error: t = i18n.t("status_brief_5");
        break;
        case r.failReason.unknown_error: t = i18n.t("status_brief_6");
      }
      var o = i18n.t("feedback_dialog_word_3")+ " "+ t;
      this.ui.label_tips.getComponent(cc.Label).string = o|| "";
      this.ui.label_tips.getComponent(cc.Label)._forceUpdateRenderData&& this.ui.label_tips.getComponent(cc.Label)._forceUpdateRenderData();
      this.fitTips();
    }
  }
;
  t.prototype.onLoad = function() {
    this.onUILoad();
    this.addButtonListen();
  }
;
  t.prototype.fitTips = function() {
    this.ui.node_rect.width = this.ui.label_tips.getContentSize().width+ 50;
    this.ui.node_rect.x = this.ui.spr_jt.x- this.ui.node_rect.width/ 2+ 50;
    this.ui.label_tips.x = this.ui.node_rect.x;
  }
;
  t.prototype.start = function() {
  }
;
  t.prefabUrl = "assets/resources/prefabs/RecordReason";
  t.className = "RecordReasonCtrl";
  return a([c, u("UI/prefabs/RecordReasonCtrl")], t);
}
(cc.Component);
o.default = p;
cc._RF.pop();
