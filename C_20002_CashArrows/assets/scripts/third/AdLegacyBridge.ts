import EventSystem from "./EventSystem";
import PlatformBridge from "./PlatformBridge";
import AdEventType from "./AdEventType";

export default class AdLegacyBridge {
    static configureRuntime(runtime: any) {
        this.runtime = Object.assign(Object.assign({}, this.runtime), runtime || {});
    }

    static listen(eventName: any, callback: any, target: any) {
        EventSystem.listen(eventName, callback, target);
    }

    static trigger(eventName: any, data: any) {
        EventSystem.trigger(eventName, data);
    }

    static ignore(eventName: any, callback: any, target: any) {
        EventSystem.ignore(eventName, callback, target);
    }

    static getInsertScreenFlag() {
        return this.runtime.getInsertScreenFlag();
    }

    static setInsertShowTime() {
        this.runtime.setInsertShowTime();
    }

    static pauseInsertTimer() {
        this.runtime.pauseInsertTimer();
    }

    static resumeInsertTimer() {
        this.runtime.resumeInsertTimer();
    }

    static showSplashAd(slotId: any, bottom: any) {
        const calliOS = (window as any).calliOS;
        calliOS?.showSplashAd?.call(calliOS, {
            slotId: slotId,
            bottom: bottom
        });
    }

    static showRewardVideoByPlatform(payload: any) {
        const nativeBridge = PlatformBridge.getNativeBridge();
        if (cc.sys.os !== cc.sys.OS_ANDROID) {
            if (cc.sys.os === cc.sys.OS_IOS) {
                const calliOS = (window as any).calliOS;
                calliOS?.showRewardVideoAd?.call(calliOS, payload);
            }
        } else nativeBridge?.showRewardVideoAd?.call(nativeBridge, JSON.stringify(payload));
    }

    static events = AdEventType;
    static runtime: any = {
        getInsertScreenFlag: function () {
            return " s0 ";
        },
        setInsertShowTime: function () {},
        pauseInsertTimer: function () {},
        resumeInsertTimer: function () {}
    };
}
