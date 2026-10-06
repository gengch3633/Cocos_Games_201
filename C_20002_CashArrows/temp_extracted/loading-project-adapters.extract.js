"loading-project-adapters": [ function(e, t, i) {
"use strict";
cc._RF.push(t, "886a3QKqAlHs7ycwxAnM7Kv", "loading-project-adapters");
Object.defineProperty(i, "__esModule", {
value: !0
});
i.initProjectLoadingAdaptersWithOverrides = i.initProjectLoadingAdaptersWithDeps = i.initProjectLoadingAdapters = void 0;
var n = e("../src/sdk/LoadingAdapterRegistry"), a = e("./loading-project-adapter-core"), o = e("../business-common/loading-standard-deps");
function r(e) {
n.applyLoadingAdapterOverrides(a.createLoadingProjectAdapterOverrides(e));
}
i.initProjectLoadingAdapters = function() {
r(o.buildStandardDeps());
};
i.initProjectLoadingAdaptersWithDeps = function(e) {
r(e);
};
i.initProjectLoadingAdaptersWithOverrides = function(e) {
r(__assign(__assign({}, o.buildStandardDeps()), e));
};
cc._RF.pop();
}