let e = require;
let t = module;
let o = exports;
"use strict";
cc._RF.push(t, "f300b8/RK1JVYUn9tSkCaP7", "RollingItemCtrl");
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
var r = e(rollingItem "
  }].js),
      l = cc._decorator,
      s = l.ccclass,
      c = l.menu;
    cc._decorator.property;
    var u = function (e) {
      i(t, e);
      function t() {
        var t = null !== e && e.apply(this, arguments) || this;
        t.ui = null;
        return t;
      }
      t.prototype.onLoad = function () {
        this.onUILoad();
        this.addButtonListen();
      };
      t.prototype.start = function () {};
      t.prototype.onUILoad = function () {
        this.ui = this.node.addComponent(r.default);
      };
      t.prototype.addButtonListen = function () {};
      t.prototype.initData = function () {};
      t.prefabUrl = " assets/ resources/ prefabs/ rollingItem ";
      t.className = " RollingItemCtrl ";
      return a([s, c(" UI/ prefabs/ RollingItemCtrl ")], t);
    }(cc.Component);
    o.default = u;
    cc._RF.pop();
