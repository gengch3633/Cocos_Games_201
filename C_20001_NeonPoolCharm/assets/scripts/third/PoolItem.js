let e = require;
let t = module;
let o = exports;
"use strict";
cc._RF.push(t, "12e30byUGVABpHEeWQxMg2M", "PoolItem");
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
var r = cc._decorator.ccclass;
cc._decorator.property;
var l = function(e) {
  i(t, e);
  function t() {
    var t = null !== e&& e.apply(this, arguments)|| this;
    t._pool = null;
    t._gid = null;
    t._using = ! 1;
    t._loaded = ! 1;
    t._data = ! 1;
    return t;
  }
  t.prototype.clear = function() {
  }
;
  t.prototype.registPool = function(e, t) {
    this._pool = e;
    this._gid = t;
    this._using = ! 0;
  }
;
  t.prototype.recover = function() {
    if(this._using) {
      this._using = ! 1;
      this.node.removeFromParent(! 1);
      this.clear();
      this._pool.push(this.node);
    }
  }
;
  t.prototype.init = function() {
  }
;
  t.prototype.reuse = function() {
    this._using = ! 0;
  }
;
  return a([r], t);
}
(cc.Component);
o.default = l;
cc._RF.pop();
