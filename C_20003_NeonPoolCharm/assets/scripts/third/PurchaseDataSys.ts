import EngineUtil from "./EngineUtil";
import EventMgr from "./EventMgr";
import GameDataMgr from "./GameDataMgr";
import GameEventType from "./GameEventType";
import GameService from "./GameService";
import GlobalDataMgr from "./GlobalDataMgr";
import Handler from "./Handler";
import PageMgr from "./PageMgr";
import PlayerDataSys from "./PlayerDataSys";
import PurchaseDataMgr from "./PurchaseDataMgr";
import SdkHelper from "./SdkHelper";
import { languages } from "./SystemConfig";

declare const i18n: any;

class PurchaseDataSys extends PurchaseDataMgr {
    consumeSuccess = false;

    static _instance = null;

    constructor() {
        super();
        this.map_skuScence = null;
        this.cur_shop_id = null;
    }

    static _getInstance() {
        this._instance || (PurchaseDataSys._instance = new PurchaseDataSys());
        return PurchaseDataSys._instance;
    }

    queryPurchapesResponseFail() {
        console.log("安卓手机queryPurchapesResponseFail");
    }

    addEvent() {
        EventMgr.listen(GameEventType.BILLINGSUCCESS, this.billings_success, this);
        EventMgr.listen(GameEventType.BILLINGFAILED, this.billings_fail, this);
        EventMgr.listen(GameEventType.SKUDETAILSUCCESS, this.sku_success, this);
        EventMgr.listen(GameEventType.SKUDETAILFAIL, this.sku_fail, this);
        EventMgr.listen(GameEventType.BILLINGBUYSUCCESS, this.billings_buy_success, this);
        EventMgr.listen(GameEventType.BILLINGBUYFAIL, this.billings_buy_fail, this);
        EventMgr.listen(GameEventType.PURCHASESSUCCESS, this.purchase_success, this);
        EventMgr.listen(GameEventType.PURCHASESFAIL, this.purchase_fail, this);
        EventMgr.listen(GameEventType.CONSUMESUCCESS, this.consume_success, this);
        EventMgr.listen(GameEventType.CONSUMEFAIL, this.consume_fail, this);
        EventMgr.listen(GameEventType.QUERYPURCHASESRESPONSESUCCESS, this.queryPurchapesResponseSuccess, this);
        EventMgr.listen(GameEventType.QUERYPURCHASESRESPONSEFAIL, this.queryPurchapesResponseFail, this);
    }

    hideLoading(e) {
        console.log("支付关闭loading");
        console.log(e);
        PageMgr.hidePage("LoadingPage");
    }

    billings_fail() {
        console.log("安卓手机billings_fail");
        SdkHelper.reportData("billings_fail");
    }

    sku_fail() {
        console.log("安卓手机sku_fail");
        SdkHelper.reportData("sku_fail");
    }

    purchase_success(e) {
        console.log("安卓手机支付成功");
        this.showLoading();
        const t = JSON.parse(e);
        this.verify_order(t.purchaseList[0]);
        SdkHelper.reportData("purchase_success", {
            successData: e
        });
    }

    get_sku_price(e) {
        return this.map_skuScence.get(e).gear_price / 100;
    }

    queryPurchapesResponseSuccess(e) {
        const t = this,
            o = JSON.parse(e);
        o.purchaseOrderSignature;
        o.purchaseOrderList.forEach(function (e) {
            const o = e.obfuscatedAccountId,
                n = e.purchaseToken;
            t.set_repair.add(n);
            t.repair_order({
                order_id: o,
                purchase_token: n
            });
        });
        console.log("安卓手机queryPurchapesResponseSuccess");
    }

    verify_order(e) {
        const t = this,
            o = e.purchaseToken,
            n = e.obfuscatedAccountId;
        (GameService.verifyOrder as any)({
            order_id: n,
            purchase_token: o
        }, Handler.create(this, function (e) {
            if (e && 1 == e.code) {
                console.log("验证订单成功");
                t.consumeSuccess = false;
                t.order_status(n, 1);
            } else e && e.message && EngineUtil.showManageViewToast(e.message);
        }), Handler.create(this, function (e) {
            console.log("验证订单错误", e);
            t.hideLoading("验证订单接口");
        }));
    }

