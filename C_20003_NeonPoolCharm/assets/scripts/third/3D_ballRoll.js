let e = require;let t = module;let o = exports;
    "use strict";

    cc._RF.push(t, "12cd72NrRtIL4AVAQhHwU48", "3D_ballRoll");
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
    var r = e("GlobalConfig.js"),
      l = cc._decorator,
      s = l.ccclass,
      c = l.property,
      u = r.ball_radius,
      p = Math.PI / 180,
      d = function (e) {
        i(t, e);
        function t() {
          var t = null !== e && e.apply(this, arguments) || this;
          t.pos_node = null;
          t.shadow_node = null;
          t.bind_node_ps = !1;
          t.isShowShadow = !0;
          t.lastx = null;
          t.lasty = null;
          t.quat = null;
          return t;
        }
        t.prototype.onLoad = function () {
          this.lastx = 0;
          this.lasty = 0;
          if (this.pos_node) {
            this.lastx = this.pos_node.x;
            this.lasty = this.pos_node.y;
          }
          this.quat = cc.quat();
          cc.Quat.rotateY(this.quat, this.quat, 150 * p);
          this.node.setRotation(this.quat);
        };
        t.prototype.setShowShadow = function (e) {
          this.isShowShadow = e;
          this.shadow_node.active = e;
        };
        t.prototype.oneStep = function () {
          var e = this.pos_node.x,
            t = this.pos_node.y,
            o = cc.Vec2.distance(cc.v2(e, t), cc.v2(this.lastx, this.lasty));
          if (o > 0) {
            var n = cc.v2(e - this.lastx, t - this.lasty),
              i = cc.v2(0, 0);
            n.rotate(90 * p, i);
            var a = o / (2 * u);
            a %= Math.PI;
            var r = cc.v3(i.x, i.y, 0);
            r = r.normalizeSelf();
            cc.Quat.rotateAround(this.quat, this.quat, r, a);
            this.node.setRotation(this.quat);
            this.lastx = this.pos_node.x;
            this.lasty = this.pos_node.y;
          }
          if (this.bind_node_ps) {
            this.node.parent.x = this.pos_node.x;
            this.node.parent.y = this.pos_node.y;
            var l = this.node.parent.x / 1500 * 20,
              s = this.node.parent.y / 1500 * 20;
            this.shadow_node.x = this.node.parent.x + l;
            this.shadow_node.y = this.node.parent.y + s;
          }
        };
        t.prototype.update = function (e) {
          this.oneStep(e);
        };
        a([c(cc.Node)], t.prototype, "pos_node", void 0);
        a([c(cc.Node)], t.prototype, "shadow_node", void 0);
        a([c], t.prototype, "bind_node_ps", void 0);
        a([c], t.prototype, "isShowShadow", void 0);
        return a([s("3D_ballRoll")], t);
      }(cc.Component);
    o.default = d;
    cc._RF.pop();
