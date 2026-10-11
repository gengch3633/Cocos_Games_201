import Handler from "./Handler";
import LanguageService from "./LanguageService";
import LoadingHttpService from "./LoadingHttpService";

interface BarrageItem {
    name: string;
    amount: number;
    type: string;
    text: string;
}

const BarrageDataService = {
    _queue: [] as BarrageItem[],
    _isRequesting: false,
    _retryTimer: null as any,
    _started: false,
    _MIN_QUEUE_SIZE: 3,
    _RETRY_DELAY_MS: 5000,

    ensureStarted: function (): void {
        if (!this._started) {
            this._started = true;
            this._fetchFromApi();
        }
    },

    _fetchFromApi: function (): void {
        if (!this._isRequesting) {
            this._isRequesting = true;
            const self = this;
            LoadingHttpService.getBarrageList(Handler.create(null, function (res: any): void {
                self._isRequesting = false;
                if (res && 1 === res.code && res.data && res.data.money_list) {
                    const list = res.data.money_list;
                    for (let i = 0; i < list.length; i++) {
                        self._queue.push(self._convertItem(list[i]));
                    }
                } else {
                    self._scheduleRetry();
                }
            }), Handler.create(null, function (): void {
                self._isRequesting = false;
                self._scheduleRetry();
            }));
        }
    },

    _scheduleRetry: function (): void {
        if (!this._retryTimer) {
            const self = this;
            this._retryTimer = setTimeout(function (): void {
                self._retryTimer = null;
                self._fetchFromApi();
            }, this._RETRY_DELAY_MS);
        }
    },

    _convertItem: function (item: any): BarrageItem {
        const name = item.name || "";
        const amount = item.money || 0;
        return {
            name: name,
            amount: amount,
            type: item.type || "cash",
            text: LanguageService.t("key_barrage_success_plain", [name, LanguageService.formatCurrencyBarrage(amount)])
        };
    },

    takeOne: function (): BarrageItem {
        this.ensureStarted();
        if (this._queue.length <= 0) {
            return null;
        }
        const item = this._queue.shift();
        if (this._queue.length < this._MIN_QUEUE_SIZE) {
            this._fetchFromApi();
        }
        return item;
    },

    clearCache: function (): void {
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