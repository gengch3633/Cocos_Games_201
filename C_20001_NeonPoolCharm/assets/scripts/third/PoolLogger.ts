import { PoolWrapper } from "./PoolWrapper";
import GameHelper from "./GameHelper";

interface GameEventData {
    object_action: string;
    object_name?: string;
    object_notes?: string;
}

export class PoolLogger {
    private static _instance: PoolLogger = null;

    private _onceGameEventLoggedFlagsHash: Record<string, boolean> = {};
    private _onceLifeEventLoggedFlagsHash: Record<string, boolean> = {};
    private _lifeEventTaskCount = 0;

    constructor() {
        this._loadLocalCache();
    }

    static get instance(): PoolLogger {
        if (!PoolLogger._instance) {
            PoolLogger._instance = new PoolLogger();
        }
        return PoolLogger._instance;
    }

    logPPEvent(name: string): void {
        if (GameHelper.pocketed) {
            this._doLogPPEvent(name);
        }
    }

    private _doLogGameEvent(name: string, data: GameEventData, once: boolean = false): void {
        if (once && this._isOnceEventLogged(name, data)) {
            return;
        }
        const payload: Record<string, string> = {
            object_action: data.object_action,
        };
        if (data.object_name != null) {
            payload.object_name = data.object_name;
        }
        if (data.object_notes != null) {
            payload.object_notes = data.object_notes;
        }
        console.log("log event: " + name + (payload ? " - " + JSON.stringify(payload) : ""));
        PoolWrapper.instance.logEvent(name, payload);
        if (once) {
            const key = this._getOnceEventCacheKey(name, data);
            this._onceGameEventLoggedFlagsHash[key] = true;
            this._saveLocalCache();
        }
    }

    private _doLogLiftEvent(name: string): void {
        if (this._onceLifeEventLoggedFlagsHash[name]) {
            return;
        }
        if (name === "finish_task") {
            if (++this._lifeEventTaskCount == 1) {
                console.log("log life event: submit_order");
                PoolWrapper.instance.logLifeEvent("submit_order");
            }
            name = "finish_task_" + this._lifeEventTaskCount;
        }
        console.log("log life event: " + name);
        PoolWrapper.instance.logLifeEvent(name);
        this._onceLifeEventLoggedFlagsHash[name] = true;
        this._saveLocalCache();
    }

    private _getOnceEventCacheKey(name: string, data: GameEventData): string {
        return (
            name +
            "-" +
            data.object_action +
            "-" +
            (data.object_name ?? "") +
            "-" +
            (data.object_notes ?? "")
        );
    }

    private _isOnceEventLogged(name: string, data: GameEventData): boolean {
        const key = this._getOnceEventCacheKey(name, data);
        return this._onceGameEventLoggedFlagsHash[key] === true;
    }

    private _saveLocalCache(): void {
        cc.sys.localStorage.setItem(
            "pool-event-log",
            JSON.stringify({
                loggedRecord: this._onceGameEventLoggedFlagsHash,
                loggedLifeEventRecord: this._onceLifeEventLoggedFlagsHash,
                lifeEventTaskCount: this._lifeEventTaskCount,
            })
        );
    }

    logLifeEvent(name: string): void {
        if (GameHelper.pocketed) {
            this._doLogLiftEvent(name);
        }
    }

    logGameEvent(name: string, data: GameEventData, once: boolean = false): void {
        if (GameHelper.pocketed) {
            this._doLogGameEvent(name, data, once);
        }
    }

    logEvent(name: string, data: Record<string, unknown>): void {
        if (GameHelper.pocketed) {
            PoolWrapper.instance.logEvent(name, data);
        }
    }

    private _doLogPPEvent(name: string): void {
        console.log("log pp event: " + name);
        switch (name) {
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
                break;
        }
    }

    private _loadLocalCache(): void {
        const raw = cc.sys.localStorage.getItem("pool-event-log") ?? "";
        let parsed: {
            loggedRecord?: Record<string, boolean>;
            loggedLifeEventRecord?: Record<string, boolean>;
            lifeEventTaskCount?: number;
        } = null;
        try {
            parsed = JSON.parse(raw);
        } catch (e) {}
        if (parsed != null) {
            this._onceGameEventLoggedFlagsHash = parsed.loggedRecord ?? {};
            this._onceLifeEventLoggedFlagsHash = parsed.loggedLifeEventRecord ?? {};
            this._lifeEventTaskCount = parsed.lifeEventTaskCount ?? 0;
        }
    }
}

cc.js.setClassName("PoolLogger", PoolLogger);
