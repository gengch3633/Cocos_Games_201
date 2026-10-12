import Handler from "./Handler";
import LanguageService from "./LanguageService";
import LoadingHttpService from "./LoadingHttpService";

interface IBarrageRawItem {
    name?: string;
    money?: number;
    type?: string;
}

interface IBarrageItem {
    name: string;
    amount: number;
    type: string;
    text: string;
}

class BarrageDataService {

    private static _queue: IBarrageItem[] = [];
    private static _isRequesting: boolean = false;
    private static _retryTimer: number | null = null;
    private static _started: boolean = false;

    private static readonly _MIN_QUEUE_SIZE: number = 3;
    private static readonly _RETRY_DELAY_MS: number = 5000;

    public static ensureStarted(): void {
        if (!BarrageDataService._started) {
            BarrageDataService._started = true;
            BarrageDataService._fetchFromApi();
        }
    }

    private static _fetchFromApi(): void {
        if (BarrageDataService._isRequesting) {
            return;
        }
        BarrageDataService._isRequesting = true;

        LoadingHttpService.getBarrageList(
            Handler.create(null, (response: any): void => {
                BarrageDataService._isRequesting = false;

                if (response && response.code === 1 && response.data && response.data.money_list) {
                    const moneyList: IBarrageRawItem[] = response.data.money_list;
                    for (let i: number = 0; i < moneyList.length; i++) {
                        BarrageDataService._queue.push(BarrageDataService._convertItem(moneyList[i]));
                    }
                } else {
                    BarrageDataService._scheduleRetry();
                }
            }),
            Handler.create(null, (): void => {
                BarrageDataService._isRequesting = false;
                BarrageDataService._scheduleRetry();
            })
        );
    }

    private static _scheduleRetry(): void {
        if (BarrageDataService._retryTimer !== null) {
            return;
        }
        BarrageDataService._retryTimer = setTimeout((): void => {
            BarrageDataService._retryTimer = null;
            BarrageDataService._fetchFromApi();
        }, BarrageDataService._RETRY_DELAY_MS) as unknown as number;
    }

    private static _convertItem(raw: IBarrageRawItem): IBarrageItem {
        const name: string = raw.name || "";
        const amount: number = raw.money || 0;
        return {
            name: name,
            amount: amount,
            type: raw.type || "cash",
            text: LanguageService.t("key_barrage_success_plain", [name, LanguageService.formatCurrencyBarrage(amount)])
        };
    }

    public static takeOne(): IBarrageItem | null {
        BarrageDataService.ensureStarted();

        if (BarrageDataService._queue.length <= 0) {
            return null;
        }

        const item: IBarrageItem = BarrageDataService._queue.shift() as IBarrageItem;

        if (BarrageDataService._queue.length < BarrageDataService._MIN_QUEUE_SIZE) {
            BarrageDataService._fetchFromApi();
        }

        return item;
    }

    public static clearCache(): void {
        BarrageDataService._queue = [];
        BarrageDataService._started = false;
        BarrageDataService._isRequesting = false;

        if (BarrageDataService._retryTimer !== null) {
            clearTimeout(BarrageDataService._retryTimer);
            BarrageDataService._retryTimer = null;
        }
    }
}

export default BarrageDataService;