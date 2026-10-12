import BusinessCommonConfig from "./BusinessCommonConfig";
import ClientDataStore from "./ClientDataStore";
import CryptoHelper from "./CryptoHelper";

interface UpdateProgressData {
    code: number;
    byte_percent?: number;
    file_percent?: number;
    file_downloaded?: number;
    file_total?: number;
    byte_downloaded?: number;
    byte_total?: number;
    [key: string]: any;
}

export default class HotUpdateManager {
    private static _instance: HotUpdateManager | null = null;

    private _updating: boolean = false;
    private _canRetry: boolean = false;
    private _failCount: number = 5;
    private _canUpdate: boolean = false;
    private _checkListener: ((canUpdate: boolean) => void) | null = null;
    private _updateListener: ((code: number, data: UpdateProgressData) => void) | null = null;
    private _baseVersion: string | null = null;
    private _curVersion: string | null = null;
    private _isOnlineRelease: boolean | null = null;

    private _storagePath!: string;
    private _am!: jsb.AssetsManager;

    public versionCompareHandle!: (versionA: string, versionB: string) => number;
    public customManifestData: string = "";

    constructor() {
        if (cc.sys.isNative) {
            this._storagePath = (jsb.fileUtils ? jsb.fileUtils.getWritablePath() : "/") + "remote-asset";
            this.versionCompareHandle = (versionA: string, versionB: string): number => {
                const partsA = versionA.split(".");
                const partsB = versionB.split(".");
                for (let i = 0; i < partsA.length; ++i) {
                    const numA = parseInt(partsA[i]);
                    const numB = parseInt(partsB[i] || "0");
                    if (numA !== numB) {
                        return numA - numB;
                    }
                }
                return partsB.length > partsA.length ? -1 : 0;
            };
            this._am = new jsb.AssetsManager("", this._storagePath, this.versionCompareHandle);
            this._am.setVerifyCallback(() => true);
        }
    }

    public static getInstance(): HotUpdateManager {
        if (!this._instance) {
            this._instance = new HotUpdateManager();
        }
        return this._instance;
    }

    public _initManifestStr(customManifestData: string): void {
        this.customManifestData = customManifestData;
    }

    public _initManifest(): string | undefined {
        if (cc.sys.isNative) {
            if (this._am.getState() === jsb.AssetsManager.State.UNINITED) {
                const manifest = new jsb.Manifest(this.customManifestData, this._storagePath);
                this._am.loadLocalManifest(manifest, this._storagePath);
            }
            const localManifest = this._am.getLocalManifest();
            this._curVersion = localManifest ? localManifest.getVersion() : "1.0.0.0";
            return this._curVersion;
        }
        return undefined;
    }

    public getVersion(): string {
        if (this._curVersion != null) {
            return this._curVersion;
        }
        return cc.sys.isNative ? this._initManifest()! : "1.0.0.18";
    }

    public getBaseVersion(): string {
        if (this._baseVersion != null) {
            return this._baseVersion;
        }
        if (cc.sys.os === cc.sys.OS_IOS) {
            if (!jsb.fileUtils.isFileExist("projectCfg.json")) {
                return "";
            }
            const content = jsb.fileUtils.getStringFromFile("projectCfg.json");
            if (content) {
                const cfg = JSON.parse(content);
                this._isOnlineRelease = cfg.version === "release" || cfg.version === "prod";
                this._baseVersion = cfg.base_version;
                return this._baseVersion!;
            }
            return "";
        }
        this._baseVersion = BusinessCommonConfig.BUSINESS_COMMON_CONFIG.baseVersion;
        return this._baseVersion;
    }

    public checkCb(event: jsb.EventAssetsManager): void {
        this._canUpdate = false;
        switch (event.getEventCode()) {
            case jsb.EventAssetsManager.NEW_VERSION_FOUND:
                this._canUpdate = true;
                break;
        }
        this._am.setEventCallback(null as any);
        this._updating = false;
        this._checkListener?.call(this, this._canUpdate);
    }

