import BusinessAnalyticsService from "./BusinessAnalyticsService";
import ClientDataStore from "./ClientDataStore";
import GameConfigStore from "./GameConfigStore";
import Handler from "./Handler";
import LanguageHelper from "./LanguageHelper";
import LanguageService from "./LanguageService";
import LoadingHttpService from "./LoadingHttpService";
import MiddleHelper from "./MiddleHelper";
import MiddleManager from "./MiddleManager";
import NetErrorPopupService from "./NetErrorPopupService";
import PlatformBridge from "./PlatformBridge";
import PlayerDataStore from "./PlayerDataStore";
import SystemDataStore from "./SystemDataStore";
import UserInfoService from "./UserInfoService";

function safeStringify(value: any): string {
    try {
        return JSON.stringify(value);
    } catch (err) {
        return String(value);
    }
}

function describeError(value: any): any {
    const detail: any = {
        type: Object.prototype.toString.call(value),
        asString: String(value),
        name: "",
        message: "",
        stack: "",
        keys: [],
        rawJson: ""
    };
    if (value && typeof value === "object") {
        try {
            detail.name = value.name || "";
        } catch (err) { }
        try {
            detail.message = value.message || "";
        } catch (err) { }
        try {
            detail.stack = value.stack || "";
        } catch (err) { }
        try {
            detail.keys = Object.keys(value);
        } catch (err) { }
        try {
            detail.rawJson = safeStringify(value);
        } catch (err) { }
    }
    return detail;
}

function logBridgeError(prefix: string, err: any): void {
    const detail = describeError(err);
    console.error(prefix, "summary =>", detail.asString);
    console.error(prefix, "detail =>", safeStringify(detail));
    console.error(prefix, "raw =>", err);
}

export function initProjectLoadingAdapters(): void {
    try {
        const loadingProjectAdapters = require("./loading-project-adapters");
        if (loadingProjectAdapters && loadingProjectAdapters.initProjectLoadingAdapters) {
            loadingProjectAdapters.initProjectLoadingAdapters();
        }
    } catch (err) {
        logBridgeError("[LoadingProjectAdaptersBridge] init failed", err);
    }
}

export function initSystem(): void {
    try {
        if (PlatformBridge && ClientDataStore) {
            const clientInfo = PlatformBridge.getClientInfo();
            console.log("[LoadingProjectAdaptersBridge] initSystem clientInfo type=", Object.prototype.toString.call(clientInfo));
            ClientDataStore.init(clientInfo);
        }
        if (PlayerDataStore) {
            let yid = "";
            try {
                yid = cc.sys.localStorage.getItem("yid") || "";
            } catch (err) { }
            if ("yid_read_fail" === yid || "yid_read_failed"=== yid) { yid ="";
            }
            PlayerDataStore.initUserId({
                yid: yid
            });
        }
    } catch (err) {
        logBridgeError("[LoadingProjectAdaptersBridge] initSystem failed", err);
    }
}

