let e = require;
let t = module;
let i = exports;
"use strict";
cc._RF.push(t, "e9e38aQg0hLRYQ5+r5NEc3s", "MiddleSdkEventService");
Object.defineProperty(i, "__esModule", {
  value: ! 0
}
);
var n = e("MiddleNetwork.js"),
a = e("MiddleService.js"),
o = e("MiddleReqType.js"),
r = e("BusinessAnalyticsService.js"),
s = e("MiddleHandler.js"),
l = e("PlatformBridge.js"),
c = e("MiddleProjectAdapterConfig.js"),
u = function() {
  function e() {
    this.kIsUploadEventFirstCall = "com.sdk.kIsUploadEventFirstCall";
  }
  e.prototype.uploadOnce = function(e) {
    var t = this,
    i = this.getEventRequestIsFirstFlag();
    this.reportBehaviorConfigEvent("", 0, i);
    var r = a.default.paramData(o.MiddleReqType.SDKEvent);
    n.default.getSDKEvent(r, s.default.create(this, function(n) {
      try {
        try {
          console.log("[MiddleSdkEventService.getSDKEvent] res =>", JSON.stringify(n));
        } catch(e) {
          console.log("[MiddleSdkEventService.getSDKEvent] res(raw) =>", n);
        }
        if(! n) {
          t.reportBehaviorConfigEvent({
            message: "empty_response"
          }
, - 1, i);
          return;
        }
        var a = n&& n.data&& "object" == typeof n.data? n.data: n;
        if(! a|| "object" != typeof a) {
          t.reportBehaviorConfigEvent({
            message: "invalid_response_payload", raw: n
          }
, - 1, i);
          return;
        }
        var o = a.is_active, r = a.is_init_firebase, s = a.new_callback_events, u = a.new_callback_events_token, d = a.new_callback_events_params, h = a.sdk_key, p = a.url_strategy, _ = a.fb_app_id, f = a.interval_seconds, g = Number(f);
! isNaN(g)&& g > 0&& e&& e(g);
        var m = h;
        null == m&& (m = c.MIDDLE_PROJECT_ADAPTER_CONFIG.adjustKey);
        if(o) {
          var y = {
            adjustKey: m, urlStrategy: p, fbAppId: _
          }
;
          try {
            console.log("[MiddleSdkEventService.initSdkAdjust] params =>", JSON.stringify(y));
          } catch(e) {
            console.log("[MiddleSdkEventService.initSdkAdjust] params(raw) =>", y);
          }
          l.default.getNativeBridge().initSdkAdjust(m, p, _);
        }
! 0 === r&& l.default.getNativeBridge().reportFirebase(r+ "");
        Array.isArray(s)&& s.length > 0&& s.forEach(function(e) {
          var i = t.findEventToken(e, u), n = t.findEventParams(e, d), a = l.default.getNativeBridge();
          a&& "function" == typeof a.reportEventByAdjust&& a.reportEventByAdjust(e, i, n);
        }
);
        t.reportBehaviorConfigEvent(a, 1, i);
      } catch(e) {
        t.reportBehaviorConfigEvent(e, - 1, i);
      }
    }
), s.default.create(this, function(e) {
      t.reportBehaviorConfigEvent(e, - 1, i);
    }
));
  }
;
  e.prototype.getEventRequestIsFirstFlag = function() {
    var e = ! 1;
    try {
(e = null === cc.sys.localStorage.getItem(this.kIsUploadEventFirstCall))&& cc.sys.localStorage.setItem(this.kIsUploadEventFirstCall, "1");
    } catch(t) {
      e = ! 0;
    }
    return e;
  }
;
  e.prototype.findEventToken = function(e, t) {
    if(! Array.isArray(t)|| t.length <= 0) return "";
    for(var i = 0, n = t;
    i < n.length;
    i++) {
      var a = n[i];
      if(a) {
        var o = a[e];
        if(o) return o;
      }
    }
    return "";
  }
;
  e.prototype.findEventParams = function(e, t) {
    if(! Array.isArray(t)|| t.length <= 0) return null;
    for(var i = 0, n = t;
    i < n.length;
    i++) {
      var a = n[i];
      if(a) {
        var o = a[e];
        if(void 0 !== o) return o;
      }
    }
    return null;
  }
;
  e.prototype.reportBehaviorConfigEvent = function(e, t, i) {
    void 0 === i&& (i = ! 1);
    var n = {
      behavior_config_value: e,
      behavior_config_status: t,
      behavior_first_req: i,
      redirect_type: "0"
    }
;
    r.default.reportData("behavior_config", n);
  }
;
  return e;
}
();
i.default = u;
cc._RF.pop();
