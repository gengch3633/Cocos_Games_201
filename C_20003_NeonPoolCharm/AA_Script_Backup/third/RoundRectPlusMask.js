let e = require;let t = module;let o = exports;
    "use strict";

    cc._RF.push(t, "07b13VEHl1LVZkx6CzAxrz1", "RoundRectPlusMask");
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
    o.RoundRectPlusMask = void 0;
    var r = cc._decorator,
      l = r.property,
      s = r.ccclass,
      c = r.executeInEditMode,
      u = r.disallowMultiple,
      p = r.requireComponent,
      d = r.menu;
    cc.macro.ENABLE_WEBGL_ANTIALIAS = !0;
    var _ = function (e) {
      i(t, e);
      function t() {
        var t = null !== e && e.apply(this, arguments) || this;
        t._lt = 50;
        t._rt = 50;
        t._rb = 50;
        t._lb = 50;
        t.mask = null;
        return t;
      }
      Object.defineProperty(t.prototype, "lt", {
        get: function () {
          return this._lt;
        },
        set: function (e) {
          this._lt = e;
          this.updateMask("lt", e);
        },
        enumerable: !1,
        configurable: !0
      });
      Object.defineProperty(t.prototype, "rt", {
        get: function () {
          return this._rt;
        },
        set: function (e) {
          this._rt = e;
          this.updateMask("rt", e);
        },
        enumerable: !1,
        configurable: !0
      });
      Object.defineProperty(t.prototype, "rb", {
        get: function () {
          return this._rb;
        },
        set: function (e) {
          this._rb = e;
          this.updateMask("rb", e);
        },
        enumerable: !1,
        configurable: !0
      });
      Object.defineProperty(t.prototype, "lb", {
        get: function () {
          return this._lb;
        },
        set: function (e) {
          this._lb = e;
          this.updateMask("lb", e);
        },
        enumerable: !1,
        configurable: !0
      });
      t.prototype.onLoad = function () {
        this.mask = this.getComponent(cc.Mask);
        this.updateMask("lt", this.lt);
        this.updateMask("rt", this.rt);
        this.updateMask("rb", this.rb);
        this.updateMask("lb", this.lb);
      };
      t.prototype.onDraw = function (e) {
        var t, o;
        e.clear(!1);
        var n = this.node,
          i = n.width,
          a = n.height,
          r = -i * n.anchorX,
          l = -a * n.anchorY;
        this.roundRect(e, r, l, i, a, this.lt || 0, this.rt || 0, this.rb || 0, this.lb || 0);
        null === (o = null === (t = e._impl) || void 0 === t ? void 0 : t._curPath) || void 0 === o || (o.complex = !1);
        cc.game.renderType === cc.game.RENDER_TYPE_CANVAS ? e.stroke() : e.fill();
      };
      t.prototype.roundRect = function (e, t, o, n, i, a, r, l, s) {
        var c = Math.min(a, .5 * Math.abs(n)) * Math.sign(n),
          u = Math.min(a, .5 * Math.abs(i)) * Math.sign(i),
          p = Math.min(r, .5 * Math.abs(n)) * Math.sign(n),
          d = Math.min(r, .5 * Math.abs(i)) * Math.sign(i),
          _ = Math.min(l, .5 * Math.abs(n)) * Math.sign(n),
          f = Math.min(l, .5 * Math.abs(i)) * Math.sign(i),
          h = Math.min(s, .5 * Math.abs(n)) * Math.sign(n),
          g = Math.min(s, .5 * Math.abs(i)) * Math.sign(i);
        e.moveTo(t, o + g);
        e.lineTo(t, o + i - u);
        e.bezierCurveTo(t, o + i - .44771525069999996 * u, t + .44771525069999996 * c, o + i, t + c, o + i);
        e.lineTo(t + n - p, o + i);
        e.bezierCurveTo(t + n - .44771525069999996 * p, o + i, t + n, o + i - .44771525069999996 * d, t + n, o + i - d);
        e.lineTo(t + n, o + f);
        e.bezierCurveTo(t + n, o + .44771525069999996 * f, t + n - .44771525069999996 * _, o, t + n - _, o);
        e.lineTo(t + h, o);
        e.bezierCurveTo(t + .44771525069999996 * h, o, t, o + .44771525069999996 * g, t, o + g);
        e.close();
      };
      t.prototype._updateGraphics = function () {
        var e = this._graphics;
        e && this.onDraw(e);
      };
      t.prototype.updateMask = function (e, t) {
        var o = t >= 0 ? t : 0;
        o < 1 && (o = Math.min(this.node.width, this.node.height) * o);
        this.mask[e] = o;
        this.mask.onDraw = this.onDraw.bind(this.mask);
        this.mask._updateGraphics = this._updateGraphics.bind(this.mask);
        this.mask.roundRect = this.roundRect.bind(this.mask);
        this.mask.type = cc.Mask.Type.RECT;
      };
      a([l()], t.prototype, "_lt", void 0);
      a([l()], t.prototype, "_rt", void 0);
      a([l()], t.prototype, "_rb", void 0);
      a([l()], t.prototype, "_lb", void 0);
      a([l({
        tooltip: "圆角半径:\n0-1之间为最小边长比例值, \n>1为具体像素值"
      })], t.prototype, "lt", null);
      a([l({
        tooltip: "圆角半径:\n0-1之间为最小边长比例值, \n>1为具体像素值"
      })], t.prototype, "rt", null);
      a([l({
        tooltip: "圆角半径:\n0-1之间为最小边长比例值, \n>1为具体像素值"
      })], t.prototype, "rb", null);
      a([l({
        tooltip: "圆角半径:\n0-1之间为最小边长比例值, \n>1为具体像素值"
      })], t.prototype, "lb", null);
      return a([s(), c(!0), u(!0), p(cc.Mask), d("渲染组件/圆角遮罩Plus")], t);
    }(cc.Component);
    o.RoundRectPlusMask = _;
    cc._RF.pop();
