LoadingMiddleLifecycleBinder: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "8b56bckbepHerpPE6SxdfMo", "LoadingMiddleLifecycleBinder");
Object.defineProperty(i, "__esModule", {
value: !0
});
var n = e("../sdk/LoadingMiddleLifecycleAdapter"), a = function() {
function e() {}
e.prototype.bind = function(e) {
n.default.getImplementation().bindLifecycleHooks(e);
};
return e;
}();
i.default = a;
cc._RF.pop();
}