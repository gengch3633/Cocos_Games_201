import * as RBZQUGXCXJVJJGModule from "./RBZQUGXCXJVJJG";
import * as QKTGTRSTJQUModule from "./QKTGTRSTJQU";

const RBZQUGXCXJVJJG = (RBZQUGXCXJVJJGModule as any).RBZQUGXCXJVJJG;
const QKTGTRSTJQU = (QKTGTRSTJQUModule as any).QKTGTRSTJQU;

export const PoolEventName = {
    NEW_BALL_CHANGED: "new-ball-changed",
    HARD_CODE_CHANGED: "hard-code-changed",
};

export enum EVideoEvent {
    START = 0,
    END = 1,
    CLICK = 2,
    INTERRUPT = 3,
    PROFIT = 4,
    FAIL = 5,
}

class HardCodeWrapper {
    private _hardCode = "";

    get hardCode(): string {
        return this._hardCode;
    }

    DWPYXIXOCY(value: string): void {
        console.log("hardCode: " + value);
        this._hardCode = value;
        cc.director.emit(PoolEventName.HARD_CODE_CHANGED, this._hardCode);
    }
}

class NewBallWrapper {
    private _newBall: boolean = undefined;

    get newBall(): boolean {
        return this._newBall;
    }

    set newBall(value: boolean) {
        this._newBall = value;
    }

    WMOUXEFYZOENB(value: boolean): void {
        console.log("newBall: " + value);
        this._newBall = value;
        cc.director.emit(PoolEventName.NEW_BALL_CHANGED, this._newBall);
    }
}

class CpClientWrapper {
    private _cpClient = "";

    get cpClient(): string {
        return this._cpClient;
    }

    UVUTDBCYPEHW(value: string): void {
        console.log("cpClient: " + value);
        this._cpClient = value;
    }
}

class BannerWrapper {
    ZGENQIXEU(): void {}
    LRGQKWGPWCM(): void {}
    BSUVXVSSJEAZ(): void {}

    hideBanner(): void {
        RBZQUGXCXJVJJG.ZSYXBLSKYBGCRTL().SORATCEUWRDMCEW().HBQFOOCDXAZ();
    }

    showBanner(position = "bottom", offset = 0): void {
        RBZQUGXCXJVJJG.ZSYXBLSKYBGCRTL().SORATCEUWRDMCEW().LTBBUBX(position === "top" ? 0 : 1, offset);
    }
}

class VideoWrapper {
    private _tag = "";
    private _videoFinished = false;
    private _listener: ((event: EVideoEvent) => void) | undefined = undefined;

    get videoReady(): boolean {
        return RBZQUGXCXJVJJG.ZSYXBLSKYBGCRTL().CEBELIS().XVQFJJJHUQWTY("game");
    }

    USVDBZYLUSCZSLDZ(): void {
        this._listener?.(EVideoEvent.PROFIT);
    }

    TXDJUROJFUJ(): void {
        PoolWrapper.instance.logEvent("c_ad_event", {
            action: "rewarded",
            type: "video",
            placement: this._tag,
        });
        this._videoFinished = true;
    }

    KPTLEZBST(): void {
        PoolWrapper.instance.logEvent("c_ad_event", {
            action: "close",
            type: "video",
            placement: this._tag,
        });
        PoolWrapper.instance.mute = false;
        const listener = this._listener;
        this._listener = undefined;
        listener?.(this._videoFinished ? EVideoEvent.END : EVideoEvent.INTERRUPT);
    }

    VYTSNCHM(): void {
        PoolWrapper.instance.logEvent("c_ad_event", {
            action: "click",
            type: "video",
            placement: this._tag,
        });
        this._listener?.(EVideoEvent.CLICK);
    }

    CEGCLLSF(): void {
        PoolWrapper.instance.logEvent("c_ad_event", {
            action: "impression",
            type: "video",
            placement: this._tag,
        });
        this._videoFinished = false;
        PoolWrapper.instance.mute = true;
        this._listener?.(EVideoEvent.START);
    }

