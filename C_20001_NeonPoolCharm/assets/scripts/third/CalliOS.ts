import AdManager from "./AdManager";
import AdvertEventType from "./AdvertEventType";
import AudioManager, { DEFAULT_BGM_NAME } from "./AudioManager";
import EngineUtil from "./EngineUtil";
import EventMgr from "./EventMgr";
import NativeEventType from "./NativeEventType";
import { GAME_NAME } from "./SystemConfig";

export default class CalliOS {
    private static _instance: CalliOS = null;

    closeImgAd(): void {
        jsb.reflection.callStaticMethod("HvillJSB", "closeImgAd");
    }

    setVibrator(): void {
        jsb.reflection.callStaticMethod("HvillJSB", "setVibrato");
    }

    getShumengID(): string {
        return jsb.reflection.callStaticMethod("HvillJSB", "getShuMengID");
    }

    getCookieInfo(): string {
        return jsb.reflection.callStaticMethod("HvillJSB", "getCookieInfo");
    }

    onGetWechatCode(code: string): void {
        console.log("Oc调用Js onGetWechatCode", code);
        EventMgr.trigger(NativeEventType.GET_WECHAT_CODE, code);
    }

    getChannelName(): string {
        return jsb.reflection.callStaticMethod("HvillJSB", "getChannelName");
    }

    onVideoFinish(): void {}

    hasNotchInScreen(): boolean {
        const result = jsb.reflection.callStaticMethod("HvillJSB", "hasNotchInScreen");
        console.log("hasNotchInScreen", result);
        return result;
    }

    getTongDunID(): string {
        return jsb.reflection.callStaticMethod("HvillJSB", "getDongDunID");
    }

    onVideoOpenSuccess(info: string): void {
        AudioManager.getInstance().pauseMusic(DEFAULT_BGM_NAME, true);
        console.log("Oc调用Js onVideoOpensuccess>>", info);
    }

    finishActivity(): void {
        jsb.reflection.callStaticMethod("HvillJSB", "finishActivity");
    }

    getScreenWidth(): number {
        return jsb.reflection.callStaticMethod("HvillJSB", "getScreenWidth");
    }

    onSplashAdSuccess(): void {
        EventMgr.trigger(AdvertEventType.SPLASH_SHOW);
    }

    cancelVibrator(): void {}

    onSplashAdclose(): void {
        console.log("onSplashAdTimeOver");
        EventMgr.trigger(AdvertEventType.SPLASH_FINISH);
    }

    wxLogin(): void {
        jsb.reflection.callStaticMethod("HvillJSB", "wxLogin");
    }

    onAppPause(): void {
        console.log("Oc调用Js onAppPause");
        this.reportData("app_pause", null);
    }

    preLoadBannerAd(_slot: string, width: number, height: number): void {
        jsb.reflection.callStaticMethod("HvillJSB", "preLoadBannerAd:height:", String(width), String(height));
    }

    onAppResume(): void {
        console.log("Oc调用Js onAppResume");
        this.reportData("app_pause", null);
    }

    getScreenHeight(): number {
        return jsb.reflection.callStaticMethod("HvillJSB", "getScreenHeight");
    }

    showBannerAd(_slot: string, _pos: string, _align: string, width: number, height: number, _offset: number): void {
        jsb.reflection.callStaticMethod("HvillJSB", "showBannerAd:width:height:", String(width), String(height));
    }

    getStatusBarHeight(): number {
        const result = jsb.reflection.callStaticMethod("HvillJSB", "getStatusBarHeight");
        console.log("getStatusBarHeight", result);
        return result;
    }

    showForceToast(message: string): void {
        jsb.reflection.callStaticMethod("HvillJSB", "showForceToast:duration:", message, "1.5");
    }

    onVideoClose(info: string): void {
        AudioManager.getInstance().resumeMusic("DEFAULT_BGM_NAME", true);
        AdManager.getInstance().onVideoClose(JSON.parse(info));
    }

    decrypt(data: string): string {
        return jsb.reflection.callStaticMethod("HvillJSB", "decrypt:", data);
    }

    setVibratoLight(): void {
        jsb.reflection.callStaticMethod("HvillJSB", "setVibratoLight");
    }

    networkingReachabilityDidChange(): void {}

    closeBannerAd(): void {
        jsb.reflection.callStaticMethod("HvillJSB", "closeBannerAd");
    }

    getNgister(url: string, time: string, noneStr: string): string {
        const result = jsb.reflection.callStaticMethod("HvillJSB", "getNgister:time:noneStr:", url, time, noneStr);
        console.log("url====", url, "result", result);
        return result;
    }

