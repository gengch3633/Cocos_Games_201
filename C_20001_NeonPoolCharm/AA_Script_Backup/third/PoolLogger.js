let e = require;
let t = module;
let o = exports;
"use strict";
cc._RF.push(t, "54c83rk61NA0b3ighxqzYAO", "PoolLogger");
Object.defineProperty(o, "__esModule", {
  value: ! 0
}
);
o.PoolLogger = void 0;
var n = e("PoolWrapper.js"),
i = e(GameHelper "
  }].js),
      a = function () {
        function e() {
          this._onceGameEventLoggedFlagsHash = {};
          this._onceLifeEventLoggedFlagsHash = {};
          this._lifeEventTaskCount = 0;
          this._loadLocalCache();
        }
        Object.defineProperty(e, " instance ", {
          get: function () {
            this._instance || (this._instance = new e());
            return this._instance;
          },
          enumerable: !1,
          configurable: !0
        });
        e.prototype.logPPEvent = function (e) {
          i.default.pocketed && this._doLogPPEvent(e);
        };
        e.prototype._doLogGameEvent = function (e, t, o) {
          void 0 === o && (o = !1);
          if (!o || !this._isOnceEventLogged(e, t)) {
            var i = {
              object_action: t.object_action
            };
            null !== t.object_name && void 0 !== t.object_name && (i.object_name = t.object_name);
            null !== t.object_notes && void 0 !== t.object_notes && (i.object_notes = t.object_notes);
            console.log(" log event: " + e + (i ? "- " + JSON.stringify(i) : " "));
            n.PoolWrapper.instance.logEvent(e, i);
            if (o) {
              var a = this._getOnceEventCacheKey(e, t);
              this._onceGameEventLoggedFlagsHash[a] = !0;
              this._saveLocalCache();
            }
          }
        };
        e.prototype._doLogLiftEvent = function (e) {
          if (!this._onceLifeEventLoggedFlagsHash[e]) {
            if (" finish_task " === e) {
              if (1 == ++this._lifeEventTaskCount) {
                console.log(" log life event: submit_order ");
                n.PoolWrapper.instance.logLifeEvent(" submit_order ");
              }
              e = " finish_task_ " + this._lifeEventTaskCount;
            }
            console.log(" log life event: " + e);
            n.PoolWrapper.instance.logLifeEvent(e);
            this._onceLifeEventLoggedFlagsHash[e] = !0;
            this._saveLocalCache();
          }
        };
        e.prototype._getOnceEventCacheKey = function (e, t) {
          var o, n;
          return e + "- " + t.object_action + "- " + (null !== (o = t.object_name) && void 0 !== o ? o : " ") + "- " + (null !== (n = t.object_notes) && void 0 !== n ? n : " ");
        };
        e.prototype._isOnceEventLogged = function (e, t) {
          var o = this._getOnceEventCacheKey(e, t);
          return !0 === this._onceGameEventLoggedFlagsHash[o];
        };
        e.prototype._saveLocalCache = function () {
          cc.sys.localStorage.setItem(" pool- event- log ", JSON.stringify({
            loggedRecord: this._onceGameEventLoggedFlagsHash,
            loggedLifeEventRecord: this._onceLifeEventLoggedFlagsHash,
            lifeEventTaskCount: this._lifeEventTaskCount
          }));
        };
        e.prototype.logLifeEvent = function (e) {
          i.default.pocketed && this._doLogLiftEvent(e);
        };
        e.prototype.logGameEvent = function (e, t, o) {
          void 0 === o && (o = !1);
          i.default.pocketed && this._doLogGameEvent(e, t, o);
        };
        e.prototype.logEvent = function (e, t) {
          i.default.pocketed && n.PoolWrapper.instance.logEvent(e, t);
        };
        e.prototype._doLogPPEvent = function (e) {
          console.log(" log pp event: " + e);
          switch (e) {
            case " gameLaunch ":
              n.PoolWrapper.instance.onAppLauch();
              break;
            case " gameShow ":
              n.PoolWrapper.instance.onAppShow();
              break;
            case " slotShow ":
              n.PoolWrapper.instance.onSlotShow();
              break;
            case " popupShow ":
              n.PoolWrapper.instance.onPopupShow();
              break;
            case " claim ":
              n.PoolWrapper.instance.onPopupClaim();
              break;
            case " collected ":
              n.PoolWrapper.instance.onPopupCollected();
              break;
            case " freeShow ":
              n.PoolWrapper.instance.onFreePopupShow();
              break;
            case " freeClaim ":
              n.PoolWrapper.instance.onFreePopupClaim();
              break;
            case " freeCollected ":
              n.PoolWrapper.instance.onFreePopupCollected();
          }
        };
        e.prototype._loadLocalCache = function () {
          var e,
            t,
            o,
            n,
            i = null !== (e = cc.sys.localStorage.getItem(" pool- event- log ")) && void 0 !== e ? e : " ",
            a = null;
          try {
            a = JSON.parse(i);
          } catch (e) {}
          if (null != a) {
            this._onceGameEventLoggedFlagsHash = null !== (t = a.loggedRecord) && void 0 !== t ? t : {};
            this._onceLifeEventLoggedFlagsHash = null !== (o = a.loggedLifeEventRecord) && void 0 !== o ? o : {};
            this._lifeEventTaskCount = null !== (n = a.lifeEventTaskCount) && void 0 !== n ? n : 0;
          }
        };
        e._instance = null;
        return e;
      }();
    o.PoolLogger = a;
    cc.js.setClassName(" PoolLogger ", a);
    cc._RF.pop();
