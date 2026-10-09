let e = require;let t = module;let o = exports;
    "use strict";

    cc._RF.push(t, "d61bex4i5xCLqySAuIxea0J", "game_UI_tips");
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
          t.callback = null;
          t.callback_ok = null;
          return t;
        }
        t.prototype.show = function (e, t, o) {
          this.callback_ok = t;
          cc.find("label_content", this.node).getComponent(cc.Label).string = e;
          cc.find("label_title", this.node).getComponent(cc.Label).string = "";
          o && (cc.find("button_ok", this.node).getChildByName("Background").getChildByName("Label_ok").getComponent(cc.Label).string = o);
        };
        t.prototype.onLoad = function () {
          var e = this;
          this.callback_ok = this.callback_ok || null;
          cc.find("button_close", this.node).on("click", function () {
            e.closeAndDestroy();
          });
          cc.find("button_ok", this.node).on("click", function () {
            e.callback_ok && e.callback_ok();
            e.closeAndDestroy();
          });
        };
        t.prototype.setCallback = function (e) {
          this.callback = e;
        };
        t.prototype.close = function () {
          this.node.parent = null;
        };
        t.prototype.closeAndDestroy = function () {
          this.node.parent = null;
          this.node.destroy();
        };
        t.prototype.start = function () {};
        return a([l], t);
      }(cc.Component));
    o.default = s;
    cc._RF.pop();
