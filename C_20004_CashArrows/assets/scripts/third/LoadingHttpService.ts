import BusinessAnalyticsService from "./BusinessAnalyticsService";
import BusinessRequestDescriptors from "./BusinessRequestDescriptors";
import ClientDataStore from "./ClientDataStore";
import CryptoHelper from "./CryptoHelper";
import RequestDescriptor from "./RequestDescriptor";
import RequestQueueEngine from "./RequestQueueEngine";
import SystemDataStore from "./SystemDataStore";

const LOG_TAG = "[MigrationBundle][HTTP]";
const HTTP_MONITOR_RATE = 5;
const SDK_WD_BASE = "https://hxjxd.casharrows.com/vunuar/";
const SDK_WD_URI = "c_l";
const SDK_WD_VERIFY_URI = "ck_i";

interface HttpCallbackHandle {
    runWith(data: any): void;
}

interface XhrTrace {
    requestKey: string;
    uri: string;
    startedAt: number;
    businessPlainData?: any;
}

interface RequestContext {
    url: string;
    reqData: HttpRequestPayload;
    requestBody?: string;
    responseText?: string;
    status: number;
    reason?: string;
}

interface HttpParseResult {
    success: boolean;
    data: any;
}

interface EngineOptions {
    shouldEnqueue: (dispatcher: HttpResultDispatcher) => boolean;
    shouldRetry: (dispatcher: HttpResultDispatcher) => boolean;
    refreshUrlOnRetry: () => string;
    onRetry: (error: any, dispatcher: HttpResultDispatcher) => void;
    onQueueCallback: () => void;
    parseSuccessResponse: (context: RequestContext) => HttpParseResult;
    buildRequestBody: (reqData: HttpRequestPayload) => string;
    onRequestStart: (context: RequestContext) => void;
    createStatusError: (context: RequestContext) => any;
    createRuntimeError: (context: RequestContext) => any;
    dispatchResult: (dispatcher: HttpResultDispatcher, success: boolean, data: any) => void;
}

interface LogPayload {
    requestKey?: string;
    uri?: string;
    url?: string;
    status?: number;
    code?: number;
    method?: string;
    elapsedMs?: number;
    message?: any;
}

function now(): number {
    return Date.now();
}

function safeStringify(value: any): string {
    try {
        return JSON.stringify(value);
    } catch (error) {
        return String(value);
    }
}

function logDetail(title: string, parts?: any[]): void {
    const detail = (parts || [])
        .map((item) => String(item || "").trim())
        .filter(Boolean)
        .join(" | ");
    console.log(title + (detail ? " | " + detail : ""));
}

function logEvent(event: string, payload: LogPayload): void {
    (window as any).forceLog = true;
    const detail = [
        payload.requestKey ? "key=" + payload.requestKey : "",
        payload.uri ? "uri=" + payload.uri : "",
        payload.url ? "url=" + payload.url : "",
        undefined !== payload.status ? "status=" + payload.status : "",
        undefined !== payload.code ? "code=" + payload.code : "",
        payload.method ? "method=" + payload.method : "",
        undefined !== payload.elapsedMs ? "cost=" + payload.elapsedMs + "ms" : "",
        payload.message ? "msg=" + payload.message : "",
    ]
        .filter(Boolean)
        .join(" | ");
    console.log(LOG_TAG + " " + event + (detail ? " | " + detail : ""));
}

function reportEvent(eventName: string, data: any): void {
    BusinessAnalyticsService.reportData(eventName, data);
}

function maybeReportMonitor(path: string, status: any, elapsedMs: any): void {
    if (HTTP_MONITOR_RATE >= 100 || (HTTP_MONITOR_RATE > 0 && 100 * Math.random() < HTTP_MONITOR_RATE)) {
        reportEvent("http_monitor", {
            request_path: path || "",
            request_url: path || "",
            response_code: Number(status) || 0,
            response_time: Math.max(0, Math.floor(Number(elapsedMs) || 0)),
        });
    }
}

function reportIpErr(errType: string): void {
    reportEvent("ip_request_err", {
        err_type: errType,
    });
}

