export interface MiddleHttpReqData {
    toMiddleJSON(): any;
}

export interface MiddleHttpQueueRequest {
    url: string;
    reqData: MiddleHttpReqData;
}

export interface MiddleHttpQueueCallbackParams {
    requestTime: number;
    responseCode: number;
    url: string;
}

export interface MiddleHttpResponseParams extends MiddleHttpQueueRequest {
    responseText: string;
    status: number;
}

export interface MiddleHttpRuntimeErrorParams {
    url: string;
    status: number;
    statusText: string;
    reason: string;
}

export interface MiddleHttpResultData {
    code: number;
    message?: string;
    http_status?: number;
}

export interface MiddleHttpResult {
    success: boolean;
    data: any;
}

export interface MiddleHttpStatusError {
    code: number;
    message: string;
    http_status: number;
}

export interface MiddleHttpRuntimeError {
    code: number;
    message: string;
    http_status: number;
    statuText: string;
    url: string;
}

export interface MiddleHttpResultHandler {
    success(result: MiddleHttpResult): void;
    fail(result: MiddleHttpResult): void;
}

export interface MiddleHttpQueueHooksOptions {
    refreshUrlOnRetry?: (params: MiddleHttpQueueRequest) => string;
    onRetry?: (params: MiddleHttpQueueRequest, next: () => any) => any;
    shouldReportHttpMonitor?: () => boolean;
    reportHttpMonitor?: (info: { req_url: string; response_code: number; response_time: number }) => void;
    decrypt?: (data: any) => string;
}

export interface MiddleHttpQueueHooks {
    shouldEnqueue(params: { enterQueue(): boolean }): boolean;
    shouldRetry(params: { needRetry(): boolean }): boolean;
    refreshUrlOnRetry(params: MiddleHttpQueueRequest): string;
    onRetry(params: MiddleHttpQueueRequest, next: () => any): any;
    onQueueCallback(params: MiddleHttpQueueCallbackParams): void;
    parseSuccessResponse(params: MiddleHttpResponseParams): MiddleHttpResult;
    buildRequestBody(params: MiddleHttpReqData): any;
    onRequestStart(params: MiddleHttpQueueRequest): void;
    createStatusError(params: MiddleHttpResponseParams): MiddleHttpStatusError;
    createRuntimeError(params: MiddleHttpRuntimeErrorParams): MiddleHttpRuntimeError;
    dispatchResult(handler: MiddleHttpResultHandler | null, isSuccess: boolean, result: MiddleHttpResult): void;
}

export function createMiddleHttpQueueHooks(
    log: (...args: any[]) => void,
    shouldReport: () => boolean,
    randomInt: (min: number, max: number) => number,
    options: MiddleHttpQueueHooksOptions = {}
): MiddleHttpQueueHooks {
    return {
        shouldEnqueue: function (params: { enterQueue(): boolean }): boolean {
            return params.enterQueue();
        },
        shouldRetry: function (params: { needRetry(): boolean }): boolean {
            return params.needRetry();
        },
        refreshUrlOnRetry: function (params: MiddleHttpQueueRequest): string {
            return options.refreshUrlOnRetry ? options.refreshUrlOnRetry(params) : "";
        },
        onRetry: function (params: MiddleHttpQueueRequest, next: () => any): any {
            return options.onRetry ? options.onRetry(params, next) : next();
        },
        onQueueCallback: function (params: MiddleHttpQueueCallbackParams): void {
            const requestTime = params.requestTime;
            const responseCode = params.responseCode;
            const url = params.url;
            if (options.shouldReportHttpMonitor ? options.shouldReportHttpMonitor() : shouldReport() && randomInt(1, 100) <= 5) {
                const responseTime = Date.now() - requestTime;
                if (options.reportHttpMonitor) {
                    options.reportHttpMonitor({
                        req_url: url,
                        response_code: responseCode,
                        response_time: responseTime
                    });
                }
            }
        },
        parseSuccessResponse: function (params: MiddleHttpResponseParams): MiddleHttpResult {
            const url = params.url;
            const reqData = params.reqData;
            const responseText = params.responseText;
            const status = params.status;
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
                        http_status: status
                    }
                };
            }
            log("【CC Network】url:", url);
            log("【CC Network】response:", responseText);
            const decoded = options.decrypt ? options.decrypt(responseText) : responseText;
            if (!decoded) {
                console.error("【CC Network Err】decrypt response error:", url);
                return {
                    success: false,
                    data: {
                        code: -1,
                        message: "decrypt response error",
                        http_status: status
                    }
                };
            }
            const json = JSON.parse(decoded);
            if (null !== json.data && 0 !== Object.keys(json.data).length) {
                log("【CC Network Suc】url:", url);
                log("【CC Network Suc】body:", reqData.toMiddleJSON());
                log("【CC Network Suc】decode body:", options.decrypt ? options.decrypt(reqData.toMiddleJSON()) : reqData.toMiddleJSON());
                log("【CC Network Suc】response:", JSON.stringify(responseText));
                log("【CC Network Suc】respon:", JSON.stringify(decoded));
                const data = json.data;
                log("【CC Network Suc】res:", JSON.stringify(data));
                return {
                    success: true,
                    data: data
                };
            }
            log("【CC Network Err】url0:", url);
            log("【CC Network Err】body:", reqData.toMiddleJSON());
            log("【CC Network Err】decode body:", options.decrypt ? options.decrypt(reqData.toMiddleJSON()) : reqData.toMiddleJSON());
            log("【CC Network Err】err:", "data 为空 - message:" + json.message);
            return {
                success: false,
                data: {
                    code: -1,
                    message: "Data不存在",
                    http_status: status
                }
            };
        },
        buildRequestBody: function (params: MiddleHttpReqData): any {
            return params.toMiddleJSON();
        },
        onRequestStart: function (params: MiddleHttpQueueRequest): void {
            const url = params.url;
            const reqData = params.reqData;
            log("【CC Network start】url:", url);
            log("【CC Network start】body:", reqData.toMiddleJSON());
            log("【CC Network start】decode body:", options.decrypt ? options.decrypt(reqData.toMiddleJSON()) : reqData.toMiddleJSON());
        },
        createStatusError: function (params: MiddleHttpResponseParams): MiddleHttpStatusError {
            const url = params.url;
            const reqData = params.reqData;
            const status = params.status;
            log("【CC Network Err】url2:", url);
            log("【CC Network Err】body:", reqData.toMiddleJSON());
            log("【CC Network Err】decode body:", options.decrypt ? options.decrypt(reqData.toMiddleJSON()) : reqData.toMiddleJSON());
            log("【CC Network Err】err:", "xhr.status = " + status);
            return {
                code: -1,
                message: "xhr.status" + status,
                http_status: status
            };
        },
        createRuntimeError: function (params: MiddleHttpRuntimeErrorParams): MiddleHttpRuntimeError {
            const url = params.url;
            const status = params.status;
            const statusText = params.statusText;
            return {
                code: -1,
                message: "onXhr." + params.reason,
                http_status: status,
                statuText: statusText,
                url: url
            };
        },
        dispatchResult: function (handler: MiddleHttpResultHandler | null, isSuccess: boolean, result: MiddleHttpResult): void {
            if (handler) {
                if (isSuccess) {
                    handler.success(result);
                } else {
                    handler.fail(result);
                }
            }
        }
    };
}