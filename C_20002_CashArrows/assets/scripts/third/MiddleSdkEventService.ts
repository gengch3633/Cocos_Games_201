import BusinessAnalyticsService from "./BusinessAnalyticsService";
import MiddleHandler from "./MiddleHandler";
import MiddleNetwork from "./MiddleNetwork";
import { MIDDLE_PROJECT_ADAPTER_CONFIG } from "./MiddleProjectAdapterConfig";
import { MiddleReqType } from "./MiddleReqType";
import MiddleService from "./MiddleService";
import PlatformBridge from "./PlatformBridge";

export default class MiddleSdkEventService {
    kIsUploadEventFirstCall = "com.sdk.kIsUploadEventFirstCall";

    uploadOnce(onIntervalUpdate?: (seconds: number) => void): void {
        void this.uploadOnceAsync(onIntervalUpdate);
    }

    async uploadOnceAsync(onIntervalUpdate?: (seconds: number) => void): Promise<void> {
        const isFirst = this.getEventRequestIsFirstFlag();
        this.reportBehaviorConfigEvent("", 0, isFirst);
        const params = MiddleService.paramData(MiddleReqType.SDKEvent);

        try {
            const response = await new Promise<any>((resolve, reject) => {
                MiddleNetwork.getSDKEvent(
                    params,
                    MiddleHandler.create(this, resolve),
                    MiddleHandler.create(this, reject)
                );
            });
            await this.handleUploadResponse(response, isFirst, onIntervalUpdate);
        } catch (err) {
            this.reportBehaviorConfigEvent(err, -1, isFirst);
        }
    }

    private async handleUploadResponse(response: any, isFirst: boolean, onIntervalUpdate?: (seconds: number) => void): Promise<void> {
        try {
            try {
                console.log("[MiddleSdkEventService.getSDKEvent] res =>", JSON.stringify(response));
            } catch (e) {
                console.log("[MiddleSdkEventService.getSDKEvent] res(raw) =>", response);
            }
            if (!response) {
                this.reportBehaviorConfigEvent({ message: "empty_response" }, -1, isFirst);
                return;
            }
            const payload = response?.data && typeof response.data === "object" ? response.data : response;
            if (!payload || typeof payload !== "object") {
                this.reportBehaviorConfigEvent({ message: "invalid_response_payload", raw: response }, -1, isFirst);
                return;
            }
            const isActive = payload.is_active;
            const isInitFirebase = payload.is_init_firebase;
            const callbackEvents = payload.new_callback_events;
            const callbackTokens = payload.new_callback_events_token;
            const callbackParams = payload.new_callback_events_params;
            let sdkKey = payload.sdk_key;
            const urlStrategy = payload.url_strategy;
            const fbAppId = payload.fb_app_id;
            const intervalSeconds = Number(payload.interval_seconds);
            if (!isNaN(intervalSeconds) && intervalSeconds > 0) {
                onIntervalUpdate?.(intervalSeconds);
            }
            if (sdkKey == null) {
                sdkKey = MIDDLE_PROJECT_ADAPTER_CONFIG.adjustKey;
            }
            if (isActive) {
                const adjustParams = {
                    adjustKey: sdkKey,
                    urlStrategy,
                    fbAppId,
                };
                try {
                    console.log("[MiddleSdkEventService.initSdkAdjust] params =>", JSON.stringify(adjustParams));
                } catch (e) {
                    console.log("[MiddleSdkEventService.initSdkAdjust] params(raw) =>", adjustParams);
                }
                PlatformBridge.getNativeBridge().initSdkAdjust(sdkKey, urlStrategy, fbAppId);
            }
            if (isInitFirebase === true) {
                PlatformBridge.getNativeBridge().reportFirebase(isInitFirebase + "");
            }
            if (Array.isArray(callbackEvents) && callbackEvents.length > 0) {
                callbackEvents.forEach((eventName: string) => {
                    const token = this.findEventToken(eventName, callbackTokens);
                    const eventParams = this.findEventParams(eventName, callbackParams);
                    const bridge = PlatformBridge.getNativeBridge();
                    if (bridge && typeof bridge.reportEventByAdjust === "function") {
                        bridge.reportEventByAdjust(eventName, token, eventParams);
                    }
                });
            }
            this.reportBehaviorConfigEvent(payload, 1, isFirst);
        } catch (err) {
            this.reportBehaviorConfigEvent(err, -1, isFirst);
        }
    }

    getEventRequestIsFirstFlag(): boolean {
        let isFirst = false;
        try {
            isFirst = cc.sys.localStorage.getItem(this.kIsUploadEventFirstCall) === null;
            if (isFirst) {
                cc.sys.localStorage.setItem(this.kIsUploadEventFirstCall, "1");
            }
        } catch (e) {
            isFirst = true;
        }
        return isFirst;
    }

    findEventToken(eventName: string, tokens: any[]): string {
        if (!Array.isArray(tokens) || tokens.length <= 0) {
            return "";
        }
        for (const item of tokens) {
            if (item) {
                const token = item[eventName];
                if (token) {
                    return token;
                }
            }
        }
        return "";
    }

    findEventParams(eventName: string, paramsList: any[]): any {
        if (!Array.isArray(paramsList) || paramsList.length <= 0) {
            return null;
        }
        for (const item of paramsList) {
            if (item) {
                const params = item[eventName];
                if (params !== undefined) {
                    return params;
                }
            }
        }
        return null;
    }

    reportBehaviorConfigEvent(value: any, status: number, isFirst: boolean = false): void {
        BusinessAnalyticsService.reportData("behavior_config", {
            behavior_config_value: value,
            behavior_config_status: status,
            behavior_first_req: isFirst,
            redirect_type: "0",
        });
    }
}
