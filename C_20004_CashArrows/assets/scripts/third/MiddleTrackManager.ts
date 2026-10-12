import ClientDataStore from "./ClientDataStore";
import MiddleHelper from "./MiddleHelper";
import MiddleNetwork from "./MiddleNetwork";
import MiddleProjectAdapterConfig from "./MiddleProjectAdapterConfig";

const storageKeys = MiddleProjectAdapterConfig.MIDDLE_PROJECT_ADAPTER_CONFIG.storageKeys;

interface MiddleTrackData {
    [key: string]: any;
    event_name?: string;
    ts?: number;
    timestamp?: number;
    system_time?: number;
    event_id?: string;
    report_id?: string;
    target_p?: string;
    redirect_type?: number | string;
}

export default class MiddleTrackManager {
    private static instance: MiddleTrackManager = null;

    public applogQueue: MiddleTrackData[] = [];
    public adsdkQueue: MiddleTrackData[] = [];
    public coreDataQueue: MiddleTrackData[] = [];
    public applogUploading: MiddleTrackData[] = [];
    public adsdkUploading: MiddleTrackData[] = [];
    public coreDataUploading: MiddleTrackData[] = [];
    public isUploadingApplog: boolean = false;
    public isUploadingAdSdk: boolean = false;
    public isUploadingCoreData: boolean = false;

    public static getInstance(): MiddleTrackManager {
        if (!MiddleTrackManager.instance) {
            MiddleTrackManager.instance = new MiddleTrackManager();
        }
        return MiddleTrackManager.instance;
    }

    constructor() {
        this.applogQueue = this.readArray(storageKeys.applogPayload);
        this.applogUploading = this.readArray(storageKeys.applogLoading);
        this.adsdkQueue = this.readArray(storageKeys.adsdkPayload);
        this.adsdkUploading = this.readArray(storageKeys.adsdkLoading);
        this.coreDataQueue = this.readArray(storageKeys.coredataPayload);
        this.coreDataUploading = this.readArray(storageKeys.coredataLoading);
    }

    public trackAll(): void {
        if (ClientDataStore.isInit) {
            this.flushApplog(1);
            this.flushAdsdk(1);
            this.flushCoredata(1);
        }
    }

    public reportData(eventName: string, data?: MiddleTrackData, forceCoreData: boolean = false): void {
        const payload: MiddleTrackData = { ...(data || {}) };
        let redirectType: any = payload.redirect_type;
        if (redirectType !== null && redirectType !== undefined && redirectType !== "") {
            redirectType = Number(redirectType);
        }
        if (forceCoreData) {
            redirectType = 1;
            payload.redirect_type = 1;
        }
        this.track(eventName, payload, redirectType);
    }

    public track(eventName: string, data?: MiddleTrackData, redirectType?: any): void {
        const payload: MiddleTrackData = { ...(data || {}) };
        const now = Date.now();
        payload.event_name = eventName;
        payload.ts = now;
        payload.timestamp = now;
        payload.system_time = now;
        payload.event_id = this.uuid();
        payload.report_id = this.uuid();

        if (redirectType === 0 || redirectType === 2) {
            this.enqueue("adsdk", payload);
            this.flushAdsdk();
        } else if (redirectType === 1) {
            this.enqueue("coredata", payload);
            this.flushCoredata();
        } else {
            this.enqueue("applog", payload);
            this.flushApplog();
        }
    }

    private stringifySafe(value: any): string {
        try {
            return JSON.stringify(value);
        } catch (e) {
            return String(value);
        }
    }

    private eventNamePreview(list: any): string[] {
        if (!Array.isArray(list)) {
            return [];
        }
        return list.slice(0, 5).map((item: any) => String((item !== null && item !== undefined ? item.event_name : undefined) || "unknown"));
    }

    private logTrackRequest(type: "applog" | "adsdk" | "coredata", stage: string, list: MiddleTrackData[], extra?: any): void {
        const detail = {
            type: type,
            stage: stage,
            size: Array.isArray(list) ? list.length : 0,
            queueSize: type === "applog" ? this.applogQueue.length : (type === "adsdk" ? this.adsdkQueue.length : this.coreDataQueue.length),
            eventPreview: this.eventNamePreview(list),
            extra: extra === undefined ? "" : this.stringifySafe(extra)
        };
        const payloadText = stage === "REQ" ? this.stringifySafe(list) : "";
        const message = "[MiddleTrackManager] track request type=" + type + " stage=" + stage + " size=" + detail.size + " queueSize=" + detail.queueSize + " detail=" + this.stringifySafe(detail) + (payloadText ? " payload=" + payloadText : "");
        if (stage !== "FAIL") {
            console.log(message);
        } else {
            console.warn(message);
        }
    }

    public enqueue(type: "applog" | "adsdk" | "coredata", data: MiddleTrackData): void {
        data.target_p = type;
        if (type === "applog") {
            this.applogQueue.push(data);
            this.writeArray(storageKeys.applogPayload, this.applogQueue);
        } else if (type === "adsdk") {
            this.adsdkQueue.push(data);
            this.writeArray(storageKeys.adsdkPayload, this.adsdkQueue);
        } else {
            this.coreDataQueue.push(data);
            this.writeArray(storageKeys.coredataPayload, this.coreDataQueue);
        }
    }

