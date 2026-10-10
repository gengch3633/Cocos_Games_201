let e = require;let t = module;let o = exports;
    "use strict";

    cc._RF.push(t, "a742aVtGspOv5YTxlVdGcJj", "SystemDataSys");
    var n,
      i = this && this.__extends || (n = function (e, t) {
        return (n = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function (e, t) {
          e.__proto__ = t;
        } || function (e, t) {
          for (var o in t) Object.prototype.hasOwnProperty.call(t, o) && (e[o] = t[o]);
        })(e, t);
      }, function (e, t) {
        n(e, t);
        function o() {
          this.constructor = e;
        }
        e.prototype = null === t ? Object.create(t) : (o.prototype = t.prototype, new o());
      });
    Object.defineProperty(o, "__esModule", {
      value: !0
    });
    var a = e("SystemDataMgr.js"),
      r = e("ClientData.js"),
      l = e("SdkHelper.js"),
      s = e("EngineUtil.js"),
      c = e("PlayerDataSys.js"),
      u = function (e) {
        i(t, e);
        function t() {
          var t = null !== e && e.apply(this, arguments) || this;
          t.reviewing = null;
          t.forbid_pai = null;
          t.auth_type = null;
          t.reviewing_splash = null;
          t.encrypt = null;
          t.is_reviewer = null;
          return t;
        }
        t.prototype.get_request_url = function () {
          return this.online_release ? this.getServerReleaseUrl() : this.getServerTestUrl();
        };
        t.prototype.getVersionRelease = function () {
          return this.getServerReleaseUrl() + "update";
        };
        t.prototype.init = function () {
          var e = s.default.getLocalData("yid");
          c.default.initUserId({
            yid: e
          });
          var t = l.default.getClientInfo();
          r.default.init(t);
        };
        t.prototype.init_config = function (e) {
          var t = e.activate,
            o = e.is_encrypt,
            n = e.is_reviewer;
          this.encrypt = o || 0;
          this.is_reviewer = !!n;
          t && l.default.reportData("activate");
        };
        t.prototype.getTongDunId = function () {
          var e = l.default.requestTDId();
          return "not_init" !== e ? e : null;
        };
        t.prototype.get_payerMaxCallBack_url = function () {
          return this.online_release ? "com.ggnbpool.kingt://pageJump" : "com.zsygtqyx.hwsl://pageJump";
        };
        t.prototype.get_version_url = function () {
          return this.online_release ? this.getVersionRelease() : this.getVersionTest();
        };
        t.prototype.getServerReleaseUrl = function () {
          return "http://haoyuntq-u.cognizematrix.com/";
        };
        t.prototype.init_middle_config = function (e) {
          var t = JSON.parse(e),
            o = (t.location_flag, t.vv_flag, t.forbid_screen),
            n = (t.sm_flag, t.td_flag, t.hs_flag, t.notice_content, t.per_dialog_delay, t.notice_delay, t.ck_flag, t.tly_flag, t.force_flag, t.tab_flag, t.ysdk_flag);
          t.dir_flag, t.antian_flag, t.new_add_flag, t.forbid_red_envelope, t.recog_ire, t.recog_tf, t.forbid_pai;
          this.reviewing = !1;
          this.forbid_pai = !1;
          this.auth_type = void 0 !== n && n;
          this.reviewing_splash = void 0 === o || o;
        };
        t.prototype.getCNVersionUrl = function () {
          return this.online_release ? "https://update.cognizematrix.com/hot_update" : "http://version-debug.huixuanjiasu.com/update/hot_update";
        };
        t.prototype.getVersionTest = function () {
          return this.getServerTestUrl() + "update";
        };
        t._getInstance = function () {
          t._instance || (t._instance = new t());
          return t._instance;
        };
        t.prototype.getServerTestUrl = function () {
          return "http://backend-debug5-new.huixuanjiasu.com/haoyuntq-android-cn/";
        };
        t.prototype.getConfmeBaseUrl = function () {
          return this.online_release ? this.confmeUrl : this.confmeUrlTest;
        };
        return t;
      }(a.default);
    o.default = u._getInstance();
    cc._RF.pop();