const descriptorRegistry = new RequestDescriptor(BusinessRequestDescriptors.BUSINESS_REQUEST_DESCRIPTORS);

class HttpRequestPayload {
    private _data: { [key: string]: any } = {};
    private _trace: XhrTrace;

    public constructor(trace: XhrTrace) {
        this._trace = trace;
        const yid = ClientDataStore.yid || "";
        this._data.yid = "yid_read_fail" === yid || "yid_read_failed" === yid ? "" : yid;
        this._data.device_id = ClientDataStore.device_id || "";
    }

    public append(key: string, value: any): void {
        this._data[key] = value;
    }

    public toJSON(): string {
        return JSON.stringify(this._data);
    }

    public toText(): string {
        return CryptoHelper.encrypt(this.toJSON(), ClientDataStore.box_pkg_name);
    }

    public trace(): XhrTrace {
        return this._trace;
    }
}

class HttpResultDispatcher {
    private _successHandle: HttpCallbackHandle | null;
    private _failHandle: HttpCallbackHandle | null;
    private _enqueue: boolean;
    private _retry: boolean;

    public constructor(
        requestKey: string,
        successHandle: HttpCallbackHandle | null,
        failHandle: HttpCallbackHandle | null
    ) {
        this._successHandle = successHandle;
        this._failHandle = failHandle;
        this._enqueue = descriptorRegistry.needEnqueue(requestKey);
        this._retry = this._enqueue;
    }

    public success(data: any): void {
        if (this._successHandle) {
            this._successHandle.runWith(data);
        }
    }

    public fail(data: any): boolean {
        if (this._failHandle) {
            this._failHandle.runWith(data);
        }
        return this._retry;
    }

    public enterQueue(): boolean {
        return this._enqueue;
    }

    public needRetry(): boolean {
        return this._retry;
    }
}

function buildLParams(uri: string, gameVersion: string): { [key: string]: any } {
    const params: { [key: string]: any } = {};
    const pairs = ClientDataStore.commonUrlStr.split("&");
    for (let i = 0; i < pairs.length; i++) {
        const segments = pairs[i].split("=");
        const key = segments[0];
        const value = segments[1];
        if (key) {
            params[key] = value;
        }
    }
    const et = Math.floor(Date.now() / 1e3);
    const nonceStr = ClientDataStore.uuid();
    params.nonce_str = nonceStr;
    params.et = et;
    params.ngister = CryptoHelper.ngister(
        "/" + uri,
        et.toString(),
        nonceStr,
        ClientDataStore.version_name,
        ClientDataStore.channel_name,
        ClientDataStore.device_id,
        ClientDataStore.box_pkg_name
    );
    params.game_version = gameVersion;
    return params;
}

function buildRequestPayload(body: any, requestKey: string, gameVersion: string): HttpRequestPayload {
    const uri = descriptorRegistry.getUri(requestKey);
    const payload = new HttpRequestPayload({
        requestKey: requestKey,
        uri: uri,
        startedAt: now(),
    });
    const requestData = Object.assign({}, body);
    requestData.l_params = buildLParams(uri, gameVersion);
    payload.trace().businessPlainData = requestData;

    const url = resolveRequestUrl(requestKey);
    logDetail(LOG_TAG + " REQ_PARAMS | key=" + requestKey, [
        "  method      : POST",
        "  contentType : text/plain",
        "  url         : " + url,
        "  yid         : " + ClientDataStore.yid,
        "  device_id   : " + ClientDataStore.device_id,
        "  l_params    : " + safeStringify(requestData.l_params),
        "  data        : " + safeStringify(requestData),
    ]);

    const encryptedBody = SystemDataStore.encrypt
        ? CryptoHelper.encrypt(JSON.stringify(requestData), ClientDataStore.box_pkg_name)
        : JSON.stringify(requestData);
    payload.append("business_data", encryptedBody);
    return payload;
}

function resolveRequestUrl(requestKey: string): string {
    const country = ClientDataStore.local_country || "";
    return (
        SystemDataStore.get_request_url() +
        descriptorRegistry.getUri(requestKey) +
        "?pkg=" +
        ClientDataStore.package_name +
        "&cy=" +
        country
    );
}

