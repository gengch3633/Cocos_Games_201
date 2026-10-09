let e = require;let t = module;let o = exports;
    "use strict";

    cc._RF.push(t, "56c11/1Nz1PbqdFBZkd0nU4", "RollingNoticeCtrl");
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
    var r = e("PlayerDataSys.js"),
      l = e("GlobalDataMgr.js"),
      s = e("EventMgr.js"),
      c = e("GameEventType.js"),
      u = e("SdkHelper.js"),
      p = e("SystemConfig.js"),
      d = e("EngineUtil.js"),
      _ = e("UiManage.js"),
      f = e("GameDataMgr.js"),
      h = e("RollingNotice.js"),
      g = cc._decorator,
      y = g.ccclass,
      v = g.menu;
    cc._decorator.property;
    var m = function (e) {
      i(t, e);
      function t() {
        var t = null !== e && e.apply(this, arguments) || this;
        t.ui = null;
        t.runCount = 0;
        t.fTypeCount = 0;
        t.fNode = null;
        t.sNode = null;
        t.topY = null;
        t.playerInfo = null;
        t.sroll_msg_list = [];
        return t;
      }
      t.prototype._getItemGenerator = function () {
        var e;
        return __generator(this, function (t) {
          switch (t.label) {
            case 0:
              e = 0;
              t.label = 1;
            case 1:
              return e < 13 ? [4, this._initItem(e)] : [3, 4];
            case 2:
              t.sent();
              t.label = 3;
            case 3:
              e++;
              return [3, 1];
            case 4:
              return [2];
          }
        });
      };
      t.prototype.getNoticeTime = function () {
        var e = r.default.user_level;
        if (1 == e || 2 == e || 3 == e) return .5;
        if (4 == e) {
          var t = f.default.getNoticeTimeData(),
            o = [],
            n = t.show_duration,
            i = t.show_duration_rate;
          n && i && n.forEach(function (e, t) {
            for (var n = 0; n < i[t]; n++) o.push(e);
          });
          var a = Math.floor(Math.random() * o.length),
            l = o[a];
          return Number(l);
        }
      };
      t.prototype.onLoad = function () {
        this.onUILoad();
        this.addEvent();
        this.addButtonListen();
        this.loadPlayerInfo();
      };
      t.prototype.start = function () {};
      t.prototype.getNoticeNum = function () {
        var e = r.default.user_level;
        if (1 == e || 2 == e) return 1;
        if (3 == e) return Math.random() <= .1 ? 2 : 1;
        if (4 == e) {
          var t = f.default.getNoticeData();
          if (t) {
            t.average_tryTimes_max, t.average_tryTimes_min;
            var o = t.tryTimes_show,
              n = t.tryTimes_show_rate,
              i = (t.try_times, []),
              a = o,
              l = n;
            a && l && a.forEach(function (e, t) {
              for (var o = 0; o < l[t]; o++) i.push(e);
            });
            var s,
              c,
              u = Math.floor(Math.random() * i.length),
              p = i[u];
            a.forEach(function (e, t) {
              if (e == p) if (0 == t) {
                s = 1;
                c = e + 1;
              } else {
                s = a[t - 1];
                c = e;
              }
            });
            return d.default.random(s, c);
          }
        }
      };
      t.prototype.initData = function () {};
      t.prototype.addButtonListen = function () {};
      t.prototype.nextNotice = function () {
        this.dealShowDes(!1);
      };
      t.prototype.onUILoad = function () {
        this.ui = this.node.addComponent(h.default);
      };
      t.prototype.updateScollMsg = function () {
        console.log("更新公告数据======", this.sroll_msg_list);
      };
      t.prototype.runNoticeAction = function (e, t) {
        void 0 === t && (t = 3);
        if (e) {
          this.dealShowDes(!0);
          this.runCount = 13;
        }
        this.run(t);
      };
      t.prototype.addEvent = function () {};
      t.prototype.getPayPlat = function () {
        var e = Math.random();
        return e <= .3 ? 2 : e <= .6 && e > .3 ? 3 : 1;
      };
      t.prototype.adjustScale = function (e) {
        var t = cc.winSize,
          o = 1;
        e.width > t.width - 200 && (o = (t.width - 200) / e.width);
        e.scale = o;
      };
      t.prototype.setShowDes = function (e, t) {
        var o = e.payPlat,
          n = e.Name,
          i = e.tryTimes,
          a = e.reward,
          l = t.getChildByName("icon"),
          s = t.getChildByName("messageRichText"),
          c = i18n.t("home_large_barrage", {
            0: n,
            1: i,
            2: r.default.getCashWithUnit(a)
          });
        _.UiManager.loadSpriteFrame(l, "pay", o);
        s.getComponent(cc.RichText).string = c;
      };
      t.prototype.createList = function () {
        var e = this.getPayPlat(),
          t = this.playerInfo[d.default.random(0, this.playerInfo.length - 1)],
          o = this.getNoticeNum(),
          n = this.getNoticeTime(),
          i = this.getNoticeCash(o),
          a = {
            payPlat: e,
            Name: t,
            tryTimes: o,
            showTime: n,
            reward: i
          };
        this.sroll_msg_list.push(a);
        if (this.sroll_msg_list.length > 13) {
          this.sroll_msg_list.shift();
          this.runCount--;
        }
        f.default.sroll_msg_list = this.sroll_msg_list;
        s.default.trigger(c.default.UPDATE_ROLLING, {
          payPlat: e,
          Name: t,
          tryTimes: o,
          showTime: n,
          reward: i
        });
        u.default.reportData("u_game_event_complete", {
          act_page: "BarrageCountShow"
        });
      };
      t.prototype.dealShowDes = function (e) {
        void 0 === e && (e = !1);
        if (e) {
          this.fTypeCount = 1;
          this.ui.maskNode.removeAllChildren();
          this.framingLoad();
        } else {
          var t = f.default.getrollingItem();
          t.parent = this.ui.maskNode;
          t.setPosition(0, -1485);
          this.createList();
          var o = this.sroll_msg_list[this.runCount - 1];
          this.setShowDes(o, t);
          this.runNoticeAction(!1, o.showTime);
        }
      };
      t.prototype.getTempOut = function (e, t) {
        if (t) {
          for (var o = [], n = [], i = t, a = i.length, r = 0; o.length < e; r++) {
            var l = Math.floor(Math.random() * a);
            if (!n[l]) {
              n[l] = 1;
              o.push(i[l]);
            }
          }
          return o;
        }
      };
      t.prototype.loadPlayerInfo = function () {
        var e = this;
        p.languages[String(l.default.curLanguage)] && d.default.loadResourceAsset("config/name").then(function (t) {
          if (t) {
            var o = t.json;
            if (o) {
              e.playerInfo = o[l.default.isUsingForeignResources()];
              e.runNoticeAction(!0);
            }
          }
        }).catch(function (e) {
          console.log("err====", e);
        });
      };
      t.prototype.run = function (e) {
        for (var t = this, o = function (o) {
            cc.tween(n.ui.maskNode.children[o]).delay(e).by(.2, {
              x: 0,
              y: 120
            }).call(function () {
              if (75 == t.ui.maskNode.children[o].y) {
                t.runCount += 1;
                t.ui.maskNode.children[o].removeFromParent();
                t.nextNotice();
              }
            }).start();
          }, n = this, i = 0; i < 13; i++) o(i);
      };
      t.prototype.framingLoad = function () {
        return __awaiter(this, void 0, void 0, function () {
          return __generator(this, function (e) {
            switch (e.label) {
              case 0:
                return [4, this.executePreFrame(this._getItemGenerator(), 1)];
              case 1:
                e.sent();
                return [2];
            }
          });
        });
      };
      t.prototype.executePreFrame = function (e, t) {
        var o = this;
        return new Promise(function () {
          var n = e,
            i = function () {
              for (var e = new Date().getTime(), a = n.next();; a = n.next()) {
                if (null == a || a.done) {
                  o.run(0);
                  return;
                }
                if (new Date().getTime() - e > t) {
                  o.scheduleOnce(function () {
                    i();
                  });
                  return;
                }
              }
            };
          i();
        });
      };
      t.prototype._initItem = function (e) {
        var t = f.default.getrollingItem();
        t.parent = this.ui.maskNode;
        t.setPosition(0, -45 - 120 * e);
        this.createList();
        this.setShowDes(this.sroll_msg_list[e], t);
      };
      t.prototype.getNoticeCash = function (e) {
        var t,
          o,
          n,
          i = r.default.user_level;
        if (1 == i) {
          t = 5;
          o = 4;
          n = 4;
        } else if (2 == i) {
          t = 50;
          o = 6;
          n = 6;
        } else if (3 == i) {
          t = 100;
          o = 5;
          n = 7;
        } else if (4 == i) {
          t = 500;
          o = 50;
          n = 90;
        }
        return Number(e * t * d.default.random(o, n));
      };
      t.prefabUrl = "assets/resources/prefabs/RollingNotice";
      t.className = "RollingNoticeCtrl";
      return a([y, v("UI/prefabs/RollingNoticeCtrl")], t);
    }(cc.Component);
    o.default = m;
    cc._RF.pop();
