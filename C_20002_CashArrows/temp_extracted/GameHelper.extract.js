GameHelper: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "e2fd21CKTlOD7eaWezbj43U", "GameHelper");
Object.defineProperty(i, "__esModule", {
value: !0
});
var n = e("../BusinessCommonConfig"), a = e("../data/ClientDataStore"), o = function() {
function e() {}
e.getLoadingTasks = function() {
return n.BUSINESS_COMMON_CONFIG.loadingTasks;
};
e.loadMvcPrefabAsync = function(e, t) {
cc.resources.load(e.path, cc.Prefab, function(e, i) {
var n, a;
if (e) t(1, 1); else {
var o = cc.instantiate(i), r = null === (a = null === (n = cc.director.getScene()) || void 0 === n ? void 0 : n.children) || void 0 === a ? void 0 : a[0];
r && r.addChild(o);
t(1, 1);
}
});
};
e.isDebug = function() {
return !a.default.isProd();
};
e.getPreloadTextureDirs = function() {
return n.BUSINESS_COMMON_CONFIG.preloadTextureDirs;
};
return e;
}();
i.default = o;
cc._RF.pop();
}