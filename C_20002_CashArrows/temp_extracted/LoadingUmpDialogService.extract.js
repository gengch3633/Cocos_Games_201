LoadingUmpDialogService: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "8bc6aIOkShKj4ToITroklu3", "LoadingUmpDialogService");
Object.defineProperty(i, "__esModule", {
value: !0
});
var n = e("../../business-common/report/BusinessAnalyticsService"), a = function() {
function e(e) {
this.deps = e;
}
e.prototype.show = function(e) {
var t = this;
console.log("LoadingUmpDialogService show", this.deps.umpNode, this.deps.umpBtnAgree, this.deps.umpBtnClose);
this.deps.onPauseLoading();
this.deps.umpNode.active = !0;
this.deps.umpBtnAgree.once(cc.Node.EventType.TOUCH_END, function() {
t.deps.onResumeLoading();
n.default.reportData("click_ump_Agree_btn");
t.deps.umpNode.active = !1;
e(!0);
});
this.deps.umpBtnClose.once(cc.Node.EventType.TOUCH_END, function() {
t.deps.onResumeLoading();
n.default.reportData("click_ump_Close_btn");
t.deps.umpNode.active = !1;
e(!1);
});
};
return e;
}();
i.default = a;
cc._RF.pop();
}