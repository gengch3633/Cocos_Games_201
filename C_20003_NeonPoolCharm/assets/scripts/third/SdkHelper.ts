import AdManager from "./AdManager";
import AudioManager from "./AudioManager";
import BaseSystem from "./BaseSystem";
import CallAndroid from "./CallAndroid";
import CalliOS from "./CalliOS";
import ClientData from "./ClientData";
import EngineUtil from "./EngineUtil";
import EventMgr from "./EventMgr";
import NativeEventType from "./NativeEventType";
import { PoolNative } from "./PoolNative";

const shortcutInfoList = [JSON.stringify({
    short_label: "卸载",
    short_icon: "2"
}), JSON.stringify({
    short_label: "5分钟可提现",
    short_icon: "1"
})];

class SdkHelper {
    EnableSDK = true;
    clientData = null;
    user_id = "";
    sm_event_type = "activate";
    isAppFlyerSDK = false;
    is_init_sdk = false;
    bd_did = cc.sys.localStorage.getItem("dev_token") || "";
    vibratorDuration = 0;

    static _instance = null;
    static isSingularSDK = false;

    constructor() {
        EventMgr.listen(NativeEventType.APP_START, this.onAppStart, this);
        EventMgr.listen(NativeEventType.APP_STOP, this.onAppStop, this);
        EventMgr.listen(NativeEventType.APP_RESTART, this.onAppRestart, this);
        EventMgr.listen(NativeEventType.APP_PAUSE, this.onAppPause, this);
        EventMgr.listen(NativeEventType.APP_RESUME, this.onAppResume, this);
        EventMgr.listen(NativeEventType.APP_DESTROY, this.onAppDestory, this);
        EventMgr.listen(NativeEventType.ON_GET_SM_ID, this.onGetSmId, this);
    }

    isRootInVirtualApk() {
        return false;
    }

    isNetworkAcailable() {
        return true;
    }

    static _getInstance() {
        SdkHelper._instance || (SdkHelper._instance = new SdkHelper());
        return SdkHelper._instance;
    }

    getFirstLaunchTime() {
        return cc.sys.isNative && cc.sys.os == cc.sys.OS_ANDROID ? CallAndroid.getInstance().getFirstLaunchTime() : 0;
    }

    getEnterAgreementTime() {
        return cc.sys.isNative && cc.sys.os == cc.sys.OS_ANDROID ? CallAndroid.getInstance().getEnterAgreementTime() : 0;
    }

    setUserInfo(e) {
        this.user_id = e.user_id;
        console.log("设置原生端用户信息==", e);
        this.EnableSDK && (cc.sys.os === cc.sys.OS_ANDROID ? CallAndroid.getInstance().setUserInfo(JSON.stringify(e)) : cc.sys.os === cc.sys.OS_IOS && CalliOS.getInstance().setUserInfo(JSON.stringify(e)));
    }

    onAppStop() {
        this.reportData("app_stop");
    }

    showShortcutInfo() {
        this.reportData("u_show_notification");
        cc.sys.isNative ? cc.sys.os === cc.sys.OS_ANDROID && shortcutInfoList.forEach(function (e) {
            CallAndroid.getInstance().showShortcutInfo(e);
        }) : shortcutInfoList.forEach(function (e) {
            console.log("showShortcutInfo : " + e);
        });
    }

    refreshPurchasesAsync() {
        cc.sys.os === cc.sys.OS_ANDROID && CallAndroid.getInstance().refreshPurchasesAsync();
    }

    onAppDestory() {
        this.reportData("app_destory");
    }

    playNativeAudio(e) {
        cc.sys.isNative && (cc.sys.os === cc.sys.OS_ANDROID ? CallAndroid.getInstance().playMusic(e) : (cc.sys.os, cc.sys.OS_IOS));
    }

    initAppFlyer() {
        if (cc.sys.os === cc.sys.OS_ANDROID) {
            if (this.isAppFlyerSDK) return;
            console.log("initAppFlyer");
            CallAndroid.getInstance().initAppFlyer();
        }
        this.isAppFlyerSDK = true;
    }

    getRealCountry() {
        if (cc.sys.os === cc.sys.OS_ANDROID) return CallAndroid.getInstance().getRealCountry();
    }

    getVersionCode() {
        return cc.sys.os != cc.sys.OS_ANDROID ? "" : CallAndroid.getInstance().getVersionCode();
    }

    static initSingularSDK() {
        if (cc.sys.os === cc.sys.OS_ANDROID) {
            if (this.isSingularSDK) return;
            console.log("initSingularSDK");
            CallAndroid.getInstance().initSingularSDK();
        }
        this.isSingularSDK = true;
    }

    querySkuDetails(e) {
        if (cc.sys.os === cc.sys.OS_ANDROID) {
            console.log("安卓手机querySkuDetails" + e);
            CallAndroid.getInstance().querySkuDetails(e);
        }
    }

