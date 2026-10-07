let e = require;
let t = module;
let i = exports;
"use strict";
cc._RF.push(t, "ab766gBlP5EPL1Kjw774v1D", "GEMgr");
Object.defineProperty(i, "__esModule", {
  value: ! 0
}
);
var n = e("BusinessAnalyticsService.js"),
a = {
  accessToken: "p9h18yqUnckfZswrw3sBbjEdDH0MtnXm",
  clientId: "your_client_id",
  autoTrack: {
    appLaunch: ! 0,
    appShow: ! 0,
    appHide: ! 0
  }
,
  sendTimeout: 3e3,
  maxRetries: 3,
  enablePersistence: ! 0,
  asyncPersistence: ! 1,
  name: "ge"
}
;
function o(e, t) {
  var i = t|| {
  }
;
  n.default.reportData(e, i);
}
function r() {
  return {
    track: function(e, t) {
      o(e, t);
    }
,
    adShowEvent: function(e, t, i) {
      o("ad_show_event", {
        ad_channel: e, ad_position: t, custom_param: i&& i.custom_param|| ""
      }
);
    }
  }
;
}
var s = function() {
  function e() {
  }
  e.GESetup = function(e) {
    console.log("ge setup:", e);
  }
;
  e.GEInit = function(e) {
    if(null == e|| "" == e) {
      console.log("openidInit openid is null");
      return Promise.resolve();
    }
    console.log("ge init:", e);
    a.clientId = e;
    this.ge = r();
    this.isInit = ! 0;
    return Promise.resolve();
  }
;
  e.GEShowAD = function(e) {
    o("ad_show_event", {
      ad_channel: "reward", ad_position: e, custom_param: ""
    }
);
    return Promise.resolve();
  }
;
  e.GEShowADEvent = function(e) {
    o("userAction", {
      action: e, module: e, isAD: 1
    }
);
    return Promise.resolve();
  }
;
  e.GEReportEvent = function(e) {
    var t = 0,
    i = e.split("-")[0],
    n = e.substring(i.length+ 1);
    e.indexOf("AD") > - 1&& (t = 1);
    console.log("GEReportEvent:", t, i, n);
    o("userAction", {
      action: n, module: i, isAD: t
    }
);
    return Promise.resolve();
  }
;
  e.trackEvent = function(e, t) {
    console.log("引力打点操作>>> trackEvent", e, t);
    o(e, t);
  }
;
  e.setToken = function(e) {
    console.log("token:", e);
    a.accessToken = e;
  }
;
  e.ge = r();
  e.nameInit = "zyzy";
  e.versionInit = 1;
  e.isInit = ! 0;
  return e;
}
();
i.default = s;
cc._RF.pop();
