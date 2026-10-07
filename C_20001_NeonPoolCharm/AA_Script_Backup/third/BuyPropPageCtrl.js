let e = require;
let t = module;
let o = exports;
"use strict";
cc._RF.push(t, "ee9a5GemyJK6r1xE4vexOiK", "BuyPropPageCtrl");
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
var r = e("BasePageCtrl.js"),
l = e("PageMgr.js"),
s = e("PlayerDataSys.js"),
c = e("ConfigDataMgr.js"),
u = e("GameServiceMgr.js"),
p = e("UiManage.js"),
d = e("BuyPropPage.js"),
_ = cc._decorator,
f = _.ccclass,
h = _.menu;
cc._decorator.property;
var g = function(e) {
  i(t, e);
  function t() {
    var t = null !== e&& e.apply(this, arguments)|| this;
    t.ui = null;
    t._animType = null;
    t._touchControl = null;
    t._hasPeneLock = null;
    t._hasBlack = null;
    t._hasTouchLock = null;
    t._clickBuyBlock = null;
    t._prop_id = null;
    return t;
  }
  t.prototype.start = function() {
  }
;
  t.prototype.onClickBuy = function() {
    var e = this;
    if(! this._clickBuyBlock) {
      this._clickBuyBlock = ! 0;
      this.scheduleOnce(function() {
        e._clickBuyBlock = ! 1;
      }
, .5);
      s.default.getPropDiamondCoast(this._prop_id) > s.default.diamond_balance? l.default.showPage("DiamondPage"): u.default.useDiamond({
        props_id: ""+ this._prop_id
      }
, function() {
        e._clickBuyBlock = ! 1;
        e.clickClose();
      }
);
    }
  }
;
  t.prototype._init = function(e) {
    this._prop_id = e.prop_id;
    p.UiManager.loadSpriteFrame(this.ui.prop_icon, "prop", c.PropIconMap[this._prop_id]);
    var t = s.default.getPropDiamondCoast(this._prop_id);
    this.ui.btn_label.getComponent(cc.Label).string = ""+ t;
    this.ui.title_label.getComponent(cc.Label).string = i18n.t("prop_name_"+ this._prop_id);
    this.ui.desc_label.getComponent(cc.Label).string = i18n.t("prop_desc_"+ this._prop_id);
  }
;
  t.prototype.onEnable = function() {
    e.prototype.onEnable.call(this);
    this._clickBuyBlock = ! 1;
  }
;
  t.prototype.clickClose = function() {
    this.hide();
  }
;
  t.prototype.onLoad = function() {
    this.onUILoad();
    this._animType = r.AnimType.SCALE;
    this._touchControl = ! 1;
    this._hasPeneLock = ! 0;
    this._hasBlack = ! 0;
    this._hasTouchLock = ! 1;
    e.prototype.onLoad.call(this);
    this.addButtonListen();
  }
;
  t.prototype.onUILoad = function() {
    this.ui = this.node.addComponent(d.default);
    this.ui.btn_buy_label.getComponent(cc.Label).string = i18n.t("common_cost_diamond");
  }
;
  t.prototype.addButtonListen = function() {
    p.UiManager.addButtonListen(this.ui.btn_green, this.onClickBuy, this);
    p.UiManager.addButtonListen(this.ui.pop_close, this.clickClose, this);
  }
;
  t.prefabUrl = "BuyPropPage";
  t.className = "BuyPropPageCtrl";
  return a([f, h("UI/pages/BuyPropPageCtrl")], t);
}
(r.default);
o.default = g;
cc._RF.pop();
