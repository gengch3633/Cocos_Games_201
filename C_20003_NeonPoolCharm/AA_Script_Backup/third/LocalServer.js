let e = require;let t = module;let o = exports;
    "use strict";

    cc._RF.push(t, "e9c0fgsFFpC+7xDanLprELF", "LocalServer");
    Object.defineProperty(o, "__esModule", {
      value: !0
    });
    var n,
      i = e("ConfigDataSys.js"),
      a = e("GameServiceMgr.js"),
      r = e("GameConfigurations.js");
    (function (e) {
      e.USER = "user";
      e.INVENTORY = "inventory";
      e.CUE = "cue";
      e.GAME = "game";
    })(n || (n = {}));
    var l = function () {
      function e() {
        var e, t, o, i, a, l, s, c, u, p, d, _;
        this._levelConfigs = null;
        this._userData = this._loadData(n.USER);
        if (!this._userData) {
          this._userData = {
            birthTime: Date.now(),
            guideID: 0,
            cues: (e = {}, e[1] = !0, e),
            currentCue: 1,
            clearBonusType: 0,
            props: (t = {}, t[1] = null !== (o = r.GameConfigurations.customConfig.initialPlacePropNum) && void 0 !== o ? o : 0, t)
          };
          this._saveData(n.USER, this._userData);
        }
        this._inventoryData = null !== (i = this._loadData(n.INVENTORY)) && void 0 !== i ? i : {};
        this._cachedItemIncrementRecord = {};
        this._gameData = this._loadData(n.GAME);
        if (!this._gameData) {
          this._gameData = {
            completedLevelCount: 0,
            newCompletedRoundCount: 0,
            completedTurnCount: 0,
            usedTableRecord: {},
            table: ""
          };
          this._saveData(n.GAME, this._gameData);
        }
        var f = r.GameConfigurations.customConfig.newLevelConfigs;
        this._cachedNewLoopLevelStartIndex = Math.max(0, f.findIndex(function (e) {
          return 2 === e.level_type;
        }));
        this._cachedNewStartLevelCount = null !== (l = null === (a = f[this._cachedNewLoopLevelStartIndex - 1]) || void 0 === a ? void 0 : a.level_a) && void 0 !== l ? l : 0;
        this._cachedNewLoopLevelCount = null !== (c = null === (s = f[f.length - 1]) || void 0 === s ? void 0 : s.level_a) && void 0 !== c ? c : 0;
        var h = r.GameConfigurations.customConfig.levelConfigs;
        this._cachedLoopLevelStartIndex = Math.max(0, h.findIndex(function (e) {
          return 2 === e.level_type;
        }));
        this._cachedStartLevelCount = null !== (p = null === (u = h[this._cachedLoopLevelStartIndex - 1]) || void 0 === u ? void 0 : u.level_a) && void 0 !== p ? p : 0;
        this._cachedLoopLevelCount = null !== (_ = null === (d = h[h.length - 1]) || void 0 === d ? void 0 : d.level_a) && void 0 !== _ ? _ : 0;
        this._cachedCueConfigs = [];
        this._cachedNextCueIndex = Object.keys(this._userData.cues).length;
        this._fixGameData();
      }
      Object.defineProperty(e, "instance", {
        get: function () {
          this._instance || (this._instance = new e());
          return this._instance;
        },
        enumerable: !1,
        configurable: !0
      });
      e.prototype.pocketInBonus = function () {
        var e = this._userData.clearBonusType;
        this._userData.clearBonusType = ++this._userData.clearBonusType % 2;
        this._saveData(n.USER, this._userData);
        return 1 === e;
      };
      e.prototype.requestCompleteGuide = function (e) {
        this._userData.guideID = e;
        this._saveData(n.USER, this._userData);
        return {
          code: 1,
          data: {
            gold_balance: 1e3
          },
          ecp: 0,
          message: ""
        };
      };
      e.prototype.requestCompleteAd = function (e, t) {
        var o;
        if (t && e === a.AD_TYPE.baiqiu_prop) {
          this._userData.props[1] = (null !== (o = this._userData.props[1]) && void 0 !== o ? o : 0) + i.default.ad_configMap.get(a.AD_TYPE.baiqiu_prop).type_para;
          this._saveData(n.USER, this._userData);
        }
        return {
          code: t ? 1 : 2,
          data: {
            prop: this._userData.props
          },
          ecp: 0,
          message: ""
        };
      };
      e.prototype._generateTable = function (e, t) {
        var o = this,
          i = r.GameConfigurations.customConfig.levelDifficultyConfigs,
          a = i.find(function (t) {
            return t.ball_lv === e;
          }),
          l = null == a ? void 0 : a.tables;
        if (!l || l.length <= 0) {
          console.error("invalid tables of difficulty: " + e);
          l = i[Math.floor(Math.random() * i.length)].tables;
        }
        var s = [];
        l.forEach(function (e) {
          o._gameData.usedTableRecord[e] || s.push(e);
        });
        if (s.length <= 0) {
          s = l;
          l.forEach(function (e) {
            return delete o._gameData.usedTableRecord[e];
          });
        }
        this._gameData.table = s[Math.floor(Math.random() * s.length)];
        this._gameData.usedTableRecord[this._gameData.table] = !0;
        t && this._saveData(n.GAME, this._gameData);
      };
      e.prototype.debugRequestOpenCues = function (e) {
        var t, o;
        if (e !== this._cachedNextCueIndex) {
          for (var i = {}, a = Math.min(e, this._cachedCueConfigs.length), r = 0; r < a; r++) {
            var l = this._cachedCueConfigs[r].id;
            i[l] = null !== (t = this._userData.cues[l]) && void 0 !== t && t;
          }
          i[1] = !0;
          this._userData.cues = i;
          this._cachedNextCueIndex = Object.keys(this._userData.cues).length;
          void 0 !== i[this._userData.currentCue] && null !== i[this._userData.currentCue] || (this._userData.currentCue = 1);
          this._saveData(n.USER, this._userData);
        }
        return {
          code: 1,
          data: {
            get_clubs: this._userData.cues,
            use_club_id: this._userData.currentCue,
            next_club_id: null === (o = this._cachedCueConfigs[this._cachedNextCueIndex]) || void 0 === o ? void 0 : o.id
          },
          ecp: 0,
          message: ""
        };
      };
      e.prototype.requestRefreshNextCue = function () {
        var e,
          t = this._cachedCueConfigs[this._cachedNextCueIndex];
        if (t) {
          this._userData.cues[t.id] = !1;
          this._cachedNextCueIndex = Object.keys(this._userData.cues).length;
          this._saveData(n.USER, this._userData);
        }
        return {
          code: 1,
          data: {
            get_clubs: this._userData.cues,
            use_club_id: this._userData.currentCue,
            next_club_id: null === (e = this._cachedCueConfigs[this._cachedNextCueIndex]) || void 0 === e ? void 0 : e.id
          },
          ecp: 0,
          message: ""
        };
      };
      e.prototype.requestCompleteGame = function (e) {
        var t,
          o,
          i = !1;
        if (e) {
          ++this._gameData.newCompletedRoundCount;
          (i = 1 === (t = this._getNewLevelConfig(this._gameData.newCompletedRoundCount)).level_b) && ++this._gameData.completedLevelCount;
          this._generateTable(t.ball_lv, !1);
          this._saveData(n.GAME, this._gameData);
        } else {
          t = this._getNewLevelConfig(this._gameData.newCompletedRoundCount);
          i = !1;
        }
        o = this._getCurrentTotalRound(t.level_type, t.level_a);
        return {
          code: 1,
          data: {
            level_a: this._gameData.completedLevelCount + 1,
            level_b: t.level_b,
            level_c: 1,
            roundCount: o,
            turnCount: 1,
            level_completed: i,
            turn_pass: this._gameData.newCompletedRoundCount,
            level_pass: this._gameData.completedLevelCount,
            table: this._gameData.table,
            cash_balance: 0,
            gold_balance: 0,
            level_force: !1,
            level_pass_success_count: this._gameData.completedLevelCount,
            max_extract_id: 1,
            scene_id: 1,
            scene_prize: 0,
            show_draw: !1,
            show_level_reward: e
          },
          ecp: 0,
          message: ""
        };
      };
      e.prototype.debugRequestChangeRound = function (e) {
        e = Math.max(1, Math.floor(e));
        this._gameData.newCompletedRoundCount = e - 1;
        var t = this._getNewLevelConfig(this._gameData.newCompletedRoundCount),
          o = this._getCurrentTotalRound(t.level_type, t.level_a);
        if (this._gameData.newCompletedRoundCount < this._cachedNewLoopLevelStartIndex) this._gameData.completedLevelCount = t.level_a - 1;else {
          var i = Math.floor((this._gameData.newCompletedRoundCount - this._cachedNewLoopLevelStartIndex) / (r.GameConfigurations.customConfig.newLevelConfigs.length - this._cachedNewLoopLevelStartIndex));
          this._gameData.completedLevelCount = t.level_a - 1 + this._cachedNewStartLevelCount + this._cachedNewLoopLevelCount * i;
        }
        this._generateTable(t.ball_lv, !1);
        this._saveData(n.GAME, this._gameData);
        return {
          code: 1,
          data: {
            level_a: this._gameData.completedLevelCount + 1,
            level_b: t.level_b,
            level_c: 1,
            roundCount: o,
            turnCount: 1,
            turn_pass: this._gameData.newCompletedRoundCount,
            level_pass: this._gameData.completedLevelCount,
            table: this._gameData.table
          },
          ecp: 0,
          message: ""
        };
      };
      e.prototype.deprecatedDebugRequestChangeLevel = function (e, t, o) {
        void 0 === t && (t = 1);
        void 0 === o && (o = 1);
        e = Math.max(1, Math.floor(e));
        t = Math.max(1, Math.floor(t));
        o = Math.max(1, Math.floor(o));
        this._gameData.completedLevelCount = e - 1;
        var i,
          a,
          l = void 0;
        if (e <= this._cachedStartLevelCount) {
          i = 1;
          a = e;
        } else {
          i = 2;
          a = (e - this._cachedStartLevelCount - 1) % this._cachedLoopLevelCount + 1;
          l = Math.floor((e - this._cachedStartLevelCount - 1) / this._cachedLoopLevelCount);
        }
        var s = r.GameConfigurations.customConfig.levelConfigs,
          c = s.filter(function (e) {
            return e.level_type === i && e.level_a === a;
          });
        t = Math.min(t, c[c.length - 1].level_b);
        var u = c.filter(function (e) {
          return e.level_b === t;
        });
        o = Math.min(o, u[u.length - 1].level_c);
        var p = s.findIndex(function (e) {
          return e.level_type === i && e.level_a === a && e.level_b === t && e.level_c === o;
        });
        this._gameData.completedTurnCount = p;
        null != l && (this._gameData.completedTurnCount += (s.length - this._cachedLoopLevelStartIndex) * l);
        var d = s[p];
        this._generateTable(d.ball_lv, !1);
        this._saveData(n.GAME, this._gameData);
        return {
          code: 1,
          data: {
            level_a: e,
            level_b: d.level_b,
            level_c: d.level_c,
            roundCount: c[c.length - 1].level_b,
            turnCount: u.length,
            turn_pass: this._gameData.completedTurnCount,
            level_pass: this._gameData.completedLevelCount,
            table: this._gameData.table
          },
          ecp: 0,
          message: ""
        };
      };
      e.prototype._getOldLevelConfig = function (e) {
        var t = r.GameConfigurations.customConfig.levelConfigs;
        if (e < t.length) return t[e];
        var o = t.length - this._cachedLoopLevelStartIndex;
        return t[(e - this._cachedLoopLevelStartIndex) % o + this._cachedLoopLevelStartIndex];
      };
      e.prototype._getOldLevelInfo = function (e, t, o) {
        var n = 0,
          i = 0,
          a = r.GameConfigurations.customConfig.levelConfigs.filter(function (o) {
            return o.level_type === e && o.level_a === t;
          });
        if (a.length > 0) {
          n = a[a.length - 1].level_b;
          i = a.filter(function (e) {
            return e.level_b === o;
          }).length;
        }
        return {
          roundCount: n,
          turnCount: i
        };
      };
      e.prototype.requestLogin = function () {
        return {
          code: 1,
          data: {},
          ecp: 0,
          message: ""
        };
      };
      e.prototype._fixGameData = function () {
        var e,
          t = null !== (e = this._gameData.completedTurnCount) && void 0 !== e ? e : 0;
        if (null == this._gameData.newCompletedRoundCount) {
          var o,
            i,
            a = this._gameData.completedLevelCount + 1,
            l = this._getOldLevelConfig(t),
            s = void 0;
          if (a <= this._cachedNewStartLevelCount) {
            o = 1;
            i = a;
          } else {
            o = 2;
            i = (a - this._cachedNewStartLevelCount - 1) % this._cachedNewLoopLevelCount + 1;
            s = Math.floor((a - this._cachedNewStartLevelCount - 1) / this._cachedNewLoopLevelCount);
          }
          var c = r.GameConfigurations.customConfig.newLevelConfigs,
            u = c.filter(function (e) {
              return e.level_type === o && e.level_a === i;
            }),
            p = Math.min(l.level_b, u[u.length - 1].level_b),
            d = c.findIndex(function (e) {
              return e.level_type === o && e.level_a === i && e.level_b === p;
            });
          this._gameData.newCompletedRoundCount = d;
          null != s && (this._gameData.newCompletedRoundCount += (c.length - this._cachedNewLoopLevelStartIndex) * s);
          var _ = c[d];
          this._generateTable(_.ball_lv, !1);
          this._saveData(n.GAME, this._gameData);
        }
      };
      e.prototype._loadData = function (e) {
        var t,
          o = null !== (t = cc.sys.localStorage.getItem(e)) && void 0 !== t ? t : "",
          n = null;
        try {
          n = JSON.parse(o);
        } catch (t) {
          console.log("failed to load cache data <" + e + ">: " + o);
        }
        return n;
      };
      e.prototype._saveData = function (e, t) {
        "object" == typeof t ? cc.sys.localStorage.setItem(e, JSON.stringify(t)) : console.error("invalid data when saving: " + typeof t);
      };
      e.prototype._getNewLevelConfig = function (e) {
        var t = r.GameConfigurations.customConfig.newLevelConfigs;
        if (e < t.length) return t[e];
        var o = t.length - this._cachedNewLoopLevelStartIndex;
        return t[(e - this._cachedNewLoopLevelStartIndex) % o + this._cachedNewLoopLevelStartIndex];
      };
      e.prototype.requestChangeCue = function (e) {
        var t;
        if (!0 === this._userData.cues[e]) {
          this._userData.currentCue = e;
          this._saveData(n.USER, this._userData);
        }
        return {
          code: 1,
          data: {
            get_clubs: this._userData.cues,
            use_club_id: this._userData.currentCue,
            next_club_id: null === (t = this._cachedCueConfigs[this._cachedNextCueIndex]) || void 0 === t ? void 0 : t.id
          },
          ecp: 0,
          message: ""
        };
      };
      e.prototype.deprecatedDebugRequestChangeTurn = function (e) {
        e = Math.max(1, Math.floor(e));
        this._gameData.completedTurnCount = e - 1;
        var t = this._getOldLevelConfig(this._gameData.completedTurnCount),
          o = this._getOldLevelInfo(t.level_type, t.level_a, t.level_b);
        if (this._gameData.completedTurnCount < this._cachedLoopLevelStartIndex) this._gameData.completedLevelCount = t.level_a - 1;else {
          var i = Math.floor((this._gameData.completedTurnCount - this._cachedLoopLevelStartIndex) / (r.GameConfigurations.customConfig.levelConfigs.length - this._cachedLoopLevelStartIndex));
          this._gameData.completedLevelCount = t.level_a - 1 + this._cachedStartLevelCount + this._cachedLoopLevelCount * i;
        }
        this._generateTable(t.ball_lv, !1);
        this._saveData(n.GAME, this._gameData);
        return {
          code: 1,
          data: {
            level_a: this._gameData.completedLevelCount + 1,
            level_b: t.level_b,
            level_c: t.level_c,
            roundCount: o.roundCount,
            turnCount: o.turnCount,
            turn_pass: this._gameData.completedTurnCount,
            level_pass: this._gameData.completedLevelCount,
            table: this._gameData.table
          },
          ecp: 0,
          message: ""
        };
      };
      e.prototype.debugRequestChangeLevel = function (e, t) {
        void 0 === t && (t = 1);
        e = Math.max(1, Math.floor(e));
        t = Math.max(1, Math.floor(t));
        this._gameData.completedLevelCount = e - 1;
        var o,
          i,
          a = void 0;
        if (e <= this._cachedNewStartLevelCount) {
          o = 1;
          i = e;
        } else {
          o = 2;
          i = (e - this._cachedNewStartLevelCount - 1) % this._cachedNewLoopLevelCount + 1;
          a = Math.floor((e - this._cachedNewStartLevelCount - 1) / this._cachedNewLoopLevelCount);
        }
        var l = r.GameConfigurations.customConfig.newLevelConfigs,
          s = l.filter(function (e) {
            return e.level_type === o && e.level_a === i;
          });
        t = Math.min(t, s[s.length - 1].level_b);
        var c = l.findIndex(function (e) {
          return e.level_type === o && e.level_a === i && e.level_b === t;
        });
        this._gameData.newCompletedRoundCount = c;
        null != a && (this._gameData.newCompletedRoundCount += (l.length - this._cachedNewLoopLevelStartIndex) * a);
        var u = l[c];
        this._generateTable(u.ball_lv, !1);
        this._saveData(n.GAME, this._gameData);
        return {
          code: 1,
          data: {
            level_a: e,
            level_b: u.level_b,
            level_c: 1,
            roundCount: s[s.length - 1].level_b,
            turnCount: 1,
            turn_pass: this._gameData.newCompletedRoundCount,
            level_pass: this._gameData.completedLevelCount,
            table: this._gameData.table
          },
          ecp: 0,
          message: ""
        };
      };
      e.prototype._getCurrentTotalRound = function (e, t) {
        var o = 0,
          n = r.GameConfigurations.customConfig.newLevelConfigs.filter(function (o) {
            return o.level_type === e && o.level_a === t;
          });
        n.length > 0 && (o = n[n.length - 1].level_b);
        return o;
      };
      e.prototype.requestUserInfo = function (e, t) {
        var o = this;
        cc.resources.load("config/info", cc.JsonAsset, function (n, i) {
          var a;
          if (!n && i) {
            var l = o._getNewLevelConfig(o._gameData.newCompletedRoundCount),
              s = o._getCurrentTotalRound(l.level_type, l.level_a),
              c = i.json,
              u = r.GameConfigurations.remoteOriginalConfig;
            "object" == typeof u && r.GameConfigurations.mergeConfig(c, u);
            o._gameData.table || o._generateTable(l.ball_lv, !0);
            var p,
              d,
              _ = c.tables.club;
            o._cachedCueConfigs.length = 0;
            for (var f in _) {
              p = _[f];
              d = {
                id: Number(f)
              };
              Object.keys(p).forEach(function (e) {
                return d[e] = p[e];
              });
              o._cachedCueConfigs.push(d);
            }
            o._cachedCueConfigs.sort(function (e, t) {
              return e.id - t.id;
            });
            c.user_info.create_time = o._userData.birthTime;
            c.user_info.guide_id = o._userData.guideID;
            c.user_info.level_pass_success_count = o._gameData.completedLevelCount;
            c.user_info.cash_balance = 0;
            c.user_info.gold_balance = 0;
            c.game_info.level_a = o._gameData.completedLevelCount + 1;
            c.game_info.level_b = l.level_b;
            c.game_info.level_c = 1;
            c.game_info.roundCount = s;
            c.game_info.turnCount = 1;
            c.game_info.table = o._gameData.table;
            c.game_info.turn_pass = o._gameData.newCompletedRoundCount;
            c.game_info.level_pass = o._gameData.completedLevelCount;
            c.game_info.get_clubs = o._userData.cues;
            c.game_info.use_club_id = o._userData.currentCue;
            c.game_info.next_club_id = null === (a = o._cachedCueConfigs[o._cachedNextCueIndex]) || void 0 === a ? void 0 : a.id;
            c.game_info.prop = o._userData.props;
            e({
              code: 1,
              data: c,
              ecp: 0,
              message: ""
            });
          } else t(null != n ? n : new Error("unknown reason"));
        });
      };
      e.prototype.requestUnlockCue = function (e, t) {
        var o,
          i = !1;
        if (!1 === this._userData.cues[e]) {
          this._userData.cues[e] = !0;
          i = !0;
        }
        if (t) {
          this._userData.currentCue = e;
          i = !0;
        }
        i && this._saveData(n.USER, this._userData);
        return {
          code: 1,
          data: {
            get_clubs: this._userData.cues,
            use_club_id: this._userData.currentCue,
            next_club_id: null === (o = this._cachedCueConfigs[this._cachedNextCueIndex]) || void 0 === o ? void 0 : o.id
          },
          ecp: 0,
          message: ""
        };
      };
      e.prototype.requestUseMoveCueBallProp = function () {
        var e,
          t = !1,
          o = null !== (e = this._userData.props[1]) && void 0 !== e ? e : 0;
        if (o > 0) {
          this._userData.props[1] = o - 1;
          this._saveData(n.USER, this._userData);
          t = !0;
        }
        return {
          code: 1,
          data: {
            prop: t ? this._userData.props : null
          },
          ecp: 0,
          message: ""
        };
      };
      e.EStorageKey = n;
      e._instance = null;
      return e;
    }();
    o.default = l;
    cc._RF.pop();
