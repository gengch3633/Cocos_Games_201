import BusinessAnalyticsService from "./BusinessAnalyticsService";
import { BUSINESS_REQUEST_DESCRIPTORS } from "./BusinessRequestDescriptors";
import ClientDataStore from "./ClientDataStore";
import CryptoHelper from "./CryptoHelper";
import RequestDescriptor from "./RequestDescriptor";
import RequestQueueEngine from "./RequestQueueEngine";
import SystemDataStore from "./SystemDataStore";

const requestDescriptor = new RequestDescriptor(BUSINESS_REQUEST_DESCRIPTORS);
const LOG_PREFIX = "[MigrationBundle][HTTP]";
const HTTP_MONITOR_SAMPLE_RATE = 5;

function nowMs(): number {
    return Date.now();
}

function safeStringify(value: any): string {
    try {
        return JSON.stringify(value);
    } catch (err) {
        return String(value);
    }
}

function logParts(prefix: string, parts: string[]): void {
    const joined = (parts || []).map((part) => String(part || " ").trim()).filter(Boolean).join("|");
    console.log(prefix + (joined ? "|" + joined : " "));
}

function logHttp(event: string, detail: any): void {
    (window as any).forceLog = true;
    const parts = [
        detail.requestKey ? "key=" + detail.requestKey : " ",
        detail.uri ? "uri=" + detail.uri : " ",
        detail.url ? "url=" + detail.url : " ",
        detail.status !== undefined ? "status=" + detail.status : " ",
        detail.code !== undefined ? "code=" + detail.code : " ",
        detail.method ? "method=" + detail.method : " ",
        detail.elapsedMs !== undefined ? "cost=" + detail.elapsedMs + "ms" : " ",
        detail.message ? "msg=" + detail.message : " "
    ].filter(Boolean).join("|");
    console.log(LOG_PREFIX + " " + event + (parts ? "|" + parts : " "));
}

function reportAnalytics(event: string, data?: any): void {
    BusinessAnalyticsService.reportData(event, data);
}

function reportHttpMonitor(path: string, status: number, elapsedMs: number): void {
    if (HTTP_MONITOR_SAMPLE_RATE >= 100 || !(HTTP_MONITOR_SAMPLE_RATE <= 0) && 100 * Math.random() < HTTP_MONITOR_SAMPLE_RATE) {
        reportAnalytics("http_monitor", {
            request_path: path || " ",
            request_url: path || " ",
            response_code: Number(status) || 0,
            response_time: Math.max(0, Math.floor(Number(elapsedMs) || 0))
        });
    }
}

function reportIpRequestErr(errType: string): void {
    reportAnalytics("ip_request_err", {
        err_type: errType
    });
}

class HttpRequestPayload {
    _data: any = {};
    _trace: any;

    constructor(trace: any) {
        this._trace = trace;
        const yid = ClientDataStore.yid || " ";
        this._data.yid = "yid_read_fail" === yid || "yid_read_failed" === yid ? " ": yid; this._data.device_id = ClientDataStore.device_id ||" ";
    }

    append(key: string, value: any): void {
        this._data[key] = value;
    }

    toJSON(): string {
        return JSON.stringify(this._data);
    }

    toText(): string {
        const json = this.toJSON();
        return CryptoHelper.encrypt(json, ClientDataStore.box_pkg_name);
    }

    trace(): any {
        return this._trace;
    }
}

