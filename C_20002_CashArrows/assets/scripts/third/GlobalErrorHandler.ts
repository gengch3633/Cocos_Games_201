import { BUSINESS_COMMON_CONFIG } from "./BusinessCommonConfig";
import ClientDataStore from "./ClientDataStore";
import HotUpdateManager from "./HotUpdateManager";
import PlayerDataStore from "./PlayerDataStore";
import SystemDataStore from "./SystemDataStore";

const reportedErrors: { [key: string]: number } = {};

function truncateErrorStack(stack: any): string {
    stack = stack?.replace(/\([^)]*\)/g, "");
    if (!stack || stack.length < 200) {
        return stack || "";
    }
    return stack.slice(0, 199);
}

function reportError(payload: any, title: string = "异常上报"): void {
    try {
        const xhr = cc.loader.getXMLHttpRequest();
        xhr.onreadystatechange = function () { };
        xhr.open("POST", BUSINESS_COMMON_CONFIG.feishuWebhookUrl, true);
        xhr.setRequestHeader("Content-Type", "application/json;charset=utf-8");
        const meta = {
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
                        content: [[
                            { tag: "text", text: JSON.stringify(meta, null, "\t") },
                            { tag: "text", text: JSON.stringify(payload, null, "\t") }
                        ]]
                    }
                }
            }
        }));
    } catch (e) { }
}

export function globalErrorRegister(enabled: boolean): void {
    if (cc.sys.isBrowser || !enabled) {
        return;
    }
    if (cc.sys.isNative) {
        (window as any).__errorHandler = function (file: string, line: number, message: string, errorStack: string) {
            const payload = { file, line, message, error_stack: errorStack };
            const key = truncateErrorStack(payload.error_stack);
            if (!reportedErrors[key]) {
                reportedErrors[key] = 1;
                reportError(payload);
            }
        };
    }
    window.addEventListener("unhandledrejection", function (event: PromiseRejectionEvent) {
        const reason = event.reason;
        const key = truncateErrorStack(reason);
        if (!reportedErrors[key]) {
            reportedErrors[key] = 1;
            reportError({ type: "unhandledrejection", reason });
            event.preventDefault();
        }
    });
}
