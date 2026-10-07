let e = require;
let t = module;
let i = exports;
"use strict";
cc._RF.push(t, "8f1127N7zFHSr9Fpevj+Tup", "MultiPlatform");
var n,
a = __extends,
o = __awaiter,
r = __generator;
Object.defineProperty(i, "__esModule", {
  value: ! 0
}
);
i.PlatformType = void 0;
var s = e("UserData"),
l = e("GEMgr.js"),
c = e("UserAudioData"),
u = e("ConfigMgr"),
d = e("Singleton"),
h = e("Tips"),
p = e("UIMgr"),
_ = e("Platform.js"),
f = e("UMengManger"),
g = e("LanguageService.js"),
m = e("AdManager.js"),
y = e("AdLegacyBridge.js");
(function(e) {
  e[e.ByteDance = 0] = "ByteDance";
  e[e.WeChat = 1] = "WeChat";
  e[e.Unknown = 2] = "Unknown";
}
)(n = i.PlatformType|| (i.PlatformType = {
}
));
var v = function() {
  function e() {
    this.event = null;
    this.adConfig = null;
    this._interface = null;
  }
  Object.defineProperty(e.prototype, "interface", {
    get: function() {
      return this._interface;
    }
, enumerable: ! 1, configurable: ! 0
  }
);
  Object.defineProperty(e.prototype, "byteDancePlatform", {
    get: function() {
      return this._interface;
    }
, enumerable: ! 1, configurable: ! 0
  }
);
  Object.defineProperty(e.prototype, "weChatPlatform", {
    get: function() {
      return this._interface;
    }
, enumerable: ! 1, configurable: ! 0
  }
);
  e.prototype.init = function(e, t) {
    this.adConfig = e;
    this.event = t;
    this._interface = null;
  }
;
  Object.defineProperty(e.prototype, "platformType", {
    get: function() {
      return cc.sys.platform == cc.sys.BYTEDANCE_GAME? n.ByteDance: cc.sys.platform == cc.sys.WECHAT_GAME|| cc.sys.platform == cc.sys.WECHAT_GAME_SUB? n.WeChat: n.Unknown;
    }
, enumerable: ! 1, configurable: ! 0
  }
);
  return e;
}
(),
b = function(e) {
  function t() {
    var t = null !== e&& e.apply(this, arguments)|| this;
    t.adConfig = null;
    t._multiPlatformInterface = null;
    t._userData = null;
    t.event = new cc.EventTarget();
    t.skipShare = ! 1;
    t.videoIndex = 1;
    return t;
  }
  a(t, e);
  Object.defineProperty(t.prototype, "multiPlatformInterface", {
    get: function() {
      return this._multiPlatformInterface;
    }
, enumerable: ! 1, configurable: ! 0
  }
);
  Object.defineProperty(t.prototype, "platformType", {
    get: function() {
      return this.multiPlatformInterface.platformType;
    }
, enumerable: ! 1, configurable: ! 0
  }
);
  Object.defineProperty(t.prototype, "appId", {
    get: function() {
      var e, t, i;
      return null !== (i = null === (t = null === (e = this._multiPlatformInterface)|| void 0 === e? void 0: e.interface)|| void 0 === t? void 0: t.appId)&& void 0 !== i? i: "";
    }
, enumerable: ! 1, configurable: ! 0
  }
);
  Object.defineProperty(t.prototype, "userData", {
    get: function() {
      return this._userData;
    }
, enumerable: ! 1, configurable: ! 0
  }
);
  Object.defineProperty(t.prototype, "userId", {
    get: function() {
      var e, t;
      return null !== (t = null === (e = this._userData)|| void 0 === e? void 0: e.id)&& void 0 !== t? t: 0;
    }
, enumerable: ! 1, configurable: ! 0
  }
);
  Object.defineProperty(t.prototype, "openId", {
    get: function() {
      var e, t;
      return null !== (t = null === (e = this._userData)|| void 0 === e? void 0: e.openId)&& void 0 !== t? t: null;
    }
, enumerable: ! 1, configurable: ! 0
  }
);
  Object.defineProperty(t.prototype, "vibrateEnabled", {
    get: function() {
      return c.default.getInstance().vibrate;
    }
, enumerable: ! 1, configurable: ! 0
  }
);
  t.prototype.init = function(e) {
    e = Object.assign({
    }
, e);
    this.adConfig = e;
    this._multiPlatformInterface = new v();
    this._multiPlatformInterface.init(e, this.event);
    this.event.emit(t.EventType.INIT_COMPLETE);
  }
;
  t.prototype.showRewardedVideoAd = function(e, i) {
    return o(this, void 0, Promise, function() {
      var n;
      return r(this, function(a) {
        switch(a.label) {
          case 0: return[4, u.default.getInstance().checkMac()];
          case 1: return a.sent()?[2, ! 0]:[2, new Promise(function(a) {
            var o, r, c = n.adConfig.rewardVideo;
            if(! c|| c.length <= 0) a(! 0);
            else {
              p.default.getInstance().showWatingUI();
              n.event.emit(t.EventType.REWARED_VIDEO_SHOW, e, i);
              n.reportVideo(e, 0);
              var u = c[n.videoIndex% c.length];
              n.videoIndex++;
              null === (r = null === (o = n._multiPlatformInterface)|| void 0 === o? void 0: o.interface)|| void 0 === r|| r.play(u, function(o) {
                for(var r = [], c = 1;
                c < arguments.length;
                c++) r[c- 1] = arguments[c];
                p.default.getInstance().hideWatingUI();
                n.event.emit(t.EventType.REWARED_VIDEO_HIDE, e, i, o);
                o != _.RewardVideoState.PlaySuccess&& o != _.RewardVideoState.CloseReward|| n.reportVideo(e, o == _.RewardVideoState.PlaySuccess? 1: 2);
                if(o == _.RewardVideoState.CloseReward|| o == _.RewardVideoState.Close|| o == _.RewardVideoState.PlayErr) {
                  cc.audioEngine.resumeMusic();
                  cc.audioEngine.resumeAllEffects();
                  cc.game.resume();
                  ZYSDK.ZYSDK.reportVideo(o == _.RewardVideoState.CloseReward);
                  a(o == _.RewardVideoState.CloseReward);
                  l.default.trackEvent("adNode", {
                    adtype: e, adlevel: s.default.getInstance().level
                  }
);
                  cc.sys.isBrowser|| l.default.ge.track("userAction", {
                    action: "AD_"+ e, module: "关卡"+ s.default.getInstance().level, isAD: 1
                  }
, new Date());
                  n.zyReportUserAction("关卡"+ s.default.getInstance().level, e, ! 0);
                  o == _.RewardVideoState.PlayErr&& h.default.show(g.t("key_tip_reward_video_play_fail"));
                } else o == _.RewardVideoState.PlaySuccess&& (cc.audioEngine.pauseMusic(), cc.audioEngine.pauseAllEffects(), cc.game.pause());
              }
);
            }
          }
)];
          case 2: n = this;
          return[2, new Promise(function(a) {
            var o, r, c = n.adConfig.rewardVideo;
            if(! c|| c.length <= 0) a(! 0);
            else {
              p.default.getInstance().showWatingUI();
              n.event.emit(t.EventType.REWARED_VIDEO_SHOW, e, i);
              n.reportVideo(e, 0);
              var u = c[n.videoIndex% c.length];
              n.videoIndex++;
              null === (r = null === (o = n._multiPlatformInterface)|| void 0 === o? void 0: o.interface)|| void 0 === r|| r.play(u, function(o) {
                for(var r = [], c = 1;
                c < arguments.length;
                c++) r[c- 1] = arguments[c];
                p.default.getInstance().hideWatingUI();
                n.event.emit(t.EventType.REWARED_VIDEO_HIDE, e, i, o);
                o != _.RewardVideoState.PlaySuccess&& o != _.RewardVideoState.CloseReward|| n.reportVideo(e, o == _.RewardVideoState.PlaySuccess? 1: 2);
                if(o == _.RewardVideoState.CloseReward|| o == _.RewardVideoState.Close|| o == _.RewardVideoState.PlayErr) {
                  cc.audioEngine.resumeMusic();
                  cc.audioEngine.resumeAllEffects();
                  cc.game.resume();
                  a(o == _.RewardVideoState.CloseReward);
                  l.default.trackEvent("adNode", {
                    adtype: e, adlevel: s.default.getInstance().level
                  }
);
                  cc.sys.isBrowser|| l.default.ge.track("userAction", {
                    action: "AD_"+ e, module: "关卡"+ s.default.getInstance().level, isAD: 1
                  }
, new Date());
                  o == _.RewardVideoState.PlayErr&& h.default.show("激励视频播放失败,请重试");
                } else o == _.RewardVideoState.PlaySuccess&& (cc.audioEngine.pauseMusic(), cc.audioEngine.pauseAllEffects(), cc.game.pause());
              }
);
            }
          }
)];
        }
      }
);
    }
);
  }
;
  t.prototype.showRewardedVideoAdByAdManager = function(e, i) {
    var n = this;
    return new Promise(function(a) {
      var o = m&& m.default&& m.default.getInstance? m.default.getInstance(): null, r = null, c = null;
      if(o&& "function" == typeof o.playNormalVideoAd) {
        var u = new Date().getTime()/ 1e3, d = Number(o.interval|| 1.5);
        if(o.lastTouchDate&& u- o.lastTouchDate < d) {
          h.default.show("广告点击太频繁");
          a(! 1);
        } else {
          var f = ! 1, g = function() {
            if(r&& c) {
              r.ignore(r.events.VIDEO_OPEN_SUCCESS, c, n);
              c = null;
            }
          }
, v = function(o, r, c) {
            var u = o == _.RewardVideoState.PlaySuccess;
            if(! f|| u) {
              if(! u) {
                f = ! 0;
                g();
                p.default.getInstance().hideWatingUI();
              }
              n.event.emit(t.EventType.REWARED_VIDEO_HIDE, e, i, o, c);
              o != _.RewardVideoState.PlaySuccess&& o != _.RewardVideoState.CloseReward|| n.reportVideo(e, o == _.RewardVideoState.PlaySuccess? 1: 2);
              if(u) {
                cc.audioEngine.pauseMusic();
                cc.audioEngine.pauseAllEffects();
                cc.game.pause();
              } else {
                cc.audioEngine.resumeMusic();
                cc.audioEngine.resumeAllEffects();
                cc.game.resume();
                a(! ! r);
                l.default.trackEvent("adNode", {
                  adtype: e, adlevel: s.default.getInstance().level
                }
);
                cc.sys.isBrowser|| l.default.ge.track("userAction", {
                  action: "AD_"+ e, module: "关卡"+ s.default.getInstance().level, isAD: 1
                }
, new Date());
                o == _.RewardVideoState.PlayErr&& h.default.show("激励视频播放失败,请重试");
              }
            }
          }
;
          p.default.getInstance().showWatingUI();
          n.event.emit(t.EventType.REWARED_VIDEO_SHOW, e, i);
          n.reportVideo(e, 0);
          if((r = y&& y.default? y.default: null)&& r.events&& "function" == typeof r.listen) {
            c = function(e) {
              v(_.RewardVideoState.PlaySuccess, ! 1, e);
            }
;
            r.listen(r.events.VIDEO_OPEN_SUCCESS, c, n);
          }
          try {
            o.playNormalVideoAd({
              ad_type: e|| "reward_video", force_video: ! 1
            }
, function(e) {
              var t = !(! e|| ! e.compensationQualifyMark);
              v(t? _.RewardVideoState.CloseReward: _.RewardVideoState.Close, t, e);
            }
, function(e) {
              v(_.RewardVideoState.PlayErr, ! 1, e);
            }
, "激励视频播放失败,请重试");
          } catch(e) {
            console.error("[MultiPlatform] playNormalVideoAd failed", e);
            v(_.RewardVideoState.PlayErr, ! 1, e);
          }
        }
      } else {
        console.warn("[MultiPlatform] AdManager unavailable, fallback reward success");
        a(! 0);
      }
    }
);
  }
;
  t.prototype.reportVideo = function(e, t) {
    var i,
    a,
    o = {
      scene: e,
      state: t
    }
;
    console.log("video", o);
    f.default.getInstance().trackEvent("video", o);
    this.platformType == n.ByteDance&& (null === (a = null === (i = this.multiPlatformInterface)|| void 0 === i? void 0: i.byteDancePlatform)|| void 0 === a|| a.reportAnalytics("video", o));
  }
;
  t.prototype.reportFightStart = function(e) {
    var t,
    i,
    a = {
      level: e
    }
;
    console.log("fightStart", a);
    f.default.getInstance().trackEvent("fightStart", a);
    this.platformType == n.ByteDance&& (null === (i = null === (t = this.multiPlatformInterface)|| void 0 === t? void 0: t.byteDancePlatform)|| void 0 === i|| i.reportAnalytics("fightStart", a));
  }
;
  t.prototype.reportFightEnd = function(e, t) {
    var i,
    a,
    o = {
      level: e,
      iswin: t
    }
;
    console.log("fightEnd", o);
    f.default.getInstance().trackEvent("fightEnd", o);
    this.platformType == n.ByteDance&& (null === (a = null === (i = this.multiPlatformInterface)|| void 0 === i? void 0: i.byteDancePlatform)|| void 0 === a|| a.reportAnalytics("fightEnd", o));
  }
;
  t.prototype.reportTask = function(e) {
    var t,
    i,
    a = {
      taskID: e
    }
;
    console.log("task", a);
    f.default.getInstance().trackEvent("task", a);
    this.platformType == n.ByteDance&& (null === (i = null === (t = this.multiPlatformInterface)|| void 0 === t? void 0: t.byteDancePlatform)|| void 0 === i|| i.reportAnalytics("task", a));
  }
;
  t.prototype.share = function(e) {
    var t,
    i,
    a;
    return o(this, void 0, Promise, function() {
      return r(this, function() {
        return(null === (t = this._multiPlatformInterface)|| void 0 === t? void 0: t.interface)? this.skipShare?[2, ! 0]:(e|| (e = {
        }
), this.platformType == n.ByteDance&& (this.adConfig.templateId|| console.error("未配置抖音平台分享模板"), e.templateId = this.adConfig.templateId), [2, null === (a = null === (i = this._multiPlatformInterface)|| void 0 === i? void 0: i.interface)|| void 0 === a? void 0: a.share(e)]):[2, ! 0];
      }
);
    }
);
  }
;
  t.prototype.vibrateLong = function() {
    var e,
    t;
    this.vibrateEnabled&& (null === (t = null === (e = this._multiPlatformInterface)|| void 0 === e? void 0: e.interface)|| void 0 === t|| t.vibrateLong());
  }
;
  t.prototype.vibrateShort = function() {
    var e,
    t;
    this.vibrateEnabled&& (null === (t = null === (e = this._multiPlatformInterface)|| void 0 === e? void 0: e.interface)|| void 0 === t|| t.vibrateShort());
  }
;
  t.prototype.setClipboardData = function(e) {
    var t,
    i;
    return null === (i = null === (t = this._multiPlatformInterface)|| void 0 === t? void 0: t.interface)|| void 0 === i? void 0: i.setClipboardData(e);
  }
;
  t.prototype.getClipboardData = function() {
    var e,
    t;
    return null === (t = null === (e = this._multiPlatformInterface)|| void 0 === e? void 0: e.interface)|| void 0 === t? void 0: t.getClipboardData();
  }
;
  t.prototype.login = function() {
    var e = this;
    return new Promise(function(i) {
      var n, a, o;
      e.event.emit(t.EventType.BEFORE_LOGIN);
      if(null === (n = e._multiPlatformInterface)|| void 0 === n? void 0: n.interface) null === (o = null === (a = e._multiPlatformInterface)|| void 0 === a? void 0: a.interface)|| void 0 === o|| o.login().then(function(n) {
        if(n) {
          e._userData = n;
          i(! 0);
          e.event.emit(t.EventType.LOGIN, n);
        } else {
          i(! 1);
          e.event.emit(t.EventType.LOGIN, null);
        }
      }
);
      else {
        i(! 1);
        e.event.emit(t.EventType.LOGIN, null);
      }
    }
);
  }
;
  t.prototype.quit = function() {
    var e,
    t;
    null === (t = null === (e = this._multiPlatformInterface)|| void 0 === e? void 0: e.interface)|| void 0 === t|| t.quit();
  }
;
  Object.defineProperty(t.prototype, "uma", {
    get: function() {
      var e, t, i;
      return null !== (i = null === (t = null === (e = this._multiPlatformInterface)|| void 0 === e? void 0: e.interface)|| void 0 === t? void 0: t.uma)&& void 0 !== i? i: null;
    }
, enumerable: ! 1, configurable: ! 0
  }
);
  t.prototype.getStyleByNode = function(e) {
    var t = e.convertToWorldSpaceAR(cc.v2(0, 0));
    console.log(t);
    var i = cc.view.getDevicePixelRatio(),
    n = cc.view.getScaleX(),
    a = cc.view.getScaleY(),
    o = cc.view.getVisibleSize().height,
    r = (t.x- e.height/ 2)* n/ i,
    s = (o- t.y)* a/ i- e.height,
    l = e.width,
    c = e.height;
    console.log("style", r, s, l, c);
    return {
      left: r,
      top: s,
      width: l,
      height: c
    }
;
  }
;
  t.prototype.showInterstitialAd = function() {
    var e,
    t,
    i;
    return o(this, void 0, void 0, function() {
      return r(this, function(n) {
        switch(n.label) {
          case 0: console.log("showInterstitialAd");
          console.log(this.adConfig.inters);
          return(null === (e = this._multiPlatformInterface)|| void 0 === e? void 0: e.interface)?[4, null === (i = null === (t = this._multiPlatformInterface)|| void 0 === t? void 0: t.interface)|| void 0 === i? void 0: i.showInterstitialAd(this.adConfig.inters)]:[2, ! 1];
          case 1: return n.sent()?(l.default.trackEvent("adNode", {
            adtype: "插屏广告", adlevel: s.default.getInstance().level
          }
), cc.sys.isBrowser|| l.default.ge.track("userAction", {
            action: "AD_插屏广告", module: "关卡"+ s.default.getInstance().level, isAD: 1
          }
, new Date()), [2]):[2, ! 1];
        }
      }
);
    }
);
  }
;
  t.prototype.showCustomAd = function(e) {
    var t,
    i,
    n;
(null === (t = this._multiPlatformInterface)|| void 0 === t? void 0: t.interface)&& (null === (n = null === (i = this._multiPlatformInterface)|| void 0 === i? void 0: i.interface)|| void 0 === n|| n.showCustomAd(this.adConfig.custom, e));
  }
;
  t.prototype.hideCustomAd = function() {
    var e,
    t,
    i;
(null === (e = this._multiPlatformInterface)|| void 0 === e? void 0: e.interface)&& (null === (i = null === (t = this._multiPlatformInterface)|| void 0 === t? void 0: t.interface)|| void 0 === i|| i.hideCustomAd());
  }
;
  t.prototype.on = function(e, t, i) {
    this.event.on(e, t, i);
  }
;
  t.prototype.once = function(e, t, i) {
    this.event.once(e, t, i);
  }
;
  t.prototype.off = function(e, t, i) {
    this.event.off(e, t, i);
  }
;
  t.prototype.targetOff = function(e) {
    this.event.targetOff(e);
  }
;
  t.EventType = {
    REWARED_VIDEO_SHOW: "MultiPlatform_Event_Before_Show",
    REWARED_VIDEO_HIDE: "MultiPlatform_Event_Hide",
    BEFORE_LOGIN: "MultiPlatform_Event_BEFORE_LOGIN",
    LOGIN: "MultiPlatform_Event_LOGIN",
    INIT_COMPLETE: "MultiPlatform_Event_INIT_COMPLETE",
    OnShow: "MultiPlatform_Event_OnShow",
    OnHide: "MultiPlatform_Event_OnHide"
  }
;
  return t;
}
(d.default);
i.default = b;
cc._RF.pop();
