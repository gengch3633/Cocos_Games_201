import RequestQueueEngine from "./RequestQueueEngine";
import { BUSINESS_REQUEST_DESCRIPTORS } from "./BusinessRequestDescriptors";
import RequestDescriptor from "./RequestDescriptor";
import CryptoHelper from "./CryptoHelper";
import ClientDataStore from "./ClientDataStore";
import SystemDataStore from "./SystemDataStore";
import BusinessAnalyticsService from "./BusinessAnalyticsService";

const requestDescriptor = new RequestDescriptor(BUSINESS_REQUEST_DESCRIPTORS);
const LOG_PREFIX = "[MigrationBundle][HTTP] ";
const HTTP_MONITOR_SAMPLE_RATE = 5;

function nowMs() {
    return Date.now();
}

function stringifySafe(value: any) {
    try {
        return JSON.stringify(value);
    } catch (t) {
        return String(value);
    }
}

function logParts(prefix: string, parts: string[]) {
    const joined = (parts || []).map(function (item) {
        return String(item || " ").trim();
    }).filter(Boolean).join("| ");
    console.log(prefix + (joined ? "| " + joined : " "));
}

function logHttp(stage: string, detail: any) {
    (window as any).forceLog = true;
    const parts = [
        detail.requestKey ? " key = " + detail.requestKey : " ",
        detail.uri ? " uri = " + detail.uri : " ",
        detail.url ? " url = " + detail.url : " ",
        void 0 !== detail.status ? " status = " + detail.status : " ",
        void 0 !== detail.code ? " code = " + detail.code : " ",
        detail.method ? " method = " + detail.method : " ",
        void 0 !== detail.elapsedMs ? " cost = " + detail.elapsedMs + " ms " : " ",
        detail.message ? " msg = " + detail.message : " "
    ].filter(Boolean).join("| ");
    console.log(LOG_PREFIX + " " + stage + (parts ? "| " + parts : " "));
}

function reportAnalytics(eventName: string, data: any) {
    BusinessAnalyticsService.reportData(eventName, data);
}

function maybeReportHttpMonitor(path: string, status: any, elapsedMs: any) {
    const rate = HTTP_MONITOR_SAMPLE_RATE;
    if (rate >= 100 || !(rate <= 0) && 100 * Math.random() < rate) {
        reportAnalytics(" http_monitor ", {
            request_path: path || " ",
            request_url: path || " ",
            response_code: Number(status) || 0,
            response_time: Math.max(0, Math.floor(Number(elapsedMs) || 0))
        });
    }
}

function reportIpRequestErr(errType: string) {
    reportAnalytics(" ip_request_err ", {
        err_type: errType
    });
}

class RequestPayloadBuilder {
    _data: any;
    _trace: any;

    constructor(trace: any) {
        this._data = {};
        this._trace = trace;
        const yid = ClientDataStore.yid || " ";
        this._data.yid = " yid_read_fail " === yid || " yid_read_failed " === yid ? " " : yid;
        this._data.device_id = ClientDataStore.device_id || " ";
    }

    append(key: string, value: any) {
        this._data[key] = value;
    }

    toJSON() {
        return JSON.stringify(this._data);
    }

    toText() {
        const json = this.toJSON();
        return CryptoHelper.encrypt(json, ClientDataStore.box_pkg_name);
    }

    trace() {
        return this._trace;
    }
}

function buildLParams(uri: string, gameVersion: string) {
    const params: any = {};
    for (const part of ClientDataStore.commonUrlStr.split("& ")) {
        const pair = part.split(" = ");
        const key = pair[0];
        const value = pair[1];
        key && (params[key] = value);
    }
    const ts = Math.floor(Date.now() / 1e3);
    const nonce = ClientDataStore.uuid();
    params.nonce_str = nonce;
    params.et = ts;
    params.ngister = CryptoHelper.ngister("/ " + uri, ts.toString(), nonce, ClientDataStore.version_name, ClientDataStore.channel_name, ClientDataStore.device_id, ClientDataStore.box_pkg_name);
    params.game_version = gameVersion;
    return params;
}

