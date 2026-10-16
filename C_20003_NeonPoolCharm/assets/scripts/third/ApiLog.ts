export default class ApiLog {
    private static _enabled: any = null;

    /**
     * 日志总开关，默认开启。
     * 运行时可通过 cc.js.getClassByName("ApiLog").enabled = false 关闭，
     * 或直接写 localStorage["api_log_enabled"] = "0" / "1"，刷新后仍然生效。
     */
    static get enabled(): boolean {
        if (null == ApiLog._enabled) {
            const stored = cc.sys.localStorage.getItem("api_log_enabled");
            ApiLog._enabled = null == stored || "0" !== stored;
        }
        return ApiLog._enabled;
    }

    static set enabled(value: boolean) {
        ApiLog._enabled = value;
        cc.sys.localStorage.setItem("api_log_enabled", value ? "1" : "0");
    }

    static request(name: string, data?: any) {
        if (ApiLog.enabled) {
            console.log("[API] " + name + " 请求", data);
        }
    }

    static response(name: string, data?: any) {
        if (ApiLog.enabled) {
            console.log("[API] " + name + " 返回", data);
        }
    }
}

cc.js.setClassName("ApiLog", ApiLog);
