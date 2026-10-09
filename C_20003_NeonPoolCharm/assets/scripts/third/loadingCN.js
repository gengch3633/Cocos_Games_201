let e = require;let t = module;let o = exports;
    "use strict";

    cc._RF.push(t, "71cc2JS7jxAvp61HQ/iWhxD", "loadingCN");
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
    var r = e("PropDataSys.js"),
      l = e("NativeEventType.js"),
      s = e("GameConfigurations.js"),
      c = e("GameHelper.js"),
      u = e("i18n.js"),
      p = e("PoolLogger.js"),
      d = e("AudioManager.js"),
      _ = e("ConfigDataSys.js"),
      f = e("PlayerDataSys.js"),
      h = e("SystemDataSys.js"),
      g = e("GlobalDataMgr.js"),
      y = e("EventMgr.js"),
      v = e("Handler.js"),
      m = e("frameworkManager.js"),
      b = e("AdManager.js"),
      C = e("SdkHelper.js"),
      P = e("BaseSystem.js"),
      S = e("languageUtil.js"),
      I = e("GuideManager.js"),
      D = e("UiManage.js"),
      E = e("CoinfinityRideress.js"),
      T = e("PoolNative.js"),
      w = e("PoolWrapper.js"),
      O = e("PageMgr.js"),
      M = cc._decorator,
      N = M.ccclass,
      L = M.property,
      R = function (e) {
        i(t, e);
        function t() {
          var t = null !== e && e.apply(this, arguments) || this;
          t.label_progress = null;
          t.loading = null;
          t.ball = null;
          t.privacyPolicy = null;
          t.versionLabel = null;
          t.guideNode = null;
          t.loadingMaskPrefab = null;
          t.i18nJson = null;
          t.wx_code = "";
          t.couldTouch = !0;
          t.hasAgree = !1;
          t.get_middle_cfg_timer = null;
          t.get_oaid_timer = null;
          t._sdk_init_count = 0;
          t.tween = null;
          return t;
        }
        t.prototype.start = function () {
          var e = this;
          this.label_progress.string = "0%";
          cc.Tween.stopAllByTarget(this.label_progress);
          cc.tween(this.label_progress).call(function () {
            return e.label_progress.string = "0%";
          }).to(5, {}, {
            onUpdate: function (t, o) {
              e.label_progress.string = Math.floor(100 * o) + "%";
            }
          }).union().repeatForever().start();
          d.default.getInstance().init();
          this.onGetMiddleCfg();
        };
        t.prototype.onGetMiddleCfg = function (e) {
          void 0 === e && (e = "{}");
          this.get_middle_cfg_timer && clearTimeout(this.get_middle_cfg_timer);
          y.default.ignore(l.default.ON_GET_MIDDLE_CONFIG, this.onGetMiddleCfg, this);
          console.log("获取中台配置2222====", e);
          h.default.init_middle_config(e);
          this.getSystemConfig();
        };
        t.prototype.mapToRange = function (e) {
          e < 0 && (e = 0);
          e > 1 && (e = 1);
          return .09999999999999998 * e + .9;
        };
        t.prototype._onPrivacyPolicy = function () {
          T.PoolNative.openURL(s.GameConfigurations.PRIVACY_POLICY);
        };
        t.prototype.touristsLogin = function (e) {
          var t = this;
          console.log("touristsLogin: ");
          var o = C.default.requestTDId(),
            n = o ? {
              black_box: o
            } : null;
          P.default.touristsLogin(n, v.default.create(this, function (o) {
            if (c.default.pocketed) {
              console.log("pp event: appLaunch");
              w.PoolWrapper.instance.onAppLauch();
              console.log("pp event: appShow");
              w.PoolWrapper.instance.onAppShow();
            }
            console.log("touristsLogin res: ", o);
            e && m.default.reconnectSuc();
            if (101 === o.code || 102 === o.code) {
              t.loading.active = !1;
              t.label_progress.string = "";
              cc.Tween.stopAllByTarget(this.label_progress);
              O.default.showPage("BlockPage", {
                type: 101 === o.code ? "area" : "vpn"
              });
            } else {
              f.default.initUserId(o.data);
              t.getGameConfig();
            }
          }), v.default.create(this, function (o) {
            e && m.default.reconnectFai();
            m.default.httpErr(o, function (e) {
              t.touristsLogin(e);
            });
          }));
        };
        t.prototype.onLoad = function () {
          var e = this,
            t = cc.director.getPhysicsManager();
          if (t) {
            t.enabled = !0;
            t.enabledAccumulator = !1;
          } else console.error("physicsManager is null");
          var o = cc.instantiate(this.guideNode);
          cc.game.addPersistRootNode(o);
          o.setPosition(cc.v2(cc.winSize.width / 2, cc.winSize.height / 2));
          c.default.instance.init();
          O.default.init(this.loadingMaskPrefab);
          g.default.setCurrentLang("CN");
          S.default.loadLanguage();
          u.default.init(this.i18nJson.json);
          this.label_progress.string = "";
          D.UiManager.addButtonListen(this.privacyPolicy, this._onPrivacyPolicy, this, null, void 0, void 0, cc.Button.Transition.NONE);
          this.loading.angle = 0;
          cc.Tween.stopAllByTarget(this.loading);
          cc.tween(this.loading).to(1.5, {
            angle: 360
          }, {
            onUpdate: function () {
              return e.ball.angle = -e.loading.angle;
            }
          }).call(function () {
            e.loading.angle = 0;
            e.ball.angle = 0;
          }).union().repeatForever().start();
          this.versionLabel.string = "v" + T.PoolNative.getVersion();
        };
        t.prototype.getUserInfo = function (e) {
          var t = this;
          console.log("获取玩家信息");
          P.default.getUserInfo({
            is_reviewer: h.default.is_reviewer ? 1 : 0
          }, v.default.create(this, function (o) {
            console.log("getUserInfo res: ", o);
            if (o && -777 == o.code) console.log("黑名单禁止玩家进入");else {
              e && m.default.reconnectSuc();
              if (o && o.code > 0) {
                var n = o.data;
                if (n) {
                  _.default.init(n.tables, n.user_info.city);
                  f.default.init(n);
                  r.default.init();
                  if (!h.default.reviewing_splash && !f.default.is_new_user()) {
                    console.log("showSplashAd(0)");
                    b.default.getInstance().showSplashAd(0);
                  }
                  Number(_.default.global_ConfigMap.get("xiaozujian")) && C.default.showShortcutInfo();
                  t.jumpScene();
                }
              }
            }
          }), v.default.create(this, function (o) {
            e && m.default.reconnectFai();
            m.default.httpErr(o, function (e) {
              t.getUserInfo(e);
            });
          }));
        };
        t.prototype.stopMaxProgress = function () {
          var e;
          null === (e = this.tween) || void 0 === e || e.stop();
        };
        t.prototype.setProgress = function (e) {
          var t = Math.ceil(100 * e);
          this.label_progress.string = t + "%";
        };
        t.prototype.checkReport = function () {
          var e = cc.sys.localStorage.getItem("user_LastAgreement");
          if (e) {
            P.default.agreementReport({
              url: e,
              type: "user"
            });
            cc.sys.localStorage.removeItem("user_LastAgreement");
            C.default.reportData("U_WATCH_RULE", {
              rule_type: "agreement"
            });
          }
          var t = cc.sys.localStorage.getItem("user_LastPrivacy");
          if (t) {
            P.default.agreementReport({
              url: t,
              type: "privacy"
            });
            cc.sys.localStorage.removeItem("user_LastPrivacy");
            C.default.reportData("U_WATCH_RULE", {
              rule_type: "privacy"
            });
          }
        };
        t.prototype.getGameConfig = function () {
          console.log("getGameConfig: ");
          this.getUserInfo();
        };
        t.prototype.redLoadScene = function () {
          return new Promise(function (e) {
            cc.director.preloadScene("game_main", function () {}, function () {
              return e();
            });
          });
        };
        t.prototype.jumpScene = function () {
          this.stopMaxProgress();
          this.checkReport();
          this.progressFinish();
        };
        t.prototype.getSystemConfig = function (e) {
          var t = this;
          console.log("getSystemConfig 系统配置");
          P.default.getSystemConfig(v.default.create(this, function (o) {
            console.log("服务器 返回系统配置", o);
            e && m.default.reconnectSuc();
            h.default.init_config(o.data);
            C.default.requestSMId();
            t.touristsLogin();
          }), v.default.create(this, function (o) {
            e && m.default.reconnectFai();
            m.default.httpErr(o, function (e) {
              t.getSystemConfig(e);
            });
          }));
        };
        t.prototype.progressFinish = function () {
          var e = this;
          h.default.auth_type && C.default.ysdkLogin();
          I.default.Instance.runTask();
          this.redLoadScene().then(function () {
            return new Promise(function (e) {
              cc.assetManager.loadBundle("Frame", function (t, o) {
                var n;
                null === (n = c.default.frameSDK) || void 0 === n || n.init({
                  isDeBug: !1,
                  sdkFuc: {
                    beforeOpenVideo: function (e) {
                      c.default.pocketed ? e(!0) : O.default.showPage("VideoAlertPage", {
                        exitCB: e
                      });
                    },
                    isReadyVideo: function () {
                      return w.PoolWrapper.instance.videoReady;
                    },
                    openVideo: function (e, t) {
                      w.PoolWrapper.instance.showVideo(e, t);
                    },
                    openInters: function (e, t) {
                      w.PoolWrapper.instance.showInterstitial(e, t);
                    },
                    openBanner: function () {},
                    hiddenBanner: function () {},
                    isSplashReady: function () {
                      return w.PoolWrapper.instance.splashReady;
                    },
                    openSplash: function (e) {
                      w.PoolWrapper.instance.showSplash(e);
                    },
                    logCommonEvent: function (e, t) {
                      p.PoolLogger.instance.logEvent(e, t);
                    },
                    earlierStageEvent: function (e, t) {
                      E.CoinfinityRideress.instance.unphotographic(e, t);
                    },
                    logGameEvent: function (e, t, o) {
                      void 0 === o && (o = !1);
                      p.PoolLogger.instance.logGameEvent(e, t, o);
                    },
                    lifeEvent: function (e) {
                      p.PoolLogger.instance.logLifeEvent(e);
                    },
                    ppEvent: function (e) {
                      p.PoolLogger.instance.logPPEvent(e);
                    },
                    openUrl: function (e) {
                      T.PoolNative.openURL(e);
                    },
                    get gaid() {
                      return T.PoolNative.gaid;
                    },
                    get inviteCode() {
                      return w.PoolWrapper.instance.hardCode;
                    },
                    get countryCode() {
                      return c.default.countryCode;
                    }
                  },
                  ListenKeys: {
                    FRESH_FLAG: "IS_PLAY",
                    FRESH_STRING: "CHANGE_LAN",
                    VIDEO_SUC: "AD_SUC",
                    APP_LIFECYCLE_CHANGE: "APP_LIFECYCLE_CHANGE"
                  },
                  gameData: {
                    get passLevel() {
                      return f.default.level_pass;
                    },
                    get currentRound() {
                      return f.default.level_info.level_b;
                    },
                    get totalRound() {
                      return f.default.level_info.roundCount;
                    },
                    get currentTurn() {
                      return f.default.level_info.level_c;
                    },
                    get totalTurn() {
                      return f.default.level_info.turnCount;
                    },
                    get currentLevelInfo() {
                      return f.default.level_info;
                    },
                    get currentScene() {
                      var e;
                      switch (null === (e = cc.director.getScene()) || void 0 === e ? void 0 : e.name) {
                        case "game_main":
                          return "home";
                        case "game_tabel":
                          return "game";
                        default:
                          return "loading";
                      }
                    },
                    get noProfitAd() {
                      return !c.default.pocketed;
                    },
                    isSound: d.default.getInstance().getAudioState(),
                    myLanguge: "US"
                  },
                  gameFuc: {
                    openLoad: function () {
                      O.default.showLoading();
                    },
                    closeLoad: function () {
                      O.default.hideLoading();
                    },
                    vibrate: function (e) {
                      C.default.setVibrator(e);
                    }
                  },
                  gameNodeObj: {}
                }, s.GameConfigurations.newBallData, u.default, function () {
                  return o.preload("Frame", cc.Prefab, function () {
                    return e();
                  });
                });
                c.default.instance.addFrameListener();
              });
            });
          }).then(function () {
            return new Promise(function (e) {
              null == cc.sys.localStorage.getItem("newHand") ? cc.assetManager.loadBundle("newHand", function (t, o) {
                o.load("newHand", cc.Prefab, function (t, o) {
                  e(o);
                });
              }) : e(null);
            });
          }).then(function (e) {
            return new Promise(function (t) {
              c.default.frameSDK.beforeEnterGame(function () {
                return t(e);
              });
            });
          }).then(function (t) {
            cc.Tween.stopAllByTarget(e.label_progress);
            e.label_progress.string = "100%";
            cc.director.loadScene("game_main", function (e, o) {
              if (t) {
                var n = cc.instantiate(t);
                n.getComponent("newHand").init(function (e, t) {
                  E.CoinfinityRideress.instance.unphotographic(e, t);
                }, function (e, t, o) {
                  E.CoinfinityRideress.instance.actionsCybernetician(e, t, o);
                }, function (e, t, o) {
                  p.PoolLogger.instance.logGameEvent(e, t, o);
                }, function (e) {
                  p.PoolLogger.instance.logLifeEvent(e);
                });
                n.parent = o;
              }
            });
          });
        };
        t.prototype.setMaxProgress = function (e) {
          var t = this;
          this.tween = cc.tween({
            persent: 0
          }).to(10, {
            persent: e
          }, {
            progress: function (e, o, n, i) {
              t.setProgress(n);
              return e + (o - e) * i;
            }
          }).start();
        };
        a([L(cc.Label)], t.prototype, "label_progress", void 0);
        a([L(cc.Node)], t.prototype, "loading", void 0);
        a([L(cc.Node)], t.prototype, "ball", void 0);
        a([L(cc.Node)], t.prototype, "privacyPolicy", void 0);
        a([L(cc.Label)], t.prototype, "versionLabel", void 0);
        a([L(cc.Prefab)], t.prototype, "guideNode", void 0);
        a([L(cc.Prefab)], t.prototype, "loadingMaskPrefab", void 0);
        a([L(cc.JsonAsset)], t.prototype, "i18nJson", void 0);
        return a([N], t);
      }(cc.Component);
    o.default = R;
    cc._RF.pop();
