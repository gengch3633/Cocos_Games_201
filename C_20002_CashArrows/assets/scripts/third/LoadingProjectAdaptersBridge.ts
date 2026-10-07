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
    } catch {
        return String(value);
    }
}

function describeError(value: any): Record<string, any> {
    const detail: Record<string, any> = {
        type: Object.prototype.toString.call(value),
        asString: String(value),
        name: "",
        message: "",
        stack: "",
        keys: [] as string[],
        rawJson: "",
    };
    if (value && typeof value === "object") {
        try {
            detail.name = value.name || "";
        } catch {}
        try {
            detail.message = value.message || "";
        } catch {}
        try {
            detail.stack = value.stack || "";
        } catch {}
        try {
            detail.keys = Object.keys(value);
        } catch {}
        try {
            detail.rawJson = safeStringify(value);
        } catch {}
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
        const mod = require("./loading-project-adapters");
        if (mod?.initProjectLoadingAdapters) {
            mod.initProjectLoadingAdapters();
        }
    } catch (err) {
        logBridgeError("[LoadingProjectAdaptersBridge] init failed", err);
    }
}

export function initSystem(): void {
    try {
        const platform = PlatformBridge;
        const clientStore = ClientDataStore;
        const playerStore = PlayerDataStore;
        if (platform && clientStore) {
            const clientInfo = platform.getClientInfo();
            console.log("[LoadingProjectAdaptersBridge] initSystem clientInfo type=", Object.prototype.toString.call(clientInfo));
            clientStore.init(clientInfo);
        }
        if (playerStore) {
            let yid = "";
            try {
                yid = cc.sys.localStorage.getItem("yid") || "";
            } catch {}
            if (yid === "yid_read_fail" || yid === "yid_read_failed") {
                yid = "";
            }
            playerStore.initUserId({ yid });
        }
    } catch (err) {
        logBridgeError("[LoadingProjectAdaptersBridge] initSystem failed", err);
    }
}

