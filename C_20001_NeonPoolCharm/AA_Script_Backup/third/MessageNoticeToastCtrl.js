let e = require;
let t = module;
let o = exports;
"use strict";
cc._RF.push(t, "47450oNKdtM0o+Ez+lCmfv7", "MessageNoticeToastCtrl");
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
var r = e("PlayerDataSys.js"),
l = e("EventMgr.js"),
s = e("GameEventType.js"),
c = e("SdkHelper.js"),
u = e("MessageNoticeToast.js"),
p = cc._decorator,
d = p.ccclass,
_ = p.menu;
cc._decorator.property;
var f = function(e) {
  i(t, e);
  function t() {
    var t = null !== e&& e.apply(this, arguments)|| this;
    t.ui = null;
    t.btn_goto = null;
    return t;
  }
  t.prototype.addEvent = function() {
    l.default.listen(s.default.HIDE_MESSAGE, this.hideMessage, this);
    l.default.listen(s.default.PUSH_MESSAGE, this.pushAction, this);
  }
;
  t.prototype.onUILoad = function() {
    this.ui = this.node.addComponent(u.default);
  }
;
  t.prototype.onDestroy = function() {
    this.removeEvent();
  }
;
  t.prototype.hideMessage = function() {
    cc.Tween.stopAllByTarget(this.ui.content);
    this.ui.content.active = ! 1;
    this.ui.content.y = cc.winSize.height/ 2+ this.ui.content.height;
  }
;
  t.prototype.start = function() {
    this.hideMessage();
  }
;
  t.prototype.removeEvent = function() {
    l.default.ignore(s.default.HIDE_MESSAGE, this.hideMessage, this);
    l.default.ignore(s.default.PUSH_MESSAGE, this.pushAction, this);
  }
;
  t.prototype.onLoad = function() {
    this.onUILoad();
    this.addButtonListen();
    this.addEvent();
    this.btn_goto = this.ui.content.getComponent(cc.Button);
  }
;
  t.prototype.pushAction = function(e) {
    if(e) {
      var t = e.amount,
      o = e.status,
      n = e.channel,
      i = e.order_code;
      e.callback;
      this.btn_goto.interactable = ! 0;
      this.ui.icon_tips_fail.active = ! 1;
      this.ui.icon_tips_success.active = ! 1;
      "shopee" == n&& (n = "shopeepay");
      if(0 == o);
      else if(1 == o) {
        this.ui.icon_tips_fail.active = ! 0;
        this.ui.label_tips_top.getComponent(cc.Label).string = i18n.t("feedback_dialog_word_1");
        var a = ""+ r.default.getCashUnit()+ r.default.getCashBalance(t);
        this.ui.label_tips_content.getComponent(cc.Label).string = i18n.t("feedback_push_word_4", {
          0: a
        }
);
        c.default.reportData("withdraw_push_popup_fail");
        c.default.reportData("withdraw_result_fail", {
          channel: n, order_code: i
        }
);
      } else if(2 == o) {
        this.ui.icon_tips_success.active = ! 0;
        this.ui.label_tips_top.getComponent(cc.Label).string = i18n.t("status_brief_1");
        a = ""+ r.default.getCashUnit()+ r.default.getCashBalance(t);
        var l = n.toUpperCase();
        this.ui.label_tips_content.getComponent(cc.Label).string = i18n.t("feedback_push_word_2", {
          0: a, 1: l
        }
);
        c.default.reportData("withdraw_push_popup_success");
        c.default.reportData("withdraw_result_success", {
          channel: n
        }
);
      }
      this.ui.content.active = ! 0;
      cc.tween(this.ui.content).to(.3, {
        position: cc.v3(0, cc.winSize.height/ 2- this.ui.content.height, 0)
      }
, {
        easing: "backOut"
      }
).call(function() {
      }
).delay(2).to(.5, {
        position: cc.v3(0, cc.winSize.height/ 2+ this.ui.content.height, 0)
      }
, {
        easing: "backIn"
      }
).start();
    }
  }
;
  t.prototype.addButtonListen = function() {
  }
;
  t.prototype.initData = function() {
  }
;
  t.prefabUrl = "assets/resources/prefabs/MessageNoticeToast";
  t.className = "MessageNoticeToastCtrl";
  return a([d, _("UI/prefabs/MessageNoticeToastCtrl")], t);
}
(cc.Component);
o.default = f;
cc._RF.pop();
