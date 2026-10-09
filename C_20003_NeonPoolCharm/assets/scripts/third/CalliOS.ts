import AdManager from "./AdManager";
import AdvertEventType from "./AdvertEventType";
import AudioManager, { DEFAULT_BGM_NAME } from "./AudioManager";
import EngineUtil from "./EngineUtil";
import EventMgr from "./EventMgr";
import NativeEventType from "./NativeEventType";
import { GAME_NAME } from "./SystemConfig";

export default class CalliOS {
    static _instance = null;

    closeImgAd() {
        jsb.reflection.callStaticMethod("HvillJSB", "closeImgAd");
    }

    setVibrator() {
        jsb.reflection.callStaticMethod("HvillJSB", "setVibrato");
    }

    getShumengID() {
        return jsb.reflection.callStaticMethod("HvillJSB", "getShuMengID");
    }

    getCookieInfo() {
        return jsb.reflection.callStaticMethod("HvillJSB", "getCookieInfo");
    }

    onGetWechatCode(e) {
        console.log("Oc调用Js onGetWechatCode", e);
        EventMgr.trigger(NativeEventType.GET_WECHAT_CODE, e);
    }

    getChannelName() {
        return jsb.reflection.callStaticMethod("HvillJSB", "getChannelName");
    }

    onVideoFinish() {
    }

    hasNotchInScreen() {
        const e = jsb.reflection.callStaticMethod("HvillJSB", "hasNotchInScreen");
        console.log("hasNotchInScreen", e);
        return e;
    }

    getTongDunID() {
        return jsb.reflection.callStaticMethod("HvillJSB", "getDongDunID");
    }

    onVideoOpenSuccess(e) {
        AudioManager.getInstance().pauseMusic(DEFAULT_BGM_NAME, true);
        console.log("Oc调用Js onVideoOpensuccess>>", e);
    }

    finishActivity() {
        jsb.reflection.callStaticMethod("HvillJSB", "finishActivity");
    }

    getScreenWidth() {
        return jsb.reflection.callStaticMethod("HvillJSB", "getScreenWidth");
    }

    onSplashAdSuccess() {
        EventMgr.trigger(AdvertEventType.SPLASH_SHOW);
    }

    cancelVibrator() {
    }

    onSplashAdclose() {
        console.log("onSplashAdTimeOver");
        EventMgr.trigger(AdvertEventType.SPLASH_FINISH);
    }

    wxLogin() {
        jsb.reflection.callStaticMethod("HvillJSB", "wxLogin");
    }

    onAppPause() {
        console.log("Oc调用Js onAppPause");
        this.reportData("app_pause", null);
    }

    preLoadBannerAd(e, t, o) {
        jsb.reflection.callStaticMethod("HvillJSB", "preLoadBannerAd:height:", String(t), String(o));
    }

    onAppResume() {
        console.log("Oc调用Js onAppResume");
        this.reportData("app_pause", null);
    }

    getScreenHeight() {
        return jsb.reflection.callStaticMethod("HvillJSB", "getScreenHeight");
    }

    showBannerAd(e, t, o, n, i, a) {
        jsb.reflection.callStaticMethod("HvillJSB", "showBannerAd:width:height:", String(n), String(i), String(a));
    }

    getStatusBarHeight() {
        const e = jsb.reflection.callStaticMethod("HvillJSB", "getStatusBarHeight");
        console.log("getStatusBarHeight", e);
        return e;
    }

    showForceToast(e) {
        jsb.reflection.callStaticMethod("HvillJSB", "showForceToast:duration:", e, "1.5");
    }

    onVideoClose(e) {
        AudioManager.getInstance().resumeMusic("DEFAULT_BGM_NAME", true);
        AdManager.getInstance().onVideoClose(JSON.parse(e));
    }

    decrypt(e) {
        return jsb.reflection.callStaticMethod("HvillJSB", "decrypt:", e);
    }

    setVibratoLight() {
        jsb.reflection.callStaticMethod("HvillJSB", "setVibratoLight");
    }

