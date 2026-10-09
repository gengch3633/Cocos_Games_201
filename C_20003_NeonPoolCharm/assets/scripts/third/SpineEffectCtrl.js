let e = require;let t = module;let o = exports;
    "use strict";

    cc._RF.push(t, "d18b6WrLNpH+bJM6K+aU2Oq", "SpineEffectCtrl");
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
    o.ESpineEffectName = void 0;
    var r = cc._decorator,
      l = r.ccclass,
      s = r.property;
    cc._decorator.menu;
    o.ESpineEffectName = {
      E_XiaoChu: "xiaochu"
    };
    var c = function (e) {
      i(t, e);
      function t() {
        var t = null !== e && e.apply(this, arguments) || this;
        t.effect_container = null;
        t._cb = null;
        t._curEffectNode = null;
        return t;
      }
      t.prototype.onLoad = function () {
        var e = this;
        this.effect_container.children.forEach(function (t) {
          t.getComponent(sp.Skeleton).setCompleteListener(e.onEffectComplete.bind(e));
          t.active = !1;
        });
      };
      t.prototype.onDisable = function () {
        this._cb = null;
        if (this._curEffectNode) {
          this._curEffectNode.active = !1;
          this._curEffectNode = null;
        }
      };
      t.prototype.playEffect = function (e, t) {
        if (this._curEffectNode) {
          this._curEffectNode.active = !1;
          this._curEffectNode = null;
        }
        this._curEffectNode = this.effect_container.getChildByName(e);
        this._curEffectNode || t && t(this.node);
        var o = this._curEffectNode.getComponent(sp.Skeleton);
        o.setAnimation(0, o.animation, !1);
        this._curEffectNode.active = !0;
        this._cb = t;
      };
      t.prototype.onEffectComplete = function () {
        if (this._curEffectNode) {
          this._curEffectNode.active = !1;
          this._curEffectNode = null;
        }
        this._cb && this._cb(this.node);
        this._cb = null;
      };
      a([s(cc.Node)], t.prototype, "effect_container", void 0);
      return a([l], t);
    }(cc.Component);
    o.default = c;
    cc._RF.pop();
