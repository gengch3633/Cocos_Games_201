let e = require;
let t = module;
"use strict";
cc._RF.push(t, "3daa4L+KVFPMZEljl3/hLwJ", "GameMgr");
var o = e(GlobalConfig "
  }].js),
      n = {
        goto_main: function () {
          console.log(" call GameMgr.goto_main ");
        },
        replay_scene: function () {},
        correct_one: function () {},
        playEffectSound: function (e) {
          o.setting.sound_effect && cc.loader.loadRes(e, cc.AudioClip, function (e, t) {
            cc.audioEngine.play(t, !1, 1);
          });
        },
        correct_all: function () {
          o.setting;
        },
        discorrect: function () {},
        connectWSCB: function () {},
        connectWS: function () {}
      },
      i = 0;
    n.setBattleState = function (e) {
      i = e;
    };
    n.setInBattle = function () {
      i = 2;
    };
    n.isInBattle = function () {
      return 2 == i;
    };
    n.setOutBattle = function () {
      return 0 == i;
    };
    n.LSKEY_EditingTableInfo = " etableInfo ";
    n.local_set = function (e, t) {
      t && (" object " == typeof t ? cc.sys.localStorage.setItem(e, JSON.stringify(t)) : cc.sys.localStorage.setItem(e, t));
    };
    n.local_get = function (e) {
      return cc.sys.localStorage.getItem(e);
    };
    n.local_remove = function (e) {
      cc.sys.localStorage.removeItem(e);
    };
    t.exports = n;
    cc._RF.pop();