    showBigToast(e) {
        this.EnableSDK && cc.sys.isNative ? cc.sys.os === cc.sys.OS_ANDROID && CallAndroid.getInstance().showBigToast(e) : console.log("非原生端,手动吐司~~~~~," + e);
    }

    requestTDId() {
        return cc.sys.os === cc.sys.OS_ANDROID ? CallAndroid.getInstance().requestTDId() : cc.sys.os === cc.sys.OS_IOS ? CalliOS.getInstance().getTongDunID() : undefined;
    }

    onGetSmId(e) {
        BaseSystem.shumengReport({
            did: e,
            event_type: this.sm_event_type
        });
    }

    getIsCheckUser() {
        if (!cc.sys.isNative) return false;
        console.log("CallAndroid.getInstance().isRoot()", CallAndroid.getInstance().isRoot(), CallAndroid.getInstance().isEmulator(), CallAndroid.getInstance().isRunningInVirtualApk());
        return cc.sys.os === cc.sys.OS_ANDROID ? !!(CallAndroid.getInstance().isRoot() || CallAndroid.getInstance().isEmulator() || CallAndroid.getInstance().isRunningInVirtualApk()) : undefined;
    }

    getUrlSplicingString() {
        return this.EnableSDK && (cc.sys.os, cc.sys.OS_ANDROID), ClientData.url_common_str;
    }

    getCurrentCountry() {
        return cc.sys.os === cc.sys.OS_ANDROID ? CallAndroid.getInstance().getCurrentCountry() : "CN";
    }

    initOtherSDK_CN() {
        EventMgr.trigger(NativeEventType.OAID_FINISH);
        EventMgr.trigger(NativeEventType.AUTHOR_FINISH);
    }

    clickPay(e, t) {
        if (cc.sys.os === cc.sys.OS_ANDROID) {
            console.log("安卓手机购买");
            CallAndroid.getInstance().clickPay(e, t);
        }
    }

    consumePurchase(e) {
        cc.sys.os === cc.sys.OS_ANDROID && CallAndroid.getInstance().consumePurchase(e);
    }

    getBD_did() {
        if (cc.sys.isNative && cc.sys.os === cc.sys.OS_ANDROID) {
            console.log("ClientData.version_name: ", ClientData.version_name);
            return CallAndroid.getInstance().getHSToken() || "";
        }
    }

    showForceToast(e) {
        if (cc.sys.isNative && e) {
            cc.sys.os == cc.sys.OS_ANDROID && CallAndroid.getInstance().showForceToast(e);
            cc.sys.os == cc.sys.OS_IOS && CalliOS.getInstance().showForceToast(e);
        } else console.log("showToast", e || "无数据");
    }

    onAppStart() {
        this.reportData("app_start");
    }

    requestSMId() {
        cc.sys.os === cc.sys.OS_ANDROID ? CallAndroid.getInstance().requestSMId() : cc.sys.os === cc.sys.OS_IOS && CalliOS.getInstance().getTongDunID();
    }

    getActivityNumByDate(e) {
        return cc.sys.isNative ? cc.sys.os === cc.sys.OS_ANDROID ? CallAndroid.getInstance().getActivityNumByDate(e) : undefined : 0;
    }

    getDeviceStatus() {
        return {};
    }

    initBD(e) {
        if (e && "null" != e || !cc.sys.isNative) {
            this.bd_did = e;
            cc.sys.localStorage.setItem("dev_token", e);
        }
    }

    billingClientInit() {
        cc.sys.os === cc.sys.OS_ANDROID && CallAndroid.getInstance().billingClientInit();
    }

    getVersionName() {
        return cc.sys.os != cc.sys.OS_ANDROID ? "" : CallAndroid.getInstance().getVersionName();
    }

    onAppPause() {
        this.reportData("app_pause");
        AdManager.getInstance().checkSpecialResume(false);
    }

    showToast(e) {
        if (e) if (this.EnableSDK && cc.sys.isNative) {
            if (cc.sys.os === cc.sys.OS_ANDROID) CallAndroid.getInstance().showToast(e);else if (cc.sys.os == cc.sys.OS_IOS) {
                console.log("ios吐司~~~~~," + e);
                CalliOS.getInstance().showToast(e);
            }
        } else console.log("非原生端,手动吐司~~~~~," + e);
    }

    finishApp() {
        console.log("退出app");
        this.EnableSDK && cc.sys.os === cc.sys.OS_ANDROID ? CallAndroid.getInstance().finishApp() : cc.sys.os == cc.sys.OS_IOS && CalliOS.getInstance().finishActivity();
    }

    getScreenHeight() {
        return cc.sys.isNative ? this.EnableSDK && cc.sys.os === cc.sys.OS_ANDROID ? CallAndroid.getInstance().getScreenHeight() : cc.sys.os == cc.sys.OS_IOS ? CalliOS.getInstance().getScreenHeight() : undefined : cc.winSize.height;
    }

