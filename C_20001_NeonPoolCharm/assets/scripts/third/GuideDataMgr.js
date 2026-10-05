let e = require;
let t = module;
let o = exports;
"use strict";
cc._RF.push(t, "6316a+OZAVM64VzbpWUFHwR", "GuideDataMgr");
Object.defineProperty(o, "__esModule", {
  value: ! 0
}
);
var n = function() {
  function e() {
    this.step = 1;
    this.isClick = ! 1;
    this.isShowFieldHand = ! 1;
  }
  e._getInstance = function() {
    e._instance|| (e._instance = new e());
    return e._instance;
  }
;
  e.prototype.setStep = function(e) {
    this.step = e;
  }
;
  e.prototype.getStep = function() {
    return this.step;
  }
;
  e.prototype.getGuideCopy = function(e) {
    void 0 === e&& (e = this.step);
    var t;
    t = [i18n.t("newcomer_step_1"), i18n.t("newcomer_step_2"), i18n.t("newcomer_step_3"), i18n.t("newcomer_step_4"), i18n.t("newcomer_step_5"), i18n.t("newcomer_step_6"), i18n.t("newcomer_step_7"), i18n.t("newcomer_step_8"), i18n.t("newcomer_step_9"), "", i18n.t("newcomer_step_10"), i18n.t("newcomer_step_11"), i18n.t("newcomer_step_12"), i18n.t("newcomer_step_13"), i18n.t("newcomer_step_14"), i18n.t("newcomer_step_15"), i18n.t("newcomer_step_16"), i18n.t("newcomer_step_17"), i18n.t("newcomer_step_18"), i18n.t("newcomer_step_19"), "", i18n.t("newcomer_step_20"), "", i18n.t("newcomer_step_21"), i18n.t("newcomer_step_22")];
    console.log("guideCopy step: ", e);
    console.log("guideCopy[step - 1]: ", t[e- 1]);
    return t[e- 1];
  }
;
  return e;
}
();
o.default = n._getInstance();
cc._RF.pop();
