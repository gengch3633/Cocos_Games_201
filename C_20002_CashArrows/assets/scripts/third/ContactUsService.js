let e = require;
let t = module;
let i = exports;
"use strict";
cc._RF.push(t, "bd6ccVyKtNNzooB57bftD6o", "ContactUsService");
Object.defineProperty(i, "__esModule", {
  value: ! 0
}
);
function n(t) {
  var i = e(t);
  return i&& i.default? i.default: i;
}
var a = "ashiqeuddin2022@gmail.com",
o = "Question from Cash Arrows";
function r() {
  return n("../migration-bundle/business-common/data/ClientDataStore");
}
function s(e) {
  var t,
  i = (t = n("../migration-bundle/business-common/platform/PlatformBridge"))&& "function" == typeof t.getNativeBridge? t.getNativeBridge(): null;
  i&& "function" == typeof i.showAppService? i.showAppService(e): cc.sys.openURL(e);
}
function l() {
  var e = n("../migration-bundle/business-common/middle/MiddleHelper");
  if(! e) return ! 1;
  if("function" == typeof e.getRegionalState) {
    var t = e.getRegionalState();
    return !(! t|| ! t.recogIRE);
  }
  return ! ! e.recogIRE;
}
function c(e, t) {
  var i = n("../migration-bundle/business-common/report/BusinessAnalyticsService");
  i&& i.reportData&& i.reportData(e, t|| {
  }
);
}
function u() {
  var e = r(),
  t = "------------------------------------\nAppName:Cash Arrows \nVersion:"+(e&& e.version_name? e.version_name: "")+ "\nModel:"+(e&& e.phone_model? e.phone_model: "")+ "\nDeviceID:"+(e&& e.device_id? e.device_id: "")+ "\n------------------------------------",
  i = "mailto:"+ a+ "?subject="+ encodeURIComponent(o)+ "&body="+ encodeURIComponent(t);
  cc.sys.openURL(i);
}
var d = {
  openContactUs: function() {
    if(l()) {
      c("click_jump_evaluate_btn");
      u();
    } else {
      var e = r(),
      t = e&& e.local_country? e.local_country: "",
      i = e&& e.device_id? e.device_id: "",
      n = e&& e.os_name? e.os_name: "",
      a = e&& e.box_pkg_name? e.box_pkg_name: "",
      o = "https://mph.casharrows.com/cahp/ocap/index.html#/casharrows/?cy="+ encodeURIComponent(t)+ "&device_id="+ encodeURIComponent(i)+ "&platform="+ encodeURIComponent(n)+ "&pkg_name="+ encodeURIComponent(a);
      c("p_click_helpcenter", {
        helpUrl: o
      }
);
      console.log("跳转客服链接:"+ o);
      s(o);
    }
  }
,
  openPrivacy: function() {
    s("https://casharrows.casharrows.com/CashArrows/");
  }
,
  openByShowAppService: s
}
;
i.default = d;
t.exports = d;
t.exports.default = d;
cc._RF.pop();
