let e = require;
let t = module;
let i = exports;
"use strict";
cc._RF.push(t, "5c9008qTZlNka0EChKQW5CQ", "LoadingMiddleLifecycleAdapter");
Object.defineProperty(i, "__esModule", {
  value: ! 0
}
);
var n = function() {
  function e() {
  }
  e.prototype.bindLifecycleHooks = function() {
  }
;
  e.prototype.onBanLog = function() {
  }
;
  e.prototype.onBackstopLog = function() {
  }
;
  e.prototype.onEnterGamePrepare = function() {
  }
;
  e.prototype.onShowUmpPrepare = function() {
  }
;
  return e;
}
(),
a = function() {
  function e() {
  }
  e.setImplementation = function(e) {
    this.implementation = e|| new n();
  }
;
  e.getImplementation = function() {
    return this.implementation;
  }
;
  e.implementation = new n();
  return e;
}
();
i.default = a;
cc._RF.pop();
