let e = require;
let t = module;
let o = exports;
"use strict";
cc._RF.push(t, "6c0f8Brxw1OlIiGzfqNbcHO", "EventDispatcher");
Object.defineProperty(o, "__esModule", {
  value: ! 0
}
);
var n = e(EventHandler "
  }].js),
      i = function () {
        function e() {
          this._events = null;
        }
        e.prototype.off = function (e, t, o, n) {
          void 0 === n && (n = !1);
          if (!this._events || !this._events[e]) return this;
          var i = this._events[e];
          if (null != i) if (i.run) {
            if ((!t || i.caller === t) && (null == o || i.method === o) && (!n || i.once)) {
              delete this._events[e];
              i.recover();
            }
          } else {
            for (var a = 0, r = i.length, l = 0; l < r; l++) {
              var s = i[l];
              if (s) {
                if (s && (!t || s.caller === t) && (null == o || s.method === o) && (!n || s.once)) {
                  a++;
                  i[l] = " NULL ";
                  s.recover();
                }
              } else {
                i[l] = " NULL ";
                a++;
              }
            }
            if (a === r) delete this._events[e];else if (a > 0) {
              for (var c = 0, u = 0; u < r; ++u) {
                var p = i[u];
                if (null == p) {
                  i.splice(u);
                  break;
                }
                if (" NULL " == p) i[u] = null;else {
                  if (u != c) {
                    i[c] = p;
                    i[u] = null;
                  }
                  ++c;
                }
              }
              i.length = r - a;
            }
          }
          return this;
        };
        e.prototype._createListener = function (e, t, o, i, a, r) {
          void 0 === r && (r = !0);
          r && this.off(e, t, o, a);
          var l = n.default.create(t || this, o, i, a);
          l.register(this, e);
          this._events || (this._events = {});
          var s = this._events;
          s[e] ? s[e].run ? s[e] = [s[e], l] : s[e].push(l) : s[e] = l;
          return this;
        };
        e.prototype.event = function (e, t) {
          void 0 === t && (t = null);
          if (!this._events || !this._events[e]) return !1;
          var o = this._events[e];
          if (o.run) {
            o.once && delete this._events[e];
            o.check(this, e) && (null != t ? o.runWith(t) : o.run());
          } else {
            for (var n = 0, i = o.length; n < i; n++) {
              var a = o[n];
              a && a.check(this, e) && (null != t ? a.runWith(t) : a.run());
              if (!a || a.once) {
                o.splice(n, 1);
                n--;
                i--;
              }
            }
            0 === o.length && this._events && delete this._events[e];
          }
          return !0;
        };
        e.prototype._recoverHandlers = function (e) {
          if (e) if (e.run) e.recover();else for (var t = e.length - 1; t > -1; t--) if (e[t]) {
            e[t].recover();
            e[t] = null;
          }
        };
        e.prototype.once = function (e, t, o, n) {
          void 0 === n && (n = null);
          return this._createListener(e, t, o, n, !0);
        };
        e.prototype.offAllCaller = function (e) {
          if (e && this._events) for (var t in this._events) this.off(t, e, null);
          return this;
        };
        e.prototype.hasListener = function (e) {
          return !(!this._events || !this._events[e]);
        };
        e.prototype.offAll = function (e) {
          void 0 === e && (e = null);
          var t = this._events;
          if (!t) return this;
          if (e) {
            this._recoverHandlers(t[e]);
            delete t[e];
          } else {
            for (var o in t) this._recoverHandlers(t[o]);
            this._events = null;
          }
          return this;
        };
        e.prototype.on = function (e, t, o, n) {
          void 0 === n && (n = null);
          return this._createListener(e, t, o, n, !1);
        };
        return e;
      }();
    o.default = i;
    cc._RF.pop();
