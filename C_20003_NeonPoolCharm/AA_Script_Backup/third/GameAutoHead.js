let e = require;let t = module;let o = exports;
    "use strict";

    cc._RF.push(t, "d03bbG7ejtHe7BRJ9EH0GD0", "GameAutoHead");
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
    var r,
      l = cc._decorator,
      s = l.ccclass,
      c = l.property;
    (function (e) {
      e[e.isTop = 0] = "isTop";
      e[e.isBottom = 1] = "isBottom";
    })(r || (r = {}));
    var u = function () {
        function e() {
          this.type = r.isTop;
          this.num = 65;
        }
        a([c({
          type: cc.Enum(r)
        })], e.prototype, "type", void 0);
        a([c()], e.prototype, "num", void 0);
        return a([s("GameAutoHeadType")], e);
      }(),
      p = function (e) {
        i(t, e);
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
            var o = t[e];
            0 == o.type && (this.node.getComponent(cc.Widget).top = this.node.getComponent(cc.Widget).top + o.num);
            1 == o.type && (this.node.getComponent(cc.Widget).bottom = this.node.getComponent(cc.Widget).bottom + o.num);
          }
        };
        a([c([u])], t.prototype, "autoDatas", void 0);
        return a([s], t);
      }(cc.Component);
    o.default = p;
    cc._RF.pop();
