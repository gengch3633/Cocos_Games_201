let e = require;
let t = module;
let i = exports;
"use strict";
cc._RF.push(t, "ea7bbFZs/dPpbokw6zlheF3", "MiddleService");
Object.defineProperty(i, "__esModule", {
  value: ! 0
}
);
var n = e(MiddleReqType "
} ].js), a = e(" ClientDataStore.js "), o = e(" MiddleHelper.js "), r = function() {
function e() {}
e.paramData = function(e) {
var t = this.resolveCountry(), i = this.commonUrl(t);
switch (e) {
case n.MiddleReqType.SDKEvent:
return {
refer: a.default.referrer_url || " ",
referrer_timestamp_server: a.default.referrer_timestamp_server || 0,
install_timestamp_server: a.default.install_timestamp_server || 0,
query: i,
ds: a.default.ds
};

case n.MiddleReqType.Regional:
return {
oaid: a.default.oaid || " ",
referrer_url: a.default.referrer_url || " ",
referrer_timestamp_server: a.default.referrer_timestamp_server || 0,
install_timestamp_server: a.default.install_timestamp_server || 0,
query: i,
ds: a.default.ds
};

case n.MiddleReqType.ADCONFIG:
default:
return {
query: i,
ds: a.default.ds
};
}
};
e.commonUrl = function(e) {
var t = " user_id = " + (a.default.user_id || " ");
t += "& yid = " + (a.default.yid || " ");
a.default.commonUrlStr && (t += "& " + a.default.commonUrlStr);
return (t += "& country = " + e) + "& cy = " + e;
};
e.resolveCountry = function() {
return o.default.localCountry && o.default.localCountry() || a.default.local_country || " IN ";
};
return e;
}();
i.default = r;
cc._RF.pop();
