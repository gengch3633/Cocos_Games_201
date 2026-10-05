HotUpdate: [function (e, t, o) {
    "use strict";

    cc._RF.push(t, "37c8cOblupKI5LBvEILqvir", "HotUpdate");
    Object.defineProperty(o, "__esModule", {
      value: !0
    });
    var n = function () {
      function e() {
        this._updating = !1;
        this._canRetry = !1;
        this._failCount = 0;
        this._canUpdate = !1;
        this._checkListener = null;
        this._updateListener = null;
        this._baseVersion = null;
        this._curVersion = null;
        this._isOnlineRelease = null;
        if (!cc.sys.isBrowser && cc.sys.isNative) {
          this._storagePath = (jsb.fileUtils ? jsb.fileUtils.getWritablePath() : "/") + "remote-asset";
          cc.log("Storage path for remote asset : " + this._storagePath);
          this.versionCompareHandle = function (e, t) {
            cc.log("JS Custom Version Compare: version A is " + e + ", version B is " + t);
            for (var o = e.split("."), n = t.split("."), i = 0; i < o.length; ++i) {
              var a = parseInt(o[i]),
                r = parseInt(n[i] || "0");
              if (a !== r) return a - r;
            }
            return n.length > o.length ? -1 : 0;
          };
          this._am = new jsb.AssetsManager("", this._storagePath, this.versionCompareHandle);
          this._am.setVerifyCallback(function (e, t) {
            var o = t.compressed,
              n = t.md5,
              i = t.path;
            t.size;
            if (o) {
              console.log("Verification passed : " + i);
              return !0;
            }
            console.log("Verification passed : " + i + " (" + n + ")");
            return !0;
          });
          console.log("Hot update is ready, please check or directly update.");
        }
      }
      Object.defineProperty(e.prototype, "canRetry", {
        get: function () {
          return this._canRetry;
        },
        enumerable: !1,
        configurable: !0
      });
      Object.defineProperty(e.prototype, "failCount", {
        get: function () {
          return this._failCount;
        },
        enumerable: !1,
        configurable: !0
      });
      Object.defineProperty(e.prototype, "canUpdate", {
        get: function () {
          return this._canUpdate;
        },
        enumerable: !1,
        configurable: !0
      });
      Object.defineProperty(e.prototype, "checkListener", {
        set: function (e) {
          this._checkListener = e;
        },
        enumerable: !1,
        configurable: !0
      });
      Object.defineProperty(e.prototype, "updateListener", {
        set: function (e) {
          this._updateListener = e;
        },
        enumerable: !1,
        configurable: !0
      });
      e.prototype.getBaseVersion = function () {
        if (null != this._baseVersion) return this._baseVersion;
        if (cc.sys.isBrowser || !cc.sys.isNative) return "1.1.5.2";
        if (!jsb.fileUtils.isFileExist("projectCfg.json")) return "";
        var e = jsb.fileUtils.getStringFromFile("projectCfg.json");
        console.log("getProjectCfg", e);
        if (null != e && "" != e) {
          var t = JSON.parse(e),
            o = "release" == t.version || "prod" == t.version;
          console.log("isRelease", o);
          this._isOnlineRelease = o;
          var n = t.base_version;
          console.log("BaseVersion", n);
          this._baseVersion = n;
          return n;
        }
        return "";
      };
      e.prototype.updateCb = function (e) {
        var t = !1,
          o = !1,
          n = e.getEventCode(),
          i = {
            code: n
          };
        switch (n) {
          case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
            console.log("No local manifest file found, hot update skipped.");
            o = !0;
            break;
          case jsb.EventAssetsManager.UPDATE_PROGRESSION:
            i.byte_percent = e.getPercent();
            i.file_percent = e.getPercentByFile();
            i.file_downloaded = e.getDownloadedFiles();
            i.file_total = e.getTotalFiles();
            i.byte_downloaded = e.getDownloadedBytes();
            i.byte_total = e.getTotalBytes();
            var a = e.getMessage();
            a && console.log("Updated file: " + a);
            break;
          case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            console.log("Fail to download manifest file, hot update skipped1.");
            o = !0;
            break;
          case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
            console.log("Fail to parse manifest file, hot update skipped1.");
            o = !0;
            break;
          case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
            console.log("Already up to date with the latest remote version.");
            o = !0;
            break;
          case jsb.EventAssetsManager.UPDATE_FINISHED:
            console.log("Update finished. " + e.getMessage());
            t = !0;
            break;
          case jsb.EventAssetsManager.UPDATE_FAILED:
            console.log("Update failed. " + e.getMessage());
            this._updating = !1;
            this._canRetry = !0;
            o = !0;
            break;
          case jsb.EventAssetsManager.ERROR_UPDATING:
            console.log("Asset update error: " + e.getAssetId() + ", " + e.getMessage());
            o = !0;
            break;
          case jsb.EventAssetsManager.ERROR_DECOMPRESS:
            console.log("Asset decompress" + e.getMessage());
            o = !0;
        }
        if (o) {
          this._am.setEventCallback(null);
          this._updating = !1;
          if (this._updateListener) {
            this._updateListener(-1, i);
            this._updateListener = null;
          }
        } else if (t) {
          this._am.setEventCallback(null);
          var r = jsb.fileUtils.getSearchPaths(),
            l = this._am.getLocalManifest().getSearchPaths();
          console.log("newPaths", JSON.stringify(l));
          Array.prototype.unshift.apply(r, l);
          cc.sys.localStorage.setItem("HotUpdateSearchPaths", JSON.stringify(r));
          jsb.fileUtils.setSearchPaths(r);
          this._updateListener = null;
          cc.audioEngine.stopAll();
          cc.game.restart();
        } else this._updateListener && this._updateListener(0, i);
      };
      e.prototype.getVersion = function () {
        return null != this._curVersion ? this._curVersion : cc.sys.isNative ? this._initManifest() : "1.1.5.2";
      };
      e.prototype.hotUpdate = function (e) {
        if (!cc.sys.isBrowser && cc.sys.isNative) {
          e && (this._updateListener = e);
          if (this._am && !this._updating) {
            this._am.setEventCallback(this.updateCb.bind(this));
            this._initManifest();
            this._failCount = 0;
            this._am.update();
            this._updating = !0;
          }
        } else e && e(-1, {});
      };
      e.prototype.retry = function () {
        if (!this._updating && this._canRetry) {
          this._canRetry = !1;
          console.log("Retry failed Assets...");
          this._am.downloadFailedAssets();
        }
      };
      e.prototype._initManifest = function () {
        if (cc.sys.isNative) {
          this._am.getState() === jsb.AssetsManager.State.UNINITED && this._am.loadLocalManifest("project.manifest");
          var e = this._am.getLocalManifest(),
            t = e ? e.getVersion() : "1.0.0.0";
          console.log("local manifest version", e ? e.getVersion() : "load failed");
          console.log("local version url", e ? e.getVersionFileUrl() : "load failed");
          this._curVersion = t;
          return t;
        }
      };
      e.prototype.checkCb = function (e) {
        this._canUpdate = !1;
        cc.log("Code: " + e.getEventCode());
        switch (e.getEventCode()) {
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
            this._canUpdate = !0;
            break;
          default:
            return;
        }
        this._am.setEventCallback(null);
        this._updating = !1;
        this._checkListener && this._checkListener(this._canUpdate);
      };
      e.getInstance = function () {
        this._instance || (this._instance = new e());
        return this._instance;
      };
      e.prototype.getGrayVersion = function (e, t) {
        var o = new XMLHttpRequest();
        o.onreadystatechange = function () {
          if (4 == o.readyState) if (o.status >= 200 && o.status < 400) {
            var e = o.responseText;
            if (e) {
              if (t) {
                console.log("返回版本信息");
                console.log(e);
                var n = JSON.parse(e);
                t(n);
              }
            } else {
              console.log("返回数据不存在");
              t && t(!1);
            }
          } else console.log("请求失败");
        };
        o.open("POST", e, !0);
        o.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        o.send();
        o.addEventListener("abort", function () {
          cc.log("testlogin abort");
          t(!1);
        });
        o.addEventListener("error", function () {
          cc.log("testlogin error");
          t && t(!1);
        });
        o.addEventListener("timeout", function () {
          cc.log("testlogin timeout");
          t && t(!1);
        });
      };
      e.prototype.checkGrayUpdate = function (e, t) {
        console.log("checkGrayUpdate", e);
        if (!cc.sys.isBrowser && cc.sys.isNative) {
          if (this._updating) console.log("Checking or updating ...");else {
            this._am.setEventCallback(this.checkCb.bind(this));
            t && (this._checkListener = t);
            this._initManifest();
            if (this._am.getLocalManifest() && this._am.getLocalManifest().isLoaded()) {
              var o = this,
                n = this._storagePath + "_temp/version.manifest.temp",
                i = this._storagePath + "_temp/project.manifest.temp";
              this.getGrayVersion(e, function (e) {
                if (1 == e.code) {
                  var a = new jsb.Downloader();
                  a.createDownloadFileTask(e.url, n, "@temp_version");
                  a.setOnTaskError(function (e, n, i, a) {
                    console.log("errorCode = ", n);
                    console.log("errorCodeInternal = ", i);
                    console.log("errorStr = ", a);
                    console.log("error task = ", e.identifier);
                    o._updating = !1;
                    t && t(!1);
                  });
                  a.setOnTaskProgress(function (e, t, o, n) {
                    if ("@temp_manifest" == e.identifier) {
                      console.log("manifest downloaded ", t);
                      console.log("manifest total received", o);
                      console.log("manifest total expected ", n);
                    } else {
                      console.log("version downloaded ", t);
                      console.log("version total received", o);
                      console.log("version total expected ", n);
                    }
                  });
                  a.setOnFileTaskSuccess(function (e) {
                    if ("@temp_manifest" == e.identifier) {
                      console.log("manifest download success");
                      var r = new jsb.Manifest(i);
                      o._am.loadRemoteManifest(r);
                    } else {
                      console.log("version download success");
                      var l = (r = new jsb.Manifest(n)).getVersion();
                      jsb.fileUtils.removeFile(n);
                      console.log("local version", o._curVersion);
                      console.log("remote version", l);
                      if (o.versionCompareHandle(o._curVersion, l) < 0) {
                        console.log("tempManifest", i, r.getManifestFileUrl());
                        a.createDownloadFileTask(r.getManifestFileUrl(), i, "@temp_manifest");
                      } else {
                        o._updating = !1;
                        t && t(!1);
                      }
                    }
                  });
                } else {
                  o._updating = !1;
                  t && t(!1);
                }
              });
              this._updating = !0;
            } else console.log("Failed to load local manifest ...");
          }
        } else t && t(!1);
      };
      e.prototype.isOnlineRelease = function () {
        if (null != this._isOnlineRelease) return this._isOnlineRelease;
        if (!cc.sys.isNative) return !1;
        if (!jsb.fileUtils.isFileExist("projectCfg.json")) return !1;
        var e = jsb.fileUtils.getStringFromFile("projectCfg.json");
        console.log("getProjectCfg", e);
        if (null != e && "" != e) {
          var t = JSON.parse(e),
            o = "release" == t.version || "prod" == t.version;
          console.log("isRelease", o);
          this._isOnlineRelease = o;
          var n = t.base_version;
          console.log("BaseVersion", n);
          this._baseVersion = n;
          return o;
        }
        return !1;
      };
      e.prototype.checkUpdate = function (e) {
        if (cc.sys.isNative) {
          if (this._updating) console.log("Checking or updating ...");else {
            this._am.setEventCallback(this.checkCb.bind(this));
            e && (this._checkListener = e);
            this._initManifest();
            if (this._am.getLocalManifest() && this._am.getLocalManifest().isLoaded()) {
              this._am.checkUpdate();
              this._updating = !0;
            } else console.log("Failed to load local manifest ...");
          }
        } else e && e(!1);
      };
      e._instance = null;
      return e;
    }();
    o.default = n;
    cc._RF.pop();
  }, {}],
  HttpHandler: [function (e, t, o) {
    "use strict";

    cc._RF.push(t, "6957arYiH5JUZfPue6xmAQe", "HttpHandler");
    Object.defineProperty(o, "__esModule", {
      value: !0
    });
    var n = e("../Service/Service"),
      i = e("../Service/UrlMgr"),
      a = function () {
        function e(e, t, o) {
          this._successHandle = null;
          this._failHandle = null;
          this._requestType = null;
          this._requestData = null;
          this._retry = !1;
          this.setHandler(e, t, o);
        }
        e.prototype.clear = function () {
          this._requestType = null;
          this._requestData = null;
          this._successHandle && this._successHandle.recover();
          this._failHandle && this._failHandle.recover();
          return this;
        };
        e.prototype.setHandler = function (e, t, o) {
          this.setRequest(e);
          this._successHandle = t;
          this._failHandle = o;
          return this;
        };
        e.prototype.setRequest = function (e) {
          this._requestType = e;
          this._requestData = null;
          this._retry = i.default.getInstance().needEnqueue(this._requestType);
          return this;
        };
        e.prototype.getRequestData = function () {
          return this._requestData;
        };
        e.prototype.enterQueue = function () {
          return i.default.getInstance().needEnqueue(this._requestType);
        };
        e.prototype.getRequestType = function () {
          return this._requestType;
        };
        e.prototype.setRequestData = function (e) {
          void 0 === e && (e = null);
          this._requestData = e;
          return this;
        };
        e.prototype.setRetry = function (e) {
          this._retry = e;
          return this;
        };
        e.create = function (t, o, n) {
          return e._pool.length ? e._pool.pop().setHandler(t, o, n) : new e(t, o, n);
        };
        e.prototype.success = function (e) {
          this._successHandle && this._successHandle.runWith(e);
          this.recover();
          return !1;
        };
        e.prototype.needRetry = function () {
          return this._retry;
        };
        e.prototype.fail = function (e) {
          this._failHandle && this._failHandle.runWith(e);
          if (this._retry) return !0;
          this.recover();
          return !1;
        };
        e.prototype.recover = function () {
          e._pool.push(this.clear());
        };
        e.prototype.handleRequest = function () {
          n.default.request(this);
        };
        return e;
      }();
    o.default = a;
    a._pool = [];
    cc._RF.pop();
  