export function runMiddleCountry(onEnter: () => void, onBan: () => void, onBackstop: (err?: any) => void, onShowUmp: (callback: (accepted: boolean) => void) => void): void {
    const logPrefix = "[LoadingProjectAdaptersBridge.runMiddleCountry]";
    const cacheKeyCountry = "MB_CACHE_ATTR_COUNTRY";
    const cacheKeyCountryUpdatedAt = "MB_CACHE_ATTR_COUNTRY_UPDATE_AT";
    const umpHandledPrefix = "MB_CACHE_UMP_HANDLED_";

    function normalizeCountry(country: string): string {
        if (!country) {
            return "";
        }
        const upper = String(country).toUpperCase();
        return "GB" === upper ? "UK": upper; } function persistCountry(country: string): string { const normalized = normalizeCountry(country); if (!normalized) { return"";
        }
        try {
            cc.sys.localStorage.setItem(cacheKeyCountry, normalized);
            cc.sys.localStorage.setItem(cacheKeyCountryUpdatedAt, String(Date.now()));
        } catch (err) {
            console.warn(logPrefix, "persistCountry fail", err);
        }
        return normalized;
    }

    function applyCountryToClient(clientData: any, country: string): string {
        const normalized = normalizeCountry(country);
        if (!normalized) {
            return "";
        }
        if (!clientData) {
            return normalized;
        }
        try {
            clientData.local_country = normalized;
        } catch (err) {
            logBridgeError(logPrefix + " applyCountryToClient set local_country failed", err);
        }
        try {
            if (typeof clientData.buildCommonUrlStr === "function") {
                clientData.buildCommonUrlStr();
            }
        } catch (err) {
            logBridgeError(logPrefix + " applyCountryToClient buildCommonUrlStr failed", err);
        }
        try {
            if (typeof clientData.buildMiddleCommonUrlStr === "function") {
                clientData.buildMiddleCommonUrlStr();
            }
        } catch (err) {
            logBridgeError(logPrefix + " applyCountryToClient buildMiddleCommonUrlStr failed", err);
        }
        return normalized;
    }

    function getUmpHandledKey(clientData: any): string {
        let boxPkgName = "";
        try {
            boxPkgName = clientData && clientData.box_pkg_name ? String(clientData.box_pkg_name) : "";
        } catch (err) { }
        return umpHandledPrefix + (boxPkgName || "default");
    }

    function hasHandledUmp(clientData: any): boolean {
        try {
            return "1"=== cc.sys.localStorage.getItem(getUmpHandledKey(clientData)); } catch (err) { console.warn(logPrefix,"hasHandledUmp read fail", err);
            return false;
        }
    }

    function markUmpHandled(clientData: any): void {
        try {
            cc.sys.localStorage.setItem(getUmpHandledKey(clientData), "1");
        } catch (err) {
            console.warn(logPrefix, "markUmpHandled write fail", err);
        }
    }

    try {
        let callbackLocked = false;
        let umpShowing = false;
        const callbacks: any = {
            enter: onEnter,
            ban: onBan,
            backstop: onBackstop
        };

        const resolveCountry = () => {
            let country = cachedCountry || fallbackCountry;
            country = persistCountry(country) || country;
            if (clientDataStore && country) {
                applyCountryToClient(clientDataStore, country);
            }
            if (middleHelper && typeof middleHelper.saveLocalCountry === "function"&& country) { middleHelper.saveLocalCountry(country); } return country; }; const dispatchCallback = (eventName: string, payload?: any) => { if (callbackLocked) { console.warn(logPrefix,"重复 " + eventName + " 回调，忽略。");
            } else if (umpShowing) {
                console.warn(logPrefix, "UMP 仍在展示，忽略 " + eventName + " 回调。");
            } else {
                callbackLocked = true;
                if ("enter"=== eventName) { try { const middleManager = MiddleManager && typeof MiddleManager.getInstance ==="function"? MiddleManager.getInstance() : null; if (middleManager && typeof middleManager.middleTFRegional ==="function") {
                            console.log(logPrefix, "middleTFRegional start");
                            middleManager.middleTFRegional();
                        }
                        if (middleManager && typeof middleManager.autoUploadEvent === "function") {
                            console.log(logPrefix, "autoUploadEvent start");
                            middleManager.autoUploadEvent("default-timer");
                        }
                    } catch (err) {
                        logBridgeError(logPrefix + " middleTFRegional failed", err);
                    }
                }
                const callback = callbacks[eventName];
                if (callback) {
                    callback(payload);
                }
            }
        };

        console.log("runMiddleCountry");
        const middleHelper = MiddleHelper;
        const clientDataStore = ClientDataStore;
        const analytics = BusinessAnalyticsService;
        console.log(logPrefix, "module loaded", {
            hasMiddleHelper: !!middleHelper,
            hasMiddleHelperDefault: !!middleHelper,
            hasClientDataStore: !!clientDataStore,
            hasClientDataStoreDefault: !!clientDataStore,
            hasBusinessAnalyticsService: !!analytics,
            hasBusinessAnalyticsServiceDefault: !!analytics
        });

        const readCachedCountry = (): string => {
            try {
                return normalizeCountry(cc.sys.localStorage.getItem(cacheKeyCountry));
            } catch (err) {
                console.warn(logPrefix, "readCachedCountry fail", err);
                return "";
            }
        };

        let cachedCountry = readCachedCountry();
        if (clientDataStore) {
            const applied = applyCountryToClient(clientDataStore, cachedCountry);
            if (applied) {
                console.log(logPrefix, "启动应用归因缓存 local_country =", applied);
            }
        }

        let fallbackCountry = "";
        if (clientDataStore && clientDataStore.local_country) {
            fallbackCountry = normalizeCountry(clientDataStore.local_country);
        }
        if (!fallbackCountry) {
            const languageMap: { [key: string]: string } = {
                zh: "CN", en: "US", id: "ID", pt: "BR", ru: "RU", de: "DE", fr: "FR", es: "MX", hi: "IN", th: "TH", ja: "JP", ko: "KR", fil: "PH", tl: "PH"
            };
            fallbackCountry = languageMap[String(cc.sys.language || "").toLowerCase()] || "IN";
        }

        if (middleHelper) {
            console.log(logPrefix, "helper state", {
                hasMiddleCountry: !!(middleHelper && typeof middleHelper.middleCountry === "function"),
                hasLocalCountry: !!(middleHelper && typeof middleHelper.localCountry === "function"),
                hasSaveLocalCountry: !!(middleHelper && typeof middleHelper.saveLocalCountry === "function")
            });
            if (!middleHelper || typeof middleHelper.middleCountry !== "function") {
                throw new Error("middleHelper.middleCountry is not a function");
            }
            middleHelper.middleCountry((result: any) => {
                let country = "";
                if (typeof middleHelper.localCountry === "function") {
                    country = normalizeCountry(middleHelper.localCountry());
                }
                if (!country && clientDataStore) {
                    country = normalizeCountry(clientDataStore.local_country);
                }
                country = persistCountry(country) || country;
                if (clientDataStore && country) {
                    applyCountryToClient(clientDataStore, country);
                }
                console.log(logPrefix, "归因成功，更新缓存 country =", country || "N/A");
                const needShowUmp = !!(result && result.is_ump === true && result.is_ump_country === true);
                const alreadyHandledUmp = hasHandledUmp(clientDataStore);
                console.log(logPrefix, "UMP判定 needShowUmp =", needShowUmp, "alreadyHandledUmp =", alreadyHandledUmp);
                if (needShowUmp && alreadyHandledUmp) {
                    dispatchCallback("enter", result);
                } else if (needShowUmp && onShowUmp) {
                    analytics && analytics.reportData && analytics.reportData("page_loading_show_ump");
                    umpShowing = true;
                    try {
                        let umpCallbackHandled = false;
                        onShowUmp((accepted: boolean) => {
                            if (umpCallbackHandled) {
                                console.warn(logPrefix, "UMP 回调重复触发，忽略。");
                            } else {
                                umpCallbackHandled = true;
                                umpShowing = false;
                                markUmpHandled(clientDataStore);
                                accepted ? dispatchCallback("enter", result) : dispatchCallback("backstop", {
                                    reason: "ump_reject"
                                });
                            }
                        });
                    } catch (err) {
                        umpShowing = false;
                        dispatchCallback("backstop", err);
                    }
                } else {
                    dispatchCallback("enter", result);
                }
            }, (err: any) => {
                dispatchCallback("ban", err);
            }, (err: any) => {
                const country = resolveCountry();
                console.warn(logPrefix, "归因失败，使用默认国家 country =", country || "IN");
                dispatchCallback("backstop", err);
            });
        } else {
            if (clientDataStore) {
                const country = resolveCountry();
                console.warn(logPrefix, "middleHelper 不可用，使用默认国家 country =", country || "IN");
            }
            dispatchCallback("backstop");
        }
    } catch (err) {
        logBridgeError("[LoadingProjectAdaptersBridge] runMiddleCountry failed", err);
        try {
            onBackstop && onBackstop(err);
        } catch (innerErr) {
            logBridgeError("[LoadingProjectAdaptersBridge] runMiddleCountry onBackstop failed", innerErr);
        }
    }
}

