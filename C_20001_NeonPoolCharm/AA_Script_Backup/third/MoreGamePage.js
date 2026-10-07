let e = require;
let t = module;
let o = exports;
"use strict";
cc._RF.push(t, "4cbc7DZ+cRFApXqQ/dhx735", "MoreGamePage");
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
var r = cc._decorator.ccclass,
l = function(e) {
  i(t, e);
  function t() {
    var t = null !== e&& e.apply(this, arguments)|| this;
    t.MoreGamePage = null;
    t.node = null;
    t.webViewNode = null;
    t.top = null;
    t.close = null;
    return t;
  }
  t.prototype.onLoad = function() {
    this.MoreGamePage = this.node;
    this.webViewNode = this.MoreGamePage.getChildByName("webViewNode");
    this.top = this.MoreGamePage.getChildByName("top");
    this.close = this.top.getChildByName("close");
  }
;
  t.URL = "db://assets/resources/pages/MoreGamePage.prefab";
  return a([r], t);
}
(cc.Component);
o.default = l;
cc._RF.pop();
