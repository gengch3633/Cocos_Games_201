import UIMgr from "./UIMgr";
import UIDefine from "./UIDefine";

const LOG_TAG = "[NetErrorPopup] ";
const FORCE_RETRY_CODES = [-777];
const NETWORK_ERROR_HINTS = [" xhr.status ", " xhr.error ", " onXhr.", " timeout ", " 返回数据不存在 ", " 响应解析失败 ", " response parse fail ", " http status ", " network error ", " 网络错误 "];

function extractCode(error: any) {
    if (error && "object" == typeof error) {
        if ("number" == typeof error.code) {
            return error.code;
        }
        if ("string" == typeof error.code) {
            var parsed = Number(error.code);
            return isNaN(parsed) ? void 0 : parsed;
        }
    }
}

function isForceRetryCode(code: any) {
    if (void 0 === code) {
        return false;
    }
    for (var i = 0; i < FORCE_RETRY_CODES.length; i++) {
        if (FORCE_RETRY_CODES[i] === code) {
            return true;
        }
    }
    return false;
}

function matchesNetworkHint(message: any) {
    if (!message) {
        return false;
    }
    for (var text = String(message).toLowerCase(), i = 0; i < NETWORK_ERROR_HINTS.length; i++) {
        if (text.indexOf(NETWORK_ERROR_HINTS[i].toLowerCase()) >= 0) {
            return true;
        }
    }
    return false;
}

function shouldPopByPayload(error: any) {
    if (!error || "object" != typeof error) {
        return false;
    }
    if (matchesNetworkHint(error.message)) {
        return true;
    }
    var httpStatus = error.http_status;
    if (null != httpStatus) {
        var status = Number(httpStatus);
        if (!isFinite(status) || status < 200 || status >= 300) {
            return true;
        }
    }
    return -1 === extractCode(error);
}

const NetErrorPopupService = {
    _isShowing: false,
    _pendingRetry: null as (() => void) | null,
    shouldPop: function (error: any) {
        return !!error && (!!isForceRetryCode(extractCode(error)) || shouldPopByPayload(error));
    },
    consumePendingRetry: function () {
        var retry = this._pendingRetry;
        this._pendingRetry = null;
        return retry;
    },
    _showPopup: function (retryFn: (() => void) | null) {
        if (this._isShowing) {
            console.log(LOG_TAG, " popup already showing, merge retryFn into queue ");
            var pending = this._pendingRetry;
            "function" == typeof retryFn && (this._pendingRetry = "function" == typeof pending ? function () {
                try {
                    pending();
                } catch (e) {
                    console.warn(LOG_TAG, " merged retry 1 failed ", e);
                }
                try {
                    retryFn();
                } catch (e) {
                    console.warn(LOG_TAG, " merged retry 2 failed ", e);
                }
            } : retryFn);
        } else {
            this._pendingRetry = "function" == typeof retryFn ? retryFn : null;
            var self = this;
            self._isShowing = true;
            var uiMgr = UIMgr.getInstance(),
                config = UIDefine.netErrorView;
            if (config) {
                console.log(LOG_TAG, " showing popup with retryFn: ", !!retryFn);
                uiMgr.show(config).then(function (view) {
                    if (view) {
                        console.log(LOG_TAG, " popup shown successfully ");
                    } else {
                        console.warn(LOG_TAG, " UIMgr.show returned null, fallback retry ");
                        self._isShowing = false;
                        var retry = self.consumePendingRetry();
                        retry && retry();
                    }
                }).catch(function (err) {
                    console.warn(LOG_TAG, " UIMgr.show failed ", err);
                    self._isShowing = false;
                    var retry = self.consumePendingRetry();
                    retry && retry();
                });
            } else {
                console.warn(LOG_TAG, " UIDefine.netErrorView missing, fall back to retry immediately ");
                self._isShowing = false;
                var immediateRetry = self.consumePendingRetry();
                immediateRetry && immediateRetry();
            }
        }
    },
    notifyClosed: function () {
        this._isShowing = false;
    },
    wrapCallbacks: function (options: any) {
        var onSuccess = (options = options || {}).onSuccess,
            onFail = options.onFail,
            retry = options.retry,
            skipForceRetryCode = !!options.skipForceRetryCode,
            self = this;
        return {
            success: function (result: any) {
                if (skipForceRetryCode || !isForceRetryCode(extractCode(result))) {
                    "function" == typeof onSuccess && onSuccess(result);
                } else {
                    console.warn(LOG_TAG, " success branch hit force- retry code, route to retry popup, code = " + extractCode(result));
                    "function" == typeof retry ? self._showPopup(retry) : "function" == typeof onFail && onFail(result);
                }
            },
            fail: function (error: any) {
                if (self.shouldPop(error) && "function" == typeof retry) {
                    console.warn(LOG_TAG, " fail branch triggers retry popup, err = " + JSON.stringify(error));
                    self._showPopup(retry);
                } else {
                    "function" == typeof onFail && onFail(error);
                }
            }
        };
    },
    handle: function (error: any, retryFn: (() => void) | null, onFail?: (error: any) => void) {
        if (this.shouldPop(error) && "function" == typeof retryFn) {
            this._showPopup(retryFn);
            return true;
        }
        "function" == typeof onFail && onFail(error);
        return false;
    },
    showAndRetry: function (retryFn: () => void) {
        this._showPopup(retryFn);
    }
};

export default NetErrorPopupService;
