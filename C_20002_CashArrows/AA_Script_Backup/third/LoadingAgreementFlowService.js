let e = require;
let t = module;
let i = exports;
"use strict";
cc._RF.push(t, "a20d3WQzOFJhaMggu1Un/IR", "LoadingAgreementFlowService");
Object.defineProperty(i, "__esModule", {
  value: ! 0
}
);
var n = e("LoadingAgreementAdapter.js"),
a = e("BusinessAnalyticsService.js"),
o = function() {
  function e(e) {
    this.deps = e;
    this.runSceneName = "";
    this.isShowAgreement = ! 1;
  }
  e.prototype.checkState = function() {
    var e = n.default.getImplementation(),
    t = e.getAgreementState();
    this.isShowAgreement = e.shouldShowAgreement();
    a.default.reportData("page_loading_checkArgreementState", {
      state: t
    }
);
  }
;
  e.prototype.enterSceneWithCheckAgreement = function(e) {
    a.default.reportData("page_loading_enterSceneWithCheckArgeement");
    this.runSceneName = e;
    if(this.isShowAgreement&& n.default.getImplementation().shouldGateByMiddleReview()) {
      a.default.reportData("page_loading_showWelcomeNode");
      this.deps.welcomeNode.active = ! 0;
    } else {
      a.default.reportData("page_loading_runMainScene");
      this.deps.onLoadScene(this.runSceneName);
    }
  }
;
  e.prototype.acceptAgreement = function() {
    n.default.getImplementation().markAgreementAccepted();
    a.default.reportData("click_Accept_btn");
    this.isShowAgreement = ! 1;
    this.deps.welcomeNode.active = ! 1;
    this.deps.onLoadScene(this.runSceneName);
  }
;
  return e;
}
();
i.default = o;
cc._RF.pop();
