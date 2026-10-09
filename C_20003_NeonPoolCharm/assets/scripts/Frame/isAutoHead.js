let e = require;let t = module;let a = exports;
    "use strict";

    cc._RF.push(t, "e3146iXr0ZNAZ3yThPsljFL", "isAutoHead");
    var o,
      n = this && this.__extends || (o = function (e, t) {
        return (o = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function (e, t) {
          e.__proto__ = t;
        } || function (e, t) {
          for (var a in t) Object.prototype.hasOwnProperty.call(t, a) && (e[a] = t[a]);
        })(e, t);
      }, function (e, t) {
        o(e, t);
        function a() {
          this.constructor = e;
        }
        e.prototype = null === t ? Object.create(t) : (a.prototype = t.prototype, new a());
      }),
      i = this && this.__decorate || function (e, t, a, o) {
        var n,
          i = arguments.length,
          r = i < 3 ? t : null === o ? o = Object.getOwnPropertyDescriptor(t, a) : o;
        if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) r = Reflect.decorate(e, t, a, o);else for (var c = e.length - 1; c >= 0; c--) (n = e[c]) && (r = (i < 3 ? n(r) : i > 3 ? n(t, a, r) : n(t, a)) || r);
        return i > 3 && r && Object.defineProperty(t, a, r), r;
      };
    Object.defineProperty(a, "__esModule", {
      value: !0
    });
    var r,
      c = cc._decorator,
      s = c.ccclass,
      l = c.property;
    (function (e) {
      e[e.isTop = 0] = "isTop";
      e[e.isBottom = 1] = "isBottom";
    })(r || (r = {}));
    var u = function () {
        function e() {
          this.type = r.isTop;
          this.num = 65;
        }
        i([l({
          type: cc.Enum(r)
        })], e.prototype, "type", void 0);
        i([l()], e.prototype, "num", void 0);
        return i([s("AutoHeadType2")], e);
      }(),
      d = function (e) {
        n(t, e);
        function t() {
          var t = null !== e && e.apply(this, arguments) || this;
          t.autoDatas = [{
            type: r.isTop,
            num: 65
          }];
          return t;
        }
        t.prototype.onLoad = function () {
          if (cc.winSize.width / cc.winSize.height < .56) for (var e = 0, t = this.autoDatas; e < t.length; e++) {
            var a = t[e];
            0 == a.type && (this.node.getComponent(cc.Widget).top = this.node.getComponent(cc.Widget).top + a.num);
            1 == a.type && (this.node.getComponent(cc.Widget).bottom = this.node.getComponent(cc.Widget).bottom + a.num);
          }
        };
        i([l([u])], t.prototype, "autoDatas", void 0);
        return i([s], t);
      }(cc.Component);
    a.default = d;
    cc._RF.pop();
