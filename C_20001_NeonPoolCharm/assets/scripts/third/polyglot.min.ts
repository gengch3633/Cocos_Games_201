// @ts-nocheck
const module: any = { exports: {} };
const exports: any = module.exports;
"use strict";
(function(e, n) {
  "function" == typeof define&& define.amd? define([], function() {
    return n(e);
  }
): "object" == typeof module.exports? module.exports = n(e): e.Polyglot = n(e);
}
)(void 0, function(e) {
  function t(e) {
    e = e|| {
    }
, this.phrases = {
    }
, this.extend(e.phrases|| {
    }
), this.currentLocale = e.locale|| "en", this.allowMissing = ! ! e.allowMissing, this.warn = e.warn|| s;
  }
  function o(e) {
    var t, o, n, i = {
    }
;
    for(t in e) if(e.hasOwnProperty(t)) {
      o = e[t];
      for(n in o) i[o[n]] = t;
    }
    return i;
  }
  function n(e) {
    return e.replace(/^\s+|\s+$/g, "");
  }
  function i(e, t, o) {
    var i;
    return null != o&& e? n((i = e.split("||||"))[r(t, o)]|| i[0]): e;
  }
  function a(e) {
    var t = o(p);
    return t[e]|| t.en;
  }
  function r(e, t) {
    return u[a(e)](t);
  }
  function l(e, t) {
    for(var o in t) "_" !== o&& t.hasOwnProperty(o)&& (e = e.replace(new RegExp("%\\{"+ o+ "\\}", "g"), t[o]));
    return e;
  }
  function s(t) {
    e.console&& e.console.warn&& e.console.warn("WARNING: "+ t);
  }
  function c(e) {
    var t = {
    }
;
    for(var o in e) t[o] = e[o];
    return t;
  }
  t.VERSION = "0.4.3", t.prototype.locale = function(e) {
    return e&& (this.currentLocale = e), this.currentLocale;
  }
, t.prototype.extend = function(e, t) {
    var o;
    for(var n in e) e.hasOwnProperty(n)&& (o = e[n], t&& (n = t+ "."+ n), "object" == typeof o? this.extend(o, n): this.phrases[n] = o);
  }
, t.prototype.clear = function() {
    this.phrases = {
    }
;
  }
, t.prototype.replace = function(e) {
    this.clear(), this.extend(e);
  }
, t.prototype.t = function(e, t) {
    var o, n;
    return "number" == typeof(t = null == t? {
    }
: t)&& (t = {
      smart_count: t
    }
), "string" == typeof this.phrases[e]? o = this.phrases[e]: "string" == typeof t._? o = t._: this.allowMissing? o = e:(this.warn('Missing translation for key: "'+ e+ '"'), n = e), "string" == typeof o&& (t = c(t), n = l(n = i(o, this.currentLocale, t.smart_count), t)), n;
  }
, t.prototype.has = function(e) {
    return e in this.phrases;
  }
;
  var u = {
    chinese: function() {
      return 0;
    }
, german: function(e) {
      return 1 !== e? 1: 0;
    }
, french: function(e) {
      return e > 1? 1: 0;
    }
, russian: function(e) {
      return e% 10 == 1&& e% 100 != 11? 0: e% 10 >= 2&& e% 10 <= 4&& (e% 100 < 10|| e% 100 >= 20)? 1: 2;
    }
, czech: function(e) {
      return 1 === e? 0: e >= 2&& e <= 4? 1: 2;
    }
, polish: function(e) {
      return 1 === e? 0: e% 10 >= 2&& e% 10 <= 4&& (e% 100 < 10|| e% 100 >= 20)? 1: 2;
    }
, icelandic: function(e) {
      return e% 10 != 1|| e% 100 == 11? 1: 0;
    }
  }
, p = {
    chinese:["fa", "id", "ja", "ko", "lo", "ms", "th", "tr", "zh"], german:["da", "de", "en", "es", "fi", "el", "he", "hu", "it", "nl", "no", "pt", "sv"], french:["fr", "tl", "pt-br"], russian:["hr", "ru"], czech:["cs"], polish:["pl"], icelandic:["is"]
  }
;
  return t;
}
);
export = module.exports;
