let e = require;let t = module;let o = exports;
    "use strict";

    cc._RF.push(t, "d196dKNGyFCcqBVNhEikrpl", "GmPageInGame");
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
          t.GmPageInGame = null;
          t.node = null;
          t.main_content = null;
          t.level_success = null;
          t.Background = null;
          t.Label = null;
          t.close_btn = null;
          t.ad_switch_btn = null;
          t.ad_btn_label = null;
          t.attri_setting_aera = null;
          t.attri_setting_bg = null;
          t.use_attri_btn = null;
          t.recover_attri_btn = null;
          t.attri_power_editbox = null;
          t.BACKGROUND_SPRITE = null;
          t.TEXT_LABEL = null;
          t.PLACEHOLDER_LABEL = null;
          t.attri_spin_editbox = null;
          t.attri_aimming_editbox = null;
          return t;
        }
        t.prototype.onLoad = function () {
          this.GmPageInGame = this.node;
          this.main_content = this.GmPageInGame.getChildByName("main_content");
          this.level_success = this.main_content.getChildByName("level_success");
          this.Background = this.level_success.getChildByName("Background");
          this.Label = this.Background.getChildByName("Label");
          this.close_btn = this.main_content.getChildByName("close_btn");
          this.ad_switch_btn = this.main_content.getChildByName("ad_switch_btn");
          this.ad_btn_label = this.Background.getChildByName("ad_btn_label");
          this.attri_setting_aera = this.main_content.getChildByName("attri_setting_aera");
          this.attri_setting_bg = this.attri_setting_aera.getChildByName("attri_setting_bg");
          this.use_attri_btn = this.attri_setting_aera.getChildByName("use_attri_btn");
          this.recover_attri_btn = this.attri_setting_aera.getChildByName("recover_attri_btn");
          this.attri_power_editbox = this.attri_setting_aera.getChildByName("attri_power_editbox");
          this.BACKGROUND_SPRITE = this.attri_power_editbox.getChildByName("BACKGROUND_SPRITE");
          this.TEXT_LABEL = this.attri_power_editbox.getChildByName("TEXT_LABEL");
          this.PLACEHOLDER_LABEL = this.attri_power_editbox.getChildByName("PLACEHOLDER_LABEL");
          this.attri_spin_editbox = this.attri_setting_aera.getChildByName("attri_spin_editbox");
          this.attri_aimming_editbox = this.attri_setting_aera.getChildByName("attri_aimming_editbox");
        };
        t.URL = "db://assets/resources/pages/GmPageInGame.prefab";
        return a([r], t);
      }(cc.Component);
    o.default = l;
    cc._RF.pop();
