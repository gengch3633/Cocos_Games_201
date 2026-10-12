import BusinessAnalyticsService from "./BusinessAnalyticsService";
import MiddleHandler from "./MiddleHandler";
import MiddleNetwork from "./MiddleNetwork";
import MiddleProjectAdapterConfig from "./MiddleProjectAdapterConfig";
import MiddleReqType from "./MiddleReqType";
import MiddleService from "./MiddleService";
import PlatformBridge from "./PlatformBridge";

export default class MiddleSdkEventService {
	private kIsUploadEventFirstCall: string = "com.sdk.kIsUploadEventFirstCall";

	public uploadOnce(onInterval?: (seconds: number) => void): void {
		const isFirst: boolean = this.getEventRequestIsFirstFlag();
		this.reportBehaviorConfigEvent("", 0, isFirst);
		const paramData: any = MiddleService.paramData(MiddleReqType.SDKEvent);
		MiddleNetwork.getSDKEvent(
			paramData,
			MiddleHandler.create(this, (res: any) => {
				try {
					try {
						console.log("[MiddleSdkEventService.getSDKEvent] res =>", JSON.stringify(res));
					} catch (e) {
						console.log("[MiddleSdkEventService.getSDKEvent] res(raw) =>", res);
					}
					if (!res) {
						this.reportBehaviorConfigEvent({ message: "empty_response" }, -1, isFirst);
						return;
					}
					const data: any = res && res.data && typeof res.data === "object" ? res.data : res;
					if (!data || typeof data !== "object") {
						this.reportBehaviorConfigEvent({ message: "invalid_response_payload", raw: res }, -1, isFirst);
						return;
					}
					const isActive: any = data.is_active;
					const isInitFirebase: any = data.is_init_firebase;
					const newCallbackEvents: any = data.new_callback_events;
					const newCallbackEventsToken: any = data.new_callback_events_token;
					const newCallbackEventsParams: any = data.new_callback_events_params;
					const sdkKey: any = data.sdk_key;
					const urlStrategy: any = data.url_strategy;
					const fbAppId: any = data.fb_app_id;
					const intervalSeconds: number = Number(data.interval_seconds);
					if (!isNaN(intervalSeconds) && intervalSeconds > 0 && onInterval) {
						onInterval(intervalSeconds);
					}
					let adjustKey: any = sdkKey;
					if (adjustKey == null) {
						adjustKey = MiddleProjectAdapterConfig.MIDDLE_PROJECT_ADAPTER_CONFIG.adjustKey;
					}
					if (isActive) {
						const adjustParams: any = {
							adjustKey: adjustKey,
							urlStrategy: urlStrategy,
							fbAppId: fbAppId,
						};
						try {
							console.log("[MiddleSdkEventService.initSdkAdjust] params =>", JSON.stringify(adjustParams));
						} catch (e) {
							console.log("[MiddleSdkEventService.initSdkAdjust] params(raw) =>", adjustParams);
						}
						PlatformBridge.getNativeBridge().initSdkAdjust(adjustKey, urlStrategy, fbAppId);
					}
					if (isInitFirebase === true) {
						PlatformBridge.getNativeBridge().reportFirebase(isInitFirebase + "");
					}
					if (Array.isArray(newCallbackEvents) && newCallbackEvents.length > 0) {
						newCallbackEvents.forEach((eventName: string) => {
							const token: string = this.findEventToken(eventName, newCallbackEventsToken);
							const params: any = this.findEventParams(eventName, newCallbackEventsParams);
							const bridge: any = PlatformBridge.getNativeBridge();
							if (bridge && typeof bridge.reportEventByAdjust === "function") {
								bridge.reportEventByAdjust(eventName, token, params);
							}
						});
					}
					this.reportBehaviorConfigEvent(data, 1, isFirst);
				} catch (e) {
					this.reportBehaviorConfigEvent(e, -1, isFirst);
				}
			}),
			MiddleHandler.create(this, (err: any) => {
				this.reportBehaviorConfigEvent(err, -1, isFirst);
			})
		);
	}

	public getEventRequestIsFirstFlag(): boolean {
		let isFirst: boolean = false;
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

	public findEventToken(eventName: string, tokenList: any): string {
		if (!Array.isArray(tokenList) || tokenList.length <= 0) return "";
		for (let i = 0; i < tokenList.length; i++) {
			const item: any = tokenList[i];
			if (item) {
				const token: any = item[eventName];
				if (token) return token;
			}
		}
		return "";
	}

	public findEventParams(eventName: string, paramList: any): any {
		if (!Array.isArray(paramList) || paramList.length <= 0) return null;
		for (let i = 0; i < paramList.length; i++) {
			const item: any = paramList[i];
			if (item) {
				const params: any = item[eventName];
				if (params !== undefined) return params;
			}
		}
		return null;
	}

	public reportBehaviorConfigEvent(valueOrError: any, status: number, isFirst: boolean = false): void {
		const data: any = {
			behavior_config_value: valueOrError,
			behavior_config_status: status,
			behavior_first_req: isFirst,
			redirect_type: "0",
		};
		BusinessAnalyticsService.reportData("behavior_config", data);
	}
}