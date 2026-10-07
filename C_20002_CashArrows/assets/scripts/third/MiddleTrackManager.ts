import ClientDataStore from "./ClientDataStore";
import MiddleHelper from "./MiddleHelper";
import MiddleNetwork from "./MiddleNetwork";
import { MIDDLE_PROJECT_ADAPTER_CONFIG } from "./MiddleProjectAdapterConfig";

const STORAGE_KEYS = MIDDLE_PROJECT_ADAPTER_CONFIG.storageKeys;

export default class MiddleTrackManager {
    static instance: MiddleTrackManager | null = null;

    applogQueue: any[] = [];
    adsdkQueue: any[] = [];
    coreDataQueue: any[] = [];
    applogUploading: any[] = [];
    adsdkUploading: any[] = [];
    coreDataUploading: any[] = [];
    isUploadingApplog = false;
    isUploadingAdSdk = false;
    isUploadingCoreData = false;

    constructor() {
        this.applogQueue = this.readArray(STORAGE_KEYS.applogPayload);
        this.applogUploading = this.readArray(STORAGE_KEYS.applogLoading);
        this.adsdkQueue = this.readArray(STORAGE_KEYS.adsdkPayload);
        this.adsdkUploading = this.readArray(STORAGE_KEYS.adsdkLoading);
        this.coreDataQueue = this.readArray(STORAGE_KEYS.coredataPayload);
        this.coreDataUploading = this.readArray(STORAGE_KEYS.coredataLoading);
    }

    static getInstance(): MiddleTrackManager {
        if (!MiddleTrackManager.instance) {
            MiddleTrackManager.instance = new MiddleTrackManager();
        }
        return MiddleTrackManager.instance;
    }

    trackAll(): void {
        if (ClientDataStore.isInit) {
            this.flushApplog(1);
            this.flushAdsdk(1);
            this.flushCoredata(1);
        }
    }

    reportData(event: string, data?: any, redirect: boolean = false): void {
        const payload = { ...(data || {}) };
        let redirectType = payload.redirect_type;
        if (redirectType != null && redirectType !== "") {
            redirectType = Number(redirectType);
        }
        if (redirect) {
            redirectType = 1;
            payload.redirect_type = 1;
        }
        this.track(event, payload, redirectType);
    }

    track(event: string, data?: any, redirectType?: number): void {
        const payload = { ...(data || {}) };
        const now = Date.now();
        payload.event_name = event;
        payload.ts = now;
        payload.timestamp = now;
        payload.system_time = now;
        payload.event_id = this.uuid();
        payload.report_id = this.uuid();
        if (redirectType !== 0 && redirectType !== 2) {
            if (redirectType !== 1) {
                this.enqueue("applog", payload);
                this.flushApplog();
            } else {
                this.enqueue("coredata", payload);
                this.flushCoredata();
            }
        } else {
            this.enqueue("adsdk", payload);
            this.flushAdsdk();
        }
    }

    stringifySafe(value: any): string {
        try {
            return JSON.stringify(value);
        } catch (e) {
            return String(value);
        }
    }

    eventNamePreview(events: any[]): string[] {
        return Array.isArray(events)
            ? events.slice(0, 5).map((item) => String(item?.event_name || "unknown"))
            : [];
    }

    logTrackRequest(type: string, stage: string, payload: any[], extra?: any): void {
        const detail = {
            type,
            stage,
            size: Array.isArray(payload) ? payload.length : 0,
            queueSize:
                type === "applog"
                    ? this.applogQueue.length
                    : type === "adsdk"
                    ? this.adsdkQueue.length
                    : this.coreDataQueue.length,
            eventPreview: this.eventNamePreview(payload),
            extra: extra === undefined ? "" : this.stringifySafe(extra),
        };
        const payloadText = stage === "REQ" ? this.stringifySafe(payload) : "";
        const message =
            "[MiddleTrackManager] track request type=" +
            type +
            " stage=" +
            stage +
            " size=" +
            detail.size +
            " queueSize=" +
            detail.queueSize +
            " detail=" +
            this.stringifySafe(detail) +
            (payloadText ? " payload=" + payloadText : "");
        if (stage !== "FAIL") {
            console.log(message);
        } else {
            console.warn(message);
        }
    }

    enqueue(type: string, item: any): void {
        item.target_p = type;
        if (type === "applog") {
            this.applogQueue.push(item);
            this.writeArray(STORAGE_KEYS.applogPayload, this.applogQueue);
        } else if (type === "adsdk") {
            this.adsdkQueue.push(item);
            this.writeArray(STORAGE_KEYS.adsdkPayload, this.adsdkQueue);
        } else {
            this.coreDataQueue.push(item);
            this.writeArray(STORAGE_KEYS.coredataPayload, this.coreDataQueue);
        }
    }

    flushApplog(batchSize: number = 4): void {
        void this.flushApplogAsync(batchSize);
    }

