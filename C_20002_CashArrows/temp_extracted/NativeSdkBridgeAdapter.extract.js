NativeSdkBridgeAdapter: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "d23c7VVgExDSaYrmiY8Eqc/", "NativeSdkBridgeAdapter");
Object.defineProperty(i, "__esModule", {
value: !0
});
var n = e("../../../business-common/core/EventSystem"), a = e("../../../business-common/ad/AdEventType"), o = e("../../../business-common/report/BusinessAnalyticsService"), r = e("../../../business-common/data/ClientDataStore"), s = e("../../../business-common/net/LoadingHttpService"), l = "[NativeSdkBridgeAdapter]", c = !0;
function u(e) {
if ("string" == typeof e) return e.length <= 180 ? e : e.slice(0, 180) + "...(len=" + e.length + ")";
if (null == e) return e;
if ("number" == typeof e || "boolean" == typeof e) return e;
try {
return JSON.parse(JSON.stringify(e));
} catch (t) {
return String(e);
}
}
function d(e) {
return Array.isArray(e) ? e.map(u) : [];
}
function h(e) {
for (var t = [], i = 1; i < arguments.length; i++) t[i - 1] = arguments[i];
if (c) try {
console.log.apply(console, __spreadArrays([ l + " " + e ], t));
} catch (e) {}
}
var p = function() {
function e() {}
e.prototype.encodeBase64Utf8 = function(e) {
try {
var t = encodeURIComponent(e).replace(/%([0-9A-F]{2})/g, function(e, t) {
return String.fromCharCode(parseInt(t, 16));
});
return btoa(t);
} catch (t) {
try {
return btoa(e);
} catch (t) {
h("encodeBase64Utf8 failed", u(e));
return "";
}
}
};
e.prototype.buildMoveToPayload = function(e, t) {
void 0 === t && (t = []);
var i = (t || []).map(function(e) {
return null == e ? "" : String(e);
});
return __spreadArrays([ e ], i).join("|") + "|";
};
e.prototype.invokeMoveTo = function(e, t) {
void 0 === t && (t = []);
h("invokeMoveTo params", {
methodName: u(e),
args: d(t)
});
var i = this.buildMoveToPayload(e, t), n = this.encodeBase64Utf8(i);
h("invokeMoveTo -> " + e, {
rawPayload: u(i),
encodedPayload: u(n),
args: d(t)
});
try {
var a = jsb && jsb.reflection;
if (!a || "function" != typeof a.callStaticMethod) {
h("invokeMoveTo skipped(no jsb.reflection.callStaticMethod)", {
methodName: e
});
return "";
}
var o = a.callStaticMethod("org/cocos2dx/javascript/AppActivity", "moveTo", "(Ljava/lang/String;)Ljava/lang/String;", n), r = null == o ? "" : String(o);
h("invokeMoveTo <- " + e, u(r));
return r;
} catch (t) {
console.error("[NativeSdkBridgeAdapter] invokeMoveTo failed", e, t);
return "";
}
};
e.prototype.initSdkAdjust = function(e, t, i) {
this.invokeMoveTo("plantSurveyReactor", [ e, t, i ]);
};
e.prototype.reportFirebase = function(e) {
this.invokeMoveTo("reportFirebase", [ e ]);
};
e.prototype.getClientInfo = function() {
var e = this.invokeMoveTo("harvestProgramLedger") || "{}";
h("getClientInfo <- result", u(e));
return e;
};
e.prototype.initSdk = function(e, t, i) {
this.invokeMoveTo("fuelProfitGear", [ e, t, i ? "true" : "false" ]);
};
e.prototype.initSMSdk = function(e, t) {
this.invokeMoveTo("initSMSdk", [ e, t ]);
};
e.prototype.showRewardVideoAd = function(e) {
this.invokeMoveTo("layCouponCanvas", [ e ]);
};
e.prototype.onJump = function(e) {
h("onJump -> cc.sys.openURL", e);
cc.sys.openURL(e);
};
e.prototype.setVibrator = function(e) {
this.invokeMoveTo("setVibrator", [ e ]);
};
e.prototype.getNotchHeight = function() {
var e = this.invokeMoveTo("getNotchHeight"), t = Number(e) || 0;
h("getNotchHeight <-", t);
return t;
};
e.prototype.getStatusBarHeight = function() {
var e = this.invokeMoveTo("getStatusBarHeight"), t = Number(e) || 0;
h("getStatusBarHeight <-", t);
return t;
};
e.prototype.playBgMusic = function(e) {
this.invokeMoveTo("playBgMusic", [ e ]);
};
e.prototype.showPushMessage = function() {
this.invokeMoveTo("showPushMessage");
};
e.prototype.showAppLongTapToast = function(e, t) {
void 0 === t && (t = 0);
var i = 1 === t ? 1 : 0;
this.invokeMoveTo("dropBriefWave", [ e, i ]);
};
e.prototype.showAppReview = function() {
this.invokeMoveTo("sailToAppraisalArena");
};
e.prototype.showAppService = function(e) {
this.invokeMoveTo("glideToSolaceBooth", [ e ]);
};
e.prototype.subscribeTopics = function(e) {
this.invokeMoveTo("subscribeTopics", [ e ]);
};
e.prototype.exitApp = function() {
try {
var e = jsb && jsb.reflection;
if (!e || "function" != typeof e.callStaticMethod) {
h("exitApp skipped(no jsb.reflection.callStaticMethod)");
return;
}
e.callStaticMethod("org/cocos2dx/javascript/AppActivity", "requestAppExit", "()V");
h("exitApp invoked");
} catch (e) {
console.error("[NativeSdkBridgeAdapter] exitApp failed", e);
}
};
return e;
}(), _ = function() {
function e() {}
e.prototype.initSdkAdjust = function() {};
e.prototype.reportFirebase = function() {};
e.prototype.reportEventByAdjust = function() {};
e.prototype.getClientInfo = function() {
return "{}";
};
e.prototype.initSdk = function() {};
e.prototype.initSMSdk = function() {};
e.prototype.showRewardVideoAd = function() {};
e.prototype.onJump = function(e) {
cc.sys.openURL(e);
};
e.prototype.setVibrator = function() {};
e.prototype.getNotchHeight = function() {
return 0;
};
e.prototype.getStatusBarHeight = function() {
return 0;
};
e.prototype.playBgMusic = function() {};
e.prototype.showPushMessage = function() {};
e.prototype.showAppLongTapToast = function(e, t) {
void 0 === t && (t = 0);
};
e.prototype.showAppReview = function() {};
e.prototype.showAppService = function(e) {
cc.sys.openURL(e);
};
e.prototype.subscribeTopics = function() {};
e.prototype.exitApp = function() {};
return e;
}(), f = function() {
function e() {}
e.parseEncodedJson = function(e, t) {
void 0 === t && (t = !1);
if (null == e) return null;
if ("object" == typeof e) return e;
if ("string" != typeof e) return null;
var i = String(e || "").trim();
if (!i) return t ? "" : null;
try {
var n = i.replace(/-/g, "+").replace(/_/g, "/"), a = n.length % 4, o = a ? n + "=".repeat(4 - a) : n, r = atob(o);
try {
h("parseEncodedJson success(base64-json)", u(s = JSON.parse(r)));
return s;
} catch (e) {
if (t) {
h("parseEncodedJson success(base64-text)", u(r));
return r;
}
}
} catch (e) {}
try {
var s;
h("parseEncodedJson success(raw-json)", u(s = JSON.parse(i)));
return s;
} catch (e) {
if (t) {
h("parseEncodedJson fallback(raw-text)", u(i));
return i;
}
h("parseEncodedJson failed", u(i));
return null;
}
};
e.pickValue = function(e, t) {
if (e) for (var i = 0, n = t; i < n.length; i++) {
var a = n[i];
if (void 0 !== e[a] && null !== e[a] && "" !== e[a]) return e[a];
}
};
e.bindBranchHandlers = function() {
var e = this;
if (this.branchHandlersBound) h("bindBranchHandlers skipped(already bound)"); else {
var t = window, i = t.branch = t.branch || {};
h("bindBranchHandlers start");
var l = function(e, t) {
var n = i[e];
h("bind branch." + e, {
hasPrevious: "function" == typeof n
});
i[e] = function() {
for (var a = [], o = 0; o < arguments.length; o++) a[o] = arguments[o];
h("branch." + e + " invoked", d(a));
try {
t.apply(void 0, a);
} catch (t) {
console.error("[NativeSdkBridgeAdapter] branch." + e + " failed", t);
}
if ("function" == typeof n && n !== i[e]) try {
h("branch." + e + " -> previous handler", d(a));
n.apply(i, a);
} catch (t) {
console.error("[NativeSdkBridgeAdapter] previous branch." + e + " failed", t);
}
};
};
l("moduleSerialNailed", function(t) {
var i = e.parseEncodedJson(t) || {}, n = e.pickValue(i, [ "machineUniqueSignature", "gaid", "googleId" ]), a = e.pickValue(i, [ "originLocationAddress", "referrer_url" ]), o = e.pickValue(i, [ "originRecordedMoment", "referrer_timestamp_server" ]), s = e.pickValue(i, [ "setupRecordedMoment", "install_timestamp_server" ]);
n && (r.default.oaid = String(n));
void 0 !== a && (r.default.referrer_url = String(a));
void 0 !== o && (r.default.referrer_timestamp_server = Number(o) || 0);
void 0 !== s && (r.default.install_timestamp_server = Number(s) || 0);
"function" == typeof r.default.buildCommonUrlStr && r.default.buildCommonUrlStr();
"function" == typeof r.default.buildMiddleCommonUrlStr && r.default.buildMiddleCommonUrlStr();
h("branch.moduleSerialNailed applied to ClientDataStore", {
androidId: n ? String(n) : "",
referrerUrl: a || "",
refTs: o || 0,
installTs: s || 0
});
});
l("relayFragmentaryNote", function(t) {
var i = e.parseEncodedJson(t);
h("branch.relayFragmentaryNote parsed", u(i));
var n;
h("branch.relayFragmentaryNote -> BusinessAnalyticsService.onTrack", u(n = i && "object" == typeof i ? JSON.stringify(i) : "string" == typeof t ? t : null != t ? JSON.stringify(t) : "{}"));
o.default.onTrack(n);
});
l("unloadHeapedNotes", function() {
h("branch.unloadHeapedNotes -> BusinessAnalyticsService.trackAll");
o.default.trackAll();
});
l("backedFeatureCrumbled", function(t) {
var i = e.parseEncodedJson(t), o = i && (i.ferryBulkTierAgate || i.data || i) || {}, r = {
type: o.type || o.draftLidArticleNettle || o.code || "unknown",
message: o.claspOpinionGlanceSpruce || o.message || "",
raw: i || t
};
h("branch.backedFeatureCrumbled -> EventMgr.trigger(VIDEO_ERROR)", u(r));
n.default.trigger(a.default.VIDEO_ERROR, r);
});
l("backedFeatureWithdrawn", function(t) {
var i = e.parseEncodedJson(t), o = i && (i.ferryBulkTierAgate || i.data || i) || {}, r = void 0 !== o.compensationQualifyMark ? o.compensationQualifyMark : o.appraiseChaliceRungBorage;
h("branch.backedFeatureWithdrawn -> EventMgr.trigger(VIDEO_CLOSE)", {
compensationQualifyMark: !!r
});
n.default.trigger(a.default.VIDEO_CLOSE, {
compensationQualifyMark: !!r
});
});
l("backedFeatureRipened", function(t) {
var i = e.parseEncodedJson(t), o = i && (i.ferryBulkTierAgate || i.data) || {}, r = i && "object" == typeof i ? __assign(__assign({}, o), i) : o && "object" == typeof o ? o : {};
h("branch.backedFeatureRipened -> EventMgr.trigger(VIDEO_OPEN_SUCCESS)", u(r));
n.default.trigger(a.default.VIDEO_OPEN_SUCCESS, r);
});
l("pushTokenInitialized", function(t) {
var i = e.parseEncodedJson(t, !0), n = "string" == typeof i ? i.trim() : "string" == typeof t ? t.trim() : "";
h("branch.pushTokenInitialized parsed", {
raw: u(t),
token: u(n)
});
if (n) {
s.default.init(function(e, t) {
return t();
});
s.default.syncFirebaseToken(n);
}
});
l("cycleAscendedAlert", function() {
h("branch.cycleAscendedAlert -> cc.game.EVENT_SHOW");
cc.game && cc.game.emit && cc.game.emit(cc.game.EVENT_SHOW);
});
l("cycleDescendedMute", function() {
h("branch.cycleDescendedMute -> cc.game.EVENT_HIDE");
cc.game && cc.game.emit && cc.game.emit(cc.game.EVENT_HIDE);
});
this.branchHandlersBound = !0;
h("bindBranchHandlers done");
}
};
e.bindAndroidCallbacks = function() {
if (this.androidCallbacksBound) h("bindAndroidCallbacks skipped(already bound)"); else {
var e = window, t = e.callAndroid = e.callAndroid || {};
h("bindAndroidCallbacks start");
this.ANDROID_CALLBACK_MAP.forEach(function(i) {
var n = i.source, a = i.target, o = t[n];
h("bind callAndroid." + n + " -> branch." + a, {
hasPrevious: "function" == typeof o
});
t[n] = function() {
for (var i = [], r = 0; r < arguments.length; r++) i[r] = arguments[r];
h("callAndroid." + n + " invoked", d(i));
try {
var s = e.branch, l = s && s[a];
if ("function" == typeof l) {
h("forward callAndroid." + n + " -> branch." + a, d(i));
l.apply(s, i);
} else h("branch." + a + " missing, skip forward");
} catch (e) {
console.error("[NativeSdkBridgeAdapter] forward " + n + " -> branch." + a + " failed", e);
}
if ("function" == typeof o && o !== t[n]) try {
h("callAndroid." + n + " -> previous handler", d(i));
o.apply(t, i);
} catch (e) {
console.error("[NativeSdkBridgeAdapter] previous " + n + " callback failed", e);
}
};
});
this.androidCallbacksBound = !0;
h("bindAndroidCallbacks done");
}
};
e.getBridge = function() {
if (this.bridge) {
h("getBridge reuse existing bridge");
return this.bridge;
}
h("getBridge create bridge", {
os: cc.sys.os,
isAndroid: cc.sys.os === cc.sys.OS_ANDROID
});
this.bridge = cc.sys.os === cc.sys.OS_ANDROID ? new p() : new _();
if (cc.sys.os === cc.sys.OS_ANDROID) {
this.bindBranchHandlers();
this.bindAndroidCallbacks();
}
h("getBridge ready", {
bridgeType: cc.sys.os === cc.sys.OS_ANDROID ? "android" : "noop"
});
return this.bridge;
};
e.setBridge = function(e) {
h("setBridge override bridge", {
hasBridge: !!e
});
this.bridge = e;
};
e.bridge = null;
e.androidCallbacksBound = !1;
e.branchHandlersBound = !1;
e.ANDROID_CALLBACK_MAP = [ {
source: "onGaidResult",
target: "moduleSerialNailed"
}, {
source: "onTrack",
target: "relayFragmentaryNote"
}, {
source: "onTrackAll",
target: "unloadHeapedNotes"
}, {
source: "onVideoError",
target: "backedFeatureCrumbled"
}, {
source: "onVideoClose",
target: "backedFeatureWithdrawn"
}, {
source: "onVideoOpensuccess",
target: "backedFeatureRipened"
}, {
source: "appResumed",
target: "cycleAscendedAlert"
}, {
source: "appPaused",
target: "cycleDescendedMute"
}, {
source: "pushTokenInitialized",
target: "pushTokenInitialized"
} ];
return e;
}();
i.default = f;
cc._RF.pop();
}