let e = require;let t = module;let o = exports;
    "use strict";

    cc._RF.push(t, "e905dG9nfNAvZPTUz1YXp3I", "GameEndPageCtrl");
    var n,
      i = this && this.__extends || (n = function (e, t) {
        return (n = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function (e, t) {
          e.__proto__ = t;
        } || function (e, t) {
          for (var o in t) Object.prototype.hasOwnProperty.call(t, o) && (e[o] = t[o]);
        })(e, t);
      }, function (e, t) {
        n(e, t);
        function o() {
          this.constructor = e;
        }
        e.prototype = null === t ? Object.create(t) : (o.prototype = t.prototype, new o());
      }),
      a = this && this.__decorate || function (e, t, o, n) {
        var i,
          a = arguments.length,
          r = a < 3 ? t : null === n ? n = Object.getOwnPropertyDescriptor(t, o) : n;
        if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) r = Reflect.decorate(e, t, o, n);else for (var l = e.length - 1; l >= 0; l--) (i = e[l]) && (r = (a < 3 ? i(r) : a > 3 ? i(t, o, r) : i(t, o)) || r);
        return a > 3 && r && Object.defineProperty(t, o, r), r;
      };
    Object.defineProperty(o, "__esModule", {
      value: !0
    });
    var r = e("BallLogicMgr.js"),
      l = e("GameServiceMgr.js"),
      s = e("BasePageCtrl.js"),
      c = e("GameEndPage.js"),
      u = e("CueDataSys.js"),
      p = e("CueUnlockItem.js"),
      d = e("GameHelper.js"),
      _ = e("AudioManager.js"),
      f = e("ConfigDataSys.js"),
      h = e("PlayerDataSys.js"),
      g = e("NewCueListLitemCtr.js"),
      y = cc._decorator,
      v = y.ccclass,
      m = y.menu;
    cc._decorator.property;
    var b = function (e) {
      i(t, e);
      function t() {
        var t = null !== e && e.apply(this, arguments) || this;
        t.ui = null;
        t._animType = null;
        t._touchControl = null;
        t._hasPeneLock = null;
        t._hasBlack = null;
        t._hasTouchLock = null;
        t._isSuccess = null;
        t._timeoutCB = null;
        t.ballCount = null;
        return t;
      }
      t.prototype.addButtonListen = function () {};
      t.prototype.onDisable = function () {
        var t = this;
        e.prototype.onDisable.call(this);
        setTimeout(function () {
          t._isSuccess = !1;
          t._timeoutCB = null;
        }, 20);
      };
      t.prototype._onHide = function () {
        e.prototype._onHide.call(this);
        this._timeoutCB && this._timeoutCB(this._isSuccess);
      };
      t.prototype._init = function (e) {
        var t = e.isSuccess,
          o = e.timeoutCB,
          n = e.ballCount;
        _.default.getInstance().playMusic(t ? "pool_ui_win" : "pool_ui_fail");
        this._isSuccess = t;
        this._timeoutCB = o;
        this.ballCount = n;
        if (t) {
          this.ui.failed.active = !1;
          this.ui.success.active = !0;
          this.showSuccessAni();
        } else {
          this.ui.failed.active = !0;
          this.ui.success.active = !1;
          this.showFailAni();
        }
        this.scheduleOnce(this.onTimeout, 1.5);
      };
      t.prototype.showSuccessAni = function () {
        this.ui.victory.active = !0;
        this.ui.victory.getComponent(sp.Skeleton).setAnimation(0, "animation", !1);
      };
      t.prototype.showFailAni = function () {
        this.ui.defeat.active = !0;
        this.ui.defeat.getComponent(sp.Skeleton).setAnimation(0, "animation", !1);
      };
      t.prototype.clickClose = function () {
        this.hide();
      };
      t.prototype.onTimeout = function () {
        var e = this;
        this._isSuccess ? l.default.submitLevel({
          success: !0,
          ball_count: this.ballCount
        }, function () {
          var t = function (e) {
            if ("continue" === e) {
              r.isModifyBallDir = "1" == f.default.global_ConfigMap.get("easyball_on");
              var t = Number(f.default.global_ConfigMap.get("easyball_num")) || 20;
              r.ballDirModifyThreshold = t / 180 * Math.PI;
              console.log("isModifyBallDir", r.isModifyBallDir, "ballDirModifyThreshold", t);
              r.loadTable(h.default.turn_pass, h.default.table);
            } else r.gotoHall();
          };
          cc.resources.load(["Prefab/CueListItem", "Prefab/CueUnlockItem"], cc.Prefab, function (o, n) {
            var i, a;
            o && console.error("failed to load cue item prefab");
            if (null !== u.default.nextCueID && void 0 !== u.default.nextCueID && n.length >= 2) {
              var r = cc.instantiate(n[0]),
                l = r.getComponent(g.default);
              l.initData(u.default.nextCueID, null);
              var s = cc.instantiate(n[1]);
              s.getComponent(p.default).cueID = u.default.nextCueID;
              null === (i = d.default.frameSDK) || void 0 === i || i.openLevelAward(r, function (e) {
                (null == l ? void 0 : l.isValid) && (l.unlockCount = e);
              }, s, u.default.nextCueID, t);
            } else null === (a = d.default.frameSDK) || void 0 === a || a.openLevelAward(void 0, void 0, void 0, void 0, t);
            e.clickClose();
          });
        }) : this.clickClose();
      };
      t.prototype.start = function () {};
      t.prototype.onLoad = function () {
        this.onUILoad();
        this._animType = s.AnimType.SCALE;
        this._touchControl = !1;
        this._hasPeneLock = !0;
        this._hasBlack = !0;
        this._hasTouchLock = !1;
        e.prototype.onLoad.call(this);
        this.addButtonListen();
      };
      t.prototype.onUILoad = function () {
        this.ui = this.node.addComponent(c.default);
      };
      t.prefabUrl = "GameEndPage";
      t.className = "GameEndPageCtrl";
      return a([v, m("UI/pages/GameEndPageCtrl")], t);
    }(s.default);
    o.default = b;
    cc._RF.pop();
