let e = require;
let t = module;
let i = exports;
"use strict";
cc._RF.push(t, "b3a4fgQ8JBNdpFCDm3YHFX4", "noMacScript");
var n = __extends,
a = __decorate;
Object.defineProperty(i, "__esModule", {
  value: ! 0
}
);
var o = e("UserData"),
r = cc._decorator,
s = r.ccclass,
l = r.property,
c = function(e) {
  function t() {
    var t = null !== e&& e.apply(this, arguments)|| this;
    t.macTxt = null;
    return t;
  }
  n(t, e);
  t.prototype.onLoad = function() {
  }
;
  t.prototype.onEnable = function() {
    this.showMacTxt();
  }
;
  t.prototype.start = function() {
  }
;
  t.prototype.showMacTxt = function() {
    null == o.default.getInstance().userID&& (o.default.getInstance().userID = o.default.getUserId(10));
    console.log("id:"+ o.default.getInstance().userID);
    this.macTxt.string = "id:"+ o.default.getInstance().userID;
  }
;
  t.prototype.copyMacTxt = function() {
    var e = document.createElement("textarea");
    e.value = this.macTxt.string;
    e.style.position = "fixed";
    e.style.opacity = "0";
    document.body.appendChild(e);
    e.focus();
    e.select();
    try {
      document.execCommand("copy")? console.log("复制成功"): console.error("复制失败");
    } catch(e) {
      console.error("无法复制文本: ", e);
    }
    document.body.removeChild(e);
  }
;
  a([l({
    type: cc.Label, tooltip: "mac文本"
  }
)], t.prototype, "macTxt", void 0);
  return a([s], t);
}
(cc.Component);
i.default = c;
cc._RF.pop();
