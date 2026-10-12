import ClientDataStore from "./ClientDataStore";
import CryptoHelper from "./CryptoHelper";
import HotUpdateManager from "./HotUpdateManager";
import MiddleProjectAdapterConfig from "./MiddleProjectAdapterConfig";
import MiddleRequestDescriptors from "./MiddleRequestDescriptors";

const LOG_TAG = "[MiddleNetwork]";
const COUNTRY_STORAGE_KEY = "com.sdk.country";

const MIDDLE_QUERY_EXTRA_KEYS: string[] = [
    "referrer_url",
    "referrer_timestamp_server",
    "install_timestamp_server",
    "oaid"
];

function safeStringify(value: any): string {
    try {
        return JSON.stringify(value);
    } catch (e) {
        return String(value);
    }
}

function safeParse(text: any): any {
    try {
        return JSON.parse(text);
    } catch (e) {
        return text;
    }
}

function invokeCallback(callback: any, data: any): void {
    if (!callback) {
        return;
    }
    if (typeof callback !== "function") {
        if (typeof callback.runWith === "function") {
            callback.runWith(data);
        }
        return;
    }
    callback(data);
}

function applyMiddlewareMeta(target: any, source: any): any {
    if (!source || typeof source !== "object") {
        return target;
    }
    for (const key of MIDDLE_QUERY_EXTRA_KEYS) {
        const value = source[key];
        if (value !== null && value !== undefined) {
            target[key] = value;
        }
    }
    return target;
}

function buildQueryString(params: any): string {
    const parts: string[] = [];
    for (const key of Object.keys(params)) {
        const value = params[key];
        if (value !== null && value !== undefined) {
            parts.push(key + "=" + value);
        }
    }
    return parts.join("&");
}

function appendPkgParam(_tag: number, baseUrl: string): string {
    if (!baseUrl) {
        return "";
    }
    const separator = baseUrl.indexOf("?") >= 0 ? "&" : "?";
    if (baseUrl.indexOf("pkg=") >= 0) {
        return baseUrl;
    }
    return baseUrl + separator + "pkg=" + encodeURIComponent(ClientDataStore.box_pkg_name || "");
}

function normalizeUrlPath(url: string): string {
    return "/" + (url || "").split("?")[0].split("/").slice(3).join("/");
}

function isPassthroughRequest(descriptorKey: string): boolean {
    return descriptorKey === "APPLOG" || descriptorKey === "ADSDK" || descriptorKey === "COREDATA";
}

function resolveCountry(): string {
    try {
        const stored = cc.sys.localStorage.getItem(COUNTRY_STORAGE_KEY);
        if (stored) {
            return String(stored).toUpperCase();
        }
    } catch (e) {
    }
    return String(ClientDataStore.local_country || "").toUpperCase() || "IN";
}

function resolveGameVersion(): string {
    try {
        return HotUpdateManager.getInstance().getVersion() || ClientDataStore.version_name || "";
    } catch (e) {
        return ClientDataStore.version_name || "";
    }
}

function resolveGameBaseVersion(): string {
    try {
        return HotUpdateManager.getInstance().getBaseVersion() || "";
    } catch (e) {
        return "";
    }
}

function attachClientData(target: any): void {
    const source: any = ClientDataStore;
    const keys = Object.keys(source).filter((key) => typeof source[key] !== "function");
    for (const key of keys) {
        target[key] = source[key];
    }
    const country = resolveCountry();
    target.game_version = resolveGameVersion();
    target.game_base_version = resolveGameBaseVersion();
    target.country = country;
    target.cy = country;
    target.game_name = MiddleProjectAdapterConfig.MIDDLE_PROJECT_ADAPTER_CONFIG.gameName || "";
}

function decoratePayloadList(list: any): any[] {
    if (!Array.isArray(list) || list.length <= 0) {
        return list || [];
    }
    list.forEach((item: any) => {
        if (item && typeof item === "object") {
            attachClientData(item);
        }
    });
    return list;
}

function extractPayloadList(params: any): any[] {
    if (params && Array.isArray(params.payload)) {
        return decoratePayloadList(params.payload);
    }
    if (params && Array.isArray(params.list)) {
        return decoratePayloadList(params.list);
    }
    return [];
}

function buildRequestPayload(descriptorKey: string, inputParams?: any): string {
    const params = inputParams || {};
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const nonceStr = ClientDataStore.uuid();
    const descriptor = MiddleRequestDescriptors.MIDDLE_REQUEST_DESCRIPTORS[descriptorKey];
    const rawUrl = (descriptor && descriptor.url) || "";
    const urlPath = normalizeUrlPath(rawUrl);
    const ngister = CryptoHelper.ngister(
        urlPath,
        timestamp,
        nonceStr,
        ClientDataStore.version_name,
        ClientDataStore.channel_name,
        ClientDataStore.device_id,
        ClientDataStore.box_pkg_name
    );
    const ds = params.ds || ClientDataStore.ds || {
        ir: "0",
        ie: "0",
        irv: "0",
        ix: "0",
        ih: "0",
        io: "0",
        iw: "0",
        id: "0",
        ids: "0"
    };

    if (typeof params.query === "string") {
        if (isPassthroughRequest(descriptorKey)) {
            return JSON.stringify({
                payload: extractPayloadList(params),
                query: params.query,
                ds: ds
            });
        }
        const queryWrapper: any = {
            query: params.query,
            ds: ds
        };
        if (descriptorKey === "TFRegional") {
            applyMiddlewareMeta(queryWrapper, params);
        }
        return JSON.stringify(queryWrapper);
    }

    const queryParams: any = {
        is_test: "false",
        version_name: ClientDataStore.version_name,
        version_code: "0",
        channel_name: ClientDataStore.channel_name,
        box_pkg_name: ClientDataStore.box_pkg_name,
        network_type: ClientDataStore.network_type,
        et: timestamp,
        nonce_str: nonceStr,
        ngister: ngister,
        sign_type: "3",
        platform: ClientDataStore.os_name,
        android_id: ClientDataStore.android_id,
        device_id: ClientDataStore.device_id,
        country: "",
        local_country: ClientDataStore.local_country,
        oaid: ClientDataStore.oaid
    };

    for (const key of Object.keys(params)) {
        if (key === "query" || key === "ds") {
            continue;
        }
        if (queryParams[key] !== undefined) {
            continue;
        }
        const value = params[key];
        if (value !== null && value !== undefined && typeof value !== "object") {
            queryParams[key] = String(value);
        }
    }

    if (isPassthroughRequest(descriptorKey)) {
        return JSON.stringify({
            payload: extractPayloadList(params),
            query: buildQueryString(queryParams),
            ds: ds
        });
    }

    return JSON.stringify({
        query: buildQueryString(queryParams),
        ds: ds
    });
}

