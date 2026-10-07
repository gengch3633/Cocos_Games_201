import BusinessAnalyticsService from "./BusinessAnalyticsService";
import MiddleHandler from "./MiddleHandler";
import MiddleNetwork from "./MiddleNetwork";
import { MIDDLE_PROJECT_ADAPTER_CONFIG } from "./MiddleProjectAdapterConfig";
import MiddleService from "./MiddleService";
import { MiddleReqType } from "./MiddleReqType";
import PlatformBridge from "./PlatformBridge";

export default class MiddleSdkEventService {
    kIsUploadEventFirstCall: string = " com.sdk.kIsUploadEventFirstCall ";

    uploadOnce(onIntervalUpdate?: (seconds: number) => void): void {
        const isFirstRequest = this.getEventRequestIsFirstFlag();
        this.reportBehaviorConfigEvent(" ", 0, isFirstRequest);
        const params = MiddleService.paramData(MiddleReqType.SDKEvent);
        MiddleNetwork.getSDKEvent(params, MiddleHandler.create(this, (response: any) => {
            try {
                try {
                    console.log("[MiddleSdkEventService.getSDKEvent] res => ", JSON.stringify(response));
                } catch (err) {
                    console.log("[MiddleSdkEventService.getSDKEvent] res(raw) => ", response);
                }
                if (!response) {
                    this.reportBehaviorConfigEvent({
                        message: " empty_response "
                    }, -1, isFirstRequest);
                    return;
                }
                const payload = response && response.data && typeof response.data === "object" ? response.data : response;
                if (!payload || typeof payload !== "object") {
                    this.reportBehaviorConfigEvent({
                        message: " invalid_response_payload ",
                        raw: response
                    }, -1, isFirstRequest);
                    return;
                }
                const isActive = payload.is_active;
                const isInitFirebase = payload.is_init_firebase;
                const callbackEvents = payload.new_callback_events;
                const callbackEventTokens = payload.new_callback_events_token;
                const callbackEventParams = payload.new_callback_events_params;
                const sdkKey = payload.sdk_key;
                const urlStrategy = payload.url_strategy;
                const fbAppId = payload.fb_app_id;
                const intervalSeconds = payload.interval_seconds;
                const parsedInterval = Number(intervalSeconds);
                if (!isNaN(parsedInterval) && parsedInterval > 0 && onIntervalUpdate) {
                    onIntervalUpdate(parsedInterval);
                }
                let adjustKey = sdkKey;
                if (adjustKey == null) {
                    adjustKey = MIDDLE_PROJECT_ADAPTER_CONFIG.adjustKey;
                }
                if (isActive) {
                    const adjustParams = {
                        adjustKey: adjustKey,
                        urlStrategy: urlStrategy,
                        fbAppId: fbAppId
                    };
                    try {
                        console.log("[MiddleSdkEventService.initSdkAdjust] params => ", JSON.stringify(adjustParams));
                    } catch (err) {
                        console.log("[MiddleSdkEventService.initSdkAdjust] params(raw) => ", adjustParams);
                    }
                    PlatformBridge.getNativeBridge().initSdkAdjust(adjustKey, urlStrategy, fbAppId);
                }
                if (isInitFirebase === true) {
                    PlatformBridge.getNativeBridge().reportFirebase(isInitFirebase + " ");
                }
                if (Array.isArray(callbackEvents) && callbackEvents.length > 0) {
                    callbackEvents.forEach((eventName: string) => {
                        const token = this.findEventToken(eventName, callbackEventTokens);
                        const params = this.findEventParams(eventName, callbackEventParams);
                        const bridge = PlatformBridge.getNativeBridge();
                        if (bridge && typeof bridge.reportEventByAdjust === "function") {
                            bridge.reportEventByAdjust(eventName, token, params);
                        }
                    });
                }
                this.reportBehaviorConfigEvent(payload, 1, isFirstRequest);
            } catch (err) {
                this.reportBehaviorConfigEvent(err, -1, isFirstRequest);
            }
        }), MiddleHandler.create(this, (err: any) => {
            this.reportBehaviorConfigEvent(err, -1, isFirstRequest);
        }));
    }

    getEventRequestIsFirstFlag(): boolean {
        let isFirst = false;
        try {
            isFirst = cc.sys.localStorage.getItem(this.kIsUploadEventFirstCall) === null;
            if (isFirst) {
                cc.sys.localStorage.setItem(this.kIsUploadEventFirstCall, " 1 ");
            }
        } catch (err) {
            isFirst = true;
        }
        return isFirst;
    }

    findEventToken(eventName: string, tokens: any[]): string {
        if (!Array.isArray(tokens) || tokens.length <= 0) {
            return " ";
        }
        for (let i = 0; i < tokens.length; i++) {
            const item = tokens[i];
            if (item) {
                const token = item[eventName];
                if (token) {
                    return token;
                }
            }
        }
        return " ";
    }

    findEventParams(eventName: string, paramsList: any[]): any {
        if (!Array.isArray(paramsList) || paramsList.length <= 0) {
            return null;
        }
        for (let i = 0; i < paramsList.length; i++) {
            const item = paramsList[i];
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
        BusinessAnalyticsService.reportData(" behavior_config ", {
            behavior_config_value: value,
            behavior_config_status: status,
            behavior_first_req: isFirst,
            redirect_type: " 0 "
        });
    }
}
