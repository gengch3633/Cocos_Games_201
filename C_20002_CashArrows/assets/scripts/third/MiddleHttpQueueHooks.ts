export function createMiddleHttpQueueHooks(
    log: (...args: any[]) => void,
    isReady: () => boolean,
    randomInt: (min: number, max: number) => number,
    options: {
        refreshUrlOnRetry?: (ctx: any) => string;
        onRetry?: (ctx: any, retry: () => void) => void;
        shouldReportHttpMonitor?: () => boolean;
        reportHttpMonitor?: (data: any) => void;
        decrypt?: (text: string) => string;
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
            if (options.shouldReportHttpMonitor ? options.shouldReportHttpMonitor() : isReady() && randomInt(1, 100) <= 5) {
                const responseTime = Date.now() - requestTime;
                options.reportHttpMonitor?.({
                    req_url: url,
                    response_code: responseCode,
                    response_time: responseTime,
                });
            }
        },

        parseSuccessResponse(ctx: any): { success: boolean; data: any } {
            const url = ctx.url;
            const reqData = ctx.reqData;
            const responseText = ctx.responseText;
            const status = ctx.status;
            if (!responseText) {
                log("【CC Network Err】url1:", url);
                log("【CC Network Err】body:", reqData.toMiddleJSON());
                log("【CC Network Err】decode body:", options.decrypt ? options.decrypt(reqData.toMiddleJSON()) : reqData.toMiddleJSON());
                log("【CC Network Err】err:", "response 为空");
                return {
                    success: false,
                    data: {
                        code: -1,
                        message: "返回数据不存在",
                        http_status: status,
                    },
                };
            }
            log("【CC Network】url:", url);
            log("【CC Network】response:", responseText);
            const decrypted = options.decrypt ? options.decrypt(responseText) : responseText;
            if (!decrypted) {
                console.error("【CC Network Err】decrypt response error:", url);
                return {
                    success: false,
                    data: {
                        code: -1,
                        message: "decrypt response error",
                        http_status: status,
                    },
                };
            }
            const parsed = JSON.parse(decrypted);
            if (parsed.data !== null && Object.keys(parsed.data).length !== 0) {
                log("【CC Network Suc】url:", url);
                log("【CC Network Suc】body:", reqData.toMiddleJSON());
                log("【CC Network Suc】decode body:", options.decrypt ? options.decrypt(reqData.toMiddleJSON()) : reqData.toMiddleJSON());
                log("【CC Network Suc】response:", JSON.stringify(responseText));
                log("【CC Network Suc】respon:", JSON.stringify(decrypted));
                const data = parsed.data;
                log("【CC Network Suc】res:", JSON.stringify(data));
                return {
                    success: true,
                    data,
                };
            }
            log("【CC Network Err】url0:", url);
            log("【CC Network Err】body:", reqData.toMiddleJSON());
            log("【CC Network Err】decode body:", options.decrypt ? options.decrypt(reqData.toMiddleJSON()) : reqData.toMiddleJSON());
            log("【CC Network Err】err:", "data 为空 - message:" + parsed.message);
            return {
                success: false,
                data: {
                    code: -1,
                    message: "Data不存在",
                    http_status: status,
                },
            };
        },

        buildRequestBody(ctx: any): string {
            return ctx.toMiddleJSON();
        },

        onRequestStart(ctx: any): void {
            const url = ctx.url;
            const reqData = ctx.reqData;
            log("【CC Network start】url:", url);
            log("【CC Network start】body:", reqData.toMiddleJSON());
            log("【CC Network start】decode body:", options.decrypt ? options.decrypt(reqData.toMiddleJSON()) : reqData.toMiddleJSON());
        },

        createStatusError(ctx: any): any {
            const url = ctx.url;
            const reqData = ctx.reqData;
            const status = ctx.status;
            log("【CC Network Err】url2:", url);
            log("【CC Network Err】body:", reqData.toMiddleJSON());
            log("【CC Network Err】decode body:", options.decrypt ? options.decrypt(reqData.toMiddleJSON()) : reqData.toMiddleJSON());
            log("【CC Network Err】err:", "xhr.status = " + status);
            return {
                code: -1,
                message: "xhr.status" + status,
                http_status: status,
            };
        },

        createRuntimeError(ctx: any): any {
            const url = ctx.url;
            const status = ctx.status;
            const statusText = ctx.statusText;
            return {
                code: -1,
                message: "onXhr." + ctx.reason,
                http_status: status,
                statuText: statusText,
                url,
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
