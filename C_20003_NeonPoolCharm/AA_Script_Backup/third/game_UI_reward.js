let e = require;let t = module;let o = exports;
    "use strict";

    cc._RF.push(t, "c3fb2E7raBKi478Oeh8ZQe9", "game_UI_reward");
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
          t.hall = null;
          t.node = null;
          t.callback_ok = null;
          return t;
        }
        t.prototype.close = function () {
          this.node.parent = null;
        };
        t.prototype.setCallback = function (e) {
          this.callback = e;
        };
        t.prototype.onLoad = function () {
          var e = this;
          this.callback_ok = this.callback_ok || null;
          this.hall = this.hall || null;
          var t = cc.find("toggle_video", this.node),
            o = cc.find("button_ok", this.node);
          cc.find("cm_movie", o);
          o.on("click", function () {
            if (r.checkCanRewardToday()) r.addCoin(200, function () {
              e.hall.showTip("恭喜获得双倍奖励！+200金币");
              r.saveOneMoreRewardTime();
              e.hall.updateCoin();
              e.closeAndDestroy();
            });else {
              console.log("max times");
              e.hall.showTip("今日没有更多奖励了！");
            }
          });
          cc.find("button_close", this.node).on("click", function () {
            e.hall.checkTTState();
            e.closeAndDestroy();
          });
          t && t.on("toggle", function (e) {
            console.log("toggle", e.isChecked);
          });
        };
        t.prototype.show = function (e) {
          this.hall = e;
          this.node.parent = e.node.getChildByName("node_reward");
        };
        t.prototype.closeAndDestroy = function () {
          if (this.node) {
            this.node.parent = null;
            this.node.destroy();
          }
        };
        t.prototype.start = function () {};
        return a([s], t);
      }(cc.Component));
    o.default = c;
    cc._RF.pop();
