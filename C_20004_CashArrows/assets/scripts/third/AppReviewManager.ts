import BusinessAnalyticsService from "./BusinessAnalyticsService";
import Common from "./Common";
import GlobalEventMgr from "./GlobalEventMgr";
import InterfaceMgr from "./InterfaceMgr";
import NativeSdkBridgeAdapter from "./NativeSdkBridgeAdapter";
import UIDefine from "./UIDefine";
import UIMgr from "./UIMgr";

const TAG = "[AppReviewManager]";

interface AppReviewState {
    passCount: number;
    playSeconds: number;
    shownCount: number;
    lastShownTs: number;
    jumped: boolean;
}

function report(eventName: string, params?: Record<string, any>): void {
    try {
        if (BusinessAnalyticsService && typeof BusinessAnalyticsService.reportData === "function") {
            BusinessAnalyticsService.reportData(eventName, params || {});
        }
    } catch (err) {
        console.warn(TAG + " report failed", eventName, err);
    }
}

export default class AppReviewManager {
    private static _instance: AppReviewManager | null = null;

    private _inited: boolean = false;
    private _resumeTs: number = 0;
    private _state: AppReviewState | null = null;

    public static getInstance(): AppReviewManager {
        if (!AppReviewManager._instance) {
            AppReviewManager._instance = new AppReviewManager();
        }
        return AppReviewManager._instance;
    }

    private _storageKey(): string {
        return (Common && Common.version ? Common.version : "1.0.0") + "_arrow_app_review";
    }

    private _load(): void {
        const state: AppReviewState = {
            passCount: 0,
            playSeconds: 0,
            shownCount: 0,
            lastShownTs: 0,
            jumped: false
        };
        try {
            const raw = cc.sys.localStorage.getItem(this._storageKey());
            if (raw) {
                const data = JSON.parse(raw);
                if (data && typeof data === "object") {
                    state.passCount = Number(data.passCount) || 0;
                    state.playSeconds = Number(data.playSeconds) || 0;
                    state.shownCount = Number(data.shownCount) || 0;
                    state.lastShownTs = Number(data.lastShownTs) || 0;
                    state.jumped = !!data.jumped;
                }
            }
        } catch (e) {
            console.warn(TAG + " load failed", e);
        }
        this._state = state;
        console.log(TAG + " _load state=" + JSON.stringify(state) + " key=" + this._storageKey());
    }

    private _save(): void {
        if (!this._state) {
            return;
        }
        try {
            cc.sys.localStorage.setItem(this._storageKey(), JSON.stringify(this._state));
        } catch (e) {
            console.warn(TAG + " save failed", e);
        }
    }

    private _flushPlayTime(): void {
        if (!this._state) {
            return;
        }
        const now = Date.now();
        if (this._resumeTs > 0 && now > this._resumeTs) {
            this._state.playSeconds += (now - this._resumeTs) / 1000;
        }
        this._resumeTs = now;
        this._save();
    }

    private _currentPlaySeconds(): number {
        if (!this._state) {
            return 0;
        }
        let extra = 0;
        const now = Date.now();
        if (this._resumeTs > 0 && now > this._resumeTs) {
            extra = (now - this._resumeTs) / 1000;
        }
        return this._state.playSeconds + extra;
    }

    public init(): void {
        if (this._inited) {
            return;
        }
        this._inited = true;
        this._load();
        this._resumeTs = Date.now();
        const self = this;
        cc.game.on(cc.game.EVENT_HIDE, () => {
            self._flushPlayTime();
            console.log(TAG + " EVENT_HIDE flush playSeconds=" + Math.floor(self._currentPlaySeconds()));
        });
        cc.game.on(cc.game.EVENT_SHOW, () => {
            self._resumeTs = Date.now();
            console.log(TAG + " EVENT_SHOW resume timing");
        });
        GlobalEventMgr.getInstance().on(InterfaceMgr.gameEvent.gameNext, this.onLevelPassed, this);
        console.log(TAG + " inited thresholds{ MIN_PASS=5, MIN_SECONDS=120, MAX_SHOW=1, COOLDOWN_DAYS=3 } state=" + JSON.stringify(this._state));
    }

