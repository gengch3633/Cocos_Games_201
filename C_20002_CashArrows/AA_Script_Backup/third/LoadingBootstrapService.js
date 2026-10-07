let e = require;
let t = module;
let i = exports;
"use strict";
cc._RF.push(t, "de221PKO09NZp7tKTRFOQ2x", "LoadingBootstrapService");
Object.defineProperty(i, "__esModule", {
  value: ! 0
}
);
var n = e(LoadingBootstrapAdapter "
} ].js), a = e(" BusinessAnalyticsService.js "), o = function() {
function e(e) {
this.deps = e;
}
e.prototype.run = function() {
var e = n.default.getImplementation();
e.patchInstantiate();
a.default.reportData(" u_loading_page_show ");
e.registerGlobalError();
e.initPageManager();
e.disableMultiTouch();
this.deps.setLoadingActive(!0);
this.deps.startLoadingTicker();
this.deps.preloadAssets();
e.initLanguage();
e.initSystem();
e.bindPilot();
a.default.reportData(" page_loading_onLoad ");
e.startMiddleCountryForWeb();
};
return e;
}();
i.default = o;
cc._RF.pop();
