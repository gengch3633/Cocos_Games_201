let e = require;let t = module;let o = exports;
    "use strict";

    cc._RF.push(t, "c55f8KErFdMqYX98f4pf9w0", "CueAttriItemCtr");
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
      s = r.menu,
      c = r.property,
      u = (cc._decorator, function (e) {
        i(t, e);
        function t() {
          var t = null !== e && e.apply(this, arguments) || this;
          t.attri_item_title = null;
          t.attri_percenter = null;
          t.attri_progress_bar_big = null;
          t.attri_progress_bar_cur = null;
          t.attri_progress_bar_less = null;
          t._bar_big_orign_w = null;
          t._bar_cur_orign_w = null;
          t._bar_less_orign_w = null;
          t._attriType = null;
          return t;
        }
        Object.defineProperty(t.prototype, "attriType", {
          get: function () {
            return this._attriType;
          },
          enumerable: !1,
          configurable: !0
        });
        t.prototype.onLoad = function () {
          this._bar_big_orign_w = this.attri_progress_bar_big.width;
          this._bar_cur_orign_w = this.attri_progress_bar_cur.width;
          this._bar_less_orign_w = this.attri_progress_bar_less.width;
        };
        t.prototype.updateData = function (e, t, o) {
          this.attri_progress_bar_cur.width = this._bar_cur_orign_w * e;
          this.attri_percenter.string = Math.floor(100 * e) + "%";
          if (o) {
            this.attri_progress_bar_big.active = !1;
            this.attri_progress_bar_less.active = !1;
          } else if (e >= t) {
            this.attri_progress_bar_big.active = !1;
            this.attri_progress_bar_less.active = !0;
            this.attri_progress_bar_less.width = this._bar_less_orign_w * e;
            cc.tween(this.attri_progress_bar_less).to(.2, {
              width: this._bar_less_orign_w * t
            }).start();
          } else {
            this.attri_progress_bar_big.active = !0;
            this.attri_progress_bar_less.active = !1;
            this.attri_progress_bar_big.width = this._bar_big_orign_w * e;
            cc.tween(this.attri_progress_bar_big).to(.2, {
              width: this._bar_big_orign_w * t
            }).start();
          }
        };
        t.prototype.initData = function (e, t, o, n) {
          this._attriType = e;
          var i = i18n.t("cuename_" + e);
          this.attri_item_title.string = i;
          this.updateData(t, o, n);
        };
        a([c(cc.Label)], t.prototype, "attri_item_title", void 0);
        a([c(cc.Label)], t.prototype, "attri_percenter", void 0);
        a([c(cc.Node)], t.prototype, "attri_progress_bar_big", void 0);
        a([c(cc.Node)], t.prototype, "attri_progress_bar_cur", void 0);
        a([c(cc.Node)], t.prototype, "attri_progress_bar_less", void 0);
        return a([l, s("UI/pages/items/CueAttriItemCtr")], t);
      }(cc.Component));
    o.default = u;
    cc._RF.pop();
