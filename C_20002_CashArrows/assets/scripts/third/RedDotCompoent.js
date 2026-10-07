let e = require;
let t = module;
let i = exports;
"use strict";
cc._RF.push(t, "bc790Ybwp5JWIEbcWA1/Bzk", "RedDotCompoent");
var n = __extends,
a = __decorate;
Object.defineProperty(i, "__esModule", {
  value: ! 0
}
);
var o = e("RedDotMgr"),
r = e("RedDotNode"),
s = cc._decorator,
l = s.ccclass,
c = s.property,
u = s.menu,
d = function(e) {
  function t() {
    var t = null !== e&& e.apply(this, arguments)|| this;
    t.id = "";
    t.target = null;
    t.countLab = null;
    t.redDot = null;
    return t;
  }
  n(t, e);
  t.prototype.onEnable = function() {
    this.redDot = o.default.getInstance().getRedDot(this.id);
    if(this.redDot) {
      this.redDot.addAttachedNode(this.node);
      this.node.on(r.default.EventType.COUNT_CHANGED, this.updateUI, this);
      this.updateUI();
    }
  }
;
  t.prototype.onDisable = function() {
    if(this.redDot) {
      this.redDot.removeAttachedNode(this.node);
      this.node.off(r.default.EventType.COUNT_CHANGED, this.updateUI, this);
    }
  }
;
  t.prototype.updateUI = function() {
    var e;
(null !== (e = this.target)&& void 0 !== e? e: this.node).active = this.redDot.getCount() > 0;
    this.countLab&& (this.countLab.string = ""+ this.redDot.getCount());
  }
;
  a([c], t.prototype, "id", void 0);
  a([c(cc.Node)], t.prototype, "target", void 0);
  a([c(cc.Label)], t.prototype, "countLab", void 0);
  return a([l, u("RedDot/RedDotCompoent")], t);
}
(cc.Component);
i.default = d;
cc._RF.pop();
