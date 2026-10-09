let e = require;let t = module;let o = exports;
    "use strict";

    cc._RF.push(t, "5d334qB71NJDIZMl+KWyiJI", "PurchaseDataMgr");
    Object.defineProperty(o, "__esModule", {
      value: !0
    });
    var n = function () {
      function e() {
        this._map_skuDetail = new Map();
        this._cur_shop_id = "";
        this._map_skuScence = null;
        this._get_order_status_count = 0;
        this._map_pay_finish = new Map();
        this._set_repair = new Set();
      }
      Object.defineProperty(e.prototype, "set_repair", {
        get: function () {
          return this._set_repair;
        },
        set: function (e) {
          this._set_repair = e;
        },
        enumerable: !1,
        configurable: !0
      });
      Object.defineProperty(e.prototype, "map_pay_finish", {
        get: function () {
          return this._map_pay_finish;
        },
        set: function (e) {
          this._map_pay_finish = e;
        },
        enumerable: !1,
        configurable: !0
      });
      Object.defineProperty(e.prototype, "get_order_status_count", {
        get: function () {
          return this._get_order_status_count;
        },
        set: function (e) {
          this._get_order_status_count = e;
        },
        enumerable: !1,
        configurable: !0
      });
      Object.defineProperty(e.prototype, "map_skuScence", {
        get: function () {
          return this._map_skuScence;
        },
        set: function (e) {
          this._map_skuScence = e;
        },
        enumerable: !1,
        configurable: !0
      });
      Object.defineProperty(e.prototype, "map_skuDetail", {
        get: function () {
          return this._map_skuDetail;
        },
        set: function (e) {
          this._map_skuDetail = e;
        },
        enumerable: !1,
        configurable: !0
      });
      Object.defineProperty(e.prototype, "cur_shop_id", {
        get: function () {
          return this._cur_shop_id;
        },
        set: function (e) {
          this._cur_shop_id = e;
        },
        enumerable: !1,
        configurable: !0
      });
      return e;
    }();
    o.default = n;
    cc._RF.pop();
