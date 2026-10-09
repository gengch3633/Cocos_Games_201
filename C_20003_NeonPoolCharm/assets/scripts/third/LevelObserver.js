let e = require;let t = module;let o = exports;
    "use strict";

    cc._RF.push(t, "10655I+UClFebMz7q3vpSUh", "LevelObserver");
    Object.defineProperty(o, "__esModule", {
      value: !0
    });
    var n = function () {
      function e() {
        this._levelInfos = [];
        this._logging = !1;
      }
      Object.defineProperty(e, "instance", {
        get: function () {
          var t;
          return null !== (t = this._instance) && void 0 !== t ? t : this._instance = new e();
        },
        enumerable: !1,
        configurable: !0
      });
      Object.defineProperty(e.prototype, "logging", {
        get: function () {
          return this._logging;
        },
        enumerable: !1,
        configurable: !0
      });
      e.prototype._captureScreen = function (e, t) {
        if (cc.director.getScene()) {
          var o = cc.director.getScene(),
            n = o.getChildByName("__render_texture__");
          if (!n) {
            (n = new cc.Node("__render_texture__")).setPosition(.5 * cc.visibleRect.width, .5 * cc.visibleRect.height);
            n.setParent(o);
          }
          var i = n.getComponent(cc.Camera);
          if (!i) {
            (i = n.addComponent(cc.Camera)).cullingMask = 487;
            var a = new cc.RenderTexture(),
              r = cc.game._renderContext;
            a.initWithSize(cc.visibleRect.width, cc.visibleRect.height, r.STENCIL_INDEX8);
            i.targetTexture = a;
          }
          var l = jsb.fileUtils.getWritablePath() + "levels";
          jsb.fileUtils.isDirectoryExist(l) || jsb.fileUtils.createDirectory(l);
          var s = l + "/" + e + ".png";
          setTimeout(function () {
            o.scaleY = -1;
            i.render();
            o.scaleY = 1;
            var e = i.targetTexture.readPixels();
            jsb.saveImageData(e, cc.visibleRect.width, cc.visibleRect.height, s);
            console.log("save in: " + s);
            null == t || t();
          }, 500);
        } else null == t || t();
      };
      e.prototype._save = function (e) {
        if (this._levelInfos.length > 0) {
          var t = [];
          t.push("ID\t关卡\t配置名\t台球总数\t球桌ID");
          this._levelInfos.forEach(function (e) {
            var o = [];
            o.push("" + e.turn);
            o.push("" + e.levelID);
            o.push("" + e.configName);
            o.push("" + e.ballsNumber);
            o.push("" + e.tableID);
            t.push(o.join("\t"));
          });
          console.log(t.join("\n"));
        }
        e && this.clear();
      };
      e.prototype.startLog = function (e, t, o, n, i) {
        if (e > 0) {
          this._logging = !1;
          1 === e && this._save(!0);
        } else {
          this._logging = !0;
          this._levelInfos.push({
            turn: e,
            levelID: t,
            configName: o,
            tableID: n,
            ballsNumber: i
          });
        }
      };
      e.prototype.clear = function () {
        this._levelInfos.length = 0;
      };
      e.prototype.endLog = function (e) {
        var t = this;
        this._logging && setTimeout(function () {
          var o, n;
          return t._captureScreen("" + (null !== (n = null === (o = t._levelInfos[t._levelInfos.length - 1]) || void 0 === o ? void 0 : o.levelID) && void 0 !== n ? n : "unknown" + Date.now()), e);
        }, .3);
      };
      e._instance = null;
      return e;
    }();
    o.default = n;
    cc._RF.pop();
