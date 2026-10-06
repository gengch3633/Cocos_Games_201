import { BUSINESS_COMMON_CONFIG } from "./BusinessCommonConfig";
import ClientDataStore from "./ClientDataStore";
import PlayerDataStore from "./PlayerDataStore";
import SystemDataStore from "./SystemDataStore";
import HotUpdateManager from "./HotUpdateManager";

const reportedErrors: Record<string, number> = {};

function normalizeStack(errorStack?: string): string {
    const normalized = errorStack?.replace(/\([^)]*\)/g, "");
    if (!normalized || normalized.length < 200) {
        return normalized || "";
    }
    return normalized.slice(0, 199);
}

function reportToFeishu(payload: Record<string, unknown>, title = "异常上报"): void {
    try {
        const xhr = cc.loader.getXMLHttpRequest();
        xhr.onreadystatechange = () => {};
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
        xhr.send(
            JSON.stringify({
                msg_type: "post",
                content: {
                    post: {
                        zh_ch: {
                            title,
                            content: [
                                [
                                    { tag: "text", text: JSON.stringify(context, null, "\t") },
                                    { tag: "text", text: JSON.stringify(payload, null, "\t") },
                                ],
                            ],
                        },
                    },
                },
            }),
        );
    } catch {
        // ignore
    }
}

export function globalErrorRegister(enabled: boolean): void {
    if (cc.sys.isBrowser || !enabled) {
        return;
    }

    if (cc.sys.isNative) {
        (window as any).__errorHandler = (file: string, line: number, message: string, errorStack: string) => {
            const payload = { file, line, message, error_stack: errorStack };
            const key = normalizeStack(payload.error_stack);
            if (!reportedErrors[key]) {
                reportedErrors[key] = 1;
                reportToFeishu(payload);
            }
        };
    }

    window.addEventListener("unhandledrejection", (event: PromiseRejectionEvent) => {
        const key = normalizeStack(String(event.reason));
        if (!reportedErrors[key]) {
            reportedErrors[key] = 1;
            reportToFeishu({
                type: "unhandledrejection",
                reason: event.reason,
            });
            event.preventDefault();
        }
    });
}
