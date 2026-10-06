import { BUSINESS_COMMON_CONFIG } from "./BusinessCommonConfig";
import CryptoHelper from "./CryptoHelper";
import ClientDataStore from "./ClientDataStore";

export default class HotUpdateManager {
    _updating: boolean;
    _canRetry: boolean;
    _failCount: number;
    _canUpdate: boolean;
    _checkListener: any;
    _updateListener: any;
    _baseVersion: any;
    _curVersion: any;
    _isOnlineRelease: any;
    customManifestData: string;
    _storagePath: string;
    versionCompareHandle: (local: string, remote: string) => number;
    _am: any;
    static _instance: HotUpdateManager;

    constructor() {
        this._updating = false;
        this._canRetry = false;
        this._failCount = 5;
        this._canUpdate = false;
        this._checkListener = null;
        this._updateListener = null;
        this._baseVersion = null;
        this._curVersion = null;
        this._isOnlineRelease = null;
        this.customManifestData = " ";
        if (cc.sys.isNative) {
            this._storagePath = (jsb.fileUtils ? jsb.fileUtils.getWritablePath() : "/ ") + " remote- asset ";
            this.versionCompareHandle = function(e, t) {
                for (var i = e.split("."), n = t.split("."), a = 0; a < i.length; ++a) {
                    var o = parseInt(i[a]), r = parseInt(n[a] || " 0 ");
                    if (o !== r) return o - r;
                }
                return n.length > i.length ? -1 : 0;
            };
            this._am = new jsb.AssetsManager(" ", this._storagePath, this.versionCompareHandle);
            this._am.setVerifyCallback(function() {
                return true;
            });
        }
    }

    static getInstance() {
        this._instance || (this._instance = new HotUpdateManager());
        return this._instance;
    }

    _initManifestStr(e: any) {
        this.customManifestData = e;
    }

    _initManifest() {
        if (cc.sys.isNative) {
            if (this._am.getState() === jsb.AssetsManager.State.UNINITED) {
                var e = new jsb.Manifest(this.customManifestData, this._storagePath);
                this._am.loadLocalManifest(e, this._storagePath);
            }
            var t = this._am.getLocalManifest();
            this._curVersion = t ? t.getVersion() : " 1.0.0.0 ";
            return this._curVersion;
        }
    }

    getVersion() {
        return null != this._curVersion ? this._curVersion : cc.sys.isNative ? this._initManifest() : " 1.0.0.18 ";
    }

    getBaseVersion() {
        if (null != this._baseVersion) return this._baseVersion;
        if (cc.sys.os === cc.sys.OS_IOS) {
            if (!jsb.fileUtils.isFileExist(" projectCfg.json ")) return " ";
            var e = jsb.fileUtils.getStringFromFile(" projectCfg.json ");
            if (e) {
                var t = JSON.parse(e);
                this._isOnlineRelease = " release " === t.version || " prod " === t.version;
                this._baseVersion = t.base_version;
                return this._baseVersion;
            }
            return " ";
        }
        this._baseVersion = BUSINESS_COMMON_CONFIG.baseVersion;
        return this._baseVersion;
    }

    checkCb(e: any) {
        var t: any;
        this._canUpdate = false;
        switch (e.getEventCode()) {
            case jsb.EventAssetsManager.NEW_VERSION_FOUND:
                this._canUpdate = true;
        }
        this._am.setEventCallback(null);
        this._updating = false;
        null === (t = this._checkListener) || void 0 === t || t.call(this, this._canUpdate);
    }

