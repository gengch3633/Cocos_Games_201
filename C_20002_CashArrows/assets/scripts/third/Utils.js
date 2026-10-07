let e = require;
let t = module;
let i = exports;
"use strict";
cc._RF.push(t, "4b08cpWMiNBdrBg3wFvVnzb", "Utils");
Object.defineProperty(i, "__esModule", {
  value: ! 0
}
);
var n = function() {
  function e() {
  }
  e.getPoint = function(e, t, i, n) {
    for(var a = [], o = Math.PI/ 180* Math.round(360/ n), r = 0;
    r < n;
    r++) {
      var s = t+ e* Math.cos(o* r),
      l = i+ e* Math.sin(o* r);
      a.push(new cc.Vec2(s, l));
    }
    return a;
  }
;
  e.findChild = function(e, t) {
    if(! t) return null;
    for(var i = 0;
    i < t.childrenCount;
    i++) if(t.children[i].name == e) return t.children[i];
    for(i = 0;
    i < t.childrenCount;
    i++) {
      var n = this.findChild(e, t.children[i]);
      if(n) return n;
    }
    return null;
  }
;
  e.deepCopy = function(e) {
    try {
      return JSON.parse(JSON.stringify(e));
    } catch(e) {
      console.error(e);
      return null;
    }
  }
;
  e.transAngle = function(e) {
    return(360+ Math.floor(e)% 360)% 360;
  }
;
  e.interectionPoint = function(e, t, i, n, a) {
    var o = (e.x- i.x)*(t.y- i.y)-(e.y- i.y)*(t.x- i.x),
    r = (e.x- n.x)*(t.y- n.y)-(e.y- n.y)*(t.x- n.x);
    if(o* r >= 0) return ! 1;
    var s = (i.x- e.x)*(n.y- e.y)-(i.y- e.y)*(n.x- e.x);
    if(s*(s+ o- r) >= 0) return ! 1;
    if(a) {
      var l = s/(r- o),
      c = l*(t.x- e.x),
      u = l*(t.y- e.y);
      a.x = c+ e.x;
      a.y = u+ e.y;
    }
    return ! 0;
  }
;
  e.vecToAngle = function(e, t) {
    void 0 === t&& (t = 0);
    if(! e.equals(cc.Vec2.ZERO)) {
      var i = cc.v2(e).signAngle(cc.v2(1, 0));
      return- cc.misc.radiansToDegrees(i)+ t;
    }
  }
;
  e.reflect = function(e, t) {
    var i = - 2* cc.Vec2.dot(t, e);
    return new cc.Vec2(i* t.x+ e.x, i* t.y+ e.y);
  }
;
  e.setParent = function(e, t) {
    if(e&& t&& e.isValid&& t.isValid&& e.parent&& e.parent.isValid) {
      var i = e.parent.convertToWorldSpaceAR(e.getPosition());
      e.parent = t;
      e.setPosition(e.parent.convertToNodeSpaceAR(i));
    }
  }
;
  e.getWorldPosition = function(e, t) {
    void 0 === t&& (t = null);
    return e&& e.isValid&& e.parent&& e.parent.isValid?(t|| (t = new cc.Vec2()), e.parent.convertToWorldSpaceAR(e.getPosition(t), t)): null;
  }
;
  e.getRelativePosition = function(t, i, n) {
    void 0 === n&& (n = null);
    return t&& t.isValid&& i&& i.isValid?(n|| (n = new cc.Vec2()), (n = e.getWorldPosition(i, n))? n = t.parent&& t.parent.isValid? t.parent.convertToNodeSpaceAR(n, n): t.convertToNodeSpaceAR(n, n): null): null;
  }
;
  e.ratioScale = function(e, t, i, n) {
    void 0 === n&& (n = 1);
    if(e&& e.isValid) {
      var a = e instanceof cc.Node? e: e.node,
      o = a.width > a.height? t/ a.width: i/ a.height;
      o > n&& (o = n);
      a.scaleX = o;
      a.scaleY = o;
      console.log("scale:", o);
      return o;
    }
  }
;
  e.getBoundingBoxToWorld = function(e) {
    if(! e|| ! e.isValid) return null;
    var t = e.getBoundingBox(),
    i = new cc.Mat4();
    e.parent.getWorldMatrix(i);
    var n = new cc.Rect();
    t.transformMat4(n, i);
    return n;
  }
;
  e.getSpineAnimations = function(e) {
    if(! e) return[];
    var t = null;
    if(e instanceof cc.Node) {
      var i = e.getComponent(sp.Skeleton);
      t = null == i? void 0: i.skeletonData;
    } else e instanceof sp.Skeleton? t = e.skeletonData: e instanceof sp.SkeletonData&& (t = e);
    if(! t|| ! t.skeletonJson) return[];
    var n = t.skeletonJson.animations;
    return n? Object.keys(n):[];
  }
;
  e.getSpineAnimationDuration = function(e, t) {
    var i,
    n,
    a,
    o;
    if(! e) return- 1;
    var r = null,
    s = - 1;
    if(e instanceof cc.Node|| e instanceof sp.Skeleton) {
      var l = e.getComponent(sp.Skeleton);
      if(! l|| ! l.isValid) return- 1;
      if(- 1 != (s = null !== (n = null === (i = l.findAnimation(t))|| void 0 === i? void 0: i.duration)&& void 0 !== n? n:- 1)) return s;
      r = l.skeletonData;
    } else e instanceof sp.SkeletonData&& (r = e);
    return r&& null !== (o = null === (a = new sp.spine.Skeleton(r.getRuntimeData()).data.findAnimation(t))|| void 0 === a? void 0: a.duration)&& void 0 !== o? o:- 1;
  }
;
  e.setStatsColor = function(e, t) {
    void 0 === e&& (e = cc.Color.WHITE);
    void 0 === t&& (t = cc.color(0, 0, 0, 150));
    var i = cc.find("PROFILER-NODE");
    if(! i) return cc.warn("未找到统计面板节点！");
    i.children.forEach(function(t) {
      return t.color = e;
    }
);
    var n = i.getChildByName("BACKGROUND");
    if(! n) {
      n = new cc.Node("BACKGROUND");
      i.addChild(n, cc.macro.MIN_ZINDEX);
      n.setContentSize(i.getBoundingBoxToWorld());
      n.setPosition(0, 0);
    }
    var a = n.getComponent(cc.Graphics)|| n.addComponent(cc.Graphics);
    a.clear();
    a.rect(- 5, 12.5, n.width+ 10, n.height- 10);
    a.fillColor = t;
    a.fill();
  }
;
  e.AddIrregularityClick = function() {
    cc.Node.prototype.polygonHit = function(e) {
      var t = this.getComponent(cc.PolygonCollider);
      if(! t) return ! 0;
      var i = e.clone();
      this.convertToNodeSpaceAR(i, i);
      return cc.Intersection.pointInPolygon(i, t.points);
    }
;
    cc.Node.prototype._hitTestClose = cc.Node.prototype._hitTest;
    cc.Node.prototype._hitTest = function(e, t) {
      return ! ! this._hitTestClose(e, t)&& this.polygonHit(e);
    }
;
  }
;
  return e;
}
();
i.default = n;
cc._RF.pop();
