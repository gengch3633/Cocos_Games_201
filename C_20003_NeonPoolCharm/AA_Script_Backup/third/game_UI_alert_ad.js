let e = require;let t = module;let o = exports;
    "use strict";

    cc._RF.push(t, "874feMO1g5Dia48K5ADxLr0", "game_UI_alert_ad");
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
    var r = e("BallLogicMgr.js"),
      l = cc._decorator,
      s = l.ccclass,
      c = (l.property, function (e) {
        i(t, e);
        function t() {
          var t = null !== e && e.apply(this, arguments) || this;
          t.callback = null;
          t.callback_ok = null;
          t.callback_no = null;
          t.stay_ok = null;
          return t;
        }
        t.prototype.setOKStay = function () {
          this.stay_ok = !0;
        };
        t.prototype.closeAndDestroy = function () {
          this.node.parent = null;
          this.node.destroy();
          r.destroyAD();
        };
        t.prototype.onLoad = function () {
          var e = this;
          this.callback_ok = this.callback_ok || null;
          this.stay_ok = this.stay_ok || null;
          cc.find("button_close", this.node).on("click", function () {
            e.closeAndDestroy();
          });
          var t = cc.find("button_ok", this.node);
          t.on("click", function () {
            e.callback_ok && e.callback_ok();
            e.stay_ok || e.closeAndDestroy();
          });
          var o = cc.find("button_no", this.node);
          o.on("click", function () {
            e.callback_no && e.callback_no();
            e.closeAndDestroy();
          });
          var n = cc.winSize;
          console.log("getWinSize size", n);
          var i = n.height - 1280;
          t.y = t.y - i / 2;
          o.y = o.y - i / 2;
          console.log("button_ok y", t.y);
        };
        t.prototype.setCallback = function (e) {
          this.callback = e;
        };
        t.prototype.show = function (e, t, o, n, i, a) {
          this.callback_ok = t;
          this.callback_no = o;
          cc.find("label_content", this.node).getComponent(cc.Label).string = e;
          n && (cc.find("button_ok", this.node).getChildByName("Background").getChildByName("Label_ok").getComponent(cc.Label).string = n);
          i && (cc.find("button_no", this.node).getChildByName("Background").getChildByName("Label_no").getComponent(cc.Label).string = i);
          a && (cc.find("label_title", this.node).getComponent(cc.Label).string = a);
          r.showAD();
        };
        t.prototype.start = function () {};
        t.prototype.close = function () {
          this.node.parent = null;
        };
        return a([s], t);
      }(cc.Component));
    o.default = c;
    cc._RF.pop();
