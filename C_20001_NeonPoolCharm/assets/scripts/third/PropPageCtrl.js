let e = require;
let t = module;
let o = exports;
"use strict";
cc._RF.push(t, "f84c4UiSBtIO6yUw99Omw29", "PropPageCtrl");
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
o.PROP_TYPE = void 0;
var r = e("PlayerDataSys.js"),
l = e("EventMgr.js"),
s = e("GameEventType.js"),
c = e("AdManager.js"),
u = e("SdkHelper.js"),
p = e("BasePageCtrl.js"),
d = e("AbTestMgr.js"),
_ = e("GameServiceMgr.js"),
f = e("UiManage.js"),
h = e("GameDataMgr.js"),
g = e("PropPage.js"),
y = cc._decorator,
v = y.ccclass,
m = y.menu;
o.PROP_TYPE = {
  remove: "remove",
  redo: "redo",
  refresh: "refresh"
}
;
cc._decorator.property;
var b = function(e) {
  i(t, e);
  function t() {
    var t = null !== e&& e.apply(this, arguments)|| this;
    t.ui = null;
    t._animType = null;
    t._touchControl = null;
    t._hasPeneLock = null;
    t._hasBlack = null;
    t._hasTouchLock = null;
    t.propType = null;
    return t;
  }
  t.prototype.clickClose = function() {
    this.hide();
  }
;
  t.prototype.start = function() {
  }
;
  t.prototype._init = function(e) {
    var t = e.propType;
    this.propType = t;
    this.ui.prop_remove.active = t == o.PROP_TYPE.remove;
    this.ui.prop_redo.active = t == o.PROP_TYPE.redo;
    this.ui.prop_refresh.active = t == o.PROP_TYPE.refresh;
    var n = h.default.props_status,
    i = n.props_can_ad_redo,
    a = n.props_can_ad_refresh,
    r = n.props_can_ad_remove,
    l = n.props_can_diamond_redo,
    s = n.props_can_diamond_refresh,
    c = n.props_can_diamond_remove;
    n.props_count_redo,
    n.props_count_refresh,
    n.props_count_remove,
    n.relive_can_ad,
    n.relive_can_diamond;
    if(t == o.PROP_TYPE.remove) {
      this.ui.btn_blue.active = 0 != c;
      this.ui.btn_green.active = 0 != r;
      this.ad_type = _.AD_TYPE.props_remove;
      this.ui.des.getComponent(cc.Label).string = i18n.t("prop_1");
      0 != c&& "s1" == d.default.ab_props_num&& (this.ui.diamond_num.getComponent(cc.Label).string = (100*(6- c)).toString());
    } else if(t == o.PROP_TYPE.redo) {
      this.ui.btn_blue.active = 0 != l;
      this.ui.btn_green.active = 0 != i;
      this.ad_type = _.AD_TYPE.props_redo;
      this.ui.des.getComponent(cc.Label).string = i18n.t("prop_2");
      0 != l&& "s1" == d.default.ab_props_num&& (this.ui.diamond_num.getComponent(cc.Label).string = (100*(6- l)).toString());
    } else if(t == o.PROP_TYPE.refresh) {
      this.ui.btn_blue.active = 0 != s;
      this.ui.btn_green.active = 0 != a;
      this.ad_type = _.AD_TYPE.props_refresh;
      this.ui.des.getComponent(cc.Label).string = i18n.t("prop_3");
      0 != s&& "s1" == d.default.ab_props_num&& (this.ui.diamond_num.getComponent(cc.Label).string = (100*(6- s)).toString());
    }
  }
;
  t.prototype.addButtonListen = function() {
    f.UiManager.addButtonListen(this.ui.btn_blue, this.clickdiamond, this);
    f.UiManager.addButtonListen(this.ui.btn_green, this.playVideo, this);
    f.UiManager.addButtonListen(this.ui.prop_close, this.clickClose, this);
  }
;
  t.prototype.onLoad = function() {
    this.onUILoad();
    this._animType = p.AnimType.SCALE;
    this._touchControl = ! 1;
    this._hasPeneLock = ! 0;
    this._hasBlack = ! 0;
    this._hasTouchLock = ! 1;
    e.prototype.onLoad.call(this);
    this.addButtonListen();
  }
;
  t.prototype.playVideo = function() {
    var e = this;
    this.propType == o.PROP_TYPE.remove? u.default.showBigToast(i18n.t("ad_toast_2")): this.propType == o.PROP_TYPE.redo? u.default.showBigToast(i18n.t("ad_toast_3")): this.propType == o.PROP_TYPE.refresh&& u.default.showBigToast(i18n.t("ad_toast_4"));
    c.default.getInstance().playNormalVideoAd(function() {
      _.default.report({
        ad_type: e.ad_type
      }
, function(t) {
        if(t) {
          t.cash, t.diamond;
          var n = t.props_status;
          t.user_info;
          h.default.props_status = n;
          l.default.trigger(s.default.UPDATE_PROP_ICON);
          l.default.trigger(s.default.GET_PROP, e.propType);
          if(e.propType == o.PROP_TYPE.remove) {
            u.default.reportData("u_game_event_complete", {
              act_page: "FunctionCardRemove"
            }
);
            u.default.reportData("play_ad_success", {
              act_page: "FunctionCardRemove"
            }
);
          } else if(e.propType == o.PROP_TYPE.redo) {
            u.default.reportData("u_game_event_complete", {
              act_page: "FunctionCardRetry"
            }
);
            u.default.reportData("play_ad_success", {
              act_page: "FunctionCardRetry"
            }
);
          } else if(e.propType == o.PROP_TYPE.refresh) {
            u.default.reportData("u_game_event_complete", {
              act_page: "FunctionCardShuffle"
            }
);
            u.default.reportData("play_ad_success", {
              act_page: "FunctionCardShuffle"
            }
);
          }
        }
        e.hide();
      }
, function() {
      }
);
    }
, function() {
    }
);
  }
;
  t.prototype.clickdiamond = function() {
    r.default.diamond_balance >= 100? _.default.useDiamond({
      props_id: this.propType
    }
): _.default.getDiamondList();
    this.hide();
  }
;
  t.prototype.onUILoad = function() {
    this.ui = this.node.addComponent(g.default);
  }
;
  t.prefabUrl = "PropPage";
  t.className = "PropPageCtrl";
  return a([v, m("UI/pages/PropPageCtrl")], t);
}
(p.default);
o.default = b;
cc._RF.pop();
