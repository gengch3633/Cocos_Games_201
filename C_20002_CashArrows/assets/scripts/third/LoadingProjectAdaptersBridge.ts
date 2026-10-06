function stringifySafe(value: any) {
    try {
        return JSON.stringify(value);
    } catch (t) {
        return String(value);
    }
}

function summarizeError(prefix: string, err: any) {
    const summary: any = {
        type: Object.prototype.toString.call(err),
        asString: String(err),
        name: "",
        message: "",
        stack: "",
        keys: [],
        rawJson: ""
    };
    if (err && "object" == typeof err) {
        try {
            summary.name = err.name || "";
        } catch (e) { }
        try {
            summary.message = err.message || "";
        } catch (e) { }
        try {
            summary.stack = err.stack || "";
        } catch (e) { }
        try {
            summary.keys = Object.keys(err);
        } catch (e) { }
        try {
            summary.rawJson = stringifySafe(err);
        } catch (e) { }
    }
    console.error(prefix, "summary =>", summary.asString);
    console.error(prefix, "detail =>", stringifySafe(summary));
    console.error(prefix, "raw =>", err);
}

export function initProjectLoadingAdapters() {
    try {
        const adapters = require("loading-project-adapters.js");
        adapters && adapters.initProjectLoadingAdapters && adapters.initProjectLoadingAdapters();
    } catch (e) {
        summarizeError("[LoadingProjectAdaptersBridge] init failed", e);
    }
}

export function initSystem() {
    try {
        const PlatformBridge = require("PlatformBridge.js");
        const ClientDataStore = require("ClientDataStore.js");
        const PlayerDataStore = require("PlayerDataStore.js");
        if (PlatformBridge && PlatformBridge.default && ClientDataStore && ClientDataStore.default) {
            const clientInfo = PlatformBridge.default.getClientInfo();
            console.log("[LoadingProjectAdaptersBridge] initSystem clientInfo type=", Object.prototype.toString.call(clientInfo));
            ClientDataStore.default.init(clientInfo);
        }
        if (PlayerDataStore && PlayerDataStore.default) {
            let yid = "";
            try {
                yid = cc.sys.localStorage.getItem("yid") || "";
            } catch (e) { }
            "yid_read_fail" !== yid && "yid_read_failed" !== yid || (yid = "");
            PlayerDataStore.default.initUserId({
                yid: yid
            });
        }
    } catch (e) {
        summarizeError("[LoadingProjectAdaptersBridge] initSystem failed", e);
    }
}

