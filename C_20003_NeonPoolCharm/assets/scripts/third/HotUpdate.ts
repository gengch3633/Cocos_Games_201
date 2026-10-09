export default class HotUpdate {

    _updating = false;
    _canRetry = false;
    _failCount = 0;
    _canUpdate = false;
    _checkListener = null;
    _updateListener = null;
    _baseVersion = null;
    _curVersion = null;
    _isOnlineRelease = null;
    _storagePath = null;
    versionCompareHandle = null;
    _am = null;

    static _instance: HotUpdate = null;

    constructor() {
        if (!cc.sys.isBrowser && cc.sys.isNative) {
            this._storagePath = (jsb.fileUtils ? jsb.fileUtils.getWritablePath() : "/") + "remote-asset";
            cc.log("Storage path for remote asset : " + this._storagePath);
            this.versionCompareHandle = function (versionA, versionB) {
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
            this._am.setVerifyCallback(function (path, asset) {
                const compressed = asset.compressed;
                const md5 = asset.md5;
                const assetPath = asset.path;
                asset.size;
                if (compressed) {
                    console.log("Verification passed : " + assetPath);
                    return true;
                }
                console.log("Verification passed : " + assetPath + " (" + md5 + ")");
                return true;
            });
            console.log("Hot update is ready, please check or directly update.");
        }
    }

    get canRetry() {
        return this._canRetry;
    }

    get failCount() {
        return this._failCount;
    }

    get canUpdate() {
        return this._canUpdate;
    }

    set checkListener(listener) {
        this._checkListener = listener;
    }

    set updateListener(listener) {
        this._updateListener = listener;
    }

    getBaseVersion() {
        if (null != this._baseVersion) {
            return this._baseVersion;
        }
        if (cc.sys.isBrowser || !cc.sys.isNative) {
            return "1.1.5.2";
        }
        if (!jsb.fileUtils.isFileExist("projectCfg.json")) {
            return "";
        }
        const text = jsb.fileUtils.getStringFromFile("projectCfg.json");
        console.log("getProjectCfg", text);
        if (null != text && "" != text) {
            const config = JSON.parse(text);
            const isRelease = "release" == config.version || "prod" == config.version;
            console.log("isRelease", isRelease);
            this._isOnlineRelease = isRelease;
            const baseVersion = config.base_version;
            console.log("BaseVersion", baseVersion);
            this._baseVersion = baseVersion;
            return baseVersion;
        }
        return "";
    }

    updateCb(event) {
        let finished = false;
        let failed = false;
        const code = event.getEventCode();
        const info: any = {
            code: code
        };
        switch (code) {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                console.log("No local manifest file found, hot update skipped.");
                failed = true;
                break;
            case jsb.EventAssetsManager.UPDATE_PROGRESSION:
                info.byte_percent = event.getPercent();
                info.file_percent = event.getPercentByFile();
                info.file_downloaded = event.getDownloadedFiles();
                info.file_total = event.getTotalFiles();
                info.byte_downloaded = event.getDownloadedBytes();
                info.byte_total = event.getTotalBytes();
                const message = event.getMessage();
                message && console.log("Updated file: " + message);
                break;
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
                console.log("Fail to download manifest file, hot update skipped1.");
                failed = true;
                break;
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                console.log("Fail to parse manifest file, hot update skipped1.");
                failed = true;
                break;
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                console.log("Already up to date with the latest remote version.");
                failed = true;
                break;
            case jsb.EventAssetsManager.UPDATE_FINISHED:
                console.log("Update finished. " + event.getMessage());
                finished = true;
                break;
            case jsb.EventAssetsManager.UPDATE_FAILED:
                console.log("Update failed. " + event.getMessage());
                this._updating = false;
                this._canRetry = true;
                failed = true;
                break;
            case jsb.EventAssetsManager.ERROR_UPDATING:
                console.log("Asset update error: " + event.getAssetId() + ", " + event.getMessage());
                failed = true;
                break;
            case jsb.EventAssetsManager.ERROR_DECOMPRESS:
                console.log("Asset decompress" + event.getMessage());
                failed = true;
        }
        if (failed) {
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
        } else {
            this._updateListener && this._updateListener(0, info);
        }
    }

    getVersion() {
        return null != this._curVersion ? this._curVersion : cc.sys.isNative ? this._initManifest() : "1.1.5.2";
    }

    hotUpdate(listener) {
        if (!cc.sys.isBrowser && cc.sys.isNative) {
            listener && (this._updateListener = listener);
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

    retry() {
        if (!this._updating && this._canRetry) {
            this._canRetry = false;
            console.log("Retry failed Assets...");
            this._am.downloadFailedAssets();
        }
    }

    _initManifest() {
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

    checkCb(event) {
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

    static getInstance() {
        this._instance || (HotUpdate._instance = new HotUpdate());
        return HotUpdate._instance;
    }

    getGrayVersion(url, callback) {
        const request = new XMLHttpRequest();
        request.onreadystatechange = function () {
            if (4 == request.readyState) {
                if (request.status >= 200 && request.status < 400) {
                    const text = request.responseText;
                    if (text) {
                        if (callback) {
                            console.log("返回版本信息");
                            console.log(text);
                            const data = JSON.parse(text);
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
        request.open("POST", url, true);
        request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        request.send();
        request.addEventListener("abort", function () {
            cc.log("testlogin abort");
            callback(false);
        });
        request.addEventListener("error", function () {
            cc.log("testlogin error");
            callback && callback(false);
        });
        request.addEventListener("timeout", function () {
            cc.log("testlogin timeout");
            callback && callback(false);
        });
    }

    checkGrayUpdate(url, callback) {
        console.log("checkGrayUpdate", url);
        if (!cc.sys.isBrowser && cc.sys.isNative) {
            if (this._updating) {
                console.log("Checking or updating ...");
            } else {
                this._am.setEventCallback(this.checkCb.bind(this));
                callback && (this._checkListener = callback);
                this._initManifest();
                if (this._am.getLocalManifest() && this._am.getLocalManifest().isLoaded()) {
                    const self = this;
                    const versionPath = this._storagePath + "_temp/version.manifest.temp";
                    const manifestPath = this._storagePath + "_temp/project.manifest.temp";
                    this.getGrayVersion(url, function (data) {
                        if (1 == data.code) {
                            const downloader = new jsb.Downloader();
                            downloader.createDownloadFileTask(data.url, versionPath, "@temp_version");
                            downloader.setOnTaskError(function (task, errorCode, errorCodeInternal, errorStr) {
                                console.log("errorCode = ", errorCode);
                                console.log("errorCodeInternal = ", errorCodeInternal);
                                console.log("errorStr = ", errorStr);
                                console.log("error task = ", task.identifier);
                                self._updating = false;
                                callback && callback(false);
                            });
                            downloader.setOnTaskProgress(function (task, bytesReceived, totalBytesReceived, totalBytesExpected) {
                                if ("@temp_manifest" == task.identifier) {
                                    console.log("manifest downloaded ", bytesReceived);
                                    console.log("manifest total received", totalBytesReceived);
                                    console.log("manifest total expected ", totalBytesExpected);
                                } else {
                                    console.log("version downloaded ", bytesReceived);
                                    console.log("version total received", totalBytesReceived);
                                    console.log("version total expected ", totalBytesExpected);
                                }
                            });
                            downloader.setOnFileTaskSuccess(function (task) {
                                if ("@temp_manifest" == task.identifier) {
                                    console.log("manifest download success");
                                    const manifest = new jsb.Manifest(manifestPath);
                                    self._am.loadRemoteManifest(manifest);
                                } else {
                                    console.log("version download success");
                                    const manifest = new jsb.Manifest(versionPath);
                                    const version = manifest.getVersion();
                                    jsb.fileUtils.removeFile(versionPath);
                                    console.log("local version", self._curVersion);
                                    console.log("remote version", version);
                                    if (self.versionCompareHandle(self._curVersion, version) < 0) {
                                        console.log("tempManifest", manifestPath, manifest.getManifestFileUrl());
                                        downloader.createDownloadFileTask(manifest.getManifestFileUrl(), manifestPath, "@temp_manifest");
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

    isOnlineRelease() {
        if (null != this._isOnlineRelease) {
            return this._isOnlineRelease;
        }
        if (!cc.sys.isNative) {
            return false;
        }
        if (!jsb.fileUtils.isFileExist("projectCfg.json")) {
            return false;
        }
        const text = jsb.fileUtils.getStringFromFile("projectCfg.json");
        console.log("getProjectCfg", text);
        if (null != text && "" != text) {
            const config = JSON.parse(text);
            const isRelease = "release" == config.version || "prod" == config.version;
            console.log("isRelease", isRelease);
            this._isOnlineRelease = isRelease;
            const baseVersion = config.base_version;
            console.log("BaseVersion", baseVersion);
            this._baseVersion = baseVersion;
            return isRelease;
        }
        return false;
    }

    checkUpdate(listener) {
        if (cc.sys.isNative) {
            if (this._updating) {
                console.log("Checking or updating ...");
            } else {
                this._am.setEventCallback(this.checkCb.bind(this));
                listener && (this._checkListener = listener);
                this._initManifest();
                if (this._am.getLocalManifest() && this._am.getLocalManifest().isLoaded()) {
                    this._am.checkUpdate();
                    this._updating = true;
                } else {
                    console.log("Failed to load local manifest ...");
                }
            }
        } else {
            listener && listener(false);
        }
    }
}
