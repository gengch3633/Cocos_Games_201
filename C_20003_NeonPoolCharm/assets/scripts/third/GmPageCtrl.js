let e = require;let t = module;let o = exports;
    "use strict";

    cc._RF.push(t, "4fd69LgzMVJMIx/cmaMqNWd", "GmPageCtrl");
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
      l = e("GlobalConfig.js"),
      s = e("GameServiceMgr.js"),
      c = e("UiManage.js"),
      u = e("SystemConfig.js"),
      p = e("BasePageCtrl.js"),
      d = e("GmPage.js"),
      _ = e("CueDataSys.js"),
      f = e("EventMgr.js"),
      h = e("GameEventType.js"),
      g = e("Handler.js"),
      y = e("AdManager.js"),
      v = e("SdkHelper.js"),
      m = e("GameService.js"),
      b = e("EngineUtil.js"),
      C = e("ConfigDataSys.js"),
      P = e("PlayerDataSys.js"),
      S = e("GlobalDataMgr.js"),
      I = cc._decorator,
      D = I.ccclass,
      E = I.menu;
    cc._decorator.property;
    var T = function (t) {
      i(o, t);
      function o() {
        var e = null !== t && t.apply(this, arguments) || this;
        e.ui = null;
        e.usedLan = [u.languages.CN, u.languages.ID];
        e._animType = null;
        e._touchControl = null;
        e._hasPeneLock = null;
        e._hasBlack = null;
        e._hasTouchLock = null;
        e._levelIndex = null;
        e._level_config_index = null;
        e._clickLock = null;
        return e;
      }
      n = o;
      o.prototype.updateLanguage = function () {
        for (var e = 0; e < this.usedLan.length; e++) {
          var t = cc.instantiate(this.ui.language_list_item);
          t.active = !0;
          t.setParent(this.ui.language_content);
          t.lan = this.usedLan[e];
          t.getChildByName("Background11").getChildByName("language_li_label").getComponent(cc.Label).string = this.usedLan[e];
          c.UiManager.addButtonListen(t, this.onLanSelected, this, this.usedLan[e]);
        }
        this.ui.language_list_item.active = !1;
        this.updateCurLan();
      };
      o.prototype.getCpm = function () {
        var e = this;
        s.default.GmGetCpmRecord(function (t) {
          e.ui.lab_cpm.getComponent(cc.Label).string = t.records.join(",");
        });
      };
      o.prototype.refrashLevelConfigLists = function () {
        var e = this.ui.level_config_content.children,
          t = this._levelIndex + 1,
          o = C.default.stage_configMap.get(t).item_config_name.split("#");
        this._level_config_index > o.length - 1 && (this._level_config_index = 0);
        var n = 0;
        for (n = 0; n < o.length; n++) {
          var i;
          if (n < e.length) i = e[n];else {
            (i = cc.instantiate(this.ui.level_name_list_item)).setParent(this.ui.level_config_content);
            i.getComponent("GMLevelListItem").onClickCB = this.onLevelConfigItemSelected.bind(this);
          }
          i.active = !0;
          i.getComponent("GMLevelListItem").setLabel(o[n]);
        }
        for (; n < e.length; n++) e[n].active = !1;
      };
      o.prototype.onLoad = function () {
        this.onUILoad();
        this._animType = p.AnimType.SCALE;
        this._touchControl = !1;
        this._hasPeneLock = !0;
        this._hasBlack = !0;
        this._hasTouchLock = !1;
        t.prototype.onLoad.call(this);
        this.addButtonListen();
      };
      o.prototype.updateAccountInfo = function () {
        var e = Number(b.default.localStorageGetItem(u.NOT_USE_DEVICE_ID_LS_KEY, "0"));
        this.ui.Label_switch_account.getComponent(cc.Label).string = "使用device_id作帐号：" + (1 == e ? "否" : "是");
      };
      o.prototype.onLevelNameBtnClicked = function () {
        this.refrashLevelNameList();
        this.resetLevelNameLabel();
      };
      o.prototype._init = function (t) {
        this.ui.in_game_area.active = 1 == t;
        this.ui.main_ui_area.active = !t;
        this.refrashLevelNameList();
        this.refrashLevelConfigList();
        this.resetLevelConfigName();
        if (null == this._curModifyAngle) {
          e("BallLogicMgr.js");
          this._curModifyAngle = r.ballDirModifyThreshold / Math.PI * 180;
        }
        this.updateBallDirModify();
      };
      o.prototype.onLevelConfigBtnClicked = function () {
        this.refrashLevelConfigList();
      };
      o.getLSLanguage = function () {
        var e = b.default.localStorageGetItem("ls_lan", "null");
        return "null" == e ? null : e;
      };
      o.setLSLanguage = function (e) {
        b.default.localStorageSetItem("ls_lan", e);
      };
      o.prototype.refrashLevelConfigList = function () {};
      o.prototype.onStartLevelClicked = function () {
        var e = this;
        if (!this._clickLock) {
          this._clickLock = !0;
          setTimeout(function () {
            e._clickLock = !1;
          }, 200);
          var t = this._levelIndex + 1;
          this._level_config_index;
          m.default.gmToLevel({
            level: t
          }, g.default.create(this, function (e) {
            e && e.code;
          }), g.default.create(this, function () {
            b.default.showManageViewToast("设置关卡失败");
          }));
        }
      };
      o.clearLSLanguage = function () {
        cc.sys.localStorage.removeItem("ls_lan");
      };
      o.prototype.resetLevelNameLabel = function () {};
      o.prototype.onLanSelected = function (e) {
        n.setLSLanguage(e);
        this.updateCurLan();
      };
      o.prototype.onEnable = function () {
        t.prototype.onEnable.call(this);
        this.getCpm();
      };
      o.prototype.updateCurLan = function () {
        var e = n.getLSLanguage();
        this.ui.cur_lan_label.getComponent(cc.Label).string = "当前:" + (e || S.default.curLanguage);
      };
      o.prototype.addSignInCount = function () {
        var e = this.ui.add_cash.getComponent(cc.EditBox).string,
          t = "" == e ? 1 : Number(e);
        s.default.GMAddSignInCount(t, function () {
          b.default.showManageViewToast("添加成功");
        });
      };
      o.prototype.onUILoad = function () {
        this.ui = this.node.addComponent(d.default);
        this._levelIndex = P.default.user_level - 1;
        this._level_config_index = P.default.level_config_index;
        this.ui.level_config_list_item.active = !1;
        this.ui.level_name_list_item.active = !1;
        this.updateAccountInfo();
        this.updateAdBtn();
        this.updateAdSimRet();
        this.updateLanguage();
      };
      o.prototype.updateAdSimRet = function () {
        this.ui.Label_ad_sim_ret.getComponent(cc.Label).string = "广告结果：" + (y.default.getInstance().adSwitch ? "成功" : "失败");
      };
      o.prototype.onLevelNameItemSelected = function (e) {
        this._levelIndex = this.ui.level_name_content.children.indexOf(e.node);
        this.refrashLevelNameList();
        this.resetLevelNameLabel();
        this.refrashLevelConfigList();
        this.resetLevelConfigName();
      };
      o.prototype.refrashLevelNameList = function () {};
      o.prototype.updateBallDirModify = function () {
        e("BallLogicMgr.js");
        this.ui.ball_modify_state_Label.getComponent(cc.Label).string = "修正球滚动方向：" + (r.isModifyBallDir ? "开" : "关");
        this.ui.set_ball_modify_angle.getComponent(cc.EditBox).string = "" + this._curModifyAngle;
      };
      o.prototype.resetLevelConfigName = function () {};
      o.prototype.clickClose = function () {
        this.hide();
      };
      o.prototype.onLevelConfigItemSelected = function (e) {
        this._level_config_index = this.ui.level_config_content.children.indexOf(e.node);
        this.resetLevelConfigName();
      };
      o.prototype.addButtonListen = function () {
        var t = this;
        c.UiManager.addButtonListen(this.ui.add_cash_btn, function () {
          var e = t.ui.add_cash.getComponent(cc.EditBox).string;
          s.default.GmChangeCash("cash", Number(e));
        }, this);
        c.UiManager.addButtonListen(this.ui.add_gold_btn, function () {
          var e = t.ui.add_cash.getComponent(cc.EditBox).string;
          s.default.GmChangeCash("gold", Number(e));
        }, this);
        c.UiManager.addButtonListen(this.ui.add_club_shard, function () {
          s.default.GmGetClubShard();
        }, this);
        c.UiManager.addButtonListen(this.ui.add_zhendong, function () {
          var e = t.ui.add_cash.getComponent(cc.EditBox).string;
          v.default.vibratorDuration = Number(e);
        }, this);
        c.UiManager.addButtonListen(this.ui.edit_btn, function () {}, this);
        c.UiManager.addButtonListen(this.ui.fps_show, function () {
          cc.debug.setDisplayStats(!cc.debug.isDisplayStats());
          b.default.setStatsColor(cc.Color.BLACK, cc.color(255, 255, 255, 180));
          t.ui.fps_show.getComponentInChildren(cc.Label).string = "显示帧数 " + (cc.debug.isDisplayStats() ? "关" : "开");
        }, this);
        c.UiManager.addButtonListen(this.ui.fps_60, function () {
          cc.director.getPhysicsManager().enabledAccumulator = !0;
          cc.PhysicsManager.FIXED_TIME_STEP = .016666666666666666;
        }, this);
        c.UiManager.addButtonListen(this.ui.fps_90, function () {
          cc.director.getPhysicsManager().enabledAccumulator = !0;
          cc.PhysicsManager.FIXED_TIME_STEP = .011111111111111112;
        }, this);
        c.UiManager.addButtonListen(this.ui.btn_choujiang, function () {}, this);
        c.UiManager.addButtonListen(this.ui.fps_auto, function () {
          var e = cc.director.getPhysicsManager();
          e.enabledAccumulator = !e.enabledAccumulator;
          t.ui.fps_auto.getComponentInChildren(cc.Label).string = "用屏幕帧 " + (e.enabledAccumulator ? "关" : "开");
        }, this);
        c.UiManager.addButtonListen(this.ui.fps_limit, function () {
          var e = cc.game.getFrameRate();
          cc.game.setFrameRate(60 == e ? 59 : 60);
          t.ui.fps_limit.getComponentInChildren(cc.Label).string = "帧数锁定 " + (60 != e ? "开" : "关");
        }, this);
        c.UiManager.addButtonListen(this.ui.add_sign_in_count, this.addSignInCount, this);
        c.UiManager.addButtonListen(this.ui.close_btn, this.clickClose, this);
        c.UiManager.addButtonListen(this.ui.level_start_btn, this.onStartLevelClicked, this);
        c.UiManager.addButtonListen(this.ui.level_btn, this.onLevelNameBtnClicked, this);
        c.UiManager.addButtonListen(this.ui.level_config_btn, this.onLevelConfigBtnClicked, this);
        c.UiManager.addButtonListen(this.ui.add_ad_switch, function () {
          y.default.getInstance().adSwitch = !y.default.getInstance().adSwitch;
          t.updateAdBtn();
        }, this);
        c.UiManager.addButtonListen(this.ui.add_ad_sim_ret, function () {
          y.default.getInstance().adSwitch = !y.default.getInstance().adSwitch;
          t.updateAdSimRet();
        }, this);
        c.UiManager.addButtonListen(this.ui.btn_switch_account, function () {
          var e = Number(b.default.localStorageGetItem(u.NOT_USE_DEVICE_ID_LS_KEY, "0"));
          b.default.localStorageSetItem(u.NOT_USE_DEVICE_ID_LS_KEY, e ? "0" : "1");
          t.updateAccountInfo();
        }, this);
        c.UiManager.addButtonListen(this.ui.btn_clear_account, function () {
          var e = b.default.localStorageGetItem(u.NOT_USE_DEVICE_ID_LS_KEY, "0");
          cc.sys.localStorage.clear();
          b.default.localStorageSetItem(u.NOT_USE_DEVICE_ID_LS_KEY, e);
        }, this);
        c.UiManager.addButtonListen(this.ui.btn_language, function () {
          n.clearLSLanguage();
          t.updateCurLan();
        }, this);
        c.UiManager.addButtonListen(this.ui.level_success, function () {
          f.default.trigger(h.default.GM_LEVEL_SUCCESS);
          t.hide();
        }, this);
        c.UiManager.addButtonListen(this.ui.changelevel_btn, function () {
          var e = Number(t.ui.level_changed_eb.getComponent(cc.EditBox).string);
          (isNaN(e), 1) || s.default.deprecatedGmChangeLevel(e, function (e) {
            var t = e.level,
              o = e.level_loop;
            P.default.user_level = t;
            P.default.level_loop = o;
            b.default.showManageViewToast("切换到关卡：" + t);
            r.loadTable_freeMode_useIdx(P.default.validConfigLevelID - 1);
          }, function () {
            b.default.showManageViewToast("切换关卡失败");
          });
        }, this);
        e("BallLogicMgr.js"), e("GlobalConfig.js");
        var o = function () {
          t.ui.attri_power_editbox.getComponent(cc.EditBox).string = "" + _.default.getUsedCuePower();
          t.ui.attri_spin_editbox.getComponent(cc.EditBox).string = "" + _.default.getUsedCueRoleAngle();
          t.ui.attri_aimming_editbox.getComponent(cc.EditBox).string = "" + _.default.getUsedCueAimLineLen();
        };
        o();
        c.UiManager.addButtonListen(this.ui.use_attri_btn, function () {
          var e = Number(t.ui.attri_power_editbox.getComponent(cc.EditBox).string),
            o = Number(t.ui.attri_spin_editbox.getComponent(cc.EditBox).string),
            n = Number(t.ui.attri_aimming_editbox.getComponent(cc.EditBox).string);
          r.useSimCueAttri = !0;
          r.simCuePower = e;
          r.simCueSpin = o;
          r.simAimming = n;
        }, this);
        c.UiManager.addButtonListen(this.ui.recover_attri_btn, function () {
          r.useSimCueAttri = !1;
          o();
        }, this);
        var i = this.ui.attri_gan_move_editbox.getComponent(cc.EditBox),
          a = this.ui.attri_gan_move_aimming_editbox.getComponent(cc.EditBox),
          p = function () {
            l.gan_move_rad_multy_normal = l.gan_move_rad_multy_normal_base;
            l.gan_move_rad_multy_aim = l.gan_move_rad_multy_aim_base;
            i.string = "" + l.gan_move_rad_multy_normal_base;
            a.string = "" + l.gan_move_rad_multy_aim_base;
          };
        p();
        c.UiManager.addButtonListen(this.ui.use_gan_move_btn, function () {
          l.gan_move_rad_multy_normal = Number(i.string);
          l.gan_move_rad_multy_aim = Number(a.string);
          b.default.showManageViewToast("球杆移动参数设置成功");
        }, this);
        c.UiManager.addButtonListen(this.ui.recover_gan_move_btn, function () {
          p();
          b.default.showManageViewToast("球杆移动参数回复默认");
        }, this);
        var d = this.ui.gan_roll_editbox.getComponent(cc.EditBox),
          g = this.ui.gan_roll_aimming_editbox.getComponent(cc.EditBox);
        (function () {
          l.gan_move_roll_multy = l.gan_move_roll_multy_base;
          l.gan_move_roll_multy_aim = l.gan_move_roll_multy_aim_base;
          d.string = "" + l.gan_move_roll_multy_base;
          g.string = "" + l.gan_move_roll_multy_aim_base;
        })();
        c.UiManager.addButtonListen(this.ui.use_gan_roll_move_btn, function () {
          l.gan_move_roll_multy = Number(d.string);
          l.gan_move_roll_multy_aim = Number(g.string);
          b.default.showManageViewToast("滚轮参数设置成功");
        }, this);
        c.UiManager.addButtonListen(this.ui.recover_gan_roll_move_btn, function () {
          p();
          b.default.showManageViewToast("滚轮参数回复默认");
        }, this);
        c.UiManager.addButtonListen(this.ui.btn_set_ball_modify_angle, function () {
          var o = Number(t.ui.set_ball_modify_angle.getComponent(cc.EditBox).string);
          if (isNaN(o)) b.default.showManageViewToast("角度输入错误");else {
            e("BallLogicMgr.js");
            t._curModifyAngle = o;
            r.ballDirModifyThreshold = o / 180 * Math.PI;
            t.updateBallDirModify();
            b.default.showManageViewToast("角度设置成功");
          }
        }, this);
        c.UiManager.addButtonListen(this.ui.btn_switch_ball_modify, function () {
          e("BallLogicMgr.js");
          r.isModifyBallDir = !r.isModifyBallDir;
          t.updateBallDirModify();
        }, this);
      };
      o.prototype.updateAdBtn = function () {
        this.ui.Label_ad_switch.getComponent(cc.Label).string = "广告播放：" + (y.default.getInstance().adSwitch ? "开" : "关");
        this.ui.add_ad_sim_ret.active = !1;
      };
      o.prototype.start = function () {
        this.resetLevelNameLabel();
      };
      var n;
      o.prefabUrl = "gmPage";
      o.className = "GmPageCtrl";
      return n = a([D, E("UI/pages/GmPageCtrl")], o);
    }(p.default);
    o.default = T;
    cc._RF.pop();