    public updateCb(event: jsb.EventAssetsManager): void {
        let isFinished = false;
        let isFailed = false;
        const eventCode = event.getEventCode();
        const data: UpdateProgressData = { code: eventCode };
        switch (eventCode) {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
            case jsb.EventAssetsManager.ERROR_DECOMPRESS:
                isFailed = true;
                break;
            case jsb.EventAssetsManager.UPDATE_PROGRESSION:
                data.byte_percent = event.getPercent();
                data.file_percent = event.getPercentByFile();
                data.file_downloaded = event.getDownloadedFiles();
                data.file_total = event.getTotalFiles();
                data.byte_downloaded = event.getDownloadedBytes();
                data.byte_total = event.getTotalBytes();
                break;
            case jsb.EventAssetsManager.UPDATE_FINISHED:
                isFinished = true;
                break;
            case jsb.EventAssetsManager.UPDATE_FAILED:
            case jsb.EventAssetsManager.ERROR_UPDATING:
                this._updating = false;
                this._canRetry = true;
                if (this._failCount-- > 0) {
                    setTimeout(() => this.retry(), 1000);
                } else {
                    isFailed = true;
                }
                break;
        }
        if (isFailed) {
            this._am.setEventCallback(null as any);
            this._updating = false;
            this._updateListener?.call(this, -1, data);
            this._updateListener = null;
        } else if (isFinished) {
            this._am.setEventCallback(null as any);
            const searchPaths = jsb.fileUtils.getSearchPaths();
            searchPaths.unshift(...this._am.getLocalManifest()!.getSearchPaths());
            jsb.fileUtils.setSearchPaths(searchPaths);
            this._updateListener = null;
            cc.audioEngine.stopAll();
            cc.game.restart();
        } else {
            this._updateListener?.call(this, 0, data);
        }
    }

    public retry(): void {
        if (!this._updating && this._canRetry) {
            this._canRetry = false;
            this._am.downloadFailedAssets();
        }
    }

    public hotUpdate(listener: ((code: number, data: UpdateProgressData) => void) | null): void {
        if (cc.sys.isNative) {
            this._updateListener = listener;
            if (this._am && !this._updating) {
                this._am.setEventCallback(this.updateCb.bind(this));
                this._initManifest();
                this._failCount = 5;
                this._am.update();
                this._updating = true;
            }
        } else {
            listener?.(-1, { code: -1 });
        }
    }

    public checkGrayUpdate(url: string, data: any, listener: ((result: any) => void) | null): void {
        if (cc.sys.isNative) {
            if (!this._updating) {
                this._am.setEventCallback(this.checkCb.bind(this));
                this._checkListener = listener;
                this._initManifest();
                if (this._am.getLocalManifest()?.isLoaded()) {
                    const versionTempPath = this._storagePath + "_temp/version.manifest.temp";
                    const manifestTempPath = this._storagePath + "_temp/project.manifest.temp";
                    this.getGrayVersion(url, data, (result: any) => {
                        if (result.code == 1) {
                            const downloader = new jsb.Downloader();
                            if (result.data) {
                                downloader.createDownloadFileTask(result.data.url, versionTempPath, "@temp_version");
                            }
                            downloader.setOnTaskError(() => {
                                this._updating = false;
                                listener?.(false);
                            });
                            downloader.setOnTaskProgress(() => {});
                            downloader.setOnFileTaskSuccess((task: any) => {
                                if (task.identifier === "@temp_manifest") {
                                    this._am.loadRemoteManifest(new jsb.Manifest(manifestTempPath));
                                } else {
                                    const versionManifest = new jsb.Manifest(versionTempPath);
                                    const version = versionManifest.getVersion();
                                    jsb.fileUtils.removeFile(versionTempPath);
                                    if (this.versionCompareHandle(this._curVersion!, version) < 0) {
                                        downloader.createDownloadFileTask(versionManifest.getManifestFileUrl(), manifestTempPath, "@temp_manifest");
                                    } else {
                                        this._updating = false;
                                        listener?.(false);
                                    }
                                }
                            });
                        } else {
                            this._updating = false;
                            listener?.(false);
                        }
                    });
                    this._updating = true;
                }
            }
        } else {
            listener?.(false);
        }
    }

    public getGrayVersion(url: string, data: any, callback: (result: any) => void): void {
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4 && xhr.status >= 200 && xhr.status < 400) {
                if (xhr.responseText) {
                    let content = CryptoHelper.decrypt(xhr.responseText, ClientDataStore.box_pkg_name);
                    if (!content) {
                        content = xhr.responseText;
                    }
                    callback(JSON.parse(content));
                } else {
                    callback(false);
                }
            }
        };
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-type", "text/plain");
        xhr.send(data);
        xhr.addEventListener("abort", () => callback(false));
        xhr.addEventListener("error", () => callback(false));
        xhr.addEventListener("timeout", () => callback(false));
    }
}