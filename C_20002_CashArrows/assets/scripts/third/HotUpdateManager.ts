import { BUSINESS_COMMON_CONFIG } from "./BusinessCommonConfig";
import ClientDataStore from "./ClientDataStore";
import CryptoHelper from "./CryptoHelper";

declare const jsb: any;

export default class HotUpdateManager {
    private static _instance: HotUpdateManager = null;

    _updating: boolean = false;
    _canRetry: boolean = false;
    _failCount: number = 5;
    _canUpdate: boolean = false;
    _checkListener: Function = null;
    _updateListener: Function = null;
    _baseVersion: string = null;
    _curVersion: string = null;
    _isOnlineRelease: boolean = null;
    customManifestData: string = "";
    _storagePath: string = "";
    versionCompareHandle: (a: string, b: string) => number = null;
    _am: any = null;

    constructor() {
        if (cc.sys.isNative) {
            this._storagePath = (jsb.fileUtils ? jsb.fileUtils.getWritablePath() : "/") + "remote-asset";
            this.versionCompareHandle = function (a: string, b: string) {
                const partsA = a.split(".");
                const partsB = b.split(".");
                for (let i = 0; i < partsA.length; ++i) {
                    const vA = parseInt(partsA[i]);
                    const vB = parseInt(partsB[i] || "0");
                    if (vA !== vB) {
                        return vA - vB;
                    }
                }
                return partsB.length > partsA.length ? -1 : 0;
            };
            this._am = new jsb.AssetsManager("", this._storagePath, this.versionCompareHandle);
            this._am.setVerifyCallback(function () {
                return true;
            });
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

    _initManifest(): string {
        if (cc.sys.isNative) {
            if (this._am.getState() === jsb.AssetsManager.State.UNINITED) {
                const manifest = new jsb.Manifest(this.customManifestData, this._storagePath);
                this._am.loadLocalManifest(manifest, this._storagePath);
            }
            const localManifest = this._am.getLocalManifest();
            this._curVersion = localManifest ? localManifest.getVersion() : "1.0.0.0";
            return this._curVersion;
        }
    }

    getVersion(): string {
        if (this._curVersion != null) {
            return this._curVersion;
        }
        return cc.sys.isNative ? this._initManifest() : "1.0.0.18";
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
                const cfg = JSON.parse(content);
                this._isOnlineRelease = cfg.version === "release" || cfg.version === "prod";
                this._baseVersion = cfg.base_version;
                return this._baseVersion;
            }
            return "";
        }
        this._baseVersion = BUSINESS_COMMON_CONFIG.baseVersion;
        return this._baseVersion;
    }

    checkCb(event: any): void {
        this._canUpdate = false;
        switch (event.getEventCode()) {
            case jsb.EventAssetsManager.NEW_VERSION_FOUND:
                this._canUpdate = true;
                break;
        }
        this._am.setEventCallback(null);
        this._updating = false;
        this._checkListener?.call(this, this._canUpdate);
    }

    updateCb(event: any): void {
        let finished = false;
        let failed = false;
        const code = event.getEventCode();
        const progress: any = { code };
        switch (code) {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
            case jsb.EventAssetsManager.ERROR_DECOMPRESS:
                failed = true;
                break;

            case jsb.EventAssetsManager.UPDATE_PROGRESSION:
                progress.byte_percent = event.getPercent();
                progress.file_percent = event.getPercentByFile();
                progress.file_downloaded = event.getDownloadedFiles();
                progress.file_total = event.getTotalFiles();
                progress.byte_downloaded = event.getDownloadedBytes();
                progress.byte_total = event.getTotalBytes();
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
            this._am.setEventCallback(null);
            this._updating = false;
            this._updateListener?.call(this, -1, progress);
            this._updateListener = null;
        } else if (finished) {
            this._am.setEventCallback(null);
            const searchPaths = jsb.fileUtils.getSearchPaths();
            Array.prototype.unshift.apply(searchPaths, this._am.getLocalManifest().getSearchPaths());
            jsb.fileUtils.setSearchPaths(searchPaths);
            this._updateListener = null;
            cc.audioEngine.stopAll();
            cc.game.restart();
        } else {
            this._updateListener?.call(this, 0, progress);
        }
    }

    retry(): void {
        if (!this._updating && this._canRetry) {
            this._canRetry = false;
            this._am.downloadFailedAssets();
        }
    }

    hotUpdate(listener: Function): void {
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
            listener?.(-1, {});
        }
    }

    checkGrayUpdate(url: string, body: string, listener: Function): void {
        if (cc.sys.isNative) {
            if (!this._updating) {
                this._am.setEventCallback(this.checkCb.bind(this));
                this._checkListener = listener;
                this._initManifest();
                if (this._am.getLocalManifest()?.isLoaded()) {
                    const self = this;
                    const versionTempPath = this._storagePath + "_temp/version.manifest.temp";
                    const projectTempPath = this._storagePath + "_temp/project.manifest.temp";
                    this.getGrayVersion(url, body, function (result: any) {
                        if (result.code == 1) {
                            const downloader = new jsb.Downloader();
                            if (result.data) {
                                downloader.createDownloadFileTask(result.data.url, versionTempPath, "@temp_version");
                            }
                            downloader.setOnTaskError(function () {
                                self._updating = false;
                                listener?.(false);
                            });
                            downloader.setOnTaskProgress(function () { });
                            downloader.setOnFileTaskSuccess(function (task: any) {
                                if (task.identifier === "@temp_manifest") {
                                    self._am.loadRemoteManifest(new jsb.Manifest(projectTempPath));
                                } else {
                                    const manifest = new jsb.Manifest(versionTempPath);
                                    const version = manifest.getVersion();
                                    jsb.fileUtils.removeFile(versionTempPath);
                                    if (self.versionCompareHandle(self._curVersion, version) < 0) {
                                        downloader.createDownloadFileTask(manifest.getManifestFileUrl(), projectTempPath, "@temp_manifest");
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

    getGrayVersion(url: string, body: string, callback: Function): void {
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status >= 200 && xhr.status < 400) {
                if (xhr.responseText) {
                    let text = CryptoHelper.decrypt(xhr.responseText, ClientDataStore.box_pkg_name);
                    if (!text) {
                        text = xhr.responseText;
                    }
                    callback(JSON.parse(text));
                } else {
                    callback(false);
                }
            }
        };
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-type", "text/plain");
        xhr.send(body);
        xhr.addEventListener("abort", () => callback(false));
        xhr.addEventListener("error", () => callback(false));
        xhr.addEventListener("timeout", () => callback(false));
    }
}
