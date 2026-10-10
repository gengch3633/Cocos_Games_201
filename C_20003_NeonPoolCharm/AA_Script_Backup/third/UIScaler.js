let e = require;let t = module;let o = exports;
    "use strict";

    cc._RF.push(t, "8c0cbKO+1tJ+I5539Z5dV0a", "UIScaler");
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
      s = r.executeInEditMode,
      c = r.property,
      u = function (e) {
        i(t, e);
        function t() {
          var t = null !== e && e.apply(this, arguments) || this;
          t._maxWidth = 0;
          t._maxHeight = 0;
          return t;
        }
        Object.defineProperty(t.prototype, "maxWidth", {
          get: function () {
            return this._maxWidth;
          },
          set: function (e) {
            if (e !== this._maxWidth) {
              this._maxWidth = e;
              this._updateScale();
            }
          },
          enumerable: !1,
          configurable: !0
        });
        Object.defineProperty(t.prototype, "maxHeight", {
          get: function () {
            return this._maxHeight;
          },
          set: function (e) {
            if (e !== this._maxHeight) {
              this._maxHeight = e;
              this._updateScale();
            }
          },
          enumerable: !1,
          configurable: !0
        });
        t.prototype.onLoad = function () {
          this.node.on(cc.Node.EventType.SIZE_CHANGED, this._updateScale, this);
        };
        t.prototype._updateScale = function () {
          var e = this.node.getContentSize(),
            t = this._maxWidth > 0 ? this._maxWidth / e.width : 1,
            o = this._maxHeight > 0 ? this._maxHeight / e.height : 1;
          this.node.scale = Math.min(t, o);
        };
        t.prototype.onEnable = function () {
          this._updateScale();
        };
        t.prototype.onDestroy = function () {
          this.node.off(cc.Node.EventType.SIZE_CHANGED, this._updateScale, this);
        };
        a([c], t.prototype, "maxWidth", null);
        a([c], t.prototype, "maxHeight", null);
        a([c], t.prototype, "_maxWidth", void 0);
        a([c], t.prototype, "_maxHeight", void 0);
        return a([l, s()], t);
      }(cc.Component);
    o.default = u;
    cc._RF.pop();
