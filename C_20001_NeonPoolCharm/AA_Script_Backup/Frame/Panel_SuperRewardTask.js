let e = require;
let t = module;
let a = exports;
"use strict";
cc._RF.push(t, "bc628+S1DVDHZvw7XfTXCm7", "Panel_SuperRewardTask");
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
var r = e("FrameData.js"),
c = e("FrameSDK.js"),
s = e("WebViewManager.js"),
l = cc._decorator,
u = l.ccclass,
d = l.property,
p = function(e) {
  n(t, e);
  function t() {
    var t = null !== e&& e.apply(this, arguments)|| this;
    t.announceRichText = null;
    t.bonus1Label = null;
    t.bonus2Label = null;
    t.tipRichText = null;
    t.progressBar = null;
    t.progressLabel = null;
    t.webViewAttachedNode = null;
    t.viewData = null;
    t._scheduleFunc = null;
    t._config = null;
    t._interval = 0;
    t._targetTime = 0;
    t._startProgress = 0;
    t._maxProgress = 0;
    return t;
  }
  t.prototype.onWebViewInteract = function() {
    var e;
    if(!(3 !== this._config.task_rule|| this._maxProgress >= 1)) {
      this._interval = 1e3*(null !== (e = this._config.task_time[1])&& void 0 !== e? e: 120);
      this._targetTime = Date.now()+ this._interval;
      this._startProgress = r.FrameData.FRAME_CONF.SuperRewardConfig.taskBreakPoint;
      this._maxProgress = 1;
      this._startSchedule();
    }
  }
;
  t.prototype.onWebViewLoad = function(e) {
    var t = this;
    this._stopSchedule();
    if(e) {
      if(2 !== this._config.task_rule) {
        this._targetTime = Date.now()+ this._interval;
        this._startSchedule();
      }
    } else {
      var a = this.webViewAttachedNode.x;
      this.webViewAttachedNode.x = - 1e4;
      c.FrameSDK.openWindow("Panel_SuperRewardTips", {
        type: "error", bonus: this._config.task_coin, callback: function() {
          t.webViewAttachedNode.x = a;
          c.FrameSDK.closeEffect(t, function() {
            var e, a;
            return null === (a = (e = t.viewData).callback)|| void 0 === a? void 0: a.call(e, ! 1);
          }
);
        }
      }
);
    }
  }
;
  t.prototype._showAnnounce = function() {
    var e = this,
    t = this.viewData.announceNumbers[c.FrameSDK.randomInt(0, this.viewData.announceNumbers.length- 1)];
    this.announceRichText.string = "skey_137??&value1=="+ c.FrameSDK.getRandomInviteCode()+ '&value2==<img src="dollar4" offset=-3/><color= #FFE956>'+ c.FrameSDK.convertCoinToStr(t)+ "</c>";
    this.announceRichText.node.x = this.announceRichText.node.parent.width;
    cc.Tween.stopAllByTarget(this.announceRichText.node);
    cc.tween(this.announceRichText.node).call(function() {
      cc.tween(e.announceRichText.node).to(10, {
        x:- e.announceRichText.node.width- e.announceRichText.node.parent.width
      }
).call(function() {
        return e._showAnnounce();
      }
).start();
    }
).start();
  }
;
  t.prototype.onDisable = function() {
    s.default.hideWebView(this.webViewAttachedNode);
  }
;
  t.prototype.onWebViewExternalURL = function(e) {
    if(!(2 !== this._config.task_rule|| this._targetTime >= this._interval|| e <= 0)) {
      this._targetTime+= e;
      this.progressBar.progress = Math.min(this._targetTime/ this._interval, 1);
      this.progressLabel.string = "skey_139??&value1=="+ Math.floor(100* this.progressBar.progress)+ "%";
    }
  }
;
  t.prototype._startSchedule = function() {
    var e = this;
    this._stopSchedule();
    this.schedule(this._scheduleFunc = function() {
      var t = Math.max(0, e._targetTime- Date.now());
      e.progressBar.progress = Math.min(e._startProgress+(e._interval- t)/ e._interval*(e._maxProgress- e._startProgress), 1);
      e.progressLabel.string = "skey_139??&value1=="+ Math.floor(100* e.progressBar.progress)+ "%";
      if(t <= 0) {
        e.progressBar.progress = Math.min(e._maxProgress, 1);
        e.progressLabel.string = "skey_139??&value1=="+ Math.floor(100* e.progressBar.progress)+ "%";
        e._stopSchedule();
      }
    }
);
  }
;
  t.prototype.onEnable = function() {
    var e,
    t,
    a,
    o,
    n,
    i,
    l,
    u,
    d = this,
    p = this.webViewAttachedNode.parent;
    p.width = cc.winSize.width;
    p.height = cc.winSize.height;
    if(cc.winSize.width/ cc.winSize.height < .56) {
      p.height = cc.winSize.height- 70;
      p.y = - 35;
    } else p.y = 0;
    c.FrameSDK.openEffect(this);
    this._config = r.FrameData.FRAME_CONF.SuperRewardTask.find(function(e) {
      return e.task_id === d.viewData.taskID;
    }
);
    this.bonus1Label.string = c.FrameSDK.convertCoinToStr(this._config.task_coin);
    this.bonus2Label.string = c.FrameSDK.convertCoinToStr(this._config.task_coin, ! 0);
    this._targetTime = 0;
    switch(this._config.task_rule) {
      case 1: this._interval = 1e3*(null !== (e = this._config.task_time[0])&& void 0 !== e? e: 240);
      this._startProgress = 0;
      this._maxProgress = 1;
      this.tipRichText.string = "skey_132??&value1==<color= #F8FF41>"+(null !== (t = this._config.task_time[0])&& void 0 !== t? t: 240)/ 60+ "</c>";
      break;
      case 2: this._interval = 1e3*(null !== (a = this._config.task_time[0])&& void 0 !== a? a: 180);
      this._startProgress = 0;
      this._maxProgress = 1;
      this.tipRichText.string = "skey_133??&value1==<color= #F8FF41>"+(null !== (o = this._config.task_time[0])&& void 0 !== o? o: 180)/ 60+ "</c>";
      break;
      case 3: this._interval = 1e3*(null !== (n = this._config.task_time[0])&& void 0 !== n? n: 180);
      this._startProgress = 0;
      this._maxProgress = r.FrameData.FRAME_CONF.SuperRewardConfig.taskBreakPoint;
      this.tipRichText.string = "skey_134??&value1==<color= #F8FF41>"+((null !== (i = this._config.task_time[0])&& void 0 !== i? i: 180)+(null !== (l = this._config.task_time[1])&& void 0 !== l? l: 120))/ 60+ "</c>";
      break;
      default: this._interval = 1e3*(null !== (u = this._config.task_time[0])&& void 0 !== u? u: 180);
      this._startProgress = 0;
      this._maxProgress = 1;
      this.tipRichText.string = "";
    }
    this.progressBar.progress = 0;
    this.progressLabel.string = "skey_139??&value1==0%";
    this.scheduleOnce(function() {
      var e;
      e = 1 === d._config.task_is_uid? d._config.task_url.replace("{gaid}", c.FrameSDK.frameData.sdkFuc.gaid): 2 === d._config.task_is_uid? d._config.task_url.replace("{invite_code}", c.FrameSDK.frameData.sdkFuc.inviteCode): d._config.task_url;
      s.default.showWebView(d.webViewAttachedNode, e, d);
    }
);
    this._showAnnounce();
  }
;
  t.prototype.onCloseButtonClick = function() {
    var e = this,
    t = this.webViewAttachedNode.x;
    this.webViewAttachedNode.x = - 1e4;
    this.progressBar.progress < 1? c.FrameSDK.openWindow("Panel_SuperRewardTips", {
      type: "quit", bonus: this._config.task_coin, callback: function(a) {
        e.webViewAttachedNode.x = t;
        a|| c.FrameSDK.closeEffect(e, function() {
          var t, a;
          return null === (a = (t = e.viewData).callback)|| void 0 === a? void 0: a.call(t, ! 1);
        }
);
      }
    }
): c.FrameSDK.openWindow("Panel_SuperRewardTips", {
      type: "complete", bonus: this._config.task_coin, callback: function() {
        e.webViewAttachedNode.x = t;
        c.FrameSDK.closeEffect(e, function() {
          var t, a;
          return null === (a = (t = e.viewData).callback)|| void 0 === a? void 0: a.call(t, ! 0);
        }
);
      }
    }
);
  }
;
  t.prototype._stopSchedule = function() {
    if(null !== this._scheduleFunc&& void 0 !== this._scheduleFunc) {
      this.unschedule(this._scheduleFunc);
      this._scheduleFunc = null;
    }
  }
;
  i([d(cc.RichText)], t.prototype, "announceRichText", void 0);
  i([d(cc.Label)], t.prototype, "bonus1Label", void 0);
  i([d(cc.Label)], t.prototype, "bonus2Label", void 0);
  i([d(cc.RichText)], t.prototype, "tipRichText", void 0);
  i([d(cc.ProgressBar)], t.prototype, "progressBar", void 0);
  i([d(cc.Label)], t.prototype, "progressLabel", void 0);
  i([d(cc.Node)], t.prototype, "webViewAttachedNode", void 0);
  return i([u], t);
}
(cc.Component);
a.default = p;
cc._RF.pop();
