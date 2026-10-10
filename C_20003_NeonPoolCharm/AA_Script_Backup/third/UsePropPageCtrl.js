let e = require;let t = module;let o = exports;
    "use strict";

    cc._RF.push(t, "be6d0Hu0YBKO4OyMn87sWaC", "UsePropPageCtrl");
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
    var r = e("GameServiceMgr.js"),
      l = e("UiManage.js"),
      s = e("BasePageCtrl.js"),
      c = e("UsePropPage.js"),
      u = e("PropDataSys.js"),
      p = e("GameConfigurations.js"),
      d = e("GameHelper.js"),
      _ = e("PoolLogger.js"),
      f = e("ConfigDataSys.js"),
      h = e("ConfigDataMgr.js"),
      g = cc._decorator,
      y = g.ccclass,
      v = g.menu,
      m = function (e) {
        i(t, e);
        function t() {
          var t = null !== e && e.apply(this, arguments) || this;
          t.ui = null;
          t._animType = null;
          t._touchControl = null;
          t._hasPeneLock = null;
          t._hasBlack = null;
          t._hasTouchLock = null;
          t.notReoprt = null;
          t._curTouchLock = null;
          t.curPropType = 0;
          t.curAdType = void 0;
          t._bonus = 0;
          return t;
        }
        t.prototype.getLinePropTime = function () {
          var e = Number(f.default.ad_configMap.get(r.AD_TYPE.line_prop).type_para);
          return Math.floor(e / 60);
        };
        t.prototype._init = function (e) {
          if (e) {
            var t = e.prop_type;
            this.curPropType = t;
            this._bonus = 0;
            switch (t) {
              case h.ETaiQiuPropType.E_BaiQiu:
                _.PoolLogger.instance.logEvent("c_ad_event", {
                  action: "exposure",
                  type: "video",
                  placement: "item_1"
                });
                this.curAdType = r.AD_TYPE.baiqiu_prop;
                this._bonus = p.GameConfigurations.customConfig.bonusForBuyingPlaceProp;
                break;
              case h.ETaiQiuPropType.E_Line:
                _.PoolLogger.instance.logEvent("c_ad_event", {
                  action: "exposure",
                  type: "video",
                  placement: "item_2"
                });
                this.curAdType = r.AD_TYPE.line_prop;
                this._bonus = p.GameConfigurations.customConfig.bonusForBuyingAimProp;
            }
            this.updateUI();
            this.notReoprt = !1;
            this._addReportData({
              prop_type: t
            });
            this._reportEntry();
            this.notReoprt = !0;
          }
        };
        t.prototype.clickClose = function () {
          this.hide();
        };
        t.prototype.clickGet = function () {
          var e = this;
          if (!this._curTouchLock) {
            this._curTouchLock = !0;
            var t = "item";
            switch (this.curPropType) {
              case h.ETaiQiuPropType.E_BaiQiu:
                t = "item_1";
                _.PoolLogger.instance.logEvent("c_ad_event", {
                  action: "touch",
                  type: "video",
                  placement: t
                });
                break;
              case h.ETaiQiuPropType.E_Line:
                t = "item_2";
                _.PoolLogger.instance.logEvent("c_ad_event", {
                  action: "touch",
                  type: "video",
                  placement: t
                });
            }
            d.default.instance.showVideo(t, !1, function (t) {
              switch (e.curPropType) {
                case h.ETaiQiuPropType.E_BaiQiu:
                  _.PoolLogger.instance.logGameEvent("thepool_game_ad", {
                    object_action: "show",
                    object_name: "item_1",
                    object_notes: "video" === t ? "video" : "web" === t ? "web" : "inter"
                  });
                  break;
                case h.ETaiQiuPropType.E_Line:
                  _.PoolLogger.instance.logGameEvent("thepool_game_ad", {
                    object_action: "show",
                    object_name: "item_2",
                    object_notes: "video" === t ? "video" : "web" === t ? "web" : "inter"
                  });
              }
            }, function (t) {
              r.default.reportAd({
                ad_type: e.curAdType,
                success: !0
              }, function () {
                var o;
                e.hide();
                e._curTouchLock = !1;
                switch (e.curPropType) {
                  case h.ETaiQiuPropType.E_Line:
                    u.default.usePropLine();
                }
                if (d.default.pocketed) {
                  var n = 0,
                    i = 0;
                  if (t) {
                    n = d.default.getClassByName("FrameData").getCharityOutNum();
                    i = 1;
                  }
                  null === (o = d.default.frameSDK) || void 0 === o || o.addCoin(e._bonus, n, i);
                }
              }, function () {
                e._curTouchLock = !1;
              });
            }, function () {
              return e._curTouchLock = !1;
            }, d.default.pocketed ? {
              reward: this._bonus,
              isMax: !1
            } : void 0);
          }
        };
        t.prototype.updateUI = function () {
          this.ui.richText.getComponent(cc.RichText).string = this.getPropDesc();
          this.ui.hongbao_label.getComponent(cc.Label).string = "" + d.default.frameSDK.convertCoinToStr(this._bonus, !1);
          this.updateIcon();
        };
        t.prototype.onEnable = function () {
          e.prototype.onEnable.call(this);
          this._curTouchLock = !1;
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
        t.prototype.onUILoad = function () {
          this.ui = this.node.addComponent(c.default);
        };
        t.prototype.updateIcon = function () {
          switch (this.curPropType) {
            case h.ETaiQiuPropType.E_BaiQiu:
              this.ui.sp_icon_prop.active = !0;
              this.ui.sp_icon_line.active = !1;
              break;
            case h.ETaiQiuPropType.E_Line:
              this.ui.sp_icon_prop.active = !1;
              this.ui.sp_icon_line.active = !0;
          }
        };
        t.prototype.getBaiqiuPropCount = function () {
          return f.default.ad_configMap.get(r.AD_TYPE.baiqiu_prop).type_para;
        };
        t.prototype.onLoad = function () {
          this.onUILoad();
          this._animType = s.AnimType.SCALE;
          this._touchControl = !1;
          this._hasPeneLock = !0;
          this._hasBlack = !0;
          this._hasTouchLock = !1;
          e.prototype.onLoad.call(this);
          this.addButtonListen();
          this.notReoprt = !0;
        };
        t.prototype.addButtonListen = function () {
          l.UiManager.addButtonListen(this.ui.btn_close, this.clickClose, this);
          l.UiManager.addButtonListen(this.ui.btn_get, this.clickGet, this);
        };
        t.prototype.getPropDesc = function () {
          switch (this.curPropType) {
            case h.ETaiQiuPropType.E_BaiQiu:
              return "pkey_023??&value1==<color= #FFE956>" + this.getBaiqiuPropCount() + "</c>";
            case h.ETaiQiuPropType.E_Line:
              return "pkey_024??&value1==<color= #FFE956>80%</c>";
          }
          return "";
        };
        t.prefabUrl = "UsePropPage";
        t.className = "UsePropPageCtrl";
        return a([y, v("UI/pages/UsePropPageCtrl")], t);
      }(s.default);
    o.default = m;
    cc._RF.pop();
