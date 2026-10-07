let e = require;
let t = module;
let i = exports;
"use strict";
cc._RF.push(t, "3eb10mVv2VG6okWg4GuaFLT", "time");
var n = __extends,
a = __decorate;
Object.defineProperty(i, "__esModule", {
  value: ! 0
}
);
var o = cc._decorator,
r = o.ccclass;
o.property;
var s = function(e) {
  function t() {
    return null !== e&& e.apply(this, arguments)|| this;
  }
  n(t, e);
  t.prototype.start = function() {
    cc.game.addPersistRootNode(this.node);
  }
;
  t.prototype.update = function() {
  }
;
  return a([r], t);
}
(cc.Component);
i.default = s;
cc._RF.pop();
