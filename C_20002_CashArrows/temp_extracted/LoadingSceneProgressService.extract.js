LoadingSceneProgressService: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "e4c57+XcNVLjKUCSattqzJA", "LoadingSceneProgressService");
Object.defineProperty(i, "__esModule", {
value: !0
});
var n = e("../sdk/LoadingSceneProgressAdapter"), a = e("../../business-common/report/BusinessAnalyticsService"), o = function() {
function e(e) {
this.deps = e;
}
e.prototype.preloadTextures = function() {
n.default.getImplementation().preloadTextures();
};
e.prototype.run = function() {
return __awaiter(this, void 0, void 0, function() {
var e, t = this;
return __generator(this, function() {
a.default.reportData("page_loading_progressFinish");
e = .25;
n.default.getImplementation().preloadScene("BPR_Game_Main", function(i, n) {
t.deps.setProgress(i / n, !1, 0, e);
}, function() {
return __awaiter(t, void 0, void 0, function() {
var t, i, o;
return __generator(this, function(r) {
switch (r.label) {
case 0:
r.trys.push([ 0, 5, 6, 7 ]);
t = n.default.getImplementation().getLoadingTasks();
i = 0;
r.label = 1;

case 1:
return i < t.length ? [ 4, this.progressWithPrefabLoading(e, t, i) ] : [ 3, 4 ];

case 2:
e = r.sent();
r.label = 3;

case 3:
i++;
return [ 3, 1 ];

case 4:
return [ 3, 7 ];

case 5:
o = r.sent();
console.error("loading progressFinish failed, the error was " + o);
if (n.default.getImplementation().isDebug()) throw new Error("loading progressFinish failed, the error was " + o);
return [ 3, 7 ];

case 6:
a.default.reportData("page_loading_progressFinish_runMainScene");
this.deps.onProgressFinish();
return [ 7 ];

case 7:
return [ 2 ];
}
});
});
});
return [ 2 ];
});
});
};
e.prototype.progressWithPrefabLoading = function(e, t, i) {
return __awaiter(this, void 0, Promise, function() {
var a, o = this;
return __generator(this, function(r) {
switch (r.label) {
case 0:
a = e + this.getPercentByIndex(t, i);
return [ 4, n.default.getImplementation().loadTask(t[i], function(t, i) {
o.deps.setProgress(t / i, !1, e, a);
}) ];

case 1:
r.sent();
return [ 2, a ];
}
});
});
};
e.prototype.getPercentByIndex = function(e, t, i) {
void 0 === i && (i = .74);
return i / this.getLoadingTotalCount(e) * this.getLoadingCount(e, t);
};
e.prototype.getLoadingTotalCount = function(e) {
for (var t = 0, i = 0; i < e.length; i++) t += this.getLoadingCount(e, i);
return t;
};
e.prototype.getLoadingCount = function(e, t) {
var i;
return (null === (i = e[t]) || void 0 === i ? void 0 : i.count) || 1;
};
return e;
}();
i.default = o;
cc._RF.pop();
}