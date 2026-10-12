import UIDefine from "./UIDefine";
import UIMgr from "./UIMgr";

const LOG_TAG = "[NetErrorPopup]";

const FORCE_RETRY_CODES: number[] = [-777];

const NETWORK_ERROR_KEYS: string[] = [
    "xhr.status",
    "xhr.error",
    "onXhr.",
    "timeout",
    "返回数据不存在",
    "响应解析失败",
    "response parse fail",
    "http status",
    "network error",
    "网络错误"
];

export type RetryCallback = () => void;
export type ResponseCallback = (data?: any) => void;
export type FailCallback = (err?: any) => void;

export interface WrapCallbacksOptions {
    onSuccess?: ResponseCallback;
    onFail?: FailCallback;
    retry?: RetryCallback;
    skipForceRetryCode?: boolean;
}

export interface WrappedCallbacks {
    success: ResponseCallback;
    fail: FailCallback;
}

function extractCode(data: any): number | undefined {
    if (data && typeof data === "object") {
        if (typeof data.code === "number") {
            return data.code;
        }
        if (typeof data.code === "string") {
            const code = Number(data.code);
            return isNaN(code) ? undefined : code;
        }
    }
    return undefined;
}

function isForceRetryCode(code: number | undefined): boolean {
    if (code === undefined) {
        return false;
    }
    for (let i = 0; i < FORCE_RETRY_CODES.length; i++) {
        if (FORCE_RETRY_CODES[i] === code) {
            return true;
        }
    }
    return false;
}

function containsNetworkErrorKey(message: any): boolean {
    if (!message) {
        return false;
    }
    const text = String(message).toLowerCase();
    for (let i = 0; i < NETWORK_ERROR_KEYS.length; i++) {
        if (text.indexOf(NETWORK_ERROR_KEYS[i].toLowerCase()) >= 0) {
            return true;
        }
    }
    return false;
}

function isNetworkError(err: any): boolean {
    if (!err || typeof err !== "object") {
        return false;
    }
    if (containsNetworkErrorKey(err.message)) {
        return true;
    }
    const httpStatus = err.http_status;
    if (httpStatus !== null && httpStatus !== undefined) {
        const status = Number(httpStatus);
        if (!isFinite(status) || status < 200 || status >= 300) {
            return true;
        }
    }
    return extractCode(err) === -1;
}

const NetErrorPopupService = {
    _isShowing: false,
    _pendingRetry: null as RetryCallback | null,

    shouldPop(data?: any): boolean {
        return !!data && (isForceRetryCode(extractCode(data)) || isNetworkError(data));
    },

    consumePendingRetry(): RetryCallback | null {
        const pending = this._pendingRetry;
        this._pendingRetry = null;
        return pending;
    },

    async _showPopup(retryFn?: RetryCallback): Promise<void> {
        if (this._isShowing) {
            console.log(LOG_TAG, "popup already showing, merge retryFn into queue");
            const pending = this._pendingRetry;
            if (typeof retryFn === "function") {
                if (typeof pending === "function") {
                    this._pendingRetry = () => {
                        try {
                            pending();
                        } catch (e) {
                            console.warn(LOG_TAG, "merged retry 1 failed", e);
                        }
                        try {
                            retryFn();
                        } catch (e) {
                            console.warn(LOG_TAG, "merged retry 2 failed", e);
                        }
                    };
                } else {
                    this._pendingRetry = retryFn;
                }
            }
            return;
        }

        this._pendingRetry = typeof retryFn === "function" ? retryFn : null;
        this._isShowing = true;

        const uiMgr = UIMgr.getInstance();
        const netErrorView = UIDefine.netErrorView;
        if (!netErrorView) {
            console.warn(LOG_TAG, "UIDefine.netErrorView missing, fall back to retry immediately");
            this._isShowing = false;
            const pending = this.consumePendingRetry();
            if (pending) {
                pending();
            }
            return;
        }

        console.log(LOG_TAG, "showing popup with retryFn:", !!retryFn);
        try {
            const view = await uiMgr.show(netErrorView);
            if (view) {
                console.log(LOG_TAG, "popup shown successfully");
            } else {
                console.warn(LOG_TAG, "UIMgr.show returned null, fallback retry");
                this._isShowing = false;
                const pending = this.consumePendingRetry();
                if (pending) {
                    pending();
                }
            }
        } catch (err) {
            console.warn(LOG_TAG, "UIMgr.show failed", err);
            this._isShowing = false;
            const pending = this.consumePendingRetry();
            if (pending) {
                pending();
            }
        }
    },

    notifyClosed(): void {
        this._isShowing = false;
    },

    wrapCallbacks(options?: WrapCallbacksOptions): WrappedCallbacks {
        const opts = options || {};
        const onSuccess = opts.onSuccess;
        const onFail = opts.onFail;
        const retry = opts.retry;
        const skipForceRetryCode = !!opts.skipForceRetryCode;
        const self = this;

        return {
            success(data?: any): void {
                if (skipForceRetryCode || !isForceRetryCode(extractCode(data))) {
                    if (typeof onSuccess === "function") {
                        onSuccess(data);
                    }
                } else {
                    console.warn(LOG_TAG, "success branch hit force-retry code, route to retry popup, code=" + extractCode(data));
                    if (typeof retry === "function") {
                        self._showPopup(retry);
                    } else if (typeof onFail === "function") {
                        onFail(data);
                    }
                }
            },
            fail(err?: any): void {
                if (self.shouldPop(err) && typeof retry === "function") {
                    console.warn(LOG_TAG, "fail branch triggers retry popup, err=" + JSON.stringify(err));
                    self._showPopup(retry);
                } else if (typeof onFail === "function") {
                    onFail(err);
                }
            }
        };
    },

    handle(data?: any, retry?: RetryCallback, onFail?: FailCallback): boolean {
        if (this.shouldPop(data) && typeof retry === "function") {
            this._showPopup(retry);
            return true;
        }
        if (typeof onFail === "function") {
            onFail(data);
        }
        return false;
    },

    showAndRetry(retryFn?: RetryCallback): void {
        this._showPopup(retryFn);
    }
};

export default NetErrorPopupService;