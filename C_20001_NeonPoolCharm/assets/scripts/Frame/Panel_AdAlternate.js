let e = require;
let t = module;
let a = exports;
"use strict";
cc._RF.push(t, "c16cbArfQZMzYudIKN0sbJk", "Panel_AdAlternate");
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
var r = e("FrameSDK.js"),
c = e("WebViewManager.js"),
s = cc._decorator,
l = s.ccclass,
u = s.property,
d = function(e) {
  n(t, e);
  function t() {
    var t = null !== e&& e.apply(this, arguments)|| this;
    t.rewardLabel = null;
    t.maxFlagNode = null;
    t.tipLabel = null;
    t.adProgressBar = null;
    t.adProgressLabel = null;
    t.closeButtonNode = null;
    t.countdownProgressBar = null;
    t.countdownLabel = null;
    t.webViewAttachedNode = null;
    t.viewData = null;
    t._scheduleFunc = null;
    t._targetTime = 0;
    t._success = ! 0;
    t.hideTime = 0;
    return t;
  }
  t.prototype._stopSchedule = function() {
    if(null !== this._scheduleFunc&& void 0 !== this._scheduleFunc) {
      this.unschedule(this._scheduleFunc);
      this._scheduleFunc = null;
    }
  }
;
  t.prototype.onEnable = function() {
    var e = this;
    r.FrameSDK.openEffect(this);
    this.rewardLabel.string = ""+ r.FrameSDK.convertCoinToStr(this.viewData.reward, ! 1);
    this.maxFlagNode.active = this.viewData.isMax;
    this.tipLabel.string = "skey_147";
    this.adProgressBar.progress = 0;
    this.adProgressLabel.string = "skey_139??&value1==0%";
    this.closeButtonNode.active = ! 1;
    this.countdownProgressBar.node.active = ! 0;
    this.countdownProgressBar.progress = 0;
    this.countdownLabel.string = this.viewData.time+ "s";
    this.scheduleOnce(function() {
      var t, a;
      null === (a = (t = e.viewData).startCallback)|| void 0 === a|| a.call(t);
      c.default.showWebView(e.webViewAttachedNode, e.viewData.url, e);
    }
);
  }
;
  t.prototype.onDisable = function() {
    c.default.hideWebView(this.webViewAttachedNode);
  }
;
  t.prototype.onWebViewLoad = function(e) {
    var t = this;
    this._stopSchedule();
    if(e) {
      this._targetTime = Date.now()+ 1e3* this.viewData.time;
      this._success = ! 0;
      this.schedule(this._scheduleFunc = function() {
        var e = Math.max(0, t._targetTime- Date.now());
        t.adProgressBar.progress = (1e3* t.viewData.time- e)/ t.viewData.time/ 1e3;
        t.adProgressLabel.string = "skey_139??&value1=="+ Math.floor(100* t.adProgressBar.progress)+ "%";
        t.countdownProgressBar.progress = t.adProgressBar.progress;
        t.countdownLabel.string = Math.ceil(e/ 1e3)+ "s";
        if(e <= 0) {
          t._stopSchedule();
          t.tipLabel.string = "skey_148";
          t.closeButtonNode.active = ! 0;
          t.countdownProgressBar.node.active = ! 1;
        }
      }
);
    } else {
      this._targetTime = 0;
      this._success = ! 1;
      this.tipLabel.string = "skey_148";
      this.adProgressBar.progress = 1;
      this.adProgressLabel.string = "skey_139??&value1==100%";
      this.closeButtonNode.active = ! 0;
      this.countdownProgressBar.node.active = ! 1;
    }
  }
;
  t.prototype.onTouchCloseTips = function() {
    if(Date.now()- this.hideTime <= 300) console.log("wait!!!，return");
    else {
      this.hideTime = Date.now();
      var e = this.viewData.endCallback,
      t = this._success;
      r.FrameSDK.closeEffect(this, function() {
        return null == e? void 0: e(t);
      }
);
    }
  }
;
  i([u(cc.Label)], t.prototype, "rewardLabel", void 0);
  i([u(cc.Node)], t.prototype, "maxFlagNode", void 0);
  i([u(cc.Label)], t.prototype, "tipLabel", void 0);
  i([u(cc.ProgressBar)], t.prototype, "adProgressBar", void 0);
  i([u(cc.Label)], t.prototype, "adProgressLabel", void 0);
  i([u(cc.Node)], t.prototype, "closeButtonNode", void 0);
  i([u(cc.ProgressBar)], t.prototype, "countdownProgressBar", void 0);
  i([u(cc.Label)], t.prototype, "countdownLabel", void 0);
  i([u(cc.Node)], t.prototype, "webViewAttachedNode", void 0);
  return i([l], t);
}
(cc.Component);
a.default = d;
cc._RF.pop();
