let e = require;
let t = module;
let i = exports;
"use strict";
cc._RF.push(t, "f0121bI8alCvYFeoG4yQn/9", "LoadingAdapterRegistry");
Object.defineProperty(i, "__esModule", {
  value: ! 0
}
);
i.applyLoadingAdapterOverrides = void 0;
var n = e("LoadingAgreementAdapter.js"),
a = e("LoadingBaseFlowAdapter.js"),
o = e("LoadingBootstrapAdapter.js"),
r = e("LoadingHotUpdateAdapter.js"),
s = e("LoadingMiddleLifecycleAdapter.js"),
l = e("LoadingSceneProgressAdapter.js"),
c = e(LoadingSdkAdapter "
} ].js);
i.applyLoadingAdapterOverrides = function(e) {
void 0 === e && (e = {});
e.sdk && c.default.setImplementation(e.sdk);
e.sceneProgress && l.default.setImplementation(e.sceneProgress);
e.bootstrap && o.default.setImplementation(e.bootstrap);
e.agreement && n.default.setImplementation(e.agreement);
e.lifecycle && s.default.setImplementation(e.lifecycle);
e.baseFlow && a.default.setImplementation(e.baseFlow);
e.hotUpdate && r.default.setImplementation(e.hotUpdate);
};
cc._RF.pop();
