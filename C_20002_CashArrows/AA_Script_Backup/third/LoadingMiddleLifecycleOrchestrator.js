let e = require;
let t = module;
let i = exports;
"use strict";
cc._RF.push(t, "4f793c2RhpPH5TKCf2OcA3z", "LoadingMiddleLifecycleOrchestrator");
Object.defineProperty(i, "__esModule", {
  value: ! 0
}
);
var n = e("LoadingMiddleLifecycleAdapter.js"),
a = e("BusinessAnalyticsService.js"),
o = function() {
  function e(e) {
    this.deps = e;
  }
  e.prototype.bind = function() {
    var e = this,
    t = n.default.getImplementation();
    t.bindLifecycleHooks({
      onBan: function() {
        t.onBanLog();
        a.default.reportData("page_loading_ban");
        e.deps.onFallback();
      }
, onBackstop: function() {
        t.onBackstopLog();
        a.default.reportData("page_loading_backstop");
        e.deps.onFallback();
      }
, onEnterGame: function() {
        t.onEnterGamePrepare();
        a.default.reportData("page_loading_enter");
        e.deps.onEnterGame();
      }
, onShowUmp: function(i) {
        t.onShowUmpPrepare();
        a.default.reportData("page_loading_show_ump");
        e.deps.onShowUmp(i);
      }
    }
);
  }
;
  return e;
}
();
i.default = o;
cc._RF.pop();
