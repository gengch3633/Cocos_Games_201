import AdvertEventType from "./AdvertEventType";
import EngineUtil from "./EngineUtil";
import EventMgr from "./EventMgr";
import GameEventType from "./GameEventType";
import NativeEventType from "./NativeEventType";
import PageMgr from "./PageMgr";
import PlayerDataSys from "./PlayerDataSys";
import SdkHelper from "./SdkHelper";
import { GAME_NAME } from "./SystemConfig";

export default class CallAndroid {
    static _instance = null;

    launchBillingFlowFail(e) {
        console.log("购买失败", e);
        EventMgr.trigger(GameEventType.BILLINGBUYFAIL, e);
    }

    getRealCountry() {
        cc.sys.isNative;
    }

    closeSplashAd() {
        console.log("android.closeSplashAd");
    }

    ysdkLogin() {
    }

    showRewardVideoAd(e) {
        console.log("android.showRewardVideoAd ", e);
    }

    getFirstLaunchTime() {
    }

    onPurchasesUpdatedSuccess(e) {
        console.log("支付成功", e);
        EventMgr.trigger(GameEventType.PURCHASESSUCCESS, e);
    }

    onGetConfig(e) {
        console.log("Java调用Js 中台配置 onGetConfig", e);
        EventMgr.trigger(NativeEventType.ON_GET_MIDDLE_CONFIG, e);
    }

    initSingularSDK() {
    }

    reportData(e, t, o = false) {
        const n: any = {};
        n.eventName = e;
        const i = [];
        i.push({
            paramName: "ts",
            paramValue: EngineUtil.getTimeStamp()
        });
        i.push({
            paramName: "game_name",
            paramValue: GAME_NAME
        });
        if (t) {
            const a = Object.keys(t);
            for (let r = 0; r < a.length; r++) {
                const l: any = {};
                l.paramName = a[r];
                l.paramValue = t[a[r]];
                i.push(l);
            }
        }
        n.param = i;
        const s = JSON.stringify(n);
        if (cc.sys.isNative) {
            console.log("android", o + "埋点>>>>>>>>>>" + s);
        }
    }

    cancelVibrator() {
    }

    getScreenHeight() {
    }

    getAesEncrypData() {
    }

    getOAID() {
        console.log("----Android回调,获取oaid完成==1111");
        EventMgr.trigger(NativeEventType.OAID_FINISH);
    }

    refreshPurchasesAsync() {
        console.log("查询未消耗的商品");
    }

    showBannerAd() {
    }

    getScreenWidth() {
    }

    requestTDId() {
    }

    getMiddleConfig() {
    }

    showNotification() {
    }

    getBdDid() {
    }

    showForceToast() {
    }

    onConsumeResponseFail(e) {
        console.log("消耗失败", e);
        EventMgr.trigger(GameEventType.CONSUMEFAIL, e);
    }

    hasNotchInScreen() {
    }

    setVibrator() {
    }

    showSplashAd() {
        console.log("showSplashAd");
    }

    setEnterAgreementTime() {
    }

    initAppFlyer() {
    }

    onGetBdDid(e) {
        console.log("获取火山id", e);
        SdkHelper.initBD(e);
    }

    onBillingSetupFinishedFail(e) {
        console.log("google链接失败", e);
        EventMgr.trigger(GameEventType.BILLINGFAILED, e);
    }

    getNormalSlotId() {
    }

    closeImgAd() {
    }

    querySkuDetails(e) {
        console.log("查询商品详情", e);
    }

    billingClientInit() {
        console.log("google支付初始化");
    }

    onAppStop() {
        console.log("Java调用Js onAppStop");
        EventMgr.trigger(NativeEventType.APP_STOP);
    }

    getBlackBox() {
    }

    onSkuDetailsResponseSuccess(e) {
        console.log("查询商品详情成功onSkuDetailsResponseSuccess2", e);
        SdkHelper.reportData("onSkuDetailsResponseSuccess", {
            logResponse: e
        });
        EventMgr.trigger(GameEventType.SKUDETAILSUCCESS, e);
    }

    onVideoClose(e) {
        console.log("Java调用Js onVideoClose>>", e);
        EventMgr.trigger(AdvertEventType.VIDEO_CLOSE, JSON.parse(e).data);
    }

    onYSDKLoginSuccess() {
        console.log("Java调用Js onYSDKLoginSuccess");
        console.log("android.onYSDKLoginSuccess");
        PlayerDataSys.isYSDKLoginSuccess = true;
        EventMgr.trigger(GameEventType.SHOW_YSDK_TOAST);
    }

    isRoot() {
    }

    getClientInfo() {
    }

    onQueryPurchasesResponseSuccess(e) {
        console.log("查询未消耗的商品成功", e);
        EventMgr.trigger(GameEventType.QUERYPURCHASESRESPONSESUCCESS, e);
    }

    onGetAuthorityFinish() {
        console.log("Android回调,获取用户权限完成");
        EventMgr.trigger(NativeEventType.AUTHOR_FINISH);
    }

    getNotchHeight() {
    }

    wxLogin() {
        console.log("调用android微信登陆api");
    }

    onSkuDetailsResponseFail(e) {
        console.log("查询商品详情失败", e);
        EventMgr.trigger(GameEventType.SKUDETAILFAIL, e);
    }

    showShortcutInfo(e) {
        console.log("显示长按小气泡：" + e);
    }

    preLoadImgAd() {
    }