export function runMiddleCountry(
    onEnter: (data?: any) => void,
    onBan: (err?: any) => void,
    onBackstop: (err?: any) => void,
    onShowUmp?: (callback: (agreed: boolean) => void) => void
): void {
    const tag = "[LoadingProjectAdaptersBridge.runMiddleCountry]";
    const CACHE_COUNTRY = "MB_CACHE_ATTR_COUNTRY";
    const CACHE_COUNTRY_AT = "MB_CACHE_ATTR_COUNTRY_UPDATE_AT";
    const UMP_HANDLED_PREFIX = "MB_CACHE_UMP_HANDLED_";

    function normalizeCountry(code: string | null | undefined): string {
        if (!code) {
            return "";
        }
        const upper = String(code).toUpperCase();
        return upper === "GB" ? "UK" : upper;
    }

    function persistCountry(code: string | null | undefined): string {
        const normalized = normalizeCountry(code);
        if (!normalized) {
            return "";
        }
        try {
            cc.sys.localStorage.setItem(CACHE_COUNTRY, normalized);
            cc.sys.localStorage.setItem(CACHE_COUNTRY_AT, String(Date.now()));
        } catch (err) {
            console.warn(tag, "persistCountry fail", err);
        }
        return normalized;
    }

    function applyCountryToClient(client: any, code: string | null | undefined): string {
        const normalized = normalizeCountry(code);
        if (!normalized) {
            return "";
        }
        if (!client) {
            return normalized;
        }
        try {
            client.local_country = normalized;
        } catch (err) {
            logBridgeError(tag + " applyCountryToClient set local_country failed", err);
        }
        try {
            if (typeof client.buildCommonUrlStr === "function") {
                client.buildCommonUrlStr();
            }
        } catch (err) {
            logBridgeError(tag + " applyCountryToClient buildCommonUrlStr failed", err);
        }
        try {
            if (typeof client.buildMiddleCommonUrlStr === "function") {
                client.buildMiddleCommonUrlStr();
            }
        } catch (err) {
            logBridgeError(tag + " applyCountryToClient buildMiddleCommonUrlStr failed", err);
        }
        return normalized;
    }

    function umpHandledKey(client: any): string {
        let pkg = "";
        try {
            pkg = client?.box_pkg_name ? String(client.box_pkg_name) : "";
        } catch {}
        return UMP_HANDLED_PREFIX + (pkg || "default");
    }

    function hasHandledUmp(client: any): boolean {
        try {
            return cc.sys.localStorage.getItem(umpHandledKey(client)) === "1";
        } catch (err) {
            console.warn(tag, "hasHandledUmp read fail", err);
            return false;
        }
    }

    function markUmpHandled(client: any): void {
        try {
            cc.sys.localStorage.setItem(umpHandledKey(client), "1");
        } catch (err) {
            console.warn(tag, "markUmpHandled write fail", err);
        }
    }

    try {
        let resolved = false;
        let umpShowing = false;
        const callbacks = { enter: onEnter, ban: onBan, backstop: onBackstop };

        const resolveOnce = (kind: "enter" | "ban" | "backstop", data?: any) => {
            if (resolved) {
                console.warn(tag, "重复 " + kind + " 回调，忽略。");
                return;
            }
            if (umpShowing) {
                console.warn(tag, "UMP 仍在展示，忽略 " + kind + " 回调。");
                return;
            }
            resolved = true;
            if (kind === "enter") {
                try {
                    const manager =
                        MiddleManager && typeof MiddleManager.getInstance === "function" ? MiddleManager.getInstance() : null;
                    if (manager && typeof manager.middleTFRegional === "function") {
                        console.log(tag, "middleTFRegional start");
                        manager.middleTFRegional();
                    }
                    if (manager && typeof manager.autoUploadEvent === "function") {
                        console.log(tag, "autoUploadEvent start");
                        manager.autoUploadEvent("default-timer");
                    }
                } catch (err) {
                    logBridgeError(tag + " middleTFRegional failed", err);
                }
            }
            const callback = callbacks[kind];
            callback?.(data);
        };

        const applyDefaultCountry = () => {
            let country = cachedCountry || fallbackCountry;
            country = persistCountry(country) || country;
            if (clientStore && country) {
                applyCountryToClient(clientStore, country);
            }
            if (MiddleHelper && typeof MiddleHelper.saveLocalCountry === "function" && country) {
                MiddleHelper.saveLocalCountry(country);
            }
            return country;
        };

        console.log("runMiddleCountry");
        console.log(tag, "module loaded", {
            hasMiddleHelper: !!MiddleHelper,
            hasClientDataStore: !!ClientDataStore,
            hasBusinessAnalyticsService: !!BusinessAnalyticsService,
        });

        const clientStore = ClientDataStore;
        const analytics = BusinessAnalyticsService;

        const readCachedCountry = (): string => {
            try {
                return normalizeCountry(cc.sys.localStorage.getItem(CACHE_COUNTRY));
            } catch (err) {
                console.warn(tag, "readCachedCountry fail", err);
                return "";
            }
        };

        const cachedCountry = readCachedCountry();
        if (clientStore) {
            const applied = applyCountryToClient(clientStore, cachedCountry);
            if (applied) {
                console.log(tag, "启动应用归因缓存 local_country =", applied);
            }
        }

        let fallbackCountry = "";
        if (clientStore?.local_country) {
            fallbackCountry = normalizeCountry(clientStore.local_country);
        }
        if (!fallbackCountry) {
            const langMap: Record<string, string> = {
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
                tl: "PH",
            };
            fallbackCountry = langMap[String(cc.sys.language || "").toLowerCase()] || "IN";
        }

        if (MiddleHelper) {
            const helper = MiddleHelper;
            console.log(tag, "helper state", {
                hasMiddleCountry: typeof helper.middleCountry === "function",
                hasLocalCountry: typeof helper.localCountry === "function",
                hasSaveLocalCountry: typeof helper.saveLocalCountry === "function",
            });
            if (typeof helper.middleCountry !== "function") {
                throw new Error("middleHelper.middleCountry is not a function");
            }
            helper.middleCountry(
                (result: any) => {
                    let country = "";
                    if (typeof helper.localCountry === "function") {
                        country = normalizeCountry(helper.localCountry());
                    }
                    if (!country && clientStore) {
                        country = normalizeCountry(clientStore.local_country);
                    }
                    country = persistCountry(country) || country;
                    if (clientStore && country) {
                        applyCountryToClient(clientStore, country);
                    }
                    console.log(tag, "归因成功，更新缓存 country =", country || "N/A");
                    const needShowUmp = !!(result && result.is_ump === true && result.is_ump_country === true);
                    const alreadyHandled = hasHandledUmp(clientStore);
                    console.log(tag, "UMP判定 needShowUmp =", needShowUmp, "alreadyHandledUmp =", alreadyHandled);
                    if (needShowUmp && alreadyHandled) {
                        resolveOnce("enter", result);
                    } else if (needShowUmp && onShowUmp) {
                        analytics?.reportData?.("page_loading_show_ump");
                        umpShowing = true;
                        try {
                            let umpResolved = false;
                            onShowUmp((agreed) => {
                                if (umpResolved) {
                                    console.warn(tag, "UMP 回调重复触发，忽略。");
                                    return;
                                }
                                umpResolved = true;
                                umpShowing = false;
                                markUmpHandled(clientStore);
                                if (agreed) {
                                    resolveOnce("enter", result);
                                } else {
                                    resolveOnce("backstop", { reason: "ump_reject" });
                                }
                            });
                        } catch (err) {
                            umpShowing = false;
                            resolveOnce("backstop", err);
                        }
                    } else {
                        resolveOnce("enter", result);
                    }
                },
                (err: any) => resolveOnce("ban", err),
                (err: any) => {
                    const country = applyDefaultCountry();
                    console.warn(tag, "归因失败，使用默认国家 country =", country || "IN");
                    resolveOnce("backstop", err);
                }
            );
        } else {
            if (clientStore) {
                const country = applyDefaultCountry();
                console.warn(tag, "middleHelper 不可用，使用默认国家 country =", country || "IN");
            }
            resolveOnce("backstop");
        }
    } catch (err) {
        logBridgeError("[LoadingProjectAdaptersBridge] runMiddleCountry failed", err);
        try {
            onBackstop?.(err);
        } catch (backstopErr) {
            logBridgeError("[LoadingProjectAdaptersBridge] runMiddleCountry onBackstop failed", backstopErr);
        }
    }
}