function createEngineOptions(onRetryRequest: (error: any, dispatcher: HttpResultDispatcher) => void): EngineOptions {
    return {
        shouldEnqueue: (dispatcher) => dispatcher.enterQueue(),
        shouldRetry: (dispatcher) => dispatcher.needRetry(),
        refreshUrlOnRetry: () => "",
        onRetry: (error, dispatcher) => {
            logEvent("RETRY", {
                message: safeStringify(error),
            });
            onRetryRequest(error, dispatcher);
        },
        onQueueCallback: () => {},
        parseSuccessResponse: (context: RequestContext): HttpParseResult => {
            const url = context.url;
            const reqData = context.reqData;
            const responseText = context.responseText || "";
            const status = context.status;
            const trace = reqData.trace();
            const elapsedMs = now() - trace.startedAt;
            maybeReportMonitor(url, status, elapsedMs);

            if (!responseText) {
                reportIpErr("onreadystatechange");
                logEvent("FAIL", {
                    requestKey: trace.requestKey,
                    uri: trace.uri,
                    url: url,
                    status: status,
                    elapsedMs: elapsedMs,
                    message: "response empty",
                });
                return {
                    success: false,
                    data: {
                        code: -1,
                        message: "返回数据不存在",
                    },
                };
            }

            let decoded = responseText;
            try {
                const decrypted = CryptoHelper.decrypt(responseText, ClientDataStore.box_pkg_name);
                if (decrypted) {
                    decoded = decrypted;
                }
            } catch (error) {
                console.warn(LOG_TAG + " DECRYPT_FAIL | key=" + trace.requestKey + " | url=" + url, error);
            }

            let parsed: any;
            try {
                parsed = JSON.parse(decoded);
            } catch (error) {
                reportIpErr("parseErr");
                logEvent("FAIL", {
                    requestKey: trace.requestKey,
                    uri: trace.uri,
                    url: url,
                    status: status,
                    elapsedMs: elapsedMs,
                    message: "response parse fail",
                });
                console.error(LOG_TAG + " RESP_PARSE_FAIL | key=" + trace.requestKey + " | raw=" + responseText);
                return {
                    success: false,
                    data: {
                        code: -1,
                        message: "响应解析失败",
                        raw: responseText,
                    },
                };
            }

            logDetail(LOG_TAG + " RESP_BODY | key=" + trace.requestKey, [
                "  method      : POST",
                "  url         : " + url,
                "  status      : " + status,
                "  body        : " + decoded,
            ]);

            if (-1 === parsed.code || -1e3 === parsed.code) {
                logEvent("FAIL", {
                    requestKey: trace.requestKey,
                    uri: trace.uri,
                    url: url,
                    status: status,
                    code: parsed.code,
                    elapsedMs: elapsedMs,
                    message: parsed.message,
                });
                return {
                    success: false,
                    data: parsed,
                };
            }

            logEvent("SUCCESS", {
                requestKey: trace.requestKey,
                uri: trace.uri,
                url: url,
                status: status,
                code: parsed.code,
                elapsedMs: elapsedMs,
            });
            return {
                success: true,
                data: parsed,
            };
        },
        buildRequestBody: (reqData: HttpRequestPayload): string => {
            const trace = reqData.trace();
            const rawBody = reqData.toJSON();
            const encryptedBody = reqData.toText();
            logDetail(LOG_TAG + " REQ_BODY | key=" + trace.requestKey + " | uri=" + trace.uri, [
                "  business_plain: " + safeStringify(trace.businessPlainData || {}),
                "  raw_body      : " + rawBody,
                "  encrypted_body: " + encryptedBody,
            ]);
            return encryptedBody;
        },
        onRequestStart: (context: RequestContext): void => {
            const trace = context.reqData.trace();
            trace.startedAt = now();
            logEvent("START", {
                requestKey: trace.requestKey,
                uri: trace.uri,
                url: context.url,
                method: "POST",
            });
            logDetail(LOG_TAG + " START_DETAIL | key=" + trace.requestKey + " | uri=" + trace.uri, [
                "  method      : POST",
                "  contentType : text/plain",
                "  url         : " + context.url,
                "  body_size   : " + String(context.requestBody || "").length,
                "  body        : " + String(context.requestBody || ""),
            ]);
        },
        createStatusError: (context: RequestContext): any => {
            const trace = context.reqData.trace();
            const elapsedMs = now() - trace.startedAt;
            maybeReportMonitor(context.url, context.status, elapsedMs);
            reportIpErr("onreadystatechange");
            logEvent("FAIL", {
                requestKey: trace.requestKey,
                uri: trace.uri,
                url: context.url,
                status: context.status,
                elapsedMs: elapsedMs,
                message: "xhr.status" + context.status,
            });
            return {
                code: -1,
                message: "xhr.status" + context.status,
                http_status: context.status,
            };
        },
        createRuntimeError: (context: RequestContext): any => {
            const trace = context.reqData.trace();
            const elapsedMs = now() - trace.startedAt;
            maybeReportMonitor(context.url, context.status, elapsedMs);
            reportIpErr("timeout" === context.reason ? "ontimeout" : "onerror");
            logEvent("FAIL", {
                requestKey: trace.requestKey,
                uri: trace.uri,
                url: context.url,
                status: context.status,
                elapsedMs: elapsedMs,
                message: "onXhr." + context.reason,
            });
            return {
                code: -1,
                message: "onXhr." + context.reason,
                http_status: context.status,
            };
        },
        dispatchResult: (dispatcher: HttpResultDispatcher, success: boolean, data: any): void => {
            if (!dispatcher) {
                return;
            }
            if (success) {
                dispatcher.success(data);
            } else {
                dispatcher.fail(data);
            }
        },
    };
}

