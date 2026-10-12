import * as BusinessCommonConfig from "./BusinessCommonConfig";
import ClientDataStore from "./ClientDataStore";
import HotUpdateManager from "./HotUpdateManager";
import PlayerDataStore from "./PlayerDataStore";
import SystemDataStore from "./SystemDataStore";

interface ErrorReportInfo {
    file?: string;
    line?: number | string;
    message?: string;
    error_stack?: string;
    type?: string;
    reason?: any;
}

const reportedErrors: { [key: string]: number } = {};

function truncateErrorStack(stack?: string): string {
    if (stack) {
        stack = stack.replace(/\([^)]*\)/g, "");
    }
    if (!stack || stack.length < 200) {
        return stack || "";
    }
    return stack.slice(0, 199);
}

function reportError(data: ErrorReportInfo, title: string = "异常上报"): void {
    try {
        const xhr = cc.loader.getXMLHttpRequest();
        xhr.onreadystatechange = function () { };
        xhr.open("POST", BusinessCommonConfig.BUSINESS_COMMON_CONFIG.feishuWebhookUrl, true);
        xhr.setRequestHeader("Content-Type", "application/json;charset=utf-8");
        const payload = {
            game: SystemDataStore.gameName,
            hot_version: HotUpdateManager.getInstance().getVersion(),
            apk_verions: ClientDataStore.version_name,
            channel: ClientDataStore.channel_name,
            uid: PlayerDataStore.user_id,
            yid: PlayerDataStore.yid
        };
        xhr.send(JSON.stringify({
            msg_type: "post",
            content: {
                post: {
                    zh_ch: {
                        title: title,
                        content: [[{
                            tag: "text",
                            text: JSON.stringify(payload, null, "\t")
                        }, {
                            tag: "text",
                            text: JSON.stringify(data, null, "\t")
                        }]]
                    }
                }
            }
        }));
    } catch (e) { }
}

export function globalErrorRegister(options?: any): void {
    if (!cc.sys.isBrowser && options) {
        if (cc.sys.isNative) {
            (window as any).__errorHandler = function (file: string, line: number, message: string, errorStack: string): void {
                const errorInfo: ErrorReportInfo = {
                    file: file,
                    line: line,
                    message: message,
                    error_stack: errorStack
                };
                const key = truncateErrorStack(errorInfo.error_stack);
                if (!reportedErrors[key]) {
                    reportedErrors[key] = 1;
                    reportError(errorInfo);
                }
            };
        }
        (window as any).addEventListener("unhandledrejection", function (event: any): void {
            const reason = event.reason;
            const key = truncateErrorStack(reason);
            if (!reportedErrors[key]) {
                reportedErrors[key] = 1;
                reportError({ type: "unhandledrejection", reason: reason });
                event.preventDefault();
            }
        });
    }
}

export default { globalErrorRegister };