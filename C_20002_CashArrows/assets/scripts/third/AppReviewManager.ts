import BusinessAnalyticsService from "./BusinessAnalyticsService";
import Common from "./Common";
import GlobalEventMgr from "./GlobalEventMgr";
import InterfaceMgr from "./InterfaceMgr";
import UIMgr from "./UIMgr";
import UIDefine from "./UIDefine";
import NativeSdkBridgeAdapter from "./NativeSdkBridgeAdapter";

const LOG_TAG = "[AppReviewManager]";

interface AppReviewState {
    passCount: number;
    playSeconds: number;
    shownCount: number;
    lastShownTs: number;
    jumped: boolean;
}

function reportData(event: string, data?: Record<string, unknown>): void {
    try {
        BusinessAnalyticsService.reportData(event, data || {});
    } catch (error) {
        console.warn(LOG_TAG + " report failed", event, error);
    }
}

export default class AppReviewManager {
    private static _instance: AppReviewManager;
    private _inited = false;
    private _resumeTs = 0;
    private _state: AppReviewState | null = null;

    static getInstance(): AppReviewManager {
        if (!AppReviewManager._instance) {
            AppReviewManager._instance = new AppReviewManager();
        }
        return AppReviewManager._instance;
    }

    private _storageKey(): string {
        const common = Common as { version?: string };
        return (common && common.version ? common.version : "1.0.0") + "_arrow_app_review";
    }

    private _load(): void {
        const state: AppReviewState = {
            passCount: 0,
            playSeconds: 0,
            shownCount: 0,
            lastShownTs: 0,
            jumped: false,
        };

        try {
            const raw = cc.sys.localStorage.getItem(this._storageKey());
            if (raw) {
                const parsed = JSON.parse(raw);
                if (parsed && typeof parsed === "object") {
                    state.passCount = Number(parsed.passCount) || 0;
                    state.playSeconds = Number(parsed.playSeconds) || 0;
                    state.shownCount = Number(parsed.shownCount) || 0;
                    state.lastShownTs = Number(parsed.lastShownTs) || 0;
                    state.jumped = !!parsed.jumped;
                }
            }
        } catch (error) {
            console.warn(LOG_TAG + " load failed", error);
        }

        this._state = state;
        console.log(LOG_TAG + " _load state=" + JSON.stringify(state) + " key=" + this._storageKey());
    }

