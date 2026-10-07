let e = require;
let t = module;
let a = exports;
"use strict";
cc._RF.push(t, "a0da2oorBNPbo0M8j/T4BZz", "FlyingBonus");
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
    t.numLabel = null;
    t._available = ! 1;
    t._cachedPosition1 = cc.v3();
    t._cachedPosition2 = cc.v3();
    return t;
  }
  a = t;
  t.prototype.onLoad = function() {
    cc.director.on("SHOW_FLYING_BONUS", this._startFly, this);
    cc.director.on("HIDE_FLYING_BONUS", this._stopFly, this);
    this.node.opacity = 0;
  }
;
  t.prototype.onDestroy = function() {
    cc.director.removeAll(this);
  }
;
  t.prototype.onEnable = function() {
    this._startFly();
  }
;
  t.prototype._startFly = function() {
    var e = this;
    if(! c.FrameSDK.frameData.gameData.noProfitAd) {
      var t = c.FrameSDK.frameData.gameData.currentScene;
      if("home" === t|| "game" === t) {
        var o = c.FrameSDK.frameData.gameData.passLevel;
        if(!(o < r.FrameData.FRAME_CONF.flyingBonusLevel|| r.FrameData.saveData.flyingBonusIndex >= o&& a._sceneLoadedRecord[t])) {
          a._sceneLoadedRecord[t] = ! 0;
          if(! this._available) {
            c.FrameSDK.logCommonEvent("c_ad_event", {
              action: "exposure", type: "video", placement: "fly_sup"
            }
);
            this._available = ! 0;
            this.numLabel.string = ""+ c.FrameSDK.convertCoinToStr(r.FrameData.getCoinOutNum("flyingBonus"));
            this.scheduleOnce(function() {
              c.FrameSDK.logGameEvent("thepool_game_rew", {
                object_action: "show", object_name: "fly_sup"
              }
);
              e.node.on(cc.Node.EventType.TOUCH_END, e._onClick, e);
              e._cachedPosition1.x = 0;
              e._cachedPosition1.y = 200;
              e._cachedPosition1.z = 0;
              e.node.parent.convertToNodeSpaceAR(e._cachedPosition1, e._cachedPosition1);
              e._cachedPosition2.x = cc.winSize.width;
              e._cachedPosition2.y = cc.winSize.height- 300;
              e._cachedPosition2.z = 0;
              e.node.parent.convertToNodeSpaceAR(e._cachedPosition2, e._cachedPosition2);
              var t = e._cachedPosition1.x+ e.node.width* e.node.anchorX, a = e._cachedPosition2.y+ e.node.height* e.node.anchorY, o = e._cachedPosition2.x- e.node.width*(1- e.node.anchorX), n = e._cachedPosition1.y- e.node.height*(1- e.node.anchorY), i = (n- a)/ 5;
              cc.Tween.stopAllByTarget(e.node);
              cc.tween(e.node).set({
                x: t- e.node.width, y: a, opacity: 255
              }
).to(4, {
                x: {
                  value: o, easing: "sineInOut"
                }
, y: a+ i
              }
).to(4, {
                x: {
                  value: t, easing: "sineInOut"
                }
, y: a+ 2* i
              }
).to(4, {
                x: {
                  value: o, easing: "sineInOut"
                }
, y: a+ 3* i
              }
).to(4, {
                x: {
                  value: t, easing: "sineInOut"
                }
, y: a+ 4* i
              }
).to(4, {
                x: {
                  value: o+ e.node.width, easing: "sineInOut"
                }
, y: n
              }
).union().repeatForever().start();
            }
);
          }
        }
      }
    }
  }
;
  t.prototype._stopFly = function() {
    this._available = ! 1;
    this.node.opacity = 0;
    cc.Tween.stopAllByTarget(this.node);
  }
;
  t.prototype._onClick = function() {
    if(this._available) {
      this._available = ! 1;
      this.node.off(cc.Node.EventType.TOUCH_END, this._onClick, this);
      c.FrameSDK.logCommonEvent("c_ad_event", {
        action: "touch", type: "video", placement: "fly_sup"
      }
);
      c.FrameSDK.logGameEvent("thepool_game_rew", {
        object_action: "click", object_name: "fly_sup"
      }
);
      cc.Tween.stopAllByTarget(this.node);
      this.node.opacity = 0;
      r.FrameData.saveData.flyingBonusIndex = c.FrameSDK.frameData.gameData.passLevel;
      var e = r.FrameData.getCoinOutNum("flyingBonus");
      c.FrameSDK.openVideo("fly_sup", ! 1, function(e) {
        c.FrameSDK.logGameEvent("thepool_game_ad", {
          object_action: "show", object_name: "fly_sup", object_notes: "video" === e? "video": "web" === e? "web": "inter"
        }
);
      }
, function(t) {
        var a = 0, o = 0;
        if(t) {
          a = r.FrameData.getCharityOutNum();
          o = 1;
        }
        c.FrameSDK.addCoin(e, a, o);
      }
, void 0, {
        reward: e, isMax: ! 1
      }
);
    }
  }
;
  var a;
  t._sceneLoadedRecord = {
  }
;
  i([u(cc.Label)], t.prototype, "numLabel", void 0);
  return a = i([l], t);
}
(cc.Component);
a.default = d;
cc._RF.pop();
