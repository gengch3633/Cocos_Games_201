import BusinessAnalyticsService from "./BusinessAnalyticsService";
import ClientDataStore from "./ClientDataStore";
import GameConfigStore from "./GameConfigStore";
import Handler from "./Handler";
import LanguageHelper from "./LanguageHelper";
import LanguageService from "./LanguageService";
import LoadingHttpService from "./LoadingHttpService";
import LoadingProjectAdapters from "./loading-project-adapters";
import MiddleHelper from "./MiddleHelper";
import MiddleManager from "./MiddleManager";
import NetErrorPopupService from "./NetErrorPopupService";
import PlatformBridge from "./PlatformBridge";
import PlayerDataStore from "./PlayerDataStore";
import SystemDataStore from "./SystemDataStore";
import UserInfoService from "./UserInfoService";

interface IErrorSummary {
    type: string;
    asString: string;
    name: string;
    message: string;
    stack: string;
    keys: string[];
    rawJson: string;
}

type MiddleCountryCallback = (data?: any) => void;

function safeStringify(value: any): string {
    try {
        return JSON.stringify(value);
    } catch (e) {
        return String(value);
    }
}

function summarizeError(err: any): IErrorSummary {
    const summary: IErrorSummary = {
        type: Object.prototype.toString.call(err),
        asString: String(err),
        name: "",
        message: "",
        stack: "",
        keys: [],
        rawJson: ""
    };
    if (err && typeof err === "object") {
        try {
            summary.name = err.name || "";
        } catch (e) {}
        try {
            summary.message = err.message || "";
        } catch (e) {}
        try {
            summary.stack = err.stack || "";
        } catch (e) {}
        try {
            summary.keys = Object.keys(err);
        } catch (e) {}
        try {
            summary.rawJson = safeStringify(err);
        } catch (e) {}
    }
    return summary;
}

function logError(tag: string, err: any): void {
    const summary = summarizeError(err);
    console.error(tag, "summary =>", summary.asString);
    console.error(tag, "detail =>", safeStringify(summary));
    console.error(tag, "raw =>", err);
}

export function initProjectLoadingAdapters(): void {
    try {
        if (LoadingProjectAdapters && typeof LoadingProjectAdapters.initProjectLoadingAdapters === "function") {
            LoadingProjectAdapters.initProjectLoadingAdapters();
        }
    } catch (e) {
        logError("[LoadingProjectAdaptersBridge] init failed", e);
    }
}

export function initSystem(): void {
    try {
        const clientInfo = PlatformBridge.getClientInfo();
        console.log("[LoadingProjectAdaptersBridge] initSystem clientInfo type=", Object.prototype.toString.call(clientInfo));
        ClientDataStore.init(clientInfo);

        let yid = "";
        try {
            yid = cc.sys.localStorage.getItem("yid") || "";
        } catch (e) {}
        if (yid === "yid_read_fail" || yid === "yid_read_failed") {
            yid = "";
        }
        PlayerDataStore.initUserId({
            yid: yid
        });
    } catch (e) {
        logError("[LoadingProjectAdaptersBridge] initSystem failed", e);
    }
}

