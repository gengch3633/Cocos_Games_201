let e = require;
let t = module;
let i = exports;
"use strict";
cc._RF.push(t, "13f30v7hSlLkKnK/GO5lQ4V", "ClickInterval");
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
c = o.requireComponent,
u = function(e) {
  function t() {
    var t = null !== e&& e.apply(this, arguments)|| this;
    t.interval = .5;
    t.isInit = ! 1;
    t.lastClickTime = 0;
    t.srcOnTouchEnded = null;
    return t;
  }
  n(t, e);
  Object.defineProperty(t.prototype, "btn", {
    get: function() {
      this._btn|| (this._btn = this.getComponent(cc.Button));
      return this._btn;
    }
, enumerable: ! 1, configurable: ! 0
  }
);
  t.prototype.onLoad = function() {
    this.init();
  }
;
  t.prototype.onEnable = function() {
    this.init();
  }
;
  t.prototype.onDisable = function() {
    this.reset();
  }
;
  t.prototype.init = function() {
    if(! this.isInit) {
      this.isInit = ! 0;
      this.srcOnTouchEnded = this.btn._onTouchEnded.bind(this.btn);
      this.btn._onTouchEnded = this.onTouchEnded.bind(this);
    }
  }
;
  t.prototype.reset = function() {
    this.lastClickTime = 0;
    this.srcOnTouchEnded&& (this.btn._onTouchEnded = this.srcOnTouchEnded);
    this.srcOnTouchEnded = null;
    this.isInit = ! 1;
  }
;
  t.prototype.onTouchEnded = function(e) {
    if(!(this.lastClickTime+ 1e3* this.interval > Date.now())) {
      this.lastClickTime = Date.now();
      this.srcOnTouchEnded(e);
    }
  }
;
  a([s({
    tooltip: "点击间隔(秒)"
  }
)], t.prototype, "interval", void 0);
  return a([r, l("UI/Cocos/Btn/ClickInterval"), c(cc.Button)], t);
}
(cc.Component);
i.default = u;
cc._RF.pop();