    repair_order(e) {
        const t = this,
            o = e.order_id,
            n = e.purchase_token;
        (GameService.repaireOrder as any)({
            order_id: o,
            purchase_token: n
        }, Handler.create(this, function (e) {
            console.log("安卓手机补单", e.code, o, n);
            if (e && 1 == e.code) {
                t.consumeSuccess = false;
                t.order_status(o, 1, 0, 1);
            } else e && e.message && EngineUtil.showManageViewToast(e.message);
        }), Handler.create(this, function (e) {
            console.log("补单失败", e);
        }));
        SdkHelper.reportData("repair_order");
    }

    refreshPurchasesAsync() {
        SdkHelper.refreshPurchasesAsync();
        console.log("安卓手机refreshPurchasesAsync");
        SdkHelper.reportData("refreshPurchasesAsync");
    }

    purchase_fail(e) {
        this.hideLoading("支付失败" + e);
        console.log("安卓手机purchase_fail");
        SdkHelper.reportData("purchase_fail", {
            failReason: e
        });
    }

    sku_success(e) {
        this.initSkuData(e);
        this.refreshPurchasesAsync();
        console.log("安卓手机查询商品信息成功");
        SdkHelper.reportData("sku_success");
    }

    showLoading() {
        PageMgr.showPage("LoadingPage");
    }

    billings_success() {
        console.log("安卓手机billings_success");
        SdkHelper.reportData("billings_success");
    }

    billings_buy_fail() {
        console.log("安卓手机billings_buy_fail");
        SdkHelper.reportData("billings_buy_fail");
    }

    get_skuId_byScene(e) {
        return this.map_skuScence.get(e).sku_id;
    }

    init() {
        this.addEvent();
        SdkHelper.billingClientInit();
    }

    initPrice(e) {
        const t = this;
        this.map_skuScence = new Map();
        e.forEach(function (e) {
            const o = e.id;
            t.map_skuScence.set(o, e);
        });
        const o = [];
        this.map_skuScence.forEach(function (e) {
            "0" != e.sku_id && o.push(e.sku_id);
        });
        SdkHelper.querySkuDetails(o.join(","));
    }

    billings_buy_success(e) {
        console.log("安卓手机billings_buy_success");
        SdkHelper.reportData("billings_buy_success", {
            code: e
        });
    }

    create_order(e, t) {
        const o = this;
        this.cur_shop_id = t;
        (GameService.createOrer as any)({
            sku_id: e,
            shop_id: t
        }, Handler.create(this, function (e) {
            console.log(console.log("服务端创建订单====", e));
            e && 1 == e.code ? o.clickPay(t, e.data.order_id) : e && e.message && EngineUtil.showManageViewToast(e.message);
        }), Handler.create(this, function (e) {
            console.log("创建订单错误", e);
            o.hideLoading("创建订单接口");
        }));
    }

    initSkuData(e) {
        const t = this;
        console.log("解析json==1111");
        const o = JSON.parse(e.replace(/\r|\n/g, ""));
        console.log("解析json==2222");
        console.log("initSkuData==", o);
        o.skuDetailsList.forEach(function (e) {
            const o = e.productId;
            t.map_skuDetail.set(o, e);
            console.log(e);
        });
    }

    consume_fail(e) {
        this.hideLoading("消耗失败" + e);
        console.log("安卓手机consume_fail");
        SdkHelper.reportData("consume_fail", {
            consume_fail: e
        });
    }

