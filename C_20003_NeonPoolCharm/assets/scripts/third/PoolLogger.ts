import GameHelper from "./GameHelper";
import { PoolWrapper } from "./PoolWrapper";

export class PoolLogger {
    _onceGameEventLoggedFlagsHash;
    _onceLifeEventLoggedFlagsHash;
    _lifeEventTaskCount;

    static _instance = null;

    constructor() {
        this._onceGameEventLoggedFlagsHash = {};
        this._onceLifeEventLoggedFlagsHash = {};
        this._lifeEventTaskCount = 0;
        this._loadLocalCache();
    }

    static get instance() {
        this._instance || (this._instance = new PoolLogger());
        return this._instance;
    }

    logPPEvent(e) {
        GameHelper.pocketed && this._doLogPPEvent(e);
    }

    _doLogGameEvent(e, t, o) {
        undefined === o && (o = false);
        if (!o || !this._isOnceEventLogged(e, t)) {
            var i = {
                object_action: t.object_action
            };
            null !== t.object_name && undefined !== t.object_name && (i.object_name = t.object_name);
            null !== t.object_notes && undefined !== t.object_notes && (i.object_notes = t.object_notes);
            console.log("log event: " + e + (i ? " - " + JSON.stringify(i) : ""));
            PoolWrapper.instance.logEvent(e, i);
            if (o) {
                var a = this._getOnceEventCacheKey(e, t);
                this._onceGameEventLoggedFlagsHash[a] = true;
                this._saveLocalCache();
            }
        }
    }

    _doLogLiftEvent(e) {
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

    _getOnceEventCacheKey(e, t) {
        var o = t.object_name;
        var n = t.object_notes;
        return e + "-" + t.object_action + "-" + (null !== o && undefined !== o ? o : "") + "-" + (null !== n && undefined !== n ? n : "");
    }

    _isOnceEventLogged(e, t) {
        var o = this._getOnceEventCacheKey(e, t);
        return true === this._onceGameEventLoggedFlagsHash[o];
    }

    _saveLocalCache() {
        cc.sys.localStorage.setItem("pool-event-log", JSON.stringify({
            loggedRecord: this._onceGameEventLoggedFlagsHash,
            loggedLifeEventRecord: this._onceLifeEventLoggedFlagsHash,
            lifeEventTaskCount: this._lifeEventTaskCount
        }));
    }

    logLifeEvent(e) {
        GameHelper.pocketed && this._doLogLiftEvent(e);
    }

    logGameEvent(e, t, o) {
        undefined === o && (o = false);
        GameHelper.pocketed && this._doLogGameEvent(e, t, o);
    }

    logEvent(e, t) {
        GameHelper.pocketed && PoolWrapper.instance.logEvent(e, t);
    }

    _doLogPPEvent(e) {
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

    _loadLocalCache() {
        var e = cc.sys.localStorage.getItem("pool-event-log");
        var i = null !== e && undefined !== e ? e : "";
        var a = null;
        try {
            a = JSON.parse(i);
        } catch (e) {}
        if (null != a) {
            var t = a.loggedRecord;
            var o = a.loggedLifeEventRecord;
            var n = a.lifeEventTaskCount;
            this._onceGameEventLoggedFlagsHash = null !== t && undefined !== t ? t : {};
            this._onceLifeEventLoggedFlagsHash = null !== o && undefined !== o ? o : {};
            this._lifeEventTaskCount = null !== n && undefined !== n ? n : 0;
        }
    }
}

cc.js.setClassName("PoolLogger", PoolLogger);
