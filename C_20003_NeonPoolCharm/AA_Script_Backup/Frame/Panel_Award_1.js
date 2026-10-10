let e = require;let t = module;let a = exports;
    "use strict";

    cc._RF.push(t, "199ecuDcEBPaJcPHi2CN54m", "Panel_Award_1");
    var o,
      n = this && this.__extends || (o = function (e, t) {
        return (o = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function (e, t) {
          e.__proto__ = t;
        } || function (e, t) {
          for (var a in t) Object.prototype.hasOwnProperty.call(t, a) && (e[a] = t[a]);
        })(e, t);
      }, function (e, t) {
        o(e, t);
        function a() {
          this.constructor = e;
        }
        e.prototype = null === t ? Object.create(t) : (a.prototype = t.prototype, new a());
      }),
      i = this && this.__decorate || function (e, t, a, o) {
        var n,
          i = arguments.length,
          r = i < 3 ? t : null === o ? o = Object.getOwnPropertyDescriptor(t, a) : o;
        if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) r = Reflect.decorate(e, t, a, o);else for (var c = e.length - 1; c >= 0; c--) (n = e[c]) && (r = (i < 3 ? n(r) : i > 3 ? n(t, a, r) : n(t, a)) || r);
        return i > 3 && r && Object.defineProperty(t, a, r), r;
      };
    Object.defineProperty(a, "__esModule", {
      value: !0
    });
    var r = e("AinanEff.js"),
      c = e("CLICKLOCK.js"),
      s = e("FrameData.js"),
      l = e("FrameSDK.js"),
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
          t.multiplierDisplay = null;
          t.adBannerButton = null;
          t.adFrequencyCounter = null;
          t.noAdBadgeIcon = null;
          t.adBadgeIcon = null;
          t.commonActionButton = null;
          t.ribbonSkeleton = null;
          t.getYCoin = 0;
          t.viewData = null;
          t.adData = null;
          t.hideTime = 0;
          return t;
        }
        t.prototype.onLoad = function () {
          var e = this;
          this.adBannerButton.on(cc.Node.EventType.TOUCH_END, function () {
            e.click_AD();
          }, this);
          this.commonActionButton.on(cc.Node.EventType.TOUCH_END, function () {
            e.click_Common();
          });
          var t = l.FrameSDK.getNoAdDelayTime();
          null != t && t >= 0 && (this.commonActionButton.getComponent(r.default).dtime += t);
        };
        t.prototype.onEnable = function () {
          this.adData = s.FrameData.getOutputConfig(!0);
          this.getYCoin = s.FrameData.getCoinOutNum("ad");
          var e = s.FrameData.getCoinOutNum("free");
          l.FrameSDK.logCommonEvent("c_ad_event", {
            action: "exposure",
            type: "video",
            placement: "reward_2"
          });
          l.FrameSDK.logGameEvent("thepool_game_rew", {
            object_action: "show",
            object_name: "rew_show",
            object_notes: "reward_2"
          });
          l.FrameSDK.frameData.sdkFuc.ppEvent(this.adData.isFree ? "freeShow" : "popupShow");
          l.FrameSDK.openEffect(this);
          l.FrameSDK.playEffect("rewardshow");
          this.node.opacity = 255;
          this.titleSkeleton.setAnimation(0, "start", !1);
          this.titleSkeleton.addAnimation(0, "loop", !0);
          this.contentSkeleton.setAnimation(0, "start", !1);
          this.contentSkeleton.addAnimation(0, "loop", !0);
          this.multiplierDisplay.active = !1;
          this.multiplierDisplay.children.forEach(function (e) {
            cc.Tween.stopAllByTarget(e);
            e.scale = 0;
          });
          var t = l.FrameSDK.convertCoinToStr(this.getYCoin);
          this.baseCoinLabel.string = t;
          this.maxCoinLabel.string = l.FrameSDK.convertCoinToStr(this.getYCoin * this.adData.displayRange[1]);
          this.finalCoinLabel.string = t;
          this.finalCoinNode.opacity = 0;
          this.adFrequencyCounter.string = "x" + this.adData.displayRange[0] + "~" + this.adData.displayRange[1];
          this.noAdBadgeIcon.active = this.adData.isFree;
          this.adBadgeIcon.active = !this.adData.isFree;
          this.commonActionButton.active = this.adBadgeIcon.active;
          this.commonActionButton.getComponentInChildren(cc.Label).string = "skey_034 " + l.FrameSDK.convertCoinToStr(e);
          this.ribbonSkeleton.enabled = !1;
        };
        t.prototype.click_AD = function () {
          var e = this;
          l.FrameSDK.frameData.sdkFuc.ppEvent(this.adData.isFree ? "freeClaim" : "claim");
          l.FrameSDK.logCommonEvent("c_ad_event", {
            action: "touch",
            type: "video",
            placement: "reward_2"
          });
          l.FrameSDK.logGameEvent("thepool_game_rew", {
            object_action: "show",
            object_name: "rew_ad",
            object_notes: "reward_2"
          });
          var t = function (t) {
            e.multiplierDisplay.active = !0;
            cc.Tween.stopAllByTarget(e.multiplierDisplay);
            var a = {},
              o = e.adData.displayRange[0];
            e.multiplierDisplay.children.forEach(function (t) {
              var n = Number(t.name);
              t.scale = 0;
              if (!isNaN(n) && n >= o && n <= e.adData.ml) {
                a[n] = t;
                cc.Tween.stopAllByTarget(t);
              }
            });
            var n = Object.keys(a).map(function (e) {
                return Number(e);
              }).sort(function (e, t) {
                return e - t;
              }),
              i = .1,
              r = .2 * (n.length - 1) + i;
            if (n.length <= 0) r = 0;else if (r > 2) {
              i = Math.max(.1, r - .2 * (n.length - 1));
              r = .2 * (n.length - 1) + i;
            }
            var c = e.getYCoin * e.adData.ml,
              u = 0,
              d = 0;
            if (!e.adData.isFree && t) {
              u = s.FrameData.getCharityOutNum();
              d = 1;
            }
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
            }).to(r + .2, {}, {
              onUpdate: function (t, a) {
                e.finalCoinLabel.string = l.FrameSDK.convertCoinToStr(e.getYCoin + (c - e.getYCoin) * a);
              }
            }).call(function () {
              return e.finalCoinLabel.string = l.FrameSDK.convertCoinToStr(c);
            }).start();
            n.forEach(function (e, t) {
              var o = a[e];
              o.scale = 0;
              cc.tween(o).delay(.1 + .2 * t).set({
                scale: 1
              }).to(.2, {
                scale: 3
              }).to(.1, {
                scale: 1
              }).call(function () {
                return l.FrameSDK.playEffect("rate_show");
              }).start();
            });
            cc.tween(e.multiplierDisplay).delay(.1 + r + .2).call(function () {
              e.ribbonSkeleton.enabled = !0;
              e.ribbonSkeleton.setAnimation(0, "caidai", !1);
              l.FrameSDK.playEffect("pool_cashdone");
            }).delay(1).call(function () {
              var t;
              l.FrameSDK.addCoin(c, u, d, null === (t = e.viewData) || void 0 === t ? void 0 : t.closeCB);
              l.FrameSDK.frameData.sdkFuc.ppEvent(e.adData.isFree ? "freeCollected" : "collected");
              e.close();
            }).start();
          };
          this.noTouch.node.active = !0;
          this.adData.isFree ? t(!1) : l.FrameSDK.openVideo("reward_2", !1, function (e) {
            l.FrameSDK.logGameEvent("thepool_game_ad", {
              object_action: "show",
              object_name: "reward_2",
              object_notes: "video" === e ? "video" : "web" === e ? "web" : "inter"
            });
          }, function (e) {
            return t(e);
          }, function () {
            return e.noTouch.node.active = !1;
          }, {
            reward: this.getYCoin * this.adData.displayRange[1],
            isMax: !0
          });
        };
        t.prototype.click_Common = function () {
          var e = this;
          this.noTouch.node.active = !0;
          var t = s.FrameData.getCoinOutNum("free");
          l.FrameSDK.logGameEvent("thepool_game_rew", {
            object_action: "show",
            object_name: "rew_free",
            object_notes: "reward_2"
          });
          l.FrameSDK.frameData.sdkFuc.ppEvent("freeClaim");
          (function (a) {
            var o,
              n = 0,
              i = 0;
            if (a) {
              n = s.FrameData.getCharityOutNum();
              i = 1;
            }
            l.FrameSDK.addCoin(t, n, i, null === (o = e.viewData) || void 0 === o ? void 0 : o.closeCB);
            l.FrameSDK.frameData.sdkFuc.ppEvent("freeCollected");
            e.close();
          })(!1);
        };
        t.prototype.close = function (e) {
          void 0 === e && (e = null);
          if (Date.now() - this.hideTime <= 300) console.log("wait!!!，return");else {
            this.hideTime = Date.now();
            l.FrameSDK.closeEffect(this, e);
          }
        };
        i([p(sp.Skeleton)], t.prototype, "titleSkeleton", void 0);
        i([p(sp.Skeleton)], t.prototype, "contentSkeleton", void 0);
        i([p(cc.Node)], t.prototype, "baseCoinNode", void 0);
        i([p(cc.Label)], t.prototype, "baseCoinLabel", void 0);
        i([p(cc.Node)], t.prototype, "arrowNode", void 0);
        i([p(cc.Node)], t.prototype, "maxCoinNode", void 0);
        i([p(cc.Label)], t.prototype, "maxCoinLabel", void 0);
        i([p(cc.Node)], t.prototype, "finalCoinNode", void 0);
        i([p(cc.Label)], t.prototype, "finalCoinLabel", void 0);
        i([p(cc.Node)], t.prototype, "multiplierDisplay", void 0);
        i([p(cc.Node)], t.prototype, "adBannerButton", void 0);
        i([p(cc.Label)], t.prototype, "adFrequencyCounter", void 0);
        i([p(cc.Node)], t.prototype, "noAdBadgeIcon", void 0);
        i([p(cc.Node)], t.prototype, "adBadgeIcon", void 0);
        i([p(cc.Node)], t.prototype, "commonActionButton", void 0);
        i([p(sp.Skeleton)], t.prototype, "ribbonSkeleton", void 0);
        i([c.CLICKLOCK()], t.prototype, "click_AD", null);
        i([c.CLICKLOCK()], t.prototype, "click_Common", null);
        return i([d], t);
      }(cc.Component);
    a.default = h;
    cc._RF.pop();
