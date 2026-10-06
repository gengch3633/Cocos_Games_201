let e = require;
let t = module;
let i = exports;
"use strict";
cc._RF.push(t, "50c686YgQxBe7p6UJ3ZboxZ", "Random");
Object.defineProperty(i, "__esModule", {
  value: ! 0
}
);
var n = function() {
  function e(e) {
    this.seed = e|| Date.now();
  }
  Object.defineProperty(e, "defaultRandom", {
    get: function() {
      e._defaultRandom|| (e._defaultRandom = new e());
      return e._defaultRandom;
    }
, enumerable: ! 1, configurable: ! 0
  }
);
  Object.defineProperty(e, "insideUnitCircle", {
    get: function() {
      return e.defaultRandom.insideUnitCircle;
    }
, enumerable: ! 1, configurable: ! 0
  }
);
  Object.defineProperty(e, "onUnitCircle", {
    get: function() {
      return e.defaultRandom.onUnitCircle;
    }
, enumerable: ! 1, configurable: ! 0
  }
);
  Object.defineProperty(e, "value", {
    get: function() {
      return e.defaultRandom.value;
    }
, enumerable: ! 1, configurable: ! 0
  }
);
  e.range = function(t, i) {
    return e.defaultRandom.range(t, i);
  }
;
  e.floatRange = function(t, i) {
    return e.defaultRandom.floatRange(t, i);
  }
;
  e.rangeArray = function(t, i, n) {
    void 0 === i&& (i = 1);
    void 0 === n&& (n = ! 0);
    return e.defaultRandom.rangeArray(t, i, n);
  }
;
  e.isHit = function(t) {
    return e.defaultRandom.isHit(t);
  }
;
  e.weightIndex = function(t) {
    return e.defaultRandom.weightIndex(t);
  }
;
  e.weightObject = function(t, i) {
    return e.defaultRandom.weightObject(t, i);
  }
;
  e.prototype.rangeArray = function(e, t, i) {
    void 0 === t&& (t = 1);
    void 0 === i&& (i = ! 0);
    var n = [];
    if(! e|| e.length <= 0|| t <= 0) return n;
    for(var a = e.concat();
;
) {
      var o = this.range(0, a.length- 1);
      n.push(a[o]);
      i|| a.splice(o, 1);
      if(n.length >= t|| a.length <= 0) break;
    }
    return n;
  }
;
  e.prototype.weightIndex = function(t) {
    var i = 0;
    t.forEach(function(e) {
      return i+= e;
    }
);
    for(var n = 0, a = e.range(1, i), o = 0;
    o < t.length;
    o++) {
      if(a > n&& a <= n+ t[o]) return o;
      n+= t[o];
    }
    return- 1;
  }
;
  e.prototype.weightObject = function(e, t) {
    var i = [];
    e.forEach(function(e) {
      var n = e[t];
      "number" == typeof n? i.push(n): console.warn("Random.weightObject: "+ String(t)+ " is not a number");
    }
);
    return e[this.weightIndex(i)];
  }
;
  e.prototype.isHit = function(e) {
    return this.range(1, 100) <= e;
  }
;
  e.prototype.floatRange = function(e, t) {
    var i = Math.max(t, e),
    n = Math.min(t, e);
    this.seed = (9301* this.seed+ 49297)% 233280;
    return n+ this.seed/ 233280*(i- n);
  }
;
  e.prototype.range = function(e, t) {
    return Math.round(this.floatRange(e, t));
  }
;
  Object.defineProperty(e.prototype, "insideUnitCircle", {
    get: function() {
      var e = this.floatRange(0, 360), t = this.floatRange(0, 1);
      return cc.v2(t* Math.cos(e* Math.PI/ 180), t* Math.sin(e* Math.PI/ 180));
    }
, enumerable: ! 1, configurable: ! 0
  }
);
  Object.defineProperty(e.prototype, "onUnitCircle", {
    get: function() {
      var e = this.floatRange(0, 360);
      return cc.v2(Math.cos(e* Math.PI/ 180), Math.sin(e* Math.PI/ 180));
    }
, enumerable: ! 1, configurable: ! 0
  }
);
  Object.defineProperty(e.prototype, "value", {
    get: function() {
      return this.floatRange(0, 1);
    }
, enumerable: ! 1, configurable: ! 0
  }
);
  return e;
}
();
i.default = n;
cc._RF.pop();
