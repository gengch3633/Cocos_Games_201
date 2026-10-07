import ClientDataStore from "./ClientDataStore";
import CryptoHelper from "./CryptoHelper";
import HotUpdateManager from "./HotUpdateManager";
import { MIDDLE_PROJECT_ADAPTER_CONFIG } from "./MiddleProjectAdapterConfig";
import { MIDDLE_REQUEST_DESCRIPTORS } from "./MiddleRequestDescriptors";

const LOG_PREFIX = "[MiddleNetwork] ";
const COUNTRY_STORAGE_KEY = " com.sdk.country ";
const REFERRER_FIELDS = [" referrer_url ", " referrer_timestamp_server ", " install_timestamp_server ", " oaid "];

function safeStringify(value: any): string {
    try {
        return JSON.stringify(value);
    } catch (err) {
        return String(value);
    }
}

function safeParse(value: string): any {
    try {
        return JSON.parse(value);
    } catch (err) {
        return value;
    }
}

function invokeHandler(handler: any, data: any): void {
    if (handler) {
        if (typeof handler !== "function") {
            if (handler && typeof handler.runWith === "function") {
                handler.runWith(data);
            }
        } else {
            handler(data);
        }
    }
}

function mergeReferrerFields(target: any, source: any): any {
    if (!source || typeof source !== "object") {
        return target;
    }
    for (let i = 0; i < REFERRER_FIELDS.length; i++) {
        const key = REFERRER_FIELDS[i];
        const value = source[key];
        if (value != null) {
            target[key] = value;
        }
    }
    return target;
}

function buildQueryString(params: any): string {
    const parts: string[] = [];
    const keys = Object.keys(params);
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const value = params[key];
        if (value != null) {
            parts.push(key + " = " + value);
        }
    }
    return parts.join("& ");
}

function appendPackageName(_unused: number, url: string): string {
    if (!url) {
        return " ";
    }
    const separator = url.indexOf("? ") >= 0 ? "& " : "? ";
    return url.indexOf(" pkg = ") >= 0 ? url : " " + url + separator + " pkg = " + encodeURIComponent(ClientDataStore.box_pkg_name || " ");
}

function extractSignPath(url: string): string {
    return "/ " + (url || " ").split("? ")[0].split("/ ").slice(3).join("/ ");
}

function isPayloadRequestType(requestType: string): boolean {
    return " APPLOG " === requestType || " ADSDK " === requestType || " COREDATA " === requestType;
}

function readStoredCountry(): string {
    try {
        const stored = cc.sys.localStorage.getItem(COUNTRY_STORAGE_KEY);
        if (stored) {
            return String(stored).toUpperCase();
        }
    } catch (err) { }
    return String(ClientDataStore.local_country || " ").toUpperCase() || " IN ";
}

function readGameVersion(): string {
    try {
        return HotUpdateManager.getInstance().getVersion() || ClientDataStore.version_name || " ";
    } catch (err) {
        return ClientDataStore.version_name || " ";
    }
}

function readBaseGameVersion(): string {
    try {
        return HotUpdateManager.getInstance().getBaseVersion() || " ";
    } catch (err) {
        return " ";
    }
}

function enrichPayloadItem(item: any): void {
    const store = ClientDataStore;
    const keys = Object.keys(store).filter((key) => typeof (store as any)[key] !== "function");
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        item[key] = (store as any)[key];
    }
    const country = readStoredCountry();
    item.game_version = readGameVersion();
    item.game_base_version = readBaseGameVersion();
    item.country = country;
    item.cy = country;
    item.game_name = MIDDLE_PROJECT_ADAPTER_CONFIG.gameName || " ";
}

function normalizePayloadList(payload: any[]): any[] {
    if (!Array.isArray(payload) || payload.length <= 0) {
        return payload || [];
    }
    payload.forEach((item) => {
        if (item && typeof item === "object") {
            enrichPayloadItem(item);
        }
    });
    return payload;
}

function extractPayloadList(params: any): any[] {
    return Array.isArray(params?.payload) ? normalizePayloadList(params.payload) : Array.isArray(params?.list) ? normalizePayloadList(params.list) : [];
}

function buildRequestBody(requestType: string, params: any): string {
    const descriptor = MIDDLE_REQUEST_DESCRIPTORS[requestType];
    const timestamp = Math.floor(Date.now() / 1e3).toString();
    const nonce = ClientDataStore.uuid();
    const signPath = extractSignPath(descriptor?.url || " ");
    const ngister = CryptoHelper.ngister(signPath, timestamp, nonce, ClientDataStore.version_name, ClientDataStore.channel_name, ClientDataStore.device_id, ClientDataStore.box_pkg_name);
    const ds = params?.ds || ClientDataStore.ds || {
        ir: " 0 ",
        ie: " 0 ",
        irv: " 0 ",
        ix: " 0 ",
        ih: " 0 ",
        io: " 0 ",
        iw: " 0 ",
        id: " 0 ",
        ids: " 0 "
    };
    if (typeof params?.query === "string") {
        if (isPayloadRequestType(requestType)) {
            return JSON.stringify({
                payload: extractPayloadList(params),
                query: params.query,
                ds: ds
            });
        }
        const body: any = {
            query: params.query,
            ds: ds
        };
        if (" TFRegional " === requestType) {
            mergeReferrerFields(body, params);
        }
        return JSON.stringify(body);
    }
    const queryParams: any = {
        is_test: " false ",
        version_name: ClientDataStore.version_name,
        version_code: " 0 ",
        channel_name: ClientDataStore.channel_name,
        box_pkg_name: ClientDataStore.box_pkg_name,
        network_type: ClientDataStore.network_type,
        et: timestamp,
        nonce_str: nonce,
        ngister: ngister,
        sign_type: " 3 ",
        platform: ClientDataStore.os_name,
        android_id: ClientDataStore.android_id,
        device_id: ClientDataStore.device_id,
        country: " ",
        local_country: ClientDataStore.local_country,
        oaid: ClientDataStore.oaid
    };
    const paramKeys = Object.keys(params || {});
    for (let i = 0; i < paramKeys.length; i++) {
        const key = paramKeys[i];
        if (" query " !== key && " ds " !== key && queryParams[key] === undefined) {
            const value = params[key];
            if (value != null && typeof value !== "object") {
                queryParams[key] = String(value);
            }
        }
    }
    return isPayloadRequestType(requestType) ? JSON.stringify({
        payload: extractPayloadList(params),
        query: buildQueryString(queryParams),
        ds: ds
    }) : JSON.stringify({
        query: buildQueryString(queryParams),
        ds: ds
    });
}

