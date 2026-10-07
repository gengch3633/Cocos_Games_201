let e = require;
let t = module;
let a = exports;
"use strict";
cc._RF.push(t, "b78290EagNAHo4oBb3dG399", "Level_Bar");
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
    t.maskNode = null;
    t.levelRootNode = null;
    t.roundRichText = null;
    t.tipNode = null;
    t.completedSpriteFrame = null;
    t.highlightSpriteFrame = null;
    t.normalSpriteFrame = null;
    t.targetSpriteFrame = null;
    t.changeWithScene = ! 0;
    t._period = 1;
    t._cacheVec3 = cc.v3();
    return t;
  }
  t.prototype._updateUI = function() {
    for(var e, t, a = c.FrameSDK.frameData.gameData.passLevel, o = 1, n = Number.MAX_SAFE_INTEGER, i = 0, s = r.FrameData.FRAME_CONF.CoinConf;
    i < s.length;
    i++) {
      var l = s[i];
      if(a < l.rdm_1) n = Math.min(n, l.rdm_1);
      else {
        o = Math.max(o, l.rdm_1);
        a < l.rdm_3? n = Math.min(n, l.rdm_3): o = Math.max(o, l.rdm_3);
      }
    }
    if(n === Number.MAX_SAFE_INTEGER) {
      this._period = 1;
      n = c.FrameSDK.frameData.gameData.passLevel+ 1;
      this.tipNode.opacity = 0;
    } else this.tipNode.opacity = 255;
    var u = Math.floor(Math.max(0, a- o)/ this._period),
    d = o+ this._period* u,
    p = n- d;
    p <= 1&& (p = n-(d = Math.max(1, d- this._period)));
    for(var h = this.levelRootNode.children, m = h.length, f = 0;
    f < m- 1;
    f++) {
      var _ = h[f],
      v = d+ f;
      _.active = f < p;
      cc.find("levelLabel", _).getComponent(cc.Label).string = ""+ v;
      if(v <= a) {
        _.getComponent(cc.Sprite).spriteFrame = this.completedSpriteFrame;
        cc.find("gou", _).active = ! 0;
      } else {
        _.getComponent(cc.Sprite).spriteFrame = v === a+ 1? this.highlightSpriteFrame: this.normalSpriteFrame;
        cc.find("gou", _).active = ! 1;
      }
    }
    var y = h[m- 1];
    cc.find("levelLabel", y).getComponent(cc.Label).string = ""+ n;
    cc.find("gou", y).active = n <= a;
    this.tipNode.opacity > 0? y.getComponent(cc.Sprite).spriteFrame = this.targetSpriteFrame: y.getComponent(cc.Sprite).spriteFrame = n <= a? this.completedSpriteFrame: n === a+ 1? this.highlightSpriteFrame: this.normalSpriteFrame;
    var g = a+ 1 === n? m- 1: a+ 1- d,
    D = c.FrameSDK.frameData.gameData.currentRound,
    F = c.FrameSDK.frameData.gameData.totalRound;
    if(g < 0) this.maskNode.width = 0;
    else if(g >= m) this.maskNode.width = this.maskNode.parent.width;
    else {
      h[g].convertToWorldSpaceAR(cc.Vec3.ZERO, this._cacheVec3);
      this.maskNode.convertToNodeSpaceAR(this._cacheVec3, this._cacheVec3);
      this.maskNode.width = this._cacheVec3.x;
    }
    this.roundRichText.string = "<outline color= #C16711 width=2>pkey_001</outline>??&value1==<color= #86FF04>"+ D+ "</c>&value2=="+ F;
    this.roundRichText.node.parent.opacity = F > 1&& a+ 1 <= n? 255: 0;
    this.roundRichText.node.parent.x = null !== (t = null === (e = h[g])|| void 0 === e? void 0: e.x)&& void 0 !== t? t: 99999;
    F > 1&& g === m- 1&& (this.tipNode.opacity = 0);
    if(this.changeWithScene) {
      this.node.active = ! c.FrameSDK.frameData.gameData.noProfitAd;
      var b = c.FrameSDK.frameData.gameData.currentScene;
      this.node.scale = "game" === b?.8: 0;
    }
  }
;
  t.prototype.onLoad = function() {
    cc.director.on("UPDATA_LEVEL", this._updateUI, this);
    this._period = Math.max(1, this.levelRootNode.children.length- 2);
    cc.tween(this.roundRichText.node.parent).by(1, {
      y: 3
    }
, {
      easing: "sineInOut"
    }
).by(1, {
      y:- 3
    }
, {
      easing: "sineInOut"
    }
).union().repeatForever().start();
    cc.tween(this.tipNode).to(.5, {
      scale:.9
    }
, {
      easing: "sineInOut"
    }
).to(.5, {
      scale: 1
    }
, {
      easing: "sineInOut"
    }
).union().repeatForever().start();
    this._updateUI();
  }
;
  i([u(cc.Node)], t.prototype, "maskNode", void 0);
  i([u(cc.Node)], t.prototype, "levelRootNode", void 0);
  i([u(cc.RichText)], t.prototype, "roundRichText", void 0);
  i([u(cc.Node)], t.prototype, "tipNode", void 0);
  i([u(cc.SpriteFrame)], t.prototype, "completedSpriteFrame", void 0);
  i([u(cc.SpriteFrame)], t.prototype, "highlightSpriteFrame", void 0);
  i([u(cc.SpriteFrame)], t.prototype, "normalSpriteFrame", void 0);
  i([u(cc.SpriteFrame)], t.prototype, "targetSpriteFrame", void 0);
  i([u], t.prototype, "changeWithScene", void 0);
  return i([l], t);
}
(cc.Component);
a.default = d;
cc._RF.pop();
