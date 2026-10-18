import ApiRequestLogger from "./ApiRequestLogger";

interface RequestQueueItem {
    url: string;
    reqData: any;
    handler: any;
}

interface QueueCallbackInfo {
    requestTime: number;
    responseCode: number;
    success: boolean;
    res: any;
    url: string;
    handler: any;
}

interface SuccessResponseResult {
    success: boolean;
    data: any;
    skipDispatch?: boolean;
}

interface RequestHooks {
    shouldEnqueue(handler: any): boolean;
    shouldRetry(handler: any): boolean;
    refreshUrlOnRetry(handler: any): string;
    onRetry(res: any, callback: () => void): void;
    dispatchResult(handler: any, success: boolean, res: any): void;
    buildRequestBody(reqData: any): any;
    parseSuccessResponse(info: { url: string; reqData: any; responseText: string; status: number }): SuccessResponseResult;
    createStatusError(info: { url: string; reqData: any; status: number }): any;
    createRuntimeError(info: { url: string; reqData: any; status: number; statusText: string; reason: string }): any;
    onQueueCallback?(info: QueueCallbackInfo): void;
    onRequestStart?(info: { url: string; reqData: any; requestBody: any }): void;
}

export default class RequestQueueEngine {
    public hooks: RequestHooks;
    public postQueue: RequestQueueItem[] = [];
    public inRequesting: boolean = false;

    public requestQueueHead: () => void = (): void => {
        if (this.postQueue && this.postQueue.length) {
            if (this.postQueue[0] && this.postQueue[0].url) {
                const item: RequestQueueItem = this.postQueue[0];
                this.post(item.url, item.reqData, item.handler);
            } else {
                this.postQueue.shift();
                this.requestQueueHead();
            }
        } else {
            this.inRequesting = false;
        }
    };

    constructor(hooks: RequestHooks) {
        this.hooks = hooks;
    }

    public queuePost(url: string, reqData: any, handler: any): void {
        if (!handler || this.hooks.shouldEnqueue(handler)) {
            this.postQueue.push({ url: url, reqData: reqData, handler: handler });
            if (!this.inRequesting) {
                this.inRequesting = true;
                this.post(url, reqData, handler);
            }
        } else {
            this.post(url, reqData, handler);
        }
    }

    public queuePostCallback(requestTime: number, responseCode: number, success: boolean, res: any): void {
        const item: RequestQueueItem = this.postQueue[0];
        if (!item) {
            return;
        }
        if (this.hooks.onQueueCallback) {
            this.hooks.onQueueCallback({
                requestTime: requestTime,
                responseCode: responseCode,
                success: success,
                res: res,
                url: item.url,
                handler: item.handler
            });
        }
        if (!success && item.handler && this.hooks.shouldRetry(item.handler)) {
            this.postQueue[0].url = this.hooks.refreshUrlOnRetry(item.handler);
            this.hooks.onRetry(res, this.requestQueueHead);
        } else {
            this.hooks.dispatchResult(item.handler, success, res);
            this.postQueue.shift();
            this.requestQueueHead();
        }
    }

    public post(url: string, reqData: any, handler: any): void {
        let responseCode: number = 9999;
        const requestTime: number = Date.now();
        const xhr: XMLHttpRequest = new XMLHttpRequest();
        const requestBody: any = this.hooks.buildRequestBody(reqData);

        const finish = (success: boolean, res: any): void => {
            ApiRequestLogger.log(url, ApiRequestLogger.extractParams(reqData), res);
            if (handler && this.hooks.shouldEnqueue(handler)) {
                this.queuePostCallback(requestTime, responseCode, success, res);
            } else {
                this.hooks.dispatchResult(handler, success, res);
            }
        };

        xhr.onreadystatechange = (): void => {
            if (xhr.readyState === 4) {
                responseCode = xhr.status;
                if (xhr.status >= 200 && xhr.status < 400) {
                    const result: SuccessResponseResult = this.hooks.parseSuccessResponse({
                        url: url,
                        reqData: reqData,
                        responseText: xhr.responseText,
                        status: xhr.status
                    });
                    if (result && result.skipDispatch) {
                        return;
                    }
                    finish(result.success, result.data);
                } else {
                    finish(false, this.hooks.createStatusError({
                        url: url,
                        reqData: reqData,
                        status: xhr.status
                    }));
                }
            }
        };

        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-type", "text/plain");
        xhr.send(requestBody);

        if (this.hooks.onRequestStart) {
            this.hooks.onRequestStart({
                url: url,
                reqData: reqData,
                requestBody: requestBody
            });
        }

        xhr.addEventListener("abort", (): void => {
            finish(false, this.hooks.createRuntimeError({
                url: url,
                reqData: reqData,
                status: xhr.status,
                statusText: xhr.statusText,
                reason: "abort"
            }));
        });

        xhr.addEventListener("error", (): void => {
            finish(false, this.hooks.createRuntimeError({
                url: url,
                reqData: reqData,
                status: xhr.status,
                statusText: xhr.statusText,
                reason: "error"
            }));
        });

        xhr.addEventListener("timeout", (): void => {
            finish(false, this.hooks.createRuntimeError({
                url: url,
                reqData: reqData,
                status: xhr.status,
                statusText: xhr.statusText,
                reason: "timeout"
            }));
        });
    }
}