    updateCb(e: any) {
        var t: any, i: any, n = this, a = false, o = false, r = e.getEventCode(), s: any = {
            code: r
        };
        switch (r) {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
            case jsb.EventAssetsManager.ERROR_DECOMPRESS:
                o = true;
                break;

            case jsb.EventAssetsManager.UPDATE_PROGRESSION:
                s.byte_percent = e.getPercent();
                s.file_percent = e.getPercentByFile();
                s.file_downloaded = e.getDownloadedFiles();
                s.file_total = e.getTotalFiles();
                s.byte_downloaded = e.getDownloadedBytes();
                s.byte_total = e.getTotalBytes();
                break;

            case jsb.EventAssetsManager.UPDATE_FINISHED:
                a = true;
                break;

            case jsb.EventAssetsManager.UPDATE_FAILED:
            case jsb.EventAssetsManager.ERROR_UPDATING:
                this._updating = false;
                this._canRetry = true;
                this._failCount-- > 0 ? setTimeout(function() {
                    return n.retry();
                }, 1e3) : o = true;
        }
        if (o) {
            this._am.setEventCallback(null);
            this._updating = false;
            null === (t = this._updateListener) || void 0 === t || t.call(this, -1, s);
            this._updateListener = null;
        } else if (a) {
            this._am.setEventCallback(null);
            var l = jsb.fileUtils.getSearchPaths();
            Array.prototype.unshift.apply(l, this._am.getLocalManifest().getSearchPaths());
            jsb.fileUtils.setSearchPaths(l);
            this._updateListener = null;
            cc.audioEngine.stopAll();
            cc.game.restart();
        } else null === (i = this._updateListener) || void 0 === i || i.call(this, 0, s);
    }

    retry() {
        if (!this._updating && this._canRetry) {
            this._canRetry = false;
            this._am.downloadFailedAssets();
        }
    }

    hotUpdate(e: any) {
        if (cc.sys.isNative) {
            this._updateListener = e;
            if (this._am && !this._updating) {
                this._am.setEventCallback(this.updateCb.bind(this));
                this._initManifest();
                this._failCount = 5;
                this._am.update();
                this._updating = true;
            }
        } else null == e || e(-1, {});
    }

    checkGrayUpdate(e: any, t: any, i: any) {
        var n: any;
        if (cc.sys.isNative) {
            if (!this._updating) {
                this._am.setEventCallback(this.checkCb.bind(this));
                this._checkListener = i;
                this._initManifest();
                if (null === (n = this._am.getLocalManifest()) || void 0 === n ? void 0 : n.isLoaded()) {
                    var a = this, o = this._storagePath + " _temp/ version.manifest.temp ", r = this._storagePath + " _temp/ project.manifest.temp ";
                    this.getGrayVersion(e, t, function(e: any) {
                        if (1 == e.code) {
                            var t = new jsb.Downloader();
                            e.data && t.createDownloadFileTask(e.data.url, o, " @ temp_version ");
                            t.setOnTaskError(function() {
                                a._updating = false;
                                null == i || i(false);
                            });
                            t.setOnTaskProgress(function() {});
                            t.setOnFileTaskSuccess(function(e: any) {
                                if (" @ temp_manifest " === e.identifier) a._am.loadRemoteManifest(new jsb.Manifest(r)); else {
                                    var n = new jsb.Manifest(o), s = n.getVersion();
                                    jsb.fileUtils.removeFile(o);
                                    if (a.versionCompareHandle(a._curVersion, s) < 0) t.createDownloadFileTask(n.getManifestFileUrl(), r, " @ temp_manifest "); else {
                                        a._updating = false;
                                        null == i || i(false);
                                    }
                                }
                            });
                        } else {
                            a._updating = false;
                            null == i || i(false);
                        }
                    });
                    this._updating = true;
                }
            }
        } else null == i || i(false);
    }

    getGrayVersion(e: any, t: any, i: any) {
        var n = new XMLHttpRequest();
        n.onreadystatechange = function() {
            if (4 === n.readyState && n.status >= 200 && n.status < 400) if (n.responseText) {
                var e = CryptoHelper.decrypt(n.responseText, ClientDataStore.box_pkg_name);
                e || (e = n.responseText);
                i(JSON.parse(e));
            } else i(false);
        };
        n.open(" POST ", e, true);
        n.setRequestHeader(" Content- type ", " text/ plain ");
        n.send(t);
        n.addEventListener(" abort ", function() {
            return i(false);
        });
        n.addEventListener(" error ", function() {
            return i(false);
        });
        n.addEventListener(" timeout ", function() {
            return i(false);
        });
    }
}
