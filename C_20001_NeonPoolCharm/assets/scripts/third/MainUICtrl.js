let e = require;
let t = module;
let o = exports;
"use strict";
cc._RF.push(t, "20c87Jq4S9IzLwdyp1vmELy", "MainUICtrl");
var n,
i = this&& this.__extends|| (n = function(e, t) {
  return(n = Object.setPrototypeOf|| {
    __proto__:[]
  }
  instanceof Array&& function(e, t) {
    e.__proto__ = t;
  }
|| function(e, t) {
    for(var o in t) Object.prototype.hasOwnProperty.call(t, o)&& (e[o] = t[o]);
  }
)(e, t);
}
, function(e, t) {
  n(e, t);
  function o() {
    this.constructor = e;
  }
  e.prototype = null === t? Object.create(t):(o.prototype = t.prototype, new o());
}
),
a = this&& this.__decorate|| function(e, t, o, n) {
  var i,
  a = arguments.length,
  r = a < 3? t: null === n? n = Object.getOwnPropertyDescriptor(t, o): n;
  if("object" == typeof Reflect&& "function" == typeof Reflect.decorate) r = Reflect.decorate(e, t, o, n);
  else for(var l = e.length- 1;
  l >= 0;
  l--)(i = e[l])&& (r = (a < 3? i(r): a > 3? i(t, o, r): i(t, o))|| r);
  return a > 3&& r&& Object.defineProperty(t, o, r),
  r;
}
,
r = this&& this.__awaiter|| function(e, t, o, n) {
  return new(o|| (o = Promise))(function(i, a) {
    function r(e) {
      try {
        s(n.next(e));
      } catch(e) {
        a(e);
      }
    }
    function l(e) {
      try {
        s(n.throw(e));
      } catch(e) {
        a(e);
      }
    }
    function s(e) {
      e.done? i(e.value):(t = e.value, t instanceof o? t: new o(function(e) {
        e(t);
      }
)).then(r, l);
      var t;
    }
    s((n = n.apply(e, t|| [])).next());
  }
);
}
,
l = this&& this.__generator|| function(e, t) {
  var o,
  n,
  i,
  a,
  r = {
    label: 0,
    sent: function() {
      if(1& i[0]) throw i[1];
      return i[1];
    }
,
    trys:[],
    ops:[]
  }
;
  return a = {
    next: l(0),
    throw: l(1),
    return: l(2)
  }
,
  "function" == typeof Symbol&& (a[Symbol.iterator] = function() {
    return this;
  }
),
  a;
  function l(e) {
    return function(t) {
      return s([e, t]);
    }
;
  }
  function s(a) {
    if(o) throw new TypeError("Generator is already executing.");
    for(;
    r;
) try {
      if(o = 1, n&& (i = 2& a[0]? n.return: a[0]? n.throw|| ((i = n.return)&& i.call(n), 0): n.next)&& !(i = i.call(n, a[1])).done) return i;
(n = 0, i)&& (a = [2& a[0], i.value]);
      switch(a[0]) {
        case 0: case 1: i = a;
        break;
        case 4: r.label++;
        return {
          value: a[1],
          done: ! 1
        }
;
        case 5: r.label++;
        n = a[1];
        a = [0];
        continue;
        case 7: a = r.ops.pop();
        r.trys.pop();
        continue;
        default: if(!(i = r.trys, i = i.length > 0&& i[i.length- 1])&& (6 === a[0]|| 2 === a[0])) {
          r = 0;
          continue;
        }
        if(3 === a[0]&& (! i|| a[1] > i[0]&& a[1] < i[3])) {
          r.label = a[1];
          break;
        }
        if(6 === a[0]&& r.label < i[1]) {
          r.label = i[1];
          i = a;
          break;
        }
        if(i&& r.label < i[2]) {
          r.label = i[2];
          r.ops.push(a);
          break;
        }
        i[2]&& r.ops.pop();
        r.trys.pop();
        continue;
      }
      a = t.call(e, r);
    } catch(e) {
      a = [6, e];
      n = 0;
    } finally {
      o = i = 0;
    }
    if(5& a[0]) throw a[1];
    return {
      value: a[0]? a[1]: void 0,
      done: ! 0
    }
;
  }
}
;
Object.defineProperty(o, "__esModule", {
  value: ! 0
}
);
var s = e("BallLogicMgr.js"),
c = e("GuideEvent.js"),
u = e("GuideManager.js"),
p = e("LevelTableConfigManager.js"),
d = e("UiManage.js"),
_ = e("PageMgr.js"),
f = e("MainUI.js"),
h = e("CueDataSys.js"),
g = e("PropDataSys.js"),
y = e("GameConfigurations.js"),
v = e("GameHelper.js"),
m = e("PoolLogger.js"),
b = e("AudioManager.js"),
C = e("EventMgr.js"),
P = e("GameEventType.js"),
S = e("SdkHelper.js"),
I = e("CocosHelper.js"),
D = e("ConfigDataSys.js"),
E = e("PlayerDataSys.js"),
T = e("RequestData.js"),
w = e("PoolNative.js"),
O = e(PoolWrapper "
  }].js),
      M = cc._decorator,
      N = M.ccclass,
      L = M.menu,
      R = M.property,
      B = function (e) {
        i(t, e);
        function t() {
          var t = null !== e && e.apply(this, arguments) || this;
          t.mainui_touch_block = null;
          t.cueItemPrefab = null;
          t.cueUnlockItemPrefab = null;
          t.ui = null;
          t._touchBlockHandlers = new Set();
          return t;
        }
        t.prototype.onEnable = function () {
          C.default.listen(P.default.UPDATE_QIANDAO, this.updateRedPoint, this);
          C.default.listen(P.default.ON_GETTED_CLUBS_CHANGED, this.updateCueRedPoint, this);
          C.default.listen(P.default.ON_UNLOCKED_CLUBS_GOLD, this.updateCueRedPoint, this);
          E.default.turn_pass > 0 && m.PoolLogger.instance.logGameEvent(" thepool_game_new ", {
            object_action: " show ",
            object_name: " new_17 "
          }, !0);
        };
        t.prototype.onSettingBtnCliked = function () {
          _.default.showPage(" SetPageInGame ");
        };
        t.prototype.onUILoad = function () {
          this.ui = this.node.addComponent(f.default);
          if (cc.winSize.width / cc.winSize.height < .56) {
            var e = this.ui.top_area.getComponent(cc.Widget);
            e.top = e.top + 65;
          }
          var t = this.ui.star_redpoint.y;
          this.ui.star_redpoint.angle = -20;
          cc.tween(this.ui.star_redpoint).to(.25, {
            y: {
              value: t + 5,
              easing: " sineInOut "
            },
            angle: 0
          }).to(.25, {
            y: {
              value: t,
              easing: " sineInOut "
            },
            angle: 20
          }).to(.25, {
            y: {
              value: t + 5,
              easing: " sineInOut "
            },
            angle: 0
          }).to(.25, {
            y: {
              value: t,
              easing: " sineInOut "
            },
            angle: -20
          }).union().repeatForever().start();
          cc.Tween.stopAllByTarget(this.ui.guideTips);
          cc.Tween.stopAllByTarget(this.ui.bg_qipao_ptb2);
          this.ui.guideTips.active = !1;
          if (E.default.level_pass <= 0 && u.default.Instance.id < 1e3) {
            this.ui.bg_qipao_ptb2.active = !1;
            this.ui.light.active = !1;
          } else {
            this.ui.bg_qipao_ptb2.active = !0;
            this.ui.light.active = !0;
            cc.tween(this.ui.bg_qipao_ptb2).by(1, {
              y: 5
            }, {
              easing: " sineInOut "
            }).by(1.5, {
              y: -5
            }, {
              easing: " sineInOut "
            }).union().repeatForever().start();
          }
          b.default.getInstance().isMusicPlaying() || b.default.getInstance().playMusic(b.DEFAULT_BGM_NAME, !0, !0);
          this.ui.idLabel.getComponent(cc.Label).string = O.PoolWrapper.instance.hardCode ? " ID: " + O.PoolWrapper.instance.hardCode : " ";
          this.ui.versionLabel.getComponent(cc.Label).string = " v " + w.PoolNative.getVersion();
        };
        t.prototype.addButtonListen = function () {
          d.UiManager.addButtonListen(this.ui.btn_paly, this.onPlayBtnCliked, this);
          d.UiManager.addButtonListen(this.ui.btn_setting, this.onSettingBtnCliked, this);
          d.UiManager.addButtonListen(this.ui.btn_star, this.onStarBtnClicked, this);
        };
        t.prototype.showLight = function () {
          b.default.getInstance().playMusic(" pool_map ");
          this.updateLevelProgress();
        };
        t.prototype.onClickPropLine = function () {
          g.default.isLinePropUseable && _.default.showPage(" UsePropPage ");
        };
        t.prototype.onPlayBtnCliked = function () {
          s.isModifyBallDir = " 1 " == D.default.global_ConfigMap.get(" easyball_on ");
          var e = Number(D.default.global_ConfigMap.get(" easyball_num ")) || 20;
          s.ballDirModifyThreshold = e / 180 * Math.PI;
          console.log(" isModifyBallDir ", s.isModifyBallDir, " ballDirModifyThreshold ", e);
          s.loadTable(E.default.turn_pass, E.default.table);
        };
        t.prototype._onGuideToPlay = function () {
          m.PoolLogger.instance.logGameEvent(" thepool_game_new ", {
            object_action: " show ",
            object_name: " new_10 "
          }, !0);
          this.ui.guideTips.active = !0;
          this.ui.guideTips.scale = .2;
          cc.tween(this.ui.guideTips).to(.4, {
            scale: 1
          }, {
            easing: " backOut "
          }).start();
        };
        t.prototype.checkPop = function () {
          return r(this, void 0, void 0, function () {
            return l(this, function (e) {
              switch (e.label) {
                case 0:
                  this.showTouchBlock(" checkPop ");
                  this.showLight();
                  return [4, new Promise(function (e) {
                    v.default.frameSDK.checkPopUp(cc.director.getScene().name, E.default.show_level_reward, e);
                    E.default.show_level_reward = !1;
                  })];
                case 1:
                  e.sent();
                  return [4, I.default.sleepSync(.3)];
                case 2:
                  e.sent();
                  this.hideTouchBlock(" checkPop ");
                  return [2];
              }
            });
          });
        };
        t.prototype.hideTouchBlock = function (e) {
          this._touchBlockHandlers.has(e) && this._touchBlockHandlers.delete(e);
          this.mainui_touch_block.active = this._touchBlockHandlers.size > 0;
        };
        t.prototype.updateCueRedPoint = function () {
          var e = !1;
          D.default.cue_configMap.forEach(function (t) {
            e || h.default.isCueUnlocked(t.id) || h.default.isCueNotOpened(t.id) || (e = !0);
          });
          this.ui.cue_label.getComponent(cc.Label).string = h.default.unlockedCueCount + "/ " + D.default.cue_configMap.size;
          this.ui.star_redpoint.opacity = h.default.unlockedCueCount < h.default.openedCueCount ? 255 : 0;
        };
        t.prototype.onLoad = function () {
          this.onUILoad();
          this.addButtonListen();
          cc.game.on(c.default.GuideToPlay, this._onGuideToPlay, this);
          cc.director.on(O.PoolWrapper.EventName.HARD_CODE_CHANGED, this._onInviteCodeChange, this);
        };
        t.prototype.start = function () {
          this.initData();
          var e = new Map();
          e.set(T.RewardType.CueSuiPian, this.ui.btn_star);
          C.default.trigger(P.default.PUSH_EFFECT_TARGETS, e);
          var t = Number(D.default.global_ConfigMap.get(" vibration "));
          S.default.vibratorDuration = t;
        };
        t.prototype.onStarBtnClicked = function () {
          _.default.showPage(" CuePage ");
        };
        t.prototype.updateLevelProgress = function () {
          var e, t;
          this.ui.btn_play_label.getComponent(cc.Label).string = " LV." + E.default.level_info.level_a;
          this.ui.roundRichText.getComponent(cc.RichText).string = " pkey_001?? & value1 == < color = # A8EEFF > " + E.default.level_info.level_b + " < / c > & value2 == " + E.default.level_info.roundCount;
          this.ui.turnProgressBar.getComponent(cc.ProgressBar).progress = E.default.level_info.turnCount <= 0 ? 1 : E.default.level_info.level_c / E.default.level_info.turnCount;
          this.ui.progressLabel.getComponent(cc.Label).string = E.default.level_info.level_c + "/ " + E.default.level_info.turnCount;
          this.ui.roundRichText.active = E.default.level_info.roundCount > 1;
          this.ui.turnProgressBar.parent.active = E.default.level_info.turnCount > 1;
          var o = null === (e = v.default.frameSDK) || void 0 === e ? void 0 : e.getFirstRedeemRequirement(),
            n = Math.max(0, (null !== (t = null == o ? void 0 : o.rdm_1) && void 0 !== t ? t : 0) - E.default.level_info.level_a + 1);
          this.ui.withdrawRichText.getComponent(cc.RichText).string = " pkey_002?? & value1 == < color = # 8F35FF > " + n + " < / c > ";
          this.ui.bg_qipao_ptb2.scale = n > 0 ? 1 : 0;
        };
        t.prototype.updateRedPoint = function () {
          var e = E.default.sign_in_count % 10 + 1,
            t = D.default.sign_in_configMap.get(e),
            o = t.day_lv ? t.day_lv : Number(D.default.global_ConfigMap.get(" check_lv_num "));
          E.default.sign_level_count >= o && E.default.sign_today;
        };
        t.prototype.onDisable = function () {
          C.default.ignore(P.default.UPDATE_QIANDAO, this.updateRedPoint, this);
          C.default.ignore(P.default.ON_GETTED_CLUBS_CHANGED, this.updateCueRedPoint, this);
          C.default.ignore(P.default.ON_UNLOCKED_CLUBS_GOLD, this.updateCueRedPoint, this);
        };
        t.prototype._onInviteCodeChange = function () {
          this.ui.idLabel.getComponent(cc.Label).string = O.PoolWrapper.instance.hardCode ? " ID: " + O.PoolWrapper.instance.hardCode : " ";
        };
        t.prototype.showTouchBlock = function (e) {
          this._touchBlockHandlers.add(e);
          this.mainui_touch_block.active = !0;
        };
        t.prototype.initData = function () {
          this.showTouchBlock(" initData ");
          s.isWin, E.default.user_level;
          var e = E.default.show_scene ? E.default.curSceneID - 1 : E.default.curSceneID;
          this.updateSceneInfo(e);
          this.updateLevelProgress();
          this.checkPop();
          this.updateRedPoint();
          this.updateCueRedPoint();
          this.hideTouchBlock(" initData ");
        };
        t.prototype.updateSceneInfo = function () {
          var e = this.ui.holeSprite.getComponent(cc.Sprite),
            t = this.ui.tableSprite.getComponent(cc.Sprite);
          e.spriteFrame = null;
          t.spriteFrame = null;
          p.default.getLevelTableConfigByFileName(E.default.table).then(function (o) {
            var n,
              i = null !== (n = null == o ? void 0 : o.table_key) && void 0 !== n ? n : " ";
            if (i) {
              var a = y.GameConfigurations.customConfig.tableThumbnailRecord[i];
              if (a) {
                cc.resources.load(" " + a.holeImage, cc.SpriteFrame, function (o, n) {
                  var i, r, l;
                  if (o || !n) console.error(" failed to load hole sprite: " + a.holeImage);else {
                    e.spriteFrame = n;
                    e.node.angle = a.holeAngle;
                    e.node.x = t.node.x + (null !== (i = a.holeOffsetX) && void 0 !== i ? i : 0);
                    e.node.y = t.node.y + (null !== (r = a.holeOffsetY) && void 0 !== r ? r : 0);
                    e.node.scale = t.node.scale * (null !== (l = a.holeScale) && void 0 !== l ? l : 1);
                  }
                });
                cc.resources.load(" Image/ " + a.image, cc.SpriteFrame, function (e, o) {
                  if (e || !o) console.error(" failed to load table sprite: " + a.image);else {
                    t.spriteFrame = o;
                    t.node.angle = a.angle;
                  }
                });
              } else console.error(" failed to find table thumbnail info: " + i);
            } else console.error(" failed to find table id: " + E.default.table);
          });
        };
        t.isFristOpen = !0;
        t.prefabUrl = " MainUI ";
        t.className = " MainUICtrl ";
        a([R(cc.Node)], t.prototype, " mainui_touch_block ", void 0);
        a([R(cc.Prefab)], t.prototype, " cueItemPrefab ", void 0);
        a([R(cc.Prefab)], t.prototype, " cueUnlockItemPrefab ", void 0);
        return a([N, L(" UI/ pages/ MainUICtrl ")], t);
      }(cc.Component);
    o.default = B;
    cc._RF.pop();
