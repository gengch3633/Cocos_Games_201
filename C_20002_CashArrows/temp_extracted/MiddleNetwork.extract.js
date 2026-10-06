MiddleNetwork: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "6f039EWa1lOWIk8QXMMXiGw", "MiddleNetwork");
Object.defineProperty(i, "__esModule", {
value: !0
});
var n = e("../../src/middle/MiddleRequestDescriptors"), a = e("../../src/middle/MiddleProjectAdapterConfig"), o = e("../core/CryptoHelper"), r = e("../data/ClientDataStore"), s = e("../platform/HotUpdateManager"), l = "[MiddleNetwork]", c = "com.sdk.country";
function u(e) {
try {
return JSON.stringify(e);
} catch (t) {
return String(e);
}
}
function d(e) {
try {
return JSON.parse(e);
} catch (t) {
return e;
}
}
function h(e, t) {
e && ("function" != typeof e ? e && "function" == typeof e.runWith && e.runWith(t) : e(t));
}
var p = [ "referrer_url", "referrer_timestamp_server", "install_timestamp_server", "oaid" ];
function _(e, t) {
if (!t || "object" != typeof t) return e;
for (var i = 0, n = p; i < n.length; i++) {
var a = n[i], o = t[a];
null != o && (e[a] = o);
}
return e;
}
function f(e) {
for (var t = [], i = 0, n = Object.keys(e); i < n.length; i++) {
var a = n[i], o = e[a];
null != o && t.push(a + "=" + o);
}
return t.join("&");
}
function g(e, t) {
if (!t) return "";
var i = t.indexOf("?") >= 0 ? "&" : "?";
return t.indexOf("pkg=") >= 0 ? t : "" + t + i + "pkg=" + encodeURIComponent(r.default.box_pkg_name || "");
}
function m(e) {
return "/" + (e || "").split("?")[0].split("/").slice(3).join("/");
}
function y(e) {
return "APPLOG" === e || "ADSDK" === e || "COREDATA" === e;
}
function v() {
try {
var e = cc.sys.localStorage.getItem(c);
if (e) return String(e).toUpperCase();
} catch (e) {}
return String(r.default.local_country || "").toUpperCase() || "IN";
}
function b() {
try {
return s.default.getInstance().getVersion() || r.default.version_name || "";
} catch (e) {
return r.default.version_name || "";
}
}
function w() {
try {
return s.default.getInstance().getBaseVersion() || "";
} catch (e) {
return "";
}
}
function k(e) {
for (var t = r.default, i = Object.keys(t).filter(function(e) {
return "function" != typeof t[e];
}), n = 0; n < i.length; n++) {
var o = i[n];
e[o] = t[o];
}
var s = v();
e.game_version = b();
e.game_base_version = w();
e.country = s;
e.cy = s;
e.game_name = a.MIDDLE_PROJECT_ADAPTER_CONFIG.gameName || "";
}
function S(e) {
if (!Array.isArray(e) || e.length <= 0) return e || [];
e.forEach(function(e) {
(t = e) && "object" == typeof t && k(t);
var t;
});
return e;
}
function C(e) {
return Array.isArray(null == e ? void 0 : e.payload) ? S(e.payload) : Array.isArray(null == e ? void 0 : e.list) ? S(e.list) : [];
}
function T(e, t) {
var i, a = t || {}, s = Math.floor(Date.now() / 1e3).toString(), l = r.default.uuid(), c = m((null === (i = n.MIDDLE_REQUEST_DESCRIPTORS[e]) || void 0 === i ? void 0 : i.url) || ""), u = o.default.ngister(c, s, l, r.default.version_name, r.default.channel_name, r.default.device_id, r.default.box_pkg_name), d = a.ds || r.default.ds || {
ir: "0",
ie: "0",
irv: "0",
ix: "0",
ih: "0",
io: "0",
iw: "0",
id: "0",
ids: "0"
};
if ("string" == typeof a.query) {
if (y(e)) return JSON.stringify({
payload: C(a),
query: a.query,
ds: d
});
var h = {
query: a.query,
ds: d
};
"TFRegional" === e && _(h, a);
return JSON.stringify(h);
}
for (var p = {
is_test: "false",
version_name: r.default.version_name,
version_code: "0",
channel_name: r.default.channel_name,
box_pkg_name: r.default.box_pkg_name,
network_type: r.default.network_type,
et: s,
nonce_str: l,
ngister: u,
sign_type: "3",
platform: r.default.os_name,
android_id: r.default.android_id,
device_id: r.default.device_id,
country: "",
local_country: r.default.local_country,
oaid: r.default.oaid
}, g = 0, v = Object.keys(a); g < v.length; g++) {
var b = v[g];
if ("query" !== b && "ds" !== b && void 0 === p[b]) {
var w = a[b];
null != w && "object" != typeof w && (p[b] = String(w));
}
}
return y(e) ? JSON.stringify({
payload: C(a),
query: f(p),
ds: d
}) : JSON.stringify({
query: f(p),
ds: d
});
}
var N = function() {
function e() {}
e.request = function(e, t, i, a) {
var s = n.MIDDLE_REQUEST_DESCRIPTORS[e], c = null == s ? void 0 : s.url;
if (c) {
var p = g(0, c), _ = T(e, t), f = o.default.encrypt(_, r.default.box_pkg_name), m = t || {}, y = d(_);
console.log(l, "REQ", e, "url ->", p);
console.log(l, "REQ", e, "baseUrl ->", c);
console.log(l, "REQ", e, "input params ->", u(m));
console.log(l, "REQ", e, "plain params ->", u(y));
console.log(l, "REQ", e, "encrypted length ->", f.length);
var v = new XMLHttpRequest();
v.timeout = 15e3;
v.onreadystatechange = function() {
if (4 === v.readyState) {
var t = v.status, n = v.responseText || "";
console.log(l, "RESP", e, "status ->", t, "raw length ->", n.length);
if (t < 200 || t >= 400 || !n) h(a, {
code: -1,
message: "http status " + t,
http_status: t,
raw: n
}); else {
var s = n;
try {
var c = o.default.decrypt(n, r.default.box_pkg_name);
c && (s = c);
} catch (t) {
console.warn(l, "DECRYPT_FAIL", e, t);
}
try {
var u = JSON.parse(s);
if (u && (-1 === u.code || -1e3 === u.code)) {
h(a, u);
return;
}
h(i, u);
} catch (t) {
console.error(l, "RESP_PARSE_FAIL", e, t, "raw ->", n);
h(a, {
code: -1,
message: "response parse fail",
raw: n
});
}
}
}
};
v.onerror = function() {
h(a, {
code: -1,
message: "xhr.error",
http_status: v.status
});
};
v.ontimeout = function() {
h(a, {
code: -1,
message: "xhr.timeout",
http_status: v.status
});
};
v.open("POST", p, !0);
v.setRequestHeader("Content-Type", "text/plain;charset=UTF-8");
v.send(f);
} else h(a, {
code: -1,
message: "descriptor url missing: " + e
});
};
e.getSDKEvent = function(e, t, i) {
this.request("event", e, t, i);
};
e.getMiddleCountry = function(e, t, i) {
this.request("Regional", e, t, i);
};
e.trackAdSdk = function(e, t, i) {
this.request("ADSDK", e, t, i);
};
e.trackCoreData = function(e, t, i) {
this.request("COREDATA", e, t, i);
};
e.trackAppLog = function(e, t, i) {
this.request("APPLOG", e, t, i);
};
e.getMiddleTFRegional = function(e, t, i) {
this.request("TFRegional", e, t, i);
};
e.getPlatform = function(e, t, i) {
this.request("Platform", e, t, i);
};
e.submitWithdrawal = function(e, t, i) {
this.request("BindWithdrawal", e, t, i);
};
e.getAdConfig = function(e, t, i) {
this.request("AdConfig", e, t, i);
};
return e;
}();
i.default = N;
cc._RF.pop();
}