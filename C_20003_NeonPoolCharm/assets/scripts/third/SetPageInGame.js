let e = require;let t = module;let o = exports;
    "use strict";

    cc._RF.push(t, "de253nM0hpHDotzaw9ZJlir", "SetPageInGame");
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
          t.SetPageInGame = null;
          t.node = null;
          t.page_bg = null;
          t.titleLabel = null;
          t.btn_close = null;
          t.btn_music = null;
          t.icon_on = null;
          t.icon_off = null;
          t.btn_sound = null;
          t.icon_sound_on = null;
          t.icon_sound_off = null;
          t.btn_shake = null;
          t.icon_shake_on = null;
          t.icon_shake_off = null;
          t.Layout = null;
          t.btn_quit = null;
          t.label_quit = null;
          t.btn_more_game = null;
          t.label_more_game = null;
          t.policy = null;
          return t;
        }
        t.prototype.onLoad = function () {
          this.SetPageInGame = this.node;
          this.page_bg = this.SetPageInGame.getChildByName("page_bg");
          this.titleLabel = this.page_bg.getChildByName("titleLabel");
          this.btn_close = this.page_bg.getChildByName("btn_close");
          this.btn_music = this.page_bg.getChildByName("btn_music");
          this.icon_on = this.btn_music.getChildByName("icon_on");
          this.icon_off = this.btn_music.getChildByName("icon_off");
          this.btn_sound = this.page_bg.getChildByName("btn_sound");
          this.icon_sound_on = this.btn_sound.getChildByName("icon_sound_on");
          this.icon_sound_off = this.btn_sound.getChildByName("icon_sound_off");
          this.btn_shake = this.page_bg.getChildByName("btn_shake");
          this.icon_shake_on = this.btn_shake.getChildByName("icon_shake_on");
          this.icon_shake_off = this.btn_shake.getChildByName("icon_shake_off");
          this.Layout = this.page_bg.getChildByName("Layout");
          this.btn_more_game = this.Layout.getChildByName("btn_more_game");
          this.label_more_game = this.btn_more_game.getChildByName("label_more_game");
          this.btn_quit = this.Layout.getChildByName("btn_quit");
          this.label_quit = this.btn_quit.getChildByName("label_quit");
          this.policy = this.Layout.getChildByName("policy");
        };
        t.URL = "db://assets/resources/pages/SetPageInGame.prefab";
        return a([r], t);
      }(cc.Component);
    o.default = l;
    cc._RF.pop();
