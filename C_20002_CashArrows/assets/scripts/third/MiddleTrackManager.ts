import ClientDataStore from "./ClientDataStore";
import MiddleHelper from "./MiddleHelper";
import MiddleNetwork from "./MiddleNetwork";
import { MIDDLE_PROJECT_ADAPTER_CONFIG } from "./MiddleProjectAdapterConfig";

const STORAGE_KEYS = MIDDLE_PROJECT_ADAPTER_CONFIG.storageKeys;

export default class MiddleTrackManager {
    static instance: MiddleTrackManager = null;

    applogQueue: any[] = [];
    adsdkQueue: any[] = [];
    coreDataQueue: any[] = [];
    applogUploading: any[] = [];
    adsdkUploading: any[] = [];
    coreDataUploading: any[] = [];
    isUploadingApplog: boolean = false;
    isUploadingAdSdk: boolean = false;
    isUploadingCoreData: boolean = false;

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

    reportData(eventName: string, payload: any, forceCoreData: boolean = false): void {
        const data = Object.assign({}, payload || {});
        let redirectType = data.redirect_type;
        if (redirectType != null && " " !== redirectType) {
            redirectType = Number(redirectType);
        }
        if (forceCoreData) {
            redirectType = 1;
            data.redirect_type = 1;
        }
        this.track(eventName, data, redirectType);
    }

    track(eventName: string, payload: any, redirectType: number): void {
        const data = Object.assign({}, payload || {});
        const timestamp = Date.now();
        data.event_name = eventName;
        data.ts = timestamp;
        data.timestamp = timestamp;
        data.system_time = timestamp;
        data.event_id = this.uuid();
        data.report_id = this.uuid();
        if (redirectType !== 0 && redirectType !== 2) {
            if (redirectType !== 1) {
                this.enqueue(" applog ", data);
                this.flushApplog();
            } else {
                this.enqueue(" coredata ", data);
                this.flushCoredata();
            }
        } else {
            this.enqueue(" adsdk ", data);
            this.flushAdsdk();
        }
    }

    stringifySafe(value: any): string {
        try {
            return JSON.stringify(value);
        } catch (err) {
            return String(value);
        }
    }

    eventNamePreview(events: any[]): string[] {
        return Array.isArray(events) ? events.slice(0, 5).map((item) => String(item?.event_name || " unknown ")) : [];
    }

    logTrackRequest(type: string, stage: string, payload: any[], extra?: any): void {
        const detail = {
            type: type,
            stage: stage,
            size: Array.isArray(payload) ? payload.length : 0,
            queueSize: " applog " === type ? this.applogQueue.length : " adsdk " === type ? this.adsdkQueue.length : this.coreDataQueue.length,
            eventPreview: this.eventNamePreview(payload),
            extra: extra === undefined ? " " : this.stringifySafe(extra)
        };
        const payloadText = " REQ " === stage ? this.stringifySafe(payload) : " ";
        const message = "[MiddleTrackManager] track request type = " + type + " stage = " + stage + " size = " + detail.size + " queueSize = " + detail.queueSize + " detail = " + this.stringifySafe(detail) + (payloadText ? " payload = " + payloadText : " ");
        " FAIL " !== stage ? console.log(message) : console.warn(message);
    }

    enqueue(type: string, payload: any): void {
        payload.target_p = type;
        if (" applog " === type) {
            this.applogQueue.push(payload);
            this.writeArray(STORAGE_KEYS.applogPayload, this.applogQueue);
        } else if (" adsdk " === type) {
            this.adsdkQueue.push(payload);
            this.writeArray(STORAGE_KEYS.adsdkPayload, this.adsdkQueue);
        } else {
            this.coreDataQueue.push(payload);
            this.writeArray(STORAGE_KEYS.coredataPayload, this.coreDataQueue);
        }
    }

