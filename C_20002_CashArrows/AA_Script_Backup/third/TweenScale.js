let e = require;
let t = module;
let i = exports;
"use strict";
cc._RF.push(t, "ebacab0KftAHbSKGBUWt5Rm", "TweenScale");
var n = __extends,
a = __decorate;
Object.defineProperty(i, "__esModule", {
  value: ! 0
}
);
var o = cc._decorator,
r = o.ccclass,
s = o.property,
l = o.menu,
c = function(e) {
  function t() {
    var t = null !== e&& e.apply(this, arguments)|| this;
    t.maxScale = 1.2;
    t.minScale = .8;
    return t;
  }
  n(t, e);
  t.prototype.onLoad = function() {
    var e = cc.tween(this.node).to(.5, {
      scale: this.minScale
    }
).to(1, {
      scale: this.maxScale
    }
).to(.5, {
      scale: 1
    }
);
    cc.tween(this.node).then(e).repeatForever().start();
  }
;
  a([s()], t.prototype, "maxScale", void 0);
  a([s()], t.prototype, "minScale", void 0);
  return a([r, l("自定义组件/TweenScale")], t);
}
(cc.Component);
i.default = c;
cc._RF.pop();
