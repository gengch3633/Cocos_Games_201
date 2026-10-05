import NativeEventType from "./NativeEventType";
import CallAndroid from "./CallAndroid";
import CalliOS from "./CalliOS";
import { PoolNative } from "./PoolNative";
import AudioManager from "./AudioManager";
import EventMgr from "./EventMgr";
import AdManager from "./AdManager";
import ClientData from "./ClientData";
import BaseSystem from "./BaseSystem";
import EngineUtil from "./EngineUtil";

const shortcutInfoList = [
    JSON.stringify({
        short_label: "卸载",
        short_icon: "2",
    }),
    JSON.stringify({
        short_label: "5分钟可提现",
        short_icon: "1",
    }),
];

class SdkHelper {
    EnableSDK: boolean = true;
    clientData: any = null;
    user_id: string = "";
    sm_event_type: string = "activate";
    isAppFlyerSDK: boolean = false;
    is_init_sdk: boolean = false;
    bd_did: string = cc.sys.localStorage.getItem("dev_token") || "";
    vibratorDuration: number = 0;

    private static _instance: SdkHelper = null;
    static isSingularSDK: boolean = false;

    constructor() {
        EventMgr.listen(NativeEventType.APP_START, this.onAppStart, this);
        EventMgr.listen(NativeEventType.APP_STOP, this.onAppStop, this);
        EventMgr.listen(NativeEventType.APP_RESTART, this.onAppRestart, this);
        EventMgr.listen(NativeEventType.APP_PAUSE, this.onAppPause, this);
        EventMgr.listen(NativeEventType.APP_RESUME, this.onAppResume, this);
        EventMgr.listen(NativeEventType.APP_DESTROY, this.onAppDestory, this);
        EventMgr.listen(NativeEventType.ON_GET_SM_ID, this.onGetSmId, this);
    }

