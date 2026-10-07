let e = require;
let t = module;
let a = exports;
"use strict";
cc._RF.push(t, "90340kWrS1BMZemoYMBTU+1", "Panel_Award_Super1");
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
var r = e("AinanEff.js"),
c = e("FrameData.js"),
s = e("FrameSDK.js"),
l = cc._decorator,
u = l.ccclass,
d = l.property,
p = function(e) {
  n(t, e);
  function t() {
    var t = null !== e&& e.apply(this, arguments)|| this;
    t.titleSkeleton1 = null;
    t.bonusLabel1 = null;
    t.adActionButton1 = null;
    t.noAdIcon = null;
    t.adIcon1 = null;
    t.commonActionButton1 = null;
    t.viewData = null;
    t.isTouch = ! 0;
    t.hideTime = 0;
    return t;
  }
  t.prototype.onEnable = function() {
    s.FrameSDK.openEffect(this, {
      opacity: 240
    }
);
    s.FrameSDK.playEffect("rewardshow");
    s.FrameSDK.frameData.sdkFuc.ppEvent("popupShow");
    s.FrameSDK.logCommonEvent("c_ad_event", {
      action: "exposure", type: "video", placement: "reward_sup"
    }
);
    s.FrameSDK.logGameEvent("thepool_game_rew", {
      object_action: "show", object_name: "sup_show"
    }
);
    this.titleSkeleton1.setAnimation(0, "start", ! 1);
    this.titleSkeleton1.addAnimation(0, "loop", ! 0);
    var e = s.FrameSDK.convertCoinToStr(this.viewData.bonus),
    t = s.FrameSDK.convertCoinToStr(this.viewData.freeBonus),
    a = ! s.FrameSDK.frameData.gameData.noProfitAd;
    this.bonusLabel1.string = ""+ e;
    this.noAdIcon.active = ! a;
    this.adIcon1.active = a;
    this.commonActionButton1.active = a;
    this.commonActionButton1.getComponentInChildren(cc.Label).string = "skey_034 "+ t;
  }
;
  t.prototype.onBtnEvent = function() {
    var e = this;
    if(this.isTouch) {
      this.isTouch = ! 1;
      var t = ! this.adIcon1.active;
      s.FrameSDK.frameData.sdkFuc.ppEvent(t? "freeClaim": "claim");
      s.FrameSDK.logCommonEvent("c_ad_event", {
        action: "touch", type: "video", placement: "reward_sup"
      }
);
      s.FrameSDK.logGameEvent("thepool_game_rew", {
        object_action: "show", object_name: "sup_ad"
      }
);
      var a = function(a) {
        var o = 0,
        n = 0;
        if(! t&& a) {
          o = c.FrameData.getCharityOutNum();
          n = 1;
        }
        s.FrameSDK.frameData.sdkFuc.ppEvent(t? "freeCollected": "collected");
        s.FrameSDK.addCoin(e.viewData.bonus, o, n, e.viewData.closeCB);
        e.onTouchCloseTips();
      }
;
      t? a(! 1): s.FrameSDK.openVideo("reward_sup", ! 1, function(e) {
        s.FrameSDK.logGameEvent("thepool_game_ad", {
          object_action: "show", object_name: "reward_sup", object_notes: "video" === e? "video": "web" === e? "web": "inter"
        }
);
      }
, function(e) {
        return a(e);
      }
, function() {
        return e.isTouch = ! 0;
      }
, {
        reward: this.viewData.bonus, isMax: ! 1
      }
);
    }
  }
;
  t.prototype.onTouchCloseTips = function() {
    if(Date.now()- this.hideTime <= 300) console.log("wait!!!，return");
    else {
      this.hideTime = Date.now();
      s.FrameSDK.closeEffect(this, null);
    }
  }
;
  t.prototype.onLoad = function() {
    this.adActionButton1.on(cc.Node.EventType.TOUCH_END, this.onBtnEvent, this);
    this.commonActionButton1.on(cc.Node.EventType.TOUCH_END, this.click_Common, this);
    var e = s.FrameSDK.getNoAdDelayTime();
    null != e&& e >= 0&& (this.commonActionButton1.getComponent(r.default).dtime+= e);
  }
;
  t.prototype.click_Common = function() {
    var e = this;
    if(this.isTouch) {
      this.isTouch = ! 1;
      s.FrameSDK.logGameEvent("thepool_game_rew", {
        object_action: "show", object_name: "sup_free"
      }
);
      s.FrameSDK.frameData.sdkFuc.ppEvent("freeClaim");
(function(t) {
        var a = 0, o = 0;
        if(t) {
          a = c.FrameData.getCharityOutNum();
          o = 1;
        }
        s.FrameSDK.addCoin(e.viewData.freeBonus, a, o, e.viewData.closeCB);
        s.FrameSDK.frameData.sdkFuc.ppEvent("freeCollected");
        e.onTouchCloseTips();
      }
)(! 1);
    }
  }
;
  i([d(sp.Skeleton)], t.prototype, "titleSkeleton1", void 0);
  i([d(cc.Label)], t.prototype, "bonusLabel1", void 0);
  i([d(cc.Node)], t.prototype, "adActionButton1", void 0);
  i([d(cc.Node)], t.prototype, "noAdIcon", void 0);
  i([d(cc.Node)], t.prototype, "adIcon1", void 0);
  i([d(cc.Node)], t.prototype, "commonActionButton1", void 0);
  return i([u], t);
}
(cc.Component);
a.default = p;
cc._RF.pop();