export function runMiddleCountry(
    onEnter?: MiddleCountryCallback,
    onBan?: MiddleCountryCallback,
    onBackstop?: MiddleCountryCallback,
    showUmp?: (callback: (accepted: boolean) => void) => void
): void {
    const TAG = "[LoadingProjectAdaptersBridge.runMiddleCountry]";
    const CACHE_KEY_COUNTRY = "MB_CACHE_ATTR_COUNTRY";
    const CACHE_KEY_COUNTRY_UPDATE_AT = "MB_CACHE_ATTR_COUNTRY_UPDATE_AT";
    const CACHE_KEY_UMP_HANDLED = "MB_CACHE_UMP_HANDLED_";

    const callbacks: {
        enter?: MiddleCountryCallback;
        ban?: MiddleCountryCallback;
        backstop?: MiddleCountryCallback;
    } = {
        enter: onEnter,
        ban: onBan,
        backstop: onBackstop
    };

    const normalizeCountry = (country: any): string => {
        if (!country) {
            return "";
        }
        const upper = String(country).toUpperCase();
        return upper === "GB" ? "UK" : upper;
    };

    const persistCountry = (country: any): string => {
        const normalized = normalizeCountry(country);
        if (!normalized) {
            return "";
        }
        try {
            cc.sys.localStorage.setItem(CACHE_KEY_COUNTRY, normalized);
            cc.sys.localStorage.setItem(CACHE_KEY_COUNTRY_UPDATE_AT, String(Date.now()));
        } catch (e) {
            console.warn(TAG, "persistCountry fail", e);
        }
        return normalized;
    };

    const applyCountryToClient = (client: any, country: any): string => {
        const normalized = normalizeCountry(country);
        if (!normalized) {
            return "";
        }
        if (!client) {
            return normalized;
        }
        try {
            client.local_country = normalized;
        } catch (e) {
            logError(TAG + " applyCountryToClient set local_country failed", e);
        }
        try {
            if (typeof client.buildCommonUrlStr === "function") {
                client.buildCommonUrlStr();
            }
        } catch (e) {
            logError(TAG + " applyCountryToClient buildCommonUrlStr failed", e);
        }
        try {
            if (typeof client.buildMiddleCommonUrlStr === "function") {
                client.buildMiddleCommonUrlStr();
            }
        } catch (e) {
            logError(TAG + " applyCountryToClient buildMiddleCommonUrlStr failed", e);
        }
        return normalized;
    };

    const umpCacheKey = (client: any): string => {
        let pkgName = "";
        try {
            pkgName = client && client.box_pkg_name ? String(client.box_pkg_name) : "";
        } catch (e) {}
        return CACHE_KEY_UMP_HANDLED + (pkgName || "default");
    };

    const hasHandledUmp = (client: any): boolean => {
        try {
            return cc.sys.localStorage.getItem(umpCacheKey(client)) === "1";
        } catch (e) {
            console.warn(TAG, "hasHandledUmp read fail", e);
            return false;
        }
    };

    const markUmpHandled = (client: any): void => {
        try {
            cc.sys.localStorage.setItem(umpCacheKey(client), "1");
        } catch (e) {
            console.warn(TAG, "markUmpHandled write fail", e);
        }
    };

    try {
        let settled = false;
        let waitingUmp = false;

        const client: any = ClientDataStore;

        let cachedCountry = "";
        try {
            cachedCountry = normalizeCountry(cc.sys.localStorage.getItem(CACHE_KEY_COUNTRY));
        } catch (e) {
            console.warn(TAG, "readCachedCountry fail", e);
            cachedCountry = "";
        }

        let localCountry = "";
        if (client && client.local_country) {
            localCountry = normalizeCountry(client.local_country);
        }
        if (!localCountry) {
            const languageCountryMap: { [key: string]: string } = {
                zh: "CN",
                en: "US",
                id: "ID",
                pt: "BR",
                ru: "RU",
                de: "DE",
                fr: "FR",
                es: "MX",
                hi: "IN",
                th: "TH",
                ja: "JP",
                ko: "KR",
                fil: "PH",
                tl: "PH"
            };
            localCountry = languageCountryMap[String(cc.sys.language || "").toLowerCase()] || "IN";
        }

        if (client) {
            const applied = applyCountryToClient(client, cachedCountry);
            if (applied) {
                console.log(TAG, "启动应用归因缓存 local_country =", applied);
            }
        }

        const dispatch = (type: "enter" | "ban" | "backstop", data?: any): void => {
            if (settled) {
                console.warn(TAG, "重复 " + type + " 回调，忽略。");
                return;
            }
            if (waitingUmp) {
                console.warn(TAG, "UMP 仍在展示，忽略 " + type + " 回调。");
                return;
            }
            settled = true;
            if (type === "enter") {
                try {
                    const middle: any = typeof MiddleManager.getInstance === "function" ? MiddleManager.getInstance() : null;
                    if (middle && typeof middle.middleTFRegional === "function") {
                        console.log(TAG, "middleTFRegional start");
                        middle.middleTFRegional();
                    }
                    if (middle && typeof middle.autoUploadEvent === "function") {
                        console.log(TAG, "autoUploadEvent start");
                        middle.autoUploadEvent("default-timer");
                    }
                } catch (e) {
                    logError(TAG + " middleTFRegional failed", e);
                }
            }
            const callback = callbacks[type];
            if (typeof callback === "function") {
                callback(data);
            }
        };

        const resolveDefaultCountry = (): string => {
            let country = cachedCountry || localCountry;
            country = persistCountry(country) || country;
            if (client && country) {
                applyCountryToClient(client, country);
            }
            if (country && typeof MiddleHelper.saveLocalCountry === "function") {
                MiddleHelper.saveLocalCountry(country);
            }
            return country;
        };

        console.log("runMiddleCountry");

        console.log(TAG, "module loaded", {
            hasMiddleHelper: !!MiddleHelper,
            hasMiddleManager: !!MiddleManager,
            hasClientDataStore: !!ClientDataStore,
            hasBusinessAnalyticsService: !!BusinessAnalyticsService
        });

        console.log(TAG, "helper state", {
            hasMiddleCountry: typeof MiddleHelper.middleCountry === "function",
            hasLocalCountry: typeof MiddleHelper.localCountry === "function",
            hasSaveLocalCountry: typeof MiddleHelper.saveLocalCountry === "function"
        });

        if (typeof MiddleHelper.middleCountry !== "function") {
            throw new Error("middleHelper.middleCountry is not a function");
        }

        MiddleHelper.middleCountry(
            (result: any) => {
                let country = "";
                if (typeof MiddleHelper.localCountry === "function") {
                    country = normalizeCountry(MiddleHelper.localCountry());
                }
                if (!country && client) {
                    country = normalizeCountry(client.local_country);
                }
                country = persistCountry(country) || country;
                if (client && country) {
                    applyCountryToClient(client, country);
                }
                console.log(TAG, "归因成功，更新缓存 country =", country || "N/A");

                const needShowUmp = !!(result && result.is_ump === true && result.is_ump_country === true);
                const alreadyHandledUmp = hasHandledUmp(client);
                console.log(TAG, "UMP判定 needShowUmp =", needShowUmp, "alreadyHandledUmp =", alreadyHandledUmp);

                if (needShowUmp && alreadyHandledUmp) {
                    dispatch("enter", result);
                } else if (needShowUmp && typeof showUmp === "function") {
                    if (typeof BusinessAnalyticsService.reportData === "function") {
                        BusinessAnalyticsService.reportData("page_loading_show_ump");
                    }
                    waitingUmp = true;
                    try {
                        let triggered = false;
                        showUmp((accepted: boolean) => {
                            if (triggered) {
                                console.warn(TAG, "UMP 回调重复触发，忽略。");
                                return;
                            }
                            triggered = true;
                            waitingUmp = false;
                            markUmpHandled(client);
                            if (accepted) {
                                dispatch("enter", result);
                            } else {
                                dispatch("backstop", {
                                    reason: "ump_reject"
                                });
                            }
                        });
                    } catch (e) {
                        waitingUmp = false;
                        dispatch("backstop", e);
                    }
                } else {
                    dispatch("enter", result);
                }
            },
            (err: any) => {
                dispatch("ban", err);
            },
            (err: any) => {
                const country = resolveDefaultCountry();
                console.warn(TAG, "归因失败，使用默认国家 country =", country || "IN");
                dispatch("backstop", err);
            }
        );
    } catch (e) {
        logError("[LoadingProjectAdaptersBridge] runMiddleCountry failed", e);
        try {
            if (typeof onBackstop === "function") {
                onBackstop(e);
            }
        } catch (err) {
            logError("[LoadingProjectAdaptersBridge] runMiddleCountry onBackstop failed", err);
        }
    }
}

