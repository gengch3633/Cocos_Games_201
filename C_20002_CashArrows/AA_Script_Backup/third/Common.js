let e = require;
let t = module;
let i = exports;
"use strict";
cc._RF.push(t, "209b1dXRzhEIL8oBei+dWry", "Common");
Object.defineProperty(i, "__esModule", {
  value: ! 0
}
);
var n = e("ConfigMgr"),
a = e("MultiPlatform"),
o = e("ConfigDefine"),
r = function() {
  function e() {
  }
  Object.defineProperty(e, "isGM", {
    get: function() {
      return ! ! cc.sys.isBrowser|| n.default.getInstance().getOne(o.VipListConfig).vipList.indexOf(a.default.getInstance().openId) >= 0;
    }
, enumerable: ! 1, configurable: ! 0
  }
);
  e.version = "1.0.0";
  e.GameModel = 0;
  return e;
}
();
i.default = r;
cc._RF.pop();
