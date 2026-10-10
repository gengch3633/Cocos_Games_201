let e = require;let t = module;let o = exports;
    "use strict";

    cc._RF.push(t, "062aaruUm1HALf3SekD0OeX", "WithdrawItemCtrl");
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
    var r = e("PlayerDataSys.js"),
      l = e("EventMgr.js"),
      s = e("GameEventType.js"),
      c = e("SdkHelper.js"),
      u = e("EngineUtil.js"),
      p = e("PageMgr.js"),
      d = e("UiManage.js"),
      _ = e("withdrawItem.js"),
      f = cc._decorator,
      h = f.ccclass,
      g = f.menu;
    cc._decorator.property;
    var y = function (e) {
      i(t, e);
      function t() {
        var t = null !== e && e.apply(this, arguments) || this;
        t.ui = null;
        t.current = !1;
        t.isalone = !1;
        return t;
      }
      t.prototype.clickClose = function () {
        l.default.trigger(s.default.CLOSE_WITHDRAWPAGE);
      };
      t.prototype.addButtonListen = function () {
        d.UiManager.addButtonListen(this.ui.btn_close, this.clickClose, this);
        d.UiManager.addButtonListen(this.ui.btn, this.clickWithdraw, this);
        d.UiManager.addButtonListen(this.ui.btn_yellow, this.clickGoWithdraw, this);
      };
      t.prototype.goMain = function () {};
      t.prototype.onLoad = function () {
        this.onUILoad();
        this.addButtonListen();
      };
      t.prototype.start = function () {};
      t.prototype.onUILoad = function () {
        this.ui = this.node.addComponent(_.default);
        this.ui.yellow_btn_label.getComponent(cc.Label).string = i18n.t("common_extract");
        this.ui.gray_btn_label.getComponent(cc.Label).string = i18n.t("common_extract");
        this.ui.des2.getComponent(cc.Label).string = i18n.t("tixian_ui_desc");
      };
      t.prototype.clickWithdraw = function () {
        u.default.showManageViewToast(i18n.t("challenge_6"));
      };
      t.prototype.clickGoWithdraw = function () {
        p.default.showPage("InformationPage", {
          level: this.level,
          cash: this.cash_balance
        });
      };
      t.prototype.initData = function (e) {
        if (e) {
          var t = e.cash_balance,
            o = e.difficult,
            n = e.level,
            i = e.status;
          this.cash_balance = t;
          this.difficult = o;
          this.level = n;
          this.status = i;
          this.ui.title_label.getComponent(cc.Label).string = "" + n;
          if (this.level == r.default.user_level) {
            this.ui.btn_close.active = !0;
            this.ui.btn_yellow.active = !1;
            this.ui.btn.active = !0;
            this.numUp();
          } else c.default.reportData("fee_payment_page", null, !0);
          this.ui.lab_cash.getComponent(cc.Label).string = r.default.getCashWithUnit(t);
        }
      };
      t.prototype.numUp = function () {
        var e = this.ui.lab_cash.getComponent(cc.Label);
        cc.tween({
          a: 0
        }).to(.7, {
          a: this.cash_balance
        }, {
          progress: function (t, o, n, i) {
            var a = Math.round(o * i);
            e.string = String(r.default.getCashWithUnit(a));
            return a;
          }
        }).start();
      };
      t.prefabUrl = "assets/resources/prefabs/withdrawItem";
      t.className = "WithdrawItemCtrl";
      return a([h, g("UI/prefabs/WithdrawItemCtrl")], t);
    }(cc.Component);
    o.default = y;
    cc._RF.pop();
