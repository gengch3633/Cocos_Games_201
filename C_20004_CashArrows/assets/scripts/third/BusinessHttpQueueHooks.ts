export interface HttpQueueRequestData {
    toText(): string;
}

export interface HttpQueueResponseInfo {
    url: string;
    reqData: HttpQueueRequestData;
    responseText: string;
}

export interface HttpQueueResult {
    success: boolean;
    data: any;
}

export interface HttpQueueError {
    code: number;
    message: string;
    http_status: number;
}

export interface HttpQueueMonitorInfo {
    request_path: string;
    response_code: number;
    response_time: number;
}

export interface HttpQueueCallbackInfo {
    requestTime: number;
    responseCode: number;
    url: string;
}

export interface HttpQueueRequestStartInfo {
    url: string;
    reqData: HttpQueueRequestData;
}

export interface HttpQueueDispatchTarget {
    success(data: any): void;
    fail(data: any): void;
}

export interface BusinessHttpQueueOptions {
    refreshUrlOnRetry?: (res: any) => string;
    onRetry?: (res: any, next: () => void) => void;
    shouldReportHttpMonitor?: () => boolean;
    reportHttpMonitor?: (info: HttpQueueMonitorInfo) => void;
    decryptResponse?: (responseText: string) => string;
    getServerReleaseUrl?: () => string;
}

export interface BusinessHttpQueueHooks {
    shouldEnqueue(req: any): boolean;
    shouldRetry(res: any): boolean;
    refreshUrlOnRetry(res: any): string;
    onRetry(res: any, next: () => void): void;
    onQueueCallback(info: HttpQueueCallbackInfo): void;
    parseSuccessResponse(info: HttpQueueResponseInfo): HttpQueueResult;
    buildRequestBody(reqData: HttpQueueRequestData): string;
    onRequestStart(info: HttpQueueRequestStartInfo): void;
    createStatusError(xhr: { status: number }): HttpQueueError;
    createRuntimeError(xhr: { status: number; reason: string }): HttpQueueError;
    dispatchResult(target: HttpQueueDispatchTarget | null, success: boolean, data: any): void;
}

function stringifySafe(value: any): string {
    try {
        return JSON.stringify(value);
    } catch (err) {
        return String(value);
    }
}

export function createBusinessHttpQueueHooks(
    logger: (message: string, ...args: any[]) => void,
    options: BusinessHttpQueueOptions = {}
): BusinessHttpQueueHooks {
    return {
        shouldEnqueue(req: any): boolean {
            return req.enterQueue();
        },

        shouldRetry(res: any): boolean {
            return res.needRetry();
        },

        refreshUrlOnRetry(res: any): string {
            return options.refreshUrlOnRetry ? options.refreshUrlOnRetry(res) : "";
        },

        onRetry(res: any, next: () => void): void {
            logger("【YW Network Retry】res:", stringifySafe(res));
            if (options.onRetry) {
                options.onRetry(res, next);
            } else {
                next();
            }
        },

        onQueueCallback(info: HttpQueueCallbackInfo): void {
            if (options.shouldReportHttpMonitor && options.shouldReportHttpMonitor()) {
                const responseTime = Date.now() - info.requestTime;
                if (options.reportHttpMonitor) {
                    options.reportHttpMonitor({
                        request_path: info.url,
                        response_code: info.responseCode,
                        response_time: responseTime
                    });
                }
            }
        },

        parseSuccessResponse(info: HttpQueueResponseInfo): HttpQueueResult {
            const url = info.url;
            const reqData = info.reqData;
            const responseText = info.responseText;

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

            const result = JSON.parse(decrypted);

            logger("【YW Network Suc】url:", url);
            logger("【YW Network Suc】body:", reqData.toText());
            logger("【YW Network Suc】response:", JSON.stringify(responseText));
            logger("【YW Network Suc】respon:", JSON.stringify(decrypted));
            logger("【YW Network Suc】res:", JSON.stringify(result));

            if (options.getServerReleaseUrl && url.indexOf(options.getServerReleaseUrl()) !== -1) {
                const code = result.code;
                if (code === -1 || code === -1000) {
                    return {
                        success: false,
                        data: result
                    };
                }
                return {
                    success: true,
                    data: result
                };
            }

            return {
                success: true,
                data: result
            };
        },

        buildRequestBody(reqData: HttpQueueRequestData): string {
            return reqData.toText();
        },

        onRequestStart(info: HttpQueueRequestStartInfo): void {
            logger("【YW Network Start】url:", info.url);
            logger("【YW Network Start】body:", info.reqData.toText());
        },

        createStatusError(xhr: { status: number }): HttpQueueError {
            const status = xhr.status;
            return {
                code: -1,
                message: "xhr.status" + status,
                http_status: status
            };
        },

        createRuntimeError(xhr: { status: number; reason: string }): HttpQueueError {
            const status = xhr.status;
            return {
                code: -1,
                message: "onXhr." + xhr.reason,
                http_status: status
            };
        },

        dispatchResult(target: HttpQueueDispatchTarget | null, success: boolean, data: any): void {
            if (target) {
                if (success) {
                    target.success(data);
                } else {
                    target.fail(data);
                }
            }
        }
    };
}