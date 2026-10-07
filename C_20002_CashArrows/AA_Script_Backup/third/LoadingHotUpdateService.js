let e = require;
let t = module;
let i = exports;
"use strict";
cc._RF.push(t, "fc08c4NrQdLuayUMxwG/9Fm", "LoadingHotUpdateService");
Object.defineProperty(i, "__esModule", {
  value: ! 0
}
);
var n = e(LoadingHotUpdateAdapter "
} ].js), a = e(" BusinessAnalyticsService.js "), o = function() {
function e(e) {
this.deps = e;
}
e.prototype.start = function() {
n.default.getImplementation().start({
report: function(e, t) {
return a.default.reportData(e, t);
},
onUpdateProgress: this.deps.onUpdateProgress,
onFinish: this.deps.onFinish
});
};
return e;
}();
i.default = o;
cc._RF.pop();