export function runBaseFlow(onComplete: () => void, onError?: (err: any) => void, onStep?: (step: string) => void): void {
    const logPrefix = "[LoadingProjectAdaptersBridge.runBaseFlow]";
    const reportStep = typeof onStep === "function"? onStep : () => { }; try { const setCache = (key: string, value: any): void => { if (value != null) { try { cc.sys.localStorage.setItem(key, JSON.stringify(value)); } catch (err) { console.warn(logPrefix,"setCache fail", key, err);
                }
            }
        };

        const getCache = (key: string): any => {
            try {
                const cached = cc.sys.localStorage.getItem(key);
                return cached ? JSON.parse(cached) : null;
            } catch (err) {
                console.warn(logPrefix, "getCache fail", key, err);
                return null;
            }
        };

        const warnAndComplete = (message: string, err?: any): void => {
            err ? console.warn(logPrefix, message, err) : console.warn(logPrefix, message);
            onComplete && onComplete();
        };

        const analytics = BusinessAnalyticsService;
        const httpService = LoadingHttpService;
        const handler = Handler;
        const netErrorPopup = NetErrorPopupService;

        const report = (event: string, data?: any): void => {
            try {
                if (analytics && typeof analytics.reportData === "function") {
                    analytics.reportData(event, data || {});
                }
            } catch (err) {
                console.warn(logPrefix, "report fail", event, err);
            }
        };

        httpService.init((message: any, retry: () => void) => {
            console.warn(logPrefix, "HTTP 请求失败，自动重试", message);
            retry && retry();
        });

        const CACHE_KEYS = {
            SYSTEM_CONFIG: "MB_CACHE_SYSTEM_CONFIG",
            LOGIN_USER_ID: "MB_CACHE_LOGIN_USER_ID",
            GAME_CONFIG: "MB_CACHE_GAME_CONFIG",
            USER_INFO: "MB_CACHE_USER_INFO"
        };

        const getUserInfo = (): void => {
            console.log(logPrefix, "getUserInfo");
            report("page_loading_getUserInfo");
            httpService.getUserInfo(handler.create(null, (response: any) => {
                report("page_loading_getUserInfo_code", {
                    code: response && response.code
                });
                if (netErrorPopup && netErrorPopup.shouldPop(response)) {
                    console.warn(logPrefix, "getUserInfo force-retry code=", response && response.code);
                    netErrorPopup.showAndRetry(getUserInfo);
                } else {
                    console.log(logPrefix, "getUserInfo success", JSON.stringify(response));
                    PlayerDataStore.init(response.data);
                    setCache(CACHE_KEYS.USER_INFO, response.data);
                    try {
                        UserInfoService.getInstance()._applyToUserData(response.data);
                    } catch (err) {
                        console.warn(logPrefix, "UserData 同步失败", err);
                    }
                    reportStep("userInfo");
                    console.log(logPrefix, "登录流程完成，进入游戏");
                    onComplete && onComplete();
                }
            }), handler.create(null, (err: any) => {
                console.error(logPrefix, "getUserInfo fail", err);
                const cached = getCache(CACHE_KEYS.USER_INFO);
                if (cached) {
                    console.warn(logPrefix, "getUserInfo 使用缓存");
                    PlayerDataStore.init(cached);
                    reportStep("userInfo");
                    onComplete && onComplete();
                } else if (netErrorPopup && netErrorPopup.shouldPop(err)) {
                    console.warn(logPrefix, "getUserInfo 无缓存 + 网络异常，弹重试窗");
                    netErrorPopup.showAndRetry(getUserInfo);
                } else {
                    reportStep("userInfo");
                    warnAndComplete("getUserInfo 无缓存，兜底进入游戏", err);
                }
            }));
        };

        const getGameConfig = (): void => {
            console.log(logPrefix, "getGameConfig");
            report("page_loading_getGameConfig");
            httpService.getGameConfig(handler.create(null, (response: any) => {
                report("page_loading_getGameConfig_res", {
                    code: response && response.code
                });
                if (netErrorPopup && netErrorPopup.shouldPop(response)) {
                    console.warn(logPrefix, "getGameConfig force-retry code =", response && response.code);
                    netErrorPopup.showAndRetry(getGameConfig);
                } else {
                    console.log(logPrefix, "getGameConfig success", JSON.stringify(response));
                    GameConfigStore.init(response.data);
                    setCache(CACHE_KEYS.GAME_CONFIG, response.data);
                    reportStep("gameConfig");
                    getUserInfo();
                }
            }), handler.create(null, (err: any) => {
                console.error(logPrefix, "getGameConfig fail", err);
                const cached = getCache(CACHE_KEYS.GAME_CONFIG);
                if (cached) {
                    console.warn(logPrefix, "getGameConfig 使用缓存");
                    GameConfigStore.init(cached);
                    reportStep("gameConfig");
                    getUserInfo();
                } else if (netErrorPopup && netErrorPopup.shouldPop(err)) {
                    console.warn(logPrefix, "getGameConfig 无缓存 + 网络异常，弹重试窗");
                    netErrorPopup.showAndRetry(getGameConfig);
                } else {
                    console.warn(logPrefix, "getGameConfig 无缓存，继续 getUserInfo");
                    reportStep("gameConfig");
                    getUserInfo();
                }
            }));
        };

        const touristsLogin = (): void => {
            console.log(logPrefix, "touristsLogin");
            report("page_loading_touristsLogin");
            httpService.touristsLogin(null, handler.create(null, (response: any) => {
                report("page_loading_touristsLogin_res", response);
                if (netErrorPopup && netErrorPopup.shouldPop(response)) {
                    console.warn(logPrefix, "touristsLogin force-retry code =", response && response.code);
                    netErrorPopup.showAndRetry(touristsLogin);
                } else {
                    console.log(logPrefix, "touristsLogin success", JSON.stringify(response));
                    report("register_success", {
                        login_type: "tourists"
                    });
                    PlayerDataStore.initUserId(response.data);
                    setCache(CACHE_KEYS.LOGIN_USER_ID, response.data);
                    reportStep("login");
                    getSystemConfig();
                }
            }), handler.create(null, (err: any) => {
                let errJson = "";
                try {
                    errJson = JSON.stringify(err);
                } catch (stringifyErr) {
                    errJson = String(err);
                }
                console.error(logPrefix, "touristsLogin fail json=", errJson);
                const cached = getCache(CACHE_KEYS.LOGIN_USER_ID);
                if (cached && cached.yid) {
                    console.warn(logPrefix, "touristsLogin 使用缓存登录态");
                    PlayerDataStore.initUserId(cached);
                    reportStep("login");
                    getSystemConfig();
                } else if (netErrorPopup && netErrorPopup.shouldPop(err)) {
                    console.warn(logPrefix, "touristsLogin 无缓存 + 网络异常，弹重试窗");
                    netErrorPopup.showAndRetry(touristsLogin);
                } else {
                    report("register_fail", {
                        login_type: "tourists",
                        err_code: err && err.code !== undefined ? err.code : "",
                        err_msg: err && err.message ? err.message : ""
                    });
                    console.warn(logPrefix, "touristsLogin 无缓存登录态，继续拉配置");
                    reportStep("login");
                    getSystemConfig();
                }
            }));
        };

        const getSystemConfig = (): void => {
            console.log(logPrefix, "getSystemConfig");
            report("page_loading_getSystemConfig");
            httpService.getSystemConfig(handler.create(null, (response: any) => {
                report("page_loading_getSystemConfig_res", {
                    code: response && response.code
                });
                if (netErrorPopup && netErrorPopup.shouldPop(response)) {
                    console.warn(logPrefix, "getSystemConfig force-retry code =", response && response.code);
                    netErrorPopup.showAndRetry(getSystemConfig);
                } else {
                    console.log(logPrefix, "getSystemConfig success", JSON.stringify(response));
                    SystemDataStore.init_config(response.data);
                    setCache(CACHE_KEYS.SYSTEM_CONFIG, response.data);
                    try {
                        LanguageHelper.setType(ClientDataStore.local_country);
                        LanguageService.setByCountryCode(ClientDataStore.local_country);
                    } catch (err) {
                        console.error(logPrefix, "LanguageHelper.setType fail(continue)", err);
                    }
                    reportStep("systemConfig");
                    getGameConfig();
                }
            }), handler.create(null, (err: any) => {
                console.error(logPrefix, "getSystemConfig fail", err);
                const cached = getCache(CACHE_KEYS.SYSTEM_CONFIG);
                if (cached) {
                    console.warn(logPrefix, "getSystemConfig 使用缓存");
                    SystemDataStore.init_config(cached);
                    try {
                        LanguageHelper.setType(ClientDataStore.local_country);
                        LanguageService.setByCountryCode(ClientDataStore.local_country);
                    } catch (innerErr) {
                        console.error(logPrefix, "LanguageHelper.setType fail(continue)", innerErr);
                    }
                    reportStep("systemConfig");
                    getGameConfig();
                } else {
                    console.warn(logPrefix, "getSystemConfig 无缓存，继续 autoLogin");
                    try {
                        LanguageHelper.setType(ClientDataStore.local_country);
                        LanguageService.setByCountryCode(ClientDataStore.local_country);
                    } catch (innerErr) {
                        console.error(logPrefix, "LanguageHelper.setType fail(continue)", innerErr);
                    }
                    reportStep("systemConfig");
                    getGameConfig();
                }
            }));
        };

        (function autoLoginFlow() {
            console.log(logPrefix, "autoLogin");
            report("page_loading_autoLogin_start");
            report("autoLogin_start", {
                timeStemp: Date.now()
            });
            httpService.autoLogin(null, handler.create(null, (response: any) => {
                report("autoLogin_end", {
                    timeStemp: Date.now()
                });
                if (netErrorPopup && netErrorPopup.shouldPop(response)) {
                    console.warn(logPrefix, "autoLogin force-retry code =", response && response.code);
                    netErrorPopup.showAndRetry(autoLoginFlow);
                } else {
                    let responseJson = "";
                    try {
                        responseJson = JSON.stringify(response);
                    } catch (err) {
                        responseJson = "[json stringify failed]";
                    }
                    console.log(logPrefix, "autoLogin success yid=", response && response.data && response.data.yid, "res_json=", responseJson);
                    if (response && response.data && response.data.yid) {
                        report("page_loading_autoLogin_success");
                        report("register_success", {
                            login_type: "auto"
                        });
                        PlayerDataStore.initUserId(response.data);
                        setCache(CACHE_KEYS.LOGIN_USER_ID, response.data);
                        reportStep("login");
                        getSystemConfig();
                    } else {
                        report("u_login_page_show");
                        touristsLogin();
                    }
                }
            }), handler.create(null, (err: any) => {
                report("autoLogin_end", {
                    timeStemp: Date.now()
                });
                console.error(logPrefix, "autoLogin fail", err);
                touristsLogin();
            }));
        })();
    } catch (err) {
        logBridgeError(logPrefix + " runBaseFlow 初始化失败", err);
        onError ? onError(err) : onComplete && onComplete();
    }
}
