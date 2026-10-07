const ERROR_CODES = {
    WX_LOGIN_REQUIRED: -8888,
    SHOW_TOAST: -1012,
    USER_INFO_IGNORE: -777,
};

function createHttpErrHandler(deps: any, closeReconnect: boolean, retryFn: () => void) {
    return (err: any) => {
        if (closeReconnect) {
            deps.onReconnectFail();
        }
        deps.handleHttpErr(err, () => retryFn());
    };
}

function createBaseFlowRunner(deps: any, runtime: any) {
    const autoLogin = (closeReconnect?: boolean) => {
        runtime.report("page_loading_autoLogin_start");
        runtime.report("autoLogin_start", { timeStemp: new Date().getTime() });
        deps.requestAutoLogin(deps.getAutoLoginPayload(), (res: any) => {
            runtime.report("autoLogin_end", { timeStemp: new Date().getTime() });
            const yid = res?.data?.yid || "";
            if (closeReconnect) {
                deps.emitCloseReconnect();
            }
            if (yid) {
                runtime.report("page_loading_autoLogin_success");
                runtime.report("register_success", { login_type: "auto" });
                deps.applyUserId(res.data);
                fetchSystemConfig();
            } else {
                runtime.report("u_login_page_show");
                touristsLogin();
            }
        }, (err: any) => {
            if (deps.isPermanentLogoutError(err)) {
                runtime.report("register_fail", {
                    login_type: "auto",
                    err_code: err && err.code !== undefined ? err.code : "",
                    err_msg: err && err.message ? err.message : "",
                });
                deps.showToast(err.message);
            } else {
                createHttpErrHandler(deps, !!closeReconnect, autoLogin)(err);
            }
        });
    };

    const touristsLogin = (closeReconnect?: boolean) => {
        runtime.report("page_loading_touristsLogin");
        deps.requestTouristsLogin(deps.getTouristsLoginPayload(), (res: any) => {
            if (closeReconnect) {
                deps.emitCloseReconnect();
            }
            runtime.report("page_loading_touristsLogin_res", res);
            if (res.code !== ERROR_CODES.WX_LOGIN_REQUIRED) {
                if (res.code !== ERROR_CODES.SHOW_TOAST) {
                    runtime.report("register_success", { login_type: "tourists" });
                    deps.applyUserId(res.data);
                    fetchSystemConfig();
                } else {
                    runtime.report("register_fail", {
                        login_type: "tourists",
                        err_code: res.code,
                        err_msg: res.message || "",
                    });
                    deps.showToast(res.message);
                }
            } else {
                runtime.report("u_show_wx_login");
                if (runtime.onShowWxLogin) {
                    runtime.onShowWxLogin();
                }
            }
        }, createHttpErrHandler(deps, !!closeReconnect, touristsLogin));
    };

    const fetchSystemConfig = (closeReconnect?: boolean) => {
        runtime.report("page_loading_getSystemConfig");
        deps.requestSystemConfig((res: any) => {
            runtime.report("page_loading_getSystemConfig_res", { code: res.code });
            if (closeReconnect) {
                deps.onReconnectSuccess();
            }
            deps.applySystemConfig(res.data);
            fetchGameConfig();
        }, createHttpErrHandler(deps, !!closeReconnect, fetchSystemConfig));
    };

    const fetchGameConfig = (closeReconnect?: boolean) => {
        runtime.report("page_loading_getGameConfig");
        deps.requestGameConfig((res: any) => {
            if (closeReconnect) {
                deps.onReconnectSuccess();
            }
            runtime.report("page_loading_getGameConfig_res", { code: res.code });
            deps.applyGameConfig(res.data);
            fetchUserInfo();
        }, createHttpErrHandler(deps, !!closeReconnect, fetchGameConfig));
    };

    const fetchUserInfo = (closeReconnect?: boolean) => {
        runtime.report("page_loading_getUserInfo");
        deps.requestUserInfo((res: any) => {
            runtime.report("page_loading_getUserInfo_code", { code: res.code });
            if (!res || res.code !== ERROR_CODES.USER_INFO_IGNORE) {
                if (closeReconnect) {
                    deps.onReconnectSuccess();
                }
                deps.applyUserInfo(res.data);
                deps.applyMiddleFunds();
                runtime.onLoginReady();
            }
        }, createHttpErrHandler(deps, !!closeReconnect, fetchUserInfo));
    };

    return {
        start: () => autoLogin(),
    };
}

function createHotUpdateRunner(deps: any, runtime: any) {
    const finish = () => {
        deps.afterFinish();
        runtime.report("page_loading_finishInit");
        runtime.onFinish();
    };

    const checkHotUpdate = () => {
        runtime.report("page_loading_check_HP");
        const baseVersion = deps.getCurrentBaseVersion();
        const manifestUrl = deps.buildManifestUrl(baseVersion);
        deps.loadRemoteManifest(manifestUrl, (err: any, asset: any) => {
            if (err) {
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
        start: () => {
            if (deps.isHotUpdateEnabled()) {
                checkHotUpdate();
            } else {
                runtime.report("page_loading_No_HP");
                finish();
            }
        },
    };
}

export function createLoadingProjectAdapterOverrides(config: any): any {
    return {
        bootstrap: config.bootstrap,
        sceneProgress: config.sceneProgress,
        sdk: config.sdk,
        agreement: config.agreement,
        lifecycle: config.lifecycle,
        baseFlow: {
            startFlow: (runtime: any) => {
                createBaseFlowRunner(config.baseFlow, runtime).start();
            },
        },
        hotUpdate: {
            start: (runtime: any) => {
                createHotUpdateRunner(config.hotUpdate, runtime).start();
            },
        },
    };
}
