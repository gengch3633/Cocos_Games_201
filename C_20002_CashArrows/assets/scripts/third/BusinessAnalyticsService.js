let e = require;
let t = module;
let i = exports;
"use strict";
cc._RF.push(t, "0bea8/VJ1tOxpd9f0hEC4BZ", "BusinessAnalyticsService");
Object.defineProperty(i, "__esModule", {
  value: ! 0
}
);
var n = e("MiddleTrackManager.js"),
a = function() {
  function e() {
  }
  e.reportData = function(e, t, i) {
    void 0 === i&& (i = ! 1);
    console.log("BusinessAnalyticsService.reportData", e, t, i);
    var a = t|| {
    }
,
    o = a.redirect_type;
    null != o&& "" !== o&& (o = Number(o));
    if(i) {
      o = 1;
      a.redirect_type = 1;
    }
    n.default.getInstance().track(e, a, o);
  }
;
  e.onTrack = function(e) {
    var t = JSON.parse(e);
    t|| (t = {
    }
);
    var i = t.traceArcadeRouteCypress;
    i&& (i = Number(i));
    n.default.getInstance().track(t.enrollFeintProcessOak, t.ferryBulkTierAgate, i);
  }
;
  e.trackAll = function() {
    n.default.getInstance().trackAll();
  }
;
  return e;
}
();
i.default = a;
cc._RF.pop();
