let e = require;
let t = module;
let i = exports;
"use strict";
cc._RF.push(t, "11c983Rt25GNrpQvUwkiAnl", "LoadingAgreementService");
Object.defineProperty(i, "__esModule", {
  value: ! 0
}
);
var n = function() {
  function e() {
    this.agreementStateKey = "argreement_state";
  }
  e.prototype.shouldShowAgreement = function() {
    return 0 === Number(this.localStorageGetItem(this.agreementStateKey, "0"));
  }
;
  e.prototype.markAgreementAccepted = function() {
    this.localStorageSetItem(this.agreementStateKey, "1");
  }
;
  e.prototype.getAgreementState = function() {
    return Number(this.localStorageGetItem(this.agreementStateKey, "0"));
  }
;
  e.prototype.localStorageGetItem = function(e, t) {
    void 0 === t&& (t = "");
    var i = cc.sys.localStorage.getItem(e);
    return null == i? t: i;
  }
;
  e.prototype.localStorageSetItem = function(e, t) {
    cc.sys.localStorage.setItem(e, t);
  }
;
  return e;
}
();
i.default = n;
cc._RF.pop();
