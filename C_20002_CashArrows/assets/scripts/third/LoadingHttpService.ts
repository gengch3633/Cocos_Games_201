import BusinessAnalyticsService from "./BusinessAnalyticsService";
import { BUSINESS_REQUEST_DESCRIPTORS } from "./BusinessRequestDescriptors";
import ClientDataStore from "./ClientDataStore";
import CryptoHelper from "./CryptoHelper";
import Handler from "./Handler";
import RequestDescriptor from "./RequestDescriptor";
import RequestQueueEngine from "./RequestQueueEngine";
import SystemDataStore from "./SystemDataStore";

const descriptorRegistry = new RequestDescriptor(BUSINESS_REQUEST_DESCRIPTORS);
const LOG_TAG = "[MigrationBundle][HTTP]";
const MONITOR_SAMPLE_RATE = 5;

function nowMs(): number {
    return Date.now();
}

function safeStringify(value: any): string {
    try {
        return JSON.stringify(value);
    } catch {
        return String(value);
    }
}

function logDetail(prefix: string, lines: string[]): void {
    const detail = lines.map((line) => String(line || "").trim()).filter(Boolean).join(" | ");
    console.log(prefix + (detail ? " | " + detail : ""));
}

function logHttp(event: string, fields: Record<string, any>): void {
    (window as any).forceLog = true;
    const parts = [
        fields.requestKey ? "key=" + fields.requestKey : "",
        fields.uri ? "uri=" + fields.uri : "",
        fields.url ? "url=" + fields.url : "",
        fields.status !== undefined ? "status=" + fields.status : "",
        fields.code !== undefined ? "code=" + fields.code : "",
        fields.method ? "method=" + fields.method : "",
        fields.elapsedMs !== undefined ? "cost=" + fields.elapsedMs + "ms" : "",
        fields.message ? "msg=" + fields.message : "",
    ].filter(Boolean).join(" | ");
    console.log(LOG_TAG + " " + event + (parts ? " | " + parts : ""));
}

function reportAnalytics(event: string, data?: any): void {
    BusinessAnalyticsService.reportData(event, data);
}

function maybeReportHttpMonitor(path: string, status: number, elapsedMs: number): void {
    if (MONITOR_SAMPLE_RATE >= 100 || (MONITOR_SAMPLE_RATE > 0 && 100 * Math.random() < MONITOR_SAMPLE_RATE)) {
        reportAnalytics("http_monitor", {
            request_path: path || "",
            request_url: path || "",
            response_code: Number(status) || 0,
            response_time: Math.max(0, Math.floor(Number(elapsedMs) || 0)),
        });
    }
}

function reportIpRequestErr(errType: string): void {
    reportAnalytics("ip_request_err", { err_type: errType });
}

class BusinessRequestBody {
    private _data: Record<string, any> = {};
    private _trace: Record<string, any>;

    constructor(trace: Record<string, any>) {
        this._trace = trace;
        let yid = ClientDataStore.yid || "";
        if (yid === "yid_read_fail" || yid === "yid_read_failed") {
            yid = "";
        }
        this._data.yid = yid;
        this._data.device_id = ClientDataStore.device_id || "";
    }

    append(key: string, value: any): void {
        this._data[key] = value;
    }

    toJSON(): string {
        return JSON.stringify(this._data);
    }

    toText(): string {
        return CryptoHelper.encrypt(this.toJSON(), ClientDataStore.box_pkg_name);
    }

    trace(): Record<string, any> {
        return this._trace;
    }
}

function buildLParams(uri: string, gameVersion: string): Record<string, string> {
    const params: Record<string, string> = {};
    for (const pair of ClientDataStore.commonUrlStr.split("&")) {
        const [key, value] = pair.split("=");
        if (key) {
            params[key] = value;
        }
    }
    const timestamp = Math.floor(Date.now() / 1000);
    const nonce = ClientDataStore.uuid();
    params.nonce_str = nonce;
    params.et = String(timestamp);
    params.ngister = CryptoHelper.ngister(
        "/" + uri,
        timestamp.toString(),
        nonce,
        ClientDataStore.version_name,
        ClientDataStore.channel_name,
        ClientDataStore.device_id,
        ClientDataStore.box_pkg_name
    );
    params.game_version = gameVersion;
    return params;
}

