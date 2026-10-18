const LOG_TAG = "[ApiRequest]";
const STORAGE_KEY = "api_request_log_enabled";
const WINDOW_FLAG = "__API_REQUEST_LOG_ENABLED__";

function isEmptyValue(value: any): boolean {
    if (value === undefined || value === null) {
        return true;
    }
    if (typeof value === "object" && !Array.isArray(value) && Object.keys(value).length === 0) {
        return true;
    }
    return false;
}

function normalizeLogValue(value: any): any {
    return isEmptyValue(value) ? null : value;
}

export default class ApiRequestLogger {
    private static overrideEnabled: boolean | null = null;

    /**
     * 外部接口日志总开关。
     * 优先级：setEnabled() > window.__API_REQUEST_LOG_ENABLED__ > localStorage(api_request_log_enabled) > 默认开启
     */
    public static isEnabled(): boolean {
        if (this.overrideEnabled !== null) {
            return this.overrideEnabled;
        }
        try {
            if (typeof window !== "undefined" && (window as any)[WINDOW_FLAG] !== undefined) {
                return (window as any)[WINDOW_FLAG] === true;
            }
        } catch (error) {
        }
        try {
            if (typeof cc !== "undefined" && cc.sys && cc.sys.localStorage) {
                const flag = cc.sys.localStorage.getItem(STORAGE_KEY);
                if (flag !== null && flag !== undefined && flag !== "") {
                    return flag === "1" || flag === "true";
                }
            }
        } catch (error) {
        }
        return true;
    }

    public static setEnabled(enabled: boolean): void {
        this.overrideEnabled = enabled;
        try {
            if (typeof cc !== "undefined" && cc.sys && cc.sys.localStorage) {
                cc.sys.localStorage.setItem(STORAGE_KEY, enabled ? "1" : "0");
            }
        } catch (error) {
        }
        try {
            if (typeof window !== "undefined") {
                (window as any)[WINDOW_FLAG] = enabled;
            }
        } catch (error) {
        }
    }

    public static extractFunctionName(reqData: any): string | null {
        if (!reqData) {
            return null;
        }
        try {
            if (typeof reqData.trace === "function") {
                const trace = reqData.trace();
                if (trace && trace.functionName) {
                    return trace.functionName;
                }
                if (trace && trace.requestKey) {
                    return trace.requestKey;
                }
            }
        } catch (error) {
        }
        return null;
    }

    public static extractParams(reqData: any): any {
        if (!reqData) {
            return null;
        }
        try {
            if (typeof reqData.trace === "function") {
                const trace = reqData.trace();
                if (trace && !isEmptyValue(trace.businessPlainData)) {
                    return trace.businessPlainData;
                }
            }
            if (typeof reqData.toMiddleJSON === "function") {
                const middleData = reqData.toMiddleJSON();
                if (!isEmptyValue(middleData)) {
                    return middleData;
                }
            }
            if (typeof reqData === "object") {
                if (typeof reqData.toJSON === "function") {
                    try {
                        const jsonText = reqData.toJSON();
                        const parsed = JSON.parse(jsonText);
                        if (!isEmptyValue(parsed)) {
                            return parsed;
                        }
                    } catch (error) {
                    }
                }
                if (!isEmptyValue(reqData)) {
                    return reqData;
                }
            }
        } catch (error) {
        }
        return null;
    }

    public static log(functionName: string | null, url: string, params: any, response: any): void {
        if (!this.isEnabled()) {
            return;
        }
        const payload = {
            functionName: functionName || null,
            url: url || null,
            params: normalizeLogValue(params),
            response: normalizeLogValue(response),
        };
        console.warn(LOG_TAG, payload.functionName, payload.url, payload.params, payload.response);
        // console.warn(LOG_TAG, payload);
    }
}
