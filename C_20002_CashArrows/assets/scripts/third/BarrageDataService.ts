import * as LanguageService from "./LanguageService";
import LoadingHttpService from "./LoadingHttpService";
import Handler from "./Handler";

interface BarrageItem {
    name: string;
    amount: number;
    type: string;
    text: string;
}

interface BarrageApiItem {
    name?: string;
    money?: number;
    type?: string;
}

const BarrageDataService = {
    _queue: [] as BarrageItem[],
    _isRequesting: false,
    _retryTimer: null as ReturnType<typeof setTimeout> | null,
    _started: false,
    _MIN_QUEUE_SIZE: 3,
    _RETRY_DELAY_MS: 5000,

    ensureStarted(): void {
        if (!this._started) {
            this._started = true;
            this._fetchFromApi();
        }
    },

    _fetchFromApi(): void {
        if (this._isRequesting) {
            return;
        }
        this._isRequesting = true;
        LoadingHttpService.getBarrageList(
            Handler.create(null, (response: { code?: number; data?: { money_list?: BarrageApiItem[] } }) => {
                this._isRequesting = false;
                if (response && response.code === 1 && response.data && response.data.money_list) {
                    const list = response.data.money_list;
                    for (let i = 0; i < list.length; i++) {
                        this._queue.push(this._convertItem(list[i]));
                    }
                } else {
                    this._scheduleRetry();
                }
            }),
            Handler.create(null, () => {
                this._isRequesting = false;
                this._scheduleRetry();
            }),
        );
    },

    _scheduleRetry(): void {
        if (!this._retryTimer) {
            this._retryTimer = setTimeout(() => {
                this._retryTimer = null;
                this._fetchFromApi();
            }, this._RETRY_DELAY_MS);
        }
    },

    _convertItem(item: BarrageApiItem): BarrageItem {
        const name = item.name || "";
        const amount = item.money || 0;
        return {
            name,
            amount,
            type: item.type || "cash",
            text: LanguageService.t("key_barrage_success_plain", [name, LanguageService.formatCurrencyBarrage(amount)]),
        };
    },

    takeOne(): BarrageItem | null {
        this.ensureStarted();
        if (this._queue.length <= 0) {
            return null;
        }
        const item = this._queue.shift()!;
        if (this._queue.length < this._MIN_QUEUE_SIZE) {
            this._fetchFromApi();
        }
        return item;
    },

    clearCache(): void {
        this._queue = [];
        this._started = false;
        this._isRequesting = false;
        if (this._retryTimer) {
            clearTimeout(this._retryTimer);
            this._retryTimer = null;
        }
    },
};

export default BarrageDataService;