function buildRequestUrl(requestKey: string): string {
    const country = ClientDataStore.local_country || "";
    return SystemDataStore.get_request_url() + descriptorRegistry.getUri(requestKey) + "?pkg=" + ClientDataStore.package_name + "&cy=" + country;
}

function buildRequestBody(data: Record<string, any>, requestKey: string, gameVersion: string): BusinessRequestBody {
    const uri = descriptorRegistry.getUri(requestKey);
    const body = new BusinessRequestBody({ requestKey, uri, startedAt: nowMs() });
    const payload = { ...data };
    payload.l_params = buildLParams(uri, gameVersion);
    body.trace().businessPlainData = payload;
    const url = buildRequestUrl(requestKey);
    logDetail(LOG_TAG + " REQ_PARAMS | key=" + requestKey, [
        "  method      : POST",
        "  contentType : text/plain",
        "  url         : " + url,
        "  yid         : " + ClientDataStore.yid,
        "  device_id   : " + ClientDataStore.device_id,
        "  l_params    : " + safeStringify(payload.l_params),
        "  data        : " + safeStringify(payload),
    ]);
    const encrypted =
        SystemDataStore.encrypt
            ? CryptoHelper.encrypt(JSON.stringify(payload), ClientDataStore.box_pkg_name)
            : JSON.stringify(payload);
    body.append("business_data", encrypted);
    return body;
}

class RequestCallbackWrapper {
    private _successHandle: Handler | null;
    private _failHandle: Handler | null;
    private _enqueue: boolean;
    private _retry: boolean;

    constructor(requestKey: string, successHandle: Handler | null, failHandle: Handler | null) {
        this._successHandle = successHandle;
        this._failHandle = failHandle;
        this._enqueue = descriptorRegistry.needEnqueue(requestKey);
        this._retry = this._enqueue;
    }

    success(data: any): void {
        this._successHandle?.runWith(data);
    }

    fail(data: any): boolean {
        this._failHandle?.runWith(data);
        return this._retry;
    }

    enterQueue(): boolean {
        return this._enqueue;
    }

    needRetry(): boolean {
        return this._retry;
    }
}

