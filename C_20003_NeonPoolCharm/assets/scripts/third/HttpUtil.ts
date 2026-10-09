import EngineUtil from "./EngineUtil";
import SdkHelper from "./SdkHelper";
import Service from "./Service";
import SystemDataSys from "./SystemDataSys";
import frameworkManager from "./frameworkManager";

const { ccclass, property } = cc._decorator;
property;

@ccclass
export default class HttpUtil {
    static _postQueue = [];
    static _inRequesting = false;

    static queuePost(e, o, n) {
        if (!n || n.enterQueue()) {
            HttpUtil._postQueue.push({
                url: e,
                reqData: o,
                handler: n
            });
            if (!HttpUtil._inRequesting) {
                HttpUtil._inRequesting = true;
                HttpUtil._Post(e, o, n);
            }
        } else HttpUtil._Post(e, o, n);
    }

    static queuePostCallback(e, o, n, c) {
        const u = HttpUtil._postQueue[0],
            p = u.url,
            d = u.handler;
        if (SystemDataSys.online_release && EngineUtil.getRandomNum(1, 100) <= 5) {
            const _ = Date.now() - e;
            SdkHelper.reportData("http_monitor", {
                request_path: p,
                response_code: o,
                response_time: _
            });
        }
        if (!n && d && d.needRetry()) {
            HttpUtil._postQueue[0].url = Service.genRequestUrl(d.getRequestType());
            frameworkManager.httpErr(c, function () {
                return HttpUtil.requestQueueHead();
            });
        } else {
            n ? d.success(c) : d.fail(c);
            HttpUtil._postQueue.shift();
            HttpUtil.requestQueueHead();
        }
    }

    static requestQueueHead() {
        HttpUtil._postQueue && HttpUtil._postQueue.length ? HttpUtil._postQueue[0] && HttpUtil._postQueue[0].url ? HttpUtil._Post(HttpUtil._postQueue[0].url, HttpUtil._postQueue[0].reqData, HttpUtil._postQueue[0].handler) : HttpUtil.requestQueueHead() : HttpUtil._inRequesting = false;
    }

    static _Post(e, o, n) {
        let a = 9999,
            l = Date.now(),
            s = new XMLHttpRequest(),
            c = function (e, o) {
                n && n.enterQueue() ? HttpUtil.queuePostCallback(l, a, e, o) : e ? n.success(o) : n.fail(o);
            };
        s.onreadystatechange = function () {
            if (4 == s.readyState) {
                a = s.status;
                if (s.status >= 200 && s.status < 400) {
                    var t = s.responseText;
                    if (t) {
                        var o = JSON.parse(t),
                            n = o;
                        if (o != null && o.ecp) {
                            n = SdkHelper.getAesDncrypData(o.data);
                            n = JSON.parse(n);
                        }
                        console.log("网络 ", e, JSON.stringify(o));
                        if (e.includes(SystemDataSys.getServerTestUrl()) || e.includes(SystemDataSys.getServerReleaseUrl())) {
                            var l = n.code;
                            if (-1 == l || -1e3 == l) {
                                c(false, n);
                                return;
                            }
                            c(true, n);
                            return;
                        }
                        c(true, n);
                    } else {
                        console.log("返回数据不存在");
                        c(false, {
                            code: -1,
                            message: "返回数据不存在",
                            http_status: s.status
                        });
                    }
                } else {
                    console.log("请求失败");
                    c(false, {
                        code: -1,
                        message: "xhr.status" + s.status,
                        http_status: s.status
                    });
                }
            }
        };
        s.open("POST", e, true);
        s.setRequestHeader("Content-type", "multipart/form-data;boundary=AaB03x");
        SdkHelper.setXhrCookie(s);
        s.send(o.arrayBuffer());
        s.addEventListener("abort", function () {
            cc.log("testlogin abort");
            c(false, {
                code: -1,
                message: "onXhr.abort",
                http_status: s.status
            });
        });
        s.addEventListener("error", function () {
            cc.log("testlogin error");
            c(false, {
                code: -1,
                message: "onXhr.error",
                http_status: s.status
            });
        });
        s.addEventListener("timeout", function () {
            cc.log("testlogin timeout");
            c(false, {
                code: -1,
                message: "onXhr.timeout",
                http_status: s.status
            });
        });
    }

    static Get(e, t, o) {
        if (o === undefined) o = false;
        return new Promise(function (t, n) {
            var i = new XMLHttpRequest();
            i.timeout = 3e4;
            var a = function (e, t) {
                n(e);
                SdkHelper.reportData("ip_request_err", {
                    err_type: t
                });
            };
            i.ontimeout = function () {
                cc.log("[tydf.https] get: request time out.");
                a(false, "ontimeout");
            };
            i.onreadystatechange = function () {
                if (4 === i.readyState) if (200 == i.status) {
                    var e = JSON.parse(i.responseText),
                        n = e;
                    if (e && o) {
                        n = SdkHelper.getAesDncrypData(e.data);
                        n = JSON.parse(n);
                    }
                    n ? t(n) : a(false, "parseErr");
                } else a(false, "onreadystatechange");
            };
            i.onerror = function () {
                console.log("There was an error!");
                a(false, "onerror");
            };
            i.open("GET", encodeURI(e), true);
            i.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            i.send();
        });
    }
}