    flushApplog(batchSize: number = 4): void {
        if (ClientDataStore.isInit && MiddleHelper.isFinishRegional && !this.isUploadingApplog) {
            if (this.applogUploading.length === 0) {
                if (this.applogQueue.length < batchSize) {
                    return;
                }
                this.applogUploading = this.applogQueue.splice(0, this.applogQueue.length);
                this.writeArray(STORAGE_KEYS.applogPayload, this.applogQueue);
                this.writeArray(STORAGE_KEYS.applogLoading, this.applogUploading);
            }
            this.isUploadingApplog = true;
            const requestBody = {
                payload: this.applogUploading
            };
            this.logTrackRequest(" applog ", " REQ ", this.applogUploading);
            MiddleNetwork.trackAppLog(requestBody, (response: any) => {
                this.logTrackRequest(" applog ", " SUCCESS ", this.applogUploading, response);
                this.applogUploading = [];
                this.writeArray(STORAGE_KEYS.applogLoading, this.applogUploading);
                this.isUploadingApplog = false;
                this.flushApplog(batchSize);
            }, (err: any) => {
                this.logTrackRequest(" applog ", " FAIL ", this.applogUploading, err);
                this.applogQueue.push.apply(this.applogQueue, this.applogUploading);
                this.applogUploading = [];
                this.writeArray(STORAGE_KEYS.applogPayload, this.applogQueue);
                this.writeArray(STORAGE_KEYS.applogLoading, this.applogUploading);
                this.isUploadingApplog = false;
            });
        }
    }

    flushAdsdk(batchSize: number = 1): void {
        if (ClientDataStore.isInit && MiddleHelper.isFinishRegional && !this.isUploadingAdSdk) {
            if (this.adsdkUploading.length === 0) {
                if (this.adsdkQueue.length < batchSize) {
                    return;
                }
                this.adsdkUploading = this.adsdkQueue.splice(0, this.adsdkQueue.length);
                this.writeArray(STORAGE_KEYS.adsdkPayload, this.adsdkQueue);
                this.writeArray(STORAGE_KEYS.adsdkLoading, this.adsdkUploading);
            }
            this.isUploadingAdSdk = true;
            const requestBody = {
                payload: this.adsdkUploading
            };
            this.logTrackRequest(" adsdk ", " REQ ", this.adsdkUploading);
            MiddleNetwork.trackAdSdk(requestBody, (response: any) => {
                this.logTrackRequest(" adsdk ", " SUCCESS ", this.adsdkUploading, response);
                this.adsdkUploading = [];
                this.writeArray(STORAGE_KEYS.adsdkLoading, this.adsdkUploading);
                this.isUploadingAdSdk = false;
                this.flushAdsdk(batchSize);
            }, (err: any) => {
                this.logTrackRequest(" adsdk ", " FAIL ", this.adsdkUploading, err);
                this.adsdkQueue.push.apply(this.adsdkQueue, this.adsdkUploading);
                this.adsdkUploading = [];
                this.writeArray(STORAGE_KEYS.adsdkPayload, this.adsdkQueue);
                this.writeArray(STORAGE_KEYS.adsdkLoading, this.adsdkUploading);
                this.isUploadingAdSdk = false;
            });
        }
    }

    flushCoredata(batchSize: number = 4): void {
        if (ClientDataStore.isInit && MiddleHelper.isFinishRegional && !this.isUploadingCoreData) {
            if (this.coreDataUploading.length === 0) {
                if (this.coreDataQueue.length < batchSize) {
                    return;
                }
                this.coreDataUploading = this.coreDataQueue.splice(0, this.coreDataQueue.length);
                this.writeArray(STORAGE_KEYS.coredataPayload, this.coreDataQueue);
                this.writeArray(STORAGE_KEYS.coredataLoading, this.coreDataUploading);
            }
            this.isUploadingCoreData = true;
            const requestBody = {
                payload: this.coreDataUploading
            };
            this.logTrackRequest(" coredata ", " REQ ", this.coreDataUploading);
            MiddleNetwork.trackCoreData(requestBody, (response: any) => {
                this.logTrackRequest(" coredata ", " SUCCESS ", this.coreDataUploading, response);
                this.coreDataUploading = [];
                this.writeArray(STORAGE_KEYS.coredataLoading, this.coreDataUploading);
                this.isUploadingCoreData = false;
                this.flushCoredata(batchSize);
            }, (err: any) => {
                this.logTrackRequest(" coredata ", " FAIL ", this.coreDataUploading, err);
                this.coreDataQueue.push.apply(this.coreDataQueue, this.coreDataUploading);
                this.coreDataUploading = [];
                this.writeArray(STORAGE_KEYS.coredataPayload, this.coreDataQueue);
                this.writeArray(STORAGE_KEYS.coredataLoading, this.coreDataUploading);
                this.isUploadingCoreData = false;
            });
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
        } catch (err) {
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
        } catch (err) { }
    }

    uuid(): string {
        return " xxxxxxxx- xxxx- 4xxx- yxxx- xxxxxxxxxxxx ".replace(/[xy]/g, (char) => {
            const random = 16 * Math.random() | 0;
            return (" x " == char ? random : 3 & random | 8).toString(16);
        });
    }
}