function buildLParams(uri: string, gameVersion: string): any {
    const params: any = {};
    const commonParts = ClientDataStore.commonUrlStr.split("&");
    for (let i = 0; i < commonParts.length; i++) {
        const pair = commonParts[i].split("=");
        const key = pair[0];
        const value = pair[1];
        if (key) {
            params[key] = value;
        }
    }
    const timestamp = Math.floor(Date.now() / 1e3);
    const nonce = ClientDataStore.uuid();
    params.nonce_str = nonce;
    params.et = timestamp;
    params.ngister = CryptoHelper.ngister("/"+ uri, timestamp.toString(), nonce, ClientDataStore.version_name, ClientDataStore.channel_name, ClientDataStore.device_id, ClientDataStore.box_pkg_name); params.game_version = gameVersion; return params;
} function createRequestData(businessData: any, requestKey: string, gameVersion: string): HttpRequestPayload { const uri = requestDescriptor.getUri(requestKey); const payload = new HttpRequestPayload({ requestKey: requestKey, uri: uri, startedAt: nowMs() }); businessData = Object.assign({}, businessData); businessData.l_params = buildLParams(uri, gameVersion); payload.trace().businessPlainData = businessData; let bodyText: string; const url = buildRequestUrl(requestKey); logParts(LOG_PREFIX +" REQ_PARAMS | key="+ requestKey, ["  method      : POST",
        "contentType: text/plain",
        "  url         : " + url,
        "  yid         : " + ClientDataStore.yid,
        "  device_id   : " + ClientDataStore.device_id,
        "  l_params    : " + safeStringify(businessData.l_params),
        "  data        : " + safeStringify(businessData)
    ]);
    bodyText = SystemDataStore.encrypt ? CryptoHelper.encrypt(JSON.stringify(businessData), ClientDataStore.box_pkg_name) : JSON.stringify(businessData);
    payload.append("business_data", bodyText);
    return payload;
}