    showVideo(placement: string, listener?: (event: EVideoEvent) => void): void {
        this._tag = placement;
        this._listener = listener;
        if (!RBZQUGXCXJVJJG.ZSYXBLSKYBGCRTL().CEBELIS().ZBFDUZXA("game")) {
            this._listener = undefined;
            listener?.(EVideoEvent.FAIL);
        }
    }
}

class InterstitialWrapper {
    private _tag = "";
    private _listener: ((event: EVideoEvent) => void) | undefined = undefined;

    get intersititialReady(): boolean {
        return RBZQUGXCXJVJJG.ZSYXBLSKYBGCRTL().NDOJTRG().JFFPSVW("game");
    }

    HJLLBADXE(): void {
        PoolWrapper.instance.logEvent("c_ad_event", {
            action: "impression",
            type: "interstitial",
            placement: this._tag,
        });
        PoolWrapper.instance.mute = true;
        this._listener?.(EVideoEvent.START);
    }

    showInterstitial(placement: string, listener?: (event: EVideoEvent) => void): void {
        this._tag = placement;
        this._listener = listener;
        if (!RBZQUGXCXJVJJG.ZSYXBLSKYBGCRTL().NDOJTRG().YDKKCKYYIQZTDCWY("game")) {
            this._listener = undefined;
            listener?.(EVideoEvent.FAIL);
        }
    }

    VYMHFYXPYDC(): void {
        PoolWrapper.instance.logEvent("c_ad_event", {
            action: "click",
            type: "interstitial",
            placement: this._tag,
        });
        this._listener?.(EVideoEvent.CLICK);
    }

    ETCGFWY(): void {
        PoolWrapper.instance.logEvent("c_ad_event", {
            action: "close",
            type: "interstitial",
            placement: this._tag,
        });
        PoolWrapper.instance.mute = false;
        const listener = this._listener;
        this._listener = undefined;
        listener?.(EVideoEvent.END);
    }

    USVDBZYLUSCZSLDZ(): void {
        this._listener?.(EVideoEvent.PROFIT);
    }
}

class SplashWrapper {
    private _listener: ((event: EVideoEvent) => void) | undefined = undefined;

    get splashReady(): boolean {
        return RBZQUGXCXJVJJG.ZSYXBLSKYBGCRTL().IHTBQNPHGN().MKHZXYYX();
    }

    MDALOMV(): void {
        PoolWrapper.instance.mute = false;
        const listener = this._listener;
        this._listener = undefined;
        listener?.(EVideoEvent.END);
    }

    DSRLJJG(): void {
        this._listener?.(EVideoEvent.CLICK);
    }

    BTTMYBOCQNPOQX(): void {
        PoolWrapper.instance.mute = true;
        this._listener?.(EVideoEvent.START);
    }

    showSplash(listener?: (event: EVideoEvent) => void): void {
        this._listener = listener;
        if (!RBZQUGXCXJVJJG.ZSYXBLSKYBGCRTL().IHTBQNPHGN().RSGPVX("entry")) {
            this._listener = undefined;
            listener?.(EVideoEvent.FAIL);
        }
    }
}

export class PoolWrapper {
    static EventName = PoolEventName;
    private static _instance: PoolWrapper = null;

    private _hardCodeWrapper = new HardCodeWrapper();
    private _newBallWrapper = new NewBallWrapper();
    private _cpClientWrapper = new CpClientWrapper();
    private _bannerWrapper = new BannerWrapper();
    private _videoWrapper = new VideoWrapper();
    private _interstitialWrapper = new InterstitialWrapper();
    private _splashWrapper = new SplashWrapper();
    private _muteFunction: ((muted: boolean) => void) | undefined = undefined;

    static get instance(): PoolWrapper {
        return PoolWrapper._instance || (PoolWrapper._instance = new PoolWrapper());
    }

    onFreePopupCollected(): void {
        QKTGTRSTJQU.HRAFFWBCMUIZ();
    }