export function runBaseFlow(
    onFinish?: () => void,
    onError?: (err: any) => void,
    onProgress?: (step: string) => void
): void {
    const TAG = "[LoadingProjectAdaptersBridge.runBaseFlow]";
    const progress: (step: string) => void = typeof onProgress === "function" ? onProgress : function (): void {};

    try {
        const setCache = (key: string, value: any): void => {
            if (value === null || value === undefined) {
                return;
            }
            try {
                cc.sys.localStorage.setItem(key, JSON.stringify(value));
            } catch (e) {
                console.warn(TAG, "setCache fail", key, e);
            }
        };

        const getCache = (key: string): any => {
            try {
                const raw = cc.sys.localStorage.getItem(key);
                return raw ? JSON.parse(raw) : null;
            } catch (e) {
                console.warn(TAG, "getCache fail", key, e);
                return null;
            }
        };

        const finish = (message: string, err?: any): void => {
            if (err) {
                console.warn(TAG, message, err);
            } else {
                console.warn(TAG, message);
            }
            if (typeof onFinish === "function") {
                onFinish();
            }
        };

        const report = (event: string, data?: any): void => {
            try {
                if (typeof BusinessAnalyticsService.reportData === "function") {
                    BusinessAnalyticsService.reportData(event, data || {});
                }
            } catch (e) {
                console.warn(TAG, "report fail", event, e);
            }
        };

        const applyLanguage = (): void => {
            try {
                LanguageHelper.setType(ClientDataStore.local_country);
                LanguageService.setByCountryCode(ClientDataStore.local_country);
            } catch (e) {
                console.error(TAG, "LanguageHelper.setType fail(continue)", e);
            }
        };

        LoadingHttpService.init((err: any, retry: () => void) => {
            console.warn(TAG, "HTTP 请求失败，自动重试", err);
            if (typeof retry === "function") {
                retry();
            }
        });

        const cacheKeys = {
            SYSTEM_CONFIG: "MB_CACHE_SYSTEM_CONFIG",
            LOGIN_USER_ID: "MB_CACHE_LOGIN_USER_ID",
            GAME_CONFIG: "MB_CACHE_GAME_CONFIG",
            USER_INFO: "MB_CACHE_USER_INFO"
        };

        const getUserInfo = (): void => {
            console.log(TAG, "getUserInfo");
            report("page_loading_getUserInfo");
            LoadingHttpService.getUserInfo(
                Handler.create(null, (res: any) => {
                    report("page_loading_getUserInfo_code", {
                        code: res && res.code
                    });
                    if (NetErrorPopupService.shouldPop(res)) {
                        console.warn(TAG, "getUserInfo force-retry code=", res && res.code);
                        NetErrorPopupService.showAndRetry(getUserInfo);
                    } else {
                        console.log(TAG, "getUserInfo success", JSON.stringify(res));
                        PlayerDataStore.init(res.data);
                        setCache(cacheKeys.USER_INFO, res.data);
                        try {
                            UserInfoService.getInstance()._applyToUserData(res.data);
                        } catch (e) {
                            console.warn(TAG, "UserData 同步失败", e);
                        }
                        progress("userInfo");
                        if (typeof onFinish === "function") {
                            onFinish();
                        }
                    }
                }),
                Handler.create(null, (err: any) => {
                    console.error(TAG, "getUserInfo fail", err);
                    const cached = getCache(cacheKeys.USER_INFO);
                    if (cached) {
                        console.warn(TAG, "getUserInfo 使用缓存");
                        PlayerDataStore.init(cached);
                        progress("userInfo");
                        if (typeof onFinish === "function") {
                            onFinish();
                        }
                    } else if (NetErrorPopupService.shouldPop(err)) {
                        console.warn(TAG, "getUserInfo 无缓存 + 网络异常，弹重试窗");
                        NetErrorPopupService.showAndRetry(getUserInfo);
                    } else {
                        progress("userInfo");
                        finish("getUserInfo 无缓存，兜底进入游戏", err);
                    }
                })
            );
        };

        const getGameConfig = (): void => {
            console.log(TAG, "getGameConfig");
            report("page_loading_getGameConfig");
            LoadingHttpService.getGameConfig(
                Handler.create(null, (res: any) => {
                    report("page_loading_getGameConfig_res", {
                        code: res && res.code
                    });
                    if (NetErrorPopupService.shouldPop(res)) {
                        console.warn(TAG, "getGameConfig force-retry code=", res && res.code);
                        NetErrorPopupService.showAndRetry(getGameConfig);
                    } else {
                        console.log(TAG, "getGameConfig success", JSON.stringify(res));
                        GameConfigStore.init(res.data);
                        setCache(cacheKeys.GAME_CONFIG, res.data);
                        progress("gameConfig");
                        getUserInfo();
                    }
                }),
                Handler.create(null, (err: any) => {
                    console.error(TAG, "getGameConfig fail", err);
                    const cached = getCache(cacheKeys.GAME_CONFIG);
                    if (cached) {
                        console.warn(TAG, "getGameConfig 使用缓存");
                        GameConfigStore.init(cached);
                        progress("gameConfig");
                        getUserInfo();
                    } else if (NetErrorPopupService.shouldPop(err)) {
                        console.warn(TAG, "getGameConfig 无缓存 + 网络异常，弹重试窗");
                        NetErrorPopupService.showAndRetry(getGameConfig);
                    } else {
                        console.warn(TAG, "getGameConfig 无缓存，继续 getUserInfo");
                        progress("gameConfig");
                        getUserInfo();
                    }
                })
            );
        };

        const touristsLogin = (): void => {
            console.log(TAG, "touristsLogin");
            report("page_loading_touristsLogin");
            LoadingHttpService.touristsLogin(
                null,
                Handler.create(null, (res: any) => {
                    report("page_loading_touristsLogin_res", res);
                    if (NetErrorPopupService.shouldPop(res)) {
                        console.warn(TAG, "touristsLogin force-retry code=", res && res.code);
                        NetErrorPopupService.showAndRetry(touristsLogin);
                    } else {
                        console.log(TAG, "touristsLogin success", JSON.stringify(res));
                        report("register_success", {
                            login_type: "tourists"
                        });
                        PlayerDataStore.initUserId(res.data);
                        setCache(cacheKeys.LOGIN_USER_ID, res.data);
                        progress("login");
                        getSystemConfig();
                    }
                }),
                Handler.create(null, (err: any) => {
                    let json = "";
                    try {
                        json = JSON.stringify(err);
                    } catch (e) {
                        json = String(err);
                    }
                    console.error(TAG, "touristsLogin fail json=", json);
                    const cached = getCache(cacheKeys.LOGIN_USER_ID);
                    if (cached && cached.yid) {
                        console.warn(TAG, "touristsLogin 使用缓存登录态");
                        PlayerDataStore.initUserId(cached);
                        progress("login");
                        getSystemConfig();
                    } else if (NetErrorPopupService.shouldPop(err)) {
                        console.warn(TAG, "touristsLogin 无缓存 + 网络异常，弹重试窗");
                        NetErrorPopupService.showAndRetry(touristsLogin);
                    } else {
                        report("register_fail", {
                            login_type: "tourists",
                            err_code: err && err.code !== undefined ? err.code : "",
                            err_msg: err && err.message ? err.message : ""
                        });
                        console.warn(TAG, "touristsLogin 无缓存登录态，继续拉配置");
                        progress("login");
                        getSystemConfig();
                    }
                })
            );
        };

        const getSystemConfig = (): void => {
            console.log(TAG, "getSystemConfig");
            report("page_loading_getSystemConfig");
            LoadingHttpService.getSystemConfig(
                Handler.create(null, (res: any) => {
                    report("page_loading_getSystemConfig_res", {
                        code: res && res.code
                    });
                    if (NetErrorPopupService.shouldPop(res)) {
                        console.warn(TAG, "getSystemConfig force-retry code=", res && res.code);
                        NetErrorPopupService.showAndRetry(getSystemConfig);
                    } else {
                        console.log(TAG, "getSystemConfig success", JSON.stringify(res));
                        SystemDataStore.init_config(res.data);
                        setCache(cacheKeys.SYSTEM_CONFIG, res.data);
                        applyLanguage();
                        progress("systemConfig");
                        getGameConfig();
                    }
                }),
                Handler.create(null, (err: any) => {
                    console.error(TAG, "getSystemConfig fail", err);
                    const cached = getCache(cacheKeys.SYSTEM_CONFIG);
                    if (cached) {
                        console.warn(TAG, "getSystemConfig 使用缓存");
                        SystemDataStore.init_config(cached);
                    } else {
                        console.warn(TAG, "getSystemConfig 无缓存，继续 autoLogin");
                    }
                    applyLanguage();
                    progress("systemConfig");
                    getGameConfig();
                })
            );
        };

        const autoLogin = (): void => {
            console.log(TAG, "autoLogin");
            report("page_loading_autoLogin_start");
            report("autoLogin_start", {
                timeStemp: Date.now()
            });
            LoadingHttpService.autoLogin(
                null,
                Handler.create(null, (res: any) => {
                    report("autoLogin_end", {
                        timeStemp: Date.now()
                    });
                    if (NetErrorPopupService.shouldPop(res)) {
                        console.warn(TAG, "autoLogin force-retry code=", res && res.code);
                        NetErrorPopupService.showAndRetry(autoLogin);
                    } else {
                        let json = "";
                        try {
                            json = JSON.stringify(res);
                        } catch (e) {
                            json = "[json stringify failed]";
                        }
                        console.log(TAG, "autoLogin success yid=", res && res.data && res.data.yid, "res_json=", json);
                        if (res && res.data && res.data.yid) {
                            report("page_loading_autoLogin_success");
                            report("register_success", {
                                login_type: "auto"
                            });
                            PlayerDataStore.initUserId(res.data);
                            setCache(cacheKeys.LOGIN_USER_ID, res.data);
                            progress("login");
                            getSystemConfig();
                        } else {
                            report("u_login_page_show");
                            touristsLogin();
                        }
                    }
                }),
                Handler.create(null, (err: any) => {
                    report("autoLogin_end", {
                        timeStemp: Date.now()
                    });
                    console.error(TAG, "autoLogin fail", err);
                    touristsLogin();
                })
            );
        };

        autoLogin();
    } catch (e) {
        logError(TAG + " runBaseFlow 初始化失败", e);
        if (typeof onError === "function") {
            onError(e);
        } else if (typeof onFinish === "function") {
            onFinish();
        }
    }
}