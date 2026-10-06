import MiddleNetwork from "./MiddleNetwork";
import MiddleService from "./MiddleService";
import { MiddleReqType } from "./MiddleReqType";
import BusinessAnalyticsService from "./BusinessAnalyticsService";
import MiddleHandler from "./MiddleHandler";
import PlatformBridge from "./PlatformBridge";
import { MIDDLE_PROJECT_ADAPTER_CONFIG } from "./MiddleProjectAdapterConfig";

interface SdkEventPayload {
    is_active?: boolean;
    is_init_firebase?: boolean;
    new_callback_events?: string[];
    new_callback_events_token?: Array<Record<string, string>>;
    new_callback_events_params?: Array<Record<string, unknown>>;
    sdk_key?: string;
    url_strategy?: string;
    fb_app_id?: string;
    interval_seconds?: number | string;
}

export default class MiddleSdkEventService {
    kIsUploadEventFirstCall = "com.sdk.kIsUploadEventFirstCall";

    uploadOnce(onIntervalUpdate?: (seconds: number) => void): void {
        const isFirst = this.getEventRequestIsFirstFlag();
        this.reportBehaviorConfigEvent("", 0, isFirst);
        const params = MiddleService.paramData(MiddleReqType.SDKEvent);
        MiddleNetwork.getSDKEvent(
            params,
            MiddleHandler.create(this, (response: unknown) => {
                try {
                    try {
                        console.log("[MiddleSdkEventService.getSDKEvent] res =>", JSON.stringify(response));
                    } catch {
                        console.log("[MiddleSdkEventService.getSDKEvent] res(raw) =>", response);
                    }
                    if (!response) {
                        this.reportBehaviorConfigEvent({ message: "empty_response" }, -1, isFirst);
                        return;
                    }
                    const wrapper = response as { data?: SdkEventPayload };
                    const payload = wrapper?.data && typeof wrapper.data === "object" ? wrapper.data : (response as SdkEventPayload);
                    if (!payload || typeof payload !== "object") {
                        this.reportBehaviorConfigEvent({ message: "invalid_response_payload", raw: response }, -1, isFirst);
                        return;
                    }
                    const intervalSeconds = Number(payload.interval_seconds);
                    if (!isNaN(intervalSeconds) && intervalSeconds > 0) {
                        onIntervalUpdate?.(intervalSeconds);
                    }
                    let adjustKey = payload.sdk_key;
                    if (adjustKey == null) {
                        adjustKey = MIDDLE_PROJECT_ADAPTER_CONFIG.adjustKey;
                    }
                    if (payload.is_active) {
                        const initParams = {
                            adjustKey,
                            urlStrategy: payload.url_strategy,
                            fbAppId: payload.fb_app_id,
                        };
                        try {
                            console.log("[MiddleSdkEventService.initSdkAdjust] params =>", JSON.stringify(initParams));
                        } catch {
                            console.log("[MiddleSdkEventService.initSdkAdjust] params(raw) =>", initParams);
                        }
                        PlatformBridge.getNativeBridge().initSdkAdjust(adjustKey, payload.url_strategy, payload.fb_app_id);
                    }
                    if (payload.is_init_firebase === true) {
                        PlatformBridge.getNativeBridge().reportFirebase(String(payload.is_init_firebase));
                    }
                    if (Array.isArray(payload.new_callback_events) && payload.new_callback_events.length > 0) {
                        payload.new_callback_events.forEach((eventName) => {
                            const token = this.findEventToken(eventName, payload.new_callback_events_token);
                            const eventParams = this.findEventParams(eventName, payload.new_callback_events_params);
                            const bridge = PlatformBridge.getNativeBridge();
                            if (bridge && typeof bridge.reportEventByAdjust === "function") {
                                bridge.reportEventByAdjust(eventName, token, eventParams);
                            }
                        });
                    }
                    this.reportBehaviorConfigEvent(payload, 1, isFirst);
                } catch (error) {
                    this.reportBehaviorConfigEvent(error, -1, isFirst);
                }
            }),
            MiddleHandler.create(this, (error: unknown) => {
                this.reportBehaviorConfigEvent(error, -1, isFirst);
            }),
        );
    }

    getEventRequestIsFirstFlag(): boolean {
        let isFirst = false;
        try {
            isFirst = cc.sys.localStorage.getItem(this.kIsUploadEventFirstCall) === null;
            if (isFirst) {
                cc.sys.localStorage.setItem(this.kIsUploadEventFirstCall, "1");
            }
        } catch {
            isFirst = true;
        }
        return isFirst;
    }

    findEventToken(eventName: string, tokenList?: Array<Record<string, string>>): string {
        if (!Array.isArray(tokenList) || tokenList.length <= 0) {
            return "";
        }
        for (const item of tokenList) {
            if (item && item[eventName]) {
                return item[eventName];
            }
        }
        return "";
    }

    findEventParams(eventName: string, paramsList?: Array<Record<string, unknown>>): unknown {
        if (!Array.isArray(paramsList) || paramsList.length <= 0) {
            return null;
        }
        for (const item of paramsList) {
            if (item && item[eventName] !== undefined) {
                return item[eventName];
            }
        }
        return null;
    }

    reportBehaviorConfigEvent(value: unknown, status: number, isFirst = false): void {
        BusinessAnalyticsService.reportData("behavior_config", {
            behavior_config_value: value,
            behavior_config_status: status,
            behavior_first_req: isFirst,
            redirect_type: "0",
        });
    }
}