    set mute(value: boolean) {
        this._muteFunction?.(value);
    }

    get hardCode(): string {
        return this._hardCodeWrapper.hardCode;
    }

    get newBall(): boolean {
        return this._newBallWrapper.newBall;
    }

    set newBall(value: boolean) {
        this._newBallWrapper.newBall = value;
    }

    get cpClient(): string {
        return this._cpClientWrapper.cpClient;
    }

    get intersititialReady(): boolean {
        return this._interstitialWrapper.intersititialReady;
    }

    onPopupClaim(): void {
        QKTGTRSTJQU.UZHUEXGTT();
    }

    get videoReady(): boolean {
        return this._videoWrapper.videoReady;
    }

    onFreePopupClaim(): void {
        QKTGTRSTJQU.UPYXBRDOUAKRG();
    }

    onFreePopupShow(): void {
        QKTGTRSTJQU.EALBFLQHQIRYX();
    }

    init(appKey: string, muteFn?: (muted: boolean) => void): void {
        const sdk = RBZQUGXCXJVJJG.ZSYXBLSKYBGCRTL();
        sdk.WNQKZCZDGVYDTL().BNTJZPHDS(this._hardCodeWrapper);
        sdk.FOWHNIUAUS().FJGKCYXF(this._newBallWrapper);
        sdk.LRRHEYFMQEPE().KMTYRBVRZVBENMR(this._cpClientWrapper);
        sdk.SORATCEUWRDMCEW().RKLFYESZBGK(this._bannerWrapper);
        sdk.CEBELIS().NEDSFIADEVXEW(this._videoWrapper);
        sdk.NDOJTRG().KRGTITGFJPNED(this._interstitialWrapper);
        sdk.IHTBQNPHGN().QVRGUFKEONTDPA(this._splashWrapper);
        sdk.RVIUIWJHMUDCSKSL(appKey);
        this._muteFunction = muteFn;
    }

    get splashReady(): boolean {
        return this._splashWrapper.splashReady;
    }

    onAppLauch(): void {
        QKTGTRSTJQU.PWGLTPPRPEKF();
    }

    showInterstitial(placement: string, listener?: (event: EVideoEvent) => void): void {
        this._interstitialWrapper.showInterstitial(placement, listener);
    }

    logEvent(name: string, payload?: unknown): void {
        console.log("log event: " + name + " - " + JSON.stringify(payload != null ? payload : {}));
        RBZQUGXCXJVJJG.ZSYXBLSKYBGCRTL().WWKERPPCIUQWCTU().RVZMUJV(name, payload);
    }

    get idfa(): string {
        return RBZQUGXCXJVJJG.ZSYXBLSKYBGCRTL().EWYOIHVSM().KCIVAEMQCVMWNY();
    }

    showVideo(placement: string, listener?: (event: EVideoEvent) => void): void {
        this._videoWrapper.showVideo(placement, listener);
    }

    onSlotShow(): void {
        QKTGTRSTJQU.SVSKLSMZ();
    }

    onPopupCollected(): void {
        QKTGTRSTJQU.MLMRJXWUQVUJRTA();
    }

    hideBanner(): void {
        this._bannerWrapper.hideBanner();
    }

    showSplash(listener?: (event: EVideoEvent) => void): void {
        this._splashWrapper.showSplash(listener);
    }

    showBanner(position = "bottom", offset = 0): void {
        this._bannerWrapper.showBanner(position, offset);
    }

    logLifeEvent(step: string): void {
        this.logEvent("game_life_key_node", { step });
    }

    onAppShow(): void {
        QKTGTRSTJQU.WZSFTRLLDYFJY();
    }

    onPopupShow(): void {
        QKTGTRSTJQU.NZGUPSYGNIWSAGW();
    }
}

cc.js.setClassName("PoolWrapper", PoolWrapper);
cc.js.setClassName("RBZQUGXCXJVJJG", RBZQUGXCXJVJJG);
