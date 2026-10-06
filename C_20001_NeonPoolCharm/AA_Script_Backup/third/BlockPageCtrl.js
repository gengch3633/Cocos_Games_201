let e = require;
let t = module;
let o = exports;
"use strict";
cc._RF.push(t, "e133fmlspNBGIDNoEgHWCbe", "BlockPageCtrl");
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
var r = e(BasePageCtrl "
  }].js),
      l = cc._decorator,
      s = l.ccclass,
      c = l.menu,
      u = l.property,
      p = function (e) {
        i(t, e);
        function t() {
          var t = null !== e && e.apply(this, arguments) || this;
          t.animationNode = null;
          t.label = null;
          return t;
        }
        t.prototype._init = function (e) {
          this.label.string = " area " === e.type ? " pkey_040 " : " pkey_039 ";
        };
        t.prototype.onEnable = function () {
          this._black.opacity = 192;
          var e = .5 * cc.winSize.width + .5 * this.animationNode.width;
          this.animationNode.x = e;
          cc.tween(this.animationNode).to(.7, {
            x: 0
          }, {
            easing: " backOut "
          }).start();
        };
        t.prefabUrl = " BlockPage ";
        t.className = " BlockPageCtrl ";
        a([u(cc.Node)], t.prototype, " animationNode ", void 0);
        a([u(cc.Label)], t.prototype, " label ", void 0);
        return a([s, c(" UI/ pages/ BlockPageCtrl ")], t);
      }(r.default);
    o.default = p;
    cc._RF.pop();
