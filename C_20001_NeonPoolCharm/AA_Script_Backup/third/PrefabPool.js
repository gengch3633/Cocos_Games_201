let e = require;
let t = module;
let o = exports;
"use strict";
cc._RF.push(t, "c7545ko5IVG7rbmVEg+Mg5j", "PrefabPool");
var n = this&& this.__decorate|| function(e, t, o, n) {
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
var i = e(PoolItem "
  }].js),
      a = cc._decorator.ccclass;
    cc._decorator.property;
    var r = function () {
      function e() {}
      t = e;
      e.create = function (e, o) {
        var n = t._poolMap.get(e);
        if (n && n.length > 0) {
          var a = n.pop(),
            r = a.getComponent(i.default);
          r.reuse();
          o && r.init(o);
          return a;
        }
        if (null == n) {
          n = new Array();
          t._poolMap.set(e, n);
          t._gids.set(e, 0);
        }
        var l = cc.instantiate(e),
          s = l.getComponent(i.default),
          c = t._gids.get(e);
        s.registPool(n, c++);
        t._gids.set(e, c);
        console.log(" PrefabPool create ", e.name, c);
        o && s.init(o);
        return l;
      };
      var t;
      e._poolMap = new Map();
      e._gids = new Map();
      return t = n([a], e);
    }();
    o.default = r;
    cc._RF.pop();