    private static _getInstance(): SdkHelper {
        if (!SdkHelper._instance) {
            SdkHelper._instance = new SdkHelper();
        }
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

    setUserInfo(e: any): void {
        this.user_id = e.user_id;
        console.log("设置原生端用户信息==", e);
        if (this.EnableSDK) {
            if (cc.sys.os === cc.sys.OS_ANDROID) {
                CallAndroid.getInstance().setUserInfo(JSON.stringify(e));
            } else if (cc.sys.os === cc.sys.OS_IOS) {
                CalliOS.getInstance().setUserInfo(JSON.stringify(e));
            }
        }
    }

    onAppStop(): void {
        this.reportData("app_stop");
    }

    showShortcutInfo(): void {
        this.reportData("u_show_notification");
        if (cc.sys.isNative) {
            if (cc.sys.os === cc.sys.OS_ANDROID) {
                shortcutInfoList.forEach((info) => {
                    CallAndroid.getInstance().showShortcutInfo(info);
                });
            }
        } else {
            shortcutInfoList.forEach((info) => {
                console.log("showShortcutInfo : " + info);
            });
        }
    }

    refreshPurchasesAsync(): void {
        if (cc.sys.os === cc.sys.OS_ANDROID) {
            CallAndroid.getInstance().refreshPurchasesAsync();
        }
    }

    onAppDestory(): void {
        this.reportData("app_destory");
    }

    playNativeAudio(e: string): void {
        if (cc.sys.isNative) {
            if (cc.sys.os === cc.sys.OS_ANDROID) {
                CallAndroid.getInstance().playMusic(e);
            }
        }
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

    getRealCountry(): any {
        if (cc.sys.os === cc.sys.OS_ANDROID) {
            return CallAndroid.getInstance().getRealCountry();
        }
    }

    getVersionCode(): string {
        return cc.sys.os != cc.sys.OS_ANDROID ? "" : CallAndroid.getInstance().getVersionCode();
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

    querySkuDetails(e: string): void {
        if (cc.sys.os === cc.sys.OS_ANDROID) {
            console.log("安卓手机querySkuDetails" + e);
            CallAndroid.getInstance().querySkuDetails(e);
        }
    }

    showBigToast(e: string): void {
        if (this.EnableSDK && cc.sys.isNative) {
            if (cc.sys.os === cc.sys.OS_ANDROID) {
                CallAndroid.getInstance().showBigToast(e);
            }
        } else {
            console.log("非原生端,手动吐司~~~~~," + e);
        }
    }

    requestTDId(): any {
        return cc.sys.os === cc.sys.OS_ANDROID
            ? CallAndroid.getInstance().requestTDId()
            : cc.sys.os === cc.sys.OS_IOS
              ? CalliOS.getInstance().getTongDunID()
              : undefined;
    }

    onGetSmId(e: string): void {
        BaseSystem.shumengReport({
            did: e,
            event_type: this.sm_event_type,
        });
    }

    getIsCheckUser(): boolean | undefined {
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
            : undefined;
    }

    getUrlSplicingString(): string {
        if (this.EnableSDK && cc.sys.os == cc.sys.OS_ANDROID) {
            // no-op branch preserved from original
        }
        return ClientData.url_common_str;
    }

    getCurrentCountry(): string {
        return cc.sys.os === cc.sys.OS_ANDROID ? CallAndroid.getInstance().getCurrentCountry() : "CN";
    }

    initOtherSDK_CN(): void {
        EventMgr.trigger(NativeEventType.OAID_FINISH);
        EventMgr.trigger(NativeEventType.AUTHOR_FINISH);
    }

    clickPay(e: string, t: string): void {
        if (cc.sys.os === cc.sys.OS_ANDROID) {
            console.log("安卓手机购买");
            CallAndroid.getInstance().clickPay(e, t);
        }
    }

    consumePurchase(e: string): void {
        if (cc.sys.os === cc.sys.OS_ANDROID) {
            CallAndroid.getInstance().consumePurchase(e);
        }
    }

    getBD_did(): string {
        if (cc.sys.isNative && cc.sys.os === cc.sys.OS_ANDROID) {
            console.log("ClientData.version_name: ", ClientData.version_name);
            return CallAndroid.getInstance().getHSToken() || "";
        }
    }

    showForceToast(e: string): void {
        if (cc.sys.isNative && e) {
            if (cc.sys.os == cc.sys.OS_ANDROID) {
                CallAndroid.getInstance().showForceToast(e);
            }
            if (cc.sys.os == cc.sys.OS_IOS) {
                CalliOS.getInstance().showForceToast(e);
            }
        } else {
            console.log("showToast", e || "无数据");
        }
    }

    onAppStart(): void {
        this.reportData("app_start");
    }

    requestSMId(): void {
        if (cc.sys.os === cc.sys.OS_ANDROID) {
            CallAndroid.getInstance().requestSMId();
        } else if (cc.sys.os === cc.sys.OS_IOS) {
            CalliOS.getInstance().getTongDunID();
        }
    }

    getActivityNumByDate(e: string): any {
        return cc.sys.isNative
            ? cc.sys.os === cc.sys.OS_ANDROID
                ? CallAndroid.getInstance().getActivityNumByDate(e)
                : undefined
            : 0;
    }

    getDeviceStatus(): Record<string, string> {
        return {};
    }

    initBD(e: string): void {
        if ((e && e != "null") || !cc.sys.isNative) {
            this.bd_did = e;
            cc.sys.localStorage.setItem("dev_token", e);
        }
    }

    billingClientInit(): void {
        if (cc.sys.os === cc.sys.OS_ANDROID) {
            CallAndroid.getInstance().billingClientInit();
        }
    }

    getVersionName(): string {
        return cc.sys.os != cc.sys.OS_ANDROID ? "" : CallAndroid.getInstance().getVersionName();
    }

    onAppPause(): void {
        this.reportData("app_pause");
        AdManager.getInstance().checkSpecialResume(false);
    }

    showToast(e: string): void {
        if (e) {
            if (this.EnableSDK && cc.sys.isNative) {
                if (cc.sys.os === cc.sys.OS_ANDROID) {
                    CallAndroid.getInstance().showToast(e);
                } else if (cc.sys.os == cc.sys.OS_IOS) {
                    console.log("ios吐司~~~~~," + e);
                    CalliOS.getInstance().showToast(e);
                }
            } else {
                console.log("非原生端,手动吐司~~~~~," + e);
            }
        }
    }

    finishApp(): void {
        console.log("退出app");
        if (this.EnableSDK && cc.sys.os === cc.sys.OS_ANDROID) {
            CallAndroid.getInstance().finishApp();
        } else if (cc.sys.os == cc.sys.OS_IOS) {
            CalliOS.getInstance().finishActivity();
        }
    }

    getScreenHeight(): number {
        return cc.sys.isNative
            ? this.EnableSDK && cc.sys.os === cc.sys.OS_ANDROID
                ? CallAndroid.getInstance().getScreenHeight()
                : cc.sys.os == cc.sys.OS_IOS
                  ? CalliOS.getInstance().getScreenHeight()
                  : undefined
            : cc.winSize.height;
    }

    getAesDncrypData(e: string): any {
        return this.EnableSDK && cc.sys.os === cc.sys.OS_ANDROID ? CallAndroid.getInstance().getAesDncrypData(e) : null;
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

    setServerIpCountry(e: string): void {
        if (cc.sys.os === cc.sys.OS_ANDROID) {
            CallAndroid.getInstance().setServerIpCountry(e);
        }
    }

    callWxLogin(): void {
        if (cc.sys.isNative) {
            if (cc.sys.os == cc.sys.OS_ANDROID) {
                CallAndroid.getInstance().wxLogin();
            } else if (cc.sys.os == cc.sys.OS_IOS) {
                CalliOS.getInstance().wxLogin();
            }
        } else {
            console.error("非原生端,微信登录失败");
        }
    }

    setXhrCookie(e: XMLHttpRequest): void {
        if (this.EnableSDK && cc.sys.os === cc.sys.OS_ANDROID) {
            e.setRequestHeader("Cookie", document.cookie);
        } else if (cc.sys.os === cc.sys.OS_IOS) {
            e.setRequestHeader("Cookie", document.cookie);
        }
    }

    setNotchHeight(): void {
        if (this.EnableSDK) {
            // no-op branch preserved from original
        }
    }

    getClientInfo(): any {
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
            channel_name: "web",
        };
        return this.clientData;
    }

    getNgister(): string {
        return "";
    }

    getChannelName(): string {
        return cc.sys.os != cc.sys.OS_ANDROID ? "" : CallAndroid.getInstance().getChannelName();
    }

    reportData(_e: string, _t?: any, _o: boolean = false): void {}

    onJump(e: string): void {
        if (cc.sys.os === cc.sys.OS_ANDROID) {
            CallAndroid.getInstance().onJump(e);
        }
    }

    showNotification(e: string): void {
        if (cc.sys.os === cc.sys.OS_ANDROID) {
            CallAndroid.getInstance().showNotification(e);
        }
    }

    ysdkLogin(): void {
        if (cc.sys.os === cc.sys.OS_ANDROID) {
            CallAndroid.getInstance().ysdkLogin();
        }
    }

    setVibrator(e: number = 50): void {
        if (e > 0 && AudioManager.getInstance().getVibratorState()) {
            console.log("震动~~~" + e);
            PoolNative.vibrate(e);
        }
    }

    initOtherSDK(e?: boolean): void {
        if (cc.sys.os === cc.sys.OS_ANDROID) {
            if (this.is_init_sdk) {
                return;
            }
            CallAndroid.getInstance().initOtherSDK();
            if (e) {
                EventMgr.trigger(NativeEventType.SDKINIT_FINISH);
            }
            this.is_init_sdk = true;
        } else {
            EventMgr.trigger(NativeEventType.SDKINIT_FINISH);
        }
    }

    showForceDialog(e: string, t: string): void {
        if (t) {
            if (this.EnableSDK && cc.sys.isNative) {
                if (cc.sys.os === cc.sys.OS_ANDROID) {
                    CallAndroid.getInstance().showForceDialog(e, t);
                }
            } else {
                console.log("非原生端,手动吐司~~~~~," + t);
            }
        }
    }

    reportKeyBehavior(): void {
        if (cc.sys.os === cc.sys.OS_ANDROID) {
            CallAndroid.getInstance().reportKeyBehavior();
        }
    }

    getAesEncrypData(e: string): any {
        if (cc.sys.isNative) {
            if (this.EnableSDK && cc.sys.os === cc.sys.OS_ANDROID) {
                return CallAndroid.getInstance().getAesEncrypData(e);
            }
        } else {
            console.log("非原生端,无法加密", e);
        }
    }

    openAgreementPage(): void {
        if (cc.sys.isNative && cc.sys.os == cc.sys.OS_ANDROID) {
            CallAndroid.getInstance().setEnterAgreementTime();
        }
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

    feedback(e: string, t: string, o: string): void {
        if (this.EnableSDK && cc.sys.os === cc.sys.OS_ANDROID) {
            CallAndroid.getInstance().openKefu(e, t, o);
        } else if (cc.sys.os == cc.sys.OS_IOS) {
            CalliOS.getInstance().openKefu(e, t, o);
        }
    }
}

export default SdkHelper._getInstance();
