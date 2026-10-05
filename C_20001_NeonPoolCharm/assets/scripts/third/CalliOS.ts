declare const jsb: {
    reflection: {
        callStaticMethod(className: string, methodName: string, ...args: unknown[]): any;
    };
};

import AdvertEventType from "./AdvertEventType";
import NativeEventType from "./NativeEventType";
import AudioManager, { DEFAULT_BGM_NAME } from "./AudioManager";
import EventMgr from "./EventMgr";
import AdManager from "./AdManager";
import EngineUtil from "./EngineUtil";
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

    onVideoOpenSuccess(_extra: unknown): void {
        AudioManager.getInstance().pauseMusic(DEFAULT_BGM_NAME, true);
        console.log("Oc调用Js onVideoOpensuccess>>", _extra);
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

    preLoadBannerAd(_slot: string, height: number, width: number): void {
        jsb.reflection.callStaticMethod("HvillJSB", "preLoadBannerAd:height:", String(height), String(width));
    }

    onAppResume(): void {
        console.log("Oc调用Js onAppResume");
        this.reportData("app_pause", null);
    }

    getScreenHeight(): number {
        return jsb.reflection.callStaticMethod("HvillJSB", "getScreenHeight");
    }

    showBannerAd(_slot: string, _pos: unknown, _extra: unknown, width: number, height: number, offset: number): void {
        jsb.reflection.callStaticMethod("HvillJSB", "showBannerAd:width:height:", String(width), String(height), String(offset));
    }

    getStatusBarHeight(): number {
        const height = jsb.reflection.callStaticMethod("HvillJSB", "getStatusBarHeight");
        console.log("getStatusBarHeight", height);
        return height;
    }

    showForceToast(message: string): void {
        jsb.reflection.callStaticMethod("HvillJSB", "showForceToast:duration:", message, "1.5");
    }

    onVideoClose(data: string): void {
        AudioManager.getInstance().resumeMusic("DEFAULT_BGM_NAME", true);
        AdManager.getInstance().onVideoClose(JSON.parse(data));
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

    getNgister(uri: string, time: number, nonce: string): string {
        const result = jsb.reflection.callStaticMethod("HvillJSB", "getNgister:time:noneStr:", uri, time, nonce);
        console.log("url====", uri, "result", result);
        return result;
    }

    getVersionName(): string {
        return jsb.reflection.callStaticMethod("HvillJSB", "getVersionName");
    }

    showRewardVideoAd(params: { is_force?: boolean; [key: string]: unknown }): void {
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

    onVideoFailed(error: unknown): void {
        AudioManager.getInstance().resumeMusic(DEFAULT_BGM_NAME, true);
        AdManager.getInstance().onVideoError(error);
    }

    showToast(message: string): void {
        jsb.reflection.callStaticMethod("HvillJSB", "showToast:duration:offsetY:", message, "1.5", "300");
    }

    onAppStop(): void {
        console.log("Oc调用Js onAppStop");
    }

    openKefu(name: string, avatar: string, gender: string): unknown {
        return jsb.reflection.callStaticMethod("HvillJSB", "openKefu:avatarImg:gender:", name, avatar, gender);
    }

    onSplashAdFailed(): void {
        console.log("onSplashAdError");
        EventMgr.trigger(AdvertEventType.SPLASH_FINISH);
    }

    onAttachedToWindow(): void {
        console.log("onAttachedToWindow");
    }

    showSplashAd(params: { bottom: number }): void {
        jsb.reflection.callStaticMethod("HvillJSB", "loadSplashAd:", String(params.bottom));
    }

    onAppStart(): void {
        console.log("Oc调用Js onAppStart");
        this.reportData("app_start", null);
    }

    preLoadImgAd(_slot: string, height: number, width: number): void {
        jsb.reflection.callStaticMethod("HvillJSB", "preLoadImgAd:height:", String(height), String(width));
    }

    onGetAdInfo(data: string): void {
        console.log("回传AdInfo " + data, JSON.stringify(data));
        const info = JSON.parse(data);
        EventMgr.trigger(AdvertEventType.ONGETADINFO, info);
    }

    static getInstance(): CalliOS {
        if (CalliOS._instance == null) {
            CalliOS._instance = new CalliOS();
        }
        return CalliOS._instance;
    }

    setUserInfo(info: string): void {
        cc.sys.isNative && jsb.reflection.callStaticMethod("HvillJSB", "setUserInfo:", info);
    }

    getNetworkingStatus(): unknown {
        const status = jsb.reflection.callStaticMethod("HvillJSB", "networkingStatus");
        console.log("网络状态变化" + status);
        return status;
    }

    reportData(eventName: string, data: Record<string, unknown> | null, isCore = false): void {
        const payload: {
            eventName: string;
            param: Array<{ paramName: string; paramValue: unknown }>;
        } = {
            eventName,
            param: [],
        };
        payload.param.push({
            paramName: "ts",
            paramValue: EngineUtil.getTimeStamp(),
        });
        payload.param.push({
            paramName: "game_name",
            paramValue: GAME_NAME,
        });
        if (data) {
            const keys = Object.keys(data);
            for (let i = 0; i < keys.length; i++) {
                payload.param.push({
                    paramName: keys[i],
                    paramValue: data[keys[i]],
                });
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

    showImgAd(_slot: string, width: number, _extra: unknown, height: number, offsetX: number, offsetY: number): void {
        jsb.reflection.callStaticMethod("HvillJSB", "showImgAd:width:height:", String(width), String(height), String(offsetY));
    }
}

(window as any).calliOS = CalliOS.getInstance();
