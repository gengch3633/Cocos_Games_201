let e = require;let t = module;let o = exports;
    "use strict";

    cc._RF.push(t, "c75d5LRNKdGBoAcWCqsrOFD", "TouchNodeCtrl");
    var n,
      i = this && this.__extends || (n = function (e, t) {
        return (n = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function (e, t) {
          e.__proto__ = t;
        } || function (e, t) {
          for (var o in t) Object.prototype.hasOwnProperty.call(t, o) && (e[o] = t[o]);
        })(e, t);
      }, function (e, t) {
        n(e, t);
        function o() {
          this.constructor = e;
        }
        e.prototype = null === t ? Object.create(t) : (o.prototype = t.prototype, new o());
      }),
      a = this && this.__decorate || function (e, t, o, n) {
        var i,
          a = arguments.length,
          r = a < 3 ? t : null === n ? n = Object.getOwnPropertyDescriptor(t, o) : n;
        if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) r = Reflect.decorate(e, t, o, n);else for (var l = e.length - 1; l >= 0; l--) (i = e[l]) && (r = (a < 3 ? i(r) : a > 3 ? i(t, o, r) : i(t, o)) || r);
        return a > 3 && r && Object.defineProperty(t, o, r), r;
      };
    Object.defineProperty(o, "__esModule", {
      value: !0
    });
    var r = e("EventMgr.js"),
      l = e("GameEventType.js"),
      s = e("TouchNode.js"),
      c = cc._decorator,
      u = c.ccclass,
      p = c.menu;
    cc._decorator.property;
    var d = function (e) {
      i(t, e);
      function t() {
        var t = null !== e && e.apply(this, arguments) || this;
        t.ui = null;
        return t;
      }
      t.prototype.initData = function () {};
      t.prototype.onUILoad = function () {
        this.ui = this.node.addComponent(s.default);
      };
      t.prototype.updateCheckGuide = function () {
        console.log("静置引导");
        r.default.trigger(l.default.CHECK_QUIET_GUIDE);
      };
      t.prototype.start = function () {
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchStart, this);
        this.node._touchListener.setSwallowTouches(!1);
      };
      t.prototype.onTouchStart = function () {
        console.log("onTouchStart 1111");
        this.unscheduleAllCallbacks();
        this.scheduleOnce(this.updateCheckGuide, 3);
      };
      t.prototype.onLoad = function () {
        this.onUILoad();
        this.addButtonListen();
        this.scheduleOnce(this.updateCheckGuide, 3);
      };
      t.prototype.addButtonListen = function () {};
      t.prefabUrl = "assets/resources/prefabs/TouchNode";
      t.className = "TouchNodeCtrl";
      return a([u, p("UI/prefabs/TouchNodeCtrl")], t);
    }(cc.Component);
    o.default = d;
    cc._RF.pop();
