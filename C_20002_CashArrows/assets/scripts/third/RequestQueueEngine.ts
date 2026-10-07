interface QueueItem {
    url: string;
    reqData: any;
    handler: any;
}

export interface RequestQueueHooks {
    shouldEnqueue(handler: any): boolean;
    shouldRetry(handler: any): boolean;
    refreshUrlOnRetry(handler: any): string;
    onQueueCallback?(payload: any): void;
    dispatchResult(handler: any, success: boolean, res: any): void;
    buildRequestBody(reqData: any): string;
    parseSuccessResponse(ctx: any): { skipDispatch?: boolean; success: boolean; data: any };
    createStatusError(ctx: any): any;
    createRuntimeError(ctx: any): any;
    onRequestStart?(ctx: any): void;
    onRetry?(response: any, retry: () => void): void;
}

export default class RequestQueueEngine {
    hooks: RequestQueueHooks;
    postQueue: QueueItem[] = [];
    inRequesting: boolean = false;

    constructor(hooks: RequestQueueHooks) {
        this.hooks = hooks;
    }

    requestQueueHead = (): void => {
        if (this.postQueue && this.postQueue.length) {
            if (this.postQueue[0] && this.postQueue[0].url) {
                const item = this.postQueue[0];
                this.post(item.url, item.reqData, item.handler);
            } else {
                this.postQueue.shift();
                this.requestQueueHead();
            }
        } else {
            this.inRequesting = false;
        }
    };

    queuePost(url: string, reqData: any, handler: any): void {
        if (!handler || this.hooks.shouldEnqueue(handler)) {
            this.postQueue.push({ url, reqData, handler });
            if (!this.inRequesting) {
                this.inRequesting = true;
                this.post(url, reqData, handler);
            }
        } else {
            this.post(url, reqData, handler);
        }
    }

    queuePostCallback(requestTime: number, responseCode: number, success: boolean, res: any): void {
        if (this.postQueue[0]) {
            const item = this.postQueue[0];
            const url = item.url;
            const handler = item.handler;
            this.hooks.onQueueCallback && this.hooks.onQueueCallback({
                requestTime,
                responseCode,
                success,
                res,
                url,
                handler
            });
            if (!success && handler && this.hooks.shouldRetry(handler)) {
                this.postQueue[0].url = this.hooks.refreshUrlOnRetry(handler);
                this.hooks.onRetry(res, this.requestQueueHead);
            } else {
                this.hooks.dispatchResult(handler, success, res);
                this.postQueue.shift();
                this.requestQueueHead();
            }
        }
    }

    post(url: string, reqData: any, handler: any): void {
        let statusCode = 9999;
        const requestTime = Date.now();
        const xhr = new XMLHttpRequest();
        const requestBody = this.hooks.buildRequestBody(reqData);
        const dispatch = (success: boolean, data: any): void => {
            if (handler && this.hooks.shouldEnqueue(handler)) {
                this.queuePostCallback(requestTime, statusCode, success, data);
            } else {
                this.hooks.dispatchResult(handler, success, data);
            }
        };
        xhr.onreadystatechange = (): void => {
            if (xhr.readyState === 4) {
                statusCode = xhr.status;
                if (xhr.status >= 200 && xhr.status < 400) {
                    const parsed = this.hooks.parseSuccessResponse({
                        url,
                        reqData,
                        responseText: xhr.responseText,
                        status: xhr.status
                    });
                    if (parsed?.skipDispatch) {
                        return;
                    }
                    dispatch(parsed.success, parsed.data);
                } else {
                    dispatch(false, this.hooks.createStatusError({
                        url,
                        reqData,
                        status: xhr.status
                    }));
                }
            }
        };
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-type", "text/plain");
        xhr.send(requestBody);
        this.hooks.onRequestStart && this.hooks.onRequestStart({
            url,
            reqData,
            requestBody
        });
        xhr.addEventListener("abort", () => {
            dispatch(false, this.hooks.createRuntimeError({
                url,
                reqData,
                status: xhr.status,
                statusText: xhr.statusText,
                reason: "abort"
            }));
        });
        xhr.addEventListener("error", () => {
            dispatch(false, this.hooks.createRuntimeError({
                url,
                reqData,
                status: xhr.status,
                statusText: xhr.statusText,
                reason: "error"
            }));
        });
        xhr.addEventListener("timeout", () => {
            dispatch(false, this.hooks.createRuntimeError({
                url,
                reqData,
                status: xhr.status,
                statusText: xhr.statusText,
                reason: "timeout"
            }));
        });
    }
}