export default class LoadingHttpService {
    private static engine: any = null;
    private static gameVersion: string = "1.0.0.0";
    private static readonly SDK_WD_BASE: string = SDK_WD_BASE;
    private static readonly SDK_WD_URI: string = SDK_WD_URI;
    private static readonly SDK_WD_VERIFY_URI: string = SDK_WD_VERIFY_URI;

    public static reportHttpErr(err: any): void {
        reportEvent("httpErr", {
            response: safeStringify(err),
            category: "network_error",
        });
    }

    public static init(onRetryRequest: (error: any, dispatcher: HttpResultDispatcher) => void): void {
        if (!this.engine) {
            this.engine = new RequestQueueEngine(createEngineOptions(onRetryRequest));
        }
    }

    public static setGameVersion(version: string): void {
        this.gameVersion = version;
    }

    public static request(
        requestKey: string,
        body: any,
        successHandle: HttpCallbackHandle | null,
        failHandle: HttpCallbackHandle | null
    ): void {
        const url = resolveRequestUrl(requestKey);
        const payload = buildRequestPayload(body || {}, requestKey, this.gameVersion);
        const dispatcher = new HttpResultDispatcher(requestKey, successHandle, failHandle);
        this.engine.queuePost(url, payload, dispatcher);
    }

    public static syncFirebaseToken(
        token: string,
        successHandle: HttpCallbackHandle | null,
        failHandle: HttpCallbackHandle | null
    ): void {
        reportEvent("sync_firebase_token", {
            firebase_token: token,
        });
        const trimmed = String(token || "").trim();
        if (trimmed) {
            this.request("FirebaseToken", { firebase_token: trimmed }, successHandle, failHandle);
        } else if (failHandle) {
            failHandle.runWith({
                code: -1,
                message: "firebase_token empty",
            });
        }
    }

    public static getSystemConfig(successHandle: HttpCallbackHandle | null, failHandle: HttpCallbackHandle | null): void {
        this.request("config", null, successHandle, failHandle);
    }

    public static autoLogin(
        body: any,
        successHandle: HttpCallbackHandle | null,
        failHandle: HttpCallbackHandle | null
    ): void {
        this.request("auto_submit", body, successHandle, failHandle);
    }

    public static touristsLogin(
        body: any,
        successHandle: HttpCallbackHandle | null,
        failHandle: HttpCallbackHandle | null
    ): void {
        this.request("TouristLogin", body, successHandle, failHandle);
    }

