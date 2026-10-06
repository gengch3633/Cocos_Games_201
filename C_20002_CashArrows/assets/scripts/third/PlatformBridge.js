let e = require;
let t = module;
let i = exports;
"use strict";
cc._RF.push(t, "53a0f/bhJxKsYCxBd5tBJuK", "PlatformBridge");
Object.defineProperty(i, "__esModule", {
  value: ! 0
}
);
var n = e("NativeSdkBridgeAdapter.js"),
a = e("MiddleProjectAdapterConfig.js"),
o = e(BusinessCommonConfig "
} ].js).BUSINESS_COMMON_CONFIG.defaultLanguage;
function r(e) {
if (!e) return " ";
var t = String(e).toUpperCase();
return " GB " === t ? " UK " : t;
}
function s() {
var e = null;
try {
e = cc.sys.localStorage.getItem(" web_device_id ");
} catch (e) {}
if (e) return e;
var t = " xxxxxxxx- xxxx- 4xxx- yxxx- xxxxxxxxxxxx ".replace(/[xy]/g, function(e) {
var t = 16 * Math.random() | 0;
return (" x " === e ? t : 3 & t | 8).toString(16);
});
try {
cc.sys.localStorage.setItem(" web_device_id ", t);
} catch (e) {}
return t;
}
function l(e) {
if (!e) return null;
try {
return JSON.parse(e);
} catch (e) {
return null;
}
}
function c(e) {
if (!e) return null;
try {
var t = e.replace(/-/g, "+ ").replace(/_/g, "/ "), i = t.length % 4, n = i ? t + " = ".repeat(4 - i) : t;
return l(atob(n));
} catch (e) {
return null;
}
}
function u(e) {
if (e && " object " == typeof e) return e;
if (" string " != typeof e) return {};
var t = e.trim();
if (!t) return {};
var i = l(t);
if (i && " object " == typeof i) return i;
var n = c(t);
if (n && " object " == typeof n) return n;
console.warn("[PlatformBridge] getClientInfo parse failed, fallback to {
}
", t.slice(0, 120));
return {};
}
var d = function() {
function e() {}
e.getClientInfo = function() {
if (cc.sys.isNative && cc.sys.os === cc.sys.OS_ANDROID) {
var e = u(n.default.getBridge().getClientInfo());
e.box_pkg_name = a.MIDDLE_PROJECT_ADAPTER_CONFIG.releasePkgName;
var t = a.MIDDLE_PROJECT_ADAPTER_CONFIG.fieldMapping.local_country, i = r((null == e ? void 0 : e.local_country) || (t ? null == e ? void 0 : e[t] : " "));
if (!i) {
i = (l = cc.sys.language, {
zh: " CN ",
en: " US ",
id: " ID ",
pt: " BR ",
ru: " RU ",
de: " DE ",
fr: " FR ",
es: " MX ",
hi: " IN ",
th: " TH ",
ja: " JP ",
ko: " KR ",
fil: " PH ",
tl: " PH "
}[String(l || " ").toLowerCase()] || r(o) || " IN ");
console.warn("[PlatformBridge] native local_country 为空 ， 回退 language 映射- > ", i);
}
e.local_country = i;
return e;
}
var l;
return {
device_id: s(),
version_name: " 1.1.1 ",
android_id: " fc3ac8e631ea68c2 ",
channel_name: " google ",
package_name: a.MIDDLE_PROJECT_ADAPTER_CONFIG.releasePkgName,
box_pkg_name: a.MIDDLE_PROJECT_ADAPTER_CONFIG.releasePkgName,
oaid: " oaid- test ",
os_version: " 11 ",
phone_model: " 22101317C ",
phone_brand: " Redmi- test ",
os_name: " android ",
device_type: " Xiaomi- test ",
device_serial: " unknown ",
system_version: " 14 ",
phone_manufacturer: " Xiaomi- test ",
display_hypotenuse: 6.357,
display_metrics: " 1080x2262 ",
cpu_number: 1,
lat: " ",
lg: " zh ",
local_country: o,
network_operator: " ",
network_type: " wifi ",
sdk_version_name: " 4.0.0 ",
adjust_id: " adjust_sdk_not_init ",
extra: " 0 ",
referrer_url: " ",
referrer_timestamp_server: 0,
install_timestamp_server: 0,
ds: {
ir: " 0 ",
ie: " 0 ",
irv: " 0 ",
ix: " 0 ",
ih: " 0 ",
io: " 0 ",
iw: " 0 ",
id: " 0 ",
ids: " 0 "
}
};
};
e.setUserId = function(e) {
this.userId = e;
};
e.reportData = function() {};
e.bindPilot = function() {
window.pilot = n.default.getBridge();
};
e.getNativeBridge = function() {
return n.default.getBridge();
};
e.userId = " ";
return e;
}();
i.default = d;
cc._RF.pop();
