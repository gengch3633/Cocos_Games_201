let e = require;
let t = module;
let i = exports;
"use strict";
cc._RF.push(t, "962dd3ePvVNWJHPuM1Cg4q2", "LoadingBootstrapAdapter");
Object.defineProperty(i, "__esModule", {
  value: ! 0
}
);
var n = function() {
  function e() {
  }
  e.prototype.patchInstantiate = function() {
  }
;
  e.prototype.registerGlobalError = function() {
  }
;
  e.prototype.initPageManager = function() {
  }
;
  e.prototype.disableMultiTouch = function() {
    cc.macro.ENABLE_MULTI_TOUCH = ! 1;
  }
;
  e.prototype.initLanguage = function() {
  }
;
  e.prototype.initSystem = function() {
  }
;
  e.prototype.bindPilot = function() {
  }
;
  e.prototype.startMiddleCountryForWeb = function() {
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