export function runBaseFlow(onFallback: () => void, onComplete: () => void, onStepDone?: (step: string) => void): void {
    const tag = "[LoadingProjectAdaptersBridge.runBaseFlow]";
    const reportStep = typeof onStepDone === "function" ? onStepDone : () => {};

    try {
        const setCache = (key: string, value: any) => {
            if (value == null) {
                return;
            }
            try {
                cc.sys.localStorage.setItem(key, JSON.stringify(value));
            } catch (err) {
                console.warn(tag, "setCache fail", key, err);
            }
        };

        const getCache = (key: string): any => {
            try {
                const raw = cc.sys.localStorage.getItem(key);
                return raw ? JSON.parse(raw) : null;
            } catch (err) {
                console.warn(tag, "getCache fail", key, err);
                return null;
            }
        };

        const fallback = (message: string, err?: any) => {
            if (err) {
                console.warn(tag, message, err);
            } else {
                console.warn(tag, message);
            }
            onFallback?.();
        };

        const report = (event: string, data?: any) => {
            try {
                BusinessAnalyticsService?.reportData?.(event, data || {});
            } catch (err) {
                console.warn(tag, "report fail", event, err);
            }
        };

        const http = LoadingHttpService;
        const handler = Handler;
        const netErrorPopup = NetErrorPopupService;

        http.init((_reason, retryFn) => {
            console.warn(tag, "HTTP 请求失败，自动重试", _reason);
            retryFn?.();
        });

        const CACHE_KEYS = {
            SYSTEM_CONFIG: "MB_CACHE_SYSTEM_CONFIG",
            LOGIN_USER_ID: "MB_CACHE_LOGIN_USER_ID",
            GAME_CONFIG: "MB_CACHE_GAME_CONFIG",
            USER_INFO: "MB_CACHE_USER_INFO",
        };

        const getUserInfo = () => {
            console.log(tag, "getUserInfo");
            report("page_loading_getUserInfo");
            http.getUserInfo(
                handler.create(null, (res: any) => {
                    report("page_loading_getUserInfo_code", { code: res?.code });
                    if (netErrorPopup?.shouldPop(res)) {
                        console.warn(tag, "getUserInfo force-retry code=", res?.code);
                        netErrorPopup.showAndRetry(getUserInfo);
                        return;
                    }
                    console.log(tag, "getUserInfo success", JSON.stringify(res));
                    PlayerDataStore.init(res.data);
                    setCache(CACHE_KEYS.USER_INFO, res.data);
                    try {
                        UserInfoService.getInstance()._applyToUserData(res.data);
                    } catch (err) {
                        console.warn(tag, "UserData 同步失败", err);
                    }
                    reportStep("userInfo");
                    console.log(tag, "登录流程完成，进入游戏");
                    onComplete?.();
                }),
                handler.create(null, (err: any) => {
                    console.error(tag, "getUserInfo fail", err);
                    const cached = getCache(CACHE_KEYS.USER_INFO);
                    if (cached) {
                        console.warn(tag, "getUserInfo 使用缓存");
                        PlayerDataStore.init(cached);
                        reportStep("userInfo");
                        onComplete?.();
                    } else if (netErrorPopup?.shouldPop(err)) {
                        console.warn(tag, "getUserInfo 无缓存 + 网络异常，弹重试窗");
                        netErrorPopup.showAndRetry(getUserInfo);
                    } else {
                        reportStep("userInfo");
                        fallback("getUserInfo 无缓存，兜底进入游戏", err);
                    }
                })
            );
        };

        const getGameConfig = () => {
            console.log(tag, "getGameConfig");
            report("page_loading_getGameConfig");
            http.getGameConfig(
                handler.create(null, (res: any) => {
                    report("page_loading_getGameConfig_res", { code: res?.code });
                    if (netErrorPopup?.shouldPop(res)) {
                        console.warn(tag, "getGameConfig force-retry code=", res?.code);
                        netErrorPopup.showAndRetry(getGameConfig);
                        return;
                    }
                    console.log(tag, "getGameConfig success", JSON.stringify(res));
                    GameConfigStore.init(res.data);
                    setCache(CACHE_KEYS.GAME_CONFIG, res.data);
                    reportStep("gameConfig");
                    getUserInfo();
                }),
                handler.create(null, (err: any) => {
                    console.error(tag, "getGameConfig fail", err);
                    const cached = getCache(CACHE_KEYS.GAME_CONFIG);
                    if (cached) {
                        console.warn(tag, "getGameConfig 使用缓存");
                        GameConfigStore.init(cached);
                        reportStep("gameConfig");
                        getUserInfo();
                    } else if (netErrorPopup?.shouldPop(err)) {
                        console.warn(tag, "getGameConfig 无缓存 + 网络异常，弹重试窗");
                        netErrorPopup.showAndRetry(getGameConfig);
                    } else {
                        console.warn(tag, "getGameConfig 无缓存，继续 getUserInfo");
                        reportStep("gameConfig");
                        getUserInfo();
                    }
                })
            );
        };

        const getSystemConfig = () => {
            console.log(tag, "getSystemConfig");
            report("page_loading_getSystemConfig");
            http.getSystemConfig(
                handler.create(null, (res: any) => {
                    report("page_loading_getSystemConfig_res", { code: res?.code });
                    if (netErrorPopup?.shouldPop(res)) {
                        console.warn(tag, "getSystemConfig force-retry code=", res?.code);
                        netErrorPopup.showAndRetry(getSystemConfig);
                        return;
                    }
                    console.log(tag, "getSystemConfig success", JSON.stringify(res));
                    SystemDataStore.init_config(res.data);
                    setCache(CACHE_KEYS.SYSTEM_CONFIG, res.data);
                    try {
                        LanguageHelper.setType(ClientDataStore.local_country);
                        LanguageService.setByCountryCode(ClientDataStore.local_country);
                    } catch (err) {
                        console.error(tag, "LanguageHelper.setType fail(continue)", err);
                    }
                    reportStep("systemConfig");
                    getGameConfig();
                }),
                handler.create(null, (err: any) => {
                    console.error(tag, "getSystemConfig fail", err);
                    const cached = getCache(CACHE_KEYS.SYSTEM_CONFIG);
                    if (cached) {
                        console.warn(tag, "getSystemConfig 使用缓存");
                        SystemDataStore.init_config(cached);
                        try {
                            LanguageHelper.setType(ClientDataStore.local_country);
                            LanguageService.setByCountryCode(ClientDataStore.local_country);
                        } catch (langErr) {
                            console.error(tag, "LanguageHelper.setType fail(continue)", langErr);
                        }
                        reportStep("systemConfig");
                        getGameConfig();
                    } else {
                        console.warn(tag, "getSystemConfig 无缓存，继续 autoLogin");
                        try {
                            LanguageHelper.setType(ClientDataStore.local_country);
                            LanguageService.setByCountryCode(ClientDataStore.local_country);
                        } catch (langErr) {
                            console.error(tag, "LanguageHelper.setType fail(continue)", langErr);
                        }
                        reportStep("systemConfig");
                        getGameConfig();
                    }
                })
            );
        };

        const touristsLogin = () => {
            console.log(tag, "touristsLogin");
            report("page_loading_touristsLogin");
            http.touristsLogin(
                null,
                handler.create(null, (res: any) => {
                    if (netErrorPopup?.shouldPop(res)) {
                        console.warn(tag, "touristsLogin force-retry code=", res?.code);
                        netErrorPopup.showAndRetry(touristsLogin);
                        return;
                    }
                    console.log(tag, "touristsLogin success", JSON.stringify(res));
                    report("register_success", { login_type: "tourists" });
                    PlayerDataStore.initUserId(res.data);
                    setCache(CACHE_KEYS.LOGIN_USER_ID, res.data);
                    reportStep("login");
                    getSystemConfig();
                }),
                handler.create(null, (err: any) => {
                    let errJson = "";
                    try {
                        errJson = JSON.stringify(err);
                    } catch {
                        errJson = String(err);
                    }
                    console.error(tag, "touristsLogin fail json=", errJson);
                    const cached = getCache(CACHE_KEYS.LOGIN_USER_ID);
                    if (cached?.yid) {
                        console.warn(tag, "touristsLogin 使用缓存登录态");
                        PlayerDataStore.initUserId(cached);
                        reportStep("login");
                        getSystemConfig();
                    } else if (netErrorPopup?.shouldPop(err)) {
                        console.warn(tag, "touristsLogin 无缓存 + 网络异常，弹重试窗");
                        netErrorPopup.showAndRetry(touristsLogin);
                    } else {
                        report("register_fail", {
                            login_type: "tourists",
                            err_code: err?.code ?? "",
                            err_msg: err?.message || "",
                        });
                        console.warn(tag, "touristsLogin 无缓存登录态，继续拉配置");
                        reportStep("login");
                        getSystemConfig();
                    }
                })
            );
        };

        const autoLogin = () => {
            console.log(tag, "autoLogin");
            report("page_loading_autoLogin_start");
            report("autoLogin_start", { timeStemp: Date.now() });
            http.autoLogin(
                null,
                handler.create(null, (res: any) => {
                    report("autoLogin_end", { timeStemp: Date.now() });
                    if (netErrorPopup?.shouldPop(res)) {
                        console.warn(tag, "autoLogin force-retry code=", res?.code);
                        netErrorPopup.showAndRetry(autoLogin);
                        return;
                    }
                    let resJson = "";
                    try {
                        resJson = JSON.stringify(res);
                    } catch {
                        resJson = "[json stringify failed]";
                    }
                    console.log(tag, "autoLogin success yid=", res?.data?.yid, "res_json=", resJson);
                    if (res?.data?.yid) {
                        report("page_loading_autoLogin_success");
                        report("register_success", { login_type: "auto" });
                        PlayerDataStore.initUserId(res.data);
                        setCache(CACHE_KEYS.LOGIN_USER_ID, res.data);
                        reportStep("login");
                        getSystemConfig();
                    } else {
                        report("u_login_page_show");
                        touristsLogin();
                    }
                }),
                handler.create(null, (err: any) => {
                    report("autoLogin_end", { timeStemp: Date.now() });
                    console.error(tag, "autoLogin fail", err);
                    touristsLogin();
                })
            );
        };

        autoLogin();
    } catch (err) {
        logBridgeError(tag + " runBaseFlow 初始化失败", err);
        if (onComplete) {
            onComplete();
        } else {
            onFallback?.();
        }
    }
}
