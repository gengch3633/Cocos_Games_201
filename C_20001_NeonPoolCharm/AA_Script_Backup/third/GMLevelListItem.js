let e = require;
let t = module;
let o = exports;
"use strict";
cc._RF.push(t, "c45e0TzBOZHPJeooAiz9qA5", "GMLevelListItem");
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
var r = e("UiManage.js"),
l = cc._decorator,
s = l.ccclass,
c = l.menu,
u = l.property,
p = (cc._decorator, function(e) {
  i(t, e);
  function t() {
    var t = null !== e&& e.apply(this, arguments)|| this;
    t.item_name_label = null;
    t._label = null;
    return t;
  }
  t.prototype.setLabel = function(e) {
    this._label = e;
    this.item_name_label&& (this.item_name_label.string = e);
  }
;
  t.prototype.onClick = function() {
    this.onClickCB&& this.onClickCB(this);
  }
;
  t.prototype.onLoad = function() {
    r.UiManager.addButtonListen(this.node, this.onClick, this);
  }
;
  t.prototype.onEnable = function() {
    this.item_name_label&& this._label&& (this.item_name_label.string = this._label);
  }
;
  a([u(cc.Label)], t.prototype, "item_name_label", void 0);
  return a([s, c("UI/pages/items/GMLevelListItem")], t);
}
(cc.Component));
o.default = p;
cc._RF.pop();
