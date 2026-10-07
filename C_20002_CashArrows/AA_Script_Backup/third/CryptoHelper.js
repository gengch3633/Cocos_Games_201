let e = require;
let t = module;
let i = exports;
"use strict";
cc._RF.push(t, "7bca7lIqLlJuYuHLmBgdbjN", "CryptoHelper");
Object.defineProperty(i, "__esModule", {
  value: ! 0
}
);
var n = e("MiddleCryptoPolicy.js"),
a = n.MIDDLE_CRYPTO_POLICY.legacy.fixedKey,
o = n.MIDDLE_CRYPTO_POLICY.legacy.dateString,
r = n.MIDDLE_CRYPTO_POLICY.iv,
s = "[CryptoHelper]",
l = ! 1;
function c() {
  var t = "undefined" != typeof globalThis? globalThis: "undefined" != typeof window? window: {
  }
;
  try {
    if("undefined" != typeof CryptoJS&& CryptoJS) return CryptoJS;
  } catch(e) {
  }
  if(t&& t.CryptoJS) return t.CryptoJS;
  try {
    var i = e("crypto-js"),
    n = i&& (i.default|| i.CryptoJS|| i);
    if(n) {
      t.CryptoJS = n;
      return n;
    }
  } catch(e) {
  }
  try {
    var a = e("1.js"),
    o = t&& t.CryptoJS|| a&& (a.default|| a.CryptoJS|| a);
    if(o) {
      t.CryptoJS = o;
      return o;
    }
  } catch(e) {
  }
  var r = t&& t.CryptoJS;
  if(! r&& ! l) {
    l = ! 0;
    console.warn(s+ " CryptoJS is undefined, fallback mode enabled.");
  }
  return r|| null;
}
function u(e) {
  try {
    if("function" == typeof btoa) return btoa(e);
  } catch(e) {
  }
  try {
    var t = "undefined" != typeof globalThis? globalThis: {
    }
;
    if(t.Buffer) return t.Buffer.from(e, "utf8").toString("base64");
  } catch(e) {
  }
  return e;
}
function d(e) {
  try {
    if("function" == typeof atob) return atob(e);
  } catch(e) {
  }
  try {
    var t = "undefined" != typeof globalThis? globalThis: {
    }
;
    if(t.Buffer) return t.Buffer.from(e, "base64").toString("utf8");
  } catch(e) {
  }
  return e;
}
function h(e, t, i) {
  var n = c();
  if(! n) return e;
  var a = n.enc.Utf8.parse(t),
  o = n.enc.Utf8.parse(i);
  return n.AES.encrypt(n.enc.Utf8.parse(e), a, {
    mode: n.mode.CBC, padding: n.pad.Pkcs7, iv: o
  }
).toString();
}
function p(e, t, i) {
  var n = c();
  if(! n) return e;
  var a = n.enc.Utf8.parse(t),
  o = n.enc.Utf8.parse(i);
  return n.AES.decrypt(e, a, {
    mode: n.mode.CBC, padding: n.pad.Pkcs7, iv: o
  }
).toString(n.enc.Utf8);
}
function _(e) {
  return u(e.slice(- 16)).slice(0, 14)+ "hx";
}
function f(e) {
  var t = c();
  if(! t) return a;
  var i = h(e+ "_"+ a+ "_"+ o, a, r);
  return t.MD5(_(i)+ i.substring(0, 16)).toString();
}
var g = function() {
  function e() {
  }
  e.encrypt = function(e, t) {
    return h(e, f(t), r);
  }
;
  e.decrypt = function(e, t) {
    return p(e, f(t), r);
  }
;
  e.ngister = function(e, t, i, n, a, o, r) {
    var s = e+ " "+ n+ " "+ a+ " "+ o+ " "+ t+ " "+ i+ " "+ f(r),
    l = c();
    return(l? l.MD5(l.enc.Utf8.parse(s)).toString(l.enc.Base64): u(s)).replace(/ \+/ g, "-").replace(/ \// g, "_").replace(/= + $/, "");
  }
;
  e.base64Decode = function(e) {
    var t = c(),
    i = e.replace(/-/ g, "+").replace(/ _/ g, "/");
    return t? t.enc.Base64.parse(i).toString(t.enc.Utf8): d(i);
  }
;
  e.base64Encode = function(e) {
    var t = c();
    if(! t) return u(e).replace(/-/ g, "+").replace(/ _/ g, "/");
    var i = t.enc.Utf8.parse(e);
    return t.enc.Base64.stringify(i).replace(/-/ g, "+").replace(/ _/ g, "/");
  }
;
  return e;
}
();
i.default = g;
cc._RF.pop();
