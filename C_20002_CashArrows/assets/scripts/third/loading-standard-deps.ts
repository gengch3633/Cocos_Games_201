import BusinessCommonConfig from "./BusinessCommonConfig";
import Handler from "./Handler";
import EventSystem from "./EventSystem";
import ClientDataStore from "./ClientDataStore";
import SystemDataStore from "./SystemDataStore";
import PlayerDataStore from "./PlayerDataStore";
import GameConfigStore from "./GameConfigStore";
import LoadingHttpService from "./LoadingHttpService";
import PlatformBridge from "./PlatformBridge";
import HotUpdateManager from "./HotUpdateManager";
import GlobalErrorHandler from "./GlobalErrorHandler";
import UIHelper from "./UIHelper";
import LanguageHelper from "./LanguageHelper";
import MiddleHelper from "./MiddleHelper";
import GameHelper from "./GameHelper";

function y() {
var e = " yid_read_failed ";
try {
e = cc.sys.localStorage.getItem(" yid ") || " yid_read_failed ";
} catch (e) {}
PlayerDataStore.initUserId({
yid: e
});
var t = PlatformBridge.getClientInfo();
ClientDataStore.init(t);
}
export function buildStandardDeps() {
return {
bootstrap: {
patchInstantiate: function(e) {
LanguageHelper.addMultilingualFont(e);
},
registerGlobalError: function() {
GlobalErrorHandler.globalErrorRegister(GameHelper.isDebug());
},
initPageManager: function() {
UIHelper.init();
},
disableMultiTouch: function() {
cc.macro.ENABLE_MULTI_TOUCH = !1;
},
initLanguage: function(e) {
LanguageHelper.init(void 0, e);
},
initSystem: function() {
y();
},
bindPilot: function() {
PlatformBridge.bindPilot();
},
startMiddleCountryForWeb: function() {
cc.sys.isNative || MiddleHelper.middleCountry();
}
},
sceneProgress: {
preloadTextures: function(e) {
var t = GameHelper.getPreloadTextureDirs(), i = 0;
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
return GameHelper.getLoadingTasks();
},
loadTask: function(e, t) {
GameHelper.loadMvcPrefabAsync(e, t);
},
isDebug: function() {
return GameHelper.isDebug();
}
},
sdk: void 0,
agreement: void 0,
lifecycle: void 0,
baseFlow: {
requestSystemConfig: function(e, t) {
LoadingHttpService.init(function(e, t) {
LoadingHttpService.reportHttpErr(e);
UIHelper.httpErr(e, t);
});
LoadingHttpService.getSystemConfig(Handler.create(null, e), Handler.create(null, t));
},
requestAutoLogin: function(e, t, i) {
LoadingHttpService.autoLogin(e, Handler.create(null, t), Handler.create(null, i));
},
requestTouristsLogin: function(e, t, i) {
LoadingHttpService.touristsLogin(e, Handler.create(null, t), Handler.create(null, i));
},
requestGameConfig: function(e, t) {
LoadingHttpService.getGameConfig(Handler.create(null, e), Handler.create(null, t));
},
requestUserInfo: function(e, t) {
LoadingHttpService.getUserInfo(Handler.create(null, e), Handler.create(null, t));
},
handleHttpErr: function(e, t) {
LoadingHttpService.reportHttpErr(e);
UIHelper.httpErr(e, function() {
return t();
});
},
onReconnectSuccess: function() {
UIHelper.reconnectSuc();
},
onReconnectFail: function() {
UIHelper.reconnectFai();
},
emitCloseReconnect: function() {
EventSystem.trigger(o.CLOSE_RECONNECT);
},
applySystemConfig: function(e) {
SystemDataStore.init_config(e);
LanguageHelper.setType(ClientDataStore.local_country);
},
applyUserId: function(e) {
PlayerDataStore.initUserId(e);
},
applyGameConfig: function(e) {
GameConfigStore.init(e);
},
applyUserInfo: function(e) {
PlayerDataStore.init(e);
},
applyMiddleFunds: function() {
MiddleHelper.initMiddleFundsPlatform();
},
showToast: function(e) {
UIHelper.showToast(e);
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
return MiddleHelper.isSupportHot && cc.sys.isNative;
},
getCurrentBaseVersion: function() {
return HotUpdateManager.getInstance().getBaseVersion();
},
buildManifestUrl: function(e) {
return " " + SystemDataStore.getCDNUrl() + e + "/ project.manifest ";
},
loadRemoteManifest: function(e, t) {
cc.assetManager.loadRemote(e, function(e, i) {
return t(e, i);
});
},
initManifest: function(e) {
e && HotUpdateManager.getInstance()._initManifestStr(e);
HotUpdateManager.getInstance()._initManifest();
},
buildVersionRequest: function() {
var e = SystemDataStore.get_version_url(), t = ClientDataStore.getVersionData(), i = __assign(__assign({}, t), {
cy: LanguageHelper.languageType,
game_version: HotUpdateManager.getInstance().getVersion()
}), n = LoadingHttpService.buildHotUpdateBody(i);
return {
url: e + "? " + ClientDataStore.publicYWUrlParser("/ " + e.split("/ ").pop()),
body: n
};
},
checkGrayUpdate: function(e, t, i) {
HotUpdateManager.getInstance().checkGrayUpdate(e, t, i);
},
runHotUpdate: function(e) {
HotUpdateManager.getInstance().hotUpdate(e);
},
isProgressEvent: function(e) {
return e && 10 === e.code;
},
getProgressPercent: function(e) {
var t;
return null !== (t = null == e ? void 0 : e.byte_percent) && void 0 !== t ? t : 0;
},
afterFinish: function() {
var e = HotUpdateManager.getInstance().getVersion();
LoadingHttpService.setGameVersion(e);
ClientDataStore.appendGameVersion(e);
}
}
};
};
