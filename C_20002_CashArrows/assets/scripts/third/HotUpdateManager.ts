import { BUSINESS_COMMON_CONFIG } from "./BusinessCommonConfig";
import CryptoHelper from "./CryptoHelper";
import ClientDataStore from "./ClientDataStore";

declare const jsb: {
    fileUtils: {
        getWritablePath(): string;
        isFileExist(path: string): boolean;
        getStringFromFile(path: string): string;
        removeFile(path: string): void;
        getSearchPaths(): string[];
        setSearchPaths(paths: string[]): void;
    };
    AssetsManager: new (url: string, storagePath: string, compare: (a: string, b: string) => number) => AssetsManagerInstance;
    Manifest: new (content: string, storagePath: string) => ManifestInstance;
    Downloader: new () => DownloaderInstance;
    EventAssetsManager: Record<string, number>;
};

interface AssetsManagerInstance {
    setVerifyCallback(callback: () => boolean): void;
    getState(): number;
    loadLocalManifest(manifest: ManifestInstance, storagePath: string): void;
    getLocalManifest(): ManifestInstance | null;
    setEventCallback(callback: ((event: HotUpdateEvent) => void) | null): void;
    update(): void;
    downloadFailedAssets(): void;
    loadRemoteManifest(manifest: ManifestInstance): void;
}

interface ManifestInstance {
    getVersion(): string;
    isLoaded(): boolean;
    getManifestFileUrl(): string;
    getSearchPaths(): string[];
}

interface DownloaderInstance {
    createDownloadFileTask(url: string, path: string, identifier: string): void;
    setOnTaskError(callback: () => void): void;
    setOnTaskProgress(callback: () => void): void;
    setOnFileTaskSuccess(callback: (task: { identifier: string }) => void): void;
}

interface HotUpdateEvent {
    getEventCode(): number;
    getPercent(): number;
    getPercentByFile(): number;
    getDownloadedFiles(): number;
    getTotalFiles(): number;
    getDownloadedBytes(): number;
    getTotalBytes(): number;
}

interface UpdateProgressInfo {
    code: number;
    byte_percent?: number;
    file_percent?: number;
    file_downloaded?: number;
    file_total?: number;
    byte_downloaded?: number;
    byte_total?: number;
}

interface GrayVersionResponse {
    code: number;
    data?: { url: string };
}

export default class HotUpdateManager {
    private static _instance: HotUpdateManager | null = null;

    _updating = false;
    _canRetry = false;
    _failCount = 5;
    _canUpdate = false;
    _checkListener: ((canUpdate: boolean) => void) | null = null;
    _updateListener: ((code: number, info?: UpdateProgressInfo) => void) | null = null;
    _baseVersion: string | null = null;
    _curVersion: string | null = null;
    _isOnlineRelease: boolean | null = null;
    customManifestData = "";
    _storagePath = "";
    versionCompareHandle: (a: string, b: string) => number = () => 0;
    _am: AssetsManagerInstance | null = null;

    constructor() {
        if (cc.sys.isNative) {
            this._storagePath = (jsb.fileUtils ? jsb.fileUtils.getWritablePath() : "/") + "remote-asset";
            this.versionCompareHandle = (versionA, versionB) => {
                const partsA = versionA.split(".");
                const partsB = versionB.split(".");
                for (let i = 0; i < partsA.length; ++i) {
                    const a = parseInt(partsA[i], 10);
                    const b = parseInt(partsB[i] || "0", 10);
                    if (a !== b) {
                        return a - b;
                    }
                }
                return partsB.length > partsA.length ? -1 : 0;
            };
            this._am = new jsb.AssetsManager("", this._storagePath, this.versionCompareHandle);
            this._am.setVerifyCallback(() => true);
        }
    }

    static getInstance(): HotUpdateManager {
        if (!this._instance) {
            this._instance = new HotUpdateManager();
        }
        return this._instance;
    }

    _initManifestStr(data: string): void {
        this.customManifestData = data;
    }

    _initManifest(): string | undefined {
        if (cc.sys.isNative && this._am) {
            if (this._am.getState() === (jsb.AssetsManager as unknown as { State: { UNINITED: number } }).State?.UNINITED) {
                const manifest = new jsb.Manifest(this.customManifestData, this._storagePath);
                this._am.loadLocalManifest(manifest, this._storagePath);
            }
            const localManifest = this._am.getLocalManifest();
            this._curVersion = localManifest ? localManifest.getVersion() : "1.0.0.0";
            return this._curVersion;
        }
        return undefined;
    }

    getVersion(): string {
        if (this._curVersion != null) {
            return this._curVersion;
        }
        return cc.sys.isNative ? this._initManifest() || "1.0.0.0" : "1.0.0.18";
    }

    getBaseVersion(): string {
        if (this._baseVersion != null) {
            return this._baseVersion;
        }
        if (cc.sys.os === cc.sys.OS_IOS) {
            if (!jsb.fileUtils.isFileExist("projectCfg.json")) {
                return "";
            }
            const content = jsb.fileUtils.getStringFromFile("projectCfg.json");
            if (content) {
                const config = JSON.parse(content);
                this._isOnlineRelease = config.version === "release" || config.version === "prod";
                this._baseVersion = config.base_version;
                return this._baseVersion;
            }
            return "";
        }
        this._baseVersion = BUSINESS_COMMON_CONFIG.baseVersion;
        return this._baseVersion;
    }

