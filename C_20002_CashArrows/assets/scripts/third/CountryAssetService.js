let e = require;
let t = module;
"use strict";
cc._RF.push(t, "7395an7awNJsZejeS7H7iQj", "CountryAssetService");
var i = e("CurrencyFormatService.js"),
n = null;
try {
  var a = e("MiddleHelper.js");
  n = a&& a.default? a.default: a;
} catch(e) {
}
var o = {
  MX: "LATAM",
  AR: "LATAM",
  CL: "LATAM",
  CO: "LATAM",
  PE: "LATAM",
  ES: "EU",
  PT: "EU",
  DE: "EU",
  IT: "EU",
  BR: "LATAM",
  US: "NA",
  CA: "NA",
  UK: "EU",
  AU: "OCEANIA",
  NZ: "OCEANIA",
  CN: "APAC",
  ID: "SEA",
  TH: "SEA",
  VN: "SEA",
  MY: "SEA",
  PH: "SEA",
  IN: "APAC",
  PK: "APAC",
  BD: "APAC",
  JP: "APAC",
  KR: "APAC",
  RU: "EU",
  SA: "MEA",
  EG: "MEA",
  ZA: "MEA",
  KE: "MEA",
  NG: "MEA"
}
,
r = "texture/gameing/country",
s = "in";
function l() {
  if(! n|| "function" != typeof n.getRegionalState) return "";
  try {
    var e = n.getRegionalState();
    return String(e&& e.country|| "").trim().toUpperCase();
  } catch(e) {
    return "";
  }
}
function c(e) {
  return ! ! e&& - 1 === e.indexOf("/")&& - 1 === e.indexOf("\\");
}
function u(e) {
  return String(e|| "").trim().toLowerCase();
}
function d(e, t) {
  if(! t) return "";
  var i = String(e|| "").trim().toUpperCase();
  return i&& "DEFAULT" !== i&& "FALLBACK" !== i? 0 === i.indexOf("REGION_")? r+ "/region_"+ u(i.replace("REGION_", ""))+ "/"+ t: r+ "/"+ u(i)+ "/"+ t: r+ "/"+ s+ "/"+ t;
}
var h = {
  _assetRules: {
  }
,
  normalizeCountry: function(e) {
    return String(e|| "").trim().toUpperCase();
  }
,
  normalizeRuleMap: function(e) {
    if(! e|| "object" != typeof e) return {
    }
;
    var t = {
    }
;
    for(var i in e) if(e.hasOwnProperty(i)) {
      var n = String(i|| "").trim().toUpperCase();
      if(n) {
        var a = String(e[i]|| "").trim();
        a&& (t[n] = a);
      }
    }
    return t;
  }
,
  getCurrentCountry: function() {
    return this.normalizeCountry(l()|| i.getCurrentCountry())|| "IN";
  }
,
  getCountryRegion: function(e) {
    var t = this.normalizeCountry(e|| this.getCurrentCountry());
    return o[t]|| "";
  }
,
  setAssetRules: function(e, t) {
    var i = String(e|| "").trim();
    i&& (this._assetRules[i] = this.normalizeRuleMap(t));
  }
,
  getAssetRules: function(e) {
    var t = String(e|| "").trim();
    return t&& this._assetRules[t]|| null;
  }
,
  parseRuleMapText: function(e) {
    var t = String(e|| "").trim();
    if(! t) return {
    }
;
    try {
      var i = JSON.parse(t);
      return this.normalizeRuleMap(i);
    } catch(e) {
      cc.warn("[CountryAssetService] parseRuleMapText failed:", t, e);
      return {
      }
;
    }
  }
,
  resolvePath: function(e, t, i) {
    var n = this.normalizeRuleMap(e),
    a = this.normalizeCountry(t|| this.getCurrentCountry()),
    o = this.getCountryRegion(a),
    l = "",
    d = "";
    if(a&& n[a]) {
      l = n[a];
      d = a;
    } else if(o&& n["REGION_"+ o]) {
      l = n["REGION_"+ o];
      d = "REGION_"+ o;
    } else if(n.DEFAULT) {
      l = n.DEFAULT;
      d = "DEFAULT";
    } else {
      l = String(i|| "").trim();
      d = "FALLBACK";
    }
    return c(l)? "DEFAULT" !== d&& "FALLBACK" !== d&& d? 0 === d.indexOf("REGION_")? r+ "/region_"+ u(d.replace("REGION_", ""))+ "/"+ l: r+ "/"+ u(d)+ "/"+ l: r+ "/"+ s+ "/"+ l: l;
  }
,
  getAssetPath: function(e, t, i) {
    var n = this.getAssetRules(e);
    return this.resolvePath(n|| {
    }
, t, i);
  }
,
  getPathByImageName: function(e, t) {
    var i = String(e|| "").trim();
    if(! i) return "";
    if(! c(i)) return i;
    var n = this.normalizeCountry(t|| this.getCurrentCountry()),
    a = this.getCountryRegion(n);
    return d(n|| (a? "REGION_"+ a: "DEFAULT"), i);
  }
}
;
t.exports = h;
t.exports.default = h;
cc._RF.pop();
