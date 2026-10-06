LoadingHotUpdateAdapter: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "89ce0LdaftGaJ3hXnsfthBx", "LoadingHotUpdateAdapter");
Object.defineProperty(i, "__esModule", {
value: !0
});
var n = function() {
function e() {}
e.prototype.start = function(e) {
e.report("page_loading_No_HP");
e.report("page_loading_finishInit");
e.onFinish();
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