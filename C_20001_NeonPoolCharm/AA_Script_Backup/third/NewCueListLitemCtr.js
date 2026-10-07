let e = require;
let t = module;
let o = exports;
"use strict";
cc._RF.push(t, "a5cf4mh81VNNK1tohLSXLak", "NewCueListLitemCtr");
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
var r = e("CueDataSys.js"),
l = e("GameHelper.js"),
s = e("PoolLogger.js"),
c = e("ConfigDataSys.js"),
u = e("ConfigDataMgr.js"),
p = e("EventMgr.js"),
d = e("GameEventType.js"),
_ = e("ListItem.js"),
f = e("GameServiceMgr.js"),
h = e("UiManage.js"),
g = cc._decorator,
y = g.ccclass,
v = g.property,
m = function(e) {
  i(t, e);
  function t() {
    var t = null !== e&& e.apply(this, arguments)|| this;
    t.nameLabel = null;
    t.cue_spine = null;
    t.cue_spine_shadow = null;
    t.usingNode = null;
    t.useNode = null;
    t.getNode = null;
    t.adNode = null;
    t.lockProgressBar = null;
    t.progressLabel = null;
    t.powerNode = null;
    t.spinNode = null;
    t.aimNode = null;
    t._curTouchLock = null;
    t.cb = null;
    t._cueID = null;
    t.configData = null;
    return t;
  }
  t.prototype.onUnlockClubsChanged = function() {
    this._updateState();
  }
;
  t.prototype.initData = function(e, t) {
    this.cb = t;
    this._curTouchLock = ! 1;
    this._cueID = e;
    this.configData = c.default.cue_configMap.get(this._cueID);
    this.lockProgressBar.progress = 0;
    this.progressLabel.string = "(0/3)";
    if(this.configData) {
      this._updateCue();
      this._updateState();
      this.getNode.active&& s.PoolLogger.instance.logEvent("c_ad_event", {
        action: "exposure", type: "video", placement: "unlock_cue"
      }
);
    }
  }
;
  t.prototype.onClickUseBtn = function() {
    var e = this;
    if(! this._curTouchLock) {
      this._curTouchLock = ! 0;
      f.default.changeClub(this._cueID, function() {
        e._curTouchLock = ! 1;
      }
, function() {
        e._curTouchLock = ! 1;
      }
);
    }
  }
;
  t.prototype.onClickGetBtn = function() {
    var e = this;
    if(! this._curTouchLock) {
      this._curTouchLock = ! 0;
      s.PoolLogger.instance.logEvent("c_ad_event", {
        action: "touch", type: "video", placement: "unlock_cue"
      }
);
      l.default.instance.showVideo("unlock_cue", ! 1, function(e) {
        s.PoolLogger.instance.logGameEvent("thepool_game_ad", {
          object_action: "show", object_name: "new_cue", object_notes: "video" === e? "video": "web" === e? "web": "inter"
        }
);
      }
, function(t) {
        f.default.getClub(e._cueID, function() {
          var o, n;
          e._curTouchLock = ! 1;
          if(l.default.pocketed&& t) {
            var i = l.default.getClassByName("FrameData").getCharityOutNum();
            null === (o = l.default.frameSDK)|| void 0 === o|| o.addCoin(0, i, 1, function() {
              var t;
              e.isValid&& (null === (t = e.cb)|| void 0 === t|| t.call(e));
            }
);
          } else null === (n = e.cb)|| void 0 === n|| n.call(e);
        }
, function() {
          e._curTouchLock = ! 1;
        }
);
      }
, function() {
        return e._curTouchLock = ! 1;
      }
);
    }
  }
;
  t.prototype.onLoad = function() {
    e.prototype.onLoad.call(this);
    h.UiManager.addButtonListen(this.useNode, this.onClickUseBtn, this, null, 0);
    h.UiManager.addButtonListen(this.getNode, this.onClickGetBtn, this, null, 0);
  }
;
  t.prototype.onUsedClubChanged = function() {
    this._updateState();
  }
;
  Object.defineProperty(t.prototype, "unlockCount", {
    set: function(e) {
      if(e >= 3) {
        this.lockProgressBar.progress = 1;
        this.progressLabel.string = "(3/3)";
      } else {
        e = Math.max(0, Math.floor(e));
        this.lockProgressBar.progress = .1+.2* e;
        this.progressLabel.string = "("+ e+ "/3)";
      }
    }
, enumerable: ! 1, configurable: ! 0
  }
);
  t.prototype._updateState = function() {
    var e = this.configData.force- r.default.getUsedCuePower(),
    t = this.configData.spin- r.default.getUsedCueRoleAngle(),
    o = this.configData.aiming- r.default.getUsedCueAimLineLen();
    this._updateChangeIcon(cc.find("changeNode/downSprite", this.powerNode), e < 0);
    this._updateChangeIcon(cc.find("changeNode/upSprite", this.powerNode), e > 0);
    this._updateChangeIcon(cc.find("changeNode/downSprite", this.spinNode), t < 0);
    this._updateChangeIcon(cc.find("changeNode/upSprite", this.spinNode), t > 0);
    this._updateChangeIcon(cc.find("changeNode/downSprite", this.aimNode), o < 0);
    this._updateChangeIcon(cc.find("changeNode/upSprite", this.aimNode), o > 0);
    if(r.default.isCueNotOpened(this._cueID)) {
      this.usingNode.active = ! 1;
      this.useNode.active = ! 1;
      this.getNode.active = ! 1;
      this.lockProgressBar.node.active = ! 0;
    } else if(r.default.isCueUnlocked(this._cueID)) {
      if(this._cueID !== r.default.usedCueId) {
        this.usingNode.active = ! 1;
        this.useNode.active = ! 0;
        this.getNode.active = ! 1;
        this.lockProgressBar.node.active = ! 1;
      } else {
        this.usingNode.active = ! 0;
        this.useNode.active = ! 1;
        this.getNode.active = ! 1;
        this.lockProgressBar.node.active = ! 1;
      }
    } else {
      this.usingNode.active = ! 1;
      this.useNode.active = ! 1;
      this.getNode.active = ! 0;
      this.lockProgressBar.node.active = ! 1;
    }
  }
;
  t.prototype.getCueAttriPercenter = function(e) {
    switch(e) {
      case u.ECueAttriType.E_POWER: return(this.configData.force- r.default.min_power)/(r.default.max_power- r.default.min_power)*.6+.4;
      case u.ECueAttriType.E_SPIN: return(this.configData.spin- r.default.min_spin)/(r.default.max_spin- r.default.min_spin)*.8+.2;
      case u.ECueAttriType.E_AMIING: return Number(this.configData.aiming)/ r.default.max_line_len;
    }
  }
;
  t.prototype._updateCue = function() {
    var e,
    t = this;
    h.UiManager.loadSpine(this.cue_spine, "cue_spine", r.default.getCueSourceName(this._cueID), function(e) {
      t.cue_spine.getComponent(sp.Skeleton).setAnimation(0, "animation", ! 0);
      t.cue_spine_shadow.getComponent(sp.Skeleton).skeletonData = e;
      t.cue_spine_shadow.getComponent(sp.Skeleton).setAnimation(0, "animation", ! 0);
    }
);
    cc.find("progressBar", this.powerNode).getComponent(cc.ProgressBar).progress = this.getCueAttriPercenter(u.ECueAttriType.E_POWER);
    cc.find("progressBar", this.spinNode).getComponent(cc.ProgressBar).progress = this.getCueAttriPercenter(u.ECueAttriType.E_SPIN);
    cc.find("progressBar", this.aimNode).getComponent(cc.ProgressBar).progress = this.getCueAttriPercenter(u.ECueAttriType.E_AMIING);
    this.nameLabel.string = ""+(null !== (e = this.configData.name)&& void 0 !== e? e: "");
  }
;
  t.prototype.onEnable = function() {
    var t;
    null === (t = e.prototype.onEnable)|| void 0 === t|| t.call(this);
    this._curTouchLock = ! 1;
    p.default.listen(d.default.ON_UNLOCKED_CLUBS_CHANGED, this.onUnlockClubsChanged, this);
    p.default.listen(d.default.ON_USED_CLUB_CHANGED, this.onUsedClubChanged, this);
  }
;
  t.prototype.onDisable = function() {
    p.default.ignore(d.default.ON_UNLOCKED_CLUBS_CHANGED, this.onUnlockClubsChanged, this);
    p.default.ignore(d.default.ON_USED_CLUB_CHANGED, this.onUsedClubChanged, this);
  }
;
  t.prototype._updateChangeIcon = function(e, t) {
    e.active = t;
    e.scale = 1;
    cc.Tween.stopAllByTarget(e);
    t&& cc.tween(e).to(.4, {
      scale: 1.2
    }
, {
      easing: "sineInOut"
    }
).to(.4, {
      scale: 1
    }
, {
      easing: "sineInOut"
    }
).union().repeatForever().start();
  }
;
  a([v(cc.Label)], t.prototype, "nameLabel", void 0);
  a([v(cc.Node)], t.prototype, "cue_spine", void 0);
  a([v(cc.Node)], t.prototype, "cue_spine_shadow", void 0);
  a([v(cc.Node)], t.prototype, "usingNode", void 0);
  a([v(cc.Node)], t.prototype, "useNode", void 0);
  a([v(cc.Node)], t.prototype, "getNode", void 0);
  a([v(cc.Node)], t.prototype, "adNode", void 0);
  a([v(cc.ProgressBar)], t.prototype, "lockProgressBar", void 0);
  a([v(cc.Label)], t.prototype, "progressLabel", void 0);
  a([v(cc.Node)], t.prototype, "powerNode", void 0);
  a([v(cc.Node)], t.prototype, "spinNode", void 0);
  a([v(cc.Node)], t.prototype, "aimNode", void 0);
  return a([y], t);
}
(_.default);
o.default = m;
cc._RF.pop();
