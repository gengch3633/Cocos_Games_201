let e = require;
let t = module;
let o = exports;
"use strict";
cc._RF.push(t, "8a81cjDx1lEdJOD3NJd4OW6", "ConditionTitleComp");
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
var r = e("BallLogicMgr.js"),
l = cc._decorator,
s = l.ccclass,
c = l.property,
u = function(e) {
  i(t, e);
  function t() {
    var t = null !== e&& e.apply(this, arguments)|| this;
    t.ball_prefab = null;
    t.condition = null;
    t.createBalls = null;
    return t;
  }
  t.prototype.updateGunNum = function(e) {
    cc.find("label_ganshu", this.node).getComponent(cc.Label).string = e+ "/"+ this.condition.ganNum;
  }
;
  t.prototype.updateContent = function() {
    this.createBalls = this.createBalls|| [];
    cc.find("label_ganshu", this.node).getComponent(cc.Label).string = "0/"+ this.condition.ganNum;
    for(var e = cc.find("node_balls", this.node), t = this.condition.cdBalls, o = 0, n = 0;
    n < t.length;
    n++) {
      var i = t[n];
      if(i.ballType == r.BallIDType_White);
      else if(i.ballType == r.BallIDType_Normal) {
        var a = cc.instantiate(this.ball_prefab);
        a.parent = e;
        a.x = 40* o;
        a.getComponent("BallMaterialComp").setMatIdx(i.ballMatIdx);
        this.createBalls.push(a);
        o+= 1;
      }
    }
  }
;
  t.prototype.clear = function() {
    this.createBalls = this.createBalls|| [];
    for(var e = 0;
    e < this.createBalls.length;
    e++) {
      this.createBalls[e].destroy();
      this.createBalls[e].parent = null;
    }
    this.createBalls = [];
  }
;
  t.prototype.onLoad = function() {
    this.condition = this.condition|| null;
    this.createBalls = this.createBalls|| [];
    console.log("onLoad", this.condition, this.ball_prefab);
  }
;
  t.prototype.setCondition = function(e) {
    this.condition = e;
    this.updateContent();
  }
;
  t.prototype.onDestroy = function() {
    this.clear();
  }
;
  a([c(cc.Prefab)], t.prototype, "ball_prefab", void 0);
  return a([s], t);
}
(cc.Component);
o.default = u;
cc._RF.pop();
