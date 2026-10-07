let e = require;
let t = module;
let o = exports;
"use strict";
cc._RF.push(t, "66a8f5qEbdH07cqRuRd75uK", "SdkHelper");
Object.defineProperty(o, "__esModule", {
  value: ! 0
}
);
var n = e("NativeEventType.js"),
i = e("CallAndroid.js"),
a = e("CalliOS.js"),
r = e("PoolNative.js"),
l = e("AudioManager.js"),
s = e("EventMgr.js"),
c = e("AdManager.js"),
u = e("ClientData.js"),
p = e("BaseSystem.js"),
d = e("EngineUtil.js"),
_ = [JSON.stringify({
  short_label: "卸载", short_icon: "2"
}
), JSON.stringify({
  short_label: "5分钟可提现", short_icon: "1"
}
)],
f = function() {
  function e() {
    this.EnableSDK = ! 0;
    this.clientData = null;
    this.user_id = "";
    this.sm_event_type = "activate";
    this.isAppFlyerSDK = ! 1;
    this.is_init_sdk = ! 1;
    this.bd_did = cc.sys.localStorage.getItem("dev_token")|| "";
    this.vibratorDuration = 0;
    s.default.listen(n.default.APP_START, this.onAppStart, this);
    s.default.listen(n.default.APP_STOP, this.onAppStop, this);
    s.default.listen(n.default.APP_RESTART, this.onAppRestart, this);
    s.default.listen(n.default.APP_PAUSE, this.onAppPause, this);
    s.default.listen(n.default.APP_RESUME, this.onAppResume, this);
    s.default.listen(n.default.APP_DESTROY, this.onAppDestory, this);
    s.default.listen(n.default.ON_GET_SM_ID, this.onGetSmId, this);
  }
  e.prototype.isRootInVirtualApk = function() {
    return ! 1;
  }
;
  e.prototype.isNetworkAcailable = function() {
    return ! 0;
  }
;
  e._getInstance = function() {
    e._instance|| (e._instance = new e());
    return e._instance;
  }
;
  e.prototype.getFirstLaunchTime = function() {
    return cc.sys.isNative&& cc.sys.os == cc.sys.OS_ANDROID? i.default.getInstance().getFirstLaunchTime(): 0;
  }
;
  e.prototype.getEnterAgreementTime = function() {
    return cc.sys.isNative&& cc.sys.os == cc.sys.OS_ANDROID? i.default.getInstance().getEnterAgreementTime(): 0;
  }
;
  e.prototype.setUserInfo = function(e) {
    this.user_id = e.user_id;
    console.log("设置原生端用户信息==", e);
    this.EnableSDK&& (cc.sys.os === cc.sys.OS_ANDROID? i.default.getInstance().setUserInfo(JSON.stringify(e)): cc.sys.os === cc.sys.OS_IOS&& a.default.getInstance().setUserInfo(JSON.stringify(e)));
  }
;
  e.prototype.onAppStop = function() {
    this.reportData("app_stop");
  }
;
  e.prototype.showShortcutInfo = function() {
    this.reportData("u_show_notification");
    cc.sys.isNative? cc.sys.os === cc.sys.OS_ANDROID&& _.forEach(function(e) {
      i.default.getInstance().showShortcutInfo(e);
    }
): _.forEach(function(e) {
      console.log("showShortcutInfo : "+ e);
    }
);
  }
;
  e.prototype.refreshPurchasesAsync = function() {
    cc.sys.os === cc.sys.OS_ANDROID&& i.default.getInstance().refreshPurchasesAsync();
  }
;
  e.prototype.onAppDestory = function() {
    this.reportData("app_destory");
  }
;
  e.prototype.playNativeAudio = function(e) {
    cc.sys.isNative&& (cc.sys.os === cc.sys.OS_ANDROID? i.default.getInstance().playMusic(e):(cc.sys.os, cc.sys.OS_IOS));
  }
;
  e.prototype.initAppFlyer = function() {
    if(cc.sys.os === cc.sys.OS_ANDROID) {
      if(this.isAppFlyerSDK) return;
      console.log("initAppFlyer");
      i.default.getInstance().initAppFlyer();
    }
    this.isAppFlyerSDK = ! 0;
  }
;
  e.prototype.getRealCountry = function() {
    if(cc.sys.os === cc.sys.OS_ANDROID) return i.default.getInstance().getRealCountry();
  }
;
  e.prototype.getVersionCode = function() {
    return cc.sys.os != cc.sys.OS_ANDROID? "": i.default.getInstance().getVersionCode();
  }
;
  e.initSingularSDK = function() {
    if(cc.sys.os === cc.sys.OS_ANDROID) {
      if(this.isSingularSDK) return;
      console.log("initSingularSDK");
      i.default.getInstance().initSingularSDK();
    }
    this.isSingularSDK = ! 0;
  }
;
  e.prototype.querySkuDetails = function(e) {
    if(cc.sys.os === cc.sys.OS_ANDROID) {
      console.log("安卓手机querySkuDetails"+ e);
      i.default.getInstance().querySkuDetails(e);
    }
  }
;
  e.prototype.showBigToast = function(e) {
    this.EnableSDK&& cc.sys.isNative? cc.sys.os === cc.sys.OS_ANDROID&& i.default.getInstance().showBigToast(e): console.log("非原生端,手动吐司~~~~~,"+ e);
  }
;
  e.prototype.requestTDId = function() {
    return cc.sys.os === cc.sys.OS_ANDROID? i.default.getInstance().requestTDId(): cc.sys.os === cc.sys.OS_IOS? a.default.getInstance().getTongDunID(): void 0;
  }
;
  e.prototype.onGetSmId = function(e) {
    p.default.shumengReport({
      did: e, event_type: this.sm_event_type
    }
);
  }
;
  e.prototype.getIsCheckUser = function() {
    if(! cc.sys.isNative) return ! 1;
    console.log("CallAndroid.getInstance().isRoot()", i.default.getInstance().isRoot(), i.default.getInstance().isEmulator(), i.default.getInstance().isRunningInVirtualApk());
    return cc.sys.os === cc.sys.OS_ANDROID? ! !(i.default.getInstance().isRoot()|| i.default.getInstance().isEmulator()|| i.default.getInstance().isRunningInVirtualApk()): void 0;
  }
;
  e.prototype.getUrlSplicingString = function() {
    return this.EnableSDK&& (cc.sys.os, cc.sys.OS_ANDROID),
    u.default.url_common_str;
  }
;
  e.prototype.getCurrentCountry = function() {
    return cc.sys.os === cc.sys.OS_ANDROID? i.default.getInstance().getCurrentCountry(): "CN";
  }
;
  e.prototype.initOtherSDK_CN = function() {
    s.default.trigger(n.default.OAID_FINISH);
    s.default.trigger(n.default.AUTHOR_FINISH);
  }
;
  e.prototype.clickPay = function(e, t) {
    if(cc.sys.os === cc.sys.OS_ANDROID) {
      console.log("安卓手机购买");
      i.default.getInstance().clickPay(e, t);
    }
  }
;
  e.prototype.consumePurchase = function(e) {
    cc.sys.os === cc.sys.OS_ANDROID&& i.default.getInstance().consumePurchase(e);
  }
;
  e.prototype.getBD_did = function() {
    if(cc.sys.isNative&& cc.sys.os === cc.sys.OS_ANDROID) {
      console.log("ClientData.version_name: ", u.default.version_name);
      return i.default.getInstance().getHSToken()|| "";
    }
  }
;
  e.prototype.showForceToast = function(e) {
    if(cc.sys.isNative&& e) {
      cc.sys.os == cc.sys.OS_ANDROID&& i.default.getInstance().showForceToast(e);
      cc.sys.os == cc.sys.OS_IOS&& a.default.getInstance().showForceToast(e);
    } else console.log("showToast", e|| "无数据");
  }
;
  e.prototype.onAppStart = function() {
    this.reportData("app_start");
  }
;
  e.prototype.requestSMId = function() {
    cc.sys.os === cc.sys.OS_ANDROID? i.default.getInstance().requestSMId(): cc.sys.os === cc.sys.OS_IOS&& a.default.getInstance().getTongDunID();
  }
;
  e.prototype.getActivityNumByDate = function(e) {
    return cc.sys.isNative? cc.sys.os === cc.sys.OS_ANDROID? i.default.getInstance().getActivityNumByDate(e): void 0: 0;
  }
;
  e.prototype.getDeviceStatus = function() {
    return {
    }
;
  }
;
  e.prototype.initBD = function(e) {
    if(e&& "null" != e|| ! cc.sys.isNative) {
      this.bd_did = e;
      cc.sys.localStorage.setItem("dev_token", e);
    }
  }
;
  e.prototype.billingClientInit = function() {
    cc.sys.os === cc.sys.OS_ANDROID&& i.default.getInstance().billingClientInit();
  }
;
  e.prototype.getVersionName = function() {
    return cc.sys.os != cc.sys.OS_ANDROID? "": i.default.getInstance().getVersionName();
  }
;
  e.prototype.onAppPause = function() {
    this.reportData("app_pause");
    c.default.getInstance().checkSpecialResume(! 1);
  }
;
  e.prototype.showToast = function(e) {
    if(e) if(this.EnableSDK&& cc.sys.isNative) {
      if(cc.sys.os === cc.sys.OS_ANDROID) i.default.getInstance().showToast(e);
      else if(cc.sys.os == cc.sys.OS_IOS) {
        console.log("ios吐司~~~~~,"+ e);
        a.default.getInstance().showToast(e);
      }
    } else console.log("非原生端,手动吐司~~~~~,"+ e);
  }
;
  e.prototype.finishApp = function() {
    console.log("退出app");
    this.EnableSDK&& cc.sys.os === cc.sys.OS_ANDROID? i.default.getInstance().finishApp(): cc.sys.os == cc.sys.OS_IOS&& a.default.getInstance().finishActivity();
  }
;
  e.prototype.getScreenHeight = function() {
    return cc.sys.isNative? this.EnableSDK&& cc.sys.os === cc.sys.OS_ANDROID? i.default.getInstance().getScreenHeight(): cc.sys.os == cc.sys.OS_IOS? a.default.getInstance().getScreenHeight(): void 0: cc.winSize.height;
  }
;
  e.prototype.getAesDncrypData = function(e) {
    return this.EnableSDK&& cc.sys.os === cc.sys.OS_ANDROID? i.default.getInstance().getAesDncrypData(e): null;
  }
;
  e.prototype.onAppResume = function() {
    this.reportData("app_resume");
    c.default.getInstance().checkSpecialResume(! 0);
  }
;
  e.prototype.getNetWorkStatus = function() {
    return cc.sys.os == cc.sys.OS_IOS? Number(a.default.getInstance().getNetworkingStatus()): 1;
  }
;
  e.prototype.onAppRestart = function() {
    this.reportData("app_restart");
  }
;
  e.prototype.setServerIpCountry = function(e) {
    cc.sys.os === cc.sys.OS_ANDROID&& i.default.getInstance().setServerIpCountry(e);
  }
;
  e.prototype.callWxLogin = function() {
    cc.sys.isNative? cc.sys.os == cc.sys.OS_ANDROID? i.default.getInstance().wxLogin(): cc.sys.os == cc.sys.OS_IOS&& a.default.getInstance().wxLogin(): console.error("非原生端,微信登录失败");
  }
;
  e.prototype.setXhrCookie = function(e) {
    this.EnableSDK&& cc.sys.os === cc.sys.OS_ANDROID? e.setRequestHeader("Cookie", document.cookie): cc.sys.os === cc.sys.OS_IOS&& e.setRequestHeader("Cookie", document.cookie);
  }
;
  e.prototype.setNotchHeight = function() {
    this.EnableSDK&& (cc.sys.os, cc.sys.OS_ANDROID);
  }
;
  e.prototype.getClientInfo = function() {
    var e = d.default.localStorageGetItem("Web_Device_Id", "");
    if(! e) {
      e = "test"+ d.default.getRandId();
      d.default.localStorageSetItem("Web_Device_Id", e);
    }
    this.clientData = {
      device_id: e,
      aid: "aid",
      ii: "li",
      madr: "madr",
      wmr: "wmr",
      version_name: "1.1.5.8",
      channel_name: "web"
    }
;
    return this.clientData;
  }
;
  e.prototype.getNgister = function() {
    return "";
  }
;
  e.prototype.getChannelName = function() {
    return cc.sys.os != cc.sys.OS_ANDROID? "": i.default.getInstance().getChannelName();
  }
;
  e.prototype.reportData = function(e, t, o) {
    void 0 === o&& (o = ! 1);
  }
;
  e.prototype.onJump = function(e) {
    cc.sys.os === cc.sys.OS_ANDROID&& i.default.getInstance().onJump(e);
  }
;
  e.prototype.showNotification = function(e) {
    cc.sys.os === cc.sys.OS_ANDROID&& i.default.getInstance().showNotification(e);
  }
;
  e.prototype.ysdkLogin = function() {
    cc.sys.os === cc.sys.OS_ANDROID&& i.default.getInstance().ysdkLogin();
  }
;
  e.prototype.setVibrator = function(e) {
    void 0 === e&& (e = 50);
    if(e > 0&& l.default.getInstance().getVibratorState()) {
      console.log("震动~~~"+ e);
      r.PoolNative.vibrate(e);
    }
  }
;
  e.prototype.initOtherSDK = function(e) {
    if(cc.sys.os === cc.sys.OS_ANDROID) {
      if(this.is_init_sdk) return;
      i.default.getInstance().initOtherSDK();
      e&& s.default.trigger(n.default.SDKINIT_FINISH);
      this.is_init_sdk = ! 0;
    } else s.default.trigger(n.default.SDKINIT_FINISH);
  }
;
  e.prototype.showForceDialog = function(e, t) {
    t&& (this.EnableSDK&& cc.sys.isNative? cc.sys.os === cc.sys.OS_ANDROID&& i.default.getInstance().showForceDialog(e, t): console.log("非原生端,手动吐司~~~~~,"+ t));
  }
;
  e.prototype.reportKeyBehavior = function() {
    cc.sys.os === cc.sys.OS_ANDROID&& i.default.getInstance().reportKeyBehavior();
  }
;
  e.prototype.getAesEncrypData = function(e) {
    if(cc.sys.isNative) {
      if(this.EnableSDK&& cc.sys.os === cc.sys.OS_ANDROID) return i.default.getInstance().getAesEncrypData(e);
    } else console.log("非原生端,无法加密", e);
  }
;
  e.prototype.openAgreementPage = function() {
    cc.sys.isNative&& cc.sys.os == cc.sys.OS_ANDROID&& i.default.getInstance().setEnterAgreementTime();
  }
;
  e.prototype.getMiddleConfig = function() {
    if(! cc.sys.isNative) {
      s.default.trigger(n.default.ON_GET_MIDDLE_CONFIG, "{}");
      return "{}";
    }
    if(cc.sys.os === cc.sys.OS_ANDROID) return i.default.getInstance().getMiddleConfig();
  }
;
  e.prototype.feedback = function(e, t, o) {
    this.EnableSDK&& cc.sys.os === cc.sys.OS_ANDROID? i.default.getInstance().openKefu(e, t, o): cc.sys.os == cc.sys.OS_IOS&& a.default.getInstance().openKefu(e, t, o);
  }
;
  e._instance = null;
  e.isSingularSDK = ! 1;
  return e;
}
();
o.default = f._getInstance();
cc._RF.pop();