function createQueueHooks(onRetry: (reason: any, retryFn: () => void) => void) {
    return {
        shouldEnqueue: (callback: RequestCallbackWrapper) => callback.enterQueue(),
        shouldRetry: (callback: RequestCallbackWrapper) => callback.needRetry(),
        refreshUrlOnRetry: () => "",
        onRetry: (reason: any, retryFn: () => void) => {
            logHttp("RETRY", { message: safeStringify(reason) });
            onRetry(reason, retryFn);
        },
        onQueueCallback: () => {},
        parseSuccessResponse: (ctx: any) => {
            const url = ctx.url;
            const reqData = ctx.reqData as BusinessRequestBody;
            const responseText = ctx.responseText;
            const status = ctx.status;
            const trace = reqData.trace();
            const elapsedMs = nowMs() - trace.startedAt;
            maybeReportHttpMonitor(url, status, elapsedMs);
            if (!responseText) {
                reportIpRequestErr("onreadystatechange");
                logHttp("FAIL", {
                    requestKey: trace.requestKey,
                    uri: trace.uri,
                    url,
                    status,
                    elapsedMs,
                    message: "response empty",
                });
                return { success: false, data: { code: -1, message: "返回数据不存在" } };
            }
            let decoded = responseText;
            try {
                const decrypted = CryptoHelper.decrypt(responseText, ClientDataStore.box_pkg_name);
                if (decrypted) {
                    decoded = decrypted;
                }
            } catch (err) {
                console.warn(LOG_TAG + " DECRYPT_FAIL | key=" + trace.requestKey + " | url=" + url, err);
            }
            let parsed: any;
            try {
                parsed = JSON.parse(decoded);
            } catch {
                reportIpRequestErr("parseErr");
                logHttp("FAIL", {
                    requestKey: trace.requestKey,
                    uri: trace.uri,
                    url,
                    status,
                    elapsedMs,
                    message: "response parse fail",
                });
                console.error(LOG_TAG + " RESP_PARSE_FAIL | key=" + trace.requestKey + " | raw=" + responseText);
                return { success: false, data: { code: -1, message: "响应解析失败", raw: responseText } };
            }
            logDetail(LOG_TAG + " RESP_BODY | key=" + trace.requestKey, [
                "  method      : POST",
                "  url         : " + url,
                "  status      : " + status,
                "  body        : " + decoded,
            ]);
            if (parsed.code === -1 || parsed.code === -1000) {
                logHttp("FAIL", {
                    requestKey: trace.requestKey,
                    uri: trace.uri,
                    url,
                    status,
                    code: parsed.code,
                    elapsedMs,
                    message: parsed.message,
                });
                return { success: false, data: parsed };
            }
            logHttp("SUCCESS", {
                requestKey: trace.requestKey,
                uri: trace.uri,
                url,
                status,
                code: parsed.code,
                elapsedMs,
            });
            return { success: true, data: parsed };
        },
        buildRequestBody: (reqData: BusinessRequestBody) => {
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
        onRequestStart: (ctx: any) => {
            const url = ctx.url;
            const reqData = ctx.reqData as BusinessRequestBody;
            const requestBody = ctx.requestBody;
            const trace = reqData.trace();
            trace.startedAt = nowMs();
            logHttp("START", { requestKey: trace.requestKey, uri: trace.uri, url, method: "POST" });
            logDetail(LOG_TAG + " START_DETAIL | key=" + trace.requestKey + " | uri=" + trace.uri, [
                "  method      : POST",
                "  contentType : text/plain",
                "  url         : " + url,
                "  body_size   : " + String(requestBody || "").length,
                "  body        : " + String(requestBody || ""),
            ]);
        },
        createStatusError: (ctx: any) => {
            const url = ctx.url;
            const reqData = ctx.reqData as BusinessRequestBody;
            const status = ctx.status;
            const trace = reqData.trace();
            const elapsedMs = nowMs() - trace.startedAt;
            maybeReportHttpMonitor(url, status, elapsedMs);
            reportIpRequestErr("onreadystatechange");
            logHttp("FAIL", {
                requestKey: trace.requestKey,
                uri: trace.uri,
                url,
                status,
                elapsedMs,
                message: "xhr.status" + status,
            });
            return { code: -1, message: "xhr.status" + status, http_status: status };
        },
        createRuntimeError: (ctx: any) => {
            const url = ctx.url;
            const reqData = ctx.reqData as BusinessRequestBody;
            const status = ctx.status;
            const reason = ctx.reason;
            const trace = reqData.trace();
            const elapsedMs = nowMs() - trace.startedAt;
            maybeReportHttpMonitor(url, status, elapsedMs);
            reportIpRequestErr(reason === "timeout" ? "ontimeout" : "onerror");
            logHttp("FAIL", {
                requestKey: trace.requestKey,
                uri: trace.uri,
                url,
                status,
                elapsedMs,
                message: "onXhr." + reason,
            });
            return { code: -1, message: "onXhr." + reason, http_status: status };
        },
        dispatchResult: (callback: RequestCallbackWrapper | null, success: boolean, data: any) => {
            if (callback) {
                if (success) {
                    callback.success(data);
                } else {
                    callback.fail(data);
                }
            }
        },
    };
}

export default class LoadingHttpService {
    static gameVersion = "1.0.0.0";
    static SDK_WD_BASE = "https://hxjxd.casharrows.com/vunuar/";
    static SDK_WD_URI = "c_l";
    static SDK_WD_VERIFY_URI = "ck_i";
    static engine: RequestQueueEngine | null = null;

    static reportHttpErr(response: any): void {
        reportAnalytics("httpErr", { response: safeStringify(response), category: "network_error" });
    }

    static init(onRetry: (reason: any, retryFn: () => void) => void): void {
        if (!this.engine) {
            this.engine = new RequestQueueEngine(createQueueHooks(onRetry));
        }
    }

    static setGameVersion(version: string): void {
        this.gameVersion = version;
    }

    static request(requestKey: string, data: Record<string, any> | null, successHandle: Handler | null, failHandle: Handler | null): void {
        const url = buildRequestUrl(requestKey);
        const reqData = buildRequestBody(data || {}, requestKey, this.gameVersion);
        const callback = new RequestCallbackWrapper(requestKey, successHandle, failHandle);
        this.engine!.queuePost(url, reqData, callback);
    }

    static syncFirebaseToken(token: string, successHandle: Handler | null, failHandle: Handler | null): void {
        reportAnalytics("sync_firebase_token", { firebase_token: token });
        const normalized = String(token || "").trim();
        if (normalized) {
            this.request("FirebaseToken", { firebase_token: normalized }, successHandle, failHandle);
        } else {
            failHandle?.runWith({ code: -1, message: "firebase_token empty" });
        }
    }

    static getSystemConfig(successHandle: Handler | null, failHandle: Handler | null): void {
        this.request("config", null, successHandle, failHandle);
    }

    static autoLogin(data: Record<string, any> | null, successHandle: Handler | null, failHandle: Handler | null): void {
        this.request("auto_submit", data, successHandle, failHandle);
    }

    static touristsLogin(data: Record<string, any> | null, successHandle: Handler | null, failHandle: Handler | null): void {
        this.request("TouristLogin", data, successHandle, failHandle);
    }

    static getGameConfig(successHandle: Handler | null, failHandle: Handler | null): void {
        this.request("GetGameConfig", null, successHandle, failHandle);
    }

    static getUserInfo(successHandle: Handler | null, failHandle: Handler | null): void {
        this.request("UserInfo", null, successHandle, failHandle);
    }

    static getWithdrawInfo(successHandle: Handler | null, failHandle: Handler | null): void {
        this.request("WithdrawInfo", null, successHandle, failHandle);
    }

    static withdrawCash(data: Record<string, any>, successHandle: Handler | null, failHandle: Handler | null): void {
        this.request("WithdrawCash", data, successHandle, failHandle);
    }

    static bindTxAccount(data: Record<string, any>, successHandle: Handler | null, failHandle: Handler | null): void {
        this.request("BindTxAccount", data, successHandle, failHandle);
    }

    static getBarrageList(successHandle: Handler | null, failHandle: Handler | null): void {
        this.request("BarrageList", null, successHandle, failHandle);
    }

    static getTaskInfo(
        taskTypeOrSuccess: string | Handler | null,
        successOrFail?: Handler | null,
        failHandle?: Handler | null
    ): void {
        let taskType = "";
        let successHandle: Handler | null;
        let fail: Handler | null;
        if (typeof taskTypeOrSuccess === "string") {
            taskType = taskTypeOrSuccess || "";
            successHandle = successOrFail ?? null;
            fail = failHandle ?? null;
        } else {
            successHandle = taskTypeOrSuccess;
            fail = successOrFail ?? null;
        }
        const payload: Record<string, string> = {};
        if (taskType) {
            payload.task_type = taskType;
        }
        this.request("TaskInfo", Object.keys(payload).length > 0 ? payload : null, successHandle, fail);
    }

    static claimTaskReward(taskId: string, taskType: string | null, successHandle: Handler | null, failHandle: Handler | null): void {
        const payload: Record<string, string> = { task_id: taskId || "" };
        if (taskType) {
            payload.task_type = taskType;
        }
        this.request("TaskOnlyReward", payload, successHandle, failHandle);
    }

    static claimTaskAdReward(
        taskId: string,
        extra: Record<string, any> | null,
        taskType: string | null,
        successHandle: Handler | null,
        failHandle: Handler | null
    ): void {
        const payload = Object.assign({}, extra || {}, { task_id: taskId || "" });
        if (taskType) {
            payload.task_type = taskType;
        }
        this.request("TaskShowReward", payload, successHandle, failHandle);
    }

    static buildSdkQueryString(extra?: Record<string, any>): string {
        const userId = ClientDataStore.user_id || "";
        let yid = ClientDataStore.yid || "";
        if (yid === "yid_read_fail" || yid === "yid_read_failed") {
            yid = "";
        }
        const timestamp = Math.floor(Date.now() / 1000);
        const nonce = ClientDataStore.uuid();
        const ngister = CryptoHelper.ngister(
            "",
            timestamp.toString(),
            nonce,
            ClientDataStore.version_name,
            ClientDataStore.channel_name,
            ClientDataStore.device_id,
            ClientDataStore.box_pkg_name
        );
        logDetail(LOG_TAG + " SDK_NGISTER_PARAMS", [
            '  url(signPath)   : ""',
            '  time(et)        : "' + timestamp + '"',
            '  nonce(nonce_str): "' + nonce + '"',
            '  versionName     : "' + ClientDataStore.version_name + '"',
            '  channelName     : "' + ClientDataStore.channel_name + '"',
            '  deviceId        : "' + ClientDataStore.device_id + '"',
            '  boxPkgName      : "' + ClientDataStore.box_pkg_name + '"',
            '  => ngister      : "' + ngister + '"',
        ]);
        const parts: string[] = [];
        parts.push("user_id=" + userId);
        parts.push("yid=" + yid);
        const commonUrlStr = ClientDataStore.commonUrlStr;
        if (commonUrlStr) {
            parts.push(commonUrlStr);
        }
        parts.push("nonce_str=" + nonce);
        parts.push("et=" + timestamp);
        parts.push("ngister=" + ngister);
        parts.push("sign_type=3");
        parts.push("country=" + (ClientDataStore.local_country || ""));
        parts.push("cy=" + (ClientDataStore.local_country || ""));
        if (extra) {
            for (const key of Object.keys(extra)) {
                parts.push(key + "=" + (extra[key] || ""));
            }
        }
        return parts.join("&");
    }

    static sdkRequest(
        requestKey: string,
        body: Record<string, any> | null,
        successHandle: Handler | null,
        failHandle: Handler | null,
        includeBodyInPayload: boolean = false,
        includeQueryInBody: boolean = true
    ): void {
        const uri = descriptorRegistry.getUri(requestKey);
        const country = ClientDataStore.local_country || "";
        const url = this.SDK_WD_BASE + uri + "?package_name=" + ClientDataStore.package_name + "&cy=" + country;
        const userId = ClientDataStore.user_id || "";
        const queryParams: Record<string, string> = {};
        if (includeQueryInBody && body && typeof body === "object") {
            for (const key of Object.keys(body)) {
                queryParams[key] = String(body[key] ?? "");
            }
        }
        const query = this.buildSdkQueryString(queryParams);
        const payload: Record<string, any> = { user_id: userId };
        if (includeBodyInPayload && body && typeof body === "object") {
            for (const key of Object.keys(body)) {
                payload[key] = body[key] ?? "";
            }
        }
        payload.query = query;
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
        xhr.timeout = 15000;
        xhr.onreadystatechange = () => {
            if (xhr.readyState !== 4) {
                return;
            }
            if (xhr.status >= 200 && xhr.status < 300) {
                const responseText = xhr.responseText || "";
                logDetail(LOG_TAG + " SDK_RESP_RAW | key=" + requestKey, [
                    "  method      : POST",
                    "  status      : " + xhr.status,
                    "  raw         : " + responseText.substring(0, 500),
                ]);
                let decoded = responseText;
                try {
                    const decrypted = CryptoHelper.decrypt(responseText, ClientDataStore.box_pkg_name);
                    if (decrypted) {
                        decoded = decrypted;
                        console.log(LOG_TAG + " SDK_RESP_DECRYPTED | " + decoded.substring(0, 500));
                    }
                } catch (err) {
                    console.warn(LOG_TAG + " SDK_RESP decrypt skip", err);
                }
                try {
                    const parsed = JSON.parse(decoded);
                    logHttp("SUCCESS", { url, status: xhr.status, code: parsed.code });
                    successHandle?.runWith(parsed);
                } catch {
                    logHttp("FAIL", { url, status: xhr.status, message: "parse error" });
                    console.error(LOG_TAG + " SDK_RESP_PARSE_FAIL | respText=" + decoded.substring(0, 500));
                    failHandle?.runWith({ code: -1, message: "响应解析失败" });
                }
            } else {
                logHttp("FAIL", { url, status: xhr.status, message: "http error " + xhr.status });
                failHandle?.runWith({ code: -1, message: "请求失败", http_status: xhr.status });
            }
        };
        xhr.onerror = () => {
            logHttp("FAIL", { url, message: "network error" });
            failHandle?.runWith({ code: -1, message: "网络错误" });
        };
        xhr.ontimeout = () => {
            logHttp("FAIL", { url, message: "timeout" });
            failHandle?.runWith({ code: -1, message: "请求超时" });
        };
        logHttp("START", { url, method: "POST" });
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "text/plain");
        xhr.send(encryptedBody);
    }

    static getWithdrawChannels(successHandle: Handler | null, failHandle: Handler | null): void {
        this.sdkRequest("WithdrawChannels", null, successHandle, failHandle);
    }

    static verifyWithdrawBindInfo(
        params: { channel?: string; sub_channel?: string; info?: any },
        successHandle: Handler | null,
        failHandle: Handler | null
    ): void {
        const info = typeof params?.info === "string" ? params.info : JSON.stringify(params?.info || {});
        this.sdkRequest(
            "VerifyBindInfo",
            { channel: params?.channel || "", sub_channel: params?.sub_channel || "", info },
            successHandle,
            failHandle,
            true,
            false
        );
    }

    static getArrowLevelConfig(data: Record<string, any>, successHandle: Handler | null, failHandle: Handler | null): void {
        this.request("ArrowLevelConfig", data, successHandle, failHandle);
    }

    static arrowRewardSettle(data: Record<string, any>, successHandle: Handler | null, failHandle: Handler | null): void {
        this.request("ArrowRewardSettle", data, successHandle, failHandle);
    }

    static claimArrowReward(data: Record<string, any>, successHandle: Handler | null, failHandle: Handler | null): void {
        const payload = Object.assign({}, data || {});
        if (!payload.business_type) {
            payload.business_type = "arrow";
        }
        if (payload.business_type !== "task") {
            delete payload.task_type;
        } else if (String(payload.task_type || "").toLowerCase() !== "ltv") {
            delete payload.task_type;
        }
        this.request("ArrowClaimReward", payload, successHandle, failHandle);
    }

    static claimArrowAdReward(data: Record<string, any>, successHandle: Handler | null, failHandle: Handler | null): void {
        const payload = Object.assign({}, data || {});
        if (!payload.business_type) {
            payload.business_type = "arrow";
        }
        if (payload.business_type !== "task") {
            delete payload.task_type;
        } else if (String(payload.task_type || "").toLowerCase() !== "ltv") {
            delete payload.task_type;
        }
        this.request("ArrowClaimAdReward", payload, successHandle, failHandle);
    }

    static consumeArrowProp(data: Record<string, any>, successHandle: Handler | null, failHandle: Handler | null): void {
        this.request("ArrowConsumeProp", data, successHandle, failHandle);
    }

    static buildHotUpdateBody(data: Record<string, any>): string {
        return buildRequestBody(data, "HotUpdate", this.gameVersion).toText();
    }
}
