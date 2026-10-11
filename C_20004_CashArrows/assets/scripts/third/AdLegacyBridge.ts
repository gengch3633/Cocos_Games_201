import EventSystem from "./EventSystem";
import PlatformBridge from "./PlatformBridge";
import AdEventType from "./AdEventType";

export default class AdLegacyBridge {
    public static events = AdEventType;
    public static runtime = {
        getInsertScreenFlag: function (): string {
            return "s0";
        },
        setInsertShowTime: function (): void {},
        pauseInsertTimer: function (): void {},
        resumeInsertTimer: function (): void {}
    };

    public static configureRuntime(runtime: any): void {
        this.runtime = Object.assign(Object.assign({}, this.runtime), runtime || {});
    }

    public static listen(eventName: string, callback: (...args: any[]) => void, target?: any): void {
        EventSystem.listen(eventName, callback, target);
    }

    public static trigger(eventName: string, data?: any): void {
        EventSystem.trigger(eventName, data);
    }

    public static ignore(eventName: string, callback: (...args: any[]) => void, target?: any): void {
        EventSystem.ignore(eventName, callback, target);
    }

    public static getInsertScreenFlag(): string {
        return this.runtime.getInsertScreenFlag();
    }

    public static setInsertShowTime(): void {
        this.runtime.setInsertShowTime();
    }

    public static pauseInsertTimer(): void {
        this.runtime.pauseInsertTimer();
    }

    public static resumeInsertTimer(): void {
        this.runtime.resumeInsertTimer();
    }

    public static showSplashAd(slotId: number, bottom: any): void {
        const calliOS = window["calliOS"];
        calliOS?.showSplashAd?.({ slotId: slotId, bottom: bottom });
    }

    public static showRewardVideoByPlatform(request: any): void {
        const nativeBridge = PlatformBridge.getNativeBridge();
        if (cc.sys.os !== cc.sys.OS_ANDROID) {
            if (cc.sys.os === cc.sys.OS_IOS) {
                const calliOS = window["calliOS"];
                calliOS?.showRewardVideoAd?.(request);
            }
        } else {
            nativeBridge?.showRewardVideoAd?.(JSON.stringify(request));
        }
    }
}