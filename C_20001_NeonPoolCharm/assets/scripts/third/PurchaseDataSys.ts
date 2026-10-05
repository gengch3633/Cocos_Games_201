import EventMgr from "./EventMgr";
import GameEventType from "./GameEventType";
import EngineUtil from "./EngineUtil";
import GameDataMgr from "./GameDataMgr";
import PageMgr from "./PageMgr";
import GlobalDataMgr from "./GlobalDataMgr";
import PurchaseDataMgr from "./PurchaseDataMgr";
import Handler from "./Handler";
import SdkHelper from "./SdkHelper";
import GameService from "./GameService";
import { languages } from "./SystemConfig";
import PlayerDataSys from "./PlayerDataSys";

interface SkuSceneItem {
    id: string;
    sku_id: string;
    gear_price: number;
}

interface SkuDetailItem {
    productId: string;
    orderId?: string;
    [key: string]: unknown;
}

interface PayFinishData {
    purchase_token: string;
    show_diamond_charge?: Record<string, unknown>;
    user_info?: unknown;
    reward_10times?: { reward_10times_recharge_flag?: boolean };
    amount?: number;
}

class PurchaseDataSys extends PurchaseDataMgr {
    private static _instance: PurchaseDataSys = null;

    consumeSuccess = false;

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

    private static _getInstance(): PurchaseDataSys {
        return PurchaseDataSys._instance || (PurchaseDataSys._instance = new PurchaseDataSys());
    }

