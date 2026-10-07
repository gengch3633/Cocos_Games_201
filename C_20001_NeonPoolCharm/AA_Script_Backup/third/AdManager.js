let e = require;
let t = module;
let o = exports;
"use strict";
cc._RF.push(t, "83436YqerpOwYygEVFW48rv", "AdManager");
Object.defineProperty(o, "__esModule", {
  value: ! 0
}
);
var n = e("AdvertEventType.js"),
i = e("CallAndroid.js"),
a = e("CalliOS.js"),
r = e("AudioManager.js"),
l = e("EventMgr.js"),
s = e("SdkHelper.js"),
c = e("EngineUtil.js"),
u = e("TimeUtils.js"),
p = function() {
  function e() {
    this.videoSuccessFun = null;
    this.videoFailFun = null;
    this.splash_timer = null;
    this.splash_finished = ! 1;
    this.video_timer = null;
    this.pre_video_time = 0;
    this.cpm_data = null;
    this.adCloseEvent = ! 1;
    this.adSwitch = ! 0;
    this.lastTouchDate = 0;
    this.interval = 1.5;
    this.addEvent();
  }
  e.getInstance = function() {
    this._instance|| (this._instance = new e());
    return this._instance;
  }
;
  e.prototype.addEvent = function() {
    l.default.listen(n.default.SPLASH_SHOW, this.clearSplashTimer, this);
    l.default.listen(n.default.SPLASH_FINISH, this.splashFinish, this);
    l.default.listen(n.default.VIDEO_CLOSE, this.onVideoClose, this);
    l.default.listen(n.default.ONGETADINFO, this.onGetAdInfo, this);
    l.default.listen(n.default.VIDEO_OPEN_SUCCESS, this.onVideoOpensuccess, this);
  }
;
  e.prototype.closeHomeAd = function() {
  }
;
  e.prototype.onVideoError = function(e) {
    s.default.reportData("on_vide_error", {
      type: e.type
    }
);
    this.doVideoFail(e);
  }
;
  e.prototype.playForceVideoAd = function(e, t, o, n) {
    void 0 === o&& (o = "");
    void 0 === n&& (n = "看完广告可获大额奖励");
    var l = new Date().getTime()/ 1e3;
    l < this.lastTouchDate&& (this.lastTouchDate = l);
    if(this.lastTouchDate&& l- this.lastTouchDate < this.interval) console.log("强弹广告点击太频繁");
    else {
      this.lastTouchDate = l;
      n&& (cc.sys.isNative? s.default.showForceToast(n): c.default.showManageViewToast(n));
      if(cc.sys.isNative&& this.adSwitch) {
        o&& r.default.getInstance().playMusic(o);
        this.startVideoTimer();
        e&& (this.videoSuccessFun = e);
        t&& (this.videoFailFun = t);
        var p = {
          slotId: 0,
          is_force: ! 0
        }
;
        if(cc.sys.os == cc.sys.OS_ANDROID) i.default.getInstance().showRewardVideoAd(JSON.stringify(p));
        else if(cc.sys.os == cc.sys.OS_IOS) {
          p.slotId = 0;
          a.default.getInstance().showRewardVideoAd(p);
        }
      } else {
        c.default.localStorageSetItem("last_vd_time", String(u.default.getTimeinSeconds()));
        e();
      }
    }
  }
;
  e.prototype.showBannerAd = function(e) {
    var t = cc.view.getFrameSize(),
    o = cc.winSize,
    n = t.height > 2e3? 1.03: 1,
    a = .9135802469135802* t.width* n,
    r = .25925925925925924* t.width* n,
    l = t.width/ o.width,
    s = (t.width, (o.height- e)* l- r),
    c = e* l;
    i.default.getInstance().showBannerAd(0, s, 0, c, a, r);
  }
;
  e.prototype.doVideoFail = function(e) {
    var t = this;
    this.stopVideoTimer();
    this.videoFailFun&& setTimeout(function() {
      t.videoFailFun&& t.videoFailFun(e);
      t.videoFailFun = null;
    }
, 300);
  }
;
  e.prototype.preLoadGraphicAd = function() {
  }
;
  e.prototype.stopVideoTimer = function() {
    this.video_timer&& clearTimeout(this.video_timer);
  }
;
  e.prototype.startVideoTimer = function() {
    var e = this;
    this.video_timer&& clearTimeout(this.video_timer);
    this.video_timer = setTimeout(function() {
      e.doVideoFail("广告超时5s");
    }
, 5e3);
  }
;
  e.prototype.showSplashAd = function(e) {
    var t = this;
    if(cc.sys.isNative) {
      console.log("js showSplashAd");
      this.splash_timer&& clearTimeout(this.splash_timer);
      this.splash_timer = setTimeout(function() {
        if(! t.splash_finished) {
          l.default.trigger(n.default.SPLASH_FINISH);
          console.log("js showSplashAd finish");
        }
      }
, 5e3);
      cc.sys.os == cc.sys.OS_ANDROID? i.default.getInstance().showSplashAd(e): cc.sys.os == cc.sys.OS_IOS&& a.default.getInstance().showSplashAd({
        bottom: e
      }
);
      this.adCloseEvent = ! 0;
    } else l.default.trigger(n.default.SPLASH_FINISH);
  }
;
  e.prototype.updateVideoTime = function() {
    this.pre_video_time = c.default.getTimeStamp();
  }
;
  e.prototype.loadNewSplashAd = function(e, t) {
    var o = this;
    void 0 === e&& (e = 1);
    void 0 === t&& (t = 0);
    console.log("js loadNewSplashAd: ");
    if(cc.sys.isNative) {
      this.splash_timer&& clearTimeout(this.splash_timer);
      this.splash_timer = setTimeout(function() {
        o.splash_finished|| l.default.trigger(n.default.SPLASH_FINISH);
      }
, 5e3);
      if(cc.sys.os == cc.sys.OS_ANDROID) i.default.getInstance().loadNewSplashAd(e, t);
      else if(cc.sys.os == cc.sys.OS_IOS) {
        l.default.trigger(n.default.SPLASH_FINISH);
        return;
      }
      this.adCloseEvent = ! 0;
    } else l.default.trigger(n.default.SPLASH_FINISH);
  }
;
  e.prototype.checkAdDelay = function() {
    var e = ! 1,
    t = Number(c.default.localStorageGetItem("last_vd_time", 0)),
    o = u.default.getTimeinSeconds()- t;
    if(o < 5) {
      var n = i18n.t("ad_toast_6", {
        0: 5- o
      }
);
      cc.sys.isNative? s.default.showToast(n): c.default.showManageViewToast(n);
      e = ! 0;
    }
    return e;
  }
;
  e.prototype.checkSpecialResume = function(e) {
    if(! this.adCloseEvent) return ! 1;
    e&& (this.adCloseEvent = ! 1);
    console.log("TEST NEW: CLOSE EVENT reset!!!");
    return ! 0;
  }
;
  e.prototype.showGraphicAd = function(e) {
    var t = cc.view.getFrameSize(),
    o = cc.winSize;
    console.log("frameSize", t.width, t.height);
    console.log("winSize", o.width, o.height);
    t.height,
    t.width;
    var n = t.width- 40,
    a = t.width/ o.width,
    r = (t.width, (o.height- e)* a);
    i.default.getInstance().showImgAd(0, r, 0, 0, n, 0);
  }
;
  e.prototype.clearSplashTimer = function() {
    this.splash_timer&& clearTimeout(this.splash_timer);
  }
;
  e.prototype.preLoadBannerAd = function() {
  }
;
  e.prototype.onGetAdInfo = function(e) {
    var t = c.default.formatDate(new Date().getTime());
    e.activity_date = t;
    e.activity_num = s.default.getActivityNumByDate(t);
    this.cpm_data = e;
  }
;
  e.prototype.preLoadHomeAd = function() {
  }
;
  e.prototype.playNormalVideoAd = function(e, t, o, n) {
    void 0 === o&& (o = "");
    void 0 === n&& (n = "看完广告可获大额奖励");
    var l = new Date().getTime()/ 1e3;
    l < this.lastTouchDate&& (this.lastTouchDate = l);
    if(this.lastTouchDate&& l- this.lastTouchDate < this.interval) {
      console.log("广告点击太频繁");
      t&& t();
    } else {
      o&& r.default.getInstance().playMusic(o);
      n&& (cc.sys.isNative? s.default.showForceToast(n): c.default.showManageViewToast(n));
      this.lastTouchDate = l;
      if(cc.sys.isNative&& this.adSwitch) {
        this.startVideoTimer();
        e&& (this.videoSuccessFun = e);
        t&& (this.videoFailFun = t);
        var p = {
          slotId: 0,
          is_force: ! 1
        }
;
        if(cc.sys.os == cc.sys.OS_ANDROID) {
          s.default.reportData("play_normal_ad");
          i.default.getInstance().showRewardVideoAd(JSON.stringify(p));
        } else if(cc.sys.os == cc.sys.OS_IOS) {
          p.slotId = 0;
          a.default.getInstance().showRewardVideoAd(p);
        }
      } else {
        c.default.localStorageSetItem("last_vd_time", String(u.default.getTimeinSeconds()));
        e();
      }
    }
  }
;
  e.prototype.onVideoClose = function(e) {
    var t = this;
    this.updateVideoTime();
    if(e.isReward) {
      this.stopVideoTimer();
      setTimeout(function() {
        if(t.videoSuccessFun) {
          t.videoSuccessFun(e);
          t.videoSuccessFun = null;
        }
        c.default.localStorageSetItem("last_vd_time", String(u.default.getTimeinSeconds()));
      }
, 300);
    } else {
      c.default.showManageViewToast("完整观看视频才能获得奖励");
      this.doVideoFail(e);
    }
    this.adCloseEvent = ! 0;
  }
;
  e.prototype.showHomeAd = function() {
  }
;
  e.prototype.splashFinish = function() {
    this.splash_finished = ! 0;
    l.default.trigger(n.default.ON_SPLASH_FINISH);
  }
;
  e.prototype.clear = function() {
    l.default.ignore(n.default.SPLASH_SHOW, this.clearSplashTimer, this);
    l.default.ignore(n.default.SPLASH_FINISH, this.clearSplashTimer, this);
  }
;
  e.prototype.getPreVideoTime = function() {
    return c.default.getTimeStamp()- this.pre_video_time;
  }
;
  e.prototype.closeSplashAd = function() {
    cc.sys.isNative&& cc.sys.os == cc.sys.OS_ANDROID&& i.default.getInstance().closeSplashAd();
  }
;
  e.prototype.onVideoOpensuccess = function() {
    this.stopVideoTimer();
  }
;
  e._instance = null;
  return e;
}
();
o.default = p;
cc._RF.pop();
