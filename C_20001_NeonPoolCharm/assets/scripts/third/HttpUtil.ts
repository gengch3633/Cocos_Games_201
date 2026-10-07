import EngineUtil from "./EngineUtil";
import frameworkManager from "./frameworkManager";
import SdkHelper from "./SdkHelper";
import Service from "./Service";
import SystemDataSys from "./SystemDataSys";

const { ccclass } = cc._decorator;

@ccclass
class HttpUtil {
    static _postQueue: { url: string; reqData: any; handler: any }[] = [];
    static _inRequesting = false;

    static queuePost(url: string, reqData: any, handler: any): void {
        if (!handler || handler.enterQueue()) {
            HttpUtil._postQueue.push({ url, reqData, handler });
            if (!HttpUtil._inRequesting) {
                HttpUtil._inRequesting = true;
                HttpUtil._Post(url, reqData, handler);
            }
        } else {
            HttpUtil._Post(url, reqData, handler);
        }
    }

    static queuePostCallback(startTime: number, status: number, success: boolean, data: any): void {
        const head = HttpUtil._postQueue[0];
        const url = head.url;
        const handler = head.handler;
        if (SystemDataSys.online_release && EngineUtil.getRandomNum(1, 100) <= 5) {
            const responseTime = Date.now() - startTime;
            SdkHelper.reportData("http_monitor", {
                request_path: url,
                response_code: status,
                response_time: responseTime,
            });
        }
        if (!success && handler && handler.needRetry()) {
            HttpUtil._postQueue[0].url = Service.genRequestUrl(handler.getRequestType());
            frameworkManager.httpErr(data, () => HttpUtil.requestQueueHead());
        } else {
            if (success) {
                handler.success(data);
            } else {
                handler.fail(data);
            }
            HttpUtil._postQueue.shift();
            HttpUtil.requestQueueHead();
        }
    }

    static requestQueueHead(): void {
        if (HttpUtil._postQueue && HttpUtil._postQueue.length) {
            if (HttpUtil._postQueue[0] && HttpUtil._postQueue[0].url) {
                HttpUtil._Post(
                    HttpUtil._postQueue[0].url,
                    HttpUtil._postQueue[0].reqData,
                    HttpUtil._postQueue[0].handler
                );
            } else {
                HttpUtil.requestQueueHead();
            }
        } else {
            HttpUtil._inRequesting = false;
        }
    }

    static _Post(url: string, reqData: any, handler: any): void {
        let status = 9999;
        const startTime = Date.now();
        const xhr = new XMLHttpRequest();
        const callback = (success: boolean, data: any) => {
            if (handler && handler.enterQueue()) {
                HttpUtil.queuePostCallback(startTime, status, success, data);
            } else if (success) {
                handler.success(data);
            } else {
                handler.fail(data);
            }
        };
        xhr.onreadystatechange = () => {
            if (xhr.readyState == 4) {
                status = xhr.status;
                if (xhr.status >= 200 && xhr.status < 400) {
                    const responseText = xhr.responseText;
                    if (responseText) {
                        const raw = JSON.parse(responseText);
                        let parsed = raw;
                        if (raw?.ecp) {
                            parsed = SdkHelper.getAesDncrypData(raw.data);
                            parsed = JSON.parse(parsed);
                        }
                        console.log("网络 ", url, JSON.stringify(raw));
                        if (
                            url.includes(SystemDataSys.getServerTestUrl()) ||
                            url.includes(SystemDataSys.getServerReleaseUrl())
                        ) {
                            const code = parsed.code;
                            if (code == -1 || code == -1000) {
                                callback(false, parsed);
                                return;
                            }
                            callback(true, parsed);
                            return;
                        }
                        callback(true, parsed);
                    } else {
                        console.log("返回数据不存在");
                        callback(false, {
                            code: -1,
                            message: "返回数据不存在",
                            http_status: xhr.status,
                        });
                    }
                } else {
                    console.log("请求失败");
                    callback(false, {
                        code: -1,
                        message: "xhr.status" + xhr.status,
                        http_status: xhr.status,
                    });
                }
            }
        };
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-type", "multipart/form-data;boundary=AaB03x");
        SdkHelper.setXhrCookie(xhr);
        xhr.send(reqData.arrayBuffer());
        xhr.addEventListener("abort", () => {
            cc.log("testlogin abort");
            callback(false, {
                code: -1,
                message: "onXhr.abort",
                http_status: xhr.status,
            });
        });
        xhr.addEventListener("error", () => {
            cc.log("testlogin error");
            callback(false, {
                code: -1,
                message: "onXhr.error",
                http_status: xhr.status,
            });
        });
        xhr.addEventListener("timeout", () => {
            cc.log("testlogin timeout");
            callback(false, {
                code: -1,
                message: "onXhr.timeout",
                http_status: xhr.status,
            });
        });
    }

    static Get(url: string, _unused?: any, encrypted: boolean = false): Promise<any> {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.timeout = 30000;
            const fail = (result: boolean, errType: string) => {
                reject(result);
                SdkHelper.reportData("ip_request_err", { err_type: errType });
            };
            xhr.ontimeout = () => {
                cc.log("[tydf.https] get: request time out.");
                fail(false, "ontimeout");
            };
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if (xhr.status == 200) {
                        const raw = JSON.parse(xhr.responseText);
                        let parsed = raw;
                        if (raw && encrypted) {
                            parsed = SdkHelper.getAesDncrypData(raw.data);
                            parsed = JSON.parse(parsed);
                        }
                        if (parsed) {
                            resolve(parsed);
                        } else {
                            fail(false, "parseErr");
                        }
                    } else {
                        fail(false, "onreadystatechange");
                    }
                }
            };
            xhr.onerror = () => {
                console.log("There was an error!");
                fail(false, "onerror");
            };
            xhr.open("GET", encodeURI(url), true);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.send();
        });
    }
}

export default HttpUtil;
