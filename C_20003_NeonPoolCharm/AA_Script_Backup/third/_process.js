let e = require;let t = module;
    "use strict";

    cc._RF.push(t, "99e8640g71HtIKICGf8urOg", "_process");
    var o,
      n,
      i = function () {
        throw new Error("setTimeout has not been defined");
      },
      a = function () {
        throw new Error("clearTimeout has not been defined");
      },
      r = function (e) {
        if (o === setTimeout) return setTimeout(e, 0);
        if ((o === i || !o) && setTimeout) {
          o = setTimeout;
          return setTimeout(e, 0);
        }
        try {
          return o(e, 0);
        } catch (t) {
          try {
            return o.call(null, e, 0);
          } catch (t) {
            return o.call(this, e, 0);
          }
        }
      },
      l = function (e) {
        if (n === clearTimeout) return clearTimeout(e);
        if ((n === a || !n) && clearTimeout) {
          n = clearTimeout;
          return clearTimeout(e);
        }
        try {
          return n(e);
        } catch (t) {
          try {
            return n.call(null, e);
          } catch (t) {
            return n.call(this, e);
          }
        }
      },
      s = function () {
        if (h && _) {
          h = !1;
          _.length ? f = _.concat(f) : g = -1;
          f.length && c();
        }
      },
      c = function () {
        if (!h) {
          var e = r(s);
          h = !0;
          for (var t = f.length; t;) {
            _ = f;
            f = [];
            for (; ++g < t;) _ && _[g].run();
            g = -1;
            t = f.length;
          }
          _ = null;
          h = !1;
          l(e);
        }
      },
      u = function (e, t) {
        this.fun = e;
        this.array = t;
      },
      p = function () {},
      d = t.exports = {};
    (function () {
      try {
        o = "function" == typeof setTimeout ? setTimeout : i;
      } catch (e) {
        o = i;
      }
      try {
        n = "function" == typeof clearTimeout ? clearTimeout : a;
      } catch (e) {
        n = a;
      }
    })();
    var _,
      f = [],
      h = !1,
      g = -1;
    d.nextTick = function (e) {
      var t = new Array(arguments.length - 1);
      if (arguments.length > 1) for (var o = 1; o < arguments.length; o++) t[o - 1] = arguments[o];
      f.push(new u(e, t));
      1 !== f.length || h || r(c);
    };
    u.prototype.run = function () {
      this.fun.apply(null, this.array);
    };
    d.title = "browser";
    d.browser = !0;
    d.env = {};
    d.argv = [];
    d.version = "";
    d.versions = {};
    d.on = p;
    d.addListener = p;
    d.once = p;
    d.off = p;
    d.removeListener = p;
    d.removeAllListeners = p;
    d.emit = p;
    d.prependListener = p;
    d.prependOnceListener = p;
    d.listeners = function () {
      return [];
    };
    d.binding = function () {
      throw new Error("process.binding is not supported");
    };
    d.cwd = function () {
      return "/";
    };
    d.chdir = function () {
      throw new Error("process.chdir is not supported");
    };
    d.umask = function () {
      return 0;
    };
    cc._RF.pop();