    public flushApplog(threshold: number = 4): void {
        if (!ClientDataStore.isInit || !MiddleHelper.isFinishRegional || this.isUploadingApplog) {
            return;
        }
        if (this.applogUploading.length === 0) {
            if (this.applogQueue.length < threshold) {
                return;
            }
            this.applogUploading = this.applogQueue.splice(0, this.applogQueue.length);
            this.writeArray(storageKeys.applogPayload, this.applogQueue);
            this.writeArray(storageKeys.applogLoading, this.applogUploading);
        }
        this.isUploadingApplog = true;
        const request = { payload: this.applogUploading };
        this.logTrackRequest("applog", "REQ", this.applogUploading);
        MiddleNetwork.trackAppLog(request, (response: any) => {
            this.logTrackRequest("applog", "SUCCESS", this.applogUploading, response);
            this.applogUploading = [];
            this.writeArray(storageKeys.applogLoading, this.applogUploading);
            this.isUploadingApplog = false;
            this.flushApplog(threshold);
        }, (error: any) => {
            this.logTrackRequest("applog", "FAIL", this.applogUploading, error);
            this.applogQueue.push(...this.applogUploading);
            this.applogUploading = [];
            this.writeArray(storageKeys.applogPayload, this.applogQueue);
            this.writeArray(storageKeys.applogLoading, this.applogUploading);
            this.isUploadingApplog = false;
        });
    }

    public flushAdsdk(threshold: number = 1): void {
        if (!ClientDataStore.isInit || !MiddleHelper.isFinishRegional || this.isUploadingAdSdk) {
            return;
        }
        if (this.adsdkUploading.length === 0) {
            if (this.adsdkQueue.length < threshold) {
                return;
            }
            this.adsdkUploading = this.adsdkQueue.splice(0, this.adsdkQueue.length);
            this.writeArray(storageKeys.adsdkPayload, this.adsdkQueue);
            this.writeArray(storageKeys.adsdkLoading, this.adsdkUploading);
        }
        this.isUploadingAdSdk = true;
        const request = { payload: this.adsdkUploading };
        this.logTrackRequest("adsdk", "REQ", this.adsdkUploading);
        MiddleNetwork.trackAdSdk(request, (response: any) => {
            this.logTrackRequest("adsdk", "SUCCESS", this.adsdkUploading, response);
            this.adsdkUploading = [];
            this.writeArray(storageKeys.adsdkLoading, this.adsdkUploading);
            this.isUploadingAdSdk = false;
            this.flushAdsdk(threshold);
        }, (error: any) => {
            this.logTrackRequest("adsdk", "FAIL", this.adsdkUploading, error);
            this.adsdkQueue.push(...this.adsdkUploading);
            this.adsdkUploading = [];
            this.writeArray(storageKeys.adsdkPayload, this.adsdkQueue);
            this.writeArray(storageKeys.adsdkLoading, this.adsdkUploading);
            this.isUploadingAdSdk = false;
        });
    }

    public flushCoredata(threshold: number = 4): void {
        if (!ClientDataStore.isInit || !MiddleHelper.isFinishRegional || this.isUploadingCoreData) {
            return;
        }
        if (this.coreDataUploading.length === 0) {
            if (this.coreDataQueue.length < threshold) {
                return;
            }
            this.coreDataUploading = this.coreDataQueue.splice(0, this.coreDataQueue.length);
            this.writeArray(storageKeys.coredataPayload, this.coreDataQueue);
            this.writeArray(storageKeys.coredataLoading, this.coreDataUploading);
        }
        this.isUploadingCoreData = true;
        const request = { payload: this.coreDataUploading };
        this.logTrackRequest("coredata", "REQ", this.coreDataUploading);
        MiddleNetwork.trackCoreData(request, (response: any) => {
            this.logTrackRequest("coredata", "SUCCESS", this.coreDataUploading, response);
            this.coreDataUploading = [];
            this.writeArray(storageKeys.coredataLoading, this.coreDataUploading);
            this.isUploadingCoreData = false;
            this.flushCoredata(threshold);
        }, (error: any) => {
            this.logTrackRequest("coredata", "FAIL", this.coreDataUploading, error);
            this.coreDataQueue.push(...this.coreDataUploading);
            this.coreDataUploading = [];
            this.writeArray(storageKeys.coredataPayload, this.coreDataQueue);
            this.writeArray(storageKeys.coredataLoading, this.coreDataUploading);
            this.isUploadingCoreData = false;
        });
    }

    private readArray(key: string): MiddleTrackData[] {
        try {
            const raw = cc.sys.localStorage.getItem(key);
            if (!raw) {
                return [];
            }
            const parsed = JSON.parse(raw);
            return Array.isArray(parsed) ? parsed : [];
        } catch (e) {
            return [];
        }
    }

    private writeArray(key: string, list: MiddleTrackData[]): void {
        try {
            if (!list || list.length === 0) {
                cc.sys.localStorage.removeItem(key);
                return;
            }
            cc.sys.localStorage.setItem(key, JSON.stringify(list));
        } catch (e) {
        }
    }

    private uuid(): string {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c: string) => {
            const r = 16 * Math.random() | 0;
            return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
        });
    }
}