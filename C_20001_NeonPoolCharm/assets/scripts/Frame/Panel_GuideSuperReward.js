let e = require;
let t = module;
let a = exports;
"use strict";
cc._RF.push(t, "aec70RIWAhPm4lthLf5hAfv", "Panel_GuideSuperReward");
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
s = cc._decorator,
l = s.ccclass,
u = s.property,
d = function(e) {
  n(t, e);
  function t() {
    var t = null !== e&& e.apply(this, arguments)|| this;
    t.bg = null;
    t.topUserLabel = null;
    t.viewData = null;
    t.black_sprite = null;
    t.hideTime = 0;
    return t;
  }
  t.prototype.onTouchCloseTips = function() {
    var e = this;
    if(Date.now()- this.hideTime <= 300) console.log("wait!!!，return");
    else {
      this.hideTime = Date.now();
      this.black_sprite.node.off(cc.Node.EventType.TOUCH_END, this.onTouchCloseTips, this);
      var t = .5* cc.winSize.width+.5* this.bg.width;
      cc.Tween.stopAllByTarget(this.bg);
      cc.tween(this.bg).to(.7, {
        x:- t
      }
, {
        easing: "backIn"
      }
).call(function() {
        c.FrameSDK.closeEffect(e, null);
      }
).start();
    }
  }
;
  t.prototype.onDisable = function() {
    var e,
    t;
    null === (t = null === (e = this.viewData)|| void 0 === e? void 0: e.closeCB)|| void 0 === t|| t.call(e);
  }
;
  t.prototype.onEnable = function() {
    c.FrameSDK.openEffect(this);
    c.FrameSDK.logGameEvent("thepool_task", {
      object_action: "show", object_name: "task_start"
    }
);
  }
;
  t.prototype.onLoad = function() {
    var e = this,
    t = .5* cc.winSize.width+.5* this.bg.width;
    this.bg.x = t;
    this.topUserLabel.string = "skey_124??&value1=="+ r.FrameData.FRAME_CONF.SuperRewardConfig.topNumber;
    c.FrameSDK.playEffect("rewardshow");
    cc.tween(this.bg).to(.7, {
      x: 0
    }
, {
      easing: "backOut"
    }
).call(function() {
      e.black_sprite.node.on(cc.Node.EventType.TOUCH_END, e.onTouchCloseTips, e);
    }
).start();
  }
;
  i([u(cc.Node)], t.prototype, "bg", void 0);
  i([u(cc.Label)], t.prototype, "topUserLabel", void 0);
  return i([l], t);
}
(cc.Component);
a.default = d;
cc._RF.pop();
