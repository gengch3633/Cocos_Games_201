import BusinessAnalyticsService from "./BusinessAnalyticsService";
import Common from "./Common";
import GlobalEventMgr from "./GlobalEventMgr";
import InterfaceMgr from "./InterfaceMgr";
import NativeSdkBridgeAdapter from "./NativeSdkBridgeAdapter";
import UIDefine from "./UIDefine";
import UIMgr from "./UIMgr";

const LOG = "[AppReviewManager]";

function report(eventName: string, data?: any): void {
    try {
        if (BusinessAnalyticsService && BusinessAnalyticsService.reportData) {
            BusinessAnalyticsService.reportData(eventName, data || {});
        }
    } catch (e) {
        console.warn(LOG + " report failed", eventName, e);
    }
}

export default class AppReviewManager {
    private static _instance: AppReviewManager = null;

    private _inited: boolean = false;
    private _resumeTs: number = 0;
    private _state: any = null;

    public static getInstance(): AppReviewManager {
        if (!AppReviewManager._instance) {
            AppReviewManager._instance = new AppReviewManager();
        }
        return AppReviewManager._instance;
    }

    private _storageKey(): string {
        const common: any = Common;
        return (common && common.version ? common.version : "1.0.0") + "_arrow_app_review";
    }

    private _load(): void {
        const state: any = {
            passCount: 0,
            playSeconds: 0,
            shownCount: 0,
            lastShownTs: 0,
            jumped: false
        };
        try {
            const raw = cc.sys.localStorage.getItem(this._storageKey());
            if (raw) {
                const parsed = JSON.parse(raw);
                if (parsed && "object" == typeof parsed) {
                    state.passCount = Number(parsed.passCount) || 0;
                    state.playSeconds = Number(parsed.playSeconds) || 0;
                    state.shownCount = Number(parsed.shownCount) || 0;
                    state.lastShownTs = Number(parsed.lastShownTs) || 0;
                    state.jumped = !!parsed.jumped;
                }
            }
        } catch (e) {
            console.warn(LOG + " load failed", e);
        }
        this._state = state;
        console.log(LOG + " _load state=" + JSON.stringify(state) + " key=" + this._storageKey());
    }

    private _save(): void {
        if (this._state) {
            try {
                cc.sys.localStorage.setItem(this._storageKey(), JSON.stringify(this._state));
            } catch (e) {
                console.warn(LOG + " save failed", e);
            }
        }
    }

    private _flushPlayTime(): void {
        if (this._state) {
            const now = Date.now();
            if (this._resumeTs > 0 && now > this._resumeTs) {
                this._state.playSeconds += (now - this._resumeTs) / 1e3;
            }
            this._resumeTs = now;
            this._save();
        }
    }

    private _currentPlaySeconds(): number {
        if (!this._state) {
            return 0;
        }
        let elapsed = 0;
        const now = Date.now();
        if (this._resumeTs > 0 && now > this._resumeTs) {
            elapsed = (now - this._resumeTs) / 1e3;
        }
        return this._state.playSeconds + elapsed;
    }

    public init(): void {
        if (!this._inited) {
            this._inited = true;
            this._load();
            this._resumeTs = Date.now();
            const self = this;
            cc.game.on(cc.game.EVENT_HIDE, function (): void {
                self._flushPlayTime();
                console.log(LOG + " EVENT_HIDE flush playSeconds=" + Math.floor(self._currentPlaySeconds()));
            });
            cc.game.on(cc.game.EVENT_SHOW, function (): void {
                self._resumeTs = Date.now();
                console.log(LOG + " EVENT_SHOW resume timing");
            });
            GlobalEventMgr.getInstance().on(InterfaceMgr.gameEvent.gameNext, this.onLevelPassed, this);
            console.log(LOG + " inited thresholds{ MIN_PASS=5, MIN_SECONDS=120, MAX_SHOW=1, COOLDOWN_DAYS=3 } state=" + JSON.stringify(this._state));
        }
    }

    public onLevelPassed(): void {
        if (this._state) {
            this._state.passCount += 1;
            this._flushPlayTime();
            console.log(LOG + " onLevelPassed passCount=" + this._state.passCount + " playSeconds=" + Math.floor(this._currentPlaySeconds()));
            this._tryTrigger();
        }
    }

