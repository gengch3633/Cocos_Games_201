let e = require;
let t = module;
let i = exports;
"use strict";
cc._RF.push(t, "b49bbaqXy1DNbQBvH7Dtwx3", "AdToolbox");
Object.defineProperty(i, "__esModule", {
  value: ! 0
}
);
var n = function() {
  function e() {
  }
  e.log = function() {
    for(var e = [], t = 0;
    t < arguments.length;
    t++) e[t] = arguments[t];
    console.log.apply(console, e);
  }
;
  e.nowSeconds = function() {
    return Math.floor(Date.now()/ 1e3);
  }
;
  e.formatDate = function(e, t) {
    void 0 === t&& (t = "-");
    var i = new Date(e);
    return ""+ i.getFullYear()+ t+(i.getMonth()+ 1)+ t+ i.getDate();
  }
;
  e.localStorageSetItem = function(e, t) {
    try {
      cc.sys.localStorage.setItem(e, t);
    } catch(e) {
    }
  }
;
  e.localStorageGetItem = function(e, t) {
    try {
      var i = cc.sys.localStorage.getItem(e);
      return null == i|| "" === i|| "nan" === i? t: i;
    } catch(e) {
      return t;
    }
  }
;
  e.destroyAdManageToast = function() {
  }
;
  e.showManageViewToast = function(e) {
    console.warn("[AdToast]", e);
  }
;
  return e;
}
();
i.default = n;
cc._RF.pop();
