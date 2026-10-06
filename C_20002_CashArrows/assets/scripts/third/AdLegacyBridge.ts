import EventSystem from "./EventSystem";
import PlatformBridge from "./PlatformBridge";
import AdEventType from "./AdEventType";

interface AdLegacyRuntime {
    getInsertScreenFlag(): string;
    setInsertShowTime(): void;
    pauseInsertTimer(): void;
    resumeInsertTimer(): void;
}

interface CalliOSBridge {
    showSplashAd?(opts: { slotId: number; bottom: number }): void;
    showRewardVideoAd?(data: unknown): void;
}

export default class AdLegacyBridge {
    static events = AdEventType;
    static runtime: AdLegacyRuntime = {
        getInsertScreenFlag(): string {
            return "s0";
        },
        setInsertShowTime(): void {},
        pauseInsertTimer(): void {},
        resumeInsertTimer(): void {},
    };

    static configureRuntime(runtime: Partial<AdLegacyRuntime>): void {
        this.runtime = { ...this.runtime, ...runtime };
    }

    static listen(event: string, callback: (...args: unknown[]) => void, target?: unknown): void {
        EventSystem.listen(event, callback, target);
    }

    static trigger(event: string, data?: unknown): void {
        EventSystem.trigger(event, data);
    }

    static ignore(event: string, callback: (...args: unknown[]) => void, target?: unknown): void {
        EventSystem.ignore(event, callback, target);
    }

    static getInsertScreenFlag(): string {
        return this.runtime.getInsertScreenFlag();
    }

    static setInsertShowTime(): void {
        this.runtime.setInsertShowTime();
    }

    static pauseInsertTimer(): void {
        this.runtime.pauseInsertTimer();
    }

    static resumeInsertTimer(): void {
        this.runtime.resumeInsertTimer();
    }

    static showSplashAd(slotId: number, bottom: number): void {
        const bridge = (window as { calliOS?: CalliOSBridge }).calliOS;
        bridge?.showSplashAd?.({ slotId, bottom });
    }

    static showRewardVideoByPlatform(data: unknown): void {
        const nativeBridge = PlatformBridge.getNativeBridge() as { showRewardVideoAd?(payload: string): void } | null;
        if (cc.sys.os !== cc.sys.OS_ANDROID) {
            if (cc.sys.os === cc.sys.OS_IOS) {
                const bridge = (window as { calliOS?: CalliOSBridge }).calliOS;
                bridge?.showRewardVideoAd?.(data);
            }
        } else {
            nativeBridge?.showRewardVideoAd?.(JSON.stringify(data));
        }
    }
}
