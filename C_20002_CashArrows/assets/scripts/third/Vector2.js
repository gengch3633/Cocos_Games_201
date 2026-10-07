let e = require;
let t = module;
let i = exports;
"use strict";
cc._RF.push(t, "b0a635DQHZCM70lysGB5W9A", "Vector2");
Object.defineProperty(i, "__esModule", {
  value: ! 0
}
);
var n = function() {
  function e(e, t) {
    null != e&& (this.x = e);
    null != t&& (this.y = t);
  }
  e.prototype.add = function(t) {
    return new e(this.x+ t.x, this.y+ t.y);
  }
;
  e.prototype.minus = function(t) {
    return new e(this.x- t.x, this.y- t.y);
  }
;
  e.prototype.multiply = function(e) {
    return this.x* e.x+ this.y* e.y;
  }
;
  e.prototype.scale = function(t) {
    return new e(this.x* t, this.y* t);
  }
;
  e.multiply = function(e, t) {
    return e.x* t.x+ e.y* t.y;
  }
;
  e.multiply2 = function(t, i) {
    return new e(i.x* t, i.y* t);
  }
;
  e.division = function(t, i) {
    return new e(t.x/ i, t.y/ i);
  }
;
  e.subtract = function(t, i) {
    return new e(t.x- i.x, t.y- i.y);
  }
;
  e.addition = function(t, i) {
    return new e(t.x+ i.x, t.y+ i.y);
  }
;
  return e;
}
();
i.default = n;
cc._RF.pop();
