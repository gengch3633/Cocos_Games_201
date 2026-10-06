let e = require;
let t = module;
let o = exports;
"use strict";
cc._RF.push(t, "52669zry5FKc415Cx9UY3FV", "BaseButton");
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
var r = e(AudioManager "
  }].js),
      l = cc._decorator,
      s = l.ccclass,
      c = l.property,
      u = cc.Enum({
        NONE: 0,
        ShortButton: 1,
        DoubleButton: 2,
        LongButton: 3,
        MixButton: 4
      }),
      p = cc.Enum({
        NONE: 0,
        ShortButton: 1,
        DoubleButton: 2,
        LongButton: 3
      });
    cc.Enum(u);
    cc.Enum(p);
    cc._decorator;
    var d = function (e) {
      i(t, e);
      function t() {
        var t = null !== e && e.apply(this, arguments) || this;
        t.holdTimeCount = 0;
        t.isClicked = !1;
        t.clickTimes = 0;
        t.targetSp = null;
        t.lastTargetSp = null;
        t.normalSp = null;
        t.curClickTime = 0;
        t.turnDuration = .1;
        t.normalMaterial = null;
        t.grayMaterial = null;
        t._targetNode = null;
        t._interactable = !0;
        t.disabled = null;
        t._enableAutoGrayEffect = !1;
        t.scaleRadio = .95;
        t._clickDelay = 300;
        t.holdTime = .5;
        t._btnType = u.ShortButton;
        t._mixButtonTypeList = [];
        t.noMixEvents = [];
        t.shortEvents = [];
        t.doubleEvents = [];
        t.longEvents = [];
        t.turnTotalTime = null;
        t._changeFinished = null;
        t.f_ScaleX = null;
        t.f_ScaleY = null;
        t.t_ScaleX = null;
        t.t_ScaleY = null;
        t.o_ScaleX = null;
        t.o_ScaleY = null;
        return t;
      }
      Object.defineProperty(t.prototype, " targetNode ", {
        get: function () {
          return this._targetNode;
        },
        set: function (e) {
          this._targetNode = e;
          this.changeTargetSp();
        },
        enumerable: !1,
        configurable: !0
      });
      Object.defineProperty(t.prototype, " interactable ", {
        get: function () {
          return this._interactable;
        },
        set: function (e) {
          this._interactable = e;
          this.changeTargetSp();
        },
        enumerable: !1,
        configurable: !0
      });
      Object.defineProperty(t.prototype, " enableAutoGrayEffect ", {
        get: function () {
          return this._enableAutoGrayEffect;
        },
        set: function (e) {
          this._enableAutoGrayEffect = e;
          this.changeTargetSp();
        },
        enumerable: !1,
        configurable: !0
      });
      Object.defineProperty(t.prototype, " clickDelay ", {
        get: function () {
          return this._clickDelay;
        },
        set: function (e) {
          this._clickDelay = e;
        },
        enumerable: !1,
        configurable: !0
      });
      Object.defineProperty(t.prototype, " btnType ", {
        get: function () {
          return this._btnType;
        },
        set: function (e) {
          this._btnType = e;
          this.changeDelayTime();
        },
        enumerable: !1,
        configurable: !0
      });
      Object.defineProperty(t.prototype, " mixButtonTypeList ", {
        get: function () {
          return this._mixButtonTypeList;
        },
        set: function (e) {
          if (!this.checkMixHaveType(e)) {
            this._mixButtonTypeList = e;
            this.changeDelayTime();
          }
        },
        enumerable: !1,
        configurable: !0
      });
      t.prototype.changeDelayTime = function () {
        if (this.btnType === u.ShortButton || this.btnType === u.MixButton && -1 !== this.mixButtonTypeList.indexOf(u.ShortButton)) {
          var e = this.btnType === u.MixButton && -1 !== this.mixButtonTypeList.indexOf(u.ShortButton) && -1 !== this.mixButtonTypeList.indexOf(u.DoubleButton);
          this.clickDelay = e ? 100 : 300;
        } else this.clickDelay = 0;
      };
      t.prototype.changeTargetSp = function () {
        this.normalMaterial || (this.normalMaterial = cc.Material.getBuiltinMaterial(" 2d- sprite "));
        this.grayMaterial || (this.grayMaterial = cc.Material.getBuiltinMaterial(" 2d- gray- sprite "));
        this.lastTargetSp && this.lastTargetSp.setMaterial(0, this.normalMaterial);
        if (this.targetNode) {
          var e = this.targetNode.getComponent(cc.Sprite);
          this.targetSp = this.lastTargetSp = e;
        } else {
          this.targetSp = this.node.getComponent(cc.Sprite);
          this.lastTargetSp = null;
        }
        this.normalSp || (this.normalSp = this.targetSp.spriteFrame);
        this.disabled && (this.interactable ? this.targetSp.spriteFrame = this.normalSp : this.targetSp.spriteFrame = this.disabled);
        !this.interactable && this.enableAutoGrayEffect ? this.targetSp.setMaterial(0, this.grayMaterial) : this.targetSp.setMaterial(0, this.normalMaterial);
      };
      t.prototype.onTouchEnd = function () {
        if (this.interactable) {
          this.isClicked = !1;
          this._zoomBack();
          this.checkCanExcel && this.checkCanExcel(this.node);
          this.holdTimeCount = 0;
        }
      };
      t.prototype.update = function (e) {
        var t = this.node;
        this.isClicked && this.holdTimeCount++;
        if (!this._changeFinished) {
          this.turnTotalTime += e;
          var o = 1;
          this.turnDuration > 0 && (o = this.turnTotalTime / this.turnDuration);
          if (o >= 1) {
            o = 1;
            this._changeFinished = !0;
          }
          t.scaleX = cc.misc.lerp ? cc.misc.lerp(this.f_ScaleX, this.t_ScaleX, o) : 1;
          t.scaleY = cc.misc.lerp ? cc.misc.lerp(this.f_ScaleY, this.t_ScaleY, o) : 1;
        }
      };
      t.prototype.onLoad = function () {
        this.turnTotalTime = 0;
        this._changeFinished = !0;
        this.f_ScaleX = 1;
        this.f_ScaleY = 1;
        this.t_ScaleX = 1;
        this.t_ScaleY = 1;
        this.o_ScaleX = this.node.scaleX;
        this.o_ScaleY = this.node.scaleY;
      };
      t.prototype.checkCanExcel = function (e) {
        var t = this,
          o = Date.now();
        if (o - this.curClickTime > this.clickDelay) {
          this.curClickTime = o;
          this.clickTimes++;
          r.default.getInstance().playMusic(" btntouch ");
          (this.btnType === u.LongButton || this.btnType === u.MixButton && -1 !== this.mixButtonTypeList.indexOf(u.LongButton)) && this.holdTimeCount >= 60 * this.holdTime && this.excelClickEvent(e, u.LongButton);
          if (this.btnType === u.DoubleButton || this.btnType === u.MixButton && -1 !== this.mixButtonTypeList.indexOf(u.DoubleButton)) {
            var n = setTimeout(function () {
              clearTimeout(n);
              t.clickTimes = 0;
            }, 0 === this.clickDelay ? 400 : 2.8 * this.clickDelay);
            if (2 === this.clickTimes) {
              n && clearTimeout(n);
              this.excelClickEvent(e, u.DoubleButton);
            }
          }
          var i = this.btnType === u.MixButton && -1 !== this.mixButtonTypeList.indexOf(u.ShortButton) && -1 !== this.mixButtonTypeList.indexOf(u.DoubleButton);
          if (this.btnType === u.ShortButton || this.btnType === u.MixButton && -1 !== this.mixButtonTypeList.indexOf(u.ShortButton)) if (i) var a = 1.8 * this.clickDelay,
            l = setTimeout(function () {
              clearTimeout(l);
              1 === t.clickTimes && t.excelClickEvent(e, u.ShortButton);
            }, a);else 1 === this.clickTimes && this.excelClickEvent(e, u.ShortButton);
        }
      };
      t.prototype.onTouchCancel = function () {
        this._zoomBack();
        this.isClicked = !1;
        this.holdTimeCount = 0;
        this.clickTimes = 0;
      };
      t.prototype._zoomBack = function () {
        this.f_ScaleX = this.node.scaleX;
        this.f_ScaleY = this.node.scaleY;
        this.t_ScaleX = this.o_ScaleX;
        this.t_ScaleY = this.o_ScaleY;
        this.turnTotalTime = 0;
        this._changeFinished = !1;
      };
      t.prototype._zoomUp = function () {
        this.f_ScaleX = this.o_ScaleX;
        this.f_ScaleY = this.o_ScaleY;
        this.t_ScaleX = this.o_ScaleX * this.scaleRadio;
        this.t_ScaleY = this.o_ScaleY * this.scaleRadio;
        this.turnTotalTime = 0;
        this._changeFinished = !1;
      };
      t.prototype.checkMixHaveType = function (e) {
        for (var t = {}, o = 0; o < e.length; o++) {
          if (t[e[o]]) {
            e[o] = u.NONE;
            return !0;
          }
          t[e[o]] = !0;
        }
        return !1;
      };
      t.prototype.onTouchStart = function () {
        if (this.interactable) {
          this.isClicked = !0;
          this.holdTimeCount = 0;
          this._zoomUp();
        }
      };
      t.prototype.onDisable = function () {
        this.node.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
      };
      t.prototype.excelClickEvent = function (e, t) {
        if (t !== u.NONE) {
          this.clickTimes = 0;
          if (this.btnType !== u.MixButton) this.noMixEvents.forEach(function (t) {
            if (t && t.handler && t.target) {
              var o = t.target.getComponent(t._componentName);
              o && o[t.handler] && o[t.handler](e, t.customEventData);
            }
          });else {
            t === u.ShortButton && this.shortEvents.forEach(function (t) {
              if (t && t.handler && t.target) {
                var o = t.target.getComponent(t._componentName);
                o && o[t.handler] && o[t.handler](e, t.customEventData);
              }
            });
            t === u.DoubleButton && this.doubleEvents.forEach(function (t) {
              if (t && t.handler && t.target) {
                var o = t.target.getComponent(t._componentName);
                o && o[t.handler] && o[t.handler](e, t.customEventData);
              }
            });
            t === u.LongButton && this.longEvents.forEach(function (t) {
              if (t && t.handler && t.target) {
                var o = t.target.getComponent(t._componentName);
                o && o[t.handler] && o[t.handler](e, t.customEventData);
              }
            });
          }
        }
      };
      t.prototype.onEnable = function () {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
      };
      a([c(cc.Node)], t.prototype, " _targetNode ", void 0);
      a([c()], t.prototype, " _interactable ", void 0);
      a([c(cc.SpriteFrame)], t.prototype, " disabled ", void 0);
      a([c()], t.prototype, " _enableAutoGrayEffect ", void 0);
      a([c({
        type: cc.Float,
        tooltip: " 缩放比例 "
      })], t.prototype, " scaleRadio ", void 0);
      a([c({
        type: cc.Integer
      })], t.prototype, " _clickDelay ", void 0);
      a([c({
        type: cc.Float,
        tooltip: " 长按响应的时长(单位 ： 秒) ",
        visible: function () {
          return this.btnType === u.LongButton || this.btnType === u.MixButton && -1 !== this.mixButtonTypeList.indexOf(u.LongButton);
        }
      })], t.prototype, " holdTime ", void 0);
      a([c({
        type: u
      })], t.prototype, " _btnType ", void 0);
      a([c({
        type: [p]
      })], t.prototype, " _mixButtonTypeList ", void 0);
      a([c({
        type: [cc.Component.EventHandler],
        visible: function () {
          return this.btnType !== u.MixButton && this.btnType !== u.NONE;
        },
        tooltip: " 回调函数组 "
      })], t.prototype, " noMixEvents ", void 0);
      a([c({
        type: [cc.Component.EventHandler],
        visible: function () {
          return this.btnType === u.MixButton && -1 !== this.mixButtonTypeList.indexOf(u.ShortButton);
        },
        tooltip: " 单击回调函数组 "
      })], t.prototype, " shortEvents ", void 0);
      a([c({
        type: [cc.Component.EventHandler],
        visible: function () {
          return this.btnType === u.MixButton && -1 !== this.mixButtonTypeList.indexOf(u.DoubleButton);
        },
        tooltip: " 双击回调函数组 "
      })], t.prototype, " doubleEvents ", void 0);
      a([c({
        type: [cc.Component.EventHandler],
        visible: function () {
          return this.btnType === u.MixButton && -1 !== this.mixButtonTypeList.indexOf(u.LongButton);
        },
        tooltip: " 长按回调函数组 "
      })], t.prototype, " longEvents ", void 0);
      a([c({
        type: cc.Node
      })], t.prototype, " targetNode ", null);
      a([c({
        type: cc.Boolean,
        tooltip: " 是否可交互 "
      })], t.prototype, " interactable ", null);
      a([c({
        type: cc.Boolean,
        tooltip: " 当设置为 true 的时候 ， 如果 button 的 interactable 属性为 false ， 则 button 的 sprite Target 会变为灰度 "
      })], t.prototype, " enableAutoGrayEffect ", null);
      a([c({
        type: cc.Integer,
        tooltip: " 点击间隔(单位 ： 毫秒) ， 0- 没有间隔 "
      })], t.prototype, " clickDelay ", null);
      a([c({
        type: u,
        tooltip: " 按钮类型 "
      })], t.prototype, " btnType ", null);
      a([c({
        type: [p],
        visible: function () {
          return this.btnType === u.MixButton;
        },
        tooltip: " 选择混合类型组合 "
      })], t.prototype, " mixButtonTypeList ", null);
      return a([s], t);
    }(cc.Component);
    o.default = d;
    cc._RF.pop();
