let e = require;
let t = module;
let o = exports;
"use strict";
cc._RF.push(t, "f2dc4f9RHJFbJlmFtY93YZ3", "CalliOS");
Object.defineProperty(o, "__esModule", {
  value: ! 0
}
);
var n = e("AdvertEventType.js"),
i = e("NativeEventType.js"),
a = e("AudioManager.js"),
r = e("EventMgr.js"),
l = e("AdManager.js"),
s = e(EngineUtil "
  }].js),
      c = e(" SystemConfig.js "),
      u = function () {
        function e() {}
        e.prototype.closeImgAd = function () {
          jsb.reflection.callStaticMethod(" HvillJSB ", " closeImgAd ");
        };
        e.prototype.setVibrator = function () {
          jsb.reflection.callStaticMethod(" HvillJSB ", " setVibrato ");
        };
        e.prototype.getShumengID = function () {
          return jsb.reflection.callStaticMethod(" HvillJSB ", " getShuMengID ");
        };
        e.prototype.getCookieInfo = function () {
          return jsb.reflection.callStaticMethod(" HvillJSB ", " getCookieInfo ");
        };
        e.prototype.onGetWechatCode = function (e) {
          console.log(" Oc调用Js onGetWechatCode ", e);
          r.default.trigger(i.default.GET_WECHAT_CODE, e);
        };
        e.prototype.getChannelName = function () {
          return jsb.reflection.callStaticMethod(" HvillJSB ", " getChannelName ");
        };
        e.prototype.onVideoFinish = function () {};
        e.prototype.hasNotchInScreen = function () {
          var e = jsb.reflection.callStaticMethod(" HvillJSB ", " hasNotchInScreen ");
          console.log(" hasNotchInScreen ", e);
          return e;
        };
        e.prototype.getTongDunID = function () {
          return jsb.reflection.callStaticMethod(" HvillJSB ", " getDongDunID ");
        };
        e.prototype.onVideoOpenSuccess = function (e) {
          a.default.getInstance().pauseMusic(a.DEFAULT_BGM_NAME, !0);
          console.log(" Oc调用Js onVideoOpensuccess >> ", e);
        };
        e.prototype.finishActivity = function () {
          jsb.reflection.callStaticMethod(" HvillJSB ", " finishActivity ");
        };
        e.prototype.getScreenWidth = function () {
          return jsb.reflection.callStaticMethod(" HvillJSB ", " getScreenWidth ");
        };
        e.prototype.onSplashAdSuccess = function () {
          r.default.trigger(n.default.SPLASH_SHOW);
        };
        e.prototype.cancelVibrator = function () {};
        e.prototype.onSplashAdclose = function () {
          console.log(" onSplashAdTimeOver ");
          r.default.trigger(n.default.SPLASH_FINISH);
        };
        e.prototype.wxLogin = function () {
          jsb.reflection.callStaticMethod(" HvillJSB ", " wxLogin ");
        };
        e.prototype.onAppPause = function () {
          console.log(" Oc调用Js onAppPause ");
          this.reportData(" app_pause ", null);
        };
        e.prototype.preLoadBannerAd = function (e, t, o) {
          jsb.reflection.callStaticMethod(" HvillJSB ", " preLoadBannerAd: height: ", String(t), String(o));
        };
        e.prototype.onAppResume = function () {
          console.log(" Oc调用Js onAppResume ");
          this.reportData(" app_pause ", null);
        };
        e.prototype.getScreenHeight = function () {
          return jsb.reflection.callStaticMethod(" HvillJSB ", " getScreenHeight ");
        };
        e.prototype.showBannerAd = function (e, t, o, n, i, a) {
          jsb.reflection.callStaticMethod(" HvillJSB ", " showBannerAd: width: height: ", String(n), String(i), String(a));
        };
        e.prototype.getStatusBarHeight = function () {
          var e = jsb.reflection.callStaticMethod(" HvillJSB ", " getStatusBarHeight ");
          console.log(" getStatusBarHeight ", e);
          return e;
        };
        e.prototype.showForceToast = function (e) {
          jsb.reflection.callStaticMethod(" HvillJSB ", " showForceToast: duration: ", e, " 1.5 ");
        };
        e.prototype.onVideoClose = function (e) {
          a.default.getInstance().resumeMusic(" DEFAULT_BGM_NAME ", !0);
          l.default.getInstance().onVideoClose(JSON.parse(e));
        };
        e.prototype.decrypt = function (e) {
          return jsb.reflection.callStaticMethod(" HvillJSB ", " decrypt: ", e);
        };
        e.prototype.setVibratoLight = function () {
          jsb.reflection.callStaticMethod(" HvillJSB ", " setVibratoLight ");
        };
        e.prototype.networkingReachabilityDidChange = function () {};
        e.prototype.closeBannerAd = function () {
          jsb.reflection.callStaticMethod(" HvillJSB ", " closeBannerAd ");
        };
        e.prototype.getNgister = function (e, t, o) {
          var n = jsb.reflection.callStaticMethod(" HvillJSB ", " getNgister: time: noneStr: ", e, t, o);
          console.log(" url === = ", e, " result ", n);
          return n;
        };
        e.prototype.getVersionName = function () {
          return jsb.reflection.callStaticMethod(" HvillJSB ", " getVersionName ");
        };
        e.prototype.showRewardVideoAd = function (e) {
          console.log(" callStaticMethod.showRewardVideoAd ", e);
          var t = e.is_force;
          jsb.reflection.callStaticMethod(" HvillJSB ", " showRewardVideoAd: extraInfo: ", t ? " 1 " : " 0 ", JSON.stringify(e));
        };
        e.prototype.encrypt = function (e) {
          return jsb.reflection.callStaticMethod(" HvillJSB ", " encrypt: ", e);
        };
        e.prototype.onSplashAdSkip = function () {
          console.log(" onSplashAdSkip ");
          r.default.trigger(n.default.SPLASH_FINISH);
        };
        e.prototype.getBlackBox = function () {};
        e.prototype.getClientInfo = function () {
          return jsb.reflection.callStaticMethod(" HvillJSB ", " getClientInfo ");
        };
        e.prototype.onVideoFailed = function (e) {
          a.default.getInstance().resumeMusic(a.DEFAULT_BGM_NAME, !0);
          l.default.getInstance().onVideoError(e);
        };
        e.prototype.showToast = function (e) {
          jsb.reflection.callStaticMethod(" HvillJSB ", " showToast: duration: offsetY: ", e, " 1.5 ", " 300 ");
        };
        e.prototype.onAppStop = function () {
          console.log(" Oc调用Js onAppStop ");
        };
        e.prototype.openKefu = function (e, t, o) {
          return jsb.reflection.callStaticMethod(" HvillJSB ", " openKefu: avatarImg: gender: ", e, t, o);
        };
        e.prototype.onSplashAdFailed = function () {
          console.log(" onSplashAdError ");
          r.default.trigger(n.default.SPLASH_FINISH);
        };
        e.prototype.onAttachedToWindow = function () {
          console.log(" onAttachedToWindow ");
        };
        e.prototype.showSplashAd = function (e) {
          var t = e.bottom;
          jsb.reflection.callStaticMethod(" HvillJSB ", " loadSplashAd: ", String(t));
        };
        e.prototype.onAppStart = function () {
          console.log(" Oc调用Js onAppStart ");
          this.reportData(" app_start ", null);
        };
        e.prototype.preLoadImgAd = function (e, t, o) {
          jsb.reflection.callStaticMethod(" HvillJSB ", " preLoadImgAd: height: ", String(t), String(o));
        };
        e.prototype.onGetAdInfo = function (e) {
          console.log(" 回传AdInfo " + e, JSON.stringify(e));
          var t = JSON.parse(e);
          r.default.trigger(n.default.ONGETADINFO, t);
        };
        e.getInstance = function () {
          null == this._instance && (this._instance = new e());
          return this._instance;
        };
        e.prototype.setUserInfo = function (e) {
          cc.sys.isNative && jsb.reflection.callStaticMethod(" HvillJSB ", " setUserInfo: ", e);
        };
        e.prototype.getNetworkingStatus = function () {
          var e = jsb.reflection.callStaticMethod(" HvillJSB ", " networkingStatus ");
          console.log(" 网络状态变化 " + e);
          return e;
        };
        e.prototype.reportData = function (e, t, o) {
          void 0 === o && (o = !1);
          var n = {};
          n.eventName = e;
          var i = [];
          i.push({
            paramName: " ts ",
            paramValue: s.default.getTimeStamp()
          });
          i.push({
            paramName: " game_name ",
            paramValue: c.GAME_NAME
          });
          if (t) for (var a = Object.keys(t), r = 0; r < a.length; r++) {
            var l = {};
            l.paramName = a[r];
            l.paramValue = t[a[r]];
            i.push(l);
          }
          n.param = i;
          var u = JSON.stringify(n);
          if (cc.sys.isNative) if (o) {
            jsb.reflection.callStaticMethod(" HvillJSB ", " reportCoreData: ", u);
            console.log(" android ", o + " 埋点 >>> >>> >>> > " + u);
          } else {
            jsb.reflection.callStaticMethod(" HvillJSB ", " reportData: ", u);
            console.log(" android ", o + " 埋点 >>> >>> >>> > " + u);
          }
        };
        e.prototype.onAppDestory = function () {
          console.log(" Oc调用Js onAppDestory ");
          this.reportData(" app_destory ", null);
        };
        e.prototype.showImgAd = function (e, t, o, n, i, a) {
          jsb.reflection.callStaticMethod(" HvillJSB ", " showImgAd: width: height: ", String(t), String(i), String(a));
        };
        e._instance = null;
        return e;
      }();
    o.default = u;
    window.calliOS = u.getInstance();
    cc._RF.pop();