export function runMiddleCountry(onEnter: any, onBan: any, onBackstop: any, onShowUmp: any) {
    let middleHelperModule: any;
    let MiddleManager: any;
    let clientStore: any;
    let analytics: any;
    let cachedCountry: string;
    let fallbackCountry: string;
    const logPrefix = "[LoadingProjectAdaptersBridge.runMiddleCountry]";
    const CACHE_KEY_COUNTRY = "MB_CACHE_ATTR_COUNTRY";
    const CACHE_KEY_COUNTRY_UPDATE_AT = "MB_CACHE_ATTR_COUNTRY_UPDATE_AT";
    const UMP_HANDLED_PREFIX = "MB_CACHE_UMP_HANDLED_";

    function normalizeCountry(code: any) {
        if (!code) return "";
        const upper = String(code).toUpperCase();
        return "GB" === upper ? "UK" : upper;
    }

    function persistCountry(code: any) {
        const normalized = normalizeCountry(code);
        if (!normalized) return "";
        try {
            cc.sys.localStorage.setItem(CACHE_KEY_COUNTRY, normalized);
            cc.sys.localStorage.setItem(CACHE_KEY_COUNTRY_UPDATE_AT, String(Date.now()));
        } catch (e) {
            console.warn(logPrefix, "persistCountry fail", e);
        }
        return normalized;
    }

    function applyCountryToClient(clientStore: any, code: any) {
        const normalized = normalizeCountry(code);
        if (!normalized) return "";
        if (!clientStore) return normalized;
        try {
            clientStore.local_country = normalized;
        } catch (e) {
            summarizeError(logPrefix + " applyCountryToClient set local_country failed", e);
        }
        try {
            "function" == typeof clientStore.buildCommonUrlStr && clientStore.buildCommonUrlStr();
        } catch (e) {
            summarizeError(logPrefix + " applyCountryToClient buildCommonUrlStr failed", e);
        }
        try {
            "function" == typeof clientStore.buildMiddleCommonUrlStr && clientStore.buildMiddleCommonUrlStr();
        } catch (e) {
            summarizeError(logPrefix + " applyCountryToClient buildMiddleCommonUrlStr failed", e);
        }
        return normalized;
    }

    function buildUmpHandledKey(clientStore: any) {
        let pkg = "";
        try {
            pkg = clientStore && clientStore.box_pkg_name ? String(clientStore.box_pkg_name) : "";
        } catch (e) { }
        return UMP_HANDLED_PREFIX + (pkg || "default");
    }

    function hasHandledUmp(clientStore: any) {
        try {
            return "1" === cc.sys.localStorage.getItem(buildUmpHandledKey(clientStore));
        } catch (e) {
            console.warn(logPrefix, "hasHandledUmp read fail", e);
            return false;
        }
    }

    function markUmpHandled(clientStore: any) {
        try {
            cc.sys.localStorage.setItem(buildUmpHandledKey(clientStore), "1");
        } catch (e) {
            console.warn(logPrefix, "markUmpHandled write fail", e);
        }
    }

    try {
        let callbackLocked = false;
        let umpShowing = false;
        const callbacks = {
            enter: onEnter,
            ban: onBan,
            backstop: onBackstop
        };

        function dispatchCallback(type: string, payload?: any) {
            if (callbackLocked) console.warn(logPrefix, "重复 " + type + " 回调，忽略。");
            else if (umpShowing) console.warn(logPrefix, "UMP 仍在展示，忽略 " + type + " 回调。");
            else {
                callbackLocked = true;
                if ("enter" === type) {
                    try {
                        const middleManager = MiddleManager && MiddleManager.default && "function" == typeof MiddleManager.default.getInstance ? MiddleManager.default.getInstance() : null;
                        if (middleManager && "function" == typeof middleManager.middleTFRegional) {
                            console.log(logPrefix, "middleTFRegional start");
                            middleManager.middleTFRegional();
                        }
                        if (middleManager && "function" == typeof middleManager.autoUploadEvent) {
                            console.log(logPrefix, "autoUploadEvent start");
                            middleManager.autoUploadEvent("default-timer");
                        }
                    } catch (e) {
                        summarizeError(logPrefix + " middleTFRegional failed", e);
                    }
                }
                const handler = callbacks[type];
                handler && handler(payload);
            }
        }

        function resolveDefaultCountry() {
            let country = cachedCountry || fallbackCountry;
            country = persistCountry(country) || country;
            clientStore && country && applyCountryToClient(clientStore, country);
            middleHelperModule && middleHelperModule.default && "function" == typeof middleHelperModule.default.saveLocalCountry && country && middleHelperModule.default.saveLocalCountry(country);
            return country;
        }

        console.log("runMiddleCountry");
        middleHelperModule = require("MiddleHelper.js");
        MiddleManager = require("MiddleManager.js");
        const ClientDataStoreModule = require("ClientDataStore.js");
        const BusinessAnalyticsServiceModule = require("BusinessAnalyticsService.js");
        console.log(logPrefix, "module loaded", {
            hasMiddleHelper: !!middleHelperModule,
            hasMiddleHelperDefault: !(!middleHelperModule || !middleHelperModule.default),
            hasClientDataStore: !!ClientDataStoreModule,
            hasClientDataStoreDefault: !(!ClientDataStoreModule || !ClientDataStoreModule.default),
            hasBusinessAnalyticsService: !!BusinessAnalyticsServiceModule,
            hasBusinessAnalyticsServiceDefault: !(!BusinessAnalyticsServiceModule || !BusinessAnalyticsServiceModule.default)
        });
        clientStore = ClientDataStoreModule && ClientDataStoreModule.default ? ClientDataStoreModule.default : null;
        analytics = BusinessAnalyticsServiceModule && BusinessAnalyticsServiceModule.default ? BusinessAnalyticsServiceModule.default : null;
        cachedCountry = (function () {
            try {
                return normalizeCountry(cc.sys.localStorage.getItem(CACHE_KEY_COUNTRY));
            } catch (e) {
                console.warn(logPrefix, "readCachedCountry fail", e);
                return "";
            }
        })();
        if (clientStore) {
            const applied = applyCountryToClient(clientStore, cachedCountry);
            applied && console.log(logPrefix, "启动应用归因缓存 local_country =", applied);
        }
        fallbackCountry = "";
        clientStore && clientStore.local_country && (fallbackCountry = normalizeCountry(clientStore.local_country));
        fallbackCountry || (fallbackCountry = ({
            zh: "CN", en: "US", id: "ID", pt: "BR", ru: "RU", de: "DE", fr: "FR", es: "MX", hi: "IN", th: "TH", ja: "JP", ko: "KR", fil: "PH", tl: "PH"
        }[String(cc.sys.language || "").toLowerCase()] || "IN"));

        if (middleHelperModule && middleHelperModule.default) {
            const helper = middleHelperModule.default;
            console.log(logPrefix, "helper state", {
                hasMiddleCountry: !(!helper || "function" != typeof helper.middleCountry),
                hasLocalCountry: !(!helper || "function" != typeof helper.localCountry),
                hasSaveLocalCountry: !(!helper || "function" != typeof helper.saveLocalCountry)
            });
            if (!helper || "function" != typeof helper.middleCountry) throw new Error("middleHelper.middleCountry is not a function");
            helper.middleCountry(function (result) {
                let country = "";
                "function" == typeof helper.localCountry && (country = normalizeCountry(helper.localCountry()));
                !country && clientStore && (country = normalizeCountry(clientStore.local_country));
                country = persistCountry(country) || country;
                clientStore && country && applyCountryToClient(clientStore, country);
                console.log(logPrefix, "归因成功，更新缓存 country =", country || "N/A");
                const needShowUmp = !(!result || true !== result.is_ump || true !== result.is_ump_country);
                const alreadyHandledUmp = hasHandledUmp(clientStore);
                console.log(logPrefix, "UMP判定 needShowUmp =", needShowUmp, "alreadyHandledUmp =", alreadyHandledUmp);
                if (needShowUmp && alreadyHandledUmp) dispatchCallback("enter", result);
                else if (needShowUmp && onShowUmp) {
                    analytics && analytics.reportData && analytics.reportData("page_loading_show_ump");
                    umpShowing = true;
                    try {
                        let umpCallbackUsed = false;
                        onShowUmp(function (accepted) {
                            if (umpCallbackUsed) console.warn(logPrefix, "UMP 回调重复触发，忽略。");
                            else {
                                umpCallbackUsed = true;
                                umpShowing = false;
                                markUmpHandled(clientStore);
                                accepted ? dispatchCallback("enter", result) : dispatchCallback("backstop", {
                                    reason: "ump_reject"
                                });
                            }
                        });
                    } catch (e) {
                        umpShowing = false;
                        dispatchCallback("backstop", e);
                    }
                } else dispatchCallback("enter", result);
            }, function (err) {
                dispatchCallback("ban", err);
            }, function (err) {
                const country = resolveDefaultCountry();
                console.warn(logPrefix, "归因失败，使用默认国家 country =", country || "IN");
                dispatchCallback("backstop", err);
            });
        } else {
            if (clientStore) {
                const country = resolveDefaultCountry();
                console.warn(logPrefix, "middleHelper 不可用，使用默认国家 country =", country || "IN");
            }
            dispatchCallback("backstop");
        }
    } catch (e) {
        summarizeError("[LoadingProjectAdaptersBridge] runMiddleCountry failed", e);
        try {
            onBackstop && onBackstop(e);
        } catch (err) {
            summarizeError("[LoadingProjectAdaptersBridge] runMiddleCountry onBackstop failed", err);
        }
    }
}

