let e = require;
let t = module;
let o = exports;
"use strict";
cc._RF.push(t, "b0e06k6AiBLbrAvaNUJ7ws0", "CircleRayComp");
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
var r = e("GlobalConfig.js"),
l = e("BallLogicMgr.js"),
s = e("CueDataSys.js"),
c = e("PropDataSys.js"),
u = e("EngineUtil.js"),
p = e("MyCircleColliderUtility.js"),
d = cc._decorator,
_ = d.ccclass,
f = d.property;
function h(e, t) {
  var o;
  if("undefined" == typeof Symbol|| null == e[Symbol.iterator]) {
    if(Array.isArray(e)|| (o = g(e))|| t&& e&& "number" == typeof e.length) {
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
function g(e, t) {
  if(e) {
    if("string" == typeof e) return y(e, t);
    var o = Object.prototype.toString.call(e).slice(8, - 1);
    "Object" === o&& e.constructor&& (o = e.constructor.name);
    return "Map" === o|| "Set" === o? Array.from(e): "Arguments" === o|| / ^(?: Ui| I) nt(?: 8| 16| 32)(?: Clamped)? Array$/.test(o)? y(e, t): void 0;
  }
}
function y(e, t) {
(null == t|| t > e.length)&& (t = e.length);
  for(var o = 0, n = new Array(t);
  o < t;
  o++) n[o] = e[o];
  return n;
}
var v = Math.PI/ 180,
m = s.default,
b = c.default;
u.default;
var C = p.default,
P = r.ball_radius,
S = P* P* 4,
I = function(e) {
  i(t, e);
  function t() {
    var t = null !== e&& e.apply(this, arguments)|| this;
    t.virtualball = null;
    t.mid = null;
    return t;
  }
  t.prototype.get_distance = function(e, t) {
    var o = this.mid,
    n = cc.v2(o.x+ 250, o.y+ 500),
    i = null,
    a = null;
    if(e >= Math.PI/ 2) {
      i = cc.v2(0, - n.y);
      a = cc.v2(500- n.x, 0);
    } else if(e < Math.PI/ 2&& e >= 0) {
      i = cc.v2(0, - n.y);
      a = cc.v2(- n.x, 0);
    } else if(e > - Math.PI/ 2&& e < 0) {
      i = cc.v2(0, 1e3- n.y);
      a = cc.v2(- n.x, 0);
    } else if(e <= - Math.PI/ 2) {
      i = cc.v2(0, 1e3- n.y);
      a = cc.v2(500- n.x, 0);
    }
    var r = (t = t.normalizeSelf().mulSelf(1e3)).project(i),
    l = t.project(a),
    s = Math.abs(l.x)/ Math.abs(a.x);
    if(Math.abs(r.y)/ Math.abs(i.y) > s) {
      l.x = l.x*(Math.abs(i.y)/ Math.abs(r.y));
      r.y = i.y;
    } else {
      r.y = r.y*(Math.abs(a.x)/ Math.abs(l.x));
      l.x = a.x;
    }
    return cc.v2(l.x, r.y).mag();
  }
;
  t.prototype.getColliderP_Pollygon = function(e, t, o) {
    o = o.normalize().mulSelf(2e3);
    for(var n = {
      start: t, end: t.add(o)
    }
, i = e.getComponent(cc.PolygonCollider).points, a = null, l = null, s = (i[0], 0);
    s < i.length;
    s++) {
      i[s],
      i[(s+ 1)% i.length];
      var c = C.collideWhitLine({
        r: r.ball_radius, position: new cc.v2(t.x, t.y)
      }
, i[(s+ 1)% i.length], i[s], o, null);
      if(c) {
        var u = c.sub(t).len();
        if(null == l|| l > u) {
          l = u;
          a = c;
        }
      }
    }
    return a|| n.end;
  }
;
  t.prototype.onLoad = function() {
  }
;
  t.prototype.getLineLen = function(e, t) {
    e = new cc.Vec2(e.x, e.y);
    var o = this.getColliderP(e, t),
    n = o.is_polygon,
    i = o.croseP;
    return i? {
      is_polygon: n,
      len: i.sub(e).mag()
    }
: {
      is_polygon: n,
      len: 0
    }
;
  }
;
  t.prototype.getColliderP_rect = function(e, t) {
    t = t.normalizeSelf().mulSelf(2e3);
    var o = {
      start: e,
      end: e.add(t)
    }
,
    n = {
      start: new cc.Vec2(- 242.5, 491.5),
      end: new cc.Vec2(242.5, 491.5)
    }
;
    if(a = this.getLineIntersection(o, n)) return a;
    var i = {
      start: new cc.Vec2(- 242.5, - 491.5),
      end: new cc.Vec2(242.5, - 491.5)
    }
;
    if(a = this.getLineIntersection(o, i)) return a;
    i = {
      start: new cc.Vec2(- 242.5, 491.5),
      end: new cc.Vec2(- 242.5, - 491.5)
    }
;
    if(a = this.getLineIntersection(o, i)) return a;
    var a,
    r = {
      start: new cc.Vec2(242.5, 491.5),
      end: new cc.Vec2(242.5, - 491.5)
    }
;
    return(a = this.getLineIntersection(o, r))|| void 0;
  }
;
  t.prototype.getLineIntersection = function(e, t) {
    var o = e.start,
    n = e.end,
    i = t.start,
    a = t.end,
    r = n.x- o.x,
    l = n.y- o.y,
    s = a.x- i.x,
    c = a.y- i.y,
    u = (- l*(o.x- i.x)+ r*(o.y- i.y))/(- s* l+ r* c),
    p = (s*(o.y- i.y)- c*(o.x- i.x))/(- s* l+ r* c);
    if(u >= 0&& u <= 1&& p >= 0&& p <= 1) {
      var d = o.x+ p* r,
      _ = o.y+ p* l;
      return new cc.Vec2(d, _);
    }
    return null;
  }
;
  t.prototype.check_line = function(e, t, o, n) {
    var i = b.isLinePropUsed;
    this.mid = e;
    for(var a, s, c = - 1, u = null, p = null, d = null, _ = this.node.getChildByName("plane_table").getChildByName("node_graphics").getComponent("DrawComp"), f = h(t.entries());
!(s = f()).done;
) {
      var g = s.value,
      y = g[0],
      C = g[1];
      if(100* l.BallIDType_White != C.getComponent("Ball2DControl").ballID) {
        var P = null,
        S = null,
        I = C;
        if(I) {
          var D = cc.v2(I.x- e.x, I.y- e.y);
          if((w = cc.Vec2.angle(n, D)) > 1) continue;
          var E = this.foundCirclePoint(e, I, n, y);
          if(E) {
            _&& _.clear();
            var T = E.mag();
            if(- 1 == c) {
              c = T;
              S = I;
              _&& _.drawcircle(cc.v2(E.x+ e.x, E.y+ e.y), I, "#ff0000");
              P = E;
            } else if(T < c) {
              c = T;
              S = I;
              _&& _.drawcircle(cc.v2(E.x+ e.x, E.y+ e.y), I, "#ffff00");
              P = E;
            } else _&& _.drawcircle(cc.v2(E.x+ e.x, E.y+ e.y), I, "#0000ff");
            if(P) {
              P.len();
              var w = P.angle(n);
              P.len() < .5&& w > 3|| Math.sign(n.x) == Math.sign(P.x)&& Math.sign(n.y) == Math.sign(P.y)|| (P = null);
              if(P) {
                var O = cc.v2(P.x+ e.x, P.y+ e.y),
                M = cc.v2(S.x- O.x, S.y- O.y);
                if((B = (L = cc.v2(O.x- e.x, O.y- e.y)).angle(M)) > 1.4&& B < 3) {
                  P = null;
                  c = - 1;
                }
              }
            }
          }
        }
        if(P) {
          p = P;
          u = S;
          d = S;
        }
      }
    }
    this.virtualball.active = ! 1;
    var N = cc.find("plane_table", this.node).getChildByName("sprite_dir_green");
    if(p) {
      var L,
      R = Math.atan2(p.y, p.x),
      B = (O = cc.v2(p.x+ e.x, p.y+ e.y), M = cc.v2(u.x- O.x, u.y- O.y), 0);
(L = cc.v2(O.x- e.x, O.y- e.y)).angle(M);
      if(B < 1.36) {
        this.virtualball.x = O.x;
        this.virtualball.y = O.y;
        this.virtualball.active = ! 0;
        var x = L.mag(),
        A = cc.v2(e.x, e.y).subSelf(cc.v2(d.x, d.y)).len(),
        k = this.getLineLen(this.mid, L),
        U = k.is_polygon;
        if(A >= k.len) p = null;
        else {
          _&& _.drawcircle(cc.v2(p.x+ e.x, p.y+ e.y), null, "#ffff00");
          N.getComponent("SpriteRayComp").reset(R/ v, x+(i? r.ball_radius- 4:- r.ball_radius), o, i);
          N.x = e.x;
          N.y = e.y;
          N.active = ! 0;
          a = M;
          var G = Math.atan2(M.y, M.x),
          F = i? this.getLineLen(u, M).len+ 25: m.getUsedCueAimLineLen();
! i&& l.useSimCueAttri&& l.simAimming&& (F = l.simAimming);
(j = cc.find("plane_table", this.node).getChildByName("sprite_dir_yellow")).x = u.x;
          j.y = u.y;
          j.getComponent("SpriteRayComp").resetWillGo(G/ v, F, o, i, d);
          j.active = ! 0;
        }
      } else p = null;
    }
    if(null == p) {
      a = null;
      _&& _.clear();
      var j;
(j = cc.find("plane_table", this.node).getChildByName("sprite_dir_yellow")).active = ! 1;
      N.x = e.x;
      N.y = e.y;
      N.active = ! 0;
      R = Math.atan2(n.y, n.x),
      x = 1e3;
      var H = this.getLineLen(this.mid, n);
      U = H.is_polygon;
      x = H.len;
      var V = i? x+ 4: x,
      Y = n.normalize().mulSelf(U? V: x- r.ball_radius).addSelf(this.mid);
      this.virtualball.x = Y.x;
      this.virtualball.y = Y.y;
      this.virtualball.active = ! 0;
      var W = U?- r.ball_radius:- 2* r.ball_radius,
      J = U? r.ball_radius:- 4;
      N.getComponent("SpriteRayComp").reset(R/ v, x+(i? J: W), o, i);
    }
    return {
      tar_node: d,
      zhexian: a
    }
;
  }
;
  t.prototype.clear = function() {
    var e = this.node.getChildByName("node_graphics").getComponent("DrawComp");
    cc.find("plane_table", this.node).getChildByName("sprite_dir_green").active = ! 1;
    e&& e.clear();
    cc.find("plane_table", this.node).getChildByName("sprite_dir_yellow").active = ! 1;
    this.virtualball.active = ! 1;
  }
;
  t.prototype.foundCirclePoint = function(e, t, o) {
    0 == o.y&& (o.y = 1e- 10);
    0 == o.x&& (o.x = 1e- 10);
    var n = cc.v2(t.x- e.x, t.y- e.y),
    i = o.y/ o.x,
    a = S,
    r = 1+ i* i,
    l = -(2* n.x+ 2* n.y* i),
    s = l* l- 4* r*(n.x* n.x+ n.y* n.y- a),
    c = Math.sqrt(s),
    u = (- l+ c)/(2* r),
    p = (- l- c)/(2* r),
    d = u* i,
    _ = p* i;
    if(u&& p&& d&& _) {
      o = cc.v2(u, d);
      var f = cc.v2(p, _);
      return o.mag() < f.mag()? o: f;
    }
    return null;
  }
;
  t.prototype.getColliderP = function(e, t) {
    var o = cc.find("zhuo_pengzhuang", this.node).getChildByName("pengzhuang_root").getChildByName("zhuo_bian");
    return o&& o.getComponent(cc.PolygonCollider)? {
      is_polygon: ! 0,
      croseP: this.getColliderP_Pollygon(o, e, t)
    }
: {
      is_polygon: ! 1,
      croseP: this.getColliderP_rect(e, t)
    }
;
  }
;
  t.prototype.getColliderP_Pollygon_old = function(e, t, o) {
    o = o.normalizeSelf().mulSelf(2e3);
    for(var n = {
      start: t, end: t.add(o)
    }
, i = e.getComponent(cc.PolygonCollider).points, a = null, r = null, l = (i[0], 0);
    l < i.length;
    l++) {
      var s = {
        start: i[l],
        end: i[(l+ 1)% i.length]
      }
,
      c = this.getLineIntersection(n, s);
      if(c) {
        var u = c.sub(t).len();
        if(null == r|| r > u) {
          r = u;
          a = c;
        }
      }
    }
    return a|| n.end;
  }
;
  a([f(cc.Node)], t.prototype, "virtualball", void 0);
  return a([_], t);
}
(cc.Component);
o.default = I;
cc._RF.pop();
