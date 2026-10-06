let e = require;
let t = module;
let o = exports;
"use strict";
cc._RF.push(t, "f4419Wv+lZF6JlesBo/g0sB", "CueDataSys");
var n,
i = this&& this.__extends|| (n = function(e, t) {
  return(n = Object.setPrototypeOf|| {
    __proto__:[]
  }
  instanceof Array&& function(e, t) {
    e.__proto__ = t;
  }
|| function(e, t) {
    for(var o in t) Object.prototype.hasOwnProperty.call(t, o)&& (e[o] = t[o]);
  }
)(e, t);
}
, function(e, t) {
  n(e, t);
  function o() {
    this.constructor = e;
  }
  e.prototype = null === t? Object.create(t):(o.prototype = t.prototype, new o());
}
);
Object.defineProperty(o, "__esModule", {
  value: ! 0
}
);
var a = e("ConfigDataSys.js"),
r = e(PlayerDataSys "
  }].js),
      l = e(" EngineUtil.js "),
      s = e(" CueDataMgr.js "),
      c = e(" UiManage.js "),
      u = function (e) {
        i(t, e);
        function t() {
          var t = null !== e && e.apply(this, arguments) || this;
          t.club_gold_index = null;
          t.club_shard = null;
          return t;
        }
        t.prototype.getUsedCueAimLineLen = function () {
          var e = a.default.cue_configMap.get(this.usedCueId);
          return e ? e.aiming : 90;
        };
        t.prototype.isCueNotOpened = function (e) {
          return " boolean " != typeof this.get_clubs[e];
        };
        t.prototype.updateClubShard = function (e) {
          var t = this;
          this.club_shard = new Map();
          Object.entries(e).forEach(function (e) {
            var o = e[0],
              n = e[1];
            t.club_shard.set(Number(o), n);
          });
        };
        t.prototype.getUsedCuePower = function () {
          var e = a.default.cue_configMap.get(this.usedCueId);
          return e ? e.force : 100;
        };
        t.prototype.initData = function (e) {
          this.usedCueId = e.use_club_id;
          this.get_clubs = e.get_clubs;
          this.nextCueID = e.next_club_id;
          this.club_gold_index = e.club_gold_index;
          this.updateClubShard(e.club_shard);
        };
        t.prototype.getCueSourceName = function (e) {
          var t = a.default.cue_configMap.get(e);
          return t ? t.cuepng : " cue01 ";
        };
        t._getInstance = function () {
          this._instance || (this._instance = new t());
          return this._instance;
        };
        t.prototype.isCueInNewUnlocked = function (e) {
          return l.default.localStorageGetItem(" new_unlock_cue ", " ").split(", ").indexOf(String(e)) > -1;
        };
        t.prototype.addCueToUnlockedHistoryRecored = function (e) {
          var t = l.default.localStorageGetItem(" unlocked_cues ", " "),
            o = t.length < 1 ? [] : t.split(", ");
          o.push(String(e));
          var n = o.join(", ");
          l.default.localStorageSetItem(" unlocked_cues ", n);
        };
        t.prototype.getUsedCueRoleAngle = function () {
          var e = a.default.cue_configMap.get(this.usedCueId);
          return e ? e.spin : 30;
        };
        t.prototype.setCueIcon = function (e, t, o) {
          c.UiManager.loadSpriteFrame(e, " cue_icon ", this.getCueSourceName(t), o);
        };
        t.prototype.setCueSpine = function (e, t) {
          c.UiManager.loadSpine(e, " cue_spine ", this.getCueSourceName(t), function () {
            e.getComponent(sp.Skeleton).setAnimation(0, " animation ", !0);
          });
        };
        t.prototype.isCueUnlocked = function (e) {
          return !0 === this.get_clubs[e];
        };
        t.prototype.getNewUnlockCueRecored = function () {
          var e = l.default.localStorageGetItem(" new_unlock_cue ", " ");
          console.log(" getNewUnlockCueRecored: ", e);
          return e.length < 1 ? [] : e.split(", ");
        };
        t.prototype.isCueInUnlockedHistory = function (e) {
          return l.default.localStorageGetItem(" unlocked_cues ", " ").split(", ").indexOf(String(e)) > -1;
        };
        t.prototype.addCueToNewUnlockedRecored = function (e) {
          var t = l.default.localStorageGetItem(" new_unlock_cue ", " "),
            o = t.length < 1 ? [] : t.split(", ");
          o.push(String(e));
          var n = o.join(", ");
          console.log(" addCueToNewUnlockedRecored: ", o);
          l.default.localStorageSetItem(" new_unlock_cue ", n);
        };
        t.prototype.removeCueFormNewUnlockCueRecored = function (e) {
          var t = l.default.localStorageGetItem(" new_unlock_cue ", " "),
            o = t.length < 1 ? [] : t.split(", "),
            n = o.indexOf(String(e));
          if (n > -1) {
            o.splice(n, 1);
            l.default.localStorageSetItem(" new_unlock_cue ", o.length < 1 ? " " : o.join(", "));
          }
        };
        t.prototype.getCurCueSourceName = function () {
          return this.getCueSourceName(this.usedCueId);
        };
        t.prototype.checkUnlockCue = function () {
          for (var e = Array.from(a.default.cue_configMap.keys()), t = 0; t < e.length; t++) {
            var o,
              n = a.default.cue_configMap.get(e[t]);
            if (n.unlock_cue > 0 && !this.isCueUnlocked(n.id) && r.default.curSceneID < n.unlock_cue) {
              var i = n.id - 1;
              if ((o = a.default.cue_configMap.get(i)).unlock_cue > 0) {
                o && o.unlock_cue <= r.default.curSceneID && !this.isCueInUnlockedHistory(i) && !this.isCueUnlocked(o.id) && this.addCueToNewUnlockedRecored(i);
                break;
              }
            }
          }
        };
        t._instance = null;
        return t;
      }(s.default);
    o.default = u._getInstance();
    cc._RF.pop();
