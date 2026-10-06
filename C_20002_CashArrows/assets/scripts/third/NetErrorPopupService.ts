// @ts-nocheck
import UIDefine from "./UIDefine";
import UIMgr from "./UIMgr";

var n = UIMgr, a = UIDefine, o = "[NetErrorPopup]", r = [ -777 ], s = [ "xhr.status", "xhr.error", "onXhr.", "timeout", "返回数据不存在", "响应解析失败", "response parse fail", "http status", "network error", "网络错误" ];
function l(e) {
if (e && "object" == typeof e) {
if ("number" == typeof e.code) return e.code;
if ("string" == typeof e.code) {
var t = Number(e.code);
return isNaN(t) ? void 0 : t;
}
}
}
function c(e) {
if (void 0 === e) return !1;
for (var t = 0; t < r.length; t++) if (r[t] === e) return !0;
return !1;
}
function u(e) {
if (!e) return !1;
for (var t = String(e).toLowerCase(), i = 0; i < s.length; i++) if (t.indexOf(s[i].toLowerCase()) >= 0) return !0;
return !1;
}
function d(e) {
if (!e || "object" != typeof e) return !1;
if (u(e.message)) return !0;
var t = e.http_status;
if (null != t) {
var i = Number(t);
if (!isFinite(i) || i < 200 || i >= 300) return !0;
}
return -1 === l(e);
}
var h = {
_isShowing: !1,
_pendingRetry: null,
shouldPop: function(e) {
return !!e && (!!c(l(e)) || d(e));
},
consumePendingRetry: function() {
var e = this._pendingRetry;
this._pendingRetry = null;
return e;
},
_showPopup: function(e) {
if (this._isShowing) {
console.log(o, "popup already showing, merge retryFn into queue");
var t = this._pendingRetry;
"function" == typeof e && (this._pendingRetry = "function" == typeof t ? function() {
try {
t();
} catch (e) {
console.warn(o, "merged retry 1 failed", e);
}
try {
e();
} catch (e) {
console.warn(o, "merged retry 2 failed", e);
}
} : e);
} else {
this._pendingRetry = "function" == typeof e ? e : null;
var i = this;
i._isShowing = !0;
var r = n.default.getInstance(), s = a.default.netErrorView;
if (s) {
console.log(o, "showing popup with retryFn:", !!e);
r.show(s).then(function(e) {
if (e) console.log(o, "popup shown successfully"); else {
console.warn(o, "UIMgr.show returned null, fallback retry");
i._isShowing = !1;
var t = i.consumePendingRetry();
t && t();
}
}).catch(function(e) {
console.warn(o, "UIMgr.show failed", e);
i._isShowing = !1;
var t = i.consumePendingRetry();
t && t();
});
} else {
console.warn(o, "UIDefine.netErrorView missing, fall back to retry immediately");
i._isShowing = !1;
var l = i.consumePendingRetry();
l && l();
}
}
},
notifyClosed: function() {
this._isShowing = !1;
},
wrapCallbacks: function(e) {
var t = (e = e || {}).onSuccess, i = e.onFail, n = e.retry, a = !!e.skipForceRetryCode, r = this;
return {
success: function(e) {
if (a || !c(l(e))) "function" == typeof t && t(e); else {
console.warn(o, "success branch hit force-retry code, route to retry popup, code=" + l(e));
"function" == typeof n ? r._showPopup(n) : "function" == typeof i && i(e);
}
},
fail: function(e) {
if (r.shouldPop(e) && "function" == typeof n) {
console.warn(o, "fail branch triggers retry popup, err=" + JSON.stringify(e));
r._showPopup(n);
} else "function" == typeof i && i(e);
}
};
},
handle: function(e, t, i) {
if (this.shouldPop(e) && "function" == typeof t) {
this._showPopup(t);
return !0;
}
"function" == typeof i && i(e);
return !1;
},
showAndRetry: function(e) {
this._showPopup(e);
}
};
export default h;
