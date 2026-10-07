import UIDefine from "./UIDefine";
import UIMgr from "./UIMgr";

const LOG_TAG = "[NetErrorPopup]";
const FORCE_RETRY_CODES = [-777];
const NETWORK_ERROR_HINTS = [
    "xhr.status", "xhr.error", "onXhr.", "timeout", "返回数据不存在", "响应解析失败",
    "response parse fail", "http status", "network error", "网络错误",
];

function extractErrorCode(err: any): number | undefined {
    if (err && typeof err === "object") {
        if (typeof err.code === "number") {
            return err.code;
        }
        if (typeof err.code === "string") {
            const parsed = Number(err.code);
            return isNaN(parsed) ? undefined : parsed;
        }
    }
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

function matchesNetworkHint(message: any): boolean {
    if (!message) {
        return false;
    }
    const lower = String(message).toLowerCase();
    for (let i = 0; i < NETWORK_ERROR_HINTS.length; i++) {
        if (lower.indexOf(NETWORK_ERROR_HINTS[i].toLowerCase()) >= 0) {
            return true;
        }
    }
    return false;
}

function shouldPopByPayload(err: any): boolean {
    if (!err || typeof err !== "object") {
        return false;
    }
    if (matchesNetworkHint(err.message)) {
        return true;
    }
    const httpStatus = err.http_status;
    if (httpStatus != null) {
        const status = Number(httpStatus);
        if (!isFinite(status) || status < 200 || status >= 300) {
            return true;
        }
    }
    return isForceRetryCode(extractErrorCode(err));
}

const NetErrorPopupService = {
    _isShowing: false,
    _pendingRetry: null as (() => void) | null,

    shouldPop(err: any): boolean {
        return !!err && (isForceRetryCode(extractErrorCode(err)) || shouldPopByPayload(err));
    },

    consumePendingRetry(): (() => void) | null {
        const retryFn = this._pendingRetry;
        this._pendingRetry = null;
        return retryFn;
    },

    _showPopup(retryFn?: () => void): void {
        if (this._isShowing) {
            console.log(LOG_TAG, "popup already showing, merge retryFn into queue");
            const pending = this._pendingRetry;
            if (typeof retryFn === "function") {
                this._pendingRetry = typeof pending === "function"
                    ? () => {
                        try {
                            pending();
                        } catch (err) {
                            console.warn(LOG_TAG, "merged retry 1 failed", err);
                        }
                        try {
                            retryFn();
                        } catch (err) {
                            console.warn(LOG_TAG, "merged retry 2 failed", err);
                        }
                    }
                    : retryFn;
            }
        } else {
            this._pendingRetry = typeof retryFn === "function" ? retryFn : null;
            this._isShowing = true;
            const uiMgr = UIMgr.getInstance();
            const viewConfig = UIDefine.netErrorView;
            if (viewConfig) {
                console.log(LOG_TAG, "showing popup with retryFn:", !!retryFn);
                uiMgr.show(viewConfig).then((shown) => {
                    if (shown) {
                        console.log(LOG_TAG, "popup shown successfully");
                    } else {
                        console.warn(LOG_TAG, "UIMgr.show returned null, fallback retry");
                        this._isShowing = false;
                        const pending = this.consumePendingRetry();
                        pending && pending();
                    }
                }).catch((err) => {
                    console.warn(LOG_TAG, "UIMgr.show failed", err);
                    this._isShowing = false;
                    const pending = this.consumePendingRetry();
                    pending && pending();
                });
            } else {
                console.warn(LOG_TAG, "UIDefine.netErrorView missing, fall back to retry immediately");
                this._isShowing = false;
                const pending = this.consumePendingRetry();
                pending && pending();
            }
        }
    },

    notifyClosed(): void {
        this._isShowing = false;
    },

    wrapCallbacks(options?: {
        onSuccess?: (data: any) => void;
        onFail?: (err: any) => void;
        retry?: () => void;
        skipForceRetryCode?: boolean;
    }): { success: (data: any) => void; fail: (err: any) => void } {
        const opts = options || {};
        const onSuccess = opts.onSuccess;
        const onFail = opts.onFail;
        const retry = opts.retry;
        const skipForceRetryCode = !!opts.skipForceRetryCode;
        const self = this;
        return {
            success(data: any): void {
                if (skipForceRetryCode || !isForceRetryCode(extractErrorCode(data))) {
                    if (typeof onSuccess === "function") {
                        onSuccess(data);
                    }
                } else {
                    console.warn(LOG_TAG, "success branch hit force-retry code, route to retry popup, code=" + extractErrorCode(data));
                    if (typeof retry === "function") {
                        self._showPopup(retry);
                    } else if (typeof onFail === "function") {
                        onFail(data);
                    }
                }
            },
            fail(err: any): void {
                if (self.shouldPop(err) && typeof retry === "function") {
                    console.warn(LOG_TAG, "fail branch triggers retry popup, err=" + JSON.stringify(err));
                    self._showPopup(retry);
                } else if (typeof onFail === "function") {
                    onFail(err);
                }
            },
        };
    },

    handle(err: any, retryFn?: () => void, onFail?: (err: any) => void): boolean {
        if (this.shouldPop(err) && typeof retryFn === "function") {
            this._showPopup(retryFn);
            return true;
        }
        if (typeof onFail === "function") {
            onFail(err);
        }
        return false;
    },

    showAndRetry(retryFn?: () => void): void {
        this._showPopup(retryFn);
    },
};

export default NetErrorPopupService;