    async flushApplogAsync(batchSize: number = 4): Promise<void> {
        if (!ClientDataStore.isInit || !MiddleHelper.isFinishRegional || this.isUploadingApplog) {
            return;
        }
        if (this.applogUploading.length === 0) {
            if (this.applogQueue.length < batchSize) {
                return;
            }
            this.applogUploading = this.applogQueue.splice(0, this.applogQueue.length);
            this.writeArray(STORAGE_KEYS.applogPayload, this.applogQueue);
            this.writeArray(STORAGE_KEYS.applogLoading, this.applogUploading);
        }
        this.isUploadingApplog = true;
        const payload = { payload: this.applogUploading };
        this.logTrackRequest("applog", "REQ", this.applogUploading);
        try {
            const response = await new Promise<any>((resolve, reject) => {
                MiddleNetwork.trackAppLog(payload, resolve, reject);
            });
            this.logTrackRequest("applog", "SUCCESS", this.applogUploading, response);
            this.applogUploading = [];
            this.writeArray(STORAGE_KEYS.applogLoading, this.applogUploading);
            this.isUploadingApplog = false;
            await this.flushApplogAsync(batchSize);
        } catch (err) {
            this.logTrackRequest("applog", "FAIL", this.applogUploading, err);
            this.applogQueue.push(...this.applogUploading);
            this.applogUploading = [];
            this.writeArray(STORAGE_KEYS.applogPayload, this.applogQueue);
            this.writeArray(STORAGE_KEYS.applogLoading, this.applogUploading);
            this.isUploadingApplog = false;
        }
    }

    flushAdsdk(batchSize: number = 1): void {
        void this.flushAdsdkAsync(batchSize);
    }

    async flushAdsdkAsync(batchSize: number = 1): Promise<void> {
        if (!ClientDataStore.isInit || !MiddleHelper.isFinishRegional || this.isUploadingAdSdk) {
            return;
        }
        if (this.adsdkUploading.length === 0) {
            if (this.adsdkQueue.length < batchSize) {
                return;
            }
            this.adsdkUploading = this.adsdkQueue.splice(0, this.adsdkQueue.length);
            this.writeArray(STORAGE_KEYS.adsdkPayload, this.adsdkQueue);
            this.writeArray(STORAGE_KEYS.adsdkLoading, this.adsdkUploading);
        }
        this.isUploadingAdSdk = true;
        const payload = { payload: this.adsdkUploading };
        this.logTrackRequest("adsdk", "REQ", this.adsdkUploading);
        try {
            const response = await new Promise<any>((resolve, reject) => {
                MiddleNetwork.trackAdSdk(payload, resolve, reject);
            });
            this.logTrackRequest("adsdk", "SUCCESS", this.adsdkUploading, response);
            this.adsdkUploading = [];
            this.writeArray(STORAGE_KEYS.adsdkLoading, this.adsdkUploading);
            this.isUploadingAdSdk = false;
            await this.flushAdsdkAsync(batchSize);
        } catch (err) {
            this.logTrackRequest("adsdk", "FAIL", this.adsdkUploading, err);
            this.adsdkQueue.push(...this.adsdkUploading);
            this.adsdkUploading = [];
            this.writeArray(STORAGE_KEYS.adsdkPayload, this.adsdkQueue);
            this.writeArray(STORAGE_KEYS.adsdkLoading, this.adsdkUploading);
            this.isUploadingAdSdk = false;
        }
    }

    flushCoredata(batchSize: number = 4): void {
        void this.flushCoredataAsync(batchSize);
    }

    async flushCoredataAsync(batchSize: number = 4): Promise<void> {
        if (!ClientDataStore.isInit || !MiddleHelper.isFinishRegional || this.isUploadingCoreData) {
            return;
        }
        if (this.coreDataUploading.length === 0) {
            if (this.coreDataQueue.length < batchSize) {
                return;
            }
            this.coreDataUploading = this.coreDataQueue.splice(0, this.coreDataQueue.length);
            this.writeArray(STORAGE_KEYS.coredataPayload, this.coreDataQueue);
            this.writeArray(STORAGE_KEYS.coredataLoading, this.coreDataUploading);
        }
        this.isUploadingCoreData = true;
        const payload = { payload: this.coreDataUploading };
        this.logTrackRequest("coredata", "REQ", this.coreDataUploading);
        try {
            const response = await new Promise<any>((resolve, reject) => {
                MiddleNetwork.trackCoreData(payload, resolve, reject);
            });
            this.logTrackRequest("coredata", "SUCCESS", this.coreDataUploading, response);
            this.coreDataUploading = [];
            this.writeArray(STORAGE_KEYS.coredataLoading, this.coreDataUploading);
            this.isUploadingCoreData = false;
            await this.flushCoredataAsync(batchSize);
        } catch (err) {
            this.logTrackRequest("coredata", "FAIL", this.coreDataUploading, err);
            this.coreDataQueue.push(...this.coreDataUploading);
            this.coreDataUploading = [];
            this.writeArray(STORAGE_KEYS.coredataPayload, this.coreDataQueue);
            this.writeArray(STORAGE_KEYS.coredataLoading, this.coreDataUploading);
            this.isUploadingCoreData = false;
        }
    }

    readArray(key: string): any[] {
        try {
            const stored = cc.sys.localStorage.getItem(key);
            if (!stored) {
                return [];
            }
            const parsed = JSON.parse(stored);
            return Array.isArray(parsed) ? parsed : [];
        } catch (e) {
            return [];
        }
    }

    writeArray(key: string, value: any[]): void {
        try {
            if (!value || value.length === 0) {
                cc.sys.localStorage.removeItem(key);
                return;
            }
            cc.sys.localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
        }
    }

    uuid(): string {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (char) => {
            const random = (16 * Math.random()) | 0;
            return (char === "x" ? random : (3 & random) | 8).toString(16);
        });
    }
}
