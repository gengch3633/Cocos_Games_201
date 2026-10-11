function safeStringify(value: any): string {
    try {
        return JSON.stringify(value);
    } catch (e) {
        return String(value);
    }
}

export function createBusinessHttpQueueHooks(log: (message?: any, ...optionalParams: any[]) => void, options: any = {}): any {
    return {
        shouldEnqueue: function (request: any): boolean {
            return request.enterQueue();
        },
        shouldRetry: function (request: any): boolean {
            return request.needRetry();
        },
        refreshUrlOnRetry: function (request: any): string {
            return options.refreshUrlOnRetry ? options.refreshUrlOnRetry(request) : "";
        },
        onRetry: function (request: any, callback: () => void): void {
            log("【YW Network Retry】res:", safeStringify(request));
            options.onRetry ? options.onRetry(request, callback) : callback();
        },
        onQueueCallback: function (context: any): void {
            const requestTime = context.requestTime;
            const responseCode = context.responseCode;
            const url = context.url;
            if (options.shouldReportHttpMonitor && options.shouldReportHttpMonitor()) {
                const responseTime = Date.now() - requestTime;
                if (options.reportHttpMonitor) {
                    options.reportHttpMonitor({
                        request_path: url,
                        response_code: responseCode,
                        response_time: responseTime
                    });
                }
            }
        },
        parseSuccessResponse: function (context: any): any {
            const url = context.url;
            const reqData = context.reqData;
            const responseText = context.responseText;
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
            if (!decrypted) {
                decrypted = responseText;
            }
            const result = JSON.parse(decrypted);
            log("【YW Network Suc】url:", url);
            log("【YW Network Suc】body:", reqData.toText());
            log("【YW Network Suc】response:", JSON.stringify(responseText));
            log("【YW Network Suc】respon:", JSON.stringify(decrypted));
            log("【YW Network Suc】res:", JSON.stringify(result));
            if (options.getServerReleaseUrl && url.includes(options.getServerReleaseUrl())) {
                const code = result.code;
                return -1 == code || -1000 == code ? {
                    success: false,
                    data: result
                } : {
                    success: true,
                    data: result
                };
            }
            return {
                success: true,
                data: result
            };
        },
        buildRequestBody: function (request: any): string {
            return request.toText();
        },
        onRequestStart: function (context: any): void {
            const url = context.url;
            const reqData = context.reqData;
            log("【YW Network Start】url:", url);
            log("【YW Network Start】body:", reqData.toText());
        },
        createStatusError: function (context: any): any {
            const status = context.status;
            return {
                code: -1,
                message: "xhr.status" + status,
                http_status: status
            };
        },
        createRuntimeError: function (context: any): any {
            const status = context.status;
            return {
                code: -1,
                message: "onXhr." + context.reason,
                http_status: status
            };
        },
        dispatchResult: function (delegate: any, isSuccess: boolean, data: any): void {
            if (delegate) {
                if (isSuccess) {
                    delegate.success(data);
                } else {
                    delegate.fail(data);
                }
            }
        }
    };
}