    private _isFeatureEnabled(): boolean {
        try {
            const value = cc.sys.localStorage.getItem("MB_APP_REVIEW_ENABLED");
            if ("0" === value) {
                console.log(LOG + " config(localStorage) app_review_enabled=0 -> enabled=false");
                return false;
            }
            if ("1" === value) {
                console.log(LOG + " config(localStorage) app_review_enabled=1 -> enabled=true");
                return true;
            }
            console.log(LOG + " config app_review_enabled not set yet(v=" + value + "), default enabled=true");
        } catch (e) {
            console.warn(LOG + " read app_review config failed", e);
        }
        return true;
    }

    private _canShow(): boolean {
        const state = this._state;
        if (!state) {
            console.log(LOG + " _canShow=false reason=no_state");
            return false;
        }
        const playSeconds = Math.floor(this._currentPlaySeconds());
        const cooldownLeftMs = state.lastShownTs > 0 ? 2592e5 - (Date.now() - state.lastShownTs) : 0;
        console.log(LOG + " _canShow check -> enabled=" + this._isFeatureEnabled() + " jumped=" + state.jumped + " shownCount=" + state.shownCount + "/1 passCount=" + state.passCount + "/5 playSeconds=" + playSeconds + "/120 cooldownLeftMs=" + (cooldownLeftMs > 0 ? cooldownLeftMs : 0));
        if (!this._isFeatureEnabled()) {
            console.log(LOG + " _canShow=false reason=feature_disabled(config app_review_enabled=0)");
            return false;
        }
        if (state.jumped) {
            console.log(LOG + " _canShow=false reason=already_jumped");
            return false;
        }
        if (state.shownCount >= 1) {
            console.log(LOG + " _canShow=false reason=reach_max_show shownCount=" + state.shownCount + " max=1");
            return false;
        }
        if (state.passCount < 5) {
            console.log(LOG + " _canShow=false reason=pass_not_enough passCount=" + state.passCount + " need=5");
            return false;
        }
        if (playSeconds < 120) {
            console.log(LOG + " _canShow=false reason=playtime_not_enough playSeconds=" + playSeconds + " need=120");
            return false;
        }
        if (state.lastShownTs > 0 && Date.now() - state.lastShownTs < 2592e5) {
            console.log(LOG + " _canShow=false reason=in_cooldown leftMs=" + cooldownLeftMs);
            return false;
        }
        console.log(LOG + " _canShow=true -> will show review dialog");
        return true;
    }

    private _tryTrigger(): void {
        if (this._canShow()) {
            const viewCfg = UIDefine.appReviewView;
            if (viewCfg) {
                console.log(LOG + " show appReviewView");
                this._state.shownCount += 1;
                this._state.lastShownTs = Date.now();
                this._save();
                report("app_review_show", {
                    pass_count: this._state.passCount,
                    play_seconds: Math.floor(this._currentPlaySeconds()),
                    shown_count: this._state.shownCount
                });
                const result: any = UIMgr.getInstance().show(viewCfg);
                if (result && "function" == typeof result.then) {
                    result.then(function (): void {}).catch(function (e: any): void {
                        console.warn(LOG + " show appReviewView failed", e);
                    });
                }
            } else {
                console.warn(LOG + " appReviewView config missing");
            }
        }
    }

    public markJumped(): void {
        console.log(LOG + " markJumped -> set jumped=true, never show again, jump google play");
        if (this._state) {
            this._state.jumped = true;
            this._save();
        }
        this._callNativeReview();
    }

    private _callNativeReview(): void {
        try {
            const adapter: any = NativeSdkBridgeAdapter;
            const bridge = adapter && "function" == typeof adapter.getBridge ? adapter.getBridge() : null;
            if (bridge && "function" == typeof bridge.showAppReview) {
                bridge.showAppReview();
                console.log(LOG + " showAppReview invoked");
                return;
            }
            console.warn(LOG + " native showAppReview unavailable");
        } catch (e) {
            console.error(LOG + " _callNativeReview failed", e);
        }
    }
}