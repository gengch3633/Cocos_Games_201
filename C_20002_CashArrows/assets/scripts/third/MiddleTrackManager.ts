import MiddleNetwork from "./MiddleNetwork";
import ClientDataStore from "./ClientDataStore";
import MiddleHelper from "./MiddleHelper";
import { MIDDLE_PROJECT_ADAPTER_CONFIG } from "./MiddleProjectAdapterConfig";

const storageKeys = MIDDLE_PROJECT_ADAPTER_CONFIG.storageKeys;

export default class MiddleTrackManager {
    applogQueue: any[];
    adsdkQueue: any[];
    coreDataQueue: any[];
    applogUploading: any[];
    adsdkUploading: any[];
    coreDataUploading: any[];
    isUploadingApplog: boolean;
    isUploadingAdSdk: boolean;
    isUploadingCoreData: boolean;
    static instance: MiddleTrackManager = null;

    constructor() {
        this.applogQueue = [];
        this.adsdkQueue = [];
        this.coreDataQueue = [];
        this.applogUploading = [];
        this.adsdkUploading = [];
        this.coreDataUploading = [];
        this.isUploadingApplog = false;
        this.isUploadingAdSdk = false;
        this.isUploadingCoreData = false;
        this.applogQueue = this.readArray(storageKeys.applogPayload);
        this.applogUploading = this.readArray(storageKeys.applogLoading);
        this.adsdkQueue = this.readArray(storageKeys.adsdkPayload);
        this.adsdkUploading = this.readArray(storageKeys.adsdkLoading);
        this.coreDataQueue = this.readArray(storageKeys.coredataPayload);
        this.coreDataUploading = this.readArray(storageKeys.coredataLoading);
    }

    static getInstance() {
        MiddleTrackManager.instance || (MiddleTrackManager.instance = new MiddleTrackManager());
        return MiddleTrackManager.instance;
    }

    trackAll() {
        if (ClientDataStore.isInit) {
            this.flushApplog(1);
            this.flushAdsdk(1);
            this.flushCoredata(1);
        }
    }

    reportData(eventName: any, data: any, forceRedirect: boolean = false) {
        const payload = { ...(data || {}) };
        let redirectType = payload.redirect_type;
        null != redirectType && " " !== redirectType && (redirectType = Number(redirectType));
        if (forceRedirect) {
            redirectType = 1;
            payload.redirect_type = 1;
        }
        this.track(eventName, payload, redirectType);
    }

    track(eventName: any, data: any, redirectType: any) {
        const payload = { ...(data || {}) };
        const ts = Date.now();
        payload.event_name = eventName;
        payload.ts = ts;
        payload.timestamp = ts;
        payload.system_time = ts;
        payload.event_id = this.uuid();
        payload.report_id = this.uuid();
        if (0 !== redirectType && 2 !== redirectType) {
            if (1 !== redirectType) {
                this.enqueue(" applog ", payload);
                this.flushApplog();
            } else {
                this.enqueue(" coredata ", payload);
                this.flushCoredata();
            }
        } else {
            this.enqueue(" adsdk ", payload);
            this.flushAdsdk();
        }
    }

    stringifySafe(value: any) {
        try {
            return JSON.stringify(value);
        } catch (t) {
            return String(value);
        }
    }

    eventNamePreview(items: any) {
        return Array.isArray(items) ? items.slice(0, 5).map(function (item) {
            return String((null == item ? void 0 : item.event_name) || " unknown ");
        }) : [];
    }

    logTrackRequest(type: string, stage: string, payload: any, extra?: any) {
        const detail = {
            type: type,
            stage: stage,
            size: Array.isArray(payload) ? payload.length : 0,
            queueSize: " applog " === type ? this.applogQueue.length : " adsdk " === type ? this.adsdkQueue.length : this.coreDataQueue.length,
            eventPreview: this.eventNamePreview(payload),
            extra: void 0 === extra ? " " : this.stringifySafe(extra)
        };
        const payloadStr = " REQ " === stage ? this.stringifySafe(payload) : " ";
        const logLine = "[MiddleTrackManager] track request type = " + type + " stage = " + stage + " size = " + detail.size + " queueSize = " + detail.queueSize + " detail = " + this.stringifySafe(detail) + (payloadStr ? " payload = " + payloadStr : " ");
        " FAIL " !== stage ? console.log(logLine) : console.warn(logLine);
    }

    enqueue(target: string, item: any) {
        item.target_p = target;
        if (" applog " === target) {
            this.applogQueue.push(item);
            this.writeArray(storageKeys.applogPayload, this.applogQueue);
        } else if (" adsdk " === target) {
            this.adsdkQueue.push(item);
            this.writeArray(storageKeys.adsdkPayload, this.adsdkQueue);
        } else {
            this.coreDataQueue.push(item);
            this.writeArray(storageKeys.coredataPayload, this.coreDataQueue);
        }
    }

