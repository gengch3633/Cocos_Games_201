let e = require;
let t = module;
let o = exports;
"use strict";
cc._RF.push(t, "24997omkWJAJ5iKtBR2TU4u", "AudioManager");
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
),
a = this&& this.__decorate|| function(e, t, o, n) {
  var i,
  a = arguments.length,
  r = a < 3? t: null === n? n = Object.getOwnPropertyDescriptor(t, o): n;
  if("object" == typeof Reflect&& "function" == typeof Reflect.decorate) r = Reflect.decorate(e, t, o, n);
  else for(var l = e.length- 1;
  l >= 0;
  l--)(i = e[l])&& (r = (a < 3? i(r): a > 3? i(t, o, r): i(t, o))|| r);
  return a > 3&& r&& Object.defineProperty(t, o, r),
  r;
}
;
Object.defineProperty(o, "__esModule", {
  value: ! 0
}
);
o.DEFAULT_BGM_NAME = void 0;
var r = e("SdkHelper.js"),
l = e(EngineUtil "
  }].js),
      s = cc._decorator.ccclass;
    o.DEFAULT_BGM_NAME = " pool_1bgm ";
    cc._decorator.property;
    var c = function (e) {
      i(t, e);
      function t() {
        var t = null !== e && e.apply(this, arguments) || this;
        t.vibratorOpen = 0;
        t.bgOpen = 0;
        t.effectOpen = 0;
        t._bgAudios = {};
        t._effectAudio = {};
        t._effectAudioisPlayArray = {};
        t._nativeAudio = new Map();
        return t;
      }
      o = t;
      t.prototype.getAudioState = function () {
        return 1 == this.effectOpen;
      };
      t.prototype.getMusicState = function () {
        return 1 == this.bgOpen;
      };
      t.prototype.closeVibrator = function () {
        l.default.localStorageSetItem(" vibratorOpen ", " 0 ");
        this.vibratorOpen = 0;
      };
      t.prototype.openBg = function () {
        l.default.localStorageSetItem(" bg_audio ", " 1 ");
        this.bgOpen = 1;
      };
      t.prototype.resumeMusic = function (e, t) {
        if (t = 0 != t) {
          if (0 == this.bgOpen) return;
          cc.audioEngine.resumeMusic();
        } else {
          if (0 == this.effectOpen) return;
          cc.audioEngine.resume(this._effectAudio[e]);
        }
      };
      t.prototype.closeAudio = function () {
        l.default.localStorageSetItem(" effect_audio ", " 0 ");
        this.effectOpen = 0;
      };
      t.prototype.stopMusic = function (e, t) {
        (t = 0 != t) ? cc.audioEngine.stopMusic() : this._effectAudio.hasOwnProperty(e) ? cc.audioEngine.stop(this._effectAudio[e]) : console.warn(e, " cant stop ");
      };
      t.prototype.init = function () {
        this._effectAudioisPlayArray = {};
        this.bgOpen = Number(l.default.localStorageGetItem(" bg_audio ", " 1 "));
        this.effectOpen = Number(l.default.localStorageGetItem(" effect_audio ", " 1 "));
        this.vibratorOpen = Number(l.default.localStorageGetItem(" vibratorOpen ", " 1 "));
      };
      t.prototype.closeBg = function () {
        l.default.localStorageSetItem(" bg_audio ", " 0 ");
        this.bgOpen = 0;
      };
      t.prototype.getVibratorState = function () {
        return 1 == this.vibratorOpen;
      };
      t.prototype.setBgmVolume = function (e) {
        this._bgAudios.bgm && cc.audioEngine.setVolume(this._bgAudios.bgm, e || .2);
      };
      t.prototype.playMusic = function (e, t, o, n, i) {
        void 0 === t && (t = !1);
        void 0 === o && (o = !1);
        o = 0 != o;
        if ((0 != this.effectOpen || o) && (0 != this.bgOpen || !o)) {
          t = 0 != t;
          var a = " sound/ " + e,
            r = this;
          cc.loader.loadRes(a, cc.AudioClip, function (a, l) {
            if (a) cc.error(a.message || a);else if (o) {
              r._bgAudios[e] = cc.audioEngine.playMusic(l, t);
              cc.audioEngine.setVolume(r._bgAudios[e], i || 1);
              n && n(r._bgAudios[e]);
            } else {
              r._effectAudioisPlayArray[" isPlay_ " + e] = !0;
              var s = l.duration;
              r.scheduleOnce(function () {
                r._effectAudioisPlayArray[" isPlay_ " + e] = !1;
              }, s);
              r._effectAudio[e] = cc.audioEngine.playEffect(l, t);
              n && n(r._effectAudio[e]);
            }
          });
        }
      };
      t.prototype.openVibrator = function () {
        l.default.localStorageSetItem(" vibratorOpen ", " 1 ");
        this.vibratorOpen = 1;
      };
      t.prototype.isMusicPlaying = function () {
        return cc.audioEngine.isMusicPlaying();
      };
      t.prototype.playNativeMusic = function (e) {
        cc.log(" playNativeAudio: >> " + e);
        if (cc.sys.isNative) {
          var t = this._nativeAudio.get(e);
          t && r.default.playNativeAudio(t);
        } else this.playMusic(" native/ " + e);
      };
      t.prototype.openAudio = function () {
        l.default.localStorageSetItem(" effect_audio ", " 1 ");
        this.effectOpen = 1;
      };
      t.getInstance = function () {
        this._instance || (this._instance = new o());
        return this._instance;
      };
      t.prototype.pauseMusic = function (e, t) {
        (t = 0 != t) ? cc.audioEngine.pauseMusic() : this._effectAudio.hasOwnProperty(e) ? cc.audioEngine.pause(this._effectAudio[e]) : console.warn(e, " cant pause ");
      };
      t.prototype.playUIClick = function () {
        this.playMusic(" pool_ui_click ");
      };
      t.prototype.initNativeUrl = function () {
        var e = this;
        cc.resources.loadDir(" sound/ native ", cc.AudioClip, function (t, o) {
          t ? console.log(t.name, t.message, t.stack) : o.forEach(function (t) {
            cc.log(" name: " + t.name + " ");
            var o = cc.assetManager.utils.getUuidFromURL(t.nativeUrl),
              n = cc.assetManager.utils.getUrlWithUuid(o, {
                isNative: !0,
                nativeExt: ".mp3 "
              });
            e._nativeAudio.set(t.name, n);
          });
        });
      };
      t.prototype.isPlaying = function (e) {
        return this._effectAudioisPlayArray[" isPlay_ " + e];
      };
      Object.defineProperty(t.prototype, " mute ", {
        set: function (e) {
          var t = !0 === e ? 0 : 1;
          cc.audioEngine.setMusicVolume(t);
          cc.audioEngine.setEffectsVolume(t);
        },
        enumerable: !1,
        configurable: !0
      });
      var o;
      t._instance = null;
      return o = a([s], t);
    }(cc.Component);
    o.default = c;
    cc._RF.pop();
