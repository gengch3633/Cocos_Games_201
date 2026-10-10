let e = require;let t = module;let o = exports;
    "use strict";

    cc._RF.push(t, "c33c3zPNNpHeLKLeJqNHful", "withdrawItem");
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
    var r = cc._decorator.ccclass,
      l = function (e) {
        i(t, e);
        function t() {
          var t = null !== e && e.apply(this, arguments) || this;
          t.withdrawItem = null;
          t.node = null;
          t.bg04 = null;
          t.bg05 = null;
          t.title_bg = null;
          t.title_root = null;
          t.title_level_label = null;
          t.title_label = null;
          t.btn_close = null;
          t.spr_content_in = null;
          t.cash_icon = null;
          t.lab_cash = null;
          t.des2 = null;
          t.btn = null;
          t.gray_btn_label = null;
          t.btn_yellow = null;
          t.yellow_btn_label = null;
          return t;
        }
        t.prototype.onLoad = function () {
          this.withdrawItem = this.node;
          this.bg04 = this.withdrawItem.getChildByName("bg04");
          this.bg05 = this.bg04.getChildByName("bg05");
          this.title_bg = this.withdrawItem.getChildByName("title_bg");
          this.title_root = this.withdrawItem.getChildByName("title_root");
          this.title_level_label = this.title_root.getChildByName("title_level_label");
          this.title_label = this.title_root.getChildByName("title_label");
          this.btn_close = this.withdrawItem.getChildByName("btn_close");
          this.spr_content_in = this.withdrawItem.getChildByName("spr_content_in");
          this.cash_icon = this.spr_content_in.getChildByName("cash_icon");
          this.lab_cash = this.spr_content_in.getChildByName("lab_cash");
          this.des2 = this.withdrawItem.getChildByName("des2");
          this.btn = this.withdrawItem.getChildByName("btn");
          this.gray_btn_label = this.btn.getChildByName("gray_btn_label");
          this.btn_yellow = this.withdrawItem.getChildByName("btn_yellow");
          this.yellow_btn_label = this.btn_yellow.getChildByName("yellow_btn_label");
        };
        t.URL = "db://assets/resources/prefabs/withdrawItem.prefab";
        return a([r], t);
      }(cc.Component);
    o.default = l;
    cc._RF.pop();