    flushApplog(threshold: number = 4) {
        const self = this;
        if (ClientDataStore.isInit && MiddleHelper.isFinishRegional && !this.isUploadingApplog) {
            if (0 === this.applogUploading.length) {
                if (this.applogQueue.length < threshold) return;
                this.applogUploading = this.applogQueue.splice(0, this.applogQueue.length);
                this.writeArray(storageKeys.applogPayload, this.applogQueue);
                this.writeArray(storageKeys.applogLoading, this.applogUploading);
            }
            this.isUploadingApplog = true;
            const body = {
                payload: this.applogUploading
            };
            this.logTrackRequest(" applog ", " REQ ", this.applogUploading);
            MiddleNetwork.trackAppLog(body, function (result) {
                self.logTrackRequest(" applog ", " SUCCESS ", self.applogUploading, result);
                self.applogUploading = [];
                self.writeArray(storageKeys.applogLoading, self.applogUploading);
                self.isUploadingApplog = false;
                self.flushApplog(threshold);
            }, function (err) {
                self.logTrackRequest(" applog ", " FAIL ", self.applogUploading, err);
                self.applogQueue.push.apply(self.applogQueue, self.applogUploading);
                self.applogUploading = [];
                self.writeArray(storageKeys.applogPayload, self.applogQueue);
                self.writeArray(storageKeys.applogLoading, self.applogUploading);
                self.isUploadingApplog = false;
            });
        }
    }

    flushAdsdk(threshold: number = 1) {
        const self = this;
        if (ClientDataStore.isInit && MiddleHelper.isFinishRegional && !this.isUploadingAdSdk) {
            if (0 === this.adsdkUploading.length) {
                if (this.adsdkQueue.length < threshold) return;
                this.adsdkUploading = this.adsdkQueue.splice(0, this.adsdkQueue.length);
                this.writeArray(storageKeys.adsdkPayload, this.adsdkQueue);
                this.writeArray(storageKeys.adsdkLoading, this.adsdkUploading);
            }
            this.isUploadingAdSdk = true;
            const body = {
                payload: this.adsdkUploading
            };
            this.logTrackRequest(" adsdk ", " REQ ", this.adsdkUploading);
            MiddleNetwork.trackAdSdk(body, function (result) {
                self.logTrackRequest(" adsdk ", " SUCCESS ", self.adsdkUploading, result);
                self.adsdkUploading = [];
                self.writeArray(storageKeys.adsdkLoading, self.adsdkUploading);
                self.isUploadingAdSdk = false;
                self.flushAdsdk(threshold);
            }, function (err) {
                self.logTrackRequest(" adsdk ", " FAIL ", self.adsdkUploading, err);
                self.adsdkQueue.push.apply(self.adsdkQueue, self.adsdkUploading);
                self.adsdkUploading = [];
                self.writeArray(storageKeys.adsdkPayload, self.adsdkQueue);
                self.writeArray(storageKeys.adsdkLoading, self.adsdkUploading);
                self.isUploadingAdSdk = false;
            });
        }
    }

    flushCoredata(threshold: number = 4) {
        const self = this;
        if (ClientDataStore.isInit && MiddleHelper.isFinishRegional && !this.isUploadingCoreData) {
            if (0 === this.coreDataUploading.length) {
                if (this.coreDataQueue.length < threshold) return;
                this.coreDataUploading = this.coreDataQueue.splice(0, this.coreDataQueue.length);
                this.writeArray(storageKeys.coredataPayload, this.coreDataQueue);
                this.writeArray(storageKeys.coredataLoading, this.coreDataUploading);
            }
            this.isUploadingCoreData = true;
            const body = {
                payload: this.coreDataUploading
            };
            this.logTrackRequest(" coredata ", " REQ ", this.coreDataUploading);
            MiddleNetwork.trackCoreData(body, function (result) {
                self.logTrackRequest(" coredata ", " SUCCESS ", self.coreDataUploading, result);
                self.coreDataUploading = [];
                self.writeArray(storageKeys.coredataLoading, self.coreDataUploading);
                self.isUploadingCoreData = false;
                self.flushCoredata(threshold);
            }, function (err) {
                self.logTrackRequest(" coredata ", " FAIL ", self.coreDataUploading, err);
                self.coreDataQueue.push.apply(self.coreDataQueue, self.coreDataUploading);
                self.coreDataUploading = [];
                self.writeArray(storageKeys.coredataPayload, self.coreDataQueue);
                self.writeArray(storageKeys.coredataLoading, self.coreDataUploading);
                self.isUploadingCoreData = false;
            });
        }
    }

    readArray(key: string) {
        try {
            const raw = cc.sys.localStorage.getItem(key);
            if (!raw) return [];
            const parsed = JSON.parse(raw);
            return Array.isArray(parsed) ? parsed : [];
        } catch (e) {
            return [];
        }
    }

    writeArray(key: string, value: any[]) {
        try {
            if (!value || 0 === value.length) {
                cc.sys.localStorage.removeItem(key);
                return;
            }
            cc.sys.localStorage.setItem(key, JSON.stringify(value));
        } catch (e) { }
    }

    uuid() {
        return " xxxxxxxx- xxxx- 4xxx- yxxx- xxxxxxxxxxxx ".replace(/[xy]/g, function (ch) {
            const rand = 16 * Math.random() | 0;
            return (" x " == ch ? rand : 3 & rand | 8).toString(16);
        });
    }
}
