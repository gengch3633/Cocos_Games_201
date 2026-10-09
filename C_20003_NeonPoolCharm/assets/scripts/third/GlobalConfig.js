let e = require;let t = module;
    "use strict";

    cc._RF.push(t, "a65a32cr5dBCqFfCeFd1Ftd", "GlobalConfig");
    var o = {
      appID: 1001,
      appName: "ball",
      ball_radius: 18.7,
      Editor_MaxBallSize: 20,
      PowerMax: 98,
      PowerMin: 1,
      BallAimLineLen: 90,
      BallRoleAngle: 30,
      gan_move_rad_multy_aim_base: 18,
      gan_move_rad_multy_normal_base: 3,
      gan_move_rad_multy_aim: 10,
      gan_move_rad_multy_normal: 2,
      gan_move_roll_multy_base: 6e-4,
      gan_move_roll_multy_aim_base: 13e-5,
      gan_move_roll_multy: 6e-4,
      gan_move_roll_multy_aim: 13e-5,
      debug_alpha: !1,
      debug_physicDraw: !1,
      ID_WHITEBALL: 100,
      nowgame: {},
      testDBInLocalhost: !1,
      testDBInALI: !1,
      windowsSave: !0,
      setting: {
        sound_effect: !0,
        music_effect: !0,
        config_wxSyncToMongo: !0,
        platform_wx: {
          db_url: "http://127.0.0.1:8081/",
          platform_str: "wx"
        },
        platform_tt: {
          db_url: "http://127.0.0.1:8081/",
          platform_str: "tt"
        },
        platform_other: {
          db_url: "http://127.0.0.1:8081/",
          platform_str: "wx"
        },
        platform_alitestball: {
          db_url: "http://127.0.0.1:8081/",
          platform_str: "alitestball"
        },
        platform_localhost: {
          db_url: "http://127.0.0.1:8081/",
          platform_str: "localhost"
        }
      },
      sound_toggle_get: function () {
        return 0 != cc.sys.localStorage.getItem(o.appName + "_sound");
      },
      sound_toggle_set: function (e) {
        var t = e ? 1 : 0;
        cc.sys.localStorage.setItem(o.appName + "_sound", t);
      },
      music_toggle_get: function () {
        var e = cc.sys.localStorage.getItem(o.appName + "_music");
        console.log("music_toggle", e, o.appName + "_music");
        return 0 != e;
      },
      music_toggle_set: function (e) {
        var t = e ? 1 : 0;
        cc.sys.localStorage.setItem(o.appName + "_music", t);
      },
      sens_toggle_get: function () {
        var e = cc.sys.localStorage.getItem(o.appName + "_sens");
        e || (e = 0);
        return e;
      },
      sens_toggle_set: function (e) {
        var t = e;
        cc.sys.localStorage.setItem(o.appName + "_sens", t);
      },
      shop_ball_get: function () {
        var e = cc.sys.localStorage.getItem(o.appName + "_shop_ball");
        console.log("shop_ball_get", e, o.appName + "_shop_ball");
        e || (e = {
          arr: []
        });
        "string" == typeof e && (e = JSON.parse(e));
        "object" != typeof e && (e = {
          arr: []
        });
        e.arr || (e.arr = []);
        return e;
      },
      shop_ball_set: function (e) {
        e = JSON.stringify(e);
        cc.sys.localStorage.setItem(o.appName + "_shop_ball", e);
      },
      shop_ball_add: function (e) {
        var t = o.shop_ball_get(),
          n = t.arr || [];
        if (n.indexOf(e) < 0) {
          n.push(e);
          o.shop_ball_set(t);
        }
      },
      shop_ball_remove: function (e) {
        var t = o.shop_ball_get(),
          n = t.arr || [],
          i = n.indexOf(e);
        if (i >= 0) {
          n.splice(i, 1);
          o.shop_ball_set(t);
        }
      },
      shop_color_get: function () {
        var e = cc.sys.localStorage.getItem(o.appName + "_shop_color");
        console.log("shop_color_get", e, o.appName + "_shop_color");
        e || (e = -1);
        return e;
      },
      shop_color_set: function (e) {
        cc.sys.localStorage.setItem(o.appName + "_shop_color", e);
      },
      shop_particle_get: function () {
        var e = cc.sys.localStorage.getItem(o.appName + "_shop_particle");
        console.log("shop_particle_get", e, o.appName + "_shop_particle");
        e || (e = -1);
        return e;
      },
      shop_particle_set: function (e) {
        cc.sys.localStorage.setItem(o.appName + "_shop_particle", e);
      },
      get_challenge_list: function () {
        var e = cc.sys.localStorage.getItem(o.appName + "_challenge_list");
        e || (e = {
          arr: []
        });
        "string" == typeof e && (e = JSON.parse(e));
        "object" != typeof e && (e = {
          arr: []
        });
        e.arr || (e.arr = []);
        console.log("get_challenge_list", e, typeof e, o.appName + "_challenge_list");
        return e;
      },
      add_challenge_list: function (e) {
        var t = o.get_challenge_list(),
          n = t.arr || [];
        if (n.indexOf(e) < 0) {
          n.push(e);
          o.set_challenge_list(t);
        }
      },
      set_challenge_list: function (e) {
        e = JSON.stringify(e);
        cc.sys.localStorage.setItem(o.appName + "_challenge_list", e);
      },
      freeModeIdx_get: function () {
        var e = cc.sys.localStorage.getItem(o.appName + "_freeModeIdx");
        e || (e = -1);
        return e;
      },
      freeModeIdx_set: function (e) {
        cc.sys.localStorage.setItem(o.appName + "_freeModeIdx", e);
      },
      freeModeLastBest_get: function () {
        var e = cc.sys.localStorage.getItem(o.appName + "_freeModeLast");
        return e ? JSON.parse(e) : {
          idx: -1,
          ganNum: 0
        };
      },
      freeModeLastBest_set: function (e) {
        var t = JSON.stringify(e);
        cc.sys.localStorage.setItem(o.appName + "_freeModeLast", t);
      },
      format_todayStr: function () {
        var e = new Date();
        return e.getFullYear() + "_" + e.getMonth() + "_" + e.getDate();
      },
      rewardDay_get: function () {
        var e = cc.sys.localStorage.getItem(o.appName + "_rewardDay");
        e || (e = -1);
        return e;
      },
      rewardDay_set: function () {
        var e = o.format_todayStr();
        cc.sys.localStorage.setItem(o.appName + "_rewardDay", e);
      },
      rewardTimes_get: function () {
        var e = cc.sys.localStorage.getItem(o.appName + "_rewardTimes");
        e || (e = 0);
        if (o.format_todayStr() != o.rewardDay_get()) {
          e = 0;
          o.rewardDay_set();
          o.rewardTimes_set(e);
        }
        return e;
      },
      rewardTimes_set: function (e) {
        cc.sys.localStorage.setItem(o.appName + "_rewardTimes", e);
      },
      shareRewardDay_get: function () {
        var e = cc.sys.localStorage.getItem(o.appName + "_shareRewardDay");
        e || (e = -1);
        return e;
      },
      shareRewardDay_set: function () {
        var e = o.format_todayStr();
        cc.sys.localStorage.setItem(o.appName + "_shareRewardDay", e);
      },
      shareRewardTimes_get: function () {
        var e = cc.sys.localStorage.getItem(o.appName + "_shareReward");
        e || (e = 0);
        if (o.format_todayStr() != o.shareRewardDay_get()) {
          e = 0;
          o.shareRewardDay_set();
          o.shareRewardTimes_set(e);
        }
        return e;
      },
      shareRewardTimes_set: function (e) {
        cc.sys.localStorage.setItem(o.appName + "_shareReward", e);
      },
      anonymous_openid_get: function () {
        var e = cc.sys.localStorage.getItem(o.appName + "_anonymous_openid");
        e || (e = -1);
        return e;
      },
      anonymous_openid_set: function (e) {
        cc.sys.localStorage.setItem(o.appName + "_anonymous_openid", e);
      },
      unlogin_obj_get: function () {
        var e = cc.sys.localStorage.getItem(o.appName + "_unlogin_obj");
        return e ? JSON.parse(e) : {
          coin: 0
        };
      },
      unlogin_obj_set: function (e) {
        var t = JSON.stringify(e);
        cc.sys.localStorage.setItem(o.appName + "_unlogin_obj", t);
      },
      unlogin_obj_setKV: function (e, t) {
        var n = o.unlogin_obj_get();
        n[e] = t;
        o.unlogin_obj_set(n);
      },
      unlogin_obj_clear: function () {
        o.unlogin_obj_set({
          coin: 0
        });
      },
      staticConfig: {
        levelConfig: [{
          level: 1,
          exp_need: 100,
          title: "1"
        }],
        titleConfig: {}
      },
      colors: {
        gray_hex: "#999999",
        black_hex: "#323232",
        blue_hex: "#00C8FF",
        green_hex: "#00AA8C",
        red_hex: "#AA008C",
        yellow_hex: "#FFC800",
        bgColor_hex: "#DEDEDE",
        orange_hex: "ff6a6a"
      }
    };
    t.exports = o;
    cc._RF.pop();
