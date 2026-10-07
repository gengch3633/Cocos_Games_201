import { BUSINESS_COMMON_CONFIG } from "./BusinessCommonConfig";
import ClientDataStore from "./ClientDataStore";
import HotUpdateManager from "./HotUpdateManager";
import PlayerDataStore from "./PlayerDataStore";
import SystemDataStore from "./SystemDataStore";

const reportedStacks: { [key: string]: number } = {};

function normalizeStack(stack?: string): string {
    const normalized = stack?.replace(/\([^)]*\)/g, "");
    if (!normalized || normalized.length < 200) {
        return normalized || "";
    }
    return normalized.slice(0, 199);
}

function reportToFeishu(payload: any, title: string = "异常上报"): void {
    try {
        const xhr = cc.loader.getXMLHttpRequest();
        xhr.onreadystatechange = () => {
        };
        xhr.open("POST", BUSINESS_COMMON_CONFIG.feishuWebhookUrl, true);
        xhr.setRequestHeader("Content-Type", "application/json;charset=utf-8");
        const context = {
            game: SystemDataStore.gameName,
            hot_version: HotUpdateManager.getInstance().getVersion(),
            apk_verions: ClientDataStore.version_name,
            channel: ClientDataStore.channel_name,
            uid: PlayerDataStore.user_id,
            yid: PlayerDataStore.yid,
        };
        xhr.send(JSON.stringify({
            msg_type: "post",
            content: {
                post: {
                    zh_ch: {
                        title: title,
                        content: [[
                            { tag: "text", text: JSON.stringify(context, null, "\t") },
                            { tag: "text", text: JSON.stringify(payload, null, "\t") },
                        ]],
                    },
                },
            },
        }));
    } catch (e) {
    }
}

export function globalErrorRegister(enabled: boolean): void {
    if (!cc.sys.isBrowser && enabled) {
        if (cc.sys.isNative) {
            (window as any).__errorHandler = (file: string, line: number, message: string, stack: string) => {
                const payload = { file: file, line: line, message: message, error_stack: stack };
                const key = normalizeStack(payload.error_stack);
                if (!reportedStacks[key]) {
                    reportedStacks[key] = 1;
                    reportToFeishu(payload);
                }
            };
        }
        window.addEventListener("unhandledrejection", (event: PromiseRejectionEvent) => {
            const reason = event.reason;
            const key = normalizeStack(reason);
            if (!reportedStacks[key]) {
                reportedStacks[key] = 1;
                reportToFeishu({ type: "unhandledrejection", reason: reason });
                event.preventDefault();
            }
        });
    }
}
