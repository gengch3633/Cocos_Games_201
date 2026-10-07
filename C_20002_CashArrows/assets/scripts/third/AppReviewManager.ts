import Common from "./Common";
import GlobalEventMgr from "./GlobalEventMgr";
import { gameEvent } from "./InterfaceMgr";
import UIMgr from "./UIMgr";
import UIDefine from "./UIDefine";

const LOG_TAG = "[AppReviewManager]";

function loadModule<T = any>(path: string): T | null {
    try {
        const mod = require(path);
        return mod && mod.default ? mod.default : mod;
    } catch (e) {
        return null;
    }
}

function reportEvent(event: string, data?: any): void {
    try {
        const analytics = loadModule("../migration-bundle/business-common/report/BusinessAnalyticsService");
        analytics?.reportData?.(event, data || {});
    } catch (e) {
        console.warn(LOG_TAG + " report failed", event, e);
    }
}

interface ReviewState {
    passCount: number;
    playSeconds: number;
    shownCount: number;
    lastShownTs: number;
    jumped: boolean;
}

export default class AppReviewManager {
    private static _instance: AppReviewManager | null = null;

    private _inited = false;
    private _resumeTs = 0;
    private _state: ReviewState | null = null;

    static getInstance(): AppReviewManager {
        if (!this._instance) {
            this._instance = new AppReviewManager();
        }
        return this._instance;
    }

    private _storageKey(): string {
        const version = Common?.version ? Common.version : "1.0.0";
        return version + "_arrow_app_review";
    }

    private _load(): void {
        const state: ReviewState = {
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
        } catch (e) {
            console.warn(LOG_TAG + " load failed", e);
        }
        this._state = state;
        console.log(LOG_TAG + " _load state=" + JSON.stringify(state) + " key=" + this._storageKey());
    }

    private _save(): void {
        if (this._state) {
            try {
                cc.sys.localStorage.setItem(this._storageKey(), JSON.stringify(this._state));
            } catch (e) {
                console.warn(LOG_TAG + " save failed", e);
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
        let delta = 0;
        const now = Date.now();
        if (this._resumeTs > 0 && now > this._resumeTs) {
            delta = (now - this._resumeTs) / 1e3;
        }
        return this._state.playSeconds + delta;
    }

    init(): void {
        if (!this._inited) {
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
            GlobalEventMgr.getInstance().on(gameEvent.gameNext, this.onLevelPassed, this);
            console.log(LOG_TAG + " inited thresholds{ MIN_PASS=5, MIN_SECONDS=120, MAX_SHOW=1, COOLDOWN_DAYS=3 } state=" + JSON.stringify(this._state));
        }
    }

    onLevelPassed(): void {
        if (this._state) {
            this._state.passCount += 1;
            this._flushPlayTime();
            console.log(LOG_TAG + " onLevelPassed passCount=" + this._state.passCount + " playSeconds=" + Math.floor(this._currentPlaySeconds()));
            this._tryTrigger();
        }
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
        } catch (e) {
            console.warn(LOG_TAG + " read app_review config failed", e);
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
        const cooldownLeft = state.lastShownTs > 0 ? 259200000 - (Date.now() - state.lastShownTs) : 0;
        console.log(LOG_TAG + " _canShow check -> enabled=" + this._isFeatureEnabled() +
            " jumped=" + state.jumped + " shownCount=" + state.shownCount + "/1 passCount=" + state.passCount +
            "/5 playSeconds=" + playSeconds + "/120 cooldownLeftMs=" + (cooldownLeft > 0 ? cooldownLeft : 0));
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
            console.log(LOG_TAG + " _canShow=false reason=in_cooldown leftMs=" + cooldownLeft);
            return false;
        }
        console.log(LOG_TAG + " _canShow=true -> will show review dialog");
        return true;
    }

    private _tryTrigger(): void {
        if (this._canShow()) {
            const viewConfig = UIDefine.appReviewView;
            if (viewConfig) {
                console.log(LOG_TAG + " show appReviewView");
                this._state!.shownCount += 1;
                this._state!.lastShownTs = Date.now();
                this._save();
                reportEvent("app_review_show", {
                    pass_count: this._state!.passCount,
                    play_seconds: Math.floor(this._currentPlaySeconds()),
                    shown_count: this._state!.shownCount,
                });
                const result = UIMgr.getInstance().show(viewConfig);
                if (result && typeof result.then === "function") {
                    result.then(() => {
                    }).catch((error: any) => {
                        console.warn(LOG_TAG + " show appReviewView failed", error);
                    });
                }
            } else {
                console.warn(LOG_TAG + " appReviewView config missing");
            }
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
            const adapter = loadModule("../migration-bundle/src/framework/Platform/NativeSdkBridgeAdapter");
            const bridge = adapter && typeof adapter.getBridge === "function" ? adapter.getBridge() : null;
            if (bridge && typeof bridge.showAppReview === "function") {
                bridge.showAppReview();
                console.log(LOG_TAG + " showAppReview invoked");
                return;
            }
            console.warn(LOG_TAG + " native showAppReview unavailable");
        } catch (e) {
            console.error(LOG_TAG + " _callNativeReview failed", e);
        }
    }
}
