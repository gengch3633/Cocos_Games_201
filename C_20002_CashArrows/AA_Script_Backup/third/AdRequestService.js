let e = require;
let t = module;
let i = exports;
"use strict";
cc._RF.push(t, "9cc17mTpdxMia8j2olx5/Bd", "AdRequestService");
Object.defineProperty(i, "__esModule", {
  value: ! 0
}
);
var n = e(AdLegacyBridge "
} ].js), a = function() {
function e() {}
e.buildRewardVideoRequest = function(e, t) {
void 0 === t && (t = 0);
return {
slotId: t,
is_force: e
};
};
e.requestRewardVideo = function(e) {
cc.sys.isNative && n.default.showRewardVideoByPlatform(e);
};
return e;
}();
i.default = a;
cc._RF.pop();
