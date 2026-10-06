export function createMiddleHttpQueueHooks(log: any, t: any, i: any, n: any = {}) {
    return {
        shouldEnqueue: function (e: any) {
            return e.enterQueue();
        },
        shouldRetry: function (e: any) {
            return e.needRetry();
        },
        refreshUrlOnRetry: function (e: any) {
            return n.refreshUrlOnRetry ? n.refreshUrlOnRetry(e) : "";
        },
        onRetry: function (e: any, t: any) {
            return n.onRetry ? n.onRetry(e, t) : t();
        },
        onQueueCallback: function (e: any) {
            var a = e.requestTime,
                o = e.responseCode,
                r = e.url;
            if (n.shouldReportHttpMonitor ? n.shouldReportHttpMonitor() : t() && i(1, 100) <= 5) {
                var s = Date.now() - a;
                n.reportHttpMonitor && n.reportHttpMonitor({
                    req_url: r, response_code: o, response_time: s
                });
            }
        },
        parseSuccessResponse: function (t: any) {
            var a = t.url,
                o = t.reqData,
                r = t.responseText,
                s = t.status;
            if (!r) {
                log("【CC Network Err】url1:", a);
                log("【CC Network Err】body:", o.toMiddleJSON());
                log("【CC Network Err】decode body:", n.decrypt ? n.decrypt(o.toMiddleJSON()) : o.toMiddleJSON());
                log("【CC Network Err】err:", "response 为空");
                return {
                    success: false,
                    data: {
                        code: -1,
                        message: "返回数据不存在",
                        http_status: s
                    }
                };
            }
            log("【CC Network】url:", a);
            log("【CC Network】response:", r);
            var l = n.decrypt ? n.decrypt(r) : r;
            if (!l) {
                console.error("【CC Network Err】decrypt response error:", a);
                return {
                    success: false,
                    data: {
                        code: -1,
                        message: "decrypt response error",
                        http_status: s
                    }
                };
            }
            var c = JSON.parse(l);
            if (null !== c.data && 0 !== Object.keys(c.data).length) {
                log("【CC Network Suc】url:", a);
                log("【CC Network Suc】body:", o.toMiddleJSON());
                log("【CC Network Suc】decode body:", n.decrypt ? n.decrypt(o.toMiddleJSON()) : o.toMiddleJSON());
                log("【CC Network Suc】response:", JSON.stringify(r));
                log("【CC Network Suc】respon:", JSON.stringify(l));
                var u = c.data;
                log("【CC Network Suc】res:", JSON.stringify(u));
                return {
                    success: true,
                    data: u
                };
            }
            log("【CC Network Err】url0:", a);
            log("【CC Network Err】body:", o.toMiddleJSON());
            log("【CC Network Err】decode body:", n.decrypt ? n.decrypt(o.toMiddleJSON()) : o.toMiddleJSON());
            log("【CC Network Err】err:", "data 为空 - message:" + c.message);
            return {
                success: false,
                data: {
                    code: -1,
                    message: "Data不存在",
                    http_status: s
                }
            };
        },
        buildRequestBody: function (e: any) {
            return e.toMiddleJSON();
        },
        onRequestStart: function (t: any) {
            var i = t.url,
                a = t.reqData;
            log("【CC Network start】url:", i);
            log("【CC Network start】body:", a.toMiddleJSON());
            log("【CC Network start】decode body:", n.decrypt ? n.decrypt(a.toMiddleJSON()) : a.toMiddleJSON());
        },
        createStatusError: function (t: any) {
            var i = t.url,
                a = t.reqData,
                o = t.status;
            log("【CC Network Err】url2:", i);
            log("【CC Network Err】body:", a.toMiddleJSON());
            log("【CC Network Err】decode body:", n.decrypt ? n.decrypt(a.toMiddleJSON()) : a.toMiddleJSON());
            log("【CC Network Err】err:", "xhr.status = " + o);
            return {
                code: -1,
                message: "xhr.status" + o,
                http_status: o
            };
        },
        createRuntimeError: function (e: any) {
            var t = e.url,
                i = e.status,
                n = e.statusText;
            return {
                code: -1,
                message: "onXhr." + e.reason,
                http_status: i,
                statuText: n,
                url: t
            };
        },
        dispatchResult: function (e: any, t: any, i: any) {
            e && (t ? e.success(i) : e.fail(i));
        }
    };
}
