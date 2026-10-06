let e = require;
let t = module;
"use strict";
cc._RF.push(t, "f4c92cgDgVNcqg2cNMxGetW", "CurrencyFormatService");
var i = null;
try {
  var n = e(MiddleHelper "
} ].js);
i = n && n.default ? n.default : n;
} catch (e) {}
var a = {
CN: {
symbol: " ¥ ",
group: ", ",
decimal: ".",
decimals: 2,
unit: 100,
noSpace: !0
},
BR: {
symbol: " R$ ",
group: ".",
decimal: ", ",
decimals: 2,
unit: 100,
noSpace: !0
},
ID: {
symbol: " Rp ",
group: ".",
decimal: ", ",
decimals: 0,
unit: 1,
noSpace: !0
},
US: {
symbol: " $ ",
group: ", ",
decimal: ".",
decimals: 2,
unit: 100,
noSpace: !0
},
JP: {
symbol: " ¥ ",
group: ", ",
decimal: ".",
decimals: 0,
unit: 1,
noSpace: !0
},
KR: {
symbol: " ₩ ",
group: ", ",
decimal: ".",
decimals: 2,
unit: 100,
noSpace: !0
},
RU: {
symbol: " ₽ ",
group: " ",
decimal: ", ",
decimals: 2,
unit: 100,
noSpace: !1
},
MX: {
symbol: " $ ",
group: ", ",
decimal: ".",
decimals: 2,
unit: 100,
noSpace: !0
},
CO: {
symbol: " $ ",
group: ".",
decimal: ", ",
decimals: 2,
unit: 100,
noSpace: !0
},
AR: {
symbol: " AR$ ",
group: ".",
decimal: ", ",
decimals: 0,
unit: 1,
noSpace: !0
},
PE: {
symbol: " S/ ",
group: ", ",
decimal: ".",
decimals: 2,
unit: 100,
noSpace: !0
},
ES: {
symbol: " € ",
group: ".",
decimal: ", ",
decimals: 2,
unit: 100,
noSpace: !0
},
VN: {
symbol: " ₫ ",
group: ".",
decimal: ", ",
decimals: 2,
unit: 100,
noSpace: !0
},
TH: {
symbol: " ฿ ",
group: ", ",
decimal: ".",
decimals: 2,
unit: 100,
noSpace: !0
},
IN: {
symbol: " ₹ ",
group: ", ",
decimal: ".",
decimals: 2,
unit: 100,
noSpace: !0
},
PH: {
symbol: " ₱ ",
group: ", ",
decimal: ".",
decimals: 2,
unit: 100,
noSpace: !0
},
MY: {
symbol: " RM ",
group: ", ",
decimal: ".",
decimals: 2,
unit: 100,
noSpace: !0
},
PT: {
symbol: " € ",
group: ".",
decimal: ", ",
decimals: 2,
unit: 100,
noSpace: !0
},
DE: {
symbol: " € ",
group: ".",
decimal: ", ",
decimals: 2,
unit: 100,
noSpace: !0
},
IT: {
symbol: " € ",
group: ".",
decimal: ", ",
decimals: 2,
unit: 100,
noSpace: !0
},
SA: {
symbol: " SAR ",
group: ", ",
decimal: ".",
decimals: 2,
unit: 100,
noSpace: !0
},
ZA: {
symbol: " R ",
group: " ",
decimal: ".",
decimals: 2,
unit: 100,
noSpace: !0
},
EG: {
symbol: " E £ ",
group: ", ",
decimal: ".",
decimals: 2,
unit: 100,
noSpace: !0
},
KE: {
symbol: " KSh ",
group: ", ",
decimal: ".",
decimals: 2,
unit: 100,
noSpace: !0
},
PK: {
symbol: " Rs ",
group: ", ",
decimal: ".",
decimals: 2,
unit: 100,
noSpace: !0
},
BD: {
symbol: " ৳ ",
group: ", ",
decimal: ".",
decimals: 2,
unit: 100,
noSpace: !0
},
NG: {
symbol: " ₦ ",
group: ", ",
decimal: ".",
decimals: 0,
unit: 1,
noSpace: !0
}
};
function o(e) {
return String(e || " ").toUpperCase();
}
function r() {
if (!i || " function " != typeof i.getRegionalState) return " ";
try {
var e = i.getRegionalState();
return o(e && e.country);
} catch (e) {
return " ";
}
}
var s = {
_country: " ",
setCountry: function(e) {
var t = o(e);
if (!t) return " ";
this._country = t;
try {
cc.sys.localStorage.setItem(" APP_COUNTRY_CODE ", t);
} catch (e) {}
return this._country;
},
getCurrentCountry: function() {
var e = r();
if (e) {
this._country = e;
return e;
}
var t, i, n = o(this._country);
if (n) return n;
try {
if (n = o(cc.sys.localStorage.getItem(" APP_COUNTRY_CODE "))) {
this._country = n;
return n;
}
if (n = o(cc.sys.localStorage.getItem(" MB_CACHE_ATTR_COUNTRY "))) {
this._country = n;
return n;
}
} catch (e) {}
n = (t = cc && cc.sys ? cc.sys.language : " ", 0 === (i = String(t || " ").toLowerCase()).indexOf(" zh ") ? " CN " : 0 === i.indexOf(" id ") ? " ID " : 0 === i.indexOf(" pt- pt ") ? " PT " : 0 === i.indexOf(" pt ") ? " BR " : 0 === i.indexOf(" es ") ? " MX " : 0 === i.indexOf(" ja ") ? " JP " : 0 === i.indexOf(" ko ") ? " KR " : 0 === i.indexOf(" ru ") ? " RU " : 0 === i.indexOf(" th ") ? " TH " : 0 === i.indexOf(" vi ") ? " VN " : 0 === i.indexOf(" de ") ? " DE " : 0 === i.indexOf(" it ") ? " IT " : 0 === i.indexOf(" bn ") ? " BD " : " IN ");
this._country = n;
return n;
},
getRule: function(e) {
var t = o(e || this.getCurrentCountry());
return a[t] || a.IN;
},
getRealMoney: function(e, t) {
var i = this.getRule(t), n = Number(e || 0);
isNaN(n) && (n = 0);
return n / (i.unit || 100);
},
formatNumber: function(e, t) {
var i = this.getRule(t), n = Number(e || 0);
isNaN(n) && (n = 0);
var a = n.toFixed(i.decimals).split("."), o = a[0], r = a.length > 1 ? a[1] : " ";
o = o.replace(/\B(?=(\d{3})+(?!\d))/g, i.group);
return i.decimals <= 0 ? o : o + i.decimal + r;
},
getCurrencySymbol: function(e) {
return this.getRule(e).symbol || " ";
},
formatCurrency: function(e) {
var t = arguments.length > 1 ? arguments[1] : e, i = this.getCurrentCountry(), n = this.getRule(i), a = this.getRealMoney(t, i), o = this.formatNumber(a, i), r = n.symbol || " ";
return r ? n.noSpace ? r + o : r + " " + o : o;
},
formatCurrencyInteger: function(e) {
var t = arguments.length > 1 ? arguments[1] : e, i = this.getCurrentCountry(), n = this.getRule(i), a = this.getRealMoney(t, i), o = Math.max(0, Math.floor(Number(a) || 0)), r = n.group || ", ", s = String(o).replace(/\B(?=(\d{3})+(?!\d))/g, r), l = n.symbol || " ";
return l ? n.noSpace ? l + s : l + " " + s : s;
}
};
t.exports = s;
t.exports.default = s;
cc._RF.pop();
