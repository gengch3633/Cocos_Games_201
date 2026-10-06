LoadingSdkAdapter: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "98e000ylqpB+L0VC1QXIga0", "LoadingSdkAdapter");
Object.defineProperty(i, "__esModule", {
value: !0
});
var n = function() {
function e() {}
e.prototype.reportData = function() {};
e.prototype.getCurrentCountry = function() {
return "";
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