export function createBusinessHttpQueueHooks(log: any, options: any = {}) {
    return {
        shouldEnqueue: function (request: any) {
            return request.enterQueue();
        },
        shouldRetry: function (request: any) {
            return request.needRetry();
        },
        refreshUrlOnRetry: function (request: any) {
            return options.refreshUrlOnRetry ? options.refreshUrlOnRetry(request) : "";
        },
        onRetry: function (response: any, next: any) {
            log("【YW Network Retry】res:", stringify(response));
            options.onRetry ? options.onRetry(response, next) : next();
        },
        onQueueCallback: function (info: any) {
            const requestTime = info.requestTime;
            const responseCode = info.responseCode;
            const url = info.url;
            if (options.shouldReportHttpMonitor && options.shouldReportHttpMonitor()) {
                const elapsed = Date.now() - requestTime;
                options.reportHttpMonitor && options.reportHttpMonitor({
                    request_path: url, response_code: responseCode, response_time: elapsed
                });
            }
        },
        parseSuccessResponse: function (info: any) {
            const url = info.url;
            const reqData = info.reqData;
            const responseText = info.responseText;
            if (!responseText) {
                log("【YW Network Err】url1:", url);
                log("【YW Network Err】body:", reqData.toText());
                log("【YW Network Err】err:", "response 为空");
                return {
                    success: false,
                    data: {
                        code: -1,
                        message: "返回数据不存在"
                    }
                };
            }
            let decrypted = options.decryptResponse ? options.decryptResponse(responseText) : responseText;
            decrypted || (decrypted = responseText);
            const parsed = JSON.parse(decrypted);
            log("【YW Network Suc】url:", url);
            log("【YW Network Suc】body:", reqData.toText());
            log("【YW Network Suc】response:", JSON.stringify(responseText));
            log("【YW Network Suc】respon:", JSON.stringify(decrypted));
            log("【YW Network Suc】res:", JSON.stringify(parsed));
            if (options.getServerReleaseUrl && url.includes(options.getServerReleaseUrl())) {
                const code = parsed.code;
                return -1 == code || -1e3 == code ? {
                    success: false,
                    data: parsed
                } : {
                    success: true,
                    data: parsed
                };
            }
            return {
                success: true,
                data: parsed
            };
        },
        buildRequestBody: function (reqData: any) {
            return reqData.toText();
        },
        onRequestStart: function (info: any) {
            const url = info.url;
            const reqData = info.reqData;
            log("【YW Network Start】url:", url);
            log("【YW Network Start】body:", reqData.toText());
        },
        createStatusError: function (xhr: any) {
            const status = xhr.status;
            return {
                code: -1,
                message: "xhr.status" + status,
                http_status: status
            };
        },
        createRuntimeError: function (error: any) {
            const status = error.status;
            return {
                code: -1,
                message: "onXhr." + error.reason,
                http_status: status
            };
        },
        dispatchResult: function (callback: any, ok: any, data: any) {
            callback && (ok ? callback.success(data) : callback.fail(data));
        }
    };
}

function stringify(value: any) {
    try {
        return JSON.stringify(value);
    } catch (t) {
        return String(value);
    }
}
