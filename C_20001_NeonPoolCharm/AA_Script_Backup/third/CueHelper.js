let e = require;
let t = module;
"use strict";
cc._RF.push(t, "dd796CHyn5I2ridH4i6tiGB", "CueHelper");
var o = e("BallLogicMgr.js"),
n = e("AudioManager.js");
function i(e, t) {
  var o;
  if("undefined" == typeof Symbol|| null == e[Symbol.iterator]) {
    if(Array.isArray(e)|| (o = a(e))|| t&& e&& "number" == typeof e.length) {
      o&& (e = o);
      var n = 0;
      return function() {
        return n >= e.length? {
          done: ! 0
        }
: {
          done: ! 1,
          value: e[n++]
        }
;
      }
;
    }
    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  return(o = e[Symbol.iterator]()).next.bind(o);
}
function a(e, t) {
  if(e) {
    if("string" == typeof e) return r(e, t);
    var o = Object.prototype.toString.call(e).slice(8, - 1);
    "Object" === o&& e.constructor&& (o = e.constructor.name);
    return "Map" === o|| "Set" === o? Array.from(e): "Arguments" === o|| / ^(?: Ui| I) nt(?: 8| 16| 32)(?: Clamped)? Array$/.test(o)? r(e, t): void 0;
  }
}
function r(e, t) {
(null == t|| t > e.length)&& (t = e.length);
  for(var o = 0, n = new Array(t);
  o < t;
  o++) n[o] = e[o];
  return n;
}
var l = Math.PI/ 180,
s = {
}
,
c = 100* o.BallIDType_White;
s.cueRes = null;
s.node_cue_container = null;
s.ball_white_pos_node = null;
s.ball_white = null;
s.ballMgr = null;
s.init = function(e, t, o, n) {
  s.cueRes = cc.find("plane_table", e).getChildByName("node_cue_container").getChildByName("node_cue2").getChildByName("10522_Pool_Cue_v1_SG");
  s.node_cue_container = cc.find("plane_table", e).getChildByName("node_cue_container");
  s.ball_white_pos_node = t;
  s.ball_white = o;
  s.ballMgr = n;
}
;
s.hide = function() {
  this.isOnAni|| (s.node_cue_container.opacity = 0);
}
;
s.show = function() {
  s.cueRes.y = 30;
  s.node_cue_container.opacity = 255;
}
;
s.isShow = function() {
  return s.node_cue_container&& 0 != s.node_cue_container.opacity&& ! this.isOnAni;
}
;
var u = [.75, .3, 0],
p = ["pool_ball_75", "pool_ball_50", "pool_ball_30"];
s.hideByAni = function(e, t) {
  for(var o = this, i = "pool_ball_30", a = 0;
  a < u.length;
  a++) if(e >= u[a]) {
    i = p[a];
    break;
  }
  this.isOnAni = ! 0;
  cc.tween(s.cueRes).to(.1, {
    y: 0
  }
, {
    easing: "quadOut"
  }
).call(function() {
    t();
    n.default.getInstance().playMusic(i);
  }
).to(.1, {
    y: 80
  }
, {
    easing: "quadOut"
  }
).call(function() {
    s.node_cue_container.opacity = 0;
    o.isOnAni = ! 1;
  }
).start();
}
;
s.CuePosByPower = function(e) {
  e > 0&& s.show();
  s.cueRes.y = 310* e+ 25;
}
;
s.applyByRad = function(e, t) {
  var o = s.node_cue_container;
  t = t|| 20;
  var n = Math.cos(e)* t,
  i = Math.sin(e)* t;
  n+= s.ball_white.x;
  i+= s.ball_white.y;
  o.x = n;
  o.y = i;
  var a = cc.v2(n- s.ball_white.x, i- s.ball_white.y),
  r = Math.atan2(i- s.ball_white.y, n- s.ball_white.x);
  o.angle = r/ l;
  return {
    dir: a,
    rad: e,
    len: t
  }
;
}
;
s.applyByTargetBall = function(e) {
  return s.applyByXY(e.x, e.y);
}
;
s.applyByXY = function(e, t) {
  this.curApplyXY = cc.v2(e, t);
  var o = Math.atan2(s.ball_white_pos_node.y- t, s.ball_white_pos_node.x- e);
  return s.applyByRad(o);
}
;
s.randomDirToBall = function() {
  if(s.ballMgr) {
    for(var e, t = i(s.ballMgr.entries());
!(e = t()).done;
) {
      var o = e.value,
      n = (o[0], o[1]),
      a = n.getComponent("Ball2DControl");
      if(c == a.ballID);
      else if(! a.isOnDestroy()) return s.applyByTargetBall(n);
    }
    return null;
  }
}
;
t.exports = s;
cc._RF.pop();
