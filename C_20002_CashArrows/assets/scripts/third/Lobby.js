let e = require;
let t = module;
let i = exports;
"use strict";
cc._RF.push(t, "6caa6NfTRVKh4Q8h0R2Ve6b", "Lobby");
var n = __extends,
a = __decorate,
o = __awaiter,
r = __generator;
Object.defineProperty(i, "__esModule", {
  value: ! 0
}
);
var s = e("AudioPlay"),
l = e("UIMgr"),
c = e("UIDefine"),
u = e("UiPageAnalyticsService.js"),
d = cc._decorator,
h = d.ccclass;
d.property;
var p = function(e) {
  function t() {
    var t = null !== e&& e.apply(this, arguments)|| this;
    t.audioPlay = null;
    return t;
  }
  n(t, e);
  t.prototype.onLoad = function() {
    this.audioPlay = this.node.getComponent(s.default);
    u.default.trackEnter("home_page");
  }
;
  t.prototype.onDestroy = function() {
    u.default.trackLeave("home_page");
  }
;
  t.prototype.example = function() {
    return o(this, void 0, void 0, function() {
      return r(this, function() {
        return[2];
      }
);
    }
);
  }
;
  t.prototype.OnClickStart = function() {
    l.default.getInstance().show(c.default.gameView);
  }
;
  return a([h], t);
}
(cc.Component);
i.default = p;
cc._RF.pop();
