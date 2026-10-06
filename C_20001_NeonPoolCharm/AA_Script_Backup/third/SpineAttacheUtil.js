let e = require;
let t = module;
let o = exports;
"use strict";
cc._RF.push(t, "1a17bF2fBFBeIlH3m8oUofF", "SpineAttacheUtil");
Object.defineProperty(o, "__esModule", {
  value: ! 0
}
);
var n = function() {
  function e() {
  }
  e.addPolygonNodeToSkeleton = function(t, o, n, i, a) {
    void 0 === n&& (n = e.defaultBoneName);
    if(!(t&& o&& n&& i)) return null;
    var r = o.attachUtil;
    if(! r) return null;
    var l = r.generateAttachedNodes(n);
    if(! l|| 0 == l.length) return null;
    var s = l[0],
    c = o.findSlot(i);
    if(! c) return null;
    var u = c.attachment.vertices,
    p = this.generatePolygonCollider(u, a);
    if(! p) return null;
    s.addChild(p.node);
    p.node.x = p.node.y = 0;
    p.node.group = t;
    p.node.name = n;
    return p;
  }
;
  e.destroyAttachedNodes = function(e, t) {
    if(! e|| ! t) return null;
    var o = e.attachUtil;
    o&& o.destroyAttachedNodes(t);
  }
;
  e.addAllPolygonNodeToSkeleton = function(t, o, n, i) {
    void 0 === n&& (n = e.defaultBoneName);
    if(! t|| ! o|| ! n) return null;
    var a = o.attachUtil;
    if(! a) return null;
    var r = a.generateAttachedNodes(n);
    if(! r|| 0 == r.length) return null;
    for(var l = r[0], s = this.getAllSlotNameByBoneName(o, n), c = [], u = 0;
    u < s.length;
    u++) {
      var p = o.findSlot(s[u]);
      if(p) {
        var d = p.attachment;
        if(d) {
          var _ = d.vertices;
          if(_) {
            var f = this.generatePolygonCollider(_, i);
            if(f) {
              l.addChild(f.node);
              f.node.x = f.node.y = 0;
              f.node.group = t;
              f.node.name = n;
              c.push(f);
            }
          }
        }
      }
    }
    return c;
  }
;
  e.generateAllByBonePrefix = function(e, t, o, n) {
    void 0 === n&& (n = "kuang");
    if(! e|| ! t) return null;
    if(! t.attachUtil) return null;
    for(var i = [], a = this.getAllBoneNameByDefaultMode(t, n), r = 0;
    r < a.length;
    r++) {
      var l = a[r],
      s = this.addAllPolygonNodeToSkeleton(e, t, l, o);
      i = i.concat(s);
    }
    return i;
  }
;
  e.destroyAllAttachedNodes = function(e) {
    if(! e) return null;
    var t = e.attachUtil;
    t&& t.destroyAllAttachedNodes();
  }
;
  e.getAttachedNodes = function(e, t) {
    if(! e|| ! t) return null;
    var o = e.attachUtil;
    return o? o.getAttachedNodes(t): null;
  }
;
  e.getAllBoneNameByDefaultMode = function(e, t) {
    void 0 === t&& (t = "kuang");
    if(! e) return null;
    if(! e.skeletonData) return null;
    for(var o = e.skeletonData.skeletonJson.bones, n = [], i = 0;
    i < o.length;
    i++) {
      var a = o[i];
- 1 != a.name.indexOf(t)&& n.push(a.name);
    }
    return n;
  }
;
  e.generateAllByDefaultMode = function(e, t, o) {
    if(! e|| ! t) return null;
    if(! t.attachUtil) return null;
    for(var n = [], i = this.getAllBoneNameByDefaultMode(t), a = 0;
    a < i.length;
    a++) {
      var r = i[a],
      l = this.addAllPolygonNodeToSkeleton(e, t, r, o);
      n = n.concat(l);
    }
    return n;
  }
;
  e.getNodeFromBone = function(t, o) {
    void 0 === o&& (o = e.defaultBoneName);
    if(! t|| ! o) return null;
    var n = t.attachUtil;
    if(! n) return null;
    var i = n.generateAttachedNodes(o);
    return i&& 0 != i.length? i[0]: null;
  }
;
  e.getAllSlotNameByBoneName = function(t, o) {
    void 0 === o&& (o = e.defaultBoneName);
    if(! t|| ! o) return null;
    if(! t.skeletonData) return null;
    for(var n = t.skeletonData.skeletonJson.slots, i = [], a = 0;
    a < n.length;
    a++) {
      var r = n[a];
      r.bone == o&& i.push(r.name);
    }
    return i;
  }
;
  e.addNodeToBone = function(t, o, n) {
    void 0 === n&& (n = e.defaultBoneName);
    if(! t|| ! o|| ! n) return null;
    var i = o.attachUtil;
    if(! i) return null;
    var a = i.generateAttachedNodes(n);
    if(! a|| 0 == a.length) return null;
    a[0].addChild(t);
    return t;
  }
;
  e.generatePolygonCollider = function(e, t) {
    if(! e|| e.length <= 0) return null;
    var o = t;
(o = o? cc.instantiate(t): new cc.Node()).active = ! 0;
    var n = o.addComponent(cc.PolygonCollider);
    n.points = [];
    for(var i = 0;
    i < e.length;
    i++) {
      n.points.push(cc.v2(e[i], e[i+ 1]));
      i++;
    }
    return n;
  }
;
  e.defaultBoneName = "kuang";
  return e;
}
();
o.default = n;
cc._RF.pop();
