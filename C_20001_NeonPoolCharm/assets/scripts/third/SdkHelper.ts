import { AdManager } from "./AdManager";
import { AudioManager } from "./AudioManager";
import BaseSystem from "./BaseSystem";
import CallAndroid from "./CallAndroid";
import CalliOS from "./CalliOS";
import ClientData from "./ClientData";
import EventMgr from "./EventMgr";
import NativeEventType from "./NativeEventType";
import { PoolNative } from "./PoolNative";
import EngineUtil from "./EngineUtil";

const SHORTCUT_INFO = [
    JSON.stringify({ short_label: "卸载", short_icon: "2" }),
    JSON.stringify({ short_label: "5分钟可提现", short_icon: "1" }),
];

class SdkHelper {
    EnableSDK = true;
    clientData: any = null;
    user_id = "";
    sm_event_type = "activate";
    isAppFlyerSDK = false;
    is_init_sdk = false;
    bd_did = cc.sys.localStorage.getItem("dev_token") || "";
    vibratorDuration = 0;

    static _instance: SdkHelper = null;
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

    static _getInstance(): SdkHelper {
        SdkHelper._instance || (SdkHelper._instance = new SdkHelper());
        return SdkHelper._instance;
    }

    isRootInVirtualApk(): boolean {
        return false;
    }

    isNetworkAcailable(): boolean {
        return true;
    }

    getFirstLaunchTime(): number {
        return cc.sys.isNative && cc.sys.os == cc.sys.OS_ANDROID ? CallAndroid.getInstance().getFirstLaunchTime() : 0;
    }

    getEnterAgreementTime(): number {
        return cc.sys.isNative && cc.sys.os == cc.sys.OS_ANDROID ? CallAndroid.getInstance().getEnterAgreementTime() : 0;
    }

    setUserInfo(userInfo: any): void {
        this.user_id = userInfo.user_id;
        console.log("设置原生端用户信息==", userInfo);
        this.EnableSDK &&
            (cc.sys.os === cc.sys.OS_ANDROID
                ? CallAndroid.getInstance().setUserInfo(JSON.stringify(userInfo))
                : cc.sys.os === cc.sys.OS_IOS && CalliOS.getInstance().setUserInfo(JSON.stringify(userInfo)));
    }

    onAppStop(): void {
        this.reportData("app_stop");
    }

    showShortcutInfo(): void {
        this.reportData("u_show_notification");
        cc.sys.isNative
            ? cc.sys.os === cc.sys.OS_ANDROID &&
              SHORTCUT_INFO.forEach((info) => {
                  CallAndroid.getInstance().showShortcutInfo(info);
              })
            : SHORTCUT_INFO.forEach((info) => {
                  console.log("showShortcutInfo : " + info);
              });
    }

    refreshPurchasesAsync(): void {
        cc.sys.os === cc.sys.OS_ANDROID && CallAndroid.getInstance().refreshPurchasesAsync();
    }

    onAppDestory(): void {
        this.reportData("app_destory");
    }

    playNativeAudio(audioName: string): void {
        cc.sys.isNative &&
            (cc.sys.os === cc.sys.OS_ANDROID
                ? CallAndroid.getInstance().playMusic(audioName)
                : (cc.sys.os, cc.sys.OS_IOS));
    }

    initAppFlyer(): void {
        if (cc.sys.os === cc.sys.OS_ANDROID) {
            if (this.isAppFlyerSDK) {
                return;
            }
            console.log("initAppFlyer");
            CallAndroid.getInstance().initAppFlyer();
        }
        this.isAppFlyerSDK = true;
    }

    getRealCountry(): string {
        if (cc.sys.os === cc.sys.OS_ANDROID) {
            return CallAndroid.getInstance().getRealCountry() as any;
        }
    }

    getVersionCode(): string {
        return cc.sys.os != cc.sys.OS_ANDROID ? "" : CallAndroid.getInstance().getVersionCode() as any;
    }

    static initSingularSDK(): void {
        if (cc.sys.os === cc.sys.OS_ANDROID) {
            if (SdkHelper.isSingularSDK) {
                return;
            }
            console.log("initSingularSDK");
            CallAndroid.getInstance().initSingularSDK();
        }
        SdkHelper.isSingularSDK = true;
    }

    querySkuDetails(skuIds: string): void {
        if (cc.sys.os === cc.sys.OS_ANDROID) {
            console.log("安卓手机querySkuDetails" + skuIds);
            CallAndroid.getInstance().querySkuDetails(skuIds);
        }
    }

    showBigToast(message: string): void {
        this.EnableSDK && cc.sys.isNative
            ? cc.sys.os === cc.sys.OS_ANDROID && CallAndroid.getInstance().showBigToast(message)
            : console.log("非原生端,手动吐司~~~~~," + message);
    }

    requestTDId(): any {
        return cc.sys.os === cc.sys.OS_ANDROID
            ? CallAndroid.getInstance().requestTDId()
            : cc.sys.os === cc.sys.OS_IOS
              ? CalliOS.getInstance().getTongDunID()
              : void 0;
    }