    private _save(): void {
        if (!this._state) {
            return;
        }
        try {
            cc.sys.localStorage.setItem(this._storageKey(), JSON.stringify(this._state));
        } catch (error) {
            console.warn(LOG_TAG + " save failed", error);
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
        let delta = 0;
        const now = Date.now();
        if (this._resumeTs > 0 && now > this._resumeTs) {
            delta = (now - this._resumeTs) / 1000;
        }
        return this._state.playSeconds + delta;
    }

    init(): void {
        if (this._inited) {
            return;
        }
        this._inited = true;
        this._load();
        this._resumeTs = Date.now();

        cc.game.on(cc.game.EVENT_HIDE, () => {
            this._flushPlayTime();
            console.log(LOG_TAG + " EVENT_HIDE flush playSeconds=" + Math.floor(this._currentPlaySeconds()));
        });

        cc.game.on(cc.game.EVENT_SHOW, () => {
            this._resumeTs = Date.now();
            console.log(LOG_TAG + " EVENT_SHOW resume timing");
        });

        GlobalEventMgr.getInstance().on(InterfaceMgr.gameEvent.gameNext, this.onLevelPassed, this);
        console.log(
            LOG_TAG +
                " inited thresholds{ MIN_PASS=5, MIN_SECONDS=120, MAX_SHOW=1, COOLDOWN_DAYS=3 } state=" +
                JSON.stringify(this._state),
        );
    }

    onLevelPassed(): void {
        if (!this._state) {
            return;
        }
        this._state.passCount += 1;
        this._flushPlayTime();
        console.log(
            LOG_TAG +
                " onLevelPassed passCount=" +
                this._state.passCount +
                " playSeconds=" +
                Math.floor(this._currentPlaySeconds()),
        );
        this._tryTrigger();
    }

    private _isFeatureEnabled(): boolean {
        try {
            const value = cc.sys.localStorage.getItem("MB_APP_REVIEW_ENABLED");
            if (value === "0") {
                console.log(LOG_TAG + " config(localStorage) app_review_enabled=0 -> enabled=false");
                return false;
            }
            if (value === "1") {
                console.log(LOG_TAG + " config(localStorage) app_review_enabled=1 -> enabled=true");
                return true;
            }
            console.log(LOG_TAG + " config app_review_enabled not set yet(v=" + value + "), default enabled=true");
        } catch (error) {
            console.warn(LOG_TAG + " read app_review config failed", error);
        }
        return true;
    }

    private _canShow(): boolean {
        const state = this._state;
        if (!state) {
            console.log(LOG_TAG + " _canShow=false reason=no_state");
            return false;
        }

        const playSeconds = Math.floor(this._currentPlaySeconds());
        const cooldownLeftMs = state.lastShownTs > 0 ? 259200000 - (Date.now() - state.lastShownTs) : 0;
        console.log(
            LOG_TAG +
                " _canShow check -> enabled=" +
                this._isFeatureEnabled() +
                " jumped=" +
                state.jumped +
                " shownCount=" +
                state.shownCount +
                "/1 passCount=" +
                state.passCount +
                "/5 playSeconds=" +
                playSeconds +
                "/120 cooldownLeftMs=" +
                (cooldownLeftMs > 0 ? cooldownLeftMs : 0),
        );

        if (!this._isFeatureEnabled()) {
            console.log(LOG_TAG + " _canShow=false reason=feature_disabled(config app_review_enabled=0)");
            return false;
        }
        if (state.jumped) {
            console.log(LOG_TAG + " _canShow=false reason=already_jumped");
            return false;
        }
        if (state.shownCount >= 1) {
            console.log(LOG_TAG + " _canShow=false reason=reach_max_show shownCount=" + state.shownCount + " max=1");
            return false;
        }
        if (state.passCount < 5) {
            console.log(LOG_TAG + " _canShow=false reason=pass_not_enough passCount=" + state.passCount + " need=5");
            return false;
        }
        if (playSeconds < 120) {
            console.log(LOG_TAG + " _canShow=false reason=playtime_not_enough playSeconds=" + playSeconds + " need=120");
            return false;
        }
        if (state.lastShownTs > 0 && Date.now() - state.lastShownTs < 259200000) {
            console.log(LOG_TAG + " _canShow=false reason=in_cooldown leftMs=" + cooldownLeftMs);
            return false;
        }

        console.log(LOG_TAG + " _canShow=true -> will show review dialog");
        return true;
    }

    private _tryTrigger(): void {
        if (!this._canShow() || !this._state) {
            return;
        }

        const viewConfig = UIDefine.appReviewView;
        if (!viewConfig) {
            console.warn(LOG_TAG + " appReviewView config missing");
            return;
        }

        console.log(LOG_TAG + " show appReviewView");
        this._state.shownCount += 1;
        this._state.lastShownTs = Date.now();
        this._save();
        reportData("app_review_show", {
            pass_count: this._state.passCount,
            play_seconds: Math.floor(this._currentPlaySeconds()),
            shown_count: this._state.shownCount,
        });

        const result = UIMgr.getInstance().show(viewConfig) as Promise<void> | void;
        if (result && typeof (result as Promise<void>).then === "function") {
            (result as Promise<void>).then(() => {}).catch((error) => {
                console.warn(LOG_TAG + " show appReviewView failed", error);
            });
        }
    }

    markJumped(): void {
        console.log(LOG_TAG + " markJumped -> set jumped=true, never show again, jump google play");
        if (this._state) {
            this._state.jumped = true;
            this._save();
        }
        this._callNativeReview();
    }

    private _callNativeReview(): void {
        try {
            const bridge = NativeSdkBridgeAdapter.getBridge() as { showAppReview?(): void } | null;
            if (bridge && typeof bridge.showAppReview === "function") {
                bridge.showAppReview();
                console.log(LOG_TAG + " showAppReview invoked");
                return;
            }
            console.warn(LOG_TAG + " native showAppReview unavailable");
        } catch (error) {
            console.error(LOG_TAG + " _callNativeReview failed", error);
        }
    }
}
