let e = require;
let t = module;
let o = exports;
"use strict";
cc._RF.push(t, "50815aEef5FEq5lwLrYyWdq", "EventHandler");
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
);
Object.defineProperty(o, "__esModule", {
  value: ! 0
}
);
var a = function(e) {
  i(t, e);
  function t(t, o, n, i) {
    var a = e.call(this, t, o, n, i)|| this;
    a._dispatcher = null;
    a._type = null;
    return a;
  }
  t.create = function(e, o, n, i) {
    void 0 === n&& (n = null);
    void 0 === i&& (i = ! 0);
    return t._pool.length? t._pool.pop().setTo(e, o, n, i): new t(e, o, n, i);
  }
;
  t.prototype.recover = function() {
    if(this._id > 0) {
      this._id = 0;
      t._pool.push(this.clear());
    }
  }
;
  t.prototype.register = function(e, t) {
    this._dispatcher = e;
    this._type = t;
  }
;
  t.prototype.check = function(e, t) {
    return !(this._dispatcher&& this._dispatcher != e|| this._type&& this._type != t);
  }
;
  t._pool = null;
  return t;
}
(e("Handler.js").default);
o.default = a;
a._pool = [];
cc._RF.pop();