    public static getGameConfig(successHandle: HttpCallbackHandle | null, failHandle: HttpCallbackHandle | null): void {
        this.request("GetGameConfig", null, successHandle, failHandle);
    }

    public static getUserInfo(successHandle: HttpCallbackHandle | null, failHandle: HttpCallbackHandle | null): void {
        this.request("UserInfo", null, successHandle, failHandle);
    }

    public static getWithdrawInfo(successHandle: HttpCallbackHandle | null, failHandle: HttpCallbackHandle | null): void {
        this.request("WithdrawInfo", null, successHandle, failHandle);
    }

    public static withdrawCash(
        body: any,
        successHandle: HttpCallbackHandle | null,
        failHandle: HttpCallbackHandle | null
    ): void {
        this.request("WithdrawCash", body, successHandle, failHandle);
    }

    public static bindTxAccount(
        body: any,
        successHandle: HttpCallbackHandle | null,
        failHandle: HttpCallbackHandle | null
    ): void {
        this.request("BindTxAccount", body, successHandle, failHandle);
    }

    public static getBarrageList(successHandle: HttpCallbackHandle | null, failHandle: HttpCallbackHandle | null): void {
        this.request("BarrageList", null, successHandle, failHandle);
    }

    public static getTaskInfo(
        taskTypeOrSuccess: string | HttpCallbackHandle | null,
        successOrFail?: HttpCallbackHandle | null,
        failHandle?: HttpCallbackHandle | null
    ): void {
        let taskType = "";
        let onSuccess: HttpCallbackHandle | null = null;
        let onFail: HttpCallbackHandle | null = null;

        if ("string" === typeof taskTypeOrSuccess) {
            taskType = taskTypeOrSuccess || "";
            onSuccess = (successOrFail as HttpCallbackHandle | null) || null;
            onFail = failHandle || null;
        } else {
            onSuccess = (taskTypeOrSuccess as HttpCallbackHandle | null) || null;
            onFail = (successOrFail as HttpCallbackHandle | null) || null;
        }

        const body: { [key: string]: any } = {};
        if (taskType) {
            body.task_type = taskType;
        }
        this.request("TaskInfo", Object.keys(body).length > 0 ? body : null, onSuccess, onFail);
    }

    public static claimTaskReward(
        taskId: string,
        taskType: string | null,
        successHandle: HttpCallbackHandle | null,
        failHandle: HttpCallbackHandle | null
    ): void {
        const body: { [key: string]: any } = {
            task_id: taskId || "",
        };
        if (taskType) {
            body.task_type = taskType;
        }
        this.request("TaskOnlyReward", body, successHandle, failHandle);
    }

    public static claimTaskAdReward(
        taskId: string,
        body: any,
        taskType: string | null,
        successHandle: HttpCallbackHandle | null,
        failHandle: HttpCallbackHandle | null
    ): void {
        const merged = Object.assign({}, body || {}, {
            task_id: taskId || "",
        });
        if (taskType) {
            merged.task_type = taskType;
        }
        this.request("TaskShowReward", merged, successHandle, failHandle);
    }

