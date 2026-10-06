let e = require;
let t = module;
let a = exports;
"use strict";
cc._RF.push(t, "e2e38Oq8vFDD7eacsPMPk2m", "Scaler");
var o,
n = this&& this.__extends|| (o = function(e, t) {
  return(o = Object.setPrototypeOf|| {
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
  o(e, t);
  function a() {
    this.constructor = e;
  }
  e.prototype = null === t? Object.create(t):(a.prototype = t.prototype, new a());
}
),
i = this&& this.__decorate|| function(e, t, a, o) {
  var n,
  i = arguments.length,
  r = i < 3? t: null === o? o = Object.getOwnPropertyDescriptor(t, a): o;
  if("object" == typeof Reflect&& "function" == typeof Reflect.decorate) r = Reflect.decorate(e, t, a, o);
  else for(var c = e.length- 1;
  c >= 0;
  c--)(n = e[c])&& (r = (i < 3? n(r): i > 3? n(t, a, r): n(t, a))|| r);
  return i > 3&& r&& Object.defineProperty(t, a, r),
  r;
}
;
Object.defineProperty(a, "__esModule", {
  value: ! 0
}
);
var r = cc._decorator,
c = r.ccclass,
s = r.executeInEditMode,
l = r.property,
u = function(e) {
  n(t, e);
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
  t.prototype.onEnable = function() {
    this._updateScale();
  }
;
  t.prototype.onDestroy = function() {
    this.node.off(cc.Node.EventType.SIZE_CHANGED, this._updateScale, this);
  }
;
  t.prototype.onLoad = function() {
    this.node.on(cc.Node.EventType.SIZE_CHANGED, this._updateScale, this);
  }
;
  i([l], t.prototype, "maxWidth", null);
  i([l], t.prototype, "maxHeight", null);
  i([l], t.prototype, "_maxWidth", void 0);
  i([l], t.prototype, "_maxHeight", void 0);
  return i([c, s()], t);
}
(cc.Component);
a.default = u;
cc._RF.pop();
