let e = require;let t = module;let a = exports;
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
      c = e("CLICKLOCK.js"),
      s = e("Frame.js"),
      l = e("Frame.jsData"),
      u = e("Panel_Activity.js"),
      d = e("Panel_SuperReward.js"),
      p = e("Panel_Task.js"),
      h = e("RDM_Toast.js"),
      m = e("i18.js");
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
