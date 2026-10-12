export interface LoadingHttpError {
    code?: number | string;
    message?: string;
}

export interface LoadingResult<T = any> {
    code?: number;
    message?: string;
    data?: T;
}

export interface LoadingUserData {
    yid?: string;
    [key: string]: any;
}

export interface LoadingRuntime {
    report(eventName: string, data?: any): void;
    onShowWxLogin?(): void;
    onLoginReady(): void;
    onFinish(): void;
    onUpdateProgress(percent: number): void;
}

export interface BaseFlowDeps {
    onReconnectFail(): void;
    onReconnectSuccess(): void;
    handleHttpErr(error: any, onRetry: (error: any) => void): void;
    showToast(message?: string): void;
    emitCloseReconnect(): void;
    isPermanentLogoutError(error: any): boolean;
    getAutoLoginPayload(): any;
    requestAutoLogin(payload: any, onSuccess: (result: LoadingResult<LoadingUserData>) => void, onFail: (error: LoadingHttpError) => void): void;
    getTouristsLoginPayload(): any;
    requestTouristsLogin(payload: any, onSuccess: (result: LoadingResult<LoadingUserData>) => void, onFail: (error: any) => void): void;
    applyUserId(data?: LoadingUserData): void;
    requestSystemConfig(onSuccess: (result: LoadingResult) => void, onFail: (error: any) => void): void;
    applySystemConfig(data?: any): void;
    requestGameConfig(onSuccess: (result: LoadingResult) => void, onFail: (error: any) => void): void;
    applyGameConfig(data?: any): void;
    requestUserInfo(onSuccess: (result: LoadingResult) => void, onFail: (error: any) => void): void;
    applyUserInfo(data?: any): void;
    applyMiddleFunds(): void;
}

export interface HotUpdateDeps {
    isHotUpdateEnabled(): boolean;
    afterFinish(): void;
    getCurrentBaseVersion(): string;
    buildManifestUrl(version: string): string;
    loadRemoteManifest(url: string, onComplete: (error: any, manifest: any) => void): void;
    initManifest(nativeAsset?: any): void;
    buildVersionRequest(): { url: string; body: any };
    checkGrayUpdate(url: string, body: any, onComplete: (canUpdate: boolean) => void): void;
    runHotUpdate(onProgress: (progress: number, data: any) => void): void;
    isProgressEvent(data: any): boolean;
    getProgressPercent(data: any): number;
}

export interface LoadingProjectConfig {
    bootstrap: any;
    sceneProgress: any;
    sdk: any;
    agreement: any;
    lifecycle: any;
    baseFlow: BaseFlowDeps;
    hotUpdate: HotUpdateDeps;
}

export interface LoadingProjectAdapterOverrides {
    bootstrap: any;
    sceneProgress: any;
    sdk: any;
    agreement: any;
    lifecycle: any;
    baseFlow: {
        startFlow(runtime: LoadingRuntime): void;
    };
    hotUpdate: {
        start(runtime: LoadingRuntime): void;
    };
}

interface FlowOptions<Deps> {
    deps: Deps;
    runtime: LoadingRuntime;
}

type HttpErrorHandler = (error: any) => void;

const LoadingErrorCode = {
    WX_LOGIN_REQUIRED: -8888,
    SHOW_TOAST: -1012,
    USER_INFO_IGNORE: -777
};

function createHttpErrRetryHandler(deps: BaseFlowDeps, closeReconnect: boolean | undefined, retry: HttpErrorHandler): HttpErrorHandler {
    return function (error: any): void {
        if (closeReconnect) {
            deps.onReconnectFail();
        }
        deps.handleHttpErr(error, function (handledError: any): void {
            retry(handledError);
        });
    };
}