    networkingReachabilityDidChange() {
    }

    closeBannerAd() {
        jsb.reflection.callStaticMethod("HvillJSB", "closeBannerAd");
    }

    getNgister(e, t, o) {
        const n = jsb.reflection.callStaticMethod("HvillJSB", "getNgister:time:noneStr:", e, t, o);
        console.log("url====", e, "result", n);
        return n;
    }

    getVersionName() {
        return jsb.reflection.callStaticMethod("HvillJSB", "getVersionName");
    }

    showRewardVideoAd(e) {
        console.log("callStaticMethod.showRewardVideoAd ", e);
        const t = e.is_force;
        jsb.reflection.callStaticMethod("HvillJSB", "showRewardVideoAd:extraInfo:", t ? "1" : "0", JSON.stringify(e));
    }

    encrypt(e) {
        return jsb.reflection.callStaticMethod("HvillJSB", "encrypt:", e);
    }

    onSplashAdSkip() {
        console.log("onSplashAdSkip");
        EventMgr.trigger(AdvertEventType.SPLASH_FINISH);
    }

    getBlackBox() {
    }

    getClientInfo() {
        return jsb.reflection.callStaticMethod("HvillJSB", "getClientInfo");
    }

    onVideoFailed(e) {
        AudioManager.getInstance().resumeMusic(DEFAULT_BGM_NAME, true);
        AdManager.getInstance().onVideoError(e);
    }

    showToast(e) {
        jsb.reflection.callStaticMethod("HvillJSB", "showToast:duration:offsetY:", e, "1.5", "300");
    }

    onAppStop() {
        console.log("Oc调用Js onAppStop");
    }

    openKefu(e, t, o) {
        return jsb.reflection.callStaticMethod("HvillJSB", "openKefu:avatarImg:gender:", e, t, o);
    }

    onSplashAdFailed() {
        console.log("onSplashAdError");
        EventMgr.trigger(AdvertEventType.SPLASH_FINISH);
    }

    onAttachedToWindow() {
        console.log("onAttachedToWindow");
    }

    showSplashAd(e) {
        const t = e.bottom;
        jsb.reflection.callStaticMethod("HvillJSB", "loadSplashAd:", String(t));
    }

    onAppStart() {
        console.log("Oc调用Js onAppStart");
        this.reportData("app_start", null);
    }

    preLoadImgAd(e, t, o) {
        jsb.reflection.callStaticMethod("HvillJSB", "preLoadImgAd:height:", String(t), String(o));
    }

    onGetAdInfo(e) {
        console.log("回传AdInfo " + e, JSON.stringify(e));
        const t = JSON.parse(e);
        EventMgr.trigger(AdvertEventType.ONGETADINFO, t);
    }

    static getInstance() {
        if (null == this._instance) {
            this._instance = new CalliOS();
        }
        return this._instance;
    }

    setUserInfo(e) {
        if (cc.sys.isNative) {
            jsb.reflection.callStaticMethod("HvillJSB", "setUserInfo:", e);
        }
    }

    getNetworkingStatus() {
        const e = jsb.reflection.callStaticMethod("HvillJSB", "networkingStatus");
        console.log("网络状态变化" + e);
        return e;
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
        const u = JSON.stringify(n);
        if (cc.sys.isNative) {
            if (o) {
                jsb.reflection.callStaticMethod("HvillJSB", "reportCoreData:", u);
                console.log("android", o + "埋点>>>>>>>>>>" + u);
            } else {
                jsb.reflection.callStaticMethod("HvillJSB", "reportData:", u);
                console.log("android", o + "埋点>>>>>>>>>>" + u);
            }
        }
    }

    onAppDestory() {
        console.log("Oc调用Js onAppDestory");
        this.reportData("app_destory", null);
    }

    showImgAd(e, t, o, n, i, a) {
        jsb.reflection.callStaticMethod("HvillJSB", "showImgAd:width:height:", String(t), String(i), String(a));
    }
}

window.calliOS = CalliOS.getInstance();
