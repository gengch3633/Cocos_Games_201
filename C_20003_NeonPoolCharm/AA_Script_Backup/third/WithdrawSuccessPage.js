let e = require;let t = module;let o = exports;
    "use strict";

    cc._RF.push(t, "48f146TR3JO/YuFJgVmLt1e", "WithdrawSuccessPage");
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
          t.WithdrawSuccessPage = null;
          t.node = null;
          t.sk = null;
          t.page_bg = null;
          t.icon_yelow = null;
          t.title_label = null;
          t.bg_withdaw1 = null;
          t.bg_withdaw2 = null;
          t.mid = null;
          t.metode = null;
          t.line2 = null;
          t.phone_label = null;
          t.line1 = null;
          t.platform_root = null;
          t.dana = null;
          t.danaplat = null;
          t.ovo = null;
          t.ovoplat = null;
          t.shopppay = null;
          t.shopppayplat = null;
          t.account = null;
          t.btn = null;
          t.btn_confirm_label = null;
          t.des = null;
          t.des_1 = null;
          t.cash = null;
          return t;
        }
        t.prototype.onLoad = function () {
          this.WithdrawSuccessPage = this.node;
          this.sk = this.WithdrawSuccessPage.getChildByName("sk");
          this.page_bg = this.WithdrawSuccessPage.getChildByName("page_bg");
          this.icon_yelow = this.page_bg.getChildByName("icon_yelow");
          this.title_label = this.page_bg.getChildByName("title_label");
          this.bg_withdaw1 = this.page_bg.getChildByName("bg_withdaw1");
          this.bg_withdaw2 = this.page_bg.getChildByName("bg_withdaw2");
          this.mid = this.page_bg.getChildByName("mid");
          this.metode = this.mid.getChildByName("metode");
          this.line2 = this.mid.getChildByName("line2");
          this.phone_label = this.mid.getChildByName("phone_label");
          this.line1 = this.mid.getChildByName("line1");
          this.platform_root = this.mid.getChildByName("platform_root");
          this.dana = this.platform_root.getChildByName("dana");
          this.danaplat = this.platform_root.getChildByName("danaplat");
          this.ovo = this.mid.getChildByName("ovo");
          this.ovoplat = this.ovo.getChildByName("ovoplat");
          this.shopppay = this.mid.getChildByName("shopppay");
          this.shopppayplat = this.shopppay.getChildByName("shopppayplat");
          this.account = this.mid.getChildByName("account");
          this.btn = this.page_bg.getChildByName("btn");
          this.btn_confirm_label = this.btn.getChildByName("btn_confirm_label");
          this.des = this.page_bg.getChildByName("des");
          this.des_1 = this.page_bg.getChildByName("des_1");
          this.cash = this.page_bg.getChildByName("cash");
        };
        t.URL = "db://assets/resources/pages/WithdrawSuccessPage.prefab";
        return a([r], t);
      }(cc.Component);
    o.default = l;
    cc._RF.pop();
