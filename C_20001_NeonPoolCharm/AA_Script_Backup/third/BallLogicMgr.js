let e = require;
let t = module;
"use strict";
cc._RF.push(t, "7be9evmVixEZpN8gn39SXWC", "BallLogicMgr");
var o = e("DB.js"),
n = e("AudioManager.js"),
i = e("ConfigDataSys.js"),
a = e("EventMgr.js"),
r = e("GlobalConfig.js"),
l = e("GuideManager.js"),
s = e("LevelTableConfigManager.js"),
c = e(util "
  }].js);
    function u(e, t) {
      var o;
      if (" undefined " == typeof Symbol || null == e[Symbol.iterator]) {
        if (Array.isArray(e) || (o = p(e)) || t && e && " number " == typeof e.length) {
          o && (e = o);
          var n = 0;
          return function () {
            return n >= e.length ? {
              done: !0
            } : {
              done: !1,
              value: e[n++]
            };
          };
        }
        throw new TypeError(" Invalid attempt to iterate non- iterable instance.\ nIn order to be iterable, non- array objects must have a[Symbol.iterator]() method.");
      }
      return (o = e[Symbol.iterator]()).next.bind(o);
    }
    function p(e, t) {
      if (e) {
        if (" string " == typeof e) return d(e, t);
        var o = Object.prototype.toString.call(e).slice(8, -1);
        " Object " === o && e.constructor && (o = e.constructor.name);
        return " Map " === o || " Set " === o ? Array.from(e) : " Arguments " === o || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(o) ? d(e, t) : void 0;
      }
    }
    function d(e, t) {
      (null == t || t > e.length) && (t = e.length);
      for (var o = 0, n = new Array(t); o < t; o++) n[o] = e[o];
      return n;
    }
    var _ = i.default;
    a.default;
    var f = {
      MODE: {
        ME_Free: 0,
        ME_Editing: 1,
        ME_PlayMV: 2,
        PVE_Infinity: 10,
        PVE_Challenge: 11,
        PVE_AI: 12,
        PVP_Friend: 20,
        PVP_Hall: 21
      },
      BallIDType_White: 1,
      BallIDType_Normal: 2,
      isFristOpen: !0,
      isWin: !1,
      publicTableList: null,
      otherPublicTableList: null,
      editingTableInfo: null,
      editingTryMaxNum: 5,
      challengeTryMaxNum: 2,
      last_pageType: null,
      last_pack_ball: null,
      last_pack_color: null,
      last_pack_particle: null,
      rewardMaxNum_oneDay: 3,
      shareRewardMaxNum_oneDay: 3,
      autoAdAtLogin: 0,
      msgCache_balls: [],
      physicParams: [{
        speed_power_reduce: .96,
        accele_power_reduce: .6
      }],
      getParam: function (e) {
        return f.physicParams[0][e];
      },
      shop_config: function () {
        return {
          balls_default: [{
            name: " white ",
            default: !0
          }, {
            name: " black ",
            default: !0
          }, {
            name: " ball11 ",
            default: !0
          }, {
            name: " ball12 ",
            default: !0
          }, {
            name: " ball13 ",
            default: !0
          }, {
            name: " ball14 ",
            default: !0
          }, {
            name: " ball15 ",
            default: !0
          }, {
            name: " ball16 ",
            default: !0
          }, {
            name: " ball17 ",
            default: !0
          }, {
            name: " ball18 ",
            default: !0
          }, {
            name: " ball21 ",
            default: !0
          }, {
            name: " ball22 ",
            default: !0
          }, {
            name: " ball23 ",
            default: !0
          }, {
            name: " ball24 ",
            default: !0
          }, {
            name: " ball25 ",
            default: !0
          }, {
            name: " ball26 ",
            default: !0
          }, {
            name: " ball27 ",
            default: !0
          }, {
            name: " ball28 ",
            default: !0
          }],
          balls_more: [{
            cid: 1,
            name: " emoj1 ",
            default: !1,
            cost: 500,
            matIdx: 20
          }, {
            cid: 2,
            name: " emoj2 ",
            default: !1,
            cost: 500,
            matIdx: 21
          }, {
            cid: 3,
            name: " apple ",
            default: !1,
            cost: 500,
            matIdx: 22
          }],
          ball_colors: [{
            cid: 1,
            name: " white ",
            cost: 200,
            color: new cc.Color(255, 255, 255, 255)
          }, {
            cid: 2,
            name: " red ",
            cost: 300,
            color: new cc.Color(255, 0, 0, 100)
          }, {
            cid: 3,
            name: " green ",
            cost: 300,
            color: new cc.Color(0, 255, 0, 100)
          }, {
            cid: 4,
            name: " blue ",
            cost: 300,
            color: new cc.Color(0, 0, 255, 150)
          }, {
            cid: 5,
            name: " yellow ",
            cost: 300,
            color: new cc.Color(255, 255, 0, 255)
          }, {
            cid: 6,
            name: " purple ",
            cost: 300,
            color: new cc.Color(255, 0, 255, 255)
          }, {
            cid: 7,
            name: " orange ",
            cost: 300,
            color: new cc.Color(255, 125, 0, 255)
          }],
          ball_particles: [{
            cid: 1,
            name: " red ",
            style: 1,
            file: " red1 ",
            cost: 300
          }, {
            cid: 2,
            name: " green ",
            style: 1,
            file: " green1 ",
            cost: 300
          }, {
            cid: 3,
            name: " blue ",
            style: 1,
            file: " by1 ",
            cost: 300
          }, {
            cid: 4,
            name: " yellow ",
            style: 1,
            file: " yellow1 ",
            cost: 300
          }, {
            cid: 5,
            name: " pink ",
            style: 1,
            file: " pink1 ",
            cost: 300
          }, {
            cid: 6,
            name: " gold ",
            style: 1,
            file: " gold1 ",
            cost: 300
          }]
        };
      },
      isModifyBallDir: !0
    };
    f.ballDirModifyThreshold = .1111111111111111 * Math.PI;
    f.pack_ballMatIdx = function (e) {
      r.shop_ball_add(e);
    };
    f.unpack_ballMatIdx = function (e) {
      r.shop_ball_remove(e);
    };
    f.pack_color = function (e) {
      r.shop_color_set(e);
    };
    f.pack_particle = function (e) {
      r.shop_particle_set(e);
    };
    f.getBy_cid = function (e, t) {
      for (var o = 0; o < t.length; o++) if (t[o].cid == e) return t[o];
      return null;
    };
    f.addCoin = function (e, t) {
      var n = o.userInfo.coin;
      o.updateUserInfoKV(" coin ", e, function () {
        n += e;
        console.log(" add coin suc ", e, n);
        f.playCoinReward();
        o.userInfo.coin = n;
        t(n);
      });
    };
    f.coin_notEnough = function () {};
    f.buy_ball = function (e, t) {
      o.updateUserInfoKV(" bmIdx ", e, function (o) {
        var n = o.data.status;
        console.log(" bmIdx status ", n);
        t(e, n);
      });
    };
    f.buy_color = function (e, t) {
      o.updateUserInfoKV(" btx1 ", e, function (o) {
        var n = o.data.status;
        console.log(" btx1 status ", n);
        t(e, n);
      });
    };
    f.buy_particle = function (e, t) {
      o.updateUserInfoKV(" btx2 ", e, function (o) {
        var n = o.data.status;
        console.log(" btx2 status ", n);
        t(e, n);
      });
    };
    f.lookVideo = function () {};
    f.resetInHall = function () {
      f.editingTableInfo = null;
      f.game_mode = f.MODE.ME_Free;
    };
    f.pack_WinInfo = function (e) {
      return {
        openid: o.userInfo.openid,
        name: o.userInfo.name,
        pic: o.userInfo.pic,
        sec: e
      };
    };
    f.pack_PublicTableInfo = function (e, t) {
      if (!t) {
        var n = new Date().getTime();
        e.time = n;
        var i = Math.floor(new Date().getTime() / 1e3);
        e.tableID = i;
        var a = o.userInfo.name + i;
        e.name = a;
      }
      return {
        openid: o.userInfo.openid,
        sID: e.sID,
        tableID: e.tableID,
        tableName: e.name,
        tableInfo: e,
        name: o.userInfo.name,
        icon: o.userInfo.pic,
        time: e.time,
        totalNum: 0,
        winNum: 0,
        zanIDS: 0,
        tj: 0,
        pr: 0,
        p1: 0,
        p2: 0
      };
    };
    f.pack_BallMI = function (e, t, o, n, i) {
      return {
        ballMatIdx: e = e || 0,
        ballType: t = t || f.BallIDType_Normal,
        ballNum: o = o || 0,
        p1: n = n || 0,
        p2: i = i || 0
      };
    };
    f.pack_condition = function (e, t, o, n, i, a) {
      return {
        type: n = n || 1,
        cdBalls: t = t || [],
        lHallID: o = o || [],
        ganNum: e = e || 1,
        p1: i = i || 0,
        p2: a = a || 0
      };
    };
    f.pack_BallInfo = function (e, t, o, n, i, a, r) {
      return {
        ballID: e,
        ballType: t,
        x: o,
        y: n,
        tx1: a = a || 0,
        tx2: r = r || 0,
        ballMatIdx: i = i || 0,
        p1: 0,
        p2: 0,
        p3: 0
      };
    };
    f.pack_tableInfo = function (e) {
      var t = {
        tableID: -1,
        sID: -1,
        name: e = e || o.userInfo.name + -1,
        time: new Date().getTime(),
        balls: [],
        condition: f.pack_condition(),
        cue: {
          cueID: 0,
          Mat: 0,
          p1: 0,
          p2: 0
        },
        isPass: 0,
        tableMat: 0,
        color: -1,
        particle: -1,
        p1: 0,
        p2: 0,
        p3: 0
      };
      t.color = r.shop_color_get();
      t.particle = r.shop_particle_get();
      return t;
    };
    f.pack_answer = function (e, t, o, n, i, a) {
      return {
        angle: e,
        power: t,
        posT: o = o || 0,
        posV: n = n || 0,
        p1: i = i || 0,
        p2: a = a || 0
      };
    };
    f.gotoHall = function () {
      console.log(" gotoHall ");
      cc.director.loadScene(" game_main ");
    };
    f.gotoTableEditor = function () {
      cc.director.loadScene(" game_table_editor ");
    };
    f.gotoShop = function () {
      cc.director.loadScene(" game_shop ");
    };
    f.gotoEditor = function (e) {
      console.log(" gotoEditor ", e);
      f.editingTableInfo = e;
      cc.director.loadScene(" game_table_editor ");
    };
    f.gotoEditorAndCreateNew = function () {
      console.log(" gotoEditorAndCreateNew ");
      var e = f.pack_tableInfo();
      f.editingTableInfo = e;
      f.gotoEditor(e);
    };
    f.gotoInfoList = function () {
      console.log(" gotoListInfo ");
      f.gotoEditorAndCreateNew();
    };
    f.backtoInfoList = function () {
      f.gotoHall();
    };
    f.loadLevelConfig = function (e, t) {
      cc.loader.loadRes(" temp_file/ l_ " + (e + 1), cc.JsonAsset, function (e, o) {
        if (o) {
          o.json.tableInfo.condition.ganNum = Number(_.global_ConfigMap.get(" line_lv_life "));
          t && t(o);
        }
      });
    };
    f.loadLevelConfigOnServer = function (e, t) {
      var o = this;
      f.isGuideLevel = e < 1 && !l.default.Instance.id;
      s.default.getLevelTableConfigByLevelID(e + 1).then(function (e) {
        var n = o.freemode_loadjs(1).arr[0];
        n.tableInfo.tableID = e.table_key;
        var i = [];
        n.tableInfo.balls = i;
        e.balls.forEach(function (e) {
          var t = 0 == e.ballID ? 100 : 200 + e.ballID;
          i.push({
            ballID: t,
            ballType: 0 == e.ballID ? 1 : 2,
            x: e.x,
            y: e.y,
            tx1: 0,
            tx2: 0,
            ballMatIdx: 0 == e.ballID ? 0 : e.ballID + 1,
            p1: 0,
            p2: 0,
            p3: 0
          });
        });
        n.tableInfo.condition.ganNum = Number(_.global_ConfigMap.get(" line_lv_life "));
        t && t(n);
      }, function () {
        t && t(null);
      });
    };
    f.gotoTable_free = function (e, t, o) {
      void 0 === o && (o = !1);
      f.freeMode_jsonCfg = c.clone(e);
      var n = f.freeMode_jsonCfg_idx;
      console.log(" jkd BallLogicMgr.gotoTable_free---------- idx: " + n);
      f.loadLevelConfigOnServer(n, function (e) {
        f.game_mode = f.MODE.ME_Free;
        f.editingTableInfo = e.tableInfo;
        t && t();
        o || cc.director.loadScene(" game_tabel ");
      });
    };
    f.gotoEditor = function (e) {
      f.freeMode_totalGanNum = 0;
      var t = f.freemode_loadjs(1);
      if (t) {
        f.freeMode_jsonCfg = c.clone(t);
        f.freeMode_jsonCfg_idx = 1;
        var o = f.freemode_loadjs(1).arr[0];
        o.tableInfo.tableID = e.table_key;
        var n = [];
        o.tableInfo.balls = n;
        e.balls.forEach(function (e) {
          var t = 0 == e.ballID ? 100 : 200 + e.ballID;
          n.push({
            ballID: t,
            ballType: 0 == e.ballID ? 1 : 2,
            x: e.x,
            y: e.y,
            tx1: 0,
            tx2: 0,
            ballMatIdx: 0 == e.ballID ? 0 : e.ballID + 1,
            p1: 0,
            p2: 0,
            p3: 0
          });
        });
        o.tableInfo.condition.ganNum = Number(_.global_ConfigMap.get(" line_lv_life "));
        var i = o;
        f.game_mode = f.MODE.ME_Free;
        f.editingTableInfo = i.tableInfo;
        cc.director.loadScene(" game_tabel ");
      } else console.log(" error: gotoTable_free_loadfirst json is null ");
    };
    f.freemode_loadjs = function (t) {
      var o = " FModeConfig " + Math.min(2, Math.floor(t / 10) + 1),
        n = e(o);
      return n ? n.json : null;
    };
    f.freeMode_jsonCfg_idx = 0;
    f.freeMode_totalGanNum = 0;
    f.is_record = !1;
    f.is_switching = !1;
    f.record_time = 0;
    f.recorder = null;
    f.lastStop_time = 0;
    f.updateRecIcon = null;
    f.isStartTooFast = function () {
      return new Date().getTime() - f.lastStop_time < 1e3;
    };
    f.showModal = function () {};
    f.initRecord = function () {
      if (!f.recorder) {
        f.recorder = wx.getGameRecorderManager();
        f.recorder.onStart(function () {
          console.log(" rec onStart ");
          f.is_record = !0;
          f.is_switching = !1;
        });
        f.recorder.onStop(function (e) {
          var t = e.videoPath;
          console.log(" rec onStop ", f.updateRecIcon);
          f.is_switching = !1;
          f.is_record = !1;
          f.lastStop_time = new Date().getTime();
          if (f.updateRecIcon) {
            console.log(" call BallLogicMgr.updateRecIcon ", typeof f.updateRecIcon);
            f.updateRecIcon();
          }
          wx.showModal({
            title: " 录屏完成 ",
            content: " 录屏已经完成 ， 是否发布这个录屏内容 ？ ",
            success: function (e) {
              if (e.confirm) {
                console.log(" confirm, continued ");
                wx.shareVideo({
                  videoPath: " " + t,
                  success: function () {},
                  fail: function () {}
                });
              } else e.cancel && console.log(" cancel, cold ");
            },
            fail: function () {
              console.log(" showModal调用失败 ");
            }
          });
        });
        return f.recorder;
      }
    };
    f.gotoTable_freeMode_useCacheIdx = function (e) {
      if (e) {
        var t = r.freeModeLastBest_get();
        f.freeMode_totalGanNum = Number(t.ganNum);
        f.gotoTable_free_loadfirst(Number(t.idx) + 1);
      } else {
        f.freeMode_totalGanNum = 0;
        f.gotoTable_free_loadfirst(0);
      }
    };
    f.loadTable = function (e, t, o, n) {
      void 0 === n && (n = !1);
      f.freeMode_totalGanNum = 0;
      var i = f.freemode_loadjs(1);
      if (i) {
        f.freeMode_jsonCfg_idx = e;
        f.freeMode_jsonCfg = c.clone(i);
        var a = function (e) {
          f.game_mode = f.MODE.ME_Free;
          f.editingTableInfo = e.tableInfo;
          null == o || o();
          n || cc.director.loadScene(" game_tabel ");
        };
        f.isGuideLevel = e < 1 && !l.default.Instance.id;
        s.default.getLevelTableConfigByFileName(t).then(function (e) {
          var t = i.arr[0];
          t.tableInfo.tableID = e.table_key;
          var o = [];
          t.tableInfo.balls = o;
          e.balls.forEach(function (e) {
            var t = 0 == e.ballID ? 100 : 200 + e.ballID;
            o.push({
              ballID: t,
              ballType: 0 == e.ballID ? 1 : 2,
              x: e.x,
              y: e.y,
              tx1: 0,
              tx2: 0,
              ballMatIdx: 0 == e.ballID ? 0 : e.ballID + 1,
              p1: 0,
              p2: 0,
              p3: 0
            });
          });
          t.tableInfo.condition.ganNum = Number(_.global_ConfigMap.get(" line_lv_life "));
          a(t);
        }, function () {
          return a(null);
        });
      } else console.error(" gotoTable_free_loadfirst json is null ");
    };
    f.loadTable_freeMode_useIdx = function (e, t, o) {
      void 0 === o && (o = !1);
      f.freeMode_totalGanNum = 0;
      f.gotoTable_free_loadfirst(e, t, o);
    };
    f.loadTable_freeMode_useCacheIdx = function (e, t) {
      if (e) {
        var o = r.freeModeLastBest_get();
        f.freeMode_totalGanNum = Number(o.ganNum);
        f.gotoTable_free_loadfirst(Number(o.idx) + 1, t, !0);
      } else {
        f.freeMode_totalGanNum = 0;
        f.gotoTable_free_loadfirst(0, t, !0);
      }
    };
    f.gotoTable_free_loadfirst = function (e, t, o) {
      var n = f.freemode_loadjs(e < 0 ? 0 : e);
      if (n) {
        f.freeMode_jsonCfg_idx = e;
        f.gotoTable_free(n, t, o);
      } else console.log(" error: gotoTable_free_loadfirst json is null ");
    };
    f.getFreeModeCurCfgItem = function () {
      if (f.freeMode_jsonCfg) {
        var e = f.freeMode_jsonCfg.arr,
          t = f.freeMode_jsonCfg_idx;
        if ((t %= 50) < e.length) return e[t];
      }
      return null;
    };
    f.gotoFreeModeNextCfgItem = function (e) {
      if (f.freeMode_jsonCfg) {
        f.freeMode_jsonCfg.arr;
        var t = f.freeMode_jsonCfg_idx + 1;
        if (0 == (t %= 50)) {
          var o = f.freemode_loadjs(f.freeMode_jsonCfg_idx + 1);
          if (o) {
            f.freeMode_jsonCfg = c.clone(o);
            o.arr;
            f.loadLevelConfig(0, function (t) {
              f.freeMode_jsonCfg_idx = 0;
              f.editingTableInfo = t.json.tableInfo;
              e(f.editingTableInfo);
            });
          } else e(null);
        } else t < 50 ? f.loadLevelConfig(t, function (t) {
          f.freeMode_jsonCfg_idx += 1;
          f.editingTableInfo = t.json.tableInfo;
          e(f.editingTableInfo);
        }) : e(null);
      } else e(null);
    };
    f.gotoTable_editing = function (e) {
      f.game_mode = f.MODE.ME_Editing;
      f.editingTableInfo = e;
      cc.director.loadScene(" game_tabel ");
    };
    f.gotoTable_challenge = function (e, t) {
      f.game_mode = f.MODE.PVE_Challenge;
      f.editingTableInfo = e;
      f.challenging_publictableInfo = t;
      cc.director.loadScene(" game_tabel ");
    };
    f.clickTableEditListItem = function (e) {
      if (f.publicTableList && e < f.publicTableList.length) {
        var t = f.publicTableList[e].tableInfo;
        f.editingTableInfo = t;
        cc.director.loadScene(" game_table_editor ");
      }
    };
    f.clickTableEditListItem_play = function () {};
    f.clickTableEditListItem_challenge = function (e) {
      e && f.gotoTable_challenge(e.tableInfo, e);
    };
    f.getTableArray = function (e) {
      e = e || o.userInfo.openid;
      f.allTables.get(e);
      for (var t, n = [], i = u(f.tableInfos.values()); !(t = i()).done;) {
        var a = t.value;
        n.push(a);
      }
      return n;
    };
    f.last_zan_ms = 0;
    f.do_zan = function (e, t) {
      new Date().getTime() - f.last_zan_ms >= 6e4 ? o.updateOnePublicTableInfo(e, " zanIDS ", 1, function (e) {
        f.last_zan_ms = new Date().getTime();
        t(e);
      }) : o.isTT() && tt.showToast({
        title: " 请休息一会儿再点 ! ",
        duration: 800,
        success: function (e) {
          console.log(" " + e);
        },
        fail: function () {
          console.log(" showToast调用失败 ");
        }
      });
    };
    f.publicTableList_removeBysID = function (e) {
      if (f.publicTableList) {
        for (var t = -1, o = 0; o < f.publicTableList.length; o++) if (f.publicTableList[o].sID == e) {
          t = o;
          break;
        }
        t >= 0 && f.publicTableList.splice(t, 1);
      }
    };
    f.saveFreeModeFinishIdx = function () {
      var e = f.freeMode_jsonCfg_idx;
      r.freeModeIdx_set(e);
      var t = !1,
        o = r.freeModeLastBest_get();
      e > Number(o.idx) ? t = !0 : e == Number(o.idx) && f.freeMode_totalGanNum < Number(o.ganNum) && (t = !0);
      if (t) {
        console.log(" isBetter true ");
        var n = {
          idx: e,
          ganNum: f.freeMode_totalGanNum
        };
        r.freeModeLastBest_set(n);
      }
    };
    f.saveOneMoreRewardTime = function () {
      var e = r.rewardTimes_get();
      e = Number(e);
      e += 1;
      r.rewardTimes_set(e);
    };
    f.checkCanRewardToday = function () {
      var e = r.rewardTimes_get();
      e = Number(e);
      console.log(" rewardTimes_get ", e);
      return !(e >= f.rewardMaxNum_oneDay);
    };
    f.saveOneMoreShareRewardTime = function () {
      var e = r.shareRewardTimes_get();
      e = Number(e);
      e += 1;
      r.shareRewardTimes_set(e);
    };
    f.checkCanShareRewardToday = function () {
      var e = r.shareRewardTimes_get();
      e = Number(e);
      console.log(" shareRewardTimes_get ", e);
      return !(e >= f.shareRewardMaxNum_oneDay);
    };
    f.pushArrayBuffer = function (e) {
      var t,
        o = (t = new Uint8Array(e), String.fromCharCode.apply(null, t));
      f.msgCache_balls.push(o);
    };
    f.cur_bgMusicID = null;
    f.loading_bgMusic = !1;
    f.playBgMusic = function () {};
    f.stopBgMusic = function () {};
    f.playBallCueCollide = function () {};
    f.last_ballCollideSound = 0;
    f.playBallCollideSound = function () {
      n.default.getInstance().playMusic(" pool_ball_bump ");
    };
    f.playBoardCollideSound = function () {
      n.default.getInstance().playMusic(" pool_ball_bumptable ");
    };
    f.playSound = function (e, t) {
      t && n.default.getInstance().isPlaying(e) || n.default.getInstance().playMusic(e);
    };
    f.playUIClick = function () {};
    f.playCoinReward = function () {
      n.default.getInstance().playMusic(" coin_reward ");
    };
    f.showAD = function () {};
    f.destroyAD = function () {};
    f.lastCB_ms = 0;
    f.showAD_video = function () {
      return !1;
    };
    f.showAD_video2 = function () {
      return !1;
    };
    t.exports = f;
    cc._RF.pop();
