let e = require;
let t = module;
let i = exports;
"use strict";
cc._RF.push(t, "36ccfXvy3BOt7syHYG69JoH", "GuideMaskNode");
var n,
a = __extends,
o = __decorate;
Object.defineProperty(i, "__esModule", {
  value: ! 0
}
);
var r = cc._decorator,
s = r.ccclass,
l = r.property;
(function(e) {
  e.Single = "single";
  e.Drop = "drop";
}
)(n|| (n = {
}
));
var c = function(e) {
  function t() {
    var t = null !== e&& e.apply(this, arguments)|| this;
    t.blockNode = null;
    t.maskParent = null;
    t.handNode = null;
    t._guideType = n.Single;
    t.targetMap = new Map();
    t.tmpPos1 = new cc.Vec2();
    t.tmpPos2 = new cc.Vec2();
    t.handOffset = cc.Vec2.ZERO;
    t.handTweenOffSet1 = cc.Vec2.ZERO;
    t.handTweenOffSet2 = cc.Vec2.ZERO;
    t.tweenDuration = 1;
    t.tweenDelay = .5;
    return t;
  }
  var i;
  a(t, e);
  i = t;
  t.find = function(e) {
    if(! e) return null;
    for(var t = e.split(/ \[(\ d+) \]/ g), i = null;
    t.length > 0;
) {
      var n = t.shift();
      if(n) {
        0 == n.indexOf("/")&& (n = n.substring(1));
        var a = Number.parseInt(n);
        if(isNaN(a)) i = cc.find(n, i);
        else {
          if(! i) return null;
          i = i.parent.children[a];
        }
      }
    }
    i|| (i = cc.find(e));
    return i;
  }
;
  t.find2 = function(e, t) {
    void 0 === t&& (t = null);
    if(! e) return null;
    for(var i = e.split(/ \[(\ d+) \]/ g), n = null != t? t: cc.Canvas.instance.node, a = function() {
      var e = i.shift();
      if(! e) return "continue";
      0 == e.indexOf("/")&& (e = e.substring(1));
      var t = Number.parseInt(e);
      if(isNaN(t)) n = cc.find(e, n);
      else {
        if(! n) return {
          value: null
        }
;
        var a = n.name;
        n = n.parent.children.filter(function(e) {
          return e.name == a;
        }
)[t];
      }
    }
;
    i.length > 0;
) {
      var o = a();
      if("object" == typeof o) return o.value;
    }
    n|| (n = cc.find(e, t));
    return n;
  }
;
  Object.defineProperty(t.prototype, "guideType", {
    get: function() {
      return this._guideType;
    }
, enumerable: ! 1, configurable: ! 0
  }
);
  t.prototype.findTarget = function(e) {
    return e instanceof cc.Node? e: i.find(e);
  }
;
  t.prototype.showSingle = function(e, t, i, a, o) {
    var r = this;
    void 0 === t&& (t = cc.Vec2.ZERO);
    void 0 === i&& (i = cc.Vec2.ZERO);
    void 0 === a&& (a = cc.Vec2.ZERO);
    void 0 === o&& (o = 178.5);
    cc.Tween.stopAllByTarget(this.handNode);
    this.addTarget(e, t, i);
    this.handOffset = a;
    this.blockNode.opacity = o;
    this._guideType = n.Single;
    this.node.active = ! 0;
    this.scheduleOnce(function() {
      return r.handSingleTween();
    }
);
    this.maskParent.active = ! 0;
    this.updateMask();
  }
;
  t.prototype.showSingle2 = function(e, t) {
    var i = {
      offset: cc.Vec2.ZERO,
      sizeOffst: cc.Vec2.ZERO,
      handOffset: cc.Vec2.ZERO,
      blockOpacity: 178.5,
      needMask: ! 0
    }
;
    t = Object.assign(i, null != t? t: {
    }
);
    this.showSingle(e, t.offset, t.sizeOffst, t.handOffset, t.blockOpacity);
    this.maskParent.active = t.needMask;
  }
;
  Object.defineProperty(t.prototype, "handTarget", {
    get: function() {
      return this._guideType == n.Single? this.getTarget(0): null;
    }
, enumerable: ! 1, configurable: ! 0
  }
);
  t.prototype.addTarget = function(e, t, i) {
    void 0 === t&& (t = cc.Vec2.ZERO);
    void 0 === i&& (i = cc.Vec2.ZERO);
    var n = this.findTarget(e);
    if(n) {
      var a = this.targetMap.get(n);
      if(a) {
        a.offset = null != t? t: cc.Vec2.ZERO;
        a.sizeOffst = null != i? i: cc.Vec2.ZERO;
      } else {
        a = {
          sizeOffst: null != i? i: cc.Vec2.ZERO,
          offset: null != t? t: cc.Vec2.ZERO
        }
;
        this.targetMap.set(n, a);
      }
    } else console.log(e, "未找到");
  }
;
  t.prototype.removeTarget = function(e) {
    var t = this.findTarget(e);
    if(t) {
      null == t|| t.targetOff(this);
      this.targetMap.delete(t);
    }
  }
;
  t.prototype.clearTarget = function() {
    this.targetMap.clear();
    this.blockNode.parent = this.node;
    this.maskParent.removeAllChildren();
  }
;
  t.prototype.update = function() {
    this.updateMask();
  }
;
  t.prototype.getTarget = function(e) {
    return Array.from(this.targetMap.keys())[e];
  }
;
  t.prototype.updateMask = function() {
    var e = this;
    if(!(this.targetMap.size <= 0)) {
      var t = this.maskParent;
      this.targetMap.forEach(function(i, n) {
        if(n.isValid) {
          var a = t.children[0];
          a == e.blockNode&& (a = null);
          a|| ((a = e.createMaskNode()).parent = t);
          var o = n.parent.convertToWorldSpaceAR(n.getPosition(e.tmpPos1), e.tmpPos1), r = a.parent.convertToNodeSpaceAR(o, e.tmpPos2);
          r.x+= i.offset.x;
          r.y+= i.offset.y;
          a.anchorX = n.anchorX;
          a.anchorY = n.anchorY;
          a.setPosition(r);
          a.width = n.width+ i.sizeOffst.x;
          a.height = n.height+ i.sizeOffst.y;
          t = a;
        }
      }
);
      this.blockNode.parent != t&& (this.blockNode.parent = t);
    }
  }
;
  t.prototype.createMaskNode = function() {
    var e = new cc.Node("maskNode").addComponent(cc.Mask);
    this.scheduleOnce(function() {
      e.type = cc.Mask.Type.RECT;
      e.inverted = ! 0;
    }
);
    return e.node;
  }
;
  t.prototype.handSingleTween = function() {
    var e = this;
    cc.Tween.stopAllByTarget(this.handNode);
    var t = this.handTarget;
    if(t&& t.isValid) {
      var i = t.parent.convertToWorldSpaceAR(t.getPosition(this.tmpPos1), this.tmpPos1),
      n = this.handNode.parent.convertToNodeSpaceAR(i, this.tmpPos2);
      n.x+= this.handOffset.x;
      n.y+= this.handOffset.y;
      this.handNode.setPosition(n);
      cc.tween(this.handNode).by(.5, {
        y: 20
      }
).delay(.25).by(.5, {
        y:- 20
      }
).call(function() {
        e.handSingleTween();
      }
).start();
    }
  }
;
  t.prototype.handDropTween = function() {
    var e = this,
    t = this.getTarget(0),
    i = this.getTarget(1);
    if(t&& t.isValid&& i&& i.isValid) {
      var n = t.parent.convertToWorldSpaceAR(t.getPosition()),
      a = i.parent.convertToWorldSpaceAR(i.getPosition()),
      o = this.handNode.parent.convertToNodeSpaceAR(n),
      r = this.handNode.parent.convertToNodeSpaceAR(a);
      o.x+= this.handTweenOffSet1.x;
      o.y+= this.handTweenOffSet1.y;
      r.x+= this.handTweenOffSet2.x;
      r.y+= this.handTweenOffSet2.y;
      this.handNode.setPosition(o);
      cc.tween(this.handNode).to(this.tweenDuration, {
        x: r.x, y: r.y
      }
).delay(this.tweenDelay).call(function() {
        e.handNode.setPosition(o);
        e.handDropTween();
      }
).start();
    }
  }
;
  t.prototype.hide = function() {
    this.clearTarget();
    cc.Tween.stopAllByTarget(this.handNode);
    this.handTweenOffSet1 = cc.Vec2.ZERO;
    this.handTweenOffSet2 = cc.Vec2.ZERO;
    this.node.active = ! 1;
  }
;
  o([l(cc.Node)], t.prototype, "blockNode", void 0);
  o([l(cc.Node)], t.prototype, "maskParent", void 0);
  o([l(cc.Node)], t.prototype, "handNode", void 0);
  return i = o([s], t);
}
(cc.Component);
i.default = c;
cc._RF.pop();
