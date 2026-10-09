let e = require;let t = module;let o = exports;
    "use strict";

    cc._RF.push(t, "6b8a0sX4/hEAK63fxJmckS/", "GameHelpPageCtrl");
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
    var r = e("BasePageCtrl.js"),
      l = e("UiManage.js"),
      s = e("GameHelpPage.js"),
      c = cc._decorator,
      u = c.ccclass,
      p = c.menu;
    cc._decorator.property;
    var d = function (e) {
      i(t, e);
      function t() {
        var t = null !== e && e.apply(this, arguments) || this;
        t.ui = null;
        t._animType = null;
        t._touchControl = null;
        t._hasPeneLock = null;
        t._hasBlack = null;
        t._hasTouchLock = null;
        return t;
      }
      t.prototype.start = function () {};
      t.prototype.onLoad = function () {
        this.onUILoad();
        this._animType = r.AnimType.SCALE;
        this._touchControl = !1;
        this._hasPeneLock = !0;
        this._hasBlack = !1;
        this._hasTouchLock = !1;
        e.prototype.onLoad.call(this);
      };
      t.prototype._init = function () {
        l.UiManager.addButtonListen(this.ui.btn_close, this.clickClose, this);
      };
      t.prototype.clickClose = function () {
        this.hide();
      };
      t.prototype.onUILoad = function () {
        this.ui = this.node.addComponent(s.default);
      };
      t.prefabUrl = "GameHelpPage";
      t.className = "GameHelpPageCtrl";
      return a([u, p("UI/pages/GameHelpPageCtrl")], t);
    }(r.default);
    o.default = d;
    cc._RF.pop();
