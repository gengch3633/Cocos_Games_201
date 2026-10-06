let e = require;
let t = module;
let o = exports;
"use strict";
cc._RF.push(t, "3f1d6m6LY1A9qQkCO7FbQpj", "DebugPageCtrl");
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
;
Object.defineProperty(o, "__esModule", {
  value: ! 0
}
);
var r = e("BallLogicMgr.js"),
l = e("GameHelper.js"),
s = e(PlayerDataSys "
  }].js),
      c = e(" EngineUtil.js "),
      u = e(" MainUICtrl.js "),
      p = e(" GameServiceMgr.js "),
      d = e(" BasePageCtrl.js "),
      _ = cc._decorator,
      f = _.ccclass,
      h = _.menu,
      g = _.property,
      y = function (e) {
        i(t, e);
        function t() {
          var t = null !== e && e.apply(this, arguments) || this;
          t.levelAEditBox = null;
          t.levelBEditBox = null;
          t.totalRoundEditBox = null;
          t.deprecatedLevelAEditBox = null;
          t.deprecatedLevelBEditBox = null;
          t.deprecatedLevelCEditBox = null;
          t.deprecatedTotalTurnEditBox = null;
          t.cueCountEditBox = null;
          t.skipADToggle = null;
          t.cashPointEditBox = null;
          t.charityPointEditBox = null;
          t.bankPointEditBox = null;
          t.bankTimeEditBox = null;
          return t;
        }
        t.prototype.onUnlockCueButtonClick = function () {
          var e = parseInt(this.cueCountEditBox.string);
          isNaN(e) || e <= 0 ? c.default.showManageViewToast(" invalid cue count ") : p.default.GmOpenCues({
            cueCount: e
          }, function () {});
        };
        t.prototype.onEnable = function () {
          var t, o;
          e.prototype.onEnable.call(this);
          this.skipADToggle.isChecked = null !== (o = null === (t = l.default.frameData) || void 0 === t ? void 0 : t.SDK_CONF.NO_VIDEO) && void 0 !== o && o;
        };
        t.prototype._onJumpLevelSuccess = function () {
          var e,
            t = cc.director.getScene(),
            o = null == t ? void 0 : t.name;
          if (" game_tabel " === o) r.loadTable(s.default.turn_pass, s.default.table);else if (" game_main " === o) {
            var n = null === (e = t.getComponentInChildren(cc.Canvas)) || void 0 === e ? void 0 : e.getComponentInChildren(u.default);
            n && n.updateLevelProgress();
          }
          c.default.showManageViewToast(" jump to level " + s.default.level_info.level_a + "- " + s.default.level_info.level_b);
        };
        t.prototype.onChangeBankTimeButtonClick = function () {
          var e,
            t = parseInt(this.bankTimeEditBox.string);
          isNaN(t) || t < 0 ? c.default.showManageViewToast(" invalid bank time ") : null === (e = l.default.frameSDK) || void 0 === e || e.debugChangeBankTime(t);
        };
        t.prototype.onJumpToLevelButtonClick = function () {
          var e = this,
            t = parseInt(this.levelAEditBox.string),
            o = parseInt(this.levelBEditBox.string);
          isNaN(t) || t <= 0 || isNaN(o) || o <= 0 ? c.default.showManageViewToast(" invalid level ") : p.default.GmChangeLevel({
            levelA: t,
            levelB: o
          }, function () {
            return e._onJumpLevelSuccess();
          });
        };
        t.prototype.onPassButtonClick = function () {
          var e, t;
          null === (t = null === (e = cc.director.getScene()) || void 0 === e ? void 0 : e.getComponentInChildren(" game_table ")) || void 0 === t || t.doGameSuccess(!0);
          this.hide();
        };
        t.prototype.onJumpToRoundButtonClick = function () {
          var e = this,
            t = parseInt(this.totalRoundEditBox.string);
          isNaN(t) || t <= 0 ? c.default.showManageViewToast(" invalid round ") : p.default.GmChangeRound(t, function () {
            return e._onJumpLevelSuccess();
          });
        };
        t.prototype.onAddCharityPointButtonClick = function () {
          var e,
            t = parseInt(this.charityPointEditBox.string);
          isNaN(t) ? c.default.showManageViewToast(" invalid charity point ") : null === (e = l.default.frameSDK) || void 0 === e || e.debugAddCoin(" greenCoin ", t);
        };
        t.prototype.onSkipADToggleEvent = function () {
          var e = l.default.frameData;
          e && (e.SDK_CONF.NO_VIDEO = this.skipADToggle.isChecked);
        };
        t.prototype.deprecatedOnJumpToLevelButtonClick = function () {
          var e = this,
            t = parseInt(this.deprecatedLevelAEditBox.string),
            o = parseInt(this.deprecatedLevelBEditBox.string),
            n = parseInt(this.deprecatedLevelCEditBox.string);
          isNaN(t) || t <= 0 || isNaN(o) || o <= 0 || isNaN(n) || n <= 0 ? c.default.showManageViewToast(" invalid level ") : p.default.deprecatedGmChangeLevel({
            levelA: t,
            levelB: o,
            levelC: n
          }, function () {
            return e._onJumpLevelSuccess();
          });
        };
        t.prototype.deprecatedOnJumpToTurnButtonClick = function () {
          var e = this,
            t = parseInt(this.deprecatedTotalTurnEditBox.string);
          isNaN(t) || t <= 0 ? c.default.showManageViewToast(" invalid turn ") : p.default.deprecatedGmChangeTurn(t, function () {
            return e._onJumpLevelSuccess();
          });
        };
        t.prototype.onAddCashPointButtonClick = function () {
          var e,
            t = parseInt(this.cashPointEditBox.string);
          isNaN(t) ? c.default.showManageViewToast(" invalid cash point ") : null === (e = l.default.frameSDK) || void 0 === e || e.debugAddCoin(" yellowCoin ", t);
        };
        t.prototype.onAddBankPointButtonClick = function () {
          var e,
            t = parseInt(this.bankPointEditBox.string);
          isNaN(t) ? c.default.showManageViewToast(" invalid bank point ") : null === (e = l.default.frameSDK) || void 0 === e || e.debugAddBankCoin(t);
        };
        t.prefabUrl = " DebugPage ";
        t.className = " DebugPageCtrl ";
        a([g(cc.EditBox)], t.prototype, " levelAEditBox ", void 0);
        a([g(cc.EditBox)], t.prototype, " levelBEditBox ", void 0);
        a([g(cc.EditBox)], t.prototype, " totalRoundEditBox ", void 0);
        a([g(cc.EditBox)], t.prototype, " deprecatedLevelAEditBox ", void 0);
        a([g(cc.EditBox)], t.prototype, " deprecatedLevelBEditBox ", void 0);
        a([g(cc.EditBox)], t.prototype, " deprecatedLevelCEditBox ", void 0);
        a([g(cc.EditBox)], t.prototype, " deprecatedTotalTurnEditBox ", void 0);
        a([g(cc.EditBox)], t.prototype, " cueCountEditBox ", void 0);
        a([g(cc.Toggle)], t.prototype, " skipADToggle ", void 0);
        a([g(cc.EditBox)], t.prototype, " cashPointEditBox ", void 0);
        a([g(cc.EditBox)], t.prototype, " charityPointEditBox ", void 0);
        a([g(cc.EditBox)], t.prototype, " bankPointEditBox ", void 0);
        a([g(cc.EditBox)], t.prototype, " bankTimeEditBox ", void 0);
        return a([f, h(" UI/ pages/ DebugPageCtrl ")], t);
      }(d.default);
    o.default = y;
    cc._RF.pop();
