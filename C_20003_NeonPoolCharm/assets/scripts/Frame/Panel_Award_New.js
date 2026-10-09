let e = require;let t = module;let a = exports;
    "use strict";

    cc._RF.push(t, "8ae713F+BhIA4ORIdl0rCIW", "Panel_Award_New");
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
    var r = e("Frame.js"),
      c = e("Frame.jsData"),
      s = e("Frame.jsSDK"),
      l = cc._decorator,
      u = l.ccclass,
      d = l.property,
      p = function (e) {
        n(t, e);
        function t() {
          var t = null !== e && e.apply(this, arguments) || this;
          t.panel_window = null;
          t.focus = null;
          t.newcommer = null;
          t.superprize = null;
          t.boxNode = null;
          t.front = null;
          t.queen = null;
          t.dialog = null;
          t.dialogLabel = null;
          t.viewData = null;
          t.awardList = [];
          t.isTouch = !1;
          t.hideTime = 0;
          return t;
        }
        t.prototype.boxAin = function (e, t, a, o) {
          var n = this;
          void 0 === a && (a = 1);
          var i = this.boxNode.children[t];
          if (1 == e) {
            var r = cc.v3(i.position);
            cc.tween(i).delay(a).to(.2, {
              scaleX: 0
            }).call(function () {
              cc.find("pai", i).getComponent(cc.Sprite).spriteFrame = n.front;
              cc.find("layout", i).active = !1;
              cc.find("bubble", i).active = !1;
              cc.find("robux3", i).active = !1;
            }).to(.2, {
              scaleX: 1
            }).to(.5, {
              position: cc.v3()
            }).delay(.1).to(.5, {
              position: r
            }).call(function () {
              n.isTouch = !0;
              cc.find("click", i).active = !0;
              o && o();
            }).start();
          } else {
            0 === t && s.FrameSDK.playEffect("newbiereward_show");
            cc.tween(i).delay(a).to(.2, {
              scaleX: 0
            }).call(function () {
              cc.find("pai", i).getComponent(cc.Sprite).spriteFrame = n.queen;
              cc.find("layout", i).active = !0;
              cc.find("robux3", i).active = !0;
            }).to(.2, {
              scaleX: 1
            }).call(function () {
              if (0 === t) {
                var e = cc.find("bubble", i);
                e.scale = .2;
                e.active = !0;
                cc.Tween.stopAllByTarget(e);
                cc.tween(e).to(.2, {
                  scale: 1
                }, {
                  easing: "backOut"
                }).call(function () {
                  cc.tween(e).to(.5, {
                    scale: 1.2
                  }, {
                    easing: "sineInOut"
                  }).to(.5, {
                    scale: 1
                  }, {
                    easing: "sineInOut"
                  }).union().repeatForever().start();
                }).start();
              }
              cc.find("light", i).active = 0 == t;
              cc.find("kamian", i).active = 0 !== t;
              o && o();
            }).start();
          }
        };
        t.prototype.onEnable = function () {
          var e,
            t = this;
          s.FrameSDK.openEffect(this, {
            opacity: 233
          });
          s.FrameSDK.playEffect("newbiepage_show");
          s.FrameSDK.logGameEvent("thepool_game_new", {
            object_action: "show",
            object_name: "new_2"
          }, !0);
          s.FrameSDK.frameData.sdkFuc.earlierStageEvent("guide_button", "guide_start");
          this.focus.opacity = 0;
          this.superprize.node.active = !1;
          this.awardList.length = 0;
          var a = c.FrameData.getCoinOutNum("newFixed");
          if (a && Array.isArray(a) && a.length >= 3) (e = this.awardList).push.apply(e, a);else {
            var o = c.FrameData.getCoinOutNum("newFixed");
            this.awardList.push(c.FrameData.getCoinOutNum("new"), s.FrameSDK.randomInt(o), s.FrameSDK.randomInt(o));
          }
          this.boxNode.children.forEach(function (e, a) {
            e.on(cc.Node.EventType.TOUCH_END, t.openBox.bind(t, a), t);
            cc.find("light", e).active = !1;
            cc.find("layout/label", e).getComponent(cc.Label).string = s.FrameSDK.convertCoinToStr(t.awardList[a]);
            cc.find("bubble", e).active = !1;
            cc.find("bubble/label", e).getComponent(cc.Label).string = s.FrameSDK.convertCoinToStr(t.awardList[a], !0);
            cc.find("click", e).active = !1;
            cc.find("kamian", e).active = !1;
            t.boxAin(1, a, 1.4, 0 === a ? function () {
              t.dialog.active = !0;
              t.dialogLabel.string = "skey_095";
              t.dialogLabel.node.scale = .8;
              cc.Tween.stopAllByTarget(t.dialogLabel.node);
              cc.tween(t.dialogLabel.node).to(.3, {
                scale: 1
              }, {
                easing: "backOut"
              }).start();
            } : void 0);
          });
          this.dialog.active = !1;
          this.dialogLabel.string = "";
          cc.Tween.stopAllByTarget(this.dialogLabel.node);
        };
        t.prototype.onTouchCloseTips = function () {
          if (Date.now() - this.hideTime <= 300) console.log("wait!!!，return");else {
            this.hideTime = Date.now();
            s.FrameSDK.closeEffect(this, null);
          }
        };
        t.prototype.onDisable = function () {
          var e, t;
          null === (t = (e = this.viewData).closeCB) || void 0 === t || t.call(e);
        };
        t.prototype.openBox = function (e) {
          var t = this;
          if (this.isTouch) {
            this.isTouch = !1;
            var a = this.boxNode.children[0],
              o = this.boxNode.children[e],
              n = a.position;
            a.position = o.position;
            o.position = n;
            s.FrameSDK.logGameEvent("thepool_game_new", {
              object_action: "show",
              object_name: "new_3"
            }, !0);
            this.boxNode.children.forEach(function (e) {
              cc.find("click", e).active = !1;
            });
            this.boxAin(0, 0, 0, function () {
              for (var e = 1, a = 1; a < t.boxNode.childrenCount; a++) {
                e += .2;
                t.boxAin(0, a, e);
                if (a == t.boxNode.childrenCount - 1) {
                  cc.Tween.stopAllByTarget(t.dialogLabel.node);
                  cc.tween(t.dialogLabel.node).delay(e + .6).call(function () {
                    s.FrameSDK.playEffect("newbiepage_show");
                    t.dialogLabel.string = "skey_096";
                    t.dialogLabel.node.scale = .8;
                  }).to(.3, {
                    scale: 1
                  }, {
                    easing: "backOut"
                  }).start();
                  t.scheduleOnce(t.playSuperPrize, e + 1);
                }
              }
            });
          }
        };
        t.prototype.playSuperPrize = function () {
          var e = this;
          s.FrameSDK.frameData.sdkFuc.earlierStageEvent("guide_reward", "guide_button");
          this.superprize.node.active = !0;
          this.superprize.setAnimation(0, "start", !1);
          this.superprize.addAnimation(0, "loop", !0);
          cc.tween(this.superprize).delay(3).call(function () {
            s.FrameSDK.logGameEvent("thepool_game_new", {
              object_action: "show",
              object_name: "new_4"
            }, !0);
            s.FrameSDK.addCoin(e.awardList[0], 0, 0, function () {
              r.default.ins.setGuideShow(!0);
            });
            e.onTouchCloseTips();
          }).start();
          var t = this.boxNode.children[0];
          t.parent = this.focus.parent;
          cc.tween(this.focus).to(.5, {
            opacity: 255
          }).start();
          cc.tween(t).to(1, {
            position: cc.v3(),
            scale: 1.5
          }).start();
          cc.tween(this.newcommer).to(.3, {
            scale: 0
          }, {
            easing: "sineIn"
          }).start();
        };
        i([d(cc.Node)], t.prototype, "panel_window", void 0);
        i([d(cc.Node)], t.prototype, "focus", void 0);
        i([d(cc.Node)], t.prototype, "newcommer", void 0);
        i([d(sp.Skeleton)], t.prototype, "superprize", void 0);
        i([d(cc.Node)], t.prototype, "boxNode", void 0);
        i([d(cc.SpriteFrame)], t.prototype, "front", void 0);
        i([d(cc.SpriteFrame)], t.prototype, "queen", void 0);
        i([d(cc.Node)], t.prototype, "dialog", void 0);
        i([d(cc.Label)], t.prototype, "dialogLabel", void 0);
        return i([u], t);
      }(cc.Component);
    a.default = p;
    cc._RF.pop();
