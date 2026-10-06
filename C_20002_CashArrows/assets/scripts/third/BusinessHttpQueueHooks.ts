interface QueueRequest {
    enterQueue(): boolean;
    needRetry(): boolean;
}

interface RequestPayload {
    toText(): string;
}

interface ParseContext {
    url: string;
    reqData: RequestPayload;
    responseText: string;
}

interface QueueCallbackContext {
    requestTime: number;
    responseCode: number;
    url: string;
}

interface HttpMonitorPayload {
    request_path: string;
    response_code: number;
    response_time: number;
}

interface HttpResultHandler {
    success?(data: unknown): void;
    fail?(data: unknown): void;
}

export interface BusinessHttpQueueHookOptions {
    refreshUrlOnRetry?(request: QueueRequest): string;
    onRetry?(response: unknown, retry: () => void): void;
    shouldReportHttpMonitor?(): boolean;
    reportHttpMonitor?(payload: HttpMonitorPayload): void;
    decryptResponse?(responseText: string): string;
    getServerReleaseUrl?(): string;
}

function safeStringify(value: unknown): string {
    try {
        return JSON.stringify(value);
    } catch {
        return String(value);
    }
}

export function createBusinessHttpQueueHooks(
    log: (...args: unknown[]) => void,
    options: BusinessHttpQueueHookOptions = {},
) {
    return {
        shouldEnqueue(request: QueueRequest): boolean {
            return request.enterQueue();
        },

        shouldRetry(request: QueueRequest): boolean {
            return request.needRetry();
        },

        refreshUrlOnRetry(request: QueueRequest): string {
            return options.refreshUrlOnRetry ? options.refreshUrlOnRetry(request) : "";
        },

        onRetry(response: unknown, retry: () => void): void {
            log("【YW Network Retry】res:", safeStringify(response));
            if (options.onRetry) {
                options.onRetry(response, retry);
            } else {
                retry();
            }
        },

        onQueueCallback(context: QueueCallbackContext): void {
            const { requestTime, responseCode, url } = context;
            if (options.shouldReportHttpMonitor && options.shouldReportHttpMonitor()) {
                const responseTime = Date.now() - requestTime;
                options.reportHttpMonitor?.({
                    request_path: url,
                    response_code: responseCode,
                    response_time: responseTime,
                });
            }
        },

        parseSuccessResponse(context: ParseContext): { success: boolean; data: Record<string, unknown> } {
            const { url, reqData, responseText } = context;
            if (!responseText) {
                log("【YW Network Err】url1:", url);
                log("【YW Network Err】body:", reqData.toText());
                log("【YW Network Err】err:", "response 为空");
                return {
                    success: false,
                    data: {
                        code: -1,
                        message: "返回数据不存在",
                    },
                };
            }

            let decrypted = options.decryptResponse ? options.decryptResponse(responseText) : responseText;
            if (!decrypted) {
                decrypted = responseText;
            }

            const parsed = JSON.parse(decrypted) as Record<string, unknown>;
            log("【YW Network Suc】url:", url);
            log("【YW Network Suc】body:", reqData.toText());
            log("【YW Network Suc】response:", JSON.stringify(responseText));
            log("【YW Network Suc】respon:", JSON.stringify(decrypted));
            log("【YW Network Suc】res:", JSON.stringify(parsed));

            if (options.getServerReleaseUrl && url.includes(options.getServerReleaseUrl())) {
                const code = parsed.code as number;
                if (code == -1 || code == -1000) {
                    return { success: false, data: parsed };
                }
                return { success: true, data: parsed };
            }

            return { success: true, data: parsed };
        },

        buildRequestBody(request: RequestPayload): string {
            return request.toText();
        },

        onRequestStart(context: { url: string; reqData: RequestPayload }): void {
            log("【YW Network Start】url:", context.url);
            log("【YW Network Start】body:", context.reqData.toText());
        },

        createStatusError(context: { status: number }): Record<string, unknown> {
            return {
                code: -1,
                message: "xhr.status" + context.status,
                http_status: context.status,
            };
        },

        createRuntimeError(context: { status: number; reason: string }): Record<string, unknown> {
            return {
                code: -1,
                message: "onXhr." + context.reason,
                http_status: context.status,
            };
        },

        dispatchResult(handler: HttpResultHandler | null, success: boolean, data: unknown): void {
            if (handler) {
                if (success) {
                    handler.success?.(data);
                } else {
                    handler.fail?.(data);
                }
            }
        },
    };
}
