let e = require;
let t = module;
let o = exports;
"use strict";
cc._RF.push(t, "bcfa3z7MlJALqJPnkHm1Qme", "GameHelper");
Object.defineProperty(o, "__esModule", {
  value: ! 0
}
);
var n = e("GuideManager.js"),
i = e("GameServiceMgr.js"),
a = e("CoinfinityRideress.js"),
r = e("PoolNative.js"),
l = e("PageMgr.js"),
s = e("Debugger.js"),
c = function() {
  function e() {
    this._lastVideoEndTime = 0;
  }
  Object.defineProperty(e, "instance", {
    get: function() {
      var t;
      return null !== (t = this._instance)&& void 0 !== t? t: this._instance = new e();
    }
, enumerable: ! 1, configurable: ! 0
  }
);
  Object.defineProperty(e, "pocketed", {
    get: function() {
      return ! 0 === this.__Nhwi8h85e9sfgz__;
    }
, enumerable: ! 1, configurable: ! 0
  }
);
  e.prototype.init = function() {
    cc.director.on(cc.Director.EVENT_BEFORE_SCENE_LAUNCH, this._beforeSceneLaunch, this);
    cc.director.on(cc.Director.EVENT_AFTER_SCENE_LAUNCH, this._afterSceneLaunch, this);
    r.PoolNative.setAppLifecycleChangeCallback("cc.js.getClassByName('GameHelper').instance._onAppLifecycleChange");
    s.Debugger.isDebugMode&& r.PoolNative.setSecureFlag(! 1);
  }
;
  Object.defineProperty(e, "frameSDK", {
    get: function() {
      return this.getClassByName("FrameSDK");
    }
, enumerable: ! 1, configurable: ! 0
  }
);
  Object.defineProperty(e, "frameData", {
    get: function() {
      return this.getClassByName("FrameData");
    }
, enumerable: ! 1, configurable: ! 0
  }
);
  Object.defineProperty(e, "spawn", {
    get: function() {
      var e;
      return null !== (e = a.CoinfinityRideress.instance.dissentious.spawn)&& void 0 !== e&& e;
    }
, enumerable: ! 1, configurable: ! 0
  }
);
  Object.defineProperty(e, "intranetValue", {
    get: function() {
      var e;
      return null !== (e = a.CoinfinityRideress.instance.intranet)&& void 0 !== e&& e;
    }
, enumerable: ! 1, configurable: ! 0
  }
);
  Object.defineProperty(e, "countryCode", {
    get: function() {
      var e;
      return null !== (e = a.CoinfinityRideress.instance.dissentious.dragons)&& void 0 !== e? e: "";
    }
, enumerable: ! 1, configurable: ! 0
  }
);
  e.prototype._beforeSceneLaunch = function() {
  }
;
  e.getClassByName = function(e) {
    return cc.js.getClassByName(e)|| cc.js._registeredClassNames[e];
  }
;
  e.prototype._onNewHandFinish = function() {
    n.default.Instance.checkGuide();
  }
;
  e.prototype.showInterstitial = function(t, o, n, i, a, r) {
    var l = e.frameSDK;
(null == l? void 0: l.isShowInters())? l.openInters(t, o, n, i, a, r): null == i|| i(! 1);
  }
;
  e.prototype.addFrameListener = function() {
    var t,
    o;
    null === (t = e.frameSDK)|| void 0 === t|| t.addNewHandFinishListen(this._onNewHandFinish, this);
    null === (o = e.frameSDK)|| void 0 === o|| o.addSuperAwardListen(this._onSuperAward, this);
  }
;
  e.prototype._afterSceneLaunch = function(e) {
    if("game_main" === e.name) {
      this._addFrameUI(e);
      null != cc.sys.localStorage.getItem("newHand")&& n.default.Instance.checkGuide();
    } else "game_tabel" === e.name&& this._addFrameUI(e);
  }
;
  e.prototype.showVideo = function(t, o, n, i, a, r) {
    var l = e.frameSDK;
    l? l.openVideo(t, o, n, i, a, r): i(! 1);
  }
;
  e.prototype._onAppLifecycleChange = function(e) {
    cc.director.emit("APP_LIFECYCLE_CHANGE", e);
  }
;
  e.prototype._addFrameUI = function(e) {
    var t = cc.assetManager.getBundle("Frame");
    t? t.load("Frame", cc.Prefab, function(t, o) {
      var n, i, a = e.getComponentInChildren(cc.Canvas);
      if(a) {
        var r = cc.instantiate(o);
        r.parent = a.node;
        null === (n = l.default.effects)|| void 0 === n|| n.removeAllChildren(! 0);
        null === (i = r.getChildByName("effectsNode"))|| void 0 === i|| i.setParent(l.default.effects);
      } else console.error("Canvas not found");
    }
): console.warn("Frame bundle not found");
  }
;
  e.prototype._onSuperAward = function(e, t) {
    "show" === e? i.default.refreshNextClub(null, function() {
    }
): null != t&& i.default.getClub(t, function() {
    }
);
  }
;
  e._instance = null;
  return e;
}
();
o.default = c;
cc.js.setClassName("GameHelper", c);
cc._RF.pop();
