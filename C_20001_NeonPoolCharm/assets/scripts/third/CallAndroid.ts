import AdvertEventType from "./AdvertEventType";
import NativeEventType from "./NativeEventType";
import PlayerDataSys from "./PlayerDataSys";
import EventMgr from "./EventMgr";
import GameEventType from "./GameEventType";
import SdkHelper from "./SdkHelper";
import EngineUtil from "./EngineUtil";
import { GAME_NAME } from "./SystemConfig";
import PageMgr from "./PageMgr";

export default class CallAndroid {
    private static _instance: CallAndroid = null;

    launchBillingFlowFail(data: unknown): void {
        console.log("购买失败", data);
        EventMgr.trigger(GameEventType.BILLINGBUYFAIL, data);
    }

    getRealCountry(): void {
        cc.sys.isNative;
    }

    closeSplashAd(): void {
        console.log("android.closeSplashAd");
    }

    ysdkLogin(): void {}

    showRewardVideoAd(slot: string): void {
        console.log("android.showRewardVideoAd ", slot);
    }

    getFirstLaunchTime(): void {}

    onPurchasesUpdatedSuccess(data: unknown): void {
        console.log("支付成功", data);
        EventMgr.trigger(GameEventType.PURCHASESSUCCESS, data);
    }

    onGetConfig(data: unknown): void {
        console.log("Java调用Js 中台配置 onGetConfig", data);
        EventMgr.trigger(NativeEventType.ON_GET_MIDDLE_CONFIG, data);
    }

    initSingularSDK(): void {}

    reportData(eventName: string, params?: Record<string, unknown>, isDebug = false): void {
        const payload: any = { eventName };
        const paramList: { paramName: string; paramValue: unknown }[] = [];
        paramList.push({ paramName: "ts", paramValue: EngineUtil.getTimeStamp() });
        paramList.push({ paramName: "game_name", paramValue: GAME_NAME });
        if (params) {
            for (const key of Object.keys(params)) {
                paramList.push({ paramName: key, paramValue: params[key] });
            }
        }
        payload.param = paramList;
        const json = JSON.stringify(payload);
        if (cc.sys.isNative) {
            console.log("android", isDebug + "埋点>>>>>>>>>>" + json);
        }
    }

    cancelVibrator(): void {}

    getScreenHeight(): void {}

    getAesEncrypData(): void {}

    getOAID(): void {
        console.log("----Android回调,获取oaid完成==1111");
        EventMgr.trigger(NativeEventType.OAID_FINISH);
    }

    refreshPurchasesAsync(): void {
        console.log("查询未消耗的商品");
    }

    showBannerAd(): void {}

    getScreenWidth(): void {}

    requestTDId(): void {}

    getMiddleConfig(): void {}

    showNotification(): void {}

    getBdDid(): void {}

    showForceToast(): void {}

    onConsumeResponseFail(data: unknown): void {
        console.log("消耗失败", data);
        EventMgr.trigger(GameEventType.CONSUMEFAIL, data);
    }

    hasNotchInScreen(): void {}

    setVibrator(): void {}

    showSplashAd(): void {
        console.log("showSplashAd");
    }

    setEnterAgreementTime(): void {}

    initAppFlyer(): void {}

    onGetBdDid(data: string): void {
        console.log("获取火山id", data);
        SdkHelper.initBD(data);
    }

    onBillingSetupFinishedFail(data: unknown): void {
        console.log("google链接失败", data);
        EventMgr.trigger(GameEventType.BILLINGFAILED, data);
    }

    getNormalSlotId(): void {}

    closeImgAd(): void {}

    querySkuDetails(data: unknown): void {
        console.log("查询商品详情", data);
    }

    billingClientInit(): void {
        console.log("google支付初始化");
    }

    onAppStop(): void {
        console.log("Java调用Js onAppStop");
        EventMgr.trigger(NativeEventType.APP_STOP);
    }

    getBlackBox(): void {}

    onSkuDetailsResponseSuccess(data: unknown): void {
        console.log("查询商品详情成功onSkuDetailsResponseSuccess2", data);
        SdkHelper.reportData("onSkuDetailsResponseSuccess", { logResponse: data });
        EventMgr.trigger(GameEventType.SKUDETAILSUCCESS, data);
    }

    onVideoClose(data: string): void {
        console.log("Java调用Js onVideoClose>>", data);
        EventMgr.trigger(AdvertEventType.VIDEO_CLOSE, JSON.parse(data).data);
    }

    onYSDKLoginSuccess(): void {
        console.log("Java调用Js onYSDKLoginSuccess");
        console.log("android.onYSDKLoginSuccess");
        PlayerDataSys.isYSDKLoginSuccess = true;
        EventMgr.trigger(GameEventType.SHOW_YSDK_TOAST);
    }

    isRoot(): void {}

    getClientInfo(): void {}

    onQueryPurchasesResponseSuccess(data: unknown): void {
        console.log("查询未消耗的商品成功", data);
        EventMgr.trigger(GameEventType.QUERYPURCHASESRESPONSESUCCESS, data);
    }

    onGetAuthorityFinish(): void {
        console.log("Android回调,获取用户权限完成");
        EventMgr.trigger(NativeEventType.AUTHOR_FINISH);
    }

    getNotchHeight(): void {}

    wxLogin(): void {
        console.log("调用android微信登陆api");
    }

    onSkuDetailsResponseFail(data: unknown): void {
        console.log("查询商品详情失败", data);
        EventMgr.trigger(GameEventType.SKUDETAILFAIL, data);
    }

    showShortcutInfo(info: string): void {
        console.log("显示长按小气泡：" + info);
    }

    preLoadImgAd(): void {}

    isEmulator(): void {
        console.log("isEmulator");
    }

