let e = require;
let t = module;
let i = exports;
"use strict";
cc._RF.push(t, "11b74FYG+FNXKjKbM0YcJY3", "MiddleManager");
Object.defineProperty(i, "__esModule", {
  value: ! 0
}
);
var n = e("MiddleNetwork.js"),
a = e("MiddleService.js"),
o = e("MiddleReqType.js"),
r = e("MiddleHandler.js"),
s = e("BusinessAnalyticsService.js"),
l = e("CryptoHelper.js"),
c = e("ClientDataStore.js"),
u = e("MiddleHelper.js"),
d = e("MiddleSdkEventService.js"),
h = e(MiddleUploadScheduler "
} ].js), p = function() {
function e() {
var e = this;
this.banRed = !0;
this.banPay = !1;
this.recogIRE = !1;
this.recogTF = !1;
this.isSupportHot = !1;
this.intervalSeconds = 60;
this.isFinishReginal = !1;
this.mfi = !0;
this._initMiddleRefer = !1;
this._adConfig = null;
this.autoUploadSeq = 0;
this.lastAutoUploadAt = 0;
this.sdkEventService = new d.default();
this.uploadScheduler = new h.default({
isReady: function() {
return e.isFinishReginal;
},
getIntervalSeconds: function() {
return e.intervalSeconds;
},
uploadNow: function(t) {
return e.autoUploadEvent(t);
}
});
this.syncRegionalStateFromHelper();
this.log(" scheduler created ", {
intervalSeconds: this.intervalSeconds,
isFinishReginal: this.isFinishReginal
});
}
e.prototype.log = function(t, i) {
if (void 0 !== i) {
var n = " ";
try {
n = JSON.stringify(i);
} catch (e) {
n = String(i);
}
console.log(e.LOG_TAG + " " + t + " " + n);
} else console.log(e.LOG_TAG + " " + t);
};
e.getInstance = function() {
e.instance || (e.instance = new e());
return e.instance;
};
e.prototype.middleTFRegional = function() {
this.syncRegionalStateFromHelper();
s.default.reportData(" middleTFRegional ");
if (this._initMiddleRefer) s.default.reportData(" middleTFRegional_init_finish "); else {
this._initMiddleRefer = !0;
s.default.reportData(" middleTFRegional_middleTF ");
this.middleTF();
}
};
e.prototype.middleTF = function(e) {
s.default.reportData(" middle_tf ");
var t = a.default.paramData(o.MiddleReqType.Regional);
console.log("[MiddleManager.middleTF] request params- > ", JSON.stringify(t));
n.default.getMiddleTFRegional(t, r.default.create(this, function(t) {
console.log("[MiddleManager.middleTF] success result- > ", JSON.stringify(t));
if (t) {
s.default.reportData(" middle_tf_result ", {
is_self_match_tf: t.is_self_match_tf
});
e && e();
}
}), r.default.create(this, function(e) {
console.error("[MiddleManager.middleTF] fail result- > ", JSON.stringify(e));
s.default.reportData(" middle_tf_result_error ");
}));
};
e.prototype.autoUploadEvent = function(e) {
var t = this;
void 0 === e && (e = " unknown ");
var i = this.isFinishReginal;
this.syncRegionalStateFromHelper();
if (!i && this.isFinishReginal) {
this.log(" ready state changed ", {
from: i,
to: this.isFinishReginal,
source: e
});
this.uploadScheduler.refreshTimerByMode();
}
var n = Date.now(), a = this.lastAutoUploadAt > 0 ? n - this.lastAutoUploadAt : -1;
this.autoUploadSeq += 1;
this.log(" trigger ", {
seq: this.autoUploadSeq,
source: e,
isFinishReginal: this.isFinishReginal,
intervalSeconds: this.intervalSeconds,
elapsedSinceLastMs: a
});
this.lastAutoUploadAt = n;
this.uploadScheduler.markUploadTriggered();
this.sdkEventService.uploadOnce(function(i) {
var n = t.intervalSeconds;
t.intervalSeconds = i;
t.log(" interval update ", {
seq: t.autoUploadSeq,
source: e,
oldIntervalSeconds: n,
newIntervalSeconds: t.intervalSeconds
});
t.uploadScheduler.refreshTimerByMode();
});
};
e.prototype.onDestroy = function() {
this.uploadScheduler && this.uploadScheduler.destroy();
};
e.prototype.getAdConfig = function(e, t) {
var i = this;
this.syncRegionalStateFromHelper();
if (1 != this.mfi) {
s.default.reportData(" wp_mfi_false ");
console.log("[MiddleManager] 开始获取广告配置 ");
var l = a.default.paramData(o.MiddleReqType.ADCONFIG);
n.default.getAdConfig(l, r.default.create(this, function(n) {
if (n) {
console.log("[MiddleManager] 广告配置获取成功 ");
if (n.urls && Array.isArray(n.urls) && 0 !== n.urls.length) {
for (var a = 0; a < n.urls.length; a++) {
var o = n.urls[a];
if (o && o.sst) try {
var r = i.decryptAdConfigSst(o.sst);
if (r) {
o.sst = r;
console.log("[MiddleManager] config.urls[" + a + "].sst 解密成功 ");
}
} catch (e) {
s.default.reportData(" wp_config_error ", {
error: " sst解密异常 "
});
console.error("[MiddleManager] config.urls[" + a + "].sst 解密异常: ", e);
}
}
i._adConfig = n;
e && e(n);
} else {
console.error("[MiddleManager] 广告配置中 urls 不存在或为空数组 ");
t && t(" 广告配置中 urls 不存在或为空数组 ");
}
} else t && t(" 广告配置返回数据为空 ");
}), r.default.create(this, function(e) {
console.error("[MiddleManager] 广告配置获取失败: ", e);
t && t(e);
}));
} else if (t) {
t(" mfi为true ， 不获取广告配置 ");
s.default.reportData(" wp_mfi_true ");
}
};
e.prototype.getAdConfigData = function() {
return this._adConfig;
};
e.prototype.syncRegionalStateFromHelper = function() {
var e = u.default.getRegionalState ? u.default.getRegionalState() : null;
if (e) {
this.log(" syncRegionalStateFromHelper raw ", e);
this.isSupportHot = !!e.isSupportHot;
this.isFinishReginal = !!e.isFinishRegional;
this.banRed = !!e.banRed;
this.banPay = !!e.banPay;
this.recogIRE = !!e.recogIRE;
this.recogTF = !!e.recogTF;
void 0 !== e.mfi && null !== e.mfi && (this.mfi = !!e.mfi);
this.log(" syncRegionalStateFromHelper applied ", {
isSupportHot: this.isSupportHot,
isFinishReginal: this.isFinishReginal,
banRed: this.banRed,
banPay: this.banPay,
recogIRE: this.recogIRE,
recogTF: this.recogTF,
mfi: this.mfi
});
} else this.log(" syncRegionalStateFromHelper no state ");
};
e.prototype.decryptAdConfigSst = function(e) {
if (!e) return e;
try {
return l.default.decrypt(e, c.default.box_pkg_name);
} catch (t) {
return e;
}
};
e.LOG_TAG = "[MiddleManager.autoUploadEvent] ";
e.instance = null;
return e;
}();
i.default = p;
cc._RF.pop();
