let e = require;let t = module;let o = exports;
    "use strict";

    cc._RF.push(t, "f1975szbnxFQLTMwhqo7mUx", "EventMgr");
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
    var i = e("EventDispatcher.js"),
      a = cc._decorator.ccclass;
    cc._decorator.property;
    var r = function () {
      function e() {}
      e.ignoreAllByCaller = function (e) {
        this.dispatcher.offAllCaller(e);
      };
      e.listen = function (e, t, o, n) {
        this.dispatcher.off(e, o, t);
        this.dispatcher.on(e, o, t, n);
      };
      e.trigger = function (e, t) {
        this.dispatcher.event(e, t);
      };
      e.ignore = function (e, t, o) {
        this.dispatcher.off(e, o, t, !1);
      };
      e.ignoreAllByEvent = function (e) {
        this.dispatcher.offAll(e);
      };
      e.dispatcher = new i.default();
      return n([a], e);
    }();
    o.default = r;
    cc._RF.pop();
