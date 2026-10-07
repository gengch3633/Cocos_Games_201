let e = require;
let t = module;
let o = exports;
"use strict";
cc._RF.push(t, "9bb39UFdMdP6IyJ2/8aAN3c", "FlipTween");
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
c = (cc._decorator, function(e) {
  i(t, e);
  function t() {
    var t = null !== e&& e.apply(this, arguments)|| this;
    t.duration = 0;
    return t;
  }
  t.prototype.onLoad = function() {
  }
;
  t.prototype.start = function() {
  }
;
  t.prototype.flip = function(e, t, o, n) {
    return new Promise(function(i) {
      var a = cc.tween, r = t/ 2, l = e.scale, s = l > 0? 20:- 20;
      a(e).parallel(a().to(r, {
        scaleX: 0
      }
, {
        easing: "quadIn"
      }
), a().to(r, {
        skewY:- s
      }
, {
        easing: "quadOut"
      }
)).call(function() {
        o&& o();
      }
).parallel(a().to(r, {
        scaleX:- l
      }
, {
        easing: "quadOut"
      }
), a().to(r, {
        skewY: 0
      }
, {
        easing: "quadIn"
      }
)).call(function() {
        n&& n();
        i();
      }
).start();
    }
);
  }
;
  a([s({
    tooltip: ""
  }
)], t.prototype, "duration", void 0);
  return a([l], t);
}
(cc.Component));
o.default = c;
cc._RF.pop();
