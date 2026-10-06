let e = require;
let t = module;
let a = exports;
"use strict";
cc._RF.push(t, "dddddAzYepMRYKId6+xzWjJ", "Frame");
var o,
n = this&& this.__extends|| (o = function(e, t) {
  return(o = Object.setPrototypeOf|| {
    __proto__:[]
  }
  instanceof Array&& function(e, t) {
    e.__proto__ = t;
  }
|| function(e, t) {
    for(var a in t) Object.prototype.hasOwnProperty.call(t, a)&& (e[a] = t[a]);
  }
)(e, t);
}
, function(e, t) {
  o(e, t);
  function a() {
    this.constructor = e;
  }
  e.prototype = null === t? Object.create(t):(a.prototype = t.prototype, new a());
}
),
i = this&& this.__decorate|| function(e, t, a, o) {
  var n,
  i = arguments.length,
  r = i < 3? t: null === o? o = Object.getOwnPropertyDescriptor(t, a): o;
  if("object" == typeof Reflect&& "function" == typeof Reflect.decorate) r = Reflect.decorate(e, t, a, o);
  else for(var c = e.length- 1;
  c >= 0;
  c--)(n = e[c])&& (r = (i < 3? n(r): i > 3? n(t, a, r): n(t, a))|| r);
  return i > 3&& r&& Object.defineProperty(t, a, r),
  r;
}
;
Object.defineProperty(a, "__esModule", {
  value: ! 0
}
);
var r = e("CLICKLOCK.js"),
c = e("FrameData.js"),
s = e("FrameSDK.js"),
l = e(Panel_Feedback "
  }].js),
      u = cc._decorator,
      d = u.ccclass,
      p = u.property,
      h = function (e) {
        n(t, e);
        function t() {
          var t = null !== e && e.apply(this, arguments) || this;
          t.i18Json = null;
          t.guide = null;
          t.guide2 = null;
          t.hand = null;
          t.hand2 = null;
          t.feedbackInHome = null;
          t.feedbackInGame = null;
          t.passLevel = -1;
          t.currentRound = -1;
          return t;
        }
        a = t;
        t.prototype.onLoad = function () {
          var e = this;
          a.ins = this;
          cc.Camera.main.backgroundColor = cc.color(0, 0, 0, 0);
          s.FrameSDK.Panel = this.node.getChildByName(" popUpNode ");
          if (!a._i18nLoaded) {
            a._i18nLoaded = !0;
            s.FrameSDK.addi18nArray(this.i18Json.json);
          }
          cc.director.on(" FRESH_CREDIT ", function (e) {
            e.change > 0 && (c.FrameData.saveData.historyCredit[e.type] += e.change);
          });
          setInterval(function () {
            c.FrameData.saveData.online_total++;
            e.sendLevelMD();
          }, 1e3);
          cc.director.on(s.FrameSDK.frameData.ListenKeys.VIDEO_SUC, function () {
            c.FrameData.saveData.skipADCount = 0;
            c.FrameData.saveData.CashVideoCount++;
            s.FrameSDK.updataVideoQueueUp();
          });
          this.setGuideShow(!1);
          this.setGuide2Show(!1);
          s.FrameSDK.currLevel = s.FrameSDK.frameData.gameData.passLevel + 1;
          this.updateUI();
        };
        t.prototype.onDestroy = function () {
          cc.director.removeAll(this);
          a.ins = null;
        };
        t.prototype.onFeedbackBtnEvent = function () {
          l.default.openPage();
        };
        t.prototype.start = function () {
          s.FrameSDK.frameData.gameData.noProfitAd || s.FrameSDK.frameData.sdkFuc.ppEvent(" slotShow ");
          s.FrameSDK.logLiftEvent(" into_game ");
          s.FrameSDK.logLiftEvent(" start_game ");
          this.sendLevelMD();
          cc.sys.os === cc.sys.OS_ANDROID && " " == c.FrameData.FRAME_CONF.androidRateUrl && console.error('未配置Android评星链接：FrameData.FRAME_CONF.androidRateUrl = " "');
          cc.sys.os === cc.sys.OS_IOS && " " == c.FrameData.FRAME_CONF.iosRateUrl && console.error('未配置iOS评星链接：FrameData.FRAME_CONF.iosRateUrl = " "');
        };
        t.prototype.setGuideShow = function (e) {
          this.guide.active = this.hand.active = e;
          e && s.FrameSDK.logGameEvent(" thepool_game_new ", {
            object_action: " show ",
            object_name: " new_5 "
          }, !0);
        };
        t.prototype.updateUI = function () {
          var e = !s.FrameSDK.frameData.gameData.noProfitAd,
            t = s.FrameSDK.frameData.gameData.currentScene;
          this.feedbackInHome.active = e && " home " === t;
          this.feedbackInGame.active = e && " game " === t;
        };
        t.prototype.onBtnEvent = function (e, t) {
          " 1 " == t && s.FrameSDK.openPanel_Yellow();
        };
        t.prototype.sendLevelMD = function () {
          if (this.passLevel != s.FrameSDK.frameData.gameData.passLevel || this.currentRound != s.FrameSDK.frameData.gameData.currentRound) {
            this.passLevel = s.FrameSDK.frameData.gameData.passLevel;
            this.currentRound = s.FrameSDK.frameData.gameData.currentRound;
            cc.director.emit(" UPDATA_LEVEL ");
          }
        };
        t.prototype.setGuide2Show = function (e) {
          this.guide2.active = this.hand2.active = e;
          e && cc.director.emit(" UNLOCK_CHARITY ");
        };
        var a;
        t.ins = null;
        t._i18nLoaded = !1;
        i([p(cc.JsonAsset)], t.prototype, " i18Json ", void 0);
        i([p(cc.Node)], t.prototype, " guide ", void 0);
        i([p(cc.Node)], t.prototype, " guide2 ", void 0);
        i([p(cc.Node)], t.prototype, " hand ", void 0);
        i([p(cc.Node)], t.prototype, " hand2 ", void 0);
        i([p(cc.Node)], t.prototype, " feedbackInHome ", void 0);
        i([p(cc.Node)], t.prototype, " feedbackInGame ", void 0);
        i([r.CLICKLOCK()], t.prototype, " onBtnEvent ", null);
        i([r.CLICKLOCK()], t.prototype, " onFeedbackBtnEvent ", null);
        return a = i([d], t);
      }(cc.Component);
    a.default = h;
    cc._RF.pop();
