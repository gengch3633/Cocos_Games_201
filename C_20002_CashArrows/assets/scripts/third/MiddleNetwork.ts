import ClientDataStore from "./ClientDataStore";
import CryptoHelper from "./CryptoHelper";
import HotUpdateManager from "./HotUpdateManager";
import { MIDDLE_PROJECT_ADAPTER_CONFIG } from "./MiddleProjectAdapterConfig";
import { MIDDLE_REQUEST_DESCRIPTORS } from "./MiddleRequestDescriptors";

const LOG_TAG = "[MiddleNetwork]";
const COUNTRY_STORAGE_KEY = "com.sdk.country";
const REFERRER_FIELDS = ["referrer_url", "referrer_timestamp_server", "install_timestamp_server", "oaid"];

function stringifySafe(value: any): string {
    try {
        return JSON.stringify(value);
    } catch (e) {
        return String(value);
    }
}

function parseJsonSafe(text: string): any {
    try {
        return JSON.parse(text);
    } catch (e) {
        return text;
    }
}

function dispatchHandler(handler: any, data?: any): void {
    if (!handler) {
        return;
    }
    if (typeof handler === "function") {
        handler(data);
    } else if (handler && typeof handler.runWith === "function") {
        handler.runWith(data);
    }
}

function mergeReferrerFields(target: any, source: any): any {
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

function buildQueryString(params: Record<string, any>): string {
    const parts: string[] = [];
    for (const key of Object.keys(params)) {
        const value = params[key];
        if (value != null) {
            parts.push(key + "=" + value);
        }
    }
    return parts.join("&");
}

function appendPkgToUrl(_unused: number, url: string): string {
    if (!url) {
        return "";
    }
    const separator = url.indexOf("?") >= 0 ? "&" : "?";
    return url.indexOf("pkg=") >= 0 ? url : "" + url + separator + "pkg=" + encodeURIComponent(ClientDataStore.box_pkg_name || "");
}

function extractPathFromUrl(url: string): string {
    return "/" + (url || "").split("?")[0].split("/").slice(3).join("/");
}

function isPayloadRequestType(type: string): boolean {
    return type === "APPLOG" || type === "ADSDK" || type === "COREDATA";
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

function resolveBaseVersion(): string {
    try {
        return HotUpdateManager.getInstance().getBaseVersion() || "";
    } catch (e) {
        return "";
    }
}

function enrichPayloadItem(item: any): void {
    const store = ClientDataStore as any;
    for (const key of Object.keys(store).filter((name) => typeof store[name] !== "function")) {
        item[key] = store[key];
    }
    const country = resolveCountry();
    item.game_version = resolveGameVersion();
    item.game_base_version = resolveBaseVersion();
    item.country = country;
    item.cy = country;
    item.game_name = MIDDLE_PROJECT_ADAPTER_CONFIG.gameName || "";
}

function enrichPayloadList(list: any[]): any[] {
    if (!Array.isArray(list) || list.length <= 0) {
        return list || [];
    }
    list.forEach((item) => {
        if (item && typeof item === "object") {
            enrichPayloadItem(item);
        }
    });
    return list;
}

function extractPayloadList(params: any): any[] {
    if (Array.isArray(params?.payload)) {
        return enrichPayloadList(params.payload);
    }
    if (Array.isArray(params?.list)) {
        return enrichPayloadList(params.list);
    }
    return [];
}

function buildRequestBody(type: string, params: any): string {
    const descriptor = MIDDLE_REQUEST_DESCRIPTORS[type];
    const timestamp = Math.floor(Date.now() / 1e3).toString();
    const nonce = ClientDataStore.uuid();
    const path = extractPathFromUrl(descriptor?.url || "");
    const ngister = CryptoHelper.ngister(
        path,
        timestamp,
        nonce,
        ClientDataStore.version_name,
        ClientDataStore.channel_name,
        ClientDataStore.device_id,
        ClientDataStore.box_pkg_name
    );
    const ds = params?.ds || ClientDataStore.ds || {
        ir: "0",
        ie: "0",
        irv: "0",
        ix: "0",
        ih: "0",
        io: "0",
        iw: "0",
        id: "0",
        ids: "0",
    };
    if (typeof params?.query === "string") {
        if (isPayloadRequestType(type)) {
            return JSON.stringify({
                payload: extractPayloadList(params),
                query: params.query,
                ds,
            });
        }
        const body: any = {
            query: params.query,
            ds,
        };
        if (type === "TFRegional") {
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
    for (const key of Object.keys(params || {})) {
        if (key !== "query" && key !== "ds" && queryParams[key] === undefined) {
            const value = params[key];
            if (value != null && typeof value !== "object") {
                queryParams[key] = String(value);
            }
        }
    }
    if (isPayloadRequestType(type)) {
        return JSON.stringify({
            payload: extractPayloadList(params),
            query: buildQueryString(queryParams),
            ds,
        });
    }
    return JSON.stringify({
        query: buildQueryString(queryParams),
        ds,
    });
}

export default class MiddleNetwork {
    static request(type: string, params: any, successHandler?: any, failHandler?: any): void {
        void (async () => {
            try {
                const result = await MiddleNetwork.requestAsync(type, params);
                dispatchHandler(successHandler, result);
            } catch (err) {
                dispatchHandler(failHandler, err);
            }
        })();
    }

    static requestAsync(type: string, params: any): Promise<any> {
        return new Promise((resolve, reject) => {
            const descriptor = MIDDLE_REQUEST_DESCRIPTORS[type];
            const baseUrl = descriptor?.url;
            if (!baseUrl) {
                reject({ code: -1, message: "descriptor url missing: " + type });
                return;
            }
            const url = appendPkgToUrl(0, baseUrl);
            const plainBody = buildRequestBody(type, params || {});
            const encryptedBody = CryptoHelper.encrypt(plainBody, ClientDataStore.box_pkg_name);
            const inputParams = params || {};
            const parsedPlain = parseJsonSafe(plainBody);
            console.log(LOG_TAG, "REQ", type, "url ->", url);
            console.log(LOG_TAG, "REQ", type, "baseUrl ->", baseUrl);
            console.log(LOG_TAG, "REQ", type, "input params ->", stringifySafe(inputParams));
            console.log(LOG_TAG, "REQ", type, "plain params ->", stringifySafe(parsedPlain));
            console.log(LOG_TAG, "REQ", type, "encrypted length ->", encryptedBody.length);

            const xhr = new XMLHttpRequest();
            xhr.timeout = 15000;
            xhr.onreadystatechange = () => {
                if (xhr.readyState !== 4) {
                    return;
                }
                const status = xhr.status;
                const raw = xhr.responseText || "";
                console.log(LOG_TAG, "RESP", type, "status ->", status, "raw length ->", raw.length);
                if (status < 200 || status >= 400 || !raw) {
                    reject({ code: -1, message: "http status " + status, http_status: status, raw });
                    return;
                }
                let decrypted = raw;
                try {
                    const decoded = CryptoHelper.decrypt(raw, ClientDataStore.box_pkg_name);
                    if (decoded) {
                        decrypted = decoded;
                    }
                } catch (err) {
                    console.warn(LOG_TAG, "DECRYPT_FAIL", type, err);
                }
                try {
                    const parsed = JSON.parse(decrypted);
                    if (parsed && (parsed.code === -1 || parsed.code === -1000)) {
                        reject(parsed);
                        return;
                    }
                    resolve(parsed);
                } catch (err) {
                    console.error(LOG_TAG, "RESP_PARSE_FAIL", type, err, "raw ->", raw);
                    reject({ code: -1, message: "response parse fail", raw });
                }
            };
            xhr.onerror = () => {
                reject({ code: -1, message: "xhr.error", http_status: xhr.status });
            };
            xhr.ontimeout = () => {
                reject({ code: -1, message: "xhr.timeout", http_status: xhr.status });
            };
            xhr.open("POST", url, true);
            xhr.setRequestHeader("Content-Type", "text/plain;charset=UTF-8");
            xhr.send(encryptedBody);
        });
    }

    static getSDKEvent(params: any, success?: any, fail?: any): void {
        this.request("event", params, success, fail);
    }

    static getMiddleCountry(params: any, success?: any, fail?: any): void {
        this.request("Regional", params, success, fail);
    }

    static trackAdSdk(params: any, success?: any, fail?: any): void {
        this.request("ADSDK", params, success, fail);
    }

    static trackCoreData(params: any, success?: any, fail?: any): void {
        this.request("COREDATA", params, success, fail);
    }

    static trackAppLog(params: any, success?: any, fail?: any): void {
        this.request("APPLOG", params, success, fail);
    }

    static getMiddleTFRegional(params: any, success?: any, fail?: any): void {
        this.request("TFRegional", params, success, fail);
    }

    static getPlatform(params: any, success?: any, fail?: any): void {
        this.request("Platform", params, success, fail);
    }

    static submitWithdrawal(params: any, success?: any, fail?: any): void {
        this.request("BindWithdrawal", params, success, fail);
    }

    static getAdConfig(params: any, success?: any, fail?: any): void {
        this.request("AdConfig", params, success, fail);
    }
}