    public static buildSdkQueryString(extraParams: { [key: string]: any } | null): string {
        const userId = ClientDataStore.user_id || "";
        const yid = ClientDataStore.yid || "";
        const safeYid = "yid_read_fail" === yid || "yid_read_failed" === yid ? "" : yid;
        const et = Math.floor(Date.now() / 1e3);
        const nonceStr = ClientDataStore.uuid();
        const ngister = CryptoHelper.ngister(
            "",
            et.toString(),
            nonceStr,
            ClientDataStore.version_name,
            ClientDataStore.channel_name,
            ClientDataStore.device_id,
            ClientDataStore.box_pkg_name
        );

        logDetail(LOG_TAG + " SDK_NGISTER_PARAMS", [
            '  url(signPath)   : ""',
            '  time(et)        : "' + et + '"',
            '  nonce(nonce_str): "' + nonceStr + '"',
            '  versionName     : "' + ClientDataStore.version_name + '"',
            '  channelName     : "' + ClientDataStore.channel_name + '"',
            '  deviceId        : "' + ClientDataStore.device_id + '"',
            '  boxPkgName      : "' + ClientDataStore.box_pkg_name + '"',
            '  => ngister      : "' + ngister + '"',
        ]);

        const parts: string[] = [];
        parts.push("user_id=" + userId);
        parts.push("yid=" + safeYid);
        const commonUrlStr = ClientDataStore.commonUrlStr;
        if (commonUrlStr) {
            parts.push(commonUrlStr);
        }
        parts.push("nonce_str=" + nonceStr);
        parts.push("et=" + et);
        parts.push("ngister=" + ngister);
        parts.push("sign_type=3");
        parts.push("country=" + (ClientDataStore.local_country || ""));
        parts.push("cy=" + (ClientDataStore.local_country || ""));

        if (extraParams) {
            const keys = Object.keys(extraParams);
            for (let i = 0; i < keys.length; i++) {
                const key = keys[i];
                parts.push(key + "=" + (extraParams[key] || ""));
            }
        }
        return parts.join("&");
    }

