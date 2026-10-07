let e = require;
let t = module;
let i = exports;
"use strict";
cc._RF.push(t, "e4946YqlANH+40zWDC3Mvvi", "cashArrowFailView");
var n = __extends,
a = __decorate;
Object.defineProperty(i, "__esModule", {
  value: ! 0
}
);
var o = e("GlobalEventMgr"),
r = e("UIMgr"),
s = e("InterfaceMgr"),
l = e("GEMgr"),
c = e("UserData"),
u = cc._decorator.ccclass,
d = function(e) {
  function t() {
    return null !== e&& e.apply(this, arguments)|| this;
  }
  n(t, e);
  t.prototype.onLoad = function() {
    this._bindEvents();
    try {
      l.default.trackEvent("lvNode", {
        level: c.default.getInstance().level, lose: 1
      }
);
    } catch(e) {
    }
    try {
      o.default.getInstance().emit(s.gameEvent.levelFailReport);
    } catch(e) {
    }
  }
;
  t.prototype.start = function() {
    this.showAni();
  }
;
  t.prototype._bindEvents = function() {
    var e = this,
    t = this.node.getChildByName("bg");
    if(t) {
      var i = t.getChildByName("btn_retry");
      i&& i.on(cc.Node.EventType.TOUCH_END, function() {
        e.OnClickRestart();
      }
, e);
      var n = t.getChildByName("close_btn");
      n&& n.on(cc.Node.EventType.TOUCH_END, function() {
        e.OnClickRestart();
      }
, e);
    }
  }
;
  t.prototype.OnClickRestart = function() {
    o.default.getInstance().emit(s.gameEvent.gameRestart);
    r.default.getInstance().hide(this.node);
  }
;
  t.prototype.showAni = function() {
    var e = this.node.getChildByName("bg");
    if(e) {
      e.y+= 2e3;
      e.opacity = 0;
      cc.tween(e).by(.3, {
        y:- 2100
      }
).by(.3, {
        y: 100
      }
, {
        easing: "backOut"
      }
).union().start();
      cc.tween(e).delay(.15).to(.2, {
        opacity: 255
      }
).start();
    }
  }
;
  return a([u], t);
}
(cc.Component);
i.default = d;
cc._RF.pop();
