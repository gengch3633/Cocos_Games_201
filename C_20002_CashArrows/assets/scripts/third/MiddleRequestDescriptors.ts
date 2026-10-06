import { MIDDLE_PROJECT_ADAPTER_CONFIG } from "./MiddleProjectAdapterConfig";

export const MIDDLE_REQUEST_DESCRIPTORS = {
    Regional: {
        url: MIDDLE_PROJECT_ADAPTER_CONFIG.urls.regional,
    },
    event: {
        url: MIDDLE_PROJECT_ADAPTER_CONFIG.urls.tfSDK,
    },
    ADSDK: {
        url: MIDDLE_PROJECT_ADAPTER_CONFIG.urls.adsdk,
    },
    COREDATA: {
        url: MIDDLE_PROJECT_ADAPTER_CONFIG.urls.coredata,
    },
    APPLOG: {
        url: MIDDLE_PROJECT_ADAPTER_CONFIG.urls.applog,
    },
    TFRegional: {
        url: MIDDLE_PROJECT_ADAPTER_CONFIG.urls.tfRefer,
    },
    Platform: {
        url: MIDDLE_PROJECT_ADAPTER_CONFIG.urls.platform,
    },
    BindWithdrawal: {
        url: MIDDLE_PROJECT_ADAPTER_CONFIG.urls.checkWithdraw,
    },
    AdConfig: {
        url: MIDDLE_PROJECT_ADAPTER_CONFIG.urls.adConfig,
    },
};