export default class MiddleNetwork {

    public static request(descriptorKey: string, params: any, onSuccess?: any, onFail?: any): void {
        const descriptor = MiddleRequestDescriptors.MIDDLE_REQUEST_DESCRIPTORS[descriptorKey];
        const baseUrl = descriptor && descriptor.url;

        if (!baseUrl) {
            invokeCallback(onFail, {
                code: -1,
                message: "descriptor url missing: " + descriptorKey
            });
            return;
        }

        const url = appendPkgParam(0, baseUrl);
        const plainPayload = buildRequestPayload(descriptorKey, params);
        const encryptedPayload = CryptoHelper.encrypt(plainPayload, ClientDataStore.box_pkg_name);
        const inputParams = params || {};
        const parsedPayload = safeParse(plainPayload);

        console.log(LOG_TAG, "REQ", descriptorKey, "url ->", url);
        console.log(LOG_TAG, "REQ", descriptorKey, "baseUrl ->", baseUrl);
        console.log(LOG_TAG, "REQ", descriptorKey, "input params ->", safeStringify(inputParams));
        console.log(LOG_TAG, "REQ", descriptorKey, "plain params ->", safeStringify(parsedPayload));
        console.log(LOG_TAG, "REQ", descriptorKey, "encrypted length ->", encryptedPayload.length);

        const xhr = new XMLHttpRequest();
        xhr.timeout = 15000;

        xhr.onreadystatechange = function (): void {
            if (xhr.readyState !== 4) {
                return;
            }
            const status = xhr.status;
            const raw = xhr.responseText || "";
            console.log(LOG_TAG, "RESP", descriptorKey, "status ->", status, "raw length ->", raw.length);

            if (status < 200 || status >= 400 || !raw) {
                invokeCallback(onFail, {
                    code: -1,
                    message: "http status " + status,
                    http_status: status,
                    raw: raw
                });
                return;
            }

            let text = raw;
            try {
                const decrypted = CryptoHelper.decrypt(raw, ClientDataStore.box_pkg_name);
                if (decrypted) {
                    text = decrypted;
                }
            } catch (e) {
                console.warn(LOG_TAG, "DECRYPT_FAIL", descriptorKey, e);
            }

            try {
                const json = JSON.parse(text);
                if (json && (json.code === -1 || json.code === -1000)) {
                    invokeCallback(onFail, json);
                    return;
                }
                invokeCallback(onSuccess, json);
            } catch (e) {
                console.error(LOG_TAG, "RESP_PARSE_FAIL", descriptorKey, e, "raw ->", raw);
                invokeCallback(onFail, {
                    code: -1,
                    message: "response parse fail",
                    raw: raw
                });
            }
        };

        xhr.onerror = function (): void {
            invokeCallback(onFail, {
                code: -1,
                message: "xhr.error",
                http_status: xhr.status
            });
        };

        xhr.ontimeout = function (): void {
            invokeCallback(onFail, {
                code: -1,
                message: "xhr.timeout",
                http_status: xhr.status
            });
        };

        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "text/plain;charset=UTF-8");
        xhr.send(encryptedPayload);
    }

    public static getSDKEvent(params: any, onSuccess?: any, onFail?: any): void {
        MiddleNetwork.request("event", params, onSuccess, onFail);
    }

    public static getMiddleCountry(params: any, onSuccess?: any, onFail?: any): void {
        MiddleNetwork.request("Regional", params, onSuccess, onFail);
    }

    public static trackAdSdk(params: any, onSuccess?: any, onFail?: any): void {
        MiddleNetwork.request("ADSDK", params, onSuccess, onFail);
    }

    public static trackCoreData(params: any, onSuccess?: any, onFail?: any): void {
        MiddleNetwork.request("COREDATA", params, onSuccess, onFail);
    }

    public static trackAppLog(params: any, onSuccess?: any, onFail?: any): void {
        MiddleNetwork.request("APPLOG", params, onSuccess, onFail);
    }

    public static getMiddleTFRegional(params: any, onSuccess?: any, onFail?: any): void {
        MiddleNetwork.request("TFRegional", params, onSuccess, onFail);
    }

    public static getPlatform(params: any, onSuccess?: any, onFail?: any): void {
        MiddleNetwork.request("Platform", params, onSuccess, onFail);
    }

    public static submitWithdrawal(params: any, onSuccess?: any, onFail?: any): void {
        MiddleNetwork.request("BindWithdrawal", params, onSuccess, onFail);
    }

    public static getAdConfig(params: any, onSuccess?: any, onFail?: any): void {
        MiddleNetwork.request("AdConfig", params, onSuccess, onFail);
    }
}