function buildRequestUrl(requestKey: string): string {
    const country = ClientDataStore.local_country || " ";
    return SystemDataStore.get_request_url() + requestDescriptor.getUri(requestKey) + "?pkg=" + ClientDataStore.package_name + "&cy="+ country;
} class RequestCallback { _successHandle: any; _failHandle: any; _enqueue: boolean; _retry: boolean; constructor(requestKey: string, successHandle: any, failHandle: any) { this._successHandle = successHandle; this._failHandle = failHandle; this._enqueue = requestDescriptor.needEnqueue(requestKey); this._retry = this._enqueue; } success(data: any): void { this._successHandle?.runWith(data); } fail(data: any): boolean { this._failHandle?.runWith(data); return this._retry; } enterQueue(): boolean { return this._enqueue; } needRetry(): boolean { return this._retry; }
} function createHttpHooks(onRetryRequest: (message: any, retry: () => void) => void): any { return { shouldEnqueue: (handler: RequestCallback) => handler.enterQueue(), shouldRetry: (handler: RequestCallback) => handler.needRetry(), refreshUrlOnRetry: () =>" ",
        onRetry: (message: any, retry: () => void) => {
            logHttp("RETRY", {
                message: safeStringify(message)
            });
            onRetryRequest(message, retry);
        },
        onQueueCallback: () => { },
        parseSuccessResponse: (response: any) => {
            const url = response.url;
            const reqData = response.reqData;
            const responseText = response.responseText;
            const status = response.status;
            const trace = reqData.trace();
            const elapsedMs = nowMs() - trace.startedAt;
            reportHttpMonitor(url, status, elapsedMs);
            if (!responseText) {
                reportIpRequestErr("onreadystatechange");
                logHttp("FAIL", {
                    requestKey: trace.requestKey,
                    uri: trace.uri,
                    url: url,
                    status: status,
                    elapsedMs: elapsedMs,
                    message: "response empty"
                });
                return {
                    success: false,
                    data: {
                        code: -1,
                        message: "返回数据不存在"
                    }
                };
            }
            let decryptedText = responseText;
            try {
                const decrypted = CryptoHelper.decrypt(responseText, ClientDataStore.box_pkg_name);
                if (decrypted) {
                    decryptedText = decrypted;
                }
            } catch (err) {
                console.warn(LOG_PREFIX + " DECRYPT_FAIL | key=" + trace.requestKey + " | url=" + url, err);
            }
            let parsed: any;
            try {
                parsed = JSON.parse(decryptedText);
            } catch (err) {
                reportIpRequestErr("parseErr");
                logHttp("FAIL", {
                    requestKey: trace.requestKey,
                    uri: trace.uri,
                    url: url,
                    status: status,
                    elapsedMs: elapsedMs,
                    message: "response parse fail"
                });
                console.error(LOG_PREFIX + " RESP_PARSE_FAIL | key=" + trace.requestKey + " | raw="+ responseText); return { success: false, data: { code:-1, message:"响应解析失败",
                        raw: responseText
                    }
                };
            }
            logParts(LOG_PREFIX + " RESP_BODY | key=" + trace.requestKey, [
                "  method      : POST",
                "  url         : " + url,
                "  status      : " + status,
                "  body        : " + decryptedText
            ]);
            if (parsed.code === -1 || parsed.code === -1000) {
                logHttp("FAIL", {
                    requestKey: trace.requestKey,
                    uri: trace.uri,
                    url: url,
                    status: status,
                    code: parsed.code,
                    elapsedMs: elapsedMs,
                    message: parsed.message
                });
                return {
                    success: false,
                    data: parsed
                };
            }
            logHttp("SUCCESS", {
                requestKey: trace.requestKey,
                uri: trace.uri,
                url: url,
                status: status,
                code: parsed.code,
                elapsedMs: elapsedMs
            });
            return {
                success: true,
                data: parsed
            };
        },
        buildRequestBody: (reqData: HttpRequestPayload) => {
            const trace = reqData.trace();
            const rawBody = reqData.toJSON();
            const encryptedBody = reqData.toText();
            logParts(LOG_PREFIX + " REQ_BODY | key=" + trace.requestKey + " | uri="+ trace.uri, ["  business_plain: "+ safeStringify(trace.businessPlainData || {}),"  raw_body    : "+ rawBody,"  encrypted_body: " + encryptedBody
            ]);
            return encryptedBody;
        },
        onRequestStart: (request: any) => {
            const url = request.url;
            const reqData = request.reqData;
            const requestBody = request.requestBody;
            const trace = reqData.trace();
            trace.startedAt = nowMs();
            logHttp("START", {
                requestKey: trace.requestKey,
                uri: trace.uri,
                url: url,
                method: "POST"
            });
            logParts(LOG_PREFIX + " START_DETAIL | key=" + trace.requestKey + " | uri="+ trace.uri, ["  method      : POST",
                "contentType: text/plain",
                "  url         : " + url,
                "  body_size   : " + String(requestBody || " ").length,
                "  body        : " + String(requestBody || " ")
            ]);
        },
        createStatusError: (request: any) => {
            const url = request.url;
            const reqData = request.reqData;
            const status = request.status;
            const trace = reqData.trace();
            const elapsedMs = nowMs() - trace.startedAt;
            reportHttpMonitor(url, status, elapsedMs);
            reportIpRequestErr("onreadystatechange");
            logHttp("FAIL", {
                requestKey: trace.requestKey,
                uri: trace.uri,
                url: url,
                status: status,
                elapsedMs: elapsedMs,
                message: "xhr.status" + status
            });
            return {
                code: -1,
                message: "xhr.status" + status,
                http_status: status
            };
        },
        createRuntimeError: (request: any) => {
            const url = request.url;
            const reqData = request.reqData;
            const status = request.status;
            const reason = request.reason;
            const trace = reqData.trace();
            const elapsedMs = nowMs() - trace.startedAt;
            reportHttpMonitor(url, status, elapsedMs);
            reportIpRequestErr("timeout" === reason ? "ontimeout" : "onerror");
            logHttp("FAIL", {
                requestKey: trace.requestKey,
                uri: trace.uri,
                url: url,
                status: status,
                elapsedMs: elapsedMs,
                message: "onXhr."+ reason }); return { code:-1, message:"onXhr."+ reason, http_status: status }; }, dispatchResult: (handler: RequestCallback, success: boolean, data: any) => { if (handler) { success ? handler.success(data) : handler.fail(data); } } };
} export default class LoadingHttpService { static engine: any = null; static gameVersion: string ="1.0.0.0";
    static SDK_WD_BASE: string = "https://hxjxd.casharrows.com/vunuar/";
    static SDK_WD_URI: string = "c_l";
    static SDK_WD_VERIFY_URI: string = "ck_i";

    static reportHttpErr(response: any): void {
        reportAnalytics("httpErr", {
            response: safeStringify(response),
            category: "network_error"
        });
    }

    static init(onRetry: (message: any, retry: () => void) => void): void {
        if (!this.engine) {
            this.engine = new RequestQueueEngine(createHttpHooks(onRetry));
        }
    }

    static setGameVersion(version: string): void {
        this.gameVersion = version;
    }

    static request(requestKey: string, businessData: any, successHandle: any, failHandle: any): void {
        const url = buildRequestUrl(requestKey);
        const reqData = createRequestData(businessData || {}, requestKey, this.gameVersion);
        const callback = new RequestCallback(requestKey, successHandle, failHandle);
        this.engine.queuePost(url, reqData, callback);
    }

    static syncFirebaseToken(token: string, successHandle: any, failHandle: any): void {
        reportAnalytics("sync_firebase_token", {
            firebase_token: token
        });
        const trimmed = String(token || " ").trim();
        if (trimmed) {
            this.request("FirebaseToken", {
                firebase_token: trimmed
            }, successHandle, failHandle);
        } else {
            failHandle?.runWith({
                code: -1,
                message: "firebase_token empty"
            });
        }
    }

    static getSystemConfig(successHandle: any, failHandle: any): void {
        this.request("config", null, successHandle, failHandle);
    }

    static autoLogin(businessData: any, successHandle: any, failHandle: any): void {
        this.request("auto_submit", businessData, successHandle, failHandle);
    }

    static touristsLogin(businessData: any, successHandle: any, failHandle: any): void {
        this.request("TouristLogin", businessData, successHandle, failHandle);
    }

    static getGameConfig(successHandle: any, failHandle: any): void {
        this.request("GetGameConfig", null, successHandle, failHandle);
    }

    static getUserInfo(successHandle: any, failHandle: any): void {
        this.request("UserInfo", null, successHandle, failHandle);
    }

    static getWithdrawInfo(successHandle: any, failHandle: any): void {
        this.request("WithdrawInfo", null, successHandle, failHandle);
    }

    static withdrawCash(businessData: any, successHandle: any, failHandle: any): void {
        this.request("WithdrawCash", businessData, successHandle, failHandle);
    }

    static bindTxAccount(businessData: any, successHandle: any, failHandle: any): void {
        this.request("BindTxAccount", businessData, successHandle, failHandle);
    }

    static getBarrageList(successHandle: any, failHandle: any): void {
        this.request("BarrageList", null, successHandle, failHandle);
    }

    static getTaskInfo(taskTypeOrSuccess: any, successOrFail?: any, failHandle?: any): void {
        let taskType = " ";
        let successHandle: any;
        let fail: any;
        if (typeof taskTypeOrSuccess === "string") {
            taskType = taskTypeOrSuccess || " ";
            successHandle = successOrFail;
            fail = failHandle;
        } else {
            successHandle = taskTypeOrSuccess;
            fail = successOrFail;
        }
        const payload: any = {};
        if (taskType) {
            payload.task_type = taskType;
        }
        this.request("TaskInfo", Object.keys(payload).length > 0 ? payload : null, successHandle, fail);
    }

    static claimTaskReward(taskId: string, taskType: string, successHandle: any, failHandle: any): void {
        const payload: any = {
            task_id: taskId || " "
        };
        if (taskType) {
            payload.task_type = taskType;
        }
        this.request("TaskOnlyReward", payload, successHandle, failHandle);
    }

    static claimTaskAdReward(taskId: string, extra: any, taskType: string, successHandle: any, failHandle: any): void {
        const payload = Object.assign({}, extra || {}, {
            task_id: taskId || " "
        });
        if (taskType) {
            payload.task_type = taskType;
        }
        this.request("TaskShowReward", payload, successHandle, failHandle);
    }

    static buildSdkQueryString(extraParams?: any): string {
        const userId = ClientDataStore.user_id || " ";
        let yid = ClientDataStore.yid || " ";
        yid = "yid_read_fail" === yid || "yid_read_failed" === yid ? " " : yid;
        const timestamp = Math.floor(Date.now() / 1e3);
        const nonce = ClientDataStore.uuid();
        const ngister = CryptoHelper.ngister(" ", timestamp.toString(), nonce, ClientDataStore.version_name, ClientDataStore.channel_name, ClientDataStore.device_id, ClientDataStore.box_pkg_name);
        logParts(LOG_PREFIX + " SDK_NGISTER_PARAMS", [
            '  url(signPath)   : ""',
            '  time(et)        : "' + timestamp + '"',
            '  nonce(nonce_str): "' + nonce + '"',
            '  versionName     : "' + ClientDataStore.version_name + '"',
            '  channelName     : "' + ClientDataStore.channel_name + '"',
            '  deviceId        : "' + ClientDataStore.device_id + '"',
            '  boxPkgName      : "' + ClientDataStore.box_pkg_name + '"',
            '  => ngister      : "' + ngister + '"'
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
        parts.push("country=" + (ClientDataStore.local_country || " "));
        parts.push("cy=" + (ClientDataStore.local_country || " "));
        if (extraParams) {
            const keys = Object.keys(extraParams);
            for (let i = 0; i < keys.length; i++) {
                const key = keys[i];
                parts.push(key + "=" + (extraParams[key] || " "));
            }
        }
        return parts.join("&");
    }

    static sdkRequest(requestKey: string, businessData: any, successHandle: any, failHandle: any, mergeBody: boolean = false, stringifyQueryParams: boolean = true): void {
        const uri = requestDescriptor.getUri(requestKey);
        const country = ClientDataStore.local_country || " ";
        const url = this.SDK_WD_BASE + uri + "?package_name=" + ClientDataStore.package_name + "&cy="+ country; const userId = ClientDataStore.user_id ||" ";
        const queryParams: any = {};
        if (stringifyQueryParams && businessData && typeof businessData === "object") {
            const keys = Object.keys(businessData);
            for (let i = 0; i < keys.length; i++) {
                const key = keys[i];
                queryParams[key] = String(businessData[key] != null ? businessData[key] : " ");
            }
        }
        const queryString = this.buildSdkQueryString(queryParams);
        const body: any = {
            user_id: userId
        };
        if (mergeBody && businessData && typeof businessData === "object") {
            const keys = Object.keys(businessData);
            for (let i = 0; i < keys.length; i++) {
                const key = keys[i];
                body[key] = businessData[key] != null ? businessData[key] : " ";
            }
        }
        body.query = queryString;
        const rawBody = JSON.stringify(body);
        const encryptedBody = CryptoHelper.encrypt(rawBody, ClientDataStore.box_pkg_name);
        logParts(LOG_PREFIX + " SDK_REQ | key=" + requestKey, [
            "  method      : POST",
            "contentType: text/plain",
            "  url         : " + url,
            "  raw_body    : " + rawBody,
            "  encrypted   : " + (encryptedBody || " ").substring(0, 120) + "..."
        ]);
        const xhr = new XMLHttpRequest();
        xhr.timeout = 15000;
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                if (xhr.status >= 200 && xhr.status < 300) {
                    const responseText = xhr.responseText || " ";
                    logParts(LOG_PREFIX + " SDK_RESP_RAW | key=" + requestKey, [
                        "  method      : POST",
                        "  status      : " + xhr.status,
                        "  raw         : " + responseText.substring(0, 500)
                    ]);
                    let decryptedText = responseText;
                    try {
                        const decrypted = CryptoHelper.decrypt(responseText, ClientDataStore.box_pkg_name);
                        if (decrypted) {
                            decryptedText = decrypted;
                            console.log(LOG_PREFIX + " SDK_RESP_DECRYPTED | " + decryptedText.substring(0, 500));
                        }
                    } catch (err) {
                        console.warn(LOG_PREFIX + " SDK_RESP decrypt skip", err);
                    }
                    try {
                        const parsed = JSON.parse(decryptedText);
                        logHttp("SUCCESS", {
                            url: url,
                            status: xhr.status,
                            code: parsed.code
                        });
                        successHandle?.runWith(parsed);
                    } catch (err) {
                        logHttp("FAIL", {
                            url: url,
                            status: xhr.status,
                            message: "parse error"
                        });
                        console.error(LOG_PREFIX + " SDK_RESP_PARSE_FAIL | respText=" + decryptedText.substring(0, 500));
                        failHandle?.runWith({
                            code: -1,
                            message: "响应解析失败"
                        });
                    }
                } else {
                    logHttp("FAIL", {
                        url: url,
                        status: xhr.status,
                        message: "http error " + xhr.status
                    });
                    failHandle?.runWith({
                        code: -1,
                        message: "请求失败",
                        http_status: xhr.status
                    });
                }
            }
        };
        xhr.onerror = () => {
            logHttp("FAIL", {
                url: url,
                message: "network error"
            });
            failHandle?.runWith({
                code: -1,
                message: "网络错误"
            });
        };
        xhr.ontimeout = () => {
            logHttp("FAIL", {
                url: url,
                message: "timeout"
            });
            failHandle?.runWith({
                code: -1,
                message: "请求超时"
            });
        };
        logHttp("START", {
            url: url,
            method: "POST"
        });
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "text/plain");
        xhr.send(encryptedBody);
    }

    static getWithdrawChannels(successHandle: any, failHandle: any): void {
        this.sdkRequest("WithdrawChannels", null, successHandle, failHandle);
    }

    static verifyWithdrawBindInfo(params: any, successHandle: any, failHandle: any): void {
        const info = typeof params?.info === "string" ? params.info : JSON.stringify(params?.info || {});
        this.sdkRequest("VerifyBindInfo", {
            channel: params?.channel || " ",
            sub_channel: params?.sub_channel || " ",
            info: info
        }, successHandle, failHandle, true, false);
    }

    static getArrowLevelConfig(businessData: any, successHandle: any, failHandle: any): void {
        this.request("ArrowLevelConfig", businessData, successHandle, failHandle);
    }

    static arrowRewardSettle(businessData: any, successHandle: any, failHandle: any): void {
        this.request("ArrowRewardSettle", businessData, successHandle, failHandle);
    }

    static claimArrowReward(businessData: any, successHandle: any, failHandle: any): void {
        const payload = Object.assign({}, businessData || {});
        if (!payload.business_type) {
            payload.business_type = "arrow";
        }
        if ("task" !== payload.business_type) {
            delete payload.task_type;
        } else if ("ltv" !== String(payload.task_type || " ").toLowerCase()) {
            delete payload.task_type;
        }
        this.request("ArrowClaimReward", payload, successHandle, failHandle);
    }

    static claimArrowAdReward(businessData: any, successHandle: any, failHandle: any): void {
        const payload = Object.assign({}, businessData || {});
        if (!payload.business_type) {
            payload.business_type = "arrow";
        }
        if ("task" !== payload.business_type) {
            delete payload.task_type;
        } else if ("ltv" !== String(payload.task_type || " ").toLowerCase()) {
            delete payload.task_type;
        }
        this.request("ArrowClaimAdReward", payload, successHandle, failHandle);
    }

    static consumeArrowProp(businessData: any, successHandle: any, failHandle: any): void {
        this.request("ArrowConsumeProp", businessData, successHandle, failHandle);
    }

    static buildHotUpdateBody(businessData: any): string {
        return createRequestData(businessData, "HotUpdate", this.gameVersion).toText();
    }
}
