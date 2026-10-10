let e = require;let t = module;let o = exports;
    "use strict";

    cc._RF.push(t, "c32f5pSuPZNtLrdYMh+rRAg", "one-side-platform");
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
      }),
      a = this && this.__decorate || function (e, t, o, n) {
        var i,
          a = arguments.length,
          r = a < 3 ? t : null === n ? n = Object.getOwnPropertyDescriptor(t, o) : n;
        if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) r = Reflect.decorate(e, t, o, n);else for (var l = e.length - 1; l >= 0; l--) (i = e[l]) && (r = (a < 3 ? i(r) : a > 3 ? i(t, o, r) : i(t, o)) || r);
        return a > 3 && r && Object.defineProperty(t, o, r), r;
      };
    Object.defineProperty(o, "__esModule", {
      value: !0
    });
    var r = cc._decorator,
      l = r.ccclass,
      s = (r.property, function (e) {
        i(t, e);
        function t() {
          var t = null !== e && e.apply(this, arguments) || this;
          t.pointVelPlatform = null;
          t.pointVelOther = null;
          t.relativeVel = null;
          t.relativePoint = null;
          return t;
        }
        t.prototype.onLoad = function () {
          this.pointVelPlatform = cc.v2();
          this.pointVelOther = cc.v2();
          this.relativeVel = cc.v2();
          this.relativePoint = cc.v2();
        };
        t.prototype.onBeginContact = function (e, t, o) {
          this._pointsCache;
          for (var n = o.body, i = t.body, a = e.getWorldManifold().points, r = this.pointVelPlatform, l = this.pointVelOther, s = this.relativeVel, c = this.relativePoint, u = 0; u < a.length; u++) {
            i.getLinearVelocityFromWorldPoint(a[u], r);
            n.getLinearVelocityFromWorldPoint(a[u], l);
            i.getLocalVector(l.subSelf(r), s);
            if (s.y < -32) return;
            if (s.y < 32) {
              i.getLocalPoint(a[u], c);
              var p = t.getAABB().height / 2;
              if (c.y > p - 3.2) return;
            }
          }
          e.disabled = !0;
        };
        return a([l], t);
      }(cc.Component));
    o.default = s;
    cc._RF.pop();
