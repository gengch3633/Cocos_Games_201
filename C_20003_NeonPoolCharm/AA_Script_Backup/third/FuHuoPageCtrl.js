let e = require;let t = module;let o = exports;
    "use strict";

    cc._RF.push(t, "97621MzAn1ORI+Q3L08t+NP", "FuHuoPageCtrl");
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
    var r = e("GameConfigurations.js"),
      l = e("GameHelper.js"),
      s = e("PoolLogger.js"),
      c = e("AudioManager.js"),
      u = e("GameServiceMgr.js"),
      p = e("UiManage.js"),
      d = e("BasePageCtrl.js"),
      _ = e("FuHuoPage.js"),
      f = cc._decorator,
      h = f.ccclass,
      g = f.menu,
      y = function (e) {
        i(t, e);
        function t() {
          var t = null !== e && e.apply(this, arguments) || this;
          t.ui = null;
          t._animType = null;
          t._touchControl = null;
          t._hasPeneLock = null;
          t._hasBlack = null;
          t._hasTouchLock = null;
          t._exitCB = null;
          t._curTouchLock = null;
          return t;
        }
        t.prototype.onDisable = function () {
          e.prototype.onDisable.call(this);
          this._exitCB = null;
          this._curTouchLock = !1;
        };
        t.prototype.clickClose = function () {
          this._exitCB && this._exitCB(!1);
          this.hide();
        };
        t.prototype.addButtonListen = function () {
          p.UiManager.addButtonListen(this.ui.btn_get, this.clickFuHuo, this);
          p.UiManager.addButtonListen(this.ui.btn_close, this.clickClose, this);
        };
        t.prototype.onEnable = function () {
          e.prototype.onEnable.call(this);
          cc.tween(this.ui.btn_get).to(.5, {
            scale: 1.1
          }, {
            easing: "sineInOut"
          }).to(.5, {
            scale: 1
          }, {
            easing: "sineInOut"
          }).union().repeatForever().start();
        };
        t.prototype.onLoad = function () {
          this.onUILoad();
          this._animType = d.AnimType.SCALE;
          this._touchControl = !1;
          this._hasPeneLock = !0;
          this._hasBlack = !0;
          this._hasTouchLock = !1;
          e.prototype.onLoad.call(this);
          this.addButtonListen();
        };
        t.prototype._init = function (e) {
          s.PoolLogger.instance.logEvent("c_ad_event", {
            action: "exposure",
            type: "video",
            placement: "game_rev"
          });
          this._exitCB = e ? e.exitCB : null;
          this.ui.hongbao_label.getComponent(cc.Label).string = "" + l.default.frameSDK.convertCoinToStr(r.GameConfigurations.customConfig.bonusForReviving, !1);
          c.default.getInstance().playMusic("pool_ui_fuhuo");
        };
        t.prototype.onUILoad = function () {
          this.ui = this.node.addComponent(_.default);
        };
        t.prototype.clickFuHuo = function () {
          var e = this;
          if (!this._curTouchLock) {
            this._curTouchLock = !0;
            s.PoolLogger.instance.logEvent("c_ad_event", {
              action: "touch",
              type: "video",
              placement: "game_rev"
            });
            l.default.instance.showVideo("game_rev", !1, function (e) {
              s.PoolLogger.instance.logGameEvent("thepool_game_ad", {
                object_action: "show",
                object_name: "game_rev",
                object_notes: "video" === e ? "video" : "web" === e ? "web" : "inter"
              });
            }, function (t) {
              u.default.reportAd({
                ad_type: u.AD_TYPE.relive,
                success: !0
              }, function () {
                var o;
                e._exitCB && e._exitCB(!0);
                e.hide();
                e._curTouchLock = !1;
                if (l.default.pocketed) {
                  var n = 0,
                    i = 0;
                  if (t) {
                    n = l.default.getClassByName("FrameData").getCharityOutNum();
                    i = 1;
                  }
                  null === (o = l.default.frameSDK) || void 0 === o || o.addCoin(r.GameConfigurations.customConfig.bonusForReviving, n, i);
                }
              }, function () {
                e._curTouchLock = !1;
              });
            }, function () {
              return e._curTouchLock = !1;
            }, l.default.pocketed ? {
              reward: r.GameConfigurations.customConfig.bonusForReviving,
              isMax: !1
            } : void 0);
          }
        };
        t.prefabUrl = "FuHuoPage";
        t.className = "FuHuoPageCtrl";
        return a([h, g("UI/pages/FuHuoPageCtrl")], t);
      }(d.default);
    o.default = y;
    cc._RF.pop();
