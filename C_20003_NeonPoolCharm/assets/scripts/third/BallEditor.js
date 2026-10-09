let e = require;let t = module;let o = exports;
    "use strict";

    cc._RF.push(t, "9ab20bqI1FCcb21Kp2zo0sq", "BallEditor");
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
      s = r.property,
      c = (cc._decorator, function (e) {
        i(t, e);
        function t() {
          var t = null !== e && e.apply(this, arguments) || this;
          t.Light = null;
          t.matIdx = null;
          return t;
        }
        t.prototype.SetSelect = function (e) {
          void 0 === e && (e = !0);
          this.Light.active = e;
        };
        t.prototype.setMatIdx = function (e) {
          this.matIdx = e + 0;
          var t = this.node.getChildByName("New Sphere").getComponent(cc.MeshRenderer),
            o = t.getMaterials();
          this.matIdx >= o.length && (this.matIdx = 0);
          var n = o[this.matIdx];
          t.setMaterial(0, n);
        };
        a([s(cc.Node)], t.prototype, "Light", void 0);
        return a([l], t);
      }(cc.Component));
    o.default = c;
    cc._RF.pop();
