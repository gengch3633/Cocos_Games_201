import { MIDDLE_PROJECT_ADAPTER_CONFIG } from "./MiddleProjectAdapterConfig";

export const BUSINESS_COMMON_CONFIG = {
    gameName: MIDDLE_PROJECT_ADAPTER_CONFIG.gameName,
    baseVersion: "1.0.0.7",
    releasePkgName: MIDDLE_PROJECT_ADAPTER_CONFIG.releasePkgName,
    releaseModel: MIDDLE_PROJECT_ADAPTER_CONFIG.releaseModel,
    serverDomainPrefix: "https://hxjxd.casharrows.com/",
    cdnUrl: "https://mph.casharrows.com/",
    feishuWebhookUrl: "https://open.feishu.cn/open-apis/bot/v2/hook/3821745e-8d63-4117-8963-aef35ccb8cc3",
    defaultLanguage: "ID",
    toastPrefabPath: "BPR_prefabs/BPR_ManageToast",
    loadingTasks: [
        {
            path: "BPR_prefabs/BPR_MainUi",
            count: 1,
        },
    ],
    preloadTextureDirs: ["pictures/blacks", "pictures/block_reward"],
    permanentLogoutKeyword: "该用户已被永久注销",
    countryPathMap: {
        US: "us",
        ID: "id",
        BR: "br",
        UK: "uk",
        AU: "au",
        CA: "ca",
        FR: "fr",
        DE: "de",
        MX: "mx",
        PH: "ph",
        RU: "ru",
        IN: "in",
        TH: "th",
    },
};