    onVideoOpensuccess(data: unknown): void {
        console.log("Java调用Js  onVideoOpensuccess>>", data);
        EventMgr.trigger(AdvertEventType.VIDEO_OPEN_SUCCESS, data);
    }

    onPurchasesUpdatedFail(data: unknown): void {
        console.log("支付失败", data);
        EventMgr.trigger(GameEventType.PURCHASESFAIL, data);
    }

    consumePurchase(data: unknown): void {
        console.log("消耗商品", data);
    }

    onAppResume(): void {
        console.log("Java调用Js onAppResume");
        EventMgr.trigger(NativeEventType.APP_RESUME);
    }

    onAppStart(): void {
        console.log("Java调用Js onAppStart");
        EventMgr.trigger(NativeEventType.APP_START);
    }

    getEnterAgreementTime(): void {}

    showImgAd(): void {}

    setServerIpCountry(country: string): void {
        console.log("设置中台返回的的国家", country);
    }

    loadNewSplashAd(type: unknown): void {
        SdkHelper.reportData("loadNewSplashAd", { type });
        console.log("loadNewSplashAd", type);
    }

    onGetAdInfo(data: string): void {
        const parsed = JSON.parse(data);
        console.log("获取cpm回调=======", parsed);
        EventMgr.trigger(AdvertEventType.ONGETADINFO, parsed);
    }

    onVideoFinish(_data: unknown): void {
        console.log("Java调用Js  onVideoFinish>>", _data);
        EventMgr.trigger(AdvertEventType.VIDEO_FINISH);
    }

    onCallOrderId(data: unknown): void {
        console.log("从payerMax回到应用onCallOrderId", data);
        PageMgr.hidePage("LoadingPage");
    }

    onQueryPurchasesResponseFail(data: unknown): void {
        console.log("查询未消耗的商品失败", data);
        EventMgr.trigger(GameEventType.QUERYPURCHASESRESPONSEFAIL, data);
    }

    onAppDestory(): void {
        console.log("Java调用Js onAppDestory");
        EventMgr.trigger(NativeEventType.APP_DESTROY);
    }

    finishApp(): void {}

    onGetOAID(): void {
        console.log("----Android回调,获取oaid完成==2222");
        EventMgr.trigger(NativeEventType.OAID_FINISH);
    }

    getVersionCode(): void {}

    openKefu(): void {}

    closeBannerAd(): void {}

    getAesDncrypData(): void {}

    requestSMId(): void {}

    onGetHSToken(data: string): void {
        console.log("获取火山dev_token", data);
        SdkHelper.initBD(data);
    }

    onSplashAdFinish(): void {
        console.log("android.onSplashAdFinish");
        EventMgr.trigger(AdvertEventType.SPLASH_FINISH);
    }

    onGetWechatCode(code: string): void {
        console.log("Java调用Js onGetWechatCode", code);
        EventMgr.trigger(NativeEventType.GET_WECHAT_CODE, code);
    }

    static requestBasicPermission(): void {}

    showBigToast(): void {}

    getCookieInfo(): void {}

    onConsumeResponseSuccess(data: unknown): void {
        console.log("消耗成功", data);
        EventMgr.trigger(GameEventType.CONSUMESUCCESS, data);
    }

    showToast(): void {}

    onAppRestart(): void {
        console.log("Java调用Js onAppReStart");
        EventMgr.trigger(NativeEventType.APP_RESTART);
    }

    getHSToken(): void {}

    getDeviceStatus(): void {
        cc.sys.isNative;
    }

    onVideoError(data: string): void {
        console.log("Java调用Js onVideoError>>", data);
        EventMgr.trigger(AdvertEventType.VIDEO_ERROR, JSON.parse(data).data);
    }

    reportKeyBehavior(): void {
        if (cc.sys.isNative) {
            console.log("调用android reportKeyBehavior");
        }
    }

    getVersionName(): void {}

    getCurrentCountry(): void {
        cc.sys.isNative;
    }

    getActivityNumByDate(): void {}

    initOtherSDK(): void {}

    isNetworkAcailable(): void {}

    onBillingSetupFinishedSuccess(data: unknown): void {
        console.log("google链接成功", data);
        EventMgr.trigger(GameEventType.BILLINGSUCCESS, data);
    }

    static getInstance(): CallAndroid {
        if (CallAndroid._instance == null) {
            CallAndroid._instance = new CallAndroid();
        }
        return CallAndroid._instance;
    }

    getNgister(url: string): void {
        console.log("url====", url);
    }

    getForceSlotId(): void {}

    getSMId(id: string): void {
        EventMgr.trigger(NativeEventType.ON_GET_SM_ID, id);
    }

    launchBillingFlowSuccess(data: unknown): void {
        console.log("购买成功", data);
        EventMgr.trigger(GameEventType.BILLINGBUYSUCCESS, data);
    }

    onBackPressed(): void {
        console.log("Java调用Js onBackPressed");
    }

    showForceDialog(): void {}

    setUserInfo(info: unknown): void {
        console.log("android.setUserInfo---", info);
    }

    onAppPause(): void {
        console.log("Java调用Js onAppPause");
        EventMgr.trigger(NativeEventType.APP_PAUSE);
    }

    isRunningInVirtualApk(): void {}

    playMusic(): void {}

    onGetCpm(data: unknown): void {
        console.log("android.onGetCpm---", data);
        PlayerDataSys.uploadCpm(data);
    }

    clickPay(productId: unknown, extra: unknown): void {
        console.log("购买", productId, extra);
    }

    preLoadBannerAd(): void {}

    getChannelName(): void {}

    onJump(url: string): void {
        console.log("onjump url====", url);
    }
}

(window as any).callAndroid = CallAndroid.getInstance();