    hideLoading(reason: string): void {
        console.log("支付关闭loading");
        console.log(reason);
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

    purchase_success(data: string): void {
        console.log("安卓手机支付成功");
        this.showLoading();
        const parsed = JSON.parse(data);
        this.verify_order(parsed.purchaseList[0]);
        SdkHelper.reportData("purchase_success", { successData: data });
    }

    get_sku_price(sceneId: string): number {
        return (this.map_skuScence.get(sceneId) as SkuSceneItem).gear_price / 100;
    }

    queryPurchapesResponseSuccess(data: string): void {
        const parsed = JSON.parse(data);
        parsed.purchaseOrderSignature;
        parsed.purchaseOrderList.forEach((order: { obfuscatedAccountId: string; purchaseToken: string }) => {
            const orderId = order.obfuscatedAccountId;
            const purchaseToken = order.purchaseToken;
            this.set_repair.add(purchaseToken);
            this.repair_order({
                order_id: orderId,
                purchase_token: purchaseToken,
            });
        });
        console.log("安卓手机queryPurchapesResponseSuccess");
    }

    verify_order(order: { purchaseToken: string; obfuscatedAccountId: string }): void {
        const purchaseToken = order.purchaseToken;
        const orderId = order.obfuscatedAccountId;
        GameService.verifyOrder(
            {
                order_id: orderId,
                purchase_token: purchaseToken,
            },
            Handler.create(this, (response: { code?: number; message?: string }) => {
                if (response && response.code == 1) {
                    console.log("验证订单成功");
                    this.consumeSuccess = false;
                    this.order_status(orderId, 1);
                } else if (response && response.message) {
                    EngineUtil.showManageViewToast(response.message);
                }
            }),
            Handler.create(this, (error: unknown) => {
                console.log("验证订单错误", error);
                this.hideLoading("验证订单接口");
            })
        );
    }

    repair_order(params: { order_id: string; purchase_token: string }): void {
        const orderId = params.order_id;
        const purchaseToken = params.purchase_token;
        GameService.repaireOrder(
            {
                order_id: orderId,
                purchase_token: purchaseToken,
            },
            Handler.create(this, (response: { code?: number; message?: string }) => {
                console.log("安卓手机补单", response.code, orderId, purchaseToken);
                if (response && response.code == 1) {
                    this.consumeSuccess = false;
                    this.order_status(orderId, 1, 0, 1);
                } else if (response && response.message) {
                    EngineUtil.showManageViewToast(response.message);
                }
            }),
            Handler.create(this, (error: unknown) => {
                console.log("补单失败", error);
            })
        );
        SdkHelper.reportData("repair_order");
    }

    refreshPurchasesAsync(): void {
        SdkHelper.refreshPurchasesAsync();
        console.log("安卓手机refreshPurchasesAsync");
        SdkHelper.reportData("refreshPurchasesAsync");
    }

    purchase_fail(reason: unknown): void {
        this.hideLoading("支付失败" + reason);
        console.log("安卓手机purchase_fail");
        SdkHelper.reportData("purchase_fail", { failReason: reason });
    }

    sku_success(data: string): void {
        this.initSkuData(data);
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

    get_skuId_byScene(sceneId: string): string {
        return (this.map_skuScence.get(sceneId) as SkuSceneItem).sku_id;
    }

    init(): void {
        this.addEvent();
        SdkHelper.billingClientInit();
    }

    initPrice(items: SkuSceneItem[]): void {
        this.map_skuScence = new Map();
        items.forEach((item) => {
            this.map_skuScence.set(item.id, item);
        });
        const skuIds: string[] = [];
        this.map_skuScence.forEach((item) => {
            const skuItem = item as SkuSceneItem;
            if (skuItem.sku_id != "0") {
                skuIds.push(skuItem.sku_id);
            }
        });
        SdkHelper.querySkuDetails(skuIds.join(","));
    }

    billings_buy_success(code: unknown): void {
        console.log("安卓手机billings_buy_success");
        SdkHelper.reportData("billings_buy_success", { code });
    }

    create_order(skuId: string, shopId: string): void {
        this.cur_shop_id = shopId;
        GameService.createOrer(
            {
                sku_id: skuId,
                shop_id: shopId,
            },
            Handler.create(this, (response: { code?: number; data?: { order_id: string }; message?: string }) => {
                console.log(console.log("服务端创建订单====", response));
                if (response && response.code == 1) {
                    this.clickPay(shopId, response.data.order_id);
                } else if (response && response.message) {
                    EngineUtil.showManageViewToast(response.message);
                }
            }),
            Handler.create(this, (error: unknown) => {
                console.log("创建订单错误", error);
                this.hideLoading("创建订单接口");
            })
        );
    }

    initSkuData(data: string): void {
        console.log("解析json==1111");
        const parsed = JSON.parse(data.replace(/\r|\n/g, ""));
        console.log("解析json==2222");
        console.log("initSkuData==", parsed);
        parsed.skuDetailsList.forEach((item: SkuDetailItem) => {
            const productId = item.productId;
            this.map_skuDetail.set(productId, item);
            console.log(item);
        });
    }

    consume_fail(reason: unknown): void {
        this.hideLoading("消耗失败" + reason);
        console.log("安卓手机consume_fail");
        SdkHelper.reportData("consume_fail", { consume_fail: reason });
    }

    order_status(orderId: string, delay = 1, retryCount = 0, isRepair = 0): void {
        if (++retryCount >= 5) {
            console.log("订单发货状态检测次数上限");
            if (!isRepair) {
                this.hideLoading("订单发货状态检测次数上限");
            }
        } else {
            setTimeout(() => {
                GameService.orderStatus(
                    { order_id: orderId },
                    Handler.create(this, (response: any) => {
                        if (response) {
                            const data = response.data;
                            const code = response.code;
                            const message = response.message;
                            if (code === -2005 || code === -2007) {
                                console.log("查看订单返回结果错误", message);
                                this.consumeSuccess = false;
                                this.order_status(orderId, 1, retryCount, isRepair);
                                return;
                            }
                            if (this.consumeSuccess) {
                                return;
                            }
                            const purchaseToken = data.purchase_token;
                            data.show_diamond_charge;
                            const userInfo = data.user_info;
                            data.reward_10times;
                            if (!isRepair) {
                                this.map_pay_finish.set(this.cur_shop_id, data);
                                PlayerDataSys.updateUserInfo(userInfo);
                            }
                            SdkHelper.reportData("pay_orderStatus_log", data);
                            this.consumePurchase(purchaseToken);
                            this.consumeSuccess = true;
                        }
                    }),
                    Handler.create(this, (error: unknown) => {
                        console.log("查看订单返回结果错误", error);
                        this.consumeSuccess = false;
                        this.order_status(orderId, 1, retryCount, isRepair);
                    })
                );
            }, 1000 * delay);
        }
    }

    consumePurchase(purchaseToken: string): void {
        SdkHelper.consumePurchase(purchaseToken);
        console.log("安卓手机consumePurchase");
        SdkHelper.reportData("consumePurchase");
    }

    clickPay(shopId: string, orderId: string): void {
        const skuId = this.get_skuId_byScene(shopId);
        const skuDetail = this.map_skuDetail.get(skuId) as SkuDetailItem;
        if (skuDetail) {
            SdkHelper.reportData("pay", {
                shop_id: shopId,
                amount: this.get_sku_price(shopId),
            });
            skuDetail.orderId = orderId;
            SdkHelper.clickPay(JSON.stringify(skuDetail), orderId);
            console.log("安卓手机clickPay");
            SdkHelper.reportData("clickPay");
        } else {
            SdkHelper.showToast("td_id:" + shopId + " sku_id:" + skuId + " order_id:" + orderId + " ");
        }
    }

    consume_success(purchaseToken: string): void {
        if (!this.set_repair.has(purchaseToken)) {
            this.hideLoading("消耗成功" + purchaseToken);
            const payData = this.map_pay_finish.get(this.cur_shop_id) as PayFinishData;
            const showDiamondCharge = payData.show_diamond_charge;
            payData.user_info;
            payData.reward_10times?.reward_10times_recharge_flag;
            if (showDiamondCharge && !EngineUtil.isEmptyObj(showDiamondCharge)) {
                if (this.cur_shop_id == "6") {
                    EngineUtil.showManageViewToast(i18n.t("add_block_tip"));
                    EventMgr.trigger(GameEventType.CLOSEPERLUAS);
                    EventMgr.trigger(GameEventType.BRICKANI);
                    GameDataMgr.card_slot_number = 8;
                    EventMgr.trigger(GameEventType.DO_ADD_COLLECTER_CELL, { count: 1 });
                } else if (this.cur_shop_id == "8") {
                    EventMgr.trigger(GameEventType.CLOSEEARNDOUBLEPAGE);
                    EventMgr.trigger(GameEventType.OPENEARNDOUBLE);
                    GameDataMgr.reward_10times.reward_10times_recharge_flag = true;
                } else {
                    PageMgr.showPage("PaySuccessPage", { data: showDiamondCharge });
                }
                if (GlobalDataMgr.curLanguage == languages.ID) {
                    SdkHelper.reportData(
                        "pay_success",
                        { pay_amount: showDiamondCharge.amount, pay_currency: "IDR" },
                        true
                    );
                } else if (GlobalDataMgr.curLanguage == languages.BR) {
                    SdkHelper.reportData(
                        "pay_success",
                        { pay_amount: showDiamondCharge.amount, pay_currency: "BRL" },
                        true
                    );
                } else if (GlobalDataMgr.curLanguage == languages.US) {
                    SdkHelper.reportData(
                        "pay_success",
                        { pay_amount: showDiamondCharge.amount, pay_currency: "USD" },
                        true
                    );
                }
            }
            SdkHelper.reportData("pay_finish", {
                td_id: this.cur_shop_id,
                amount: this.get_sku_price(this.cur_shop_id),
            });
            SdkHelper.reportData("pay_finish_log", { show_diamond_charge: showDiamondCharge });
            console.log("安卓手机consume_success");
            SdkHelper.reportData("consume_success");
        }
    }
}

export default PurchaseDataSys._getInstance();
