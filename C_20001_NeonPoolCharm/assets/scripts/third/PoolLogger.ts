import { PoolWrapper } from "./PoolWrapper";
import GameHelper from "./GameHelper";

export class PoolLogger {
    _onceGameEventLoggedFlagsHash: Record<string, boolean> = {};
    _onceLifeEventLoggedFlagsHash: Record<string, boolean> = {};
    _lifeEventTaskCount = 0;

    constructor() {
        this._loadLocalCache();
    }

    static _instance: PoolLogger = null;

    static get instance(): PoolLogger {
        this._instance || (this._instance = new PoolLogger());
        return this._instance;
    }

    logPPEvent(e: string): void {
        GameHelper.pocketed && this._doLogPPEvent(e);
    }

    _doLogGameEvent(e: string, t: { object_action: string; object_name?: string; object_notes?: string }, o = false): void {
        if (!o || !this._isOnceEventLogged(e, t)) {
            const i: { object_action: string; object_name?: string; object_notes?: string } = {
                object_action: t.object_action,
            };
            null !== t.object_name && void 0 !== t.object_name && (i.object_name = t.object_name);
            null !== t.object_notes && void 0 !== t.object_notes && (i.object_notes = t.object_notes);
            console.log("log event: " + e + (i ? " - " + JSON.stringify(i) : ""));
            PoolWrapper.instance.logEvent(e, i);
            if (o) {
                const a = this._getOnceEventCacheKey(e, t);
                this._onceGameEventLoggedFlagsHash[a] = true;
                this._saveLocalCache();
            }
        }
    }

    _doLogLiftEvent(e: string): void {
        if (!this._onceLifeEventLoggedFlagsHash[e]) {
            if ("finish_task" === e) {
                if (1 == ++this._lifeEventTaskCount) {
                    console.log("log life event: submit_order");
                    PoolWrapper.instance.logLifeEvent("submit_order");
                }
                e = "finish_task_" + this._lifeEventTaskCount;
            }
            console.log("log life event: " + e);
            PoolWrapper.instance.logLifeEvent(e);
            this._onceLifeEventLoggedFlagsHash[e] = true;
            this._saveLocalCache();
        }
    }

    _getOnceEventCacheKey(e: string, t: { object_action: string; object_name?: string; object_notes?: string }): string {
        return (
            e +
            "-" +
            t.object_action +
            "-" +
            (null !== t.object_name && void 0 !== t.object_name ? t.object_name : "") +
            "-" +
            (null !== t.object_notes && void 0 !== t.object_notes ? t.object_notes : "")
        );
    }

    _isOnceEventLogged(e: string, t: { object_action: string; object_name?: string; object_notes?: string }): boolean {
        const o = this._getOnceEventCacheKey(e, t);
        return true === this._onceGameEventLoggedFlagsHash[o];
    }

    _saveLocalCache(): void {
        cc.sys.localStorage.setItem(
            "pool-event-log",
            JSON.stringify({
                loggedRecord: this._onceGameEventLoggedFlagsHash,
                loggedLifeEventRecord: this._onceLifeEventLoggedFlagsHash,
                lifeEventTaskCount: this._lifeEventTaskCount,
            })
        );
    }

    logLifeEvent(e: string): void {
        GameHelper.pocketed && this._doLogLiftEvent(e);
    }

    logGameEvent(
        e: string,
        t: { object_action: string; object_name?: string; object_notes?: string },
        o = false
    ): void {
        GameHelper.pocketed && this._doLogGameEvent(e, t, o);
    }

    logEvent(e: string, t: any): void {
        GameHelper.pocketed && PoolWrapper.instance.logEvent(e, t);
    }

    _doLogPPEvent(e: string): void {
        console.log("log pp event: " + e);
        switch (e) {
            case "gameLaunch":
                PoolWrapper.instance.onAppLauch();
                break;
            case "gameShow":
                PoolWrapper.instance.onAppShow();
                break;
            case "slotShow":
                PoolWrapper.instance.onSlotShow();
                break;
            case "popupShow":
                PoolWrapper.instance.onPopupShow();
                break;
            case "claim":
                PoolWrapper.instance.onPopupClaim();
                break;
            case "collected":
                PoolWrapper.instance.onPopupCollected();
                break;
            case "freeShow":
                PoolWrapper.instance.onFreePopupShow();
                break;
            case "freeClaim":
                PoolWrapper.instance.onFreePopupClaim();
                break;
            case "freeCollected":
                PoolWrapper.instance.onFreePopupCollected();
        }
    }

    _loadLocalCache(): void {
        const i = cc.sys.localStorage.getItem("pool-event-log") ?? "";
        let a: any = null;
        try {
            a = JSON.parse(i);
        } catch (e) {
        }
        if (null != a) {
            this._onceGameEventLoggedFlagsHash = a.loggedRecord ?? {};
            this._onceLifeEventLoggedFlagsHash = a.loggedLifeEventRecord ?? {};
            this._lifeEventTaskCount = a.lifeEventTaskCount ?? 0;
        }
    }
}

cc.js.setClassName("PoolLogger", PoolLogger);
