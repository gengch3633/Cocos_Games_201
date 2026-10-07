import AdEventType from "./AdEventType";
import EventSystem from "./EventSystem";
import PlatformBridge from "./PlatformBridge";

interface AdRuntime {
    getInsertScreenFlag(): string;
    setInsertShowTime(): void;
    pauseInsertTimer(): void;
    resumeInsertTimer(): void;
}

declare global {
    interface Window {
        calliOS?: {
            showSplashAd?(params: { slotId: number; bottom: number }): void;
            showRewardVideoAd?(params: any): void;
        };
    }
}

export default class AdLegacyBridge {
    static events = AdEventType;
    static runtime: AdRuntime = {
        getInsertScreenFlag(): string {
            return "s0";
        },
        setInsertShowTime(): void {
        },
        pauseInsertTimer(): void {
        },
        resumeInsertTimer(): void {
        },
    };

    static configureRuntime(config?: Partial<AdRuntime>): void {
        this.runtime = { ...this.runtime, ...(config || {}) };
    }

    static listen(event: string, handler: Function, target: any, once?: boolean): void {
        EventSystem.listen(event, handler, target, once);
    }

    static trigger(event: string, data?: any): void {
        EventSystem.trigger(event, data);
    }

    static ignore(event: string, handler: Function, target: any): void {
        EventSystem.ignore(event, handler, target);
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
        const calliOS = window.calliOS;
        calliOS?.showSplashAd?.call(calliOS, { slotId: slotId, bottom: bottom });
    }

    static showRewardVideoByPlatform(params: any): void {
        const nativeBridge = PlatformBridge.getNativeBridge();
        if (cc.sys.os !== cc.sys.OS_ANDROID) {
            if (cc.sys.os === cc.sys.OS_IOS) {
                const calliOS = window.calliOS;
                calliOS?.showRewardVideoAd?.call(calliOS, params);
            }
        } else {
            nativeBridge?.showRewardVideoAd?.call(nativeBridge, JSON.stringify(params));
        }
    }
}
