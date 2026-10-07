let e = require;
let t = module;
let o = exports;
"use strict";
cc._RF.push(t, "f4185N2svBPXLAP27b9B1mx", "CallAndroid");
Object.defineProperty(o, "__esModule", {
  value: ! 0
}
);
var n = e("AdvertEventType.js"),
i = e("NativeEventType.js"),
a = e("PlayerDataSys.js"),
r = e("EventMgr.js"),
l = e("GameEventType.js"),
s = e("SdkHelper.js"),
c = e("EngineUtil.js"),
u = e("SystemConfig.js"),
p = e("PageMgr.js"),
d = function() {
  function e() {
  }
  e.prototype.launchBillingFlowFail = function(e) {
    console.log("购买失败", e);
    r.default.trigger(l.default.BILLINGBUYFAIL, e);
  }
;
  e.prototype.getRealCountry = function() {
    cc.sys.isNative;
  }
;
  e.prototype.closeSplashAd = function() {
    console.log("android.closeSplashAd");
  }
;
  e.prototype.ysdkLogin = function() {
  }
;
  e.prototype.showRewardVideoAd = function(e) {
    console.log("android.showRewardVideoAd ", e);
  }
;
  e.prototype.getFirstLaunchTime = function() {
  }
;
  e.prototype.onPurchasesUpdatedSuccess = function(e) {
    console.log("支付成功", e);
    r.default.trigger(l.default.PURCHASESSUCCESS, e);
  }
;
  e.prototype.onGetConfig = function(e) {
    console.log("Java调用Js 中台配置 onGetConfig", e);
    r.default.trigger(i.default.ON_GET_MIDDLE_CONFIG, e);
  }
;
  e.prototype.initSingularSDK = function() {
  }
;
  e.prototype.reportData = function(e, t, o) {
    void 0 === o&& (o = ! 1);
    var n = {
    }
;
    n.eventName = e;
    var i = [];
    i.push({
      paramName: "ts", paramValue: c.default.getTimeStamp()
    }
);
    i.push({
      paramName: "game_name", paramValue: u.GAME_NAME
    }
);
    if(t) for(var a = Object.keys(t), r = 0;
    r < a.length;
    r++) {
      var l = {
      }
;
      l.paramName = a[r];
      l.paramValue = t[a[r]];
      i.push(l);
    }
    n.param = i;
    var s = JSON.stringify(n);
    cc.sys.isNative&& console.log("android", o+ "埋点>>>>>>>>>>"+ s);
  }
;
  e.prototype.cancelVibrator = function() {
  }
;
  e.prototype.getScreenHeight = function() {
  }
;
  e.prototype.getAesEncrypData = function() {
  }
;
  e.prototype.getOAID = function() {
    console.log("----Android回调,获取oaid完成==1111");
    r.default.trigger(i.default.OAID_FINISH);
  }
;
  e.prototype.refreshPurchasesAsync = function() {
    console.log("查询未消耗的商品");
  }
;
  e.prototype.showBannerAd = function() {
  }
;
  e.prototype.getScreenWidth = function() {
  }
;
  e.prototype.requestTDId = function() {
  }
;
  e.prototype.getMiddleConfig = function() {
  }
;
  e.prototype.showNotification = function() {
  }
;
  e.prototype.getBdDid = function() {
  }
;
  e.prototype.showForceToast = function() {
  }
;
  e.prototype.onConsumeResponseFail = function(e) {
    console.log("消耗失败", e);
    r.default.trigger(l.default.CONSUMEFAIL, e);
  }
;
  e.prototype.hasNotchInScreen = function() {
  }
;
  e.prototype.setVibrator = function() {
  }
;
  e.prototype.showSplashAd = function() {
    console.log("showSplashAd");
  }
;
  e.prototype.setEnterAgreementTime = function() {
  }
;
  e.prototype.initAppFlyer = function() {
  }
;
  e.prototype.onGetBdDid = function(e) {
    console.log("获取火山id", e);
    s.default.initBD(e);
  }
;
  e.prototype.onBillingSetupFinishedFail = function(e) {
    console.log("google链接失败", e);
    r.default.trigger(l.default.BILLINGFAILED, e);
  }
;
  e.prototype.getNormalSlotId = function() {
  }
;
  e.prototype.closeImgAd = function() {
  }
;
  e.prototype.querySkuDetails = function(e) {
    console.log("查询商品详情", e);
  }
;
  e.prototype.billingClientInit = function() {
    console.log("google支付初始化");
  }
;
  e.prototype.onAppStop = function() {
    console.log("Java调用Js onAppStop");
    r.default.trigger(i.default.APP_STOP);
  }
;
  e.prototype.getBlackBox = function() {
  }
;
  e.prototype.onSkuDetailsResponseSuccess = function(e) {
    console.log("查询商品详情成功onSkuDetailsResponseSuccess2", e);
    s.default.reportData("onSkuDetailsResponseSuccess", {
      logResponse: e
    }
);
    r.default.trigger(l.default.SKUDETAILSUCCESS, e);
  }
;
  e.prototype.onVideoClose = function(e) {
    console.log("Java调用Js onVideoClose>>", e);
    r.default.trigger(n.default.VIDEO_CLOSE, JSON.parse(e).data);
  }
;
  e.prototype.onYSDKLoginSuccess = function() {
    console.log("Java调用Js onYSDKLoginSuccess");
    console.log("android.onYSDKLoginSuccess");
    a.default.isYSDKLoginSuccess = ! 0;
    r.default.trigger(l.default.SHOW_YSDK_TOAST);
  }
;
  e.prototype.isRoot = function() {
  }
;
  e.prototype.getClientInfo = function() {
  }
;
  e.prototype.onQueryPurchasesResponseSuccess = function(e) {
    console.log("查询未消耗的商品成功", e);
    r.default.trigger(l.default.QUERYPURCHASESRESPONSESUCCESS, e);
  }
;
  e.prototype.onGetAuthorityFinish = function() {
    console.log("Android回调,获取用户权限完成");
    r.default.trigger(i.default.AUTHOR_FINISH);
  }
;
  e.prototype.getNotchHeight = function() {
  }
;
  e.prototype.wxLogin = function() {
    console.log("调用android微信登陆api");
  }
;
  e.prototype.onSkuDetailsResponseFail = function(e) {
    console.log("查询商品详情失败", e);
    r.default.trigger(l.default.SKUDETAILFAIL, e);
  }
;
  e.prototype.showShortcutInfo = function(e) {
    console.log("显示长按小气泡："+ e);
  }
;
  e.prototype.preLoadImgAd = function() {
  }
;
  e.prototype.isEmulator = function() {
    console.log("isEmulator");
  }
;
  e.prototype.onVideoOpensuccess = function(e) {
    console.log("Java调用Js  onVideoOpensuccess>>", e);
    r.default.trigger(n.default.VIDEO_OPEN_SUCCESS, e);
  }
;
  e.prototype.onPurchasesUpdatedFail = function(e) {
    console.log("支付失败", e);
    r.default.trigger(l.default.PURCHASESFAIL, e);
  }
;
  e.prototype.consumePurchase = function(e) {
    console.log("消耗商品", e);
  }
;
  e.prototype.onAppResume = function() {
    console.log("Java调用Js onAppResume");
    r.default.trigger(i.default.APP_RESUME);
  }
;
  e.prototype.onAppStart = function() {
    console.log("Java调用Js onAppStart");
    r.default.trigger(i.default.APP_START);
  }
;
  e.prototype.getEnterAgreementTime = function() {
  }
;
  e.prototype.showImgAd = function() {
  }
;
  e.prototype.setServerIpCountry = function(e) {
    console.log("设置中台返回的的国家", e);
  }
;
  e.prototype.loadNewSplashAd = function(e) {
    s.default.reportData("loadNewSplashAd", {
      type: e
    }
);
    console.log("loadNewSplashAd", e);
  }
;
  e.prototype.onGetAdInfo = function(e) {
    var t = JSON.parse(e);
    console.log("获取cpm回调=======", t);
    r.default.trigger(n.default.ONGETADINFO, t);
  }
;
  e.prototype.onVideoFinish = function(e) {
    console.log("Java调用Js  onVideoFinish>>", e);
    r.default.trigger(n.default.VIDEO_FINISH);
  }
;
  e.prototype.onCallOrderId = function(e) {
    console.log("从payerMax回到应用onCallOrderId", e);
    p.default.hidePage("LoadingPage");
  }
;
  e.prototype.onQueryPurchasesResponseFail = function(e) {
    console.log("查询未消耗的商品失败", e);
    r.default.trigger(l.default.QUERYPURCHASESRESPONSEFAIL, e);
  }
;
  e.prototype.onAppDestory = function() {
    console.log("Java调用Js onAppDestory");
    r.default.trigger(i.default.APP_DESTROY);
  }
;
  e.prototype.finishApp = function() {
  }
;
  e.prototype.onGetOAID = function() {
    console.log("----Android回调,获取oaid完成==2222");
    r.default.trigger(i.default.OAID_FINISH);
  }
;
  e.prototype.getVersionCode = function() {
  }
;
  e.prototype.openKefu = function() {
  }
;
  e.prototype.closeBannerAd = function() {
  }
;
  e.prototype.getAesDncrypData = function() {
  }
;
  e.prototype.requestSMId = function() {
  }
;
  e.prototype.onGetHSToken = function(e) {
    console.log("获取火山dev_token", e);
    s.default.initBD(e);
  }
;
  e.prototype.onSplashAdFinish = function() {
    console.log("android.onSplashAdFinish");
    r.default.trigger(n.default.SPLASH_FINISH);
  }
;
  e.prototype.onGetWechatCode = function(e) {
    console.log("Java调用Js onGetWechatCode", e);
    r.default.trigger(i.default.GET_WECHAT_CODE, e);
  }
;
  e.requestBasicPermission = function() {
  }
;
  e.prototype.showBigToast = function() {
  }
;
  e.prototype.getCookieInfo = function() {
  }
;
  e.prototype.onConsumeResponseSuccess = function(e) {
    console.log("消耗成功", e);
    r.default.trigger(l.default.CONSUMESUCCESS, e);
  }
;
  e.prototype.showToast = function() {
  }
;
  e.prototype.onAppRestart = function() {
    console.log("Java调用Js onAppReStart");
    r.default.trigger(i.default.APP_RESTART);
  }
;
  e.prototype.getHSToken = function() {
  }
;
  e.prototype.getDeviceStatus = function() {
    cc.sys.isNative;
  }
;
  e.prototype.onVideoError = function(e) {
    console.log("Java调用Js onVideoError>>", e);
    r.default.trigger(n.default.VIDEO_ERROR, JSON.parse(e).data);
  }
;
  e.prototype.reportKeyBehavior = function() {
    cc.sys.isNative&& console.log("调用android reportKeyBehavior");
  }
;
  e.prototype.getVersionName = function() {
  }
;
  e.prototype.getCurrentCountry = function() {
    cc.sys.isNative;
  }
;
  e.prototype.getActivityNumByDate = function() {
  }
;
  e.prototype.initOtherSDK = function() {
  }
;
  e.prototype.isNetworkAcailable = function() {
  }
;
  e.prototype.onBillingSetupFinishedSuccess = function(e) {
    console.log("google链接成功", e);
    r.default.trigger(l.default.BILLINGSUCCESS, e);
  }
;
  e.getInstance = function() {
    null == this._instance&& (this._instance = new e());
    return this._instance;
  }
;
  e.prototype.getNgister = function(e) {
    console.log("url====", e);
  }
;
  e.prototype.getForceSlotId = function() {
  }
;
  e.prototype.getSMId = function(e) {
    r.default.trigger(i.default.ON_GET_SM_ID, e);
  }
;
  e.prototype.launchBillingFlowSuccess = function(e) {
    console.log("购买成功", e);
    r.default.trigger(l.default.BILLINGBUYSUCCESS, e);
  }
;
  e.prototype.onBackPressed = function() {
    console.log("Java调用Js onBackPressed");
  }
;
  e.prototype.showForceDialog = function() {
  }
;
  e.prototype.setUserInfo = function(e) {
    console.log("android.setUserInfo---", e);
  }
;
  e.prototype.onAppPause = function() {
    console.log("Java调用Js onAppPause");
    r.default.trigger(i.default.APP_PAUSE);
  }
;
  e.prototype.isRunningInVirtualApk = function() {
  }
;
  e.prototype.playMusic = function() {
  }
;
  e.prototype.onGetCpm = function(e) {
    console.log("android.onGetCpm---", e);
    a.default.uploadCpm(e);
  }
;
  e.prototype.clickPay = function(e, t) {
    console.log("购买", e, t);
  }
;
  e.prototype.preLoadBannerAd = function() {
  }
;
  e.prototype.getChannelName = function() {
  }
;
  e.prototype.onJump = function(e) {
    console.log("onjump url====", e);
  }
;
  e._instance = null;
  return e;
}
();
o.default = d;
window.callAndroid = d.getInstance();
cc._RF.pop();
