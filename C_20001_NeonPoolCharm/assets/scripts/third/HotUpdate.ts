declare const jsb: any;

class HotUpdate {
    private _updating = false;
    private _canRetry = false;
    private _failCount = 0;
    private _canUpdate = false;
    private _checkListener: (canUpdate: boolean) => void = null;
    private _updateListener: (code: number, info?: any) => void = null;
    private _baseVersion: string = null;
    private _curVersion: string = null;
    private _isOnlineRelease: boolean = null;
    private _storagePath: string = null;
    private _am: any = null;
    versionCompareHandle: (versionA: string, versionB: string) => number = null;

    private static _instance: HotUpdate = null;

    constructor() {
        if (!cc.sys.isBrowser && cc.sys.isNative) {
            this._storagePath = (jsb.fileUtils ? jsb.fileUtils.getWritablePath() : "/") + "remote-asset";
            cc.log("Storage path for remote asset : " + this._storagePath);
            this.versionCompareHandle = (versionA: string, versionB: string) => {
                cc.log("JS Custom Version Compare: version A is " + versionA + ", version B is " + versionB);
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
            this._am.setVerifyCallback((_path: string, asset: any) => {
                const compressed = asset.compressed;
                const md5 = asset.md5;
                const filePath = asset.path;
                if (compressed) {
                    console.log("Verification passed : " + filePath);
                    return true;
                }
                console.log("Verification passed : " + filePath + " (" + md5 + ")");
                return true;
            });
            console.log("Hot update is ready, please check or directly update.");
        }
    }

    static getInstance(): HotUpdate {
        if (!HotUpdate._instance) {
            HotUpdate._instance = new HotUpdate();
        }
        return HotUpdate._instance;
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

    set checkListener(listener: (canUpdate: boolean) => void) {
        this._checkListener = listener;
    }

    set updateListener(listener: (code: number, info?: any) => void) {
        this._updateListener = listener;
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
        let done = false;
        const code = event.getEventCode();
        const info: any = { code };
        switch (code) {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                console.log("No local manifest file found, hot update skipped.");
                done = true;
                break;
            case jsb.EventAssetsManager.UPDATE_PROGRESSION:
                info.byte_percent = event.getPercent();
                info.file_percent = event.getPercentByFile();
                info.file_downloaded = event.getDownloadedFiles();
                info.file_total = event.getTotalFiles();
                info.byte_downloaded = event.getDownloadedBytes();
                info.byte_total = event.getTotalBytes();
                const message = event.getMessage();
                if (message) {
                    console.log("Updated file: " + message);
                }
                break;
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
                console.log("Fail to download manifest file, hot update skipped1.");
                done = true;
                break;
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                console.log("Fail to parse manifest file, hot update skipped1.");
                done = true;
                break;
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                console.log("Already up to date with the latest remote version.");
                done = true;
                break;
            case jsb.EventAssetsManager.UPDATE_FINISHED:
                console.log("Update finished. " + event.getMessage());
                finished = true;
                break;
            case jsb.EventAssetsManager.UPDATE_FAILED:
                console.log("Update failed. " + event.getMessage());
                this._updating = false;
                this._canRetry = true;
                done = true;
                break;
            case jsb.EventAssetsManager.ERROR_UPDATING:
                console.log("Asset update error: " + event.getAssetId() + ", " + event.getMessage());
                done = true;
                break;
            case jsb.EventAssetsManager.ERROR_DECOMPRESS:
                console.log("Asset decompress" + event.getMessage());
                done = true;
        }
        if (done) {
            this._am.setEventCallback(null);
            this._updating = false;
            if (this._updateListener) {
                this._updateListener(-1, info);
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
        } else if (this._updateListener) {
            this._updateListener(0, info);
        }
    }

    getVersion(): string {
        if (this._curVersion != null) {
            return this._curVersion;
        }
        if (cc.sys.isNative) {
            return this._initManifest();
        }
        return "1.1.5.2";
    }

    hotUpdate(listener?: (code: number, info?: any) => void): void {
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
        } else if (listener) {
            listener(-1, {});
        }
    }

    retry(): void {
        if (!this._updating && this._canRetry) {
            this._canRetry = false;
            console.log("Retry failed Assets...");
            this._am.downloadFailedAssets();
        }
    }

    _initManifest(): string {
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
        if (this._checkListener) {
            this._checkListener(this._canUpdate);
        }
    }

    getGrayVersion(url: string, callback: (result: any) => void): void {
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
            if (xhr.readyState == 4) {
                if (xhr.status >= 200 && xhr.status < 400) {
                    const responseText = xhr.responseText;
                    if (responseText) {
                        if (callback) {
                            console.log("返回版本信息");
                            console.log(responseText);
                            const data = JSON.parse(responseText);
                            callback(data);
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

    checkGrayUpdate(url: string, callback?: (canUpdate: boolean) => void): void {
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
                        if (result.code == 1) {
                            const downloader = new jsb.Downloader();
                            downloader.createDownloadFileTask(result.url, tempVersionPath, "@temp_version");
                            downloader.setOnTaskError((_task: any, errorCode: any, internalCode: any, errorStr: any) => {
                                console.log("errorCode = ", errorCode);
                                console.log("errorCodeInternal = ", internalCode);
                                console.log("errorStr = ", errorStr);
                                console.log("error task = ", _task.identifier);
                                self._updating = false;
                                callback && callback(false);
                            });
                            downloader.setOnTaskProgress((task: any, bytesReceived: any, totalBytesReceived: any, totalBytesExpected: any) => {
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
                                    const manifest = new jsb.Manifest(tempProjectPath);
                                    self._am.loadRemoteManifest(manifest);
                                } else {
                                    console.log("version download success");
                                    const versionManifest = new jsb.Manifest(tempVersionPath);
                                    const remoteVersion = versionManifest.getVersion();
                                    jsb.fileUtils.removeFile(tempVersionPath);
                                    console.log("local version", self._curVersion);
                                    console.log("remote version", remoteVersion);
                                    if (self.versionCompareHandle(self._curVersion, remoteVersion) < 0) {
                                        console.log("tempManifest", tempProjectPath, versionManifest.getManifestFileUrl());
                                        downloader.createDownloadFileTask(
                                            versionManifest.getManifestFileUrl(),
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

    checkUpdate(callback?: (canUpdate: boolean) => void): void {
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

export default HotUpdate;
