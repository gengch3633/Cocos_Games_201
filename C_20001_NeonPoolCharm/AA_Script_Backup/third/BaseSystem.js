let e = require;
let t = module;
let o = exports;
"use strict";
cc._RF.push(t, "d3431dQXW9HMLe9PE3HM44J", "BaseSystem");
Object.defineProperty(o, "__esModule", {
  value: ! 0
}
);
var n = e("GameConfigurations.js"),
i = e("GameHelper.js"),
a = e("LocalServer.js"),
r = e("CoinfinityRideress.js"),
l = e("PoolNative.js"),
s = e("PoolWrapper.js"),
c = e(AudioManager "
  }].js),
      u = function () {
        function e() {}
        e.prototype.getUserInfo = function (e, t, o) {
          a.default.instance.requestUserInfo(function (e) {
            return t.runWith(e);
          }, function (e) {
            return null == o ? void 0 : o(e);
          });
        };
        e.prototype.getConfmeUrl_Regional = function () {
          return Promise.resolve(null);
        };
        e.prototype.reco = function (e, t) {
          null == t || t.runWith({
            code: 1,
            data: {},
            ecp: 0,
            message: " "
          });
        };
        e.prototype.getSystemConfig = function (e) {
          e.runWith({
            code: 1,
            data: {
              activate: !0,
              is_encrypt: !1,
              is_reviewer: !1,
              new_user: 0,
              position: " Turkey "
            },
            ecp: 0,
            message: " "
          });
        };
        e._getInstance = function () {
          e._instance || (e._instance = new e());
          return e._instance;
        };
        e.prototype.wechatBind = function (e, t) {
          null == t || t.runWith({
            code: 1,
            data: {},
            ecp: 0,
            message: " "
          });
        };
        e.prototype.agreementReport = function (e, t) {
          null == t || t.runWith({
            code: 1,
            data: {},
            ecp: 0,
            message: " "
          });
        };
        e.prototype.autoLogin = function (e, t, o) {
          this.touristsLogin(e, t, o);
        };
        e.prototype.touristsLogin = function (e, t) {
          r.CoinfinityRideress.instance.init(s.PoolWrapper.EventName.NEW_BALL_CHANGED);
          s.PoolWrapper.instance.init(l.PoolNative.getPackageName(), function (e) {
            c.default.getInstance().mute = e;
          });
          r.CoinfinityRideress.instance.electroretinogram([], null, function (e, o) {
            if (cc.sys.isNative && !i.default.intranetValue) {
              if ((null == e ? void 0 : e.IP_RESTRICT) && i.default.spawn) {
                t.runWith({
                  code: 101,
                  data: {},
                  ecp: 0,
                  message: " "
                });
                return;
              }
              if ((null == e ? void 0 : e.VPN_RESTRICT) && (l.PoolNative.isVPNEnabled || l.PoolNative.isProxyEnabled) && !i.default.pocketed) {
                t.runWith({
                  code: 102,
                  data: {},
                  ecp: 0,
                  message: " "
                });
                return;
              }
            }
            n.GameConfigurations.updateWebConfig(e);
            n.GameConfigurations.updateNewBallConfig(o);
            t.runWith(a.default.instance.requestLogin());
          });
        };
        e.prototype.shumengReport = function (e, t) {
          null == t || t.runWith({
            code: 1,
            data: {},
            ecp: 0,
            message: " "
          });
        };
        e.prototype.logoff = function (e, t) {
          null == t || t.runWith({
            code: 1,
            data: {},
            ecp: 0,
            message: " "
          });
        };
        e.prototype.removeUser = function (e, t) {
          null == t || t.runWith({
            code: 1,
            data: {},
            ecp: 0,
            message: " "
          });
        };
        e.prototype.wechatLogin = function (e, t) {
          var o = e.wechat_code,
            n = e.tempData,
            i = {
              wechat_code: o
            };
          Object.assign(i, n);
          null == t || t.runWith({
            code: 1,
            data: {},
            ecp: 0,
            message: " "
          });
        };
        e.prototype.logout = function (e) {
          null == e || e.runWith({
            code: 1,
            data: {},
            ecp: 0,
            message: " "
          });
        };
        return e;
      }();
    o.default = u._getInstance();
    cc._RF.pop();
