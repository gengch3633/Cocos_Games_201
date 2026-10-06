declare const jsb: any;

type HotUpdateListener = (code: number, data?: Record<string, unknown>) => void;
type CheckListener = (canUpdate: boolean) => void;
type GrayVersionCallback = (result: false | { code: number; url?: string }) => void;

export default class HotUpdate {
    private static _instance: HotUpdate = null;

    private _updating = false;
    private _canRetry = false;
    private _failCount = 0;
    private _canUpdate = false;
    private _checkListener: CheckListener = null;
    private _updateListener: HotUpdateListener = null;
    private _baseVersion: string = null;
    private _curVersion: string = null;
    private _isOnlineRelease: boolean = null;
    private _storagePath: string = null;
    private _am: any = null;
    versionCompareHandle: ((versionA: string, versionB: string) => number) = null;

    constructor() {
        if (!cc.sys.isBrowser && cc.sys.isNative) {
            this._storagePath = (jsb.fileUtils ? jsb.fileUtils.getWritablePath() : "/") + "remote-asset";
            cc.log("Storage path for remote asset : " + this._storagePath);
            this.versionCompareHandle = (versionA: string, versionB: string) => {
                cc.log("JS Custom Version Compare: version A is " + versionA + ", version B is " + versionB);
                const partsA = versionA.split(".");
                const partsB = versionB.split(".");
                for (let i = 0; i < partsA.length; ++i) {
                    const a = parseInt(partsA[i]);
                    const b = parseInt(partsB[i] || "0");
                    if (a !== b) {
                        return a - b;
                    }
                }
                return partsB.length > partsA.length ? -1 : 0;
            };
            this._am = new jsb.AssetsManager("", this._storagePath, this.versionCompareHandle);
            this._am.setVerifyCallback((_path: string, asset: { compressed: boolean; md5: string; path: string }) => {
                if (asset.compressed) {
                    console.log("Verification passed : " + asset.path);
                    return true;
                }
                console.log("Verification passed : " + asset.path + " (" + asset.md5 + ")");
                return true;
            });
            console.log("Hot update is ready, please check or directly update.");
        }
    }

    get canRetry(): boolean {
        return this._canRetry;
    }

    get failCount(): number {
        return this._failCount;
    }

    get canUpdate(): boolean {
        return this._canUpdate;
    }

    set checkListener(listener: CheckListener) {
        this._checkListener = listener;
    }

    set updateListener(listener: HotUpdateListener) {
        this._updateListener = listener;
    }

    static getInstance(): HotUpdate {
        return HotUpdate._instance || (HotUpdate._instance = new HotUpdate());
    }

    getBaseVersion(): string {
        if (this._baseVersion != null) {
            return this._baseVersion;
        }
        if (cc.sys.isBrowser || !cc.sys.isNative) {
            return "1.1.5.2";
        }
        if (!jsb.fileUtils.isFileExist("projectCfg.json")) {
            return "";
        }
        const content = jsb.fileUtils.getStringFromFile("projectCfg.json");
        console.log("getProjectCfg", content);
        if (content != null && content != "") {
            const config = JSON.parse(content);
            const isRelease = config.version == "release" || config.version == "prod";
            console.log("isRelease", isRelease);
            this._isOnlineRelease = isRelease;
            const baseVersion = config.base_version;
            console.log("BaseVersion", baseVersion);
            this._baseVersion = baseVersion;
            return baseVersion;
        }
        return "";
    }

