let e = require;let t = module;let a = exports;
    "use strict";

    cc._RF.push(t, "97466Ej7CZM2JEv9Pn/Y00G", "SkeletonEx");
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
    var r = cc._decorator,
      c = r.ccclass,
      s = r.property,
      l = function () {
        function e() {
          this.name = "";
          this.isLoop = !1;
        }
        i([s()], e.prototype, "name", void 0);
        i([s()], e.prototype, "isLoop", void 0);
        return i([c("animationObj")], e);
      }(),
      u = function (e) {
        n(t, e);
        function t() {
          var t = null !== e && e.apply(this, arguments) || this;
          t.animationArray = [];
          return t;
        }
        t.prototype.onLoad = function () {
          var e = this.node.getComponent(sp.Skeleton);
          if (e && this.animationArray.length > 0) for (var t = 0; t < this.animationArray.length; t++) {
            var a = this.animationArray[t];
            0 == t ? e.setAnimation(0, a.name, a.isLoop) : e.addAnimation(0, a.name, a.isLoop);
          }
        };
        i([s([l])], t.prototype, "animationArray", void 0);
        return i([c], t);
      }(cc.Component);
    a.default = u;
    cc._RF.pop();
