let e = require;
let t = module;
let i = exports;
"use strict";
cc._RF.push(t, "501acbjSwZFfZ64NNLC8ePR", "AdLegacyBridge");
Object.defineProperty(i, "__esModule", {
  value: ! 0
}
);
var n = e("EventSystem.js"),
a = e("PlatformBridge.js"),
o = e("AdEventType.js"),
r = function() {
  function e() {
  }
  e.configureRuntime = function(e) {
    this.runtime = __assign(__assign({
    }
, this.runtime), e|| {
    }
);
  }
;
  e.listen = function(e, t, i) {
    n.default.listen(e, t, i);
  }
;
  e.trigger = function(e, t) {
    n.default.trigger(e, t);
  }
;
  e.ignore = function(e, t, i) {
    n.default.ignore(e, t, i);
  }
;
  e.getInsertScreenFlag = function() {
    return this.runtime.getInsertScreenFlag();
  }
;
  e.setInsertShowTime = function() {
    this.runtime.setInsertShowTime();
  }
;
  e.pauseInsertTimer = function() {
    this.runtime.pauseInsertTimer();
  }
;
  e.resumeInsertTimer = function() {
    this.runtime.resumeInsertTimer();
  }
;
  e.showSplashAd = function(e, t) {
    var i,
    n = window.calliOS;
    null === (i = null == n? void 0: n.showSplashAd)|| void 0 === i|| i.call(n, {
      slotId: e, bottom: t
    }
);
  }
;
  e.showRewardVideoByPlatform = function(e) {
    var t,
    i,
    n = a.default.getNativeBridge();
    if(cc.sys.os !== cc.sys.OS_ANDROID) {
      if(cc.sys.os === cc.sys.OS_IOS) {
        var o = window.calliOS;
        null === (i = null == o? void 0: o.showRewardVideoAd)|| void 0 === i|| i.call(o, e);
      }
    } else null === (t = null == n? void 0: n.showRewardVideoAd)|| void 0 === t|| t.call(n, JSON.stringify(e));
  }
;
  e.events = o.default;
  e.runtime = {
    getInsertScreenFlag: function() {
      return "s0";
    }
,
    setInsertShowTime: function() {
    }
,
    pauseInsertTimer: function() {
    }
,
    resumeInsertTimer: function() {
    }
  }
;
  return e;
}
();
i.default = r;
cc._RF.pop();
