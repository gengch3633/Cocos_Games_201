let e = require;let t = module;let o = exports;
    "use strict";

    cc._RF.push(t, "36435ZZEn9D45wrTLn4u5gV", "physics-bound");
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
      c = function (e) {
        i(t, e);
        function t() {
          var t = null !== e && e.apply(this, arguments) || this;
          t.size = cc.size(0, 0);
          t.mouseJoint = !0;
          t.target = null;
          return t;
        }
        t.prototype._addBound = function (e, t, o, n, i) {
          var a = e.addComponent(cc.PhysicsBoxCollider);
          a.offset.x = t;
          a.offset.y = o;
          a.size.width = n;
          a.size.height = i;
        };
        t.prototype.onLoad = function () {
          var e = cc.director.getPhysicsManager();
          e.enabled = !0;
          e.debugDrawFlags = 0;
          var t = this.target || this.node,
            o = this.size.width || t.width,
            n = this.size.height || t.height;
          console.log("pnode", o, n);
          var i = new cc.Node();
          i.addComponent(cc.RigidBody).type = cc.RigidBodyType.Static;
          this.mouseJoint && (i.addComponent(cc.MouseJoint).mouseRegion = t);
          this._addBound(i, 0, n / 2, o, 20);
          this._addBound(i, 0, -n / 2, o, 20);
          this._addBound(i, -o / 2, 0, 20, n);
          this._addBound(i, o / 2, 0, 20, n);
          i.parent = t;
        };
        a([s], t.prototype, "size", void 0);
        a([s], t.prototype, "mouseJoint", void 0);
        a([s(cc.Node)], t.prototype, "target", void 0);
        return a([l], t);
      }(cc.Component);
    o.default = c;
    cc._RF.pop();
