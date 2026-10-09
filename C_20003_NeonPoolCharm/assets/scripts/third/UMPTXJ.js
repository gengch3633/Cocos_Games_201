let e = require;let t = module;let o = exports;
    "use strict";

    cc._RF.push(t, "d6dd8t0avJCvJu3iTkAXeGn", "UMPTXJ");
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
    o.MsgFuc = o.UMPTXJ = void 0;
    var a = function (e) {
      i(t, e);
      function t() {
        var t = null !== e && e.apply(this, arguments) || this;
        t.XYGVPHVSFFPUJDPP = {};
        t.ISPAXF = {};
        t.EALXWBUECJOTDOW = {};
        return t;
      }
      t.prototype.CRYLRA = function (e, t, o, n) {
        if (null != e[t]) e[t].push(new r(n, o));else {
          e[t] = [];
          e[t].push(new r(n, o));
        }
      };
      t.prototype.HWZEEGYDTCHMYPA = function (e, t, o) {
        this.CRYLRA(this.XYGVPHVSFFPUJDPP, e, t, o);
      };
      t.prototype.MOYJHJXDBD = function (e, t, o) {
        this.CRYLRA(this.EALXWBUECJOTDOW, e, t, o);
      };
      t.prototype.QZWZVTBXDV = function (e, t) {
        this.KPFDIKEBW(this.ISPAXF, e, t);
        this.KPFDIKEBW(this.XYGVPHVSFFPUJDPP, e, t);
        this.KPFDIKEBW(this.EALXWBUECJOTDOW, e, t);
      };
      t.prototype.UYCVCIJQEQX = function (e, t, o) {
        this.TPYUUEWBAQHYQIL(this.EALXWBUECJOTDOW, e, t, o);
      };
      t.prototype.RVUSXQFHWT = function (e, t, o) {
        this.TPYUUEWBAQHYQIL(this.XYGVPHVSFFPUJDPP, e, t, o);
      };
      t.prototype.TPYUUEWBAQHYQIL = function (e, t, o, n) {
        if (null != e[t] && e[t].length > 0) {
          for (var i = null, a = 0; a < e[t].length; a++) if (e[t][a].XZFADQBYSH == o && e[t][a].ZRTLLSTONYUWZN == n) {
            i = e[t][a];
            break;
          }
          var r = e[t].indexOf(i);
          r > -1 && e[t].splice(r, 1);
          null != e[t] && 0 == e[t].length && delete e[t];
        }
      };
      t.prototype.KPFDIKEBW = function (e, t, o) {
        null != e[t] && e[t].forEach(function (e) {
          e.XZFADQBYSH.call(e.ZRTLLSTONYUWZN, o);
        });
      };
      t.prototype.EFNUOHUWYV = function (e, t, o) {
        this.TPYUUEWBAQHYQIL(this.ISPAXF, e, t, o);
      };
      t.prototype.VAZBFSLPHOOGPP = function (e, t, o) {
        this.CRYLRA(this.ISPAXF, e, t, o);
      };
      return t;
    }(e("LZFAHNEP.js").LZFAHNEP);
    o.UMPTXJ = a;
    var r = function (e, t) {
      this.ZRTLLSTONYUWZN = e;
      this.XZFADQBYSH = t;
      this.XZFADQBYSH.bind(e);
    };
    o.MsgFuc = r;
    cc._RF.pop();
