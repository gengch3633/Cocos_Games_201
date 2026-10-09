let e = require;let t = module;let o = exports;
    "use strict";

    cc._RF.push(t, "0ec78Sq/v5BL645cUhOAPZP", "GameHelpPage");
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
          t.GameHelpPage = null;
          t.node = null;
          t.root = null;
          t.jiantou = null;
          t.jiantou_heng = null;
          t.mask_right = null;
          t.bg = null;
          t.mask_buttom = null;
          t.obj_tips_1 = null;
          t.lab_tips_1 = null;
          t.bg_qipao_1_3 = null;
          t.obj_tips_2 = null;
          t.lab_tips_2 = null;
          t.obj_tips_3 = null;
          t.icon_caihongdong = null;
          t.icon_daoju_miaozhun = null;
          t.icon_daoju_baiqiu = null;
          t.lab_tips_3_1 = null;
          t.lab_tips_3_2 = null;
          t.lab_tips_3_3 = null;
          t.lab_continue = null;
          t.btn_close = null;
          return t;
        }
        t.prototype.onLoad = function () {
          this.GameHelpPage = this.node;
          this.root = this.GameHelpPage.getChildByName("root");
          this.jiantou = this.root.getChildByName("jiantou");
          this.jiantou_heng = this.root.getChildByName("jiantou_heng");
          this.mask_right = this.root.getChildByName("mask_right");
          this.bg = this.mask_right.getChildByName("bg");
          this.mask_buttom = this.root.getChildByName("mask_buttom");
          this.obj_tips_1 = this.root.getChildByName("obj_tips_1");
          this.lab_tips_1 = this.obj_tips_1.getChildByName("lab_tips_1");
          this.bg_qipao_1_3 = this.obj_tips_1.getChildByName("bg_qipao_1_3");
          this.obj_tips_2 = this.root.getChildByName("obj_tips_2");
          this.lab_tips_2 = this.obj_tips_2.getChildByName("lab_tips_2");
          this.obj_tips_3 = this.root.getChildByName("obj_tips_3");
          this.icon_caihongdong = this.obj_tips_3.getChildByName("icon_caihongdong");
          this.icon_daoju_miaozhun = this.obj_tips_3.getChildByName("icon_daoju_miaozhun");
          this.icon_daoju_baiqiu = this.obj_tips_3.getChildByName("icon_daoju_baiqiu");
          this.lab_tips_3_1 = this.obj_tips_3.getChildByName("lab_tips_3_1");
          this.lab_tips_3_2 = this.obj_tips_3.getChildByName("lab_tips_3_2");
          this.lab_tips_3_3 = this.obj_tips_3.getChildByName("lab_tips_3_3");
          this.lab_continue = this.root.getChildByName("lab_continue");
          this.btn_close = this.root.getChildByName("btn_close");
        };
        t.URL = "db://assets/resources/pages/GameHelpPage.prefab";
        return a([r], t);
      }(cc.Component);
    o.default = l;
    cc._RF.pop();
