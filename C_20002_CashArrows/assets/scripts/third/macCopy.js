let e = require;
let t = module;
let i = exports;
"use strict";
cc._RF.push(t, "9a6e5kVAAtAu6tQi+8hrwIQ", "macCopy");
var n = __extends,
a = __decorate;
Object.defineProperty(i, "__esModule", {
  value: ! 0
}
);
var o = e("Tips"),
r = e("UserData"),
s = e("LanguageService.js"),
l = cc._decorator,
c = l.ccclass;
l.property;
var u = function(e) {
  function t() {
    return null !== e&& e.apply(this, arguments)|| this;
  }
  n(t, e);
  t.prototype.copyMacTxt = function() {
    var e = "UID:"+ r.default.getInstance().userID;
    if(window.tt) window.tt.setClipboardData({
      data: e, success: function() {
        o.default.show(s.t("key_tip_copy_success"));
      }
, fail: function() {
        o.default.show(s.t("key_tip_copy_fail_manual"));
      }
    }
);
    else if(window.wx) window.wx.setClipboardData({
      data: e, success: function() {
        o.default.show(s.t("key_tip_copy_success"));
      }
, fail: function() {
        o.default.show(s.t("key_tip_copy_fail_manual"));
      }
    }
);
    else {
      var t = document.createElement("textarea");
      t.value = r.default.getInstance().userID;
      t.style.position = "fixed";
      t.style.opacity = "0";
      document.body.appendChild(t);
      t.focus();
      t.select();
      try {
        if(document.execCommand("copy")) {
          console.log("复制成功");
          o.default.show(s.t("key_tip_copy_success"));
        } else {
          console.error("复制失败");
          o.default.show(s.t("key_tip_copy_fail"));
        }
      } catch(e) {
        console.error("无法复制文本: ", e);
      }
      document.body.removeChild(t);
    }
  }
;
  t.prototype.copyFun = function() {
    window.tt? window.tt.setClipboardData({
      data: r.default.getInstance().userID, success: function() {
        o.default.show(s.t("key_tip_copy_success"));
      }
, fail: function() {
        o.default.show(s.t("key_tip_copy_fail_manual"));
      }
    }
): window.wx&& window.wx.setClipboardData({
      data: r.default.getInstance().userID, success: function() {
        o.default.show(s.t("key_tip_copy_success"));
      }
, fail: function() {
        o.default.show(s.t("key_tip_copy_fail_manual"));
      }
    }
);
  }
;
  return a([c], t);
}
(cc.Component);
i.default = u;
cc._RF.pop();
