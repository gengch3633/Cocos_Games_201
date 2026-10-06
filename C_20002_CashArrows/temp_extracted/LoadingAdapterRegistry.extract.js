LoadingAdapterRegistry: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "f0121bI8alCvYFeoG4yQn/9", "LoadingAdapterRegistry");
Object.defineProperty(i, "__esModule", {
value: !0
});
i.applyLoadingAdapterOverrides = void 0;
var n = e("./LoadingAgreementAdapter"), a = e("./LoadingBaseFlowAdapter"), o = e("./LoadingBootstrapAdapter"), r = e("./LoadingHotUpdateAdapter"), s = e("./LoadingMiddleLifecycleAdapter"), l = e("./LoadingSceneProgressAdapter"), c = e("./LoadingSdkAdapter");
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
}