import BusinessCommonConfig from "./BusinessCommonConfig";
import ClientDataStore from "./ClientDataStore";
import EventSystem from "./EventSystem";
import GameConfigStore from "./GameConfigStore";
import GameHelper from "./GameHelper";
import GlobalErrorHandler from "./GlobalErrorHandler";
import Handler from "./Handler";
import HotUpdateManager from "./HotUpdateManager";
import LanguageHelper from "./LanguageHelper";
import LoadingHttpService from "./LoadingHttpService";
import MiddleHelper from "./MiddleHelper";
import PlatformBridge from "./PlatformBridge";
import PlayerDataStore from "./PlayerDataStore";
import SystemDataStore from "./SystemDataStore";
import UIHelper from "./UIHelper";

cc._RF.push(module, "f8e48e1OuJOFKUBOiKvAJGV", "loading-standard-deps");

function initUserAndClientData(): void {
    let yid = "yid_read_failed";
    try {
        yid = cc.sys.localStorage.getItem("yid") || "yid_read_failed";
    } catch (err) {
    }

    PlayerDataStore.initUserId({
        yid: yid
    });

    const clientInfo = PlatformBridge.getClientInfo();
    ClientDataStore.init(clientInfo);
}

export function buildStandardDeps(): any {
    return {
        bootstrap: {
            patchInstantiate: function (target: any): void {
                LanguageHelper.addMultilingualFont(target);
            },
            registerGlobalError: function (): void {
                GlobalErrorHandler.globalErrorRegister(GameHelper.isDebug());
            },
            initPageManager: function (): void {
                UIHelper.init();
            },
            disableMultiTouch: function (): void {
                cc.macro.ENABLE_MULTI_TOUCH = false;
            },
            initLanguage: function (langType: string): void {
                LanguageHelper.init(void 0, langType);
            },
            initSystem: function (): void {
                initUserAndClientData();
            },
            bindPilot: function (): void {
                PlatformBridge.bindPilot();
            },
            startMiddleCountryForWeb: function (): void {
                if (!cc.sys.isNative) {
                    MiddleHelper.middleCountry();
                }
            }
        },
        sceneProgress: {
            preloadTextures: function (onProgress: (current: number, total: number) => void): void {
                const dirs: string[] = GameHelper.getPreloadTextureDirs();
                let finished = 0;
                if (dirs.length !== 0) {
                    dirs.forEach(function (dir: string): void {
                        (cc.resources as any).preloadDir(dir, function (): void {
                            onProgress(++finished, dirs.length);
                        });
                    });
                } else {
                    onProgress(1, 1);
                }
            },
            preloadScene: function (sceneName: string, onLoaded: (error: Error, sceneAsset: cc.SceneAsset) => void): void {
                cc.director.preloadScene(sceneName, onLoaded);
            },
            getLoadingTasks: function (): any {
                return GameHelper.getLoadingTasks();
            },
            loadTask: function (task: any, onLoaded: (error: Error, prefab: cc.Prefab) => void): void {
                GameHelper.loadMvcPrefabAsync(task, onLoaded);
            },
            isDebug: function (): boolean {
                return GameHelper.isDebug();
            }
        },
        sdk: void 0,
        agreement: void 0,
        lifecycle: void 0,
        baseFlow: {
            requestSystemConfig: function (onSuccess: (data: any) => void, onFail: (error: any) => void): void {
                LoadingHttpService.init(function (code: number, err: any): void {
                    LoadingHttpService.reportHttpErr(code);
                    UIHelper.httpErr(code, err);
                });
                LoadingHttpService.getSystemConfig(Handler.create(null, onSuccess), Handler.create(null, onFail));
            },
            requestAutoLogin: function (payload: any, onSuccess: (data: any) => void, onFail: (error: any) => void): void {
                LoadingHttpService.autoLogin(payload, Handler.create(null, onSuccess), Handler.create(null, onFail));
            },
            requestTouristsLogin: function (payload: any, onSuccess: (data: any) => void, onFail: (error: any) => void): void {
                LoadingHttpService.touristsLogin(payload, Handler.create(null, onSuccess), Handler.create(null, onFail));
            },
            requestGameConfig: function (onSuccess: (data: any) => void, onFail: (error: any) => void): void {
                LoadingHttpService.getGameConfig(Handler.create(null, onSuccess), Handler.create(null, onFail));
            },
            requestUserInfo: function (onSuccess: (data: any) => void, onFail: (error: any) => void): void {
                LoadingHttpService.getUserInfo(Handler.create(null, onSuccess), Handler.create(null, onFail));
            },
            handleHttpErr: function (code: number, onRetry: () => void): void {
                LoadingHttpService.reportHttpErr(code);
                UIHelper.httpErr(code, function (): void {
                    return onRetry();
                });
            },
            onReconnectSuccess: function (): void {
                UIHelper.reconnectSuc();
            },
            onReconnectFail: function (): void {
                UIHelper.reconnectFai();
            },
            emitCloseReconnect: function (): void {
                EventSystem.trigger(EventSystem.CLOSE_RECONNECT);
            },
            applySystemConfig: function (systemConfig: any): void {
                SystemDataStore.init_config(systemConfig);
                LanguageHelper.setType(ClientDataStore.local_country);
            },
            applyUserId: function (userId: any): void {
                PlayerDataStore.initUserId(userId);
            },
            applyGameConfig: function (gameConfig: any): void {
                GameConfigStore.init(gameConfig);
            },
            applyUserInfo: function (userInfo: any): void {
                PlayerDataStore.init(userInfo);
            },
            applyMiddleFunds: function (): void {
                MiddleHelper.initMiddleFundsPlatform();
            },
            showToast: function (message: string): void {
                UIHelper.showToast(message);
            },
            getAutoLoginPayload: function (): any {
                return null;
            },
            getTouristsLoginPayload: function (): any {
                return null;
            },
            isPermanentLogoutError: function (err: any): boolean {
                return !!(err && err.message) && String(err.message).includes(BusinessCommonConfig.BUSINESS_COMMON_CONFIG.permanentLogoutKeyword);
            }
        },
        hotUpdate: {
            isHotUpdateEnabled: function (): boolean {
                return MiddleHelper.isSupportHot && cc.sys.isNative;
            },
            getCurrentBaseVersion: function (): string {
                return HotUpdateManager.getInstance().getBaseVersion();
            },
            buildManifestUrl: function (dirName: string): string {
                return "" + SystemDataStore.getCDNUrl() + dirName + "/project.manifest";
            },
            loadRemoteManifest: function (url: string, onLoaded: (error: Error, manifest: any) => void): void {
                cc.assetManager.loadRemote(url, function (err: Error, asset: any): void {
                    return onLoaded(err, asset);
                });
            },
            initManifest: function (manifestStr: string): void {
                if (manifestStr) {
                    HotUpdateManager.getInstance()._initManifestStr(manifestStr);
                }
                HotUpdateManager.getInstance()._initManifest();
            },
            buildVersionRequest: function (): { url: string, body: any } {
                const versionUrl = SystemDataStore.get_version_url();
                const versionData = ClientDataStore.getVersionData();
                const params = {
                    ...versionData,
                    cy: LanguageHelper.languageType,
                    game_version: HotUpdateManager.getInstance().getVersion()
                };
                const body = LoadingHttpService.buildHotUpdateBody(params);
                return {
                    url: versionUrl + "?" + ClientDataStore.publicYWUrlParser("/" + versionUrl.split("/").pop()),
                    body: body
                };
            },
            checkGrayUpdate: function (grayUrl: string, version: string, onComplete: () => void): void {
                HotUpdateManager.getInstance().checkGrayUpdate(grayUrl, version, onComplete);
            },
            runHotUpdate: function (options: any): void {
                HotUpdateManager.getInstance().hotUpdate(options);
            },
            isProgressEvent: function (event: any): boolean {
                return !!event && event.code === 10;
            },
            getProgressPercent: function (event: any): number {
                return event && event.byte_percent != null ? event.byte_percent : 0;
            },
            afterFinish: function (): void {
                const version = HotUpdateManager.getInstance().getVersion();
                LoadingHttpService.setGameVersion(version);
                ClientDataStore.appendGameVersion(version);
            }
        }
    };
}

cc._RF.pop();