function buildRequestPayload(data: any, requestKey: string, gameVersion: string) {
    const uri = requestDescriptor.getUri(requestKey);
    const builder = new RequestPayloadBuilder({
        requestKey: requestKey,
        uri: uri,
        startedAt: nowMs()
    });
    data = { ...data };
    data.l_params = buildLParams(uri, gameVersion);
    builder.trace().businessPlainData = data;
    let encrypted: string;
    const url = buildRequestUrl(requestKey);
    logParts(LOG_PREFIX + " REQ_PARAMS| key = " + requestKey, [
        " method: POST ",
        " contentType: text/ plain ",
        " url: " + url,
        " yid: " + ClientDataStore.yid,
        " device_id: " + ClientDataStore.device_id,
        " l_params: " + stringifySafe(data.l_params),
        " data: " + stringifySafe(data)
    ]);
    encrypted = SystemDataStore.encrypt ? CryptoHelper.encrypt(JSON.stringify(data), ClientDataStore.box_pkg_name) : JSON.stringify(data);
    builder.append(" business_data ", encrypted);
    return builder;
}

function buildRequestUrl(requestKey: string) {
    const country = ClientDataStore.local_country || " ";
    return SystemDataStore.get_request_url() + requestDescriptor.getUri(requestKey) + "? pkg = " + ClientDataStore.package_name + "& cy = " + country;
}

class RequestCallbackHandler {
    _successHandle: any;
    _failHandle: any;
    _enqueue: boolean;
    _retry: boolean;

    constructor(requestKey: string, successHandle: any, failHandle: any) {
        this._successHandle = successHandle;
        this._failHandle = failHandle;
        this._enqueue = requestDescriptor.needEnqueue(requestKey);
        this._retry = this._enqueue;
    }

    success(data: any) {
        this._successHandle?.runWith(data);
    }

    fail(data: any) {
        this._failHandle?.runWith(data);
        return this._retry;
    }

    enterQueue() {
        return this._enqueue;
    }

    needRetry() {
        return this._retry;
    }
}

