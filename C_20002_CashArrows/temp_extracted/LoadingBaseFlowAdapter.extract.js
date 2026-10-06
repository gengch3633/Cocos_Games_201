LoadingBaseFlowAdapter: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "aa1e5dHZA5DlqErwJDwB2tS", "LoadingBaseFlowAdapter");
Object.defineProperty(i, "__esModule", {
value: !0
});
var n = function() {
function e() {}
e.prototype.startFlow = function(e) {
e.onLoginReady();
};
return e;
}(), a = function() {
function e() {}
e.setImplementation = function(e) {
this.implementation = e || new n();
};
e.getImplementation = function() {
return this.implementation;
};
e.implementation = new n();
return e;
}();
i.default = a;
cc._RF.pop();
}