    getAesDncrypData(e) {
        return this.EnableSDK && cc.sys.os === cc.sys.OS_ANDROID ? CallAndroid.getInstance().getAesDncrypData(e) : null;
    }

    onAppResume() {
        this.reportData("app_resume");
        AdManager.getInstance().checkSpecialResume(true);
    }

    getNetWorkStatus() {
        return cc.sys.os == cc.sys.OS_IOS ? Number(CalliOS.getInstance().getNetworkingStatus()) : 1;
    }

    onAppRestart() {
        this.reportData("app_restart");
    }

    setServerIpCountry(e) {
        cc.sys.os === cc.sys.OS_ANDROID && CallAndroid.getInstance().setServerIpCountry(e);
    }

    callWxLogin() {
        cc.sys.isNative ? cc.sys.os == cc.sys.OS_ANDROID ? CallAndroid.getInstance().wxLogin() : cc.sys.os == cc.sys.OS_IOS && CalliOS.getInstance().wxLogin() : console.error("非原生端,微信登录失败");
    }

    setXhrCookie(e) {
        this.EnableSDK && cc.sys.os === cc.sys.OS_ANDROID ? e.setRequestHeader("Cookie", document.cookie) : cc.sys.os === cc.sys.OS_IOS && e.setRequestHeader("Cookie", document.cookie);
    }

    setNotchHeight() {
        this.EnableSDK && (cc.sys.os, cc.sys.OS_ANDROID);
    }

    getClientInfo() {
        let e = EngineUtil.localStorageGetItem("Web_Device_Id", "");
        if (!e) {
            e = "test" + EngineUtil.getRandId();
            EngineUtil.localStorageSetItem("Web_Device_Id", e);
        }
        this.clientData = {
            device_id: e,
            aid: "aid",
            ii: "li",
            madr: "madr",
            wmr: "wmr",
            version_name: "1.1.5.8",
            channel_name: "web"
        };
        return this.clientData;
    }

    getNgister(n?, i?, l?) {
        return "";
    }

    getChannelName() {
        return cc.sys.os != cc.sys.OS_ANDROID ? "" : CallAndroid.getInstance().getChannelName();
    }

    reportData(e, t, o = false) {}

    onJump(e) {
        cc.sys.os === cc.sys.OS_ANDROID && CallAndroid.getInstance().onJump(e);
    }

    showNotification(e) {
        cc.sys.os === cc.sys.OS_ANDROID && CallAndroid.getInstance().showNotification(e);
    }

    ysdkLogin() {
        cc.sys.os === cc.sys.OS_ANDROID && CallAndroid.getInstance().ysdkLogin();
    }

    setVibrator(e = 50) {
        if (e > 0 && AudioManager.getInstance().getVibratorState()) {
            console.log("震动~~~" + e);
            PoolNative.vibrate(e);
        }
    }

    initOtherSDK(e) {
        if (cc.sys.os === cc.sys.OS_ANDROID) {
            if (this.is_init_sdk) return;
            CallAndroid.getInstance().initOtherSDK();
            e && EventMgr.trigger(NativeEventType.SDKINIT_FINISH);
            this.is_init_sdk = true;
        } else EventMgr.trigger(NativeEventType.SDKINIT_FINISH);
    }

    showForceDialog(e, t) {
        t && (this.EnableSDK && cc.sys.isNative ? cc.sys.os === cc.sys.OS_ANDROID && CallAndroid.getInstance().showForceDialog(e, t) : console.log("非原生端,手动吐司~~~~~," + t));
    }

    reportKeyBehavior() {
        cc.sys.os === cc.sys.OS_ANDROID && CallAndroid.getInstance().reportKeyBehavior();
    }

    getAesEncrypData(e) {
        if (cc.sys.isNative) {
            if (this.EnableSDK && cc.sys.os === cc.sys.OS_ANDROID) return CallAndroid.getInstance().getAesEncrypData(e);
        } else console.log("非原生端,无法加密", e);
    }

    openAgreementPage() {
        cc.sys.isNative && cc.sys.os == cc.sys.OS_ANDROID && CallAndroid.getInstance().setEnterAgreementTime();
    }

    getMiddleConfig() {
        if (!cc.sys.isNative) {
            EventMgr.trigger(NativeEventType.ON_GET_MIDDLE_CONFIG, "{}");
            return "{}";
        }
        if (cc.sys.os === cc.sys.OS_ANDROID) return CallAndroid.getInstance().getMiddleConfig();
    }

    feedback(e, t, o) {
        this.EnableSDK && cc.sys.os === cc.sys.OS_ANDROID ? CallAndroid.getInstance().openKefu(e, t, o) : cc.sys.os == cc.sys.OS_IOS && CalliOS.getInstance().openKefu(e, t, o);
    }
}

export default SdkHelper._getInstance();