export function runBaseFlow(onFail: any, onComplete: any, onStepDone: any) {
    const logPrefix = "[LoadingProjectAdaptersBridge.runBaseFlow]";
    const stepDone = "function" == typeof onStepDone ? onStepDone : function () { };

    try {
        function setCache(key: string, value: any) {
            if (null != value) {
                try {
                    cc.sys.localStorage.setItem(key, JSON.stringify(value));
                } catch (t) {
                    console.warn(logPrefix, "setCache fail", key, t);
                }
            }
        }

        function getCache(key: string) {
            try {
                const raw = cc.sys.localStorage.getItem(key);
                return raw ? JSON.parse(raw) : null;
            } catch (t) {
                console.warn(logPrefix, "getCache fail", key, t);
                return null;
            }
        }

        function warnAndFail(message: string, err?: any) {
            err ? console.warn(logPrefix, message, err) : console.warn(logPrefix, message);
            onFail && onFail();
        }

        const LoadingHttpService = require("LoadingHttpService.js");
        const SystemDataStore = require("SystemDataStore.js");
        const PlayerDataStore = require("PlayerDataStore.js");
        const GameConfigStore = require("GameConfigStore.js");
        const LanguageHelper = require("LanguageHelper.js");
        const LanguageService = require("LanguageService.js");
        const ClientDataStore = require("ClientDataStore.js");
        const Handler = require("Handler.js");
        const NetErrorPopupService = require("NetErrorPopupService.js");
        const BusinessAnalyticsServiceModule = require("BusinessAnalyticsService.js");
        const UserInfoService = require("./UserInfoService");
        const analytics = BusinessAnalyticsServiceModule && (BusinessAnalyticsServiceModule.default || BusinessAnalyticsServiceModule);
        const httpService = LoadingHttpService.default;
        const handlerFactory = Handler.default;
        const netErrorPopup = NetErrorPopupService.default || NetErrorPopupService;

        function report(eventName: string, payload?: any) {
            try {
                analytics && "function" == typeof analytics.reportData && analytics.reportData(eventName, payload || {});
            } catch (t) {
                console.warn(logPrefix, "report fail", eventName, t);
            }
        }

        httpService.init(function (payload: any, retry: any) {
            console.warn(logPrefix, "HTTP 请求失败，自动重试", payload);
            retry && retry();
        });

        const CACHE_KEYS = {
            SYSTEM_CONFIG: "MB_CACHE_SYSTEM_CONFIG",
            LOGIN_USER_ID: "MB_CACHE_LOGIN_USER_ID",
            GAME_CONFIG: "MB_CACHE_GAME_CONFIG",
            USER_INFO: "MB_CACHE_USER_INFO"
        };

        function getUserInfo() {
            console.log(logPrefix, "getUserInfo");
            report("page_loading_getUserInfo");
            httpService.getUserInfo(handlerFactory.create(null, function (response) {
                report("page_loading_getUserInfo_code", {
                    code: response && response.code
                });
                if (netErrorPopup && netErrorPopup.shouldPop(response)) {
                    console.warn(logPrefix, "getUserInfo force-retry code=", response && response.code);
                    netErrorPopup.showAndRetry(getUserInfo);
                } else {
                    console.log(logPrefix, "getUserInfo success", JSON.stringify(response));
                    PlayerDataStore.default.init(response.data);
                    setCache(CACHE_KEYS.USER_INFO, response.data);
                    try {
                        UserInfoService.default.getInstance()._applyToUserData(response.data);
                    } catch (e) {
                        console.warn(logPrefix, " UserData 同步失败 ", e);
                    }
                    stepDone(" userInfo ");
                    console.log(logPrefix, " 登录流程完成 ， 进入游戏 ");
                    onComplete && onComplete();
                }
            }), handlerFactory.create(null, function (err) {
                console.error(logPrefix, " getUserInfo fail ", err);
                const cached = getCache(CACHE_KEYS.USER_INFO);
                if (cached) {
                    console.warn(logPrefix, " getUserInfo 使用缓存 ");
                    PlayerDataStore.default.init(cached);
                    stepDone(" userInfo ");
                    onComplete && onComplete();
                } else if (netErrorPopup && netErrorPopup.shouldPop(err)) {
                    console.warn(logPrefix, " getUserInfo 无缓存+ 网络异常 ， 弹重试窗 ");
                    netErrorPopup.showAndRetry(getUserInfo);
                } else {
                    stepDone(" userInfo ");
                    warnAndFail(" getUserInfo 无缓存 ， 兜底进入游戏 ", err);
                }
            }));
        }

        function getGameConfig() {
            console.log(logPrefix, " getGameConfig ");
            report(" page_loading_getGameConfig ");
            httpService.getGameConfig(handlerFactory.create(null, function (response) {
                report(" page_loading_getGameConfig_res ", {
                    code: response && response.code
                });
                if (netErrorPopup && netErrorPopup.shouldPop(response)) {
                    console.warn(logPrefix, " getGameConfig force- retry code = ", response && response.code);
                    netErrorPopup.showAndRetry(getGameConfig);
                } else {
                    console.log(logPrefix, " getGameConfig success ", JSON.stringify(response));
                    GameConfigStore.default.init(response.data);
                    setCache(CACHE_KEYS.GAME_CONFIG, response.data);
                    stepDone(" gameConfig ");
                    getUserInfo();
                }
            }), handlerFactory.create(null, function (err) {
                console.error(logPrefix, " getGameConfig fail ", err);
                const cached = getCache(CACHE_KEYS.GAME_CONFIG);
                if (cached) {
                    console.warn(logPrefix, " getGameConfig 使用缓存 ");
                    GameConfigStore.default.init(cached);
                    stepDone(" gameConfig ");
                    getUserInfo();
                } else if (netErrorPopup && netErrorPopup.shouldPop(err)) {
                    console.warn(logPrefix, " getGameConfig 无缓存+ 网络异常 ， 弹重试窗 ");
                    netErrorPopup.showAndRetry(getGameConfig);
                } else {
                    console.warn(logPrefix, " getGameConfig 无缓存 ， 继续 getUserInfo ");
                    stepDone(" gameConfig ");
                    getUserInfo();
                }
            }));
        }

        function touristsLogin() {
            console.log(logPrefix, " touristsLogin ");
            report(" page_loading_touristsLogin ");
            httpService.touristsLogin(null, handlerFactory.create(null, function (response) {
                report(" page_loading_touristsLogin_res ", response);
                if (netErrorPopup && netErrorPopup.shouldPop(response)) {
                    console.warn(logPrefix, " touristsLogin force- retry code = ", response && response.code);
                    netErrorPopup.showAndRetry(touristsLogin);
                } else {
                    console.log(logPrefix, " touristsLogin success ", JSON.stringify(response));
                    report(" register_success ", {
                        login_type: " tourists "
                    });
                    PlayerDataStore.default.initUserId(response.data);
                    setCache(CACHE_KEYS.LOGIN_USER_ID, response.data);
                    stepDone(" login ");
                    getSystemConfig();
                }
            }), handlerFactory.create(null, function (err) {
                let errJson = " ";
                try {
                    errJson = JSON.stringify(err);
                } catch (e) {
                    errJson = String(err);
                }
                console.error(logPrefix, " touristsLogin fail json = ", errJson);
                const cached = getCache(CACHE_KEYS.LOGIN_USER_ID);
                if (cached && cached.yid) {
                    console.warn(logPrefix, " touristsLogin 使用缓存登录态 ");
                    PlayerDataStore.default.initUserId(cached);
                    stepDone(" login ");
                    getSystemConfig();
                } else if (netErrorPopup && netErrorPopup.shouldPop(err)) {
                    console.warn(logPrefix, " touristsLogin 无缓存+ 网络异常 ， 弹重试窗 ");
                    netErrorPopup.showAndRetry(touristsLogin);
                } else {
                    report(" register_fail ", {
                        login_type: " tourists ",
                        err_code: err && void 0 !== err.code ? err.code : " ",
                        err_msg: err && err.message ? err.message : " "
                    });
                    console.warn(logPrefix, " touristsLogin 无缓存登录态 ， 继续拉配置 ");
                    stepDone(" login ");
                    getSystemConfig();
                }
            }));
        }

        function getSystemConfig() {
            console.log(logPrefix, " getSystemConfig ");
            report(" page_loading_getSystemConfig ");
            httpService.getSystemConfig(handlerFactory.create(null, function (response) {
                report(" page_loading_getSystemConfig_res ", {
                    code: response && response.code
                });
                if (netErrorPopup && netErrorPopup.shouldPop(response)) {
                    console.warn(logPrefix, " getSystemConfig force- retry code = ", response && response.code);
                    netErrorPopup.showAndRetry(getSystemConfig);
                } else {
                    console.log(logPrefix, " getSystemConfig success ", JSON.stringify(response));
                    SystemDataStore.default.init_config(response.data);
                    setCache(CACHE_KEYS.SYSTEM_CONFIG, response.data);
                    try {
                        LanguageHelper.default.setType(ClientDataStore.default.local_country);
                        LanguageService.setByCountryCode(ClientDataStore.default.local_country);
                    } catch (e) {
                        console.error(logPrefix, " LanguageHelper.setType fail(continue) ", e);
                    }
                    stepDone(" systemConfig ");
                    getGameConfig();
                }
            }), handlerFactory.create(null, function (err) {
                console.error(logPrefix, " getSystemConfig fail ", err);
                const cached = getCache(CACHE_KEYS.SYSTEM_CONFIG);
                if (cached) {
                    console.warn(logPrefix, " getSystemConfig 使用缓存 ");
                    SystemDataStore.default.init_config(cached);
                    try {
                        LanguageHelper.default.setType(ClientDataStore.default.local_country);
                        LanguageService.setByCountryCode(ClientDataStore.default.local_country);
                    } catch (e) {
                        console.error(logPrefix, " LanguageHelper.setType fail(continue) ", e);
                    }
                    stepDone(" systemConfig ");
                    getGameConfig();
                } else {
                    console.warn(logPrefix, " getSystemConfig 无缓存 ， 继续 autoLogin ");
                    try {
                        LanguageHelper.default.setType(ClientDataStore.default.local_country);
                        LanguageService.setByCountryCode(ClientDataStore.default.local_country);
                    } catch (e) {
                        console.error(logPrefix, " LanguageHelper.setType fail(continue) ", e);
                    }
                    stepDone(" systemConfig ");
                    getGameConfig();
                }
            }));
        }

        (function autoLogin() {
            console.log(logPrefix, " autoLogin ");
            report(" page_loading_autoLogin_start ");
            report(" autoLogin_start ", {
                timeStemp: Date.now()
            });
            httpService.autoLogin(null, handlerFactory.create(null, function (response) {
                report(" autoLogin_end ", {
                    timeStemp: Date.now()
                });
                if (netErrorPopup && netErrorPopup.shouldPop(response)) {
                    console.warn(logPrefix, " autoLogin force- retry code = ", response && response.code);
                    netErrorPopup.showAndRetry(autoLogin);
                } else {
                    let responseJson = " ";
                    try {
                        responseJson = JSON.stringify(response);
                    } catch (e) {
                        responseJson = "[json stringify failed] ";
                    }
                    console.log(logPrefix, " autoLogin success yid = ", response && response.data && response.data.yid, " res_json = ", responseJson);
                    if (response && response.data && response.data.yid) {
                        report(" page_loading_autoLogin_success ");
                        report(" register_success ", {
                            login_type: " auto "
                        });
                        PlayerDataStore.default.initUserId(response.data);
                        setCache(CACHE_KEYS.LOGIN_USER_ID, response.data);
                        stepDone(" login ");
                        getSystemConfig();
                    } else {
                        report(" u_login_page_show ");
                        touristsLogin();
                    }
                }
            }), handlerFactory.create(null, function (err) {
                report(" autoLogin_end ", {
                    timeStemp: Date.now()
                });
                console.error(logPrefix, " autoLogin fail ", err);
                touristsLogin();
            }));
        })();
    } catch (e) {
        summarizeError(logPrefix + " runBaseFlow 初始化失败 ", e);
        onComplete ? onComplete(e) : onFail && onFail();
    }
}