    order_status(e, t, o, n) {
        const i = this;
        if (undefined === t) {
            t = 1;
        }
        if (undefined === o) {
            o = 0;
        }
        if (undefined === n) {
            n = 0;
        }
        if (5 <= ++o) {
            console.log("订单发货状态检测次数上限");
            n || this.hideLoading("订单发货状态检测次数上限");
        } else setTimeout(function () {
            (GameService.orderStatus as any)({
                order_id: e
            }, Handler.create(i, function (t) {
                if (t) {
                    const a = t.data,
                        r = t.code,
                        l = t.message;
                    if (-2005 === r || -2007 === r) {
                        console.log("查看订单返回结果错误", l);
                        i.consumeSuccess = false;
                        i.order_status(e, 1, o, n);
                        return;
                    }
                    if (i.consumeSuccess) return;
                    const s = a.purchase_token,
                        c = (a.show_diamond_charge, a.user_info);
                    a.reward_10times;
                    if (!n) {
                        i.map_pay_finish.set(i.cur_shop_id, a);
                        PlayerDataSys.updateUserInfo(c);
                    }
                    SdkHelper.reportData("pay_orderStatus_log", a);
                    i.consumePurchase(s);
                    i.consumeSuccess = true;
                }
            }), Handler.create(i, function (t) {
                console.log("查看订单返回结果错误", t);
                i.consumeSuccess = false;
                i.order_status(e, 1, o, n);
            }));
        }, 1e3 * t);
    }

    consumePurchase(e) {
        SdkHelper.consumePurchase(e);
        console.log("安卓手机consumePurchase");
        SdkHelper.reportData("consumePurchase");
    }

    clickPay(e, t) {
        const o = this.get_skuId_byScene(e),
            n = this.map_skuDetail.get(o);
        if (n) {
            SdkHelper.reportData("pay", {
                shop_id: e,
                amount: this.get_sku_price(e)
            });
            n.orderId = t;
            SdkHelper.clickPay(JSON.stringify(n), t);
            console.log("安卓手机clickPay");
            SdkHelper.reportData("clickPay");
        } else SdkHelper.showToast("td_id:" + e + " sku_id:" + o + " order_id:" + t + " ");
    }

    consume_success(e) {
        if (!this.set_repair.has(e)) {
            this.hideLoading("消耗成功" + e);
            const t = this.map_pay_finish.get(this.cur_shop_id),
                o = (t.purchase_token, t.show_diamond_charge);
            t.user_info, t.reward_10times.reward_10times_recharge_flag;
            if (o && !EngineUtil.isEmptyObj(o)) {
                if ("6" == this.cur_shop_id) {
                    EngineUtil.showManageViewToast(i18n.t("add_block_tip"));
                    EventMgr.trigger(GameEventType.CLOSEPERLUAS);
                    EventMgr.trigger(GameEventType.BRICKANI);
                    GameDataMgr.card_slot_number = 8;
                    EventMgr.trigger(GameEventType.DO_ADD_COLLECTER_CELL, {
                        count: 1
                    });
                } else if ("8" == this.cur_shop_id) {
                    EventMgr.trigger(GameEventType.CLOSEEARNDOUBLEPAGE);
                    EventMgr.trigger(GameEventType.OPENEARNDOUBLE);
                    GameDataMgr.reward_10times.reward_10times_recharge_flag = true;
                } else PageMgr.showPage("PaySuccessPage", {
                    data: o
                });
                GlobalDataMgr.curLanguage == languages.ID ? SdkHelper.reportData("pay_success", {
                    pay_amount: o.amount,
                    pay_currency: "IDR"
                }, true) : GlobalDataMgr.curLanguage == languages.BR ? SdkHelper.reportData("pay_success", {
                    pay_amount: o.amount,
                    pay_currency: "BRL"
                }, true) : GlobalDataMgr.curLanguage == languages.US && SdkHelper.reportData("pay_success", {
                    pay_amount: o.amount,
                    pay_currency: "USD"
                }, true);
            }
            SdkHelper.reportData("pay_finish", {
                td_id: this.cur_shop_id,
                amount: this.get_sku_price(this.cur_shop_id)
            });
            SdkHelper.reportData("pay_finish_log", {
                show_diamond_charge: o
            });
            console.log("安卓手机consume_success");
            SdkHelper.reportData("consume_success");
        }
    }
}

export default PurchaseDataSys._getInstance();
