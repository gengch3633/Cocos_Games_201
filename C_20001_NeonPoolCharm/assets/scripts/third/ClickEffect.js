let e = require;
let t = module;
let o = exports;
"use strict";
cc._RF.push(t, "e0dc3RrexRI/oVUBI0n4Ywu", "ClickEffect");
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
var r = e("AudioManager.js"),
l = cc._decorator,
s = l.ccclass,
c = l.property,
u = function(e) {
  i(t, e);
  function t() {
    var t = null !== e&& e.apply(this, arguments)|| this;
    t.templateNode = null;
    t._nodePool = new cc.NodePool();
    return t;
  }
  t.prototype.onLoad = function() {
    cc.game.addPersistRootNode(this.node);
    this.node.on(cc.Node.EventType.TOUCH_START, this._onTouchStart, this);
    this.node._touchListener.setSwallowTouches(! 1);
  }
;
  t.prototype._onTouchStart = function(e) {
    var t,
    o = this,
    n = null !== (t = this._nodePool.get())&& void 0 !== t? t: cc.instantiate(this.templateNode);
    n.scale = 0;
    n.opacity = 255;
    n.setPosition(this.node.convertToNodeSpaceAR(e.getLocation()));
    n.setParent(this.node);
    cc.Tween.stopAllByTarget(n);
    cc.tween(n).to(.5, {
      scale: 1, opacity: 0
    }
).call(function() {
      return o._nodePool.put(n);
    }
).start();
    r.default.getInstance().playUIClick();
  }
;
  a([c(cc.Node)], t.prototype, "templateNode", void 0);
  return a([s], t);
}
(cc.Component);
o.default = u;
cc._RF.pop();
