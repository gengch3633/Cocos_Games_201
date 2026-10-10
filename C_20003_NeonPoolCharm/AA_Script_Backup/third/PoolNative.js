let e = require;let t = module;let o = exports;
    "use strict";

    cc._RF.push(t, "e176bQlx2hIHqwZ8mgYEuGu", "PoolNative");
    Object.defineProperty(o, "__esModule", {
      value: !0
    });
    o.PoolNative = void 0;
    var n = function () {
      function e() {}
      e.setAppLifecycleChangeCallback = function (e) {
        cc.sys.os === cc.sys.OS_ANDROID && jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppLifecycleObserver", "setAppLifecycleChangeJSCallback", "(Ljava/lang/String;)V", e);
      };
      e.openURL = function (e) {
        cc.sys.os, cc.sys.OS_IOS, cc.sys.openURL(e);
      };
      e.getPackageName = function () {
        var e = "";
        cc.sys.os === cc.sys.OS_ANDROID && (e = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "getAPPPackageName", "()Ljava/lang/String;"));
        e || (e = "com.replace.industries.article");
        return e;
      };
      e.getVersion = function () {
        return cc.sys.os === cc.sys.OS_ANDROID ? jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "getAPPVersion", "()Ljava/lang/String;") : (cc.sys.os, cc.sys.OS_IOS, "1.0.0");
      };
      e.setSecureFlag = function (e) {
        cc.sys.os === cc.sys.OS_ANDROID && jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "setAPPSecureFlag", "(Z)V", e);
      };
      e.getVersionCode = function () {
        var e = this.getVersion(),
          t = parseInt(e.replace(/\./g, ""), 10);
        return isNaN(t) ? 100 : t;
      };
      Object.defineProperty(e, "isProxyEnabled", {
        get: function () {
          return cc.sys.os === cc.sys.OS_ANDROID && jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "isProxyEnabled", "()Z");
        },
        enumerable: !1,
        configurable: !0
      });
      Object.defineProperty(e, "isVPNEnabled", {
        get: function () {
          return cc.sys.os === cc.sys.OS_ANDROID && jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "isVPNEnabled", "()Z");
        },
        enumerable: !1,
        configurable: !0
      });
      e.vibrate = function (e) {
        cc.sys.os === cc.sys.OS_IOS || jsb.device.vibrate(.001 * e);
      };
      e._onGAIDGet = function (e, t) {
        this._gaid = null != e ? e : "00000000-0000-0000-0000-000000000000";
        this._isLimitTrackingEnabled = t;
        if (this._fetchGAIDCallback) {
          var o = this._fetchGAIDCallback;
          this._fetchGAIDCallback = null;
          o();
        }
      };
      Object.defineProperty(e, "gaid", {
        get: function () {
          return this._gaid;
        },
        enumerable: !1,
        configurable: !0
      });
      Object.defineProperty(e, "isLimitTrackingEnabled", {
        get: function () {
          return this._isLimitTrackingEnabled;
        },
        enumerable: !1,
        configurable: !0
      });
      e.fetchGAID = function (e) {
        cc.sys.os, cc.sys.OS_ANDROID, null == e || e();
      };
      e.getVPNOrProxyType = function () {
        return this.isProxyEnabled ? 2 : this.isVPNEnabled ? 1 : 0;
      };
      e._gaid = "00000000-0000-0000-0000-000000000000";
      e._isLimitTrackingEnabled = !0;
      e._fetchGAIDCallback = null;
      return e;
    }();
    o.PoolNative = n;
    cc.js.setClassName("PoolNative", n);
    cc._RF.pop();
