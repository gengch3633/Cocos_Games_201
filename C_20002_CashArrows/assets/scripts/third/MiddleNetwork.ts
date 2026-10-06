import { MIDDLE_REQUEST_DESCRIPTORS } from "./MiddleRequestDescriptors";
import { MIDDLE_PROJECT_ADAPTER_CONFIG } from "./MiddleProjectAdapterConfig";
import CryptoHelper from "./CryptoHelper";
import ClientDataStore from "./ClientDataStore";
import HotUpdateManager from "./HotUpdateManager";

const LOG_TAG = "[MiddleNetwork]";
const COUNTRY_KEY = "com.sdk.country";
const REFERRER_FIELDS = ["referrer_url", "referrer_timestamp_server", "install_timestamp_server", "oaid"];

type MiddleHandlerLike = ((data: unknown) => void) | { runWith(data: unknown): void } | null | undefined;

function stringifySafe(value: unknown): string {
    try {
        return JSON.stringify(value);
    } catch {
        return String(value);
    }
}

function parseMaybeJson(value: string): unknown {
    try {
        return JSON.parse(value);
    } catch {
        return value;
    }
}

function dispatchHandler(handler: MiddleHandlerLike, data: unknown): void {
    if (!handler) {
        return;
    }
    if (typeof handler === "function") {
        handler(data);
    } else if (handler && typeof handler.runWith === "function") {
        handler.runWith(data);
    }
}

function mergeReferrerFields(target: Record<string, unknown>, source: Record<string, unknown>): Record<string, unknown> {
    if (!source || typeof source !== "object") {
        return target;
    }
    for (const key of REFERRER_FIELDS) {
        const value = source[key];
        if (value != null) {
            target[key] = value;
        }
    }
    return target;
}

function buildQueryString(params: Record<string, unknown>): string {
    const parts: string[] = [];
    for (const key of Object.keys(params)) {
        const value = params[key];
        if (value != null) {
            parts.push(key + "=" + value);
        }
    }
    return parts.join("&");
}

function appendPackageQuery(_index: number, url: string): string {
    if (!url) {
        return "";
    }
    const separator = url.indexOf("?") >= 0 ? "&" : "?";
    return url.indexOf("pkg=") >= 0 ? url : url + separator + "pkg=" + encodeURIComponent(ClientDataStore.box_pkg_name || "");
}

function extractSignPath(url: string): string {
    return "/" + (url || "").split("?")[0].split("/").slice(3).join("/");
}

function isPayloadRequest(key: string): boolean {
    return key === "APPLOG" || key === "ADSDK" || key === "COREDATA";
}

function readCachedCountry(): string {
    try {
        const value = cc.sys.localStorage.getItem(COUNTRY_KEY);
        if (value) {
            return String(value).toUpperCase();
        }
    } catch {
        // ignore
    }
    return String(ClientDataStore.local_country || "").toUpperCase() || "IN";
}

function readGameVersion(): string {
    try {
        return HotUpdateManager.getInstance().getVersion() || ClientDataStore.version_name || "";
    } catch {
        return ClientDataStore.version_name || "";
    }
}

function readBaseVersion(): string {
    try {
        return HotUpdateManager.getInstance().getBaseVersion() || "";
    } catch {
        return "";
    }
}

function enrichPayloadItem(item: Record<string, unknown>): void {
    const country = readCachedCountry();
    item.game_version = readGameVersion();
    item.game_base_version = readBaseVersion();
    item.country = country;
    item.cy = country;
    item.game_name = MIDDLE_PROJECT_ADAPTER_CONFIG.gameName || "";
}

function normalizePayloadList(payload: unknown): unknown[] {
    if (!Array.isArray(payload) || payload.length <= 0) {
        return payload ? [...(payload as unknown[])] : [];
    }
    payload.forEach((item) => {
        if (item && typeof item === "object") {
            enrichPayloadItem(item as Record<string, unknown>);
        }
    });
    return payload;
}

function extractPayloadList(params: Record<string, unknown>): unknown[] {
    if (Array.isArray(params.payload)) {
        return normalizePayloadList(params.payload);
    }
    if (Array.isArray(params.list)) {
        return normalizePayloadList(params.list);
    }
    return [];
}

function buildRequestBody(key: string, params: Record<string, unknown>): string {
    const descriptor = MIDDLE_REQUEST_DESCRIPTORS[key as keyof typeof MIDDLE_REQUEST_DESCRIPTORS];
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const nonce = ClientDataStore.uuid();
    const signPath = extractSignPath(descriptor?.url || "");
    const ngister = CryptoHelper.ngister(
        signPath,
        timestamp,
        nonce,
        ClientDataStore.version_name,
        ClientDataStore.channel_name,
        ClientDataStore.device_id,
        ClientDataStore.box_pkg_name,
    );
    const ds = params.ds || ClientDataStore.ds || { ir: "0", ie: "0", irv: "0", ix: "0", ih: "0", io: "0", iw: "0", id: "0", ids: "0" };

    if (typeof params.query === "string") {
        if (isPayloadRequest(key)) {
            return JSON.stringify({ payload: extractPayloadList(params), query: params.query, ds });
        }
        const body: Record<string, unknown> = { query: params.query, ds };
        if (key === "TFRegional") {
            mergeReferrerFields(body, params);
        }
        return JSON.stringify(body);
    }

    const queryParams: Record<string, string> = {
        is_test: "false",
        version_name: ClientDataStore.version_name,
        version_code: "0",
        channel_name: ClientDataStore.channel_name,
        box_pkg_name: ClientDataStore.box_pkg_name,
        network_type: ClientDataStore.network_type,
        et: timestamp,
        nonce_str: nonce,
        ngister,
        sign_type: "3",
        platform: ClientDataStore.os_name,
        android_id: ClientDataStore.android_id,
        device_id: ClientDataStore.device_id,
        country: "",
        local_country: ClientDataStore.local_country,
        oaid: ClientDataStore.oaid,
    };

    for (const field of Object.keys(params)) {
        if (field !== "query" && field !== "ds" && queryParams[field] === undefined) {
            const value = params[field];
            if (value != null && typeof value !== "object") {
                queryParams[field] = String(value);
            }
        }
    }

    if (isPayloadRequest(key)) {
        return JSON.stringify({ payload: extractPayloadList(params), query: buildQueryString(queryParams), ds });
    }
    return JSON.stringify({ query: buildQueryString(queryParams), ds });
}

