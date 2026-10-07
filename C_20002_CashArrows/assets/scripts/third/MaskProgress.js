let e = require;
let t = module;
let i = exports;
"use strict";
cc._RF.push(t, "4130cPiokRNLYF/jfThP6Po", "MaskProgress");
var n,
a = __extends,
o = __decorate;
Object.defineProperty(i, "__esModule", {
  value: ! 0
}
);
i.Direction = void 0;
var r = cc._decorator,
s = r.ccclass,
l = r.property,
c = r.menu;
r.requireComponent;
(function(e) {
  e[e.HORIZONTAL = 0] = "HORIZONTAL";
  e[e.VERTICAL = 1] = "VERTICAL";
}
)(n = i.Direction|| (i.Direction = {
}
));
var u = function(e) {
  function t() {
    var t = null !== e&& e.apply(this, arguments)|| this;
    t.iconFolowed = null;
    t.labelProgress = null;
    t.direction = n.HORIZONTAL;
    t.mask = null;
    t._progress = 0;
    return t;
  }
  a(t, e);
  Object.defineProperty(t.prototype, "progress", {
    get: function() {
      return this._progress;
    }
, set: function(e) {
      e = Math.max(0, Math.min(1, e));
      if(this._progress != e) {
        this._progress = e;
        this.direction == n.VERTICAL?(this.mask.node.height = Math.floor(e* this.node.height), this.iconFolowed&& (this.iconFolowed.y = this.mask.node.y+ this.mask.node.height)):(this.mask.node.width = Math.floor(e* this.node.width), this.iconFolowed&& (this.iconFolowed.x = this.mask.node.x+ this.mask.node.width));
        this.labelProgress&& (this.labelProgress.string = Math.floor(100* e)+ "%");
      }
    }
, enumerable: ! 1, configurable: ! 0
  }
);
  o([l(cc.Node)], t.prototype, "iconFolowed", void 0);
  o([l(cc.Label)], t.prototype, "labelProgress", void 0);
  o([l({
    type: cc.Enum(n)
  }
)], t.prototype, "direction", void 0);
  o([l(cc.Mask)], t.prototype, "mask", void 0);
  o([l()], t.prototype, "_progress", void 0);
  o([l({
    min: 0, max: 1, slide: ! 0
  }
)], t.prototype, "progress", null);
  return o([s, c("UI/Cocos/MaskProgress")], t);
}
(cc.Component);
i.default = u;
cc._RF.pop();
