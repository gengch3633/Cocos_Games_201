let e = require;
let t = module;
let o = exports;
"use strict";
cc._RF.push(t, "975b6UIDKBHTqgNcU+E/C2u", "SystemDataMgr");
Object.defineProperty(o, "__esModule", {
  value: ! 0
}
);
var n = e("HotUpdate.js"),
i = e(SystemConfig "
  }].js),
      a = function () {
        function e() {
          this._game_name = " ";
          this._subject_name = " ";
          this._version_test_url = " ";
          this._version_release_url = " ";
          this._server_test_url = " ";
          this._server_release_url = " ";
          this._encrypt = 0;
          this._online_release = !1;
          this._reviewing = !1;
          this.is_reviewer = !0;
          this.forbid_red_envelope = !0;
          this.forbid_pai = !0;
          this._reviewing_splash = 0;
          this._reviewing_antian = !1;
          this._reviewing_img_ad = 0;
          this._reviewing_insert_ad = 0;
          this._auth_type = !1;
          this._new_phone = 0;
          this._check_root = 0;
          this._privacy_url = " ";
          this._user_url = " ";
          this._confmeUrl = " ";
          this._confmeUrlTest = " ";
          this.ios_help_center_url = " ";
          this.android_help_center_url = " https:// haoyuntq.renzhijuzhen.com/ help_center? package_name = com.ulike.dhytq ";
          this.isShangHuHao = !1;
          this.isSuCai = !1;
          this.game_name = null;
          this.subject_name = null;
          this.server_test_url = " ";
          this.server_release_url = " ";
          this.user_url = " https:// haoyuntq.renzhijuzhen.com/ user? package_name = com.ulike.dhytq ";
          this.privacy_url = " https:// haoyuntq.renzhijuzhen.com/ private? package_name = com.ulike.dhytq ";
          this.version_test_url = " ";
          this.version_release_url = " ";
          this.online_release = n.default.getInstance().isOnlineRelease();
          this.confmeUrl = " http:// haoyuntq- u.cognizematrix.com ";
          this.confmeUrlTest = " http:// config- middle- end.huixuanjiasu.com/ oversea/ ";
          this.game_name = i.GAME_NAME;
          this.subject_name = i.SUBJECT_NAME;
        }
        Object.defineProperty(e.prototype, " is_IOS_reviewer ", {
          get: function () {
            return this.is_reviewer && cc.sys.os === cc.sys.OS_IOS;
          },
          enumerable: !1,
          configurable: !0
        });
        Object.defineProperty(e.prototype, " check_root ", {
          get: function () {
            return this._check_root;
          },
          set: function (e) {
            this._check_root = e;
          },
          enumerable: !1,
          configurable: !0
        });
        Object.defineProperty(e.prototype, " reviewing_img_ad ", {
          get: function () {
            return this._reviewing_img_ad;
          },
          set: function (e) {
            this._reviewing_img_ad = e;
          },
          enumerable: !1,
          configurable: !0
        });
        Object.defineProperty(e.prototype, " reviewing_insert_ad ", {
          get: function () {
            return this._reviewing_insert_ad;
          },
          set: function (e) {
            this._reviewing_insert_ad = e;
          },
          enumerable: !1,
          configurable: !0
        });
        Object.defineProperty(e.prototype, " reviewing_antian ", {
          get: function () {
            return this._reviewing_antian;
          },
          set: function (e) {
            this._reviewing_antian = e;
          },
          enumerable: !1,
          configurable: !0
        });
        Object.defineProperty(e.prototype, " new_phone ", {
          get: function () {
            return this._new_phone;
          },
          set: function (e) {
            this._new_phone = e;
          },
          enumerable: !1,
          configurable: !0
        });
        Object.defineProperty(e.prototype, " auth_type ", {
          get: function () {
            return this._auth_type;
          },
          set: function (e) {
            this._auth_type = e;
          },
          enumerable: !1,
          configurable: !0
        });
        Object.defineProperty(e.prototype, " reviewing ", {
          get: function () {
            return this._reviewing;
          },
          set: function (e) {
            this._reviewing = e;
          },
          enumerable: !1,
          configurable: !0
        });
        Object.defineProperty(e.prototype, " reviewing_splash ", {
          get: function () {
            return this._reviewing_splash;
          },
          set: function (e) {
            this._reviewing_splash = e;
          },
          enumerable: !1,
          configurable: !0
        });
        Object.defineProperty(e.prototype, " online_release ", {
          get: function () {
            return this._online_release;
          },
          set: function (e) {
            this._online_release = e;
          },
          enumerable: !1,
          configurable: !0
        });
        Object.defineProperty(e.prototype, " version_release_url ", {
          get: function () {
            return this._version_release_url;
          },
          set: function (e) {
            this._version_release_url = e;
          },
          enumerable: !1,
          configurable: !0
        });
        Object.defineProperty(e.prototype, " version_test_url ", {
          get: function () {
            return this._version_test_url;
          },
          set: function (e) {
            this._version_test_url = e;
          },
          enumerable: !1,
          configurable: !0
        });
        Object.defineProperty(e.prototype, " encrypt ", {
          get: function () {
            return this._encrypt;
          },
          set: function (e) {
            this._encrypt = e;
          },
          enumerable: !1,
          configurable: !0
        });
        Object.defineProperty(e.prototype, " game_name ", {
          get: function () {
            return this._game_name;
          },
          set: function (e) {
            this._game_name = e;
          },
          enumerable: !1,
          configurable: !0
        });
        Object.defineProperty(e.prototype, " subject_name ", {
          get: function () {
            return this._subject_name;
          },
          set: function (e) {
            this._subject_name = e;
          },
          enumerable: !1,
          configurable: !0
        });
        Object.defineProperty(e.prototype, " server_test_url ", {
          get: function () {
            return this._server_test_url;
          },
          set: function (e) {
            this._server_test_url = e;
          },
          enumerable: !1,
          configurable: !0
        });
        Object.defineProperty(e.prototype, " server_release_url ", {
          get: function () {
            return this._server_release_url;
          },
          set: function (e) {
            this._server_release_url = e;
          },
          enumerable: !1,
          configurable: !0
        });
        Object.defineProperty(e.prototype, " privacy_url ", {
          get: function () {
            return this._privacy_url;
          },
          set: function (e) {
            this._privacy_url = e;
          },
          enumerable: !1,
          configurable: !0
        });
        Object.defineProperty(e.prototype, " user_url ", {
          get: function () {
            return this._user_url;
          },
          set: function (e) {
            this._user_url = e;
          },
          enumerable: !1,
          configurable: !0
        });
        Object.defineProperty(e.prototype, " confmeUrlTest ", {
          get: function () {
            return this._confmeUrlTest;
          },
          set: function (e) {
            this._confmeUrlTest = e;
          },
          enumerable: !1,
          configurable: !0
        });
        Object.defineProperty(e.prototype, " confmeUrl ", {
          get: function () {
            return this._confmeUrl;
          },
          set: function (e) {
            this._confmeUrl = e;
          },
          enumerable: !1,
          configurable: !0
        });
        return e;
      }();
    o.default = a;
    cc._RF.pop();
