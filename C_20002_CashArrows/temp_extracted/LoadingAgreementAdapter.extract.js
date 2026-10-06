LoadingAgreementAdapter: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "502efjhC6pLybWqv2HP52cn", "LoadingAgreementAdapter");
Object.defineProperty(i, "__esModule", {
value: !0
});
var n = e("../Scene/LoadingAgreementService"), a = function() {
function e() {
this.agreementService = new n.default();
}
e.prototype.getAgreementState = function() {
return this.agreementService.getAgreementState();
};
e.prototype.shouldShowAgreement = function() {
return this.agreementService.shouldShowAgreement();
};
e.prototype.markAgreementAccepted = function() {
this.agreementService.markAgreementAccepted();
};
e.prototype.shouldGateByMiddleReview = function() {
return !1;
};
return e;
}(), o = function() {
function e() {}
e.setImplementation = function(e) {
this.implementation = e || new a();
};
e.getImplementation = function() {
return this.implementation;
};
e.implementation = new a();
return e;
}();
i.default = o;
cc._RF.pop();
}