    onGetSmId(deviceId: string): void {
        BaseSystem.shumengReport({
            did: deviceId,
            event_type: this.sm_event_type,
        });
    }

    getIsCheckUser(): boolean {
        if (!cc.sys.isNative) {
            return false;
        }
        console.log(
            "CallAndroid.getInstance().isRoot()",
            CallAndroid.getInstance().isRoot(),
            CallAndroid.getInstance().isEmulator(),
            CallAndroid.getInstance().isRunningInVirtualApk()
        );
        return cc.sys.os === cc.sys.OS_ANDROID
            ? !!(CallAndroid.getInstance().isRoot() || CallAndroid.getInstance().isEmulator() || CallAndroid.getInstance().isRunningInVirtualApk())
            : void 0;
    }

    getUrlSplicingString(): string {
        this.EnableSDK && (cc.sys.os, cc.sys.OS_ANDROID);
        return ClientData.url_common_str;
    }

    getCurrentCountry(): string {
        return cc.sys.os === cc.sys.OS_ANDROID ? (CallAndroid.getInstance().getCurrentCountry() as any) : "CN";
    }

    initOtherSDK_CN(): void {
        EventMgr.trigger(NativeEventType.OAID_FINISH);
        EventMgr.trigger(NativeEventType.AUTHOR_FINISH);
    }

    clickPay(productId: string, orderId: string): void {
        if (cc.sys.os === cc.sys.OS_ANDROID) {
            console.log("安卓手机购买");
            CallAndroid.getInstance().clickPay(productId, orderId);
        }
    }

    consumePurchase(purchaseToken: string): void {
        cc.sys.os === cc.sys.OS_ANDROID && CallAndroid.getInstance().consumePurchase(purchaseToken);
    }

    getBD_did(): string {
        if (cc.sys.isNative && cc.sys.os === cc.sys.OS_ANDROID) {
            console.log("ClientData.version_name: ", ClientData.version_name);
            return CallAndroid.getInstance().getHSToken() || "";
        }
    }

    showForceToast(message: string): void {
        if (cc.sys.isNative && message) {
            cc.sys.os == cc.sys.OS_ANDROID && CallAndroid.getInstance().showForceToast(message);
            cc.sys.os == cc.sys.OS_IOS && CalliOS.getInstance().showForceToast(message);
        } else {
            console.log("showToast", message || "无数据");
        }
    }

    onAppStart(): void {
        this.reportData("app_start");
    }

    requestSMId(): void {
        cc.sys.os === cc.sys.OS_ANDROID
            ? CallAndroid.getInstance().requestSMId()
            : cc.sys.os === cc.sys.OS_IOS && CalliOS.getInstance().getTongDunID();
    }

    getActivityNumByDate(date: string): number {
        return cc.sys.isNative
            ? cc.sys.os === cc.sys.OS_ANDROID
                ? CallAndroid.getInstance().getActivityNumByDate(date)
                : void 0
            : 0;
    }

    getDeviceStatus(): Record<string, string> {
        return {};
    }

    initBD(deviceToken: string): void {
        if ((deviceToken && deviceToken != "null") || !cc.sys.isNative) {
            this.bd_did = deviceToken;
            cc.sys.localStorage.setItem("dev_token", deviceToken);
        }
    }

    billingClientInit(): void {
        cc.sys.os === cc.sys.OS_ANDROID && CallAndroid.getInstance().billingClientInit();
    }

    getVersionName(): string {
        return cc.sys.os != cc.sys.OS_ANDROID ? "" : (CallAndroid.getInstance().getVersionName() as any);
    }

    onAppPause(): void {
        this.reportData("app_pause");
        AdManager.getInstance().checkSpecialResume(false);
    }

    showToast(message: string): void {
        if (message) {
            if (this.EnableSDK && cc.sys.isNative) {
                if (cc.sys.os === cc.sys.OS_ANDROID) {
                    CallAndroid.getInstance().showToast(message);
                } else if (cc.sys.os == cc.sys.OS_IOS) {
                    console.log("ios吐司~~~~~," + message);
                    CalliOS.getInstance().showToast(message);
                }
            } else {
                console.log("非原生端,手动吐司~~~~~," + message);
            }
        }
    }

    finishApp(): void {
        console.log("退出app");
        this.EnableSDK && cc.sys.os === cc.sys.OS_ANDROID
            ? CallAndroid.getInstance().finishApp()
            : cc.sys.os == cc.sys.OS_IOS && CalliOS.getInstance().finishActivity();
    }

    getScreenHeight(): number {
        return cc.sys.isNative
            ? this.EnableSDK && cc.sys.os === cc.sys.OS_ANDROID
                ? CallAndroid.getInstance().getScreenHeight()
                : cc.sys.os == cc.sys.OS_IOS
                  ? CalliOS.getInstance().getScreenHeight()
                  : void 0
            : cc.winSize.height;
    }

    getAesDncrypData(data: string): string {
        return this.EnableSDK && cc.sys.os === cc.sys.OS_ANDROID ? CallAndroid.getInstance().getAesDncrypData(data) : null;
    }

