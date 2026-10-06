let e = require;
let t = module;
let a = exports;
"use strict";
cc._RF.push(t, "5af21Q20bpLLaNuTW5xN1bF", "Panel_Award_3");
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
var r = e("AinanEff.js"),
c = e("CLICKLOCK.js"),
s = e("FrameData.js"),
l = e(FrameSDK "
  }].js),
      u = cc._decorator,
      d = u.ccclass,
      p = u.property,
      h = function (e) {
        n(t, e);
        function t() {
          var t = null !== e && e.apply(this, arguments) || this;
          t.titleSkeleton = null;
          t.contentSkeleton = null;
          t.baseCoinNode = null;
          t.baseCoinLabel = null;
          t.arrowNode = null;
          t.maxCoinNode = null;
          t.maxCoinLabel = null;
          t.finalCoinNode = null;
          t.finalCoinLabel = null;
          t.labelRootNode = null;
          t.multiplierDisplay = null;
          t.pointerIndicator = null;
          t.adBannerButton = null;
          t.adFrequencyCounter = null;
          t.commonActionButton = null;
          t.sian = null;
          t.noAdBadgeIcon = null;
          t.adBadgeIcon = null;
          t.ribbonSkeleton = null;
          t.adData = null;
          t.viewData = null;
          t.getYCoin = 0;
          t.beishe = 1;
          t.speed = 300;
          t.timeArray = [];
          t.targetIndex = 0;
          t.hideTime = 0;
          return t;
        }
        t.prototype.onEnable = function () {
          var e,
            t = this;
          this.adData = s.FrameData.getOutputConfig(!1);
          this.getYCoin = s.FrameData.getCoinOutNum(" draw ");
          (e = this.timeArray).push.apply(e, s.FrameData.getCoinOutNum(" drawRate "));
          var a = s.FrameData.getCoinOutNum(" free ");
          l.FrameSDK.logCommonEvent(" c_ad_event ", {
            action: " exposure ",
            type: " video ",
            placement: " reward_1 "
          });
          l.FrameSDK.logGameEvent(" thepool_game_rew ", {
            object_action: " show ",
            object_name: " rew_show ",
            object_notes: " reward_1 "
          });
          l.FrameSDK.frameData.sdkFuc.ppEvent(this.adData.isFree ? " freeShow " : " popupShow ");
          l.FrameSDK.openEffect(this);
          l.FrameSDK.playEffect(" rewardshow ");
          this.node.opacity = 255;
          this.titleSkeleton.setAnimation(0, " start ", !1);
          this.titleSkeleton.addAnimation(0, " loop ", !0);
          this.contentSkeleton.setAnimation(0, " start ", !1);
          this.contentSkeleton.addAnimation(0, " loop ", !0);
          this.labelRootNode.children.forEach(function (e, a) {
            var o;
            e.getComponent(cc.Label).string = " x " + (null !== (o = t.timeArray[a]) && void 0 !== o ? o : 1);
          });
          this.multiplierDisplay.active = !1;
          var o = l.FrameSDK.convertCoinToStr(this.getYCoin);
          this.baseCoinLabel.string = o;
          this.maxCoinLabel.string = l.FrameSDK.convertCoinToStr(this.getYCoin * Math.max.apply(Math, this.timeArray));
          this.finalCoinLabel.string = o;
          this.finalCoinNode.opacity = 0;
          this.adFrequencyCounter.string = o;
          this.noAdBadgeIcon.active = this.adData.isFree;
          this.adBadgeIcon.active = !this.adData.isFree;
          this.commonActionButton.active = this.adBadgeIcon.active;
          this.commonActionButton.getComponentInChildren(cc.Label).string = " skey_034 " + l.FrameSDK.convertCoinToStr(a);
          this.ribbonSkeleton.enabled = !1;
          this.zhizhenAin();
        };
        t.prototype.onLoad = function () {
          var e = this;
          this.adBannerButton.on(cc.Node.EventType.TOUCH_END, function () {
            e.click_AD();
          });
          this.commonActionButton.on(cc.Node.EventType.TOUCH_END, function () {
            e.click_Common();
          });
          var t = l.FrameSDK.getNoAdDelayTime();
          null != t && t >= 0 && (this.commonActionButton.getComponent(r.default).dtime += t);
        };
        t.prototype.updataBeiShe = function () {
          var e = l.FrameSDK.convertCoinToStr(this.beishe * this.getYCoin);
          this.baseCoinLabel.string = e;
          this.adFrequencyCounter.string = e;
        };
        t.prototype.click_Common = function () {
          var e = this;
          this.noTouch.node.active = !0;
          var t = s.FrameData.getCoinOutNum(" free ");
          l.FrameSDK.logGameEvent(" thepool_game_rew ", {
            object_action: " show ",
            object_name: " rew_free ",
            object_notes: " reward_1 "
          });
          l.FrameSDK.frameData.sdkFuc.ppEvent(" freeClaim ");
          (function (a) {
            var o,
              n = 0,
              i = 0;
            if (a) {
              n = s.FrameData.getCharityOutNum();
              i = 1;
            }
            l.FrameSDK.addCoin(t, n, i, null === (o = e.viewData) || void 0 === o ? void 0 : o.closeCB);
            l.FrameSDK.frameData.sdkFuc.ppEvent(" freeCollected ");
            e.close();
          })(!1);
        };
        t.prototype.setUi = function () {
          for (var e, t = 0; t < this.sian.childrenCount; t++) {
            var a = this.sian.children[t],
              o = a.getBoundingBox();
            o.y = 0;
            a.active = o.contains(cc.v2(this.pointerIndicator.x, 0));
            a.active && (this.targetIndex = t);
          }
          this.beishe = null !== (e = this.timeArray[this.targetIndex]) && void 0 !== e ? e : 1;
          this.updataBeiShe();
        };
        t.prototype.close = function (e) {
          void 0 === e && (e = null);
          if (Date.now() - this.hideTime <= 300) console.log(" wait ! ! ! ， return ");else {
            this.hideTime = Date.now();
            l.FrameSDK.closeEffect(this, e);
          }
        };
        t.prototype.update = function () {
          this.setUi();
        };
        t.prototype.zhizhenAin = function () {
          this.pointerIndicator.stopAllActions();
          var e = this.pointerIndicator.x,
            t = Math.abs(this.pointerIndicator.x),
            a = Math.abs(2 * this.pointerIndicator.x) / this.speed;
          cc.tween(this.pointerIndicator).to(a, {
            x: t
          }).to(a, {
            x: e
          }).union().repeatForever().start();
        };
        t.prototype.click_AD = function () {
          var e = this;
          l.FrameSDK.frameData.sdkFuc.ppEvent(this.adData.isFree ? " freeClaim " : " claim ");
          l.FrameSDK.logCommonEvent(" c_ad_event ", {
            action: " touch ",
            type: " video ",
            placement: " reward_1 "
          });
          l.FrameSDK.logGameEvent(" thepool_game_rew ", {
            object_action: " show ",
            object_name: " rew_ad ",
            object_notes: " reward_1 "
          });
          this.pointerIndicator.pauseAllActions();
          this.setUi();
          var t = this.getYCoin * this.beishe,
            a = function (a) {
              l.FrameSDK.frameData.sdkFuc.ppEvent(e.adData.isFree ? " freeCollected " : " collected ");
              var o = 0,
                n = 0;
              if (!e.adData.isFree && a) {
                o = s.FrameData.getCharityOutNum();
                n = 1;
              }
              e.multiplierDisplay.active = !0;
              e.multiplierDisplay.children.forEach(function (t) {
                return t.active = t.name == e.beishe.toString();
              });
              e.multiplierDisplay.stopAllActions();
              cc.Tween.stopAllByTarget(e.baseCoinNode);
              cc.tween(e.baseCoinNode).to(.1, {
                x: e.baseCoinNode.x - 200,
                opacity: 0
              }).start();
              cc.Tween.stopAllByTarget(e.maxCoinNode);
              cc.tween(e.maxCoinNode).to(.1, {
                x: e.maxCoinNode.x + 200,
                opacity: 0
              }).start();
              cc.Tween.stopAllByTarget(e.arrowNode);
              cc.tween(e.arrowNode).to(.1, {
                opacity: 0
              }).start();
              cc.Tween.stopAllByTarget(e.finalCoinNode);
              cc.tween(e.finalCoinNode).to(.1, {
                opacity: 255
              }).to(.3, {}, {
                onUpdate: function (a, o) {
                  e.finalCoinLabel.string = l.FrameSDK.convertCoinToStr(e.getYCoin + (t - e.getYCoin) * o);
                }
              }).call(function () {
                return e.finalCoinLabel.string = l.FrameSDK.convertCoinToStr(t);
              }).start();
              cc.tween(e.multiplierDisplay).delay(.1).set({
                scale: 1
              }).to(.2, {
                scale: 3
              }).to(.1, {
                scale: 1
              }).call(function () {
                return l.FrameSDK.playEffect(" rate_show ");
              }).delay(.2).call(function () {
                e.ribbonSkeleton.enabled = !0;
                e.ribbonSkeleton.setAnimation(0, " caidai ", !1);
                l.FrameSDK.playEffect(" pool_cashdone ");
              }).delay(1).call(function () {
                var a;
                l.FrameSDK.addCoin(t, o, n, null === (a = e.viewData) || void 0 === a ? void 0 : a.closeCB);
                e.close();
              }).start();
            };
          this.noTouch.node.active = !0;
          this.adData.isFree ? a(!1) : l.FrameSDK.openVideo(" reward_1 ", !1, function (e) {
            l.FrameSDK.logGameEvent(" thepool_game_ad ", {
              object_action: " show ",
              object_name: " reward_1 ",
              object_notes: " video " === e ? " video " : " web " === e ? " web " : " inter "
            });
          }, function (e) {
            return a(e);
          }, function () {
            e.pointerIndicator.resumeAllActions();
            e.noTouch.node.active = !1;
          }, {
            reward: t,
            isMax: !1
          });
        };
        i([p(sp.Skeleton)], t.prototype, " titleSkeleton ", void 0);
        i([p(sp.Skeleton)], t.prototype, " contentSkeleton ", void 0);
        i([p(cc.Node)], t.prototype, " baseCoinNode ", void 0);
        i([p(cc.Label)], t.prototype, " baseCoinLabel ", void 0);
        i([p(cc.Node)], t.prototype, " arrowNode ", void 0);
        i([p(cc.Node)], t.prototype, " maxCoinNode ", void 0);
        i([p(cc.Label)], t.prototype, " maxCoinLabel ", void 0);
        i([p(cc.Node)], t.prototype, " finalCoinNode ", void 0);
        i([p(cc.Label)], t.prototype, " finalCoinLabel ", void 0);
        i([p(cc.Node)], t.prototype, " labelRootNode ", void 0);
        i([p(cc.Node)], t.prototype, " multiplierDisplay ", void 0);
        i([p(cc.Node)], t.prototype, " pointerIndicator ", void 0);
        i([p(cc.Node)], t.prototype, " adBannerButton ", void 0);
        i([p(cc.Label)], t.prototype, " adFrequencyCounter ", void 0);
        i([p(cc.Node)], t.prototype, " commonActionButton ", void 0);
        i([p(cc.Node)], t.prototype, " sian ", void 0);
        i([p(cc.Node)], t.prototype, " noAdBadgeIcon ", void 0);
        i([p(cc.Node)], t.prototype, " adBadgeIcon ", void 0);
        i([p(sp.Skeleton)], t.prototype, " ribbonSkeleton ", void 0);
        i([c.CLICKLOCK()], t.prototype, " click_AD ", null);
        i([c.CLICKLOCK()], t.prototype, " click_Common ", null);
        return i([d], t);
      }(cc.Component);
    a.default = h;
    cc._RF.pop();
