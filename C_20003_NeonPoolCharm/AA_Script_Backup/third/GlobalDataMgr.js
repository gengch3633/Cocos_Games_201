let e = require;let t = module;let o = exports;
    "use strict";

    cc._RF.push(t, "84b49//aZZADJVEsJzUuVpi", "GlobalDataMgr");
    var n = this && this.__decorate || function (e, t, o, n) {
      var i,
        a = arguments.length,
        r = a < 3 ? t : null === n ? n = Object.getOwnPropertyDescriptor(t, o) : n;
      if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) r = Reflect.decorate(e, t, o, n);else for (var l = e.length - 1; l >= 0; l--) (i = e[l]) && (r = (a < 3 ? i(r) : a > 3 ? i(t, o, r) : i(t, o)) || r);
      return a > 3 && r && Object.defineProperty(t, o, r), r;
    };
    Object.defineProperty(o, "__esModule", {
      value: !0
    });
    var i = e("HotUpdate.js"),
      a = e("SystemConfig.js"),
      r = e("PlayerDataSys.js"),
      l = e("ClientData.js"),
      s = e("SdkHelper.js"),
      c = e("EngineUtil.js"),
      u = cc._decorator.ccclass,
      p = function () {
        function e() {
          this.yhxyUrl = "https://raw.githubusercontent.com/haticerasit726/hacrt/live/haycop.txt";
          this.yszcUrl = "https://raw.githubusercontent.com/haticerasit726/hacrt/live/haycop.txt";
          this.reviewing = !1;
          this.new_user = 1;
          this.pauseTime = 0;
          this.is_encrypt = 0;
          this.game_time = 0;
          this.curLanguage = "";
          this.isInitAppFlyer = !1;
          this.gameVideoCount = 0;
          this.activate_cpm = .8;
          this.iconSubInfo = null;
        }
        t = e;
        e.prototype.setCurrentLang = function (e) {
          this.curLanguage = e;
          i.default.getInstance().isOnlineRelease();
        };
        e.prototype.initAppFlyer = function () {
          if (!this.isInitAppFlyer) {
            if (r.default.getFirstVideoCpm() && Number(r.default.getFirstVideoCpm()) >= Number(this.activate_cpm)) {
              console.log("cocos初始化AppFlyer");
              s.default.initAppFlyer();
            }
            this.isInitAppFlyer = !0;
          }
        };
        e.prototype.getCustomAppVersion = function () {
          var e = l.default.app_version_name;
          console.log("customAppVersion====", e);
          return e;
        };
        e.prototype.isSpecialFont = function () {
          if (a.UseSpecialFont[String(this.curLanguage)]) return !0;
        };
        e.prototype.init = function (e) {
          var t = e.new_user,
            o = e.activate,
            n = e.is_encrypt,
            i = e.activate_cpm;
          this.activate_cpm = i;
          this.new_user = t || 0;
          this.is_encrypt = n;
          if (o) {
            s.default.reportData("activate", null, !0);
            console.log("激活");
          }
          this.resetGameTime();
        };
        e.prototype.resetGameTime = function () {
          this.game_time = c.default.getTimeStamp();
        };
        e.prototype.setYszc = function (e) {
          this.yszcUrl = e;
        };
        e.prototype.i18nEdition = function () {
          if (this.curLanguage && this.curLanguage != a.Default_Language && a.languages[String(this.curLanguage)]) return !0;
        };
        e._getInstance = function () {
          this._instance || (t._instance = new t());
          return t._instance;
        };
        e.prototype.isUsingForeignResources = function () {
          var e = this.curLanguage;
          this.curLanguage == a.languages.CA || this.curLanguage == a.languages.AU || this.curLanguage == a.languages.NZ || this.curLanguage == a.languages.DK ? e = a.languages.US : this.curLanguage != a.languages.AT && this.curLanguage != a.languages.CH || (e = a.languages.DE);
          return e;
        };
        e.prototype.setYhxy = function (e) {
          this.yhxyUrl = e;
        };
        e.prototype.getUserPrivacy = function () {
          return this.yszcUrl;
        };
        e.prototype.setEncrypt = function (e) {
          this.is_encrypt = e;
        };
        e.prototype.decryptConfig = function (e) {
          return s.default.getAesDncrypData(e);
        };
        e.prototype.getUserAgreement = function () {
          return this.yhxyUrl;
        };
        e.prototype.isUseSysFont = function () {
          if (a.UseSystemFont[String(this.curLanguage)]) return !0;
        };
        e.prototype.updateGameTime = function () {
          var e = c.default.getTimeStamp() - this.game_time;
          s.default.reportData("game_time", {
            time: e
          });
          this.game_time = c.default.getTimeStamp();
        };
        var t;
        e._instance = null;
        return t = n([u("GlobalDataMgr")], e);
      }();
    o.default = p._getInstance();
    cc._RF.pop();
