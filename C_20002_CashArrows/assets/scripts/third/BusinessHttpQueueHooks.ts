function stringifySafe(value: any): string {
    try {
        return JSON.stringify(value);
    } catch (e) {
        return String(value);
    }
}

export function createBusinessHttpQueueHooks(logger: (...args: any[]) => void, options: any = {}): any {
    return {
        shouldEnqueue(request: any): boolean {
            return request.enterQueue();
        },
        shouldRetry(request: any): boolean {
            return request.needRetry();
        },
        refreshUrlOnRetry(request: any): string {
            return options.refreshUrlOnRetry ? options.refreshUrlOnRetry(request) : "";
        },
        onRetry(response: any, retry: () => void): void {
            logger("【YW Network Retry】res:", stringifySafe(response));
            if (options.onRetry) {
                options.onRetry(response, retry);
            } else {
                retry();
            }
        },
        onQueueCallback(payload: any): void {
            const requestTime = payload.requestTime;
            const responseCode = payload.responseCode;
            const url = payload.url;
            if (options.shouldReportHttpMonitor && options.shouldReportHttpMonitor()) {
                const responseTime = Date.now() - requestTime;
                options.reportHttpMonitor && options.reportHttpMonitor({
                    request_path: url,
                    response_code: responseCode,
                    response_time: responseTime
                });
            }
        },
        parseSuccessResponse(payload: any): { success: boolean; data: any } {
            const url = payload.url;
            const reqData = payload.reqData;
            const responseText = payload.responseText;
            if (!responseText) {
                logger("【YW Network Err】url1:", url);
                logger("【YW Network Err】body:", reqData.toText());
                logger("【YW Network Err】err:", "response 为空");
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
            const parsed = JSON.parse(decrypted);
            logger("【YW Network Suc】url:", url);
            logger("【YW Network Suc】body:", reqData.toText());
            logger("【YW Network Suc】response:", JSON.stringify(responseText));
            logger("【YW Network Suc】respon:", JSON.stringify(decrypted));
            logger("【YW Network Suc】res:", JSON.stringify(parsed));
            if (options.getServerReleaseUrl && url.includes(options.getServerReleaseUrl())) {
                const code = parsed.code;
                return code == -1 || code == -1000 ? {
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
        buildRequestBody(request: any): string {
            return request.toText();
        },
        onRequestStart(payload: any): void {
            logger("【YW Network Start】url:", payload.url);
            logger("【YW Network Start】body:", payload.reqData.toText());
        },
        createStatusError(payload: any): any {
            const status = payload.status;
            return {
                code: -1,
                message: "xhr.status"+ status, http_status: status }; }, createRuntimeError(payload: any): any { const status = payload.status; return { code:-1, message:"onXhr." + payload.reason,
                http_status: status
            };
        },
        dispatchResult(handler: any, success: boolean, data: any): void {
            if (handler) {
                success ? handler.success(data) : handler.fail(data);
            }
        }
    };
}
