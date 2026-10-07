import AdEventType from "./AdEventType";
import EventSystem from "./EventSystem";
import PlatformBridge from "./PlatformBridge";

interface AdRuntime {
    getInsertScreenFlag(): string;
    setInsertShowTime(): void;
    pauseInsertTimer(): void;
    resumeInsertTimer(): void;
}

export default class AdLegacyBridge {
    static events = AdEventType;
    static runtime: AdRuntime = {
        getInsertScreenFlag(): string {
            return " s0 ";
        },
        setInsertShowTime(): void {
        },
        pauseInsertTimer(): void {
        },
        resumeInsertTimer(): void {
        }
    };

    static configureRuntime(config: Partial<AdRuntime>): void {
        this.runtime = Object.assign({}, this.runtime, config || {});
    }

    static listen(event: string, callback: Function, caller: any, args?: any[]): void {
        EventSystem.listen(event, callback, caller, args);
    }

    static trigger(event: string, data?: any): void {
        EventSystem.trigger(event, data);
    }

    static ignore(event: string, callback: Function, caller: any): void {
        EventSystem.ignore(event, callback, caller);
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
        const calliOS = (window as any).calliOS;
        calliOS?.showSplashAd?.call(calliOS, {
            slotId: slotId,
            bottom: bottom
        });
    }

    static showRewardVideoByPlatform(params: any): void {
        const bridge = PlatformBridge.getNativeBridge();
        if (cc.sys.os !== cc.sys.OS_ANDROID) {
            if (cc.sys.os === cc.sys.OS_IOS) {
                const calliOS = (window as any).calliOS;
                calliOS?.showRewardVideoAd?.call(calliOS, params);
            }
        } else {
            bridge?.showRewardVideoAd?.call(bridge, JSON.stringify(params));
        }
    }
}
