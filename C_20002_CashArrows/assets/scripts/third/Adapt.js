let e = require;
let t = module;
let i = exports;
"use strict";
cc._RF.push(t, "29c41oasP9CBp++uIR3jaaw", "Adapt");
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
  t.prototype.onLoad = function() {
    this.init();
  }
;
  t.prototype.onEnable = function() {
    this.adapt();
  }
;
  t.prototype.init = function() {
    var e = this;
    cc.view.setResizeCallback(function() {
      return e.onResize();
    }
);
  }
;
  t.prototype.onResize = function() {
    this.adapt();
  }
;
  t.prototype.adapt = function() {
    var e = cc.winSize,
    t = e.width/ e.height,
    i = cc.Canvas.instance.designResolution,
    n = i.width/ i.height;
    t <= 1&& t <= n? this.setFitWidth(): this.setFitHeight();
  }
;
  t.prototype.setFitHeight = function() {
    var e = cc.Canvas.instance;
    e.fitHeight = ! 0;
    e.fitWidth = ! 1;
  }
;
  t.prototype.setFitWidth = function() {
    var e = cc.Canvas.instance;
    e.fitHeight = ! 1;
    e.fitWidth = ! 0;
  }
;
  return a([r], t);
}
(cc.Component);
i.default = s;
cc._RF.pop();