    checkCb = (event: HotUpdateEvent): void => {
        this._canUpdate = false;
        switch (event.getEventCode()) {
            case jsb.EventAssetsManager.NEW_VERSION_FOUND:
                this._canUpdate = true;
                break;
        }
        this._am?.setEventCallback(null);
        this._updating = false;
        this._checkListener?.call(this, this._canUpdate);
    };

    updateCb = (event: HotUpdateEvent): void => {
        let finished = false;
        let failed = false;
        const code = event.getEventCode();
        const info: UpdateProgressInfo = { code };

        switch (code) {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
            case jsb.EventAssetsManager.ERROR_DECOMPRESS:
                failed = true;
                break;

            case jsb.EventAssetsManager.UPDATE_PROGRESSION:
                info.byte_percent = event.getPercent();
                info.file_percent = event.getPercentByFile();
                info.file_downloaded = event.getDownloadedFiles();
                info.file_total = event.getTotalFiles();
                info.byte_downloaded = event.getDownloadedBytes();
                info.byte_total = event.getTotalBytes();
                break;

            case jsb.EventAssetsManager.UPDATE_FINISHED:
                finished = true;
                break;

            case jsb.EventAssetsManager.UPDATE_FAILED:
            case jsb.EventAssetsManager.ERROR_UPDATING:
                this._updating = false;
                this._canRetry = true;
                if (this._failCount-- > 0) {
                    setTimeout(() => this.retry(), 1000);
                } else {
                    failed = true;
                }
                break;
        }

        if (failed) {
            this._am?.setEventCallback(null);
            this._updating = false;
            this._updateListener?.call(this, -1, info);
            this._updateListener = null;
        } else if (finished) {
            this._am?.setEventCallback(null);
            const searchPaths = jsb.fileUtils.getSearchPaths();
            const manifestPaths = this._am?.getLocalManifest()?.getSearchPaths() || [];
            Array.prototype.unshift.apply(searchPaths, manifestPaths);
            jsb.fileUtils.setSearchPaths(searchPaths);
            this._updateListener = null;
            cc.audioEngine.stopAll();
            cc.game.restart();
        } else {
            this._updateListener?.call(this, 0, info);
        }
    };

    retry(): void {
        if (!this._updating && this._canRetry && this._am) {
            this._canRetry = false;
            this._am.downloadFailedAssets();
        }
    }

    hotUpdate(listener?: (code: number, info?: UpdateProgressInfo) => void): void {
        if (cc.sys.isNative) {
            this._updateListener = listener || null;
            if (this._am && !this._updating) {
                this._am.setEventCallback(this.updateCb.bind(this));
                this._initManifest();
                this._failCount = 5;
                this._am.update();
                this._updating = true;
            }
        } else {
            listener?.(-1, {});
        }
    }

    checkGrayUpdate(url: string, body: string, listener?: (canUpdate: boolean) => void): void {
        if (cc.sys.isNative) {
            if (!this._updating && this._am) {
                this._am.setEventCallback(this.checkCb.bind(this));
                this._checkListener = listener || null;
                this._initManifest();
                if (this._am.getLocalManifest()?.isLoaded()) {
                    const self = this;
                    const tempVersionPath = this._storagePath + "_temp/version.manifest.temp";
                    const tempManifestPath = this._storagePath + "_temp/project.manifest.temp";
                    this.getGrayVersion(url, body, (response) => {
                        if (response && response.code === 1) {
                            const downloader = new jsb.Downloader();
                            if (response.data) {
                                downloader.createDownloadFileTask(response.data.url, tempVersionPath, "@temp_version");
                            }
                            downloader.setOnTaskError(() => {
                                self._updating = false;
                                listener?.(false);
                            });
                            downloader.setOnTaskProgress(() => {});
                            downloader.setOnFileTaskSuccess((task) => {
                                if (task.identifier === "@temp_manifest") {
                                    self._am!.loadRemoteManifest(new jsb.Manifest(tempManifestPath));
                                } else {
                                    const manifest = new jsb.Manifest(tempVersionPath);
                                    const remoteVersion = manifest.getVersion();
                                    jsb.fileUtils.removeFile(tempVersionPath);
                                    if (self.versionCompareHandle(self._curVersion || "", remoteVersion) < 0) {
                                        downloader.createDownloadFileTask(manifest.getManifestFileUrl(), tempManifestPath, "@temp_manifest");
                                    } else {
                                        self._updating = false;
                                        listener?.(false);
                                    }
                                }
                            });
                        } else {
                            self._updating = false;
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

    getGrayVersion(url: string, body: string, callback: (response: GrayVersionResponse | false) => void): void {
        const request = new XMLHttpRequest();
        request.onreadystatechange = () => {
            if (request.readyState === 4 && request.status >= 200 && request.status < 400) {
                if (request.responseText) {
                    let text = CryptoHelper.decrypt(request.responseText, ClientDataStore.box_pkg_name);
                    if (!text) {
                        text = request.responseText;
                    }
                    callback(JSON.parse(text));
                } else {
                    callback(false);
                }
            }
        };
        request.open("POST", url, true);
        request.setRequestHeader("Content-type", "text/plain");
        request.send(body);
        request.addEventListener("abort", () => callback(false));
        request.addEventListener("error", () => callback(false));
        request.addEventListener("timeout", () => callback(false));
    }
}
