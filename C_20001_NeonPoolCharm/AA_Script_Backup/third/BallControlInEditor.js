let e = require;
let t = module;
let o = exports;
"use strict";
cc._RF.push(t, "41a31pcVG1KMKQ2ld25MrRz", "BallControlInEditor");
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
var r = e(BallLogicMgr "
  }].js),
      l = cc._decorator,
      s = l.ccclass,
      c = l.property,
      u = function (e) {
        i(t, e);
        function t() {
          var t = null !== e && e.apply(this, arguments) || this;
          t.ballID = 0;
          t.matIdx = null;
          t.deleteOne = null;
          t.startx = null;
          t.starty = null;
          t.ballType = null;
          t.posx = null;
          t.posy = null;
          t.node_editor = null;
          return t;
        }
        t.prototype.setMatIdx = function (e) {
          this.matIdx = e;
          var t = this.node.getChildByName(" New Sphere ").getComponent(cc.MeshRenderer),
            o = t.getMaterials();
          this.matIdx >= o.length && (this.matIdx = 0);
          var n = o[this.matIdx];
          t.setMaterial(0, n);
        };
        t.prototype.getMatIdx = function () {
          return this.matIdx;
        };
        t.prototype.onEnd = function () {
          console.log(" TOUCH_END ");
          var e = this.node;
          if (!this.checkAvailable(e)) {
            e.x = this.startx;
            e.y = this.starty;
            this.deleteOne(e);
            e.parent = null;
            e.destroy();
          }
        };
        t.prototype.checkAvailable = function (e) {
          var t = this.node.parent.getChildByName(" node_checkRect ");
          if (!cc.rect(-t.width / 2, -t.height / 2, t.width, t.height).contains(cc.v2(e.x, e.y))) {
            console.log(" not contains ");
            return !1;
          }
          return !0;
        };
        t.prototype.onStart = function () {
          console.log(" TOUCH_START ");
          var e = this.node;
          this.startx = Math.floor(e.x);
          this.starty = Math.floor(e.y);
        };
        t.prototype.onEnable = function () {};
        t.prototype.onCancel = function () {
          console.log(" TOUCH_CANCEL ");
          var e = this.node;
          if (!this.checkAvailable(e)) {
            e.x = this.startx;
            e.y = this.starty;
          }
        };
        t.prototype.onLoad = function () {
          this.ballID = this.ballID || 0;
          this.ballType = r.BallIDType_Normal;
          this.matIdx = this.matIdx || 0;
          this.deleteOne = this.deleteOne || null;
          this.posx = 0;
          this.posy = 0;
          this.node_editor = null;
          this.node;
          this.startx = 0;
          this.starty = 0;
        };
        t.prototype.onMove = function (e) {
          var t = this.node,
            o = cc.v2(e.touch._point.x, e.touch._point.y),
            n = t.parent.convertToNodeSpaceAR(o);
          t.x = Math.floor(n.x);
          t.y = Math.floor(n.y);
        };
        t.prototype.deleteFun = function (e) {
          this.deleteOne = e;
        };
        t.prototype.update = function () {};
        a([c], t.prototype, " ballID ", void 0);
        return a([s], t);
      }(cc.Component);
    o.default = u;
    cc._RF.pop();
