import AdEventType from "./AdEventType";
import EventSystem from "./EventSystem";
import PlatformBridge from "./PlatformBridge";

interface AdLegacyRuntime {
    getInsertScreenFlag(): string;
    setInsertShowTime(): void;
    pauseInsertTimer(): void;
    resumeInsertTimer(): void;
}

export default class AdLegacyBridge {
    public static events = AdEventType;
    public static runtime: AdLegacyRuntime = {
        getInsertScreenFlag(): string {
            return "s0";
        },
        setInsertShowTime(): void {},
        pauseInsertTimer(): void {},
        resumeInsertTimer(): void {}
    };

    public static configureRuntime(runtime?: Partial<AdLegacyRuntime> | null): void {
        this.runtime = Object.assign({}, this.runtime, runtime || {});
    }

    public static listen(event: string, callback: Function, target?: any): void {
        EventSystem.listen(event, callback, target);
    }

    public static trigger(event: string, data?: any): void {
        EventSystem.trigger(event, data);
    }

    public static ignore(event: string, callback: Function, target?: any): void {
        EventSystem.ignore(event, callback, target);
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

    public static showSplashAd(slotId: string, bottom: number): void {
        const calliOS = (window as any).calliOS;
        if (calliOS && calliOS.showSplashAd) {
            calliOS.showSplashAd({
                slotId: slotId,
                bottom: bottom
            });
        }
    }

    public static showRewardVideoByPlatform(params: any): void {
        const nativeBridge = PlatformBridge.getNativeBridge();
        if (cc.sys.os !== cc.sys.OS_ANDROID) {
            if (cc.sys.os === cc.sys.OS_IOS) {
                const calliOS = (window as any).calliOS;
                if (calliOS && calliOS.showRewardVideoAd) {
                    calliOS.showRewardVideoAd(params);
                }
            }
        } else if (nativeBridge && nativeBridge.showRewardVideoAd) {
            nativeBridge.showRewardVideoAd(JSON.stringify(params));
        }
    }
}