function createQueueHooks(retryFn: any) {
    return {
        shouldEnqueue: function (handler: RequestCallbackHandler) {
            return handler.enterQueue();
        },
        shouldRetry: function (handler: RequestCallbackHandler) {
            return handler.needRetry();
        },
        refreshUrlOnRetry: function () {
            return " ";
        },
        onRetry: function (payload: any, callback: any) {
            logHttp(" RETRY ", {
                message: stringifySafe(payload)
            });
            retryFn(payload, callback);
        },
        onQueueCallback: function () { },
        parseSuccessResponse: function (ctx: any) {
            const url = ctx.url;
            const reqData = ctx.reqData;
            const responseText = ctx.responseText;
            const status = ctx.status;
            const trace = reqData.trace();
            const elapsedMs = nowMs() - trace.startedAt;
            maybeReportHttpMonitor(url, status, elapsedMs);
            if (!responseText) {
                reportIpRequestErr(" onreadystatechange ");
                logHttp(" FAIL ", {
                    requestKey: trace.requestKey,
                    uri: trace.uri,
                    url: url,
                    status: status,
                    elapsedMs: elapsedMs,
                    message: " response empty "
                });
                return {
                    success: false,
                    data: {
                        code: -1,
                        message: " 返回数据不存在 "
                    }
                };
            }
            let body = responseText;
            try {
                const decrypted = CryptoHelper.decrypt(responseText, ClientDataStore.box_pkg_name);
                decrypted && (body = decrypted);
            } catch (e) {
                console.warn(LOG_PREFIX + " DECRYPT_FAIL| key = " + trace.requestKey + "| url = " + url, e);
            }
            let parsed: any;
            try {
                parsed = JSON.parse(body);
            } catch (e) {
                reportIpRequestErr(" parseErr ");
                logHttp(" FAIL ", {
                    requestKey: trace.requestKey,
                    uri: trace.uri,
                    url: url,
                    status: status,
                    elapsedMs: elapsedMs,
                    message: " response parse fail "
                });
                console.error(LOG_PREFIX + " RESP_PARSE_FAIL| key = " + trace.requestKey + "| raw = " + responseText);
                return {
                    success: false,
                    data: {
                        code: -1,
                        message: " 响应解析失败 ",
                        raw: responseText
                    }
                };
            }
            logParts(LOG_PREFIX + " RESP_BODY| key = " + trace.requestKey, [
                " method: POST ",
                " url: " + url,
                " status: " + status,
                " body: " + body
            ]);
            if (-1 === parsed.code || -1e3 === parsed.code) {
                logHttp(" FAIL ", {
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
            logHttp(" SUCCESS ", {
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
        buildRequestBody: function (reqData: RequestPayloadBuilder) {
            const trace = reqData.trace();
            const rawBody = reqData.toJSON();
            const encryptedBody = reqData.toText();
            logParts(LOG_PREFIX + " REQ_BODY| key = " + trace.requestKey + "| uri = " + trace.uri, [
                " business_plain: " + stringifySafe(trace.businessPlainData || {}),
                " raw_body: " + rawBody,
                " encrypted_body: " + encryptedBody
            ]);
            return encryptedBody;
        },
        onRequestStart: function (ctx: any) {
            const url = ctx.url;
            const reqData = ctx.reqData;
            const requestBody = ctx.requestBody;
            const trace = reqData.trace();
            trace.startedAt = nowMs();
            logHttp(" START ", {
                requestKey: trace.requestKey,
                uri: trace.uri,
                url: url,
                method: " POST "
            });
            logParts(LOG_PREFIX + " START_DETAIL| key = " + trace.requestKey + "| uri = " + trace.uri, [
                " method: POST ",
                " contentType: text/ plain ",
                " url: " + url,
                " body_size: " + String(requestBody || " ").length,
                " body: " + String(requestBody || " ")
            ]);
        },
        createStatusError: function (ctx: any) {
            const url = ctx.url;
            const reqData = ctx.reqData;
            const status = ctx.status;
            const trace = reqData.trace();
            const elapsedMs = nowMs() - trace.startedAt;
            maybeReportHttpMonitor(url, status, elapsedMs);
            reportIpRequestErr(" onreadystatechange ");
            logHttp(" FAIL ", {
                requestKey: trace.requestKey,
                uri: trace.uri,
                url: url,
                status: status,
                elapsedMs: elapsedMs,
                message: " xhr.status " + status
            });
            return {
                code: -1,
                message: " xhr.status " + status,
                http_status: status
            };
        },
        createRuntimeError: function (ctx: any) {
            const url = ctx.url;
            const reqData = ctx.reqData;
            const status = ctx.status;
            const reason = ctx.reason;
            const trace = reqData.trace();
            const elapsedMs = nowMs() - trace.startedAt;
            maybeReportHttpMonitor(url, status, elapsedMs);
            reportIpRequestErr(" timeout " === reason ? " ontimeout " : " onerror ");
            logHttp(" FAIL ", {
                requestKey: trace.requestKey,
                uri: trace.uri,
                url: url,
                status: status,
                elapsedMs: elapsedMs,
                message: " onXhr." + reason
            });
            return {
                code: -1,
                message: " onXhr." + reason,
                http_status: status
            };
        },
        dispatchResult: function (handler: RequestCallbackHandler, success: boolean, data: any) {
            handler && (success ? handler.success(data) : handler.fail(data));
        }
    };
}

export default class LoadingHttpService {
    static engine: any;
    static gameVersion = " 1.0.0.0 ";
    static SDK_WD_BASE = " https:// hxjxd.casharrows.com/ vunuar/ ";
    static SDK_WD_URI = " c_l ";
    static SDK_WD_VERIFY_URI = " ck_i ";

    static reportHttpErr(response: any) {
        reportAnalytics(" httpErr ", {
            response: stringifySafe(response),
            category: " network_error "
        });
    }

    static init(retryFn: any) {
        LoadingHttpService.engine || (LoadingHttpService.engine = new RequestQueueEngine(createQueueHooks(retryFn)));
    }

    static setGameVersion(version: string) {
        LoadingHttpService.gameVersion = version;
    }

    static request(requestKey: string, data: any, successHandle: any, failHandle: any) {
        const url = buildRequestUrl(requestKey);
        const payload = buildRequestPayload(data || {}, requestKey, LoadingHttpService.gameVersion);
        const handler = new RequestCallbackHandler(requestKey, successHandle, failHandle);
        LoadingHttpService.engine.queuePost(url, payload, handler);
    }

    static syncFirebaseToken(token: string, successHandle: any, failHandle: any) {
        reportAnalytics(" sync_firebase_token ", {
            firebase_token: token
        });
        const normalized = String(token || " ").trim();
        normalized ? LoadingHttpService.request(" FirebaseToken ", {
            firebase_token: normalized
        }, successHandle, failHandle) : null == failHandle || failHandle.runWith({
            code: -1,
            message: " firebase_token empty "
        });
    }

    static getSystemConfig(successHandle: any, failHandle: any) {
        LoadingHttpService.request(" config ", null, successHandle, failHandle);
    }

    static autoLogin(data: any, successHandle: any, failHandle: any) {
        LoadingHttpService.request(" auto_submit ", data, successHandle, failHandle);
    }

    static touristsLogin(data: any, successHandle: any, failHandle: any) {
        LoadingHttpService.request(" TouristLogin ", data, successHandle, failHandle);
    }

    static getGameConfig(successHandle: any, failHandle: any) {
        LoadingHttpService.request(" GetGameConfig ", null, successHandle, failHandle);
    }

    static getUserInfo(successHandle: any, failHandle: any) {
        LoadingHttpService.request(" UserInfo ", null, successHandle, failHandle);
    }

    static getWithdrawInfo(successHandle: any, failHandle: any) {
        LoadingHttpService.request(" WithdrawInfo ", null, successHandle, failHandle);
    }

    static withdrawCash(data: any, successHandle: any, failHandle: any) {
        LoadingHttpService.request(" WithdrawCash ", data, successHandle, failHandle);
    }

    static bindTxAccount(data: any, successHandle: any, failHandle: any) {
        LoadingHttpService.request(" BindTxAccount ", data, successHandle, failHandle);
    }

    static getBarrageList(successHandle: any, failHandle: any) {
        LoadingHttpService.request(" BarrageList ", null, successHandle, failHandle);
    }

    static getTaskInfo(taskTypeOrSuccess: any, successOrFail?: any, failHandle?: any) {
        let taskType = " ";
        let successHandle: any;
        let failHandler: any;
        if (" string " == typeof taskTypeOrSuccess) {
            taskType = taskTypeOrSuccess || " ";
            successHandle = successOrFail;
            failHandler = failHandle;
        } else {
            successHandle = taskTypeOrSuccess;
            failHandler = successOrFail;
        }
        const payload: any = {};
        taskType && (payload.task_type = taskType);
        LoadingHttpService.request(" TaskInfo ", Object.keys(payload).length > 0 ? payload : null, successHandle, failHandler);
    }

    static claimTaskReward(taskId: any, taskType: any, successHandle: any, failHandle: any) {
        const payload: any = {
            task_id: taskId || " "
        };
        taskType && (payload.task_type = taskType);
        LoadingHttpService.request(" TaskOnlyReward ", payload, successHandle, failHandle);
    }

    static claimTaskAdReward(taskId: any, extra: any, taskType: any, successHandle: any, failHandle: any) {
        const payload = Object.assign({}, extra || {}, {
            task_id: taskId || " "
        });
        taskType && (payload.task_type = taskType);
        LoadingHttpService.request(" TaskShowReward ", payload, successHandle, failHandle);
    }

    static buildSdkQueryString(extra: any) {
        const userId = ClientDataStore.user_id || " ";
        let yid = ClientDataStore.yid || " ";
        yid = " yid_read_fail " === yid || " yid_read_failed " === yid ? " " : yid;
        const ts = Math.floor(Date.now() / 1e3);
        const nonce = ClientDataStore.uuid();
        const ngister = CryptoHelper.ngister(" ", ts.toString(), nonce, ClientDataStore.version_name, ClientDataStore.channel_name, ClientDataStore.device_id, ClientDataStore.box_pkg_name);
        logParts(LOG_PREFIX + " SDK_NGISTER_PARAMS ", [
            '  url(signPath)   : " "',
            '  time(et)        : " ' + ts + ' "',
            '  nonce(nonce_str): " ' + nonce + ' "',
            '  versionName     : " ' + ClientDataStore.version_name + ' "',
            '  channelName     : " ' + ClientDataStore.channel_name + ' "',
            '  deviceId        : " ' + ClientDataStore.device_id + ' "',
            '  boxPkgName      : " ' + ClientDataStore.box_pkg_name + ' "',
            '  => ngister      : " ' + ngister + ' "'
        ]);
        const parts: string[] = [];
        parts.push(" user_id = " + userId);
        parts.push(" yid = " + yid);
        const commonUrlStr = ClientDataStore.commonUrlStr;
        commonUrlStr && parts.push(commonUrlStr);
        parts.push(" nonce_str = " + nonce);
        parts.push(" et = " + ts);
        parts.push(" ngister = " + ngister);
        parts.push(" sign_type = 3 ");
        parts.push(" country = " + (ClientDataStore.local_country || " "));
        parts.push(" cy = " + (ClientDataStore.local_country || " "));
        if (extra) {
            for (const key of Object.keys(extra)) {
                parts.push(key + " = " + (extra[key] || " "));
            }
        }
        return parts.join("& ");
    }

    static sdkRequest(requestKey: string, data: any, successHandle: any, failHandle: any, includeBody: boolean = false, stringifyQueryValues: boolean = true) {
        const uri = requestDescriptor.getUri(requestKey);
        const country = ClientDataStore.local_country || " ";
        const url = LoadingHttpService.SDK_WD_BASE + uri + "? package_name = " + ClientDataStore.package_name + "& cy = " + country;
        const userId = ClientDataStore.user_id || " ";
        const queryParams: any = {};
        if (stringifyQueryValues && data && " object " == typeof data) {
            for (const key of Object.keys(data)) {
                queryParams[key] = String(null !== data[key] && void 0 !== data[key] ? data[key] : " ");
            }
        }
        const query = LoadingHttpService.buildSdkQueryString(queryParams);
        const body: any = {
            user_id: userId
        };
        if (includeBody && data && " object " == typeof data) {
            for (const key of Object.keys(data)) {
                body[key] = null !== data[key] && void 0 !== data[key] ? data[key] : " ";
            }
        }
        body.query = query;
        const rawBody = JSON.stringify(body);
        const encryptedBody = CryptoHelper.encrypt(rawBody, ClientDataStore.box_pkg_name);
        logParts(LOG_PREFIX + " SDK_REQ| key = " + requestKey, [
            " method: POST ",
            " contentType: text/ plain ",
            " url: " + url,
            " raw_body: " + rawBody,
            " encrypted: " + (encryptedBody || " ").substring(0, 120) + "..."
        ]);
        const xhr = new XMLHttpRequest();
        xhr.timeout = 15e3;
        xhr.onreadystatechange = function () {
            if (4 === xhr.readyState) {
                if (xhr.status >= 200 && xhr.status < 300) {
                    const responseText = xhr.responseText || " ";
                    logParts(LOG_PREFIX + " SDK_RESP_RAW| key = " + requestKey, [
                        " method: POST ",
                        " status: " + xhr.status,
                        " raw: " + responseText.substring(0, 500)
                    ]);
                    let bodyText = responseText;
                    try {
                        const decrypted = CryptoHelper.decrypt(responseText, ClientDataStore.box_pkg_name);
                        if (decrypted) {
                            bodyText = decrypted;
                            console.log(LOG_PREFIX + " SDK_RESP_DECRYPTED| " + bodyText.substring(0, 500));
                        }
                    } catch (e) {
                        console.warn(LOG_PREFIX + " SDK_RESP decrypt skip ", e);
                    }
                    try {
                        const parsed = JSON.parse(bodyText);
                        logHttp(" SUCCESS ", {
                            url: url,
                            status: xhr.status,
                            code: parsed.code
                        });
                        null == successHandle || successHandle.runWith(parsed);
                    } catch (e) {
                        logHttp(" FAIL ", {
                            url: url,
                            status: xhr.status,
                            message: " parse error "
                        });
                        console.error(LOG_PREFIX + " SDK_RESP_PARSE_FAIL| respText = " + bodyText.substring(0, 500));
                        null == failHandle || failHandle.runWith({
                            code: -1,
                            message: " 响应解析失败 "
                        });
                    }
                } else {
                    logHttp(" FAIL ", {
                        url: url,
                        status: xhr.status,
                        message: " http error " + xhr.status
                    });
                    null == failHandle || failHandle.runWith({
                        code: -1,
                        message: " 请求失败 ",
                        http_status: xhr.status
                    });
                }
            }
        };
        xhr.onerror = function () {
            logHttp(" FAIL ", {
                url: url,
                message: " network error "
            });
            null == failHandle || failHandle.runWith({
                code: -1,
                message: " 网络错误 "
            });
        };
        xhr.ontimeout = function () {
            logHttp(" FAIL ", {
                url: url,
                message: " timeout "
            });
            null == failHandle || failHandle.runWith({
                code: -1,
                message: " 请求超时 "
            });
        };
        logHttp(" START ", {
            url: url,
            method: " POST "
        });
        xhr.open(" POST ", url, true);
        xhr.setRequestHeader(" Content- Type ", " text/ plain ");
        xhr.send(encryptedBody);
    }

    static getWithdrawChannels(successHandle: any, failHandle: any) {
        LoadingHttpService.sdkRequest(" WithdrawChannels ", null, successHandle, failHandle);
    }

    static verifyWithdrawBindInfo(data: any, successHandle: any, failHandle: any) {
        const info = " string " == typeof (null == data ? void 0 : data.info) ? data.info : JSON.stringify((null == data ? void 0 : data.info) || {});
        LoadingHttpService.sdkRequest(" VerifyBindInfo ", {
            channel: (null == data ? void 0 : data.channel) || " ",
            sub_channel: (null == data ? void 0 : data.sub_channel) || " ",
            info: info
        }, successHandle, failHandle, true, false);
    }

    static getArrowLevelConfig(data: any, successHandle: any, failHandle: any) {
        LoadingHttpService.request(" ArrowLevelConfig ", data, successHandle, failHandle);
    }

    static arrowRewardSettle(data: any, successHandle: any, failHandle: any) {
        LoadingHttpService.request(" ArrowRewardSettle ", data, successHandle, failHandle);
    }

    static claimArrowReward(data: any, successHandle: any, failHandle: any) {
        const payload = Object.assign({}, data || {});
        payload.business_type || (payload.business_type = " arrow ");
        " task " !== payload.business_type ? delete payload.task_type : " ltv " !== String(payload.task_type || " ").toLowerCase() && delete payload.task_type;
        LoadingHttpService.request(" ArrowClaimReward ", payload, successHandle, failHandle);
    }

    static claimArrowAdReward(data: any, successHandle: any, failHandle: any) {
        const payload = Object.assign({}, data || {});
        payload.business_type || (payload.business_type = " arrow ");
        " task " !== payload.business_type ? delete payload.task_type : " ltv " !== String(payload.task_type || " ").toLowerCase() && delete payload.task_type;
        LoadingHttpService.request(" ArrowClaimAdReward ", payload, successHandle, failHandle);
    }

    static consumeArrowProp(data: any, successHandle: any, failHandle: any) {
        LoadingHttpService.request(" ArrowConsumeProp ", data, successHandle, failHandle);
    }

    static buildHotUpdateBody(data: any) {
        return buildRequestPayload(data, " HotUpdate ", LoadingHttpService.gameVersion).toText();
    }
}
