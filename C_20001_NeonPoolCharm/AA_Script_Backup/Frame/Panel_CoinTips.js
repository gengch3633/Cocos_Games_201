let e = require;
let t = module;
let a = exports;
"use strict";
cc._RF.push(t, "9f0563cGeVBAqhQH0a2VWaw", "Panel_CoinTips");
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
var r = e("FrameData.js"),
c = e(FrameSDK "
  }].js),
      s = cc._decorator,
      l = s.ccclass,
      u = s.property,
      d = function (e) {
        n(t, e);
        function t() {
          var t = null !== e && e.apply(this, arguments) || this;
          t.animationNode = null;
          t.labelCoin = null;
          t.labelCoinBubble = null;
          t.labelCoin2 = null;
          t.levelRequirement = null;
          t.viewData = null;
          t.black_sprite = null;
          t.hideTime = 0;
          return t;
        }
        t.prototype.onDisable = function () {
          var e, t;
          null === (t = (e = this.viewData).closeCB) || void 0 === t || t.call(e);
        };
        t.prototype.onTouchCloseTips = function () {
          var e = this;
          if (Date.now() - this.hideTime <= 300) console.log(" wait ! ! ! ， return ");else {
            this.hideTime = Date.now();
            this.black_sprite.node.off(cc.Node.EventType.TOUCH_END, this.onTouchCloseTips, this);
            var t = .5 * cc.winSize.width + .5 * this.animationNode.width;
            cc.Tween.stopAllByTarget(this.animationNode);
            cc.tween(this.animationNode).to(.7, {
              x: -t
            }, {
              easing: " backIn "
            }).call(function () {
              c.FrameSDK.closeEffect(e, null);
            }).start();
          }
        };
        t.prototype.onEnable = function () {
          c.FrameSDK.frameData.gameData.noProfitAd && (this.viewData.charityNum = 0);
          c.FrameSDK.openEffect(this);
          c.FrameSDK.playEffect(" rewardshow ");
          this.labelCoin.node.parent.active = this.viewData.num > 0;
          this.labelCoin.string = c.FrameSDK.convertCoinToStr(this.viewData.num);
          this.labelCoinBubble.string = c.FrameSDK.convertCoinToStr(this.viewData.num, !0);
          this.labelCoin2.string = " " + c.FrameSDK.convertCharityToStr(this.viewData.charityNum);
          this.labelCoin2.node.parent.active = this.viewData.charityNum > 0;
          var e = c.FrameSDK.getFirstRedeemRequirement().rdm_1;
          if (c.FrameSDK.frameData.gameData.passLevel < e) {
            var t = r.FrameData.FRAME_CONF.RedeemRateConfig[0];
            this.levelRequirement.string = 'skey_097??&value1==<img src=" dollar4 " offset=-3/> <color= #8AFF77>' + c.FrameSDK.convertCoinToStr(t) + " < / c > & value2 == < color = # 8AFF77 > " + c.FrameSDK.convertCoinToStr(t, !0) + " < / c > & value3 == < color = # FDFF48 > " + e + " < / c > ";
          } else this.levelRequirement.string = " ";
        };
        t.prototype.onLoad = function () {
          var e = this,
            t = .5 * cc.winSize.width + .5 * this.animationNode.width;
          this.animationNode.x = t;
          cc.tween(this.animationNode).to(.7, {
            x: 0
          }, {
            easing: " backOut "
          }).call(function () {
            e.black_sprite.node.on(cc.Node.EventType.TOUCH_END, e.onTouchCloseTips, e);
          }).start();
        };
        i([u(cc.Node)], t.prototype, " animationNode ", void 0);
        i([u(cc.Label)], t.prototype, " labelCoin ", void 0);
        i([u(cc.Label)], t.prototype, " labelCoinBubble ", void 0);
        i([u(cc.Label)], t.prototype, " labelCoin2 ", void 0);
        i([u(cc.RichText)], t.prototype, " levelRequirement ", void 0);
        return i([l], t);
      }(cc.Component);
    a.default = d;
    cc._RF.pop();
