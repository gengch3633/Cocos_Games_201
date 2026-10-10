let e = require;let t = module;let o = exports;
    "use strict";

    cc._RF.push(t, "a5adao2rLVHQ5bDZCo0IiL6", "cue_list_item");
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
          t.cue_list_item = null;
          t.node = null;
          t.cue_list_item_root = null;
          t.bg_2 = null;
          t.cue_icon = null;
          t.sp_border = null;
          t.lock_info_area = null;
          t.lock_info_bg = null;
          t.lock_info_lock = null;
          t.icon_qiugan_suipian = null;
          t.label_unlock = null;
          t.ad_info_area = null;
          t.pb_4_2 = null;
          t.label_ad_get = null;
          t.use_info_area = null;
          t.pb_cue_item_use = null;
          return t;
        }
        t.prototype.onLoad = function () {
          this.cue_list_item = this.node;
          this.cue_list_item_root = this.cue_list_item.getChildByName("cue_list_item_root");
          this.bg_2 = this.cue_list_item_root.getChildByName("bg_2");
          this.cue_icon = this.cue_list_item_root.getChildByName("cue_icon");
          this.sp_border = this.cue_list_item_root.getChildByName("sp_border");
          this.lock_info_area = this.cue_list_item_root.getChildByName("lock_info_area");
          this.lock_info_bg = this.lock_info_area.getChildByName("lock_info_bg");
          this.lock_info_lock = this.lock_info_area.getChildByName("lock_info_lock");
          this.icon_qiugan_suipian = this.lock_info_area.getChildByName("icon_qiugan_suipian");
          this.label_unlock = this.lock_info_area.getChildByName("label_unlock");
          this.ad_info_area = this.cue_list_item_root.getChildByName("ad_info_area");
          this.pb_4_2 = this.ad_info_area.getChildByName("pb_4_2");
          this.label_ad_get = this.ad_info_area.getChildByName("label_ad_get");
          this.use_info_area = this.cue_list_item_root.getChildByName("use_info_area");
          this.pb_cue_item_use = this.use_info_area.getChildByName("pb_cue_item_use");
        };
        t.URL = "db://assets/prefabs/cue_list_item.prefab";
        return a([r], t);
      }(cc.Component);
    o.default = l;
    cc._RF.pop();
