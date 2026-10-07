let e = require;
let t = module;
let o = exports;
"use strict";
cc._RF.push(t, "9ca03dgg+ZM8KN39u1ECz5U", "JellyTween");
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
    t.frequency = 4;
    t.decay = 2;
    t.pressScale = .2;
    t.totalTime = 1;
    t.interval = 1;
    t.playOnLoad = ! 1;
    t.originalScale = 1;
    t.tween = null;
    return t;
  }
  t.prototype.play = function(e) {
    var t = this, o = null != e&& e > 0? e: 1e9, n = .2* this.totalTime, i = .15* this.totalTime, a = .65* this.totalTime, r = this.pressScale/ i;
    this.tween = cc.tween(this.node).repeat(o, cc.tween().to(n, {
      scaleX: this.originalScale+ this.pressScale, scaleY: this.originalScale- this.pressScale
    }
, {
      easing: "sineOut"
    }
).to(i, {
      scaleX: this.originalScale, scaleY: this.originalScale
    }
).to(a, {
      scaleX: {
        value: this.originalScale, progress: function(e, o, n, i) {
          return o- t.getDifference(r, i);
        }
      }
, scaleY: {
        value: this.originalScale, progress: function(e, o, n, i) {
          return o+ t.getDifference(r, i);
        }
      }
    }
).delay(this.interval)).start();
  }
;
  t.prototype.stop = function() {
    this.tween&& this.tween.stop();
    this.node.setScale(this.originalScale);
  }
;
  t.prototype.start = function() {
    this.originalScale = this.node.scale;
    this.playOnLoad&& this.play();
  }
;
  t.prototype.onLoad = function() {
  }
;
  t.prototype.getDifference = function(e, t) {
    var o = this.frequency* Math.PI* 2;
    return e*(Math.sin(t* o)/ Math.exp(this.decay* t)/ o);
  }
;
  a([s({
    tooltip: ""
  }
)], t.prototype, "frequency", void 0);
  a([s({
    tooltip: ""
  }
)], t.prototype, "decay", void 0);
  a([s({
    tooltip: ""
  }
)], t.prototype, "pressScale", void 0);
  a([s({
    tooltip: ""
  }
)], t.prototype, "totalTime", void 0);
  a([s({
    tooltip: ""
  }
)], t.prototype, "interval", void 0);
  a([s({
    tooltip: ""
  }
)], t.prototype, "playOnLoad", void 0);
  return a([l], t);
}
(cc.Component));
o.default = c;
cc._RF.pop();
