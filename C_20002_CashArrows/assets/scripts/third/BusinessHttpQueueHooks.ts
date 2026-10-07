function stringifySafe(value: any): string {
    try {
        return JSON.stringify(value);
    } catch (e) {
        return String(value);
    }
}

export function createBusinessHttpQueueHooks(
    log: (...args: any[]) => void,
    options: {
        refreshUrlOnRetry?: (ctx: any) => string;
        onRetry?: (ctx: any, retry: () => void) => void;
        shouldReportHttpMonitor?: () => boolean;
        reportHttpMonitor?: (data: any) => void;
        decryptResponse?: (text: string) => string;
        getServerReleaseUrl?: () => string;
    } = {}
): any {
    return {
        shouldEnqueue(ctx: any): boolean {
            return ctx.enterQueue();
        },

        shouldRetry(ctx: any): boolean {
            return ctx.needRetry();
        },

        refreshUrlOnRetry(ctx: any): string {
            return options.refreshUrlOnRetry ? options.refreshUrlOnRetry(ctx) : "";
        },

        onRetry(ctx: any, retry: () => void): void {
            log("【YW Network Retry】res:", stringifySafe(ctx));
            if (options.onRetry) {
                options.onRetry(ctx, retry);
            } else {
                retry();
            }
        },

        onQueueCallback(ctx: any): void {
            const requestTime = ctx.requestTime;
            const responseCode = ctx.responseCode;
            const url = ctx.url;
            if (options.shouldReportHttpMonitor && options.shouldReportHttpMonitor()) {
                const responseTime = Date.now() - requestTime;
                options.reportHttpMonitor?.({
                    request_path: url,
                    response_code: responseCode,
                    response_time: responseTime,
                });
            }
        },

        parseSuccessResponse(ctx: any): { success: boolean; data: any } {
            const url = ctx.url;
            const reqData = ctx.reqData;
            const responseText = ctx.responseText;
            if (!responseText) {
                log("【YW Network Err】url1:", url);
                log("【YW Network Err】body:", reqData.toText());
                log("【YW Network Err】err:", "response 为空");
                return {
                    success: false,
                    data: { code: -1, message: "返回数据不存在" },
                };
            }
            let decrypted = options.decryptResponse ? options.decryptResponse(responseText) : responseText;
            if (!decrypted) {
                decrypted = responseText;
            }
            const parsed = JSON.parse(decrypted);
            log("【YW Network Suc】url:", url);
            log("【YW Network Suc】body:", reqData.toText());
            log("【YW Network Suc】response:", JSON.stringify(responseText));
            log("【YW Network Suc】respon:", JSON.stringify(decrypted));
            log("【YW Network Suc】res:", JSON.stringify(parsed));
            if (options.getServerReleaseUrl && url.includes(options.getServerReleaseUrl())) {
                const code = parsed.code;
                return code == -1 || code == -1000
                    ? { success: false, data: parsed }
                    : { success: true, data: parsed };
            }
            return { success: true, data: parsed };
        },

        buildRequestBody(ctx: any): string {
            return ctx.toText();
        },

        onRequestStart(ctx: any): void {
            log("【YW Network Start】url:", ctx.url);
            log("【YW Network Start】body:", ctx.reqData.toText());
        },

        createStatusError(ctx: any): any {
            return {
                code: -1,
                message: "xhr.status" + ctx.status,
                http_status: ctx.status,
            };
        },

        createRuntimeError(ctx: any): any {
            return {
                code: -1,
                message: "onXhr." + ctx.reason,
                http_status: ctx.status,
            };
        },

        dispatchResult(handler: any, success: boolean, data: any): void {
            if (handler) {
                if (success) {
                    handler.success(data);
                } else {
                    handler.fail(data);
                }
            }
        },
    };
}
