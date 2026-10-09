let e = require;let t = module;let o = exports;
    "use strict";

    cc._RF.push(t, "923e9yltu9CBpVXfUS6hUZO", "PoolManager");
    var n = this && this.__decorate || function (e, t, o, n) {
      var i,
        a = arguments.length,
        r = a < 3 ? t : null === n ? n = Object.getOwnPropertyDescriptor(t, o) : n;
      if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) r = Reflect.decorate(e, t, o, n);else for (var l = e.length - 1; l >= 0; l--) (i = e[l]) && (r = (a < 3 ? i(r) : a > 3 ? i(t, o, r) : i(t, o)) || r);
      return a > 3 && r && Object.defineProperty(t, o, r), r;
    };
    Object.defineProperty(o, "__esModule", {
      value: !0
    });
    var i = cc._decorator.ccclass;
    cc._decorator.property;
    var a = function () {
      function e() {}
      e.initPool = function (e, t, o) {
        e = new cc.NodePool();
        for (var n = 0; n < t; n++) {
          var i = cc.instantiate(o);
          e.put(i);
        }
      };
      e.createItemByPool = function (e, t) {
        return e.size() > 0 ? e.get() : cc.instantiate(t);
      };
      e.recycleToPool = function (e, t) {
        e.put(t);
      };
      return n([i], e);
    }();
    o.default = a;
    cc._RF.pop();
