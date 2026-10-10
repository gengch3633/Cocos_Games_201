let e = require;let t = module;let a = exports;
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
