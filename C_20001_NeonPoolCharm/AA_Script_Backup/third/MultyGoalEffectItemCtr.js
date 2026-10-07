let e = require;
let t = module;
let o = exports;
"use strict";
cc._RF.push(t, "5dfc3r5N6ZOR7hi+0R0yeDm", "MultyGoalEffectItemCtr");
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
var r = e("AudioManager.js"),
l = e("EventMgr.js"),
s = e("GameEventType.js"),
c = cc._decorator,
u = c.ccclass,
p = c.menu,
d = c.property,
_ = (cc._decorator, [4, 3, 2]),
f = {
  2: {
    skAni: "Excellent",
    audio: "pool_comb2"
  }
,
  3: {
    skAni: "Perfect",
    audio: "pool_comb3"
  }
,
  4: {
    skAni: "Unbelievable",
    audio: "pool_comb4"
  }
}
,
h = function(e) {
  i(t, e);
  function t() {
    var t = null !== e&& e.apply(this, arguments)|| this;
    t.multy_goal_sk = null;
    t.multy_goal_root_node = null;
    return t;
  }
  t.prototype.onLoad = function() {
    this.multy_goal_sk.setCompleteListener(this.onAniComplete.bind(this));
    this.multy_goal_sk.node.active = ! 1;
  }
;
  t.prototype.onEnable = function() {
    l.default.listen(s.default.ON_MULTY_GOAL, this.onMultyGoal, this);
  }
;
  t.prototype.onDisable = function() {
    l.default.ignore(s.default.ON_MULTY_GOAL, this.onMultyGoal, this);
  }
;
  t.prototype.onAniComplete = function() {
    this.multy_goal_sk.node.active = ! 1;
  }
;
  t.prototype.onMultyGoal = function(e) {
    for(var t = 0, o = 0;
    o < _.length;
    o++) if(e >= _[o]) {
      t = _[o];
      break;
    }
    var n = f[t];
    if(n) {
      r.default.getInstance().playMusic(n.audio);
      this.multy_goal_sk.setAnimation(0, n.skAni, ! 1);
      this.multy_goal_sk.node.active = ! 0;
    }
  }
;
  a([d(sp.Skeleton)], t.prototype, "multy_goal_sk", void 0);
  a([d(cc.Node)], t.prototype, "multy_goal_root_node", void 0);
  return a([u, p("UI/pages/items/MultyGoalEffectItemCtr")], t);
}
(cc.Component);
o.default = h;
cc._RF.pop();