function createBaseFlow(options: FlowOptions<BaseFlowDeps>): { start(): void } {
    const deps = options.deps;
    const runtime = options.runtime;

    function autoLogin(closeReconnect?: boolean): void {
        runtime.report("page_loading_autoLogin_start");
        runtime.report("autoLogin_start", { timeStemp: new Date().getTime() });
        deps.requestAutoLogin(
            deps.getAutoLoginPayload(),
            function (result: LoadingResult<LoadingUserData>): void {
                runtime.report("autoLogin_end", { timeStemp: new Date().getTime() });
                const yid = result?.data?.yid || "";
                if (closeReconnect) {
                    deps.emitCloseReconnect();
                }
                if (yid) {
                    runtime.report("page_loading_autoLogin_success");
                    runtime.report("register_success", { login_type: "auto" });
                    deps.applyUserId(result.data);
                    getSystemConfig();
                } else {
                    runtime.report("u_login_page_show");
                    touristsLogin();
                }
            },
            function (error: LoadingHttpError): void {
                if (deps.isPermanentLogoutError(error)) {
                    runtime.report("register_fail", {
                        login_type: "auto",
                        err_code: error && error.code !== undefined ? error.code : "",
                        err_msg: error && error.message ? error.message : ""
                    });
                    deps.showToast(error.message);
                } else {
                    createHttpErrRetryHandler(deps, closeReconnect, autoLogin)(error);
                }
            }
        );
    }

    function touristsLogin(closeReconnect?: boolean): void {
        runtime.report("page_loading_touristsLogin");
        deps.requestTouristsLogin(
            deps.getTouristsLoginPayload(),
            function (result: LoadingResult<LoadingUserData>): void {
                if (closeReconnect) {
                    deps.emitCloseReconnect();
                }
                runtime.report("page_loading_touristsLogin_res", result);
                if (result.code === LoadingErrorCode.WX_LOGIN_REQUIRED) {
                    runtime.report("u_show_wx_login");
                    if (runtime.onShowWxLogin) {
                        runtime.onShowWxLogin();
                    }
                } else if (result.code === LoadingErrorCode.SHOW_TOAST) {
                    runtime.report("register_fail", {
                        login_type: "tourists",
                        err_code: result.code,
                        err_msg: result.message || ""
                    });
                    deps.showToast(result.message);
                } else {
                    runtime.report("register_success", { login_type: "tourists" });
                    deps.applyUserId(result.data);
                    getSystemConfig();
                }
            },
            createHttpErrRetryHandler(deps, closeReconnect, touristsLogin)
        );
    }

    function getSystemConfig(closeReconnect?: boolean): void {
        runtime.report("page_loading_getSystemConfig");
        deps.requestSystemConfig(
            function (result: LoadingResult): void {
                runtime.report("page_loading_getSystemConfig_res", { code: result.code });
                if (closeReconnect) {
                    deps.onReconnectSuccess();
                }
                deps.applySystemConfig(result.data);
                getGameConfig();
            },
            createHttpErrRetryHandler(deps, closeReconnect, getSystemConfig)
        );
    }

    function getGameConfig(closeReconnect?: boolean): void {
        runtime.report("page_loading_getGameConfig");
        deps.requestGameConfig(
            function (result: LoadingResult): void {
                if (closeReconnect) {
                    deps.onReconnectSuccess();
                }
                runtime.report("page_loading_getGameConfig_res", { code: result.code });
                deps.applyGameConfig(result.data);
                getUserInfo();
            },
            createHttpErrRetryHandler(deps, closeReconnect, getGameConfig)
        );
    }

    function getUserInfo(closeReconnect?: boolean): void {
        runtime.report("page_loading_getUserInfo");
        deps.requestUserInfo(
            function (result: LoadingResult): void {
                runtime.report("page_loading_getUserInfo_code", { code: result.code });
                if (!result || result.code !== LoadingErrorCode.USER_INFO_IGNORE) {
                    if (closeReconnect) {
                        deps.onReconnectSuccess();
                    }
                    deps.applyUserInfo(result.data);
                    deps.applyMiddleFunds();
                    runtime.onLoginReady();
                }
            },
            createHttpErrRetryHandler(deps, closeReconnect, getUserInfo)
        );
    }

    return {
        start(): void {
            autoLogin();
        }
    };
}

function createHotUpdateFlow(options: FlowOptions<HotUpdateDeps>): { start(): void } {
    const deps = options.deps;
    const runtime = options.runtime;

    function finishInit(): void {
        deps.afterFinish();
        runtime.report("page_loading_finishInit");
        runtime.onFinish();
    }

    function checkHotUpdate(): void {
        runtime.report("page_loading_check_HP");
        const baseVersion = deps.getCurrentBaseVersion();
        const manifestUrl = deps.buildManifestUrl(baseVersion);
        deps.loadRemoteManifest(manifestUrl, function (error: any, manifest: any): void {
            if (error) {
                finishInit();
                return;
            }
            runtime.report("page_loading_getManifest");
            deps.initManifest(manifest != null ? manifest._nativeAsset : undefined);
            runtime.report("page_loading_hotUpdate");
            const versionRequest = deps.buildVersionRequest();
            deps.checkGrayUpdate(versionRequest.url, versionRequest.body, function (canUpdate: boolean): void {
                if (canUpdate) {
                    runtime.report("page_loading_canUpdate");
                    deps.runHotUpdate(function (progress: number, data: any): void {
                        if (progress < 0) {
                            runtime.onUpdateProgress(0.5);
                            runtime.report("page_loading_finish_up");
                            finishInit();
                        } else if (deps.isProgressEvent(data)) {
                            runtime.onUpdateProgress(deps.getProgressPercent(data));
                        }
                    });
                } else {
                    runtime.report("page_loading_notUpdate");
                    finishInit();
                }
            });
        });
    }

    return {
        start(): void {
            if (deps.isHotUpdateEnabled()) {
                checkHotUpdate();
            } else {
                runtime.report("page_loading_No_HP");
                finishInit();
            }
        }
    };
}

export function createLoadingProjectAdapterOverrides(config: LoadingProjectConfig): LoadingProjectAdapterOverrides {
    return {
        bootstrap: config.bootstrap,
        sceneProgress: config.sceneProgress,
        sdk: config.sdk,
        agreement: config.agreement,
        lifecycle: config.lifecycle,
        baseFlow: {
            startFlow(runtime: LoadingRuntime): void {
                createBaseFlow({ deps: config.baseFlow, runtime: runtime }).start();
            }
        },
        hotUpdate: {
            start(runtime: LoadingRuntime): void {
                createHotUpdateFlow({ deps: config.hotUpdate, runtime: runtime }).start();
            }
        }
    };
}