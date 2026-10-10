let e = require;let t = module;let o = exports;
    "use strict";

    cc._RF.push(t, "712ffAQir5Lz7NpshyNhAZu", "OEUUFAHDFYFXEQF");
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
    o.OEUUFAHDFYFXEQF = o.HttpRequestTempData = void 0;
    var a = e("LKKFYC.js"),
      r = e("JGJYJG.js"),
      l = e("ABPXIYEANGWLG.js"),
      s = e("XWRHYLPIOGNSH.js");
    o.HttpRequestTempData = function () {};
    var c = function (e) {
      i(t, e);
      function t() {
        var t = null !== e && e.apply(this, arguments) || this;
        t.UEPVGVVSETU = 1;
        t.ZYFURDYKK = {};
        return t;
      }
      t.prototype.HWZEEGYDTCHMYPA = function () {
        this.DUKMQHWIHYGN.HWZEEGYDTCHMYPA(l.ABPXIYEANGWLG.UEMRAHCKHGOPYR, this.UEMRAHCKHGOPYR, this);
      };
      t.prototype.HMZTTQYMEYZ = function () {};
      t.prototype.QJDSFXADLWWE = function (e, t, o) {
        void 0 === t && (t = null);
        var n = {
          "X-Forwarded": e
        };
        this.KAAPHLHD("post", n, t, o);
      };
      t.prototype.KAAPHLHD = function (e, t, o, n) {
        void 0 === t && (t = {});
        void 0 === o && (o = {});
        if (!r.JGJYJG.YFEMHUUNOADK) {
          this.UEPVGVVSETU += 1;
          this.ZYFURDYKK["" + this.UEPVGVVSETU] = n;
          var i = "{}";
          null != t && (i = JSON.stringify(t));
          var a = "{}";
          null != o && (a = JSON.stringify(o));
          s.XWRHYLPIOGNSH.ZSYXBLSKYBGCRTL().KAAPHLHD(this.UEPVGVVSETU, e, i, a);
        }
      };
      t.prototype.CDFXMWFAOK = function (e, t, o) {
        void 0 === e && (e = null);
        void 0 === t && (t = null);
        this.KAAPHLHD("post", e, t, o);
      };
      t.prototype.BPEEZCJ = function (e, t, o) {
        void 0 === t && (t = null);
        var n = {
          "X-Forwarded": e
        };
        this.KAAPHLHD("get", n, t, o);
      };
      t.prototype.JXAVTQMDWDRWY = function (e, t, o) {
        void 0 === e && (e = null);
        void 0 === t && (t = null);
        this.KAAPHLHD("get", e, t, o);
      };
      t.prototype.UEMRAHCKHGOPYR = function (e) {
        try {
          var t = atob(e),
            o = JSON.parse(t),
            n = o.msgId,
            i = this.ZYFURDYKK["" + n];
          if (null != i && null != o.data) {
            var a = atob(o.data);
            i.ZGIOBPBMXECH(a);
          }
        } catch (e) {}
      };
      return t;
    }(a.LKKFYC);
    o.OEUUFAHDFYFXEQF = c;
    cc._RF.pop();
