let e = require;
let t = module;
let i = exports;
"use strict";
cc._RF.push(t, "4990avzw6VLIpgjbFQYCuTq", "ClientDataStore");
Object.defineProperty(i, "__esModule", {
  value: ! 0
}
);
var n = e("MiddleProjectAdapterConfig.js"),
a = e(CryptoHelper "
} ].js);
function o() {
for (var e = [], t = " 0123456789abcdef ", i = 0; i < 36; i++) e[i] = t.substring(Math.floor(16 * Math.random()), Math.floor(16 * Math.random()) + 1);
e[14] = " 4 ";
e[19] = t.substring(3 & e[19] | 8, 1 + (3 & e[19] | 8));
e[8] = e[13] = e[18] = e[23] = "- ";
return e.join(" ");
}
var r = new (function() {
function e() {
this.version_name = " ";
this.sdk_version_name = " ";
this.phone_model = " ";
this.phone_brand = " ";
this.os_name = " ";
this.system_version = " ";
this.package_name = " ";
this.oaid = " ";
this.android_id = " ";
this.box_pkg_name = " ";
this.channel_name = " ";
this.device_id = " ";
this.local_country = " ";
this.device_status = null;
this.network_type = " ";
this.extra = " ";
this.cpu_number = 0;
this.yid = " yid_read_fail ";
this.user_id = " ";
this.ds = null;
this.isInit = !1;
this.commonUrlStr = " ";
this.middleCommonUrlStr = " ";
}
e.prototype.init = function(e) {
var t = this;
Object.keys(this).filter(function(e) {
return " function " != typeof t[e];
}).forEach(function(i) {
null !== e[i] && void 0 !== e[i] && " " !== e[i] && (t[i] = e[i]);
});
this.mapAndroidKeys(e);
this.package_name = n.MIDDLE_PROJECT_ADAPTER_CONFIG.releasePkgName;
this.box_pkg_name = n.MIDDLE_PROJECT_ADAPTER_CONFIG.releasePkgName;
this.parseDsData();
this.buildCommonUrlStr();
this.buildMiddleCommonUrlStr();
this.isInit = !0;
};
e.prototype.mapAndroidKeys = function(e) {
if (cc.sys.os == cc.sys.OS_ANDROID) {
for (var t = n.MIDDLE_PROJECT_ADAPTER_CONFIG.fieldMapping, i = 0, a = Object.entries(t); i < a.length; i++) {
var o = a[i], r = o[0], s = o[1];
if (" package_name " !== r && " box_pkg_name " !== r && r in this) {
if (" local_country " === r) {
e[s] && (this[r] = e[s]);
continue;
}
this[r] = e[s] || (" number " == typeof this[r] ? 0 : " ");
}
}
var l = this.device_status;
l && (this.device_status = JSON.stringify({
ir: l[t.ir] || " 0 ",
ie: l[t.ie] || " 0 ",
irv: l[t.irv] || " 0 ",
ix: l[t.ix] || " 0 ",
ih: l[t.ih] || " 0 ",
io: l[t.io] || " 0 ",
iw: l[t.iw] || " 0 ",
id: l[t.id] || " 0 ",
ids: l[t.ids] || " 0 ",
ipp: l[t.ipp] || !1,
ica: l[t.ica] || !1
}));
}
};
e.prototype.isProd = function() {
return " 0 " !== this.extra;
};
e.prototype.parseDsData = function() {
this.device_status && (this.ds = " string " == typeof this.device_status ? JSON.parse(this.device_status) : this.device_status);
};
e.prototype.buildCommonUrlStr = function() {
var e = " box_pkg_name = " + this.box_pkg_name;
e += "& device_id = " + this.device_id;
e += "& platform = " + this.os_name;
e += "& ad_version_name = " + this.sdk_version_name;
e += "& version_name = " + this.version_name;
e += "& os_version = " + this.system_version;
e += "& system_version = " + this.system_version;
e += "& device_model = " + this.phone_model;
e += "& phone_model = " + this.phone_model;
e += "& device_brand = " + this.phone_brand;
e += "& phone_brand = " + this.phone_brand;
e += "& oaid = " + this.oaid;
e += "& region = " + this.local_country;
e += "& channel_name = " + this.channel_name;
e += "& cpu_number = " + this.cpu_number;
e += "& is_vpn = " + (this.ds ? this.ds.id : " 0 ");
this.commonUrlStr = e;
};
e.prototype.buildMiddleCommonUrlStr = function() {
this.middleCommonUrlStr = this.commonUrlStr;
};
e.prototype.appendGameVersion = function(e) {
this.commonUrlStr += "& game_version = " + e;
this.middleCommonUrlStr += "& game_version = " + e;
};
e.prototype.updateUserInfo = function(e, t) {
this.user_id = e;
this.yid = t;
};
e.prototype.uuid = function() {
return o();
};
e.prototype.getVersionData = function() {
return {
box_pkg_name: n.MIDDLE_PROJECT_ADAPTER_CONFIG.releasePkgName,
channel_name: this.channel_name,
device_id: this.device_id
};
};
e.prototype.publicYWUrlParser = function(e) {
var t = Math.floor(Date.now() / 1e3).toString(), i = o();
return " nonce_str = " + i + "& et = " + t + "& ngister = " + a.default.ngister(e, t, i, this.version_name, this.channel_name, this.device_id, this.box_pkg_name);
};
return e;
}())();
i.default = r;
cc._RF.pop();
