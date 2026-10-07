import UIDefine from "./UIDefine";
import UIMgr from "./UIMgr";

const LOG_PREFIX = "[NetErrorPopup] ";
const FORCE_RETRY_CODES = [-777];
const NETWORK_ERROR_KEYWORDS = [
    " xhr.status ",
    " xhr.error ",
    " onXhr.",
    " timeout ",
    " 返回数据不存在 ",
    " 响应解析失败 ",
    " response parse fail ",
    " http status ",
    " network error ",
    " 网络错误 "
];

function getErrorCode(err: any): number | undefined {
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

function matchesNetworkKeyword(message: string): boolean {
    if (!message) {
        return false;
    }
    const lower = String(message).toLowerCase();
    for (let i = 0; i < NETWORK_ERROR_KEYWORDS.length; i++) {
        if (lower.indexOf(NETWORK_ERROR_KEYWORDS[i].toLowerCase()) >= 0) {
            return true;
        }
    }
    return false;
}

function isNetworkError(err: any): boolean {
    if (!err || typeof err !== "object") {
        return false;
    }
    if (matchesNetworkKeyword(err.message)) {
        return true;
    }
    const httpStatus = err.http_status;
    if (httpStatus != null) {
        const status = Number(httpStatus);
        if (!isFinite(status) || status < 200 || status >= 300) {
            return true;
        }
    }
    return getErrorCode(err) === -1;
}

const NetErrorPopupService = {
    _isShowing: false,
    _pendingRetry: null as (() => void) | null,

    shouldPop(err: any): boolean {
        return !!err && (isForceRetryCode(getErrorCode(err)) || isNetworkError(err));
    },

    consumePendingRetry(): (() => void) | null {
        const retry = this._pendingRetry;
        this._pendingRetry = null;
        return retry;
    },

    _showPopup(retryFn?: () => void): void {
        if (this._isShowing) {
            console.log(LOG_PREFIX, " popup already showing, merge retryFn into queue ");
            const pending = this._pendingRetry;
            if (typeof retryFn === "function") {
                this._pendingRetry = typeof pending === "function"? () => { try { pending(); } catch (err) { console.warn(LOG_PREFIX," merged retry 1 failed ", err);
                    }
                    try {
                        retryFn();
                    } catch (err) {
                        console.warn(LOG_PREFIX, " merged retry 2 failed ", err);
                    }
                } : retryFn;
            }
        } else {
            this._pendingRetry = typeof retryFn === "function"? retryFn : null; this._isShowing = true; const uiMgr = UIMgr.getInstance(); const viewName = UIDefine.netErrorView; if (viewName) { console.log(LOG_PREFIX," showing popup with retryFn: ", !!retryFn);
                uiMgr.show(viewName).then((view: any) => {
                    if (view) {
                        console.log(LOG_PREFIX, " popup shown successfully ");
                    } else {
                        console.warn(LOG_PREFIX, " UIMgr.show returned null, fallback retry ");
                        this._isShowing = false;
                        const retry = this.consumePendingRetry();
                        retry && retry();
                    }
                }).catch((err: any) => {
                    console.warn(LOG_PREFIX, " UIMgr.show failed ", err);
                    this._isShowing = false;
                    const retry = this.consumePendingRetry();
                    retry && retry();
                });
            } else {
                console.warn(LOG_PREFIX, " UIDefine.netErrorView missing, fall back to retry immediately ");
                this._isShowing = false;
                const retry = this.consumePendingRetry();
                retry && retry();
            }
        }
    },

    notifyClosed(): void {
        this._isShowing = false;
    },

    wrapCallbacks(options: any): { success: (data: any) => void; fail: (err: any) => void } {
        const onSuccess = options.onSuccess;
        const onFail = options.onFail;
        const retry = options.retry;
        const skipForceRetryCode = !!options.skipForceRetryCode;
        const service = this;
        return {
            success(data: any) {
                if (skipForceRetryCode || !isForceRetryCode(getErrorCode(data))) {
                    typeof onSuccess === "function"&& onSuccess(data); } else { console.warn(LOG_PREFIX,"success branch hit force-retry code, route to retry popup, code ="+ getErrorCode(data)); typeof retry ==="function" ? service._showPopup(retry) : typeof onFail === "function"&& onFail(data); } }, fail(err: any) { if (service.shouldPop(err) && typeof retry ==="function") {
                    console.warn(LOG_PREFIX, " fail branch triggers retry popup, err = " + JSON.stringify(err));
                    service._showPopup(retry);
                } else {
                    typeof onFail === "function"&& onFail(err); } } }; }, handle(err: any, retryFn: () => void, fallback?: (err: any) => void): boolean { if (this.shouldPop(err) && typeof retryFn ==="function") {
            this._showPopup(retryFn);
            return true;
        }
        typeof fallback === "function" && fallback(err);
        return false;
    },

    showAndRetry(retryFn: () => void): void {
        this._showPopup(retryFn);
    }
};

export default NetErrorPopupService;
