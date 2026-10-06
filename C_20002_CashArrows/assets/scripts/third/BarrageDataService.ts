import LanguageService from "./LanguageService";
import LoadingHttpService from "./LoadingHttpService";
import Handler from "./Handler";

const BarrageDataService = {
    _queue: [] as any[],
    _isRequesting: false,
    _retryTimer: null as any,
    _started: false,
    _MIN_QUEUE_SIZE: 3,
    _RETRY_DELAY_MS: 5e3,
    ensureStarted: function () {
        if (!this._started) {
            this._started = true;
            this._fetchFromApi();
        }
    },
    _fetchFromApi: function () {
        if (!this._isRequesting) {
            this._isRequesting = true;
            var e = this;
            LoadingHttpService.getBarrageList(Handler.create(null, function (t: any) {
                e._isRequesting = false;
                if (t && 1 === t.code && t.data && t.data.money_list) for (var i = t.data.money_list, n = 0; n < i.length; n++) e._queue.push(e._convertItem(i[n])); else e._scheduleRetry();
            }), Handler.create(null, function () {
                e._isRequesting = false;
                e._scheduleRetry();
            }));
        }
    },
    _scheduleRetry: function () {
        if (!this._retryTimer) {
            var e = this;
            this._retryTimer = setTimeout(function () {
                e._retryTimer = null;
                e._fetchFromApi();
            }, this._RETRY_DELAY_MS);
        }
    },
    _convertItem: function (e: any) {
        var t = e.name || " ", n = e.money || 0;
        return {
            name: t,
            amount: n,
            type: e.type || " cash ",
            text: LanguageService.t(" key_barrage_success_plain ", [ t, LanguageService.formatCurrencyBarrage(n) ])
        };
    },
    takeOne: function () {
        this.ensureStarted();
        if (this._queue.length <= 0) return null;
        var e = this._queue.shift();
        this._queue.length < this._MIN_QUEUE_SIZE && this._fetchFromApi();
        return e;
    },
    clearCache: function () {
        this._queue = [];
        this._started = false;
        this._isRequesting = false;
        if (this._retryTimer) {
            clearTimeout(this._retryTimer);
            this._retryTimer = null;
        }
    }
};
export default BarrageDataService;
