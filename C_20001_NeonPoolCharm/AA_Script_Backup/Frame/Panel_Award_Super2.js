let e = require;
let t = module;
let a = exports;
"use strict";
cc._RF.push(t, "437c3AzOtNLv7MiBOrtNTjk", "Panel_Award_Super2");
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
    t.externalRootNode = null;
    t.titleSkeleton2 = null;
    t.extraBonusNode = null;
    t.bonusLabel2 = null;
    t.adActionButton2 = null;
    t.noAdIcon = null;
    t.adIcon2 = null;
    t.commonActionButton2 = null;
    t.guide = null;
    t.hand = null;
    t.viewData = null;
    t.isTouch = ! 0;
    t._dialogOriginalY = 0;
    t.hideTime = 0;
    return t;
  }
  t.prototype.onBtnEvent = function() {
    var e = this;
    if(this.isTouch) {
      this.isTouch = ! 1;
      var t = ! this.adIcon2.active;
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
        cc.director.emit("SUPER_AWARD", "claim", e.viewData.param);
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
  t.prototype.onEnable = function() {
    var e = this;
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
    this.externalRootNode.removeAllChildren();
    this.viewData.externalNode&& this.externalRootNode.addChild(this.viewData.externalNode);
    this.titleSkeleton2.setAnimation(0, "start", ! 1);
    this.titleSkeleton2.addAnimation(0, "loop", ! 0);
    var t = s.FrameSDK.convertCoinToStr(this.viewData.bonus),
    a = s.FrameSDK.convertCoinToStr(this.viewData.freeBonus),
    o = ! s.FrameSDK.frameData.gameData.noProfitAd;
    this.bonusLabel2.string = ""+ t;
    this.noAdIcon.active = ! o;
    this.adIcon2.active = o;
    this.commonActionButton2.active = o;
    this.commonActionButton2.getComponentInChildren(cc.Label).string = "skey_034 "+ a;
    this.extraBonusNode.scale = 0;
    this.extraBonusNode.y = this._dialogOriginalY;
    cc.Tween.stopAllByTarget(this.extraBonusNode);
    cc.tween(this.extraBonusNode).delay(1).set({
      scale:.2
    }
).to(.4, {
      scale: 1
    }
, {
      easing: "backOut"
    }
).call(function() {
      cc.tween(e.extraBonusNode).by(1, {
        y: 5
      }
, {
        easing: "sineInOut"
      }
).by(1.5, {
        y:- 5
      }
, {
        easing: "sineInOut"
      }
).union().repeatForever().start();
    }
).start();
    if(c.FrameData.saveData.freeSuperAward) {
      c.FrameData.saveData.freeSuperAward = ! 1;
      this.noAdIcon.active = ! 0;
      this.adIcon2.active = ! 1;
      this.commonActionButton2.active = ! 1;
      this.guide.active = ! 0;
      this.hand.active = ! 0;
    } else {
      this.guide.active = ! 1;
      this.hand.active = ! 1;
    }
  }
;
  t.prototype.onLoad = function() {
    this.adActionButton2.on(cc.Node.EventType.TOUCH_END, this.onBtnEvent, this);
    this.commonActionButton2.on(cc.Node.EventType.TOUCH_END, this.click_Common, this);
    this._dialogOriginalY = this.extraBonusNode.y;
    var e = s.FrameSDK.getNoAdDelayTime();
    null != e&& e >= 0&& (this.commonActionButton2.getComponent(r.default).dtime+= e);
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
  i([d(cc.Node)], t.prototype, "externalRootNode", void 0);
  i([d(sp.Skeleton)], t.prototype, "titleSkeleton2", void 0);
  i([d(cc.Node)], t.prototype, "extraBonusNode", void 0);
  i([d(cc.Label)], t.prototype, "bonusLabel2", void 0);
  i([d(cc.Node)], t.prototype, "adActionButton2", void 0);
  i([d(cc.Node)], t.prototype, "noAdIcon", void 0);
  i([d(cc.Node)], t.prototype, "adIcon2", void 0);
  i([d(cc.Node)], t.prototype, "commonActionButton2", void 0);
  i([d(cc.Node)], t.prototype, "guide", void 0);
  i([d(cc.Node)], t.prototype, "hand", void 0);
  return i([u], t);
}
(cc.Component);
a.default = p;
cc._RF.pop();