    updateCb(event: any): void {
        let finished = false;
        let shouldStop = false;
        const code = event.getEventCode();
        const payload: Record<string, unknown> = { code };
        switch (code) {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                console.log("No local manifest file found, hot update skipped.");
                shouldStop = true;
                break;
            case jsb.EventAssetsManager.UPDATE_PROGRESSION:
                payload.byte_percent = event.getPercent();
                payload.file_percent = event.getPercentByFile();
                payload.file_downloaded = event.getDownloadedFiles();
                payload.file_total = event.getTotalFiles();
                payload.byte_downloaded = event.getDownloadedBytes();
                payload.byte_total = event.getTotalBytes();
                {
                    const message = event.getMessage();
                    if (message) {
                        console.log("Updated file: " + message);
                    }
                }
                break;
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
                console.log("Fail to download manifest file, hot update skipped1.");
                shouldStop = true;
                break;
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                console.log("Fail to parse manifest file, hot update skipped1.");
                shouldStop = true;
                break;
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                console.log("Already up to date with the latest remote version.");
                shouldStop = true;
                break;
            case jsb.EventAssetsManager.UPDATE_FINISHED:
                console.log("Update finished. " + event.getMessage());
                finished = true;
                break;
            case jsb.EventAssetsManager.UPDATE_FAILED:
                console.log("Update failed. " + event.getMessage());
                this._updating = false;
                this._canRetry = true;
                shouldStop = true;
                break;
            case jsb.EventAssetsManager.ERROR_UPDATING:
                console.log("Asset update error: " + event.getAssetId() + ", " + event.getMessage());
                shouldStop = true;
                break;
            case jsb.EventAssetsManager.ERROR_DECOMPRESS:
                console.log("Asset decompress" + event.getMessage());
                shouldStop = true;
                break;
        }
        if (shouldStop) {
            this._am.setEventCallback(null);
            this._updating = false;
            if (this._updateListener) {
                this._updateListener(-1, payload);
                this._updateListener = null;
            }
        } else if (finished) {
            this._am.setEventCallback(null);
            const searchPaths = jsb.fileUtils.getSearchPaths();
            const newPaths = this._am.getLocalManifest().getSearchPaths();
            console.log("newPaths", JSON.stringify(newPaths));
            Array.prototype.unshift.apply(searchPaths, newPaths);
            cc.sys.localStorage.setItem("HotUpdateSearchPaths", JSON.stringify(searchPaths));
            jsb.fileUtils.setSearchPaths(searchPaths);
            this._updateListener = null;
            cc.audioEngine.stopAll();
            cc.game.restart();
        } else {
            this._updateListener && this._updateListener(0, payload);
        }
    }

    getVersion(): string {
        if (this._curVersion != null) {
            return this._curVersion;
        }
        return cc.sys.isNative ? this._initManifest() : "1.1.5.2";
    }

    hotUpdate(listener?: HotUpdateListener): void {
        if (!cc.sys.isBrowser && cc.sys.isNative) {
            if (listener) {
                this._updateListener = listener;
            }
            if (this._am && !this._updating) {
                this._am.setEventCallback(this.updateCb.bind(this));
                this._initManifest();
                this._failCount = 0;
                this._am.update();
                this._updating = true;
            }
        } else {
            listener && listener(-1, {});
        }
    }

    retry(): void {
        if (!this._updating && this._canRetry) {
            this._canRetry = false;
            console.log("Retry failed Assets...");
            this._am.downloadFailedAssets();
        }
    }

    private _initManifest(): string {
        if (cc.sys.isNative) {
            if (this._am.getState() === jsb.AssetsManager.State.UNINITED) {
                this._am.loadLocalManifest("project.manifest");
            }
            const manifest = this._am.getLocalManifest();
            const version = manifest ? manifest.getVersion() : "1.0.0.0";
            console.log("local manifest version", manifest ? manifest.getVersion() : "load failed");
            console.log("local version url", manifest ? manifest.getVersionFileUrl() : "load failed");
            this._curVersion = version;
            return version;
        }
    }

    checkCb(event: any): void {
        this._canUpdate = false;
        cc.log("Code: " + event.getEventCode());
        switch (event.getEventCode()) {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                console.log("No local manifest file found, hot update skipped.");
                break;
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
                console.log("Fail to download manifest file, hot update skipped0.");
                break;
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                console.log("Fail to parse manifest file, hot update skipped0.");
                break;
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                console.log("Already up to date with the latest remote version.");
                break;
            case jsb.EventAssetsManager.NEW_VERSION_FOUND:
                console.log("New version found, please try to update. (" + this._am.getTotalBytes() + ")");
                this._canUpdate = true;
                break;
            default:
                return;
        }
        this._am.setEventCallback(null);
        this._updating = false;
        this._checkListener && this._checkListener(this._canUpdate);
    }

