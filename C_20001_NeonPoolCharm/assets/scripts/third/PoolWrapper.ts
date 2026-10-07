import { RBZQUGXCXJVJJG } from "./RBZQUGXCXJVJJG";
import { QKTGTRSTJQU } from "./QKTGTRSTJQU";

export enum PoolEventName {
    NEW_BALL_CHANGED = "new-ball-changed",
    HARD_CODE_CHANGED = "hard-code-changed",
}

export enum EVideoEvent {
    START = 0,
    END = 1,
    CLICK = 2,
    INTERRUPT = 3,
    PROFIT = 4,
    FAIL = 5,
}

class HardCodeWrapper {
    _hardCode = "";

    get hardCode(): string {
        return this._hardCode;
    }

    DWPYXIXOCY(e: string): void {
        console.log("hardCode: " + e);
        this._hardCode = e;
        cc.director.emit(PoolEventName.HARD_CODE_CHANGED, this._hardCode);
    }
}

class NewBallWrapper {
    _newBall: any = undefined;

    get newBall(): any {
        return this._newBall;
    }

    set newBall(e: any) {
        this._newBall = e;
    }

    WMOUXEFYZOENB(e: any): void {
        console.log("newBall: " + e);
        this._newBall = e;
        cc.director.emit(PoolEventName.NEW_BALL_CHANGED, this._newBall);
    }
}

class CpClientWrapper {
    _cpClient = "";

    get cpClient(): string {
        return this._cpClient;
    }

    UVUTDBCYPEHW(e: string): void {
        console.log("cpClient: " + e);
        this._cpClient = e;
    }
}

class BannerWrapper {
    ZGENQIXEU(): void {
    }

    LRGQKWGPWCM(): void {
    }

    BSUVXVSSJEAZ(): void {
    }

    hideBanner(): void {
        RBZQUGXCXJVJJG.ZSYXBLSKYBGCRTL().SORATCEUWRDMCEW().HBQFOOCDXAZ();
    }

    showBanner(e = "bottom", t = 0): void {
        RBZQUGXCXJVJJG.ZSYXBLSKYBGCRTL().SORATCEUWRDMCEW().LTBBUBX("top" === e ? 0 : 1, t);
    }
}

class VideoWrapper {
    _tag = "";
    _videoFinished = false;
    _listener: ((event: EVideoEvent) => void) | undefined = undefined;

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
        const e = this._listener;
        this._listener = undefined;
        null == e || e(this._videoFinished ? EVideoEvent.END : EVideoEvent.INTERRUPT);
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

    showVideo(e: string, t: (event: EVideoEvent) => void): void {
        this._tag = e;
        this._listener = t;
        if (!RBZQUGXCXJVJJG.ZSYXBLSKYBGCRTL().CEBELIS().ZBFDUZXA("game")) {
            this._listener = undefined;
            null == t || t(EVideoEvent.FAIL);
        }
    }
}

class InterstitialWrapper {
    _tag = "";
    _listener: ((event: EVideoEvent) => void) | undefined = undefined;

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

    showInterstitial(e: string, t: (event: EVideoEvent) => void): void {
        this._tag = e;
        this._listener = t;
        if (!RBZQUGXCXJVJJG.ZSYXBLSKYBGCRTL().NDOJTRG().YDKKCKYYIQZTDCWY("game")) {
            this._listener = undefined;
            null == t || t(EVideoEvent.FAIL);
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
        const e = this._listener;
        this._listener = undefined;
        null == e || e(EVideoEvent.END);
    }

    USVDBZYLUSCZSLDZ(): void {
        this._listener?.(EVideoEvent.PROFIT);
    }
}

class SplashWrapper {
    _listener: ((event: EVideoEvent) => void) | undefined = undefined;

    get splashReady(): boolean {
        return RBZQUGXCXJVJJG.ZSYXBLSKYBGCRTL().IHTBQNPHGN().MKHZXYYX();
    }

