import { BUSINESS_COMMON_CONFIG } from "./BusinessCommonConfig";
import ClientDataStore from "./ClientDataStore";
import EventSystem, { CLOSE_RECONNECT } from "./EventSystem";
import GameConfigStore from "./GameConfigStore";
import GameHelper from "./GameHelper";
import { globalErrorRegister } from "./GlobalErrorHandler";
import Handler from "./Handler";
import HotUpdateManager from "./HotUpdateManager";
import LanguageHelper from "./LanguageHelper";
import LoadingHttpService from "./LoadingHttpService";
import MiddleHelper from "./MiddleHelper";
import PlatformBridge from "./PlatformBridge";
import PlayerDataStore from "./PlayerDataStore";
import SystemDataStore from "./SystemDataStore";
import UIHelper from "./UIHelper";

function initSystem(): void {
    let yid = "yid_read_failed";
    try {
        yid = cc.sys.localStorage.getItem("yid") || "yid_read_failed";
    } catch (err) {
    }
    PlayerDataStore.initUserId({ yid });
    const clientInfo = PlatformBridge.getClientInfo();
    ClientDataStore.init(clientInfo);
}

export function buildStandardDeps(): any {
    return {
        bootstrap: {
            patchInstantiate(node: cc.Node): void {
                LanguageHelper.addMultilingualFont(node);
            },
            registerGlobalError(): void {
                globalErrorRegister(GameHelper.isDebug());
            },
            initPageManager(): void {
                UIHelper.init();
            },
            disableMultiTouch(): void {
                cc.macro.ENABLE_MULTI_TOUCH = false;
            },
            initLanguage(locale?: string): void {
                LanguageHelper.init(undefined, locale);
            },
            initSystem(): void {
                initSystem();
            },
            bindPilot(): void {
                PlatformBridge.bindPilot();
            },
            startMiddleCountryForWeb(): void {
                if (!cc.sys.isNative) {
                    MiddleHelper.middleCountry();
                }
            },
        },
        sceneProgress: {
            preloadTextures(onProgress: (current: number, total: number) => void): void {
                const dirs = GameHelper.getPreloadTextureDirs();
                let current = 0;
                if (dirs.length !== 0) {
                    dirs.forEach((dir: string) => {
                        cc.resources.preloadDir(dir, () => {
                            onProgress(++current, dirs.length);
                        });
                    });
                } else {
                    onProgress(1, 1);
                }
            },
            preloadScene(sceneName: string, onProgress: (completed: number, total: number) => void): void {
                cc.director.preloadScene(sceneName, onProgress);
            },
            getLoadingTasks(): any[] {
                return GameHelper.getLoadingTasks();
            },
            loadTask(task: any, callback: () => void): void {
                GameHelper.loadMvcPrefabAsync(task, callback);
            },
            isDebug(): boolean {
                return GameHelper.isDebug();
            },
        },
        sdk: undefined,
        agreement: undefined,
        lifecycle: undefined,
        baseFlow: {
            requestSystemConfig(onSuccess: (res: any) => void, onFail: (err: any) => void): void {
                LoadingHttpService.init((err: any, retry: () => void) => {
                    LoadingHttpService.reportHttpErr(err);
                    UIHelper.httpErr(err, retry);
                });
                LoadingHttpService.getSystemConfig(Handler.create(null, onSuccess), Handler.create(null, onFail));
            },
            requestAutoLogin(payload: any, onSuccess: (res: any) => void, onFail: (err: any) => void): void {
                LoadingHttpService.autoLogin(payload, Handler.create(null, onSuccess), Handler.create(null, onFail));
            },
            requestTouristsLogin(payload: any, onSuccess: (res: any) => void, onFail: (err: any) => void): void {
                LoadingHttpService.touristsLogin(payload, Handler.create(null, onSuccess), Handler.create(null, onFail));
            },
            requestGameConfig(onSuccess: (res: any) => void, onFail: (err: any) => void): void {
                LoadingHttpService.getGameConfig(Handler.create(null, onSuccess), Handler.create(null, onFail));
            },
            requestUserInfo(onSuccess: (res: any) => void, onFail: (err: any) => void): void {
                LoadingHttpService.getUserInfo(Handler.create(null, onSuccess), Handler.create(null, onFail));
            },
            handleHttpErr(err: any, retry: () => void): void {
                LoadingHttpService.reportHttpErr(err);
                UIHelper.httpErr(err, retry);
            },
            onReconnectSuccess(): void {
                UIHelper.reconnectSuc();
            },
            onReconnectFail(): void {
                UIHelper.reconnectFai();
            },
            emitCloseReconnect(): void {
                EventSystem.trigger(CLOSE_RECONNECT);
            },
            applySystemConfig(data: any): void {
                SystemDataStore.init_config(data);
                LanguageHelper.setType(ClientDataStore.local_country);
            },
            applyUserId(data: any): void {
                PlayerDataStore.initUserId(data);
            },
            applyGameConfig(data: any): void {
                GameConfigStore.init(data);
            },
            applyUserInfo(data: any): void {
                PlayerDataStore.init(data);
            },
            applyMiddleFunds(): void {
                MiddleHelper.initMiddleFundsPlatform();
            },
            showToast(message: string): void {
                UIHelper.showToast(message);
            },
            getAutoLoginPayload(): null {
                return null;
            },
            getTouristsLoginPayload(): null {
                return null;
            },
            isPermanentLogoutError(err: any): boolean {
                return !!(err && err.message && String(err.message).includes(BUSINESS_COMMON_CONFIG.permanentLogoutKeyword));
            },
        },
        hotUpdate: {
            isHotUpdateEnabled(): boolean {
                return MiddleHelper.isSupportHot && cc.sys.isNative;
            },
            getCurrentBaseVersion(): string {
                return HotUpdateManager.getInstance().getBaseVersion();
            },
            buildManifestUrl(baseVersion: string): string {
                return "" + SystemDataStore.getCDNUrl() + baseVersion + "/project.manifest";
            },
            loadRemoteManifest(url: string, callback: (err: any, asset: any) => void): void {
                cc.assetManager.loadRemote(url, (err: any, asset: any) => callback(err, asset));
            },
            initManifest(manifestStr: string): void {
                if (manifestStr) {
                    HotUpdateManager.getInstance()._initManifestStr(manifestStr);
                }
                HotUpdateManager.getInstance()._initManifest();
            },
            buildVersionRequest(): { url: string; body: any } {
                const url = SystemDataStore.get_version_url();
                const versionData = ClientDataStore.getVersionData();
                const bodyData = Object.assign({}, versionData, {
                    cy: LanguageHelper.languageType,
                    game_version: HotUpdateManager.getInstance().getVersion(),
                });
                const body = LoadingHttpService.buildHotUpdateBody(bodyData);
                return {
                    url: url + "?" + ClientDataStore.publicYWUrlParser("/" + url.split("/").pop()),
                    body,
                };
            },
            checkGrayUpdate(url: string, body: any, callback: (canUpdate: boolean) => void): void {
                HotUpdateManager.getInstance().checkGrayUpdate(url, body, callback);
            },
            runHotUpdate(callback: (code: number, event: any) => void): void {
                HotUpdateManager.getInstance().hotUpdate(callback);
            },
            isProgressEvent(event: any): boolean {
                return !!(event && event.code === 10);
            },
            getProgressPercent(event: any): number {
                return event?.byte_percent ?? 0;
            },
            afterFinish(): void {
                const version = HotUpdateManager.getInstance().getVersion();
                LoadingHttpService.setGameVersion(version);
                ClientDataStore.appendGameVersion(version);
            },
        },
    };
}
