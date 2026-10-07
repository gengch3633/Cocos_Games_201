let e = require;
let t = module;
let i = exports;
"use strict";
cc._RF.push(t, "8be41qunXNFga4eIuGkB1po", "LoadingBaseFlowService");
Object.defineProperty(i, "__esModule", {
  value: ! 0
}
);
var n = e("LoadingBaseFlowAdapter.js"),
a = e("BusinessAnalyticsService.js"),
o = function() {
  function e(e) {
    this.deps = e;
  }
  e.prototype.start = function() {
    n.default.getImplementation().startFlow({
      report: function(e, t) {
        return a.default.reportData(e, t);
      }
, onLoginReady: this.deps.onLoginReady, onShowWxLogin: this.deps.onShowWxLogin
    }
);
  }
;
  return e;
}
();
i.default = o;
cc._RF.pop();
