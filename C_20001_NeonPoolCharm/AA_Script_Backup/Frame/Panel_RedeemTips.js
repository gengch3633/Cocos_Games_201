let e = require;
let t = module;
let a = exports;
"use strict";
cc._RF.push(t, "d4a89oveAZM8pLs8EQqe87x", "Panel_RedeemTips");
var o,
n = this&& this.__extends|| (o = function(e, t) {
  return(o = Object.setPrototypeOf|| {
    __proto__:[]
  }
  instanceof Array&& function(e, t) {
    e.__proto__ = t;
  }
|| function(e, t) {
    for(var a in t) Object.prototype.hasOwnProperty.call(t, a)&& (e[a] = t[a]);
  }
)(e, t);
}
, function(e, t) {
  o(e, t);
  function a() {
    this.constructor = e;
  }
  e.prototype = null === t? Object.create(t):(a.prototype = t.prototype, new a());
}
),
i = this&& this.__decorate|| function(e, t, a, o) {
  var n,
  i = arguments.length,
  r = i < 3? t: null === o? o = Object.getOwnPropertyDescriptor(t, a): o;
  if("object" == typeof Reflect&& "function" == typeof Reflect.decorate) r = Reflect.decorate(e, t, a, o);
  else for(var c = e.length- 1;
  c >= 0;
  c--)(n = e[c])&& (r = (i < 3? n(r): i > 3? n(t, a, r): n(t, a))|| r);
  return i > 3&& r&& Object.defineProperty(t, a, r),
  r;
}
;
Object.defineProperty(a, "__esModule", {
  value: ! 0
}
);
var r = e(FrameSDK "
  }].js),
      c = cc._decorator,
      s = c.ccclass,
      l = c.property,
      u = function (e) {
        n(t, e);
        function t() {
          var t = null !== e && e.apply(this, arguments) || this;
          t.bg = null;
          t.levelLabel = null;
          t.tips1 = null;
          t.rtx_tips1 = null;
          t.viewData = null;
          return t;
        }
        t.prototype.onLoad = function () {
          var e = this,
            t = .5 * cc.winSize.width + .5 * this.bg.width;
          this.bg.x = t;
          this.levelLabel.string = " " + this.viewData.level;
          var a = r.FrameSDK.getFirstRedeemRequirement().rdm_1;
          this.tips1.string = " skey_078?? & value1 == < color = # FDFF48 > " + Math.max(0, a - r.FrameSDK.frameData.gameData.passLevel) + " < / c > ";
          this.rtx_tips1.string = " skey_079?? & value1 == < color = # 8AFF77 > " + r.FrameSDK.convertCoinToStr(this.viewData.currentBonus, !0) + " < / c > ";
          r.FrameSDK.playEffect(" rewardshow ");
          cc.tween(this.bg).to(.7, {
            x: 0
          }, {
            easing: " backOut "
          }).delay(1).to(.7, {
            x: -t
          }, {
            easing: " backIn "
          }).call(function () {
            r.FrameSDK.closeEffect(e, null);
          }).start();
        };
        t.prototype.onEnable = function () {
          r.FrameSDK.openEffect(this);
        };
        t.prototype.onDisable = function () {
          var e, t;
          null === (t = (e = this.viewData).closeCB) || void 0 === t || t.call(e);
        };
        i([l(cc.Node)], t.prototype, " bg ", void 0);
        i([l(cc.Label)], t.prototype, " levelLabel ", void 0);
        i([l(cc.RichText)], t.prototype, " tips1 ", void 0);
        i([l(cc.RichText)], t.prototype, " rtx_tips1 ", void 0);
        return i([s], t);
      }(cc.Component);
    a.default = u;
    cc._RF.pop();