export default class MiddleNetwork {
    static request(key: string, params: Record<string, unknown>, onSuccess: MiddleHandlerLike, onFail: MiddleHandlerLike): void {
        const descriptor = MIDDLE_REQUEST_DESCRIPTORS[key as keyof typeof MIDDLE_REQUEST_DESCRIPTORS];
        const baseUrl = descriptor?.url;
        if (!baseUrl) {
            dispatchHandler(onFail, { code: -1, message: "descriptor url missing: " + key });
            return;
        }

        const url = appendPackageQuery(0, baseUrl);
        const body = buildRequestBody(key, params || {});
        const encrypted = CryptoHelper.encrypt(body, ClientDataStore.box_pkg_name);
        const plain = parseMaybeJson(body) as Record<string, unknown>;

        console.log(LOG_TAG, "REQ", key, "url ->", url);
        console.log(LOG_TAG, "REQ", key, "baseUrl ->", baseUrl);
        console.log(LOG_TAG, "REQ", key, "input params ->", stringifySafe(params));
        console.log(LOG_TAG, "REQ", key, "plain params ->", stringifySafe(plain));
        console.log(LOG_TAG, "REQ", key, "encrypted length ->", encrypted.length);

        const xhr = new XMLHttpRequest();
        xhr.timeout = 15000;
        xhr.onreadystatechange = () => {
            if (xhr.readyState !== 4) {
                return;
            }
            const status = xhr.status;
            const raw = xhr.responseText || "";
            console.log(LOG_TAG, "RESP", key, "status ->", status, "raw length ->", raw.length);
            if (status < 200 || status >= 400 || !raw) {
                dispatchHandler(onFail, { code: -1, message: "http status " + status, http_status: status, raw });
                return;
            }
            let text = raw;
            try {
                const decrypted = CryptoHelper.decrypt(raw, ClientDataStore.box_pkg_name);
                if (decrypted) {
                    text = decrypted;
                }
            } catch (error) {
                console.warn(LOG_TAG, "DECRYPT_FAIL", key, error);
            }
            try {
                const parsed = JSON.parse(text);
                if (parsed && (parsed.code === -1 || parsed.code === -1000)) {
                    dispatchHandler(onFail, parsed);
                    return;
                }
                dispatchHandler(onSuccess, parsed);
            } catch (error) {
                console.error(LOG_TAG, "RESP_PARSE_FAIL", key, error, "raw ->", raw);
                dispatchHandler(onFail, { code: -1, message: "response parse fail", raw });
            }
        };
        xhr.onerror = () => dispatchHandler(onFail, { code: -1, message: "xhr.error", http_status: xhr.status });
        xhr.ontimeout = () => dispatchHandler(onFail, { code: -1, message: "xhr.timeout", http_status: xhr.status });
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "text/plain;charset=UTF-8");
        xhr.send(encrypted);
    }

    static getSDKEvent(params: Record<string, unknown>, onSuccess: MiddleHandlerLike, onFail: MiddleHandlerLike): void {
        this.request("event", params, onSuccess, onFail);
    }

    static getMiddleCountry(params: Record<string, unknown>, onSuccess: MiddleHandlerLike, onFail: MiddleHandlerLike): void {
        this.request("Regional", params, onSuccess, onFail);
    }

    static trackAdSdk(params: Record<string, unknown>, onSuccess: MiddleHandlerLike, onFail: MiddleHandlerLike): void {
        this.request("ADSDK", params, onSuccess, onFail);
    }

    static trackCoreData(params: Record<string, unknown>, onSuccess: MiddleHandlerLike, onFail: MiddleHandlerLike): void {
        this.request("COREDATA", params, onSuccess, onFail);
    }

    static trackAppLog(params: Record<string, unknown>, onSuccess: MiddleHandlerLike, onFail: MiddleHandlerLike): void {
        this.request("APPLOG", params, onSuccess, onFail);
    }

    static getMiddleTFRegional(params: Record<string, unknown>, onSuccess: MiddleHandlerLike, onFail: MiddleHandlerLike): void {
        this.request("TFRegional", params, onSuccess, onFail);
    }

    static getPlatform(params: Record<string, unknown>, onSuccess: MiddleHandlerLike, onFail: MiddleHandlerLike): void {
        this.request("Platform", params, onSuccess, onFail);
    }

    static submitWithdrawal(params: Record<string, unknown>, onSuccess: MiddleHandlerLike, onFail: MiddleHandlerLike): void {
        this.request("BindWithdrawal", params, onSuccess, onFail);
    }

    static getAdConfig(params: Record<string, unknown>, onSuccess: MiddleHandlerLike, onFail: MiddleHandlerLike): void {
        this.request("AdConfig", params, onSuccess, onFail);
    }
}
