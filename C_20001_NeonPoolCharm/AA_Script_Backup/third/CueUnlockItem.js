let e = require;
let t = module;
let o = exports;
"use strict";
cc._RF.push(t, "4e297hKUfhAhrApu4uWDwYq", "CueUnlockItem");
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
l = e("ConfigDataSys.js"),
s = e("ConfigDataMgr.js"),
c = cc._decorator,
u = c.ccclass,
p = c.property,
d = function(e) {
  i(t, e);
  function t() {
    var t = null !== e&& e.apply(this, arguments)|| this;
    t.cueNode = null;
    t.powerNode = null;
    t.spinNode = null;
    t.aimNode = null;
    t.configData = null;
    return t;
  }
  t.prototype.onLoad = function() {
    cc.Tween.stopAllByTarget(this.cueNode.parent);
    cc.tween(this.cueNode.parent).by(1.5, {
      y:- 10
    }
, {
      easing: "sineInOut"
    }
).by(1, {
      y: 10
    }
, {
      easing: "sineInOut"
    }
).union().repeatForever().start();
  }
;
  Object.defineProperty(t.prototype, "cueID", {
    set: function(e) {
      this.configData = l.default.cue_configMap.get(e);
      r.default.setCueSpine(this.cueNode, e);
      this._updateState();
    }
, enumerable: ! 1, configurable: ! 0
  }
);
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
  t.prototype._updateState = function() {
    cc.find("progressBar", this.powerNode).getComponent(cc.ProgressBar).progress = this._getCueAttriPercenter(s.ECueAttriType.E_POWER);
    cc.find("progressBar", this.spinNode).getComponent(cc.ProgressBar).progress = this._getCueAttriPercenter(s.ECueAttriType.E_SPIN);
    cc.find("progressBar", this.aimNode).getComponent(cc.ProgressBar).progress = this._getCueAttriPercenter(s.ECueAttriType.E_AMIING);
    var e = this.configData.force- r.default.getUsedCuePower(),
    t = this.configData.spin- r.default.getUsedCueRoleAngle(),
    o = this.configData.aiming- r.default.getUsedCueAimLineLen();
    this._updateChangeIcon(cc.find("changeNode/downSprite", this.powerNode), e < 0);
    this._updateChangeIcon(cc.find("changeNode/upSprite", this.powerNode), e > 0);
    this._updateChangeIcon(cc.find("changeNode/downSprite", this.spinNode), t < 0);
    this._updateChangeIcon(cc.find("changeNode/upSprite", this.spinNode), t > 0);
    this._updateChangeIcon(cc.find("changeNode/downSprite", this.aimNode), o < 0);
    this._updateChangeIcon(cc.find("changeNode/upSprite", this.aimNode), o > 0);
  }
;
  t.prototype._getCueAttriPercenter = function(e) {
    switch(e) {
      case s.ECueAttriType.E_POWER: return(this.configData.force- r.default.min_power)/(r.default.max_power- r.default.min_power)*.6+.4;
      case s.ECueAttriType.E_SPIN: return(this.configData.spin- r.default.min_spin)/(r.default.max_spin- r.default.min_spin)*.8+.2;
      case s.ECueAttriType.E_AMIING: return Number(this.configData.aiming)/ r.default.max_line_len;
    }
  }
;
  a([p(cc.Node)], t.prototype, "cueNode", void 0);
  a([p(cc.Node)], t.prototype, "powerNode", void 0);
  a([p(cc.Node)], t.prototype, "spinNode", void 0);
  a([p(cc.Node)], t.prototype, "aimNode", void 0);
  return a([u], t);
}
(cc.Component);
o.default = d;
cc._RF.pop();