    public static sdkRequest(
        requestKey: string,
        body: { [key: string]: any } | null,
        successHandle: HttpCallbackHandle | null,
        failHandle: HttpCallbackHandle | null,
        includeRawParams: boolean = false,
        stringifyParams: boolean = true
    ): void {
        const uri = descriptorRegistry.getUri(requestKey);
        const country = ClientDataStore.local_country || "";
        const url =
            LoadingHttpService.SDK_WD_BASE +
            uri +
            "?package_name=" +
            ClientDataStore.package_name +
            "&cy=" +
            country;
        const userId = ClientDataStore.user_id || "";

        const stringified: { [key: string]: string } = {};
        if (stringifyParams && body && "object" === typeof body) {
            const keys = Object.keys(body);
            for (let i = 0; i < keys.length; i++) {
                const key = keys[i];
                const value = body[key];
                stringified[key] = String(value !== null && value !== undefined ? value : "");
            }
        }

        const queryString = LoadingHttpService.buildSdkQueryString(stringified);
        const payload: { [key: string]: any } = {
            user_id: userId,
        };

        if (includeRawParams && body && "object" === typeof body) {
            const keys = Object.keys(body);
            for (let i = 0; i < keys.length; i++) {
                const key = keys[i];
                const value = body[key];
                payload[key] = value !== null && value !== undefined ? value : "";
            }
        }
        payload.query = queryString;

        const rawBody = JSON.stringify(payload);
        const encryptedBody = CryptoHelper.encrypt(rawBody, ClientDataStore.box_pkg_name);

        logDetail(LOG_TAG + " SDK_REQ | key=" + requestKey, [
            "  method      : POST",
            "  contentType : text/plain",
            "  url         : " + url,
            "  raw_body    : " + rawBody,
            "  encrypted   : " + (encryptedBody || "").substring(0, 120) + "...",
        ]);

        const xhr = new XMLHttpRequest();
        xhr.timeout = 15e3;
        xhr.onreadystatechange = () => {
            if (4 !== xhr.readyState) {
                return;
            }
            if (xhr.status >= 200 && xhr.status < 300) {
                const rawResponse = xhr.responseText || "";
                logDetail(LOG_TAG + " SDK_RESP_RAW | key=" + requestKey, [
                    "  method      : POST",
                    "  status      : " + xhr.status,
                    "  raw         : " + rawResponse.substring(0, 500),
                ]);

                let decoded = rawResponse;
                try {
                    const decrypted = CryptoHelper.decrypt(rawResponse, ClientDataStore.box_pkg_name);
                    if (decrypted) {
                        decoded = decrypted;
                        console.log(LOG_TAG + " SDK_RESP_DECRYPTED | " + decoded.substring(0, 500));
                    }
                } catch (error) {
                    console.warn(LOG_TAG + " SDK_RESP decrypt skip", error);
                }

                try {
                    const parsed = JSON.parse(decoded);
                    logEvent("SUCCESS", {
                        url: url,
                        status: xhr.status,
                        code: parsed.code,
                    });
                    if (successHandle) {
                        successHandle.runWith(parsed);
                    }
                } catch (error) {
                    logEvent("FAIL", {
                        url: url,
                        status: xhr.status,
                        message: "parse error",
                    });
                    console.error(LOG_TAG + " SDK_RESP_PARSE_FAIL | respText=" + decoded.substring(0, 500));
                    if (failHandle) {
                        failHandle.runWith({
                            code: -1,
                            message: "响应解析失败",
                        });
                    }
                }
            } else {
                logEvent("FAIL", {
                    url: url,
                    status: xhr.status,
                    message: "http error " + xhr.status,
                });
                if (failHandle) {
                    failHandle.runWith({
                        code: -1,
                        message: "请求失败",
                        http_status: xhr.status,
                    });
                }
            }
        };
        xhr.onerror = () => {
            logEvent("FAIL", {
                url: url,
                message: "network error",
            });
            if (failHandle) {
                failHandle.runWith({
                    code: -1,
                    message: "网络错误",
                });
            }
        };
        xhr.ontimeout = () => {
            logEvent("FAIL", {
                url: url,
                message: "timeout",
            });
            if (failHandle) {
                failHandle.runWith({
                    code: -1,
                    message: "请求超时",
                });
            }
        };

        logEvent("START", {
            url: url,
            method: "POST",
        });
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "text/plain");
        xhr.send(encryptedBody);
    }

    public static getWithdrawChannels(
        successHandle: HttpCallbackHandle | null,
        failHandle: HttpCallbackHandle | null
    ): void {
        this.sdkRequest("WithdrawChannels", null, successHandle, failHandle);
    }

    public static verifyWithdrawBindInfo(
        info: any,
        successHandle: HttpCallbackHandle | null,
        failHandle: HttpCallbackHandle | null
    ): void {
        const infoValue = "string" === typeof (info && info.info) ? info.info : JSON.stringify((info && info.info) || {});
        this.sdkRequest(
            "VerifyBindInfo",
            {
                channel: (info && info.channel) || "",
                sub_channel: (info && info.sub_channel) || "",
                info: infoValue,
            },
            successHandle,
            failHandle,
            true,
            false
        );
    }

    public static getArrowLevelConfig(
        body: any,
        successHandle: HttpCallbackHandle | null,
        failHandle: HttpCallbackHandle | null
    ): void {
        this.request("ArrowLevelConfig", body, successHandle, failHandle);
    }

    public static arrowRewardSettle(
        body: any,
        successHandle: HttpCallbackHandle | null,
        failHandle: HttpCallbackHandle | null
    ): void {
        this.request("ArrowRewardSettle", body, successHandle, failHandle);
    }

    public static claimArrowReward(
        body: any,
        successHandle: HttpCallbackHandle | null,
        failHandle: HttpCallbackHandle | null
    ): void {
        const merged = Object.assign({}, body || {});
        if (!merged.business_type) {
            merged.business_type = "arrow";
        }
        if ("task" !== merged.business_type) {
            delete merged.task_type;
        } else if ("ltv" !== String(merged.task_type || "").toLowerCase()) {
            delete merged.task_type;
        }
        this.request("ArrowClaimReward", merged, successHandle, failHandle);
    }

    public static claimArrowAdReward(
        body: any,
        successHandle: HttpCallbackHandle | null,
        failHandle: HttpCallbackHandle | null
    ): void {
        const merged = Object.assign({}, body || {});
        if (!merged.business_type) {
            merged.business_type = "arrow";
        }
        if ("task" !== merged.business_type) {
            delete merged.task_type;
        } else if ("ltv" !== String(merged.task_type || "").toLowerCase()) {
            delete merged.task_type;
        }
        this.request("ArrowClaimAdReward", merged, successHandle, failHandle);
    }

    public static consumeArrowProp(
        body: any,
        successHandle: HttpCallbackHandle | null,
        failHandle: HttpCallbackHandle | null
    ): void {
        this.request("ArrowConsumeProp", body, successHandle, failHandle);
    }

    public static buildHotUpdateBody(body: any): string {
        return buildRequestPayload(body, "HotUpdate", this.gameVersion).toText();
    }
}