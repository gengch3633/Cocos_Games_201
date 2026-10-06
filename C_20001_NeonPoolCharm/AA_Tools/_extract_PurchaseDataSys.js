PurchaseDataSys: [function (e, t, o) {
    "use strict";

    cc._RF.push(t, "a7ae1ToijJKQqjlajNTEzUI", "PurchaseDataSys");
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
      });
    Object.defineProperty(o, "__esModule", {
      value: !0
    });
    var a = e("../Event/EventMgr"),
      r = e("../Event/GameEventType"),
      l = e("../Utils/EngineUtil"),
      s = e("../../Models/GameDataMgr"),
      c = e("../../View/PageMgr"),
      u = e("../data/GlobalDataMgr"),
      p = e("../data/PurchaseDataMgr"),
      d = e("../Event/Handler"),
      _ = e("../SdkHelper"),
      f = e("../Service/GameService"),
      h = e("../../SystemConfig"),
      g = e("./PlayerDataSys"),
      y = function (e) {
        i(t, e);
        function t() {
          var t = null !== e && e.apply(this, arguments) || this;
          t.consumeSuccess = !1;
          t.map_skuScence = null;
          t.cur_shop_id = null;
          return t;
        }
        t.prototype.queryPurchapesResponseFail = function () {
          console.log("安卓手机queryPurchapesResponseFail");
        };
        t.prototype.addEvent = function () {
          a.default.listen(r.default.BILLINGSUCCESS, this.billings_success, this);
          a.default.listen(r.default.BILLINGFAILED, this.billings_fail, this);
          a.default.listen(r.default.SKUDETAILSUCCESS, this.sku_success, this);
          a.default.listen(r.default.SKUDETAILFAIL, this.sku_fail, this);
          a.default.listen(r.default.BILLINGBUYSUCCESS, this.billings_buy_success, this);
          a.default.listen(r.default.BILLINGBUYFAIL, this.billings_buy_fail, this);
          a.default.listen(r.default.PURCHASESSUCCESS, this.purchase_success, this);
          a.default.listen(r.default.PURCHASESFAIL, this.purchase_fail, this);
          a.default.listen(r.default.CONSUMESUCCESS, this.consume_success, this);
          a.default.listen(r.default.CONSUMEFAIL, this.consume_fail, this);
          a.default.listen(r.default.QUERYPURCHASESRESPONSESUCCESS, this.queryPurchapesResponseSuccess, this);
          a.default.listen(r.default.QUERYPURCHASESRESPONSEFAIL, this.queryPurchapesResponseFail, this);
        };
        t._getInstance = function () {
          t._instance || (t._instance = new t());
          return t._instance;
        };
        t.prototype.hideLoading = function (e) {
          console.log("支付关闭loading");
          console.log(e);
          c.default.hidePage("LoadingPage");
        };
        t.prototype.billings_fail = function () {
          console.log("安卓手机billings_fail");
          _.default.reportData("billings_fail");
        };
        t.prototype.sku_fail = function () {
          console.log("安卓手机sku_fail");
          _.default.reportData("sku_fail");
        };
        t.prototype.purchase_success = function (e) {
          console.log("安卓手机支付成功");
          this.showLoading();
          var t = JSON.parse(e);
          this.verify_order(t.purchaseList[0]);
          _.default.reportData("purchase_success", {
            successData: e
          });
        };
        t.prototype.get_sku_price = function (e) {
          return this.map_skuScence.get(e).gear_price / 100;
        };
        t.prototype.queryPurchapesResponseSuccess = function (e) {
          var t = this,
            o = JSON.parse(e);
          o.purchaseOrderSignature;
          o.purchaseOrderList.forEach(function (e) {
            var o = e.obfuscatedAccountId,
              n = e.purchaseToken;
            t.set_repair.add(n);
            t.repair_order({
              order_id: o,
              purchase_token: n
            });
          });
          console.log("安卓手机queryPurchapesResponseSuccess");
        };
        t.prototype.verify_order = function (e) {
          var t = this,
            o = e.purchaseToken,
            n = e.obfuscatedAccountId;
          f.default.verifyOrder({
            order_id: n,
            purchase_token: o
          }, d.default.create(this, function (e) {
            if (e && 1 == e.code) {
              console.log("验证订单成功");
              t.consumeSuccess = !1;
              t.order_status(n, 1);
            } else e && e.message && l.default.showManageViewToast(e.message);
          }), d.default.create(this, function (e) {
            console.log("验证订单错误", e);
            t.hideLoading("验证订单接口");
          }));
        };
        t.prototype.repair_order = function (e) {
          var t = this,
            o = e.order_id,
            n = e.purchase_token;
          f.default.repaireOrder({
            order_id: o,
            purchase_token: n
          }, d.default.create(this, function (e) {
            console.log("安卓手机补单", e.code, o, n);
            if (e && 1 == e.code) {
              t.consumeSuccess = !1;
              t.order_status(o, 1, 0, 1);
            } else e && e.message && l.default.showManageViewToast(e.message);
          }), d.default.create(this, function (e) {
            console.log("补单失败", e);
          }));
          _.default.reportData("repair_order");
        };
        t.prototype.refreshPurchasesAsync = function () {
          _.default.refreshPurchasesAsync();
          console.log("安卓手机refreshPurchasesAsync");
          _.default.reportData("refreshPurchasesAsync");
        };
        t.prototype.purchase_fail = function (e) {
          this.hideLoading("支付失败" + e);
          console.log("安卓手机purchase_fail");
          _.default.reportData("purchase_fail", {
            failReason: e
          });
        };
        t.prototype.sku_success = function (e) {
          this.initSkuData(e);
          this.refreshPurchasesAsync();
          console.log("安卓手机查询商品信息成功");
          _.default.reportData("sku_success");
        };
        t.prototype.showLoading = function () {
          c.default.showPage("LoadingPage");
        };
        t.prototype.billings_success = function () {
          console.log("安卓手机billings_success");
          _.default.reportData("billings_success");
        };
        t.prototype.billings_buy_fail = function () {
          console.log("安卓手机billings_buy_fail");
          _.default.reportData("billings_buy_fail");
        };
        t.prototype.get_skuId_byScene = function (e) {
          return this.map_skuScence.get(e).sku_id;
        };
        t.prototype.init = function () {
          this.addEvent();
          _.default.billingClientInit();
        };
        t.prototype.initPrice = function (e) {
          var t = this;
          this.map_skuScence = new Map();
          e.forEach(function (e) {
            var o = e.id;
            t.map_skuScence.set(o, e);
          });
          var o = [];
          this.map_skuScence.forEach(function (e) {
            "0" != e.sku_id && o.push(e.sku_id);
          });
          _.default.querySkuDetails(o.join(","));
        };
        t.prototype.billings_buy_success = function (e) {
          console.log("安卓手机billings_buy_success");
          _.default.reportData("billings_buy_success", {
            code: e
          });
        };
        t.prototype.create_order = function (e, t) {
          var o = this;
          this.cur_shop_id = t;
          f.default.createOrer({
            sku_id: e,
            shop_id: t
          }, d.default.create(this, function (e) {
            console.log(console.log("服务端创建订单====", e));
            e && 1 == e.code ? o.clickPay(t, e.data.order_id) : e && e.message && l.default.showManageViewToast(e.message);
          }), d.default.create(this, function (e) {
            console.log("创建订单错误", e);
            o.hideLoading("创建订单接口");
          }));
        };
        t.prototype.initSkuData = function (e) {
          var t = this;
          console.log("解析json==1111");
          var o = JSON.parse(e.replace(/\r|\n/g, ""));
          console.log("解析json==2222");
          console.log("initSkuData==", o);
          o.skuDetailsList.forEach(function (e) {
            var o = e.productId;
            t.map_skuDetail.set(o, e);
            console.log(e);
          });
        };
        t.prototype.consume_fail = function (e) {
          this.hideLoading("消耗失败" + e);
          console.log("安卓手机consume_fail");
          _.default.reportData("consume_fail", {
            consume_fail: e
          });
        };
        t.prototype.order_status = function (e, t, o, n) {
          var i = this;
          void 0 === t && (t = 1);
          void 0 === o && (o = 0);
          void 0 === n && (n = 0);
          if (5 <= ++o) {
            console.log("订单发货状态检测次数上限");
            n || this.hideLoading("订单发货状态检测次数上限");
          } else setTimeout(function () {
            f.default.orderStatus({
              order_id: e
            }, d.default.create(i, function (t) {
              if (t) {
                var a = t.data,
                  r = t.code,
                  l = t.message;
                if (-2005 === r || -2007 === r) {
                  console.log("查看订单返回结果错误", l);
                  i.consumeSuccess = !1;
                  i.order_status(e, 1, o, n);
                  return;
                }
                if (i.consumeSuccess) return;
                var s = a.purchase_token,
                  c = (a.show_diamond_charge, a.user_info);
                a.reward_10times;
                if (!n) {
                  i.map_pay_finish.set(i.cur_shop_id, a);
                  g.default.updateUserInfo(c);
                }
                _.default.reportData("pay_orderStatus_log", a);
                i.consumePurchase(s);
                i.consumeSuccess = !0;
              }
            }), d.default.create(i, function (t) {
              console.log("查看订单返回结果错误", t);
              i.consumeSuccess = !1;
              i.order_status(e, 1, o, n);
            }));
          }, 1e3 * t);
        };
        t.prototype.consumePurchase = function (e) {
          _.default.consumePurchase(e);
          console.log("安卓手机consumePurchase");
          _.default.reportData("consumePurchase");
        };
        t.prototype.clickPay = function (e, t) {
          var o = this.get_skuId_byScene(e),
            n = this.map_skuDetail.get(o);
          if (n) {
            _.default.reportData("pay", {
              shop_id: e,
              amount: this.get_sku_price(e)
            });
            n.orderId = t;
            _.default.clickPay(JSON.stringify(n), t);
            console.log("安卓手机clickPay");
            _.default.reportData("clickPay");
          } else _.default.showToast("td_id:" + e + " sku_id:" + o + " order_id:" + t + " ");
        };
        t.prototype.consume_success = function (e) {
          if (!this.set_repair.has(e)) {
            this.hideLoading("消耗成功" + e);
            var t = this.map_pay_finish.get(this.cur_shop_id),
              o = (t.purchase_token, t.show_diamond_charge);
            t.user_info, t.reward_10times.reward_10times_recharge_flag;
            if (o && !l.default.isEmptyObj(o)) {
              if ("6" == this.cur_shop_id) {
                l.default.showManageViewToast(i18n.t("add_block_tip"));
                a.default.trigger(r.default.CLOSEPERLUAS);
                a.default.trigger(r.default.BRICKANI);
                s.default.card_slot_number = 8;
                a.default.trigger(r.default.DO_ADD_COLLECTER_CELL, {
                  count: 1
                });
              } else if ("8" == this.cur_shop_id) {
                a.default.trigger(r.default.CLOSEEARNDOUBLEPAGE);
                a.default.trigger(r.default.OPENEARNDOUBLE);
                s.default.reward_10times.reward_10times_recharge_flag = !0;
              } else c.default.showPage("PaySuccessPage", {
                data: o
              });
              u.default.curLanguage == h.languages.ID ? _.default.reportData("pay_success", {
                pay_amount: o.amount,
                pay_currency: "IDR"
              }, !0) : u.default.curLanguage == h.languages.BR ? _.default.reportData("pay_success", {
                pay_amount: o.amount,
                pay_currency: "BRL"
              }, !0) : u.default.curLanguage == h.languages.US && _.default.reportData("pay_success", {
                pay_amount: o.amount,
                pay_currency: "USD"
              }, !0);
            }
            _.default.reportData("pay_finish", {
              td_id: this.cur_shop_id,
              amount: this.get_sku_price(this.cur_shop_id)
            });
            _.default.reportData("pay_finish_log", {
              show_diamond_charge: o
            });
            console.log("安卓手机consume_success");
            _.default.reportData("consume_success");
          }
        };
        t._instance = null;
        return t;
      }(p.default);
    o.default = y._getInstance();
    cc._RF.pop();
  }, {
    "../../Models/GameDataMgr": "GameDataMgr",
    "../../SystemConfig": "SystemConfig",
    "../../View/PageMgr": "PageMgr",
    "../Event/EventMgr": "EventMgr",
    "../Event/GameEventType": "GameEventType",
    "../Event/Handler": "Handler",
    "../SdkHelper": "SdkHelper",
    "../Service/GameService": "GameService",
    "../Utils/EngineUtil": "EngineUtil",
    "../data/GlobalDataMgr": "GlobalDataMgr",
    "../data/PurchaseDataMgr": "PurchaseDataMgr",
    "./PlayerDataSys": "PlayerDataSys"
  }],
  QETMKQUCUPSO: [function (e, t, o) {
    "use strict";

    cc._RF.push(t, "587ffyGm5FElobglIp7jjOK", "QETMKQUCUPSO");
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
      });
    Object.defineProperty(o, "__esModule", {
      value: !0
    });
    o.QETMKQUCUPSO = void 0;
    var a = e("../TALRPAVJIUEAF/LKKFYC"),
      r = e("../XWRHYLPIOGNSH"),
      l = e("./JGJYJG"),
      s = function (e) {
        i(t, e);
        function t() {
          return null !== e && e.apply(this, arguments) || this;
        }
        t.prototype.GGGFAZHDLUFCDNBX = function (e, t) {
          void 0 === t && (t = null);
          l.JGJYJG.YFEMHUUNOADK || r.XWRHYLPIOGNSH.ZSYXBLSKYBGCRTL().WNLBMXMEUWELMZGL(3, e, t);
        };
        t.prototype.VOBECDCFOCEQ = function (e, t) {
          void 0 === t && (t = null);
          l.JGJYJG.YFEMHUUNOADK || r.XWRHYLPIOGNSH.ZSYXBLSKYBGCRTL().WNLBMXMEUWELMZGL(1, e, t);
        };
        t.prototype.HWZEEGYDTCHMYPA = function () {};
        t.prototype.HMZTTQYMEYZ = function () {};
        t.prototype.RVZMUJV = function (e, t, o, n) {
          void 0 === t && (t = null);
          void 0 === o && (o = !1);
          void 0 === n && (n = !1);
          if (!l.JGJYJG.YFEMHUUNOADK) {
            var i = {
              event_name: e
            };
            null != t && (i.properties = t);
            r.XWRHYLPIOGNSH.ZSYXBLSKYBGCRTL().RVZMUJV(i, o, n);
          }
        };
        t.prototype.WZTYVRSF = function (e, t) {
          void 0 === t && (t = null);
          l.JGJYJG.YFEMHUUNOADK || r.XWRHYLPIOGNSH.ZSYXBLSKYBGCRTL().WNLBMXMEUWELMZGL(2, e, t);
        };
        return t;
      }(a.LKKFYC);
    o.QETMKQUCUPSO = s;
    cc._RF.pop();
  