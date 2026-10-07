let e = require;
let t = module;
let o = exports;
"use strict";
cc._RF.push(t, "3f3b10NlbJLwY5oaJ2EtPn/", "RoundRectMask");
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
o.RoundRectMask = void 0;
var r = cc._decorator,
l = r.property,
s = r.ccclass,
c = r.executeInEditMode,
u = r.disallowMultiple,
p = r.requireComponent,
d = r.menu;
cc.macro.ENABLE_WEBGL_ANTIALIAS = ! 0;
var _ = function(e) {
  i(t, e);
  function t() {
    var t = null !== e&& e.apply(this, arguments)|| this;
    t._radius = 50;
    t.mask = null;
    return t;
  }
  Object.defineProperty(t.prototype, "radius", {
    get: function() {
      return this._radius;
    }
, set: function(e) {
      this._radius = e;
      this.updateMask(e);
    }
, enumerable: ! 1, configurable: ! 0
  }
);
  t.prototype.onDraw = function(e) {
    e.clear(! 1);
    var t = this.node,
    o = t.width,
    n = t.height,
    i = - o* t.anchorX,
    a = - n* t.anchorY;
    e.roundRect(i, a, o, n, this.radius|| 0);
    cc.game.renderType === cc.game.RENDER_TYPE_CANVAS? e.stroke(): e.fill();
  }
;
  t.prototype.onLoad = function() {
    this.mask = this.getComponent(cc.Mask);
    this.updateMask(this.radius);
  }
;
  t.prototype.updateMask = function(e) {
    var t = e >= 0? e: 0;
    t < 1&& (t = Math.min(this.node.width, this.node.height)* t);
    this.mask.radius = t;
    this.mask.onDraw = this.onDraw.bind(this.mask);
    this.mask._updateGraphics = this._updateGraphics.bind(this.mask);
    this.mask.type = cc.Mask.Type.RECT;
  }
;
  t.prototype._updateGraphics = function() {
    var e = this._graphics;
    e&& this.onDraw(e);
  }
;
  a([l()], t.prototype, "_radius", void 0);
  a([l({
    tooltip: "圆角半径:\n0-1之间为最小边长比例值, \n>1为具体像素值"
  }
)], t.prototype, "radius", null);
  return a([s(), c(! 0), u(! 0), p(cc.Mask), d("渲染组件/圆角遮罩")], t);
}
(cc.Component);
o.RoundRectMask = _;
cc._RF.pop();
