let e = require;
let t = module;
let a = exports;
"use strict";
cc._RF.push(t, "a8bfbweYoNNuaasfaTJJzpm", "NewHandScaler");
var n,
i = this&& this.__extends|| (n = function(e, t) {
  return(n = Object.setPrototypeOf|| {
    __proto__:[]
  }
  instanceof Array&& function(e, t) {
    e.__proto__ = t;
  }
|| function(e, t) {
    for(var a in t) Object.prototype.hasOwnProperty.call(t, a)&& (e[a] = t[a]);
  }
)(e, t);
}
, function(e, t) {
  n(e, t);
  function a() {
    this.constructor = e;
  }
  e.prototype = null === t? Object.create(t):(a.prototype = t.prototype, new a());
}
),
r = this&& this.__decorate|| function(e, t, a, n) {
  var i,
  r = arguments.length,
  o = r < 3? t: null === n? n = Object.getOwnPropertyDescriptor(t, a): n;
  if("object" == typeof Reflect&& "function" == typeof Reflect.decorate) o = Reflect.decorate(e, t, a, n);
  else for(var l = e.length- 1;
  l >= 0;
  l--)(i = e[l])&& (o = (r < 3? i(o): r > 3? i(t, a, o): i(t, a))|| o);
  return r > 3&& o&& Object.defineProperty(t, a, o),
  o;
}
;
Object.defineProperty(a, "__esModule", {
  value: ! 0
}
);
var o = cc._decorator,
l = o.ccclass,
s = o.executeInEditMode,
x = o.property,
c = function(e) {
  i(t, e);
  function t() {
    var t = null !== e&& e.apply(this, arguments)|| this;
    t._maxWidth = 0;
    t._maxHeight = 0;
    return t;
  }
  Object.defineProperty(t.prototype, "maxWidth", {
    get: function() {
      return this._maxWidth;
    }
, set: function(e) {
      if(e !== this._maxWidth) {
        this._maxWidth = e;
        this._updateScale();
      }
    }
, enumerable: ! 1, configurable: ! 0
  }
);
  Object.defineProperty(t.prototype, "maxHeight", {
    get: function() {
      return this._maxHeight;
    }
, set: function(e) {
      if(e !== this._maxHeight) {
        this._maxHeight = e;
        this._updateScale();
      }
    }
, enumerable: ! 1, configurable: ! 0
  }
);
  t.prototype._updateScale = function() {
    var e = this.node.getContentSize(),
    t = this._maxWidth > 0? this._maxWidth/ e.width: 1,
    a = this._maxHeight > 0? this._maxHeight/ e.height: 1;
    this.node.scale = Math.min(t, a);
  }
;
  t.prototype.onLoad = function() {
    this.node.on(cc.Node.EventType.SIZE_CHANGED, this._updateScale, this);
  }
;
  t.prototype.onDestroy = function() {
    this.node.off(cc.Node.EventType.SIZE_CHANGED, this._updateScale, this);
  }
;
  t.prototype.onEnable = function() {
    this._updateScale();
  }
;
  r([x], t.prototype, "maxWidth", null);
  r([x], t.prototype, "maxHeight", null);
  r([x], t.prototype, "_maxWidth", void 0);
  r([x], t.prototype, "_maxHeight", void 0);
  return r([l, s()], t);
}
(cc.Component);
a.default = c;
cc._RF.pop();