    getGrayVersion(url: string, callback: GrayVersionCallback): void {
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
            if (xhr.readyState == 4) {
                if (xhr.status >= 200 && xhr.status < 400) {
                    const responseText = xhr.responseText;
                    if (responseText) {
                        if (callback) {
                            console.log("返回版本信息");
                            console.log(responseText);
                            callback(JSON.parse(responseText));
                        }
                    } else {
                        console.log("返回数据不存在");
                        callback && callback(false);
                    }
                } else {
                    console.log("请求失败");
                }
            }
        };
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.send();
        xhr.addEventListener("abort", () => {
            cc.log("testlogin abort");
            callback(false);
        });
        xhr.addEventListener("error", () => {
            cc.log("testlogin error");
            callback && callback(false);
        });
        xhr.addEventListener("timeout", () => {
            cc.log("testlogin timeout");
            callback && callback(false);
        });
    }

    checkGrayUpdate(url: string, callback?: CheckListener): void {
        console.log("checkGrayUpdate", url);
        if (!cc.sys.isBrowser && cc.sys.isNative) {
            if (this._updating) {
                console.log("Checking or updating ...");
            } else {
                this._am.setEventCallback(this.checkCb.bind(this));
                if (callback) {
                    this._checkListener = callback;
                }
                this._initManifest();
                if (this._am.getLocalManifest() && this._am.getLocalManifest().isLoaded()) {
                    const self = this;
                    const tempVersionPath = this._storagePath + "_temp/version.manifest.temp";
                    const tempProjectPath = this._storagePath + "_temp/project.manifest.temp";
                    this.getGrayVersion(url, (result) => {
                        if (result && result.code == 1) {
                            const downloader = new jsb.Downloader();
                            downloader.createDownloadFileTask(result.url, tempVersionPath, "@temp_version");
                            downloader.setOnTaskError((task: any, errorCode: number, internalCode: number, errorStr: string) => {
                                console.log("errorCode = ", errorCode);
                                console.log("errorCodeInternal = ", internalCode);
                                console.log("errorStr = ", errorStr);
                                console.log("error task = ", task.identifier);
                                self._updating = false;
                                callback && callback(false);
                            });
                            downloader.setOnTaskProgress((task: any, bytesReceived: number, totalBytesReceived: number, totalBytesExpected: number) => {
                                if (task.identifier == "@temp_manifest") {
                                    console.log("manifest downloaded ", bytesReceived);
                                    console.log("manifest total received", totalBytesReceived);
                                    console.log("manifest total expected ", totalBytesExpected);
                                } else {
                                    console.log("version downloaded ", bytesReceived);
                                    console.log("version total received", totalBytesReceived);
                                    console.log("version total expected ", totalBytesExpected);
                                }
                            });
                            downloader.setOnFileTaskSuccess((task: any) => {
                                if (task.identifier == "@temp_manifest") {
                                    console.log("manifest download success");
                                    const remoteManifest = new jsb.Manifest(tempProjectPath);
                                    self._am.loadRemoteManifest(remoteManifest);
                                } else {
                                    console.log("version download success");
                                    const tempManifest = new jsb.Manifest(tempVersionPath);
                                    const remoteVersion = tempManifest.getVersion();
                                    jsb.fileUtils.removeFile(tempVersionPath);
                                    console.log("local version", self._curVersion);
                                    console.log("remote version", remoteVersion);
                                    if (self.versionCompareHandle(self._curVersion, remoteVersion) < 0) {
                                        console.log("tempManifest", tempProjectPath, tempManifest.getManifestFileUrl());
                                        downloader.createDownloadFileTask(
                                            tempManifest.getManifestFileUrl(),
                                            tempProjectPath,
                                            "@temp_manifest"
                                        );
                                    } else {
                                        self._updating = false;
                                        callback && callback(false);
                                    }
                                }
                            });
                        } else {
                            self._updating = false;
                            callback && callback(false);
                        }
                    });
                    this._updating = true;
                } else {
                    console.log("Failed to load local manifest ...");
                }
            }
        } else {
            callback && callback(false);
        }
    }

    isOnlineRelease(): boolean {
        if (this._isOnlineRelease != null) {
            return this._isOnlineRelease;
        }
        if (!cc.sys.isNative) {
            return false;
        }
        if (!jsb.fileUtils.isFileExist("projectCfg.json")) {
            return false;
        }
        const content = jsb.fileUtils.getStringFromFile("projectCfg.json");
        console.log("getProjectCfg", content);
        if (content != null && content != "") {
            const config = JSON.parse(content);
            const isRelease = config.version == "release" || config.version == "prod";
            console.log("isRelease", isRelease);
            this._isOnlineRelease = isRelease;
            const baseVersion = config.base_version;
            console.log("BaseVersion", baseVersion);
            this._baseVersion = baseVersion;
            return isRelease;
        }
        return false;
    }

    checkUpdate(callback?: CheckListener): void {
        if (cc.sys.isNative) {
            if (this._updating) {
                console.log("Checking or updating ...");
            } else {
                this._am.setEventCallback(this.checkCb.bind(this));
                if (callback) {
                    this._checkListener = callback;
                }
                this._initManifest();
                if (this._am.getLocalManifest() && this._am.getLocalManifest().isLoaded()) {
                    this._am.checkUpdate();
                    this._updating = true;
                } else {
                    console.log("Failed to load local manifest ...");
                }
            }
        } else {
            callback && callback(false);
        }
    }
}
