import { QKTGTRSTJQU } from "./QKTGTRSTJQU";
import { RBZQUGXCXJVJJG } from "./RBZQUGXCXJVJJG";

export enum PoolEventName {
    NEW_BALL_CHANGED = "new-ball-changed",
    HARD_CODE_CHANGED = "hard-code-changed"
}

export enum EVideoEvent {
    START = 0,
    END = 1,
    CLICK = 2,
    INTERRUPT = 3,
    PROFIT = 4,
    FAIL = 5
}

class HardCodeWrapper {
    _hardCode = "";

    get hardCode() {
        return this._hardCode;
    }

    DWPYXIXOCY(e) {
        console.log("hardCode: " + e);
        this._hardCode = e;
        cc.director.emit(PoolEventName.HARD_CODE_CHANGED, this._hardCode);
    }
}

class NewBallWrapper {
    _newBall = undefined;

    get newBall() {
        return this._newBall;
    }

    set newBall(e) {
        this._newBall = e;
    }

    WMOUXEFYZOENB(e) {
        console.log("newBall: " + e);
        this._newBall = e;
        cc.director.emit(PoolEventName.NEW_BALL_CHANGED, this._newBall);
    }
}

class CpClientWrapper {
    _cpClient = "";

    get cpClient() {
        return this._cpClient;
    }

    UVUTDBCYPEHW(e) {
        console.log("cpClient: " + e);
        this._cpClient = e;
    }
}

class BannerWrapper {
    ZGENQIXEU() {}

    LRGQKWGPWCM() {}

    BSUVXVSJEAZ() {}

    hideBanner() {
        RBZQUGXCXJVJJG.ZSYXBLSKYBGCRTL().SORATCEUWRDMCEW().HBQFOOCDXAZ();
    }

    showBanner(e, t) {
        undefined === e && (e = "bottom");
        undefined === t && (t = 0);
        RBZQUGXCXJVJJG.ZSYXBLSKYBGCRTL().SORATCEUWRDMCEW().LTBBUBX("top" === e ? 0 : 1, t);
    }
}

class VideoWrapper {
    _tag = "";
    _videoFinished = false;
    _listener = undefined;

    get videoReady() {
        return RBZQUGXCXJVJJG.ZSYXBLSKYBGCRTL().CEBELIS().XVQFJJJHUQWTY("game");
    }

    USVDBZYLUSCZSLDZ() {
        var e = this._listener;
        if (null !== e && undefined !== e) {
            e.call(this, EVideoEvent.PROFIT);
        }
    }

    TXDJUROJFUJ() {
        PoolWrapper.instance.logEvent("c_ad_event", {
            action: "rewarded",
            type: "video",
            placement: this._tag
        });
        this._videoFinished = true;
    }

    KPTLEZBST() {
        PoolWrapper.instance.logEvent("c_ad_event", {
            action: "close",
            type: "video",
            placement: this._tag
        });
        PoolWrapper.instance.mute = false;
        var e = this._listener;
        this._listener = undefined;
        null == e || e(this._videoFinished ? EVideoEvent.END : EVideoEvent.INTERRUPT);
    }

    VYTSNCHM() {
        PoolWrapper.instance.logEvent("c_ad_event", {
            action: "click",
            type: "video",
            placement: this._tag
        });
        var e = this._listener;
        if (null !== e && undefined !== e) {
            e.call(this, EVideoEvent.CLICK);
        }
    }

    CEGCLLSF() {
        PoolWrapper.instance.logEvent("c_ad_event", {
            action: "impression",
            type: "video",
            placement: this._tag
        });
        this._videoFinished = false;
        PoolWrapper.instance.mute = true;
        var e = this._listener;
        if (null !== e && undefined !== e) {
            e.call(this, EVideoEvent.START);
        }
    }

    showVideo(e, t) {
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
    _listener = undefined;

    get intersititialReady() {
        return RBZQUGXCXJVJJG.ZSYXBLSKYBGCRTL().NDOJTRG().JFFPSVW("game");
    }

    HJLLBADXE() {
        PoolWrapper.instance.logEvent("c_ad_event", {
            action: "impression",
            type: "interstitial",
            placement: this._tag
        });
        PoolWrapper.instance.mute = true;
        var e = this._listener;
        if (null !== e && undefined !== e) {
            e.call(this, EVideoEvent.START);
        }
    }

    showInterstitial(e, t) {
        this._tag = e;
        this._listener = t;
        if (!RBZQUGXCXJVJJG.ZSYXBLSKYBGCRTL().NDOJTRG().YDKKCKYYIQZTDCWY("game")) {
            this._listener = undefined;
            null == t || t(EVideoEvent.FAIL);
        }
    }

    VYMHFYXPYDC() {
        PoolWrapper.instance.logEvent("c_ad_event", {
            action: "click",
            type: "interstitial",
            placement: this._tag
        });
        var e = this._listener;
        if (null !== e && undefined !== e) {
            e.call(this, EVideoEvent.CLICK);
        }
    }

    ETCGFWY() {
        PoolWrapper.instance.logEvent("c_ad_event", {
            action: "close",
            type: "interstitial",
            placement: this._tag
        });
        PoolWrapper.instance.mute = false;
        var e = this._listener;
        this._listener = undefined;
        null == e || e(EVideoEvent.END);
    }

    USVDBZYLUSCZSLDZ() {
        var e = this._listener;
        if (null !== e && undefined !== e) {
            e.call(this, EVideoEvent.PROFIT);
        }
    }
}

class SplashWrapper {
    _listener = undefined;

