const LOGIN_CODES = {
    WX_LOGIN_REQUIRED: -8888,
    SHOW_TOAST: -1012,
    USER_INFO_IGNORE: -777
};

function createRetryHandler(deps: any, onSuccess: () => void, retry: () => void) {
    return function (error: any): void {
        deps.onReconnectFail?.();
        deps.handleHttpErr(error, () => retry());
    };
}

function createBaseFlow(deps: any, runtime: any) {
    const autoLogin = (onSuccess: () => void): void => {
        runtime.report("page_loading_autoLogin_start");
        runtime.report("autoLogin_start", { timeStemp: new Date().getTime() });
        deps.requestAutoLogin(deps.getAutoLoginPayload(), (response: any) => {
            runtime.report("autoLogin_end", { timeStemp: new Date().getTime() });
            const yid = response?.data?.yid || "";
            onSuccess && deps.emitCloseReconnect();
            if (yid) {
                runtime.report("page_loading_autoLogin_success");
                runtime.report("register_success", { login_type: "auto" });
                deps.applyUserId(response.data);
                getSystemConfig();
            } else {
                runtime.report("u_login_page_show");
                touristsLogin(onSuccess);
            }
        }, createRetryHandler(deps, onSuccess, autoLogin));
    };

    const touristsLogin = (onSuccess: () => void): void => {
        runtime.report("page_loading_touristsLogin");
        deps.requestTouristsLogin(deps.getTouristsLoginPayload(), (response: any) => {
            onSuccess && deps.emitCloseReconnect();
            runtime.report("page_loading_touristsLogin_res", response);
            if (response.code !== LOGIN_CODES.WX_LOGIN_REQUIRED) {
                if (response.code !== LOGIN_CODES.SHOW_TOAST) {
                    runtime.report("register_success", { login_type: "tourists" });
                    deps.applyUserId(response.data);
                    getSystemConfig();
                } else {
                    runtime.report("register_fail", {
                        login_type: "tourists",
                        err_code: response.code,
                        err_msg: response.message || ""
                    });
                    deps.showToast(response.message);
                }
            } else {
                runtime.report("u_show_wx_login");
                runtime.onShowWxLogin && runtime.onShowWxLogin();
            }
        }, createRetryHandler(deps, onSuccess, touristsLogin));
    };

    const getSystemConfig = (onSuccess?: () => void): void => {
        runtime.report("page_loading_getSystemConfig");
        deps.requestSystemConfig((response: any) => {
            runtime.report("page_loading_getSystemConfig_res", { code: response.code });
            onSuccess && deps.onReconnectSuccess();
            deps.applySystemConfig(response.data);
            getGameConfig(onSuccess);
        }, createRetryHandler(deps, onSuccess, () => getSystemConfig(onSuccess)));
    };

    const getGameConfig = (onSuccess?: () => void): void => {
        runtime.report("page_loading_getGameConfig");
        deps.requestGameConfig((response: any) => {
            onSuccess && deps.onReconnectSuccess();
            runtime.report("page_loading_getGameConfig_res", { code: response.code });
            deps.applyGameConfig(response.data);
            getUserInfo(onSuccess);
        }, createRetryHandler(deps, onSuccess, () => getGameConfig(onSuccess)));
    };

    const getUserInfo = (onSuccess?: () => void): void => {
        runtime.report("page_loading_getUserInfo");
        deps.requestUserInfo((response: any) => {
            runtime.report("page_loading_getUserInfo_code", { code: response.code });
            if (!response || response.code !== LOGIN_CODES.USER_INFO_IGNORE) {
                onSuccess && deps.onReconnectSuccess();
                deps.applyUserInfo(response.data);
                deps.applyMiddleFunds();
                runtime.onLoginReady();
            }
        }, createRetryHandler(deps, onSuccess, () => getUserInfo(onSuccess)));
    };

    return {
        start(): () => void {
            return autoLogin(null);
        }
    };
}

function createHotUpdateFlow(deps: any, runtime: any) {
    const finish = (): void => {
        deps.afterFinish();
        runtime.report("page_loading_finishInit");
        runtime.onFinish();
    };

    const checkHotUpdate = (): void => {
        runtime.report("page_loading_check_HP");
        const baseVersion = deps.getCurrentBaseVersion();
        const manifestUrl = deps.buildManifestUrl(baseVersion);
        deps.loadRemoteManifest(manifestUrl, (error: any, asset: any) => {
            if (error) {
                finish();
            } else {
                runtime.report("page_loading_getManifest");
                deps.initManifest(asset?._nativeAsset);
                runtime.report("page_loading_hotUpdate");
                const versionRequest = deps.buildVersionRequest();
                deps.checkGrayUpdate(versionRequest.url, versionRequest.body, (canUpdate: boolean) => {
                    if (canUpdate) {
                        runtime.report("page_loading_canUpdate");
                        deps.runHotUpdate((code: number, event: any) => {
                            if (code < 0) {
                                runtime.onUpdateProgress(0.5);
                                runtime.report("page_loading_finish_up");
                                finish();
                            } else if (deps.isProgressEvent(event)) {
                                runtime.onUpdateProgress(deps.getProgressPercent(event));
                            }
                        });
                    } else {
                        runtime.report("page_loading_notUpdate");
                        finish();
                    }
                });
            }
        });
    };

    return {
        start(): void {
            if (deps.isHotUpdateEnabled()) {
                checkHotUpdate();
            } else {
                runtime.report("page_loading_No_HP");
                finish();
            }
        }
    };
}

export function createLoadingProjectAdapterOverrides(deps: any): any {
    return {
        bootstrap: deps.bootstrap,
        sceneProgress: deps.sceneProgress,
        sdk: deps.sdk,
        agreement: deps.agreement,
        lifecycle: deps.lifecycle,
        baseFlow: {
            startFlow(runtime: any): void {
                createBaseFlow(deps.baseFlow, runtime).start();
            }
        },
        hotUpdate: {
            start(runtime: any): void {
                createHotUpdateFlow(deps.hotUpdate, runtime).start();
            }
        }
    };
}