    getVersionName(): string {
        return jsb.reflection.callStaticMethod("HvillJSB", "getVersionName");
    }

    showRewardVideoAd(params: { is_force?: boolean; [key: string]: any }): void {
        console.log("callStaticMethod.showRewardVideoAd ", params);
        const isForce = params.is_force;
        jsb.reflection.callStaticMethod("HvillJSB", "showRewardVideoAd:extraInfo:", isForce ? "1" : "0", JSON.stringify(params));
    }

    encrypt(data: string): string {
        return jsb.reflection.callStaticMethod("HvillJSB", "encrypt:", data);
    }

    onSplashAdSkip(): void {
        console.log("onSplashAdSkip");
        EventMgr.trigger(AdvertEventType.SPLASH_FINISH);
    }

    getBlackBox(): void {}

    getClientInfo(): string {
        return jsb.reflection.callStaticMethod("HvillJSB", "getClientInfo");
    }

    onVideoFailed(error: string): void {
        AudioManager.getInstance().resumeMusic(DEFAULT_BGM_NAME, true);
        AdManager.getInstance().onVideoError(error);
    }

    showToast(message: string): void {
        jsb.reflection.callStaticMethod("HvillJSB", "showToast:duration:offsetY:", message, "1.5", "300");
    }

    onAppStop(): void {
        console.log("Oc调用Js onAppStop");
    }

    openKefu(name: string, avatarImg: string, gender: string): boolean {
        return jsb.reflection.callStaticMethod("HvillJSB", "openKefu:avatarImg:gender:", name, avatarImg, gender);
    }

    onSplashAdFailed(): void {
        console.log("onSplashAdError");
        EventMgr.trigger(AdvertEventType.SPLASH_FINISH);
    }

    onAttachedToWindow(): void {
        console.log("onAttachedToWindow");
    }

    showSplashAd(params: { bottom: number }): void {
        const bottom = params.bottom;
        jsb.reflection.callStaticMethod("HvillJSB", "loadSplashAd:", String(bottom));
    }

    onAppStart(): void {
        console.log("Oc调用Js onAppStart");
        this.reportData("app_start", null);
    }

    preLoadImgAd(_slot: string, width: number, height: number): void {
        jsb.reflection.callStaticMethod("HvillJSB", "preLoadImgAd:height:", String(width), String(height));
    }

    onGetAdInfo(info: string): void {
        console.log("回传AdInfo " + info, JSON.stringify(info));
        const data = JSON.parse(info);
        EventMgr.trigger(AdvertEventType.ONGETADINFO, data);
    }

    static getInstance(): CalliOS {
        if (CalliOS._instance == null) {
            CalliOS._instance = new CalliOS();
        }
        return CalliOS._instance;
    }

    setUserInfo(info: string): void {
        if (cc.sys.isNative) {
            jsb.reflection.callStaticMethod("HvillJSB", "setUserInfo:", info);
        }
    }

    getNetworkingStatus(): string {
        const status = jsb.reflection.callStaticMethod("HvillJSB", "networkingStatus");
        console.log("网络状态变化" + status);
        return status;
    }

    reportData(eventName: string, params: Record<string, any> | null, isCore: boolean = false): void {
        const payload: { eventName: string; param: { paramName: string; paramValue: any }[] } = {
            eventName,
            param: [],
        };
        payload.param.push({ paramName: "ts", paramValue: EngineUtil.getTimeStamp() });
        payload.param.push({ paramName: "game_name", paramValue: GAME_NAME });
        if (params) {
            for (const key of Object.keys(params)) {
                payload.param.push({ paramName: key, paramValue: params[key] });
            }
        }
        const json = JSON.stringify(payload);
        if (cc.sys.isNative) {
            if (isCore) {
                jsb.reflection.callStaticMethod("HvillJSB", "reportCoreData:", json);
                console.log("android", isCore + "埋点>>>>>>>>>>" + json);
            } else {
                jsb.reflection.callStaticMethod("HvillJSB", "reportData:", json);
                console.log("android", isCore + "埋点>>>>>>>>>>" + json);
            }
        }
    }

    onAppDestory(): void {
        console.log("Oc调用Js onAppDestory");
        this.reportData("app_destory", null);
    }

    showImgAd(_slot: string, width: number, _pos: string, _align: string, height: number, _offset: number): void {
        jsb.reflection.callStaticMethod("HvillJSB", "showImgAd:width:height:", String(width), String(height));
    }
}

(window as any).calliOS = CalliOS.getInstance();
