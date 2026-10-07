export function createMiddleHttpQueueHooks(
    logFn: (...args: any[]) => void,
    shouldReport: () => boolean,
    randomInt: (min: number, max: number) => number,
    options: any = {}
): any {
    return {
        shouldEnqueue: (handler: any) => handler.enterQueue(),
        shouldRetry: (handler: any) => handler.needRetry(),
        refreshUrlOnRetry: (request: any) => options.refreshUrlOnRetry ? options.refreshUrlOnRetry(request) : "",
        onRetry: (message: any, retry: () => void) => options.onRetry ? options.onRetry(message, retry) : retry(),
        onQueueCallback: (event: any) => {
            const requestTime = event.requestTime;
            const responseCode = event.responseCode;
            const url = event.url;
            if (options.shouldReportHttpMonitor ? options.shouldReportHttpMonitor() : shouldReport() && randomInt(1, 100) <= 5) {
                const elapsed = Date.now() - requestTime;
                options.reportHttpMonitor && options.reportHttpMonitor({
                    req_url: url,
                    response_code: responseCode,
                    response_time: elapsed
                });
            }
        },
        parseSuccessResponse: (response: any) => {
            const url = response.url;
            const reqData = response.reqData;
            const responseText = response.responseText;
            const status = response.status;
            if (!responseText) {
                logFn("【CC Network Err】url1:", url);
                logFn("【CC Network Err】body:", reqData.toMiddleJSON());
                logFn("【CC Network Err】decode body:", options.decrypt ? options.decrypt(reqData.toMiddleJSON()) : reqData.toMiddleJSON());
                logFn("【CC Network Err】err:", "response 为空");
                return {
                    success: false,
                    data: {
                        code: -1,
                        message: "返回数据不存在",
                        http_status: status
                    }
                };
            }
            logFn("【CC Network】url:", url);
            logFn("【CC Network】response:", responseText);
            const decrypted = options.decrypt ? options.decrypt(responseText) : responseText;
            if (!decrypted) {
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
            const parsed = JSON.parse(decrypted);
            if (parsed.data !== null && Object.keys(parsed.data).length !== 0) {
                logFn("【CC Network Suc】url:", url);
                logFn("【CC Network Suc】body:", reqData.toMiddleJSON());
                logFn("【CC Network Suc】decode body:", options.decrypt ? options.decrypt(reqData.toMiddleJSON()) : reqData.toMiddleJSON());
                logFn("【CC Network Suc】response:", JSON.stringify(responseText));
                logFn("【CC Network Suc】respon:", JSON.stringify(decrypted));
                const data = parsed.data;
                logFn("【CC Network Suc】res:", JSON.stringify(data));
                return {
                    success: true,
                    data: data
                };
            }
            logFn("【CC Network Err】url0:", url);
            logFn("【CC Network Err】body:", reqData.toMiddleJSON());
            logFn("【CC Network Err】decode body:", options.decrypt ? options.decrypt(reqData.toMiddleJSON()) : reqData.toMiddleJSON());
            logFn("【CC Network Err】err:", "data 为空 - message:"+ parsed.message); return { success: false, data: { code:-1, message:"Data不存在",
                    http_status: status
                }
            };
        },
        buildRequestBody: (reqData: any) => reqData.toMiddleJSON(),
        onRequestStart: (request: any) => {
            const url = request.url;
            const reqData = request.reqData;
            logFn("【CC Network start】url:", url);
            logFn("【CC Network start】body:", reqData.toMiddleJSON());
            logFn("【CC Network start】decode body:", options.decrypt ? options.decrypt(reqData.toMiddleJSON()) : reqData.toMiddleJSON());
        },
        createStatusError: (request: any) => {
            const url = request.url;
            const reqData = request.reqData;
            const status = request.status;
            logFn("【CC Network Err】url2:", url);
            logFn("【CC Network Err】body:", reqData.toMiddleJSON());
            logFn("【CC Network Err】decode body:", options.decrypt ? options.decrypt(reqData.toMiddleJSON()) : reqData.toMiddleJSON());
            logFn("【CC Network Err】err:", "xhr.status = "+ status); return { code:-1, message:"xhr.status"+ status, http_status: status }; }, createRuntimeError: (request: any) => { const url = request.url; const status = request.status; const statusText = request.statusText; return { code:-1, message:"onXhr." + request.reason,
                http_status: status,
                statuText: statusText,
                url: url
            };
        },
        dispatchResult: (handler: any, success: boolean, data: any) => {
            if (handler) {
                success ? handler.success(data) : handler.fail(data);
            }
        }
    };
}
