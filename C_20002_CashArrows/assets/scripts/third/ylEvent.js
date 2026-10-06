let e = require;
let t = module;
let i = exports;
"use strict";
cc._RF.push(t, "31319TkuzxGhapzu3fCJHYn", "ylEvent");
var n = __decorate;
Object.defineProperty(i, "__esModule", {
  value: ! 0
}
);
var a = e(GEMgr "
} ].js), o = cc._decorator, r = o.ccclass;
o.property;
var s = function() {
function e() {}
var t;
t = e;
e.loading = function() {
a.default.userSetOnce({
firstVersion: " v1.0.0 "
});
a.default.userSet({
curVersion: " v1.0.0 "
});
a.default.userAdd({
activeNum: 1
});
};
e.accuAds = function() {
a.default.userAdd({
accuAds: 1
});
};
e.stageEnd = function(e, t) {
e ? a.default.userAdd({
winNum: 1
}) : a.default.userAdd({
lostNum: 1
});
t && a.default.userSet({
maxLv: t
});
};
e.stageIn = function() {
a.default.userAdd({
openLv: 1
});
};
e.setAllTime = function() {
a.default.userAdd({
allTime: t.tiemStep
});
};
e.tiemStep = 10;
return t = n([ r ], e);
}();
i.default = s;
cc._RF.pop();