    onAppResume(): void {
        this.reportData("app_resume");
        AdManager.getInstance().checkSpecialResume(true);
    }

    getNetWorkStatus(): number {
        return cc.sys.os == cc.sys.OS_IOS ? Number(CalliOS.getInstance().getNetworkingStatus()) : 1;
    }

    onAppRestart(): void {
        this.reportData("app_restart");
    }

    setServerIpCountry(country: string): void {
        cc.sys.os === cc.sys.OS_ANDROID && CallAndroid.getInstance().setServerIpCountry(country);
    }

    callWxLogin(): void {
        cc.sys.isNative
            ? cc.sys.os == cc.sys.OS_ANDROID
                ? CallAndroid.getInstance().wxLogin()
                : cc.sys.os == cc.sys.OS_IOS && CalliOS.getInstance().wxLogin()
            : console.error("非原生端,微信登录失败");
    }

    setXhrCookie(xhr: XMLHttpRequest): void {
        this.EnableSDK && cc.sys.os === cc.sys.OS_ANDROID
            ? xhr.setRequestHeader("Cookie", document.cookie)
            : cc.sys.os === cc.sys.OS_IOS && xhr.setRequestHeader("Cookie", document.cookie);
    }

    setNotchHeight(): void {
        this.EnableSDK && (cc.sys.os, cc.sys.OS_ANDROID);
    }

    getClientInfo(): any {
        let deviceId = EngineUtil.localStorageGetItem("Web_Device_Id", "");
        if (!deviceId) {
            deviceId = "test" + EngineUtil.getRandId();
            EngineUtil.localStorageSetItem("Web_Device_Id", deviceId);
        }
        this.clientData = {
            device_id: deviceId,
            aid: "aid",
            ii: "li",
            madr: "madr",
            wmr: "wmr",
            version_name: "1.1.5.8",
            channel_name: "web",
        };
        return this.clientData;
    }

    getNgister(_url?: string, _time?: string, _nonce?: string): string {
        return "";
    }

    getChannelName(): string {
        return cc.sys.os != cc.sys.OS_ANDROID ? "" : (CallAndroid.getInstance().getChannelName() as any);
    }

    reportData(_eventName: string, _data?: any, _force = false): void {
    }

    onJump(url: string): void {
        cc.sys.os === cc.sys.OS_ANDROID && CallAndroid.getInstance().onJump(url);
    }

    showNotification(message: string): void {
        cc.sys.os === cc.sys.OS_ANDROID && CallAndroid.getInstance().showNotification(message);
    }

    ysdkLogin(): void {
        cc.sys.os === cc.sys.OS_ANDROID && CallAndroid.getInstance().ysdkLogin();
    }

    setVibrator(duration = 50): void {
        if (duration > 0 && AudioManager.getInstance().getVibratorState()) {
            console.log("震动~~~" + duration);
            PoolNative.vibrate(duration);
        }
    }

    initOtherSDK(triggerFinish = false): void {
        if (cc.sys.os === cc.sys.OS_ANDROID) {
            if (this.is_init_sdk) {
                return;
            }
            CallAndroid.getInstance().initOtherSDK();
            triggerFinish && EventMgr.trigger(NativeEventType.SDKINIT_FINISH);
            this.is_init_sdk = true;
        } else {
            EventMgr.trigger(NativeEventType.SDKINIT_FINISH);
        }
    }

    showForceDialog(title: string, message: string): void {
        message &&
            (this.EnableSDK && cc.sys.isNative
                ? cc.sys.os === cc.sys.OS_ANDROID && CallAndroid.getInstance().showForceDialog(title, message)
                : console.log("非原生端,手动吐司~~~~~," + message));
    }

    reportKeyBehavior(): void {
        cc.sys.os === cc.sys.OS_ANDROID && CallAndroid.getInstance().reportKeyBehavior();
    }

    getAesEncrypData(data: string): string {
        if (cc.sys.isNative) {
            if (this.EnableSDK && cc.sys.os === cc.sys.OS_ANDROID) {
                return CallAndroid.getInstance().getAesEncrypData(data);
            }
        } else {
            console.log("非原生端,无法加密", data);
        }
    }

    openAgreementPage(): void {
        cc.sys.isNative && cc.sys.os == cc.sys.OS_ANDROID && CallAndroid.getInstance().setEnterAgreementTime();
    }

    getMiddleConfig(): string {
        if (!cc.sys.isNative) {
            EventMgr.trigger(NativeEventType.ON_GET_MIDDLE_CONFIG, "{}");
            return "{}";
        }
        if (cc.sys.os === cc.sys.OS_ANDROID) {
            return CallAndroid.getInstance().getMiddleConfig();
        }
    }

    feedback(userId: string, content: string, extra: string): void {
        this.EnableSDK && cc.sys.os === cc.sys.OS_ANDROID
            ? CallAndroid.getInstance().openKefu(userId, content, extra)
            : cc.sys.os == cc.sys.OS_IOS && CalliOS.getInstance().openKefu(userId, content, extra);
    }
}

export default SdkHelper._getInstance();
