let e = require;
let t = module;
let i = exports;
"use strict";
cc._RF.push(t, "563a3cube1DW6DmmClaK3WW", "AudioMgr");
var n = __extends,
a = __awaiter,
o = __generator;
Object.defineProperty(i, "__esModule", {
  value: ! 0
}
);
var r = e("UserAudioData"),
s = e("ResMgr"),
l = e("Singleton"),
c = {
  click: {
    success: "audio/click_common",
    fail: "audio/click_error",
    bundleName: "cocos-module-common"
  }
,
  bundleName: "common",
  effMaxRepeat: 10
}
,
u = function(e) {
  function t() {
    var t = e.call(this)|| this;
    t.option = c;
    t.idMap = new Map();
    t.musicMute = r.default.getInstance().musicMute;
    t.effectMute = r.default.getInstance().effectMute;
    return t;
  }
  n(t, e);
  t.prototype.setGlobalOption = function(e) {
    e = Object.assign(c, e);
    this.option = e;
  }
;
  t.prototype.playEffect = function(e, t, i, n) {
    return a(this, void 0, Promise, function() {
      var a, r, l, c, u;
      return o(this, function(o) {
        switch(o.label) {
          case 0: if(! e) return[2, - 1];
          a = null;
          r = this.option.effMaxRepeat;
          l = ! 1;
          o.label = 1;
          case 1: o.trys.push([1, 5, , 6]);
          return e instanceof cc.AudioClip?(a = e, "number" == typeof t&& (r = t), "boolean" == typeof i&& (l = i), [3, 4]):[3, 2];
          case 2: c = "string" == typeof t? t: this.option.bundleName;
          r = "number" == typeof i? i: r;
          l = "boolean" == typeof n? n: l;
          return[4, s.default.getInstance().loadRes(e, cc.AudioClip, null, c)];
          case 3: a = o.sent();
          o.label = 4;
          case 4: return a?[2, this.handlePlayEffect(a, r, l)]:[2, - 1];
          case 5: u = o.sent();
          console.error(u, e, t, i, n);
          return[2, - 1];
          case 6: return[2];
        }
      }
);
    }
);
  }
;
  t.prototype.handlePlayEffect = function(e, t, i) {
    var n = this,
    a = this.idMap.get(e)|| [];
    if(a.length >= t) return a[0];
    var o = cc.audioEngine.playEffect(e, i);
    a.push(o);
    this.idMap.set(e, a);
    cc.audioEngine.setFinishCallback(o, function() {
      var t = n.idMap.get(e);
      if(t&& !(t.length <= 0)) {
        var i = t.indexOf(o);
        i > - 1&& t.splice(i, 1);
        0 === t.length&& n.idMap.delete(e);
      }
    }
);
    return o;
  }
;
  t.prototype.playClickEff = function(e) {
    void 0 === e&& (e = ! 0);
    return a(this, void 0, Promise, function() {
      var t;
      return o(this, function() {
        return(t = e? this.option.click.success: this.option.click.fail)?[2, this.playEffect(t, this.option.click.bundleName)]:[2, - 1];
      }
);
    }
);
  }
;
  t.prototype.playMusic = function(e, t, i) {
    void 0 === i&& (i = ! 0);
    return a(this, void 0, Promise, function() {
      var n, a, r, l;
      return o(this, function(o) {
        switch(o.label) {
          case 0: if(! e) return[2, - 1];
          n = "boolean" != typeof t|| t;
          a = null;
          o.label = 1;
          case 1: o.trys.push([1, 5, , 6]);
          return e instanceof cc.AudioClip?(a = e, n = "boolean" == typeof t? t: n, [3, 4]):[3, 2];
          case 2: r = "string" == typeof t? t: this.option.bundleName;
          return[4, s.default.getInstance().loadRes(e, cc.AudioClip, null, r)];
          case 3: a = o.sent();
          o.label = 4;
          case 4: return a?[2, cc.audioEngine.playMusic(a, n)]:(console.error("AudioMgr.playMusic: clip is null", e, t, i), [2, - 1]);
          case 5: l = o.sent();
          console.error(l);
          return[2, - 1];
          case 6: return[2];
        }
      }
);
    }
);
  }
;
  Object.defineProperty(t.prototype, "musicMute", {
    get: function() {
      return r.default.getInstance().musicMute;
    }
, set: function(e) {
      r.default.getInstance().musicMute = e;
      cc.audioEngine.setMusicVolume(e? 0: 1);
    }
, enumerable: ! 1, configurable: ! 0
  }
);
  Object.defineProperty(t.prototype, "effectMute", {
    get: function() {
      return r.default.getInstance().effectMute;
    }
, set: function(e) {
      r.default.getInstance().effectMute = e;
      cc.audioEngine.setEffectsVolume(e? 0: 1);
    }
, enumerable: ! 1, configurable: ! 0
  }
);
  t.prototype.pauseMusic = function() {
    cc.audioEngine.pauseMusic();
  }
;
  t.prototype.resumeMusic = function() {
    cc.audioEngine.resumeMusic();
  }
;
  t.prototype.stopAllEffects = function() {
    cc.audioEngine.stopAllEffects();
    this.idMap.clear();
  }
;
  t.prototype.stopEffect = function(e) {
    var t = this;
    cc.audioEngine.stopEffect(e);
    this.idMap.forEach(function(i, n) {
      var a = i.indexOf(e);
      if(!(a < 0)) {
        i.splice(a, 1);
        0 === i.length&& t.idMap.delete(n);
      }
    }
);
  }
;
  t.prototype.getTime = function(e) {
    return cc.audioEngine.getCurrentTime(e);
  }
;
  t.prototype.getDuration = function(e) {
    return cc.audioEngine.getDuration(e);
  }
;
  t.prototype.getState = function(e) {
    return cc.audioEngine.getState(e);
  }
;
  return t;
}
(l.default);
i.default = u;
cc._RF.pop();
