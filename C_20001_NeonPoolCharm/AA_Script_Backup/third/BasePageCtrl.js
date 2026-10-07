let e = require;
let t = module;
let o = exports;
"use strict";
cc._RF.push(t, "aee7eg2u1tMH43qWpqydZx4", "BasePageCtrl");
var n,
i = this&& this.__extends|| (n = function(e, t) {
  return(n = Object.setPrototypeOf|| {
    __proto__:[]
  }
  instanceof Array&& function(e, t) {
    e.__proto__ = t;
  }
|| function(e, t) {
    for(var o in t) Object.prototype.hasOwnProperty.call(t, o)&& (e[o] = t[o]);
  }
)(e, t);
}
, function(e, t) {
  n(e, t);
  function o() {
    this.constructor = e;
  }
  e.prototype = null === t? Object.create(t):(o.prototype = t.prototype, new o());
}
),
a = this&& this.__decorate|| function(e, t, o, n) {
  var i,
  a = arguments.length,
  r = a < 3? t: null === n? n = Object.getOwnPropertyDescriptor(t, o): n;
  if("object" == typeof Reflect&& "function" == typeof Reflect.decorate) r = Reflect.decorate(e, t, o, n);
  else for(var l = e.length- 1;
  l >= 0;
  l--)(i = e[l])&& (r = (a < 3? i(r): a > 3? i(t, o, r): i(t, o))|| r);
  return a > 3&& r&& Object.defineProperty(t, o, r),
  r;
}
;
Object.defineProperty(o, "__esModule", {
  value: ! 0
}
);
o.AnimType = void 0;
var r = e("NativeEventType.js"),
l = e("EventMgr.js"),
s = e("SdkHelper.js"),
c = e("EngineUtil.js"),
u = e("PageConfig.js"),
p = e("PageMgr.js"),
d = cc._decorator,
_ = d.ccclass,
f = d.property;
o.AnimType = cc.Enum({
  NONE: 0, SCALE: 1, FADE: 2, POINTSCALE: 3, POINTSCALE2: 4, POINTSCALE3: 5
}
);
cc._decorator;
var h = function(e) {
  i(t, e);
  function t() {
    var t = null !== e&& e.apply(this, arguments)|| this;
    t._inQueue = ! 1;
    t._only = ! 0;
    t._reuse = ! 0;
    t._animType = o.AnimType.SCALE;
    t._animTime = .1;
    t._animControl = ! 1;
    t._black_start_opacity = 0;
    t._black_end_opacity = 200;
    t._blackTime = .1;
    t._touchControl = ! 1;
    t._hasPeneLock = ! 0;
    t._hasBlack = ! 0;
    t._hasTouchLock = ! 0;
    t._hasBlackTouch = ! 0;
    t._set_oldContent = new Set();
    t._peneLock = null;
    t._black = null;
    t._touchLock = null;
    t._content = null;
    t._highestIndex = 0;
    t._show_timestemp = 0;
    t._report_data = null;
    t._start_pos = null;
    t.notReoprt = ! 1;
    return t;
  }
  t.prototype.onBlackTouch = function() {
  }
;
  t.prototype._lockTouch = function() {
    this._touchLock&& (this._touchLock.active = ! 0);
  }
;
  t.prototype.onUILoad = function() {
  }
;
  t.prototype.hide = function() {
    var e = this,
    t = this._animType;
    this._lockTouch();
    var n = this._content;
    cc.Tween.stopAllByTarget(n);
    var i = this._animTime;
    switch(t) {
      case o.AnimType.NONE: this._onHide();
      break;
      case o.AnimType.SCALE: n.scale = 1;
      n.opacity = 255;
      cc.tween(n).to(i, {
        scale:.7, opacity: 127.5
      }
).set({
        opacity: 0
      }
).delay(.03).call(function() {
        e._onHide();
      }
).start();
      break;
      case o.AnimType.FADE: n.opacity = 255;
      cc.tween(n).to(i, {
        opacity: 0
      }
).call(function() {
        e._onHide();
      }
).start();
      break;
      case o.AnimType.POINTSCALE: case o.AnimType.POINTSCALE2: case o.AnimType.POINTSCALE3: n.scale = 1;
      cc.tween(n).to(.2, {
        scale:.4
      }
, {
        easing: "backin"
      }
).to(.2, {
        scale: 0, y: this._start_pos.y, x: this._start_pos.x
      }
, {
        easing: "backin"
      }
).call(function() {
        e._onHide();
        n.setPosition(0, 0);
      }
).start();
    }
    this._hideBlack();
  }
;
  t.prototype._showBlack = function() {
    var e = this._black;
    if(e) {
      e.opacity = this._black_start_opacity;
      cc.Tween.stopAllByTarget(e);
      cc.tween(e).to(this._blackTime, {
        opacity: this._black_end_opacity
      }
).start();
    }
  }
;
  t.prototype.addBlackTouch = function() {
    if(this._hasBlackTouch&& this._black) {
      this._black.hasEventListener(cc.Node.EventType.TOUCH_END)&& this.removeBlackTouch();
      this._black.on(cc.Node.EventType.TOUCH_END, this.onBlackTouch, this);
    }
  }
;
  t.prototype._createPeneLock = function() {
    if(this._hasPeneLock) {
      var e = new cc.Node("peneLock");
      e.addComponent(cc.BlockInputEvents);
      e.setContentSize(cc.winSize);
      this.node.addChild(e);
      this._peneLock = e;
      this._setIndex(e);
    }
  }
;
  t.prototype._setBottomNodes = function(e) {
    var t = cc.winSize.height,
    o = c.default.isLargeScreen()? t/ 2- u.DISTANCE_BOTTOM: t/ 2;
    e.y = - o;
  }
;
  t.prototype._reportExit = function() {
    var e = new Date().getTime();
    s.default.reportData("b_leave_game_page", {
      act_page: this.node.name, duration: e- this._show_timestemp
    }
);
    this._show_timestemp = 0;
  }
;
  t.prototype._saveContent = function() {
    var e = this;
    this.node.children.forEach(function(t) {
      return e._set_oldContent.add(t);
    }
);
  }
;
  t.prototype._show = function() {
    var e = this,
    t = this._animType;
    this._lockTouch();
    var n = this._content;
    cc.Tween.stopAllByTarget(n);
    var i = this._animTime;
    switch(t) {
      case o.AnimType.NONE: this._onShow();
      break;
      case o.AnimType.SCALE: n.scale = .7;
      n.opacity = 127.5;
      cc.tween(n).to(i, {
        scale: 1, opacity: 255
      }
).call(function() {
        e._onShow();
      }
).start();
      break;
      case o.AnimType.FADE: n.opacity = 0;
      cc.tween(n).to(i, {
        opacity: 255
      }
).call(function() {
        e._onShow();
      }
).start();
      break;
      case o.AnimType.POINTSCALE: this._onShow();
      break;
      case o.AnimType.POINTSCALE2: n.scale = 0;
      cc.tween(n).to(i, {
        scale: 1
      }
, {
        easing: "backOut"
      }
).call(function() {
        e._onShow();
      }
).start();
      break;
      case o.AnimType.POINTSCALE3: this._content.scale = 0;
      this._black.opacity = this._black_start_opacity;
    }
    t != o.AnimType.POINTSCALE3? this._showBlack(): cc.Tween.stopAllByTarget(this._black);
  }
;
  t.prototype._onHide = function() {
    this._unLockTouch();
    this.node.active = ! 1;
  }
;
  t.prototype._setIndex = function(e) {
    if(e) {
      e.zIndex = this._highestIndex;
      this._highestIndex++;
    }
  }
;
  t.prototype.onLoad = function() {
    this._saveContent();
    this._createPeneLock();
    this._createBlack();
    this._createContent();
    this._createTouchLock();
    l.default.listen(r.default.APP_PAUSE, this._onAppPause, this);
    l.default.listen(r.default.APP_RESTART, this._onAppRestart, this);
  }
;
  t.prototype._onAppPause = function() {
    this.node.active&& this._reportExit();
  }
;
  t.prototype._init = function() {
    for(var e = [], t = 0;
    t < arguments.length;
    t++) e[t] = arguments[t];
  }
;
  t.prototype.onEnable = function() {
    this._reportEntry();
    this._show();
  }
;
  t.prototype._reportEntry = function() {
    if(! this.notReoprt) {
      this._show_timestemp = new Date().getTime();
      var e = {
        act_page: this.node.name
      }
;
      this._report_data&& Object.assign(e, this._report_data);
      s.default.reportData("b_entry_game_page", e);
    }
  }
;
  t.prototype.startPOINTSCALE3 = function() {
    var e = this._content;
    e.scale = 0;
    e.setPosition(this._start_pos);
    cc.tween(e).parallel(cc.tween(e).to(.4, {
      scale: 1
    }
, {
      easing: "backOut"
    }
), cc.tween(e).to(.2, {
      y: 0, x: 0
    }
)).call(this._onShow.bind(this)).start();
    this._showBlack();
  }
;
  t.prototype._addReportData = function(e) {
    this._report_data|| (this._report_data = {
    }
);
    Object.assign(this._report_data, e);
  }
;
  t.prototype._onShow = function() {
    this._unLockTouch();
    this.addBlackTouch();
  }
;
  t.prototype.onDisable = function() {
    this._reportExit();
    p.default.hidePage(this.node.name);
  }
;
  t.prototype._createBlack = function() {
    if(this._hasBlack) {
      var e = new cc.Node("black"),
      t = e.addComponent(cc.Sprite);
      cc.resources.load("pages/res/back", cc.SpriteFrame, function(o, n) {
        if(o) console.error("class:basePage", o);
        else {
          t.spriteFrame = n;
          e.setContentSize(cc.winSize);
        }
      }
);
      this.node.addChild(e);
      e.color = c.default.getColor("000000");
      this._black = e;
      this._setIndex(e);
    }
  }
;
  t.prototype._setTopNodes = function(e) {
    var t = cc.winSize.height;
    e.y = c.default.isLargeScreen()? t/ 2- u.DISTANCE_TOP: t/ 2;
  }
;
  t.prototype.removeBlackTouch = function() {
    this._black&& this._black.off(cc.Node.EventType.TOUCH_END, this.onBlackTouch, this);
  }
;
  t.prototype._unLockTouch = function() {
    this._touchLock&& (this._touchLock.active = ! 1);
  }
;
  t.prototype._createTouchLock = function() {
    if(this._hasTouchLock) {
      var e = new cc.Node("closeTouch");
      e.addComponent(cc.BlockInputEvents);
      e.setContentSize(cc.winSize);
      this.node.addChild(e);
      this._touchLock = e;
      this._setIndex(e);
    }
  }
;
  t.prototype._hideBlack = function() {
    var e = this._black;
    if(e) {
      e.opacity = this._black_end_opacity;
      cc.Tween.stopAllByTarget(e);
      cc.tween(e).to(this._blackTime, {
        opacity: this._black_start_opacity
      }
).start();
    }
  }
;
  t.prototype._onAppRestart = function() {
    this.node.active&& this._reportEntry();
  }
;
  t.prototype._createContent = function() {
    var e = this,
    t = new cc.Node("content");
    t.setContentSize(cc.winSize);
    this.node.addChild(t);
    this._set_oldContent.forEach(function(o) {
      o.parent = t;
      "top" == o.name&& e._setTopNodes(o);
      "bottom" == o.name&& e._setBottomNodes(o);
    }
);
    this._content = t;
    this._setIndex(t);
  }
;
  a([f({
    tooltip: "是否加入队列", visible: ! 0
  }
)], t.prototype, "_inQueue", void 0);
  a([f({
    tooltip: "是否唯一", visible: ! 0
  }
)], t.prototype, "_only", void 0);
  a([f({
    tooltip: "是否复用", visible: ! 0
  }
)], t.prototype, "_reuse", void 0);
  a([f({
    type: cc.Enum(o.AnimType), visible: ! 0, tooltip: "动画类型"
  }
)], t.prototype, "_animType", void 0);
  a([f({
    visible: ! 0, tooltip: "动画时间"
  }
)], t.prototype, "_animTime", void 0);
  a([f({
    visible: ! 0, displayName: "蒙版配置"
  }
)], t.prototype, "_animControl", void 0);
  a([f({
    tooltip: "蒙版初始透明度", visible: function() {
      return this._animControl;
    }
  }
)], t.prototype, "_black_start_opacity", void 0);
  a([f({
    tooltip: "蒙版结束透明度", visible: function() {
      return this._animControl;
    }
  }
)], t.prototype, "_black_end_opacity", void 0);
  a([f({
    tooltip: "蒙版动画时间", visible: function() {
      return this._animControl;
    }
  }
)], t.prototype, "_blackTime", void 0);
  a([f({
    visible: ! 0, displayName: "页面遮挡控制"
  }
)], t.prototype, "_touchControl", void 0);
  a([f({
    tooltip: "阻止页面穿透", visible: function() {
      return this._touchControl;
    }
  }
)], t.prototype, "_hasPeneLock", void 0);
  a([f({
    tooltip: "黑色蒙版", visible: function() {
      return this._touchControl;
    }
  }
)], t.prototype, "_hasBlack", void 0);
  a([f({
    tooltip: "阻止页面内点击", visible: function() {
      return this._touchControl;
    }
  }
)], t.prototype, "_hasTouchLock", void 0);
  a([f({
    tooltip: "页面黑色遮罩Touch监听", visible: function() {
      return this._touchControl;
    }
  }
)], t.prototype, "_hasBlackTouch", void 0);
  return a([_], t);
}
(cc.Component);
o.default = h;
cc._RF.pop();