    isEmulator() {
        console.log("isEmulator");
    }

    onVideoOpensuccess(e) {
        console.log("Java调用Js  onVideoOpensuccess>>", e);
        EventMgr.trigger(AdvertEventType.VIDEO_OPEN_SUCCESS, e);
    }

    onPurchasesUpdatedFail(e) {
        console.log("支付失败", e);
        EventMgr.trigger(GameEventType.PURCHASESFAIL, e);
    }

    consumePurchase(e) {
        console.log("消耗商品", e);
    }

    onAppResume() {
        console.log("Java调用Js onAppResume");
        EventMgr.trigger(NativeEventType.APP_RESUME);
    }

    onAppStart() {
        console.log("Java调用Js onAppStart");
        EventMgr.trigger(NativeEventType.APP_START);
    }

    getEnterAgreementTime() {
    }

    showImgAd() {
    }

    setServerIpCountry(e) {
        console.log("设置中台返回的的国家", e);
    }

    loadNewSplashAd(e) {
        SdkHelper.reportData("loadNewSplashAd", {
            type: e
        });
        console.log("loadNewSplashAd", e);
    }

    onGetAdInfo(e) {
        const t = JSON.parse(e);
        console.log("获取cpm回调=======", t);
        EventMgr.trigger(AdvertEventType.ONGETADINFO, t);
    }

    onVideoFinish(e) {
        console.log("Java调用Js  onVideoFinish>>", e);
        EventMgr.trigger(AdvertEventType.VIDEO_FINISH);
    }

    onCallOrderId(e) {
        console.log("从payerMax回到应用onCallOrderId", e);
        PageMgr.hidePage("LoadingPage");
    }

    onQueryPurchasesResponseFail(e) {
        console.log("查询未消耗的商品失败", e);
        EventMgr.trigger(GameEventType.QUERYPURCHASESRESPONSEFAIL, e);
    }

    onAppDestory() {
        console.log("Java调用Js onAppDestory");
        EventMgr.trigger(NativeEventType.APP_DESTROY);
    }

    finishApp() {
    }

    onGetOAID() {
        console.log("----Android回调,获取oaid完成==2222");
        EventMgr.trigger(NativeEventType.OAID_FINISH);
    }

    getVersionCode() {
    }

    openKefu() {
    }

    closeBannerAd() {
    }

    getAesDncrypData() {
    }

    requestSMId() {
    }

    onGetHSToken(e) {
        console.log("获取火山dev_token", e);
        SdkHelper.initBD(e);
    }

    onSplashAdFinish() {
        console.log("android.onSplashAdFinish");
        EventMgr.trigger(AdvertEventType.SPLASH_FINISH);
    }

    onGetWechatCode(e) {
        console.log("Java调用Js onGetWechatCode", e);
        EventMgr.trigger(NativeEventType.GET_WECHAT_CODE, e);
    }

    static requestBasicPermission() {
    }

    showBigToast() {
    }

    getCookieInfo() {
    }

    onConsumeResponseSuccess(e) {
        console.log("消耗成功", e);
        EventMgr.trigger(GameEventType.CONSUMESUCCESS, e);
    }

    showToast() {
    }

    onAppRestart() {
        console.log("Java调用Js onAppReStart");
        EventMgr.trigger(NativeEventType.APP_RESTART);
    }

    getHSToken() {
    }

    getDeviceStatus() {
        cc.sys.isNative;
    }

    onVideoError(e) {
        console.log("Java调用Js onVideoError>>", e);
        EventMgr.trigger(AdvertEventType.VIDEO_ERROR, JSON.parse(e).data);
    }

    reportKeyBehavior() {
        if (cc.sys.isNative) {
            console.log("调用android reportKeyBehavior");
        }
    }

    getVersionName() {
    }

    getCurrentCountry() {
        cc.sys.isNative;
    }

    getActivityNumByDate() {
    }

    initOtherSDK() {
    }

    isNetworkAcailable() {
    }

    onBillingSetupFinishedSuccess(e) {
        console.log("google链接成功", e);
        EventMgr.trigger(GameEventType.BILLINGSUCCESS, e);
    }

    static getInstance() {
        if (null == this._instance) {
            this._instance = new CallAndroid();
        }
        return this._instance;
    }

    getNgister(e) {
        console.log("url====", e);
    }

    getForceSlotId() {
    }

    getSMId(e) {
        EventMgr.trigger(NativeEventType.ON_GET_SM_ID, e);
    }

    launchBillingFlowSuccess(e) {
        console.log("购买成功", e);
        EventMgr.trigger(GameEventType.BILLINGBUYSUCCESS, e);
    }

    onBackPressed() {
        console.log("Java调用Js onBackPressed");
    }

    showForceDialog() {
    }

    setUserInfo(e) {
        console.log("android.setUserInfo---", e);
    }

    onAppPause() {
        console.log("Java调用Js onAppPause");
        EventMgr.trigger(NativeEventType.APP_PAUSE);
    }

    isRunningInVirtualApk() {
    }

    playMusic() {
    }

    onGetCpm(e) {
        console.log("android.onGetCpm---", e);
        PlayerDataSys.uploadCpm(e);
    }

    clickPay(e, t) {
        console.log("购买", e, t);
    }

    preLoadBannerAd() {
    }

    getChannelName() {
    }

    onJump(e) {
        console.log("onjump url====", e);
    }
}

window.callAndroid = CallAndroid.getInstance();