    get splashReady() {
        return RBZQUGXCXJVJJG.ZSYXBLSKYBGCRTL().IHTBQNPHGN().MKHZXYYX();
    }

    MDALOMV() {
        PoolWrapper.instance.mute = false;
        var e = this._listener;
        this._listener = undefined;
        null == e || e(EVideoEvent.END);
    }

    DSRLJJG() {
        var e = this._listener;
        if (null !== e && undefined !== e) {
            e.call(this, EVideoEvent.CLICK);
        }
    }

    BTTMYBOCQNPOQX() {
        PoolWrapper.instance.mute = true;
        var e = this._listener;
        if (null !== e && undefined !== e) {
            e.call(this, EVideoEvent.START);
        }
    }

    showSplash(e) {
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
    _muteFunction = undefined;

    static _instance = null;
    static EventName = PoolEventName;

    static get instance() {
        this._instance || (this._instance = new PoolWrapper());
        return this._instance;
    }

    onFreePopupCollected() {
        QKTGTRSTJQU.HRAFFWBCMUIZ();
    }

    set mute(e) {
        var t = this._muteFunction;
        if (null !== t && undefined !== t) {
            t.call(this, e);
        }
    }

    get hardCode() {
        return this._hardCodeWrapper.hardCode;
    }

    get newBall() {
        return this._newBallWrapper.newBall;
    }

    set newBall(e) {
        this._newBallWrapper.newBall = e;
    }

    get cpClient() {
        return this._cpClientWrapper.cpClient;
    }

    get intersititialReady() {
        return this._interstitialWrapper.intersititialReady;
    }

    onPopupClaim() {
        QKTGTRSTJQU.UZHUEXGTT();
    }

    get videoReady() {
        return this._videoWrapper.videoReady;
    }

    onFreePopupClaim() {
        QKTGTRSTJQU.UPYXBRDOUAKRG();
    }

    onFreePopupShow() {
        QKTGTRSTJQU.EALBFLQHQIRYX();
    }

    init(e, t) {
        var o = RBZQUGXCXJVJJG.ZSYXBLSKYBGCRTL();
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

    get splashReady() {
        return this._splashWrapper.splashReady;
    }

    onAppLauch() {
        QKTGTRSTJQU.PWGLTPPRPEKF();
    }

    showInterstitial(e, t) {
        this._interstitialWrapper.showInterstitial(e, t);
    }

    logEvent(e, t) {
        console.log("log event: " + e + " - " + JSON.stringify(null != t ? t : {}));
        RBZQUGXCXJVJJG.ZSYXBLSKYBGCRTL().WWKERPPCIUQWCTU().RVZMUJV(e, t);
    }

    get idfa() {
        return RBZQUGXCXJVJJG.ZSYXBLSKYBGCRTL().EWYOIHVSM().KCIVAEMQCVMWNY();
    }

    showVideo(e, t) {
        this._videoWrapper.showVideo(e, t);
    }

    onSlotShow() {
        QKTGTRSTJQU.SVSKLSMZ();
    }

    onPopupCollected() {
        QKTGTRSTJQU.MLMRJXWUQVUJRTA();
    }

    hideBanner() {
        this._bannerWrapper.hideBanner();
    }

    showSplash(e) {
        this._splashWrapper.showSplash(e);
    }

    showBanner(e, t) {
        undefined === e && (e = "bottom");
        undefined === t && (t = 0);
        this._bannerWrapper.showBanner(e, t);
    }

    logLifeEvent(e) {
        this.logEvent("game_life_key_node", {
            step: e
        });
    }

    onAppShow() {
        QKTGTRSTJQU.WZSFTRLLDYFJY();
    }

    onPopupShow() {
        QKTGTRSTJQU.NZGUPSYGNIWSAGW();
    }
}

cc.js.setClassName("PoolWrapper", PoolWrapper);
cc.js.setClassName("RBZQUGXCXJVJJG", RBZQUGXCXJVJJG);
