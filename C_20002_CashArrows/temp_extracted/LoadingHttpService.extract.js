LoadingHttpService: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "390deBWv3NMDpX9egWOI3MR", "LoadingHttpService");
Object.defineProperty(i, "__esModule", {
value: !0
});
var n = e("../../src/framework/Net/RequestQueueEngine"), a = e("../../src/framework/Net/descriptors/BusinessRequestDescriptors"), o = e("../../src/framework/Net/RequestDescriptor"), r = e("../core/CryptoHelper"), s = e("../data/ClientDataStore"), l = e("../data/SystemDataStore"), c = e("../report/BusinessAnalyticsService"), u = new o.default(a.BUSINESS_REQUEST_DESCRIPTORS), d = "[MigrationBundle][HTTP]", h = 5;
function p() {
return Date.now();
}
function _(e) {
try {
return JSON.stringify(e);
} catch (t) {
return String(e);
}
}
function f(e, t) {
var i = (t || []).map(function(e) {
return String(e || "").trim();
}).filter(Boolean).join(" | ");
console.log(e + (i ? " | " + i : ""));
}
function g(e, t) {
window.forceLog = !0;
var i = [ t.requestKey ? "key=" + t.requestKey : "", t.uri ? "uri=" + t.uri : "", t.url ? "url=" + t.url : "", void 0 !== t.status ? "status=" + t.status : "", void 0 !== t.code ? "code=" + t.code : "", t.method ? "method=" + t.method : "", void 0 !== t.elapsedMs ? "cost=" + t.elapsedMs + "ms" : "", t.message ? "msg=" + t.message : "" ].filter(Boolean).join(" | ");
console.log(d + " " + e + (i ? " | " + i : ""));
}
function m(e, t) {
c.default.reportData(e, t);
}
function y(e, t, i) {
if ((n = h) >= 100 || !(n <= 0) && 100 * Math.random() < n) {
var n;
m("http_monitor", {
request_path: e || "",
request_url: e || "",
response_code: Number(t) || 0,
response_time: Math.max(0, Math.floor(Number(i) || 0))
});
}
}
function v(e) {
m("ip_request_err", {
err_type: e
});
}
var b = function() {
function e(e) {
this._data = {};
this._trace = e;
var t = s.default.yid || "";
this._data.yid = "yid_read_fail" === t || "yid_read_failed" === t ? "" : t;
this._data.device_id = s.default.device_id || "";
}
e.prototype.append = function(e, t) {
this._data[e] = t;
};
e.prototype.toJSON = function() {
return JSON.stringify(this._data);
};
e.prototype.toText = function() {
var e = this.toJSON();
return r.default.encrypt(e, s.default.box_pkg_name);
};
e.prototype.trace = function() {
return this._trace;
};
return e;
}();
function w(e, t) {
for (var i = {}, n = 0, a = s.default.commonUrlStr.split("&"); n < a.length; n++) {
var o = a[n].split("="), l = o[0], c = o[1];
l && (i[l] = c);
}
var u = Math.floor(Date.now() / 1e3), d = s.default.uuid();
i.nonce_str = d;
i.et = u;
i.ngister = r.default.ngister("/" + e, u.toString(), d, s.default.version_name, s.default.channel_name, s.default.device_id, s.default.box_pkg_name);
i.game_version = t;
return i;
}
function k(e, t, i) {
var n = u.getUri(t), a = new b({
requestKey: t,
uri: n,
startedAt: p()
});
(e = __assign({}, e)).l_params = w(n, i);
a.trace().businessPlainData = e;
var o, c = S(t);
f(d + " REQ_PARAMS | key=" + t, [ "  method      : POST", "  contentType : text/plain", "  url         : " + c, "  yid         : " + s.default.yid, "  device_id   : " + s.default.device_id, "  l_params    : " + _(e.l_params), "  data        : " + _(e) ]);
o = l.default.encrypt ? r.default.encrypt(JSON.stringify(e), s.default.box_pkg_name) : JSON.stringify(e);
a.append("business_data", o);
return a;
}
function S(e) {
var t = s.default.local_country || "";
return l.default.get_request_url() + u.getUri(e) + "?pkg=" + s.default.package_name + "&cy=" + t;
}
var C = function() {
function e(e, t, i) {
this._successHandle = t;
this._failHandle = i;
this._enqueue = u.needEnqueue(e);
this._retry = this._enqueue;
}
e.prototype.success = function(e) {
var t;
null === (t = this._successHandle) || void 0 === t || t.runWith(e);
};
e.prototype.fail = function(e) {
var t;
null === (t = this._failHandle) || void 0 === t || t.runWith(e);
return this._retry;
};
e.prototype.enterQueue = function() {
return this._enqueue;
};
e.prototype.needRetry = function() {
return this._retry;
};
return e;
}();
function T(e) {
return {
shouldEnqueue: function(e) {
return e.enterQueue();
},
shouldRetry: function(e) {
return e.needRetry();
},
refreshUrlOnRetry: function() {
return "";
},
onRetry: function(t, i) {
g("RETRY", {
message: _(t)
});
e(t, i);
},
onQueueCallback: function() {},
parseSuccessResponse: function(e) {
var t = e.url, i = e.reqData, n = e.responseText, a = e.status, o = i.trace(), l = p() - o.startedAt;
y(t, a, l);
if (!n) {
v("onreadystatechange");
g("FAIL", {
requestKey: o.requestKey,
uri: o.uri,
url: t,
status: a,
elapsedMs: l,
message: "response empty"
});
return {
success: !1,
data: {
code: -1,
message: "返回数据不存在"
}
};
}
var c, u = n;
try {
var h = r.default.decrypt(n, s.default.box_pkg_name);
h && (u = h);
} catch (e) {
console.warn(d + " DECRYPT_FAIL | key=" + o.requestKey + " | url=" + t, e);
}
try {
c = JSON.parse(u);
} catch (e) {
v("parseErr");
g("FAIL", {
requestKey: o.requestKey,
uri: o.uri,
url: t,
status: a,
elapsedMs: l,
message: "response parse fail"
});
console.error(d + " RESP_PARSE_FAIL | key=" + o.requestKey + " | raw=" + n);
return {
success: !1,
data: {
code: -1,
message: "响应解析失败",
raw: n
}
};
}
f(d + " RESP_BODY | key=" + o.requestKey, [ "  method      : POST", "  url         : " + t, "  status      : " + a, "  body        : " + u ]);
if (-1 === c.code || -1e3 === c.code) {
g("FAIL", {
requestKey: o.requestKey,
uri: o.uri,
url: t,
status: a,
code: c.code,
elapsedMs: l,
message: c.message
});
return {
success: !1,
data: c
};
}
g("SUCCESS", {
requestKey: o.requestKey,
uri: o.uri,
url: t,
status: a,
code: c.code,
elapsedMs: l
});
return {
success: !0,
data: c
};
},
buildRequestBody: function(e) {
var t = e.trace(), i = e.toJSON(), n = e.toText();
f(d + " REQ_BODY | key=" + t.requestKey + " | uri=" + t.uri, [ "  business_plain: " + _(t.businessPlainData || {}), "  raw_body      : " + i, "  encrypted_body: " + n ]);
return n;
},
onRequestStart: function(e) {
var t = e.url, i = e.reqData, n = e.requestBody, a = i.trace();
a.startedAt = p();
g("START", {
requestKey: a.requestKey,
uri: a.uri,
url: t,
method: "POST"
});
f(d + " START_DETAIL | key=" + a.requestKey + " | uri=" + a.uri, [ "  method      : POST", "  contentType : text/plain", "  url         : " + t, "  body_size   : " + String(n || "").length, "  body        : " + String(n || "") ]);
},
createStatusError: function(e) {
var t = e.url, i = e.reqData, n = e.status, a = i.trace(), o = p() - a.startedAt;
y(t, n, o);
v("onreadystatechange");
g("FAIL", {
requestKey: a.requestKey,
uri: a.uri,
url: t,
status: n,
elapsedMs: o,
message: "xhr.status" + n
});
return {
code: -1,
message: "xhr.status" + n,
http_status: n
};
},
createRuntimeError: function(e) {
var t = e.url, i = e.reqData, n = e.status, a = e.reason, o = i.trace(), r = p() - o.startedAt;
y(t, n, r);
v("timeout" === a ? "ontimeout" : "onerror");
g("FAIL", {
requestKey: o.requestKey,
uri: o.uri,
url: t,
status: n,
elapsedMs: r,
message: "onXhr." + a
});
return {
code: -1,
message: "onXhr." + a,
http_status: n
};
},
dispatchResult: function(e, t, i) {
e && (t ? e.success(i) : e.fail(i));
}
};
}
var N = function() {
function e() {}
e.reportHttpErr = function(e) {
m("httpErr", {
response: _(e),
category: "network_error"
});
};
e.init = function(e) {
this.engine || (this.engine = new n.default(T(e)));
};
e.setGameVersion = function(e) {
this.gameVersion = e;
};
e.request = function(e, t, i, n) {
var a = S(e), o = k(t || {}, e, this.gameVersion), r = new C(e, i, n);
this.engine.queuePost(a, o, r);
};
e.syncFirebaseToken = function(e, t, i) {
m("sync_firebase_token", {
firebase_token: e
});
var n = String(e || "").trim();
n ? this.request("FirebaseToken", {
firebase_token: n
}, t, i) : null == i || i.runWith({
code: -1,
message: "firebase_token empty"
});
};
e.getSystemConfig = function(e, t) {
this.request("config", null, e, t);
};
e.autoLogin = function(e, t, i) {
this.request("auto_submit", e, t, i);
};
e.touristsLogin = function(e, t, i) {
this.request("TouristLogin", e, t, i);
};
e.getGameConfig = function(e, t) {
this.request("GetGameConfig", null, e, t);
};
e.getUserInfo = function(e, t) {
this.request("UserInfo", null, e, t);
};
e.getWithdrawInfo = function(e, t) {
this.request("WithdrawInfo", null, e, t);
};
e.withdrawCash = function(e, t, i) {
this.request("WithdrawCash", e, t, i);
};
e.bindTxAccount = function(e, t, i) {
this.request("BindTxAccount", e, t, i);
};
e.getBarrageList = function(e, t) {
this.request("BarrageList", null, e, t);
};
e.getTaskInfo = function(e, t, i) {
var n, a, o = "";
if ("string" == typeof e) {
o = e || "";
n = t;
a = i;
} else {
n = e;
a = t;
}
var r = {};
o && (r.task_type = o);
this.request("TaskInfo", Object.keys(r).length > 0 ? r : null, n, a);
};
e.claimTaskReward = function(e, t, i, n) {
var a = {
task_id: e || ""
};
t && (a.task_type = t);
this.request("TaskOnlyReward", a, i, n);
};
e.claimTaskAdReward = function(e, t, i, n, a) {
var o = Object.assign({}, t || {}, {
task_id: e || ""
});
i && (o.task_type = i);
this.request("TaskShowReward", o, n, a);
};
e.buildSdkQueryString = function(e) {
var t = s.default.user_id || "", i = s.default.yid || "", n = "yid_read_fail" === i || "yid_read_failed" === i ? "" : i, a = Math.floor(Date.now() / 1e3), o = s.default.uuid(), l = r.default.ngister("", a.toString(), o, s.default.version_name, s.default.channel_name, s.default.device_id, s.default.box_pkg_name);
f(d + " SDK_NGISTER_PARAMS", [ '  url(signPath)   : ""', '  time(et)        : "' + a + '"', '  nonce(nonce_str): "' + o + '"', '  versionName     : "' + s.default.version_name + '"', '  channelName     : "' + s.default.channel_name + '"', '  deviceId        : "' + s.default.device_id + '"', '  boxPkgName      : "' + s.default.box_pkg_name + '"', '  => ngister      : "' + l + '"' ]);
var c = [];
c.push("user_id=" + t);
c.push("yid=" + n);
var u = s.default.commonUrlStr;
u && c.push(u);
c.push("nonce_str=" + o);
c.push("et=" + a);
c.push("ngister=" + l);
c.push("sign_type=3");
c.push("country=" + (s.default.local_country || ""));
c.push("cy=" + (s.default.local_country || ""));
if (e) for (var h = 0, p = Object.keys(e); h < p.length; h++) {
var _ = p[h];
c.push(_ + "=" + (e[_] || ""));
}
return c.join("&");
};
e.sdkRequest = function(e, t, i, n, a, o) {
var l, c;
void 0 === a && (a = !1);
void 0 === o && (o = !0);
var h = u.getUri(e), p = s.default.local_country || "", _ = this.SDK_WD_BASE + h + "?package_name=" + s.default.package_name + "&cy=" + p, m = s.default.user_id || "", y = {};
if (o && t && "object" == typeof t) for (var v = 0, b = Object.keys(t); v < b.length; v++) y[T = b[v]] = String(null !== (l = t[T]) && void 0 !== l ? l : "");
var w = this.buildSdkQueryString(y), k = {
user_id: m
};
if (a && t && "object" == typeof t) for (var S = 0, C = Object.keys(t); S < C.length; S++) {
var T;
k[T = C[S]] = null !== (c = t[T]) && void 0 !== c ? c : "";
}
k.query = w;
var N = JSON.stringify(k), I = r.default.encrypt(N, s.default.box_pkg_name);
f(d + " SDK_REQ | key=" + e, [ "  method      : POST", "  contentType : text/plain", "  url         : " + _, "  raw_body    : " + N, "  encrypted   : " + (I || "").substring(0, 120) + "..." ]);
var A = new XMLHttpRequest();
A.timeout = 15e3;
A.onreadystatechange = function() {
if (4 === A.readyState) if (A.status >= 200 && A.status < 300) {
var t = A.responseText || "";
f(d + " SDK_RESP_RAW | key=" + e, [ "  method      : POST", "  status      : " + A.status, "  raw         : " + t.substring(0, 500) ]);
var a = t;
try {
var o = r.default.decrypt(t, s.default.box_pkg_name);
if (o) {
a = o;
console.log(d + " SDK_RESP_DECRYPTED | " + a.substring(0, 500));
}
} catch (e) {
console.warn(d + " SDK_RESP decrypt skip", e);
}
try {
var l = JSON.parse(a);
g("SUCCESS", {
url: _,
status: A.status,
code: l.code
});
null == i || i.runWith(l);
} catch (e) {
g("FAIL", {
url: _,
status: A.status,
message: "parse error"
});
console.error(d + " SDK_RESP_PARSE_FAIL | respText=" + a.substring(0, 500));
null == n || n.runWith({
code: -1,
message: "响应解析失败"
});
}
} else {
g("FAIL", {
url: _,
status: A.status,
message: "http error " + A.status
});
null == n || n.runWith({
code: -1,
message: "请求失败",
http_status: A.status
});
}
};
A.onerror = function() {
g("FAIL", {
url: _,
message: "network error"
});
null == n || n.runWith({
code: -1,
message: "网络错误"
});
};
A.ontimeout = function() {
g("FAIL", {
url: _,
message: "timeout"
});
null == n || n.runWith({
code: -1,
message: "请求超时"
});
};
g("START", {
url: _,
method: "POST"
});
A.open("POST", _, !0);
A.setRequestHeader("Content-Type", "text/plain");
A.send(I);
};
e.getWithdrawChannels = function(e, t) {
this.sdkRequest("WithdrawChannels", null, e, t);
};
e.verifyWithdrawBindInfo = function(e, t, i) {
var n = "string" == typeof (null == e ? void 0 : e.info) ? e.info : JSON.stringify((null == e ? void 0 : e.info) || {});
this.sdkRequest("VerifyBindInfo", {
channel: (null == e ? void 0 : e.channel) || "",
sub_channel: (null == e ? void 0 : e.sub_channel) || "",
info: n
}, t, i, !0, !1);
};
e.getArrowLevelConfig = function(e, t, i) {
this.request("ArrowLevelConfig", e, t, i);
};
e.arrowRewardSettle = function(e, t, i) {
this.request("ArrowRewardSettle", e, t, i);
};
e.claimArrowReward = function(e, t, i) {
var n = Object.assign({}, e || {});
n.business_type || (n.business_type = "arrow");
"task" !== n.business_type ? delete n.task_type : "ltv" !== String(n.task_type || "").toLowerCase() && delete n.task_type;
this.request("ArrowClaimReward", n, t, i);
};
e.claimArrowAdReward = function(e, t, i) {
var n = Object.assign({}, e || {});
n.business_type || (n.business_type = "arrow");
"task" !== n.business_type ? delete n.task_type : "ltv" !== String(n.task_type || "").toLowerCase() && delete n.task_type;
this.request("ArrowClaimAdReward", n, t, i);
};
e.consumeArrowProp = function(e, t, i) {
this.request("ArrowConsumeProp", e, t, i);
};
e.buildHotUpdateBody = function(e) {
return k(e, "HotUpdate", this.gameVersion).toText();
};
e.gameVersion = "1.0.0.0";
e.SDK_WD_BASE = "https://hxjxd.casharrows.com/vunuar/";
e.SDK_WD_URI = "c_l";
e.SDK_WD_VERIFY_URI = "ck_i";
return e;
}();
i.default = N;
cc._RF.pop();
}