    MDALOMV(): void {
        PoolWrapper.instance.mute = false;
        const e = this._listener;
        this._listener = undefined;
        null == e || e(EVideoEvent.END);
    }

    DSRLJJG(): void {
        this._listener?.(EVideoEvent.CLICK);
    }

    BTTMYBOCQNPOQX(): void {
        PoolWrapper.instance.mute = true;
        this._listener?.(EVideoEvent.START);
    }

    showSplash(e: (event: EVideoEvent) => void): void {
        this._listener = e;
        if (!RBZQUGXCXJVJJG.ZSYXBLSKYBGCRTL().IHTBQNPHGN().RSGPVX("entry")) {
            this._listener = undefined;
            null == e || e(EVideoEvent.FAIL);
        }
    }
}

export class PoolWrapper {
    _hardCodeWrapper = new HardCodeWrapper();
    _newBallWrapper = new NewBallWrapper();
    _cpClientWrapper = new CpClientWrapper();
    _bannerWrapper = new BannerWrapper();
    _videoWrapper = new VideoWrapper();
    _interstitialWrapper = new InterstitialWrapper();
    _splashWrapper = new SplashWrapper();
    _muteFunction: ((muted: boolean) => void) | undefined = undefined;

    static EventName = PoolEventName;
    static _instance: PoolWrapper = null;

    static get instance(): PoolWrapper {
        this._instance || (this._instance = new PoolWrapper());
        return this._instance;
    }

    onFreePopupCollected(): void {
        QKTGTRSTJQU.HRAFFWBCMUIZ();
    }

    set mute(e: boolean) {
        this._muteFunction?.(e);
    }

    get hardCode(): string {
        return this._hardCodeWrapper.hardCode;
    }

    get newBall(): any {
        return this._newBallWrapper.newBall;
    }

    set newBall(e: any) {
        this._newBallWrapper.newBall = e;
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

    init(e: any, t: (muted: boolean) => void): void {
        const o = RBZQUGXCXJVJJG.ZSYXBLSKYBGCRTL();
        o.WNQKZCZDGVYDTL().BNTJZPHDS(this._hardCodeWrapper);
        o.FOWHNIUAUS().FJGKCYXF(this._newBallWrapper);
        o.LRRHEYFMQEPE().KMTYRBVRZVBENMR(this._cpClientWrapper);
        o.SORATCEUWRDMCEW().RKLFYESZBGK(this._bannerWrapper);
        o.CEBELIS().NEDSFIADEVXEW(this._videoWrapper);
        o.NDOJTRG().KRGTITGFJPNED(this._interstitialWrapper);
        o.IHTBQNPHGN().QVRGUFKEONTDPA(this._splashWrapper);
        o.RVIUIWJHMUDCSKSL(e);
        this._muteFunction = t;
    }

    get splashReady(): boolean {
        return this._splashWrapper.splashReady;
    }

    onAppLauch(): void {
        QKTGTRSTJQU.PWGLTPPRPEKF();
    }

    showInterstitial(e: string, t: (event: EVideoEvent) => void): void {
        this._interstitialWrapper.showInterstitial(e, t);
    }

    logEvent(e: string, t?: any): void {
        console.log("log event: " + e + " - " + JSON.stringify(null != t ? t : {}));
        RBZQUGXCXJVJJG.ZSYXBLSKYBGCRTL().WWKERPPCIUQWCTU().RVZMUJV(e, t);
    }

    get idfa(): string {
        return RBZQUGXCXJVJJG.ZSYXBLSKYBGCRTL().EWYOIHVSM().KCIVAEMQCVMWNY();
    }

    showVideo(e: string, t: (event: EVideoEvent) => void): void {
        this._videoWrapper.showVideo(e, t);
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

    showSplash(e: (event: EVideoEvent) => void): void {
        this._splashWrapper.showSplash(e);
    }

    showBanner(e = "bottom", t = 0): void {
        this._bannerWrapper.showBanner(e, t);
    }

    logLifeEvent(e: string): void {
        this.logEvent("game_life_key_node", {
            step: e,
        });
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
