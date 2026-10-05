import SystemDataSys from "./SystemDataSys";
import frameworkManager from "./frameworkManager";
import SdkHelper from "./SdkHelper";
import Service from "./Service";
import EngineUtil from "./EngineUtil";
import FormData from "./FormData";

interface HttpHandlerLike {
    enterQueue(): boolean;
    success(data: unknown): void;
    fail(data: unknown): void;
    needRetry(): boolean;
    getRequestType(): string;
}

interface QueueItem {
    url: string;
    reqData: FormData;
    handler: HttpHandlerLike;
}

export default class HttpUtil {
    private static _postQueue: QueueItem[] = [];
    private static _inRequesting = false;

    static queuePost(url: string, reqData: FormData, handler: HttpHandlerLike): void {
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

    static queuePostCallback(startTime: number, status: number, success: boolean, response: unknown): void {
        const item = HttpUtil._postQueue[0];
        const url = item.url;
        const handler = item.handler;
        if (SystemDataSys.online_release && EngineUtil.getRandomNum(1, 100) <= 5) {
            const elapsed = Date.now() - startTime;
            SdkHelper.reportData("http_monitor", {
                request_path: url,
                response_code: status,
                response_time: elapsed,
            });
        }
        if (!success && handler && handler.needRetry()) {
            HttpUtil._postQueue[0].url = Service.genRequestUrl(handler.getRequestType());
            (frameworkManager as any).httpErr(response, () => HttpUtil.requestQueueHead());
        } else {
            success ? handler.success(response) : handler.fail(response);
            HttpUtil._postQueue.shift();
            HttpUtil.requestQueueHead();
        }
    }

    static requestQueueHead(): void {
        if (HttpUtil._postQueue && HttpUtil._postQueue.length) {
            if (HttpUtil._postQueue[0] && HttpUtil._postQueue[0].url) {
                HttpUtil._Post(HttpUtil._postQueue[0].url, HttpUtil._postQueue[0].reqData, HttpUtil._postQueue[0].handler);
            } else {
                HttpUtil.requestQueueHead();
            }
        } else {
            HttpUtil._inRequesting = false;
        }
    }

    private static _Post(url: string, reqData: FormData, handler: HttpHandlerLike): void {
        let status = 9999;
        const startTime = Date.now();
        const xhr = new XMLHttpRequest();
        const callback = (success: boolean, response: unknown) => {
            if (handler && handler.enterQueue()) {
                HttpUtil.queuePostCallback(startTime, status, success, response);
            } else if (success) {
                handler.success(response);
            } else {
                handler.fail(response);
            }
        };
        xhr.onreadystatechange = () => {
            if (xhr.readyState == 4) {
                status = xhr.status;
                if (xhr.status >= 200 && xhr.status < 400) {
                    const text = xhr.responseText;
                    if (text) {
                        let parsed = JSON.parse(text);
                        let data = parsed;
                        if (parsed?.ecp) {
                            data = SdkHelper.getAesDncrypData(parsed.data);
                            data = JSON.parse(data);
                        }
                        console.log("网络 ", url, JSON.stringify(parsed));
                        if (url.includes(SystemDataSys.getServerTestUrl()) || url.includes(SystemDataSys.getServerReleaseUrl())) {
                            const code = data.code;
                            if (code == -1 || code == -1000) {
                                callback(false, data);
                                return;
                            }
                            callback(true, data);
                            return;
                        }
                        callback(true, data);
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

    static Get(url: string, _params?: unknown, decrypt = false): Promise<unknown> {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.timeout = 30000;
            const fail = (response: unknown, errType: string) => {
                reject(response);
                SdkHelper.reportData("ip_request_err", {
                    err_type: errType,
                });
            };
            xhr.ontimeout = () => {
                cc.log("[tydf.https] get: request time out.");
                fail(false, "ontimeout");
            };
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if (xhr.status == 200) {
                        let parsed = JSON.parse(xhr.responseText);
                        let data = parsed;
                        if (parsed && decrypt) {
                            data = SdkHelper.getAesDncrypData(parsed.data);
                            data = JSON.parse(data);
                        }
                        data ? resolve(data) : fail(false, "parseErr");
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
