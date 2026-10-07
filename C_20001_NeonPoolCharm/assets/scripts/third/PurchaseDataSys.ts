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

class PurchaseDataSys extends PurchaseDataMgr {
    consumeSuccess = false;
    map_skuScence: Map<any, any> = null;
    cur_shop_id: string = null;

    queryPurchapesResponseFail(): void {
        console.log("安卓手机queryPurchapesResponseFail");
    }

    addEvent(): void {
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

    static _getInstance(): PurchaseDataSys {
        if (!PurchaseDataSys._instance) {
            PurchaseDataSys._instance = new PurchaseDataSys();
        }
        return PurchaseDataSys._instance;
    }

    hideLoading(e: any): void {
        console.log("支付关闭loading");
        console.log(e);
        PageMgr.hidePage("LoadingPage");
    }

    billings_fail(): void {
        console.log("安卓手机billings_fail");
        SdkHelper.reportData("billings_fail");
    }

    sku_fail(): void {
        console.log("安卓手机sku_fail");
        SdkHelper.reportData("sku_fail");
    }

    purchase_success(e: string): void {
        console.log("安卓手机支付成功");
        this.showLoading();
        const t = JSON.parse(e);
        this.verify_order(t.purchaseList[0]);
        SdkHelper.reportData("purchase_success", { successData: e });
    }

    get_sku_price(e: any): number {
        return this.map_skuScence.get(e).gear_price / 100;
    }

    queryPurchapesResponseSuccess(e: string): void {
        const o = JSON.parse(e);
        o.purchaseOrderSignature;
        o.purchaseOrderList.forEach((item: any) => {
            const n = item.obfuscatedAccountId;
            const purchaseToken = item.purchaseToken;
            this.set_repair.add(purchaseToken);
            this.repair_order({ order_id: n, purchase_token: purchaseToken });
        });
        console.log("安卓手机queryPurchapesResponseSuccess");
    }

    verify_order(e: any): void {
        const o = e.purchaseToken;
        const n = e.obfuscatedAccountId;
        GameService.verifyOrder(
            { order_id: n, purchase_token: o },
            Handler.create(this, (result: any) => {
                if (result && 1 == result.code) {
                    console.log("验证订单成功");
                    this.consumeSuccess = false;
                    this.order_status(n, 1);
                } else if (result && result.message) {
                    EngineUtil.showManageViewToast(result.message);
                }
            }),
            Handler.create(this, (err: any) => {
                console.log("验证订单错误", err);
                this.hideLoading("验证订单接口");
            })
        );
    }

    repair_order(e: { order_id: any; purchase_token: any }): void {
        const o = e.order_id;
        const n = e.purchase_token;
        GameService.repaireOrder(
            { order_id: o, purchase_token: n },
            Handler.create(this, (result: any) => {
                console.log("安卓手机补单", result.code, o, n);
                if (result && 1 == result.code) {
                    this.consumeSuccess = false;
                    this.order_status(o, 1, 0, 1);
                } else if (result && result.message) {
                    EngineUtil.showManageViewToast(result.message);
                }
            }),
            Handler.create(this, (err: any) => {
                console.log("补单失败", err);
            })
        );
        SdkHelper.reportData("repair_order");
    }

    refreshPurchasesAsync(): void {
        SdkHelper.refreshPurchasesAsync();
        console.log("安卓手机refreshPurchasesAsync");
        SdkHelper.reportData("refreshPurchasesAsync");
    }

    purchase_fail(e: any): void {
        this.hideLoading("支付失败" + e);
        console.log("安卓手机purchase_fail");
        SdkHelper.reportData("purchase_fail", { failReason: e });
    }

    sku_success(e: string): void {
        this.initSkuData(e);
        this.refreshPurchasesAsync();
        console.log("安卓手机查询商品信息成功");
        SdkHelper.reportData("sku_success");
    }

    showLoading(): void {
        PageMgr.showPage("LoadingPage");
    }

    billings_success(): void {
        console.log("安卓手机billings_success");
        SdkHelper.reportData("billings_success");
    }

    billings_buy_fail(): void {
        console.log("安卓手机billings_buy_fail");
        SdkHelper.reportData("billings_buy_fail");
    }

    get_skuId_byScene(e: any): any {
        return this.map_skuScence.get(e).sku_id;
    }

    init(): void {
        this.addEvent();
        SdkHelper.billingClientInit();
    }

    initPrice(e: any[]): void {
        this.map_skuScence = new Map();
        e.forEach((item: any) => {
            const o = item.id;
            this.map_skuScence.set(o, item);
        });
        const o: any[] = [];
        this.map_skuScence.forEach((item: any) => {
            if ("0" != item.sku_id) {
                o.push(item.sku_id);
            }
        });
        SdkHelper.querySkuDetails(o.join(","));
    }

    billings_buy_success(e: any): void {
        console.log("安卓手机billings_buy_success");
        SdkHelper.reportData("billings_buy_success", { code: e });
    }

    create_order(e: any, t: string): void {
        this.cur_shop_id = t;
        GameService.createOrer(
            { sku_id: e, shop_id: t },
            Handler.create(this, (result: any) => {
                console.log(console.log("服务端创建订单====", result));
                if (result && 1 == result.code) {
                    this.clickPay(t, result.data.order_id);
                } else if (result && result.message) {
                    EngineUtil.showManageViewToast(result.message);
                }
            }),
            Handler.create(this, (err: any) => {
                console.log("创建订单错误", err);
                this.hideLoading("创建订单接口");
            })
        );
    }

    initSkuData(e: string): void {
        console.log("解析json==1111");
        const o = JSON.parse(e.replace(/ \r| \n/g, ""));
        console.log("解析json==2222");
        console.log("initSkuData==", o);
        o.skuDetailsList.forEach((item: any) => {
            const productId = item.productId;
            this.map_skuDetail.set(productId, item);
            console.log(item);
        });
    }

    consume_fail(e: any): void {
        this.hideLoading("消耗失败" + e);
        console.log("安卓手机consume_fail");
        SdkHelper.reportData("consume_fail", { consume_fail: e });
    }

    order_status(e: any, t: number = 1, o: number = 0, n: number = 0): void {
        if (5 <= ++o) {
            console.log("订单发货状态检测次数上限");
            if (!n) {
                this.hideLoading("订单发货状态检测次数上限");
            }
        } else {
            setTimeout(() => {
                GameService.orderStatus(
                    { order_id: e },
                    Handler.create(this, (result: any) => {
                        if (result) {
                            const a = result.data;
                            const r = result.code;
                            const l = result.message;
                            if (-2005 === r || -2007 === r) {
                                console.log("查看订单返回结果错误", l);
                                this.consumeSuccess = false;
                                this.order_status(e, 1, o, n);
                                return;
                            }
                            if (this.consumeSuccess) {
                                return;
                            }
                            const s = a.purchase_token;
                            a.show_diamond_charge;
                            const c = a.user_info;
                            a.reward_10times;
                            if (!n) {
                                this.map_pay_finish.set(this.cur_shop_id, a);
                                PlayerDataSys.updateUserInfo(c);
                            }
                            SdkHelper.reportData("pay_orderStatus_log", a);
                            this.consumePurchase(s);
                            this.consumeSuccess = true;
                        }
                    }),
                    Handler.create(this, (err: any) => {
                        console.log("查看订单返回结果错误", err);
                        this.consumeSuccess = false;
                        this.order_status(e, 1, o, n);
                    })
                );
            }, 1000 * t);
        }
    }

    consumePurchase(e: any): void {
        SdkHelper.consumePurchase(e);
        console.log("安卓手机consumePurchase");
        SdkHelper.reportData("consumePurchase");
    }

    clickPay(e: any, t: any): void {
        const o = this.get_skuId_byScene(e);
        const n = this.map_skuDetail.get(o);
        if (n) {
            SdkHelper.reportData("pay", { shop_id: e, amount: this.get_sku_price(e) });
            n.orderId = t;
            SdkHelper.clickPay(JSON.stringify(n), t);
            console.log("安卓手机clickPay");
            SdkHelper.reportData("clickPay");
        } else {
            SdkHelper.showToast("td_id:" + e + " sku_id:" + o + " order_id:" + t + " ");
        }
    }

    consume_success(e: any): void {
        if (!this.set_repair.has(e)) {
            this.hideLoading("消耗成功" + e);
            const t = this.map_pay_finish.get(this.cur_shop_id);
            t.purchase_token;
            const o = t.show_diamond_charge;
            t.user_info;
            t.reward_10times.reward_10times_recharge_flag;
            if (o && !EngineUtil.isEmptyObj(o)) {
                if ("6" == this.cur_shop_id) {
                    EngineUtil.showManageViewToast(i18n.t("add_block_tip"));
                    EventMgr.trigger(GameEventType.CLOSEPERLUAS);
                    EventMgr.trigger(GameEventType.BRICKANI);
                    GameDataMgr.card_slot_number = 8;
                    EventMgr.trigger(GameEventType.DO_ADD_COLLECTER_CELL, { count: 1 });
                } else if ("8" == this.cur_shop_id) {
                    EventMgr.trigger(GameEventType.CLOSEEARNDOUBLEPAGE);
                    EventMgr.trigger(GameEventType.OPENEARNDOUBLE);
                    GameDataMgr.reward_10times.reward_10times_recharge_flag = true;
                } else {
                    PageMgr.showPage("PaySuccessPage", { data: o });
                }
                if (GlobalDataMgr.curLanguage == languages.ID) {
                    SdkHelper.reportData("pay_success", { pay_amount: o.amount, pay_currency: "IDR" }, true);
                } else if (GlobalDataMgr.curLanguage == languages.BR) {
                    SdkHelper.reportData("pay_success", { pay_amount: o.amount, pay_currency: "BRL" }, true);
                } else if (GlobalDataMgr.curLanguage == languages.US) {
                    SdkHelper.reportData("pay_success", { pay_amount: o.amount, pay_currency: "USD" }, true);
                }
            }
            SdkHelper.reportData("pay_finish", { td_id: this.cur_shop_id, amount: this.get_sku_price(this.cur_shop_id) });
            SdkHelper.reportData("pay_finish_log", { show_diamond_charge: o });
            console.log("安卓手机consume_success");
            SdkHelper.reportData("consume_success");
        }
    }

    private static _instance: PurchaseDataSys = null;
}

export default PurchaseDataSys._getInstance();