    public onLevelPassed(): void {
        if (!this._state) {
            return;
        }
        this._state.passCount += 1;
        this._flushPlayTime();
        console.log(TAG + " onLevelPassed passCount=" + this._state.passCount + " playSeconds=" + Math.floor(this._currentPlaySeconds()));
        this._tryTrigger();
    }

    private _isFeatureEnabled(): boolean {
        try {
            const value = cc.sys.localStorage.getItem("MB_APP_REVIEW_ENABLED");
            if (value === "0") {
                console.log(TAG + " config(localStorage) app_review_enabled=0 -> enabled=false");
                return false;
            }
            if (value === "1") {
                console.log(TAG + " config(localStorage) app_review_enabled=1 -> enabled=true");
                return true;
            }
            console.log(TAG + " config app_review_enabled not set yet(v=" + value + "), default enabled=true");
        } catch (e) {
            console.warn(TAG + " read app_review config failed", e);
        }
        return true;
    }

    private _canShow(): boolean {
        const state = this._state;
        if (!state) {
            console.log(TAG + " _canShow=false reason=no_state");
            return false;
        }
        const playSeconds = Math.floor(this._currentPlaySeconds());
        const cooldownLeftMs = state.lastShownTs > 0 ? 259200000 - (Date.now() - state.lastShownTs) : 0;
        console.log(TAG + " _canShow check -> enabled=" + this._isFeatureEnabled() + " jumped=" + state.jumped + " shownCount=" + state.shownCount + "/1 passCount=" + state.passCount + "/5 playSeconds=" + playSeconds + "/120 cooldownLeftMs=" + (cooldownLeftMs > 0 ? cooldownLeftMs : 0));
        if (!this._isFeatureEnabled()) {
            console.log(TAG + " _canShow=false reason=feature_disabled(config app_review_enabled=0)");
            return false;
        }
        if (state.jumped) {
            console.log(TAG + " _canShow=false reason=already_jumped");
            return false;
        }
        if (state.shownCount >= 1) {
            console.log(TAG + " _canShow=false reason=reach_max_show shownCount=" + state.shownCount + " max=1");
            return false;
        }
        if (state.passCount < 5) {
            console.log(TAG + " _canShow=false reason=pass_not_enough passCount=" + state.passCount + " need=5");
            return false;
        }
        if (playSeconds < 120) {
            console.log(TAG + " _canShow=false reason=playtime_not_enough playSeconds=" + playSeconds + " need=120");
            return false;
        }
        if (state.lastShownTs > 0 && Date.now() - state.lastShownTs < 259200000) {
            console.log(TAG + " _canShow=false reason=in_cooldown leftMs=" + cooldownLeftMs);
            return false;
        }
        console.log(TAG + " _canShow=true -> will show review dialog");
        return true;
    }

    private _tryTrigger(): void {
        if (!this._state || !this._canShow()) {
            return;
        }
        const state = this._state;
        const view = UIDefine.appReviewView;
        if (!view) {
            console.warn(TAG + " appReviewView config missing");
            return;
        }
        console.log(TAG + " show appReviewView");
        state.shownCount += 1;
        state.lastShownTs = Date.now();
        this._save();
        report("app_review_show", {
            pass_count: state.passCount,
            play_seconds: Math.floor(this._currentPlaySeconds()),
            shown_count: state.shownCount
        });
        const result = UIMgr.getInstance().show(view);
        if (result && typeof result.then === "function") {
            result.then(() => {
                // noop
            }).catch((err: any) => {
                console.warn(TAG + " show appReviewView failed", err);
            });
        }
    }

    public markJumped(): void {
        console.log(TAG + " markJumped -> set jumped=true, never show again, jump google play");
        if (this._state) {
            this._state.jumped = true;
            this._save();
        }
        this._callNativeReview();
    }

    private _callNativeReview(): void {
        try {
            const bridge = NativeSdkBridgeAdapter && typeof NativeSdkBridgeAdapter.getBridge === "function"
                ? NativeSdkBridgeAdapter.getBridge()
                : null;
            if (bridge && typeof bridge.showAppReview === "function") {
                bridge.showAppReview();
                console.log(TAG + " showAppReview invoked");
                return;
            }
            console.warn(TAG + " native showAppReview unavailable");
        } catch (e) {
            console.error(TAG + " _callNativeReview failed", e);
        }
    }
}