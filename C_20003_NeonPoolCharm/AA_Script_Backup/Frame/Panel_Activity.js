let e = require;let t = module;let a = exports;
    "use strict";

    cc._RF.push(t, "d1227kCbWhPx7a+4u8wM0h6", "Panel_Activity");
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
    var r = e("FrameData.js"),
      c = e("FrameSDK.js"),
      s = cc._decorator,
      l = s.ccclass,
      u = s.property,
      d = function (e) {
        n(t, e);
        function t() {
          var t = null !== e && e.apply(this, arguments) || this;
          t.panel_window = null;
          t.bonusLabel = null;
          t.state1 = null;
          t.countdownLabel = null;
          t.progressSprite = null;
          t.progressLabel = null;
          t.state1Tips = null;
          t.state2 = null;
          t.state2Sprite = null;
          t.state2TitleLabel = null;
          t.state2TipRichText = null;
          t.buttonSprite = null;
          t.buttonLabel = null;
          t.claimBgSpriteFrame = null;
          t.successBgSpriteFrame = null;
          t.failedBgSpriteFrame = null;
          t.normalButtonSpriteFrame = null;
          t.againButtonSpriteFrame = null;
          t.viewData = null;
          t._close_target = null;
          t.hideTime = 0;
          return t;
        }
        a = t;
        t.prototype.onDisable = function () {
          cc.director.emit("UPDATA_ACTIVITY");
          var e, t;
          null === (t = (e = this.viewData).closeCB) || void 0 === t || t.call(e);
        };
        t.prototype.onBtnEvent = function () {
          var e,
            t,
            a,
            o = r.FrameData.FRAME_CONF.PiggyConfig,
            n = r.FrameData.saveData.activity;
          switch (n.state) {
            case 0:
              this.close();
              break;
            case 1:
              c.FrameSDK.logGameEvent("thepool_game_act", {
                object_action: "show",
                object_name: "pig_get",
                object_notes: "" + ((null !== (e = n.index) && void 0 !== e ? e : 0) + 1)
              }, !0);
              c.FrameSDK.addCoin(o.num, 0, 0);
              n.state = 2;
              this.close();
              break;
            default:
              n.state = 0;
              n.coin = 0;
              n.time = c.FrameSDK.now + r.FrameData.FRAME_CONF.PiggyConfig.time;
              n.index = (null !== (t = n.index) && void 0 !== t ? t : 0) + 1;
              c.FrameSDK.logGameEvent("thepool_game_act", {
                object_action: "show",
                object_name: "pig_start",
                object_notes: "" + ((null !== (a = n.index) && void 0 !== a ? a : 0) + 1)
              }, !0);
              this.updateUi();
              this.schedule(this.updateTime);
              c.FrameSDK.openEffect(this);
          }
        };
        t.isAcitiviyClaimable = function () {
          var e;
          return 1 === (null === (e = r.FrameData.saveData.activity) || void 0 === e ? void 0 : e.state);
        };
        t.startActivity = function (e) {
          r.FrameData.saveData.activity ? c.FrameSDK.openWindow("Panel_Activity", {
            closeCB: e
          }) : c.FrameSDK.frameData.gameData.passLevel >= r.FrameData.FRAME_CONF.bankLevel ? c.FrameSDK.openWindow("Panel_ActivityGuide", {
            type: 1,
            logoType: "bank",
            dtime: 2.5,
            text: 'skey_065??&value1==<color = #FF5148>1</c>&value2==<img src="dollar4"/><color = #FDFF48>' + c.FrameSDK.convertCoinToStr(r.FrameData.FRAME_CONF.PiggyConfig.num) + "</c>",
            closeCB: function () {
              c.FrameSDK.openWindow("Panel_Activity", {
                closeCB: e
              });
            }
          }) : null == e || e();
        };
        t.addCoin = function (e) {
          var t;
          if (a.isActivityCollectable()) {
            var o = r.FrameData.saveData.activity.coin;
            r.FrameData.saveData.activity.coin += e;
            if (r.FrameData.saveData.activity.coin >= r.FrameData.FRAME_CONF.PiggyConfig.num) {
              r.FrameData.saveData.activity.coin = r.FrameData.FRAME_CONF.PiggyConfig.num;
              c.FrameSDK.logGameEvent("thepool_game_act", {
                object_action: "show",
                object_name: "pig_full",
                object_notes: "" + ((null !== (t = r.FrameData.saveData.activity.index) && void 0 !== t ? t : 0) + 1)
              }, !0);
              r.FrameData.saveData.activity.state = 1;
            } else r.FrameData.saveData.activity.coin < 0 && (r.FrameData.saveData.activity.coin = 0);
            cc.director.emit("UPDATA_ACTIVITY_COIN", e, o, r.FrameData.saveData.activity.coin);
          }
        };
        t.prototype.onEnable = function () {
          c.FrameSDK.openEffect(this);
          c.FrameSDK.playEffect("page_show");
          cc.director.emit("UPDATA_ACTIVITY");
          var e = c.FrameSDK.convertCoinToStr(r.FrameData.FRAME_CONF.PiggyConfig.num);
          this.bonusLabel.string = e;
          this.state1Tips.string = 'skey_113??&value1==<img src="dollar4" offset=-5/> <size=36><color = #FDFF48>' + e + "</c></size>";
          this.updateUi();
        };
        t.prototype.onLoad = function () {
          this._close_target = a.coinTarget;
          if (!r.FrameData.saveData.activity) {
            r.FrameData.saveData.activity = {
              state: 0,
              coin: 0,
              time: c.FrameSDK.now + r.FrameData.FRAME_CONF.PiggyConfig.time,
              index: 0
            };
            c.FrameSDK.logGameEvent("thepool_game_act", {
              object_action: "show",
              object_name: "pig_start",
              object_notes: "1"
            }, !0);
          }
          0 === r.FrameData.saveData.activity.state && c.FrameSDK.now < r.FrameData.saveData.activity.time && this.schedule(this.updateTime);
        };
        t.prototype.onTestEvent = function (e, t) {
          if ("0" == t) r.FrameData.saveData.activity.time = c.FrameSDK.now + 1;else if ("1" == t) {
            a.addCoin(r.FrameData.FRAME_CONF.PiggyConfig.num);
            this.updateUi();
          }
        };
        t.prototype.updateUi = function () {
          var e,
            t,
            a = r.FrameData.FRAME_CONF.PiggyConfig,
            o = r.FrameData.saveData.activity,
            n = c.FrameSDK.convertCoinToStr(a.num);
          if (0 === o.state) if (o.coin >= a.num) {
            c.FrameSDK.logGameEvent("thepool_game_act", {
              object_action: "show",
              object_name: "pig_full",
              object_notes: "" + ((null !== (e = o.index) && void 0 !== e ? e : 0) + 1)
            }, !0);
            o.state = 1;
          } else if (c.FrameSDK.now >= r.FrameData.saveData.activity.time) {
            c.FrameSDK.logGameEvent("thepool_game_act", {
              object_action: "show",
              object_name: "pig_fail",
              object_notes: "" + ((null !== (t = o.index) && void 0 !== t ? t : 0) + 1)
            }, !0);
            o.state = 3;
          }
          this.state1.active = 0 === o.state;
          this.state2.active = !this.state1.active;
          switch (o.state) {
            case 0:
              this.progressSprite.fillRange = o.coin / a.num;
              this.progressLabel.string = c.FrameSDK.convertCoinToStr(o.coin) + "/" + n;
              this.buttonSprite.spriteFrame = this.normalButtonSpriteFrame;
              this.buttonLabel.string = "skey_061";
              break;
            case 1:
              this.state2Sprite.spriteFrame = this.claimBgSpriteFrame;
              this.state2TitleLabel.string = "skey_114";
              this.state2TipRichText.string = 'skey_115??&value1==<img src="dollar4" offset=-5/> <size=36><color= #FFF379><size=36>' + n + "</size></color>";
              this.buttonSprite.spriteFrame = this.normalButtonSpriteFrame;
              this.buttonLabel.string = "skey_035";
              break;
            case 2:
              this.state2Sprite.spriteFrame = this.successBgSpriteFrame;
              this.state2TitleLabel.string = "skey_116";
              this.state2TipRichText.string = "skey_117";
              this.buttonSprite.spriteFrame = this.againButtonSpriteFrame;
              this.buttonLabel.string = "skey_120";
              break;
            default:
              this.state2Sprite.spriteFrame = this.failedBgSpriteFrame;
              this.state2TitleLabel.string = "skey_118";
              this.state2TipRichText.string = 'skey_119??&value1==<img src="dollar4" offset=-5/> <size=36><color= #FFF379><size=36>' + n + "</size></color>";
              this.buttonSprite.spriteFrame = this.againButtonSpriteFrame;
              this.buttonLabel.string = "skey_121";
          }
        };
        t.onLogin = function (e) {
          r.FrameData.saveData.activity && !this.isActivityCollectable() ? c.FrameSDK.openWindow("Panel_Activity", {
            closeCB: e
          }) : null == e || e();
        };
        t.prototype.close = function () {
          if (Date.now() - this.hideTime <= 300) console.log("wait!!!，return");else {
            this.hideTime = Date.now();
            c.FrameSDK.closeEffect(this, null);
          }
        };
        t.prototype.updateTime = function () {
          var e;
          if (r.FrameData.saveData.activity) {
            var t = r.FrameData.saveData.activity.time - c.FrameSDK.now;
            if (t > 0) {
              var a = c.FrameSDK.formatSeconds3(t);
              this.countdownLabel.string = a.hour + ":" + a.minute + ":" + a.second;
            } else {
              c.FrameSDK.logGameEvent("thepool_game_act", {
                object_action: "show",
                object_name: "pig_fail",
                object_notes: "" + ((null !== (e = r.FrameData.saveData.activity.index) && void 0 !== e ? e : 0) + 1)
              }, !0);
              r.FrameData.saveData.activity.state = 3;
              this.updateUi();
              this.unschedule(this.updateTime);
            }
          } else this.unschedule(this.updateTime);
        };
        t.isActivityCollectable = function () {
          return r.FrameData.saveData.activity && 0 == r.FrameData.saveData.activity.state && c.FrameSDK.now < r.FrameData.saveData.activity.time;
        };
        var a;
        t.coinTarget = null;
        i([u(cc.Node)], t.prototype, "panel_window", void 0);
        i([u(cc.Label)], t.prototype, "bonusLabel", void 0);
        i([u(cc.Node)], t.prototype, "state1", void 0);
        i([u(cc.Label)], t.prototype, "countdownLabel", void 0);
        i([u(cc.Sprite)], t.prototype, "progressSprite", void 0);
        i([u(cc.Label)], t.prototype, "progressLabel", void 0);
        i([u(cc.RichText)], t.prototype, "state1Tips", void 0);
        i([u(cc.Node)], t.prototype, "state2", void 0);
        i([u(cc.Sprite)], t.prototype, "state2Sprite", void 0);
        i([u(cc.Label)], t.prototype, "state2TitleLabel", void 0);
        i([u(cc.RichText)], t.prototype, "state2TipRichText", void 0);
        i([u(cc.Sprite)], t.prototype, "buttonSprite", void 0);
        i([u(cc.Label)], t.prototype, "buttonLabel", void 0);
        i([u(cc.SpriteFrame)], t.prototype, "claimBgSpriteFrame", void 0);
        i([u(cc.SpriteFrame)], t.prototype, "successBgSpriteFrame", void 0);
        i([u(cc.SpriteFrame)], t.prototype, "failedBgSpriteFrame", void 0);
        i([u(cc.SpriteFrame)], t.prototype, "normalButtonSpriteFrame", void 0);
        i([u(cc.SpriteFrame)], t.prototype, "againButtonSpriteFrame", void 0);
        return a = i([l], t);
      }(cc.Component);
    a.default = d;
    cc._RF.pop();