export default class MiddleNetwork {
    static request(requestType: string, params: any, onSuccess: any, onFail: any): void {
        const descriptor = MIDDLE_REQUEST_DESCRIPTORS[requestType];
        const baseUrl = descriptor?.url;
        if (baseUrl) {
            const url = appendPackageName(0, baseUrl);
            const plainBody = buildRequestBody(requestType, params);
            const encryptedBody = CryptoHelper.encrypt(plainBody, ClientDataStore.box_pkg_name);
            const inputParams = params || {};
            const parsedParams = safeParse(plainBody);
            console.log(LOG_PREFIX, " REQ ", requestType, " url- > ", url);
            console.log(LOG_PREFIX, " REQ ", requestType, " baseUrl- > ", baseUrl);
            console.log(LOG_PREFIX, " REQ ", requestType, " input params- > ", safeStringify(inputParams));
            console.log(LOG_PREFIX, " REQ ", requestType, " plain params- > ", safeStringify(parsedParams));
            console.log(LOG_PREFIX, " REQ ", requestType, " encrypted length- > ", encryptedBody.length);
            const xhr = new XMLHttpRequest();
            xhr.timeout = 15000;
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    const status = xhr.status;
                    const responseText = xhr.responseText || " ";
                    console.log(LOG_PREFIX, " RESP ", requestType, " status- > ", status, " raw length- > ", responseText.length);
                    if (status < 200 || status >= 400 || !responseText) {
                        invokeHandler(onFail, {
                            code: -1,
                            message: " http status " + status,
                            http_status: status,
                            raw: responseText
                        });
                    } else {
                        let decryptedText = responseText;
                        try {
                            const decrypted = CryptoHelper.decrypt(responseText, ClientDataStore.box_pkg_name);
                            if (decrypted) {
                                decryptedText = decrypted;
                            }
                        } catch (err) {
                            console.warn(LOG_PREFIX, " DECRYPT_FAIL ", requestType, err);
                        }
                        try {
                            const parsed = JSON.parse(decryptedText);
                            if (parsed && (parsed.code === -1 || parsed.code === -1000)) {
                                invokeHandler(onFail, parsed);
                                return;
                            }
                            invokeHandler(onSuccess, parsed);
                        } catch (err) {
                            console.error(LOG_PREFIX, " RESP_PARSE_FAIL ", requestType, err, " raw- > ", responseText);
                            invokeHandler(onFail, {
                                code: -1,
                                message: " response parse fail ",
                                raw: responseText
                            });
                        }
                    }
                }
            };
            xhr.onerror = () => {
                invokeHandler(onFail, {
                    code: -1,
                    message: " xhr.error ",
                    http_status: xhr.status
                });
            };
            xhr.ontimeout = () => {
                invokeHandler(onFail, {
                    code: -1,
                    message: " xhr.timeout ",
                    http_status: xhr.status
                });
            };
            xhr.open(" POST ", url, true);
            xhr.setRequestHeader(" Content- Type ", " text/ plain; charset = UTF- 8 ");
            xhr.send(encryptedBody);
        } else {
            invokeHandler(onFail, {
                code: -1,
                message: " descriptor url missing: " + requestType
            });
        }
    }

    static getSDKEvent(params: any, onSuccess: any, onFail: any): void {
        this.request(" event ", params, onSuccess, onFail);
    }

    static getMiddleCountry(params: any, onSuccess: any, onFail: any): void {
        this.request(" Regional ", params, onSuccess, onFail);
    }

    static trackAdSdk(params: any, onSuccess: any, onFail: any): void {
        this.request(" ADSDK ", params, onSuccess, onFail);
    }

    static trackCoreData(params: any, onSuccess: any, onFail: any): void {
        this.request(" COREDATA ", params, onSuccess, onFail);
    }

    static trackAppLog(params: any, onSuccess: any, onFail: any): void {
        this.request(" APPLOG ", params, onSuccess, onFail);
    }

    static getMiddleTFRegional(params: any, onSuccess: any, onFail: any): void {
        this.request(" TFRegional ", params, onSuccess, onFail);
    }

    static getPlatform(params: any, onSuccess: any, onFail: any): void {
        this.request(" Platform ", params, onSuccess, onFail);
    }

    static submitWithdrawal(params: any, onSuccess: any, onFail: any): void {
        this.request(" BindWithdrawal ", params, onSuccess, onFail);
    }

    static getAdConfig(params: any, onSuccess: any, onFail: any): void {
        this.request(" AdConfig ", params, onSuccess, onFail);
    }
}
