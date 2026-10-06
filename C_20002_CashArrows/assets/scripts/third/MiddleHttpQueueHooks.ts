interface MiddleRequestData {
    toMiddleJSON(): string;
}

interface QueueCallbackInfo {
    requestTime: number;
    responseCode: number;
    url: string;
}

interface HttpMonitorInfo {
    req_url: string;
    response_code: number;
    response_time: number;
}

interface ParseSuccessArgs {
    url: string;
    reqData: MiddleRequestData;
    responseText: string;
    status: number;
}

interface StatusErrorArgs {
    url: string;
    reqData: MiddleRequestData;
    status: number;
}

interface RuntimeErrorArgs {
    url: string;
    status: number;
    statusText: string;
    reason: string;
}

interface MiddleCallback {
    success(data: unknown): void;
    fail(data: unknown): unknown;
}

export interface MiddleHttpQueueHookOptions {
    decrypt?(text: string): string;
    refreshUrlOnRetry?(callback: MiddleCallback): string;
    onRetry?(error: unknown, retry: () => void): void;
    shouldReportHttpMonitor?(): boolean;
    reportHttpMonitor?(info: HttpMonitorInfo): void;
}

export function createMiddleHttpQueueHooks(
    log: (...args: unknown[]) => void,
    isReleaseModel: () => boolean,
    randomInt: (min: number, max: number) => number,
    options: MiddleHttpQueueHookOptions = {},
): Record<string, unknown> {
    return {
        shouldEnqueue(callback: { enterQueue(): boolean }) {
            return callback.enterQueue();
        },
        shouldRetry(callback: { needRetry(): boolean }) {
            return callback.needRetry();
        },
        refreshUrlOnRetry(callback: MiddleCallback) {
            return options.refreshUrlOnRetry ? options.refreshUrlOnRetry(callback) : "";
        },
        onRetry(error: unknown, retry: () => void) {
            return options.onRetry ? options.onRetry(error, retry) : retry();
        },
        onQueueCallback(info: QueueCallbackInfo) {
            const shouldReport = options.shouldReportHttpMonitor ? options.shouldReportHttpMonitor() : isReleaseModel() && randomInt(1, 100) <= 5;
            if (shouldReport) {
                options.reportHttpMonitor?.({
                    req_url: info.url,
                    response_code: info.responseCode,
                    response_time: Date.now() - info.requestTime,
                });
            }
        },
        parseSuccessResponse(args: ParseSuccessArgs) {
            const { url, reqData, responseText, status } = args;
            if (!responseText) {
                log("【CC Network Err】url1:", url);
                log("【CC Network Err】body:", reqData.toMiddleJSON());
                log("【CC Network Err】decode body:", options.decrypt ? options.decrypt(reqData.toMiddleJSON()) : reqData.toMiddleJSON());
                log("【CC Network Err】err:", "response 为空");
                return {
                    success: false,
                    data: { code: -1, message: "返回数据不存在", http_status: status },
                };
            }
            log("【CC Network】url:", url);
            log("【CC Network】response:", responseText);
            const decrypted = options.decrypt ? options.decrypt(responseText) : responseText;
            if (!decrypted) {
                console.error("【CC Network Err】decrypt response error:", url);
                return {
                    success: false,
                    data: { code: -1, message: "decrypt response error", http_status: status },
                };
            }
            const parsed = JSON.parse(decrypted);
            if (parsed.data !== null && Object.keys(parsed.data).length !== 0) {
                log("【CC Network Suc】url:", url);
                log("【CC Network Suc】body:", reqData.toMiddleJSON());
                log("【CC Network Suc】decode body:", options.decrypt ? options.decrypt(reqData.toMiddleJSON()) : reqData.toMiddleJSON());
                log("【CC Network Suc】response:", JSON.stringify(responseText));
                log("【CC Network Suc】respon:", JSON.stringify(decrypted));
                log("【CC Network Suc】res:", JSON.stringify(parsed.data));
                return { success: true, data: parsed.data };
            }
            log("【CC Network Err】url0:", url);
            log("【CC Network Err】body:", reqData.toMiddleJSON());
            log("【CC Network Err】decode body:", options.decrypt ? options.decrypt(reqData.toMiddleJSON()) : reqData.toMiddleJSON());
            log("【CC Network Err】err:", "data 为空 - message:" + parsed.message);
            return {
                success: false,
                data: { code: -1, message: "Data不存在", http_status: status },
            };
        },
        buildRequestBody(reqData: MiddleRequestData) {
            return reqData.toMiddleJSON();
        },
        onRequestStart(args: { url: string; reqData: MiddleRequestData }) {
            log("【CC Network start】url:", args.url);
            log("【CC Network start】body:", args.reqData.toMiddleJSON());
            log("【CC Network start】decode body:", options.decrypt ? options.decrypt(args.reqData.toMiddleJSON()) : args.reqData.toMiddleJSON());
        },
        createStatusError(args: StatusErrorArgs) {
            log("【CC Network Err】url2:", args.url);
            log("【CC Network Err】body:", args.reqData.toMiddleJSON());
            log("【CC Network Err】decode body:", options.decrypt ? options.decrypt(args.reqData.toMiddleJSON()) : args.reqData.toMiddleJSON());
            log("【CC Network Err】err:", "xhr.status = " + args.status);
            return { code: -1, message: "xhr.status" + args.status, http_status: args.status };
        },
        createRuntimeError(args: RuntimeErrorArgs) {
            return {
                code: -1,
                message: "onXhr." + args.reason,
                http_status: args.status,
                statuText: args.statusText,
                url: args.url,
            };
        },
        dispatchResult(callback: MiddleCallback | null, success: boolean, data: unknown) {
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
