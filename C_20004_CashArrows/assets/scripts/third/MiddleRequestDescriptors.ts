import * as MiddleProjectAdapterConfig from "./MiddleProjectAdapterConfig";

export const MIDDLE_REQUEST_DESCRIPTORS = {
	Regional: {
		url: MiddleProjectAdapterConfig.MIDDLE_PROJECT_ADAPTER_CONFIG.urls.regional
	},
	event: {
		url: MiddleProjectAdapterConfig.MIDDLE_PROJECT_ADAPTER_CONFIG.urls.tfSDK
	},
	ADSDK: {
		url: MiddleProjectAdapterConfig.MIDDLE_PROJECT_ADAPTER_CONFIG.urls.adsdk
	},
	COREDATA: {
		url: MiddleProjectAdapterConfig.MIDDLE_PROJECT_ADAPTER_CONFIG.urls.coredata
	},
	APPLOG: {
		url: MiddleProjectAdapterConfig.MIDDLE_PROJECT_ADAPTER_CONFIG.urls.applog
	},
	TFRegional: {
		url: MiddleProjectAdapterConfig.MIDDLE_PROJECT_ADAPTER_CONFIG.urls.tfRefer
	},
	Platform: {
		url: MiddleProjectAdapterConfig.MIDDLE_PROJECT_ADAPTER_CONFIG.urls.platform
	},
	BindWithdrawal: {
		url: MiddleProjectAdapterConfig.MIDDLE_PROJECT_ADAPTER_CONFIG.urls.checkWithdraw
	},
	AdConfig: {
		url: MiddleProjectAdapterConfig.MIDDLE_PROJECT_ADAPTER_CONFIG.urls.adConfig
	}
};