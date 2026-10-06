let e = require;
let t = module;
let i = exports;
"use strict";
cc._RF.push(t, "802036PRD1AlpjfpnmO6KAt", "AdManager");
Object.defineProperty(i, "__esModule", {
  value: ! 0
}
);
i.AD_TYPE = void 0;
var n = e("AdRequestService.js"),
a = e("AdAnalyticsService.js"),
o = e(AdToolbox "
} ].js), r = e(" AdLegacyBridge.js "), s = e(" LanguageService.js "), l = e(" NativeSdkBridgeAdapter.js ");
(function(e) {
e.RELIVE = " relive ";
e.TURNTABLE = " turntable ";
e.LUCKY = " lucky ";
e.TASK = " task ";
})(i.AD_TYPE || (i.AD_TYPE = {}));
var c = function() {
function e() {
this.videoSuccessFun = null;
this.videoFailFun = null;
this.splash_timer = null;
this.splash_finished = !1;
this.video_timer = null;
this.pre_video_time = 0;
this.cpm_data = {
cpm: 0,
source: " ",
unitId: " ",
isApp: " ",
isClose: " ",
activity_date: " ",
activity_num: " "
};
this.adCloseEvent = !1;
this.adSwitch = !0;
this.lastTouchDate = 0;
this.interval = 1.5;
this.insertFailTimer = null;
this.failDesc = " ";
this.start_video_time = 0;
this.end_video_time = 0;
this.play_video_time = 0;
this.is_finish = !1;
this.videoData = null;
this.insertCloseFun = null;
this.addEvent();
}
e.getInstance = function() {
this._instance || (this._instance = new e());
return this._instance;
};
e.prototype.addEvent = function() {
r.default.listen(r.default.events.SPLASH_SHOW, this.clearSplashTimer, this);
r.default.listen(r.default.events.SPLASH_FINISH, this.splashFinish, this);
r.default.listen(r.default.events.VIDEO_CLOSE, this.onVideoClose, this);
r.default.listen(r.default.events.VIDEO_ERROR, this.onVideoError, this);
r.default.listen(r.default.events.ONGETADINFO, this.onUploadCpm, this);
r.default.listen(r.default.events.INSERT_SHOW, this.showInsertAd, this);
r.default.listen(r.default.events.INSERT_CHECK, this.checkInsert, this);
r.default.listen(r.default.events.VIDEO_OPEN_SUCCESS, this.onVideoOpensuccess, this);
};
e.prototype.onUploadCpm = function(e) {
var t = null;
e && (t = JSON.parse(e));
a.default.reportData(" onUploadCpm ");
a.default.reportData(" onUploadCpmData ", t);
var i = o.default.formatDate(new Date().getTime());
this.cpm_data.activity_date = i;
this.cpm_data.cpm = Number((null == t ? void 0 : t.cpm) || 0);
this.cpm_data.source = (null == t ? void 0 : t.source) || " ";
this.cpm_data.unitId = (null == t ? void 0 : t.unit_id) || " ";
a.default.reportData(" cpm_data ", {
cpm: this.cpm_data
});
};
e.prototype.updateVideoTime = function() {
this.pre_video_time = o.default.nowSeconds();
};
e.prototype.getPreVideoTime = function() {
return o.default.nowSeconds() - this.pre_video_time;
};
e.prototype.clearSplashTimer = function() {
this.splash_timer && clearTimeout(this.splash_timer);
};
e.prototype.splashFinish = function() {
this.splash_finished = !0;
r.default.trigger(r.default.events.ON_SPLASH_FINISH);
};
e.prototype.showSplashAd = function(e) {
var t = this;
if (cc.sys.isNative) {
this.splash_timer && clearTimeout(this.splash_timer);
this.splash_timer = setTimeout(function() {
t.splash_finished || r.default.trigger(r.default.events.SPLASH_FINISH);
}, 5e3);
cc.sys.os == cc.sys.OS_ANDROID || cc.sys.os == cc.sys.OS_IOS && r.default.showSplashAd(0, e);
this.adCloseEvent = !0;
} else r.default.trigger(r.default.events.SPLASH_FINISH);
};
e.prototype.closeSplashAd = function() {
cc.sys.isNative && (cc.sys.os, cc.sys.OS_ANDROID);
};
e.prototype.startVideoTimer = function() {
var e = this;
this.video_timer && clearTimeout(this.video_timer);
this.video_timer = setTimeout(function() {
e.doVideoFail(" 广告超时5s ");
}, 5e3);
};
e.prototype.showLongTapToastBeforeVideoAd = function() {
if (cc.sys.isNative && cc.sys.os === cc.sys.OS_ANDROID) try {
var t = s && (s.default || s) || null, i = t && " function " == typeof t.t ? t.t(e.LONG_TAP_TOAST_I18N_KEY, null, e.LONG_TAP_TOAST_FALLBACK) : e.LONG_TAP_TOAST_FALLBACK, n = l && (l.default || l) || null, a = n && " function " == typeof n.getBridge ? n.getBridge() : null;
a && " function " == typeof a.showAppLongTapToast && a.showAppLongTapToast(i, 1);
} catch (e) {
console.warn("[AdManager] showAppLongTapToast failed ", e);
}
};
e.prototype.stopVideoTimer = function() {
this.video_timer && clearTimeout(this.video_timer);
};
e.prototype.playForceVideoAd = function(e, t, i) {
this.videoData = e;
if (cc.sys.isNative && this.adSwitch) {
this.showLongTapToastBeforeVideoAd();
this.start_video_time = o.default.nowSeconds();
this.startVideoTimer();
t && (this.videoSuccessFun = t);
i && (this.videoFailFun = i);
var a = n.default.buildRewardVideoRequest(!0, 13356100);
console.log("[AdManager] requestRewardVideo force adData- > ", a);
n.default.requestRewardVideo(a);
} else {
t();
this.onVideoOpensuccess(e);
}
};
e.prototype.playNormalVideoAd = function(e, t, i, a) {
void 0 === a && (a = " ");
this.videoData = e;
var s = " ";
try {
s = JSON.stringify(this.videoData || {});
} catch (e) {
s = "[unserializable videoData] ";
}
console.log("[AdManager] playNormalVideoAd videoData- > ", this.videoData, " json = ", s);
var l = new Date().getTime() / 1e3;
l < this.lastTouchDate && (this.lastTouchDate = l);
if (this.lastTouchDate && l - this.lastTouchDate < this.interval) {
o.default.log(" 广告点击太频繁 ");
i && i({
type: " too_frequent "
});
} else {
this.lastTouchDate = l;
if (cc.sys.isNative && this.adSwitch) {
this.failDesc = a || null;
this.showLongTapToastBeforeVideoAd();
this.start_video_time = o.default.nowSeconds();
this.startVideoTimer();
t && (this.videoSuccessFun = t);
i && (this.videoFailFun = i);
var c = !(!this.videoData || !this.videoData.force_video), u = c ? 13356100 : 13352100, d = n.default.buildRewardVideoRequest(c, u);
console.log("[AdManager] requestRewardVideo normal adData- > ", d, " force_video = ", c, " slotId = ", u);
n.default.requestRewardVideo(d);
} else {
o.default.localStorageSetItem(" last_vd_time ", String(o.default.nowSeconds()));
t && t();
r.default.setInsertShowTime();
}
}
};
e.prototype.onVideoOpensuccess = function(e) {
this.stopVideoTimer();
o.default.destroyAdManageToast();
var t = e;
if (" string " == typeof t) try {
t = JSON.parse(t);
} catch (e) {
t = {};
}
t && " object " == typeof t || (t = {});
var i = (null == t ? void 0 : t.ferryBulkTierAgate) && " object " == typeof t.ferryBulkTierAgate ? t.ferryBulkTierAgate : {}, n = __assign(__assign({}, i), t), r = o.default.formatDate(new Date().getTime());
this.cpm_data.activity_date = r;
void 0 !== n.cpm && (this.cpm_data.cpm = Number(n.cpm || 0));
void 0 === n.source && void 0 === n.dsp || (this.cpm_data.source = n.source || n.dsp || " ");
void 0 === n.unit_id && void 0 === n.unitId || (this.cpm_data.unitId = n.unit_id || n.unitId || " ");
void 0 === n.slot_id && void 0 === n.slotId || (this.cpm_data.slot_id = Number(n.slot_id || n.slotId || 0));
void 0 === n.placement_id && void 0 === n.placementId || (this.cpm_data.placement_id = n.placement_id || n.placementId || " ");
void 0 !== n.dsp && (this.cpm_data.dsp = n.dsp || " ");
a.default.reportData(" cpm_data ", {
cpm: this.cpm_data
});
if (this.videoData) {
var s = this.videoData, l = s.ad_type, c = s.force_video;
a.default.reportData(" " + l, {
ad_type: l,
force_video: !!c
});
}
};
e.prototype.onVideoClose = function(e) {
var t = this;
this.updateVideoTime();
var i = e.compensationQualifyMark;
this.end_video_time = o.default.nowSeconds();
this.play_video_time = this.end_video_time - this.start_video_time;
this.is_finish = !1;
if (i) {
this.is_finish = !0;
a.default.reportData(" on_video_finish ", {
ad_type: e,
is_reward: i
});
}
this.stopVideoTimer();
setTimeout(function() {
if (t.videoSuccessFun) {
console.log(" 有视频观看成功回调 ");
t.videoSuccessFun(e);
t.videoSuccessFun = null;
}
o.default.localStorageSetItem(" last_vd_time ", String(o.default.nowSeconds()));
}, 300);
r.default.setInsertShowTime();
this.adCloseEvent = !0;
};
e.prototype.onVideoError = function(e) {
a.default.reportData(" on_vide_error ", {
type: e.type
});
this.doVideoFail(e);
};
e.prototype.doVideoFail = function(e) {
var t = this;
this.stopVideoTimer();
this.videoFailFun && setTimeout(function() {
try {
console.log(" videoFailFun == ", t.videoFailFun, JSON.stringify(t.videoFailFun));
t.videoFailFun(e);
} catch (e) {
console.log(" videoFailFun == ", e);
}
t.videoFailFun = null;
}, 300);
};
e.prototype.showInsertAd = function(e) {
o.default.log(" 播放插屏android ");
if (cc.sys.isNative) {
if (cc.sys.os == cc.sys.OS_ANDROID) {
this.insertCloseFun = e || null;
if (" s0 " != r.default.getInsertScreenFlag()) {
if (this.insertFailTimer) {
clearTimeout(this.insertFailTimer);
this.insertFailTimer = null;
}
this.insertFailTimer = setTimeout(function() {
r.default.resumeInsertTimer();
}, 4e3);
}
}
} else {
e && e();
console.log(" web 播放插屏 ");
if (" s0 " != r.default.getInsertScreenFlag()) {
if (this.insertFailTimer) {
clearTimeout(this.insertFailTimer);
this.insertFailTimer = null;
}
this.insertFailTimer = setTimeout(function() {
r.default.resumeInsertTimer();
}, 4e3);
}
}
};
e.prototype.onInsertAdClick = function() {
console.log(" onInsertAdClick ");
};
e.prototype.onInsertAdClose = function() {
console.log(" onInsertAdClose ");
this.insertCloseFun && this.insertCloseFun();
r.default.resumeInsertTimer();
};
e.prototype.onInsertAdShow = function() {
console.log(" onInsertAdShow ");
r.default.pauseInsertTimer();
if (this.insertFailTimer) {
clearTimeout(this.insertFailTimer);
this.insertFailTimer = null;
}
a.default.reportData(" on_insertVideo_show ");
};
e.prototype.preLoadGraphicAd = function() {};
e.prototype.checkSpecialResume = function(e) {
if (!this.adCloseEvent) return !1;
e && (this.adCloseEvent = !1);
console.log(" TEST NEW: CLOSE EVENT reset ! ! ! ");
return !0;
};
e.prototype.showGraphicAd = function() {
var e = cc.view.getFrameSize(), t = cc.winSize;
console.log(" frameSize ", e.width, e.height);
console.log(" winSize ", t.width, t.height);
e.height, e.width;
e.width, e.width, t.width;
e.width, t.height;
};
e.prototype.preLoadHomeAd = function() {};
e.prototype.showHomeAd = function() {};
e.prototype.closeHomeAd = function() {};
e.prototype.preLoadBannerAd = function() {};
e.prototype.showBannerAd = function() {
var e = cc.view.getFrameSize(), t = cc.winSize, i = e.height > 2e3 ? 1.03 : 1;
e.width, e.width, e.width, t.width;
e.width, t.height;
};
e.prototype.checkAdDelay = function() {
var e = !1;
if (!cc.sys.isNative) return !1;
var t = Number(o.default.localStorageGetItem(" last_vd_time ", 0)), i = o.default.nowSeconds() - t;
if (i < 10) {
var n = " 视频准备中 ， " + (10 - i) + " 秒后再试 ";
cc.sys.isNative || o.default.showManageViewToast(n);
e = !0;
}
return e;
};
e.prototype.clear = function() {
r.default.ignore(r.default.events.SPLASH_SHOW, this.clearSplashTimer, this);
r.default.ignore(r.default.events.SPLASH_FINISH, this.clearSplashTimer, this);
};
e.prototype.loadNewSplashAd = function(e, t) {
var i = this;
void 0 === e && (e = 1);
void 0 === t && (t = 0);
o.default.log(" js loadNewSplashAd: ");
if (cc.sys.isNative) {
this.splash_timer && clearTimeout(this.splash_timer);
this.splash_timer = setTimeout(function() {
i.splash_finished || r.default.trigger(r.default.events.SPLASH_FINISH);
}, 5e3);
if (cc.sys.os == cc.sys.OS_ANDROID) ; else if (cc.sys.os == cc.sys.OS_IOS) {
r.default.trigger(r.default.events.SPLASH_FINISH);
return;
}
this.adCloseEvent = !0;
} else r.default.trigger(r.default.events.SPLASH_FINISH);
};
e.prototype.checkInsert = function() {};
e.LONG_TAP_TOAST_I18N_KEY = " key_tip_watch_video_claim_big_reward ";
e.LONG_TAP_TOAST_FALLBACK = " 观看视频即可领取大额奖励 ";
return e;
}();
i.default = c;
cc._RF.pop();
