let e = require;
let t = module;
let o = exports;
"use strict";
cc._RF.push(t, "eb259S1+ytAKbrKz7y8YyJE", "DiamondDrawControl");
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
var r = cc._decorator,
l = r.ccclass,
s = r.property,
c = function(e) {
  i(t, e);
  function t() {
    var t = null !== e&& e.apply(this, arguments)|| this;
    t.rows = 5;
    t.cols = 5;
    return t;
  }
  t.prototype.posToDiamondIdx = function(e) {
    var t = Math.floor(e.x/ 96+ e.y/ 48),
    o = Math.floor(e.y/ 48- e.x/ 96);
    return cc.v2(o, t);
  }
;
  t.prototype.findDiamondIndex = function(e) {
    var t = this.node.convertToNodeSpace(e),
    o = t.x,
    n = t.y,
    i = (e = cc.v2(o- this.diamondPosOffset.x, n- this.diamondPosOffset.y), this.posToDiamondIdx(e)),
    a = i.x,
    r = i.y;
    console.log("row,col", a, r);
    return this.diamondArray[a]&& this.diamondArray[a][r]?[this.diamondArray[a][r], a, r]:[- 1, - 1, - 1];
  }
;
  t.prototype.diamondIdxToPos = function(e, t) {
    var o = 48*(t- e),
    n = 24*(e+ t);
    return cc.v2(o, n);
  }
;
  t.prototype.drawLines = function() {
    var e = this.getComponent(cc.Graphics);
    e.strokeColor.fromHEX("#ff0000");
    e.moveTo(0, 0);
    e.lineTo(100, 100);
    e.stroke();
  }
;
  t.prototype.onLoad = function() {
    var e = this,
    t = this.rows,
    o = this.cols;
    e.diamondArray = [];
    var n = 48*(t+ o);
    e.diamondPosOffset = cc.v2(48+ n/ 2, - 48);
    for(var i = 1;
    i <= t+ 1;
    i++) {
      e.diamondArray[i] = [];
      for(var a = 1;
      a <= o+ 1;
      a++) {
        e.diamondArray[i][a] = {
        }
;
        var r = e.diamondIdxToPos(i, a),
        l = r.x,
        s = r.y;
        l = 0+ l+ e.diamondPosOffset.x,
        s = 0+ s+ e.diamondPosOffset.y;
        e.diamondArray[i][a].pos = cc.v2(l, s);
        e.diamondArray[i][a].state = 0;
        e.diamondArray[i][a].puttingSate = 0;
      }
    }
    this.drawDiamondLine();
    this.node.width = 48*(t+ o);
    this.node.height = 24*(t+ o);
    e = this;
    this.node.on("mousedown", function(t) {
      var o = t.getLocation(), n = this.findDiamondIndex(o);
      console.log("mousedown", n);
      if("object" == typeof n[0]) {
        var i = n[0].pos.x, a = n[0].pos.y;
        i-= this.node.width/ 2;
        a-= this.node.height/ 2;
      }
      e.node.getParent().getParent().getComponent("MapScene").clickMap(cc.v2(i, a));
    }
, this);
  }
;
  t.prototype.drawDiamondLine = function() {
    var e = this.rows,
    t = this.cols,
    o = this.getComponent(cc.Graphics);
    o.clear();
    cc.Color(178.5, 0, 0, 76.5);
    o.strokeColor.fromHEX("#ff0000");
    this.diamondArray;
    for(var n = 1;
    n <= e+ 1;
    n++) {
      var i = (c = this.diamondIdxToPos(n, 1)).x,
      a = c.y,
      r = (i = 0+ i+ this.diamondPosOffset.x, a = 0+ a+ this.diamondPosOffset.y, (u = this.diamondIdxToPos(n, t+ 1)).x),
      l = u.y;
      r = 0+ r+ this.diamondPosOffset.x,
      l = 0+ l+ this.diamondPosOffset.y;
      o.moveTo(i, a);
      o.lineTo(r, l);
      console.log("graphics", i, a, r, l);
    }
    for(var s = 1;
    s <= t+ 1;
    s++) {
      var c,
      u;
      i = (c = this.diamondIdxToPos(1, s)).x,
      a = c.y,
      i = 0+ i+ this.diamondPosOffset.x,
      a = 0+ a+ this.diamondPosOffset.y,
      r = (u = this.diamondIdxToPos(e+ 1, s)).x,
      l = u.y,
      r = 0+ r+ this.diamondPosOffset.x,
      l = 0+ l+ this.diamondPosOffset.y;
      o.moveTo(i, a);
      o.lineTo(r, l);
    }
    o.stroke();
  }
;
  a([s], t.prototype, "rows", void 0);
  a([s], t.prototype, "cols", void 0);
  return a([l], t);
}
(cc.Component);
o.default = c;
cc._RF.pop();
