PoolWrapper: [function (e, t, o) {
    "use strict";

    cc._RF.push(t, "783aa15ZupBELn2QgRsuPmg", "PoolWrapper");
    Object.defineProperty(o, "__esModule", {
      value: !0
    });
    o.PoolWrapper = o.EVideoEvent = o.PoolEventName = void 0;
    var n,
      i,
      a = e("./resource/RBZQUGXCXJVJJG"),
      r = e("./resource/TCPQCFUPKWLNKB/QKTGTRSTJQU");
    (function (e) {
      e.NEW_BALL_CHANGED = "new-ball-changed";
      e.HARD_CODE_CHANGED = "hard-code-changed";
    })(n = o.PoolEventName || (o.PoolEventName = {}));
    (function (e) {
      e[e.START = 0] = "START";
      e[e.END = 1] = "END";
      e[e.CLICK = 2] = "CLICK";
      e[e.INTERRUPT = 3] = "INTERRUPT";
      e[e.PROFIT = 4] = "PROFIT";
      e[e.FAIL = 5] = "FAIL";
    })(i = o.EVideoEvent || (o.EVideoEvent = {}));
    var l = function () {
      function e() {
        this._hardCodeWrapper = new s();
        this._newBallWrapper = new c();
        this._cpClientWrapper = new u();
        this._bannerWrapper = new p();
        this._videoWrapper = new d();
        this._interstitialWrapper = new _();
        this._splashWrapper = new f();
        this._muteFunction = void 0;
      }
      Object.defineProperty(e, "instance", {
        get: function () {
          this._instance || (this._instance = new e());
          return this._instance;
        },
        enumerable: !1,
        configurable: !0
      });
      e.prototype.onFreePopupCollected = function () {
        r.QKTGTRSTJQU.HRAFFWBCMUIZ();
      };
      Object.defineProperty(e.prototype, "mute", {
        set: function (e) {
          var t;
          null === (t = this._muteFunction) || void 0 === t || t.call(this, e);
        },
        enumerable: !1,
        configurable: !0
      });
      Object.defineProperty(e.prototype, "hardCode", {
        get: function () {
          return this._hardCodeWrapper.hardCode;
        },
        enumerable: !1,
        configurable: !0
      });
      Object.defineProperty(e.prototype, "newBall", {
        get: function () {
          return this._newBallWrapper.newBall;
        },
        set: function (e) {
          this._newBallWrapper.newBall = e;
        },
        enumerable: !1,
        configurable: !0
      });
      Object.defineProperty(e.prototype, "cpClient", {
        get: function () {
          return this._cpClientWrapper.cpClient;
        },
        enumerable: !1,
        configurable: !0
      });
      Object.defineProperty(e.prototype, "intersititialReady", {
        get: function () {
          return this._interstitialWrapper.intersititialReady;
        },
        enumerable: !1,
        configurable: !0
      });
      e.prototype.onPopupClaim = function () {
        r.QKTGTRSTJQU.UZHUEXGTT();
      };
      Object.defineProperty(e.prototype, "videoReady", {
        get: function () {
          return this._videoWrapper.videoReady;
        },
        enumerable: !1,
        configurable: !0
      });
      e.prototype.onFreePopupClaim = function () {
        r.QKTGTRSTJQU.UPYXBRDOUAKRG();
      };
      e.prototype.onFreePopupShow = function () {
        r.QKTGTRSTJQU.EALBFLQHQIRYX();
      };
      e.prototype.init = function (e, t) {
        var o = a.RBZQUGXCXJVJJG.ZSYXBLSKYBGCRTL();
        o.WNQKZCZDGVYDTL().BNTJZPHDS(this._hardCodeWrapper);
        o.FOWHNIUAUS().FJGKCYXF(this._newBallWrapper);
        o.LRRHEYFMQEPE().KMTYRBVRZVBENMR(this._cpClientWrapper);
        o.SORATCEUWRDMCEW().RKLFYESZBGK(this._bannerWrapper);
        o.CEBELIS().NEDSFIADEVXEW(this._videoWrapper);
        o.NDOJTRG().KRGTITGFJPNED(this._interstitialWrapper);
        o.IHTBQNPHGN().QVRGUFKEONTDPA(this._splashWrapper);
        o.RVIUIWJHMUDCSKSL(e);
        this._muteFunction = t;
      };
      Object.defineProperty(e.prototype, "splashReady", {
        get: function () {
          return this._splashWrapper.splashReady;
        },
        enumerable: !1,
        configurable: !0
      });
      e.prototype.onAppLauch = function () {
        r.QKTGTRSTJQU.PWGLTPPRPEKF();
      };
      e.prototype.showInterstitial = function (e, t) {
        this._interstitialWrapper.showInterstitial(e, t);
      };
      e.prototype.logEvent = function (e, t) {
        console.log("log event: " + e + " - " + JSON.stringify(null != t ? t : {}));
        a.RBZQUGXCXJVJJG.ZSYXBLSKYBGCRTL().WWKERPPCIUQWCTU().RVZMUJV(e, t);
      };
      Object.defineProperty(e.prototype, "idfa", {
        get: function () {
          return a.RBZQUGXCXJVJJG.ZSYXBLSKYBGCRTL().EWYOIHVSM().KCIVAEMQCVMWNY();
        },
        enumerable: !1,
        configurable: !0
      });
      e.prototype.showVideo = function (e, t) {
        this._videoWrapper.showVideo(e, t);
      };
      e.prototype.onSlotShow = function () {
        r.QKTGTRSTJQU.SVSKLSMZ();
      };
      e.prototype.onPopupCollected = function () {
        r.QKTGTRSTJQU.MLMRJXWUQVUJRTA();
      };
      e.prototype.hideBanner = function () {
        this._bannerWrapper.hideBanner();
      };
      e.prototype.showSplash = function (e) {
        this._splashWrapper.showSplash(e);
      };
      e.prototype.showBanner = function (e, t) {
        void 0 === e && (e = "bottom");
        void 0 === t && (t = 0);
        this._bannerWrapper.showBanner(e, t);
      };
      e.prototype.logLifeEvent = function (e) {
        this.logEvent("game_life_key_node", {
          step: e
        });
      };
      e.prototype.onAppShow = function () {
        r.QKTGTRSTJQU.WZSFTRLLDYFJY();
      };
      e.prototype.onPopupShow = function () {
        r.QKTGTRSTJQU.NZGUPSYGNIWSAGW();
      };
      e.EventName = n;
      e._instance = null;
      return e;
    }();
    o.PoolWrapper = l;
    var s = function () {
        function e() {
          this._hardCode = "";
        }
        Object.defineProperty(e.prototype, "hardCode", {
          get: function () {
            return this._hardCode;
          },
          enumerable: !1,
          configurable: !0
        });
        e.prototype.DWPYXIXOCY = function (e) {
          console.log("hardCode: " + e);
          this._hardCode = e;
          cc.director.emit(n.HARD_CODE_CHANGED, this._hardCode);
        };
        return e;
      }(),
      c = function () {
        function e() {
          this._newBall = void 0;
        }
        Object.defineProperty(e.prototype, "newBall", {
          get: function () {
            return this._newBall;
          },
          set: function (e) {
            this._newBall = e;
          },
          enumerable: !1,
          configurable: !0
        });
        e.prototype.WMOUXEFYZOENB = function (e) {
          console.log("newBall: " + e);
          this._newBall = e;
          cc.director.emit(n.NEW_BALL_CHANGED, this._newBall);
        };
        return e;
      }(),
      u = function () {
        function e() {
          this._cpClient = "";
        }
        Object.defineProperty(e.prototype, "cpClient", {
          get: function () {
            return this._cpClient;
          },
          enumerable: !1,
          configurable: !0
        });
        e.prototype.UVUTDBCYPEHW = function (e) {
          console.log("cpClient: " + e);
          this._cpClient = e;
        };
        return e;
      }(),
      p = function () {
        function e() {}
        e.prototype.ZGENQIXEU = function () {};
        e.prototype.LRGQKWGPWCM = function () {};
        e.prototype.BSUVXVSSJEAZ = function () {};
        e.prototype.hideBanner = function () {
          a.RBZQUGXCXJVJJG.ZSYXBLSKYBGCRTL().SORATCEUWRDMCEW().HBQFOOCDXAZ();
        };
        e.prototype.showBanner = function (e, t) {
          void 0 === e && (e = "bottom");
          void 0 === t && (t = 0);
          a.RBZQUGXCXJVJJG.ZSYXBLSKYBGCRTL().SORATCEUWRDMCEW().LTBBUBX("top" === e ? 0 : 1, t);
        };
        return e;
      }(),
      d = function () {
        function e() {
          this._tag = "";
          this._videoFinished = !1;
          this._listener = void 0;
        }
        Object.defineProperty(e.prototype, "videoReady", {
          get: function () {
            return a.RBZQUGXCXJVJJG.ZSYXBLSKYBGCRTL().CEBELIS().XVQFJJJHUQWTY("game");
          },
          enumerable: !1,
          configurable: !0
        });
        e.prototype.USVDBZYLUSCZSLDZ = function () {
          var e;
          null === (e = this._listener) || void 0 === e || e.call(this, i.PROFIT);
        };
        e.prototype.TXDJUROJFUJ = function () {
          l.instance.logEvent("c_ad_event", {
            action: "rewarded",
            type: "video",
            placement: this._tag
          });
          this._videoFinished = !0;
        };
        e.prototype.KPTLEZBST = function () {
          l.instance.logEvent("c_ad_event", {
            action: "close",
            type: "video",
            placement: this._tag
          });
          l.instance.mute = !1;
          var e = this._listener;
          this._listener = void 0;
          null == e || e(this._videoFinished ? i.END : i.INTERRUPT);
        };
        e.prototype.VYTSNCHM = function () {
          var e;
          l.instance.logEvent("c_ad_event", {
            action: "click",
            type: "video",
            placement: this._tag
          });
          null === (e = this._listener) || void 0 === e || e.call(this, i.CLICK);
        };
        e.prototype.CEGCLLSF = function () {
          var e;
          l.instance.logEvent("c_ad_event", {
            action: "impression",
            type: "video",
            placement: this._tag
          });
          this._videoFinished = !1;
          l.instance.mute = !0;
          null === (e = this._listener) || void 0 === e || e.call(this, i.START);
        };
        e.prototype.showVideo = function (e, t) {
          this._tag = e;
          this._listener = t;
          if (!a.RBZQUGXCXJVJJG.ZSYXBLSKYBGCRTL().CEBELIS().ZBFDUZXA("game")) {
            this._listener = void 0;
            null == t || t(i.FAIL);
          }
        };
        return e;
      }(),
      _ = function () {
        function e() {
          this._tag = "";
          this._listener = void 0;
        }
        Object.defineProperty(e.prototype, "intersititialReady", {
          get: function () {
            return a.RBZQUGXCXJVJJG.ZSYXBLSKYBGCRTL().NDOJTRG().JFFPSVW("game");
          },
          enumerable: !1,
          configurable: !0
        });
        e.prototype.HJLLBADXE = function () {
          var e;
          l.instance.logEvent("c_ad_event", {
            action: "impression",
            type: "interstitial",
            placement: this._tag
          });
          l.instance.mute = !0;
          null === (e = this._listener) || void 0 === e || e.call(this, i.START);
        };
        e.prototype.showInterstitial = function (e, t) {
          this._tag = e;
          this._listener = t;
          if (!a.RBZQUGXCXJVJJG.ZSYXBLSKYBGCRTL().NDOJTRG().YDKKCKYYIQZTDCWY("game")) {
            this._listener = void 0;
            null == t || t(i.FAIL);
          }
        };
        e.prototype.VYMHFYXPYDC = function () {
          var e;
          l.instance.logEvent("c_ad_event", {
            action: "click",
            type: "interstitial",
            placement: this._tag
          });
          null === (e = this._listener) || void 0 === e || e.call(this, i.CLICK);
        };
        e.prototype.ETCGFWY = function () {
          l.instance.logEvent("c_ad_event", {
            action: "close",
            type: "interstitial",
            placement: this._tag
          });
          l.instance.mute = !1;
          var e = this._listener;
          this._listener = void 0;
          null == e || e(i.END);
        };
        e.prototype.USVDBZYLUSCZSLDZ = function () {
          var e;
          null === (e = this._listener) || void 0 === e || e.call(this, i.PROFIT);
        };
        return e;
      }(),
      f = function () {
        function e() {
          this._listener = void 0;
        }
        Object.defineProperty(e.prototype, "splashReady", {
          get: function () {
            return a.RBZQUGXCXJVJJG.ZSYXBLSKYBGCRTL().IHTBQNPHGN().MKHZXYYX();
          },
          enumerable: !1,
          configurable: !0
        });
        e.prototype.MDALOMV = function () {
          l.instance.mute = !1;
          var e = this._listener;
          this._listener = void 0;
          null == e || e(i.END);
        };
        e.prototype.DSRLJJG = function () {
          var e;
          null === (e = this._listener) || void 0 === e || e.call(this, i.CLICK);
        };
        e.prototype.BTTMYBOCQNPOQX = function () {
          var e;
          l.instance.mute = !0;
          null === (e = this._listener) || void 0 === e || e.call(this, i.START);
        };
        e.prototype.showSplash = function (e) {
          this._listener = e;
          if (!a.RBZQUGXCXJVJJG.ZSYXBLSKYBGCRTL().IHTBQNPHGN().RSGPVX("entry")) {
            this._listener = void 0;
            null == e || e(i.FAIL);
          }
        };
        return e;
      }();
    cc.js.setClassName("PoolWrapper", l);
    cc.js.setClassName("RBZQUGXCXJVJJG", a.RBZQUGXCXJVJJG);
    cc._RF.pop();
  }, {
    "./resource/RBZQUGXCXJVJJG": "RBZQUGXCXJVJJG",
    "./resource/TCPQCFUPKWLNKB/QKTGTRSTJQU": "QKTGTRSTJQU"
  }],
  PowerBar2Comp: [function (e, t, o) {
    "use strict";

    cc._RF.push(t, "9a0afV8oxpNZaOBn6MCFPaR", "PowerBar2Comp");
    var n,
      i = this && this.__extends || (n = function (e, t) {
        return (n = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function (e, t) {
          e.__proto__ = t;
        } || function (e, t) {
          for (var o in t) Object.prototype.hasOwnProperty.call(t, o) && (e[o] = t[o]);
        })(e, t);
      }, function (e, t) {
        n(e, t);
        function o() {
          this.constructor = e;
        }
        e.prototype = null === t ? Object.create(t) : (o.prototype = t.prototype, new o());
      }),
      a = this && this.__decorate || function (e, t, o, n) {
        var i,
          a = arguments.length,
          r = a < 3 ? t : null === n ? n = Object.getOwnPropertyDescriptor(t, o) : n;
        if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) r = Reflect.decorate(e, t, o, n);else for (var l = e.length - 1; l >= 0; l--) (i = e[l]) && (r = (a < 3 ? i(r) : a > 3 ? i(t, o, r) : i(t, o)) || r);
        return a > 3 && r && Object.defineProperty(t, o, r), r;
      };
    Object.defineProperty(o, "__esModule", {
      value: !0
    });
    var r = e("./billiards/controller/CueDataSys"),
      l = e("./framework/Event/EventMgr"),
      s = e("./framework/Event/GameEventType"),
      c = e("./Manages/UiManage"),
      u = cc._decorator,
      p = u.ccclass,
      d = u.property,
      _ = function (e) {
        i(t, e);
        function t() {
          var t = null !== e && e.apply(this, arguments) || this;
          t.percenterLabel = null;
          t.maskNode = null;
          t.huakuai = null;
          t.cueNode = null;
          t.percent = null;
          t.callback = null;
          t.callback_update = null;
          t._indicatorToCueDiffY = 0;
          return t;
        }
        t.prototype.applyByPower = function (e) {
          this.percenterLabel.string = e + "%";
        };
        t.prototype.start = function () {
          this.percenterLabel.string = "0%";
        };
        t.prototype.hideAllBars = function () {};
        t.prototype.clearLabel = function () {
          this.percenterLabel.string = "0%";
          this.maskNode.height = 0;
          this.huakuai.y = -22.5;
          this.cueNode.y = this.huakuai.y - this._indicatorToCueDiffY;
        };
        t.prototype.setCallBack_update = function (e) {
          this.callback_update = e;
        };
        t.prototype.getPercent = function () {
          return this.percent;
        };
        t.prototype.setCallBack = function (e) {
          this.callback = e;
        };
        t.prototype.onLoad = function () {
          var e = this;
          this.callback = this.callback || null;
          this.callback_update = this.callback_update || null;
          this.node.on(cc.Node.EventType.TOUCH_START, function (t) {
            var o;
            if (!t.touch || 0 == t.touch.getID()) {
              l.default.trigger(s.default.HIDE_GAMETIP);
              var n = e.node.convertToNodeSpaceAR(t.touch.getLocation());
              e._updateUI(n.y);
              null === (o = e.callback_update) || void 0 === o || o.call(e, e.getPercent());
            }
          });
          this.node.on(cc.Node.EventType.TOUCH_MOVE, function (t) {
            var o;
            if (!t.touch || 0 == t.touch.getID()) {
              l.default.trigger(s.default.HIDE_GAMETIP);
              var n = e.node.convertToNodeSpaceAR(t.touch.getLocation());
              e._updateUI(n.y);
              null === (o = e.callback_update) || void 0 === o || o.call(e, e.getPercent());
            }
          });
          this.node.on(cc.Node.EventType.TOUCH_END, function (t) {
            var o;
            if (!t.touch || 0 == t.touch.getID()) {
              l.default.trigger(s.default.HIDE_GAMETIP);
              e.hideAllBars();
              null === (o = e.callback) || void 0 === o || o.call(e, e.getPercent());
              e.clearLabel();
            }
          });
          this.node.on(cc.Node.EventType.TOUCH_CANCEL, function (t) {
            var o;
            if (!t.touch || 0 == t.touch.getID()) {
              l.default.trigger(s.default.HIDE_GAMETIP);
              e.hideAllBars();
              null === (o = e.callback) || void 0 === o || o.call(e, e.getPercent());
              e.clearLabel();
            }
          });
          this.hideAllBars();
          this._indicatorToCueDiffY = this.huakuai.y - this.cueNode.y;
          var t = this.cueNode.getChildByName("10522_Pool_Cue_v1_SG");
          c.UiManager.loadSpine(t, "cue_spine", r.default.getCurCueSourceName(), function () {
            t.isValid && t.getComponent(sp.Skeleton).setAnimation(0, "animation", !0);
          });
        };
        t.prototype._updateUI = function (e) {
          var t = -Math.max(20 - this.node.height, Math.min(e, -20));
          this.percent = (t - 20) / (this.node.height - 40);
          this.percenterLabel.string = Math.floor(100 * this.percent) + "%";
          this.maskNode.height = t;
          this.huakuai.y = -t - 2.5;
          this.cueNode.y = this.huakuai.y - this._indicatorToCueDiffY;
        };
        a([d(cc.Label)], t.prototype, "percenterLabel", void 0);
        a([d(cc.Node)], t.prototype, "maskNode", void 0);
        a([d(cc.Node)], t.prototype, "huakuai", void 0);
        a([d(cc.Node)], t.prototype, "cueNode", void 0);
        return a([p], t);
      }(cc.Component);
    o.default = _;
    cc._RF.pop();
  