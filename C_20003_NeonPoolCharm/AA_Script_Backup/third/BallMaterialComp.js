let e = require;let t = module;let o = exports;
    "use strict";

    cc._RF.push(t, "d2e24bImv5AUI2REZn1fiXd", "BallMaterialComp");
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
          t.matIdx = null;
          return t;
        }
        t.prototype.onLoad = function () {
          this.matIdx = this.matIdx || 0;
        };
        t.prototype.click = function () {};
        t.prototype.getMatIdx = function () {
          return this.matIdx;
        };
        t.prototype.setMatIdx = function (e) {
          this.matIdx = e + 0;
          var t = this.node.getChildByName("New Sphere").getComponent(cc.MeshRenderer),
            o = t.getMaterials();
          this.matIdx >= o.length && (this.matIdx = 0);
          var n = o[this.matIdx];
          t.setMaterial(0, n);
        };
        t.prototype.update = function () {};
        return a([l], t);
      }(cc.Component));
    o.default = s;
    cc._RF.pop();
