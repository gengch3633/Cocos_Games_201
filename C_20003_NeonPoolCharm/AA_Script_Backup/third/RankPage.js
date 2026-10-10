let e = require;let t = module;let o = exports;
    "use strict";

    cc._RF.push(t, "3ced0CMj99FDqR4w+/OlHKQ", "RankPage");
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
          t.RankPage = null;
          t.node = null;
          t.list = null;
          t.list_bg = null;
          t.head_bg = null;
          t.pe = null;
          t.na = null;
          t.ju = null;
          t.ak = null;
          t.ScrollView = null;
          t.view = null;
          t.content = null;
          t.rankItem = null;
          t.rank_num = null;
          t.rank_icon = null;
          t.Name = null;
          t.level = null;
          t.cash = null;
          t.bg = null;
          t.tittle = null;
          t.tip = null;
          t.lab_des = null;
          t.pop_close = null;
          return t;
        }
        t.prototype.onLoad = function () {
          this.RankPage = this.node;
          this.list = this.RankPage.getChildByName("list");
          this.list_bg = this.list.getChildByName("list_bg");
          this.head_bg = this.list_bg.getChildByName("head_bg");
          this.pe = this.head_bg.getChildByName("pe");
          this.na = this.head_bg.getChildByName("na");
          this.ju = this.head_bg.getChildByName("ju");
          this.ak = this.head_bg.getChildByName("ak");
          this.ScrollView = this.list.getChildByName("ScrollView");
          this.view = this.ScrollView.getChildByName("view");
          this.content = this.view.getChildByName("content");
          this.rankItem = this.content.getChildByName("rankItem");
          this.rank_num = this.rankItem.getChildByName("rank_num");
          this.rank_icon = this.rankItem.getChildByName("rank_icon");
          this.Name = this.rankItem.getChildByName("Name");
          this.level = this.rankItem.getChildByName("level");
          this.cash = this.rankItem.getChildByName("cash");
          this.bg = this.RankPage.getChildByName("bg");
          this.tittle = this.RankPage.getChildByName("tittle");
          this.tip = this.RankPage.getChildByName("tip");
          this.lab_des = this.tip.getChildByName("lab_des");
          this.pop_close = this.RankPage.getChildByName("pop_close");
        };
        t.URL = "db://assets/resources/pages/RankPage.prefab";
        return a([r], t);
      }(cc.Component);
    o.default = l;
    cc._RF.pop();
