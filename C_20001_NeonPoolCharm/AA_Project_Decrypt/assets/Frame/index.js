window.__require = function e(t, a, o) {
  function n(r, c) {
    if (!a[r]) {
      if (!t[r]) {
        var s = r.split("/");
        s = s[s.length - 1];
        if (!t[s]) {
          var l = "function" == typeof __require && __require;
          if (!c && l) return l(s, !0);
          if (i) return i(s, !0);
          throw new Error("Cannot find module '" + r + "'");
        }
        r = s;
      }
      var u = a[r] = {
        exports: {}
      };
      t[r][0].call(u.exports, function (e) {
        return n(t[r][1][e] || e);
      }, u, u.exports, e, t, a, o);
    }
    return a[r].exports;
  }
  for (var i = "function" == typeof __require && __require, r = 0; r < o.length; r++) n(o[r]);
  return n;
}({
  AinanEff: [function (e, t, a) {
    "use strict";

    cc._RF.push(t, "0ac3bXudTBINq8G8snhFTCO", "AinanEff");
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
    var r = cc._decorator,
      c = r.ccclass,
      s = r.property,
      l = function (e) {
        n(t, e);
        function t() {
          var t = null !== e && e.apply(this, arguments) || this;
          t.dtime = .2;
          t.stime = .2;
          t.isHuXI = !1;
          t.showScale = .2;
          t.tween = null;
          return t;
        }
        t.prototype.onEnable = function () {
          var e = this;
          this.tween && this.tween.stop();
          this.tween = cc.tween(this.node).hide().set({
            scaleX: this.showScale,
            scaleY: this.showScale
          }).delay(this.dtime).show().to(this.stime, {
            scaleX: 1,
            scaleY: 1
          }, {
            easing: "backOut"
          }).call(function () {
            e.isHuXI ? cc.tween(e.node).to(.5, {
              scale: 1.1
            }, {
              easing: "sineInOut"
            }).to(.5, {
              scale: 1
            }, {
              easing: "sineInOut"
            }).union().repeatForever().start() : e.tween = null;
          }).start();
        };
        i([s], t.prototype, "dtime", void 0);
        i([s], t.prototype, "stime", void 0);
        i([s], t.prototype, "isHuXI", void 0);
        i([s], t.prototype, "showScale", void 0);
        return i([c], t);
      }(cc.Component);
    a.default = l;
    cc._RF.pop();
  }, {}],
  BadgeEff: [function (e, t, a) {
    "use strict";

    cc._RF.push(t, "9da18xTdDtCX5hXluW5w1sO", "BadgeEff");
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
    var r = cc._decorator,
      c = r.ccclass,
      s = r.property,
      l = function (e) {
        n(t, e);
        function t() {
          var t = null !== e && e.apply(this, arguments) || this;
          t.cycleTime = 1;
          t.angle = 20;
          t.offsetY = 5;
          t.tween = null;
          return t;
        }
        t.prototype.onLoad = function () {
          this.tween && this.tween.stop();
          var e = this.node.y,
            t = this.cycleTime / 4;
          this.node.angle = -this.angle;
          this.tween = cc.tween(this.node).to(t, {
            y: {
              value: e + 5,
              easing: "sineInOut"
            },
            angle: 0
          }).to(t, {
            y: {
              value: e,
              easing: "sineInOut"
            },
            angle: this.angle
          }).to(t, {
            y: {
              value: e + 5,
              easing: "sineInOut"
            },
            angle: 0
          }).to(t, {
            y: {
              value: e,
              easing: "sineInOut"
            },
            angle: -this.angle
          }).union().repeatForever().start();
        };
        i([s], t.prototype, "cycleTime", void 0);
        i([s], t.prototype, "angle", void 0);
        i([s], t.prototype, "offsetY", void 0);
        return i([c], t);
      }(cc.Component);
    a.default = l;
    cc._RF.pop();
  }, {}],
  BottomTips: [function (e, t, a) {
    "use strict";

    cc._RF.push(t, "36be0rUSHhJBp84V65cLSHB", "BottomTips");
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
    var r = e("./FrameData"),
      c = e("./RDM_Level"),
      s = cc._decorator,
      l = s.ccclass,
      u = s.property,
      d = function (e) {
        n(t, e);
        function t() {
          var t = null !== e && e.apply(this, arguments) || this;
          t.rootNode = null;
          return t;
        }
        t.prototype.hasQuest = function () {
          for (var e = 0; e < r.FrameData.FRAME_CONF.CoinConf.length; e++) if (c.default.getData(r.FrameData.FRAME_CONF.CoinConf[e].rdm_id).status <= 3) return !0;
          return !1;
        };
        t.prototype.updateCardUI = function () {
          this.node.opacity = this.hasQuest() ? 255 : 0;
        };
        t.prototype.onEnable = function () {
          this.updateCardUI();
          this.rootNode.y = -this.node.height;
          cc.Tween.stopAllByTarget(this.rootNode);
          cc.tween(this.rootNode).delay(1).to(.2, {
            y: 0
          }, {
            easing: "sineOut"
          }).start();
        };
        t.prototype.onLoad = function () {
          this.node.opacity = 0;
        };
        i([u(cc.Node)], t.prototype, "rootNode", void 0);
        return i([l], t);
      }(cc.Component);
    a.default = d;
    cc._RF.pop();
  }, {
    "./FrameData": "FrameData",
    "./RDM_Level": "RDM_Level"
  }],
  Button_Activity: [function (e, t, a) {
    "use strict";

    cc._RF.push(t, "d6557CC4r1O/I3rLAD53b5W", "Button_Activity");
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
    var r = e("./CLICKLOCK"),
      c = e("./FrameData"),
      s = e("./FrameSDK"),
      l = e("./Panel_Activity"),
      u = cc._decorator,
      d = u.ccclass,
      p = u.property,
      h = function (e) {
        n(t, e);
        function t() {
          var t = null !== e && e.apply(this, arguments) || this;
          t.titleLabel = null;
          t.progressRichText = null;
          t.point = null;
          t.addNode = null;
          t.but = null;
          t._buttonOriginalPositionY = 0;
          return t;
        }
        t.prototype.onLoad = function () {
          this._buttonOriginalPositionY = this.but.position.y;
          this.addNode.active = !1;
          l.default.coinTarget = this.but;
          cc.director.on("UPDATA_ACTIVITY", this.updateUI, this);
          cc.director.on("UPDATA_ACTIVITY_COIN", this.updateCoin, this);
          this.titleLabel.string = s.FrameSDK.convertCoinToStr(c.FrameData.FRAME_CONF.PiggyConfig.num, !0);
          this.updateUI();
        };
        t.prototype.updateCoin = function (e, t, a) {
          var o = this;
          this.addNode.active = !0;
          this.addNode.getComponentInChildren(cc.Label).string = "+" + s.FrameSDK.convertCoinToStr(e);
          this.addNode.stopAllActions();
          this.addNode.opacity = 255;
          this.addNode.y = 0;
          cc.Tween.stopAllByTarget(this.addNode);
          cc.tween(this.addNode).to(1, {
            y: 25
          }, {
            onUpdate: function (e, n) {
              o._updateProgress(cc.misc.lerp(t, a, n));
            }
          }).call(function () {
            o._updateProgress(a);
          }).to(.5, {
            opacity: 0
          }).call(function () {
            o.addNode.active = !1;
            o.point.opacity = l.default.isAcitiviyClaimable() ? 255 : 0;
          }).start();
        };
        t.prototype._updateProgress = function (e) {
          this.progressRichText.string = "<outline color= #9C22C5 width=2><color=#86FF04>" + s.FrameSDK.convertCoinToStr(e) + "</c>/" + s.FrameSDK.convertCoinToStr(c.FrameData.FRAME_CONF.PiggyConfig.num) + "</outline>";
        };
        t.prototype.onDestroy = function () {
          cc.director.removeAll(this);
        };
        t.prototype.updateUI = function () {
          var e = s.FrameSDK.frameData.gameData.currentScene,
            t = c.FrameData.saveData.activity;
          this.but.setPosition(0, this._buttonOriginalPositionY + ("game" === e ? 107 : 0));
          this.but.scale = "game" === e ? .8 : 1;
          if (t) {
            this.but.opacity = "home" === e || "game" === e ? 255 : 0;
            this.progressRichText.node.parent.active = l.default.isActivityCollectable() || l.default.isAcitiviyClaimable();
            this._updateProgress(t.coin);
            this.point.opacity = l.default.isAcitiviyClaimable() ? 255 : 0;
          } else {
            this.but.opacity = 0;
            this.point.opacity = 0;
          }
        };
        t.prototype.onBtnEvent = function () {
          l.default.startActivity();
        };
        i([p(cc.Label)], t.prototype, "titleLabel", void 0);
        i([p(cc.RichText)], t.prototype, "progressRichText", void 0);
        i([p(cc.Node)], t.prototype, "point", void 0);
        i([p(cc.Node)], t.prototype, "addNode", void 0);
        i([p(cc.Node)], t.prototype, "but", void 0);
        i([r.CLICKLOCK()], t.prototype, "onBtnEvent", null);
        return i([d], t);
      }(cc.Component);
    a.default = h;
    cc._RF.pop();
  }, {
    "./CLICKLOCK": "CLICKLOCK",
    "./FrameData": "FrameData",
    "./FrameSDK": "FrameSDK",
    "./Panel_Activity": "Panel_Activity"
  }],
  Button_SuperReward: [function (e, t, a) {
    "use strict";

    cc._RF.push(t, "c4dd1PZdeFLlqxD8KNCjk2C", "Button_SuperReward");
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
    var r = e("./CLICKLOCK"),
      c = e("./FrameData"),
      s = e("./FrameSDK"),
      l = e("./Panel_SuperReward"),
      u = cc._decorator,
      d = u.ccclass,
      p = u.property,
      h = function (e) {
        n(t, e);
        function t() {
          var t = null !== e && e.apply(this, arguments) || this;
          t.titleLabel = null;
          t.point = null;
          t.but = null;
          t._buttonOriginalPositionY = 0;
          return t;
        }
        t.prototype.onLoad = function () {
          this._buttonOriginalPositionY = this.but.position.y;
          cc.director.on("UPDATA_SUPER_REWARD", this.updateUI, this);
          l.default.coinTarget = this.but;
          this.titleLabel.string = s.FrameSDK.convertCoinToStr(c.FrameData.FRAME_CONF.SuperRewardConfig.extraRewardDisplay, !0);
          this.updateUI();
        };
        t.prototype.onDestroy = function () {
          cc.director.removeAll(this);
        };
        t.prototype.updateUI = function () {
          this.node.scale = s.FrameSDK.frameData.gameData.noProfitAd || !c.FrameData.FRAME_CONF.superRewardEnabled ? 0 : 1;
          var e = s.FrameSDK.frameData.gameData.currentScene,
            t = c.FrameData.saveData.superReward;
          this.but.setPosition(0, this._buttonOriginalPositionY + ("game" === e ? 282 : 0));
          this.but.scale = "game" === e ? .8 : 1;
          if (t) {
            this.but.opacity = "home" === e || "game" === e ? 255 : 0;
            this.point.opacity = l.default.hasTaskOrReward() ? 255 : 0;
          } else {
            this.but.opacity = 0;
            this.point.opacity = 0;
          }
        };
        t.prototype.onBtnEvent = function () {
          l.default.startSuperReward();
        };
        i([p(cc.Label)], t.prototype, "titleLabel", void 0);
        i([p(cc.Node)], t.prototype, "point", void 0);
        i([p(cc.Node)], t.prototype, "but", void 0);
        i([r.CLICKLOCK()], t.prototype, "onBtnEvent", null);
        return i([d], t);
      }(cc.Component);
    a.default = h;
    cc._RF.pop();
  }, {
    "./CLICKLOCK": "CLICKLOCK",
    "./FrameData": "FrameData",
    "./FrameSDK": "FrameSDK",
    "./Panel_SuperReward": "Panel_SuperReward"
  }],
  Button_Task: [function (e, t, a) {
    "use strict";

    cc._RF.push(t, "a966ep7w7xGdaugn8VUtNR3", "Button_Task");
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
    var r = e("./CLICKLOCK"),
      c = e("./FrameData"),
      s = e("./FrameSDK"),
      l = e("./Panel_Task"),
      u = cc._decorator,
      d = u.ccclass,
      p = u.property,
      h = function (e) {
        n(t, e);
        function t() {
          var t = null !== e && e.apply(this, arguments) || this;
          t.point = null;
          t.but = null;
          return t;
        }
        t.prototype.onLoad = function () {
          cc.director.on("UPDATA_LEVEL", this.updateUI, this);
          cc.director.on("UPDATA_TASK", this.updateUI, this);
          l.default.coinTarget = this.but;
          this.updateUI();
        };
        t.prototype.onBtnEvent = function () {
          l.default.startTask();
        };
        t.prototype.onDestroy = function () {
          cc.director.removeAll(this);
        };
        t.prototype.updateUI = function () {
          this.but.active = Boolean(c.FrameData.saveData.lvAwardinfo) && "home" === s.FrameSDK.frameData.gameData.currentScene;
          this.point.opacity = l.default.isTaskFinish() ? 255 : 0;
        };
        i([p(cc.Node)], t.prototype, "point", void 0);
        i([p(cc.Node)], t.prototype, "but", void 0);
        i([r.CLICKLOCK()], t.prototype, "onBtnEvent", null);
        return i([d], t);
      }(cc.Component);
    a.default = h;
    cc._RF.pop();
  }, {
    "./CLICKLOCK": "CLICKLOCK",
    "./FrameData": "FrameData",
    "./FrameSDK": "FrameSDK",
    "./Panel_Task": "Panel_Task"
  }],
  CLICKLOCK: [function (e, t, a) {
    "use strict";

    cc._RF.push(t, "0f8f5RQn5JF2oytopeur4Nn", "CLICKLOCK");
    Object.defineProperty(a, "__esModule", {
      value: !0
    });
    a.CLICKLOCK = void 0;
    a.CLICKLOCK = function (e) {
      void 0 === e && (e = .5);
      return function (t, a, o) {
        var n = o.value,
          i = !1;
        o.value = function () {
          for (var t = [], o = 0; o < arguments.length; o++) t[o] = arguments[o];
          if (i) console.log("跳过了", this.name, a);else {
            i = !0;
            setTimeout(function () {
              i = !1;
            }, 1e3 * e);
            n.apply(this, t);
          }
        };
        return o;
      };
    };
    cc._RF.pop();
  }, {}],
  CashFishCredit: [function (e, t, a) {
    "use strict";

    cc._RF.push(t, "268b8flbGNE46mMJoHtrdvj", "CashFishCredit");
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
    var r = e("./Frame"),
      c = e("./FrameData"),
      s = e("./FrameSDK"),
      l = cc._decorator,
      u = l.ccclass,
      d = l.property,
      p = function (e) {
        n(t, e);
        function t() {
          var t = null !== e && e.apply(this, arguments) || this;
          t.creditNum = null;
          t.addNode = null;
          t.addNum = null;
          t.typs = "yellowCoin";
          t.prefix = "";
          t.data = {
            num: 0
          };
          return t;
        }
        a = t;
        t.prototype.updatecredit = function (e) {
          var t = this;
          if (e.type == this.typs && cc.isValid(this.addNode)) {
            var a = "yellowCoin" === e.type ? s.FrameSDK.convertCoinToStr : s.FrameSDK.convertCharityToStr;
            cc.Tween.stopAllByTarget(this.data);
            if (e.change > 0) {
              this.addNode.active = !0;
              this.addNode.scale = 0;
              this.addNum.string = "+" + a.call(s.FrameSDK, e.change);
              cc.tween(this.addNode).to(.1, {
                scale: 1
              }).start();
            }
            cc.tween(this.data).to(.5, {
              num: e.num
            }, {
              progress: function (e, a, o, n) {
                var i = e + (a - e) * n;
                cc.isValid(t.node) && t.updatecreditString(i);
                return i;
              }
            }).call(function () {
              if (cc.isValid(t.node)) {
                t.data.num = e.num;
                t.addNode.active = !1;
                t.updatecreditString(t.data.num);
              }
            }).start();
          }
        };
        t.getTarget = function (e) {
          if (1 == this._targets.length) return this._targets[0];
          for (var t = this._targets.length - 1; t >= 0; t--) if (this._targets[t].getComponent(a).typs == e) {
            var o = this._targets[t].getBoundingBoxToWorld();
            if (cc.rect(0, 0, cc.winSize.width, cc.winSize.height).containsRect(o)) return this._targets[t];
          }
          return this._targets[this._targets.length - 1] || this._targets[this._targets.length - 1];
        };
        t.prototype.openRedeem = function () {
          if ("yellowCoin" == this.typs) {
            s.FrameSDK.openPanel_Yellow();
            if (0 == c.FrameData.saveData.guideInedx) {
              c.FrameData.saveData.guideInedx++;
              r.default.ins.setGuideShow(!1);
            }
          } else {
            s.FrameSDK.openPanel_Charity();
            if (0 == c.FrameData.saveData.charityGuideIndex) {
              c.FrameData.saveData.charityGuideIndex++;
              r.default.ins.setGuide2Show(!1);
            }
          }
        };
        t.prototype.onDestroy = function () {
          cc.director.removeAll(this);
          a._targets.splice(a._targets.indexOf(this.node), 1);
        };
        t.prototype.onLoad = function () {
          cc.director.on("UNLOCK_CHARITY", this._onUnlockCharity, this);
          null == this.creditNum && (this.creditNum = this.getComponent(cc.Label) || this.getComponentInChildren(cc.Label));
          this.addNode && (this.addNode.active = !1);
          this.data.num = c.FrameData.saveData.credit[this.typs];
          this.updatecreditString();
          s.FrameSDK.addCreditListen(this.updatecredit, this);
          a._targets.push(this.node);
          this.updateUI();
        };
        t.prototype.getcreditString = function (e) {
          var t = "yellowCoin" === this.typs ? s.FrameSDK.convertCoinToStr(e) : s.FrameSDK.convertCharityToStr(e);
          return this.prefix + t;
        };
        t.isUnlocked = function (e) {
          return "yellowCoin" === e || ("greenCoin" === e ? !s.FrameSDK.frameData.gameData.noProfitAd && s.FrameSDK.frameData.gameData.passLevel >= c.FrameData.FRAME_CONF.charityLevel && c.FrameData.saveData.charityGuideIndex > 0 : void 0);
        };
        t.prototype.updateUI = function () {
          var e = s.FrameSDK.frameData.gameData.currentScene;
          this.node.active = ("home" === e || "game" === e) && a.isUnlocked(this.typs);
        };
        t.prototype._onUnlockCharity = function () {
          "greenCoin" !== this.typs || s.FrameSDK.frameData.gameData.noProfitAd || (this.node.active = !0);
        };
        t.prototype.updatecreditString = function (e) {
          e = null == e ? this.data.num : e;
          this.creditNum.string = this.getcreditString(e);
        };
        var a;
        t._targets = [];
        i([d(cc.Label)], t.prototype, "creditNum", void 0);
        i([d(cc.Node)], t.prototype, "addNode", void 0);
        i([d(cc.Label)], t.prototype, "addNum", void 0);
        i([d()], t.prototype, "typs", void 0);
        i([d()], t.prototype, "prefix", void 0);
        return a = i([u], t);
      }(cc.Component);
    a.default = p;
    cc._RF.pop();
  }, {
    "./Frame": "Frame",
    "./FrameData": "FrameData",
    "./FrameSDK": "FrameSDK"
  }],
  FlyingBonus: [function (e, t, a) {
    "use strict";

    cc._RF.push(t, "a0da2oorBNPbo0M8j/T4BZz", "FlyingBonus");
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
    var r = e("./FrameData"),
      c = e("./FrameSDK"),
      s = cc._decorator,
      l = s.ccclass,
      u = s.property,
      d = function (e) {
        n(t, e);
        function t() {
          var t = null !== e && e.apply(this, arguments) || this;
          t.numLabel = null;
          t._available = !1;
          t._cachedPosition1 = cc.v3();
          t._cachedPosition2 = cc.v3();
          return t;
        }
        a = t;
        t.prototype.onLoad = function () {
          cc.director.on("SHOW_FLYING_BONUS", this._startFly, this);
          cc.director.on("HIDE_FLYING_BONUS", this._stopFly, this);
          this.node.opacity = 0;
        };
        t.prototype.onDestroy = function () {
          cc.director.removeAll(this);
        };
        t.prototype.onEnable = function () {
          this._startFly();
        };
        t.prototype._startFly = function () {
          var e = this;
          if (!c.FrameSDK.frameData.gameData.noProfitAd) {
            var t = c.FrameSDK.frameData.gameData.currentScene;
            if ("home" === t || "game" === t) {
              var o = c.FrameSDK.frameData.gameData.passLevel;
              if (!(o < r.FrameData.FRAME_CONF.flyingBonusLevel || r.FrameData.saveData.flyingBonusIndex >= o && a._sceneLoadedRecord[t])) {
                a._sceneLoadedRecord[t] = !0;
                if (!this._available) {
                  c.FrameSDK.logCommonEvent("c_ad_event", {
                    action: "exposure",
                    type: "video",
                    placement: "fly_sup"
                  });
                  this._available = !0;
                  this.numLabel.string = "" + c.FrameSDK.convertCoinToStr(r.FrameData.getCoinOutNum("flyingBonus"));
                  this.scheduleOnce(function () {
                    c.FrameSDK.logGameEvent("thepool_game_rew", {
                      object_action: "show",
                      object_name: "fly_sup"
                    });
                    e.node.on(cc.Node.EventType.TOUCH_END, e._onClick, e);
                    e._cachedPosition1.x = 0;
                    e._cachedPosition1.y = 200;
                    e._cachedPosition1.z = 0;
                    e.node.parent.convertToNodeSpaceAR(e._cachedPosition1, e._cachedPosition1);
                    e._cachedPosition2.x = cc.winSize.width;
                    e._cachedPosition2.y = cc.winSize.height - 300;
                    e._cachedPosition2.z = 0;
                    e.node.parent.convertToNodeSpaceAR(e._cachedPosition2, e._cachedPosition2);
                    var t = e._cachedPosition1.x + e.node.width * e.node.anchorX,
                      a = e._cachedPosition2.y + e.node.height * e.node.anchorY,
                      o = e._cachedPosition2.x - e.node.width * (1 - e.node.anchorX),
                      n = e._cachedPosition1.y - e.node.height * (1 - e.node.anchorY),
                      i = (n - a) / 5;
                    cc.Tween.stopAllByTarget(e.node);
                    cc.tween(e.node).set({
                      x: t - e.node.width,
                      y: a,
                      opacity: 255
                    }).to(4, {
                      x: {
                        value: o,
                        easing: "sineInOut"
                      },
                      y: a + i
                    }).to(4, {
                      x: {
                        value: t,
                        easing: "sineInOut"
                      },
                      y: a + 2 * i
                    }).to(4, {
                      x: {
                        value: o,
                        easing: "sineInOut"
                      },
                      y: a + 3 * i
                    }).to(4, {
                      x: {
                        value: t,
                        easing: "sineInOut"
                      },
                      y: a + 4 * i
                    }).to(4, {
                      x: {
                        value: o + e.node.width,
                        easing: "sineInOut"
                      },
                      y: n
                    }).union().repeatForever().start();
                  });
                }
              }
            }
          }
        };
        t.prototype._stopFly = function () {
          this._available = !1;
          this.node.opacity = 0;
          cc.Tween.stopAllByTarget(this.node);
        };
        t.prototype._onClick = function () {
          if (this._available) {
            this._available = !1;
            this.node.off(cc.Node.EventType.TOUCH_END, this._onClick, this);
            c.FrameSDK.logCommonEvent("c_ad_event", {
              action: "touch",
              type: "video",
              placement: "fly_sup"
            });
            c.FrameSDK.logGameEvent("thepool_game_rew", {
              object_action: "click",
              object_name: "fly_sup"
            });
            cc.Tween.stopAllByTarget(this.node);
            this.node.opacity = 0;
            r.FrameData.saveData.flyingBonusIndex = c.FrameSDK.frameData.gameData.passLevel;
            var e = r.FrameData.getCoinOutNum("flyingBonus");
            c.FrameSDK.openVideo("fly_sup", !1, function (e) {
              c.FrameSDK.logGameEvent("thepool_game_ad", {
                object_action: "show",
                object_name: "fly_sup",
                object_notes: "video" === e ? "video" : "web" === e ? "web" : "inter"
              });
            }, function (t) {
              var a = 0,
                o = 0;
              if (t) {
                a = r.FrameData.getCharityOutNum();
                o = 1;
              }
              c.FrameSDK.addCoin(e, a, o);
            }, void 0, {
              reward: e,
              isMax: !1
            });
          }
        };
        var a;
        t._sceneLoadedRecord = {};
        i([u(cc.Label)], t.prototype, "numLabel", void 0);
        return a = i([l], t);
      }(cc.Component);
    a.default = d;
    cc._RF.pop();
  }, {
    "./FrameData": "FrameData",
    "./FrameSDK": "FrameSDK"
  }],
  FrameData: [function (e, t, a) {
    "use strict";

    cc._RF.push(t, "2549aHzHfJOKZKZNuDSiIHR", "FrameData");
    Object.defineProperty(a, "__esModule", {
      value: !0
    });
    a.FrameData = void 0;
    var o = e("./FrameSDK"),
      n = function () {
        function e() {
          this.corrected = !1;
          this.credit = {
            yellowCoin: 0,
            greenCoin: 0
          };
          this.historyCredit = {
            pp: 0,
            am: 0
          };
          this.loginDays = 1;
          this.date_day = null;
          this.online_total = 0;
          this.onceEventRecord = {};
          this.wwyLifeEventRecord = {};
          this.wwyFinishTaskCount = 0;
          this.wwylifeCycleData = {};
          this.isRating = !1;
          this.openRatingInedx = 0;
          this.guideInedx = 0;
          this.freeInedx = 0;
          this.charityGuideIndex = 0;
          this.CashVideoCount = 0;
          this.QueueUp = {};
          this.CharityQueueUp = {};
          this.lvAwardinfo = null;
          this.nextData = {
            WallTabLinkNum: {},
            listShow_Final: {},
            listClick_Final: {},
            listOnline_Final: {},
            freezeList_Final: [],
            listShow_Final_New: {},
            listClick_Final_New: {}
          };
          this.account = "";
          this.paymentID = -1;
          this.CoinStep = [];
          this.CharityStep = [];
          this.activity = null;
          this.skipADCount = 0;
          this.preAwardType = -1;
          this.firstRandomAward = !0;
          this.award5 = null;
          this.freeSuperAward = !0;
          this.charityDonated = 0;
          this.charityDonateTime = 0;
          this.flyingBonusIndex = -1;
          this.superReward = null;
          this.adAlternate = null;
          var t = e.getStorageItem("FrameData", null, {});
          for (var a in t) this[a] = t[a];
          cc.game.on(cc.game.EVENT_HIDE, function () {
            e.setlocalStorageItem(null, i.saveData, "FrameData");
          });
        }
        e.setlocalStorageItem = function (e, t, a) {
          null == t && (t = {});
          var o = this.getlocalStorageItem(void 0, a);
          if (e) {
            null != o && "" != o || (o = {});
            o[e] = t;
          } else o = t;
          cc.sys.localStorage.setItem(a || "FrameData", JSON.stringify(o));
        };
        e.getlocalStorageItem = function (e, t) {
          var a = cc.sys.localStorage.getItem(t || "FrameData");
          if (a && e && "" != a) return JSON.parse(a)[e];
          if (null != a && "" != a) try {
            return JSON.parse(a);
          } catch (e) {
            return a;
          }
          return null;
        };
        e.getStorageItem = function (e, t, a) {
          var o = this.getlocalStorageItem(t, e);
          if (o) return o;
          this.setlocalStorageItem(t, a, e);
          return a;
        };
        return e;
      }(),
      i = function () {
        function e() {}
        Object.defineProperty(e, "toolKey", {
          get: function () {
            return o.FrameSDK.frameData && o.FrameSDK.frameData.isDeBug ? e.SDK_CONF.DEBUG_KEY : e.SDK_CONF.RELEASE_KEY;
          },
          enumerable: !1,
          configurable: !0
        });
        Object.defineProperty(e, "credit", {
          get: function () {
            return e.saveData.credit.yellowCoin;
          },
          enumerable: !1,
          configurable: !0
        });
        Object.defineProperty(e, "charityCredit", {
          get: function () {
            return e.saveData.credit.greenCoin;
          },
          enumerable: !1,
          configurable: !0
        });
        e.getOutputConfig = function (t) {
          var a = o.FrameSDK.randomInt(e.FRAME_CONF.OutputConfig.adRate);
          if (t && e.saveData.firstRandomAward) {
            e.saveData.firstRandomAward = !1;
            a = e.FRAME_CONF.OutputConfig.adRate[1];
          }
          return {
            isFree: o.FrameSDK.frameData.gameData.noProfitAd || o.FrameSDK.frameData.gameData.passLevel < e.FRAME_CONF.abAdStartLevel,
            ml: a,
            range: e.FRAME_CONF.OutputConfig.adRate,
            displayRange: e.FRAME_CONF.OutputConfig.adDisplayRate
          };
        };
        e.updateNewBallConfig = function (e) {
          e && "object" == typeof e && e.GAME_CONF;
        };
        e.getTargetCoint = function (t, a) {
          var o = e.FRAME_CONF.RedeemTargetConfig,
            n = e.FRAME_CONF.RedeemRateConfig[0] * o.factor;
          return Math.ceil(a / n) * o.ratio * n + o.extra;
        };
        e.getExchangeStatus = function (t) {
          if (e.saveData.QueueUp[t]) return 5;
          if (null == e.saveData.CoinStep[t]) {
            e.saveData.CoinStep[t] = {
              status: 1,
              targetCoin: null
            };
            o.FrameSDK.logGameEvent("thepool_game_rdm", {
              object_action: "show",
              object_name: "rdm_1_start",
              object_notes: "redeem_" + t
            }, !0);
          }
          return e.saveData.CoinStep[t].status;
        };
        e.getCoinConf = function (t) {
          for (var a = e.FRAME_CONF.CoinConf[0], o = 0; o < e.FRAME_CONF.CoinConf.length; o++) if (e.FRAME_CONF.CoinConf[o].rdm_id == t) {
            a = e.FRAME_CONF.CoinConf[o];
            break;
          }
          return a;
        };
        e.getCoinOutNum = function (t) {
          return e.FRAME_CONF.OutputConfig[t];
        };
        e.getCharityOutNum = function () {
          for (var t, a = e.saveData.credit.greenCoin, n = 0, i = e.FRAME_CONF.charityOutput; n < i.length; n++) {
            var r = i[n];
            if (a < r.have[1]) {
              t = r;
              break;
            }
          }
          t || (t = e.FRAME_CONF.charityOutput[e.FRAME_CONF.charityOutput.length - 1]);
          return o.FrameSDK.randomInt(t.value);
        };
        e.getCharityConf = function (t) {
          for (var a = e.FRAME_CONF.CharityConf[0], o = 0; o < e.FRAME_CONF.CharityConf.length; o++) if (e.FRAME_CONF.CharityConf[o].rdm_id == t) {
            a = e.FRAME_CONF.CharityConf[o];
            break;
          }
          return a;
        };
        e.getCharityExchangeStatus = function (t) {
          if (e.saveData.CharityQueueUp[t]) return 4;
          null == e.saveData.CharityStep[t] && (e.saveData.CharityStep[t] = {
            status: 1
          });
          o.FrameSDK.logGameEvent("thepool_game_rdm", {
            object_action: "show",
            object_name: "rdm2_1_start",
            object_notes: "redeem_" + t
          }, !0);
          return e.saveData.CharityStep[t].status;
        };
        e.saveData = new Proxy(new n(), {
          get: function (e, t) {
            return e[t];
          },
          set: function (t, a, o) {
            var i = Reflect.set(t, a, o);
            i && n.setlocalStorageItem(null, e.saveData, "FrameData");
            return i;
          }
        });
        e.isTest = !1;
        e.countryIndex = 2;
        e.myCountry = "US";
        e.CountryConf = {
          id: 101,
          name: "美国",
          country: "US",
          language: "en",
          rate: 1,
          symbol: "$",
          ad_t: 1,
          cash_id: [101, 103, 102, 104]
        };
        e.configs = null;
        e.SDK_CONF = {
          DEBUG_KEY: "114159",
          RELEASE_KEY: "",
          EMAIL: "light@out.net",
          GradleUrl: "https://play.google.com/store/apps/details?id=com.relating.singles.creation",
          NO_VIDEO: !1,
          isLOG: !1,
          isShowBanner: !0,
          "//": " GradeState 评星状态  0 关闭  1开启",
          GradeState: 1,
          videoRetryTime: 3,
          NO_SPLASH: !1,
          splashWaitInterval: 3,
          splashShowInterval: 3,
          splashEnabled: !1,
          COUNTRY_LIST: [{
            id: 101,
            name: "美国",
            country: "US",
            language: "en",
            rate: 1,
            symbol: "$",
            ad_t: 1,
            cash_id: [101, 103, 102, 104]
          }, {
            id: 102,
            name: "英国",
            country: "GB",
            language: "en",
            rate: 1,
            symbol: "￡",
            ad_t: 1,
            cash_id: [101, 103, 102, 104]
          }, {
            id: 103,
            name: "法国",
            country: "FR",
            language: "fr",
            rate: 1,
            symbol: "€",
            ad_t: 1,
            cash_id: [101, 103, 102, 104]
          }, {
            id: 104,
            name: "德国",
            country: "DE",
            language: "de",
            rate: 1,
            symbol: "€",
            ad_t: 1,
            cash_id: [101, 103, 102, 104]
          }, {
            id: 105,
            name: "日本",
            country: "JP",
            language: "ja",
            rate: 100,
            symbol: "円",
            ad_t: 1,
            cash_id: [122, 126, 101, 103]
          }, {
            id: 106,
            name: "加拿大",
            country: "CA",
            language: "en",
            rate: 1,
            symbol: "$",
            ad_t: 1,
            cash_id: [101, 103, 102, 104]
          }, {
            id: 107,
            name: "澳大利亚",
            country: "AU",
            language: "en",
            rate: 1,
            symbol: "$",
            ad_t: 1,
            cash_id: [101, 103, 102, 104]
          }, {
            id: 108,
            name: "新西兰",
            country: "NZ",
            language: "en",
            rate: 1,
            symbol: "$",
            ad_t: 1,
            cash_id: [101, 103, 102, 104]
          }, {
            id: 109,
            name: "挪威",
            country: "NO",
            language: "no",
            rate: 10,
            symbol: "NOK",
            ad_t: 1,
            cash_id: [101, 103, 102, 104]
          }, {
            id: 110,
            name: "新加坡",
            country: "SG",
            language: "en",
            rate: 1,
            symbol: "$",
            ad_t: 1,
            cash_id: [101, 103, 102, 104]
          }, {
            id: 111,
            name: "瑞典",
            country: "SE",
            language: "se",
            rate: 10,
            symbol: "SEK",
            ad_t: 1,
            cash_id: [101, 103, 102, 104]
          }, {
            id: 112,
            name: "瑞士",
            country: "CH",
            language: "de",
            rate: 1,
            symbol: "CHF",
            ad_t: 1,
            cash_id: [101, 103, 102, 104]
          }, {
            id: 201,
            name: "西班牙",
            country: "ES",
            language: "es",
            rate: 1,
            symbol: "€",
            ad_t: 2,
            cash_id: [113, 111, 101, 103]
          }, {
            id: 202,
            name: "阿拉伯",
            country: "SA",
            language: "ar",
            rate: 5,
            symbol: "SR",
            ad_t: 2,
            cash_id: [101, 103, 102, 104]
          }, {
            id: 203,
            name: "波兰",
            country: "PL",
            language: "pl",
            rate: 5,
            symbol: "złote",
            ad_t: 2,
            cash_id: [101, 103, 102, 104]
          }, {
            id: 204,
            name: "韩国",
            country: "KR",
            language: "ko",
            rate: 1e3,
            symbol: "₩",
            ad_t: 2,
            cash_id: [130, 101, 103, 102]
          }, {
            id: 205,
            name: "意大利",
            country: "IT",
            language: "it",
            rate: 1,
            symbol: "€",
            ad_t: 2,
            cash_id: [101, 103, 102, 104]
          }, {
            id: 206,
            name: "比利时",
            country: "BE",
            language: "nl",
            rate: 1,
            symbol: "€",
            ad_t: 2,
            cash_id: [101, 103, 102, 104]
          }, {
            id: 207,
            name: "荷兰",
            country: "NL",
            language: "nl",
            rate: 1,
            symbol: "€",
            ad_t: 2,
            cash_id: [101, 103, 102, 104]
          }, {
            id: 301,
            name: "印度",
            country: "IN",
            language: "hi",
            rate: 80,
            symbol: "₹",
            ad_t: 3,
            cash_id: [124, 125, 101, 103]
          }, {
            id: 302,
            name: "印尼",
            country: "ID",
            language: "in",
            rate: 15e3,
            symbol: "Rp",
            ad_t: 3,
            cash_id: [105, 106, 101, 103]
          }, {
            id: 303,
            name: "葡萄牙",
            country: "PT",
            language: "pt",
            rate: 1,
            symbol: "€",
            ad_t: 3,
            cash_id: [101, 103, 102, 104]
          }, {
            id: 304,
            name: "泰国",
            country: "TH",
            language: "th",
            rate: 30,
            symbol: "฿",
            ad_t: 3,
            cash_id: [112, 118, 101, 103]
          }, {
            id: 305,
            name: "菲律宾",
            country: "PH",
            language: "fil",
            rate: 50,
            symbol: "₱",
            ad_t: 3,
            cash_id: [121, 116, 101, 103]
          }, {
            id: 306,
            name: "马来西亚",
            country: "MY",
            language: "ms",
            rate: 5,
            symbol: "RM",
            ad_t: 3,
            cash_id: [119, 121, 101, 103]
          }, {
            id: 307,
            name: "哥伦比亚",
            country: "CO",
            language: "es",
            rate: 3e3,
            symbol: "COP",
            ad_t: 3,
            cash_id: [101, 103, 102, 104]
          }, {
            id: 308,
            name: "阿根廷",
            country: "AR",
            language: "es",
            rate: 350,
            symbol: "ARS",
            ad_t: 3,
            cash_id: [101, 103, 102, 104]
          }, {
            id: 309,
            name: "墨西哥",
            country: "MX",
            language: "es",
            rate: 20,
            symbol: "Mex.$",
            ad_t: 3,
            cash_id: [113, 111, 101, 103]
          }, {
            id: 310,
            name: "巴西",
            country: "BR",
            language: "pt",
            rate: 5,
            symbol: "R$",
            ad_t: 3,
            cash_id: [107, 113, 123, 101]
          }, {
            id: 311,
            name: "越南",
            country: "VN",
            language: "vi",
            rate: 2e4,
            symbol: "₫",
            ad_t: 3,
            cash_id: [120, 115, 101, 103]
          }, {
            id: 312,
            name: "土耳其",
            country: "TR",
            language: "tr",
            rate: 8,
            symbol: "₺",
            ad_t: 3,
            cash_id: [101, 103, 102, 104]
          }, {
            id: 313,
            name: "罗马尼亚",
            country: "RO",
            language: "ro",
            rate: 5,
            symbol: "Lei",
            ad_t: 3,
            cash_id: [101, 103, 102, 104]
          }, {
            id: 314,
            name: "约旦",
            country: "JO",
            language: "ar",
            rate: 1,
            symbol: "$",
            ad_t: 3,
            cash_id: [101, 103, 102, 104]
          }, {
            id: 315,
            name: "伊拉克",
            country: "IQ",
            language: "ar",
            rate: 1,
            symbol: "$",
            ad_t: 3,
            cash_id: [101, 103, 102, 104]
          }, {
            id: 316,
            name: "埃及",
            country: "EG",
            language: "ar",
            rate: 1,
            symbol: "$",
            ad_t: 3,
            cash_id: [101, 103, 102, 104]
          }, {
            id: 317,
            name: "以色列",
            country: "IL",
            language: "ar",
            rate: 1,
            symbol: "$",
            ad_t: 3,
            cash_id: [101, 103, 102, 104]
          }, {
            id: 318,
            name: "俄罗斯",
            country: "RU",
            language: "ru",
            rate: 70,
            symbol: "₽",
            ad_t: 3,
            cash_id: [114, 117, 101, 103]
          }, {
            id: 319,
            name: "乌克兰",
            country: "UA",
            language: "uk",
            rate: 20,
            symbol: "₴",
            ad_t: 3,
            cash_id: [101, 103, 102, 104]
          }, {
            id: 400,
            name: "SBALL",
            country: "SBALL",
            language: "en",
            rate: 1,
            symbol: "$",
            ad_t: 3,
            cash_id: [101, 103, 102, 104]
          }]
        };
        e.FRAME_CONF = {
          SDK_VER: "1.0",
          EMAIL: null,
          rDTime: [10, 15],
          TaskLineFrameConfig: {
            startPeople: [300, 400],
            flashDeltaTime: [600, 600],
            videoMinus: [{
              count: 300,
              minusCount: [30, 50],
              MinusPrecend: 100,
              addCount: [1, 1]
            }, {
              count: 200,
              minusCount: [15, 30],
              MinusPrecend: 100,
              addCount: [1, 1]
            }, {
              count: 100,
              minusCount: [10, 15],
              MinusPrecend: 100,
              addCount: [1, 1]
            }, {
              count: 50,
              minusCount: [5, 10],
              MinusPrecend: 100,
              addCount: [1, 1]
            }, {
              count: 20,
              minusCount: [1, 2],
              MinusPrecend: 100,
              addCount: [1, 5]
            }, {
              count: 10,
              minusCount: [1, 2],
              MinusPrecend: 50,
              addCount: [1, 1]
            }, {
              count: 5,
              minusCount: [1, 1],
              MinusPrecend: 50,
              addCount: [1, 1]
            }, {
              count: 3,
              minusCount: [1, 1],
              MinusPrecend: 30,
              addCount: [1, 1]
            }, {
              count: 2,
              minusCount: [1, 1],
              MinusPrecend: 0,
              addCount: [1, 1]
            }, {
              count: 0,
              minusCount: [1, 1],
              MinusPrecend: 0,
              addCount: [1, 1]
            }],
            ChangePlusList: [{
              count: 300,
              addCount: [30, 50],
              precend: 10
            }, {
              count: 200,
              addCount: [15, 30],
              precend: 30
            }, {
              count: 100,
              addCount: [10, 15],
              precend: 50
            }, {
              count: 50,
              addCount: [5, 10],
              precend: 70
            }, {
              count: 0,
              addCount: [1, 2],
              precend: 100
            }],
            outLinePeopleCount: 400,
            MaxLength: 20
          },
          newHand: {
            max: 2e4,
            people: [1e4, 5e4],
            random: [1e4, 2e4]
          },
          TaskConfig: [{
            task_id: 101,
            task_lv: 5,
            task_num: 200
          }, {
            task_id: 102,
            task_lv: 10,
            task_num: 300
          }, {
            task_id: 103,
            task_lv: 20,
            task_num: 500
          }, {
            task_id: 104,
            task_lv: 30,
            task_num: 1e3
          }, {
            task_id: 105,
            task_lv: 40,
            task_num: 1500
          }, {
            task_id: 106,
            task_lv: 50,
            task_num: 1500
          }, {
            task_id: 107,
            task_lv: 60,
            task_num: 2e3
          }, {
            task_id: 108,
            task_lv: 80,
            task_num: 3e3
          }],
          InitialCoins: [0, 0],
          CoinConf: [{
            rdm_id: 1,
            rdm_1: 50,
            rdm_2: [5e3, 2e4],
            rdm_3: 200
          }, {
            rdm_id: 2,
            rdm_1: 100,
            rdm_2: [5e3, 2e4],
            rdm_3: 200
          }],
          CharityConf: [{
            rdm_id: 1,
            rdm_1: 300,
            rdm_2: 100,
            reward: 2e3
          }, {
            rdm_id: 2,
            rdm_1: 500,
            rdm_2: 100,
            reward: 5e3
          }],
          RedeemRateConfig: [1e3, 1],
          RedeemTipsStartLevel: 2,
          RedeemTargetConfig: {
            ratio: 2,
            extra: 3e4,
            factor: 100
          },
          OutputConfig: {
            newFixed: [1e3, 200, 100],
            new: 1e3,
            newRandom: [50, 200],
            ad: 100,
            adRate: [7, 10],
            adDisplayRate: [2, 10],
            draw: 150,
            drawRate: [2, 3, 5],
            free: 20,
            superFree: 50,
            superAd: 1e3,
            boxFixed: [],
            boxRandom: [30, 80],
            flyingBonus: 1e3,
            charity: 1,
            charityRate: [5, 10],
            charityPerPeople: 10
          },
          charityOutput: [{
            id: 101,
            have: [0, 100],
            value: [50, 50]
          }, {
            id: 102,
            have: [100, 150],
            value: [20, 25]
          }, {
            id: 103,
            have: [150, 200],
            value: [10, 20]
          }, {
            id: 104,
            have: [200, 250],
            value: [5, 10]
          }, {
            id: 105,
            have: [250, 275],
            value: [3, 5]
          }, {
            id: 106,
            have: [275, 290],
            value: [1, 2]
          }, {
            id: 107,
            have: [290, 300],
            value: [1, 1]
          }],
          PiggyConfig: {
            time: 86400,
            num: 3e4
          },
          forceVideo: 3,
          freeInedx: 3,
          abAdStartLevel: 3,
          welcomeBackStartLevel: 2,
          welcomeBackEndLevel: 20,
          charityLevel: 3,
          ratingLevel: 6,
          taskLevel: 5,
          bankLevel: 2,
          flyingBonusLevel: 4,
          superRewardLevel: 13,
          superRewardEnabled: !1,
          adAlternateEnabled: !1,
          intervalGrade: 5,
          androidRateUrl: "https://play.google.com/store/apps/details?id=com.replace.industries.article",
          iosRateUrl: "",
          normalDouble: 3,
          InterConfig: {
            maxFreeLevel: 9,
            cooldown: [{
              startLevel: 0,
              cd: 3e4
            }, {
              startLevel: 18,
              cd: 0
            }],
            beforeLevelAd: [{
              startLevel: 0,
              videoFirst: !1
            }]
          },
          noAdConfig: [{
            startLevel: 0,
            delayTime: 0
          }],
          SuperRewardTask: [{
            task_id: 101,
            task_name: "appluck_1",
            task_type: 1,
            task_rule: 2,
            task_wgt: 500,
            task_daily: 2,
            task_time: [30],
            task_total: 9999,
            task_coin: 5e3,
            task_zone: ["us"],
            task_ban: [],
            task_is_uid: 1,
            task_url: "https://news.zephyrona.com/scene?sk=q820d25ace7865d65&lzdid={gaid}"
          }, {
            task_id: 102,
            task_name: "appluck_2",
            task_type: 1,
            task_rule: 2,
            task_wgt: 500,
            task_daily: 2,
            task_time: [30],
            task_total: 9999,
            task_coin: 5e3,
            task_zone: ["us"],
            task_ban: [],
            task_is_uid: 1,
            task_url: "https://events.vortexiax.com/scene?sk=q820d25ace7865d6b&lzdid={gaid}"
          }, {
            task_id: 201,
            task_name: "okspin_1",
            task_type: 2,
            task_rule: 2,
            task_wgt: 500,
            task_daily: 2,
            task_time: [30],
            task_total: 9999,
            task_coin: 5e3,
            task_zone: ["us"],
            task_ban: [],
            task_is_uid: 1,
            task_url: "https://s.gamifyspace.com/tml?pid=19555&appk=BzOELJrKBLXjHlcaWdTTkCFL1D7lEhUi&did={gaid}"
          }, {
            task_id: 202,
            task_name: "okspin_2",
            task_type: 2,
            task_rule: 2,
            task_wgt: 500,
            task_daily: 2,
            task_time: [30],
            task_total: 9999,
            task_coin: 5e3,
            task_zone: ["us"],
            task_ban: [],
            task_is_uid: 1,
            task_url: "https://s.gamifyspace.com/tml?pid=19554&appk=BzOELJrKBLXjHlcaWdTTkCFL1D7lEhUi&did={gaid}"
          }, {
            task_id: 301,
            task_name: "cpl_us",
            task_type: 3,
            task_rule: 1,
            task_wgt: 500,
            task_daily: 1,
            task_time: [120],
            task_total: 2,
            task_coin: 1e4,
            task_zone: ["us"],
            task_ban: [],
            task_is_uid: 2,
            task_url: "https://m.witskies.click/c/c/226/5138?sc=com.replace.industries.article&s2=S226&s1={invite_code}"
          }, {
            task_id: 302,
            task_name: "cpl_all",
            task_type: 3,
            task_rule: 1,
            task_wgt: 500,
            task_daily: 1,
            task_time: [120],
            task_total: 2,
            task_coin: 1e4,
            task_zone: [],
            task_ban: ["us"],
            task_is_uid: 2,
            task_url: "https://m.witskies.click/c/c/228/5138?sc=com.replace.industries.article&s2=S228&s1={invite_code}"
          }],
          SuperRewardConfig: {
            topNumber: 1e3,
            extraRewardRequirement: 3,
            extraRewardDisplay: 1e6,
            extraRewardRange: [2e4, 5e4],
            extraRewardLoop: -1,
            taskBonusTotal: 3e3,
            taskPeopleInitRange: [70, 80],
            taskPeopleAddRange: [2, 4],
            taskPeopleLimit: 95,
            taskBreakPoint: .7
          },
          AdAlternateConfig: [{
            fill_id: 101,
            task_name: "CY_A",
            fill_type: 1,
            fill_wgt: 1e4,
            fill_daily: 5,
            fill_time: [45],
            fill_total: 100,
            fill_zone: [],
            fill_ban: [],
            fill_is_uid: 0,
            fill_url: "https://fun.foiqxdas.xyz"
          }, {
            fill_id: 102,
            task_name: "WOSO_AFP_AD33",
            fill_type: 1,
            fill_wgt: 500,
            fill_daily: 5,
            fill_time: [45],
            fill_total: 100,
            fill_zone: [],
            fill_ban: [],
            fill_is_uid: 0,
            fill_url: "https://glee.5760.top"
          }, {
            fill_id: 104,
            task_name: "Simeng_steven",
            fill_type: 2,
            fill_wgt: 500,
            fill_daily: 5,
            fill_time: [45],
            fill_total: 100,
            fill_zone: [],
            fill_ban: [],
            fill_is_uid: 0,
            fill_url: "https://mood.freshleaf.store"
          }],
          webTargetButtonKeywords: ["confirm", "submit", "continue", "next"]
        };
        return e;
      }();
    a.FrameData = i;
    cc.js.setClassName("FrameData", i);
    cc._RF.pop();
  }, {
    "./FrameSDK": "FrameSDK"
  }],
  FrameSDK: [function (e, t, a) {
    "use strict";

    cc._RF.push(t, "a5818zzhK5IK67V1UFq3Agd", "FrameSDK");
    var o = this && this.__decorate || function (e, t, a, o) {
        var n,
          i = arguments.length,
          r = i < 3 ? t : null === o ? o = Object.getOwnPropertyDescriptor(t, a) : o;
        if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) r = Reflect.decorate(e, t, a, o);else for (var c = e.length - 1; c >= 0; c--) (n = e[c]) && (r = (i < 3 ? n(r) : i > 3 ? n(t, a, r) : n(t, a)) || r);
        return i > 3 && r && Object.defineProperty(t, a, r), r;
      },
      n = this && this.__awaiter || function (e, t, a, o) {
        return new (a || (a = Promise))(function (n, i) {
          function r(e) {
            try {
              s(o.next(e));
            } catch (e) {
              i(e);
            }
          }
          function c(e) {
            try {
              s(o.throw(e));
            } catch (e) {
              i(e);
            }
          }
          function s(e) {
            e.done ? n(e.value) : (t = e.value, t instanceof a ? t : new a(function (e) {
              e(t);
            })).then(r, c);
            var t;
          }
          s((o = o.apply(e, t || [])).next());
        });
      },
      i = this && this.__generator || function (e, t) {
        var a,
          o,
          n,
          i,
          r = {
            label: 0,
            sent: function () {
              if (1 & n[0]) throw n[1];
              return n[1];
            },
            trys: [],
            ops: []
          };
        return i = {
          next: c(0),
          throw: c(1),
          return: c(2)
        }, "function" == typeof Symbol && (i[Symbol.iterator] = function () {
          return this;
        }), i;
        function c(e) {
          return function (t) {
            return s([e, t]);
          };
        }
        function s(i) {
          if (a) throw new TypeError("Generator is already executing.");
          for (; r;) try {
            if (a = 1, o && (n = 2 & i[0] ? o.return : i[0] ? o.throw || ((n = o.return) && n.call(o), 0) : o.next) && !(n = n.call(o, i[1])).done) return n;
            (o = 0, n) && (i = [2 & i[0], n.value]);
            switch (i[0]) {
              case 0:
              case 1:
                n = i;
                break;
              case 4:
                r.label++;
                return {
                  value: i[1],
                  done: !1
                };
              case 5:
                r.label++;
                o = i[1];
                i = [0];
                continue;
              case 7:
                i = r.ops.pop();
                r.trys.pop();
                continue;
              default:
                if (!(n = r.trys, n = n.length > 0 && n[n.length - 1]) && (6 === i[0] || 2 === i[0])) {
                  r = 0;
                  continue;
                }
                if (3 === i[0] && (!n || i[1] > n[0] && i[1] < n[3])) {
                  r.label = i[1];
                  break;
                }
                if (6 === i[0] && r.label < n[1]) {
                  r.label = n[1];
                  n = i;
                  break;
                }
                if (n && r.label < n[2]) {
                  r.label = n[2];
                  r.ops.push(i);
                  break;
                }
                n[2] && r.ops.pop();
                r.trys.pop();
                continue;
            }
            i = t.call(e, r);
          } catch (e) {
            i = [6, e];
            o = 0;
          } finally {
            a = n = 0;
          }
          if (5 & i[0]) throw i[1];
          return {
            value: i[0] ? i[1] : void 0,
            done: !0
          };
        }
      };
    Object.defineProperty(a, "__esModule", {
      value: !0
    });
    a.FrameSDK = a.EVideoEvent = void 0;
    var r,
      c = e("./CLICKLOCK"),
      s = e("./Frame"),
      l = e("./FrameData"),
      u = e("./Panel_Activity"),
      d = e("./Panel_SuperReward"),
      p = e("./Panel_Task"),
      h = e("./RDM_Toast"),
      m = e("./i18");
    (function (e) {
      e[e.START = 0] = "START";
      e[e.END = 1] = "END";
      e[e.CLICK = 2] = "CLICK";
      e[e.INTERRUPT = 3] = "INTERRUPT";
      e[e.PROFIT = 4] = "PROFIT";
      e[e.FAIL = 5] = "FAIL";
    })(r = a.EVideoEvent || (a.EVideoEvent = {}));
    var f = function () {
      function e() {}
      e.getNoAdDelayTime = function () {
        for (var t = e.frameData.gameData.passLevel, a = void 0, o = 0, n = l.FrameData.FRAME_CONF.noAdConfig; o < n.length; o++) {
          var i = n[o];
          if (!(t >= i.startLevel - 1)) break;
          a = i.delayTime;
        }
        return a;
      };
      e.checkPopUp = function (t, a, o) {
        var n = this,
          i = Promise.resolve();
        if (!this._sceneFirstAccessFlags[t]) {
          this._sceneFirstAccessFlags[t] = !0;
          i = i.then(function () {
            return new Promise(function (t) {
              var a = cc.sys.localStorage.getItem("newHand"),
                o = e.frameData.gameData.passLevel;
              !e.frameData.gameData.noProfitAd && o >= l.FrameData.FRAME_CONF.welcomeBackStartLevel - 1 && o < l.FrameData.FRAME_CONF.welcomeBackEndLevel && null != a ? n.openWindow("Panel_WelcomeBack", {
                closeCB: function () {
                  return t();
                }
              }) : t();
            });
          }).then(function () {
            return new Promise(function (e) {
              return u.default.onLogin(e);
            });
          });
        }
        i.then(function () {
          return new Promise(function (t) {
            if (!e.frameData.gameData.noProfitAd && e.frameData.gameData.passLevel >= l.FrameData.FRAME_CONF.charityLevel && l.FrameData.saveData.charityGuideIndex <= 0) {
              cc.director.once("CHARITY_GUIDE_FINISH", function () {
                return t();
              });
              n.openWindow("Panel_GuideTips", {
                type: "charity",
                closeCB: function () {
                  return s.default.ins.setGuide2Show(!0);
                }
              });
            } else t();
          });
        }).then(function () {
          return new Promise(function (t) {
            !l.FrameData.saveData.activity && e.frameData.gameData.passLevel >= l.FrameData.FRAME_CONF.bankLevel ? u.default.startActivity(t) : t();
          });
        }).then(function () {
          return new Promise(function (t) {
            null == l.FrameData.saveData.lvAwardinfo && e.frameData.gameData.passLevel >= l.FrameData.FRAME_CONF.taskLevel ? p.default.startTask(t) : t();
          });
        }).then(function () {
          return new Promise(function (t) {
            !l.FrameData.saveData.superReward && e.frameData.gameData.passLevel >= l.FrameData.FRAME_CONF.superRewardLevel ? d.default.startSuperReward(t) : t();
          });
        }).then(function () {
          null == o || o();
        });
      };
      e.hideWebView = function (e) {
        var t,
          a,
          o = null === (t = cc.director.getScene()) || void 0 === t ? void 0 : t.getChildByName("__Frame_web_view__");
        if (o) {
          o.active = !1;
          var n = null !== (a = o.getComponent(cc.WebView)) && void 0 !== a ? a : o.addComponent(cc.WebView);
          n.node.targetOff(e);
          n.url = "";
        }
      };
      e.getCurrentRedeemRequirement = function () {
        var t = e.frameData.gameData.passLevel,
          a = l.FrameData.getCoinConf(1),
          o = l.FrameData.getCoinConf(2);
        if (a.rdm_1 > o.rdm_1) {
          var n = a;
          a = o;
          o = n;
        }
        return t >= o.rdm_1 ? null : t >= a.rdm_1 ? o : a;
      };
      e.init = function (t, a, o, n) {
        this.frameData = t;
        e.initCocosAmend();
        e.correctConfigs();
        cc.assetManager.getBundle("Frame").preloadDir("Prefab");
        e.initSettings(a);
        this.i18n = o;
        this.setLan(cc.sys.languageCode);
        null == l.FrameData.saveData.date_day && (l.FrameData.saveData.date_day = e.getDateDay(e.now));
        l.FrameData.saveData.adAlternate || (l.FrameData.saveData.adAlternate = {
          totalComplete: {},
          todayComplete: {}
        });
        e.DATE_DAY = l.FrameData.saveData.date_day;
        e.onlineTimeUpdate();
        e.resetNextData();
        e.updataTimeQueueUp();
        e.initSplash(n);
      };
      e.HttpGet = function (e, t, a) {
        var o = cc.loader.getXMLHttpRequest();
        t && (e += "?" + function (e) {
          var t = "";
          for (var a in e) e.hasOwnProperty(a) && (t += a + "=" + e[a] + "&");
          return t.substring(0, t.length - 1);
        }(t));
        o.open("GET", e, !0);
        o.onload = function () {
          4 == o.readyState && 200 == o.status ? a(null, o.responseText) : a({
            name: "Can't get",
            message: e
          }, {});
        };
        o.onerror = function () {
          a({
            name: "Can't get it. The network may be disconnected",
            message: e
          }, {});
        };
        o.send();
      };
      e.updataVideoQueueUp = function () {
        for (var t in l.FrameData.saveData.QueueUp) {
          var a = l.FrameData.saveData.QueueUp[t];
          if (null == a.deadLinePeopleCount) {
            a.deadLinePeopleCount = e.randomInt(l.FrameData.FRAME_CONF.TaskLineFrameConfig.startPeople[0], l.FrameData.FRAME_CONF.TaskLineFrameConfig.startPeople[1]);
            a.deadLineTimeStamp = e.now;
            a.historyList = [];
          }
          for (var o = 0; o < l.FrameData.FRAME_CONF.TaskLineFrameConfig.videoMinus.length; o++) if (a.deadLinePeopleCount > l.FrameData.FRAME_CONF.TaskLineFrameConfig.videoMinus[o].count) {
            var n = e.randomInt(0, 100),
              i = e.getRandomInviteCode();
            if (n < l.FrameData.FRAME_CONF.TaskLineFrameConfig.videoMinus[o].MinusPrecend) {
              var r = e.randomInt(l.FrameData.FRAME_CONF.TaskLineFrameConfig.videoMinus[o].minusCount[0], l.FrameData.FRAME_CONF.TaskLineFrameConfig.videoMinus[o].minusCount[1]);
              a.deadLinePeopleCount -= r;
              a.deadLinePeopleCount < 1 && (a.deadLinePeopleCount = 1);
              a.deadLineShowTip = "tkey_211??&value1==<color = #249A50>" + i + "</color>&&value2==<color = #249A50>" + a.deadLinePeopleCount + "</color>";
              if (a.historyList.length < l.FrameData.FRAME_CONF.TaskLineFrameConfig.MaxLength) a.historyList.push({
                key: "tkey_211",
                account: i,
                peopleCount: a.deadLinePeopleCount
              });else {
                a.historyList.shift();
                a.historyList.push({
                  key: "tkey_211",
                  account: i,
                  peopleCount: a.deadLinePeopleCount
                });
              }
            } else {
              a.deadLinePeopleCount += e.randomInt(l.FrameData.FRAME_CONF.TaskLineFrameConfig.videoMinus[o].addCount[0], l.FrameData.FRAME_CONF.TaskLineFrameConfig.videoMinus[o].addCount[1]);
              a.deadLineShowTip = "tkey_210??&value1==<color = #249A50>" + i + "</color>&&value2==<color = #249A50>" + a.deadLinePeopleCount + "</color>";
              if (a.historyList.length < l.FrameData.FRAME_CONF.TaskLineFrameConfig.MaxLength) a.historyList.push({
                key: "tkey_210",
                account: i,
                peopleCount: a.deadLinePeopleCount
              });else {
                a.historyList.shift();
                a.historyList.push({
                  key: "tkey_210",
                  account: i,
                  peopleCount: a.deadLinePeopleCount
                });
              }
            }
            break;
          }
        }
      };
      e.openLevelAward = function (t, a, o, n, i) {
        e.openWindow("Panel_Award_5", {
          externalNode: t,
          unlockCountUpdateFunc: a,
          superExternalNode: o,
          param: n,
          closeCB: function (t) {
            e.currLevel != e.frameData.gameData.passLevel + 1 && (e.currLevel = e.frameData.gameData.passLevel + 1);
            null == i || i(t);
          }
        });
      };
      e._isOnceEventLogged = function (e, t) {
        var a = this._getOnceEventCacheKey(e, t);
        return !0 === l.FrameData.saveData.onceEventRecord[a];
      };
      e.isShowInters = function () {
        if (e.frameData.gameData.noProfitAd) return !1;
        var t = e.frameData.gameData.passLevel,
          a = l.FrameData.FRAME_CONF.InterConfig;
        if (t < a.maxFreeLevel) return !1;
        for (var o = 0, n = 0, i = a.cooldown; n < i.length; n++) {
          var r = i[n];
          if (!(t >= r.startLevel - 1)) break;
          o = r.cd;
        }
        return Date.now() - this._lastVideoEndTime >= o;
      };
      e.beforeGameLevelStart = function (t, a, o, n) {
        var i = this,
          r = [t];
        null != a && r.push(a);
        null != o && r.push(o);
        e.logGameEvent("thepool_game_lv", {
          object_action: "show",
          object_name: "lv_start",
          object_notes: "" + r.join("_")
        }, !0);
        new Promise(function (e) {
          var t = null;
          t = setInterval(function () {
            if (s.default.ins) {
              clearInterval(t);
              e();
            }
          });
        }).then(function () {
          return new Promise(function (e) {
            t < l.FrameData.FRAME_CONF.RedeemTipsStartLevel || t > i.getFirstRedeemRequirement().rdm_1 ? e() : i.openWindow("Panel_RedeemTips", {
              level: t,
              currentBonus: l.FrameData.credit,
              closeCB: e
            });
          });
        }).then(function () {
          return new Promise(function (t) {
            var a;
            if (e.isShowInters()) {
              for (var o = e.frameData.gameData.passLevel, n = !1, i = 0, r = l.FrameData.FRAME_CONF.InterConfig.beforeLevelAd; i < r.length; i++) {
                var c = r[i];
                if (!(o >= c.startLevel - 1)) break;
                n = null !== (a = c.videoFirst) && void 0 !== a && a;
              }
              e.logCommonEvent("c_ad_event", {
                action: "touch",
                type: n ? "video" : "interstitial",
                placement: "enter_level"
              });
              (n ? e.openVideo : e.openInters).call(e, "enter_level", !1, function (t) {
                e.logGameEvent("thepool_game_ad", {
                  object_action: "show",
                  object_name: "enter_level",
                  object_notes: "video" === t ? "video" : "web" === t ? "web" : "inter"
                });
              }, function (a) {
                a ? e.addCoin(0, l.FrameData.getCharityOutNum(), 1, function () {
                  return t();
                }) : t();
              }, function () {
                return t();
              });
            } else t();
          });
        }).then(function () {
          null == n || n();
          cc.director.emit("SHOW_FLYING_BONUS");
        });
      };
      e.addSuperAwardListen = function (e, t) {
        cc.director.on("SUPER_AWARD", e, t);
      };
      e.openBanner = function (t, a) {
        void 0 === t && (t = 1);
        void 0 === a && (a = 0);
        l.FrameData.SDK_CONF.isShowBanner ? e.frameData.sdkFuc.openBanner(t, a) : console.log("配置关闭了 Banner 广告");
      };
      e.debugAddCoin = function (e, t) {
        if (0 !== t) {
          var a = Math.max(0, l.FrameData.saveData.credit[e] + t);
          cc.director.emit("FRESH_CREDIT", {
            type: e,
            num: a,
            change: t
          });
          l.FrameData.saveData.credit[e] = a;
        }
      };
      e.correctConfigs = function () {
        if (!e.frameData.gameData.noProfitAd) {
          l.FrameData.FRAME_CONF.CoinConf = [{
            rdm_id: 1,
            rdm_1: 20,
            rdm_2: [5e3, 2e4],
            rdm_3: 100
          }, {
            rdm_id: 2,
            rdm_1: 40,
            rdm_2: [5e3, 2e4],
            rdm_3: 100
          }];
          l.FrameData.FRAME_CONF.RedeemRateConfig = [10, 1];
        }
      };
      e.resetNextData = function () {
        if (this.DATE_DAY < e.getDateDay(e.now)) {
          this.DATE_DAY = l.FrameData.saveData.date_day = e.getDateDay(e.now);
          for (var t in l.FrameData.saveData.nextData) Array.isArray(l.FrameData.saveData.nextData[t]) ? l.FrameData.saveData.nextData[t] = [] : "object" == typeof l.FrameData.saveData.nextData[t] ? l.FrameData.saveData.nextData[t] = {} : "number" == typeof l.FrameData.saveData.nextData[t] && (l.FrameData.saveData.nextData[t] = 0);
          l.FrameData.saveData.loginDays++;
          var a = l.FrameData.saveData.adAlternate;
          l.FrameData.saveData.adAlternate = {
            totalComplete: a.totalComplete,
            todayComplete: {}
          };
        }
      };
      e.updataTimeQueueUp = function () {
        for (var t in l.FrameData.saveData.QueueUp) {
          var a = l.FrameData.saveData.QueueUp[t];
          if (null == a.deadLinePeopleCount) {
            a.deadLinePeopleCount = e.randomInt(l.FrameData.FRAME_CONF.TaskLineFrameConfig.startPeople[0], l.FrameData.FRAME_CONF.TaskLineFrameConfig.startPeople[1]);
            a.deadLineTimeStamp = e.now;
            a.historyList = [];
          }
          for (var o = a.deadLinePeopleCount, n = a.deadLineTimeStamp, i = 0, r = -1;;) {
            var c = e.randomInt(l.FrameData.FRAME_CONF.TaskLineFrameConfig.flashDeltaTime[0], l.FrameData.FRAME_CONF.TaskLineFrameConfig.flashDeltaTime[1]);
            if (!(e.now - c >= n)) break;
            if (o + i >= l.FrameData.FRAME_CONF.TaskLineFrameConfig.outLinePeopleCount) {
              i = 0;
              o = e.randomInt(l.FrameData.FRAME_CONF.TaskLineFrameConfig.startPeople[0], l.FrameData.FRAME_CONF.TaskLineFrameConfig.startPeople[1]);
              r = 1;
            } else for (var s = 0; s < l.FrameData.FRAME_CONF.TaskLineFrameConfig.ChangePlusList.length; s++) if (o + i >= l.FrameData.FRAME_CONF.TaskLineFrameConfig.ChangePlusList[s].count) {
              if (e.randomInt(0, 100) <= l.FrameData.FRAME_CONF.TaskLineFrameConfig.ChangePlusList[s].precend) {
                i += e.randomInt(l.FrameData.FRAME_CONF.TaskLineFrameConfig.ChangePlusList[s].addCount[0], l.FrameData.FRAME_CONF.TaskLineFrameConfig.ChangePlusList[s].addCount[1]);
                r = 2;
              } else {
                i -= 1;
                r = 1;
              }
              break;
            }
            n += c;
          }
          a.deadLineTimeStamp = n;
          a.deadLinePeopleCount = i + o;
          a.deadLinePeopleCount < 1 && (a.deadLinePeopleCount = 1);
          if (-1 != r) {
            if (1 == r) {
              a.deadLineShowTip = "tkey_209??&value1==<color = #249A50>" + a.deadLinePeopleCount + "</color>";
              if (a.historyList.length < l.FrameData.FRAME_CONF.TaskLineFrameConfig.MaxLength) a.historyList.push({
                key: "tkey_209",
                account: "",
                peopleCount: a.deadLinePeopleCount
              });else {
                a.historyList.shift();
                a.historyList.push({
                  key: "tkey_209",
                  account: "",
                  peopleCount: a.deadLinePeopleCount
                });
              }
            }
            if (2 == r) {
              var u = e.getRandomInviteCode();
              a.deadLineShowTip = "tkey_210??&value1==<color = #249A50>" + u + "</color>&&value2==<color = #249A50>" + a.deadLinePeopleCount + "</color>";
              if (a.historyList.length < l.FrameData.FRAME_CONF.TaskLineFrameConfig.MaxLength) a.historyList.push({
                key: "tkey_210",
                account: u,
                peopleCount: a.deadLinePeopleCount
              });else {
                a.historyList.shift();
                a.historyList.push({
                  key: "tkey_210",
                  account: u,
                  peopleCount: a.deadLinePeopleCount
                });
              }
            }
          }
        }
      };
      e.randomFloatNum = function (e, t) {
        return Math.random() * (t - e) + e;
      };
      e.randomInt = function (e, t) {
        if (Array.isArray(e)) {
          t = e[1];
          e = e[0];
        }
        return Math.floor((t - e + 1) * Math.random()) + e;
      };
      e.beforeEnterGame = function (t) {
        if (null != cc.sys.localStorage.getItem("newHand") && l.FrameData.SDK_CONF.splashEnabled) {
          e.logGameEvent("thepool_sad", {
            object_action: "show",
            object_name: "sad_show",
            object_notes: "cold"
          });
          var a = Date.now() + 1e3 * l.FrameData.SDK_CONF.splashWaitInterval,
            o = function () {
              var n;
              if (e.frameData.sdkFuc.isSplashReady()) {
                var i = null === (n = cc.director.getScene()) || void 0 === n ? void 0 : n.getChildByName("__FRAME_SPLASH__");
                if (i) {
                  i.zIndex = cc.macro.MAX_ZINDEX;
                  i.active = !0;
                }
                e.frameData.sdkFuc.openSplash(function (a) {
                  if (a === r.END || a === r.FAIL) {
                    e.logGameEvent("thepool_sad", {
                      object_action: "show",
                      object_name: a === r.FAIL ? "sad_fail" : "sad_succ",
                      object_notes: "cold"
                    });
                    if (i) {
                      i.active = !1;
                      cc.director.emit("HIDE_SPLASH");
                    }
                    null == t || t();
                  }
                });
              } else if (Date.now() <= a) setTimeout(o, .3);else {
                e.logGameEvent("thepool_sad", {
                  object_action: "show",
                  object_name: "sad_fail",
                  object_notes: "cold"
                });
                null == t || t();
              }
            };
          o();
        } else null == t || t();
      };
      e.openABAward = function (t) {
        l.FrameData.saveData.preAwardType = (l.FrameData.saveData.preAwardType + 1) % 2;
        e.openWindow("Panel_Award_" + (1 === l.FrameData.saveData.preAwardType ? "3" : "1"), {
          closeCB: function () {
            t && t();
          }
        });
      };
      e.formatSeconds = function (t) {
        var a = e.formatSeconds3(t);
        return a.hour + a.minute + a.second;
      };
      e.closeEffect = function (e, t) {
        e.black_sprite && cc.tween(e.black_sprite.node).delay(.06).to(.24, {
          opacity: 0
        }).start();
        e.noTouch && (e.noTouch.node.active = !0);
        if (null != e.panel_window) {
          e.panel_window.stopActionByTag(9029);
          var a = e.panel_window.position,
            o = .3;
          if (e._close_target) {
            o = .5;
            a = e._close_target.convertToWorldSpaceAR(cc.v2());
            a = e.panel_window.parent.convertToNodeSpaceAR(a);
          }
          cc.tween(e.panel_window).to(o, {
            scale: .1,
            opacity: 100,
            position: a
          }, {
            easing: "backIn"
          }).tag(9029).call(function () {
            t && t();
            e.node.destroy();
          }).start();
        } else {
          if (!cc.isValid(e.node)) {
            console.error("cc.isValid(target.node)", e.node);
            return;
          }
          e.node.stopActionByTag(9029);
          cc.tween(e.node).tag(9029).call(function () {
            t && t();
          }).removeSelf().start();
        }
      };
      e.addFlagListen = function (t, a) {
        cc.director.on(e.frameData.ListenKeys.FRESH_FLAG, t, a);
      };
      e.hasPopUp = function () {
        return !e.frameData.gameData.noProfitAd && e.frameData.gameData.passLevel >= l.FrameData.FRAME_CONF.charityLevel && l.FrameData.saveData.charityGuideIndex <= 0 || null === l.FrameData.saveData.activity && e.frameData.gameData.passLevel >= l.FrameData.FRAME_CONF.bankLevel || null == l.FrameData.saveData.lvAwardinfo && e.frameData.gameData.passLevel >= l.FrameData.FRAME_CONF.taskLevel || null == l.FrameData.saveData.superReward && e.frameData.gameData.passLevel >= l.FrameData.FRAME_CONF.superRewardLevel;
      };
      e.addCountryListen = function (e, t) {
        cc.director.on("CHANGE_COUNTRY", e, t);
      };
      e.addBitCoin = function (e, t, a, o, n) {
        cc.director.emit("ADD_BIT_COIN", e, t, a, o, n);
      };
      e.getCountry_Language = function (t) {
        var a = function (e) {
          for (var t = e.indexOf("#"), a = (e = e.substring(0, -1 == t ? e.length : t)).split(-1 != e.indexOf("_") ? "_" : "-"), o = a.length - 1; o >= 0; o--) "" == a[o] && a.splice(o, 1);
          var n = {
            lang: a[0],
            country: "SBALL"
          };
          a.length > 1 && (n = {
            lang: a[0],
            country: a[a.length - 1]
          });
          for (var i = l.FrameData.SDK_CONF.COUNTRY_LIST, r = 0, c = i; r < c.length; r++) {
            var s = c[r];
            if (n.country.toLowerCase() == s.country.toLowerCase()) return s;
          }
          n = {
            lang: "en",
            country: "SBALL"
          };
          for (var u = 0, d = i; u < d.length; u++) {
            s = d[u];
            if (n.country.toLowerCase() == s.country.toLowerCase()) return s;
          }
          return i[0];
        }(t);
        l.FrameData.myCountry = a.country;
        l.FrameData.countryIndex = a.ad_t - 1;
        l.FrameData.CountryConf = a;
        e.frameData.gameData.myLanguge = a.language;
        console.log("getCountry_Language", t, l.FrameData.myCountry, e.frameData.gameData.myLanguge);
      };
      e._getOnceEventCacheKey = function (e, t) {
        var a, o;
        return e + "-" + t.object_action + "-" + (null !== (a = t.object_name) && void 0 !== a ? a : "") + "-" + (null !== (o = t.object_notes) && void 0 !== o ? o : "");
      };
      e.openVideo = function (t, a, o, n, i, c) {
        var s = this;
        e.frameData.sdkFuc.beforeOpenVideo(function (u) {
          if (u) {
            if (l.FrameData.SDK_CONF.NO_VIDEO || !e.frameData) {
              console.log("skip video");
              s._lastVideoEndTime = Date.now();
              s._playingAD = !1;
              null == o || o("video");
              null == n || n(!0, "video");
            } else {
              s._playingAD = !0;
              e.frameData.gameFuc.openLoad();
              var d = e.now + l.FrameData.SDK_CONF.videoRetryTime,
                p = function () {
                  if (e.frameData.sdkFuc.isReadyVideo()) e.frameData.sdkFuc.openVideo(t, function (l) {
                    console.log("video event - " + r[l]);
                    switch (l) {
                      case r.END:
                        s._lastVideoEndTime = Date.now();
                        s._playingAD = !1;
                        e.frameData.gameFuc.closeLoad();
                        cc.director.emit(e.frameData.ListenKeys.VIDEO_SUC);
                        null == n || n(!0, "video");
                        break;
                      case r.INTERRUPT:
                        s._playingAD = !1;
                        e.frameData.gameFuc.closeLoad();
                        null == i || i();
                        break;
                      case r.FAIL:
                        s._playingAD = !1;
                        e.frameData.gameFuc.closeLoad();
                        if (a) {
                          if (c) {
                            console.log("interstitial to video failed, try web");
                            s.openWeb(c, o, n, i);
                          } else null == n || n(!1);
                        } else {
                          console.log("video failed, try interstitial");
                          s.openInters(t, !0, o, n, i, c);
                        }
                        break;
                      case r.START:
                        e.frameData.gameFuc.closeLoad();
                        e.frameData.sdkFuc.earlierStageEvent("ad_success");
                        e.logLiftEvent("first_ad");
                        null == o || o("video");
                    }
                  });else if (e.now <= d) setTimeout(function () {
                    return p();
                  }, 300);else {
                    s._playingAD = !1;
                    e.frameData.gameFuc.closeLoad();
                    if (a) {
                      if (c) {
                        console.log("interstitial to video failed, try web");
                        s.openWeb(c, o, n, i);
                      } else null == n || n(!1);
                    } else {
                      console.log("video failed, try interstitial");
                      s.openInters(t, !0, o, n, i, c);
                    }
                  }
                };
              p();
            }
          } else null == i || i();
        });
      };
      e.getFirstRedeemRequirement = function () {
        return l.FrameData.getCoinConf(1);
      };
      e.loadPrefab = function (t, a, o, r) {
        void 0 === o && (o = !0);
        void 0 === r && (r = "Prefab/");
        return n(this, void 0, void 0, function () {
          return i(this, function () {
            o && e.frameData.gameFuc.openLoad();
            cc.assetManager.getBundle("Frame").load(r + t, cc.Prefab, function (t, n) {
              o && e.frameData.gameFuc.closeLoad();
              n ? a(cc.instantiate(n)) : console.error(t);
            });
            return [2];
          });
        });
      };
      e.logLiftEvent = function (t) {
        var a = t;
        if ("finish_task" === a) {
          1 == ++l.FrameData.saveData.wwyFinishTaskCount && e.frameData.sdkFuc.lifeEvent("submit_order");
          a = "finish_task_" + l.FrameData.saveData.wwyFinishTaskCount;
        }
        if (!l.FrameData.saveData.wwyLifeEventRecord[a]) {
          e.frameData.sdkFuc.lifeEvent(a);
          l.FrameData.saveData.wwyLifeEventRecord[a] = !0;
        }
      };
      e.addQueueUp = function (t, a) {
        void 0 === a && (a = {});
        l.FrameData.saveData.QueueUp[t] = a;
        e.updataTimeQueueUp();
      };
      e.formatSeconds3 = function (e) {
        e <= 0 && (e = 0);
        var t = function (e) {
            return Number(e).toString().length < 2 ? "0" + e : e.toString();
          },
          a = parseInt(e + "") <= 0 ? 0 : parseInt(e + ""),
          o = 0,
          n = 0;
        if (a >= 60) {
          o = parseInt((a / 3600).toString());
          n = parseInt((a % 3600 / 60).toString());
          a = parseInt((a % 60).toString());
        }
        return {
          hour: t(o),
          minute: t(n),
          second: t(a)
        };
      };
      e.getI18n = function () {
        var e;
        return null !== (e = this.i18n) && void 0 !== e ? e : m.default;
      };
      e.hiddenBanner = function () {
        e.frameData.sdkFuc.hiddenBanner();
      };
      e.addCoin = function (e, t, a, o) {
        cc.director.emit("ADD_COIN", e, t, a, o);
      };
      e.initSettings = function (t) {
        var a;
        l.FrameData.configs = t;
        var o = (null == t ? void 0 : t.basicConfig) || {};
        for (var n in o.SDK_CONF) l.FrameData.SDK_CONF[n] = o.SDK_CONF[n];
        for (var n in o.FRAME_CONF) l.FrameData.FRAME_CONF[n] = o.FRAME_CONF[n];
        var i = e.frameData.sdkFuc.countryCode.toUpperCase(),
          r = null === (a = o.LOCAL_CONF) || void 0 === a ? void 0 : a[i];
        console.log("current country code: " + i);
        if (r) {
          if (r.SDK_CONF) for (var n in r.SDK_CONF) l.FrameData.SDK_CONF[n] = r.SDK_CONF[n];
          if (r.FRAME_CONF) for (var n in r.FRAME_CONF) l.FrameData.FRAME_CONF[n] = r.FRAME_CONF[n];
        }
        if (!l.FrameData.saveData.corrected) {
          l.FrameData.saveData.corrected = !0;
          l.FrameData.saveData.credit.yellowCoin = l.FrameData.FRAME_CONF.InitialCoins[0];
          l.FrameData.saveData.credit.greenCoin = l.FrameData.FRAME_CONF.InitialCoins[1];
        }
      };
      e.convertCoinToStr = function (e, t) {
        void 0 === t && (t = !1);
        return this.formatNumber(e, t ? 2 : 0, t ? l.FrameData.FRAME_CONF.RedeemRateConfig[0] : 0);
      };
      e.openWindow = function (t, a, o) {
        void 0 === a && (a = {});
        e.loadPrefab(t, function (n) {
          var i = cc.instantiate(n);
          i.getComponent(t).viewData = a;
          i.parent = o || e.Panel;
        });
      };
      Object.defineProperty(e, "now", {
        get: function () {
          return Math.floor(cc.sys.now() / 1e3);
        },
        enumerable: !1,
        configurable: !0
      });
      e.debugChangeBankTime = function (t) {
        if (u.default.isActivityCollectable()) {
          t = Math.max(0, t);
          l.FrameData.saveData.activity.time = e.now + t;
        }
      };
      e.formatNumber = function (e, t, a) {
        void 0 === t && (t = 0);
        void 0 === a && (a = 0);
        t = Math.max(0, Math.floor(t));
        a > 0 && (e = e / a * l.FrameData.CountryConf.rate);
        var o = e.toString(),
          n = o.split(".");
        t <= 0 ? n.length = 1 : n.length > 1 && (n[1] = n[1].substring(0, t));
        var i = o.startsWith("+") || o.startsWith("-") ? n[0].substring(0, 1) : "";
        n[0] = n[0].substring(i.length);
        n[0] = n[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return "" + i + (a > 0 ? l.FrameData.CountryConf.symbol : "") + n.join(".");
      };
      e.logGameEvent = function (t, a, o) {
        void 0 === o && (o = !1);
        if (!o || !this._isOnceEventLogged(t, a)) {
          var n = {
            object_action: a.object_action
          };
          null !== a.object_name && void 0 !== a.object_name && (n.object_name = a.object_name);
          null !== a.object_notes && void 0 !== a.object_notes && (n.object_notes = a.object_notes);
          e.frameData.sdkFuc.logGameEvent(t, n, o);
          if (o) {
            var i = this._getOnceEventCacheKey(t, a);
            l.FrameData.saveData.onceEventRecord[i] = !0;
          }
        }
      };
      e.onlineTimeUpdate = function () {
        e.ONLINE_TIME || (e.ONLINE_TIME = setInterval(function () {
          e.resetNextData();
          e.updataTimeQueueUp();
        }, 1e3));
      };
      e.openPanel_Yellow = function () {
        e.loadPrefab("RDM_Level", function (t) {
          cc.instantiate(t).parent = e.Panel;
        });
      };
      e.convertCharityToStr = function (e, t) {
        void 0 === t && (t = !1);
        return this.formatNumber(e, t ? 2 : 0, t ? l.FrameData.FRAME_CONF.RedeemRateConfig[1] : 0);
      };
      e.addCreditListen = function (e, t) {
        cc.director.on("FRESH_CREDIT", e, t);
      };
      e.addi18nArray = function (e) {
        this.i18n ? this.i18n.addi18nArray(e) : m.default.init(e, null, l.FrameData.SDK_CONF.COUNTRY_LIST);
      };
      e.openEffect = function (e, t, a) {
        var o;
        if (!e.black_sprite) {
          e.black_sprite = new cc.Node(e.node.name + "_black_sprite").addComponent(cc.Sprite);
          e.black_sprite.node.addComponent(cc.BlockInputEvents);
          e.black_sprite.node.color = cc.Color.BLACK;
          e.black_sprite.node.zIndex = -1;
          e.node.addChild(e.black_sprite.node);
          cc.assetManager.getBundle("Frame").load("internal/image/default_editbox_bg", cc.SpriteFrame, function (t, a) {
            e.black_sprite.spriteFrame = a;
            e.black_sprite.node.width = cc.winSize.width + 200;
            e.black_sprite.node.height = cc.winSize.height + 200;
          });
          e.noTouch = new cc.Node(e.node.name + "_noTouch").addComponent(cc.BlockInputEvents);
          e.noTouch.node.setContentSize(cc.winSize.width + 200, cc.winSize.height + 200);
          e.node.addChild(e.noTouch.node);
        }
        e.black_sprite && (e.black_sprite.node.opacity = 0);
        e.black_sprite && cc.tween(e.black_sprite.node).to(.2, {
          opacity: null !== (o = null == t ? void 0 : t.opacity) && void 0 !== o ? o : 204
        }).start();
        if (null != e.panel_window) {
          e.panel_window.stopActionByTag(4660);
          e.panel_window.scale = .1;
          e.panel_window.opacity = 255;
          cc.tween(e.panel_window).parallel(cc.tween().delay(.01).call(function () {
            a && a();
            e.noTouch.node.active = !1;
          }), cc.tween().to(.25, {
            scale: 1,
            opacity: 255
          }, {
            easing: "backOut"
          })).tag(4660).start();
        } else {
          e.node.stopActionByTag(4660);
          cc.tween(e.node).tag(4660).call(function () {
            a && a();
            e.noTouch.node.active = !1;
          }).start();
        }
      };
      e.randomIntNum = function (e, t) {
        return parseInt(Math.random() * (t - e + 1) + e + "", 10);
      };
      e.openWeb = function (t, a, o, n) {
        var i,
          r,
          c = this;
        if (!l.FrameData.SDK_CONF.NO_VIDEO && e.frameData) {
          if (!e.frameData.gameData.noProfitAd && l.FrameData.FRAME_CONF.adAlternateEnabled) {
            for (var s = l.FrameData.saveData.adAlternate, u = [], d = l.FrameData.myCountry.toUpperCase(), p = 0, h = 0, m = l.FrameData.FRAME_CONF.AdAlternateConfig; h < m.length; h++) if (!((F = m[h]).fill_zone.length > 0 && F.fill_zone.findIndex(function (e) {
              return e.toUpperCase() === d;
            }) < 0 || F.fill_ban.length > 0 && F.fill_ban.findIndex(function (e) {
              return e.toUpperCase() === d;
            }) >= 0)) {
              var f = null !== (i = s.totalComplete[F.fill_id]) && void 0 !== i ? i : 0,
                _ = null !== (r = s.todayComplete[F.fill_id]) && void 0 !== r ? r : 0;
              if (!(f >= F.fill_total || _ >= F.fill_daily)) {
                u.push(F);
                p += F.fill_wgt;
              }
            }
            for (var v = Math.random() * p, y = null, g = 0, D = u; g < D.length; g++) {
              var F;
              if (v < (F = D[g]).fill_wgt) {
                y = F;
                break;
              }
              v -= F.fill_wgt;
            }
            null == y ? null == o || o(!1) : e.openWindow("Panel_AdAlternate", {
              id: y.fill_id,
              time: y.fill_time,
              url: y.fill_url,
              reward: t.reward,
              isMax: t.isMax,
              startCallback: function () {
                e.frameData.sdkFuc.earlierStageEvent("ad_success");
                e.logLiftEvent("first_ad");
                null == a || a("web");
              },
              cancelCallback: function () {
                return null == n ? void 0 : n();
              },
              endCallback: function (e) {
                var t, a;
                if (e) {
                  c._lastVideoEndTime = Date.now();
                  var n = l.FrameData.saveData.adAlternate;
                  n.todayComplete[y.fill_id] = (null !== (t = n.todayComplete[y.fill_id]) && void 0 !== t ? t : 0) + 1;
                  n.totalComplete[y.fill_id] = (null !== (a = n.totalComplete[y.fill_id]) && void 0 !== a ? a : 0) + 1;
                  l.FrameData.saveData.adAlternate = n;
                }
                null == o || o(e, "web");
              }
            });
          } else null == o || o(!1);
        } else {
          console.log("skip web");
          this._lastVideoEndTime = Date.now();
          null == o || o(!0, "web");
        }
      };
      e.onAppLifecycleChange = function (t) {
        var a, o;
        if (!this._playingAD && l.FrameData.SDK_CONF.splashEnabled) {
          var n = null === (a = cc.director.getScene()) || void 0 === a ? void 0 : a.getChildByName("__FRAME_SPLASH__");
          if (t) {
            this._appHideTime = Date.now();
            if (!n) return;
            n.zIndex = cc.macro.MAX_ZINDEX;
            n.active = !0;
            cc.director.emit("SHOW_SPLASH");
          } else {
            if (!n) return;
            n.zIndex = cc.macro.MAX_ZINDEX;
            n.active = !0;
            cc.director.emit("SHOW_SPLASH");
            var i = 1e3 * (null !== (o = l.FrameData.SDK_CONF.splashShowInterval) && void 0 !== o ? o : 30);
            if ("loading" === e.frameData.gameData.currentScene || null === this._appHideTime || void 0 === this._appHideTime || Date.now() - this._appHideTime < i) {
              n.active = !1;
              cc.director.emit("HIDE_SPLASH");
              return;
            }
            e.logGameEvent("thepool_sad", {
              object_action: "show",
              object_name: "sad_show",
              object_notes: "hot"
            });
            if (!e.frameData.sdkFuc.isSplashReady()) {
              e.logGameEvent("thepool_sad", {
                object_action: "show",
                object_name: "sad_fail",
                object_notes: "hot"
              });
              n.active = !1;
              cc.director.emit("HIDE_SPLASH");
              return;
            }
            e.frameData.sdkFuc.openSplash(function (t) {
              if (t === r.END || t === r.FAIL) {
                e.logGameEvent("thepool_sad", {
                  object_action: "show",
                  object_name: t === r.FAIL ? "sad_fail" : "sad_succ",
                  object_notes: "hot"
                });
                n.active = !1;
                cc.director.emit("HIDE_SPLASH");
              }
            });
          }
        }
      };
      e.openInters = function (t, a, o, n, i, c) {
        var s = this;
        if (l.FrameData.SDK_CONF.NO_VIDEO || !e.frameData) {
          console.log("skip interstitial");
          this._lastVideoEndTime = Date.now();
          this._playingAD = !1;
          null == o || o("interstitial");
          null == n || n(!0, "interstitial");
        } else {
          this._playingAD = !0;
          e.frameData.gameFuc.openLoad();
          e.frameData.sdkFuc.openInters(t, function (l) {
            console.log("interstitial event - " + r[l]);
            switch (l) {
              case r.END:
                s._lastVideoEndTime = Date.now();
                s._playingAD = !1;
                e.frameData.gameFuc.closeLoad();
                cc.director.emit(e.frameData.ListenKeys.VIDEO_SUC);
                null == n || n(!0, "interstitial");
                break;
              case r.INTERRUPT:
                s._playingAD = !1;
                e.frameData.gameFuc.closeLoad();
                null == i || i();
                break;
              case r.FAIL:
                s._playingAD = !1;
                e.frameData.gameFuc.closeLoad();
                if (a) {
                  if (c) {
                    console.log("video to interstitial failed, try web");
                    s.openWeb(c, o, n, i);
                  } else null == n || n(!1);
                } else {
                  console.log("interstitial failed, try video");
                  s.openVideo(t, !0, o, n, i, c);
                }
                break;
              case r.START:
                e.frameData.gameFuc.closeLoad();
                e.frameData.sdkFuc.earlierStageEvent("ad_success");
                e.logLiftEvent("first_ad");
                null == o || o("interstitial");
            }
          });
        }
      };
      e.playEffect = function (t) {
        if (null == e.soundList[t]) cc.assetManager.getBundle("Frame").load("Sound/" + t, cc.AudioClip, function (a, o) {
          if (o) {
            e.soundList[t] = o;
            return e.playEffect(t);
          }
          cc.warn("没有这个音效", t);
        });else if (e.frameData.gameData.isSound) return cc.audioEngine.playEffect(e.soundList[t], !1);
      };
      e.showToast = function (t) {
        e.loadPrefab("Panel_Toast", function (a) {
          var o = cc.instantiate(a);
          o.getComponent(h.default).text = t;
          o.parent = e.Panel;
        });
      };
      e.getDateDay = function (e) {
        var t = new Date(1e3 * e),
          a = t.getFullYear() + "",
          o = t.getMonth() + 1 > 9 ? String(t.getMonth() + 1) : "0" + (t.getMonth() + 1),
          n = t.getDate() > 9 ? String(t.getDate()) : "0" + t.getDate();
        return parseInt(a + o + n);
      };
      e.addNewHandFinishListen = function (e, t) {
        cc.director.on("NEW_HAND_FINISH", e, t);
      };
      e.getRandomInviteCode = function () {
        var e = Math.ceil(1e4 * Math.random()) + "**",
          t = Array.from({
            length: 26
          }, function (e, t) {
            return String.fromCharCode(65 + t);
          });
        return t[Math.floor(Math.random() * t.length)] + e;
      };
      e.initSplash = function (t) {
        cc.director.off(e.frameData.ListenKeys.APP_LIFECYCLE_CHANGE, this.onAppLifecycleChange, this);
        if (l.FrameData.SDK_CONF.NO_SPLASH) null == t || t();else {
          cc.director.on(e.frameData.ListenKeys.APP_LIFECYCLE_CHANGE, this.onAppLifecycleChange, this);
          var a = cc.director.getScene();
          if (a) a.getChildByName("__FRAME_SPLASH__") ? null == t || t() : cc.assetManager.getBundle("Frame").load("Prefab/Splash", cc.Prefab, function (e, o) {
            var n;
            if (o) {
              var i = cc.instantiate(o);
              i.name = "__FRAME_SPLASH__";
              i.active = !1;
              a.addChild(i, cc.macro.MAX_ZINDEX);
              cc.game.addPersistRootNode(i);
            } else console.error("failed to load splash: " + (null !== (n = null == e ? void 0 : e.message) && void 0 !== n ? n : "unknown reason"));
            null == t || t();
          });else {
            console.error("scene not found");
            null == t || t();
          }
        }
      };
      e.openRating = function (t) {
        if (0 == l.FrameData.saveData.isRating && e.frameData.gameData.passLevel >= l.FrameData.FRAME_CONF.ratingLevel) {
          if (0 == l.FrameData.SDK_CONF.GradeState || l.FrameData.saveData.openRatingInedx > 3) {
            null == t || t();
            return;
          }
          e.openGradeNum++;
          if (l.FrameData.saveData.openRatingInedx > 0 && e.openGradeNum % l.FrameData.FRAME_CONF.intervalGrade != 0) {
            null == t || t();
            return;
          }
          e.openWindow("Panel_Rating", {
            closeCB: t
          });
        } else null == t || t();
      };
      e.setLan = function (t) {
        var a;
        e.getCountry_Language(t);
        (null !== (a = this.i18n) && void 0 !== a ? a : m.default).setLanguage(t);
      };
      e.debugAddBankCoin = function (e) {
        0 !== e && u.default.addCoin(e);
      };
      e.openPanel_Charity = function () {
        e.loadPrefab("RDM_Charity", function (t) {
          cc.instantiate(t).parent = e.Panel;
        });
      };
      e.initCocosAmend = function () {
        var t = this;
        cc.director.on(e.frameData.ListenKeys.FRESH_STRING, function () {
          var e;
          (null !== (e = t.i18n) && void 0 !== e ? e : m.default).updataString();
        });
        if (!cc.__$_WebView_onEnable_$__) {
          cc.__$_WebView_onEnable_$__ = cc.WebView.prototype.onEnable;
          cc.WebView.prototype.onEnable = function () {
            var e = this;
            cc.__$_WebView_onEnable_$__.call(this);
            if (!this.__splashEventListened) {
              cc.director.on("SHOW_SPLASH", function () {
                if (e.node) {
                  if (null === e.__scaleX || void 0 === e.__scaleX) {
                    e.__scaleX = e.node.scaleX;
                    e.node.scaleX = 0;
                  }
                  if (null === e.__scaleY || void 0 === e.__scaleY) {
                    e.__scaleY = e.node.scaleY;
                    e.node.scaleY = 0;
                  }
                }
              });
              cc.director.on("HIDE_SPLASH", function () {
                if (e.node) {
                  if (null !== e.__scaleX && void 0 !== e.__scaleX) {
                    e.node.scaleX = e.__scaleX;
                    e.__scaleX = void 0;
                  }
                  if (null !== e.__scaleY && void 0 !== e.__scaleY) {
                    e.node.scaleY = e.__scaleY;
                    e.__scaleY = void 0;
                  }
                }
              });
              this.__splashEventListened = !0;
            }
          };
        }
      };
      e.logCommonEvent = function (t, a) {
        void 0 === a && (a = null);
        e.frameData.sdkFuc.logCommonEvent(t, a);
      };
      e.getNodeTexture = function (e, t) {
        e instanceof cc.Node && (e = [e]);
        var a = new cc.Node();
        a.parent = t || cc.find("Canvas");
        var o = a.addComponent(cc.Camera);
        o.cullingMask = 4294967295;
        o.depth = 2;
        o.alignWithScreen = !0;
        var n = new cc.RenderTexture();
        n.initWithSize(cc.winSize.width, cc.winSize.height, cc.RenderTexture.DepthStencilFormat.RB_FMT_S8);
        o.targetTexture = n;
        for (var i = 0, r = e; i < r.length; i++) {
          var c = r[i];
          o.render(c);
        }
        a.removeFromParent(!0);
        a.destroy();
        var s = new cc.SpriteFrame(n);
        s.setFlipY(!0);
        return s;
      };
      e.getRes = function (e, t, a) {
        var o = cc.assetManager.getBundle("Frame").get("res/" + e, t);
        o ? a && a(o) : cc.assetManager.getBundle("Frame").load("res/" + e, t, function (e, t) {
          a && a(t);
        });
      };
      e.showWebView = function (e) {
        var t,
          a = cc.director.getScene(),
          o = a.getChildByName("__Frame_web_view__");
        if (!o) {
          o = new cc.Node("__Frame_web_view__");
          a.addChild(o, cc.macro.MAX_ZINDEX);
          o.setParent(a);
        }
        cc.game.isPersistRootNode(o) || cc.game.addPersistRootNode(o);
        o.active = !0;
        var n = e.convertToWorldSpaceAR(cc.Vec3.ZERO),
          i = o.parent.convertToNodeSpaceAR(n);
        o.position = i;
        o.setAnchorPoint(e.anchorX, e.anchorY);
        o.setContentSize(e.width, e.height);
        return null !== (t = o.getComponent(cc.WebView)) && void 0 !== t ? t : o.addComponent(cc.WebView);
      };
      e.Panel = null;
      e.i18n = void 0;
      e.ONLINE_TIME = null;
      e.DATE_DAY = null;
      e.soundList = [];
      e._lastVideoEndTime = 0;
      e._sceneFirstAccessFlags = {};
      e._appHideTime = null;
      e._playingAD = !1;
      e.frameData = null;
      e.currLevel = 0;
      e.openGradeNum = 0;
      o([c.CLICKLOCK()], e, "openVideo", null);
      o([c.CLICKLOCK()], e, "openInters", null);
      o([c.CLICKLOCK()], e, "openWeb", null);
      return e;
    }();
    a.FrameSDK = f;
    cc.js.setClassName("FrameSDK", f);
    cc._RF.pop();
  }, {
    "./CLICKLOCK": "CLICKLOCK",
    "./Frame": "Frame",
    "./FrameData": "FrameData",
    "./Panel_Activity": "Panel_Activity",
    "./Panel_SuperReward": "Panel_SuperReward",
    "./Panel_Task": "Panel_Task",
    "./RDM_Toast": "RDM_Toast",
    "./i18": "i18"
  }],
  Frame: [function (e, t, a) {
    "use strict";

    cc._RF.push(t, "dddddAzYepMRYKId6+xzWjJ", "Frame");
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
    var r = e("./CLICKLOCK"),
      c = e("./FrameData"),
      s = e("./FrameSDK"),
      l = e("./Panel_Feedback"),
      u = cc._decorator,
      d = u.ccclass,
      p = u.property,
      h = function (e) {
        n(t, e);
        function t() {
          var t = null !== e && e.apply(this, arguments) || this;
          t.i18Json = null;
          t.guide = null;
          t.guide2 = null;
          t.hand = null;
          t.hand2 = null;
          t.feedbackInHome = null;
          t.feedbackInGame = null;
          t.passLevel = -1;
          t.currentRound = -1;
          return t;
        }
        a = t;
        t.prototype.onLoad = function () {
          var e = this;
          a.ins = this;
          cc.Camera.main.backgroundColor = cc.color(0, 0, 0, 0);
          s.FrameSDK.Panel = this.node.getChildByName("popUpNode");
          if (!a._i18nLoaded) {
            a._i18nLoaded = !0;
            s.FrameSDK.addi18nArray(this.i18Json.json);
          }
          cc.director.on("FRESH_CREDIT", function (e) {
            e.change > 0 && (c.FrameData.saveData.historyCredit[e.type] += e.change);
          });
          setInterval(function () {
            c.FrameData.saveData.online_total++;
            e.sendLevelMD();
          }, 1e3);
          cc.director.on(s.FrameSDK.frameData.ListenKeys.VIDEO_SUC, function () {
            c.FrameData.saveData.skipADCount = 0;
            c.FrameData.saveData.CashVideoCount++;
            s.FrameSDK.updataVideoQueueUp();
          });
          this.setGuideShow(!1);
          this.setGuide2Show(!1);
          s.FrameSDK.currLevel = s.FrameSDK.frameData.gameData.passLevel + 1;
          this.updateUI();
        };
        t.prototype.onDestroy = function () {
          cc.director.removeAll(this);
          a.ins = null;
        };
        t.prototype.onFeedbackBtnEvent = function () {
          l.default.openPage();
        };
        t.prototype.start = function () {
          s.FrameSDK.frameData.gameData.noProfitAd || s.FrameSDK.frameData.sdkFuc.ppEvent("slotShow");
          s.FrameSDK.logLiftEvent("into_game");
          s.FrameSDK.logLiftEvent("start_game");
          this.sendLevelMD();
          cc.sys.os === cc.sys.OS_ANDROID && "" == c.FrameData.FRAME_CONF.androidRateUrl && console.error('未配置Android评星链接：FrameData.FRAME_CONF.androidRateUrl = ""');
          cc.sys.os === cc.sys.OS_IOS && "" == c.FrameData.FRAME_CONF.iosRateUrl && console.error('未配置iOS评星链接：FrameData.FRAME_CONF.iosRateUrl = ""');
        };
        t.prototype.setGuideShow = function (e) {
          this.guide.active = this.hand.active = e;
          e && s.FrameSDK.logGameEvent("thepool_game_new", {
            object_action: "show",
            object_name: "new_5"
          }, !0);
        };
        t.prototype.updateUI = function () {
          var e = !s.FrameSDK.frameData.gameData.noProfitAd,
            t = s.FrameSDK.frameData.gameData.currentScene;
          this.feedbackInHome.active = e && "home" === t;
          this.feedbackInGame.active = e && "game" === t;
        };
        t.prototype.onBtnEvent = function (e, t) {
          "1" == t && s.FrameSDK.openPanel_Yellow();
        };
        t.prototype.sendLevelMD = function () {
          if (this.passLevel != s.FrameSDK.frameData.gameData.passLevel || this.currentRound != s.FrameSDK.frameData.gameData.currentRound) {
            this.passLevel = s.FrameSDK.frameData.gameData.passLevel;
            this.currentRound = s.FrameSDK.frameData.gameData.currentRound;
            cc.director.emit("UPDATA_LEVEL");
          }
        };
        t.prototype.setGuide2Show = function (e) {
          this.guide2.active = this.hand2.active = e;
          e && cc.director.emit("UNLOCK_CHARITY");
        };
        var a;
        t.ins = null;
        t._i18nLoaded = !1;
        i([p(cc.JsonAsset)], t.prototype, "i18Json", void 0);
        i([p(cc.Node)], t.prototype, "guide", void 0);
        i([p(cc.Node)], t.prototype, "guide2", void 0);
        i([p(cc.Node)], t.prototype, "hand", void 0);
        i([p(cc.Node)], t.prototype, "hand2", void 0);
        i([p(cc.Node)], t.prototype, "feedbackInHome", void 0);
        i([p(cc.Node)], t.prototype, "feedbackInGame", void 0);
        i([r.CLICKLOCK()], t.prototype, "onBtnEvent", null);
        i([r.CLICKLOCK()], t.prototype, "onFeedbackBtnEvent", null);
        return a = i([d], t);
      }(cc.Component);
    a.default = h;
    cc._RF.pop();
  }, {
    "./CLICKLOCK": "CLICKLOCK",
    "./FrameData": "FrameData",
    "./FrameSDK": "FrameSDK",
    "./Panel_Feedback": "Panel_Feedback"
  }],
  GM: [function (e, t, a) {
    "use strict";

    cc._RF.push(t, "1950fqEVMJLJITf4oPGvr0N", "GM");
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
    var r = e("../FrameData"),
      c = e("../FrameSDK"),
      s = e("../i18"),
      l = cc._decorator,
      u = l.ccclass,
      d = l.property,
      p = function (e) {
        n(t, e);
        function t() {
          var t = null !== e && e.apply(this, arguments) || this;
          t.data = null;
          t.mGmNode = null;
          t.btnDetails = null;
          t.LangNode = null;
          t.Toast = null;
          t.bottomNode = null;
          t.editBox = null;
          t.toggleList = [];
          t.lPass = "";
          t.mPassNode = null;
          t.baseVersion = "1.0.0";
          t.coinType = [];
          t.baseType = -1;
          t.baseData = {
            6: [100, 1e3, 1e4, 1e5],
            4: [1, 2, 3, 4],
            8: [1, 10, 50, 100],
            9: [100, 1e3, 1e4, 1e5],
            10: [100, 1e3, 1e4, 1e5]
          };
          return t;
        }
        t.prototype.onDisable = function () {};
        t.prototype.initLang = function () {
          this.LangNode.active = !0;
          var e = this.LangNode.getChildByName("mainNode"),
            t = cc.instantiate(e.children[0]);
          e.removeAllChildren();
          for (var a = 0, o = r.FrameData.SDK_CONF.COUNTRY_LIST; a < o.length; a++) {
            var n = o[a],
              i = cc.instantiate(t);
            i.getChildByName("Label").getComponent(cc.Label).string = n.country + " - " + n.language;
            i.getComponent(cc.Button).clickEvents[0].customEventData = n.language + "_" + n.country;
            e.addChild(i);
          }
        };
        t.open = function (e) {
          var t = this;
          void 0 === e && (e = null);
          if ("" != r.FrameData.toolKey) {
            this.toutnum++;
            if (this.toutnum >= 5 && 0 == this.isopen) {
              this.isopen = !0;
              c.FrameSDK.loadPrefab("Panel_GM", function (a) {
                cc.instantiate(a).parent = c.FrameSDK.Panel;
                t.isopen = !1;
                e && e();
              });
            }
          }
        };
        t.prototype.onLoad = function () {
          this.LangNode.active = !1;
          this.Toast.active = !1;
          this.mPassNode.active = "" != r.FrameData.toolKey;
          this.coinType = Object.keys(r.FrameData.saveData.credit);
          "" == r.FrameData.toolKey && this.node.destroy();
        };
        t.prototype.closePage = function () {
          this.node.destroy();
        };
        t.prototype.setLang = function (e, t) {
          c.FrameSDK.setLan(t);
          this.LangNode.active = !1;
          this.initBottomData();
        };
        t.prototype.onEnable = function () {
          this.lPass = "";
          this.toggleList[1].isChecked = r.FrameData.SDK_CONF.NO_VIDEO;
          this.toggleList[3].isChecked = r.FrameData.isTest;
        };
        t.prototype.clickGm = function (e) {
          switch (e.target.name) {
            case "0":
              break;
            case "1":
              r.FrameData.SDK_CONF.NO_VIDEO = e.target.getComponent(cc.Toggle).isChecked;
              break;
            case "2":
              break;
            case "3":
              r.FrameData.isTest = e.target.getComponent(cc.Toggle).isChecked;
              cc.director.emit("showTest");
              break;
            case "4":
              this.initLang();
              break;
            case "5":
              cc.sys.localStorage.clear();
              cc.assetManager.cacheManager.clearCache();
              cc.game.removeAll(cc.game.EVENT_SHOW);
              cc.game.removeAll(cc.game.EVENT_HIDE);
              cc.EventTarget.prototype.emit = function () {};
              cc.sys.isBrowser ? location.reload() : this.showToast("请手动重启游戏！");
              break;
            case "6":
            case "7":
            case "8":
            case "9":
            case "10":
              this.initBtnDetail(parseInt(e.target.name));
          }
        };
        t.prototype.initBtnDetail = function (e) {
          if (this.baseType != e) {
            this.btnDetails.active = !0;
            if (this.btnDetails.active) {
              this.baseType = e;
              this.btnDetails.getChildByName("0").getComponentInChildren(cc.Label).string = "+" + this.baseData[e][0];
              this.btnDetails.getChildByName("1").getComponentInChildren(cc.Label).string = "+" + this.baseData[e][1];
              this.btnDetails.getChildByName("2").getComponentInChildren(cc.Label).string = "+" + this.baseData[e][2];
              this.btnDetails.getChildByName("3").getComponentInChildren(cc.Label).string = "+" + this.baseData[e][3];
            }
          } else this.btnDetails.active = !this.btnDetails.active;
        };
        t.prototype.showToast = function (e) {
          var t = this;
          this.Toast.active = !0;
          this.Toast.stopAllActions();
          this.Toast.position = cc.v3(0, 0);
          this.Toast.opacity = 255;
          this.Toast.getComponentInChildren(cc.Label).string = e;
          this.Toast.runAction(cc.sequence(cc.delayTime(.5), cc.spawn(cc.moveBy(.1, cc.v2(0, 200)), cc.fadeOut(.1)), cc.callFunc(function () {
            t.Toast.active = !1;
          })));
        };
        t.prototype.initBottomData = function () {
          this.bottomNode.getChildByName("1").getComponent(cc.Label).string = "GM_VERSION:NULL";
          this.bottomNode.getChildByName("2").getComponent(cc.Label).string = "VERSION:NULL";
          this.bottomNode.getChildByName("3").getComponent(cc.Label).string = "USER_ID:NULL";
          this.bottomNode.getChildByName("4").getComponent(cc.Label).string = "Country:" + r.FrameData.myCountry;
          this.bottomNode.getChildByName("5").getComponent(cc.Label).string = "Languge:" + s.default.myLanguge;
          this.bottomNode.getChildByName("6").getComponent(cc.Label).string = "PG:NULL";
          this.bottomNode.getChildByName("7").getComponent(cc.Label).string = "Code:NULL";
          this.bottomNode.getChildByName("8").getComponent(cc.Label).string = "SDK_VERSION:NULL";
          this.bottomNode.getChildByName("9").getComponent(cc.Label).string = "Accumulated online time:NULL";
          this.bottomNode.getChildByName("10").getComponent(cc.Label).string = "Cumulative H5 duration:NULL";
          this.bottomNode.getChildByName("11").getComponent(cc.Label).string = "Cumulative login days:" + r.FrameData.saveData.loginDays;
          this.bottomNode.getChildByName("12").getComponent(cc.Label).string = "Cumulative video count:NULL";
          this.bottomNode.getChildByName("13").getComponent(cc.Label).string = "Total number of screen inserts:NULL";
        };
        t.prototype.addBaseData = function (e) {
          var t = parseInt(e.target.name);
          5 == t && (this.baseData[this.baseType][t] = parseInt(this.editBox.string) ? parseInt(this.editBox.string) : 0);
          switch (this.baseType) {
            case 6:
              for (var a = 0; a < this.coinType.length; a++) r.FrameData.saveData.credit[this.coinType[a]] += this.baseData[this.baseType][t];
              this.showToast("ICON +" + this.baseData[this.baseType][t]);
              break;
            case 7:
              r.FrameData.saveData.loginDays += this.baseData[this.baseType][t];
              this.showToast("Line Day +" + this.baseData[this.baseType][t]);
              break;
            case 8:
              r.FrameData.saveData.CashVideoCount += this.baseData[this.baseType][t];
              cc.director.emit(c.FrameSDK.frameData.ListenKeys.VIDEO_SUC);
              this.showToast("AD NUM+" + this.baseData[this.baseType][t]);
          }
          this.initBottomData();
        };
        t.prototype.clickPass = function (e, t) {
          if ("OK" == t) {
            this.lPass = "";
            this.showToast("Password error");
          } else {
            this.lPass += t;
            if (this.lPass == r.FrameData.toolKey) {
              this.mPassNode.active = !1;
              this.initBottomData();
              this.btnDetails.active = !1;
            }
          }
        };
        t.toutnum = 0;
        t.isopen = !1;
        i([d(cc.Node)], t.prototype, "mGmNode", void 0);
        i([d(cc.Node)], t.prototype, "btnDetails", void 0);
        i([d(cc.Node)], t.prototype, "LangNode", void 0);
        i([d(cc.Node)], t.prototype, "Toast", void 0);
        i([d(cc.Node)], t.prototype, "bottomNode", void 0);
        i([d(cc.EditBox)], t.prototype, "editBox", void 0);
        i([d(cc.Toggle)], t.prototype, "toggleList", void 0);
        i([d(cc.Node)], t.prototype, "mPassNode", void 0);
        return i([u], t);
      }(cc.Component);
    a.default = p;
    cc._RF.pop();
  }, {
    "../FrameData": "FrameData",
    "../FrameSDK": "FrameSDK",
    "../i18": "i18"
  }],
  Item_Record: [function (e, t, a) {
    "use strict";

    cc._RF.push(t, "01185GVtyZJNJxjXAob42yC", "Item_Record");
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
    var r = cc._decorator,
      c = r.ccclass,
      s = r.property,
      l = function (e) {
        n(t, e);
        function t() {
          var t = null !== e && e.apply(this, arguments) || this;
          t.rich = null;
          return t;
        }
        t.prototype.setData = function (e) {
          var t = "<color=#F18321>";
          if ("tkey_209" == e.key) {
            t = "<color=#F18321>";
            this.rich.string = e.key + "??&value1==<color =#4480BE>" + e.peopleCount + "</color>";
          } else if ("tkey_210" == e.key) {
            t = "<color=#C23E3E>";
            this.rich.string = e.key + "??&value1==<color =#4480BE>" + e.account + "</color>&&value2==<color =#4480BE>" + e.peopleCount + "</color>";
          } else if ("tkey_211" == e.key) {
            t = "<color=#249A50>";
            this.rich.string = e.key + "??&value1==<color =#4480BE>" + e.account + "</color>&&value2==<color =#4480BE>" + e.peopleCount + "</color>";
          }
          var a = this.rich.string.indexOf(":");
          -1 == a && (a = this.rich.string.indexOf(":"));
          this.rich.string = -1 != a ? t + this.rich.string.substring(0, a + 1) + "</color>" + this.rich.string.substring(a + 1, this.rich.string.length) : "" + this.rich.string;
        };
        i([s(cc.RichText)], t.prototype, "rich", void 0);
        return i([c], t);
      }(cc.Component);
    a.default = l;
    cc._RF.pop();
  }, {}],
  Level_Bar: [function (e, t, a) {
    "use strict";

    cc._RF.push(t, "b78290EagNAHo4oBb3dG399", "Level_Bar");
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
    var r = e("./FrameData"),
      c = e("./FrameSDK"),
      s = cc._decorator,
      l = s.ccclass,
      u = s.property,
      d = function (e) {
        n(t, e);
        function t() {
          var t = null !== e && e.apply(this, arguments) || this;
          t.maskNode = null;
          t.levelRootNode = null;
          t.roundRichText = null;
          t.tipNode = null;
          t.completedSpriteFrame = null;
          t.highlightSpriteFrame = null;
          t.normalSpriteFrame = null;
          t.targetSpriteFrame = null;
          t.changeWithScene = !0;
          t._period = 1;
          t._cacheVec3 = cc.v3();
          return t;
        }
        t.prototype._updateUI = function () {
          for (var e, t, a = c.FrameSDK.frameData.gameData.passLevel, o = 1, n = Number.MAX_SAFE_INTEGER, i = 0, s = r.FrameData.FRAME_CONF.CoinConf; i < s.length; i++) {
            var l = s[i];
            if (a < l.rdm_1) n = Math.min(n, l.rdm_1);else {
              o = Math.max(o, l.rdm_1);
              a < l.rdm_3 ? n = Math.min(n, l.rdm_3) : o = Math.max(o, l.rdm_3);
            }
          }
          if (n === Number.MAX_SAFE_INTEGER) {
            this._period = 1;
            n = c.FrameSDK.frameData.gameData.passLevel + 1;
            this.tipNode.opacity = 0;
          } else this.tipNode.opacity = 255;
          var u = Math.floor(Math.max(0, a - o) / this._period),
            d = o + this._period * u,
            p = n - d;
          p <= 1 && (p = n - (d = Math.max(1, d - this._period)));
          for (var h = this.levelRootNode.children, m = h.length, f = 0; f < m - 1; f++) {
            var _ = h[f],
              v = d + f;
            _.active = f < p;
            cc.find("levelLabel", _).getComponent(cc.Label).string = "" + v;
            if (v <= a) {
              _.getComponent(cc.Sprite).spriteFrame = this.completedSpriteFrame;
              cc.find("gou", _).active = !0;
            } else {
              _.getComponent(cc.Sprite).spriteFrame = v === a + 1 ? this.highlightSpriteFrame : this.normalSpriteFrame;
              cc.find("gou", _).active = !1;
            }
          }
          var y = h[m - 1];
          cc.find("levelLabel", y).getComponent(cc.Label).string = "" + n;
          cc.find("gou", y).active = n <= a;
          this.tipNode.opacity > 0 ? y.getComponent(cc.Sprite).spriteFrame = this.targetSpriteFrame : y.getComponent(cc.Sprite).spriteFrame = n <= a ? this.completedSpriteFrame : n === a + 1 ? this.highlightSpriteFrame : this.normalSpriteFrame;
          var g = a + 1 === n ? m - 1 : a + 1 - d,
            D = c.FrameSDK.frameData.gameData.currentRound,
            F = c.FrameSDK.frameData.gameData.totalRound;
          if (g < 0) this.maskNode.width = 0;else if (g >= m) this.maskNode.width = this.maskNode.parent.width;else {
            h[g].convertToWorldSpaceAR(cc.Vec3.ZERO, this._cacheVec3);
            this.maskNode.convertToNodeSpaceAR(this._cacheVec3, this._cacheVec3);
            this.maskNode.width = this._cacheVec3.x;
          }
          this.roundRichText.string = "<outline color= #C16711 width=2>pkey_001</outline>??&value1==<color= #86FF04>" + D + "</c>&value2==" + F;
          this.roundRichText.node.parent.opacity = F > 1 && a + 1 <= n ? 255 : 0;
          this.roundRichText.node.parent.x = null !== (t = null === (e = h[g]) || void 0 === e ? void 0 : e.x) && void 0 !== t ? t : 99999;
          F > 1 && g === m - 1 && (this.tipNode.opacity = 0);
          if (this.changeWithScene) {
            this.node.active = !c.FrameSDK.frameData.gameData.noProfitAd;
            var b = c.FrameSDK.frameData.gameData.currentScene;
            this.node.scale = "game" === b ? .8 : 0;
          }
        };
        t.prototype.onLoad = function () {
          cc.director.on("UPDATA_LEVEL", this._updateUI, this);
          this._period = Math.max(1, this.levelRootNode.children.length - 2);
          cc.tween(this.roundRichText.node.parent).by(1, {
            y: 3
          }, {
            easing: "sineInOut"
          }).by(1, {
            y: -3
          }, {
            easing: "sineInOut"
          }).union().repeatForever().start();
          cc.tween(this.tipNode).to(.5, {
            scale: .9
          }, {
            easing: "sineInOut"
          }).to(.5, {
            scale: 1
          }, {
            easing: "sineInOut"
          }).union().repeatForever().start();
          this._updateUI();
        };
        i([u(cc.Node)], t.prototype, "maskNode", void 0);
        i([u(cc.Node)], t.prototype, "levelRootNode", void 0);
        i([u(cc.RichText)], t.prototype, "roundRichText", void 0);
        i([u(cc.Node)], t.prototype, "tipNode", void 0);
        i([u(cc.SpriteFrame)], t.prototype, "completedSpriteFrame", void 0);
        i([u(cc.SpriteFrame)], t.prototype, "highlightSpriteFrame", void 0);
        i([u(cc.SpriteFrame)], t.prototype, "normalSpriteFrame", void 0);
        i([u(cc.SpriteFrame)], t.prototype, "targetSpriteFrame", void 0);
        i([u], t.prototype, "changeWithScene", void 0);
        return i([l], t);
      }(cc.Component);
    a.default = d;
    cc._RF.pop();
  }, {
    "./FrameData": "FrameData",
    "./FrameSDK": "FrameSDK"
  }],
  Panel_Account: [function (e, t, a) {
    "use strict";

    cc._RF.push(t, "896d9iccSVHzZ/+xLAfbbMI", "Panel_Account");
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
    var r = e("./FrameData"),
      c = e("./FrameSDK"),
      s = e("./PaymentItem"),
      l = cc._decorator,
      u = l.ccclass,
      d = l.property,
      p = function (e) {
        n(t, e);
        function t() {
          var t = null !== e && e.apply(this, arguments) || this;
          t.panel_window = null;
          t.cashLabel = null;
          t.paymentToggleContainer = null;
          t.editbox = null;
          t.viewData = null;
          t._paymentIDs = [];
          t.hideTime = 0;
          return t;
        }
        t.prototype.onBtnEvent = function (e, t) {
          var a, o, n;
          if ("1" == t) {
            if (!(this.editbox.string.trim().length > 0)) {
              c.FrameSDK.showToast("skey_024");
              return;
            }
            var i = this.paymentToggleContainer.toggleItems.findIndex(function (e) {
              return e.isChecked;
            });
            r.FrameData.saveData.account = this.editbox.string.trim();
            r.FrameData.saveData.paymentID = null !== (a = this._paymentIDs[i]) && void 0 !== a ? a : -1;
            null === (n = (o = this.viewData).closeCB) || void 0 === n || n.call(o);
          }
          this.close();
        };
        t.prototype.onLoad = function () {
          c.FrameSDK.openEffect(this);
        };
        t.prototype.close = function () {
          if (Date.now() - this.hideTime <= 300) console.log("wait!!!，return");else {
            this.hideTime = Date.now();
            c.FrameSDK.closeEffect(this, null);
          }
        };
        t.prototype.onEnable = function () {
          var e,
            t = this;
          this.cashLabel.string = null !== (e = this.viewData.numStr) && void 0 !== e ? e : "";
          this._paymentIDs = r.FrameData.CountryConf.cash_id.slice(0, 4);
          this.paymentToggleContainer.node.children.forEach(function (e, a) {
            var o;
            return e.getComponent(s.default).paymentID = null !== (o = t._paymentIDs[a]) && void 0 !== o ? o : -1;
          });
        };
        i([d(cc.Node)], t.prototype, "panel_window", void 0);
        i([d(cc.Label)], t.prototype, "cashLabel", void 0);
        i([d(cc.ToggleContainer)], t.prototype, "paymentToggleContainer", void 0);
        i([d(cc.EditBox)], t.prototype, "editbox", void 0);
        return i([u], t);
      }(cc.Component);
    a.default = p;
    cc._RF.pop();
  }, {
    "./FrameData": "FrameData",
    "./FrameSDK": "FrameSDK",
    "./PaymentItem": "PaymentItem"
  }],
  Panel_ActivityGuide: [function (e, t, a) {
    "use strict";

    cc._RF.push(t, "f4bc4cG5QxGmKVHx3xNLpKK", "Panel_ActivityGuide");
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
    var r = e("./FrameSDK"),
      c = cc._decorator,
      s = c.ccclass,
      l = c.property,
      u = function (e) {
        n(t, e);
        function t() {
          var t = null !== e && e.apply(this, arguments) || this;
          t.bg = null;
          t.bankLogo = null;
          t.levelLogo = null;
          t.rtx_tips1 = null;
          t.tips2 = null;
          t.rtx_tips2 = null;
          t.progressBar = null;
          t.progressLabel = null;
          t.viewData = null;
          return t;
        }
        t.prototype.onEnable = function () {
          r.FrameSDK.openEffect(this);
        };
        t.prototype.onLoad = function () {
          var e = this,
            t = .5 * cc.winSize.width + .5 * this.bg.width;
          this.bg.x = t;
          this.bankLogo.active = "bank" === this.viewData.logoType;
          this.levelLogo.active = "levelReward" === this.viewData.logoType;
          this.rtx_tips1.node.active = 1 == this.viewData.type;
          this.rtx_tips1.string = this.viewData.text;
          this.tips2.active = 2 == this.viewData.type;
          if (2 == this.viewData.type) {
            this.rtx_tips2.string = this.viewData.text;
            this.progressBar.progress = this.viewData.total <= 0 ? 0 : this.viewData.now / this.viewData.total;
            this.progressLabel.string = this.viewData.now + "/" + this.viewData.total;
          }
          r.FrameSDK.playEffect("rewardshow");
          cc.tween(this.bg).to(.7, {
            x: 0
          }, {
            easing: "backOut"
          }).delay(this.viewData.dtime || 1).to(.7, {
            x: -t
          }, {
            easing: "backIn"
          }).call(function () {
            r.FrameSDK.closeEffect(e, null);
          }).start();
        };
        t.prototype.onDisable = function () {
          var e, t;
          null === (t = (e = this.viewData).closeCB) || void 0 === t || t.call(e);
        };
        i([l(cc.Node)], t.prototype, "bg", void 0);
        i([l(cc.Node)], t.prototype, "bankLogo", void 0);
        i([l(cc.Node)], t.prototype, "levelLogo", void 0);
        i([l(cc.RichText)], t.prototype, "rtx_tips1", void 0);
        i([l(cc.Node)], t.prototype, "tips2", void 0);
        i([l(cc.RichText)], t.prototype, "rtx_tips2", void 0);
        i([l(cc.ProgressBar)], t.prototype, "progressBar", void 0);
        i([l(cc.Label)], t.prototype, "progressLabel", void 0);
        return i([s], t);
      }(cc.Component);
    a.default = u;
    cc._RF.pop();
  }, {
    "./FrameSDK": "FrameSDK"
  }],
  Panel_Activity: [function (e, t, a) {
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
    var r = e("./FrameData"),
      c = e("./FrameSDK"),
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
  }, {
    "./FrameData": "FrameData",
    "./FrameSDK": "FrameSDK"
  }],
  Panel_AdAlternate: [function (e, t, a) {
    "use strict";

    cc._RF.push(t, "c16cbArfQZMzYudIKN0sbJk", "Panel_AdAlternate");
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
    var r = e("./FrameSDK"),
      c = e("./WebViewManager"),
      s = cc._decorator,
      l = s.ccclass,
      u = s.property,
      d = function (e) {
        n(t, e);
        function t() {
          var t = null !== e && e.apply(this, arguments) || this;
          t.rewardLabel = null;
          t.maxFlagNode = null;
          t.tipLabel = null;
          t.adProgressBar = null;
          t.adProgressLabel = null;
          t.closeButtonNode = null;
          t.countdownProgressBar = null;
          t.countdownLabel = null;
          t.webViewAttachedNode = null;
          t.viewData = null;
          t._scheduleFunc = null;
          t._targetTime = 0;
          t._success = !0;
          t.hideTime = 0;
          return t;
        }
        t.prototype._stopSchedule = function () {
          if (null !== this._scheduleFunc && void 0 !== this._scheduleFunc) {
            this.unschedule(this._scheduleFunc);
            this._scheduleFunc = null;
          }
        };
        t.prototype.onEnable = function () {
          var e = this;
          r.FrameSDK.openEffect(this);
          this.rewardLabel.string = "" + r.FrameSDK.convertCoinToStr(this.viewData.reward, !1);
          this.maxFlagNode.active = this.viewData.isMax;
          this.tipLabel.string = "skey_147";
          this.adProgressBar.progress = 0;
          this.adProgressLabel.string = "skey_139??&value1==0%";
          this.closeButtonNode.active = !1;
          this.countdownProgressBar.node.active = !0;
          this.countdownProgressBar.progress = 0;
          this.countdownLabel.string = this.viewData.time + "s";
          this.scheduleOnce(function () {
            var t, a;
            null === (a = (t = e.viewData).startCallback) || void 0 === a || a.call(t);
            c.default.showWebView(e.webViewAttachedNode, e.viewData.url, e);
          });
        };
        t.prototype.onDisable = function () {
          c.default.hideWebView(this.webViewAttachedNode);
        };
        t.prototype.onWebViewLoad = function (e) {
          var t = this;
          this._stopSchedule();
          if (e) {
            this._targetTime = Date.now() + 1e3 * this.viewData.time;
            this._success = !0;
            this.schedule(this._scheduleFunc = function () {
              var e = Math.max(0, t._targetTime - Date.now());
              t.adProgressBar.progress = (1e3 * t.viewData.time - e) / t.viewData.time / 1e3;
              t.adProgressLabel.string = "skey_139??&value1==" + Math.floor(100 * t.adProgressBar.progress) + "%";
              t.countdownProgressBar.progress = t.adProgressBar.progress;
              t.countdownLabel.string = Math.ceil(e / 1e3) + "s";
              if (e <= 0) {
                t._stopSchedule();
                t.tipLabel.string = "skey_148";
                t.closeButtonNode.active = !0;
                t.countdownProgressBar.node.active = !1;
              }
            });
          } else {
            this._targetTime = 0;
            this._success = !1;
            this.tipLabel.string = "skey_148";
            this.adProgressBar.progress = 1;
            this.adProgressLabel.string = "skey_139??&value1==100%";
            this.closeButtonNode.active = !0;
            this.countdownProgressBar.node.active = !1;
          }
        };
        t.prototype.onTouchCloseTips = function () {
          if (Date.now() - this.hideTime <= 300) console.log("wait!!!，return");else {
            this.hideTime = Date.now();
            var e = this.viewData.endCallback,
              t = this._success;
            r.FrameSDK.closeEffect(this, function () {
              return null == e ? void 0 : e(t);
            });
          }
        };
        i([u(cc.Label)], t.prototype, "rewardLabel", void 0);
        i([u(cc.Node)], t.prototype, "maxFlagNode", void 0);
        i([u(cc.Label)], t.prototype, "tipLabel", void 0);
        i([u(cc.ProgressBar)], t.prototype, "adProgressBar", void 0);
        i([u(cc.Label)], t.prototype, "adProgressLabel", void 0);
        i([u(cc.Node)], t.prototype, "closeButtonNode", void 0);
        i([u(cc.ProgressBar)], t.prototype, "countdownProgressBar", void 0);
        i([u(cc.Label)], t.prototype, "countdownLabel", void 0);
        i([u(cc.Node)], t.prototype, "webViewAttachedNode", void 0);
        return i([l], t);
      }(cc.Component);
    a.default = d;
    cc._RF.pop();
  }, {
    "./FrameSDK": "FrameSDK",
    "./WebViewManager": "WebViewManager"
  }],
  Panel_Award_1: [function (e, t, a) {
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
    var r = e("./AinanEff"),
      c = e("./CLICKLOCK"),
      s = e("./FrameData"),
      l = e("./FrameSDK"),
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
  }, {
    "./AinanEff": "AinanEff",
    "./CLICKLOCK": "CLICKLOCK",
    "./FrameData": "FrameData",
    "./FrameSDK": "FrameSDK"
  }],
  Panel_Award_3: [function (e, t, a) {
    "use strict";

    cc._RF.push(t, "5af21Q20bpLLaNuTW5xN1bF", "Panel_Award_3");
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
    var r = e("./AinanEff"),
      c = e("./CLICKLOCK"),
      s = e("./FrameData"),
      l = e("./FrameSDK"),
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
          this.getYCoin = s.FrameData.getCoinOutNum("draw");
          (e = this.timeArray).push.apply(e, s.FrameData.getCoinOutNum("drawRate"));
          var a = s.FrameData.getCoinOutNum("free");
          l.FrameSDK.logCommonEvent("c_ad_event", {
            action: "exposure",
            type: "video",
            placement: "reward_1"
          });
          l.FrameSDK.logGameEvent("thepool_game_rew", {
            object_action: "show",
            object_name: "rew_show",
            object_notes: "reward_1"
          });
          l.FrameSDK.frameData.sdkFuc.ppEvent(this.adData.isFree ? "freeShow" : "popupShow");
          l.FrameSDK.openEffect(this);
          l.FrameSDK.playEffect("rewardshow");
          this.node.opacity = 255;
          this.titleSkeleton.setAnimation(0, "start", !1);
          this.titleSkeleton.addAnimation(0, "loop", !0);
          this.contentSkeleton.setAnimation(0, "start", !1);
          this.contentSkeleton.addAnimation(0, "loop", !0);
          this.labelRootNode.children.forEach(function (e, a) {
            var o;
            e.getComponent(cc.Label).string = "x" + (null !== (o = t.timeArray[a]) && void 0 !== o ? o : 1);
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
          this.commonActionButton.getComponentInChildren(cc.Label).string = "skey_034 " + l.FrameSDK.convertCoinToStr(a);
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
          var t = s.FrameData.getCoinOutNum("free");
          l.FrameSDK.logGameEvent("thepool_game_rew", {
            object_action: "show",
            object_name: "rew_free",
            object_notes: "reward_1"
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
          if (Date.now() - this.hideTime <= 300) console.log("wait!!!，return");else {
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
          l.FrameSDK.frameData.sdkFuc.ppEvent(this.adData.isFree ? "freeClaim" : "claim");
          l.FrameSDK.logCommonEvent("c_ad_event", {
            action: "touch",
            type: "video",
            placement: "reward_1"
          });
          l.FrameSDK.logGameEvent("thepool_game_rew", {
            object_action: "show",
            object_name: "rew_ad",
            object_notes: "reward_1"
          });
          this.pointerIndicator.pauseAllActions();
          this.setUi();
          var t = this.getYCoin * this.beishe,
            a = function (a) {
              l.FrameSDK.frameData.sdkFuc.ppEvent(e.adData.isFree ? "freeCollected" : "collected");
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
                return l.FrameSDK.playEffect("rate_show");
              }).delay(.2).call(function () {
                e.ribbonSkeleton.enabled = !0;
                e.ribbonSkeleton.setAnimation(0, "caidai", !1);
                l.FrameSDK.playEffect("pool_cashdone");
              }).delay(1).call(function () {
                var a;
                l.FrameSDK.addCoin(t, o, n, null === (a = e.viewData) || void 0 === a ? void 0 : a.closeCB);
                e.close();
              }).start();
            };
          this.noTouch.node.active = !0;
          this.adData.isFree ? a(!1) : l.FrameSDK.openVideo("reward_1", !1, function (e) {
            l.FrameSDK.logGameEvent("thepool_game_ad", {
              object_action: "show",
              object_name: "reward_1",
              object_notes: "video" === e ? "video" : "web" === e ? "web" : "inter"
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
        i([p(sp.Skeleton)], t.prototype, "titleSkeleton", void 0);
        i([p(sp.Skeleton)], t.prototype, "contentSkeleton", void 0);
        i([p(cc.Node)], t.prototype, "baseCoinNode", void 0);
        i([p(cc.Label)], t.prototype, "baseCoinLabel", void 0);
        i([p(cc.Node)], t.prototype, "arrowNode", void 0);
        i([p(cc.Node)], t.prototype, "maxCoinNode", void 0);
        i([p(cc.Label)], t.prototype, "maxCoinLabel", void 0);
        i([p(cc.Node)], t.prototype, "finalCoinNode", void 0);
        i([p(cc.Label)], t.prototype, "finalCoinLabel", void 0);
        i([p(cc.Node)], t.prototype, "labelRootNode", void 0);
        i([p(cc.Node)], t.prototype, "multiplierDisplay", void 0);
        i([p(cc.Node)], t.prototype, "pointerIndicator", void 0);
        i([p(cc.Node)], t.prototype, "adBannerButton", void 0);
        i([p(cc.Label)], t.prototype, "adFrequencyCounter", void 0);
        i([p(cc.Node)], t.prototype, "commonActionButton", void 0);
        i([p(cc.Node)], t.prototype, "sian", void 0);
        i([p(cc.Node)], t.prototype, "noAdBadgeIcon", void 0);
        i([p(cc.Node)], t.prototype, "adBadgeIcon", void 0);
        i([p(sp.Skeleton)], t.prototype, "ribbonSkeleton", void 0);
        i([c.CLICKLOCK()], t.prototype, "click_AD", null);
        i([c.CLICKLOCK()], t.prototype, "click_Common", null);
        return i([d], t);
      }(cc.Component);
    a.default = h;
    cc._RF.pop();
  }, {
    "./AinanEff": "AinanEff",
    "./CLICKLOCK": "CLICKLOCK",
    "./FrameData": "FrameData",
    "./FrameSDK": "FrameSDK"
  }],
  Panel_Award_5: [function (e, t, a) {
    "use strict";

    cc._RF.push(t, "5e3c6l2ucJMTqZymDAunnLb", "Panel_Award_5");
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
    var r = e("./CLICKLOCK"),
      c = e("./FrameData"),
      s = e("./FrameSDK"),
      l = cc._decorator,
      u = l.ccclass,
      d = l.property,
      p = function (e) {
        n(t, e);
        function t() {
          var t = null !== e && e.apply(this, arguments) || this;
          t.panel_window = null;
          t.tipsRichText = null;
          t.layout = null;
          t.externalRootNode = null;
          t.boxNode = null;
          t.boxBonusLabels = [];
          t.homeButtonNode = null;
          t.continueButtonNode = null;
          t.viewData = null;
          t.isTouch = !0;
          t.numRanking = {};
          t.hideTime = 0;
          return t;
        }
        t.prototype.onTouchCloseTips = function () {
          if (Date.now() - this.hideTime <= 300) console.log("wait!!!，return");else {
            this.hideTime = Date.now();
            s.FrameSDK.closeEffect(this, null);
          }
        };
        t.prototype.click_continue = function () {
          var e, t;
          if (this.isTouch) {
            this.isTouch = !1;
            this.onTouchCloseTips();
            null === (t = (e = this.viewData).closeCB) || void 0 === t || t.call(e, "continue");
          }
        };
        t.prototype.onLoad = function () {
          if (null == c.FrameData.saveData.award5 || Object.keys(c.FrameData.saveData.award5.open).length >= c.FrameData.saveData.award5.numList.length) {
            var e = [],
              t = c.FrameData.getCoinOutNum("boxFixed");
            if (t && Array.isArray(t) && t.length >= 3) {
              e.push.apply(e, t);
              e.sort(function () {
                return Math.random() - .5;
              });
            } else for (var a = c.FrameData.getCoinOutNum("boxRandom"), o = 0; o < 3; o++) e[o] = s.FrameSDK.randomInt(a);
            c.FrameData.saveData.award5 = {
              numList: e,
              reward: c.FrameData.getCoinOutNum("superAd"),
              open: {}
            };
          }
        };
        t.prototype.openBox = function (e) {
          var t = this;
          if (!c.FrameData.saveData.award5.open[e] && this.isTouch) {
            this.isTouch = !1;
            s.FrameSDK.frameData.sdkFuc.ppEvent("freeClaim");
            c.FrameData.saveData.award5.open[e] = 1;
            Object.keys(c.FrameData.saveData.award5.open).length >= c.FrameData.saveData.award5.numList.length && cc.director.emit("SUPER_AWARD", "show");
            var a = c.FrameData.saveData.award5.numList[e],
              o = this.boxNode.children[e],
              n = o.getComponent(sp.Skeleton);
            n.setAnimation(0, "step" + this.numRanking[a] + "_4", !1);
            n.addAnimation(0, "step" + this.numRanking[a] + "_5", !0);
            s.FrameSDK.playEffect("pool_zhuanpan");
            cc.Tween.stopAllByTarget(o);
            cc.tween(o).delay(.7).call(function () {
              return s.FrameSDK.playEffect("done_coin_arrange");
            }).delay(1.2).call(function () {
              var o, n;
              t.boxBonusLabels[e].node.parent.active = !0;
              t.boxBonusLabels[e].string = "" + s.FrameSDK.convertCoinToStr(a);
              null === (n = (o = t.viewData).unlockCountUpdateFunc) || void 0 === n || n.call(o, Object.keys(c.FrameData.saveData.award5.open).length);
              s.FrameSDK.logGameEvent("thepool_game_new", {
                object_action: "show",
                object_name: "new_16"
              }, !0);
              s.FrameSDK.frameData.sdkFuc.ppEvent("freeCollected");
              if (Object.keys(c.FrameData.saveData.award5.open).length >= c.FrameData.saveData.award5.numList.length) {
                var i = t.viewData.superExternalNode ? "Panel_Award_Super2" : "Panel_Award_Super1",
                  r = {
                    bonus: c.FrameData.saveData.award5.reward,
                    freeBonus: c.FrameData.getCoinOutNum("superFree"),
                    externalNode: t.viewData.superExternalNode,
                    param: t.viewData.param,
                    closeCB: function () {
                      return t._showButtons();
                    }
                  };
                c.FrameData.saveData.award5 = null;
                s.FrameSDK.addCoin(a, 0, 0, function () {
                  s.FrameSDK.openWindow(i, r);
                });
              } else s.FrameSDK.addCoin(a, 0, 0, function () {
                return t._showButtons();
              });
            }).start();
          }
        };
        t.prototype._showButtons = function () {
          var e = this;
          s.FrameSDK.openRating(function () {
            var t, a;
            if (s.FrameSDK.hasPopUp()) {
              e.onTouchCloseTips();
              null === (a = (t = e.viewData).closeCB) || void 0 === a || a.call(t, "home");
            } else {
              cc.Tween.stopAllByTarget(e.homeButtonNode);
              cc.tween(e.homeButtonNode).delay(0).set({
                scale: .2
              }).to(.4, {
                scale: 1
              }, {
                easing: "backOut"
              }).start();
              cc.Tween.stopAllByTarget(e.continueButtonNode);
              cc.tween(e.continueButtonNode).delay(.1).set({
                scale: .2
              }).to(.4, {
                scale: 1
              }, {
                easing: "backOut"
              }).call(function () {
                return e.isTouch = !0;
              }).start();
            }
          });
        };
        t.prototype.click_Common = function () {};
        t.prototype.onEnable = function () {
          var e,
            t,
            a = this;
          s.FrameSDK.openEffect(this);
          s.FrameSDK.playEffect("rewardshow");
          s.FrameSDK.logGameEvent("thepool_game_new", {
            object_action: "show",
            object_name: "new_15"
          }, !0);
          var o = c.FrameData.saveData.award5,
            n = o.reward;
          JSON.parse(JSON.stringify(o.numList)).sort(function (e, t) {
            return e - t;
          }).forEach(function (e, t) {
            a.numRanking[e] = t + 1;
          });
          s.FrameSDK.frameData.sdkFuc.ppEvent("freeShow");
          this.tipsRichText.string = 'skey_063??&value1==<img src="dollar3" offset=-6/> <size=46><color = #FDE829>' + s.FrameSDK.convertCoinToStr(n) + "</c></size>";
          this.externalRootNode.removeAllChildren();
          if (this.viewData.externalNode) {
            this.externalRootNode.addChild(this.viewData.externalNode);
            this.externalRootNode.active = !0;
            this.layout.paddingTop = 40;
            this.layout.spacingY = 40;
          } else {
            this.externalRootNode.active = !1;
            this.layout.paddingTop = 120;
            this.layout.spacingY = 120;
          }
          var i = [];
          this.boxNode.children.forEach(function (e, t) {
            cc.Tween.stopAllByTarget(e);
            var n = o.open[t],
              r = o.numList[t];
            if (n) {
              e.getComponent(sp.Skeleton).setAnimation(0, "step" + a.numRanking[r] + "_5", !0);
              a.boxBonusLabels[t].node.parent.active = !0;
              a.boxBonusLabels[t].string = "" + s.FrameSDK.convertCoinToStr(r);
            } else {
              i.push(t);
              e.getComponent(sp.Skeleton).setAnimation(0, "step3", !0);
              a.boxBonusLabels[t].node.parent.active = !1;
              a.boxBonusLabels[t].string = "";
            }
          });
          null === (t = (e = this.viewData).unlockCountUpdateFunc) || void 0 === t || t.call(e, Object.keys(c.FrameData.saveData.award5.open).length);
          this.homeButtonNode.scale = 0;
          this.continueButtonNode.scale = 0;
          cc.Tween.stopAllByTarget(this.homeButtonNode);
          cc.Tween.stopAllByTarget(this.continueButtonNode);
          this.scheduleOnce(function () {
            if (i.length <= 0) a._showButtons();else {
              var e = i[Math.floor(Math.random() * i.length)];
              a.openBox(e);
            }
          }, .5);
        };
        t.prototype.click_home = function () {
          var e, t;
          if (this.isTouch) {
            this.isTouch = !1;
            this.onTouchCloseTips();
            null === (t = (e = this.viewData).closeCB) || void 0 === t || t.call(e, "home");
          }
        };
        i([d(cc.Node)], t.prototype, "panel_window", void 0);
        i([d(cc.RichText)], t.prototype, "tipsRichText", void 0);
        i([d(cc.Layout)], t.prototype, "layout", void 0);
        i([d(cc.Node)], t.prototype, "externalRootNode", void 0);
        i([d(cc.Node)], t.prototype, "boxNode", void 0);
        i([d([cc.Label])], t.prototype, "boxBonusLabels", void 0);
        i([d(cc.Node)], t.prototype, "homeButtonNode", void 0);
        i([d(cc.Node)], t.prototype, "continueButtonNode", void 0);
        i([r.CLICKLOCK()], t.prototype, "click_home", null);
        i([r.CLICKLOCK()], t.prototype, "click_continue", null);
        i([r.CLICKLOCK()], t.prototype, "click_Common", null);
        return i([u], t);
      }(cc.Component);
    a.default = p;
    cc._RF.pop();
  }, {
    "./CLICKLOCK": "CLICKLOCK",
    "./FrameData": "FrameData",
    "./FrameSDK": "FrameSDK"
  }],
  Panel_Award_New: [function (e, t, a) {
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
    var r = e("./Frame"),
      c = e("./FrameData"),
      s = e("./FrameSDK"),
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
  }, {
    "./Frame": "Frame",
    "./FrameData": "FrameData",
    "./FrameSDK": "FrameSDK"
  }],
  Panel_Award_Super1: [function (e, t, a) {
    "use strict";

    cc._RF.push(t, "90340kWrS1BMZemoYMBTU+1", "Panel_Award_Super1");
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
    var r = e("./AinanEff"),
      c = e("./FrameData"),
      s = e("./FrameSDK"),
      l = cc._decorator,
      u = l.ccclass,
      d = l.property,
      p = function (e) {
        n(t, e);
        function t() {
          var t = null !== e && e.apply(this, arguments) || this;
          t.titleSkeleton1 = null;
          t.bonusLabel1 = null;
          t.adActionButton1 = null;
          t.noAdIcon = null;
          t.adIcon1 = null;
          t.commonActionButton1 = null;
          t.viewData = null;
          t.isTouch = !0;
          t.hideTime = 0;
          return t;
        }
        t.prototype.onEnable = function () {
          s.FrameSDK.openEffect(this, {
            opacity: 240
          });
          s.FrameSDK.playEffect("rewardshow");
          s.FrameSDK.frameData.sdkFuc.ppEvent("popupShow");
          s.FrameSDK.logCommonEvent("c_ad_event", {
            action: "exposure",
            type: "video",
            placement: "reward_sup"
          });
          s.FrameSDK.logGameEvent("thepool_game_rew", {
            object_action: "show",
            object_name: "sup_show"
          });
          this.titleSkeleton1.setAnimation(0, "start", !1);
          this.titleSkeleton1.addAnimation(0, "loop", !0);
          var e = s.FrameSDK.convertCoinToStr(this.viewData.bonus),
            t = s.FrameSDK.convertCoinToStr(this.viewData.freeBonus),
            a = !s.FrameSDK.frameData.gameData.noProfitAd;
          this.bonusLabel1.string = "" + e;
          this.noAdIcon.active = !a;
          this.adIcon1.active = a;
          this.commonActionButton1.active = a;
          this.commonActionButton1.getComponentInChildren(cc.Label).string = "skey_034 " + t;
        };
        t.prototype.onBtnEvent = function () {
          var e = this;
          if (this.isTouch) {
            this.isTouch = !1;
            var t = !this.adIcon1.active;
            s.FrameSDK.frameData.sdkFuc.ppEvent(t ? "freeClaim" : "claim");
            s.FrameSDK.logCommonEvent("c_ad_event", {
              action: "touch",
              type: "video",
              placement: "reward_sup"
            });
            s.FrameSDK.logGameEvent("thepool_game_rew", {
              object_action: "show",
              object_name: "sup_ad"
            });
            var a = function (a) {
              var o = 0,
                n = 0;
              if (!t && a) {
                o = c.FrameData.getCharityOutNum();
                n = 1;
              }
              s.FrameSDK.frameData.sdkFuc.ppEvent(t ? "freeCollected" : "collected");
              s.FrameSDK.addCoin(e.viewData.bonus, o, n, e.viewData.closeCB);
              e.onTouchCloseTips();
            };
            t ? a(!1) : s.FrameSDK.openVideo("reward_sup", !1, function (e) {
              s.FrameSDK.logGameEvent("thepool_game_ad", {
                object_action: "show",
                object_name: "reward_sup",
                object_notes: "video" === e ? "video" : "web" === e ? "web" : "inter"
              });
            }, function (e) {
              return a(e);
            }, function () {
              return e.isTouch = !0;
            }, {
              reward: this.viewData.bonus,
              isMax: !1
            });
          }
        };
        t.prototype.onTouchCloseTips = function () {
          if (Date.now() - this.hideTime <= 300) console.log("wait!!!，return");else {
            this.hideTime = Date.now();
            s.FrameSDK.closeEffect(this, null);
          }
        };
        t.prototype.onLoad = function () {
          this.adActionButton1.on(cc.Node.EventType.TOUCH_END, this.onBtnEvent, this);
          this.commonActionButton1.on(cc.Node.EventType.TOUCH_END, this.click_Common, this);
          var e = s.FrameSDK.getNoAdDelayTime();
          null != e && e >= 0 && (this.commonActionButton1.getComponent(r.default).dtime += e);
        };
        t.prototype.click_Common = function () {
          var e = this;
          if (this.isTouch) {
            this.isTouch = !1;
            s.FrameSDK.logGameEvent("thepool_game_rew", {
              object_action: "show",
              object_name: "sup_free"
            });
            s.FrameSDK.frameData.sdkFuc.ppEvent("freeClaim");
            (function (t) {
              var a = 0,
                o = 0;
              if (t) {
                a = c.FrameData.getCharityOutNum();
                o = 1;
              }
              s.FrameSDK.addCoin(e.viewData.freeBonus, a, o, e.viewData.closeCB);
              s.FrameSDK.frameData.sdkFuc.ppEvent("freeCollected");
              e.onTouchCloseTips();
            })(!1);
          }
        };
        i([d(sp.Skeleton)], t.prototype, "titleSkeleton1", void 0);
        i([d(cc.Label)], t.prototype, "bonusLabel1", void 0);
        i([d(cc.Node)], t.prototype, "adActionButton1", void 0);
        i([d(cc.Node)], t.prototype, "noAdIcon", void 0);
        i([d(cc.Node)], t.prototype, "adIcon1", void 0);
        i([d(cc.Node)], t.prototype, "commonActionButton1", void 0);
        return i([u], t);
      }(cc.Component);
    a.default = p;
    cc._RF.pop();
  }, {
    "./AinanEff": "AinanEff",
    "./FrameData": "FrameData",
    "./FrameSDK": "FrameSDK"
  }],
  Panel_Award_Super2: [function (e, t, a) {
    "use strict";

    cc._RF.push(t, "437c3AzOtNLv7MiBOrtNTjk", "Panel_Award_Super2");
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
    var r = e("./AinanEff"),
      c = e("./FrameData"),
      s = e("./FrameSDK"),
      l = cc._decorator,
      u = l.ccclass,
      d = l.property,
      p = function (e) {
        n(t, e);
        function t() {
          var t = null !== e && e.apply(this, arguments) || this;
          t.externalRootNode = null;
          t.titleSkeleton2 = null;
          t.extraBonusNode = null;
          t.bonusLabel2 = null;
          t.adActionButton2 = null;
          t.noAdIcon = null;
          t.adIcon2 = null;
          t.commonActionButton2 = null;
          t.guide = null;
          t.hand = null;
          t.viewData = null;
          t.isTouch = !0;
          t._dialogOriginalY = 0;
          t.hideTime = 0;
          return t;
        }
        t.prototype.onBtnEvent = function () {
          var e = this;
          if (this.isTouch) {
            this.isTouch = !1;
            var t = !this.adIcon2.active;
            s.FrameSDK.frameData.sdkFuc.ppEvent(t ? "freeClaim" : "claim");
            s.FrameSDK.logCommonEvent("c_ad_event", {
              action: "touch",
              type: "video",
              placement: "reward_sup"
            });
            s.FrameSDK.logGameEvent("thepool_game_rew", {
              object_action: "show",
              object_name: "sup_ad"
            });
            var a = function (a) {
              var o = 0,
                n = 0;
              if (!t && a) {
                o = c.FrameData.getCharityOutNum();
                n = 1;
              }
              s.FrameSDK.frameData.sdkFuc.ppEvent(t ? "freeCollected" : "collected");
              s.FrameSDK.addCoin(e.viewData.bonus, o, n, e.viewData.closeCB);
              cc.director.emit("SUPER_AWARD", "claim", e.viewData.param);
              e.onTouchCloseTips();
            };
            t ? a(!1) : s.FrameSDK.openVideo("reward_sup", !1, function (e) {
              s.FrameSDK.logGameEvent("thepool_game_ad", {
                object_action: "show",
                object_name: "reward_sup",
                object_notes: "video" === e ? "video" : "web" === e ? "web" : "inter"
              });
            }, function (e) {
              return a(e);
            }, function () {
              return e.isTouch = !0;
            }, {
              reward: this.viewData.bonus,
              isMax: !1
            });
          }
        };
        t.prototype.onTouchCloseTips = function () {
          if (Date.now() - this.hideTime <= 300) console.log("wait!!!，return");else {
            this.hideTime = Date.now();
            s.FrameSDK.closeEffect(this, null);
          }
        };
        t.prototype.onEnable = function () {
          var e = this;
          s.FrameSDK.openEffect(this, {
            opacity: 240
          });
          s.FrameSDK.playEffect("rewardshow");
          s.FrameSDK.frameData.sdkFuc.ppEvent("popupShow");
          s.FrameSDK.logCommonEvent("c_ad_event", {
            action: "exposure",
            type: "video",
            placement: "reward_sup"
          });
          s.FrameSDK.logGameEvent("thepool_game_rew", {
            object_action: "show",
            object_name: "sup_show"
          });
          this.externalRootNode.removeAllChildren();
          this.viewData.externalNode && this.externalRootNode.addChild(this.viewData.externalNode);
          this.titleSkeleton2.setAnimation(0, "start", !1);
          this.titleSkeleton2.addAnimation(0, "loop", !0);
          var t = s.FrameSDK.convertCoinToStr(this.viewData.bonus),
            a = s.FrameSDK.convertCoinToStr(this.viewData.freeBonus),
            o = !s.FrameSDK.frameData.gameData.noProfitAd;
          this.bonusLabel2.string = "" + t;
          this.noAdIcon.active = !o;
          this.adIcon2.active = o;
          this.commonActionButton2.active = o;
          this.commonActionButton2.getComponentInChildren(cc.Label).string = "skey_034 " + a;
          this.extraBonusNode.scale = 0;
          this.extraBonusNode.y = this._dialogOriginalY;
          cc.Tween.stopAllByTarget(this.extraBonusNode);
          cc.tween(this.extraBonusNode).delay(1).set({
            scale: .2
          }).to(.4, {
            scale: 1
          }, {
            easing: "backOut"
          }).call(function () {
            cc.tween(e.extraBonusNode).by(1, {
              y: 5
            }, {
              easing: "sineInOut"
            }).by(1.5, {
              y: -5
            }, {
              easing: "sineInOut"
            }).union().repeatForever().start();
          }).start();
          if (c.FrameData.saveData.freeSuperAward) {
            c.FrameData.saveData.freeSuperAward = !1;
            this.noAdIcon.active = !0;
            this.adIcon2.active = !1;
            this.commonActionButton2.active = !1;
            this.guide.active = !0;
            this.hand.active = !0;
          } else {
            this.guide.active = !1;
            this.hand.active = !1;
          }
        };
        t.prototype.onLoad = function () {
          this.adActionButton2.on(cc.Node.EventType.TOUCH_END, this.onBtnEvent, this);
          this.commonActionButton2.on(cc.Node.EventType.TOUCH_END, this.click_Common, this);
          this._dialogOriginalY = this.extraBonusNode.y;
          var e = s.FrameSDK.getNoAdDelayTime();
          null != e && e >= 0 && (this.commonActionButton2.getComponent(r.default).dtime += e);
        };
        t.prototype.click_Common = function () {
          var e = this;
          if (this.isTouch) {
            this.isTouch = !1;
            s.FrameSDK.logGameEvent("thepool_game_rew", {
              object_action: "show",
              object_name: "sup_free"
            });
            s.FrameSDK.frameData.sdkFuc.ppEvent("freeClaim");
            (function (t) {
              var a = 0,
                o = 0;
              if (t) {
                a = c.FrameData.getCharityOutNum();
                o = 1;
              }
              s.FrameSDK.addCoin(e.viewData.freeBonus, a, o, e.viewData.closeCB);
              s.FrameSDK.frameData.sdkFuc.ppEvent("freeCollected");
              e.onTouchCloseTips();
            })(!1);
          }
        };
        i([d(cc.Node)], t.prototype, "externalRootNode", void 0);
        i([d(sp.Skeleton)], t.prototype, "titleSkeleton2", void 0);
        i([d(cc.Node)], t.prototype, "extraBonusNode", void 0);
        i([d(cc.Label)], t.prototype, "bonusLabel2", void 0);
        i([d(cc.Node)], t.prototype, "adActionButton2", void 0);
        i([d(cc.Node)], t.prototype, "noAdIcon", void 0);
        i([d(cc.Node)], t.prototype, "adIcon2", void 0);
        i([d(cc.Node)], t.prototype, "commonActionButton2", void 0);
        i([d(cc.Node)], t.prototype, "guide", void 0);
        i([d(cc.Node)], t.prototype, "hand", void 0);
        return i([u], t);
      }(cc.Component);
    a.default = p;
    cc._RF.pop();
  }, {
    "./AinanEff": "AinanEff",
    "./FrameData": "FrameData",
    "./FrameSDK": "FrameSDK"
  }],
  Panel_CoinTips: [function (e, t, a) {
    "use strict";

    cc._RF.push(t, "9f0563cGeVBAqhQH0a2VWaw", "Panel_CoinTips");
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
    var r = e("./FrameData"),
      c = e("./FrameSDK"),
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
          if (Date.now() - this.hideTime <= 300) console.log("wait!!!，return");else {
            this.hideTime = Date.now();
            this.black_sprite.node.off(cc.Node.EventType.TOUCH_END, this.onTouchCloseTips, this);
            var t = .5 * cc.winSize.width + .5 * this.animationNode.width;
            cc.Tween.stopAllByTarget(this.animationNode);
            cc.tween(this.animationNode).to(.7, {
              x: -t
            }, {
              easing: "backIn"
            }).call(function () {
              c.FrameSDK.closeEffect(e, null);
            }).start();
          }
        };
        t.prototype.onEnable = function () {
          c.FrameSDK.frameData.gameData.noProfitAd && (this.viewData.charityNum = 0);
          c.FrameSDK.openEffect(this);
          c.FrameSDK.playEffect("rewardshow");
          this.labelCoin.node.parent.active = this.viewData.num > 0;
          this.labelCoin.string = c.FrameSDK.convertCoinToStr(this.viewData.num);
          this.labelCoinBubble.string = c.FrameSDK.convertCoinToStr(this.viewData.num, !0);
          this.labelCoin2.string = "" + c.FrameSDK.convertCharityToStr(this.viewData.charityNum);
          this.labelCoin2.node.parent.active = this.viewData.charityNum > 0;
          var e = c.FrameSDK.getFirstRedeemRequirement().rdm_1;
          if (c.FrameSDK.frameData.gameData.passLevel < e) {
            var t = r.FrameData.FRAME_CONF.RedeemRateConfig[0];
            this.levelRequirement.string = 'skey_097??&value1==<img src="dollar4" offset=-3/> <color= #8AFF77>' + c.FrameSDK.convertCoinToStr(t) + "</c>&value2==<color= #8AFF77>" + c.FrameSDK.convertCoinToStr(t, !0) + "</c>&value3==<color= #FDFF48>" + e + "</c>";
          } else this.levelRequirement.string = "";
        };
        t.prototype.onLoad = function () {
          var e = this,
            t = .5 * cc.winSize.width + .5 * this.animationNode.width;
          this.animationNode.x = t;
          cc.tween(this.animationNode).to(.7, {
            x: 0
          }, {
            easing: "backOut"
          }).call(function () {
            e.black_sprite.node.on(cc.Node.EventType.TOUCH_END, e.onTouchCloseTips, e);
          }).start();
        };
        i([u(cc.Node)], t.prototype, "animationNode", void 0);
        i([u(cc.Label)], t.prototype, "labelCoin", void 0);
        i([u(cc.Label)], t.prototype, "labelCoinBubble", void 0);
        i([u(cc.Label)], t.prototype, "labelCoin2", void 0);
        i([u(cc.RichText)], t.prototype, "levelRequirement", void 0);
        return i([l], t);
      }(cc.Component);
    a.default = d;
    cc._RF.pop();
  }, {
    "./FrameData": "FrameData",
    "./FrameSDK": "FrameSDK"
  }],
  Panel_Feedback: [function (e, t, a) {
    "use strict";

    cc._RF.push(t, "981abRDeaxCXonCgJU66U4G", "Panel_Feedback");
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
    var r = e("./FrameSDK"),
      c = cc._decorator,
      s = c.ccclass,
      l = c.property,
      u = function (e) {
        n(t, e);
        function t() {
          var t = null !== e && e.apply(this, arguments) || this;
          t.editbox1 = null;
          t.editbox2 = null;
          return t;
        }
        t.openPage = function (e) {
          r.FrameSDK.openWindow("Panel_Feedback", {
            closeCB: e
          });
        };
        t.prototype.onButSubmit = function () {
          var e = this;
          if (this.editbox1.string.length > 0 && this.editbox2.string.length > 0) {
            r.FrameSDK.frameData.gameFuc.openLoad();
            this.scheduleOnce(function () {
              r.FrameSDK.frameData.gameFuc.closeLoad();
              r.FrameSDK.showToast("fkey_140");
              e.node.destroy();
            }, .6 + 2 * Math.random());
            var t = new Date(),
              a = t.getFullYear() + "-" + String(t.getMonth() + 1).padStart(2, "0") + "-" + String(t.getDate()).padStart(2, "0") + ":" + String(t.getHours()).padStart(2, "0") + ":" + String(t.getMinutes()).padStart(2, "0");
            r.FrameSDK.logCommonEvent("thepool_feedback", {
              object_action: "question:" + this.editbox1.string,
              object_name: "information:" + this.editbox2.string,
              object_notes: "time:" + a
            });
          } else this.editbox1.string.length <= 0 ? r.FrameSDK.showToast("fkey_138") : this.editbox2.string.length <= 0 ? r.FrameSDK.showToast("fkey_139") : this.node.destroy();
        };
        t.prototype.onButClose = function () {
          this.node.destroy();
        };
        i([l(cc.EditBox)], t.prototype, "editbox1", void 0);
        i([l(cc.EditBox)], t.prototype, "editbox2", void 0);
        return i([s], t);
      }(cc.Component);
    a.default = u;
    cc._RF.pop();
  }, {
    "./FrameSDK": "FrameSDK"
  }],
  Panel_GuideSuperReward: [function (e, t, a) {
    "use strict";

    cc._RF.push(t, "aec70RIWAhPm4lthLf5hAfv", "Panel_GuideSuperReward");
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
    var r = e("./FrameData"),
      c = e("./FrameSDK"),
      s = cc._decorator,
      l = s.ccclass,
      u = s.property,
      d = function (e) {
        n(t, e);
        function t() {
          var t = null !== e && e.apply(this, arguments) || this;
          t.bg = null;
          t.topUserLabel = null;
          t.viewData = null;
          t.black_sprite = null;
          t.hideTime = 0;
          return t;
        }
        t.prototype.onTouchCloseTips = function () {
          var e = this;
          if (Date.now() - this.hideTime <= 300) console.log("wait!!!，return");else {
            this.hideTime = Date.now();
            this.black_sprite.node.off(cc.Node.EventType.TOUCH_END, this.onTouchCloseTips, this);
            var t = .5 * cc.winSize.width + .5 * this.bg.width;
            cc.Tween.stopAllByTarget(this.bg);
            cc.tween(this.bg).to(.7, {
              x: -t
            }, {
              easing: "backIn"
            }).call(function () {
              c.FrameSDK.closeEffect(e, null);
            }).start();
          }
        };
        t.prototype.onDisable = function () {
          var e, t;
          null === (t = null === (e = this.viewData) || void 0 === e ? void 0 : e.closeCB) || void 0 === t || t.call(e);
        };
        t.prototype.onEnable = function () {
          c.FrameSDK.openEffect(this);
          c.FrameSDK.logGameEvent("thepool_task", {
            object_action: "show",
            object_name: "task_start"
          });
        };
        t.prototype.onLoad = function () {
          var e = this,
            t = .5 * cc.winSize.width + .5 * this.bg.width;
          this.bg.x = t;
          this.topUserLabel.string = "skey_124??&value1==" + r.FrameData.FRAME_CONF.SuperRewardConfig.topNumber;
          c.FrameSDK.playEffect("rewardshow");
          cc.tween(this.bg).to(.7, {
            x: 0
          }, {
            easing: "backOut"
          }).call(function () {
            e.black_sprite.node.on(cc.Node.EventType.TOUCH_END, e.onTouchCloseTips, e);
          }).start();
        };
        i([u(cc.Node)], t.prototype, "bg", void 0);
        i([u(cc.Label)], t.prototype, "topUserLabel", void 0);
        return i([l], t);
      }(cc.Component);
    a.default = d;
    cc._RF.pop();
  }, {
    "./FrameData": "FrameData",
    "./FrameSDK": "FrameSDK"
  }],
  Panel_GuideTips: [function (e, t, a) {
    "use strict";

    cc._RF.push(t, "bfd32XNh+lKeZoaD3KHNwkA", "Panel_GuideTips");
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
    var r = e("./FrameSDK"),
      c = cc._decorator,
      s = c.ccclass,
      l = c.property,
      u = function (e) {
        n(t, e);
        function t() {
          var t = null !== e && e.apply(this, arguments) || this;
          t.bg = null;
          t.titleLabel = null;
          t.charityLogo = null;
          t.tipsRichText = null;
          t.viewData = null;
          return t;
        }
        t.prototype.onEnable = function () {
          r.FrameSDK.openEffect(this);
        };
        t.prototype.onLoad = function () {
          var e = this,
            t = .5 * cc.winSize.width + .5 * this.bg.width;
          this.bg.x = t;
          this.charityLogo.active = "charity" === this.viewData.type;
          switch (this.viewData.type) {
            case "charity":
              this.titleLabel.string = "skey_105";
              this.tipsRichText.string = "skey_106";
              break;
            default:
              this.titleLabel.string = "";
              this.tipsRichText.string = "";
          }
          r.FrameSDK.playEffect("rewardshow");
          cc.tween(this.bg).to(.7, {
            x: 0
          }, {
            easing: "backOut"
          }).delay(1).to(.7, {
            x: -t
          }, {
            easing: "backIn"
          }).call(function () {
            r.FrameSDK.closeEffect(e, null);
          }).start();
        };
        t.prototype.onDisable = function () {
          var e, t;
          null === (t = null === (e = this.viewData) || void 0 === e ? void 0 : e.closeCB) || void 0 === t || t.call(e);
        };
        i([l(cc.Node)], t.prototype, "bg", void 0);
        i([l(cc.Label)], t.prototype, "titleLabel", void 0);
        i([l(cc.Node)], t.prototype, "charityLogo", void 0);
        i([l(cc.RichText)], t.prototype, "tipsRichText", void 0);
        return i([s], t);
      }(cc.Component);
    a.default = u;
    cc._RF.pop();
  }, {
    "./FrameSDK": "FrameSDK"
  }],
  Panel_Guide: [function (e, t, a) {
    "use strict";

    cc._RF.push(t, "00ba3l3251EPbWQ/EntwKrb", "Panel_Guide");
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
    var r = e("./Frame"),
      c = e("./FrameData"),
      s = e("./FrameSDK"),
      l = cc._decorator,
      u = l.ccclass,
      d = l.property,
      p = function (e) {
        n(t, e);
        function t() {
          var t = null !== e && e.apply(this, arguments) || this;
          t.type = 0;
          return t;
        }
        t.prototype.updataUi = function () {};
        t.prototype.onLoad = function () {
          this.node.active = c.FrameData.saveData.guideInedx == this.type;
          if (this.node.active) {
            0 == this.type || this.scheduleOnce(this.updataUi.bind(this));
            this.node.on(cc.Node.EventType.TOUCH_END, this.onTouch, this);
          }
        };
        t.prototype.onTouch = function () {
          c.FrameData.saveData.guideInedx++;
          if (0 == this.type) {
            this.node.active = !1;
            r.default.ins.setGuideShow(!1);
            s.FrameSDK.openPanel_Yellow();
          } else this.updataUi();
        };
        i([d()], t.prototype, "type", void 0);
        return i([u], t);
      }(cc.Component);
    a.default = p;
    cc._RF.pop();
  }, {
    "./Frame": "Frame",
    "./FrameData": "FrameData",
    "./FrameSDK": "FrameSDK"
  }],
  Panel_Rating: [function (e, t, a) {
    "use strict";

    cc._RF.push(t, "f7b6eQ088hPsbfVEwwOyFW6", "Panel_Rating");
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
    var r = e("./FrameData"),
      c = e("./FrameSDK"),
      s = cc._decorator,
      l = s.ccclass,
      u = s.property,
      d = function (e) {
        n(t, e);
        function t() {
          var t = null !== e && e.apply(this, arguments) || this;
          t.panel_window = null;
          t.btn_close = null;
          t.label_tips1 = null;
          t.starLayout = null;
          t.EdBox = null;
          t.viewData = null;
          t.leve = 5;
          return t;
        }
        t.prototype.onOkClickEvent = function (e, t) {
          if ("0" == t) {
            if (this.leve >= 5) {
              c.FrameSDK.frameData.sdkFuc.openUrl && c.FrameSDK.frameData.sdkFuc.openUrl(cc.sys.os === cc.sys.OS_IOS ? r.FrameData.FRAME_CONF.iosRateUrl : r.FrameData.FRAME_CONF.androidRateUrl);
              r.FrameData.saveData.isRating = !0;
              c.FrameSDK.closeEffect(this, this.viewData.closeCB);
            } else {
              var a = this.panel_window.getChildByName("root"),
                o = a.getChildByName("input");
              o.active = !0;
              var n = this.panel_window.getChildByName("root2");
              a.getChildByName("label").active = !1;
              if (this.EdBox.getComponent(cc.EditBox).string.length > 0) {
                o.active = !1;
                a.active = !1;
                n.active = !0;
                r.FrameData.saveData.isRating = !0;
              } else c.FrameSDK.showToast("ukey_067");
            }
          } else c.FrameSDK.closeEffect(this, this.viewData.closeCB);
        };
        t.prototype.onLoad = function () {
          c.FrameSDK.openEffect(this);
          this.panel_window.getChildByName("root").active = !0;
          this.panel_window.getChildByName("root2").active = !1;
          this.initInput();
          r.FrameData.saveData.openRatingInedx++;
        };
        t.prototype.onStarClickEvent = function (e, t) {
          this.leve = Number(t) + 1;
          for (var a = 0; a < this.starLayout.childrenCount; a++) this.starLayout.children[a].getChildByName("yes").active = a < this.leve;
        };
        t.prototype.initInput = function () {
          var e = this,
            t = this.EdBox.getComponent(cc.EditBox);
          t.node.off(cc.Node.EventType.TOUCH_END);
          t.node.off(cc.Node.EventType.MOUSE_UP);
          t.node.on(cc.Node.EventType.TOUCH_MOVE, function (a) {
            var o = e.EdBox;
            if (0 == t.isFocused() && t.textLabel.node.height > o.height) {
              t.textLabel.node.y += a.getDeltaY();
              if (t.textLabel.node.height > o.height) {
                var n = t.textLabel.node.height - o.height;
                t.textLabel.node.y > o.height / 2 + n ? t.textLabel.node.y = o.height / 2 + n : t.textLabel.node.y < o.height / 2 && (t.textLabel.node.y = o.height / 2);
              }
            }
          }, this);
        };
        i([u(cc.Node)], t.prototype, "panel_window", void 0);
        i([u(cc.Node)], t.prototype, "btn_close", void 0);
        i([u(cc.Node)], t.prototype, "label_tips1", void 0);
        i([u(cc.Node)], t.prototype, "starLayout", void 0);
        i([u(cc.Node)], t.prototype, "EdBox", void 0);
        return i([l], t);
      }(cc.Component);
    a.default = d;
    cc._RF.pop();
  }, {
    "./FrameData": "FrameData",
    "./FrameSDK": "FrameSDK"
  }],
  Panel_RedeemTips: [function (e, t, a) {
    "use strict";

    cc._RF.push(t, "d4a89oveAZM8pLs8EQqe87x", "Panel_RedeemTips");
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
    var r = e("./FrameSDK"),
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
          this.levelLabel.string = "" + this.viewData.level;
          var a = r.FrameSDK.getFirstRedeemRequirement().rdm_1;
          this.tips1.string = "skey_078??&value1==<color= #FDFF48>" + Math.max(0, a - r.FrameSDK.frameData.gameData.passLevel) + "</c>";
          this.rtx_tips1.string = "skey_079??&value1==<color= #8AFF77>" + r.FrameSDK.convertCoinToStr(this.viewData.currentBonus, !0) + "</c>";
          r.FrameSDK.playEffect("rewardshow");
          cc.tween(this.bg).to(.7, {
            x: 0
          }, {
            easing: "backOut"
          }).delay(1).to(.7, {
            x: -t
          }, {
            easing: "backIn"
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
        i([l(cc.Node)], t.prototype, "bg", void 0);
        i([l(cc.Label)], t.prototype, "levelLabel", void 0);
        i([l(cc.RichText)], t.prototype, "tips1", void 0);
        i([l(cc.RichText)], t.prototype, "rtx_tips1", void 0);
        return i([s], t);
      }(cc.Component);
    a.default = u;
    cc._RF.pop();
  }, {
    "./FrameSDK": "FrameSDK"
  }],
  Panel_SuperRewardTask: [function (e, t, a) {
    "use strict";

    cc._RF.push(t, "bc628+S1DVDHZvw7XfTXCm7", "Panel_SuperRewardTask");
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
    var r = e("./FrameData"),
      c = e("./FrameSDK"),
      s = e("./WebViewManager"),
      l = cc._decorator,
      u = l.ccclass,
      d = l.property,
      p = function (e) {
        n(t, e);
        function t() {
          var t = null !== e && e.apply(this, arguments) || this;
          t.announceRichText = null;
          t.bonus1Label = null;
          t.bonus2Label = null;
          t.tipRichText = null;
          t.progressBar = null;
          t.progressLabel = null;
          t.webViewAttachedNode = null;
          t.viewData = null;
          t._scheduleFunc = null;
          t._config = null;
          t._interval = 0;
          t._targetTime = 0;
          t._startProgress = 0;
          t._maxProgress = 0;
          return t;
        }
        t.prototype.onWebViewInteract = function () {
          var e;
          if (!(3 !== this._config.task_rule || this._maxProgress >= 1)) {
            this._interval = 1e3 * (null !== (e = this._config.task_time[1]) && void 0 !== e ? e : 120);
            this._targetTime = Date.now() + this._interval;
            this._startProgress = r.FrameData.FRAME_CONF.SuperRewardConfig.taskBreakPoint;
            this._maxProgress = 1;
            this._startSchedule();
          }
        };
        t.prototype.onWebViewLoad = function (e) {
          var t = this;
          this._stopSchedule();
          if (e) {
            if (2 !== this._config.task_rule) {
              this._targetTime = Date.now() + this._interval;
              this._startSchedule();
            }
          } else {
            var a = this.webViewAttachedNode.x;
            this.webViewAttachedNode.x = -1e4;
            c.FrameSDK.openWindow("Panel_SuperRewardTips", {
              type: "error",
              bonus: this._config.task_coin,
              callback: function () {
                t.webViewAttachedNode.x = a;
                c.FrameSDK.closeEffect(t, function () {
                  var e, a;
                  return null === (a = (e = t.viewData).callback) || void 0 === a ? void 0 : a.call(e, !1);
                });
              }
            });
          }
        };
        t.prototype._showAnnounce = function () {
          var e = this,
            t = this.viewData.announceNumbers[c.FrameSDK.randomInt(0, this.viewData.announceNumbers.length - 1)];
          this.announceRichText.string = "skey_137??&value1==" + c.FrameSDK.getRandomInviteCode() + '&value2==<img src="dollar4" offset=-3/><color= #FFE956>' + c.FrameSDK.convertCoinToStr(t) + "</c>";
          this.announceRichText.node.x = this.announceRichText.node.parent.width;
          cc.Tween.stopAllByTarget(this.announceRichText.node);
          cc.tween(this.announceRichText.node).call(function () {
            cc.tween(e.announceRichText.node).to(10, {
              x: -e.announceRichText.node.width - e.announceRichText.node.parent.width
            }).call(function () {
              return e._showAnnounce();
            }).start();
          }).start();
        };
        t.prototype.onDisable = function () {
          s.default.hideWebView(this.webViewAttachedNode);
        };
        t.prototype.onWebViewExternalURL = function (e) {
          if (!(2 !== this._config.task_rule || this._targetTime >= this._interval || e <= 0)) {
            this._targetTime += e;
            this.progressBar.progress = Math.min(this._targetTime / this._interval, 1);
            this.progressLabel.string = "skey_139??&value1==" + Math.floor(100 * this.progressBar.progress) + "%";
          }
        };
        t.prototype._startSchedule = function () {
          var e = this;
          this._stopSchedule();
          this.schedule(this._scheduleFunc = function () {
            var t = Math.max(0, e._targetTime - Date.now());
            e.progressBar.progress = Math.min(e._startProgress + (e._interval - t) / e._interval * (e._maxProgress - e._startProgress), 1);
            e.progressLabel.string = "skey_139??&value1==" + Math.floor(100 * e.progressBar.progress) + "%";
            if (t <= 0) {
              e.progressBar.progress = Math.min(e._maxProgress, 1);
              e.progressLabel.string = "skey_139??&value1==" + Math.floor(100 * e.progressBar.progress) + "%";
              e._stopSchedule();
            }
          });
        };
        t.prototype.onEnable = function () {
          var e,
            t,
            a,
            o,
            n,
            i,
            l,
            u,
            d = this,
            p = this.webViewAttachedNode.parent;
          p.width = cc.winSize.width;
          p.height = cc.winSize.height;
          if (cc.winSize.width / cc.winSize.height < .56) {
            p.height = cc.winSize.height - 70;
            p.y = -35;
          } else p.y = 0;
          c.FrameSDK.openEffect(this);
          this._config = r.FrameData.FRAME_CONF.SuperRewardTask.find(function (e) {
            return e.task_id === d.viewData.taskID;
          });
          this.bonus1Label.string = c.FrameSDK.convertCoinToStr(this._config.task_coin);
          this.bonus2Label.string = c.FrameSDK.convertCoinToStr(this._config.task_coin, !0);
          this._targetTime = 0;
          switch (this._config.task_rule) {
            case 1:
              this._interval = 1e3 * (null !== (e = this._config.task_time[0]) && void 0 !== e ? e : 240);
              this._startProgress = 0;
              this._maxProgress = 1;
              this.tipRichText.string = "skey_132??&value1==<color= #F8FF41>" + (null !== (t = this._config.task_time[0]) && void 0 !== t ? t : 240) / 60 + "</c>";
              break;
            case 2:
              this._interval = 1e3 * (null !== (a = this._config.task_time[0]) && void 0 !== a ? a : 180);
              this._startProgress = 0;
              this._maxProgress = 1;
              this.tipRichText.string = "skey_133??&value1==<color= #F8FF41>" + (null !== (o = this._config.task_time[0]) && void 0 !== o ? o : 180) / 60 + "</c>";
              break;
            case 3:
              this._interval = 1e3 * (null !== (n = this._config.task_time[0]) && void 0 !== n ? n : 180);
              this._startProgress = 0;
              this._maxProgress = r.FrameData.FRAME_CONF.SuperRewardConfig.taskBreakPoint;
              this.tipRichText.string = "skey_134??&value1==<color= #F8FF41>" + ((null !== (i = this._config.task_time[0]) && void 0 !== i ? i : 180) + (null !== (l = this._config.task_time[1]) && void 0 !== l ? l : 120)) / 60 + "</c>";
              break;
            default:
              this._interval = 1e3 * (null !== (u = this._config.task_time[0]) && void 0 !== u ? u : 180);
              this._startProgress = 0;
              this._maxProgress = 1;
              this.tipRichText.string = "";
          }
          this.progressBar.progress = 0;
          this.progressLabel.string = "skey_139??&value1==0%";
          this.scheduleOnce(function () {
            var e;
            e = 1 === d._config.task_is_uid ? d._config.task_url.replace("{gaid}", c.FrameSDK.frameData.sdkFuc.gaid) : 2 === d._config.task_is_uid ? d._config.task_url.replace("{invite_code}", c.FrameSDK.frameData.sdkFuc.inviteCode) : d._config.task_url;
            s.default.showWebView(d.webViewAttachedNode, e, d);
          });
          this._showAnnounce();
        };
        t.prototype.onCloseButtonClick = function () {
          var e = this,
            t = this.webViewAttachedNode.x;
          this.webViewAttachedNode.x = -1e4;
          this.progressBar.progress < 1 ? c.FrameSDK.openWindow("Panel_SuperRewardTips", {
            type: "quit",
            bonus: this._config.task_coin,
            callback: function (a) {
              e.webViewAttachedNode.x = t;
              a || c.FrameSDK.closeEffect(e, function () {
                var t, a;
                return null === (a = (t = e.viewData).callback) || void 0 === a ? void 0 : a.call(t, !1);
              });
            }
          }) : c.FrameSDK.openWindow("Panel_SuperRewardTips", {
            type: "complete",
            bonus: this._config.task_coin,
            callback: function () {
              e.webViewAttachedNode.x = t;
              c.FrameSDK.closeEffect(e, function () {
                var t, a;
                return null === (a = (t = e.viewData).callback) || void 0 === a ? void 0 : a.call(t, !0);
              });
            }
          });
        };
        t.prototype._stopSchedule = function () {
          if (null !== this._scheduleFunc && void 0 !== this._scheduleFunc) {
            this.unschedule(this._scheduleFunc);
            this._scheduleFunc = null;
          }
        };
        i([d(cc.RichText)], t.prototype, "announceRichText", void 0);
        i([d(cc.Label)], t.prototype, "bonus1Label", void 0);
        i([d(cc.Label)], t.prototype, "bonus2Label", void 0);
        i([d(cc.RichText)], t.prototype, "tipRichText", void 0);
        i([d(cc.ProgressBar)], t.prototype, "progressBar", void 0);
        i([d(cc.Label)], t.prototype, "progressLabel", void 0);
        i([d(cc.Node)], t.prototype, "webViewAttachedNode", void 0);
        return i([u], t);
      }(cc.Component);
    a.default = p;
    cc._RF.pop();
  }, {
    "./FrameData": "FrameData",
    "./FrameSDK": "FrameSDK",
    "./WebViewManager": "WebViewManager"
  }],
  Panel_SuperRewardTips: [function (e, t, a) {
    "use strict";

    cc._RF.push(t, "46413x8eKxFeJag0fsBTMK0", "Panel_SuperRewardTips");
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
    var r = e("./FrameSDK"),
      c = cc._decorator,
      s = c.ccclass,
      l = c.property,
      u = function (e) {
        n(t, e);
        function t() {
          var t = null !== e && e.apply(this, arguments) || this;
          t.panel_window = null;
          t.titleLabel = null;
          t.errorNode = null;
          t.bonusLabel = null;
          t.tipLabel = null;
          t.quitButtonNode = null;
          t.keepButtonNode = null;
          t.collectButtonNode = null;
          t.returnButtonNode = null;
          t.viewData = null;
          return t;
        }
        t.prototype.onQuitButtonClick = function () {
          var e = this;
          r.FrameSDK.closeEffect(this, function () {
            var t, a;
            return null === (a = (t = e.viewData).callback) || void 0 === a ? void 0 : a.call(t, !1);
          });
        };
        t.prototype.onCollectButtonClick = function () {
          var e = this;
          r.FrameSDK.closeEffect(this, function () {
            var t, a;
            return null === (a = (t = e.viewData).callback) || void 0 === a ? void 0 : a.call(t, !0);
          });
        };
        t.prototype.onEnable = function () {
          r.FrameSDK.openEffect(this);
          switch (this.viewData.type) {
            case "quit":
              this.titleLabel.string = "skey_140";
              this.errorNode.active = !1;
              this.bonusLabel.node.parent.active = !0;
              this.bonusLabel.string = r.FrameSDK.convertCoinToStr(this.viewData.bonus, !0);
              this.tipLabel.string = "skey_141";
              this.quitButtonNode.active = !0;
              this.keepButtonNode.active = !0;
              this.collectButtonNode.active = !1;
              this.returnButtonNode.active = !1;
              break;
            case "complete":
              this.titleLabel.string = "skey_144";
              this.errorNode.active = !1;
              this.bonusLabel.node.parent.active = !0;
              this.bonusLabel.string = r.FrameSDK.convertCoinToStr(this.viewData.bonus, !0);
              this.tipLabel.string = "skey_145";
              this.quitButtonNode.active = !1;
              this.keepButtonNode.active = !1;
              this.collectButtonNode.active = !0;
              this.returnButtonNode.active = !1;
              break;
            case "error":
              this.titleLabel.string = "skey_150";
              this.errorNode.active = !0;
              this.bonusLabel.node.parent.active = !1;
              this.bonusLabel.string = r.FrameSDK.convertCoinToStr(this.viewData.bonus, !0);
              this.tipLabel.string = "skey_151";
              this.quitButtonNode.active = !1;
              this.keepButtonNode.active = !1;
              this.collectButtonNode.active = !1;
              this.returnButtonNode.active = !0;
          }
        };
        t.prototype.onReturnButtonClick = function () {
          var e = this;
          r.FrameSDK.closeEffect(this, function () {
            var t, a;
            return null === (a = (t = e.viewData).callback) || void 0 === a ? void 0 : a.call(t, !0);
          });
        };
        t.prototype.onKeepButtonClick = function () {
          var e = this;
          r.FrameSDK.closeEffect(this, function () {
            var t, a;
            return null === (a = (t = e.viewData).callback) || void 0 === a ? void 0 : a.call(t, !0);
          });
        };
        i([l(cc.Node)], t.prototype, "panel_window", void 0);
        i([l(cc.Label)], t.prototype, "titleLabel", void 0);
        i([l(cc.Node)], t.prototype, "errorNode", void 0);
        i([l(cc.Label)], t.prototype, "bonusLabel", void 0);
        i([l(cc.Label)], t.prototype, "tipLabel", void 0);
        i([l(cc.Node)], t.prototype, "quitButtonNode", void 0);
        i([l(cc.Node)], t.prototype, "keepButtonNode", void 0);
        i([l(cc.Node)], t.prototype, "collectButtonNode", void 0);
        i([l(cc.Node)], t.prototype, "returnButtonNode", void 0);
        return i([s], t);
      }(cc.Component);
    a.default = u;
    cc._RF.pop();
  }, {
    "./FrameSDK": "FrameSDK"
  }],
  Panel_SuperReward: [function (e, t, a) {
    "use strict";

    cc._RF.push(t, "47d3euZHCdKFKPTe/6iY50g", "Panel_SuperReward");
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
    var r = e("./FrameData"),
      c = e("./FrameSDK"),
      s = cc._decorator,
      l = s.ccclass,
      u = s.property,
      d = function (e) {
        n(t, e);
        function t() {
          var t = null !== e && e.apply(this, arguments) || this;
          t.panel_window = null;
          t.tipRichText = null;
          t.maxBonusLabel = null;
          t.progressBar = null;
          t.progressLabel = null;
          t.buttonProgressLabel = null;
          t.emptyNode = null;
          t.scrollView = null;
          t.templateNode = null;
          t._close_target = null;
          t.viewData = null;
          t.hideTime = 0;
          return t;
        }
        a = t;
        t.prototype._refreshTask = function (e) {
          var t,
            a,
            o = r.FrameData.saveData.superReward;
          delete o.currentTask[e];
          for (var n = r.FrameData.myCountry.toUpperCase(), i = [], s = 0, l = 0, u = r.FrameData.FRAME_CONF.SuperRewardTask; l < u.length; l++) if ((_ = u[l]).task_type === e && !(_.task_zone.length > 0 && _.task_zone.findIndex(function (e) {
            return e.toUpperCase() === n;
          }) < 0 || _.task_ban.length > 0 && _.task_ban.findIndex(function (e) {
            return e.toUpperCase() === n;
          }) >= 0)) {
            var d = null !== (t = o.totalComplete[_.task_id]) && void 0 !== t ? t : 0,
              p = null !== (a = o.todayComplete[_.task_id]) && void 0 !== a ? a : 0;
            if (!(d >= _.task_total || p >= _.task_daily)) {
              i.push(_);
              s += _.task_wgt;
            }
          }
          for (var h = Math.random() * s, m = 0, f = i; m < f.length; m++) {
            var _;
            if (h < (_ = f[m]).task_wgt) {
              c.FrameSDK.logGameEvent("thepool_task", {
                object_action: "show",
                object_name: "task_show",
                object_notes: "" + _.task_id
              });
              o.currentTask[e] = {
                id: _.task_id,
                people: 0,
                completed: !1
              };
              break;
            }
            h -= _.task_wgt;
          }
        };
        t._checkTaskData = function () {
          var e,
            t,
            a = r.FrameData.saveData.superReward,
            o = c.FrameSDK.getDateDay(c.FrameSDK.now);
          if (a && !(a.currentDate >= o)) {
            a.currentDate = o;
            a.todayComplete = {};
            a.currentTask = {};
            for (var n = r.FrameData.myCountry.toUpperCase(), i = {}, s = 0, l = r.FrameData.FRAME_CONF.SuperRewardTask; s < l.length; s++) if (!((v = l[s]).task_zone.length > 0 && v.task_zone.findIndex(function (e) {
              return e.toUpperCase() === n;
            }) < 0 || v.task_ban.length > 0 && v.task_ban.findIndex(function (e) {
              return e.toUpperCase() === n;
            }) >= 0 || (null !== (e = a.totalComplete[v.task_id]) && void 0 !== e ? e : 0) >= v.task_total)) {
              i[v.task_type] = null !== (t = i[v.task_type]) && void 0 !== t ? t : {
                tasks: [],
                totalWeight: 0
              };
              i[v.task_type].tasks.push(v);
              i[v.task_type].totalWeight += v.task_wgt;
            }
            for (var u = 0, d = Object.keys(i).sort(function (e, t) {
                return parseInt(e) - parseInt(t);
              }); u < d.length; u++) for (var p = d[u], h = i[parseInt(p)], m = Math.random() * h.totalWeight, f = 0, _ = h.tasks; f < _.length; f++) {
              var v;
              if (m < (v = _[f]).task_wgt) {
                c.FrameSDK.logGameEvent("thepool_task", {
                  object_action: "show",
                  object_name: "task_show",
                  object_notes: "" + v.task_id
                });
                a.currentTask[parseInt(p)] = {
                  id: v.task_id,
                  people: 0,
                  completed: !1
                };
                break;
              }
              m -= v.task_wgt;
            }
          }
        };
        t.prototype.onDisable = function () {
          cc.director.emit("UPDATA_SUPER_REWARD");
          var e, t;
          null === (t = (e = this.viewData).closeCB) || void 0 === t || t.call(e);
        };
        t.prototype.onClaimButtonClick = function () {
          var e = r.FrameData.FRAME_CONF.SuperRewardConfig,
            t = r.FrameData.saveData.superReward,
            a = 0;
          for (var o in t.totalComplete) a += t.totalComplete[o];
          var n = Math.max(0, a - t.extraIndex * e.extraRewardRequirement);
          if (n < e.extraRewardRequirement) c.FrameSDK.showToast("skey_149??&value1==" + (e.extraRewardRequirement - n));else {
            ++t.extraIndex;
            c.FrameSDK.addCoin(c.FrameSDK.randomInt(e.extraRewardRange), 0, 0);
            n = Math.max(0, a - t.extraIndex * e.extraRewardRequirement);
            this.progressBar.progress = n / e.extraRewardRequirement;
            this.progressLabel.string = n + "/" + e.extraRewardRequirement;
            this.buttonProgressLabel.string = "skey_129??&value1==" + n + "&value2==" + e.extraRewardRequirement;
          }
        };
        t.hasTaskOrReward = function () {
          if (!r.FrameData.saveData.superReward) return !1;
          var e = r.FrameData.FRAME_CONF.SuperRewardConfig,
            t = r.FrameData.saveData.superReward,
            a = 0;
          for (var o in t.totalComplete) a += t.totalComplete[o];
          if (Math.max(0, a - t.extraIndex * e.extraRewardRequirement) >= e.extraRewardRequirement) return !0;
          this._checkTaskData();
          for (var o in t.currentTask) {
            if (null != t.currentTask[o]) return !0;
          }
          return !1;
        };
        t.prototype.close = function () {
          if (Date.now() - this.hideTime <= 300) console.log("wait!!!，return");else {
            this.hideTime = Date.now();
            c.FrameSDK.closeEffect(this, null);
          }
        };
        t.prototype.updateUi = function () {
          var e,
            t,
            a,
            o,
            n,
            i,
            s = this,
            l = r.FrameData.FRAME_CONF.SuperRewardConfig,
            u = r.FrameData.saveData.superReward,
            d = c.FrameSDK.convertCoinToStr(l.extraRewardDisplay);
          this.tipRichText.string = "skey_128??&value1==<color= #FFE956>" + l.extraRewardRequirement + "</c>&value2==" + d;
          this.maxBonusLabel.string = d;
          var p = 0;
          for (var h in u.totalComplete) p += u.totalComplete[h];
          var m = Math.max(0, p - u.extraIndex * l.extraRewardRequirement);
          this.progressBar.progress = m / l.extraRewardRequirement;
          this.progressLabel.string = m + "/" + l.extraRewardRequirement;
          this.buttonProgressLabel.string = "skey_129??&value1==" + m + "&value2==" + l.extraRewardRequirement;
          this.scrollView.content.removeAllChildren();
          for (var f = Object.keys(u.currentTask).map(function (e) {
              var t = u.currentTask[parseInt(e)];
              return r.FrameData.FRAME_CONF.SuperRewardTask.find(function (e) {
                return e.task_id === t.id;
              });
            }).sort(function (e, t) {
              return t.task_coin - e.task_coin;
            }), _ = [], v = function (d) {
              var p = f[d],
                h = u.currentTask[p.task_type];
              _.push(p.task_coin);
              var m = y.scrollView.content.children[d];
              m ? m.active = !0 : (m = cc.instantiate(y.templateNode)).setParent(y.scrollView.content);
              m.x = 0;
              cc.find("bonus1Label", m).getComponent(cc.Label).string = "" + c.FrameSDK.convertCoinToStr(p.task_coin);
              cc.find("qipao/bonus2Label", m).getComponent(cc.Label).string = "" + c.FrameSDK.convertCoinToStr(p.task_coin, !0);
              var v = p.task_total - (null !== (e = u.totalComplete[h.id]) && void 0 !== e ? e : 0),
                g = null !== (t = u.todayComplete[h.id]) && void 0 !== t ? t : 0;
              cc.find("countRichText", m).getComponent(cc.RichText).string = "skey_130??&value1==" + g + "&value2==" + Math.min(p.task_daily, v + g);
              var D = cc.find("claimButton", m),
                F = cc.find("goButton", m),
                b = function () {
                  var e, t;
                  if (h.completed) {
                    c.FrameSDK.logGameEvent("thepool_task", {
                      object_action: "show",
                      object_name: "task_succ",
                      object_notes: "" + p.task_id
                    });
                    u.todayComplete[p.task_id] = (null !== (e = u.todayComplete[p.task_id]) && void 0 !== e ? e : 0) + 1;
                    u.totalComplete[p.task_id] = (null !== (t = u.totalComplete[p.task_id]) && void 0 !== t ? t : 0) + 1;
                    s._refreshTask(p.task_type);
                    c.FrameSDK.addCoin(p.task_coin, 0, 0);
                    s.updateUi();
                  } else {
                    c.FrameSDK.logGameEvent("thepool_task", {
                      object_action: "show",
                      object_name: "task_open",
                      object_notes: "" + p.task_id
                    });
                    c.FrameSDK.openWindow("Panel_SuperRewardTask", {
                      taskID: h.id,
                      announceNumbers: _,
                      callback: function (e) {
                        if (e || r.FrameData.SDK_CONF.NO_VIDEO) {
                          h.completed = !0;
                          D.active = !0;
                          F.active = !1;
                        } else c.FrameSDK.logGameEvent("thepool_task", {
                          object_action: "show",
                          object_name: "task_fail",
                          object_notes: "" + p.task_id
                        });
                      }
                    });
                  }
                };
              D.active = h.completed;
              D.targetOff(y);
              D.on("click", b, y);
              F.active = !h.completed;
              F.targetOff(y);
              F.on("click", b, y);
              switch (p.task_rule) {
                case 1:
                  cc.find("tip1RichText", m).getComponent(cc.RichText).string = "skey_132??&value1==<color= #F8FF41>" + (null !== (a = p.task_time[0]) && void 0 !== a ? a : 240) / 60 + "</c>";
                  break;
                case 2:
                  cc.find("tip1RichText", m).getComponent(cc.RichText).string = "skey_133??&value1==<color= #F8FF41>" + (null !== (o = p.task_time[0]) && void 0 !== o ? o : 180) / 60 + "</c>";
                  break;
                case 3:
                  cc.find("tip1RichText", m).getComponent(cc.RichText).string = "skey_134??&value2==<color= #F8FF41>" + ((null !== (n = p.task_time[0]) && void 0 !== n ? n : 180) + (null !== (i = p.task_time[1]) && void 0 !== i ? i : 120)) / 60 + "</c>";
                  break;
                default:
                  cc.find("tip1RichText", m).getComponent(cc.RichText).string = "";
              }
              var C = h.people;
              C < l.taskBonusTotal * l.taskPeopleInitRange[0] / 100 ? C = Math.ceil(l.taskBonusTotal * c.FrameSDK.randomFloatNum(l.taskPeopleInitRange[0], l.taskPeopleInitRange[1]) / 100) : C > l.taskBonusTotal ? C = Math.ceil(l.taskBonusTotal * c.FrameSDK.randomFloatNum(l.taskPeopleLimit, 99) / 100) : C < l.taskBonusTotal * l.taskPeopleLimit / 100 && (C += Math.ceil(l.taskBonusTotal * c.FrameSDK.randomFloatNum(l.taskPeopleAddRange[0], l.taskPeopleAddRange[1]) / 100));
              C = Math.min(C, l.taskBonusTotal - 10);
              h.people = C;
              cc.find("tip2RichText", m).getComponent(cc.RichText).string = "skey_135??&value1==" + l.taskBonusTotal + "&value2==" + C + "&value3==<color= #69D73C>" + (l.taskBonusTotal - C) + "</c>";
            }, y = this, g = 0; g < f.length; g++) v(g);
          var D = this.scrollView.content.children,
            F = D.length;
          for (g = f.length; g < F; g++) D[g].active = !1;
          this.emptyNode.active = f.length <= 0;
        };
        t.startSuperReward = function (e) {
          !c.FrameSDK.frameData.gameData.noProfitAd && r.FrameData.FRAME_CONF.superRewardEnabled ? r.FrameData.saveData.superReward ? c.FrameSDK.openWindow("Panel_SuperReward", {
            closeCB: e
          }) : c.FrameSDK.frameData.gameData.passLevel >= r.FrameData.FRAME_CONF.superRewardLevel ? c.FrameSDK.openWindow("Panel_GuideSuperReward", {
            closeCB: function () {
              c.FrameSDK.openWindow("Panel_SuperReward", {
                closeCB: e
              });
            }
          }) : null == e || e() : null == e || e();
        };
        t.prototype.onEnable = function () {
          this.panel_window.width = cc.winSize.width;
          this.panel_window.height = cc.winSize.height;
          if (cc.winSize.width / cc.winSize.height < .56) {
            this.panel_window.height = cc.winSize.height - 70;
            this.panel_window.y = -35;
          } else this.panel_window.y = 0;
          c.FrameSDK.openEffect(this);
          c.FrameSDK.playEffect("page_show");
          cc.director.emit("UPDATA_SUPER_REWARD");
          this.updateUi();
        };
        t.prototype.onLoad = function () {
          this._close_target = a.coinTarget;
          r.FrameData.saveData.superReward || (r.FrameData.saveData.superReward = {
            currentDate: 0,
            extraIndex: 0,
            totalComplete: {},
            todayComplete: {},
            currentTask: {}
          });
          a._checkTaskData();
        };
        var a;
        t.coinTarget = null;
        i([u(cc.Node)], t.prototype, "panel_window", void 0);
        i([u(cc.RichText)], t.prototype, "tipRichText", void 0);
        i([u(cc.Label)], t.prototype, "maxBonusLabel", void 0);
        i([u(cc.ProgressBar)], t.prototype, "progressBar", void 0);
        i([u(cc.Label)], t.prototype, "progressLabel", void 0);
        i([u(cc.Label)], t.prototype, "buttonProgressLabel", void 0);
        i([u(cc.Node)], t.prototype, "emptyNode", void 0);
        i([u(cc.ScrollView)], t.prototype, "scrollView", void 0);
        i([u(cc.Node)], t.prototype, "templateNode", void 0);
        return a = i([l], t);
      }(cc.Component);
    a.default = d;
    cc._RF.pop();
  }, {
    "./FrameData": "FrameData",
    "./FrameSDK": "FrameSDK"
  }],
  Panel_Task: [function (e, t, a) {
    "use strict";

    cc._RF.push(t, "20947eS8KVG/o/Af/SrsV5t", "Panel_Task");
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
    var r = e("./CLICKLOCK"),
      c = e("./FrameData"),
      s = e("./FrameSDK"),
      l = cc._decorator,
      u = l.ccclass,
      d = l.property,
      p = function (e) {
        n(t, e);
        function t() {
          var t = null !== e && e.apply(this, arguments) || this;
          t.panel_window = null;
          t.scrollview = null;
          t.totalBonusLabel = null;
          t.tips = null;
          t.node_content = null;
          t._close_target = null;
          t._scrollViewDesignHeight = 0;
          t.viewData = null;
          return t;
        }
        a = t;
        t.startTask = function (e) {
          c.FrameData.saveData.lvAwardinfo ? s.FrameSDK.openWindow("Panel_Task", {
            closeCB: e
          }) : s.FrameSDK.frameData.gameData.passLevel >= c.FrameData.FRAME_CONF.taskLevel ? s.FrameSDK.openWindow("Panel_ActivityGuide", {
            type: 1,
            logoType: "levelReward",
            dtime: 2.5,
            text: "skey_072",
            closeCB: function () {
              s.FrameSDK.openWindow("Panel_Task", {
                closeCB: e
              });
            }
          }) : null == e || e();
        };
        t.prototype.onBtnEvent = function (e, t) {
          s.FrameSDK.logGameEvent("thepool_game_act", {
            object_action: "show",
            object_name: "lvrew_get"
          });
          c.FrameData.saveData.lvAwardinfo.push(Number(t));
          for (var a = c.FrameData.getCoinOutNum("free"), o = 0, n = c.FrameData.FRAME_CONF.TaskConfig; o < n.length; o++) {
            var i = n[o];
            if (i.task_id.toString() == t) {
              a = i.task_num;
              break;
            }
          }
          s.FrameSDK.addCoin(a, 0, 0);
          this.onTouchClose();
        };
        t.prototype.onEnable = function () {
          s.FrameSDK.openEffect(this);
          s.FrameSDK.playEffect("page_show");
          this.updateUi();
        };
        t.isTaskFinish = function () {
          if (c.FrameData.saveData.lvAwardinfo) for (var e = c.FrameData.FRAME_CONF.TaskConfig.filter(function (e) {
              return -1 == c.FrameData.saveData.lvAwardinfo.indexOf(e.task_id);
            }), t = 0; t < e.length; t++) if (s.FrameSDK.frameData.gameData.passLevel >= e[t].task_lv) return !0;
          return !1;
        };
        t.prototype.onTouchClose = function () {
          cc.director.emit("UPDATA_TASK");
          s.FrameSDK.closeEffect(this, null);
        };
        t.openTask = function (e) {
          null == c.FrameData.saveData.lvAwardinfo && s.FrameSDK.frameData.gameData.passLevel >= c.FrameData.FRAME_CONF.taskLevel && a.startTask(e);
        };
        t.prototype.onLoad = function () {
          this._close_target = a.coinTarget;
          this._scrollViewDesignHeight = this.scrollview.node.height;
          if (null == c.FrameData.saveData.lvAwardinfo) {
            c.FrameData.saveData.lvAwardinfo = [];
            s.FrameSDK.logGameEvent("thepool_game_act", {
              object_action: "show",
              object_name: "lvrew_start"
            }, !0);
          }
        };
        t.prototype.updateUi = function () {
          for (var e, t = this, a = JSON.parse(JSON.stringify(c.FrameData.FRAME_CONF.TaskConfig)).reverse(), o = s.FrameSDK.frameData.gameData.passLevel, n = null, i = 0, r = 0; r < a.length; r++) {
            var l = a[r];
            i += l.task_num;
            var u = null !== (e = this.node_content.children[r]) && void 0 !== e ? e : cc.instantiate(this.node_content.children[0]);
            u.parent = this.node_content;
            var d = cc.find("box", u);
            cc.find("label_lv", u).getComponent(cc.Label).string = l.task_lv.toString();
            cc.find("label_coin", d).getComponent(cc.Label).string = "x" + s.FrameSDK.convertCoinToStr(l.task_num);
            var p = u.getComponent(cc.Button);
            p.interactable = o >= l.task_lv && -1 == c.FrameData.saveData.lvAwardinfo.indexOf(l.task_id);
            p.clickEvents[0].customEventData = l.task_id.toString();
            null === n && (p.interactable ? n = r : o >= l.task_lv && (n = r));
            var h = cc.find("toplight_taiq", d),
              m = cc.find("light", d),
              f = cc.find("mengban", d),
              _ = cc.find("load1", u),
              v = cc.find("lvhuang", u);
            if (o >= l.task_lv) {
              _.active = !0;
              v.active = !0;
              if (p.interactable) {
                h.active = !0;
                m.active = !0;
                f.active = !1;
              } else {
                h.active = !1;
                m.active = !1;
                f.active = !0;
              }
            } else {
              h.active = !1;
              m.active = !0;
              f.active = !1;
              _.active = !1;
              v.active = !1;
            }
            d.stopAllActions();
            d.x = 0;
            (h.active || l.task_lv - o == 1) && cc.tween(d).to(.5, {
              x: 10
            }, {
              easing: "sineInOut"
            }).to(.5, {
              x: -10
            }, {
              easing: "sineInOut"
            }).union().repeatForever().start();
          }
          this.totalBonusLabel.string = "x" + s.FrameSDK.convertCoinToStr(i);
          this.tips.string = "skey_071??&value1==" + s.FrameSDK.convertCoinToStr(i);
          this.scheduleOnce(function () {
            var e = (cc.winSize.height - cc.director.getScene().getComponentInChildren(cc.Canvas).designResolution.height) / 2;
            t.scrollview.node.setContentSize(t.scrollview.node.width, t.scrollview.node.height + e);
            t.scrollview.node.getComponentInChildren(cc.Widget).updateAlignment();
            if (null != n) {
              var o = t.scrollview.getMaxScrollOffset();
              o.y = o.y * (n / (a.length - 1));
              t.scrollview.scrollToOffset(o, 2);
            } else t.scrollview.scrollToBottom(2);
          });
        };
        t.prototype.onDisable = function () {
          this.node_content.children.forEach(function (e) {
            e.active = !1;
          });
          var e, t;
          null === (t = (e = this.viewData).closeCB) || void 0 === t || t.call(e);
        };
        var a;
        t.coinTarget = null;
        i([d(cc.Node)], t.prototype, "panel_window", void 0);
        i([d(cc.ScrollView)], t.prototype, "scrollview", void 0);
        i([d(cc.Label)], t.prototype, "totalBonusLabel", void 0);
        i([d(cc.Label)], t.prototype, "tips", void 0);
        i([d(cc.Node)], t.prototype, "node_content", void 0);
        i([r.CLICKLOCK()], t.prototype, "onBtnEvent", null);
        return a = i([u], t);
      }(cc.Component);
    a.default = p;
    cc._RF.pop();
  }, {
    "./CLICKLOCK": "CLICKLOCK",
    "./FrameData": "FrameData",
    "./FrameSDK": "FrameSDK"
  }],
  Panel_Tips: [function (e, t, a) {
    "use strict";

    cc._RF.push(t, "26522SksYxJdIKQaB5LayiK", "Panel_Tips");
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
    var r = e("./FrameData"),
      c = e("./FrameSDK"),
      s = cc._decorator,
      l = s.ccclass,
      u = s.property,
      d = function (e) {
        n(t, e);
        function t() {
          var t = null !== e && e.apply(this, arguments) || this;
          t.panel_window = null;
          t.rtx_tips1 = null;
          t.bar = null;
          t.labelbar = null;
          t.labelBtn = null;
          t.viewData = null;
          t.hideTime = 0;
          return t;
        }
        t.prototype.onTouchCloseTips = function () {
          if (Date.now() - this.hideTime <= 300) console.log("wait!!!，return");else {
            this.hideTime = Date.now();
            c.FrameSDK.closeEffect(this, null);
          }
        };
        t.prototype.clickConfirm = function () {
          this.onTouchCloseTips();
        };
        t.prototype.onEnable = function () {
          c.FrameSDK.openEffect(this);
          var e = "",
            t = "LV." + this.viewData.now + "/LV." + this.viewData.total;
          this.labelBtn.string = "skey_060";
          if (this.viewData.isCharity) {
            if (1 == this.viewData.status) {
              this.labelBtn.string = "skey_061";
              t = this.viewData.now + "/" + this.viewData.total;
              e = "skey_081??&value1==<color= #DF4704>" + this.viewData.total + "</c>&value2==<color= #DF4704>" + Math.ceil(Math.max(0, this.viewData.total - this.viewData.now) / r.FrameData.getCoinOutNum("charity")) + "</c>";
            } else 2 == this.viewData.status && (e = "skey_059??&value1==<color= #DF4704>" + this.viewData.total + "</c>&value2==<color= #DF4704>" + this.viewData.now + "</c>&value3==<color= #DF4704>" + Math.max(0, this.viewData.total - this.viewData.now) + "</c>");
          } else if (1 == this.viewData.status) e = "skey_057??&value1==<color= #DF4704>" + this.viewData.total + "</c>&value2==<color= #DF4704>" + this.viewData.now + "</c>&value3==<color= #DF4704>" + Math.max(0, this.viewData.total - this.viewData.now) + "</c>";else if (2 == this.viewData.status) {
            this.labelBtn.string = "skey_061";
            t = c.FrameSDK.convertCoinToStr(this.viewData.now, !0) + "/" + c.FrameSDK.convertCoinToStr(this.viewData.total, !0);
            e = "skey_058??&value1==<color= #009D12>" + c.FrameSDK.convertCoinToStr(this.viewData.now, !0) + "</c>&value2==<color= #009D12>" + c.FrameSDK.convertCoinToStr(this.viewData.total, !0) + "</c>";
          } else 3 == this.viewData.status && (e = "skey_059??&value1==<color= #DF4704>" + this.viewData.total + "</c>&value2==<color= #DF4704>" + this.viewData.now + "</c>&value3==<color= #DF4704>" + Math.max(0, this.viewData.total - this.viewData.now) + "</c>");
          this.rtx_tips1.string = e;
          this.bar.fillRange = this.viewData.now / this.viewData.total;
          this.labelbar.string = t;
        };
        i([u(cc.Node)], t.prototype, "panel_window", void 0);
        i([u(cc.RichText)], t.prototype, "rtx_tips1", void 0);
        i([u(cc.Sprite)], t.prototype, "bar", void 0);
        i([u(cc.Label)], t.prototype, "labelbar", void 0);
        i([u(cc.Label)], t.prototype, "labelBtn", void 0);
        return i([l], t);
      }(cc.Component);
    a.default = d;
    cc._RF.pop();
  }, {
    "./FrameData": "FrameData",
    "./FrameSDK": "FrameSDK"
  }],
  Panel_WelcomeBack: [function (e, t, a) {
    "use strict";

    cc._RF.push(t, "14770+XpL1EBKNdijlKLGk4", "Panel_WelcomeBack");
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
    var r = e("./FrameSDK"),
      c = cc._decorator,
      s = c.ccclass,
      l = c.property,
      u = function (e) {
        n(t, e);
        function t() {
          var t = null !== e && e.apply(this, arguments) || this;
          t.animationNode = null;
          t.richText = null;
          t.viewData = null;
          return t;
        }
        t.prototype.onEnable = function () {
          r.FrameSDK.openEffect(this);
          r.FrameSDK.playEffect("rewardshow");
        };
        t.prototype.onLoad = function () {
          var e = this,
            t = .5 * cc.winSize.width + .5 * this.animationNode.width;
          this.animationNode.x = t;
          cc.tween(this.animationNode).to(.7, {
            x: 0
          }, {
            easing: "backOut"
          }).delay(2).to(.7, {
            x: -t
          }, {
            easing: "backIn"
          }).call(function () {
            r.FrameSDK.closeEffect(e, null);
          }).start();
          this.richText.string = "skey_122??&value1==<size=36><color= #FDFF48>30</c></size>";
        };
        t.prototype.onDisable = function () {
          var e, t;
          null === (t = (e = this.viewData).closeCB) || void 0 === t || t.call(e);
        };
        i([l(cc.Node)], t.prototype, "animationNode", void 0);
        i([l(cc.RichText)], t.prototype, "richText", void 0);
        return i([s], t);
      }(cc.Component);
    a.default = u;
    cc._RF.pop();
  }, {
    "./FrameSDK": "FrameSDK"
  }],
  PaymentItem: [function (e, t, a) {
    "use strict";

    cc._RF.push(t, "586b7yO5RlCA6JNRlmrycFp", "PaymentItem");
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
    var r = cc._decorator,
      c = r.ccclass,
      s = r.property,
      l = function (e) {
        n(t, e);
        function t() {
          var t = null !== e && e.apply(this, arguments) || this;
          t.sprite = null;
          t.spriteFrames = [];
          return t;
        }
        Object.defineProperty(t.prototype, "paymentID", {
          set: function (e) {
            var t = this.spriteFrames[e - 101];
            if (t) {
              this.node.active = !0;
              this.sprite.spriteFrame = t;
            } else {
              this.node.active = !1;
              this.sprite.spriteFrame = null;
            }
          },
          enumerable: !1,
          configurable: !0
        });
        i([s(cc.Sprite)], t.prototype, "sprite", void 0);
        i([s([cc.SpriteFrame])], t.prototype, "spriteFrames", void 0);
        return i([c], t);
      }(cc.Component);
    a.default = l;
    cc._RF.pop();
  }, {}],
  RDM_CharityItem: [function (e, t, a) {
    "use strict";

    cc._RF.push(t, "6f62bSHLkFOmah+a3GRSm5H", "RDM_CharityItem");
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
    var r = e("./FrameData"),
      c = e("./FrameSDK"),
      s = e("./RDM_Charity"),
      l = cc._decorator,
      u = l.ccclass,
      d = (l.property, function (e) {
        n(t, e);
        function t() {
          var t = null !== e && e.apply(this, arguments) || this;
          t.data = null;
          t.conf = null;
          return t;
        }
        t.prototype.onBtnEvent = function () {
          var e = this;
          this.data.now >= this.data.total ? new Promise(function (t) {
            r.FrameData.saveData.account.length <= 0 ? c.FrameSDK.openWindow("Panel_Account", {
              numStr: c.FrameSDK.convertCharityToStr(e.conf.reward, !0),
              closeCB: t
            }) : t();
          }).then(function () {
            c.FrameSDK.logLiftEvent("finish_task");
            c.FrameSDK.logGameEvent("thepool_game_rdm", {
              object_action: "show",
              object_name: "rdm2_" + e.data.status + "_end",
              object_notes: "redeem_" + e.conf.rdm_id
            }, !0);
            1 == e.data.status ? r.FrameData.saveData.CharityStep[e.conf.rdm_id] = {
              status: 2
            } : 2 == e.data.status && (r.FrameData.saveData.CharityStep[e.conf.rdm_id].status = 3);
            cc.director.emit("REFRESH_INFO");
            c.FrameSDK.logGameEvent("thepool_game_rdm", {
              object_action: "show",
              object_name: "rdm2_" + e.data.status + "_start",
              object_notes: "redeem_" + e.conf.rdm_id
            }, !0);
          }) : c.FrameSDK.openWindow("Panel_Tips", this.data);
        };
        t.prototype.onBtnTestEvent = function () {
          1 != this.data.status && 2 != this.data.status || (this.data.now = this.data.total);
          this.updateUI();
        };
        t.prototype.init = function (e) {
          this.conf = e;
          this.data = s.default.getData(e.rdm_id);
          this.updateUI();
        };
        t.prototype.updateUI = function () {
          this.node.children.forEach(function (e) {
            e.active = !1;
          });
          var e = this.data,
            t = this.node.getChildByName("state" + e.status);
          if (1 == e.status) {
            cc.find("label_1", t).getComponent(cc.Label).string = "" + c.FrameSDK.convertCharityToStr(this.conf.reward, !0);
            cc.find("CashFishCredit/count", t).getComponent(cc.Label).string = c.FrameSDK.convertCharityToStr(e.now) + "/" + c.FrameSDK.convertCharityToStr(e.total);
            cc.find("rtx_tips2", t).getComponent(cc.RichText).string = e.tips;
          } else if (2 == e.status) {
            cc.find("label_1", t).getComponent(cc.Label).string = c.FrameSDK.convertCharityToStr(this.conf.reward, !0);
            cc.find("rtx_tips2", t).getComponent(cc.RichText).string = e.tips;
          } else 3 == e.status && (cc.find("label_1", t).getComponent(cc.Label).string = c.FrameSDK.convertCharityToStr(this.conf.reward, !0));
          e.now >= e.total && 1 == e.status && c.FrameSDK.logLiftEvent("reach_threshold");
          t.active = !0;
        };
        return i([u], t);
      }(cc.Component));
    a.default = d;
    cc._RF.pop();
  }, {
    "./FrameData": "FrameData",
    "./FrameSDK": "FrameSDK",
    "./RDM_Charity": "RDM_Charity"
  }],
  RDM_Charity: [function (e, t, a) {
    "use strict";

    cc._RF.push(t, "0f6b4sNvFJJRKzY9NGUY2HH", "RDM_Charity");
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
    var r = e("./FrameData"),
      c = e("./FrameSDK"),
      s = e("./PaymentItem"),
      l = e("./RDM_CharityItem"),
      u = cc._decorator,
      d = u.ccclass,
      p = u.property,
      h = function (e) {
        n(t, e);
        function t() {
          var t = null !== e && e.apply(this, arguments) || this;
          t.top = null;
          t.lbl_gCoin = null;
          t.timeLabel = null;
          t.numberLabel = null;
          t.peopleLabel = null;
          t.paymentRootNode = null;
          t.scrollview = null;
          t.guide = null;
          t.coin = "0";
          t.guideInedx = 0;
          return t;
        }
        a = t;
        t.prototype.openGuide = function () {
          this.guide.active = !0;
          this.guide.children.forEach(function (e) {
            e.active = !1;
          });
          var e = cc.find("mask", this.guide).getComponent(cc.Mask);
          e.node.active = !0;
          if (0 == this.guideInedx) {
            cc.find("tips1", this.guide).active = !0;
            e.spriteFrame = c.FrameSDK.getNodeTexture(cc.find("panel_window/node_list2", this.node));
            cc.tween(cc.find("tips1/hand", this.guide)).by(.5, {
              x: 50,
              y: -50
            }).by(.5, {
              x: -50,
              y: 50
            }).union().repeatForever().start();
          } else if (1 == this.guideInedx) {
            cc.find("tips2", this.guide).active = !0;
            var t = a.getData(r.FrameData.FRAME_CONF.CoinConf[0].rdm_id);
            e.spriteFrame = c.FrameSDK.getNodeTexture(cc.find("panel_window/scrollview/view/content/item", this.node));
            cc.find("tips2/label", this.guide).getComponent(cc.Label).string = "skey_109??&value1==" + t.total;
            cc.tween(cc.find("tips2/hand", this.guide)).by(.5, {
              x: 50,
              y: -50
            }).by(.5, {
              x: -50,
              y: 50
            }).union().repeatForever().start();
          } else if (2 == this.guideInedx) {
            cc.find("tips3", this.guide).active = !0;
            t = a.getData(r.FrameData.FRAME_CONF.CoinConf[0].rdm_id);
            cc.find("tips3/label", this.guide).getComponent(cc.Label).string = "skey_110??&value1==" + t.total;
            cc.tween(cc.find("tips3/hand", this.guide)).by(.5, {
              x: 50,
              y: -50
            }).by(.5, {
              x: -50,
              y: 50
            }).union().repeatForever().start();
            e.spriteFrame = c.FrameSDK.getNodeTexture(cc.find("panel_window/top/btn_close", this.node));
          } else if (3 == this.guideInedx) {
            this.node.destroy();
            cc.director.emit("CHARITY_GUIDE_FINISH");
          }
        };
        t.prototype.updateUI = function () {
          var e = this;
          this.coin = c.FrameSDK.convertCharityToStr(r.FrameData.charityCredit);
          this.lbl_gCoin.string = this.coin;
          this.timeLabel.string = "skey_089??&value1==" + r.FrameData.saveData.charityDonateTime;
          this.numberLabel.string = "" + c.FrameSDK.formatNumber(r.FrameData.saveData.charityDonated, 0, 1);
          this.peopleLabel.string = "skey_090??&value1==" + Math.floor(r.FrameData.saveData.charityDonated / r.FrameData.getCoinOutNum("charityPerPeople"));
          var t = r.FrameData.CountryConf.cash_id.slice(0, 4);
          this.paymentRootNode.children.forEach(function (e, a) {
            var o;
            return e.getComponent(s.default).paymentID = null !== (o = t[a]) && void 0 !== o ? o : 0;
          });
          r.FrameData.FRAME_CONF.CharityConf.forEach(function (t, a) {
            var o,
              n = null !== (o = e.scrollview.content.children[a]) && void 0 !== o ? o : cc.instantiate(e.scrollview.content.children[0]);
            n.getComponentInChildren(l.default).init(t);
            n.parent = e.scrollview.content;
          });
        };
        t.getData = function (e) {
          var t = r.FrameData.getCharityConf(e),
            a = r.FrameData.getCharityExchangeStatus(e),
            o = {};
          1 == a ? o = {
            now: Math.min(r.FrameData.saveData.credit.greenCoin, t.rdm_1),
            total: t.rdm_1,
            tips: "skey_091??&value1==<color= #DF4704>" + c.FrameSDK.convertCharityToStr(t.rdm_1) + "</c>"
          } : 2 == a && (o = {
            now: Math.min(c.FrameSDK.frameData.gameData.passLevel, t.rdm_2),
            total: t.rdm_2,
            tips: "skey_053??&value1==<color= #DF4704>" + t.rdm_2 + "</c>&value2==<color= #009D12>" + c.FrameSDK.convertCharityToStr(t.reward, !0) + "</c>"
          });
          o.status = a;
          o.isCharity = !0;
          return o;
        };
        t.prototype.onDestroy = function () {
          cc.director.removeAll(this);
        };
        t.prototype.onBtnEvent = function (e, t) {
          if ("0" == t) this.node.destroy();else if ("3" == t) {
            this.guideInedx++;
            this.openGuide();
          }
        };
        t.prototype.onEnable = function () {
          c.FrameSDK.playEffect("rdm");
        };
        t.prototype.onLoad = function () {
          var e = this;
          cc.director.on("REFRESH_INFO", this.updateUI, this);
          this.updateUI();
          this.guide.active = !1;
          if (r.FrameData.saveData.charityGuideIndex <= 1) {
            r.FrameData.saveData.charityGuideIndex = 2;
            this.scheduleOnce(function () {
              e.openGuide();
            });
          }
          this.scheduleOnce(function () {
            e.scrollview.node.height = e.scrollview.node.convertToWorldSpaceAR(cc.v2()).y;
          });
        };
        var a;
        i([p(cc.Node)], t.prototype, "top", void 0);
        i([p(cc.Label)], t.prototype, "lbl_gCoin", void 0);
        i([p(cc.Label)], t.prototype, "timeLabel", void 0);
        i([p(cc.Label)], t.prototype, "numberLabel", void 0);
        i([p(cc.Label)], t.prototype, "peopleLabel", void 0);
        i([p(cc.Node)], t.prototype, "paymentRootNode", void 0);
        i([p(cc.ScrollView)], t.prototype, "scrollview", void 0);
        i([p(cc.Node)], t.prototype, "guide", void 0);
        return a = i([d], t);
      }(cc.Component);
    a.default = h;
    cc._RF.pop();
  }, {
    "./FrameData": "FrameData",
    "./FrameSDK": "FrameSDK",
    "./PaymentItem": "PaymentItem",
    "./RDM_CharityItem": "RDM_CharityItem"
  }],
  RDM_LevelItem: [function (e, t, a) {
    "use strict";

    cc._RF.push(t, "aa802AZGJpOE6Q9czNn6LC6", "RDM_LevelItem");
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
    var r = e("./FrameData"),
      c = e("./FrameSDK"),
      s = e("./RDM_Level"),
      l = cc._decorator,
      u = l.ccclass,
      d = (l.property, function (e) {
        n(t, e);
        function t() {
          var t = null !== e && e.apply(this, arguments) || this;
          t.data = null;
          t.conf = null;
          return t;
        }
        t.prototype.onBtnTestEvent = function () {
          1 != this.data.status && 2 != this.data.status && 3 != this.data.status || (this.data.now = this.data.total);
          this.updateUI();
        };
        t.prototype.init = function (e) {
          this.conf = e;
          this.data = s.default.getData(e.rdm_id);
          this.updateUI();
        };
        t.prototype.onBtnEvent = function () {
          var e = this;
          this.data.now >= this.data.total ? new Promise(function (e) {
            r.FrameData.saveData.account.length <= 0 ? c.FrameSDK.openWindow("Panel_Account", {
              numStr: c.FrameSDK.convertCoinToStr(r.FrameData.credit, !0),
              closeCB: e
            }) : e();
          }).then(function () {
            c.FrameSDK.logLiftEvent("finish_task");
            c.FrameSDK.logGameEvent("thepool_game_rdm", {
              object_action: "show",
              object_name: "rdm_" + e.data.status + "_end",
              object_notes: "redeem_" + e.conf.rdm_id
            }, !0);
            1 == e.data.status ? r.FrameData.saveData.CoinStep[e.conf.rdm_id] = {
              status: 2,
              targetCoin: r.FrameData.getTargetCoint(e.conf.rdm_id, r.FrameData.saveData.credit.yellowCoin)
            } : 2 == e.data.status ? r.FrameData.saveData.CoinStep[e.conf.rdm_id].status = 3 : 3 == e.data.status && (r.FrameData.saveData.CoinStep[e.conf.rdm_id].status = 4);
            cc.director.emit("REFRESH_INFO");
            c.FrameSDK.logGameEvent("thepool_game_rdm", {
              object_action: "show",
              object_name: "rdm_" + r.FrameData.saveData.CoinStep[e.conf.rdm_id].status + "_start",
              object_notes: "redeem_" + e.conf.rdm_id
            }, !0);
          }) : c.FrameSDK.openWindow("Panel_Tips", this.data);
        };
        t.prototype.updateUI = function () {
          this.node.children.forEach(function (e) {
            e.active = !1;
          });
          var e = this.data,
            t = this.node.getChildByName("state" + e.status);
          if (1 == e.status || 2 == e.status) {
            cc.find("label_1", t).getComponent(cc.Label).string = 1 == e.status ? "LV." + e.now + " / LV." + e.total : c.FrameSDK.convertCoinToStr(e.total, !0);
            cc.find("rtx_tips2", t).getComponent(cc.RichText).string = e.tips;
            cc.find("node_progress/node_bar", t).getComponent(cc.Sprite).fillRange = e.now / e.total;
            cc.find("node_progress/node_bar/lbl_pro", t).getComponent(cc.Label).string = 1 == e.status ? "LV." + e.now + "/LV." + e.total : c.FrameSDK.convertCoinToStr(e.now, !0) + "/" + c.FrameSDK.convertCoinToStr(e.total, !0);
          } else if (3 == e.status) {
            cc.find("label_1", t).getComponent(cc.Label).string = c.FrameSDK.convertCoinToStr(r.FrameData.saveData.CoinStep[this.conf.rdm_id].targetCoin, !0);
            cc.find("rtx_tips2", t).getComponent(cc.RichText).string = e.tips;
          } else 4 == e.status && (cc.find("label_1", t).getComponent(cc.Label).string = c.FrameSDK.convertCoinToStr(r.FrameData.saveData.CoinStep[this.conf.rdm_id].targetCoin, !0));
          e.now >= e.total && 1 == e.status && c.FrameSDK.logLiftEvent("reach_threshold");
          t.active = !0;
        };
        return i([u], t);
      }(cc.Component));
    a.default = d;
    cc._RF.pop();
  }, {
    "./FrameData": "FrameData",
    "./FrameSDK": "FrameSDK",
    "./RDM_Level": "RDM_Level"
  }],
  RDM_Level: [function (e, t, a) {
    "use strict";

    cc._RF.push(t, "330cb7hfDtA/aPSxGDG9M90", "RDM_Level");
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
    var r = e("./FrameData"),
      c = e("./FrameSDK"),
      s = e("./PaymentItem"),
      l = e("./RDM_LevelItem"),
      u = cc._decorator,
      d = u.ccclass,
      p = u.property,
      h = function (e) {
        n(t, e);
        function t() {
          var t = null !== e && e.apply(this, arguments) || this;
          t.top = null;
          t.rtx_turnInfo = null;
          t.lbl_gCoin = null;
          t.paymentRootNode = null;
          t.rtx_tips = null;
          t.guide = null;
          t.scrollview = null;
          t.coin = "0";
          t.guideInedx = 0;
          return t;
        }
        a = t;
        t.prototype.openGuide = function () {
          this.guide.active = !0;
          this.guide.children.forEach(function (e) {
            e.active = !1;
          });
          var e = cc.find("mask", this.guide).getComponent(cc.Mask);
          e.node.active = !0;
          if (0 == this.guideInedx) {
            c.FrameSDK.logGameEvent("thepool_game_new", {
              object_action: "show",
              object_name: "new_6"
            }, !0);
            cc.find("tips1", this.guide).active = !0;
            e.spriteFrame = c.FrameSDK.getNodeTexture(cc.find("panel_window/node_list2", this.node));
            cc.tween(cc.find("tips1/hand", this.guide)).by(.5, {
              x: 50,
              y: -50
            }).by(.5, {
              x: -50,
              y: 50
            }).union().repeatForever().start();
          } else if (1 == this.guideInedx) {
            c.FrameSDK.logGameEvent("thepool_game_new", {
              object_action: "show",
              object_name: "new_7"
            }, !0);
            cc.find("tips2", this.guide).active = !0;
            e.spriteFrame = c.FrameSDK.getNodeTexture(cc.find("panel_window/scrollview/view/content/item", this.node));
            cc.tween(cc.find("tips2/hand", this.guide)).by(.5, {
              x: 50,
              y: -50
            }).by(.5, {
              x: -50,
              y: 50
            }).union().repeatForever().start();
          } else if (2 == this.guideInedx) {
            cc.find("tips3", this.guide).active = !0;
            var t = a.getData(r.FrameData.FRAME_CONF.CoinConf[0].rdm_id);
            cc.find("tips3/label", this.guide).getComponent(cc.Label).string = "skey_040??&value1==" + (t.total - t.now);
            cc.tween(cc.find("tips3/hand", this.guide)).by(.5, {
              x: 50,
              y: -50
            }).by(.5, {
              x: -50,
              y: 50
            }).union().repeatForever().start();
            e.spriteFrame = c.FrameSDK.getNodeTexture(cc.find("panel_window/top/btn_close", this.node));
          } else if (3 == this.guideInedx) {
            c.FrameSDK.logGameEvent("thepool_game_new", {
              object_action: "show",
              object_name: "new_8"
            }, !0);
            this.node.destroy();
            cc.director.emit("NEW_HAND_FINISH");
          }
        };
        t.prototype.onLoad = function () {
          var e = this;
          this.showTurnList();
          cc.director.on("REFRESH_INFO", this.updateUI, this);
          this.updateUI();
          this.guide.active = !1;
          if (r.FrameData.saveData.guideInedx <= 1) {
            r.FrameData.saveData.guideInedx = 2;
            this.scheduleOnce(function () {
              e.openGuide();
            });
          }
          this.scheduleOnce(function () {
            e.scrollview.node.height = e.scrollview.node.convertToWorldSpaceAR(cc.v2()).y;
          });
          var t = r.FrameData.CountryConf.cash_id.slice(0, 4);
          this.paymentRootNode.children.forEach(function (e, a) {
            var o;
            e.getComponent(s.default).paymentID = null !== (o = t[a]) && void 0 !== o ? o : 0;
          });
        };
        t.getTurnInfo = function () {
          var e = JSON.parse(JSON.stringify(r.FrameData.FRAME_CONF.CoinConf)).sort(function () {
            return Math.random() - .5;
          })[0];
          return {
            level: e.rdm_1,
            coinCout: r.FrameData.getTargetCoint(e.rdm_id, c.FrameSDK.randomInt(2e4, 5e4))
          };
        };
        t.prototype.updateUI = function () {
          var e = this;
          this.coin = c.FrameSDK.convertCoinToStr(r.FrameData.credit, !0);
          this.lbl_gCoin.string = this.coin;
          var t = r.FrameData.FRAME_CONF.RedeemRateConfig[0];
          this.rtx_tips.string = 'skey_094??&value1==<img src="dollar4" offset=-3/> <color= #8AFF77>' + c.FrameSDK.convertCoinToStr(t) + "</c>&value2==<color= #8AFF77>" + c.FrameSDK.convertCoinToStr(t, !0) + "</c>";
          r.FrameData.FRAME_CONF.CoinConf.forEach(function (t, a) {
            var o = e.scrollview.content.children[a] || cc.instantiate(e.scrollview.content.children[0]);
            o.getComponentInChildren(l.default).init(t);
            o.parent = e.scrollview.content;
          });
          r.FrameData.saveData.account;
        };
        t.prototype.onEnable = function () {
          c.FrameSDK.playEffect("rdm");
        };
        t.prototype.onDestroy = function () {
          cc.director.removeAll(this);
        };
        t.prototype.onBtnEvent = function (e, t) {
          if ("0" == t) this.node.destroy();else if ("3" == t) {
            this.guideInedx++;
            this.openGuide();
          }
        };
        t.prototype.showTurnList = function () {
          var e = this;
          this.rtx_turnInfo.node.stopAllActions();
          var t = a.getTurnInfo(),
            o = c.FrameSDK.getRandomInviteCode();
          this.rtx_turnInfo.string = "skey_001??&value1==" + o + "</c>&value2==" + t.level + "&value3==<color = #FFF882>" + c.FrameSDK.convertCoinToStr(t.coinCout, !0) + "</c>";
          cc.tween(this.rtx_turnInfo.node).delay(.1).set({
            y: -(.5 * this.rtx_turnInfo.node.parent.height + .5 * this.rtx_turnInfo.node.height)
          }).to(1, {
            y: 0
          }).delay(1).to(1, {
            y: .5 * this.rtx_turnInfo.node.parent.height + .5 * this.rtx_turnInfo.node.height
          }).call(function () {
            e.showTurnList();
          }).start();
        };
        t.getData = function (e) {
          var t = r.FrameData.getCoinConf(e),
            a = r.FrameData.getExchangeStatus(e),
            o = {};
          if (1 == a) o = {
            now: Math.min(c.FrameSDK.frameData.gameData.passLevel, t.rdm_1),
            total: t.rdm_1,
            tips: "skey_049??&value1==<color= #DF4704>" + t.rdm_1 + "</c>"
          };else if (2 == a) {
            var n = r.FrameData.saveData.CoinStep[e];
            o = {
              now: Math.min(r.FrameData.saveData.credit.yellowCoin, n.targetCoin),
              total: n.targetCoin,
              tips: "skey_050??&value1==<color= #009D12>" + c.FrameSDK.convertCoinToStr(n.targetCoin, !0) + "</c>"
            };
          } else if (3 == a) {
            n = r.FrameData.saveData.CoinStep[e];
            o = {
              now: Math.min(c.FrameSDK.frameData.gameData.passLevel, t.rdm_3),
              total: t.rdm_3,
              tips: "skey_053??&value1==<color= #DF4704>" + t.rdm_3 + "</c>&value2==<color= #009D12>" + c.FrameSDK.convertCoinToStr(n.targetCoin, !0) + "</c>"
            };
          }
          o.status = a;
          return o;
        };
        var a;
        i([p(cc.Node)], t.prototype, "top", void 0);
        i([p(cc.RichText)], t.prototype, "rtx_turnInfo", void 0);
        i([p(cc.Label)], t.prototype, "lbl_gCoin", void 0);
        i([p(cc.Node)], t.prototype, "paymentRootNode", void 0);
        i([p(cc.RichText)], t.prototype, "rtx_tips", void 0);
        i([p(cc.Node)], t.prototype, "guide", void 0);
        i([p(cc.ScrollView)], t.prototype, "scrollview", void 0);
        return a = i([d], t);
      }(cc.Component);
    a.default = h;
    cc._RF.pop();
  }, {
    "./FrameData": "FrameData",
    "./FrameSDK": "FrameSDK",
    "./PaymentItem": "PaymentItem",
    "./RDM_LevelItem": "RDM_LevelItem"
  }],
  RDM_Toast: [function (e, t, a) {
    "use strict";

    cc._RF.push(t, "f39e6wp9FJCK6V3ZPNzOHTU", "RDM_Toast");
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
    var r = cc._decorator,
      c = r.ccclass,
      s = r.property,
      l = function (e) {
        n(t, e);
        function t() {
          var t = null !== e && e.apply(this, arguments) || this;
          t.label = null;
          t.text = "";
          return t;
        }
        t.prototype.start = function () {
          var e = this;
          cc.tween(this.node).delay(.01).by(.8, {
            y: 150
          }).delay(.7).call(function () {
            e.node.destroy();
          }).start();
        };
        t.prototype.onLoad = function () {
          this.label.string = this.text;
        };
        i([s(cc.Label)], t.prototype, "label", void 0);
        return i([c], t);
      }(cc.Component);
    a.default = l;
    cc._RF.pop();
  }, {}],
  Scaler: [function (e, t, a) {
    "use strict";

    cc._RF.push(t, "e2e38Oq8vFDD7eacsPMPk2m", "Scaler");
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
    var r = cc._decorator,
      c = r.ccclass,
      s = r.executeInEditMode,
      l = r.property,
      u = function (e) {
        n(t, e);
        function t() {
          var t = null !== e && e.apply(this, arguments) || this;
          t._maxWidth = 0;
          t._maxHeight = 0;
          return t;
        }
        Object.defineProperty(t.prototype, "maxWidth", {
          get: function () {
            return this._maxWidth;
          },
          set: function (e) {
            if (e !== this._maxWidth) {
              this._maxWidth = e;
              this._updateScale();
            }
          },
          enumerable: !1,
          configurable: !0
        });
        Object.defineProperty(t.prototype, "maxHeight", {
          get: function () {
            return this._maxHeight;
          },
          set: function (e) {
            if (e !== this._maxHeight) {
              this._maxHeight = e;
              this._updateScale();
            }
          },
          enumerable: !1,
          configurable: !0
        });
        t.prototype._updateScale = function () {
          var e = this.node.getContentSize(),
            t = this._maxWidth > 0 ? this._maxWidth / e.width : 1,
            a = this._maxHeight > 0 ? this._maxHeight / e.height : 1;
          this.node.scale = Math.min(t, a);
        };
        t.prototype.onEnable = function () {
          this._updateScale();
        };
        t.prototype.onDestroy = function () {
          this.node.off(cc.Node.EventType.SIZE_CHANGED, this._updateScale, this);
        };
        t.prototype.onLoad = function () {
          this.node.on(cc.Node.EventType.SIZE_CHANGED, this._updateScale, this);
        };
        i([l], t.prototype, "maxWidth", null);
        i([l], t.prototype, "maxHeight", null);
        i([l], t.prototype, "_maxWidth", void 0);
        i([l], t.prototype, "_maxHeight", void 0);
        return i([c, s()], t);
      }(cc.Component);
    a.default = u;
    cc._RF.pop();
  }, {}],
  SkeletonEx: [function (e, t, a) {
    "use strict";

    cc._RF.push(t, "97466Ej7CZM2JEv9Pn/Y00G", "SkeletonEx");
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
    var r = cc._decorator,
      c = r.ccclass,
      s = r.property,
      l = function () {
        function e() {
          this.name = "";
          this.isLoop = !1;
        }
        i([s()], e.prototype, "name", void 0);
        i([s()], e.prototype, "isLoop", void 0);
        return i([c("animationObj")], e);
      }(),
      u = function (e) {
        n(t, e);
        function t() {
          var t = null !== e && e.apply(this, arguments) || this;
          t.animationArray = [];
          return t;
        }
        t.prototype.onLoad = function () {
          var e = this.node.getComponent(sp.Skeleton);
          if (e && this.animationArray.length > 0) for (var t = 0; t < this.animationArray.length; t++) {
            var a = this.animationArray[t];
            0 == t ? e.setAnimation(0, a.name, a.isLoop) : e.addAnimation(0, a.name, a.isLoop);
          }
        };
        i([s([l])], t.prototype, "animationArray", void 0);
        return i([c], t);
      }(cc.Component);
    a.default = u;
    cc._RF.pop();
  }, {}],
  WebViewManager: [function (e, t, a) {
    "use strict";

    cc._RF.push(t, "9295a1ojORCg7jEU4jIO/of", "WebViewManager");
    Object.defineProperty(a, "__esModule", {
      value: !0
    });
    var o,
      n = e("./FrameSDK");
    (function (e) {
      e[e.READY = 0] = "READY";
      e[e.LOADING = 1] = "LOADING";
      e[e.LOADED = 2] = "LOADED";
      e[e.ERROR = 3] = "ERROR";
    })(o || (o = {}));
    var i = function () {
      function e() {}
      e._onAppShow = function () {
        var e, t;
        if (this._state === o.LOADED && null !== this._jumpTimestamp && void 0 !== this._jumpTimestamp) {
          var a = Date.now() - this._jumpTimestamp;
          this._jumpTimestamp = null;
          null === (t = null === (e = this._delegate) || void 0 === e ? void 0 : e.onWebViewExternalURL) || void 0 === t || t.call(e, a);
        }
      };
      e._onWebViewInteract = function () {
        var e, t;
        this._state === o.LOADED && (null === (t = null === (e = this._delegate) || void 0 === e ? void 0 : e.onWebViewInteract) || void 0 === t || t.call(e));
      };
      e._onWebViewError = function () {
        var e;
        this._clearTimeout();
        if (this._state !== o.READY && this._state !== o.ERROR) {
          n.FrameSDK.frameData.gameFuc.closeLoad();
          this._webViewNode.scale = 1;
          this._state = o.ERROR;
          null === (e = this._delegate) || void 0 === e || e.onWebViewLoad(!1);
        }
      };
      e._onWebViewLoaded = function (e) {
        var t;
        this._clearTimeout();
        if (this._state !== o.READY && this._state !== o.LOADED && this._state !== o.ERROR) {
          n.FrameSDK.frameData.gameFuc.closeLoad();
          this._webViewNode.scale = 1;
          e.evaluateJS("\n            if (!window.__injected) {\n                document.addEventListener('submit', function () {\n                    window[\"android\"].setCallBack(\"cc.js.getClassByName('WebViewManager')._onWebViewInteract();\");\n                });\n                window.__injected = true;\n            }\n        ");
          this._state = o.LOADED;
          null === (t = this._delegate) || void 0 === t || t.onWebViewLoad(!0);
        }
      };
      e._onWebViewJumpExternal = function () {
        this._state !== o.LOADED || null !== this._jumpTimestamp && void 0 !== this._jumpTimestamp || (this._jumpTimestamp = Date.now());
      };
      e._clearTimeout = function () {
        if (null !== this._timeoutID && void 0 !== this._timeoutID) {
          clearTimeout(this._timeoutID);
          this._timeoutID = null;
        }
      };
      e.hideWebView = function (e) {
        var t;
        if (e === (null === (t = this._webViewNode) || void 0 === t ? void 0 : t.parent)) {
          this._webViewNode.removeFromParent(!1);
          this._state = o.READY;
          this._delegate = null;
          this._jumpTimestamp = null;
          cc.game.targetOff(this);
          var a = this._webViewNode.getComponent(cc.WebView);
          a && (a.url = "");
        }
      };
      e.showWebView = function (e, t, a, i) {
        var r,
          c,
          s = this;
        void 0 === i && (i = 30);
        if (e !== (null === (r = this._webViewNode) || void 0 === r ? void 0 : r.parent)) {
          if (!this._webViewNode) {
            this._webViewNode = new cc.Node();
            this._webViewNode.on("loaded", this._onWebViewLoaded, this);
            this._webViewNode.on("error", this._onWebViewError, this);
            var l = this._webViewNode.addComponent(cc.Widget);
            l.alignMode = cc.Widget.AlignMode.ON_WINDOW_RESIZE;
            l.isAlignBottom = !0;
            l.isAlignLeft = !0;
            l.isAlignRight = !0;
            l.isAlignTop = !0;
            l.bottom = 0;
            l.left = 0;
            l.right = 0;
            l.top = 0;
          }
          this._webViewNode.setParent(e);
          this._webViewNode.getComponent(cc.Widget).updateAlignment();
          this._state = o.LOADING;
          this._delegate = a;
          this._jumpTimestamp = null;
          cc.sys.os === cc.sys.OS_ANDROID && jsb.reflection.callStaticMethod("org/cocos2dx/lib/Cocos2dxWebView", "setExternalJSCallback", "(Ljava/lang/String;)V", "cc.js.getClassByName('WebViewManager')._onWebViewJumpExternal");
          cc.game.targetOff(this);
          cc.game.on(cc.game.EVENT_SHOW, this._onAppShow, this);
          var u = null !== (c = this._webViewNode.getComponent(cc.WebView)) && void 0 !== c ? c : this._webViewNode.addComponent(cc.WebView);
          u.url = t;
          n.FrameSDK.frameData.gameFuc.openLoad();
          this._webViewNode.scale = 0;
          this._clearTimeout();
          this._timeoutID = setTimeout(function () {
            var e;
            n.FrameSDK.frameData.gameFuc.closeLoad();
            u.url = "";
            s._state = o.ERROR;
            null === (e = s._delegate) || void 0 === e || e.onWebViewLoad(!1);
          }, 1e3 * i);
        }
      };
      e._webViewNode = null;
      e._state = o.READY;
      e._delegate = null;
      e._jumpTimestamp = null;
      e._timeoutID = null;
      return e;
    }();
    a.default = i;
    cc.js.setClassName("WebViewManager", i);
    cc._RF.pop();
  }, {
    "./FrameSDK": "FrameSDK"
  }],
  effectsLayout: [function (e, t, a) {
    "use strict";

    cc._RF.push(t, "75b0anbtJpAG4+w+JPtuHIE", "effectsLayout");
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
    var r = e("./CashFishCredit"),
      c = e("./FrameData"),
      s = e("./FrameSDK"),
      l = e("./Panel_Activity"),
      u = cc._decorator,
      d = u.ccclass,
      p = u.property,
      h = function (e) {
        n(t, e);
        function t() {
          var t = null !== e && e.apply(this, arguments) || this;
          t.inputBlocker = null;
          t.yellowCoinNode = null;
          t.greenCoinNode = null;
          t.activityNode = null;
          t.animationRootNode = null;
          t.particle = null;
          t.icon_SpriteFrame = null;
          t.charity_SpriteFrame = null;
          t._yellowReferenceCount = 0;
          t._greenReferenceCount = 0;
          t._activityReferenceCount = 0;
          return t;
        }
        a = t;
        t.prototype.playGreen = function () {
          this.greenCoinNode.opacity = ++this._greenReferenceCount > 0 ? 255 : 0;
        };
        t.prototype.piaoCoin = function (e, t, a, o) {
          var n = this;
          r.default.isUnlocked("yellowCoin") || (e = 0);
          r.default.isUnlocked("greenCoin") || (t = 0);
          var i = 0 !== e,
            u = 0 !== t && !s.FrameSDK.frameData.gameData.noProfitAd;
          i || u ? new Promise(function (a) {
            e <= 100 ? a(!1) : s.FrameSDK.openWindow("Panel_CoinTips", {
              num: e,
              charityNum: t,
              closeCB: function () {
                return a(!0);
              }
            });
          }).then(function (d) {
            n.inputBlocker.enabled = d;
            n.particle.node.active = d;
            if (d) {
              s.FrameSDK.frameData.gameFuc.vibrate(500);
              n.particle.resetSystem();
            }
            var p = !1,
              h = !1,
              m = !1;
            if (i && e > 0) {
              var f = cc.v3(.5 * cc.winSize.width, .5 * cc.winSize.height),
                _ = void 0,
                v = e < 10 ? 5 : e <= 50 ? 10 : 20,
                y = 0;
              u && t > 0 && (f.x -= 100);
              if (d) {
                _ = 200;
                y = 1.5;
                s.FrameSDK.playEffect("done_coin_arrange");
              }
              cc.Tween.stopAllByTarget(n.animationRootNode);
              cc.tween(n.animationRootNode).delay(y).call(function () {
                return s.FrameSDK.playEffect(v > 5 ? "coin_arrange_collect" : "coin_less_collect");
              }).start();
              var g = (b = (b = r.default.getTarget("yellowCoin")).getChildByName("coin") || b).convertToWorldSpaceAR(cc.v3());
              n.playYellow();
              n.playGlodTween(f, g, !1, v, void 0, _, y, function () {
                cc.director.emit("FRESH_CREDIT", {
                  type: "yellowCoin",
                  num: c.FrameData.saveData.credit.yellowCoin + e,
                  change: e
                });
                c.FrameData.saveData.credit.yellowCoin += e;
                n.stopYellow();
                p = !0;
                if (h && !m) {
                  m = !0;
                  n.inputBlocker.enabled = !1;
                  null == o || o();
                }
              }, !0);
              if (l.default.isActivityCollectable() && e > 0) {
                var D = l.default.coinTarget.convertToWorldSpaceAR(cc.v3());
                n.playGlodTween(f, D, !1, v, void 0, _, y, function () {
                  l.default.isActivityCollectable() && e > 0 && l.default.addCoin(e);
                }, !1);
              }
            } else {
              if (e < 0) {
                var F = Math.max(0, c.FrameData.saveData.credit.yellowCoin + e);
                cc.director.emit("FRESH_CREDIT", {
                  type: "yellowCoin",
                  num: F,
                  change: e
                });
                c.FrameData.saveData.credit.yellowCoin = F;
              }
              p = !0;
            }
            if (u && t > 0) {
              f = cc.v3(.5 * cc.winSize.width, .5 * cc.winSize.height), _ = void 0;
              var b,
                C = t < 10 ? 1 : t <= 40 ? 3 : 5,
                w = (y = 0, !0);
              if (u && e > 0) {
                f.x += 100;
                w = !1;
              }
              if (d) {
                _ = 200;
                y = 1.5;
              }
              g = (b = (b = r.default.getTarget("greenCoin")).getChildByName("coin") || b).convertToWorldSpaceAR(cc.v3());
              w && s.FrameSDK.playEffect(C > 5 ? "coin_arrange_collect" : "coin_less_collect");
              n.playGreen();
              n.playGlodTween(f, g, !0, C, void 0, _, y, function () {
                cc.director.emit("FRESH_CREDIT", {
                  type: "greenCoin",
                  num: c.FrameData.saveData.credit.greenCoin + t,
                  change: t
                });
                c.FrameData.saveData.credit.greenCoin += t;
                for (var e = c.FrameData.getCoinOutNum("charityRate"), i = 0; i < a; i++) c.FrameData.saveData.charityDonated += s.FrameSDK.randomInt(e[0], e[1]);
                c.FrameData.saveData.charityDonateTime += Math.max(0, Math.floor(a));
                n.stopGreen();
                h = !0;
                if (p && !m) {
                  n.inputBlocker.enabled = !1;
                  m = !0;
                  null == o || o();
                }
              }, !0);
            } else {
              if (t < 0 && !s.FrameSDK.frameData.gameData.noProfitAd) {
                F = Math.max(0, c.FrameData.saveData.credit.greenCoin + t);
                cc.director.emit("FRESH_CREDIT", {
                  type: "greenCoin",
                  num: F,
                  change: t
                });
                c.FrameData.saveData.credit.greenCoin = F;
              }
              h = !0;
            }
            if (p && h && !m) {
              n.inputBlocker.enabled = !1;
              m = !0;
              null == o || o();
            }
          }) : null == o || o();
        };
        t.prototype.createIconAndFlyBezier = function (e, t, a, o, n, i) {
          var r = this;
          void 0 === i && (i = 1);
          a = new cc.Vec2(a.x - t.getParent().width / 2, a.y - t.getParent().height / 2);
          o = new cc.Vec2(o.x - t.getParent().width / 2, o.y - t.getParent().height / 2);
          t.setPosition(a);
          t.zIndex = 1e3;
          var c = e % 2 == 0 ? s.FrameSDK.randomIntNum(10, 60) : -s.FrameSDK.randomIntNum(10, 60),
            l = s.FrameSDK.randomIntNum(-80, -20);
          cc.tween(t).to(.3 * i, {
            position: cc.v3(a.x + c, a.y + l)
          }, {
            easing: "quadOut"
          }).call(function () {
            r.createBezier(e, t, a, o, n, i);
          }).start();
        };
        t.prototype.startFlyProcess = function (e, t, o, n, i, r) {
          var c, l;
          void 0 === r && (r = 5);
          var u = e ? this.charity_SpriteFrame : this.icon_SpriteFrame,
            d = this.animationRootNode.convertToNodeSpaceAR(t),
            p = this.animationRootNode.convertToNodeSpaceAR(o),
            h = .15;
          r > 1 && .2 + 1.4 + h * (r - 1) > 2 && (h = Math.max(.01, (1.8 - 1.4) / (r - 1)));
          for (var m = function () {
              var e = null !== (c = a._nodePool.get()) && void 0 !== c ? c : new cc.Node();
              e.scale = 1;
              e.opacity = 0;
              e.setPosition(d.x, d.y, 0);
              f.animationRootNode.addChild(e);
              (null !== (l = e.getComponent(cc.Sprite)) && void 0 !== l ? l : e.addComponent(cc.Sprite)).spriteFrame = u;
              var t = _ % 2 == 0 ? s.FrameSDK.randomIntNum(10, 60) : -s.FrameSDK.randomIntNum(10, 60),
                o = s.FrameSDK.randomIntNum(-80, -20),
                m = s.FrameSDK.randomIntNum(80, 150);
              _ % 3 == 1 ? m = -m : _ % 3 == 2 && (m = s.FrameSDK.randomIntNum(-80, 80));
              var v = cc.v2(d.x + m, d.y - Math.abs(m)),
                y = cc.v2(p.x - m, p.y - Math.abs(m)),
                g = _;
              cc.tween(e).delay(h * _).set({
                opacity: 255
              }).to(.2, {
                x: d.x + t,
                y: d.y + o
              }, {
                easing: "sineInOut"
              }).bezierTo(1.4, v, y, p).call(function () {
                s.FrameSDK.playEffect("cash_collect");
                null == n || n(g);
                g === r - 1 && (null == i || i());
                a._nodePool.put(e);
              }).start();
            }, f = this, _ = 0; _ < r; _++) m();
        };
        t.prototype.playGlodTween = function (e, t, o, n, i, r, c, l, u) {
          var d, p;
          void 0 === n && (n = 15);
          void 0 === i && (i = 150);
          void 0 === r && (r = 150);
          void 0 === c && (c = 0);
          void 0 === l && (l = null);
          void 0 === u && (u = !0);
          e = this.animationRootNode.convertToNodeSpaceAR(e);
          t = this.animationRootNode.convertToNodeSpaceAR(t);
          for (var h = o ? this.charity_SpriteFrame : this.icon_SpriteFrame, m = u ? function () {
              return s.FrameSDK.playEffect("cash_collect");
            } : function () {}, f = 0, _ = function (o) {
              var u = null !== (d = a._nodePool.get()) && void 0 !== d ? d : new cc.Node();
              (null !== (p = u.getComponent(cc.Sprite)) && void 0 !== p ? p : u.addComponent(cc.Sprite)).spriteFrame = h;
              u.scale = 1;
              u.opacity = 0;
              u.setPosition(e);
              v.animationRootNode.addChild(u);
              var _ = cc.v3(e.x + s.FrameSDK.randomIntNum(-i, i), e.y + s.FrameSDK.randomIntNum(-r, r));
              cc.tween(u).delay(c).set({
                opacity: 255
              }).to(.08 + .015 * o, {
                position: _
              }).delay(.2 + .01 * o).to(.47, {
                position: t
              }).call(function () {
                return m();
              }).parallel(cc.tween().to(.2, {
                scale: 1.5
              }), cc.tween().to(.2, {
                opacity: 0
              })).call(function () {
                a._nodePool.put(u);
                ++f === n && (null == l || l());
              }).start();
            }, v = this, y = 0; y < n; y++) _(y);
        };
        t.prototype.onEnable = function () {
          cc.director.on("ADD_COIN", this.piaoCoin, this);
          cc.director.on("ADD_BIT_COIN", this.piaoBitCoin, this);
          this.inputBlocker.enabled = !1;
          this.yellowCoinNode.opacity = 0;
          this.greenCoinNode.opacity = 0;
          this.activityNode.opacity = 0;
        };
        t.prototype.onDisable = function () {
          cc.director.removeAll(this);
        };
        t.prototype.createBezier = function (e, t, a, o, n, i) {
          var r = t.scale,
            c = s.FrameSDK.randomIntNum(80, 150);
          e % 3 == 1 ? c = -c : e % 3 == 2 && (c = s.FrameSDK.randomIntNum(-80, 80));
          var l = [],
            u = cc.v2(a.x + c, a.y - Math.abs(c)),
            d = cc.v2(o.x - c, o.y - Math.abs(c));
          l.push(u);
          l.push(d);
          l.push(o);
          cc.tween(t).repeatForever(cc.tween().to(.3, {
            scaleX: -1 * r
          }).to(.3, {
            scaleX: 1 * r
          }));
          cc.tween(t).delay(.1 * e * i).call(function () {}).parallel(cc.tween().to(.1 * i, {
            opacity: 255
          }), cc.tween().then(cc.bezierTo(1.5 * i, l))).call(function () {
            null == n || n(e);
            t.destroy();
          }).start();
        };
        t.prototype.playYellow = function () {
          this.yellowCoinNode.opacity = ++this._yellowReferenceCount > 0 ? 255 : 0;
          l.default.isActivityCollectable() && (this.activityNode.opacity = ++this._activityReferenceCount > 0 ? 255 : 0);
        };
        t.prototype.stopGreen = function () {
          this._greenReferenceCount = Math.max(0, this._greenReferenceCount - 1);
          this.greenCoinNode.opacity = this._greenReferenceCount > 0 ? 255 : 0;
        };
        t.prototype.piaoBitCoin = function (e, t, a, o, n) {
          var i,
            u,
            d,
            p,
            h = this,
            m = !1,
            f = !1,
            _ = !1,
            v = function () {
              if (m && f && !_) {
                _ = !0;
                null == n || n();
              }
            };
          if (e > 0) {
            var y = (b = (b = r.default.getTarget("yellowCoin")).getChildByName("coin") || b).convertToWorldSpaceAR(cc.Vec2.ZERO),
              g = cc.v2(null !== (i = null == o ? void 0 : o.x) && void 0 !== i ? i : .5 * cc.winSize.width, null !== (u = null == o ? void 0 : o.y) && void 0 !== u ? u : .5 * cc.winSize.height),
              D = e > 5 ? 5 : e;
            t > 0 && (g.x -= 100);
            this.playYellow();
            this.startFlyProcess(!1, g, y, void 0, function () {
              cc.director.emit("FRESH_CREDIT", {
                type: "yellowCoin",
                num: c.FrameData.saveData.credit.yellowCoin + e,
                change: e
              });
              c.FrameData.saveData.credit.yellowCoin += e;
              h.stopYellow();
              m = !0;
              v();
            }, D);
            if (l.default.isActivityCollectable()) {
              var F = l.default.coinTarget.convertToWorldSpaceAR(cc.Vec2.ZERO);
              this.startFlyProcess(!1, g, F, void 0, function () {
                l.default.isActivityCollectable() && l.default.addCoin(e);
              }, D);
            }
          } else m = !0;
          if (t > 0) {
            var b;
            y = (b = (b = r.default.getTarget("greenCoin")).getChildByName("coin") || b).convertToWorldSpaceAR(cc.Vec2.ZERO), g = cc.v2(null !== (d = null == o ? void 0 : o.x) && void 0 !== d ? d : .5 * cc.winSize.width, null !== (p = null == o ? void 0 : o.y) && void 0 !== p ? p : .5 * cc.winSize.height), D = t > 5 ? 5 : t;
            e > 0 && (g.x += 100);
            this.playGreen();
            this.startFlyProcess(!0, g, y, void 0, function () {
              cc.director.emit("FRESH_CREDIT", {
                type: "greenCoin",
                num: c.FrameData.saveData.credit.greenCoin + t,
                change: t
              });
              c.FrameData.saveData.credit.greenCoin += t;
              for (var e = c.FrameData.getCoinOutNum("charityRate"), o = 0; o < a; o++) c.FrameData.saveData.charityDonated += s.FrameSDK.randomInt(e[0], e[1]);
              c.FrameData.saveData.charityDonateTime += Math.max(0, Math.floor(a));
              h.stopGreen();
              f = !0;
              v();
            }, D);
          } else f = !0;
          v();
          _ || s.FrameSDK.playEffect("pool_ui_butie");
        };
        t.prototype.stopYellow = function () {
          this._yellowReferenceCount = Math.max(0, this._yellowReferenceCount - 1);
          this.yellowCoinNode.opacity = this._yellowReferenceCount > 0 ? 255 : 0;
          if (this.activityNode.opacity > 0) {
            this._activityReferenceCount = Math.max(0, this._activityReferenceCount - 1);
            this.activityNode.opacity = this._activityReferenceCount > 0 ? 255 : 0;
          }
        };
        var a;
        t._nodePool = new cc.NodePool();
        i([p(cc.BlockInputEvents)], t.prototype, "inputBlocker", void 0);
        i([p(cc.Node)], t.prototype, "yellowCoinNode", void 0);
        i([p(cc.Node)], t.prototype, "greenCoinNode", void 0);
        i([p(cc.Node)], t.prototype, "activityNode", void 0);
        i([p(cc.Node)], t.prototype, "animationRootNode", void 0);
        i([p(cc.ParticleSystem)], t.prototype, "particle", void 0);
        i([p(cc.SpriteFrame)], t.prototype, "icon_SpriteFrame", void 0);
        i([p(cc.SpriteFrame)], t.prototype, "charity_SpriteFrame", void 0);
        return a = i([d], t);
      }(cc.Component);
    a.default = h;
    cc._RF.pop();
  }, {
    "./CashFishCredit": "CashFishCredit",
    "./FrameData": "FrameData",
    "./FrameSDK": "FrameSDK",
    "./Panel_Activity": "Panel_Activity"
  }],
  i18: [function (e, t, a) {
    "use strict";

    cc._RF.push(t, "71d820hYo9HrJy7tTPoIPgw", "i18");
    Object.defineProperty(a, "__esModule", {
      value: !0
    });
    var o = function () {
      function e() {}
      e.updataString = function () {
        for (var t = e._FRESH_STRINGArray.length - 1; t >= 0; t--) {
          var a = e._FRESH_STRINGArray[t];
          if (cc.isValid(a) && a.sKey) {
            var o = e.getKeyStr(a.sKey);
            a.keystring = o;
            a.string = o;
          } else e._FRESH_STRINGArray.splice(t, 1);
        }
      };
      e.parseURL = function (e) {
        for (var t, a = {}, o = e.split("&"), n = o.length, i = 0; i < n; i++) if (o[i]) {
          (t = o[i].split("=="))[1] = t[1].replace(/%/g, "%25");
          a[t[0]] = decodeURIComponent(t[1]);
        }
        return a;
      };
      e.setLanguage = function (t) {
        function a(e) {
          for (var t = e.indexOf("#"), a = (e = e.substring(0, -1 == t ? e.length : t)).split(-1 != e.indexOf("_") ? "_" : "-"), o = a.length - 1; o >= 0; o--) "" == a[o] && a.splice(o, 1);
          var n = {
            lang: a[0],
            country: "SBALL"
          };
          a.length > 1 && (n = {
            lang: a[0],
            country: a[a.length - 1]
          });
          return n;
        }
        var o = function () {
          for (var o = a(t), n = e.COUNTRY_LIST, i = 0, r = n; i < r.length; i++) {
            var c = r[i];
            if (o.country.toLowerCase() == c.country.toLowerCase()) return c;
          }
          o = {
            lang: "en",
            country: "SBALL"
          };
          for (var s = 0, l = n; s < l.length; s++) {
            c = l[s];
            if (o.country.toLowerCase() == c.country.toLowerCase()) return c;
          }
          return n[0];
        }();
        e.myLanguge = o.language;
        e.updataString();
      };
      e.getKeyStr = function (t) {
        if (e.i18nArray) {
          var a = e.changeStr(t);
          if (a) {
            var o = a.indexOf("??&");
            if (-1 != o) {
              var n = a.substring(0, o),
                i = a.substring(o + 2, a.length),
                r = e.parseURL(i),
                c = n.match(/xxx_\d/g);
              if (c) for (var s = 0; s < c.length; s++) n = n.replace(c[s], r["value" + c[s].substring(4, 5)]);
              return n;
            }
            return a;
          }
          return null;
        }
      };
      e.getReplaceStr = function (t, a) {
        if (e.i18nArray[t] && e.i18nArray[t][a]) return e.i18nArray[t][a][e.myLanguge] ? e.i18nArray[t][a][e.myLanguge] : e.i18nArray[t][a].en ? e.i18nArray[t][a].en : null;
      };
      e.changeStr = function (t) {
        for (var a in e.i18nArray) {
          var o = t.indexOf(a);
          if (-1 != o) {
            var n = t,
              i = t.substring(o + a.length, o + a.length + 3),
              r = parseInt(i),
              c = e.getReplaceStr(a, r);
            if (c) {
              n = t.replace(a + i, c);
              var s = this.changeStr(n);
              s && (n = s);
            }
            return n;
          }
        }
        return null;
      };
      e.addi18nArray = function (t) {
        var a = this;
        if (e.i18nArray) for (var o = 0, n = t; o < n.length; o++) {
          var i = n[o],
            r = i.key.lastIndexOf("_") + 1,
            c = i.key.substring(0, r),
            s = parseInt(i.key.substring(r, i.key.length));
          null == e.i18nArray[c] && (e.i18nArray[c] = {});
          null == e.i18nArray[c][s] ? e.i18nArray[c][s] = i : console.error("" + c + s + " 已存在");
        } else {
          e.i18nArray = {};
          setTimeout(function () {
            a.addi18nArray(t);
          }, 16.6);
        }
      };
      e.init = function (t, a, o) {
        e.addi18nArray(t);
        e.setLanguage(a || cc.sys.languageCode);
        o && (e.COUNTRY_LIST = o);
        var n = function (t) {
            var a = e.getKeyStr(t);
            if (a) {
              if (!this.sKey) {
                for (var o = e._FRESH_STRINGArray.length - 1; o >= 0; o--) {
                  var n = e._FRESH_STRINGArray[o];
                  cc.isValid(n) && n.sKey || e._FRESH_STRINGArray.splice(o, 1);
                }
                e._FRESH_STRINGArray.push(this);
              }
              this.sKey = t;
              this.keystring = a;
              t = a;
            } else this.sKey && this.keystring != t && (this.sKey = null);
            return t;
          },
          i = Object.getOwnPropertyDescriptor(cc.Label.prototype, "string");
        Object.defineProperty(cc.Label.prototype, "string", {
          set: function (e) {
            i.set.call(this, n.call(this, e.toString()));
          },
          get: function () {
            this._string = n.call(this, this._string);
            return i.get.call(this);
          }
        });
        var r = Object.getOwnPropertyDescriptor(cc.RichText.prototype, "string");
        Object.defineProperty(cc.RichText.prototype, "string", {
          set: function (e) {
            r.set.call(this, n.call(this, e.toString()));
          },
          get: function () {
            this._N$string = n.call(this, this._N$string);
            return r.get.call(this);
          }
        });
      };
      e.i18nArray = {};
      e.myLanguge = "en";
      e.COUNTRY_LIST = [{
        id: 101,
        name: "美国",
        country: "US",
        language: "en",
        rate: 1,
        symbol: "$",
        ad_t: 1,
        cash_id: [101, 103, 102, 104]
      }, {
        id: 102,
        name: "英国",
        country: "GB",
        language: "en",
        rate: 1,
        symbol: "￡",
        ad_t: 1,
        cash_id: [101, 103, 102, 104]
      }, {
        id: 103,
        name: "法国",
        country: "FR",
        language: "fr",
        rate: 1,
        symbol: "€",
        ad_t: 1,
        cash_id: [101, 103, 102, 104]
      }, {
        id: 104,
        name: "德国",
        country: "DE",
        language: "de",
        rate: 1,
        symbol: "€",
        ad_t: 1,
        cash_id: [101, 103, 102, 104]
      }, {
        id: 105,
        name: "日本",
        country: "JP",
        language: "ja",
        rate: 100,
        symbol: "円",
        ad_t: 1,
        cash_id: [122, 126, 101, 103]
      }, {
        id: 106,
        name: "加拿大",
        country: "CA",
        language: "en",
        rate: 1,
        symbol: "$",
        ad_t: 1,
        cash_id: [101, 103, 102, 104]
      }, {
        id: 107,
        name: "澳大利亚",
        country: "AU",
        language: "en",
        rate: 1,
        symbol: "$",
        ad_t: 1,
        cash_id: [101, 103, 102, 104]
      }, {
        id: 108,
        name: "新西兰",
        country: "NZ",
        language: "en",
        rate: 1,
        symbol: "$",
        ad_t: 1,
        cash_id: [101, 103, 102, 104]
      }, {
        id: 109,
        name: "挪威",
        country: "NO",
        language: "no",
        rate: 10,
        symbol: "NOK",
        ad_t: 1,
        cash_id: [101, 103, 102, 104]
      }, {
        id: 110,
        name: "新加坡",
        country: "SG",
        language: "en",
        rate: 1,
        symbol: "$",
        ad_t: 1,
        cash_id: [101, 103, 102, 104]
      }, {
        id: 111,
        name: "瑞典",
        country: "SE",
        language: "se",
        rate: 10,
        symbol: "SEK",
        ad_t: 1,
        cash_id: [101, 103, 102, 104]
      }, {
        id: 112,
        name: "瑞士",
        country: "CH",
        language: "de",
        rate: 1,
        symbol: "CHF",
        ad_t: 1,
        cash_id: [101, 103, 102, 104]
      }, {
        id: 201,
        name: "西班牙",
        country: "ES",
        language: "es",
        rate: 1,
        symbol: "€",
        ad_t: 2,
        cash_id: [113, 111, 101, 103]
      }, {
        id: 202,
        name: "阿拉伯",
        country: "SA",
        language: "ar",
        rate: 5,
        symbol: "SR",
        ad_t: 2,
        cash_id: [101, 103, 102, 104]
      }, {
        id: 203,
        name: "波兰",
        country: "PL",
        language: "pl",
        rate: 5,
        symbol: "złote",
        ad_t: 2,
        cash_id: [101, 103, 102, 104]
      }, {
        id: 204,
        name: "韩国",
        country: "KR",
        language: "ko",
        rate: 1e3,
        symbol: "₩",
        ad_t: 2,
        cash_id: [130, 101, 103, 102]
      }, {
        id: 205,
        name: "意大利",
        country: "IT",
        language: "it",
        rate: 1,
        symbol: "€",
        ad_t: 2,
        cash_id: [101, 103, 102, 104]
      }, {
        id: 206,
        name: "比利时",
        country: "BE",
        language: "nl",
        rate: 1,
        symbol: "€",
        ad_t: 2,
        cash_id: [101, 103, 102, 104]
      }, {
        id: 207,
        name: "荷兰",
        country: "NL",
        language: "nl",
        rate: 1,
        symbol: "€",
        ad_t: 2,
        cash_id: [101, 103, 102, 104]
      }, {
        id: 301,
        name: "印度",
        country: "IN",
        language: "hi",
        rate: 80,
        symbol: "₹",
        ad_t: 3,
        cash_id: [124, 125, 101, 103]
      }, {
        id: 302,
        name: "印尼",
        country: "ID",
        language: "in",
        rate: 15e3,
        symbol: "Rp",
        ad_t: 3,
        cash_id: [105, 106, 101, 103]
      }, {
        id: 303,
        name: "葡萄牙",
        country: "PT",
        language: "pt",
        rate: 1,
        symbol: "€",
        ad_t: 3,
        cash_id: [101, 103, 102, 104]
      }, {
        id: 304,
        name: "泰国",
        country: "TH",
        language: "th",
        rate: 30,
        symbol: "฿",
        ad_t: 3,
        cash_id: [112, 118, 101, 103]
      }, {
        id: 305,
        name: "菲律宾",
        country: "PH",
        language: "fil",
        rate: 50,
        symbol: "₱",
        ad_t: 3,
        cash_id: [121, 116, 101, 103]
      }, {
        id: 306,
        name: "马来西亚",
        country: "MY",
        language: "ms",
        rate: 5,
        symbol: "RM",
        ad_t: 3,
        cash_id: [119, 121, 101, 103]
      }, {
        id: 307,
        name: "哥伦比亚",
        country: "CO",
        language: "es",
        rate: 3e3,
        symbol: "COP",
        ad_t: 3,
        cash_id: [101, 103, 102, 104]
      }, {
        id: 308,
        name: "阿根廷",
        country: "AR",
        language: "es",
        rate: 350,
        symbol: "ARS",
        ad_t: 3,
        cash_id: [101, 103, 102, 104]
      }, {
        id: 309,
        name: "墨西哥",
        country: "MX",
        language: "es",
        rate: 20,
        symbol: "Mex.$",
        ad_t: 3,
        cash_id: [113, 111, 101, 103]
      }, {
        id: 310,
        name: "巴西",
        country: "BR",
        language: "pt",
        rate: 5,
        symbol: "R$",
        ad_t: 3,
        cash_id: [107, 113, 123, 101]
      }, {
        id: 311,
        name: "越南",
        country: "VN",
        language: "vi",
        rate: 2e4,
        symbol: "₫",
        ad_t: 3,
        cash_id: [120, 115, 101, 103]
      }, {
        id: 312,
        name: "土耳其",
        country: "TR",
        language: "tr",
        rate: 8,
        symbol: "₺",
        ad_t: 3,
        cash_id: [101, 103, 102, 104]
      }, {
        id: 313,
        name: "罗马尼亚",
        country: "RO",
        language: "ro",
        rate: 5,
        symbol: "Lei",
        ad_t: 3,
        cash_id: [101, 103, 102, 104]
      }, {
        id: 314,
        name: "约旦",
        country: "JO",
        language: "ar",
        rate: 1,
        symbol: "$",
        ad_t: 3,
        cash_id: [101, 103, 102, 104]
      }, {
        id: 315,
        name: "伊拉克",
        country: "IQ",
        language: "ar",
        rate: 1,
        symbol: "$",
        ad_t: 3,
        cash_id: [101, 103, 102, 104]
      }, {
        id: 316,
        name: "埃及",
        country: "EG",
        language: "ar",
        rate: 1,
        symbol: "$",
        ad_t: 3,
        cash_id: [101, 103, 102, 104]
      }, {
        id: 317,
        name: "以色列",
        country: "IL",
        language: "ar",
        rate: 1,
        symbol: "$",
        ad_t: 3,
        cash_id: [101, 103, 102, 104]
      }, {
        id: 318,
        name: "俄罗斯",
        country: "RU",
        language: "ru",
        rate: 70,
        symbol: "₽",
        ad_t: 3,
        cash_id: [114, 117, 101, 103]
      }, {
        id: 319,
        name: "乌克兰",
        country: "UA",
        language: "uk",
        rate: 20,
        symbol: "₴",
        ad_t: 3,
        cash_id: [101, 103, 102, 104]
      }, {
        id: 400,
        name: "SBALL",
        country: "SBALL",
        language: "en",
        rate: 1,
        symbol: "$",
        ad_t: 3,
        cash_id: [101, 103, 102, 104]
      }];
      e._FRESH_STRINGArray = [];
      return e;
    }();
    a.default = o;
    cc.js.setClassName("i18", o);
    cc._RF.pop();
  }, {}],
  isAutoHead: [function (e, t, a) {
    "use strict";

    cc._RF.push(t, "e3146iXr0ZNAZ3yThPsljFL", "isAutoHead");
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
    var r,
      c = cc._decorator,
      s = c.ccclass,
      l = c.property;
    (function (e) {
      e[e.isTop = 0] = "isTop";
      e[e.isBottom = 1] = "isBottom";
    })(r || (r = {}));
    var u = function () {
        function e() {
          this.type = r.isTop;
          this.num = 65;
        }
        i([l({
          type: cc.Enum(r)
        })], e.prototype, "type", void 0);
        i([l()], e.prototype, "num", void 0);
        return i([s("AutoHeadType2")], e);
      }(),
      d = function (e) {
        n(t, e);
        function t() {
          var t = null !== e && e.apply(this, arguments) || this;
          t.autoDatas = [{
            type: r.isTop,
            num: 65
          }];
          return t;
        }
        t.prototype.onLoad = function () {
          if (cc.winSize.width / cc.winSize.height < .56) for (var e = 0, t = this.autoDatas; e < t.length; e++) {
            var a = t[e];
            0 == a.type && (this.node.getComponent(cc.Widget).top = this.node.getComponent(cc.Widget).top + a.num);
            1 == a.type && (this.node.getComponent(cc.Widget).bottom = this.node.getComponent(cc.Widget).bottom + a.num);
          }
        };
        i([l([u])], t.prototype, "autoDatas", void 0);
        return i([s], t);
      }(cc.Component);
    a.default = d;
    cc._RF.pop();
  }, {}],
  isDeBug: [function (e, t, a) {
    "use strict";

    cc._RF.push(t, "2c638FxYotHg5ARjF0oxkkL", "isDeBug");
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
    var r = e("./FrameSDK"),
      c = e("./FrameData"),
      s = cc._decorator,
      l = s.ccclass,
      u = (s.property, function (e) {
        n(t, e);
        function t() {
          return null !== e && e.apply(this, arguments) || this;
        }
        t.prototype.onLoad = function () {
          this.node.active = r.FrameSDK.frameData.isDeBug || c.FrameData.isTest;
        };
        return i([l], t);
      }(cc.Component));
    a.default = u;
    cc._RF.pop();
  }, {
    "./FrameData": "FrameData",
    "./FrameSDK": "FrameSDK"
  }]
}, {}, ["AinanEff", "BadgeEff", "BottomTips", "Button_Activity", "Button_SuperReward", "Button_Task", "CLICKLOCK", "CashFishCredit", "FlyingBonus", "Frame", "FrameData", "FrameSDK", "GM", "Item_Record", "Level_Bar", "Panel_Account", "Panel_Activity", "Panel_ActivityGuide", "Panel_AdAlternate", "Panel_Award_1", "Panel_Award_3", "Panel_Award_5", "Panel_Award_New", "Panel_Award_Super1", "Panel_Award_Super2", "Panel_CoinTips", "Panel_Feedback", "Panel_Guide", "Panel_GuideSuperReward", "Panel_GuideTips", "Panel_Rating", "Panel_RedeemTips", "Panel_SuperReward", "Panel_SuperRewardTask", "Panel_SuperRewardTips", "Panel_Task", "Panel_Tips", "Panel_WelcomeBack", "PaymentItem", "RDM_Charity", "RDM_CharityItem", "RDM_Level", "RDM_LevelItem", "RDM_Toast", "Scaler", "SkeletonEx", "WebViewManager", "effectsLayout", "i18", "isAutoHead", "isDeBug"]);