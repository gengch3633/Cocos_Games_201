let e = require;
let t = module;
let i = exports;
"use strict";
cc._RF.push(t, "f8e48e1OuJOFKUBOiKvAJGV", "loading-standard-deps");
Object.defineProperty(i, "__esModule", {
  value: ! 0
}
);
i.buildStandardDeps = void 0;
var n = e("BusinessCommonConfig.js"),
a = e("Handler.js"),
o = e("EventSystem.js"),
r = e("ClientDataStore.js"),
s = e("SystemDataStore.js"),
l = e("PlayerDataStore.js"),
c = e("GameConfigStore.js"),
u = e("LoadingHttpService.js"),
d = e("PlatformBridge.js"),
h = e("HotUpdateManager.js"),
p = e("GlobalErrorHandler.js"),
_ = e(UIHelper "
} ].js), f = e(" LanguageHelper.js "), g = e(" MiddleHelper.js "), m = e(" GameHelper.js ");
function y() {
var e = " yid_read_failed ";
try {
e = cc.sys.localStorage.getItem(" yid ") || " yid_read_failed ";
} catch (e) {}
l.default.initUserId({
yid: e
});
var t = d.default.getClientInfo();
r.default.init(t);
}
i.buildStandardDeps = function() {
return {
bootstrap: {
patchInstantiate: function(e) {
f.default.addMultilingualFont(e);
},
registerGlobalError: function() {
p.globalErrorRegister(m.default.isDebug());
},
initPageManager: function() {
_.default.init();
},
disableMultiTouch: function() {
cc.macro.ENABLE_MULTI_TOUCH = !1;
},
initLanguage: function(e) {
f.default.init(void 0, e);
},
initSystem: function() {
y();
},
bindPilot: function() {
d.default.bindPilot();
},
startMiddleCountryForWeb: function() {
cc.sys.isNative || g.default.middleCountry();
}
},
sceneProgress: {
preloadTextures: function(e) {
var t = m.default.getPreloadTextureDirs(), i = 0;
0 !== t.length ? t.forEach(function(n) {
cc.resources.preloadDir(n, function() {
e(++i, t.length);
});
}) : e(1, 1);
},
preloadScene: function(e, t) {
cc.director.preloadScene(e, t);
},
getLoadingTasks: function() {
return m.default.getLoadingTasks();
},
loadTask: function(e, t) {
m.default.loadMvcPrefabAsync(e, t);
},
isDebug: function() {
return m.default.isDebug();
}
},
sdk: void 0,
agreement: void 0,
lifecycle: void 0,
baseFlow: {
requestSystemConfig: function(e, t) {
u.default.init(function(e, t) {
u.default.reportHttpErr(e);
_.default.httpErr(e, t);
});
u.default.getSystemConfig(a.default.create(null, e), a.default.create(null, t));
},
requestAutoLogin: function(e, t, i) {
u.default.autoLogin(e, a.default.create(null, t), a.default.create(null, i));
},
requestTouristsLogin: function(e, t, i) {
u.default.touristsLogin(e, a.default.create(null, t), a.default.create(null, i));
},
requestGameConfig: function(e, t) {
u.default.getGameConfig(a.default.create(null, e), a.default.create(null, t));
},
requestUserInfo: function(e, t) {
u.default.getUserInfo(a.default.create(null, e), a.default.create(null, t));
},
handleHttpErr: function(e, t) {
u.default.reportHttpErr(e);
_.default.httpErr(e, function() {
return t();
});
},
onReconnectSuccess: function() {
_.default.reconnectSuc();
},
onReconnectFail: function() {
_.default.reconnectFai();
},
emitCloseReconnect: function() {
o.default.trigger(o.CLOSE_RECONNECT);
},
applySystemConfig: function(e) {
s.default.init_config(e);
f.default.setType(r.default.local_country);
},
applyUserId: function(e) {
l.default.initUserId(e);
},
applyGameConfig: function(e) {
c.default.init(e);
},
applyUserInfo: function(e) {
l.default.init(e);
},
applyMiddleFunds: function() {
g.default.initMiddleFundsPlatform();
},
showToast: function(e) {
_.default.showToast(e);
},
getAutoLoginPayload: function() {
return null;
},
getTouristsLoginPayload: function() {
return null;
},
isPermanentLogoutError: function(e) {
return !(!e || !e.message) && String(e.message).includes(n.BUSINESS_COMMON_CONFIG.permanentLogoutKeyword);
}
},
hotUpdate: {
isHotUpdateEnabled: function() {
return g.default.isSupportHot && cc.sys.isNative;
},
getCurrentBaseVersion: function() {
return h.default.getInstance().getBaseVersion();
},
buildManifestUrl: function(e) {
return " " + s.default.getCDNUrl() + e + "/ project.manifest ";
},
loadRemoteManifest: function(e, t) {
cc.assetManager.loadRemote(e, function(e, i) {
return t(e, i);
});
},
initManifest: function(e) {
e && h.default.getInstance()._initManifestStr(e);
h.default.getInstance()._initManifest();
},
buildVersionRequest: function() {
var e = s.default.get_version_url(), t = r.default.getVersionData(), i = __assign(__assign({}, t), {
cy: f.default.languageType,
game_version: h.default.getInstance().getVersion()
}), n = u.default.buildHotUpdateBody(i);
return {
url: e + "? " + r.default.publicYWUrlParser("/ " + e.split("/ ").pop()),
body: n
};
},
checkGrayUpdate: function(e, t, i) {
h.default.getInstance().checkGrayUpdate(e, t, i);
},
runHotUpdate: function(e) {
h.default.getInstance().hotUpdate(e);
},
isProgressEvent: function(e) {
return e && 10 === e.code;
},
getProgressPercent: function(e) {
var t;
return null !== (t = null == e ? void 0 : e.byte_percent) && void 0 !== t ? t : 0;
},
afterFinish: function() {
var e = h.default.getInstance().getVersion();
u.default.setGameVersion(e);
r.default.appendGameVersion(e);
}
}
};
};
cc._RF.pop();
